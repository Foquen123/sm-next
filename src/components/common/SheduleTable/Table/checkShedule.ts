

// function getRowFromTable(
//   table: ISheduleCell[][],
//   rowCount: number,
//   colCount: number,
// );

import { ClassRead } from "@/interfaces/class";
import { ScheduleCellRead } from "@/interfaces/schedule-cell";
import { SignalType } from "@/types/signal";

const findFirstNoEmptyInColumn = (col: ScheduleCellRead[]): number => {
  for (let i = 0; i < col.length; i++) {
    if (!col[i].isEmpty) return i;
  }
  return -1;
};

const findLastNoEmptyInColumn = (col: ScheduleCellRead[]): number => {
  for (let i = col.length - 1; i >= 0; i--) {
    if (!col[i].isEmpty) return i;
  }
  return -1;
};

const findWindowsInColumn = (col: ScheduleCellRead[]): number[] => {
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
    if (col[i].isEmpty) {
      windowsPositions.push(i);
    }
  }
  return windowsPositions;
};

export default function checkShedule(
  shedule: ScheduleCellRead[],
  rowCount: number,
  colCount: number,
  classes: ClassRead[],
): SignalType[] {
  const result: SignalType[] = Array<SignalType>(8).fill('normal');

  const getRowFromTable = (index: number): ScheduleCellRead[] => {
    const row: ScheduleCellRead[] = [];
    for (let i = 0; i < shedule.length; i++) {
      if (shedule[i].orderInDay === index) {
        row.push(shedule[i]);
      }
    }
    // for (let j = 0; j < colCount; j++) {
    //   row.push(shedule[j][index]);
    // }
    return row;
  };

  const getColumnFromTable = (index: number): ScheduleCellRead[] => {
    const col: ScheduleCellRead[] = [];
    const ownerClass = classes.find((c) => c.displayOrder === index);
    for (let i = 0; i < shedule.length; i++) {
      if (!ownerClass) return [];
      if (shedule[i].classId === ownerClass.id) {
        col.push(shedule[i]);
      }
    }
    // for (let j = 0; j < colCount; j++) {
    //   row.push(shedule[j][index]);
    // }
    return col.sort((a, b) => a.orderInDay - b.orderInDay);
  };

  const findConflictsInRow = (row: ScheduleCellRead[]): number[] => {
    const result: number[] = [];

    for (let i = 0; i < row.length; i++) {
      if (row[i].isEmpty) continue;
      const countRepetativeElements = row.filter(
        (e) => e.lesson1?.classroom.name === row[i].lesson1?.classroom.name && !e.lesson1?.classroom.isAllowConflicts,
      ).length;
      if (countRepetativeElements > 1) result.push(i);
    }
    return result;
  };

  // поиск окон
  let windowsIndexes: number[] = [];
  for (let i = 0; i < colCount; i++) {
    const windows = findWindowsInColumn(getColumnFromTable(i));
    windowsIndexes = [...new Set([...windowsIndexes, ...windows])];
  }

  for (const i of windowsIndexes) {
    result[i] = 'attention';
  }

  // console.log(windowsIndexes);

  // поиск конфликтов
  for (let i = 0; i < rowCount; i++) {
    const row = getRowFromTable(i);
    const conflicts = findConflictsInRow(row);
    if (conflicts.length !== 0) {
      result[i] = 'warning';
    }
  }

  return result;

  // for (let i = 0; i < rowCount; i++) {
  //   const row: ISheduleCell[] = [];
  //   for (let j = 0; j < colCount; j++) {
  //     row.push(shedule[j][i]);
  //   }
  //   console.log(row);
  // }
}

// export default function checkShedule(
//   shedule: ISheduleCell[][],
//   rowCount: number,
//   colCount: number,
// ): SignalType[] {
//   const result: SignalType[] = Array<SignalType>(8).fill('normal');

//   const getRowFromTable = (index: number): ISheduleCell[] => {
//     const row: ISheduleCell[] = [];
//     for (let j = 0; j < colCount; j++) {
//       row.push(shedule[j][index]);
//     }
//     return row;
//   };

//   const findConflictsInRow = (row: ISheduleCell[]): number[] => {
//     const result: number[] = [];

//     for (let i = 0; i < row.length; i++) {
//       if (row[i].isEmpty) continue;
//       const countRepetativeElements = row.filter(
//         (e) => e.lesson1?.classroom.name === row[i].lesson1?.classroom.name,
//       ).length;
//       if (countRepetativeElements > 1) result.push(i);
//     }
//     return result;
//   };

//   // поиск окон
//   let windowsIndexes: number[] = [];
//   for (let i = 0; i < colCount; i++) {
//     const windows = findWindowsInColumn(shedule[i]);
//     windowsIndexes = [...new Set([...windowsIndexes, ...windows])];
//   }

//   for (const i of windowsIndexes) {
//     result[i] = 'attention';
//   }

//   // console.log(windowsIndexes);

//   // поиск конфликтов
//   for (let i = 0; i < rowCount; i++) {
//     const row = getRowFromTable(i);
//     const conflicts = findConflictsInRow(row);
//     if (conflicts.length !== 0) {
//       result[i] = 'warning';
//     }
//   }

//   return result;

//   // for (let i = 0; i < rowCount; i++) {
//   //   const row: ISheduleCell[] = [];
//   //   for (let j = 0; j < colCount; j++) {
//   //     row.push(shedule[j][i]);
//   //   }
//   //   console.log(row);
//   // }
// }
