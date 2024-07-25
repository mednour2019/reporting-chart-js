import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CubeDescComponent } from './cube-desc.component';

describe('CubeDescComponent', () => {
  let component: CubeDescComponent;
  let fixture: ComponentFixture<CubeDescComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CubeDescComponent]
    });
    fixture = TestBed.createComponent(CubeDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
