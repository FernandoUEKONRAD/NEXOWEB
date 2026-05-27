import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Agregar token al header de la solicitud
    if (this.authService.isAuthenticated()) {
      request = this.addToken(request);
    }

    return next.handle(request).pipe(
      tap(event => {
        // Manejar respuestas exitosas
        if (event instanceof HttpResponse) {
          // Aquí puedes manejar cualquier lógica relacionada con respuestas exitosas
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Agregar token de autenticación al header
   */
  private addToken(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.authService.getToken();
    
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return request;
  }

  /**
   * Manejar errores de HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      // Token expirado o inválido
      this.authService.logout();
      this.router.navigate(['/login'], {
        queryParams: { sessionExpired: true }
      });
    } else if (error.status === 403) {
      // Acceso prohibido
      this.router.navigate(['/dashboard']);
    }

    return throwError(() => error);
  }
}
