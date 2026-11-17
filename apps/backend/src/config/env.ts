import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load .env from root or apps/backend
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config(); // fallback to local .env

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_NAME: z.string().default('Education Management System'),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('5000'),
  API_PREFIX: z.string().default('/api/v1'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  DATABASE_URL: z
    .string()
    .default('postgresql://postgres:postgres@localhost:5432/ems_db?schema=public'),
  JWT_ACCESS_SECRET: z.string().default('ems_access_token_super_secret_jwt_key_2026_xyz!@#'),
  JWT_REFRESH_SECRET: z.string().default('ems_refresh_token_super_secret_jwt_key_2026_abc$%^'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_SALT_ROUNDS: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('10'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('debug'),
  LOG_FILE_PATH: z.string().default('./logs'),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Xato: Muhit o‘zgaruvchilari noto‘g‘ri sozlangan:');
    console.error(result.error.format());
    process.exit(1);
  }
  return result.data;
};

export const env = parseEnv();
export type Environment = z.infer<typeof envSchema>;
