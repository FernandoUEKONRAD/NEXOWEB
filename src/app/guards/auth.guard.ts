import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const isAuthenticated = this.authService.isAuthenticated();
    
    if (isAuthenticated) {
      // Verificar si la ruta requiere un rol específico
      if (route.data && route.data['role']) {
        const requiredRole = route.data['role'];
        if (this.authService.hasRole(requiredRole)) {
          return true;
        } else {
          // Usuario autenticado pero sin el rol requerido
          this.router.navigate(['/dashboard']);
          return false;
        }
      }
      return true;
    } else {
      // Redirigir a login si no está autenticado
      console.log('No autenticado, redirigiendo a login. URL solicitada:', state.url);
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
