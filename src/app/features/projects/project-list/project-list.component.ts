import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../shared/models/project.model';
import { Page } from '../../../shared/models/page.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly authService = inject(AuthService);

  projects: Project[] = [];
  isLoading = false;
  errorMessage = '';
  serviceUnavailable = false;

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.serviceUnavailable = false;
    const userId = this.authService.getUserId();
    
    if (!userId) {
      this.errorMessage = 'Usuário não autenticado.';
      this.isLoading = false;
      return;
    }

    
    this.projectService.getByOwnerId(userId).subscribe({
      next: (projects) => {
        this.projects = projects;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar projetos:', error);
        if (error.status === 0) {
          this.serviceUnavailable = true;
          this.errorMessage = 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.';
        } else {
          this.errorMessage = error.error?.message || error.message || 'Erro ao carregar projetos.';
        }
        this.isLoading = false;
      }
    });
  }

  deleteProject(id: string): void {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      this.projectService.delete(id).subscribe({
        next: () => {
          this.loadProjects();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erro ao excluir projeto.';
        }
      });
    }
  }

}
