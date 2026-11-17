import { UserRole, UserStatus } from '../constants/roles';

export interface UserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status?: UserStatus;
  isActive: boolean;
  avatarUrl?: string | null;
  phone?: string | null;
  permissions?: string[];
  createdAt: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  sessionId?: string;
  permissions?: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponse {
  user: UserSummary;
  tokens: AuthTokens;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}
