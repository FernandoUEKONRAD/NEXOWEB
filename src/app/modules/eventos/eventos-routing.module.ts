import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListaEventosComponent } from './components/lista-eventos/lista-eventos.component';
import { CrearEventoComponent } from './components/crear-evento/crear-evento.component';
import { EditarEventoComponent } from './components/editar-evento/editar-evento.component';
import { DetalleEventoComponent } from './components/detalle-evento/detalle-evento.component';

const routes: Routes = [
  { path: '', component: ListaEventosComponent },
  { path: 'crear', component: CrearEventoComponent },
  { path: 'editar/:id', component: EditarEventoComponent },
  { path: ':id', component: DetalleEventoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventosRoutingModule { }
