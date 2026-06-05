import ActionButton from '../ActionButton/ActionButton';
import styles from './ListItemCard.module.css';
import type { ListItemCardProps } from './ListItemCard.props';

function ListItemCard({ children, onRemove }: ListItemCardProps) {
  return (
    <div className={styles['card']}>
      <span className={styles['text']}>{children}</span>
      {/* <button onClick={onRemove} className={styles['delete-btn']}>Удалить</button> */}
      <ActionButton buttonType="delete" onClick={onRemove}>
        Удалить
      </ActionButton>
    </div>
  );
}

export default ListItemCard;
