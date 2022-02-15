import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResumeProjectPlanComponent } from 'app/components/project-plan/pages/resume-project-plan/resume-project-plan.component';

const routes: Routes = [

    // vicepresident/project-plan
    {
      path: '',
      component: ResumeProjectPlanComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectPlanRoutingModule { }
