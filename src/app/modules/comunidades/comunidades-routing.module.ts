import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaComunidadesComponent } from './components/lista-comunidades/lista-comunidades.component';
import { CrearComunidadComponent } from './components/crear-comunidad/crear-comunidad.component';
import { EditarComunidadComponent } from './components/editar-comunidad/editar-comunidad.component';
import { DetalleComunidadComponent } from './components/detalle-comunidad/detalle-comunidad.component';

const routes: Routes = [
  {
    path: '',
    component: ListaComunidadesComponent
  },
  {
    path: 'crear',
    component: CrearComunidadComponent
  },
  {
    path: 'editar/:id',
    component: EditarComunidadComponent
  },
  {
    path: 'detalle/:id',
    component: DetalleComunidadComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComunidadesRoutingModule { }
