"use client";

import { Trash2, X } from "lucide-react";

type DeleteConfirmModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  itemLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
};

export function DeleteConfirmModal({
  open,
  title = "Silme Onayı",
  description = "Silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
  itemLabel,
  onCancel,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} aria-hidden />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-12 w-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
            <Trash2 size={24} />
          </div>
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700"
            onClick={onCancel}
            aria-label="Kapat"
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-700 mb-6">
          {itemLabel ? <span className="font-semibold">{itemLabel}</span> : null} {description}
        </p>

        <div className="flex flex-col sm:flex-row sm:justify-end sm:gap-3 gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="w-full sm:w-auto px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-60"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto px-5 py-3 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {isDeleting ? "Siliniyor..." : "Sil"}
          </button>
        </div>
      </div>
    </div>
  );
}
