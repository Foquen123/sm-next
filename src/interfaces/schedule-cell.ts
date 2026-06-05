import { LessonRead } from '@/interfaces/lesson';
import { TableType } from '@/types/table-type';

export interface ScheduleCellRead {
  id: number;
  dayOfWeek: number;
  orderInDay: number;
  classId: number;
  tableType: TableType;
  lesson1: LessonRead | null;
  lesson2: LessonRead | null;
  isEmpty: boolean;
}

export interface ScheduleCellUpdate {
  lesson1Id: number;
  lesson2Id: number | null;
}

export interface ScheduleCellCreate {
  dayOfWeek: number;
  orderInDay: number;
  classId: number;
  lesson1Id: number;
  lesson2Id: number | null;
  tableType: TableType;
}

export interface ScheduleCellDelete {
  id: number;
}
