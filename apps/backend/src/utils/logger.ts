import winston from 'winston';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

// Ensure log directory exists
const logDir = path.resolve(process.cwd(), env.LOG_FILE_PATH);
if (!fs.existsSync(logDir)) {
  try {
    fs.mkdirSync(logDir, { recursive: true });
  } catch (err) {
    console.error('Failed to create log directory:', err);
  }
}

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    const stackString = stack ? `\n${stack}` : '';
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}${metaString}${stackString}`;
  })
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    const stackString = stack ? `\n${stack}` : '';
    return `[${timestamp}] ${level}: ${message}${metaString}${stackString}`;
  })
);

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: customFormat,
  defaultMeta: { service: 'ems-backend' },
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
  ],
});
