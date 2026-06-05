import { ROWS_COUNT } from '@/config/global_constants';
import { ClassRead } from '@/interfaces/class';
import { ScheduleCellRead } from '@/interfaces/schedule-cell';

const compareCells = (
  cell1: ScheduleCellRead,
  cell2: ScheduleCellRead,
): boolean => {
  if (cell1.classId !== cell2.classId) {
    return false;
  } else if (cell1.dayOfWeek !== cell2.dayOfWeek) {
    return false;
  } else if (cell1.lesson1?.id !== cell2.lesson1?.id) {
    return false;
  } else if (cell1.lesson2?.id !== cell2.lesson2?.id) {
    return false;
  } else if (cell1.orderInDay !== cell2.orderInDay) {
    return false;
  }
  return true;
};

export const getClassesWithChanges = (
  classes: ClassRead[],
  standardSchedule: ScheduleCellRead[],
  changedSchedule: ScheduleCellRead[],
) => {
  const changedClasses: ClassRead[] = [];
  for (const cls of classes) {
    const classCellsStandard = standardSchedule.filter(
      (c) => c.classId === cls.id,
    ).sort((a, b) => a.orderInDay - b.orderInDay);
    const classCellsChanged = changedSchedule.filter(
      (c) => c.classId === cls.id,
    ).sort((a, b) => a.orderInDay - b.orderInDay);

    if (classCellsStandard.length !== classCellsChanged.length) {
      changedClasses.push(cls);
      continue;
    }
    for (let i = 0; i < classCellsStandard.length; i++) {
      if (!compareCells(classCellsStandard[i], classCellsChanged[i])) {
        // console.log('compare false');
        // console.log(classCellsStandard[i], classCellsChanged[i]);

        changedClasses.push(cls);
        break;
      }
    }
  }
  // меняем порядок классов
  for (let i = 0; i < changedClasses.length; i++) {
    changedClasses[i].displayOrder = i;
  }
  // console.log(changedClasses);
  return changedClasses;
};

export const getScheduleDiffs = (
  classes: ClassRead[],
  changedSchedule: ScheduleCellRead[],
): (ScheduleCellRead | null)[][] => {
  const resultSchedule: (ScheduleCellRead | null)[][] = Array.from(
    { length: ROWS_COUNT - 1 },
    () => Array(classes.length).fill(null),
  );

  for (let i = 0; i < ROWS_COUNT - 1; i++) {
    for (const cls of classes) {
      const finded = changedSchedule.find(
        (c) => c.classId === cls.id && c.orderInDay === i,
      );
      if (finded) {
        resultSchedule[i][cls.displayOrder] = finded;
      }
    }
  }
  return resultSchedule;
};

export function findWindows(
  schedule: (ScheduleCellRead | null)[][],
): boolean[][] {
  const rowCount = schedule.length;
  const colCount = schedule[0].length;

  const findFirstNoEmptyInColumn = (
    col: (ScheduleCellRead | null)[],
  ): number => {
    for (let i = 0; i < col.length; i++) {
      if (col[i] !== null) return i;
    }
    return -1;
  };

  const findLastNoEmptyInColumn = (
    col: (ScheduleCellRead | null)[],
  ): number => {
    for (let i = col.length - 1; i >= 0; i--) {
      if (col[i] !== null) return i;
    }
    return -1;
  };

  const findWindowsInColumn = (col: (ScheduleCellRead | null)[]): number[] => {
    // поиск окон
    const windowsPositions: number[] = [];
    const firstNoEmptyIndex = findFirstNoEmptyInColumn(col);
    const lastNoEmptyIndex = findLastNoEmptyInColumn(col);

    if (
      firstNoEmptyIndex === -1 ||
      lastNoEmptyIndex === -1 ||
      firstNoEmptyIndex === lastNoEmptyIndex
    ) {
      return [];
    }

    for (let i = firstNoEmptyIndex + 1; i < lastNoEmptyIndex; i++) {
      if (col[i] === null) {
        windowsPositions.push(i);
      }
    }
    return windowsPositions;
  };

  const getColumnByIndex = (index: number) => {
    const col = [];
    for (let i = 0; i < rowCount; i++) {
      col.push(schedule[i][index]);
    }
    return col;
  };

  const result = Array.from({ length: schedule.length }, () =>
    Array(schedule[0].length).fill(false),
  );

  for (let i = 0; i < colCount; i++) {
    const col = getColumnByIndex(i);
    const windowsIndexes = findWindowsInColumn(col);
    for (let j = 0; j < rowCount; j++) {
      const isFindIndex = windowsIndexes.find((c) => c === j);
      if (isFindIndex !== undefined) result[j][i] = true;
    }
  }
  // console.log(result);
  return result;
}
