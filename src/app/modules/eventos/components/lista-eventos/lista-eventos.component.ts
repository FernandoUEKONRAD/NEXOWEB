import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventosService, Evento } from '../../../../services/eventos.service';

@Component({
  selector: 'app-lista-eventos',
  templateUrl: './lista-eventos.component.html',
  styleUrls: ['./lista-eventos.component.css']
})
export class ListaEventosComponent implements OnInit {
  eventos: Evento[] = [];
  cargando: boolean = false;
  error: string = '';

  // Modal eliminar
  showModalEliminar: boolean = false;
  eventoSeleccionado: Evento | null = null;

  // Filtros
  filtroComunidad: string = '';
  filtroEstado: string = '';

  constructor(
    private eventosService: EventosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos(): void {
    this.cargando = true;
    this.error = '';
    this.eventosService.obtenerEventos().subscribe({
      next: (data) => {
        this.eventos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar los eventos';
        this.cargando = false;
      }
    });
  }

  // Devuelve eventos filtrados (sin tocar el array original)
  get eventosFiltrados(): Evento[] {
    return this.eventos.filter(e => {
      const okEstado = !this.filtroEstado || e.estado === this.filtroEstado;
      return okEstado;
    });
  }

  irACrear(): void {
    this.router.navigate(['/eventos/crear']);
  }

  irADetalle(id: string | undefined): void {
    if (id) this.router.navigate(['/eventos', id]);
  }

  irAEditar(id: string | undefined): void {
    if (id) this.router.navigate(['/eventos/editar', id]);
  }

  abrirModalEliminar(evento: Evento): void {
    this.eventoSeleccionado = evento;
    this.showModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.showModalEliminar = false;
    this.eventoSeleccionado = null;
  }

  confirmarEliminar(): void {
    if (!this.eventoSeleccionado?._id) return;
    this.eventosService.eliminarEvento(this.eventoSeleccionado._id).subscribe({
      next: () => {
        this.eventos = this.eventos.filter(e => e._id !== this.eventoSeleccionado!._id);
        this.cerrarModalEliminar();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al eliminar el evento';
        this.cerrarModalEliminar();
      }
    });
  }

  // Helpers de presentación
  formatearFecha(fecha: string | Date | undefined): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  // Normaliza el estado para que "en curso" se vuelva "en-curso" como clase CSS
  claseEstado(estado: string | undefined): string {
    const estadoLimpio = (estado || 'programado').replace(/\s+/g, '-');
    return `badge badge-${estadoLimpio}`;
  }
}