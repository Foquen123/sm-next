import { ClassRead } from "@/interfaces/class";

export interface EditClassModalProps {
  // classId: number;
  cls: ClassRead | null;
  isOpen: boolean;
  onClose: () => void;
}