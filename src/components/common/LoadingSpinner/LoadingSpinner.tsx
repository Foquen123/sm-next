

import styles from './LoadingSpinner.module.css';
// import type { } from './.props';

function LoadingSpinner() {
  return (
    <div className={styles['spinner-container']}>
      <div className={styles['spinner']} />
    </div>
  );
}

export default LoadingSpinner;