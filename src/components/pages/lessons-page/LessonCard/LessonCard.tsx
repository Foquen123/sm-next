import ActionButton from '@/components/common/ActionButton/ActionButton';
import TeacherPattern from '../../../common/TeacherPattern/TeacherPattern';
import styles from './LessonCard.module.css';
import type { LessonCardProps } from './LessonCard.props';

function LessonCard({ lesson, onEdit, onDelete }: LessonCardProps) {
  return (
    <div className={styles['container']}>
      <span className={styles['subject']}>{lesson.subject.name}</span>
      <span className={styles['classroom']}>{lesson.classroom.name}</span>
      <div className={styles['separator']}></div>
      <div
        className={styles['color-rect']}
        style={{ backgroundColor: `${lesson.teacher.color}` }}
      >
        <TeacherPattern
          color={lesson.teacher.patternColor}
          pattern={lesson.teacher.pattern}
        ></TeacherPattern>
      </div>
      <span className={styles['name']}>{lesson.teacher.lastName}</span>
      <ActionButton buttonType="edit" onClick={onEdit}>
        Редактировать
      </ActionButton>
      <ActionButton buttonType="delete" onClick={onDelete}>
        Удалить
      </ActionButton>
    </div>
  );
}

export default LessonCard;
