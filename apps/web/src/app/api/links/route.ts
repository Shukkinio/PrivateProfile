import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import prisma from 'db';

export async function GET() {
  try {
    const user = await requireAuth();
    const links = await prisma.link.findMany({
      where: { userId: user.id },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(links);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed';
    return msg === 'Unauthorized'
      ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      : NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    await prisma.link.deleteMany({ where: { userId: user.id } });

    if (body.links && Array.isArray(body.links)) {
      await prisma.link.createMany({
        data: body.links.map((l: { platform: string; url: string; label: string; hidden: boolean }, i: number) => ({
          userId: user.id,
          platform: l.platform,
          url: l.url,
          label: l.label,
          hidden: l.hidden ?? false,
          order: i,
        })),
      });
    }

    const links = await prisma.link.findMany({
      where: { userId: user.id },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(links);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed';
    return msg === 'Unauthorized'
      ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      : NextResponse.json({ error: msg }, { status: 500 });
  }
}
