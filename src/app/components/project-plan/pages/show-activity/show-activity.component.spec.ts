import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowActivityComponent } from './show-activity.component';

describe('ShowActivityComponent', () => {
  let component: ShowActivityComponent;
  let fixture: ComponentFixture<ShowActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
