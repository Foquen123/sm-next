import { scheduleCellReadAll, scheudleCellReadByDay } from '@/actions/schedule-cell';
import { queries } from '@/config/query-keys';
import { TableType } from '@/types/table-type';
import { useQuery } from '@tanstack/react-query';

export function useScheduleCell(tableType: TableType) {
  return useQuery({
    queryKey: queries.scheduleCells.all(tableType),
    queryFn: () => scheduleCellReadAll({ tableType: tableType }),
  });
}

export function useScheduleCellFromDay(tableType: TableType, day: number) {
  return useQuery({
    queryKey: queries.scheduleCells.day(tableType, day),
    queryFn: () => scheudleCellReadByDay({ tableType: tableType, day: day }),
  });
}
