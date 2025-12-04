import { Edit3, Trash2 } from "lucide-react";

export type Student = {
  name: string;
  email: string;
  className: string;
  courseCount: number;
};

type StudentTableProps = {
  students: Student[];
  onEdit?: (student: Student) => void;
  onDelete?: (student: Student) => void;
};

export function StudentTable({ students, onEdit, onDelete }: StudentTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[2.2fr,2.2fr,1fr,1fr,1fr] px-6 py-3 text-sm font-semibold text-gray-600 border-b border-gray-100">
            <div>Öğrenci Adı</div>
            <div>E-posta</div>
            <div>Sınıf</div>
            <div>Ders Sayısı</div>
            <div className="text-right pr-2">İşlemler</div>
          </div>

          <div className="divide-y divide-gray-100">
            {students.map((student) => (
              <div
                key={student.email}
                className="grid grid-cols-[2.2fr,2.2fr,1fr,1fr,1fr] items-center px-6 py-4 text-sm text-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#e8f3ff] text-[#2196F3] flex items-center justify-center font-semibold">
                    {student.name.charAt(0)}
                  </div>
                  <span className="font-medium">{student.name}</span>
                </div>
                <div className="text-gray-600">{student.email}</div>
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#e8f3ff] text-[#2196F3] font-semibold">
                    {student.className}
                  </span>
                </div>
                <div className="text-gray-700">{student.courseCount} ders</div>
                <div className="flex justify-end gap-3 pr-2 text-gray-500">
                  <button
                    type="button"
                    onClick={() => onEdit?.(student)}
                    className="p-2 rounded-lg hover:bg-gray-100 hover:text-[#2196F3] transition-colors"
                    aria-label="Düzenle"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete?.(student)}
                    className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                    aria-label="Sil"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
