import { User } from './user.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  name: string;
}

export interface RecoveryRequest {
  email: string;
}

export interface RecoveryResponse {
  id: string;
  expirationDate: string;
  user: User;
}

export interface ChangePassword {
  tokenId: string;
  newPassword: string;
}
