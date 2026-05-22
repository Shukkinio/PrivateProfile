import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import prisma from 'db';

export async function GET() {
  try {
    const user = await requireAuth();

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        displayName: user.username,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    });

    const links = await prisma.link.findMany({
      where: { userId: user.id },
      orderBy: { order: 'asc' },
    });

    const tracks = await prisma.track.findMany({
      where: { userId: user.id },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ profile, links, tracks });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed';
    if (msg === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const { links, tracks, ...profileData } = body;

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: { ...profileData },
      create: { userId: user.id, ...profileData },
    });

    if (links && Array.isArray(links)) {
      await prisma.link.deleteMany({ where: { userId: user.id } });
      if (links.length > 0) {
        await prisma.link.createMany({
          data: links.map((l: { platform: string; url: string; label: string; hidden: boolean }, i: number) => ({
            userId: user.id,
            platform: l.platform || 'custom',
            url: l.url || '',
            label: l.label || 'Link',
            hidden: l.hidden ?? false,
            order: i,
          })),
        });
      }
    }

    if (tracks && Array.isArray(tracks)) {
      await prisma.track.deleteMany({ where: { userId: user.id } });
      if (tracks.length > 0) {
        await prisma.track.createMany({
          data: tracks.map((t: { title: string; artist: string; url: string; duration?: number }, i: number) => ({
            userId: user.id,
            title: t.title || 'Track',
            artist: t.artist || 'Unknown',
            url: t.url || '',
            duration: t.duration || 0,
            order: i,
          })),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Save failed';
    if (msg === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
