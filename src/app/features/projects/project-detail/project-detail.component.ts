import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { 
  heroArrowLeft,
  heroSquares2x2,
  heroPencilSquare,
  heroTrash,
  heroUser,
  heroEnvelope,
  heroCalendar,
  heroDocumentText,
  heroCheckCircle,
  heroExclamationCircle,
  heroArrowPath
} from '@ng-icons/heroicons/outline';
import { ProjectService } from '../../../core/services/project.service';
import { TaskService } from '../../../core/services/task.service';
import { Project } from '../../../shared/models/project.model';
import { Task } from '../../../shared/models/task.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css',
  viewProviders: [
    provideIcons({ 
      heroArrowLeft,
      heroSquares2x2,
      heroPencilSquare,
      heroTrash,
      heroUser,
      heroEnvelope,
      heroCalendar,
      heroDocumentText,
      heroCheckCircle,
      heroExclamationCircle,
      heroArrowPath
    })
  ]
})
export class ProjectDetailComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly taskService = inject(TaskService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  project: Project | null = null;
  tasks: Task[] = [];
  isLoading = false;
  isLoadingTasks = false;
  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProject(id);
      this.loadTasks(id);
    }
  }

  loadProject(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.projectService.getById(id).subscribe({
      next: (project) => {
        this.project = project;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erro ao carregar projeto.';
        this.isLoading = false;
      }
    });
  }

  loadTasks(projectId: string): void {
    this.isLoadingTasks = true;

    this.taskService.getByProjectId(projectId).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isLoadingTasks = false;
      },
      error: (error) => {
        this.isLoadingTasks = false;
      }
    });
  }

  deleteProject(): void {
    if (!this.project) return;

    if (confirm(`Tem certeza que deseja excluir o projeto "${this.project.name}"?`)) {
      this.projectService.delete(this.project.id).subscribe({
        next: () => {
          this.router.navigate(['/projects']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erro ao excluir projeto.';
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'status-pending';
      case 'IN_PROGRESS':
        return 'status-in-progress';
      case 'COMPLETED':
        return 'status-completed';
      default:
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Pendente';
      case 'IN_PROGRESS':
        return 'Em Progresso';
      case 'COMPLETED':
        return 'Concluída';
      default:
        return status;
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'LOW':
        return 'priority-low';
      case 'MEDIUM':
        return 'priority-medium';
      case 'HIGH':
        return 'priority-high';
      default:
        return '';
    }
  }

  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'LOW':
        return 'Baixa';
      case 'MEDIUM':
        return 'Média';
      case 'HIGH':
        return 'Alta';
      default:
        return priority;
    }
  }
}
