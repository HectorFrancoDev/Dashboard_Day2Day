import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUsersCellsComponent } from './list-users-cells.component';

describe('ListUsersCellsComponent', () => {
  let component: ListUsersCellsComponent;
  let fixture: ComponentFixture<ListUsersCellsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListUsersCellsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUsersCellsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
