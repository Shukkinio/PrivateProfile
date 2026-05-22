import { PrismaClient } from '@prisma/client';
import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function initDb(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
  const dbPath = dbUrl.replace('file:', '');

  if (!existsSync(dbPath)) {
    const schemaPath = join(__dirname, '..', 'prisma', 'schema.prisma');
    try {
      execSync(`npx prisma db push --schema="${schemaPath}" --skip-generate --accept-data-loss`, {
        env: { ...process.env, DATABASE_URL: dbUrl },
        stdio: 'pipe',
        timeout: 30000,
      });
    } catch {
      // DB might already exist in another location, try connecting anyway
    }
  }

  const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }
  return prisma;
}

const prisma = globalForPrisma.prisma || initDb();
export default prisma;
