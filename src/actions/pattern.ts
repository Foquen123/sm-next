'use server';

import { PatternRead } from '@/interfaces/pattern';
import prisma from '@/lib/prisma';

export async function patternsReadAll(): Promise<PatternRead[]> {
  try {
    const res = await prisma.pattern.findMany();
    return res;
  } catch {
    throw new Error('Ошибка чтения');
  }
}
