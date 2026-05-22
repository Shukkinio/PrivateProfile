import { NextResponse } from 'next/server';
import prisma from 'db';
import { createHash } from 'crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    if (!username) return NextResponse.json({ error: 'Username required' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const totalViews = await prisma.view.count({ where: { profileId: profile.id } });

    const uniqueCombos = await prisma.view.findMany({
      where: { profileId: profile.id },
      select: { ipHash: true, fingerprint: true },
      distinct: ['ipHash', 'fingerprint'],
    });

    const now = Date.now();
    const [todayViews, weekViews, monthViews] = await Promise.all([
      prisma.view.count({ where: { profileId: profile.id, createdAt: { gte: new Date(now - 86400000) } } }),
      prisma.view.count({ where: { profileId: profile.id, createdAt: { gte: new Date(now - 604800000) } } }),
      prisma.view.count({ where: { profileId: profile.id, createdAt: { gte: new Date(now - 2592000000) } } }),
    ]);

    return NextResponse.json({
      totalViews,
      uniqueVisitors: uniqueCombos.length,
      viewsToday: todayViews,
      viewsWeek: weekViews,
      viewsMonth: monthViews,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, fingerprint } = body;
    if (!username) return NextResponse.json({ error: 'Username required' }, { status: 400 });

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || '0.0.0.0';
    const ipHash = createHash('sha256').update(ip).digest('hex');

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const existing = await prisma.view.findUnique({
      where: { profileId_ipHash_fingerprint: { profileId: profile.id, ipHash, fingerprint } },
    });

    if (!existing) {
      await prisma.view.create({
        data: { profileId: profile.id, ipHash, fingerprint, userAgent: request.headers.get('user-agent') || '' },
      });
      return NextResponse.json({ counted: true });
    }

    return NextResponse.json({ counted: false });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
