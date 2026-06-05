import { useEffect, useRef, useState } from 'react';
import styles from './Select.module.css';
import type { SelectOption, SelectProps } from './Select.props';

function Select({ options, onChange, placeholder, selectedId }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | undefined>();

  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedOption(options.find(opt => opt.id === selectedId));
  }, [selectedId]);

  const handleSelect = (option: SelectOption) => {
    setSelectedOption(option);
    onChange(option.id);
    setIsOpen(false);
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const parent = selectRef.current?.parentElement;
    document.addEventListener('mousedown', handleClickOutside);
    parent?.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      parent?.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div ref={selectRef} className={styles['select']}>
      {/* Головной селект */}
      <div
        className={isOpen ? `${styles['select-head']} ${styles['select-head--opened']}` : `${styles['select-head']}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption?.content || <div className={styles['placeholder']}>{placeholder}</div>}
        <svg width="16" height="28" viewBox="0 0 16 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles['arrow']}>
          <g clipPath="url(#clip0_72_37)">
            <path d="M12.6299 1.42658L1.4188 12.6377C0.637748 13.4188 0.633165 14.6897 1.41421 15.4707L12.5463 26.6028C13.8038 27.8603 15.9542 26.974 15.9605 25.1956L16.0394 2.85262C16.0457 1.06741 13.8923 0.164244 12.6299 1.42658Z" fill="#E6E6E6" />
          </g>
          <defs>
            <clipPath id="clip0_72_37">
              <rect width="28" height="16" fill="white" transform="matrix(0 1 -1 0 16 0)" />
            </clipPath>
          </defs>
        </svg>
      </div>

      {/* Выпадающее меню */}
      { (
        <div className={ isOpen ? `${styles['options']} ${styles['options--open']}` : `${styles['options']}`}>
          {options.map((option) => (
            <div
              key={option.id}
              className={option.id === selectedOption?.id ? `${styles['option']} ${styles['option--choosen']}` : `${styles['option']}`}
              onClick={() => handleSelect(option)}
            >
              {option.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );

}

export default Select;