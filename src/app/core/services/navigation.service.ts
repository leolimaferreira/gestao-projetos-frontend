import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private history: string[] = [];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.history.push(event.urlAfterRedirects);
      });
  }

  back(): void {
    this.history.pop();
    if (this.history.length > 0) {
      const previousUrl = this.history[this.history.length - 1];
      this.router.navigateByUrl(previousUrl);
    } else {
      this.router.navigateByUrl('/');
    }
  }

  getPreviousUrl(): string | null {
    if (this.history.length > 1) {
      return this.history[this.history.length - 2]; 
    }
    return null;
  }

  getHistory(): string[] {
    return this.history;
  }
}
