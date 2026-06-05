'use client';

import { useEffect, useState } from 'react';
import styles from './EditClassModal.module.css';
import type { EditClassModalProps } from './EditClassModal.props';
import type { SelectOption } from '../../Select/Select.props';
import ActionButton from '../../ActionButton/ActionButton';
import Input from '../../Input/Input';
import Select from '../../Select/Select';
import TeacherPattern from '../../TeacherPattern/TeacherPattern';
import Modal from '../../Modal/Modal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { classesReadAll, classesReadOne, classesUpdate } from '@/actions/class';
import { teachersReadAll } from '@/actions/teacher';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { ClassRead } from '@/interfaces/class';
import { useUpdateClass } from '@/hooks/useClassMutation';
import { useTeacher } from '@/hooks/useTeacher';

export default function EditClassModal({
  cls,
  isOpen,
  onClose,
}: EditClassModalProps) {
  const [className, setClassname] = useState<string>(cls?.name || '');
  const [teacherId, setTeacherId] = useState<number>(cls?.teacher.id || -1);

  useEffect(() => {
    if (cls) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClassname(cls.name);
      setTeacherId(cls.teacher.id);
    }
  }, [cls]);

  const { data: teachers, isLoading: teachersLoading } = useTeacher();

  const { mutate: updateClass } = useUpdateClass();

  if (teachersLoading) return <LoadingSpinner></LoadingSpinner>;

  if (!teachers || !cls) return null;

  const editClass = () => {
    if (className && teacherId) {
      // const newClass = classesStore.getClassById(classId);
      // const newTeacher = teacherStore.getTeacherById(teacherId);

      updateClass({
        id: cls.id,
        data: { name: className, teacherId: teacherId },
      });
      // classesStore.editClassbyId(classId, className, newTeacher);
      onClose();
    }
  };

  const teacherOptions: SelectOption[] = teachers.map((t) => {
    return {
      content: (
        <div className={styles['teacher-container']}>
          <div
            className={styles['color-rect']}
            style={{ backgroundColor: `${t.color}` }}
          >
            <TeacherPattern
              color={t.patternColor}
              pattern={t.pattern}
            ></TeacherPattern>
          </div>
          <div className={styles['name']}>{t.lastName}</div>
        </div>
      ),
      id: t.id,
    };
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles['container']}>
        <h2 className={styles['title']}>Изменить класс</h2>
        <Input
          inputSize="big"
          onChange={(e) => setClassname(e.target.value)}
          placeholder="Введите название класса"
          value={className === '?' ? '' : className}
        ></Input>
        <div className={styles['selectors']}>
          <Select
            onChange={(id) => {
              setTeacherId(id);
            }}
            options={teacherOptions}
            placeholder="Выберете учителя"
            selectedId={teacherId}
          ></Select>
        </div>

        <ActionButton
          buttonType="default"
          onClick={() => {
            editClass();
          }}
        >
          Сохранить
        </ActionButton>
      </div>
    </Modal>
  );
}
