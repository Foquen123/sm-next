// 'use client'

import styles from './SubjectsSelector.module.css';
import { useRef, useState } from 'react';
import type { SubjectsSelectorProps } from './SubjectsSelector.props';
import SubjectCard from '../SubjectCard/SubjectCard';
import { useSubject } from '@/hooks/useSubject';

function SubjectsSelector({
  teacherSubjects,
  onChange,
}: SubjectsSelectorProps) {
  // const subjectsStore = useSubjectStore(store => store);
  const { data: subjects } = useSubject();
  // const currentTeacher = teacherStore.getTeacherById(teacherId);
  // const teacherSubjects = currentTeacher?.subjects;
  const [isOpen, setIsOpen] = useState(false);

  const selectRef = useRef<HTMLDivElement>(null);

  const isInTeacherArray = (subId: number): boolean => {
    const finded = teacherSubjects.find((t) => subId === t.id);
    return !!finded;
  };

  if(!subjects) return null;
  return (
    <div className={styles['container']}>
      {teacherSubjects && teacherSubjects.length > 0 && (
        <div className={styles['subjects-list']}>
          {teacherSubjects?.map((s) => (
            <SubjectCard
              isChoosen={false}
              hover="delete"
              key={s.id}
              onClick={() => {
                onChange(s.id);
              }}
            >
              {s.name}
            </SubjectCard>
          ))}
        </div>
      )}
      <div ref={selectRef} className={styles['select']}>
        {/* Головной селект */}
        <div
          className={
            isOpen
              ? `${styles['select-head']} ${styles['select-head--opened']}`
              : `${styles['select-head']}`
          }
          onClick={() => setIsOpen(!isOpen)}
        >
          {<div className={styles['placeholder']}>Выберете предметы</div>}
          <svg
            width="16"
            height="28"
            viewBox="0 0 16 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles['arrow']}
          >
            <g clipPath="url(#clip0_72_37)">
              <path
                d="M12.6299 1.42658L1.4188 12.6377C0.637748 13.4188 0.633165 14.6897 1.41421 15.4707L12.5463 26.6028C13.8038 27.8603 15.9542 26.974 15.9605 25.1956L16.0394 2.85262C16.0457 1.06741 13.8923 0.164244 12.6299 1.42658Z"
                fill="#E6E6E6"
              />
            </g>
            <defs>
              <clipPath id="clip0_72_37">
                <rect
                  width="28"
                  height="16"
                  fill="white"
                  transform="matrix(0 1 -1 0 16 0)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Выпадающее меню */}
        {
          <div
            className={
              isOpen
                ? `${styles['options']} ${styles['options--open']}`
                : `${styles['options']}`
            }
          >
            {subjects.map((s) => (
              <SubjectCard
                isChoosen={isInTeacherArray(s.id)}
                hover="add"
                key={s.id}
                onClick={() => {
                  onChange(s.id);
                }}
              >
                {s.name}
              </SubjectCard>
            ))}
          </div>
        }
      </div>
    </div>
  );
}

export default SubjectsSelector;
