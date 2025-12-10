// app/dashboard/admin/teachers/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { AdminShell } from "@/components/admin/shared/AdminShell";
import { SectionHeader } from "@/components/admin/shared/SectionHeader";
import { DeleteConfirmModal } from "@/components/admin/shared/DeleteConfirmModal";
import { TeacherCard } from "@/components/admin/teachers/TeacherCard";
import { TeacherModal } from "@/components/admin/teachers/TeacherModal";
import { TeacherLessonsModal } from "@/components/admin/teachers/TeacherLessonsModal";
import { db } from "@/lib/firebase";
import type { Teacher } from "@/types/teacher";
import type { ClassItem } from "@/types/class";

type TeacherForm = { name: string; email: string; subjects: string };

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Teacher | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isLessonsModalOpen, setIsLessonsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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

  useEffect(() => {
    const classesRef = collection(db, "classes");
    const q = query(classesRef, orderBy("name"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data: ClassItem[] = snapshot.docs.map((d) => {
        const docData = d.data() as Omit<ClassItem, "id">;
        return {
          id: d.id,
          name: docData.name ?? "",
          gradeLabel: docData.gradeLabel ?? "",
          studentCount: docData.studentCount ?? 0,
          lessonCount: docData.lessonCount ?? (Array.isArray(docData.subjects) ? docData.subjects.length : 0),
          subjects: Array.isArray(docData.subjects) ? docData.subjects : [],
        };
      });
      setClasses(data);
    });
    return () => unsub();
  }, []);

  const teachersWithStats = useMemo(() => {
    return teachers.map((teacher) => {
      if (!teacher.id) return teacher;
      const taughtClasses = classes.filter((cls) => cls.subjects?.some((s) => s.teacherId === teacher.id));
      const lessonCount = taughtClasses.reduce(
        (acc, cls) => acc + cls.subjects.filter((s) => s.teacherId === teacher.id).length,
        0
      );
      const classCount = taughtClasses.length;
      const totalHours = taughtClasses.reduce(
        (acc, cls) =>
          acc +
          cls.subjects
            .filter((s) => s.teacherId === teacher.id)
            .reduce((inner, s) => inner + (s.hours ?? 1), 0),
        0
      );
      return { ...teacher, lessonCount, classCount, totalHours };
    });
  }, [teachers, classes]);

  const selectedTeacherLessons = useMemo(() => {
    if (!selectedTeacher?.id) return [];
    return classes
      .map((cls) => ({
        className: cls.name,
        gradeLabel: cls.gradeLabel,
        subjects: cls.subjects.filter((s) => s.teacherId === selectedTeacher.id),
      }))
      .filter((item) => item.subjects.length > 0);
  }, [classes, selectedTeacher]);

  const handleSaveTeacher = async (data: TeacherForm, teacherId?: string) => {
    const parsedSubjects = data.subjects
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Omit<Teacher, "id"> = {
      name: data.name,
      email: data.email,
      mainSubject: parsedSubjects[0] || "Brans",
      lessonCount: editingTeacher?.lessonCount ?? 0,
      classCount: editingTeacher?.classCount ?? 0,
      subjects: parsedSubjects.length ? parsedSubjects : ["Brans"],
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
      console.error("Ogretmen kaydedilemedi", err);
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
      console.error("Ogretmen silinemedi", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const applySearch = () => {
    setSearchQuery(searchInput.trim().toLowerCase());
  };

  const filteredTeachers = teachersWithStats.filter((teacher) => {
    if (!searchQuery) return true;
    const fields = [
      teacher.name,
      teacher.email,
      teacher.mainSubject,
      ...(teacher.subjects ?? []),
    ]
      .map((field) => field?.toLowerCase?.() ?? "")
      .filter(Boolean);

    return fields.some((field) => field.includes(searchQuery));
  });

  return (
    <AdminShell activeSection="teachers">
      <SectionHeader
        title="Ogretmen Yonetimi"
        subtitle="Ogretmenleri goruntule ve yonet"
        action={
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-64 bg-white border border-gray-300 rounded-xl px-3 py-2 shadow-sm">
              <Search size={16} className="text-gray-500" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applySearch();
                  }
                }}
                placeholder="Ogretmen ara..."
                className="flex-1 text-sm text-gray-900 placeholder:text-gray-500 bg-transparent outline-none"
              />
            </div>
            <button
              type="button"
              onClick={applySearch}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Ara
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingTeacher(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2196F3] text-white text-sm font-medium hover:bg-[#1976D2] transition-colors"
            >
              <Plus size={18} />
              Ogretmen Ekle
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => (
          <TeacherCard
            key={teacher.id ?? teacher.email}
            teacher={teacher}
            onEdit={(t) => {
              setEditingTeacher(t);
              setIsModalOpen(true);
            }}
            onDelete={(t) => setPendingDelete(t)}
            onViewLessons={(t) => {
              setSelectedTeacher(t);
              setIsLessonsModalOpen(true);
            }}
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
        title={editingTeacher ? "Ogretmeni Duzenle" : "Yeni Ogretmen Ekle"}
      />

      <DeleteConfirmModal
        open={Boolean(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDeleteTeacher}
        isDeleting={isDeleting}
        itemLabel={pendingDelete?.name}
        title="Silme Onayi"
        description="silmek istediginizden emin misiniz? Bu islem geri alinamaz."
      />

      <TeacherLessonsModal
        open={isLessonsModalOpen}
        onClose={() => {
          setIsLessonsModalOpen(false);
          setSelectedTeacher(null);
        }}
        teacherName={selectedTeacher?.name}
        lessons={selectedTeacherLessons}
        summary={
          selectedTeacher
            ? {
                classCount: selectedTeacherLessons.length,
                totalHours:
                  selectedTeacherLessons.reduce(
                    (acc, item) => acc + item.subjects.reduce((inner, s) => inner + (s.hours ?? 1), 0),
                    0
                  ) || 0,
              }
            : undefined
        }
      />
    </AdminShell>
  );
}
