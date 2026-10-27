import { useGameStoreSelector } from '../../hooks/useGameStore';

interface DialoguePanelProps {
  onClose: () => void;
}

export function DialoguePanel({ onClose }: DialoguePanelProps) {
  const open = useGameStoreSelector((state) => state.dialogueOpen);
  const dialogue = useGameStoreSelector((state) => state.dialogue);

  return (
    <section className={`dialogue-panel panel-frame ${open ? 'is-open' : ''}`} id="dialogue-panel" aria-live="polite">
      <div className="npc-seal" id="npc-seal">
        {dialogue?.icon ?? '⚓'}
      </div>
      <div>
        <p className="eyebrow" id="dialogue-name">
          {dialogue?.name ?? 'Mestre do Porto'}
        </p>
        <p id="dialogue-text" dangerouslySetInnerHTML={{ __html: dialogue?.text ?? 'Bem-vindo, capitão.' }} />
      </div>
      <button className="dialogue-close" type="button" id="dialogue-close" aria-label="Fechar conversa" onClick={onClose}>
        ×
      </button>
    </section>
  );
}
