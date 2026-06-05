/* eslint-disable no-unused-vars */

import { SubjectRead } from "@/interfaces/subject";

export interface SubjectsSelectorProps {
  teacherSubjects: SubjectRead[];
  onChange: (id: number) => void;
}
