import { useEffect, useRef } from 'react';
import { useGameStoreSelector } from '../../hooks/useGameStore';

interface InventoryModalProps {
  onClose: () => void;
}

/** Dialog host; conteúdo é renderizado pelo painel/controller no #inventory-content. */
export function InventoryModal({ onClose }: InventoryModalProps) {
  const open = useGameStoreSelector((state) => state.inventoryOpen);
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
      className="inventory-modal"
      id="inventory-modal"
      aria-labelledby="inventory-modal-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div id="inventory-content" />
    </dialog>
  );
}
