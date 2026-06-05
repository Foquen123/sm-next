import type { HTMLAttributes } from 'react';
import { TableMode } from '@/types/table-mode';
import { ScheduleCellRead } from '@/interfaces/schedule-cell';

export interface TableCellProps extends HTMLAttributes<HTMLElement> {
  // color: string;
  // subjectName: string;
  tableCell: ScheduleCellRead;
  draggedCell: ScheduleCellRead | null;
  dragOverCell: ScheduleCellRead | null;
  // mode: TableMode;
  onEdit: () => void;
  onAdd: () => void;
  // onRemove: () => void;
}
