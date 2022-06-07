import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAusentismoComponent } from './add-ausentismo.component';

describe('AddAusentismoComponent', () => {
  let component: AddAusentismoComponent;
  let fixture: ComponentFixture<AddAusentismoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAusentismoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAusentismoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
