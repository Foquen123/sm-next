
import { SignalType } from '@/types/signal';
import styles from './TableSideNumericCell.module.css';
import type { TableSideNumericCellProps } from './TableSideNumericCell.props';


const getClasses = (type: SignalType) => {
  if (type === 'attention') return `${styles['grid-cell']} ${styles['attention']}`;
  if (type === 'warning') return `${styles['grid-cell']} ${styles['warning']}`;
  if (type === 'normal') return `${styles['grid-cell']} ${styles['normal']}`;
};

function TableSideNumericCell({ number, type }: TableSideNumericCellProps) {
  return (
    <div className={getClasses(type)}>
      {number}
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle className={styles['circle-stroke']} cx="30" cy="30" r="28" stroke="#FFB0B0" strokeWidth="4" />
        <path className={styles['path']} d="M26 7H34L32.6667 40H27.3333L26 7Z" fill="#FFB0B0" />
        <circle className={styles['circle-fill']} cx="30" cy="49" r="4" fill="#FFB0B0" />
      </svg>

    </div>
  );
}

export default TableSideNumericCell;