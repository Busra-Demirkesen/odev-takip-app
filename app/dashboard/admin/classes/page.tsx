// app/dashboard/admin/classes/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { AdminShell } from "@/components/admin/shared/AdminShell";
import { SectionHeader } from "@/components/admin/shared/SectionHeader";
import { DeleteConfirmModal } from "@/components/admin/shared/DeleteConfirmModal";
import { ClassCard } from "@/components/admin/classes/ClassCard";
import { ClassModal } from "@/components/admin/classes/ClassModal";
import { LessonModal } from "@/components/admin/classes/LessonModal";
import { StudentModal } from "@/components/admin/students/StudentModal";
import { db } from "@/lib/firebase";
import type { ClassItem } from "@/types/class";
import type { Student } from "@/types/student";

type ClassForm = {
  name: string;
  gradeLabel: string;
};

type LessonForm = {
  subjectName: string;
  teacherId: string;
  hours: number;
};

type StudentForm = { name: string; email: string; className: string; studentNumber?: string };

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
  const [pendingLessonDelete, setPendingLessonDelete] = useState<{ classItem: ClassItem; index: number } | null>(null);
  const [isDeletingLesson, setIsDeletingLesson] = useState(false);
  const [teacherOptions, setTeacherOptions] = useState<{ id: string; name: string }[]>([]);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedClassName, setSelectedClassName] = useState("");
  const [isSavingStudent, setIsSavingStudent] = useState(false);

  const classOptions = classes.map((c) => c.name).filter(Boolean);

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

  const adjustClassStudentCount = async (className: string | undefined, delta: number) => {
    if (!className) return;
    try {
      const classRef = collection(db, "classes");
      const q = query(classRef, where("name", "==", className), limit(1));
      const snap = await getDocs(q);
      if (snap.empty) return;
      const target = snap.docs[0];
      const current = (target.data().studentCount as number | undefined) ?? 0;
      await updateDoc(target.ref, { studentCount: Math.max(0, current + delta) });
    } catch (err) {
      console.error("Sinif ogrenci sayisi guncellenemedi", err);
    }
  };

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

  const handleDeleteLesson = async () => {
    if (!pendingLessonDelete?.classItem.id) return;
    const { classItem, index } = pendingLessonDelete;
    const subjects = Array.isArray(classItem.subjects) ? [...classItem.subjects] : [];
    const target = subjects[index];
    if (!target) {
      setPendingLessonDelete(null);
      return;
    }
    subjects.splice(index, 1);
    try {
      setIsDeletingLesson(true);
      await updateDoc(doc(db, "classes", classItem.id), {
        subjects,
        lessonCount: subjects.length,
      });
      if (target.teacherId) {
        await updateDoc(doc(db, "teachers", target.teacherId), { lessonCount: increment(-1) });
      }
      setPendingLessonDelete(null);
    } catch (err) {
      console.error("Ders silinemedi", err);
    } finally {
      setIsDeletingLesson(false);
    }
  };

  const handleSaveStudent = async (data: StudentForm) => {
    const classInfo = classes.find((c) => c.name === data.className);
    const courseList = classInfo ? classInfo.subjects : [];
    const courseCount = courseList.length || classInfo?.lessonCount || 0;

    const payload: Omit<Student, "id"> = {
      name: data.name,
      email: data.email,
      className: data.className,
      studentNumber: data.studentNumber,
      courses: courseList,
      courseCount,
    };

    try {
      setIsSavingStudent(true);
      await addDoc(collection(db, "students"), payload);
      await adjustClassStudentCount(data.className, 1);
      setIsStudentModalOpen(false);
      setSelectedClassName("");
    } catch (err) {
      console.error("Ogrenci eklenemedi", err);
    } finally {
      setIsSavingStudent(false);
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
              setSelectedClassName(c.name);
              setIsStudentModalOpen(true);
            }}
            onEditLesson={(c, idx) => {
              setLessonTargetClass(c);
              setEditingLessonIndex(idx);
              setIsLessonModalOpen(true);
            }}
            onDeleteLesson={(c, idx) => {
              setPendingLessonDelete({ classItem: c, index: idx });
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

      <StudentModal
        open={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setSelectedClassName("");
        }}
        onSubmit={handleSaveStudent}
        classOptions={classOptions}
        initialData={
          selectedClassName
            ? {
                name: "",
                email: "",
                className: selectedClassName,
                studentNumber: "",
              }
            : undefined
        }
        title="Yeni Ogrenci Ekle"
        isSaving={isSavingStudent}
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

      <DeleteConfirmModal
        open={Boolean(pendingLessonDelete)}
        onCancel={() => setPendingLessonDelete(null)}
        onConfirm={handleDeleteLesson}
        isDeleting={isDeletingLesson}
        itemLabel={
          pendingLessonDelete && pendingLessonDelete.classItem.subjects[pendingLessonDelete.index]
            ? pendingLessonDelete.classItem.subjects[pendingLessonDelete.index].name
            : undefined
        }
        title="Dersi Sil"
        description="Bu dersi silmek istiyor musunuz? Bu islem geri alinamaz."
      />
    </AdminShell>
  );
}
