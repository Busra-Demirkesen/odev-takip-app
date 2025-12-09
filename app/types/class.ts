export type ClassSubject = {
  name: string;
  teacher: string;
  teacherId?: string;
  hours?: number;
};

export type ClassItem = {
  id?: string;
  name: string;
  gradeLabel: string;
  studentCount: number;
  lessonCount: number;
  subjects: ClassSubject[];
};
