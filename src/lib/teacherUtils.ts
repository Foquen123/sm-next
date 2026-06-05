import { TeacherRead } from '@/interfaces/teacher';

export function getTeacherLastNameWithInitials(teacher: TeacherRead): string {
  let res = teacher.lastName;
  res += ` ${teacher.firstName[0]}.`;
  res += `${teacher.patronymic[0]}.`;
  return res;
}
