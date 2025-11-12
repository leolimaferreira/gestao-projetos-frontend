import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  forgotForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  tokenReceived = false;

  changePasswordForm: FormGroup;

  constructor() {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.changePasswordForm = this.fb.group({
      tokenId: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onRequestToken(): void {
    if (this.forgotForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.generateRecoveryToken(this.forgotForm.value).subscribe({
        next: (response) => {
          this.successMessage = 'Token de recuperação enviado! Verifique seu e-mail.';
          this.tokenReceived = true;
          this.changePasswordForm.patchValue({ tokenId: response.id });
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erro ao solicitar recuperação de senha.';
          this.isLoading = false;
        }
      });
    }
  }

  onChangePassword(): void {
    if (this.changePasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.changePassword(this.changePasswordForm.value).subscribe({
        next: () => {
          this.successMessage = 'Senha alterada com sucesso! Você já pode fazer login.';
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erro ao alterar senha.';
          this.isLoading = false;
        }
      });
    }
  }

  get email() {
    return this.forgotForm.get('email');
  }

  get tokenId() {
    return this.changePasswordForm.get('tokenId');
  }

  get newPassword() {
    return this.changePasswordForm.get('newPassword');
  }
}
