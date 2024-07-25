import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaySmartGridComponent } from './display-smart-grid.component';

describe('DisplaySmartGridComponent', () => {
  let component: DisplaySmartGridComponent;
  let fixture: ComponentFixture<DisplaySmartGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplaySmartGridComponent]
    });
    fixture = TestBed.createComponent(DisplaySmartGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
