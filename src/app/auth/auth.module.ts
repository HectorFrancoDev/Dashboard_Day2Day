import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { TempLoginComponent } from './pages/temp-login/temp-login.component';
import { FormsModule } from '@angular/forms';
import { GoogleLoginComponent } from './pages/google-login/google-login.component';
import { ComponentsModule } from 'app/components/components.module';
import { MaterialModule } from 'app/components/material/material.module';


@NgModule({
  declarations: [
    GoogleLoginComponent,
    TempLoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ComponentsModule,
    MaterialModule
  ]
})
export class AuthModule { }
