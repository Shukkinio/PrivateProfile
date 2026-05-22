import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import prisma from 'db';

export async function POST() {
  try {
    const user = await requireAuth();

    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
    if (!profile) return NextResponse.json({ error: 'No profile to publish' }, { status: 400 });

    const links = await prisma.link.findMany({
      where: { userId: user.id, hidden: false },
      orderBy: { order: 'asc' },
    });

    const tracks = await prisma.track.findMany({
      where: { userId: user.id },
      orderBy: { order: 'asc' },
    });

    const totalViews = await prisma.view.count({ where: { profileId: profile.id } });

    const published = {
      user: { username: user.username, email: user.email },
      profile: {
        displayName: profile.displayName,
        bio: profile.bio,
        location: profile.location,
        timezone: profile.timezone,
        layoutType: profile.layoutType,
        theme: profile.theme,
        usernameEffect: profile.usernameEffect,
        bioEffect: profile.bioEffect,
        introEnabled: profile.introEnabled,
        introText: profile.introText,
        customCursor: profile.customCursor,
        cursorImage: profile.cursorImage,
        discordPresence: profile.discordPresence,
        musicWidget: profile.musicWidget,
        bgVideoUrl: profile.bgVideoUrl,
        bgEffects: profile.bgEffects ? JSON.parse(profile.bgEffects) : [],
        effectIntensity: profile.effectIntensity,
        blurAmount: profile.blurAmount,
        brightness: profile.brightness,
        saturation: profile.saturation,
        glowIntensity: profile.glowIntensity,
        accentColor: profile.accentColor,
        embedColor: profile.embedColor,
        seoTitle: profile.seoTitle,
        seoDesc: profile.seoDesc,
        animatedTitle: profile.animatedTitle,
      },
      links,
      tracks,
      publishedAt: new Date().toISOString(),
      stats: { totalViews, uniqueVisitors: 0 },
    };

    return NextResponse.json({ success: true, published });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Publish failed';
    if (msg === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
