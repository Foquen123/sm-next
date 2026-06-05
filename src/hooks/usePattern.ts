import { patternsReadAll } from '@/actions/pattern';
import { queries } from '@/config/query-keys';
import { useQuery } from '@tanstack/react-query';

export function usePattern() {
  return useQuery({
    queryKey: queries.patterns.all(),
    queryFn: patternsReadAll,
  });
}
