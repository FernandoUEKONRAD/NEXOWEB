import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComunidadesService, Comunidad } from '../../../services/comunidades.service';

@Component({
  selector: 'app-crear-comunidad',
  templateUrl: './crear-comunidad.component.html',
  styleUrls: ['./crear-comunidad.component.css']
})
export class CrearComunidadComponent implements OnInit {
  formulario!: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private comunidadesService: ComunidadesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      ubicacion: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  get f() {
    return this.formulario.controls;
  }

  enviar(): void {
    if (this.formulario.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;

    const comunidad: Comunidad = this.formulario.value;

    this.comunidadesService.crearComunidad(comunidad).subscribe({
      next: () => {
        this.router.navigate(['/comunidades']);
      },
      error: (error) => {
        this.error = 'Error al crear la comunidad';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/comunidades']);
  }
}
