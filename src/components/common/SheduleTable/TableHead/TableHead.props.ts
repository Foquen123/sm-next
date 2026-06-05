import { TableMode } from '@/types/table-mode';
import type { HTMLAttributes } from 'react';

export interface TableHeadProps extends HTMLAttributes<HTMLElement> {
  classname: string;
  mainTeacher: string;
  // mode: TableMode;
  onEdit: () => void;
  onRemove: () => void;
}
