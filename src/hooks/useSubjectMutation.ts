import { subjectsCreate, subjectsDelete } from '@/actions/subject';
import { queries } from '@/config/query-keys';
import { SubjectRead } from '@/interfaces/subject';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subjectsCreate,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queries.subjects.all() });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subjectsDelete,

    onMutate: async ({ data }) => {
      await queryClient.cancelQueries({ queryKey: queries.subjects.all() });

      const previousSubjects = queryClient.getQueryData<SubjectRead[]>(
        queries.subjects.all(),
      );

      queryClient.setQueryData<SubjectRead[]>(queries.subjects.all(), (old) =>
        old?.filter((sub) => sub.id !== data.id),
      );

      return { previousSubjects };
    },

    onError: (err, variables, context) => {
      if (context?.previousSubjects) {
        queryClient.setQueryData(
          queries.subjects.all(),
          context.previousSubjects,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queries.subjects.all() });
    },
  });
}
