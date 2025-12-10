import type { ClassSubject } from "./class";

export type Student = {
  id?: string;
  name: string;
  email: string;
  className: string;
  studentNumber?: string;
  courses?: ClassSubject[];
  courseCount: number;
};
