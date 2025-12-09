// app/dashboard/admin/classes/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { addDoc, collection, deleteDoc, doc, increment, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { AdminShell } from "@/components/admin/shared/AdminShell";
import { SectionHeader } from "@/components/admin/shared/SectionHeader";
import { DeleteConfirmModal } from "@/components/admin/shared/DeleteConfirmModal";
import { ClassCard } from "@/components/admin/classes/ClassCard";
import { ClassModal } from "@/components/admin/classes/ClassModal";
import { LessonModal } from "@/components/admin/classes/LessonModal";
import { db } from "@/lib/firebase";
import type { ClassItem } from "@/types/class";

type ClassForm = {
  name: string;
  gradeLabel: string;
};

type LessonForm = {
  subjectName: string;
  teacherId: string;
  hours: number;
};

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [lessonTargetClass, setLessonTargetClass] = useState<ClassItem | null>(null);
  const [isSavingLesson, setIsSavingLesson] = useState(false);
  const [editingLessonIndex, setEditingLessonIndex] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ClassItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [teacherOptions, setTeacherOptions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const classesRef = collection(db, "classes");
    const q = query(classesRef, orderBy("name"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data: ClassItem[] = snapshot.docs.map((d) => {
        const docData = d.data() as Omit<ClassItem, "id">;
        const subjects = Array.isArray(docData.subjects) ? docData.subjects : [];
        const lessonCount = docData.lessonCount ?? subjects.length;
        return {
          id: d.id,
          name: docData.name ?? "",
          gradeLabel: docData.gradeLabel ?? "",
          studentCount: docData.studentCount ?? 0,
          lessonCount,
          subjects,
        };
      });
      setClasses(data);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const teachersRef = collection(db, "teachers");
    const q = query(teachersRef, orderBy("name"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => {
        const docData = d.data() as { name?: string };
        return { id: d.id, name: docData.name ?? "Öğretmen" };
      });
      setTeacherOptions(data);
    });
    return () => unsub();
  }, []);

  const handleSaveClass = async (data: ClassForm, classId?: string) => {
    const payload: Omit<ClassItem, "id"> = {
      name: data.name,
      gradeLabel: data.gradeLabel,
      studentCount: editingClass?.studentCount ?? 0,
      lessonCount: editingClass?.lessonCount ?? 0,
      subjects: editingClass?.subjects ?? [],
    };

    try {
      setIsSaving(true);
      if (classId) {
        await updateDoc(doc(db, "classes", classId), payload);
      } else {
        await addDoc(collection(db, "classes"), payload);
      }
      setIsModalOpen(false);
      setEditingClass(null);
    } catch (err) {
      console.error("Sinif kaydedilemedi", err);
    } finally {
      setIsSaving(false);
    }
  };

  const updateTeacherLessonCounts = async (subjects: ClassItem["subjects"], delta: number) => {
    if (!Array.isArray(subjects) || !subjects.length) return;
    const perTeacher = subjects.reduce<Record<string, number>>((acc, subj) => {
      if (!subj.teacherId) return acc;
      acc[subj.teacherId] = (acc[subj.teacherId] ?? 0) + 1;
      return acc;
    }, {});
    const updates = Object.entries(perTeacher).map(([teacherId, count]) =>
      updateDoc(doc(db, "teachers", teacherId), { lessonCount: increment(delta * count) })
    );
    await Promise.allSettled(updates);
  };

  const handleSaveLesson = async (data: LessonForm) => {
    if (!lessonTargetClass?.id) return;

    const subjects = Array.isArray(lessonTargetClass.subjects) ? lessonTargetClass.subjects : [];
    const teacher = teacherOptions.find((t) => t.id === data.teacherId);
    const newSubject = {
      name: data.subjectName,
      teacher: teacher?.name ?? "Öğretmen",
      teacherId: data.teacherId,
      hours: data.hours,
    };

    const updatedSubjects = [...subjects];
    const prevSubject = editingLessonIndex !== null ? subjects[editingLessonIndex] : null;

    if (editingLessonIndex !== null && editingLessonIndex >= 0 && editingLessonIndex < updatedSubjects.length) {
      updatedSubjects[editingLessonIndex] = newSubject;
    } else {
      updatedSubjects.push(newSubject);
    }

    try {
      setIsSavingLesson(true);
      await updateDoc(doc(db, "classes", lessonTargetClass.id), {
        subjects: updatedSubjects,
        lessonCount: updatedSubjects.length,
      });

      if (prevSubject?.teacherId && prevSubject.teacherId !== data.teacherId) {
        await updateDoc(doc(db, "teachers", prevSubject.teacherId), { lessonCount: increment(-1) });
      }
      if (data.teacherId && (!prevSubject || prevSubject.teacherId !== data.teacherId)) {
        await updateDoc(doc(db, "teachers", data.teacherId), { lessonCount: increment(1) });
      }

      setIsLessonModalOpen(false);
      setLessonTargetClass(null);
      setEditingLessonIndex(null);
    } catch (err) {
      console.error("Ders eklenemedi", err);
    } finally {
      setIsSavingLesson(false);
    }
  };

  const handleDeleteClass = async () => {
    if (!pendingDelete?.id) return;
    try {
      setIsDeleting(true);
      await updateTeacherLessonCounts(pendingDelete.subjects, -1);
      await deleteDoc(doc(db, "classes", pendingDelete.id));
      setPendingDelete(null);
    } catch (err) {
      console.error("Sinif silinemedi", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteLesson = async (classItem: ClassItem, lessonIndex: number) => {
    if (!classItem.id) return;
    const subjects = Array.isArray(classItem.subjects) ? [...classItem.subjects] : [];
    const target = subjects[lessonIndex];
    if (!target) return;
    subjects.splice(lessonIndex, 1);
    try {
      await updateDoc(doc(db, "classes", classItem.id), {
        subjects,
        lessonCount: subjects.length,
      });
      if (target.teacherId) {
        await updateDoc(doc(db, "teachers", target.teacherId), { lessonCount: increment(-1) });
      }
    } catch (err) {
      console.error("Ders silinemedi", err);
    }
  };

  return (
    <AdminShell activeSection="classes">
      <SectionHeader
        title="Sinif Yonetimi"
        subtitle="Siniflari goruntule ve duzenle"
        action={
          <button
            type="button"
            onClick={() => {
              setEditingClass(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2196F3] text-white text-sm font-medium hover:bg-[#1976D2] transition-colors"
          >
            <Plus size={18} />
            Sinif Ekle
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {classes.map((classItem) => (
          <ClassCard
            key={classItem.id ?? classItem.name}
            classItem={classItem}
            onEdit={(c) => {
              setEditingClass(c);
              setIsModalOpen(true);
            }}
            onDelete={(c) => setPendingDelete(c)}
            onAddLesson={(c) => {
              setLessonTargetClass(c);
              setEditingLessonIndex(null);
              setIsLessonModalOpen(true);
            }}
            onAddStudent={(c) => {
              setEditingClass(c);
              setIsModalOpen(true);
            }}
            onEditLesson={(c, idx) => {
              setLessonTargetClass(c);
              setEditingLessonIndex(idx);
              setIsLessonModalOpen(true);
            }}
            onDeleteLesson={(c, idx) => {
              handleDeleteLesson(c, idx);
            }}
          />
        ))}
      </div>

      <ClassModal
        key={editingClass?.id ?? "new-class"}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClass(null);
        }}
        onSubmit={(data) => handleSaveClass(data, editingClass?.id)}
        isSaving={isSaving}
        classId={editingClass?.id}
        initialData={editingClass ?? undefined}
        title={editingClass ? "Sinifi Duzenle" : "Yeni Sinif Ekle"}
      />

      <LessonModal
        open={isLessonModalOpen}
        onClose={() => {
          setIsLessonModalOpen(false);
          setLessonTargetClass(null);
        }}
        onSubmit={handleSaveLesson}
        isSaving={isSavingLesson}
        teacherOptions={teacherOptions}
        classLabel={lessonTargetClass ? `${lessonTargetClass.name} • ${lessonTargetClass.gradeLabel}` : undefined}
        initialData={
          editingLessonIndex !== null && lessonTargetClass?.subjects?.[editingLessonIndex]
            ? {
                subjectName: lessonTargetClass.subjects[editingLessonIndex].name,
                teacherId: lessonTargetClass.subjects[editingLessonIndex].teacherId ?? "",
                hours: lessonTargetClass.subjects[editingLessonIndex].hours ?? 1,
              }
            : undefined
        }
        title={editingLessonIndex !== null ? "Dersi Düzenle" : "Ders Ekle"}
        submitLabel={editingLessonIndex !== null ? "Güncelle" : undefined}
      />

      <DeleteConfirmModal
        open={Boolean(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDeleteClass}
        isDeleting={isDeleting}
        itemLabel={pendingDelete?.name}
        title="Silme Onayi"
        description="Bu sinifi silmek istediginizden emin misiniz? Bu islem geri alinamaz."
      />
    </AdminShell>
  );
}
