import styles from './TeacherPattern.module.css';
import type { TeacherPatternProps } from './TeacherPattern.props';

function TeacherPattern({ pattern, color, count = 3 }: TeacherPatternProps) {
  // const patternStore = usePatternStore(store => store);
  return (
    <div className={styles['container']}>
      {Array.from({ length: count }, (_, i) => {
        return <div key={i} className={styles['wrapper']}>
          {pattern.name === 'rect' && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="12" height="12" fill={color} />
          </svg>
          }
          {pattern.name === 'ellipse' && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="6" r="6" fill={color} />
          </svg>
          }
          {pattern.name === 'star' && <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.70654 0L7.68855 3.27199L11.4129 4.1459L8.91351 7.04201L9.23325 10.8541L5.70654 9.372L2.17983 10.8541L2.49958 7.04201L0.000204086 4.1459L3.72453 3.27199L5.70654 0Z" fill={color} />
          </svg>
          }
        </div>;
      })}
    </div>
  );
}

export default TeacherPattern;