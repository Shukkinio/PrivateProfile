import { PrismaClient } from '@prisma/client';

let initialized = false;

export async function ensureDb(): Promise<void> {
  if (initialized) return;

  const prisma = new PrismaClient();

  try {
    await prisma.$queryRaw`SELECT count(*) FROM sqlite_master WHERE type='table' AND name='User'`;
  } catch {
    const { execSync } = await import('child_process');
    const schemaPath = require.resolve('../../prisma/schema.prisma');
    execSync(`npx prisma db push --schema="${schemaPath}" --skip-generate --accept-data-loss`, {
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db' },
      stdio: 'pipe',
    });
  }

  await prisma.$disconnect();
  initialized = true;
}
