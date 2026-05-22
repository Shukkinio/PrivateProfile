import { PrismaClient } from '@prisma/client';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function findSeedDb(): string | null {
  const candidates = [
    // relative to compiled __dirname (varies on Vercel)
    join(__dirname, '..', 'prisma', 'dev.db'),
    join(__dirname, '..', '..', '..', 'packages', 'db', 'prisma', 'dev.db'),
    join(__dirname, '..', '..', '..', '..', '..', 'packages', 'db', 'prisma', 'dev.db'),
    // relative to cwd
    join(process.cwd(), 'dev.db'),
    join(process.cwd(), 'prisma', 'dev.db'),
    // full repo paths (Vercel deploys monorepo root as cwd for some runtimes)
    join(process.cwd(), 'packages', 'db', 'prisma', 'dev.db'),
    join(process.cwd(), '..', 'packages', 'db', 'prisma', 'dev.db'),
    join(process.cwd(), '..', '..', 'packages', 'db', 'prisma', 'dev.db'),
  ];
  for (const p of candidates) {
    try {
      if (existsSync(p)) return p;
    } catch {
      continue;
    }
  }
  return null;
}

function initDb(): PrismaClient {
  let dbUrl = process.env.DATABASE_URL || 'file:./dev.db';

  if (process.env.VERCEL) {
    const tmpPath = '/tmp/dev.db';
    if (!existsSync(tmpPath)) {
      const seed = findSeedDb();
      if (seed) {
        mkdirSync(dirname(tmpPath), { recursive: true });
        copyFileSync(seed, tmpPath);
      }
    }
    dbUrl = `file:${tmpPath}`;
  }

  const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }
  return prisma;
}

const prisma = globalForPrisma.prisma || initDb();
export default prisma;
