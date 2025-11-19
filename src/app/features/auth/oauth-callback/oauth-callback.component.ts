import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Autenticando com Google...</p>
        <p *ngIf="debugMessage" class="debug">{{ debugMessage }}</p>
      </div>
    </div>
  `,
  styles: [`
    .callback-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .loading-spinner {
      text-align: center;
      color: white;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    p {
      font-size: 18px;
      font-weight: 500;
    }

    .debug {
      font-size: 12px;
      margin-top: 10px;
      opacity: 0.8;
    }
  `]
})
export class OauthCallbackComponent implements OnInit {
  debugMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {
      
      const token = params['token'];
      const name = params['name'];

      this.debugMessage = `Token: ${token ? 'Recebido' : 'Não recebido'}`;

      if (token) {
        localStorage.setItem('auth_token', token);
        sessionStorage.setItem('auth_token', token);
        
        if (name) {
          const decodedName = decodeURIComponent(name);
          localStorage.setItem('user_name', decodedName);
          sessionStorage.setItem('user_name', decodedName);
        }

        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        localStorage.setItem('token_expiry', expiryTime.toString());
        sessionStorage.setItem('token_expiry', expiryTime.toString());

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      } else {
        this.router.navigate(['/login'], {
          queryParams: { error: 'authentication_failed' }
        });
      }
    });
  }
}
