import { LessonRead } from '@/interfaces/lesson';

export interface LessonCardProps {
  lesson: LessonRead;
  onEdit: () => void;
  onDelete: () => void;
}
