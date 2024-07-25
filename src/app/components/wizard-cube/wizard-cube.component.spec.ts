import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardCubeComponent } from './wizard-cube.component';

describe('WizardCubeComponent', () => {
  let component: WizardCubeComponent;
  let fixture: ComponentFixture<WizardCubeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WizardCubeComponent]
    });
    fixture = TestBed.createComponent(WizardCubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
