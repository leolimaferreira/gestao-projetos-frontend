import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroKey, heroEnvelope, heroExclamationCircle, heroCheckCircle, heroArrowPath, heroArrowLeft } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgIconComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
  viewProviders: [provideIcons({ heroKey, heroEnvelope, heroExclamationCircle, heroCheckCircle, heroArrowPath, heroArrowLeft })]
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  forgotForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor() {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.generateRecoveryToken(this.forgotForm.value).subscribe({
        next: (response) => {
          this.successMessage = 'Email de recuperação enviado! Verifique sua caixa de entrada e spam.';
          this.isLoading = false;
          this.forgotForm.reset();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erro ao solicitar recuperação de senha.';
          this.isLoading = false;
        }
      });
    }
  }

  get email() {
    return this.forgotForm.get('email');
  }
}
