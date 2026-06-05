import { TeacherRead } from './teacher';

export interface ClassRead {
  id: number;
  name: string;
  teacher: Omit<TeacherRead, 'subjects' | 'pattern'>;
  displayOrder: number;
}

export interface ClassDelete {
  id: number;
}

export interface ClassUpdate {
  name: string;
  teacherId: number;
}

export interface ClassUpdateOrder {
  id: number;
  displayOrder: number;
}
