import { z } from 'zod';

export const profileLinkSchema = z.object({
  id: z.string().optional(),
  platform: z.enum([
    'discord', 'github', 'twitch', 'youtube',
    'tiktok', 'telegram', 'spotify', 'custom',
  ]),
  url: z.string().url('Must be a valid URL'),
  label: z.string().min(1).max(50),
  hidden: z.boolean().default(false),
  order: z.number().int().min(0),
});

export const profileSettingsSchema = z.object({
  introEnabled: z.boolean(),
  introText: z.string().max(100),
  layout: z.enum([
    'centered-card', 'fullscreen-hero', 'split', 'minimal',
    'floating-glass', 'cyberpunk', 'monochrome', 'terminal',
  ]),
  theme: z.enum([
    'neon-void', 'monochrome', 'dracula', 'glass',
    'cyberpunk', 'minimal-white', 'terminal',
  ]),
  usernameEffect: z.enum([
    'gradient', 'rgb-glow', 'shimmer', 'glitch',
    'typewriter', 'wave', 'fire', 'rainbow-pulse',
  ]),
  bioEffect: z.enum(['fade-in', 'stagger-reveal', 'cursor-typing']),
  customCursor: z.boolean(),
  discordPresence: z.boolean(),
  musicWidget: z.boolean(),
  backgroundVideo: z.boolean(),
  backgroundEffects: z.array(z.enum([
    'particles', 'stars', 'snow', 'rain', 'sakura',
    'smoke', 'matrix', 'glow-waves', 'floating-orbs',
  ])),
  effectIntensity: z.number().min(0).max(100),
  blurAmount: z.number().min(0).max(50),
  brightness: z.number().min(0).max(200),
  saturation: z.number().min(0).max(200),
  glowIntensity: z.number().min(0).max(100),
});

export const seoSchema = z.object({
  title: z.string().max(100),
  description: z.string().max(300),
  keywords: z.string().max(200),
  ogImage: z.string().url().optional().or(z.literal('')),
  favicon: z.string().optional(),
  embedColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  animatedTitle: z.boolean(),
});

export const profileUpdateSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  timezone: z.string().optional(),
  settings: profileSettingsSchema.optional(),
  seo: seoSchema.optional(),
  links: z.array(profileLinkSchema).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8),
});
