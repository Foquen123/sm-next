import type { ReactNode } from 'react';

export type SubjectCardHover = 'add' | 'delete'

export interface SubjectCardProps {
  children: ReactNode;
  onClick: () => void;
  hover: SubjectCardHover;
  isChoosen: boolean;
}
