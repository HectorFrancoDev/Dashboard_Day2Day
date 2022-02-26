import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResumeProjectPlanComponent } from 'app/components/project-plan/pages/resume-project-plan/resume-project-plan.component';
import { ShowActivityComponent } from 'app/components/project-plan/pages/show-activity/show-activity.component';

const routes: Routes = [

    // {{cargo}}/project-plan
    {
      path: '',
      component: ResumeProjectPlanComponent
    },

    // {{cargo}}/project-plan/activities/:id
    {
      path: 'activities/:id',
      component: ShowActivityComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectPlanRoutingModule { }
