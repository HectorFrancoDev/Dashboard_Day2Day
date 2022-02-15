import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerformanceUserComponent } from 'app/components/users/pages/performance-user/performance-user.component';

const routes: Routes = [


    // auditor/performance/
    {
      path: '',
      redirectTo: 'performance',
      pathMatch: 'full'
    },

    // auditor/performance/
    {
      path: 'performance',
      component: PerformanceUserComponent
    }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
