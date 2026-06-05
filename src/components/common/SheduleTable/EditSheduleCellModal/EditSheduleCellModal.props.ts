import { ScheduleCellRead } from '@/interfaces/schedule-cell';

export interface EditSheduleCellModalProps {
  sheduleCell: ScheduleCellRead | null;
  isOpen: boolean;
  onClose: () => void;
}
