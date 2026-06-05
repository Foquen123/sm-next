import type { ReactNode } from 'react';
import styles from './Title.module.css';

interface TitleProps {
  children: ReactNode;
}

function Title({ children }: TitleProps) {
  return (
    <h1 className={styles['title']} >{children}</h1>
  );
}

export default Title;