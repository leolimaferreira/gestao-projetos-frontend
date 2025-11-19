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
  
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_NAME_KEY = 'user_name';
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry';
  
  isAuthenticated = signal<boolean>(this.hasToken());

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setUserName(response.name);
        this.setTokenExpiry();
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

  loginWithGoogle(): void {
    window.location.href = `${environment.apiUrl}/oauth2/authorization/google`;
  }

  logout(): void {
    this.removeToken();
    this.removeUserName();
    this.removeTokenExpiry();
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (this.isTokenExpired()) {
      this.logout();
      return null;
    }
    return sessionStorage.getItem(this.TOKEN_KEY) || localStorage.getItem(this.TOKEN_KEY);
  }

  getUserName(): string | null {
    return sessionStorage.getItem(this.USER_NAME_KEY) || localStorage.getItem(this.USER_NAME_KEY);
  }

  getUserId(): string {
    const token = this.getToken();
    if (!token) return '';

    try {
      const payload = this.decodeToken(token);
      return payload.sub || null;
    } catch (error) {
      return '';
    }
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  private setToken(token: string, rememberMe: boolean = false): void {
    if (rememberMe) {
      localStorage.setItem(this.TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  private setUserName(name: string): void {
    sessionStorage.setItem(this.USER_NAME_KEY, name);
    localStorage.setItem(this.USER_NAME_KEY, name);
  }

  private setTokenExpiry(): void {
    const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
    sessionStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  private isTokenExpired(): boolean {
    const expiry = sessionStorage.getItem(this.TOKEN_EXPIRY_KEY) || localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiry) return false;
    
    return new Date().getTime() > parseInt(expiry);
  }

  private removeToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  private removeUserName(): void {
    sessionStorage.removeItem(this.USER_NAME_KEY);
    localStorage.removeItem(this.USER_NAME_KEY);
  }

  private removeTokenExpiry(): void {
    sessionStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}
