import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TranslationService } from '../services/translation.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const translationService = inject(TranslationService);
  const router = inject(Router);
  const token = authService.getToken();

  const publicRoutes = [
    '/auth/login',
    '/auth/generate-recovery-token',
    '/auth/change-password',
    '/users'
  ];

  const isPublicRoute = publicRoutes.some(route => req.url.includes(route) && req.method === 'POST');

  if (token && !isPublicRoute) {
    req = req.clone({
      setHeaders: {
        Authorization: token
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      
      if (error.error?.message) {
        const originalMessage = error.error.message;
        const translatedMessage = translationService.translate(originalMessage);
        
        error = new HttpErrorResponse({
          error: { ...error.error, message: translatedMessage },
          headers: error.headers,
          status: error.status,
          statusText: error.statusText,
          url: error.url || undefined
        });
      }

      if (error.status === 401 || error.status === 403) {
        authService.logout();
        router.navigate(['/login'], {
          queryParams: { returnUrl: router.url, sessionExpired: 'true' }
        });
      }
      
      return throwError(() => error);
    })
  );
};
