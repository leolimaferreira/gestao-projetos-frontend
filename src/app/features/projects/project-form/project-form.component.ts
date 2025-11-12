import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent implements OnInit {
  public showOwnerEmailField = false;
  public emailSuggestions: string[] = [];
  public showSuggestions = false;
  public allEmails: string[] = [];
  
  private readonly fb = inject(FormBuilder);
  private readonly projectService = inject(ProjectService);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
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
      ownerId: [''],
      ownerEmail: ['']
    });
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.projectId;

    this.userService.getAllEmails().subscribe({
      next: (emails) => {
        this.allEmails = emails;
      },
      error: (error) => {
        console.error('Erro ao carregar emails:', error);
      }
    });

    this.projectForm.get('ownerEmail')?.valueChanges.subscribe(email => {
      if (email && email.length >= 2) {
        this.filterEmails(email);
      } else {
        this.emailSuggestions = [];
        this.showSuggestions = false;
      }
    });
  }

  private filterEmails(searchTerm: string): void {
    const term = searchTerm.toLowerCase();
    this.emailSuggestions = this.allEmails
      .filter(email =>
        email.toLowerCase().includes(term)
      )
      .slice(0, 10); 
    
    this.showSuggestions = this.emailSuggestions.length > 0;
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const projectData = {
        ...this.projectForm.value,
        ownerId: this.projectForm.get('ownerId')?.value
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

  toggleOwnerEmailField() {
    this.showOwnerEmailField = !this.showOwnerEmailField;
  }

  selectEmail(email: string): void {
    this.projectForm.patchValue({
      ownerEmail: email
    });
    this.showSuggestions = false;
    this.emailSuggestions = [];
  }

  onEmailInputBlur(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }
}