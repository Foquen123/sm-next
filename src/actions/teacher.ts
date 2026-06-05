'use server';

import {
  TeacherCreate,
  TeacherDelete,
  TeacherRead,
  TeacherUpdate,
} from '@/interfaces/teacher';
import prisma from '@/lib/prisma';

export async function teachersReadAll(): Promise<TeacherRead[]> {
  try {
    const teachers = await prisma.teacher
      .findMany({
        orderBy: {id: 'desc'},
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
      })
      .then((e) =>
        e.map((i) => {
          return { ...i, subjects: i.teacherSubjects.map((ts) => ts.subject) };
        }),
      );

    return teachers;
  } catch (error) {
    throw new Error('Ошибка удаления');
  }
}
export async function teachersDelete({ data }: { data: TeacherDelete }) {
  try {
    const res = await prisma.teacher.delete({ where: data });
  } catch (error) {
    throw new Error('Ошибка удаления');
  }
}

export async function teachersCreate({ data }: { data: TeacherCreate }) {
  try {
    const createdTeacher = await prisma.teacher.create({
      data: {
        firstName: data.first_name,
        lastName: data.last_name,
        patronymic: data.patronymic,
        color: data.color,
        patternColor: data.pattern_color,
        patternId: data.pattern_id,
        teacherSubjects: {
          create: data.subjects_ids.map((subjectId) => ({
            subjectId: subjectId,
          })),
        },
      },
      include: {
        pattern: true,
        teacherSubjects: {
          include: {
            subject: true,
          },
        },
      },
    });
  } catch (error) {
    throw new Error('Ошибка создания');
  }
}

export async function teachersUpdate({
  id,
  data,
}: {
  id: number;
  data: TeacherUpdate;
}) {
  try {
    await prisma.teacherSubjects.deleteMany({
      where: {
        teacherId: id,
      },
    });

    const updatedTeacher = await prisma.teacher.update({
      where: { id },
      data: {
        firstName: data.first_name,
        lastName: data.last_name,
        patronymic: data.patronymic,
        color: data.color,
        patternColor: data.pattern_color,
        patternId: data.pattern_id,
        teacherSubjects: {
          create: data.subjects_ids.map((subjectId) => ({
            subjectId: subjectId,
          })),
        },
      },
      include: {
        pattern: true,
        teacherSubjects: {
          include: {
            subject: true,
          },
        },
      },
    });
  } catch (error) {
    throw new Error('Ошибка обновления');
  }
}
