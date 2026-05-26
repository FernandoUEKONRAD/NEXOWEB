import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ComunidadesRoutingModule } from './comunidades-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { ListaComunidadesComponent } from './components/lista-comunidades/lista-comunidades.component';
import { CrearComunidadComponent } from './components/crear-comunidad/crear-comunidad.component';
import { EditarComunidadComponent } from './components/editar-comunidad/editar-comunidad.component';
import { DetalleComunidadComponent } from './components/detalle-comunidad/detalle-comunidad.component';

@NgModule({
  declarations: [
    ListaComunidadesComponent,
    CrearComunidadComponent,
    EditarComunidadComponent,
    DetalleComunidadComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ComunidadesRoutingModule,
    SharedModule
  ]
})
export class ComunidadesModule { }
