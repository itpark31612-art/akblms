import { UserRole } from '../constants/roles';
export interface UserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl?: string | null;
  phone?: string | null;
  createdAt: string;
}
export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  sessionId?: string;
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
//# sourceMappingURL=auth.d.ts.map
