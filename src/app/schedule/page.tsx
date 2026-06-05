'use client';

import Title from '@/components/common/Title/Title';
import styles from './page.module.css';
import Table from '@/components/common/SheduleTable/Table/Table';
import ActionButton from '@/components/common/ActionButton/ActionButton';
import { useTableStore } from '@/store/useTableStore';
import { useEffect } from 'react';

export default function StandardShedulePage() {
  // const classesStore = useClassStore(store => store);
  // const cellsStore = useSheduleCellStore(store => store);

  //  function save() {
  //    classesStore.saveChanges();
  //    cellsStore.saveChanges('main');
  // }
  const { setTableType } = useTableStore();
  useEffect(() => {
    setTableType('main');
  }, []);
  return (
    <div className={styles['container']}>
      <Title>Страндартное расписание</Title>
      <Table changeDayOfWeek={() => {}}></Table>
      {/* <ActionButton
        onClick={() => {
          // save();
        }}
        buttonType="default"
      >
        Сохранить
      </ActionButton> */}
      {/* <div style={{ width: '100%', background: 'red', height: '100px' }}></div> */}
    </div>
  );
}
