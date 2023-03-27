import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsignActivityUserComponent } from 'app/components/users/pages/asign-activity-user/asign-activity-user.component';
import { EditUserComponent } from 'app/components/users/pages/edit-user/edit-user.component';
import { ListUsersCellsComponent } from 'app/components/users/pages/list-users-cells/list-users-cells.component';
import { PerformanceUserComponent } from 'app/components/users/pages/performance-user/performance-user.component';

const routes: Routes = [

    // {{cargo}}/users-cell
    {
      path: '',
      component: ListUsersCellsComponent
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
  


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersCellRoutingModule { }
