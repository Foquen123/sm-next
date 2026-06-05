import { TableType } from '@/types/table-type';

export const queries = {
  classrooms: {
    all: () => ['classrooms'] as const,
  },

  lessons: {
    all: () => ['lessons'] as const,
  },

  scheduleCells: {
    all: (tableType: TableType) => ['cells', tableType] as const,
    day: (tableType: TableType, dayIndex: number) =>
      [...queries.scheduleCells.all(tableType), dayIndex] as const,
    detail: (id: number) => [...queries.scheduleCells.all('main'), id] as const,
  },

  subjects: {
    all: () => ['subjects'] as const,
  },

  teachers: {
    all: () => ['teachers'] as const,
  },

  classes: {
    all: () => ['classes'] as const,
  },
  patterns: {
    all: () => ['patterns'] as const,
  },
};
