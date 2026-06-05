import type { ReactNode } from 'react';

export interface ListItemCardProps {
  children: ReactNode;
  onRemove: () => void;
}
