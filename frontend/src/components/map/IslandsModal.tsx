import { useEffect, useRef } from 'react';
import { useGameStoreSelector } from '../../hooks/useGameStore';

interface IslandsModalProps {
  onClose: () => void;
}

export function IslandsModal({ onClose }: IslandsModalProps) {
  const open = useGameStoreSelector((state) => state.islandsOpen);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="island-modal"
      id="islands-modal"
      aria-labelledby="islands-modal-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <header className="modal-header">
        <div>
          <p className="eyebrow">Rotas iniciais</p>
          <h2 id="islands-modal-title">Escolha uma ilha</h2>
        </div>
        <button className="dialogue-close" type="button" id="close-islands" aria-label="Fechar lista de ilhas" onClick={onClose}>
          ×
        </button>
      </header>
      <div className="island-modal-list" id="island-modal-list" />
    </dialog>
  );
}
