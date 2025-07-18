import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Lessons fetch error:', error);
    return NextResponse.json(
      { error: 'レッスンの取得に失敗しました' },
      { status: 500 }
    );
  }
}