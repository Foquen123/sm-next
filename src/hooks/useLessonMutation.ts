import { lessonsCreate, lessonsDelete, lessonsUpdate } from '@/actions/lesson';
import { queries } from '@/config/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lessonsCreate,

    onMutate: async () => {},

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queries.lessons.all() });
    },
    onSuccess: () => {},
  });
}

export function useUpdateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lessonsUpdate,

    onMutate: async () => {},

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queries.lessons.all() });
    },
    onSuccess: () => {},
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lessonsDelete,

    onMutate: async () => {},

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queries.lessons.all() });
    },
    onSuccess: () => {},
  });
}
