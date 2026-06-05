import styles from './SubjectCard.module.css';
import type { SubjectCardProps } from './SubjectCard.props';

function SubjectCard({ children, onClick, hover, isChoosen }: SubjectCardProps) {
  return (
    <div onClick={onClick} className={isChoosen ? `${styles['card']} ${styles['is-choosen']}` : `${styles['card']}`}>
      {children}
      {hover === 'add' && <div className={styles['card-overlay--added']}>
        <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1.5" y="1.5" width="34" height="34" rx="17" stroke="#3D7BFF" strokeWidth="3" />
          <path d="M28.9809 10.9714L14.7725 25.1798L8.31421 18.7214" stroke="#3D7BFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>}
      {hover === 'delete' && <div className={styles['card-overlay--remove']}>
        <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.95">
            <path d="M18.5002 33.9166C27.0146 33.9166 33.9168 27.0143 33.9168 18.4999C33.9168 9.98553 27.0146 3.08325 18.5002 3.08325C9.98577 3.08325 3.0835 9.98553 3.0835 18.4999C3.0835 27.0143 9.98577 33.9166 18.5002 33.9166Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M23.125 13.875L13.875 23.125" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.875 13.875L23.125 23.125" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>}
    </div>
  );
}

export default SubjectCard;