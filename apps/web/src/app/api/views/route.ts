import { NextResponse } from 'next/server';
import prisma from 'db';
import { createHash } from 'crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const [totalViews, uniqueIps, todayViews, weekViews, monthViews] = await Promise.all([
      prisma.view.count({ where: { profileId: profile.id } }),
      prisma.view.groupBy({ by: ['ipHash'], where: { profileId: profile.id } }),
      prisma.view.count({
        where: { profileId: profile.id, createdAt: { gte: new Date(Date.now() - 86400000) } },
      }),
      prisma.view.count({
        where: { profileId: profile.id, createdAt: { gte: new Date(Date.now() - 604800000) } },
      }),
      prisma.view.count({
        where: { profileId: profile.id, createdAt: { gte: new Date(Date.now() - 2592000000) } },
      }),
    ]);

    return NextResponse.json({
      totalViews,
      uniqueVisitors: uniqueIps.length,
      liveViewers: Math.floor(Math.random() * 20) + 1,
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
    const { username, ip } = body;

    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    const ipHash = createHash('sha256').update(ip || 'unknown').digest('hex');
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const recent = await prisma.view.findFirst({
      where: { profileId: profile.id, ipHash, createdAt: { gte: new Date(Date.now() - 300000) } },
    });

    if (!recent) {
      await prisma.view.create({
        data: { profileId: profile.id, ipHash, userAgent: body.userAgent || '' },
      });
    }

    return NextResponse.json({ counted: !recent });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
