import { TeacherRead } from "@/interfaces/teacher";

export interface EditTeacherModalProps {
  teacher: TeacherRead | null;
  active: boolean;
  onClose: () => void;
}
