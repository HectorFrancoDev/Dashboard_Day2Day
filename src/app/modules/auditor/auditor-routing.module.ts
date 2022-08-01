import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResumeTimeReportComponent } from 'app/components/time-report/pages/resume-time-report/resume-time-report.component';
import { EditUserComponent } from 'app/components/users/pages/edit-user/edit-user.component';
import { PerformanceUserComponent } from 'app/components/users/pages/performance-user/performance-user.component';
import { UserProfileComponent } from 'app/user-profile/user-profile.component';

const routes: Routes = [

  // auditor/time-report
  {
    path: '',
    redirectTo: 'time-report',
    pathMatch: 'full'
  },

  // auditor/time-report
  {
    path: 'time-report',
    component: ResumeTimeReportComponent
  },

  // auditor/performance
  {
    path: 'performance',
    component: PerformanceUserComponent
  },

  // auditor/autogestion
  {
    path: 'autogestion',
    component: EditUserComponent
  },

  // auditor/profile
  {
    path: 'profile',
    component: UserProfileComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditorRoutingModule { }
