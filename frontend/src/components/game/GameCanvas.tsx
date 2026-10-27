import { forwardRef } from 'react';

export const GameCanvas = forwardRef<HTMLCanvasElement>(function GameCanvas(_, ref) {
  return (
    <canvas
      ref={ref}
      id="game-canvas"
      width={960}
      height={500}
      aria-label="Cena jogável. Use WASD ou setas para andar; E para conversar com NPCs."
    />
  );
});
