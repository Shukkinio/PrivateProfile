import { NextResponse } from 'next/server';
import prisma from 'db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
    if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const links = await prisma.link.findMany({
      where: { userId: user.id, hidden: false },
      orderBy: { order: 'asc' },
    });

    const tracks = await prisma.track.findMany({
      where: { userId: user.id },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({
      username: user.username,
      email: user.email,
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
        discordPresence: profile.discordPresence,
        musicWidget: profile.musicWidget,
        avatarUrl: profile.avatarUrl,
        bgColor: profile.bgColor,
        musicUrl: profile.musicUrl,
        musicTitle: profile.musicTitle,
        musicArtist: profile.musicArtist,
        bgVideoUrl: profile.bgVideoUrl,
        cursorImage: profile.cursorImage,
        cursorSize: profile.cursorSize || 32,
        bgEffectType: profile.bgEffectType,
        usernameEffectType: profile.usernameEffectType,
        profileOpacity: profile.profileOpacity,
        profileBlur: profile.profileBlur,
        glowUsername: profile.glowUsername,
        glowSocials: profile.glowSocials,
        glowBadges: profile.glowBadges,
        monochromeIcons: profile.monochromeIcons,
        volumeControl: profile.volumeControl,
        useDiscordAvatar: profile.useDiscordAvatar,
        discordAvatarDecoration: profile.discordAvatarDecoration,
        swapBoxColors: profile.swapBoxColors,
        animatedTitle: profile.animatedTitle ?? false,
        startMessage: profile.startMessage || 'Click anywhere to enter',
        startMessageFont: profile.startMessageFont || '',
        glowStyle: profile.glowStyle || 'text-shadow',
        usernameGlowStyle: profile.usernameGlowStyle || 'text-shadow',
        startMessageGlow: profile.startMessageGlow ?? false,
        badges: profile.badges ? JSON.parse(profile.badges) : [],
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
      },
      links,
      tracks,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
