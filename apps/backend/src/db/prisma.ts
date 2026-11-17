import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? [
            { emit: 'event', level: 'query' },
            { emit: 'stdout', level: 'error' },
            { emit: 'stdout', level: 'warn' },
          ]
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

// Log queries in development
if (process.env.NODE_ENV === 'development') {
  // @ts-expect-error prisma query event
  prisma.$on('query', (e: { query: string; params: string; duration: number }) => {
    logger.debug(`[Prisma Query] ${e.query} (${e.duration}ms)`);
  });
}

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info('✅ PostgreSQL ma’lumotlar bazasiga ulanish muvaffaqiyatli o‘rnatildi');
    return true;
  } catch (error) {
    logger.error('❌ PostgreSQL bazasiga ulanib bo‘lmadi:', error);
    return false;
  }
};
