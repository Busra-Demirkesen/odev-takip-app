
"use client";

import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { StudentTable, type Student } from "@/components/admin/StudentTable";

const mockStudents: Student[] = [
  { name: "Ali Öztürk", email: "ali.ozturk@ogrenci.com", className: "9-A", courseCount: 2 },
  { name: "Zeynep Kaya", email: "zeynep.kaya@ogrenci.com", className: "9-A", courseCount: 2 },
  { name: "Ahmet Çelik", email: "ahmet.celik@ogrenci.com", className: "10-B", courseCount: 1 },
  { name: "Elif Demir", email: "elif.demir@ogrenci.com", className: "11-B", courseCount: 2 },
  { name: "Can Yılmaz", email: "can.yilmaz@ogrenci.com", className: "11-B", courseCount: 2 },
];

export default function AdminStudentsPage() {
  return (
    <AdminShell activeSection="students">
      <SectionHeader
        title="Öğrenci Yönetimi"
        subtitle="Öğrencileri görüntüle ve yönet"
        action={
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2196F3] text-white text-sm font-medium hover:bg-[#1976D2] transition-colors">
            <Plus size={18} />
            Öğrenci Ekle
          </button>
        }
      />

      <StudentTable
        students={mockStudents}
        onEdit={(student) => console.log("edit", student)}
        onDelete={(student) => console.log("delete", student)}
      />
    </AdminShell>
  );
}
