// app/dashboard/admin/students/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
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
import { StudentModal } from "@/components/admin/students/StudentModal";
import { StudentTable } from "@/components/admin/students/StudentTable";
import { db } from "@/lib/firebase";
import type { Student } from "@/types/student";
import type { ClassItem } from "@/types/class";

type StudentForm = { name: string; email: string; className: string; studentNumber?: string };

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classOptions, setClassOptions] = useState<string[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const studentsRef = collection(db, "students");
    const q = query(studentsRef, orderBy("name"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data: Student[] = snapshot.docs.map((d) => {
        const docData = d.data() as Omit<Student, "id">;
        const courses = Array.isArray(docData.courses) ? docData.courses : [];
        return {
          id: d.id,
          name: docData.name,
          email: docData.email,
          className: docData.className,
          studentNumber: docData.studentNumber,
          courses,
          courseCount: docData.courseCount ?? courses.length ?? 0,
        };
      });
      setStudents(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const classesRef = collection(db, "classes");
    const q = query(classesRef, orderBy("name"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data: ClassItem[] = snapshot.docs.map((d) => {
        const docData = d.data() as Omit<ClassItem, "id">;
        const subjects = Array.isArray(docData.subjects) ? docData.subjects : [];
        return {
          id: d.id,
          name: docData.name ?? "",
          gradeLabel: docData.gradeLabel ?? "",
          studentCount: docData.studentCount ?? 0,
          lessonCount: docData.lessonCount ?? subjects.length,
          subjects,
        };
      });
      setClasses(data);
      setClassOptions(data.map((cls) => cls.name).filter(Boolean));
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

  const handleSaveStudent = async (data: StudentForm, studentId?: string) => {
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
      setIsSaving(true);
      if (studentId) {
        await updateDoc(doc(db, "students", studentId), payload);
        if (editingStudent?.className && editingStudent.className !== data.className) {
          await adjustClassStudentCount(editingStudent.className, -1);
          await adjustClassStudentCount(data.className, 1);
        }
      } else {
        await addDoc(collection(db, "students"), payload);
        await adjustClassStudentCount(data.className, 1);
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
      await adjustClassStudentCount(pendingDelete.className, -1);
      setPendingDelete(null);
    } catch (err) {
      console.error("Ogrenci silinemedi", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const applySearch = () => {
    setSearchQuery(searchInput.trim().toLowerCase());
  };

  const filteredStudents = students.filter((student) => {
    if (!searchQuery) return true;
    const fields = [
      student.name,
      student.email,
      student.className,
      student.studentNumber ?? "",
    ]
      .map((field) => field?.toLowerCase?.() ?? "")
      .filter(Boolean);

    return fields.some((field) => field.includes(searchQuery));
  });

  const studentsWithCourseCount = filteredStudents.map((student) => {
    const classInfo = classes.find((c) => c.name === student.className);
    const courseCount = classInfo
      ? classInfo.subjects.length || classInfo.lessonCount || 0
      : student.courses?.length || student.courseCount;
    const courses = classInfo ? classInfo.subjects : student.courses;
    return { ...student, courseCount, courses };
  });

  return (
    <AdminShell activeSection="students">
      <SectionHeader
        title="Ogrenci Yonetimi"
        subtitle="Ogrencileri goruntule ve yonet"
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
                placeholder="Ogrenci ara..."
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
                setEditingStudent(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2196F3] text-white text-sm font-medium hover:bg-[#1976D2] transition-colors"
            >
              <Plus size={18} />
              Ogrenci Ekle
            </button>
          </div>
        }
      />

      <StudentTable
        students={studentsWithCourseCount}
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
                studentNumber: editingStudent.studentNumber,
              }
            : undefined
        }
        title={editingStudent ? "Ogrenciyi Duzenle" : "Yeni Ogrenci Ekle"}
        isSaving={isSaving}
        classOptions={classOptions}
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
