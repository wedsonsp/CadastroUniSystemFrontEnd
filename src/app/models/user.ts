import { BaseEntity } from './base-entity';

export class User extends BaseEntity<number> {
  name: string = '';
  email: string = '';
  passwordHash: string = '';
  salt: string = '';
  isActive: boolean = true;
  isAdministrator?: boolean = false; // Campo do backend
  role?: string = 'User'; // Campo calculado para o frontend
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  isAdministrator?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface LoginTokenResponse {
  token: string;
}

