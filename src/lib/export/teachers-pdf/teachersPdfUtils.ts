import { ROWS_COUNT } from "@/config/global_constants";
import { ClassRead } from "@/interfaces/class";
import { ScheduleCellRead } from "@/interfaces/schedule-cell";
import { TeacherRead } from "@/interfaces/teacher";

interface TeacherCell {
  order_in_day: number;
  classes: ClassRead[];
}

export function compareTeacherCells(cell1: TeacherCell, cell2: TeacherCell): boolean {
  if (cell1.order_in_day !== cell2.order_in_day) {
    return false;
  }
  else if (JSON.stringify(cell1) !== JSON.stringify(cell2)) {
    return false;
  }
  return true;
}

export function getTeachersWithChanges(teachers: TeacherRead[], standardSchedule: ScheduleCellRead[], changedSchedule: ScheduleCellRead[], classes: ClassRead[]) {
  const changedTeachers: TeacherRead[] = [];
  for (const teacher of teachers) {
    const teachersClassesStandard = getTeacherClasses(teacher, standardSchedule, classes);
    const teachersClassesChanged = getTeacherClasses(teacher, changedSchedule, classes);
    if (teachersClassesStandard.length !== teachersClassesChanged.length) {
      changedTeachers.push(teacher);
      continue;
    }
    for (let i = 0; i < teachersClassesStandard.length; i++) {
      if (!compareTeacherCells(teachersClassesStandard[i], teachersClassesChanged[i])) {
        changedTeachers.push(teacher);
        break;
      }
    }
  }
  return changedTeachers;
}

export function getTeacherClasses(teacher: TeacherRead, schedule: ScheduleCellRead[], classes: ClassRead[]) {
  const teacherClasses: TeacherCell[] = [];
  for (const cell of schedule) {
    if (cell.lesson1?.teacher.id === teacher.id || cell.lesson2?.teacher.id === teacher.id) {
      const ownerClass = classes.find(cls => cls.id === cell.classId);
      if (!ownerClass) continue;
      const findCellIndex = teacherClasses.findIndex(cls => cls.order_in_day === cell.orderInDay);

      if (findCellIndex !== -1) {
        teacherClasses[findCellIndex].classes.push(ownerClass);
      }
      else {
        // const classesToInsert: IClass[] = [];
        // classesToInsert
        teacherClasses.push({
          classes: [ownerClass],
          order_in_day: cell.orderInDay,
        });
      }
    }
    // if(cell)

    // console.log(teacher.last_name, teacherClasses.map(cls => (cls.classes).map(innerCls => innerCls.name)))
  }
  return teacherClasses;

}

export function getTeacherScheduleDiff(teachers: TeacherRead[], changedSchedule: ScheduleCellRead[], classes: ClassRead[]): (TeacherCell | null)[][] {
  const resultSchedule: (TeacherCell | null)[][] = Array.from(
    { length: teachers.length },
    () => Array(ROWS_COUNT - 1).fill(null),
  );
  for (let i = 0; i < teachers.length; i++) {
    const teacherCells = getTeacherClasses(teachers[i], changedSchedule, classes);


    for (let j = 0; j < ROWS_COUNT - 1; j++) {
      const finded = teacherCells.find(
        (c) => c.order_in_day === j
      );
      if (finded) {
        resultSchedule[i][j] = finded;
      }
    }
  }
  return resultSchedule;
}

export function transformClassesToReadbleForm(classes: ClassRead[] | undefined): string {
  if (classes === undefined) return 'undefinded';
  let result: string = classes[0].name;
  for (let i = 1; i < classes.length; i++) {
    result += `, ${classes[i].name}`;
  }
  return result;
}

export function findWindows(schedule: (TeacherCell | null)[][]): boolean[][] {

  const rowCount = schedule.length;
  if (rowCount === 0) return [];
  const colCount = schedule[0].length;


  const findFirstNoEmptyInColumn = (row: (TeacherCell | null)[]): number => {
    for (let i = 0; i < row.length; i++) {
      if (row[i] !== null) return i;
    }
    return -1;
  };

  const findLastNoEmptyInColumn = (row: (TeacherCell | null)[]): number => {
    for (let i = row.length - 1; i >= 0; i--) {
      if (row[i] !== null) return i;
    }
    return -1;
  };

  const findWindowsInRow = (row: (TeacherCell | null)[]): number[] => {
    // поиск окон
    const windowsPositions: number[] = [];
    const firstNoEmptyIndex = findFirstNoEmptyInColumn(row);
    const lastNoEmptyIndex = findLastNoEmptyInColumn(row);

    if (
      firstNoEmptyIndex === -1 ||
      lastNoEmptyIndex === -1 ||
      firstNoEmptyIndex === lastNoEmptyIndex
    ) {
      return [];
    }

    for (let i = firstNoEmptyIndex + 1; i < lastNoEmptyIndex; i++) {
      if (row[i] === null) {
        windowsPositions.push(i);
      }
    }
    return windowsPositions;
  };


  const result = Array.from({ length: schedule.length }, () =>
    Array(schedule[0].length).fill(false),
  );

  for (let i = 0; i < rowCount; i++) {
    const row = schedule[i];
    const windowsIndexes = findWindowsInRow(row);
    // console.log(windowsIndexes)
    for (let j = 0; j < colCount; j++) {
      const isFindIndex = windowsIndexes.find(c => c === j);
      if (isFindIndex !== undefined) result[i][j] = true;
    }
  }
  return result;
}

export const findEmptyTeachers = (scheduleToExport: (TeacherCell | null)[][]): number[] => {
  const resultArray = [];
  for (let i = 0; i < scheduleToExport.length; i++) {
    let countNotNull = 0;
    for (let j = 0; j < scheduleToExport[0].length; j++) {
      if (scheduleToExport[i][j] !== null) countNotNull++;
    }
    if (countNotNull === 0) resultArray.push(i);
    countNotNull = 0;

  }
  return resultArray;
};