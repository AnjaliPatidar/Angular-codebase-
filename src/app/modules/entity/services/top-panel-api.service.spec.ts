import { TestBed } from '@angular/core/testing';

import { TopPanelApiService } from './top-panel-api.service';

describe('TopPanelApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TopPanelApiService = TestBed.get(TopPanelApiService);
    expect(service).toBeTruthy();
  });
});
