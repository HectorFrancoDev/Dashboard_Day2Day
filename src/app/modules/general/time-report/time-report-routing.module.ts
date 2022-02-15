import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResumeTimeReportComponent } from 'app/components/time-report/pages/resume-time-report/resume-time-report.component';

const routes: Routes = [

  // {{cargo}}/time-report
  {
    path: '',
    redirectTo: 'time-report',
    pathMatch: 'full'
  },

  // {{cargo}}/time-report
  {
    path: 'time-report',
    component: ResumeTimeReportComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeReportRoutingModule { }
