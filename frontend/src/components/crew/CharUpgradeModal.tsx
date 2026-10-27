import { useEffect, useRef } from 'react';
import { useGameStoreSelector } from '../../hooks/useGameStore';

interface CharUpgradeModalProps {
  onClose: () => void;
}

export function CharUpgradeModal({ onClose }: CharUpgradeModalProps) {
  const open = useGameStoreSelector((state) => state.upgradeOpen);
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
      className="char-upgrade-modal"
      id="char-upgrade-modal"
      aria-labelledby="char-upgrade-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div id="char-upgrade-content" />
    </dialog>
  );
}
