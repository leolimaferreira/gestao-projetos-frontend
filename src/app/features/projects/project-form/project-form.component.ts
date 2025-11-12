import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly projectService = inject(ProjectService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  projectForm: FormGroup;
  errorMessage = '';
  isLoading = false;
  isEditMode = false;
  projectId: string | null = null;

  constructor() {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      ownerId: ['']
    });
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.projectId;

    // Por enquanto, usar um ID fixo para o owner (substituir com usuário logado)
    // TODO: Implementar sistema para obter ID do usuário logado
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const projectData = {
        ...this.projectForm.value,
        ownerId: 'USER_ID_FIXO' // TODO: Substituir pelo ID do usuário logado
      };

      const request = this.isEditMode && this.projectId
        ? this.projectService.update(this.projectId, projectData)
        : this.projectService.create(projectData);

      request.subscribe({
        next: () => {
          this.router.navigate(['/projects']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erro ao salvar projeto.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  get name() {
    return this.projectForm.get('name');
  }

  get description() {
    return this.projectForm.get('description');
  }

  get startDate() {
    return this.projectForm.get('startDate');
  }

  get endDate() {
    return this.projectForm.get('endDate');
  }
}
