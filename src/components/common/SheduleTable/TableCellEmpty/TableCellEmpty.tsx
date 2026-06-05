import styles from './TableCellEmpty.module.css';
import type { TableCellEmptyProps } from './TableCellEmpty.props';

function TableCellEmpty({ onClick }: TableCellEmptyProps) {
  return (
    <div onClick={onClick} className={styles['cell']} >
      <div className={styles['plus']}>
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" width="20" height="60" rx="7" fill="#E6E6E6" />
          <rect x="60" y="20" width="20" height="60" rx="7" transform="rotate(90 60 20)" fill="#E6E6E6" />
        </svg>

      </div>
    </div>
  );
}

export default TableCellEmpty;