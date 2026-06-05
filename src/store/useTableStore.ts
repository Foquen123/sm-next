import { TableMode } from '@/types/table-mode';
import { TableType } from '@/types/table-type';
import { create } from 'zustand';

// Типизация состояния и действий
interface TableState {
  mode: TableMode;
  tableType: TableType;
  setMode: (mode: TableMode) => void;
  setTableType: (tableType: TableType) => void;
}

export const useTableStore = create<TableState>((set) => ({
  mode: 'edit',
  tableType: 'main',
  setMode: (newMode) => {
    set({ mode: newMode });
  },
  setTableType: (newType) => {
    set({ tableType: newType });
    // if(newType === 'extra'){
    //   set({ mode: 'move' });
    // }
  },
}));
