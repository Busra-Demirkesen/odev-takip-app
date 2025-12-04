// app/dashboard/admin/teachers/page.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { TeacherCard, type Teacher } from "@/components/admin/TeacherCard";
import { TeacherModal } from "@/components/admin/TeacherModal";

const initialTeachers: Teacher[] = [
  {
    name: "Yasemin Bahtiyar",
    email: "yasemin.bahtiyar@ogretmen.com",
    mainSubject: "Matematik",
    lessonCount: 3,
    classCount: 3,
    subjects: ["Matematik", "Kimya", "Matematik"],
  },
  {
    name: "Mehmet Demir",
    email: "mehmet.demir@ogretmen.com",
    mainSubject: "Fizik",
    lessonCount: 2,
    classCount: 2,
    subjects: ["Fizik", "Türkçe"],
  },
];

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTeacher = (data: { name: string; email: string; subjects: string }) => {
    const parsedSubjects = data.subjects
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const newTeacher: Teacher = {
      name: data.name,
      email: data.email,
      mainSubject: parsedSubjects[0] || "Branş",
      lessonCount: Math.max(parsedSubjects.length, 1),
      classCount: 1,
      subjects: parsedSubjects.length ? parsedSubjects : ["Branş"],
    };

    setTeachers((prev) => [...prev, newTeacher]);
  };

  return (
    <AdminShell activeSection="teachers">
      <SectionHeader
        title="Öğretmen Yönetimi"
        subtitle="Öğretmenleri görüntüle ve yönet"
        action={
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2196F3] text-white text-sm font-medium hover:bg-[#1976D2] transition-colors"
          >
            <Plus size={18} />
            Öğretmen Ekle
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {teachers.map((teacher) => (
          <TeacherCard
            key={teacher.email}
            teacher={teacher}
            onEdit={(t) => console.log("edit teacher", t)}
            onDelete={(t) => console.log("delete teacher", t)}
          />
        ))}
      </div>

      <TeacherModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTeacher}
      />
    </AdminShell>
  );
}
