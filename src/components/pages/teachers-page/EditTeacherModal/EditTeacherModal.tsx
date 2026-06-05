// 'use client';

import type { EditTeacherModalProps } from './EditTeacherModal.props';
import styles from './EditTeacherModal.module.css';
import { SketchPicker, type ColorResult } from 'react-color';
import { useEffect, useState, type MouseEvent } from 'react';
import Modal from '@/components/common/Modal/Modal';
import Input from '@/components/common/Input/Input';
import ActionButton from '@/components/common/ActionButton/ActionButton';
import TeacherPattern from '@/components/common/TeacherPattern/TeacherPattern';
import SubjectsSelector from '../SubjectsSelector/SubjectsSelector';
import { SubjectRead } from '@/interfaces/subject';
import { usePattern } from '@/hooks/usePattern';
import { TeacherCreate } from '@/interfaces/teacher';
import { useCreateTeacher, useUpdateTeacher } from '@/hooks/useTeacherMutation';
import { useSubject } from '@/hooks/useSubject';

function EditTeacherModal({ teacher, active, onClose }: EditTeacherModalProps) {
  const [displayPicker, setDisplayPicker] = useState(false);
  const [displayPatternColorPicker, setDisplayPatternColorPicker] =
    useState(false);
  const [displayPatternPicker, setDisplayPatternPicker] = useState(false);

  const { data: patterns } = usePattern();
  const { data: subjects } = useSubject();
  const { mutate: createTeacher } = useCreateTeacher();
  const { mutate: updateTeacher } = useUpdateTeacher();
  const templatePattern = patterns ? patterns[0] : null;

  const [firstName, setFirstName] = useState<string>(teacher?.firstName || '');
  const [lastName, setLastName] = useState<string>(teacher?.lastName || '');
  const [patronymic, setPatronymic] = useState<string>(
    teacher?.patronymic || '',
  );
  const [teacherSubjects, setTeacherSubjects] = useState<SubjectRead[]>(
    teacher?.subjects || [],
  );
  const [color, setColor] = useState(teacher?.color || '#fff');
  const [patternColor, setPatternColor] = useState(
    teacher?.patternColor || '#000',
  );
  const [pattern, setPattern] = useState(teacher?.pattern || templatePattern);

  useEffect(() => {
    if (teacher) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFirstName(teacher.firstName);
      setLastName(teacher.lastName);
      setPatronymic(teacher.patronymic);
      setTeacherSubjects(teacher.subjects);
      setColor(teacher.color);
      setPatternColor(teacher.patternColor);
      setPattern(teacher.pattern);
    } else {
      setFirstName('');
      setLastName('');
      setPatronymic('');
      setColor('#fff');
      setPattern(templatePattern);
      setPatternColor('#000');
      setTeacherSubjects([]);
    }
  }, [teacher]);

  const handleClick = () => {
    setDisplayPicker(!displayPicker);
  };

  const handleClose = () => {
    setDisplayPicker(false);
  };

  const handleChange = (c: ColorResult) => {
    setColor(c.hex);
  };

  const onEdit = (e: MouseEvent) => {
    e.preventDefault();
    if (
      firstName &&
      lastName &&
      patronymic &&
      color &&
      teacherSubjects &&
      patternColor &&
      pattern
    ) {
      const newTeacher: TeacherCreate = {
        color: color,
        first_name: firstName,
        last_name: lastName,
        patronymic: patronymic,
        pattern_color: patternColor,
        pattern_id: pattern.id,
        subjects_ids: teacherSubjects.map((s) => s.id),
      };

      // const newTeacher = teacherStore.getTeacherById(teacherId);
      if (teacher) {
        updateTeacher({ id: teacher.id, data: newTeacher });
        onClose();
      } else {
        createTeacher({ data: newTeacher });
        setFirstName('');
        setLastName('');
        setPatronymic('');
        setColor('#fff');
        setPattern(templatePattern);
        setPatternColor('#000');
        setTeacherSubjects([]);
        onClose();
      }
    }
  };

  const onChangeSubjects = (subId: number) => {
    if (teacherSubjects && subjects) {
      const foundSub = teacherSubjects?.find((f) => f.id === subId);
      if (foundSub) {
        setTeacherSubjects((prev) => prev?.filter((s) => s.id !== foundSub.id));
      } else {
        // const addedSubject = subjectsStore.getSubjectById(subId);
        const addedSubject = subjects.find((s) => s.id === subId);
        const newSubs: SubjectRead[] = addedSubject
          ? [...teacherSubjects, addedSubject]
          : [...teacherSubjects];
        // setSubjects(newSubs);
        setTeacherSubjects(newSubs);
      }
    }
  };

  return (
    <Modal isOpen={active} onClose={onClose}>
      <div className={styles['container']}>
        <h2 className={styles['title']}>
          {teacher ? 'Редактировать учителя' : 'Добавить учителя'}
        </h2>
        <form className={styles['form']}>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            inputSize="standard"
            placeholder="Фамилия"
          ></Input>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            inputSize="standard"
            placeholder="Имя"
          ></Input>
          <Input
            value={patronymic}
            onChange={(e) => setPatronymic(e.target.value)}
            inputSize="standard"
            placeholder="Отчество"
          ></Input>

          <div className={styles['row']}>
            <div className={styles['color-picker-container']}>
              <div className={styles['color-picker__row']}>
                <div
                  className={styles['color-rect-wrapper']}
                  onClick={handleClick}
                >
                  <div
                    className={styles['color-rect-inner']}
                    style={{ background: color }}
                  ></div>
                </div>
                <span>Цвет</span>
              </div>

              {displayPicker ? (
                <div className={styles['color-picker']}>
                  <div
                    className={styles['color-picker-overlay']}
                    onClick={handleClose}
                  />
                  <SketchPicker color={color} onChange={handleChange} />
                </div>
              ) : null}
            </div>

            <div className={styles['color-picker-container']}>
              <div className={styles['color-picker__row']}>
                <div
                  className={styles['color-rect-wrapper']}
                  onClick={() => {
                    setDisplayPatternColorPicker(!displayPatternColorPicker);
                  }}
                >
                  <div
                    className={styles['color-rect-inner']}
                    style={{ background: patternColor }}
                  ></div>
                </div>
                <span>Цвет узора</span>
              </div>

              {displayPatternColorPicker ? (
                <div className={styles['color-picker']}>
                  <div
                    className={styles['color-picker-overlay']}
                    onClick={() => setDisplayPatternColorPicker(false)}
                  />
                  <SketchPicker
                    color={patternColor}
                    onChange={(c) => setPatternColor(c.hex)}
                  />
                </div>
              ) : null}
            </div>

            <div className={styles['pattern-picker-container']}>
              <div className={styles['color-picker__row']}>
                <div
                  className={styles['color-rect-wrapper']}
                  onClick={() => setDisplayPatternPicker(!displayPatternPicker)}
                >
                  <div
                    className={styles['color-rect-inner']}
                    style={{ background: color }}
                  >
                    {pattern && (
                      <TeacherPattern
                        color={patternColor}
                        pattern={pattern}
                      ></TeacherPattern>
                    )}
                  </div>
                </div>
                <span>Узор</span>
              </div>
              {displayPatternPicker ? (
                <div className={styles['color-picker']}>
                  <div
                    className={styles['color-picker-overlay']}
                    onClick={() => setDisplayPatternPicker(false)}
                  />
                  <div className={styles['pattern-picker']}>
                    {patterns &&
                      patterns.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          className={styles['pattern-preview']}
                          onClick={() => setPattern(p)}
                          style={{ background: `${color}` }}
                        >
                          <TeacherPattern
                            color={patternColor}
                            pattern={p}
                          ></TeacherPattern>
                        </button>
                      ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* {subjects && subjects.length > 0 && <div className={styles['subjects-list']}>
            {subjects?.map(s => <SubjectCard key={s.id} onClick={() => { }}>{s.name}</SubjectCard>)}
          </div>} */}

          <div className={styles['subject-selector-wrapper']}>
            <SubjectsSelector
              teacherSubjects={teacherSubjects || []}
              onChange={(id) => {
                onChangeSubjects(id);
              }}
            ></SubjectsSelector>
          </div>

          <ActionButton buttonType="default" onClick={onEdit}>
            {' '}
            {teacher ? 'Сохранить' : 'Добавить'}
          </ActionButton>
        </form>
      </div>
    </Modal>
  );
}

export default EditTeacherModal;
