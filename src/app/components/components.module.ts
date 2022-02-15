import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './common/footer/footer.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { MaterialModule } from './material/material.module';
import { GraphsComponent } from './graphs/graphs.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    GraphsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    MaterialModule,
    ReactiveFormsModule,
    GraphsComponent,
    NgChartsModule
  ]
})
export class ComponentsModule { }
