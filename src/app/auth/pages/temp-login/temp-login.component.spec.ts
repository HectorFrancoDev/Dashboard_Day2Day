import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempLoginComponent } from './temp-login.component';

describe('TempLoginComponent', () => {
  let component: TempLoginComponent;
  let fixture: ComponentFixture<TempLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TempLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TempLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
