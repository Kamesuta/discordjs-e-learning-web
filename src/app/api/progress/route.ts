import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'ユーザーIDが必要です' },
        { status: 400 }
      );
    }

    const progress = await prisma.progress.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        lesson: true,
      },
      orderBy: {
        lesson: {
          order: 'asc',
        },
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Progress fetch error:', error);
    return NextResponse.json(
      { error: '進捗の取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, lessonId, completed } = await req.json();

    if (!userId || !lessonId || typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: '必要なパラメータが不足しています' },
        { status: 400 }
      );
    }

    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: parseInt(userId),
          lessonId: parseInt(lessonId),
        },
      },
      update: {
        completed,
      },
      create: {
        userId: parseInt(userId),
        lessonId: parseInt(lessonId),
        completed,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json(
      { error: '進捗の更新に失敗しました' },
      { status: 500 }
    );
  }
}