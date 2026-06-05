'use client';

import { useEffect, useState } from 'react';
import styles from './EditSheduleCellModal.module.css';
import type { EditSheduleCellModalProps } from './EditSheduleCellModal.props';
import type { SelectOption } from '../../Select/Select.props';
import Select from '../../Select/Select';
import ActionButton from '../../ActionButton/ActionButton';
import TeacherPattern from '../../TeacherPattern/TeacherPattern';
import Modal from '../../Modal/Modal';
import { useQuery } from '@tanstack/react-query';
import { lessonsReadAll } from '@/actions/lesson';
import { useLesson } from '@/hooks/useLesson';
import {
  useCreateScheduleCell,
  useUpdateScheduleCell,
} from '@/hooks/useScheduleCellMutation';
import { useTableStore } from '@/store/useTableStore';

function EditSheduleCellModal({
  isOpen,
  sheduleCell,
  onClose,
}: EditSheduleCellModalProps) {
  // const currentSheduleCell = sheduleStore.getSheduleCellById(sheduleCellId);
  // const currentLesson1 = currentSheduleCell?.lesson1;
  // const currentLesson2 = currentSheduleCell?.lesson2;

  const { tableType } = useTableStore();
  const [lesson1Id, setLesson1Id] = useState<number>(
    sheduleCell?.lesson1?.id || -1,
  );
  const [lesson2Id, setLesson2Id] = useState<number | null>(
    sheduleCell?.lesson2?.id || null,
  );

  const { data: lessons } = useLesson();
  const { mutate: updateCell } = useUpdateScheduleCell(
    sheduleCell?.id || -1,
    tableType,
  );
  const { mutate: createCell } = useCreateScheduleCell(
    sheduleCell?.id || -1,
    tableType,
  );

  useEffect(() => {
    if (sheduleCell) {
      console.log(sheduleCell);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLesson1Id(sheduleCell?.lesson1?.id || -1);
      setLesson2Id(sheduleCell?.lesson2?.id || null);
    }
  }, [sheduleCell]);
  if (!lessons || !sheduleCell) return null;

  const editSheduleCell = () => {
    // if (lesson1Id) {
    //   const newLesson1 = lessonStore.getLessonById(lesson1Id);
    //   let newLesson2 = null;
    //   if (lesson2Id) {
    //     newLesson2 = lessonStore.getLessonById(lesson2Id);
    //   }
    //   sheduleStore.editCell(sheduleCellId, newLesson1, newLesson2);
    //   onClose();
    // }

    if (lesson1Id) {
      if (sheduleCell.isEmpty) {
        createCell({
          data: {
            classId: sheduleCell.classId,
            dayOfWeek: sheduleCell.dayOfWeek,
            lesson1Id: lesson1Id,
            lesson2Id: lesson2Id,
            orderInDay: sheduleCell.orderInDay,
            tableType: tableType,
          },
        });
      } else {
        updateCell({
          id: sheduleCell.id,
          data: { lesson1Id: lesson1Id, lesson2Id: lesson2Id },
        });
      }
      onClose();
    }
  };

  const lessonOptions: SelectOption[] = lessons.map((lesson) => {
    return {
      content: (
        <div className={styles['lesson-container']}>
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
        </div>
      ),
      id: lesson.id,
    };
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles['container']}>
        <h2 className={styles['title']}>Редактировать единицу расписания</h2>
        <div className={styles['selectors']}>
          {/* <Select onChange={(id) => { setTeacherId(id); }} options={teacherOptions} placeholder='Выберете учителя' selectedId={teacherId}></Select> */}
          <Select
            onChange={(id) => {
              setLesson1Id(id);
            }}
            options={lessonOptions}
            placeholder="Выберете первый урок"
            selectedId={lesson1Id}
          ></Select>
          {lesson1Id && (
            <Select
              onChange={(id) => {
                setLesson2Id(id);
              }}
              options={lessonOptions}
              placeholder="Выберете второй урок"
              selectedId={lesson2Id || undefined}
            ></Select>
          )}
        </div>

        <ActionButton buttonType="default" onClick={editSheduleCell}>
          Сохранить
        </ActionButton>
      </div>
    </Modal>
  );
}

export default EditSheduleCellModal;
