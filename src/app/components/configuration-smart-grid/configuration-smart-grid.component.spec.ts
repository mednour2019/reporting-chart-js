import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationSmartGridComponent } from './configuration-smart-grid.component';

describe('ConfigurationSmartGridComponent', () => {
  let component: ConfigurationSmartGridComponent;
  let fixture: ComponentFixture<ConfigurationSmartGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigurationSmartGridComponent]
    });
    fixture = TestBed.createComponent(ConfigurationSmartGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
