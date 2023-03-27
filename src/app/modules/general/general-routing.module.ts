import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditUserComponent } from 'app/components/users/pages/edit-user/edit-user.component';
import { PerformanceUserComponent } from 'app/components/users/pages/performance-user/performance-user.component';
import { DashboardComponent } from 'app/dashboard/dashboard.component';
import { UserProfileComponent } from 'app/user-profile/user-profile.component';


const routes: Routes = [

  // {{cargo}}/dashboard
  {
    path: '',
    redirectTo: 'time-report',
    pathMatch: 'full'
  },

  // {{cargo}}/dashboard
  // {
  //   path: 'dashboard',
  //   component: DashboardComponent
  // },

  // {{cargo}}/users
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  },

  // {{cargo}}/users-cell
  {
    path: 'users-cell',
    loadChildren: () => import('./users-cell/users-cell.module').then(m => m.UsersCellModule)
  },

  // {{cargo}}/project-plan
  {
    path: 'project-plan',
    loadChildren: () => import('./project-plan/project-plan.module').then(m => m.ProjectPlanModule)
  },

  // {{cargo}}/time-report
  {
    path: 'time-report',
    loadChildren: () => import('./time-report/time-report.module').then(m => m.TimeReportModule)
  },

  // {{cargo}}/performance
  {
    path: 'performance',
    component: PerformanceUserComponent
  },

  // {{cargo}}/autogestion
  {
    path: 'autogestion',
    component: EditUserComponent
  },

  // {{cargo}}/profile
  {
    path: 'profile',
    component: UserProfileComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralRoutingModule { }
