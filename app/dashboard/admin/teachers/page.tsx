// app/dashboard/admin/teachers/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { AdminShell } from "@/components/admin/shared/AdminShell";
import { SectionHeader } from "@/components/admin/shared/SectionHeader";
import { DeleteConfirmModal } from "@/components/admin/shared/DeleteConfirmModal";
import { TeacherCard } from "@/components/admin/teachers/TeacherCard";
import { TeacherModal } from "@/components/admin/teachers/TeacherModal";
import { db } from "@/lib/firebase";
import type { Teacher } from "@/types/teacher";

type TeacherForm = { name: string; email: string; subjects: string };

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Teacher | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const teachersRef = collection(db, "teachers");
    const q = query(teachersRef, orderBy("name"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data: Teacher[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Teacher, "id">),
      }));
      setTeachers(data);
    });
    return () => unsub();
  }, []);

  const handleSaveTeacher = async (data: TeacherForm, teacherId?: string) => {
    const parsedSubjects = data.subjects
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Omit<Teacher, "id"> = {
      name: data.name,
      email: data.email,
      mainSubject: parsedSubjects[0] || "Branş",
      lessonCount: Math.max(parsedSubjects.length, 1),
      classCount: editingTeacher?.classCount ?? 0,
      subjects: parsedSubjects.length ? parsedSubjects : ["Branş"],
    };

    try {
      setIsSaving(true);
      if (teacherId) {
        await updateDoc(doc(db, "teachers", teacherId), payload);
      } else {
        await addDoc(collection(db, "teachers"), payload);
      }
      setIsModalOpen(false);
      setEditingTeacher(null);
    } catch (err) {
      console.error("Öğretmen kaydedilemedi", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTeacher = async () => {
    if (!pendingDelete?.id) return;
    try {
      setIsDeleting(true);
      await deleteDoc(doc(db, "teachers", pendingDelete.id));
      setPendingDelete(null);
    } catch (err) {
      console.error("Öğretmen silinemedi", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminShell activeSection="teachers">
      <SectionHeader
        title="Öğretmen Yönetimi"
        subtitle="Öğretmenleri görüntüle ve yönet"
        action={
          <button
            type="button"
            onClick={() => {
              setEditingTeacher(null);
              setIsModalOpen(true);
            }}
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
            key={teacher.id ?? teacher.email}
            teacher={teacher}
            onEdit={(t) => {
              setEditingTeacher(t);
              setIsModalOpen(true);
            }}
            onDelete={(t) => setPendingDelete(t)}
          />
        ))}
      </div>

      <TeacherModal
        key={editingTeacher?.id ?? "new-teacher"}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTeacher(null);
        }}
        onSubmit={handleSaveTeacher}
        isSaving={isSaving}
        teacherId={editingTeacher?.id}
        initialData={
          editingTeacher
            ? {
                name: editingTeacher.name,
                email: editingTeacher.email,
                subjects: editingTeacher.subjects.join(", "),
              }
            : undefined
        }
        title={editingTeacher ? "Öğretmeni Düzenle" : "Yeni Öğretmen Ekle"}
      />

      <DeleteConfirmModal
        open={Boolean(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDeleteTeacher}
        isDeleting={isDeleting}
        itemLabel={pendingDelete?.name}
        title="Silme Onayı"
        description="silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />
    </AdminShell>
  );
}
