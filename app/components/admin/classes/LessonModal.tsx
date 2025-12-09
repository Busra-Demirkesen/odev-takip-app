"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";

type LessonFormData = {
  subjectName: string;
  teacherId: string;
  hours: number;
};

type LessonModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LessonFormData) => void | Promise<void>;
  isSaving?: boolean;
  classLabel?: string;
  teacherOptions: { id: string; name: string }[];
  initialData?: Partial<LessonFormData>;
  title?: string;
  submitLabel?: string;
};

export function LessonModal({
  open,
  onClose,
  onSubmit,
  isSaving = false,
  classLabel,
  teacherOptions,
  initialData,
  title = "Ders Ekle",
  submitLabel,
}: LessonModalProps) {
  const [subjectName, setSubjectName] = useState(initialData?.subjectName ?? "");
  const [teacherId, setTeacherId] = useState(initialData?.teacherId ?? "");
  const [hours, setHours] = useState(initialData?.hours ?? 1);

  useEffect(() => {
    if (!open) return;
    setSubjectName(initialData?.subjectName ?? "");
    setTeacherId(initialData?.teacherId ?? teacherOptions[0]?.id ?? "");
    setHours(initialData?.hours ?? 1);
  }, [open, initialData, teacherOptions]);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!teacherId) return;
    await onSubmit({ subjectName, teacherId, hours });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {classLabel ? <p className="text-sm text-gray-500">{classLabel}</p> : null}
          </div>
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
            <label className="text-sm text-gray-700" htmlFor="lesson-name">
              Ders adı
            </label>
            <input
              id="lesson-name"
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Örn: Matematik"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700" htmlFor="lesson-teacher">
              Öğretmen
            </label>
            <select
              id="lesson-teacher"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent bg-white"
              disabled={!teacherOptions.length}
              required
            >
              {teacherOptions.length === 0 ? (
                <option value="">Öğretmen bulunamadı</option>
              ) : (
                teacherOptions.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700" htmlFor="lesson-hours">
              Ders saati (haftalık)
            </label>
            <input
              id="lesson-hours"
              type="number"
              min={1}
              value={hours}
              onChange={(e) => {
                const val = Number(e.target.value);
                setHours(Number.isNaN(val) ? 1 : Math.max(1, val));
              }}
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
              İptal
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[#2196F3] text-white text-sm font-medium hover:bg-[#1976D2] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              {isSaving ? "Kaydediliyor..." : submitLabel ?? "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
