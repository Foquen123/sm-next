'use server';

import {
  ScheduleCellCreate,
  ScheduleCellDelete,
  ScheduleCellRead,
  ScheduleCellUpdate,
} from '@/interfaces/schedule-cell';
import prisma from '@/lib/prisma';
import { TableType } from '@/types/table-type';
import { classesReadAll } from './class';
import { DAYS_OF_WEEK_COUNT, ROWS_COUNT } from '@/config/global_constants';
import { connect } from 'http2';

export async function scheduleCellReadAll({
  tableType,
}: {
  tableType: TableType;
}): Promise<ScheduleCellRead[]> {
  try {
    const cells = await prisma.scheduleCell
      .findMany({
        orderBy: { id: 'asc' },
        where: { tableType: tableType },
        include: {
          class: true,
          lesson1: {
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
          },
          lesson2: {
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
          },
        },
      })
      .then((e) =>
        e.map((i) => {
          return {
            ...i,
            lesson1: {
              ...i.lesson1,
              teacher: {
                ...i.lesson1.teacher,
                subjects: i.lesson1.teacher.teacherSubjects.map(
                  (ts) => ts.subject,
                ),
              },
            },
          };
        }),
      );

    const transformedCells: ScheduleCellRead[] = [];
    for (const cell of cells) {
      let lesson2 = null;
      if (cell.lesson2) {
        lesson2 = await prisma.lesson
          .findFirst({
            where: { id: cell.lesson2?.id },
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
          .then((e) => {
            if (e)
              return {
                ...e,
                teacher: {
                  ...e.teacher,
                  subjects: e.teacher.teacherSubjects.map((ts) => ts.subject),
                },
              };
          });
      }

      const newCell: ScheduleCellRead = {
        classId: cell.classId,
        dayOfWeek: cell.dayOfWeek,
        id: cell.id,
        isEmpty: false,
        lesson1: cell.lesson1,
        lesson2: lesson2 || null,
        orderInDay: cell.orderInDay,
        tableType: cell.tableType as TableType,
      };

      transformedCells.push(newCell);
    }

    const classes = await classesReadAll();

    const ids = transformedCells.map((c) => Number(c.id));
    let maxId;

    if (transformedCells.length) {
      maxId = Math.max(...ids) + 1;
    } else {
      maxId = 0;
    }

    for (let i = 0; i < DAYS_OF_WEEK_COUNT; i++) {
      for (const cls of classes) {
        for (let k = 0; k < ROWS_COUNT - 1; k++) {
          const finded = transformedCells.find(
            (c) =>
              c.dayOfWeek === i && c.classId === cls.id && c.orderInDay === k,
          );
          if (finded === undefined) {
            transformedCells.push({
              id: maxId,
              classId: cls.id,
              dayOfWeek: i,
              isEmpty: true,
              lesson1: null,
              lesson2: null,
              orderInDay: k,
              tableType: tableType,
            });
          }
          maxId++;
        }
      }
    }

    return transformedCells;
  } catch (error) {
    throw new Error('Ошибка чтения');
  }
}

export async function scheudleCellReadByDay({
  day,
  tableType,
}: {
  tableType: TableType;
  day: number;
}) {
  const cells = await prisma.scheduleCell
    .findMany({
      orderBy: { id: 'asc' },
      where: { tableType: tableType, dayOfWeek: day },
      include: {
        class: true,
        lesson1: {
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
        },
        lesson2: {
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
        },
      },
    })
    .then((e) =>
      e.map((i) => {
        return {
          ...i,
          lesson1: {
            ...i.lesson1,
            teacher: {
              ...i.lesson1.teacher,
              subjects: i.lesson1.teacher.teacherSubjects.map(
                (ts) => ts.subject,
              ),
            },
          },
        };
      }),
    );
  const transformedCells: ScheduleCellRead[] = [];
  for (const cell of cells) {
    let lesson2 = null;
    if (cell.lesson2) {
      lesson2 = await prisma.lesson
        .findFirst({
          where: { id: cell.lesson2?.id },
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
        .then((e) => {
          if (e)
            return {
              ...e,
              teacher: {
                ...e.teacher,
                subjects: e.teacher.teacherSubjects.map((ts) => ts.subject),
              },
            };
        });
    }

    const newCell: ScheduleCellRead = {
      classId: cell.classId,
      dayOfWeek: cell.dayOfWeek,
      id: cell.id,
      isEmpty: false,
      lesson1: cell.lesson1,
      lesson2: lesson2 || null,
      orderInDay: cell.orderInDay,
      tableType: cell.tableType as TableType,
    };

    transformedCells.push(newCell);
  }

  return transformedCells;
}

export async function scheduleCellDelete({
  data,
}: {
  data: ScheduleCellDelete;
}) {
  try {
    const res = await prisma.scheduleCell.delete({ where: data });
  } catch (error) {
    throw new Error('Ошибка удаления');
  }
}

export async function scheduleCellCreate({
  data,
}: {
  data: ScheduleCellCreate;
}) {
  try {
    const res = await prisma.scheduleCell.create({
      data: {
        dayOfWeek: data.dayOfWeek,
        orderInDay: data.orderInDay,
        tableType: data.tableType,
        lesson1: { connect: { id: data.lesson1Id } },
        lesson2: data.lesson2Id
          ? { connect: { id: data.lesson2Id } }
          : undefined,
        class: { connect: { id: data.classId } },
      },
    });
  } catch (error) {
    throw new Error('Ошибка создания');
  }
}

export async function scheduleCellUpdate({
  id,
  data,
}: {
  id: number;
  data: ScheduleCellUpdate;
}) {
  try {
    const cell = await prisma.scheduleCell.update({
      where: { id },
      data: {
        lesson1: { connect: { id: data.lesson1Id } },
        lesson2: data.lesson2Id
          ? { connect: { id: data.lesson2Id } }
          : undefined,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error('Ошибка обновления');
  }
}

export async function scheduleCellSwap({
  cell,
  targetCell,
}: {
  cell: ScheduleCellRead;
  targetCell: ScheduleCellRead;
}) {
  try {
    const dragOrder = cell.orderInDay;
    const targetOrder = targetCell.orderInDay;

    if (dragOrder !== targetOrder) {
      await prisma.scheduleCell.update({
        where: { id: cell.id },
        data: { orderInDay: targetOrder },
      });
      await prisma.scheduleCell.update({
        where: { id: targetCell.id },
        data: { orderInDay: dragOrder },
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function scheduleCellCopyMainToExtra() {
  await prisma.scheduleCell.deleteMany({ where: { tableType: 'extra' } });
  const cellsToCopy = await prisma.scheduleCell.findMany({
    where: { tableType: 'main' },
  });
  for (const cell of cellsToCopy) {
    await prisma.scheduleCell.create({
      data: {
        dayOfWeek: cell.dayOfWeek,
        orderInDay: cell.orderInDay,
        class: { connect: { id: cell.classId } },
        lesson1: { connect: { id: cell.lesson1Id } },
        lesson2: cell.lesson2Id
          ? { connect: { id: cell.lesson2Id } }
          : undefined,
        tableType: 'extra',
      },
    });
  }
}
