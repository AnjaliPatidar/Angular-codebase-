import { TestBed } from '@angular/core/testing';

import { EntityOrgchartService } from './entity-orgchart.service';

describe('EntityOrgchartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EntityOrgchartService = TestBed.get(EntityOrgchartService);
    expect(service).toBeTruthy();
  });
});
