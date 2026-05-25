import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces que coinciden con el modelo del backend (src/models/Event.js)
export interface Usuario {
  _id: string;
  nombre: string;
  email: string;
}

export interface Evento {
  _id?: string;
  titulo: string;
  fecha: string | Date;
  ubicacion: string;
  asistentes?: (string | Usuario)[];
  probabilidadInasistencia?: number;
  creador?: string | Usuario;
  comunidad?: string;
  estado?: 'programado' | 'en curso' | 'finalizado' | 'cancelado';
  fechaCreacion?: string | Date;
}

export interface EventoResponse {
  msg: string;
  evento: Evento;
}

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  // OJO: el backend tiene un bug -> en app.js NO está registrado el router de eventos.
  // El profesor/Fernando debe agregar:  app.use('/api/events', eventRoutes);
  // Dejo la URL coherente con esa convención.
  private apiUrl = `${environment.apiUrl}/api/events`;

  constructor(private http: HttpClient) {}

  // GET /api/events?usuarioId=&comunidadId=
  obtenerEventos(filtros?: { usuarioId?: string; comunidadId?: string }): Observable<Evento[]> {
    let params = new HttpParams();
    if (filtros?.usuarioId) params = params.set('usuarioId', filtros.usuarioId);
    if (filtros?.comunidadId) params = params.set('comunidadId', filtros.comunidadId);
    return this.http.get<Evento[]>(this.apiUrl, { params });
  }

  // No hay GET /:id en el backend, así que filtramos en el cliente
  // (si quieres, dile al del backend que agregue un getEventoPorId)
  obtenerEventoPorId(id: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl);
  }

  // POST /api/events  (requiere JWT, el creador lo asigna el backend desde el token)
  crearEvento(evento: Evento): Observable<EventoResponse> {
    return this.http.post<EventoResponse>(this.apiUrl, evento);
  }

  // PUT /api/events/:id
  actualizarEvento(id: string, evento: Partial<Evento>): Observable<EventoResponse> {
    return this.http.put<EventoResponse>(`${this.apiUrl}/${id}`, evento);
  }

  // DELETE /api/events/:id
  eliminarEvento(id: string): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(`${this.apiUrl}/${id}`);
  }

  // Inscribirse: como no hay endpoint dedicado, usamos PUT con el $addToSet equivalente.
  // OJO: el actualizarEvento del backend usa findByIdAndUpdate con req.body directo,
  // así que enviar { asistentes: [...nuevoArray] } reemplaza el array completo.
  // Lo más seguro es obtener el evento, agregar el userId y enviarlo de vuelta.
  inscribirse(eventoId: string, userId: string, asistentesActuales: string[]): Observable<EventoResponse> {
    const nuevosAsistentes = asistentesActuales.includes(userId)
      ? asistentesActuales
      : [...asistentesActuales, userId];
    return this.actualizarEvento(eventoId, { asistentes: nuevosAsistentes });
  }

  desinscribirse(eventoId: string, userId: string, asistentesActuales: string[]): Observable<EventoResponse> {
    const nuevosAsistentes = asistentesActuales.filter(id => id !== userId);
    return this.actualizarEvento(eventoId, { asistentes: nuevosAsistentes });
  }
}
