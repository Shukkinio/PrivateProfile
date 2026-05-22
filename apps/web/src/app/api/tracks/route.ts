import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import prisma from 'db';

export async function GET() {
  try {
    const user = await requireAuth();
    const tracks = await prisma.track.findMany({
      where: { userId: user.id },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(tracks);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed';
    return msg === 'Unauthorized'
      ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      : NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const count = await prisma.track.count({ where: { userId: user.id } });
    const track = await prisma.track.create({
      data: {
        userId: user.id,
        title: body.title || 'Track',
        artist: body.artist || '',
        url: body.url || '',
        duration: body.duration || 0,
        order: count,
      },
    });

    return NextResponse.json(track);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed';
    return msg === 'Unauthorized'
      ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      : NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Track ID required' }, { status: 400 });

    await prisma.track.deleteMany({ where: { id, userId: user.id } });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed';
    return msg === 'Unauthorized'
      ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      : NextResponse.json({ error: msg }, { status: 500 });
  }
}
