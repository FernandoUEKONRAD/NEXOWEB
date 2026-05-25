import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventosService, Evento } from '../../../../services/eventos.service';

@Component({
  selector: 'app-editar-evento',
  templateUrl: './editar-evento.component.html',
  styleUrls: ['./editar-evento.component.css']
})
export class EditarEventoComponent implements OnInit {
  form: FormGroup;
  cargando: boolean = false;
  cargandoInicial: boolean = true;
  error: string = '';
  eventoId: string = '';

  constructor(
    private fb: FormBuilder,
    private eventosService: EventosService,
    private route: ActivatedRoute,
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

  ngOnInit(): void {
    this.eventoId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.eventoId) {
      this.error = 'ID de evento no válido';
      this.cargandoInicial = false;
      return;
    }
    this.cargarEvento();
  }

  cargarEvento(): void {
    // Como el backend no tiene GET /:id, traemos todos y filtramos
    this.eventosService.obtenerEventos().subscribe({
      next: (eventos) => {
        const evento = eventos.find(e => e._id === this.eventoId);
        if (!evento) {
          this.error = 'Evento no encontrado';
          this.cargandoInicial = false;
          return;
        }
        this.precargarFormulario(evento);
        this.cargandoInicial = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar el evento';
        this.cargandoInicial = false;
      }
    });
  }

  private precargarFormulario(evento: Evento): void {
    // Convertir fecha a formato datetime-local (YYYY-MM-DDTHH:mm)
    const fechaInput = evento.fecha
      ? new Date(evento.fecha).toISOString().slice(0, 16)
      : '';

    const comunidadVal = typeof evento.comunidad === 'string' ? evento.comunidad : '';

    this.form.patchValue({
      titulo: evento.titulo,
      fecha: fechaInput,
      ubicacion: evento.ubicacion,
      probabilidadInasistencia: evento.probabilidadInasistencia ?? 0,
      comunidad: comunidadVal,
      estado: evento.estado ?? 'programado'
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.error = '';

    const datos: any = { ...this.form.value };
    if (!datos.comunidad) delete datos.comunidad;

    this.eventosService.actualizarEvento(this.eventoId, datos).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/eventos']);
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.msg || 'Error al actualizar el evento';
        this.cargando = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/eventos']);
  }

  campoInvalido(campo: string): boolean {
    const c = this.form.get(campo);
    return !!c && c.invalid && (c.dirty || c.touched);
  }
}
