import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAuditorActivityComponent } from './edit-auditor-activity.component';

describe('EditAuditorActivityComponent', () => {
  let component: EditAuditorActivityComponent;
  let fixture: ComponentFixture<EditAuditorActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAuditorActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAuditorActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
