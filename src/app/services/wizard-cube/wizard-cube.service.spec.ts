import { TestBed } from '@angular/core/testing';

import { WizardCubeService } from './wizard-cube.service';

describe('WizardCubeService', () => {
  let service: WizardCubeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WizardCubeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
