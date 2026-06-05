import {
  teachersCreate,
  teachersDelete,
  teachersUpdate,
} from '@/actions/teacher';
import { queries } from '@/config/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teachersCreate,

    onMutate: async () => {},

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queries.teachers.all() });
    },
    onSuccess: () => {},
  });
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teachersUpdate,

    onMutate: async () => {},

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queries.teachers.all() });
    },
    onSuccess: () => {},
  });
}
export function useDeleteTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teachersDelete,

    onMutate: async () => {},

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queries.teachers.all() });
    },
    onSuccess: () => {},
  });
}
