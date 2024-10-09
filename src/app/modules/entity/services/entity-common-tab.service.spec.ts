import { TestBed } from '@angular/core/testing';

import { EntityCommonTabService } from './entity-common-tab.service';

describe('EntityCommonTabService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EntityCommonTabService = TestBed.get(EntityCommonTabService);
    expect(service).toBeTruthy();
  });
});
