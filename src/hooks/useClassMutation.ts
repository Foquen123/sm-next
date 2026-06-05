// 'use client';

import {
  classesCreate,
  classesDelete,
  classesUpdate,
  classesUpdateOrders,
} from '@/actions/class';
import { queries } from '@/config/query-keys';
import { ClassRead } from '@/interfaces/class';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: classesCreate,

    onMutate: async () => {
      // await queryClient.cancelQueries({ queryKey: ['classes'] });
      // const previousClasses = queryClient.getQueryData<ClassRead[]>([
      //   'classes',
      // ]);
      // queryClient.setQueryData<ClassRead[]>(['classes'], (old) =>
      //   old?.map((cls, i) => ({ ...cls, displayOrder: i })),
      // );
      // // for (let i = 0; i < classes.length; i++) {
      // //   classes[i].displayOrder = i;
      // // }
      // return { previousClasses };
    },

    // onError: (err, variables, context) => {
    //   if (context?.previousClasses) {
    //     queryClient.setQueryData(['classes'], context.previousClasses);
    //   }
    // },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queries.classes.all() });
    },
    onSuccess: () => {},
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: classesDelete,

    onMutate: async ({ data }) => {
      await queryClient.cancelQueries({ queryKey: queries.classes.all() });

      const previousClasses = queryClient.getQueryData<ClassRead[]>(
        queries.classes.all(),
      );

      queryClient.setQueryData<ClassRead[]>(queries.classes.all(), (old) =>
        old?.filter((classroom) => classroom.id !== data.id),
      );
      queryClient.setQueryData<ClassRead[]>(queries.classes.all(), (old) =>
        old?.map((cls, i) => ({ ...cls, displayOrder: i })),
      );

      // for (let i = 0; i < classes.length; i++) {
      //   classes[i].displayOrder = i;
      // }

      return { previousClasses };
    },

    onError: (err, variables, context) => {
      if (context?.previousClasses) {
        queryClient.setQueryData(
          queries.classes.all(),
          context.previousClasses,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queries.classes.all() });
    },
  });
}

export function useUpdateClassOrders() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: classesUpdateOrders,

    onMutate: async ({ data }) => {
      await queryClient.cancelQueries({ queryKey: queries.classes.all() });

      const previousClasses = queryClient.getQueryData<ClassRead[]>(
        queries.classes.all(),
      );

      queryClient.setQueryData<ClassRead[]>(queries.classes.all(), (old) =>
        old
          ?.map((cls) => {
            const newClsOrder = data.find((c) => c.id === cls.id)?.displayOrder;
            console.log(data);
            // cls.displayOrder = newClsOrder || cls.displayOrder;
            return { ...cls, displayOrder: newClsOrder || cls.displayOrder };
          })
          .sort((a, b) => a.displayOrder - b.displayOrder),
      );

      return { previousClasses };
    },

    onError: (err, variables, context) => {
      if (context?.previousClasses) {
        queryClient.setQueryData(
          queries.classes.all(),
          context.previousClasses,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queries.classes.all() });
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: classesUpdate,

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queries.classes.all() });

      const previousClasses = queryClient.getQueryData<ClassRead[]>(
        queries.classes.all(),
      );

      queryClient.setQueryData<ClassRead[]>(queries.classes.all(), (old) =>
        old?.map((cls) => (cls.id === id ? { ...cls, ...data } : cls)),
      );

      return { previousClasses };
    },

    onError: (err, variables, context) => {
      if (context?.previousClasses) {
        queryClient.setQueryData(
          queries.classes.all(),
          context.previousClasses,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queries.classes.all() });
    },
  });
}
