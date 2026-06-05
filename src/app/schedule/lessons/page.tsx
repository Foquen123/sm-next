'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import ActionButton from '@/components/common/ActionButton/ActionButton';
import LessonCard from '@/components/pages/lessons-page/LessonCard/LessonCard';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useLesson } from '@/hooks/useLesson';
import { LessonRead } from '@/interfaces/lesson';
import EditLessonModal from '@/components/pages/lessons-page/EditLessonModal/EditLessonModal';
// import { DELAY_TO_CLOSE, DELAY_TO_OPEN } from '../../constants/global_constants';
// import { useLessonStore } from '../../store/LessonStore';
// import EditLessonModal from '../../components/Modals/EditLessonModal/EditLessonModal';

export default function LessonsPage() {
  const [editLessonModalActive, setEditLessonModalActive] =
    useState<boolean>(false);
  // const [addLessonModalActive, setAddLessonModalActive] =
  //   useState<boolean>(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonRead | null>(null);

  const { data: lessons, isLoading } = useLesson();

  const openEditLessonModal = (lesson: LessonRead) => {
    setSelectedLesson(lesson);
    setEditLessonModalActive(true);
  };
  const openAddLessonModal = () => {
    setSelectedLesson(null);
    setEditLessonModalActive(true);
  };
  const closeEditLessonModal = () => {
    setEditLessonModalActive(false);
  };

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;

  return (
    <>
      <div>
        <div className={styles['container']}>
          <ActionButton
            buttonType="default"
            onClick={() => {
              openAddLessonModal()
            }}
          >
            Добавить урок
          </ActionButton>
          <div className={styles['teachers-wrapper']}>
            <div className={styles['teachers-inner']}>
              {lessons &&
                lessons
                  .map((t) => (
                    <LessonCard
                      onDelete={() => {
                        // lessonsStore.deleteLesson(t.id)
                      }}
                      key={t.id}
                      lesson={t}
                      onEdit={() => {
                        openEditLessonModal(t);
                      }}
                    ></LessonCard>
                  ))
                  .reverse()}
            </div>
          </div>
        </div>

        {/* {selectedLessonId && (
          <EditLessonModal
            mode="edit"
            active={editLessonModalActive}
            onClose={closeEditLessonModal}
            lessonId={selectedLessonId}
          ></EditLessonModal>
        )}
        <EditLessonModal
          mode="add"
          active={addLessonModalActive}
          onClose={closeAddLessonModal}
        ></EditLessonModal> */}
        <EditLessonModal
          lesson={selectedLesson}
          active={editLessonModalActive}
          onClose={closeEditLessonModal}
        ></EditLessonModal>
      </div>
    </>
  );
}
