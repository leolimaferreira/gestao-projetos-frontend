import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Priority } from '../../../shared/enums/priority.enum';
import { Status } from '../../../shared/enums/status.enum';
import { Project } from '../../../shared/models/project.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly projectService = inject(ProjectService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  taskForm: FormGroup;
  errorMessage = '';
  isLoading = false;
  isEditMode = false;
  taskId: string | null = null;

  projects: Project[] = [];
  emailSuggestions: string[] = [];
  allEmails: string[] = [];
  showSuggestions = false;

  statuses = [
    { value: 'TODO', label: 'A Fazer' },
    { value: 'DOING', label: 'Em Progresso' },
    { value: 'DONE', label: 'Concluída' }
  ];

  priorities = [
    { value: 'LOW', label: 'Baixa' },
    { value: 'MEDIUM', label: 'Média' },
    { value: 'HIGH', label: 'Alta' }
  ];

  constructor() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: ['TODO', Validators.required],
      priority: ['MEDIUM', Validators.required],
      dueDate: ['', Validators.required],
      projectName: ['', Validators.required],
      assigneeEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.taskId;

    this.loadProjects();
    this.loadEmails();

    if (this.isEditMode && this.taskId) {
      this.loadTask(this.taskId);
    }

    this.taskForm.get('assigneeEmail')?.valueChanges.subscribe(email => {
      if (email && email.length >= 2) {
        this.filterEmails(email);
      } else {
        this.emailSuggestions = [];
        this.showSuggestions = false;
      }
    });
  }

  private loadProjects(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'Usuário não autenticado.';
      return;
    }

    this.projectService.getByOwnerId(userId).subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (error) => {
        console.error('Erro ao carregar projetos:', error);
        this.errorMessage = 'Erro ao carregar projetos.';
      }
    });
  }

  private loadEmails(): void {
    this.userService.getAllEmails().subscribe({
      next: (emails) => {
        this.allEmails = emails;
      },
      error: (error) => {
        console.error('Erro ao carregar emails:', error);
      }
    });
  }

  private loadTask(id: string): void {
    this.isLoading = true;
    this.isLoading = false;
  }

  private filterEmails(searchTerm: string): void {
    const term = searchTerm.toLowerCase();
    this.emailSuggestions = this.allEmails
      .filter(email => email.toLowerCase().includes(term))
      .slice(0, 10);
    
    this.showSuggestions = this.emailSuggestions.length > 0;
  }

  selectEmail(email: string): void {
    this.taskForm.patchValue({ assigneeEmail: email });
    this.showSuggestions = false;
    this.emailSuggestions = [];
  }

  onEmailInputBlur(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const taskData = {
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        status: this.taskForm.value.status,
        priority: this.taskForm.value.priority,
        dueDate: this.taskForm.value.dueDate,
        projectName: this.taskForm.value.projectName,
        assigneeEmail: this.taskForm.value.assigneeEmail
      };

      this.taskService.create(taskData).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Erro ao criar tarefa:', error);
          this.errorMessage = error.error?.message || 'Erro ao criar tarefa.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.taskForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get title() {
    return this.taskForm.get('title');
  }

  get description() {
    return this.taskForm.get('description');
  }

  get status() {
    return this.taskForm.get('status');
  }

  get priority() {
    return this.taskForm.get('priority');
  }

  get dueDate() {
    return this.taskForm.get('dueDate');
  }

  get projectName() {
    return this.taskForm.get('projectName');
  }

  get assigneeEmail() {
    return this.taskForm.get('assigneeEmail');
  }
}
