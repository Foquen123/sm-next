import { lessonsReadAll } from "@/actions/lesson";
import { queries } from "@/config/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useLesson() {
  return useQuery({
    queryKey: queries.lessons.all(),
    queryFn: lessonsReadAll,
  });
}