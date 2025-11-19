import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArrowLeft,
  heroPencilSquare,
  heroTrash,
  heroDocumentText,
  heroFolderOpen,
  heroUser,
  heroCalendar,
  heroExclamationCircle,
  heroArrowPath,
  heroXCircle
} from '@ng-icons/heroicons/outline';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../shared/models/task.model';
import { ServiceUnavailableComponent } from '../../../shared/components/service-unavailable/service-unavailable.component';
import { NavigationService } from '../../../core/services/navigation.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ServiceUnavailableComponent, NgIconComponent],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css',
  viewProviders: [
    provideIcons({
      heroArrowLeft,
      heroPencilSquare,
      heroTrash,
      heroDocumentText,
      heroFolderOpen,
      heroUser,
      heroCalendar,
      heroExclamationCircle,
      heroArrowPath,
      heroXCircle
    })
  ]
})
export class TaskDetailComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);

  task: Task | null = null;
  isLoading = true;
  errorMessage = '';
  serviceUnavailable = false;

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.loadTask(taskId);
    } else {
      this.router.navigate(['/tasks']);
    }
  }

  loadTask(id: string): void {
    this.isLoading = true;
    this.serviceUnavailable = false;
    this.errorMessage = '';

    this.taskService.getById(id).subscribe({
      next: (task) => {
        this.task = task;
        this.isLoading = false;
      },
      error: (error) => {
        if (error.status === 0) {
          this.serviceUnavailable = true;
          this.errorMessage = 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.';
        } else {
          this.errorMessage = error.error?.message || 'Erro ao carregar tarefa.';
        }
        this.isLoading = false;
      }
    });
  }

  deleteTask(): void {
    if (!this.task) return;

    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.taskService.delete(this.task.id).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erro ao excluir tarefa.';
        }
      });
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'TODO': 'A Fazer',
      'DOING': 'Em Progresso',
      'DONE': 'Concluída'
    };
    return labels[status] || status;
  }

  getPriorityLabel(priority: string): string {
    const labels: { [key: string]: string } = {
      'LOW': 'Baixa',
      'MEDIUM': 'Média',
      'HIGH': 'Alta'
    };
    return labels[priority] || priority;
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'TODO': 'status-todo',
      'DOING': 'status-doing',
      'DONE': 'status-done'
    };
    return classes[status] || '';
  }

  getPriorityClass(priority: string): string {
    const classes: { [key: string]: string } = {
      'LOW': 'priority-low',
      'MEDIUM': 'priority-medium',
      'HIGH': 'priority-high'
    };
    return classes[priority] || '';
  }

  goBack(): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
      return;
    }

    const previousUrl = this.navigationService.getPreviousUrl();
    if (previousUrl && previousUrl !== '/tasks/' + this.task?.id) {
      this.router.navigateByUrl(previousUrl);
    } else {
      this.router.navigate(['/tasks']);
    }
  }

  editTask(): void {
    if (!this.task) return;
    
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    
    if (returnUrl) {
      this.router.navigate(['/tasks/edit', this.task.id], {
        queryParams: { returnUrl }
      });
    } else {
      this.router.navigate(['/tasks/edit', this.task.id]);
    }
  }
}
