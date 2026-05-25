import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventosService } from '../../../../services/eventos.service';

@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.component.html',
  styleUrls: ['./crear-evento.component.css']
})
export class CrearEventoComponent {
  form: FormGroup;
  cargando: boolean = false;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private eventosService: EventosService,
    private router: Router
  ) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      fecha: ['', Validators.required],
      ubicacion: ['', Validators.required],
      probabilidadInasistencia: [0, [Validators.min(0), Validators.max(100)]],
      comunidad: [''],
      estado: ['programado']
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.error = '';

    // Limpiar campos vacíos opcionales antes de enviar
    const datos: any = { ...this.form.value };
    if (!datos.comunidad) delete datos.comunidad;

    this.eventosService.crearEvento(datos).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/eventos']);
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.msg || 'Error al crear el evento';
        this.cargando = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/eventos']);
  }

  // Helpers para mostrar errores en el template
  campoInvalido(campo: string): boolean {
    const c = this.form.get(campo);
    return !!c && c.invalid && (c.dirty || c.touched);
  }
}