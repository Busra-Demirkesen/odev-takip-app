"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type { ClassItem } from "@/types/class";

type ClassFormData = {
  name: string;
  gradeLabel: string;
};

type ClassModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ClassFormData, classId?: string) => void | Promise<void>;
  isSaving?: boolean;
  classId?: string;
  initialData?: ClassItem;
  title?: string;
};

export function ClassModal({
  open,
  onClose,
  onSubmit,
  isSaving = false,
  classId,
  initialData,
  title = "Yeni Sinif Ekle",
}: ClassModalProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [gradeLabel, setGradeLabel] = useState(initialData?.gradeLabel ?? "");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setGradeLabel(initialData.gradeLabel);
    } else {
      setName("");
      setGradeLabel("");
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit({ name, gradeLabel }, classId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Kapat"
          >
            <X size={20} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-gray-700" htmlFor="class-name">
              Sinif adi
            </label>
            <input
              id="class-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Orn: 9-A"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700" htmlFor="class-grade">
              Seviye
            </label>
            <input
              id="class-grade"
              type="text"
              value={gradeLabel}
              onChange={(e) => setGradeLabel(e.target.value)}
              placeholder="Orn: 9. Sinif"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end sm:gap-3 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
              disabled={isSaving}
            >
              Iptal
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[#2196F3] text-white text-sm font-medium hover:bg-[#1976D2] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              {isSaving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
