import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  declarations: [
    // LoginComponent irá aquí (lo agregas tú cuando lo crees)
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }