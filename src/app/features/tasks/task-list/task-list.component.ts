import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TaskService, TaskFilters } from '../../../core/services/task.service';
import { Task } from '../../../shared/models/task.model';
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

  allTasks: Task[] = [];
  tasks: Task[] = [];
  isLoading = false;
  errorMessage = '';

  currentPage = 0;
  pageSize = 10;
  totalPages = 0;

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
      next: (tasks) => {
        this.allTasks = tasks;
        this.applyFiltersAndPagination();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erro ao carregar tarefas.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.applyFiltersAndPagination();
  }

  applyFiltersAndPagination(): void {
    let filteredTasks = this.allTasks;

    if (this.filters.title) {
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(this.filters.title!.toLowerCase())
      );
    }

    if (this.filters.status) {
      filteredTasks = filteredTasks.filter(task => 
        task.status === this.filters.status
      );
    }

    if (this.filters.priority) {
      filteredTasks = filteredTasks.filter(task => 
        task.priority === this.filters.priority
      );
    }

    if (this.filters.projectName) {
      filteredTasks = filteredTasks.filter(task => 
        task.project.name.toLowerCase().includes(this.filters.projectName!.toLowerCase())
      );
    }

    this.totalPages = Math.ceil(filteredTasks.length / this.pageSize);
    
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.tasks = filteredTasks.slice(startIndex, endIndex);
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
    this.currentPage = 0;
    this.applyFiltersAndPagination();
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

  goToPage(page: number): void {
    this.currentPage = page;
    this.applyFiltersAndPagination();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.applyFiltersAndPagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.applyFiltersAndPagination();
    }
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    let start = Math.max(0, this.currentPage - 2);
    let end = Math.min(this.totalPages - 1, start + maxPages - 1);
    
    if (end - start < maxPages - 1) {
      start = Math.max(0, end - maxPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  get totalTasks(): number {
    return this.allTasks.length;
  }

  get startTaskIndex(): number {
    return this.currentPage * this.pageSize + 1;
  }

  get endTaskIndex(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalTasks);
  }

}
