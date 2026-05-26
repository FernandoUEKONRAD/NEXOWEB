import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NEXO Frontend';
  private currentUrl: string = '';

  constructor(private router: Router) {
    // Escucha los cambios de ruta para saber si estamos en /login
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.urlAfterRedirects || event.url || '';
      });
  }

  // Devuelve true si la URL actual es /login o la raíz (que redirige a /login)
  isLoginPage(): boolean {
    return this.currentUrl.startsWith('/login') || this.currentUrl === '/' || this.currentUrl === '';
  }
}