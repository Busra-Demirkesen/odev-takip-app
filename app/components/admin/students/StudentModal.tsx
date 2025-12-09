"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";

type StudentFormData = { name: string; email: string; className: string };

type StudentModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => void | Promise<void>;
  classOptions?: string[];
  initialData?: StudentFormData;
  title?: string;
  isSaving?: boolean;
};

const DEFAULT_CLASSES = ["9-A", "9-B", "10-A", "10-B", "11-A", "11-B"];

export function StudentModal({
  open,
  onClose,
  onSubmit,
  classOptions = DEFAULT_CLASSES,
  initialData,
  title = "Yeni Ogrenci Ekle",
  isSaving = false,
}: StudentModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [className, setClassName] = useState(classOptions[0] || "");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setClassName(initialData.className);
    } else {
      setName("");
      setEmail("");
      setClassName(classOptions[0] || "");
    }
  }, [initialData, classOptions]);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit({ name, email, className });
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
            <label className="text-sm text-gray-700" htmlFor="student-name">
              Ogrenci Adi
            </label>
            <input
              id="student-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Orn: Ayse Kaya"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700" htmlFor="student-email">
              E-posta
            </label>
            <input
              id="student-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ayse.kaya@ogrenci.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700" htmlFor="student-class">
              Sinif
            </label>
            <select
              id="student-class"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent bg-white"
              required
            >
              {classOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
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
