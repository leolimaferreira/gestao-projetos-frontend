import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task, TaskRequest, UpdateTask } from '../../shared/models/task.model';
import { Page } from '../../shared/models/page.model';

export interface TaskFilters {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  projectName?: string;
  page?: number;
  size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  getAll(filters: TaskFilters = {}): Observable<Page<Task>> {
    let params = new HttpParams();
    
    if (filters.title) params = params.set('title', filters.title);
    if (filters.description) params = params.set('description', filters.description);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.priority) params = params.set('priority', filters.priority);
    if (filters.projectName) params = params.set('projectName', filters.projectName);
    
    params = params.set('page', (filters.page ?? 0).toString());
    params = params.set('size', (filters.size ?? 10).toString());
    
    return this.http.get<Page<Task>>(this.apiUrl, { params });
  }

  getByProjectId(projectId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/project/${projectId}`);
  }

  getById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  create(task: TaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  update(id: string, task: UpdateTask): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
