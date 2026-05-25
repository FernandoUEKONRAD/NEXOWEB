import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EventosRoutingModule } from './eventos-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { ListaEventosComponent } from './components/lista-eventos/lista-eventos.component';
import { CrearEventoComponent } from './components/crear-evento/crear-evento.component';
import { EditarEventoComponent } from './components/editar-evento/editar-evento.component';
import { DetalleEventoComponent } from './components/detalle-evento/detalle-evento.component';

@NgModule({
  declarations: [
    ListaEventosComponent,
    CrearEventoComponent,
    EditarEventoComponent,
    DetalleEventoComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    EventosRoutingModule,
    SharedModule
  ]
})
export class EventosModule { }
