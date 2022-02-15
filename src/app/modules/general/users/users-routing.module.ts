import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsignActivityUserComponent } from 'app/components/users/pages/asign-activity-user/asign-activity-user.component';
import { ListUsersComponent } from 'app/components/users/pages/list-users/list-users.component';
import { PerformanceUserComponent } from 'app/components/users/pages/performance-user/performance-user.component';

const routes: Routes = [

  // vicepresident/users
  {
    path: '',
    component: ListUsersComponent
  },

  // vicepresident/users/:id
  {
    path: ':id',
    component: AsignActivityUserComponent
  },

  // vicepresident/users/performance/:id
  {
    path: 'performance/:id',
    component: PerformanceUserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
