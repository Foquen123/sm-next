'use client';

import {
  memo,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type DragEvent,
} from 'react';
import styles from './Table.module.css';
import TableHead from '../TableHead/TableHead';
import TableHeadEmpty from '../TableHeadEmpty/TableHeadEmpty';
import TableCell from '../TableCell/TableCell';
import Switch from 'react-switch';
import TableSideNumericCell from '../TableSideNumericCell/TableSideNumericCell';
import checkShedule from './checkShedule';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { TableType } from '@/types/table-type';
import { getCurrentDayIndex } from '@/lib/date-utils';
import { SignalType } from '@/types/signal';
import { DAYS_OF_WEEK, ROWS_COUNT } from '@/config/global_constants';
import { ScheduleCellRead } from '@/interfaces/schedule-cell';
import { ClassRead } from '@/interfaces/class';
import EditClassModal from '../EditClassModal/EditClassModal';
import {
  useCreateClass,
  useDeleteClass,
  useUpdateClassOrders,
} from '@/hooks/useClassMutation';
import {
  useDeleteScheduleCell,
  useSwapScheduleCell,
} from '@/hooks/useScheduleCellMutation';
import { useClass } from '@/hooks/useClass';
import { useScheduleCell } from '@/hooks/useScheduleCell';
import EditSheduleCellModal from '../EditSheduleCellModal/EditSheduleCellModal';
import { useTableStore } from '@/store/useTableStore';

function SwitchContainer() {
  const { mode, setMode } = useTableStore();
  const [isPending, startTransition] = useTransition();
  const [optimisticMode, setOptimisticMode] = useState(mode);

  const handleModeChange = () => {
    const newMode = mode === 'edit' ? 'move' : 'edit';
    // const newMode = optimisticMode === 'edit' ? 'move' : 'edit';

    setOptimisticMode(newMode);
    // Асинхронно обновляем стор, но skip-аем синхронный рендер
    setTimeout(() => {
      startTransition(() => {
        setMode(newMode);
      });
    }, 0);
  };
  return (
    <TableHeadEmpty>
      <Switch
        uncheckedIcon={false}
        checkedIcon={false}
        width={100}
        height={40}
        handleDiameter={35}
        // checked={mode === 'edit'}
        checked={optimisticMode === 'edit'}
        // checked={test}
        onChange={
          // () => {
          //   if (mode === 'edit') setMode('move');
          //   else setMode('edit');
          // }
          // setTest((prev) => !prev)
          handleModeChange
        }
      ></Switch>
    </TableHeadEmpty>
  );
}

function WeekDayContainer({
  dayOfWeek,
  decreaseDay,
  increaseDay,
}: {
  increaseDay: () => void;
  decreaseDay: () => void;
  dayOfWeek: number;
}) {
  return (
    <div className={`${styles['week-day-container']} ${styles['']}`}>
      <button
        onClick={decreaseDay}
        className={`${styles['change-day-btn']} ${styles['change-day-btn--up']}`}
      >
        <svg
          width="46"
          height="23"
          viewBox="0 0 46 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles['arrow-icon']}
        >
          <g clipPath="url(#clip0_100_686)">
            <path
              d="M40.9644 17.9926L25.1008 2.129C23.9292 0.957425 22.0221 0.949754 20.8505 2.12133L5.09585 17.876C3.20957 19.7622 4.53898 22.9878 7.20657 22.9973L38.8275 23.109C41.5054 23.1184 42.8579 19.8861 40.9644 17.9926Z"
              fill="#E6E6E6"
            />
          </g>
          <defs>
            <clipPath id="clip0_100_686">
              <rect
                width="46"
                height="23"
                fill="white"
                transform="matrix(-1 0 0 -1 46 23)"
              />
            </clipPath>
          </defs>
        </svg>
      </button>
      <span className={styles['day-name']}>
        {DAYS_OF_WEEK[dayOfWeek].short}
      </span>
      <button
        onClick={increaseDay}
        className={`${styles['change-day-btn']} ${styles['change-day-btn--down']}`}
      >
        <svg
          width="46"
          height="23"
          viewBox="0 0 46 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_100_688)">
            <path
              d="M5.0356 5.00741L20.8992 20.871C22.0708 22.0426 23.9779 22.0502 25.1495 20.8787L40.9041 5.12404C42.7904 3.23775 41.461 0.0121588 38.7934 0.00273544L7.17246 -0.108962C4.49465 -0.118421 3.14209 3.1139 5.0356 5.00741Z"
              fill="#E6E6E6"
            />
          </g>
          <defs>
            <clipPath id="clip0_100_688">
              <rect width="46" height="23" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </button>
    </div>
  );
}

const TableContent = memo(function TableContent({
  classes,
  openEditClassModal,
  weeklySchedule,
  openEditScheduleCellModal,
  dayOfWeek,
}: {
  dayOfWeek: number;
  classes: ClassRead[];
  openEditClassModal: (value: number) => void;
  weeklySchedule: ScheduleCellRead[];
  openEditScheduleCellModal: (value: ScheduleCellRead) => void;
}) {
  const { tableType } = useTableStore();
  const { mutate: deleteClass } = useDeleteClass();
  const { mutate: updateClassOrders } = useUpdateClassOrders();
  const { mutate: swapScheduleCell } = useSwapScheduleCell(tableType);

  const deferredDayOfWeek = useDeferredValue(dayOfWeek);

  const [draggedCell, setDraggedCell] = useState<ScheduleCellRead | null>(null);
  const [dragOverCell, setDragOverCell] = useState<ScheduleCellRead | null>(
    null,
  );

  const headerHandleDragStart = (e: DragEvent, columnIndex: number) => {
    e.dataTransfer.setData('columnIndex', columnIndex.toString());
  };

  const headerAllowDrop = (e: DragEvent) => {
    e.preventDefault();
  };

  const headerHandleDragOver = (e: DragEvent, columnIndex: number) => {
    e.preventDefault();
    const dragIndex = e.dataTransfer.getData('columnIndex');
    if (dragIndex !== columnIndex.toString() && classes) {
      const newColumns = [...classes];
      newColumns[Number(dragIndex)].displayOrder = columnIndex;
      newColumns[Number(columnIndex)].displayOrder = Number(dragIndex);
      newColumns.sort((a, b) => a.displayOrder - b.displayOrder);

      updateClassOrders({ data: newColumns });
    }
  };

  // =======================================================

  const handleDragStart = (e: React.DragEvent, cell: ScheduleCellRead) => {
    setDraggedCell(cell);
    e.dataTransfer.setData('text/plain', String(cell.id));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, cell: ScheduleCellRead) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (draggedCell && draggedCell.classId === cell.classId) {
      setDragOverCell(cell);
    }
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = (e: React.DragEvent, targetCell: ScheduleCellRead) => {
    e.preventDefault();

    if (!draggedCell) return;

    if (
      draggedCell.classId === targetCell.classId &&
      draggedCell.id !== targetCell.id
    ) {
      // Меняем местами ячейки
      // sheduleStore.moveCell(draggedCell, targetCell);
      swapScheduleCell({ cell: draggedCell, targetCell: targetCell });
    }
    setDraggedCell(null);
    setDragOverCell(null);
  };

  const handleDragEnd = () => {
    setDraggedCell(null);
    setDragOverCell(null);
  };

  if (deferredDayOfWeek !== dayOfWeek) return null;

  return (
    <>
      {Array.from({ length: classes.length }, (_, i) => {
        return Array.from({ length: ROWS_COUNT }, (_, j) => {
          if (j === 0) {
            console.log('rerender');
            const currentClassId = classes[i].id;
            return (
              <TableHead
                // mode={tableType === 'extra' ? 'move' : mode}
                onEdit={() => openEditClassModal(currentClassId)}
                onRemove={() => {
                  deleteClass({
                    data: { id: currentClassId },
                  });
                }}
                key={`${i}-${j}`}
                // draggable={mode === 'move' || tableType === 'extra'}
                onDragStart={(e) => headerHandleDragStart(e, i)}
                onDragOver={headerAllowDrop}
                onDrop={(e) => {
                  headerHandleDragOver(e, i);
                }}
                classname={classes[i].name}
                mainTeacher={classes[i].teacher.lastName}
              />
            );
          } else {
            const currentCell = weeklySchedule.find(
              (c) =>
                classes.find((cls) => cls.id === c.classId)?.displayOrder ===
                  i &&
                c.orderInDay === j - 1 &&
                // c.dayOfWeek === dayOfWeek,
                c.dayOfWeek === deferredDayOfWeek,
            );
            if(!currentCell) return null;
            return (
              <TableCell
                key={`${i}-${j}`}
                // mode={mode}

                dragOverCell={dragOverCell}
                draggedCell={draggedCell}
                // draggable={mode === 'move'}
                onDragStart={(e) => handleDragStart(e, currentCell)}
                onDragOver={(e) => handleDragOver(e, currentCell)}
                onDrop={(e) => handleDrop(e, currentCell)}
                onDragLeave={handleDragLeave}
                onDragEnd={handleDragEnd}
                onEdit={() => openEditScheduleCellModal(currentCell)}
                tableCell={currentCell}
                onAdd={() => {
                  openEditScheduleCellModal(currentCell);
                }}
              />
            );
          }
        });
      })}
    </>
  );
});

function Table({
  changeDayOfWeek,
}: {
  changeDayOfWeek: (dayIndex: number) => void;
}) {
  const { data: classes, isLoading: classesLoading } = useClass();
  const { tableType } = useTableStore();
  const {
    data: weeklyShedule,
    refetch,
    isLoading: scheduleLoading,
  } = useScheduleCell(tableType);
  const { mutate: createClass } = useCreateClass();

  const [editCellModalActive, setEditCellModalActive] = useState(false);
  const [editClassModalActive, setEditClassModalActive] = useState(false);

  const [selectedCell, setSelectedCell] = useState<ScheduleCellRead | null>(
    null,
  );
  const [selectedClass, setSelectedClass] = useState<ClassRead | null>(null);

  const [dayOfWeek, setDayOfWeek] = useState<number>(getCurrentDayIndex());

  useEffect(() => {
    changeDayOfWeek(dayOfWeek);
  }, [dayOfWeek]);

  const openEditScheduleCellModal = (cell: ScheduleCellRead) => {
    setSelectedCell(cell);
    setEditCellModalActive(true);
  };

  const openEditClassModal = (id: number) => {
    const cls = classes?.find((c) => c.id === id);
    if (cls) {
      setSelectedClass(cls);
      setEditClassModalActive(true);
    }
  };

  const increaseDay = () => {
    setDayOfWeek((prev) => {
      if (prev === DAYS_OF_WEEK.length - 1) {
        return prev;
      }
      return prev + 1;
    });
  };

  const decreaseDay = () => {
    setDayOfWeek((prev) => {
      if (prev === 0) {
        return prev;
      }
      return prev - 1;
    });
  };

  const signalsDay: SignalType[] = useMemo(() => {
    if (weeklyShedule && classes) {
      const signals = checkShedule(
        weeklyShedule.filter((c) => c.dayOfWeek === dayOfWeek),
        ROWS_COUNT - 1,
        classes.length,
        classes,
      );
      return signals;
    } else {
      return [];
    }
  }, [weeklyShedule, classes, dayOfWeek]);

  if (scheduleLoading || classesLoading)
    return <LoadingSpinner></LoadingSpinner>;
  return (
    <>
      {classes && weeklyShedule && (
        <div>
          <div className={styles['table-container']}>
            <div
              className={styles['grid-table']}
              style={{
                gridTemplateColumns: '125px 104px ',
              }}
            >
              <SwitchContainer></SwitchContainer>
              {/*  */}
              <WeekDayContainer
                dayOfWeek={dayOfWeek}
                decreaseDay={decreaseDay}
                increaseDay={increaseDay}
              ></WeekDayContainer>

              <TableHeadEmpty>
                {tableType === 'main' && (
                  <button
                    onClick={() => {
                      createClass(undefined, {
                        onSuccess: () => {
                          console.log('refetch cells');
                          refetch();
                        },
                      });
                    }}
                    className={styles['add-column-btn']}
                  >
                    <svg
                      width="50"
                      height="50"
                      viewBox="0 0 50 50"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M25 45.8333C36.5059 45.8333 45.8333 36.5059 45.8333 25C45.8333 13.4941 36.5059 4.16666 25 4.16666C13.4941 4.16666 4.16666 13.4941 4.16666 25C4.16666 36.5059 13.4941 45.8333 25 45.8333Z"
                        stroke="#0051FF"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M25 16.6667V33.3333"
                        stroke="#0051FF"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16.6667 25H33.3333"
                        stroke="#0051FF"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </TableHeadEmpty>

              {signalsDay.map((s, i) => (
                <TableSideNumericCell
                  key={i}
                  number={i + 1}
                  type={s}
                ></TableSideNumericCell>
              ))}
            </div>
            <div className={styles['table-inner']}>
              <div
                className={styles['grid-table']}
                style={{
                  gridTemplateColumns: Array.from(
                    { length: classes.length },
                    () => '111px',
                  ).join(' '),
                }}
              >
                {/* {tableContent} */}
                <TableContent
                  classes={classes}
                  dayOfWeek={dayOfWeek}
                  // dayOfWeek={1}
                  openEditClassModal={openEditClassModal}
                  openEditScheduleCellModal={openEditScheduleCellModal}
                  weeklySchedule={weeklyShedule}
                ></TableContent>
              </div>
            </div>
          </div>
        </div>
      )}

      <EditClassModal
        cls={selectedClass}
        isOpen={editClassModalActive}
        onClose={() => setEditClassModalActive(false)}
      ></EditClassModal>

      <EditSheduleCellModal
        sheduleCell={selectedCell}
        isOpen={editCellModalActive}
        onClose={() => setEditCellModalActive(false)}
      ></EditSheduleCellModal>
    </>
  );
}

export default Table;
