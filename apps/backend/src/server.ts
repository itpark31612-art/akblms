import { createApp } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { checkDatabaseConnection, prisma } from './db/prisma';

const startServer = async () => {
  const app = createApp();

  // Try checking database connection asynchronously
  checkDatabaseConnection().catch((err) => {
    logger.warn('Initial database connection failed (PostgreSQL might be stopped):', err);
  });

  const server = app.listen(env.PORT, () => {
    logger.info(
      `🚀 EMS Backend API server muvaffaqiyatli ishga tushdi: http://localhost:${env.PORT}`
    );
    logger.info(`📊 Health check: http://localhost:${env.PORT}${env.API_PREFIX}/health`);
    logger.info(`🔒 Muhit rejimi: ${env.NODE_ENV}`);
  });

  // Graceful Shutdown
  const exitHandler = async (signal: string) => {
    logger.info(`\n[${signal}] Tizim to‘xtatilmoqda (Graceful shutdown)...`);
    server.close(async () => {
      logger.info('HTTP server yopildi.');
      try {
        await prisma.$disconnect();
        logger.info('Prisma database ulanishi uzildi.');
      } catch (err) {
        logger.error('Database uzilishida xatolik:', err);
      }
      process.exit(0);
    });

    // Majburiy to'xtatish (10 soniyadan so'ng)
    setTimeout(() => {
      logger.error('Majburiy to‘xtatish bajarildi (timeout)');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => exitHandler('SIGTERM'));
  process.on('SIGINT', () => exitHandler('SIGINT'));

  process.on('uncaughtException', (error) => {
    logger.error('❌ Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('❌ Unhandled Rejection:', reason);
  });
};

startServer();
