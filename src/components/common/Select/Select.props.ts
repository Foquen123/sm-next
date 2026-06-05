import type { ReactNode } from 'react';

export type SelectOption = {
  id: number;
  content: ReactNode;
};
export interface SelectProps {
  options: SelectOption[];
  selectedId?: number;
  onChange: (id: number) => void;
  placeholder: string;
}
