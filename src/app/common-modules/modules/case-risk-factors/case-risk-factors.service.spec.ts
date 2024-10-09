import { TestBed } from '@angular/core/testing';

import { CaseRiskFactorsService } from './case-risk-factors.service';

describe('CaseRiskFactorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CaseRiskFactorsService = TestBed.get(CaseRiskFactorsService);
    expect(service).toBeTruthy();
  });
});
