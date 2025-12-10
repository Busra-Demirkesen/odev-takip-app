import { Edit3, Trash2 } from "lucide-react";
import type { Student } from "@/types/student";

type StudentTableProps = {
  students: Student[];
  onEdit?: (student: Student) => void;
  onDelete?: (student: Student) => void;
};

export function StudentTable({ students, onEdit, onDelete }: StudentTableProps) {
  const sortedStudents = [...students].sort((a, b) => {
    const parseClass = (value: string) => {
      const match = value?.match(/^(\d+)\s*-?\s*([A-Za-zÇĞİÖŞÜçğıöşü])?/);
      const grade = match?.[1] ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
      const section = (match?.[2] ?? "Z").toUpperCase();
      return { grade, section };
    };

    const aClass = parseClass(a.className);
    const bClass = parseClass(b.className);

    if (aClass.grade !== bClass.grade) return aClass.grade - bClass.grade;
    if (aClass.section !== bClass.section) return aClass.section.localeCompare(bClass.section);
    return a.name.localeCompare(b.name, "tr");
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-[0.9fr_1.8fr_1fr_1.1fr_0.8fr] px-6 py-3 text-sm font-semibold text-gray-600 border-b border-gray-100">
            <div>Sınıf</div>
            <div>Ad-Soyad</div>
            <div>Okul No</div>
            <div>Aldığı ders saati</div>
            <div className="text-right pr-2">İşlemler</div>
          </div>

          <div className="divide-y divide-gray-100">
            {sortedStudents.map((student) => (
              <div
                key={student.id ?? student.email}
                className="grid grid-cols-[0.9fr_1.8fr_1fr_1.1fr_0.8fr] items-center px-6 py-3 text-sm text-gray-800"
              >
                <div className="text-gray-900 font-semibold">{student.className}</div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-gray-900">{student.name}</span>
                  <span className="text-xs text-gray-500">{student.email}</span>
                </div>
                <div className="text-gray-800 font-medium">{student.studentNumber ?? "—"}</div>
                <div className="text-gray-800">{student.courseCount} ders</div>
                <div className="flex justify-end gap-3 pr-2 text-gray-500">
                  <button
                    type="button"
                    onClick={() => onEdit?.(student)}
                    className="p-2 rounded-lg hover:bg-gray-100 hover:text-[#2196F3] transition-colors"
                    aria-label="Duzenle"
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
