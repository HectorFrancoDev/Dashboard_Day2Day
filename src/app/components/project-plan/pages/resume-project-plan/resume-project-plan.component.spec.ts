import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeProjectPlanComponent } from './resume-project-plan.component';

describe('ResumeProjectPlanComponent', () => {
  let component: ResumeProjectPlanComponent;
  let fixture: ComponentFixture<ResumeProjectPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumeProjectPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeProjectPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
