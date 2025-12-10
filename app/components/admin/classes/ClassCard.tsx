"use client";

import { useState } from "react";
import { Edit3, Trash2, Users, BookOpen, Plus, X } from "lucide-react";
import type { ClassItem } from "@/types/class";

type ClassCardProps = {
  classItem: ClassItem;
  onEdit?: (classItem: ClassItem) => void;
  onDelete?: (classItem: ClassItem) => void;
  onAddLesson?: (classItem: ClassItem) => void;
  onAddStudent?: (classItem: ClassItem) => void;
  onEditLesson?: (classItem: ClassItem, lessonIndex: number) => void;
  onDeleteLesson?: (classItem: ClassItem, lessonIndex: number) => void;
};

export function ClassCard({
  classItem,
  onEdit,
  onDelete,
  onAddLesson,
  onAddStudent,
  onEditLesson,
  onDeleteLesson,
}: ClassCardProps) {
  const [isLessonsModalOpen, setIsLessonsModalOpen] = useState(false);
  const MAX_VISIBLE_LESSONS = 2;
  const visibleSubjects = classItem.subjects.slice(0, MAX_VISIBLE_LESSONS);
  const remainingCount = Math.max(0, classItem.subjects.length - visibleSubjects.length);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="bg-[#0d8af0] text-white px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold">{classItem.name}</p>
              <div className="mt-2 flex items-center gap-3 text-sm">
                <span className="px-3 py-1 bg-white/15 rounded-full">{classItem.gradeLabel}</span>
                <span className="flex items-center gap-1">
                  <Users size={16} />
                  {classItem.studentCount} Öğrenci
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen size={16} />
                  {classItem.lessonCount} ders
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <button
                type="button"
                onClick={() => onEdit?.(classItem)}
                className="p-2 rounded-lg hover:bg-white/15 transition-colors"
                aria-label="Düzenle"
              >
                <Edit3 size={18} />
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(classItem)}
                className="p-2 rounded-lg hover:bg-white/15 transition-colors"
                aria-label="Sil"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">Dersler</p>
            <div className="space-y-3">
              {visibleSubjects.map((subject, idx) => (
                <div
                  key={`${subject.name}-${idx}`}
                  className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{subject.name}</p>
                    <p className="text-xs text-gray-600">
                      {subject.teacher}
                      {subject.hours ? ` • ${subject.hours} saat` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <button
                      type="button"
                      onClick={() => onEditLesson?.(classItem, idx)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      aria-label="Düzenle"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteLesson?.(classItem, idx)}
                      className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                      aria-label="Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {classItem.subjects.length > MAX_VISIBLE_LESSONS ? (
              <button
                type="button"
                onClick={() => setIsLessonsModalOpen(true)}
                className="mt-3 text-xs font-semibold text-[#0d8af0] hover:text-[#0c79d2] transition-colors"
              >
                Tümünü gör
              </button>
            ) : null}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <button
              type="button"
              onClick={() => onAddLesson?.(classItem)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#0d8af0] text-white py-2 text-sm font-semibold hover:bg-[#0c79d2] transition-colors"
            >
              <Plus size={18} />
              Ders Ekle
            </button>
            <button
              type="button"
              onClick={() => onAddStudent?.(classItem)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#16a34a] text-white py-2 text-sm font-semibold hover:bg-[#138a3f] transition-colors"
            >
              <Users size={18} />
              Öğrenci
            </button>
          </div>
        </div>
      </div>

      {isLessonsModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsLessonsModalOpen(false)} aria-hidden />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl mx-4 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Dersler</h3>
                <p className="text-sm text-gray-600">
                  {classItem.name} - {classItem.gradeLabel}
                </p>
              </div>
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700"
                onClick={() => setIsLessonsModalOpen(false)}
                aria-label="Kapat"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {classItem.subjects.map((subject, idx) => (
                <div
                  key={`${subject.name}-full-${idx}`}
                  className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{subject.name}</p>
                    <p className="text-xs text-gray-600">
                      {subject.teacher}
                      {subject.hours ? ` • ${subject.hours} saat` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLessonsModalOpen(false);
                        onEditLesson?.(classItem, idx);
                      }}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      aria-label="Düzenle"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsLessonsModalOpen(false);
                        onDeleteLesson?.(classItem, idx);
                      }}
                      className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                      aria-label="Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
