import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './ActionButton.module.css';
export type ActionButtonType = 'default' | 'edit' | 'delete';
const getClasses = (buttonType: ActionButtonType): string => {
  let classesString = '';
  if (buttonType === 'default') {
    classesString += `${styles['button']} `;
    classesString += `${styles['button-default']} `;
  } else if (buttonType === 'delete') {
    classesString += `${styles['button']} `;
    classesString += `${styles['button-delete']} `;
  } else if (buttonType === 'edit') {
    classesString += `${styles['button']} `;
    classesString += `${styles['button-edit']} `;
  }
  return classesString;
};

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  buttonType: ActionButtonType;
}

function ActionButton({
  children,
  buttonType = 'default',
  ...props
}: ActionButtonProps) {
  return (
    <button {...props} className={getClasses(buttonType)}>
      {children}
    </button>
  );
}

export default ActionButton;
