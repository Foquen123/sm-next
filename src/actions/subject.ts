'use server';

import {
  SubjectCreate,
  SubjectDelete,
  SubjectRead,
} from '@/interfaces/subject';
import prisma from '@/lib/prisma';

export async function subjectsReadAll(): Promise<SubjectRead[]> {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { id: 'asc' },
    });
    return subjects;
  } catch (error) {
    throw new Error('Ошибка удаления');
  }
}
export async function subjectsDelete({ data }: { data: SubjectDelete }) {
  try {
    const res = await prisma.subject.delete({ where: data });
  } catch (error) {
    throw new Error('Ошибка удаления');
  }
}

export async function subjectsCreate({ data }: { data: SubjectCreate }) {
  try {
    const res = await prisma.subject.create({ data: data });
  } catch (error) {
    throw new Error('Ошибка создания');
  }
}
