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
    this.checkTokenOnInit();
  }

  /**
   * Verificar si hay un token válido al inicializar
   */
  private checkTokenOnInit(): void {
    if (this.hasToken()) {
      this.isAuthenticatedSubject.next(true);
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

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      switch (error.status) {
        case 401:
          errorMessage = 'Credenciales inválidas. Intenta de nuevo.';
          break;
        case 409:
          errorMessage = 'El email ya está registrado.';
          break;
        case 400:
          errorMessage = error.error?.message || 'Datos inválidos.';
          break;
        case 500:
          errorMessage = 'Error del servidor. Intenta más tarde.';
          break;
      }
    }

    console.error('Error de autenticación:', error);
    return throwError(() => new Error(errorMessage));
  }
}
