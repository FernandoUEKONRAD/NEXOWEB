import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl || 'http://localhost:3000/api';
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  private currentUserSubject = new BehaviorSubject<any>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cleanupInvalidTokens();
  }

  /**
   * Limpiar tokens inválidos al inicializar
   */
  private cleanupInvalidTokens(): void {
    const token = this.getToken();
    if (token && this.isTokenExpired(token)) {
      this.removeToken();
      this.removeUser();
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next(null);
    }
  }

  /**
   * Registrar un nuevo usuario
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    const { confirmPassword, ...registerData } = data;
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, registerData)
      .pipe(
        tap(response => {
          if (response.token) {
            this.storeToken(response.token);
            if (response.user) {
              this.storeUser(response.user);
              this.currentUserSubject.next(response.user);
            }
            this.isAuthenticatedSubject.next(true);
          }
        }),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Iniciar sesión
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.token) {
            this.storeToken(response.token);
            if (response.user) {
              this.storeUser(response.user);
              this.currentUserSubject.next(response.user);
            }
            this.isAuthenticatedSubject.next(true);
          }
        }),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    this.removeToken();
    this.removeUser();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  /**
   * Obtener el token actual
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.hasToken();
  }

  /**
   * Obtener el usuario actual
   */
  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user && user.role === role;
  }

  /**
   * Verificar si existe un token válido
   */
  private hasToken(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Almacenar token en localStorage
   */
  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Remover token
   */
  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
  }

  /**
   * Almacenar información del usuario
   */
  private storeUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  /**
   * Obtener usuario almacenado
   */
  private getStoredUser(): any {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Remover información del usuario
   */
  private removeUser(): void {
    localStorage.removeItem(this.userKey);
  }

  /**
   * Verificar si el token está expirado (decodificar JWT)
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convertir a milisegundos
      return Date.now() >= exp;
    } catch {
      return true;
    }
  }

  /**
   * Manejo de errores
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ha ocurrido un error en la autenticación';

    // Log detallado para depuración
    console.error('🔴 Error de autenticación - Detalle completo:');
    console.error('   status:', error.status);
    console.error('   statusText:', error.statusText);
    console.error('   url:', error.url);
    console.error('   error.error:', error.error);
    console.error('   error completo:', error);

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente (red, CORS, etc.)
      errorMessage = `Error de red: ${error.error.message}`;
    } else if (error.status === 0) {
      // No se pudo contactar al servidor
      errorMessage = 'No se puede conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:3000';
    } else {
      // Intentar extraer el mensaje del backend (que devuelve {msg: "..."})
      const backendMsg = error.error?.msg || error.error?.message || (typeof error.error === 'string' ? error.error : null);

      switch (error.status) {
        case 401:
          errorMessage = backendMsg || 'Credenciales inválidas. Intenta de nuevo.';
          break;
        case 409:
          errorMessage = backendMsg || 'El email ya está registrado.';
          break;
        case 400:
          errorMessage = backendMsg || 'Datos inválidos.';
          break;
        case 500:
          errorMessage = backendMsg || 'Error del servidor. Intenta más tarde.';
          break;
        default:
          errorMessage = backendMsg || `Error HTTP ${error.status}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
