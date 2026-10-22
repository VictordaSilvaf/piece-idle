import { cpSync, createReadStream, existsSync, statSync } from 'node:fs';
import { extname, normalize, resolve, sep } from 'node:path';
import { defineConfig } from 'vite';

const assetDirectory = resolve('assets');
const mimeTypes = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.json': 'application/json' };

export default defineConfig({
  // Alguns packs de arte chegam como somente leitura; preservamos a pasta de
  // saída entre builds para o Vite não tentar apagá-los antes de copiá-los.
  build: { emptyOutDir: false },
  plugins: [{
    name: 'copy-game-assets',
    configureServer(server) {
      server.middlewares.use('/assets', (request, response, next) => {
        const relativePath = normalize(decodeURIComponent(request.url || '')).replace(/^[/\\]+/, '');
        const filePath = resolve(assetDirectory, relativePath);
        if (!filePath.startsWith(`${assetDirectory}${sep}`) || !existsSync(filePath) || !statSync(filePath).isFile()) return next();
        response.setHeader('Content-Type', mimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream');
        createReadStream(filePath).pipe(response);
      });
    },
    closeBundle() {
      // Os assets fornecidos podem ter arquivos de origem sem permissão de escrita.
      // Não sobrescrever o que já foi emitido torna builds repetidos seguros.
      if (existsSync('assets')) cpSync('assets', 'dist/assets', { recursive: true, force: false, errorOnExist: false });
    },
  }],
});
