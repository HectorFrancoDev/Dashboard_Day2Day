import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectPlanRoutingModule } from './project-plan-routing.module';
import { ResumeProjectPlanComponent } from './pages/resume-project-plan/resume-project-plan.component';
import { AddGeneralActivityComponent } from './pages/add-general-activity/add-general-activity.component';
import { AddSpecificActivityComponent } from './pages/add-specific-activity/add-specific-activity.component';
import { MaterialModule } from '../material/material.module';
import { ShowActivityComponent } from './pages/show-activity/show-activity.component';
import { EditAuditorActivityComponent } from './pages/edit-auditor-activity/edit-auditor-activity.component';


@NgModule({
  declarations: [
    ResumeProjectPlanComponent,
    AddGeneralActivityComponent,
    AddSpecificActivityComponent,
    ShowActivityComponent,
    EditAuditorActivityComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ProjectPlanRoutingModule,
  ]
})
export class ProjectPlanModule { }
