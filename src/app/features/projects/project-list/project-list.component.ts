import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../shared/models/project.model';
import { Page } from '../../../shared/models/page.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
  private readonly projectService = inject(ProjectService);

  projects: Project[] = [];
  page: Page<Project> | null = null;
  currentPage = 0;
  pageSize = 10;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.projectService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (page) => {
        this.page = page;
        this.projects = page.content;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erro ao carregar projetos.';
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

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadProjects();
  }

  nextPage(): void {
    if (this.page && !this.page.last) {
      this.currentPage++;
      this.loadProjects();
    }
  }

  previousPage(): void {
    if (this.page && !this.page.first) {
      this.currentPage--;
      this.loadProjects();
    }
  }
}
