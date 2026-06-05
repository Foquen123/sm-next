import { ClassRead } from "@/interfaces/class";
import { ScheduleCellRead } from "@/interfaces/schedule-cell";


export interface StudentsPdfProps {
  standardSchedule: ScheduleCellRead[];
  changedSchedule: ScheduleCellRead[];
  classes: ClassRead[];
  dayIndex: number;
}
