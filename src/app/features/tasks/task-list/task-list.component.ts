import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TaskService, TaskFilters } from '../../../core/services/task.service';
import { Task } from '../../../shared/models/task.model';
import { Page } from '../../../shared/models/page.model';
import { Status } from '../../../shared/enums/status.enum';
import { Priority } from '../../../shared/enums/priority.enum';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly authService = inject(AuthService);

  tasks: Task[] = [];
  isLoading = false;
  errorMessage = '';

  filters: TaskFilters = {
    title: '',
    status: '',
    priority: '',
    projectName: '',
    page: 0,
    size: 20
  };

  statuses = Object.values(Status);
  priorities = Object.values(Priority);

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.taskService.getByAssigneeId(this.authService.getUserId()).subscribe({
      next: (task) => {
        this.tasks = task;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erro ao carregar tarefas.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filters.page = 0;
    this.loadTasks();
  }

  clearFilters(): void {
    this.filters = {
      title: '',
      status: '',
      priority: '',
      projectName: '',
      page: 0,
      size: 20
    };
    this.loadTasks();
  }

  deleteTask(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.taskService.delete(id).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erro ao excluir tarefa.';
        }
      });
    }
  }

  getStatusClass(status: Status): string {
    const classes = {
      'TODO': 'status-todo',
      'DOING': 'status-doing',
      'DONE': 'status-done'
    };
    return classes[status] || '';
  }

  getPriorityClass(priority: Priority): string {
    const classes = {
      'LOW': 'priority-low',
      'MEDIUM': 'priority-medium',
      'HIGH': 'priority-high'
    };
    return classes[priority] || '';
  }

}
