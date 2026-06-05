import {
  classroomsCreate,
  classroomsDelete,
  classroomsUpdate,
} from '@/actions/classroom';
import { queries } from '@/config/query-keys';
import { ClassroomRead } from '@/interfaces/classroom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: classroomsUpdate,

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queries.classrooms.all() });

      const previousClassrooms = queryClient.getQueryData<ClassroomRead[]>(
        queries.classrooms.all(),
      );

      queryClient.setQueryData<ClassroomRead[]>(
        queries.classrooms.all(),
        (old) =>
          old?.map((classroom) =>
            classroom.id === id ? { ...classroom, ...data } : classroom,
          ),
      );

      return { previousClassrooms };
    },

    onError: (err, variables, context) => {
      if (context?.previousClassrooms) {
        queryClient.setQueryData(
          queries.classrooms.all(),
          context.previousClassrooms,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queries.classrooms.all() });
    },
  });
}

export function useCreateClassroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: classroomsCreate,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queries.classrooms.all() });
    },
  });
}

export function useDeleteClassroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: classroomsDelete,

    onMutate: async ({ data }) => {
      await queryClient.cancelQueries({ queryKey: queries.classrooms.all() });

      const previousClassrooms = queryClient.getQueryData<ClassroomRead[]>(
        queries.classrooms.all(),
      );

      queryClient.setQueryData<ClassroomRead[]>(
        queries.classrooms.all(),
        (old) => old?.filter((classroom) => classroom.id !== data.id),
      );

      return { previousClassrooms };
    },

    onError: (err, variables, context) => {
      if (context?.previousClassrooms) {
        queryClient.setQueryData(
          queries.classrooms.all(),
          context.previousClassrooms,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queries.classrooms.all() });
    },
  });
}
