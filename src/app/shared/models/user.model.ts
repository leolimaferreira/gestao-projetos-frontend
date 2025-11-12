import { Role } from '../enums/role.enum';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface UserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUser {
  name?: string;
  email?: string;
}
