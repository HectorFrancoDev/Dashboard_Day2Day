import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGeneralActivityComponent } from './add-general-activity.component';

describe('AddGeneralActivityComponent', () => {
  let component: AddGeneralActivityComponent;
  let fixture: ComponentFixture<AddGeneralActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGeneralActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGeneralActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
