import { TestBed } from '@angular/core/testing';

import { SystemMonitoringService } from './system-monitoring.service';

describe('SystemMonitoringService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SystemMonitoringService = TestBed.get(SystemMonitoringService);
    expect(service).toBeTruthy();
  });
});
