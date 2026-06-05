import {
  scheduleCellCopyMainToExtra,
  scheduleCellCreate,
  scheduleCellDelete,
  scheduleCellSwap,
  scheduleCellUpdate,
} from '@/actions/schedule-cell';
import { queries } from '@/config/query-keys';
import { ScheduleCellRead } from '@/interfaces/schedule-cell';
import { TableType } from '@/types/table-type';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useSwapScheduleCell(tableType: TableType) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: scheduleCellSwap,

    onMutate: async ({ cell, targetCell }) => {
      await queryClient.cancelQueries({
        queryKey: queries.scheduleCells.all(tableType),
      });
      const previousCells = queryClient.getQueryData<ScheduleCellRead[]>(
        queries.scheduleCells.all(tableType),
      );
      queryClient.setQueryData<ScheduleCellRead[]>(
        queries.scheduleCells.all(tableType),
        (old) =>
          old?.map((cls) => {
            if (cls.id === cell.id) {
              return { ...cls, orderInDay: targetCell.orderInDay };
            }
            if (cls.id === targetCell.id) {
              return { ...cls, orderInDay: cell.orderInDay };
            }
            return cls;
          }),
      );
      return { previousCells };
    },

    onError: (err, variables, context) => {
      if (context?.previousCells) {
        queryClient.setQueryData(
          queries.scheduleCells.all(tableType),
          context.previousCells,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queries.scheduleCells.all(tableType),
      });
    },
  });
}

export function useUpdateScheduleCell(id: number, tableType: TableType) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: queries.scheduleCells.detail(id),
    mutationFn: scheduleCellUpdate,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queries.scheduleCells.all(tableType),
      });
    },
  });
}

export function useCreateScheduleCell(id: number, tableType: TableType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queries.scheduleCells.detail(id),
    mutationFn: scheduleCellCreate,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queries.scheduleCells.all(tableType),
      });
    },
  });
}

export function useDeleteScheduleCell(id: number, tableType: TableType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queries.scheduleCells.detail(id),
    mutationFn: scheduleCellDelete,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queries.scheduleCells.all(tableType),
      });
    },
  });
}

export function useCopyScheduleCells() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queries.scheduleCells.all('extra'),
    mutationFn: scheduleCellCopyMainToExtra,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queries.scheduleCells.all('extra'),
      });
    },
  });
}
