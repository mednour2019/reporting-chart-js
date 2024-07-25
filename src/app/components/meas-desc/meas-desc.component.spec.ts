import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasDescComponent } from './meas-desc.component';

describe('MeasDescComponent', () => {
  let component: MeasDescComponent;
  let fixture: ComponentFixture<MeasDescComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeasDescComponent]
    });
    fixture = TestBed.createComponent(MeasDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
