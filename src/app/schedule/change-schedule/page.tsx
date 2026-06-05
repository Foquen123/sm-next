'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Title from '@/components/common/Title/Title';
import Table from '@/components/common/SheduleTable/Table/Table';
import ActionButton from '@/components/common/ActionButton/ActionButton';
import { useTableStore } from '@/store/useTableStore';
import { useCopyScheduleCells } from '@/hooks/useScheduleCellMutation';
import { getCurrentDayIndex } from '@/lib/date-utils';
import {
  useScheduleCell,
  useScheduleCellFromDay,
} from '@/hooks/useScheduleCell';
import StudentsPdf from '@/lib/export/students-pdf/StudentsPdf';
import { useClass } from '@/hooks/useClass';
import { pdf } from '@react-pdf/renderer';
import TeachersPdf from '@/lib/export/teachers-pdf/TeachersPdf';
import { useTeacher } from '@/hooks/useTeacher';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
// import type { ISheduleCell } from '../../interfaces/SheduleCell.interface';

export default function ExtraSchedulePage() {
  const { setTableType } = useTableStore();
  useEffect(() => {
    setTableType('extra');
  }, []);
  // const classesStore = useClassStore(store => store);
  // const cellsStore = useSheduleCellStore(store => store);
  // const teachersStore = useTeacherStore(store => store);

  const [dayOfWeek, setDayOfWeek] = useState<number>(getCurrentDayIndex());
  // const [standardSchedule, setStandardSchedule] = useState<ISheduleCell[]>([]);
  // const [changedSchedule, setChangedSchedule] = useState<ISheduleCell[]>([]);

  // const isLoading = cellsStore.isLoading || classesStore.isLoading || teachersStore.isLoading || classesStore.isLoading;

  // const standardSchedule: ISheduleCell[] = useMemo(() => {
  //   cellsStore.getCells('main', dayOfWeek);
  //   return;
  // }, [cellsStore]);

  const { data: standardSchedule } = useScheduleCellFromDay('main', dayOfWeek);
  const { data: changedSchedule } = useScheduleCellFromDay('extra', dayOfWeek);

  const { data: classes } = useClass();
  const { data: teachers } = useTeacher();
  const handleExportStudentsPDF = async () => {
    // await save();
    // const standardSchedule = await cellsStore.getCells('main', dayOfWeek);
    // // setStandardSchedule(standardSchedule);
    // const changedSchedule = await cellsStore.getCells('extra', dayOfWeek);

    // await classesStore.fetchClasses();
    // setChangedSchedule(changedSchedule);
    if (standardSchedule && changedSchedule && classes) {
      const blob = await pdf(
        <StudentsPdf
          dayIndex={dayOfWeek}
          changedSchedule={changedSchedule}
          standardSchedule={standardSchedule}
          classes={classes}
        />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'students.pdf';
      link.click();
    }
  };

  const handleExportTeachersPDF = async () => {
    // setChangedSchedule(changedSchedule);
    if (teachers && changedSchedule && standardSchedule && classes) {
      const blob = await pdf(
        <TeachersPdf
          teachers={teachers}
          dayIndex={dayOfWeek}
          changedSchedule={changedSchedule}
          standardSchedule={standardSchedule}
          classes={classes}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'teachers.pdf';
      link.click();
    }
  };

  // useEffect(() => {
  //   async function getSchedulesForExport() {
  //     const standardSchedule = await cellsStore.getCells('main', dayOfWeek);
  //     setStandardSchedule(standardSchedule);
  //     const changedSchedule = await cellsStore.getCells('extra', dayOfWeek);
  //     setChangedSchedule(changedSchedule);
  //     classesStore.fetchClasses();
  //     teachersStore.fetchTeachers();
  //   }

  //   getSchedulesForExport();
  // }, [dayOfWeek]);

  const { mutate: resetToStandart, isPending: isPedingReset } =
    useCopyScheduleCells();
  async function resetToStandard() {
    // await cellsStore.fetchCells('main');
    // await cellsStore.saveChanges('extra');
    resetToStandart();
  }

  async function save() {
    // await classesStore.saveChanges();
    // await cellsStore.saveChanges('extra');
  }

  return (
    <div className={styles['container']}>
      {!isPedingReset && (
        <>
          <Title>Изменения</Title>
          <Table changeDayOfWeek={setDayOfWeek}></Table>
          <div className={styles['buttons']}>
            <ActionButton
              onClick={() => {
                resetToStandard();
              }}
              buttonType="delete"
            >
              Сбросить до стандартного
            </ActionButton>
            <ActionButton onClick={handleExportStudentsPDF} buttonType="edit">
              Скачать (для учеников)
            </ActionButton>
            <ActionButton onClick={handleExportTeachersPDF} buttonType="edit">
              Скачать (для учителей)
            </ActionButton>
          </div>
        </>
      )}
      {isPedingReset && <LoadingSpinner></LoadingSpinner>}
      {/* <PDFViewer height={700}>
        <StudentsPdf dayIndex={dayOfWeek} classes={classesStore.classes} changedSchedule={changedSchedule} standardSchedule={standardSchedule}></StudentsPdf>
      </PDFViewer> */}
      {/* { <PDFViewer height={700}>
        <TeachersPdf teachers={teachersStore.teachers} dayIndex={dayOfWeek} classes={classesStore.classes} changedSchedule={changedSchedule} standardSchedule={standardSchedule}></TeachersPdf>
      </PDFViewer>} */}
    </div>
  );
}
