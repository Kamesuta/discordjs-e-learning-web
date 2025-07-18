import { NextRequest, NextResponse } from 'next/server';
import { executeCode } from '@/lib/sandbox';

export async function POST(req: NextRequest) {
  try {
    const { lessonId, code } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'コードが提供されていません' },
        { status: 400 }
      );
    }

    if (!lessonId || typeof lessonId !== 'number') {
      return NextResponse.json(
        { error: 'レッスンIDが無効です' },
        { status: 400 }
      );
    }

    const result = await executeCode(code, lessonId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Code execution error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'コードの実行中にエラーが発生しました' 
      },
      { status: 500 }
    );
  }
}