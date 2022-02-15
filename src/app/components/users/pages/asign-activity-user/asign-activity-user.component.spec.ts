import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignActivityUserComponent } from './asign-activity-user.component';

describe('AsignActivityUserComponent', () => {
  let component: AsignActivityUserComponent;
  let fixture: ComponentFixture<AsignActivityUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignActivityUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignActivityUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
