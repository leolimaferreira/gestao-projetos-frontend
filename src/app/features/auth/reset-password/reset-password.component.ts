import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  resetForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  tokenId = '';

  constructor() {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.tokenId = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.tokenId) {
      this.errorMessage = 'Token de recuperação não fornecido.';
    }
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.resetForm.valid && this.tokenId) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const data = {
        tokenId: this.tokenId,
        newPassword: this.resetForm.value.newPassword
      };

      this.authService.changePassword(data).subscribe({
        next: () => {
          this.successMessage = 'Senha alterada com sucesso! Redirecionando para o login...';
          this.isLoading = false;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erro ao alterar senha. O token pode estar expirado.';
          this.isLoading = false;
        }
      });
    }
  }

  get newPassword() {
    return this.resetForm.get('newPassword');
  }

  get confirmPassword() {
    return this.resetForm.get('confirmPassword');
  }
}
