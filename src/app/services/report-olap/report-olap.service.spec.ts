import { TestBed } from '@angular/core/testing';

import { ReportOlapService } from './report-olap.service';

describe('ReportOlapService', () => {
  let service: ReportOlapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportOlapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
