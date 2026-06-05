import type {} from 'react';
import styles from './Input.module.css';

import type { InputHTMLAttributes } from 'react';

export type InputSize = 'standard' | 'big';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize: InputSize;
}

const getInputClasses = (inputSize: InputSize) => {
  return inputSize === 'standard'
    ? `${styles['input']}`
    : `${styles['input']} ${styles['input--big']}`;
};

function Input({ inputSize, ...props }: InputProps) {
  const classes = getInputClasses(inputSize);
  return <input className={classes} {...props} type="text" />;
}

export default Input;
