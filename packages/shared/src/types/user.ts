import { UserRole } from '../constants/roles';
import { UserSummary } from './auth';

export interface IUser extends UserSummary {
  updatedAt: string;
}

export interface ICreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
}

export interface IUpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface IUserFilterQuery {
  role?: UserRole;
  search?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}
