import { useEffect, useState } from 'react';
import styles from './EditLessonModal.module.css';
import type { EditLessonModalProps } from './EditLessonModal.props';
import Modal from '@/components/common/Modal/Modal';
import ActionButton from '@/components/common/ActionButton/ActionButton';
import Select from '@/components/common/Select/Select';
import { SelectOption } from '@/components/common/Select/Select.props';
import { useTeacher } from '@/hooks/useTeacher';
import TeacherPattern from '@/components/common/TeacherPattern/TeacherPattern';
import { useClassroom } from '@/hooks/useClassroom';
import { LessonCreate } from '@/interfaces/lesson';
import { useCreateLesson, useUpdateLesson } from '@/hooks/useLessonMutation';

function EditLessonModal({ lesson, active, onClose }: EditLessonModalProps) {

  const [teacherId, setTeacherId] = useState<number | undefined>(
    lesson?.teacher?.id,
  );
  const [subjectId, setSubjectId] = useState<number | undefined>(
    lesson?.subject?.id,
  );
  const [classroomId, setClassroomId] = useState<number | undefined>(
    lesson?.classroom?.id,
  );
  const { data: teachers } = useTeacher();
  const { data: classrooms } = useClassroom();
  const { mutate: createLesson } = useCreateLesson();
  const { mutate: updateLesson } = useUpdateLesson();

  useEffect(() => {
    if (lesson) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTeacherId(lesson.teacher.id);
      setClassroomId(lesson.classroom.id);
      setSubjectId(lesson.subject.id);
    } else {
      setTeacherId(undefined);
      setClassroomId(undefined);
      setSubjectId(undefined);
    }
  }, [lesson]);

  const editLesson = () => {
    if (teacherId && subjectId && classroomId) {
      // const newTeacher = teacherStore.getTeacherById(teacherId);
      // const newSubject = subjectStore.getSubjectById(subjectId);
      // const newClassroom = classroomStore.getClassroomById(classroomId);

      const newLesson: LessonCreate = {
        classroomId: classroomId,
        subjectId: subjectId,
        teacherId: teacherId,
      };

      if (lesson) {
        updateLesson({ id: lesson.id, data: newLesson });
        onClose();
      } else {
        createLesson({ data: newLesson });
        setClassroomId(undefined);
        setSubjectId(undefined);
        setTeacherId(undefined);
        onClose();
      }
    }
  };

  if (!teachers || !classrooms) return null;

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

  const subjectOptions: SelectOption[] | undefined = teachers
    .find((t) => t.id === teacherId)
    ?.subjects?.map((s) => {
      return {
        content: <div className={styles['teacher-container']}>{s.name}</div>,
        id: s.id,
      };
    });
  // const subjectOptions: SelectOption[] = subjectStore.subjects.map(s => {
  //   return ({
  //     content:
  //       (<div className={styles['teacher-container']}>{s.name}</div>),
  //     id: s.id
  //   });
  // });

  const classroomOptions: SelectOption[] = classrooms.map((c) => {
    return {
      content: <div className={styles['teacher-container']}>{c.name}</div>,
      id: c.id,
    };
  });

  const onTeacherChange = (id: number) => {
    setTeacherId(id);
    setSubjectId(undefined);
  };

  return (
    <Modal isOpen={active} onClose={onClose}>
      <div className={styles['container']}>
        <h2 className={styles['title']}>
          {lesson ? 'Редактировать урок' : 'Создать урок'}
        </h2>
        <div className={styles['selectors']}>
          {/* <Select onChange={(id) => { setTeacherId(id); }} options={teacherOptions} placeholder='Выберете учителя' selectedId={teacherId}></Select> */}
          <Select
            onChange={(id) => {
              onTeacherChange(id);
            }}
            options={teacherOptions}
            placeholder="Выберете учителя"
            selectedId={teacherId}
          ></Select>
          {subjectOptions && (
            <Select
              onChange={(id) => {
                setSubjectId(id);
              }}
              options={subjectOptions}
              placeholder="Выберете предмет"
              selectedId={subjectId}
            ></Select>
          )}
          <Select
            onChange={(id) => {
              setClassroomId(id);
            }}
            options={classroomOptions}
            placeholder="Выберете кабинет"
            selectedId={classroomId}
          ></Select>
        </div>

        <ActionButton buttonType="default" onClick={editLesson}>
          {lesson ? 'Сохранить' : 'Создать'}
        </ActionButton>
      </div>
    </Modal>
  );
}

export default EditLessonModal;
