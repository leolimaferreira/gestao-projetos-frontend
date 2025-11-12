import { User } from './user.model';

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  owner: User;
}

export interface ProjectRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  ownerId: string;
}

export interface UpdateProject {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  ownerId?: string;
}
