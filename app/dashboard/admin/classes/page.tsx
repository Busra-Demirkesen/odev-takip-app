// app/dashboard/admin/classes/page.tsx
"use client";

import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { ClassCard, type ClassItem } from "@/components/admin/ClassCard";

const classesMock: ClassItem[] = [
  {
    name: "9-A",
    gradeLabel: "9. Sınıf",
    studentCount: 2,
    lessonCount: 2,
    subjects: [
      { name: "Matematik", teacher: "Yasemin Bahtiyar" },
      { name: "Fizik", teacher: "Mehmet Demir" },
    ],
  },
  {
    name: "10-B",
    gradeLabel: "10. Sınıf",
    studentCount: 1,
    lessonCount: 1,
    subjects: [{ name: "Kimya", teacher: "Yasemin Bahtiyar" }],
  },
  {
    name: "11-B",
    gradeLabel: "11. Sınıf",
    studentCount: 2,
    lessonCount: 2,
    subjects: [
      { name: "Matematik", teacher: "Yasemin Bahtiyar" },
      { name: "Türkçe", teacher: "Mehmet Demir" },
    ],
  },
];

export default function AdminClassesPage() {
  return (
    <AdminShell activeSection="classes">
      <SectionHeader
        title="Sınıf Yönetimi"
        subtitle="Sınıfları görüntüle ve düzenle"
        action={
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2196F3] text-white text-sm font-medium hover:bg-[#1976D2] transition-colors">
            <Plus size={18} />
            Sınıf Ekle
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {classesMock.map((classItem) => (
          <ClassCard
            key={classItem.name}
            classItem={classItem}
            onEdit={(c) => console.log("edit class", c)}
            onDelete={(c) => console.log("delete class", c)}
            onAddLesson={(c) => console.log("add lesson", c)}
            onAddStudent={(c) => console.log("add student", c)}
          />
        ))}
      </div>
    </AdminShell>
  );
}
