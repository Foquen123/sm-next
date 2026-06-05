import type { ReactNode } from 'react';
import styles from './TableHeadEmpty.module.css';

function TableHeadEmpty({ children }: { children?: ReactNode }) {
  return (
    <div className={styles['head-cell']}>
      {children}
    </div>
  );
}

export default TableHeadEmpty;