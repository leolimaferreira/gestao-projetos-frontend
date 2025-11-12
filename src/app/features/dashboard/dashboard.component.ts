import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
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

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Carregar totais
    this.projectService.getAll(0, 1).subscribe({
      next: (page) => {
        this.totalProjects = page.totalElements;
      }
    });

    this.taskService.getAll({ page: 0, size: 1 }).subscribe({
      next: (page) => {
        this.totalTasks = page.totalElements;
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
