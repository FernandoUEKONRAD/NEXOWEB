import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventosService, Evento, Usuario } from '../../../../services/eventos.service';

@Component({
  selector: 'app-detalle-evento',
  templateUrl: './detalle-evento.component.html',
  styleUrls: ['./detalle-evento.component.css']
})
export class DetalleEventoComponent implements OnInit {
  evento: Evento | null = null;
  cargando: boolean = true;
  procesando: boolean = false;
  error: string = '';

  // ID del usuario actual (sacado del token JWT en localStorage)
  userIdActual: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventosService: EventosService
  ) {}

  ngOnInit(): void {
    this.userIdActual = this.obtenerUserIdDelToken();
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID de evento no válido';
      this.cargando = false;
      return;
    }
    this.cargarEvento(id);
  }

  // Decodifica el token JWT (payload) para sacar el id del usuario.
  // El backend firma { id, rol } al hacer login (ver authController.js).
  private obtenerUserIdDelToken(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || '';
    } catch {
      return '';
    }
  }

  cargarEvento(id: string): void {
    this.cargando = true;
    this.eventosService.obtenerEventos().subscribe({
      next: (eventos) => {
        const encontrado = eventos.find(e => e._id === id);
        if (!encontrado) {
          this.error = 'Evento no encontrado';
        } else {
          this.evento = encontrado;
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar el evento';
        this.cargando = false;
      }
    });
  }

  // Saca los IDs (string) de los asistentes, sin importar si vienen poblados o no
  private extraerIdsAsistentes(): string[] {
    if (!this.evento?.asistentes) return [];
    return this.evento.asistentes.map(a => typeof a === 'string' ? a : a._id);
  }

  get estaInscrito(): boolean {
    if (!this.userIdActual) return false;
    return this.extraerIdsAsistentes().includes(this.userIdActual);
  }

  get nombresAsistentes(): string[] {
    if (!this.evento?.asistentes) return [];
    return this.evento.asistentes
      .filter((a): a is Usuario => typeof a !== 'string')
      .map(a => a.nombre);
  }

  inscribirse(): void {
    if (!this.evento?._id || !this.userIdActual) return;
    this.procesando = true;
    const idsActuales = this.extraerIdsAsistentes();

    this.eventosService.inscribirse(this.evento._id, this.userIdActual, idsActuales).subscribe({
      next: () => {
        this.procesando = false;
        // Recargar para traer asistentes con populate del backend
        this.cargarEvento(this.evento!._id!);
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo completar la inscripción';
        this.procesando = false;
      }
    });
  }

  desinscribirse(): void {
    if (!this.evento?._id || !this.userIdActual) return;
    this.procesando = true;
    const idsActuales = this.extraerIdsAsistentes();

    this.eventosService.desinscribirse(this.evento._id, this.userIdActual, idsActuales).subscribe({
      next: () => {
        this.procesando = false;
        this.cargarEvento(this.evento!._id!);
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo completar la desinscripción';
        this.procesando = false;
      }
    });
  }

  formatearFecha(fecha: string | Date | undefined): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  nombreCreador(): string {
    if (!this.evento?.creador) return 'Desconocido';
    return typeof this.evento.creador === 'string'
      ? this.evento.creador
      : this.evento.creador.nombre;
  }

  // Normaliza "en curso" -> "en-curso" para que la clase CSS sea válida
  claseEstado(estado: string | undefined): string {
    const estadoLimpio = (estado || 'programado').replace(/\s+/g, '-');
    return `badge badge-${estadoLimpio}`;
  }

  irAEditar(): void {
    if (this.evento?._id) {
      this.router.navigate(['/eventos/editar', this.evento._id]);
    }
  }

  volver(): void {
    this.router.navigate(['/eventos']);
  }
}