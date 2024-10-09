import { TestBed } from '@angular/core/testing';

import { EntityGraphService } from './entity-graph.service';

describe('EntityGraphService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EntityGraphService = TestBed.get(EntityGraphService);
    expect(service).toBeTruthy();
  });
});
