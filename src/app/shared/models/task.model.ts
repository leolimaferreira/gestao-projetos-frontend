import { Priority } from '../enums/priority.enum';
import { Status } from '../enums/status.enum';
import { User } from './user.model';
import { Project } from './project.model';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: User;
  dueDate: string;
  project: Project;
}

export interface TaskRequest {
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate: string;
  projectId: string;
  assigneeId: string;
}

export interface UpdateTask {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  assigneeId?: string;
}
