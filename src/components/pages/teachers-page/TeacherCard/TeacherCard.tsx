import ActionButton from '@/components/common/ActionButton/ActionButton';
import TeacherPattern from '../../../common/TeacherPattern/TeacherPattern';
import styles from './TeacherCard.module.css';
import type { TeacherCardProps } from './TeacherCard.props';

function TeacherCard({ teacher, onEdit, onDelete }: TeacherCardProps) {
  return (
    <div className={styles['container']}>
      <div
        className={styles['color-rect']}
        style={{ backgroundColor: `${teacher.color}` }}
      >
        <TeacherPattern
          color={teacher.patternColor}
          pattern={teacher.pattern}
          count={3}
        ></TeacherPattern>
      </div>
      <span className={styles['name']}>{teacher.lastName}</span>
      {/* <button onClick={onEdit} className={styles['button']}>Редактировать</button> */}
      {/* <button onClick={onDelete} className={styles['delete-btn']}>Удалить</button> */}
      <ActionButton buttonType="edit" onClick={onEdit}>
        Редактировать
      </ActionButton>
      <ActionButton buttonType="delete" onClick={onDelete}>
        Удалить
      </ActionButton>
    </div>
  );
}

export default TeacherCard;
