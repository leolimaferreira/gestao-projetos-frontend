import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
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
  currentTask: any = null; // Dados da tarefa sendo editada

  projects: Project[] = [];
  emailSuggestions: string[] = [];
  allEmails: string[] = [];
  showSuggestions = false;
  showAssigneeEmailField = false; // Controla exibição do campo de email no modo edição

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
      title: [''],
      description: [''],
      status: ['TODO'],
      priority: ['MEDIUM'],
      dueDate: [''],
      projectName: [''],
      assigneeEmail: ['']
    });
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.taskId;

    this.loadProjects();
    this.loadEmails();

    if (this.isEditMode && this.taskId) {
      this.loadTask(this.taskId);
    } else {
      this.setCreateValidators();
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

  private setCreateValidators(): void {
    this.taskForm.get('title')?.setValidators([Validators.required, Validators.minLength(3)]);
    this.taskForm.get('status')?.setValidators([Validators.required]);
    this.taskForm.get('priority')?.setValidators([Validators.required]);
    this.taskForm.get('dueDate')?.setValidators([Validators.required]);
    this.taskForm.get('projectName')?.setValidators([Validators.required]);
    this.taskForm.get('assigneeEmail')?.setValidators([Validators.required, Validators.email]);
    this.taskForm.updateValueAndValidity();
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
    this.taskService.getById(id).subscribe({
      next: (task) => {
        this.currentTask = task;
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
          projectName: task.project.name,
          assigneeEmail: task.assignee.email
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar tarefa:', error);
        this.errorMessage = 'Erro ao carregar dados da tarefa.';
        this.isLoading = false;
      }
    });
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
    if (this.taskForm.valid || this.isEditMode) {
      this.isLoading = true;
      this.errorMessage = '';

      let taskData: any;

      if (this.isEditMode) {
        taskData = {};
        const formValue = this.taskForm.value;
        
        if (formValue.title && formValue.title.trim()) taskData.title = formValue.title;
        if (formValue.description && formValue.description.trim()) taskData.description = formValue.description;
        if (formValue.status) taskData.status = formValue.status;
        if (formValue.priority) taskData.priority = formValue.priority;
        
        if (formValue.dueDate && formValue.dueDate !== '') {
          taskData.dueDate = formValue.dueDate;
        }
        
        if (this.showAssigneeEmailField && formValue.assigneeEmail) {
          taskData.assigneeEmail = formValue.assigneeEmail;
        }
      } else {
        taskData = {
          title: this.taskForm.value.title,
          description: this.taskForm.value.description,
          status: this.taskForm.value.status,
          priority: this.taskForm.value.priority,
          dueDate: this.taskForm.value.dueDate,
          projectName: this.taskForm.value.projectName,
          assigneeEmail: this.taskForm.value.assigneeEmail
        };
      }

      const request = this.isEditMode && this.taskId
        ? this.taskService.update(this.taskId, taskData)
        : this.taskService.create(taskData);

      request.subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Erro ao salvar tarefa:', error);
          this.errorMessage = error.error?.message || 'Erro ao salvar tarefa.';
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

  toggleAssigneeEmailField(): void {
    this.showAssigneeEmailField = !this.showAssigneeEmailField;
  }
}
