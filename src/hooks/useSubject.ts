import { subjectsReadAll } from '@/actions/subject';
import { queries } from '@/config/query-keys';
import { useQuery } from '@tanstack/react-query';

export function useSubject() {
  return useQuery({
    queryKey: queries.subjects.all(),
    queryFn: subjectsReadAll,
  });
}
