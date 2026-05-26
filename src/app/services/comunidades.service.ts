import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Comunidad {
  id?: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  miembros?: number;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ComunidadesService {
  private apiUrl = `${environment.apiUrl}/community`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las comunidades
   */
  getComunidades(): Observable<Comunidad[]> {
    return this.http.get<Comunidad[]>(this.apiUrl);
  }

  /**
   * Obtiene una comunidad por ID
   */
  getComunidad(id: string): Observable<Comunidad> {
    return this.http.get<Comunidad>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea una nueva comunidad
   */
  crearComunidad(comunidad: Comunidad): Observable<Comunidad> {
    return this.http.post<Comunidad>(this.apiUrl, comunidad);
  }

  /**
   * Actualiza una comunidad existente
   */
  actualizarComunidad(id: string, comunidad: Comunidad): Observable<Comunidad> {
    return this.http.put<Comunidad>(`${this.apiUrl}/${id}`, comunidad);
  }

  /**
   * Elimina una comunidad
   */
  eliminarComunidad(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
