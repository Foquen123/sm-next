import { useTableStore } from '@/store/useTableStore';
import TeacherPattern from '../../TeacherPattern/TeacherPattern';
import styles from './TableCell.module.css';
import type { TableCellProps } from './TableCell.props';
import { memo, useDeferredValue } from 'react';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { useMutationState } from '@tanstack/react-query';
import { queries } from '@/config/query-keys';
import { useDeleteScheduleCell } from '@/hooks/useScheduleCellMutation';

// function TableCell({ color, subjectName, onEdit, onRemove }: TableCellProps) {
const TableCell = memo(function TableCell({
  tableCell,
  draggedCell,
  dragOverCell,
  onEdit,
  onAdd,
  ...props
}: TableCellProps) {
  // const [isEmpty, setIsEmpty] = useState<boolean>(tableCell.isEmpty);
  // console.log(tableCell.isEmpty);
  const { mode, tableType } = useTableStore();
  const deferredMode = useDeferredValue(mode);
  // const isStale = deferredMode !== mode;
  // if(isStale) return <LoadingSpinner></LoadingSpinner>
  // if(isStale) return <div></div>
  const mutations = useMutationState({
    filters: {
      mutationKey: queries.scheduleCells.detail(tableCell.id),
      status: 'pending',
    },
    select: (mutation) => mutation.state.status,
  });
  const { mutate: deleteScheduleCell } = useDeleteScheduleCell(
    tableCell.id,
    tableType,
  );
  const isPending = mutations.length > 0;
  if (isPending) return <LoadingSpinner></LoadingSpinner>;

  if (!tableCell) return null;

  // console.log('rerender');

  const getCellClasses = (): string => {
    const classes = [styles.cell];

    if (draggedCell && tableCell && draggedCell?.id === tableCell.id) {
      classes.push(styles.dragging);
    }

    if (draggedCell && tableCell && dragOverCell?.id === tableCell.id) {
      classes.push(styles['drag-over']);
    }

    if (draggedCell && tableCell && draggedCell.classId !== tableCell.classId) {
      classes.push(styles.disabled);
    }

    if (deferredMode === 'edit') {
      classes.push(styles['edit']);
    }

    if (deferredMode === 'move') {
      classes.push(styles['move']);
    }

    return classes.join(' ');
  };

  return (
    <>
      {tableCell.lesson1 && tableCell.lesson2 && (
        <div
          {...props}
          draggable={deferredMode === 'move'}
          className={getCellClasses()}
        >
          <div className={styles['cell-inner-double']}>
            <div className={styles['double-lesson']}>
              <div
                className={styles['color-rect']}
                style={{
                  backgroundColor: `${tableCell.lesson1?.teacher.color}`,
                }}
              >
                <TeacherPattern
                  color={tableCell.lesson1.teacher.patternColor}
                  pattern={tableCell.lesson1.teacher.pattern}
                ></TeacherPattern>
              </div>
              <div className={styles['title']}>
                {tableCell.lesson1?.subject.name}
              </div>
            </div>
            <div className={styles['double-lesson']}>
              <div
                className={styles['color-rect']}
                style={{
                  backgroundColor: `${tableCell.lesson2?.teacher.color}`,
                }}
              >
                <TeacherPattern
                  color={tableCell.lesson2.teacher.patternColor}
                  pattern={tableCell.lesson2.teacher.pattern}
                ></TeacherPattern>
              </div>
              <div className={styles['title']}>
                {tableCell.lesson2?.subject.name}
              </div>
            </div>
          </div>
          <div className={styles['options']}>
            <div className={styles['row']}>
              <button
                className={`${styles['button']} ${styles['button--green']}`}
                onClick={onEdit}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10216 21.5 2.49998C21.8978 2.89781 22.1213 3.43737 22.1213 3.99998C22.1213 4.56259 21.8978 5.10216 21.5 5.49998L12 15L8 16L9 12L18.5 2.49998Z"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className={`${styles['button']} ${styles['button--red']}`}
                onClick={() =>
                  deleteScheduleCell({ data: { id: tableCell.id } })
                }
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 6H5H21"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <button className={styles['freeze-btn']}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 19.5835V14.7918V12.7668"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M10 7.23341V5.20841V0.416748"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M13.1919 2.01685L10.0003 5.20851L6.80859 2.01685"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M6.80859 17.9834L10.0003 14.7917L13.1919 17.9834"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M18.2999 14.7916L14.1499 12.4L12.3999 11.3833"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M7.60853 8.61683L5.8502 7.6085L1.7002 5.2085"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M4.6834 3.2417L5.85006 7.60837L1.4834 8.77503"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M15.3166 16.7584L14.1499 12.4001L18.5166 11.2251"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M1.7002 14.7916L5.8502 12.4L7.60853 11.3833"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M12.3999 8.61683L14.1499 7.6085L18.2999 5.2085"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M15.3166 3.2417L14.1499 7.60837L18.5166 8.77503"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M4.6834 16.7584L5.85006 12.4001L1.4834 11.2251"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M12.4001 8.61673V11.3834L10.0001 12.7667L7.6084 11.3834V8.61673L10.0001 7.2334L12.4001 8.61673Z"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      {tableCell.lesson1 && tableCell.lesson2 === null && (
        <div
          {...props}
          draggable={deferredMode === 'move'}
          className={getCellClasses()}
        >
          <div className={styles['cell-inner']}>
            <div
              className={styles['color-rect']}
              style={{ backgroundColor: `${tableCell.lesson1?.teacher.color}` }}
            >
              <TeacherPattern
                color={tableCell.lesson1.teacher.patternColor}
                pattern={tableCell.lesson1.teacher.pattern}
              ></TeacherPattern>
            </div>
            <div className={styles['title']}>
              {tableCell.lesson1?.subject.name}
            </div>
          </div>
          <div className={styles['options']}>
            <div className={styles['row']}>
              <button
                className={`${styles['button']} ${styles['button--green']}`}
                onClick={onEdit}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10216 21.5 2.49998C21.8978 2.89781 22.1213 3.43737 22.1213 3.99998C22.1213 4.56259 21.8978 5.10216 21.5 5.49998L12 15L8 16L9 12L18.5 2.49998Z"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className={`${styles['button']} ${styles['button--red']}`}
                onClick={() =>
                  deleteScheduleCell({ data: { id: tableCell.id } })
                }
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 6H5H21"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <button className={styles['freeze-btn']}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 19.5835V14.7918V12.7668"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M10 7.23341V5.20841V0.416748"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M13.1919 2.01685L10.0003 5.20851L6.80859 2.01685"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M6.80859 17.9834L10.0003 14.7917L13.1919 17.9834"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M18.2999 14.7916L14.1499 12.4L12.3999 11.3833"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M7.60853 8.61683L5.8502 7.6085L1.7002 5.2085"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M4.6834 3.2417L5.85006 7.60837L1.4834 8.77503"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M15.3166 16.7584L14.1499 12.4001L18.5166 11.2251"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M1.7002 14.7916L5.8502 12.4L7.60853 11.3833"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M12.3999 8.61683L14.1499 7.6085L18.2999 5.2085"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M15.3166 3.2417L14.1499 7.60837L18.5166 8.77503"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M4.6834 16.7584L5.85006 12.4001L1.4834 11.2251"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
                <path
                  d="M12.4001 8.61673V11.3834L10.0001 12.7667L7.6084 11.3834V8.61673L10.0001 7.2334L12.4001 8.61673Z"
                  stroke="white"
                  strokeWidth="1.92"
                  strokeMiterlimit="10"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      {tableCell.isEmpty && (
        <div
          {...props}
          // draggable={deferredMode === 'move'}
          className={getCellClasses()}
        >
          <div className={styles['plus']} onClick={onAdd}>
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="20" width="20" height="60" rx="7" fill="#E6E6E6" />
              <rect
                x="60"
                y="20"
                width="20"
                height="60"
                rx="7"
                transform="rotate(90 60 20)"
                fill="#E6E6E6"
              />
            </svg>
          </div>
        </div>
      )}
    </>
  );
});

export default TableCell;
