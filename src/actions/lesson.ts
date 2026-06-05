'use server';

import {
  LessonCreate,
  LessonDelete,
  LessonRead,
  LessonUpdate,
} from '@/interfaces/lesson';
import prisma from '@/lib/prisma';
import { connect } from 'http2';

export async function lessonsReadAll(): Promise<LessonRead[]> {
  try {
    const lessons = await prisma.lesson
      .findMany({
        orderBy: { id: 'asc' },
        include: {
          teacher: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              patronymic: true,
              color: true,
              patternColor: true,
              pattern: true,
              teacherSubjects: {
                select: {
                  subject: true,
                },
              },
            },
          },
          classroom: true,
          subject: true,
        },
      })
      .then((e) =>
        e.map((i) => {
          return {
            ...i,
            teacher: {
              ...i.teacher,
              subjects: i.teacher.teacherSubjects.map((ts) => ts.subject),
            },
          };
        }),
      );
    return lessons;
  } catch (error) {
    throw new Error('Ошибка чтения');
  }
}
export async function lessonsDelete({ data }: { data: LessonDelete }) {
  try {
    const res = await prisma.lesson.delete({ where: data });
  } catch (error) {
    throw new Error('Ошибка удаления');
  }
}

export async function lessonsCreate({ data }: { data: LessonCreate }) {
  try {
    const res = await prisma.lesson.create({
      data: {
        classroom: { connect: { id: data.classroomId } },
        subject: { connect: { id: data.subjectId } },
        teacher: { connect: { id: data.teacherId } },
      },
    });
  } catch (error) {
    throw new Error('Ошибка создания');
  }
}
export async function lessonsUpdate({
  id,
  data,
}: {
  id: number;
  data: LessonUpdate;
}) {
  try {
    const lesson = await prisma.lesson.update({
      where: { id },
      data: {
        classroom: { connect: { id: data.classroomId } },
        subject: { connect: { id: data.subjectId } },
        teacher: { connect: { id: data.teacherId } },
      },
    });
  } catch (error) {
    throw new Error('Ошибка обновления');
  }
}
