'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
// import { DELAY_TO_CLOSE, DELAY_TO_OPEN } from '../../constants/global_constants';
// import EditTeacherModal from '../../components/Modals/EditTeacherModal/EditTeacherModal';
import ActionButton from '@/components/common/ActionButton/ActionButton';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import TeacherCard from '@/components/pages/teachers-page/TeacherCard/TeacherCard';
import { useQuery } from '@tanstack/react-query';
import { teachersReadAll } from '@/actions/teacher';
import { useTeacher } from '@/hooks/useTeacher';
import { TeacherRead } from '@/interfaces/teacher';
import EditTeacherModal from '@/components/pages/teachers-page/EditTeacherModal/EditTeacherModal';

export default function TeachersPage() {
  const { data: teachers } = useTeacher();

  // const patternStore = usePatternStore((store) => store);

  const [editTeacherModalActive, setEditTeacherModalActive] =
    useState<boolean>(false);
  // const [addTeacherModalActive, setAddTeacherModalActive] =
  //   useState<boolean>(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherRead | null>(
    null,
  );
  // const [isLoading, setIsLoading] = useState<boolean>(teachersStore.isLoading || patternStore.isLoading);
  // const isLoading = teachersStore.isLoading || patternStore.isLoading;

  // useEffect(() => {
  //   teachersStore.fetchTeachers();
  //   patternStore.fetchPatterns();
  // }, []);

  const openEditTeacherModal = (teacher: TeacherRead) => {
    setSelectedTeacher(teacher);
    setEditTeacherModalActive(true);
  };

  const closeEditTeacherModal = () => {
    setEditTeacherModalActive(false);
    // setSelectedTeacher(null);
  };

  const openAddTeacherModal = () => {
    setSelectedTeacher(null);
    setEditTeacherModalActive(true);
  };

  // const closeAddTeacherModal = () => {
  //   setAddTeacherModalActive(false);
  // };
  return (
    <>
      <div>
        <div className={styles['container']}>
          <ActionButton
            buttonType="default"
            onClick={() => {
              openAddTeacherModal();
            }}
          >
            Добавить учителя
          </ActionButton>
          {
            <div className={styles['teachers-wrapper']}>
              <div className={styles['teachers-inner']}>
                {teachers &&
                  teachers.map((t) => (
                    <TeacherCard
                      key={t.id}
                      teacher={t}
                      onEdit={() => {
                        openEditTeacherModal(t);
                      }}
                      onDelete={() => {
                        // teachersStore.deleteTeacher(t.id)
                      }}
                    ></TeacherCard>
                  ))}
              </div>
            </div>
          }
        </div>

        {/* {selectedTeacherId && (
            <EditTeacherModal
              mode="edit"
              active={editTeacherModalActive}
              onClose={closeEditTeacherModal}
              teacherId={selectedTeacherId}
            ></EditTeacherModal>
          )}
          <EditTeacherModal
            mode="add"
            active={addTeacherModalActive}
            onClose={closeAddTeacherModal}
          ></EditTeacherModal> */}

        <EditTeacherModal
          teacher={selectedTeacher}
          active={editTeacherModalActive}
          onClose={closeEditTeacherModal}
        ></EditTeacherModal>
      </div>

      {/* {isLoading && <LoadingSpinner></LoadingSpinner>} */}
    </>
  );
}
