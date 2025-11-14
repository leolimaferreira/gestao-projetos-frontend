import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { Task } from '../../../shared/models/task.model';
import { Project } from '../../../shared/models/project.model';
import { ServiceUnavailableComponent } from '../../../shared/components/service-unavailable/service-unavailable.component';

@Component({
  selector: 'app-project-kanban',
  standalone: true,
  imports: [CommonModule, RouterLink, ServiceUnavailableComponent],
  templateUrl: './project-kanban.component.html',
  styleUrl: './project-kanban.component.css'
})
export class ProjectKanbanComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly projectService = inject(ProjectService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  project: Project | null = null;
  todoTasks: Task[] = [];
  doingTasks: Task[] = [];
  doneTasks: Task[] = [];
  isLoading = true;
  errorMessage = '';
  serviceUnavailable = false;

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProject(projectId);
      this.loadTasks(projectId);
    } else {
      this.router.navigate(['/projects']);
    }
  }

  loadProject(id: string): void {
    this.projectService.getById(id).subscribe({
      next: (project) => {
        this.project = project;
      },
      error: (error) => {
        console.error('Erro ao carregar projeto:', error);
        if (error.status === 0) {
          this.serviceUnavailable = true;
          this.errorMessage = 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.';
        }
      }
    });
  }

  loadTasks(projectId: string): void {
    this.isLoading = true;
    this.serviceUnavailable = false;
    this.errorMessage = '';

    this.taskService.getByProjectId(projectId).subscribe({
      next: (tasks: Task[]) => {
        this.todoTasks = tasks.filter((t: Task) => t.status === 'TODO');
        this.doingTasks = tasks.filter((t: Task) => t.status === 'DOING');
        this.doneTasks = tasks.filter((t: Task) => t.status === 'DONE');
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar tarefas:', error);
        if (error.status === 0) {
          this.serviceUnavailable = true;
          this.errorMessage = 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.';
        } else {
          this.errorMessage = error.error?.message || 'Erro ao carregar tarefas.';
        }
        this.isLoading = false;
      }
    });
  }

  updateTaskStatus(task: Task, newStatus: string): void {
    const updateData = {
      status: newStatus
    };

    this.taskService.update(task.id, updateData).subscribe({
      next: () => {
        if (this.project) {
          this.loadTasks(this.project.id);
        }
      },
      error: (error) => {
        console.error('Erro ao atualizar tarefa:', error);
        this.errorMessage = error.error?.message || 'Erro ao atualizar tarefa.';
      }
    });
  }

  getPriorityClass(priority: string): string {
    const classes: { [key: string]: string } = {
      'LOW': 'priority-low',
      'MEDIUM': 'priority-medium',
      'HIGH': 'priority-high'
    };
    return classes[priority] || '';
  }

  getPriorityLabel(priority: string): string {
    const labels: { [key: string]: string } = {
      'LOW': 'Baixa',
      'MEDIUM': 'Média',
      'HIGH': 'Alta'
    };
    return labels[priority] || priority;
  }

  retryLoad(): void {
    if (this.project) {
      this.loadTasks(this.project.id);
    }
  }
}
