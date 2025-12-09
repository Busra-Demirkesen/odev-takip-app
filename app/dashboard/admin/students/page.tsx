// app/dashboard/admin/students/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { AdminShell } from "@/components/admin/shared/AdminShell";
import { SectionHeader } from "@/components/admin/shared/SectionHeader";
import { DeleteConfirmModal } from "@/components/admin/shared/DeleteConfirmModal";
import { StudentModal } from "@/components/admin/students/StudentModal";
import { StudentTable } from "@/components/admin/students/StudentTable";
import { db } from "@/lib/firebase";
import type { Student } from "@/types/student";

type StudentForm = { name: string; email: string; className: string };

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const studentsRef = collection(db, "students");
    const q = query(studentsRef, orderBy("name"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data: Student[] = snapshot.docs.map((d) => {
        const docData = d.data() as Omit<Student, "id">;
        return {
          id: d.id,
          name: docData.name,
          email: docData.email,
          className: docData.className,
          courseCount: docData.courseCount ?? 0,
        };
      });
      setStudents(data);
    });
    return () => unsub();
  }, []);

  const handleSaveStudent = async (data: StudentForm, studentId?: string) => {
    const payload: Omit<Student, "id"> = {
      name: data.name,
      email: data.email,
      className: data.className,
      courseCount: editingStudent?.courseCount ?? 0,
    };

    try {
      setIsSaving(true);
      if (studentId) {
        await updateDoc(doc(db, "students", studentId), payload);
      } else {
        await addDoc(collection(db, "students"), payload);
      }
      setIsModalOpen(false);
      setEditingStudent(null);
    } catch (err) {
      console.error("Ogrenci kaydedilemedi", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!pendingDelete?.id) return;
    try {
      setIsDeleting(true);
      await deleteDoc(doc(db, "students", pendingDelete.id));
      setPendingDelete(null);
    } catch (err) {
      console.error("Ogrenci silinemedi", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminShell activeSection="students">
      <SectionHeader
        title="Ogrenci Yonetimi"
        subtitle="Ogrencileri goruntule ve yonet"
        action={
          <button
            type="button"
            onClick={() => {
              setEditingStudent(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2196F3] text-white text-sm font-medium hover:bg-[#1976D2] transition-colors"
          >
            <Plus size={18} />
            Ogrenci Ekle
          </button>
        }
      />

      <StudentTable
        students={students}
        onEdit={(student) => {
          setEditingStudent(student);
          setIsModalOpen(true);
        }}
        onDelete={(student) => setPendingDelete(student)}
      />

      <StudentModal
        key={editingStudent?.id ?? "new-student"}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={(data) => handleSaveStudent(data, editingStudent?.id)}
        initialData={
          editingStudent
            ? {
                name: editingStudent.name,
                email: editingStudent.email,
                className: editingStudent.className,
              }
            : undefined
        }
        title={editingStudent ? "Ogrenciyi Duzenle" : "Yeni Ogrenci Ekle"}
        isSaving={isSaving}
      />

      <DeleteConfirmModal
        open={Boolean(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDeleteStudent}
        isDeleting={isDeleting}
        itemLabel={pendingDelete?.name}
        title="Silme Onayi"
        description="Bu ogrenciyi silmek istediginizden emin misiniz? Bu islem geri alinamaz."
      />
    </AdminShell>
  );
}
