import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunidadesService, Comunidad } from '../../../services/comunidades.service';

@Component({
  selector: 'app-editar-comunidad',
  templateUrl: './editar-comunidad.component.html',
  styleUrls: ['./editar-comunidad.component.css']
})
export class EditarComunidadComponent implements OnInit {
  formulario!: FormGroup;
  loading = false;
  error: string | null = null;
  comunidadId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private comunidadesService: ComunidadesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarComunidad();
  }

  inicializarFormulario(): void {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      ubicacion: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  cargarComunidad(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.comunidadId = id;
        this.loading = true;

        this.comunidadesService.getComunidad(id).subscribe({
          next: (comunidad) => {
            this.formulario.patchValue({
              nombre: comunidad.nombre,
              descripcion: comunidad.descripcion,
              ubicacion: comunidad.ubicacion
            });
            this.loading = false;
          },
          error: (error) => {
            this.error = 'Error al cargar la comunidad';
            this.loading = false;
            console.error('Error:', error);
          }
        });
      }
    });
  }

  get f() {
    return this.formulario.controls;
  }

  enviar(): void {
    if (this.formulario.invalid || !this.comunidadId) {
      return;
    }

    this.loading = true;
    this.error = null;

    const comunidad: Comunidad = this.formulario.value;

    this.comunidadesService.actualizarComunidad(this.comunidadId, comunidad).subscribe({
      next: () => {
        this.router.navigate(['/comunidades']);
      },
      error: (error) => {
        this.error = 'Error al actualizar la comunidad';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/comunidades']);
  }
}
