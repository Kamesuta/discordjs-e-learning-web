import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'ユーザー名が無効です' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { error: 'ユーザーの作成に失敗しました' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json(
      { error: 'ユーザーの取得に失敗しました' },
      { status: 500 }
    );
  }
}