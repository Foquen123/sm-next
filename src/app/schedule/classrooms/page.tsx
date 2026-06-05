'use client';

import { useState } from 'react';
import styles from './page.module.css';
import Switch from 'react-switch';
import Input from '@/components/common/Input/Input';
import ActionButton from '@/components/common/ActionButton/ActionButton';
import ListItemCard from '@/components/common/ListItemCard/ListItemCard';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useClassroom } from '@/hooks/useClassroom';
import { useCreateClassroom, useDeleteClassroom, useUpdateClassroom } from '@/hooks/useClassroomMutation';

export default function ClassroomsPage() {
  const [classroomName, setClassroomName] = useState<string>('');

  const { data: classrooms, isLoading, error } = useClassroom();
  const { mutate: updateClassroom } = useUpdateClassroom();
  const { mutate: createClassroom, isPending } = useCreateClassroom();
  const { mutate: deleteClassroom } = useDeleteClassroom();



  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className={styles['container']}>
      <form
        className={styles['form']}
        onSubmit={(e) => {
          e.preventDefault();
          if (classroomName)
            createClassroom({
              data: { name: classroomName, isAllowConflicts: false },
            });
        }}
      >
        <Input
          value={classroomName}
          onChange={(e) => setClassroomName(e.target.value)}
          inputSize="standard"
          placeholder="Название кабинета"
        ></Input>
        <ActionButton disabled={isPending} buttonType="default" type="submit">
          Добавить кабинет
        </ActionButton>
      </form>
      {
        <div className={styles['classrooms-list-wrapper']}>
          <div className={styles['classrooms-list-inner']}>
            {classrooms &&
              classrooms
                .map((s) => (
                  <ListItemCard
                    key={s.id}
                    onRemove={() => {
                      // classroomsStore.removeClassroomById(s.id);
                      deleteClassroom({ data: { id: s.id } });
                    }}
                  >
                    <div className={styles['classroom-list-item-inner']}>
                      {s.name}

                      <div className={styles['switcher-wrapper']}>
                        Разрешить конфликты?
                        <Switch
                          uncheckedIcon={false}
                          checkedIcon={false}
                          width={100}
                          height={40}
                          handleDiameter={35}
                          checked={s.isAllowConflicts === true}
                          onChange={(checked) => {
                            updateClassroom({
                              id: s.id,
                              data: { isAllowConflicts: checked },
                            });
                          }}
                        ></Switch>
                      </div>
                    </div>
                  </ListItemCard>
                ))
                .reverse()}
          </div>
        </div>
      }
    </div>
  );
}
