'use client';

import { useState } from 'react';
import styles from './page.module.css';
import Input from '@/components/common/Input/Input';
import ActionButton from '@/components/common/ActionButton/ActionButton';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import ListItemCard from '@/components/common/ListItemCard/ListItemCard';
import { useSubject } from '@/hooks/useSubject';
import { useCreateSubject, useDeleteSubject } from '@/hooks/useSubjectMutation';

function Subjects() {
  const [subName, setSubName] = useState<string>('');


  const { data: subjects, isLoading } = useSubject();
  const { mutate: createSubject } = useCreateSubject();
  const { mutate: deleteSubject } = useDeleteSubject();

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;

  return (
    <div className={styles['container']}>
      <form
        className={styles['form']}
        onSubmit={(e) => {
          e.preventDefault();
          if (subName)
            createSubject(
              { data: { name: subName } },
              { onSettled: () => setSubName('') },
            );
        }}
      >
        <Input
          value={subName}
          onChange={(e) => setSubName(e.target.value)}
          inputSize="standard"
          placeholder="Название предмета"
        ></Input>
        <ActionButton buttonType="default" type="submit">
          Добавить предмет
        </ActionButton>
      </form>

      <div className={styles['sub-list-wrapper']}>
        <div className={styles['sub-list-inner']}>
          {subjects &&
            subjects
              .map((s) => (
                <ListItemCard
                  key={s.id}
                  onRemove={() => {
                    deleteSubject({ data: { id: s.id } });
                    // subjectsStore.removeSubjectById(s.id);
                  }}
                >
                  {s.name}
                </ListItemCard>
              ))
              .reverse()}
        </div>
      </div>
    </div>
  );
}

export default Subjects;
