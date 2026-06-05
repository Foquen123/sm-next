'use server';

import {
  ClassroomCreate,
  ClassroomDelete,
  ClassroomRead,
  ClassroomUpdate,
} from '@/interfaces/classroom';
import prisma from '@/lib/prisma';

export async function classroomsReadAll(): Promise<ClassroomRead[]> {
  try {
    const classrooms = await prisma.classroom.findMany({
      orderBy: { id: 'asc' },
    });
    return classrooms;
  } catch (error) {
    throw new Error('Ошибка удаления');
  }
}
export async function classroomsDelete({ data }: { data: ClassroomDelete }) {
  try {
    const res = await prisma.classroom.delete({ where: data });
  } catch (error) {
    throw new Error('Ошибка удаления');
  }
}

export async function classroomsCreate({ data }: { data: ClassroomCreate }) {
  try {
    const res = await prisma.classroom.create({ data: data });
  } catch (error) {
    throw new Error('Ошибка создания');
  }
}
export async function classroomsUpdate({
  id,
  data,
}: {
  id: number;
  data: ClassroomUpdate;
}) {
  try {
    const classroom = await prisma.classroom.update({
      where: { id },
      data: data,
    });
  } catch (error) {
    throw new Error('Ошибка создания');
  }
}
