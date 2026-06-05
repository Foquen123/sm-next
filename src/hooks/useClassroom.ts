import { classroomsReadAll } from "@/actions/classroom";
import { queries } from "@/config/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useClassroom() {
  return useQuery({
    queryKey: queries.classrooms.all(),
    queryFn: classroomsReadAll,
  });

}