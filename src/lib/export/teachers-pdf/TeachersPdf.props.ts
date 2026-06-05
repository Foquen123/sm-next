import { ClassRead } from "@/interfaces/class";
import { ScheduleCellRead } from "@/interfaces/schedule-cell";
import { TeacherRead } from "@/interfaces/teacher";


export interface TeachersPdfProps {
  standardSchedule: ScheduleCellRead[];
  changedSchedule: ScheduleCellRead[];
  classes: ClassRead[];
  dayIndex: number;
  teachers: TeacherRead[];
}
