import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSpecificActivityComponent } from './add-specific-activity.component';

describe('AddSpecificActivityComponent', () => {
  let component: AddSpecificActivityComponent;
  let fixture: ComponentFixture<AddSpecificActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSpecificActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSpecificActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
