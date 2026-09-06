'use server';

import {
  ClassDelete,
  ClassRead,
  ClassUpdate,
  ClassUpdateOrder,
} from '@/interfaces/class';
import prisma from '@/lib/prisma';

export async function classesReadAll(): Promise<ClassRead[]> {
  try {
    const classes = await prisma.class.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            patronymic: true,
            patternColor: true,
            color: true,
          },
        },
      },
    });
    return classes;
  } catch (error) {
    throw new Error('Ошибка чтения');
  }
}
export async function classesReadOne(id: number): Promise<ClassRead | null> {
  try {
    const classes = await prisma.class.findFirst({
      where: { id: id },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            patronymic: true,
            patternColor: true,
            color: true,
          },
        },
      },
    });
    return classes;
  } catch (error) {
    throw new Error('Ошибка чтения');
  }
}

export async function classesDelete({ data }: { data: ClassDelete }) {
  try {
    const res = await prisma.class.delete({ where: data });

    console.log(res);
    const classes = await prisma.class.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    // for (let i = 0; i < classes.length; i++) {
    //   classes[i].displayOrder = i;
    // }
    console.log(classes);
    // const updated = await prisma.class.updateMany({
    //   data: classes.map((c, i) => ({...c, displayOrder: i})),
    // });

    await prisma.$transaction(
      classes.map((c, i) =>
        prisma.class.update({
          where: { id: c.id },
          data: { displayOrder: i },
        }),
      ),
    );
  } catch (error) {
    console.log(error);
    throw new Error('Ошибка удаления');
  }
}

export async function classesCreate() {
  try {
    const classes = await prisma.class.findMany();
    let displayOrders = [0];
    if (classes.length !== 0) {
      displayOrders = await prisma.class
        .findMany({
          select: { displayOrder: true },
        })
        .then((e) => e.map((e) => e.displayOrder));
    }

    const teacher = await prisma.teacher.findFirst();
    if (teacher) {
      const maxDisplayOrder = Math.max(...displayOrders);
      const res = await prisma.class.create({
        data: {
          name: '?',
          displayOrder: maxDisplayOrder + 1,
          teacher: { connect: { id: teacher.id } },
        },
      });
    }
  } catch (error) {
    throw new Error('Ошибка создания');
  }
}

export async function classesUpdate({
  id,
  data,
}: {
  id: number;
  data: ClassUpdate;
}) {
  try {
    const cls = await prisma.class.update({
      where: { id },
      data: { name: data.name, teacher: { connect: { id: data.teacherId } } },
    });
  } catch (error) {
    throw new Error('Ошибка обновления');
  }
}

export async function classesUpdateOrders({
  data,
}: {
  data: ClassUpdateOrder[];
}) {
  for (const cls of data) {
    await prisma.class.update({
      where: { id: cls.id },
      data: { displayOrder: cls.displayOrder },
    });
  }
}
