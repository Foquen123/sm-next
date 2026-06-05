import { LessonRead } from "@/interfaces/lesson";

export interface EditLessonModalProps {
  lesson: LessonRead | null;
  active: boolean;
  onClose: () => void;
}
