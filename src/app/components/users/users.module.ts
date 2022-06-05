import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ListUsersComponent } from './pages/list-users/list-users.component';
import { AsignActivityUserComponent } from './pages/asign-activity-user/asign-activity-user.component';
import { PerformanceUserComponent } from './pages/performance-user/performance-user.component';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from '../material/material.module';
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../components.module';
import { EditUserComponent } from './pages/edit-user/edit-user.component';


@NgModule({
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-CO' }
  ],
  declarations: [
    ListUsersComponent,
    AsignActivityUserComponent,
    PerformanceUserComponent,
    CreateUserComponent,
    EditUserComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    LayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    ComponentsModule
  ]
})
export class UsersModule { }
