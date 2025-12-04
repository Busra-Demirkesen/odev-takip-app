"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";

type TeacherModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; subjects: string }) => void;
};

export function TeacherModal({ open, onClose, onSubmit }: TeacherModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subjects, setSubjects] = useState("");

  if (!open) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ name, email, subjects });
    onClose();
    setName("");
    setEmail("");
    setSubjects("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Yeni Öğretmen Ekle</h2>
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
            <label className="text-sm text-gray-700" htmlFor="teacher-name">
              Öğretmen Adı
            </label>
            <input
              id="teacher-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Ahmet Yılmaz"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700" htmlFor="teacher-email">
              E-posta
            </label>
            <input
              id="teacher-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ahmet.yilmaz@ogretmen.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700" htmlFor="teacher-subjects">
              Branş
            </label>
            <input
              id="teacher-subjects"
              type="text"
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
              placeholder="Örn: Matematik, Fizik, Türkçe"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end sm:gap-3 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[#2196F3] text-white text-sm font-medium hover:bg-[#1976D2] transition-colors"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
