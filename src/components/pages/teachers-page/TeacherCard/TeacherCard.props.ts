import { TeacherRead } from '@/interfaces/teacher';

export interface TeacherCardProps {
  teacher: TeacherRead;
  onEdit: () => void;
  onDelete: () => void;
}
