"use client";

import { X } from "lucide-react";

type LessonInfo = {
  className: string;
  gradeLabel?: string;
  subjects: { name: string; teacher?: string; hours?: number }[];
};

type TeacherLessonsModalProps = {
  open: boolean;
  onClose: () => void;
  teacherName?: string;
  lessons: LessonInfo[];
  summary?: {
    classCount: number;
    totalHours: number;
  };
};

export function TeacherLessonsModal({ open, onClose, teacherName, lessons, summary }: TeacherLessonsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Ders Detayları</h2>
            {teacherName ? <p className="text-sm text-gray-600">{teacherName}</p> : null}
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

        {summary ? (
          <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-[#f5f8ff] text-[#1d4ed8] px-3 py-2 font-semibold">
              {summary.classCount} sınıf
            </div>
            <div className="rounded-xl bg-[#f5f8ff] text-[#1d4ed8] px-3 py-2 font-semibold">
              {summary.totalHours} saat
            </div>
          </div>
        ) : null}

        {lessons.length === 0 ? (
          <p className="text-sm text-gray-600">Bu öğretmenin atandığı ders bulunmuyor.</p>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {lessons.map((lesson) => (
              <div
                key={lesson.className}
                className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <p className="text-sm font-semibold text-gray-900">{lesson.className}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {lesson.subjects.map((subject, idx) => (
                    <span
                      key={`${subject.name}-${idx}`}
                      className="px-3 py-1 text-xs rounded-md bg-white border border-gray-200 text-gray-800"
                      title={subject.teacher ? `Öğretmen: ${subject.teacher}` : undefined}
                    >
                      {subject.name}
                      {subject.hours ? ` • ${subject.hours} saat` : ""}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
