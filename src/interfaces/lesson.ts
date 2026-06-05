import { ClassroomRead } from './classroom';
import { SubjectRead } from './subject';
import { TeacherRead } from './teacher';

export interface LessonRead {
  id: number;
  teacher: TeacherRead;
  classroom: ClassroomRead;
  subject: SubjectRead;
}

export interface LessonCreate {
  teacherId: number;
  classroomId: number;
  subjectId: number;
}

export interface LessonUpdate {
  teacherId: number;
  classroomId: number;
  subjectId: number;
}

export interface LessonDelete {
  id: number;
}
