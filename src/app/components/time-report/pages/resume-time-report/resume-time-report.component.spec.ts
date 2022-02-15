import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeTimeReportComponent } from './resume-time-report.component';

describe('ResumeTimeReportComponent', () => {
  let component: ResumeTimeReportComponent;
  let fixture: ComponentFixture<ResumeTimeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumeTimeReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeTimeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
