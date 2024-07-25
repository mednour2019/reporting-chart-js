import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculationInterfaceComponent } from './calculation-interface.component';

describe('CalculationInterfaceComponent', () => {
  let component: CalculationInterfaceComponent;
  let fixture: ComponentFixture<CalculationInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalculationInterfaceComponent]
    });
    fixture = TestBed.createComponent(CalculationInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
