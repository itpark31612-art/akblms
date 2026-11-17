import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserSummary,
  LoginInput,
  ROLE_PERMISSIONS,
  hasRolePermission,
  UpdateProfileInput,
  ChangePasswordInput,
} from '@ems/shared';
import { authApi } from '../api/auth.api';

interface AuthContextType {
  user: UserSummary | null;
  role: UserRole | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  quickLoginAs: (role: UserRole) => Promise<void>;
  switchRole: (role: UserRole) => void;
  forgotPassword: (email: string) => Promise<{ message: string; resetToken?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  changePassword: (data: ChangePasswordInput) => Promise<void>;
  updateProfile: (data: UpdateProfileInput) => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Standart demo hisob ma'lumotlari (PostgreSQL seed bilan 100% mos)
export const DEMO_CREDENTIALS: Record<UserRole, { email: string; pass: string; name: string }> = {
  [UserRole.SUPER_ADMIN]: {
    email: 'superadmin@ems.local',
    pass: 'Admin123!',
    name: 'Sanjar Karimov (Super Admin)',
  },
  [UserRole.ADMIN]: {
    email: 'admin@ems.local',
    pass: 'Admin123!',
    name: 'Malika Raximova (Admin)',
  },
  [UserRole.TEACHER]: {
    email: 'teacher@ems.local',
    pass: 'Teacher123!',
    name: 'Bobur Mirzayev (O‘qituvchi)',
  },
  [UserRole.STUDENT]: {
    email: 'student@ems.local',
    pass: 'Student123!',
    name: 'Alisher Sobirov (O‘quvchi)',
  },
  [UserRole.PARENT]: {
    email: 'parent@ems.local',
    pass: 'Parent123!',
    name: 'Akbarbek Sobirov (Ota-ona)',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Dastlabki yuklash: LocalStorage dan tokenni tekshirish
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');

      if (token && storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          // Orqa fonda profilni serverdan tekshirish
          authApi
            .getMe()
            .then((freshUser) => {
              setUser(freshUser);
              localStorage.setItem('user', JSON.stringify(freshUser));
            })
            .catch(() => {
              // Token eskirgan bo'lsa yoki server javob bermasa
            });
        } catch {
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem('accessToken', response.tokens.accessToken);
      localStorage.setItem('refreshToken', response.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } catch (err: unknown) {
      // Backend offline bo'lsa yoki demo rejimda lokal fallback
      const matchedRole = (Object.keys(DEMO_CREDENTIALS) as UserRole[]).find(
        (r) => DEMO_CREDENTIALS[r].email.toLowerCase() === credentials.email.toLowerCase()
      );

      // Agar server xatoligi bo'lsa va demo hisob bo'lsa
      if (
        matchedRole &&
        err instanceof Error &&
        (err.message.includes('Network Error') || err.message.includes('ECONNREFUSED'))
      ) {
        const mockUser: UserSummary = {
          id: `demo-${matchedRole.toLowerCase()}-id`,
          email: credentials.email,
          firstName: DEMO_CREDENTIALS[matchedRole].name.split(' ')[0],
          lastName: DEMO_CREDENTIALS[matchedRole].name.split(' ')[1] || 'Demo',
          role: matchedRole,
          isActive: true,
          phone: '+998901234567',
          permissions: ROLE_PERMISSIONS[matchedRole] || [],
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem('accessToken', 'mock-access-token-' + matchedRole);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return;
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const quickLoginAs = async (targetRole: UserRole) => {
    const creds = DEMO_CREDENTIALS[targetRole];
    try {
      await login({ email: creds.email, password: creds.pass });
    } catch {
      const mockUser: UserSummary = {
        id: `demo-${targetRole.toLowerCase()}-id`,
        email: creds.email,
        firstName: creds.name.split(' ')[0],
        lastName: creds.name.split(' ')[1] || 'User',
        role: targetRole,
        isActive: true,
        phone: '+998901234567',
        permissions: ROLE_PERMISSIONS[targetRole] || [],
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('accessToken', 'mock-access-token-' + targetRole);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    }
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const updatedUser: UserSummary = {
      ...user,
      role: newRole,
      permissions: ROLE_PERMISSIONS[newRole] || [],
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    return authApi.forgotPassword({ email });
  };

  const resetPassword = async (token: string, newPassword: string) => {
    await authApi.resetPassword({ token, newPassword });
  };

  const changePassword = async (data: ChangePasswordInput) => {
    await authApi.changePassword(data);
  };

  const updateProfile = async (data: UpdateProfileInput) => {
    const fresh = await authApi.updateProfile(data);
    setUser(fresh);
    localStorage.setItem('user', JSON.stringify(fresh));
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.role === UserRole.SUPER_ADMIN) return true;
    if (
      user.permissions &&
      (user.permissions.includes('*') || user.permissions.includes(permission))
    ) {
      return true;
    }
    return hasRolePermission(user.role, permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        permissions: user?.permissions || (user?.role ? ROLE_PERMISSIONS[user.role] : []),
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        quickLoginAs,
        switchRole,
        forgotPassword,
        resetPassword,
        changePassword,
        updateProfile,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
