import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsignActivityUserComponent } from 'app/components/users/pages/asign-activity-user/asign-activity-user.component';
import { EditUserComponent } from 'app/components/users/pages/edit-user/edit-user.component';
import { ListUsersComponent } from 'app/components/users/pages/list-users/list-users.component';
import { PerformanceUserComponent } from 'app/components/users/pages/performance-user/performance-user.component';
import { UserProfileComponent } from 'app/user-profile/user-profile.component';

const routes: Routes = [

  // {{cargo}}/users
  {
    path: '',
    component: ListUsersComponent
  },

  // {{cargo}}/users/:id
  {
    path: ':id',
    component: AsignActivityUserComponent
  },

  // {{cargo}}/users/performance/:id
  {
    path: 'performance/:id',
    component: PerformanceUserComponent
  },

  // {{cargo}}/users/edit/:id
  {
    path: 'edit/:id',
    component: EditUserComponent
  },

  // {{cargo}}/users/profile/:id
  {
    path: 'profile/:id',
    component: UserProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
