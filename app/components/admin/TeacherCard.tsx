import { Edit3, Trash2, BookOpen, School } from "lucide-react";

export type Teacher = {
  name: string;
  email: string;
  mainSubject: string;
  lessonCount: number;
  classCount: number;
  subjects: string[];
};

type TeacherCardProps = {
  teacher: Teacher;
  onEdit?: (teacher: Teacher) => void;
  onDelete?: (teacher: Teacher) => void;
};

export function TeacherCard({ teacher, onEdit, onDelete }: TeacherCardProps) {
  const initial = teacher.name.charAt(0).toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-[#e8f3ff] text-[#2196F3] flex items-center justify-center text-lg font-semibold">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">{teacher.name}</p>
          <p className="text-sm text-gray-500 truncate">{teacher.email}</p>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <button
            type="button"
            onClick={() => onEdit?.(teacher)}
            className="p-2 rounded-lg hover:bg-gray-100 hover:text-[#2196F3] transition-colors"
            aria-label="Düzenle"
          >
            <Edit3 size={18} />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(teacher)}
            className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
            aria-label="Sil"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#f3e8ff] text-[#a855f7] text-xs font-semibold">
          {teacher.mainSubject}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-[#2196F3]" />
          <span>{teacher.lessonCount} ders</span>
        </div>
        <div className="flex items-center gap-2">
          <School size={18} className="text-[#2196F3]" />
          <span>{teacher.classCount} sınıf</span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-500 mb-2">Verdiği Dersler</p>
        <div className="flex flex-wrap gap-2">
          {teacher.subjects.map((subject, idx) => (
            <span
              key={`${subject}-${idx}`}
              className="px-3 py-1 text-xs rounded-md bg-[#e8f3ff] text-[#2196F3] font-semibold"
            >
              {subject}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
