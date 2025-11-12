import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RecoveryRequest, RecoveryResponse, ChangePassword } from '../../shared/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  
  private readonly TOKEN_KEY = 'token';
  private readonly USER_NAME_KEY = 'userName';
  
  isAuthenticated = signal<boolean>(this.hasToken());

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setUserName(response.name);
        this.isAuthenticated.set(true);
      })
    );
  }

  generateRecoveryToken(request: RecoveryRequest): Observable<RecoveryResponse> {
    return this.http.post<RecoveryResponse>(`${this.apiUrl}/generate-recovery-token`, request);
  }

  changePassword(data: ChangePassword): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-password`, data);
  }

  logout(): void {
    this.removeToken();
    this.removeUserName();
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserName(): string | null {
    return localStorage.getItem(this.USER_NAME_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setUserName(name: string): void {
    localStorage.setItem(this.USER_NAME_KEY, name);
  }

  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  private removeUserName(): void {
    localStorage.removeItem(this.USER_NAME_KEY);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}
