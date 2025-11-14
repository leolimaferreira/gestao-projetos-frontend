import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { ServiceUnavailableComponent } from '../../shared/components/service-unavailable/service-unavailable.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ServiceUnavailableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly projectService = inject(ProjectService);
  private readonly taskService = inject(TaskService);

  userName: string | null = '';
  totalProjects = 0;
  totalTasks = 0;
  isLoading = true;
  serviceUnavailable = false;
  errorMessage = '';

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.serviceUnavailable = false;

    this.projectService.getByOwnerId(this.authService.getUserId()).subscribe({
      next: (projects) => {
        this.totalProjects = projects.length;
      },
      error: (error) => {
        if (error.status === 0) {
          this.serviceUnavailable = true;
          this.errorMessage = 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.';
        }
        this.isLoading = false;
      }
    });

    this.taskService.getByAssigneeId(this.authService.getUserId()).subscribe({
      next: (tasks) => {
        this.totalTasks = tasks.length;
        this.isLoading = false;
      },
      error: (error) => {
        if (error.status === 0) {
          this.serviceUnavailable = true;
          this.errorMessage = 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.';
        }
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
