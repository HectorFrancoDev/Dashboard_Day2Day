import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import { DashboardComponent } from 'app/dashboard/dashboard.component';
import { GeneralLayoutComponent } from './general-layout/general-layout.component';
import { MaterialModule } from 'app/components/material/material.module';
import { ComponentsModule } from 'app/components/components.module';
import { MapsComponent } from 'app/maps/maps.component';
import { UserProfileComponent } from 'app/user-profile/user-profile.component';


@NgModule({
  declarations: [
    DashboardComponent,
    MapsComponent,
    UserProfileComponent,
    GeneralLayoutComponent
  ],
  imports: [
    CommonModule,
    HighchartsChartModule,
    RouterModule,
    MaterialModule,
    ComponentsModule
  ],
  exports: []
})

export class LayoutModule { }
