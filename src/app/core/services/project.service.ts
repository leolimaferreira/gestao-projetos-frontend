import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project, ProjectRequest, UpdateProject } from '../../shared/models/project.model';
import { Page } from '../../shared/models/page.model';

export interface ProjectFilters {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  owner?: string;
  page?: number;
  size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/projects`;

  getAll(page: number = 0, size: number = 10): Observable<Page<Project>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<Project>>(this.apiUrl, { params });
  }

  getByOwnerId(ownerId: string | null): Observable<Project[]> {
    if (!ownerId) {
      throw new Error('Owner ID is required');
    }
    return this.http.get<Project[]>(`${this.apiUrl}/owner/${ownerId}`);
  }

  getById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  create(project: ProjectRequest): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  update(id: string, project: UpdateProject): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
