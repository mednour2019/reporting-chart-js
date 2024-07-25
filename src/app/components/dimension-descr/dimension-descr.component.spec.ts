import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimensionDescrComponent } from './dimension-descr.component';

describe('DimensionDescrComponent', () => {
  let component: DimensionDescrComponent;
  let fixture: ComponentFixture<DimensionDescrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DimensionDescrComponent]
    });
    fixture = TestBed.createComponent(DimensionDescrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
