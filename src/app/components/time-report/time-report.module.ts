import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeReportRoutingModule } from './time-report-routing.module';
import { ResumeTimeReportComponent } from './pages/resume-time-report/resume-time-report.component';
import { AddReportComponent } from './pages/add-report/add-report.component';
import { MaterialModule } from '../material/material.module';

import { MAT_DATE_LOCALE } from '@angular/material/core';


@NgModule({
  declarations: [
    ResumeTimeReportComponent,
    AddReportComponent
  ],
  imports: [
    CommonModule,
    TimeReportRoutingModule,
    MaterialModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-CO' }
  ],
})
export class TimeReportModule { }
