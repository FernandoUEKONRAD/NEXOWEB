import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComunidadesService, Comunidad } from '../../../services/comunidades.service';

@Component({
  selector: 'app-lista-comunidades',
  templateUrl: './lista-comunidades.component.html',
  styleUrls: ['./lista-comunidades.component.css']
})
export class ListaComunidadesComponent implements OnInit {
  comunidades: Comunidad[] = [];
  loading = false;
  error: string | null = null;
  showDeleteModal = false;
  comunidadToDelete: Comunidad | null = null;

  constructor(
    private comunidadesService: ComunidadesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarComunidades();
  }

  cargarComunidades(): void {
    this.loading = true;
    this.error = null;

    this.comunidadesService.getComunidades().subscribe({
      next: (comunidades) => {
        this.comunidades = comunidades;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las comunidades';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  crearComunidad(): void {
    this.router.navigate(['/comunidades/crear']);
  }

  editarComunidad(comunidad: Comunidad): void {
    this.router.navigate(['/comunidades/editar', comunidad.id]);
  }

  verDetalle(comunidad: Comunidad): void {
    this.router.navigate(['/comunidades/detalle', comunidad.id]);
  }

  abrirModalEliminar(comunidad: Comunidad): void {
    this.comunidadToDelete = comunidad;
    this.showDeleteModal = true;
  }

  confirmarEliminar(): void {
    if (this.comunidadToDelete) {
      this.comunidadesService.eliminarComunidad(this.comunidadToDelete.id!).subscribe({
        next: () => {
          this.showDeleteModal = false;
          this.cargarComunidades();
        },
        error: (error) => {
          this.error = 'Error al eliminar la comunidad';
          console.error('Error:', error);
        }
      });
    }
  }

  cancelarEliminar(): void {
    this.showDeleteModal = false;
    this.comunidadToDelete = null;
  }
}
