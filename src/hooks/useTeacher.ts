import { teachersReadAll } from '@/actions/teacher';
import { queries } from '@/config/query-keys';
import { useQuery } from '@tanstack/react-query';

export function useTeacher() {
  return useQuery({
    queryKey: queries.teachers.all(),
    queryFn: teachersReadAll,
  });
}
