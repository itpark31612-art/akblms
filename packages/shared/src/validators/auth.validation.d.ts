import { z } from 'zod';
import { UserRole } from '../constants/roles';
export declare const loginSchema: z.ZodObject<
  {
    email: z.ZodString;
    password: z.ZodString;
  },
  'strip',
  z.ZodTypeAny,
  {
    email: string;
    password: string;
  },
  {
    email: string;
    password: string;
  }
>;
export declare const registerSchema: z.ZodObject<
  {
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodNativeEnum<typeof UserRole>;
    phone: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phone?: string | undefined;
  },
  {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phone?: string | undefined;
  }
>;
export declare const refreshTokenSchema: z.ZodObject<
  {
    refreshToken: z.ZodString;
  },
  'strip',
  z.ZodTypeAny,
  {
    refreshToken: string;
  },
  {
    refreshToken: string;
  }
>;
export declare const updateUserSchema: z.ZodObject<
  {
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodNativeEnum<typeof UserRole>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
  },
  'strip',
  z.ZodTypeAny,
  {
    firstName?: string | undefined;
    lastName?: string | undefined;
    role?: UserRole | undefined;
    phone?: string | undefined;
    isActive?: boolean | undefined;
  },
  {
    firstName?: string | undefined;
    lastName?: string | undefined;
    role?: UserRole | undefined;
    phone?: string | undefined;
    isActive?: boolean | undefined;
  }
>;
export declare const createCourseSchema: z.ZodObject<
  {
    code: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    credits: z.ZodDefault<z.ZodNumber>;
    teacherId: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    code: string;
    title: string;
    credits: number;
    description?: string | undefined;
    teacherId?: string | undefined;
  },
  {
    code: string;
    title: string;
    description?: string | undefined;
    credits?: number | undefined;
    teacherId?: string | undefined;
  }
>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
//# sourceMappingURL=auth.validation.d.ts.map
