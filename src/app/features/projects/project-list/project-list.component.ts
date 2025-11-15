import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProjectFilters, ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../shared/models/project.model';
import { Page } from '../../../shared/models/page.model';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);

  allProjects: Project[] = [];
  projects: Project[] = [];
  isLoading = false;
  errorMessage = '';
  serviceUnavailable = false;

  currentPage = 0;
  pageSize = 10;
  totalPages = 0;

  filters: ProjectFilters = {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      owner: '',
      page: 0,
      size: 20
    };
  
  startDateFilter = '';
  endDateFilter = '';

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

    this.projectService.getByOwnerOrAssignee(userId).subscribe({
      next: (projects) => {
        this.allProjects = projects;
        this.applyFiltersAndPagination();
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

  applyFilters(): void {
    this.currentPage = 0;
    this.applyFiltersAndPagination();
  }

  applyFiltersAndPagination(): void {
    let filteredProjects = this.allProjects;

    if (this.filters.name) {
      filteredProjects = filteredProjects.filter(project => 
        project.name.toLowerCase().includes(this.filters.name!.toLowerCase())
      );
    }

    if (this.filters.description) {
      filteredProjects = filteredProjects.filter(project => 
        project.description.toLowerCase().includes(this.filters.description!.toLowerCase())
      );
    }

    if (this.startDateFilter) {
      filteredProjects = filteredProjects.filter(project => {
        const projectStartDate = new Date(project.startDate);
        const filterDate = new Date(this.startDateFilter);
        return projectStartDate >= filterDate;
      });
    }

    if (this.endDateFilter) {
      filteredProjects = filteredProjects.filter(project => {
        const projectEndDate = new Date(project.endDate);
        const filterDate = new Date(this.endDateFilter);
        return projectEndDate <= filterDate;
      });
    }

    this.totalPages = Math.ceil(filteredProjects.length / this.pageSize);
    
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.projects = filteredProjects.slice(startIndex, endIndex);
  }

  clearFilters(): void {
    this.filters = {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      owner: '',
      page: 0,
      size: 20
    };
    this.startDateFilter = '';
    this.endDateFilter = '';
    this.currentPage = 0;
    this.applyFiltersAndPagination();
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

  get totalProjects(): number {
    return this.allProjects.length;
  }

  get startProjectIndex(): number {
    return this.currentPage * this.pageSize + 1;
  }

  get endProjectIndex(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalProjects);
  }

  isOwner(project: Project): boolean {
    const userId = this.authService.getUserId();
    return project.owner.id === userId;
  }

}
