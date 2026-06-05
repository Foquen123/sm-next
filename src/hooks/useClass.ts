import { classesReadAll } from '@/actions/class';
import { queries } from '@/config/query-keys';
import { useQuery } from '@tanstack/react-query';

export function useClass() {
  return useQuery({
    queryKey: queries.classes.all(),
    queryFn: classesReadAll,
  });
}
