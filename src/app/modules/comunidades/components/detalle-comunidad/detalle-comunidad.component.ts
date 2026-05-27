import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunidadesService, Comunidad } from '../../../../services/comunidades.service';

@Component({
  selector: 'app-detalle-comunidad',
  templateUrl: './detalle-comunidad.component.html',
  styleUrls: ['./detalle-comunidad.component.css']
})
export class DetalleComunidadComponent implements OnInit {
  comunidad: Comunidad | null = null;
  loading = false;
  error: string | null = null;
  showDeleteModal = false;
  comunidadId: string | null = null;

  constructor(
    private comunidadesService: ComunidadesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarComunidad();
  }

  cargarComunidad(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.comunidadId = id;
        this.loading = true;
        this.error = null;

        this.comunidadesService.getComunidad(id).subscribe({
          next: (comunidad: Comunidad) => {
            this.comunidad = comunidad;
            this.loading = false;
          },
          error: (error: any) => {
            this.error = 'Error al cargar la comunidad';
            this.loading = false;
            console.error('Error:', error);
          }
        });
      }
    });
  }

  editarComunidad(): void {
    if (this.comunidad?.id) {
      this.router.navigate(['/comunidades/editar', this.comunidad.id]);
    }
  }

  abrirModalEliminar(): void {
    this.showDeleteModal = true;
  }

  confirmarEliminar(): void {
    if (this.comunidadId) {
      this.comunidadesService.eliminarComunidad(this.comunidadId).subscribe({
        next: () => {
          this.router.navigate(['/comunidades']);
        },
        error: (error: any) => {
          this.error = 'Error al eliminar la comunidad';
          console.error('Error:', error);
        }
      });
    }
  }

  cancelarEliminar(): void {
    this.showDeleteModal = false;
  }

  volverAlListado(): void {
    this.router.navigate(['/comunidades']);
  }
}
