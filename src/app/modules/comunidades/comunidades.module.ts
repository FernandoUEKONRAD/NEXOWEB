import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ComunidadesRoutingModule } from './comunidades-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    // Componentes de comunidades irán aquí
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
