import { TestBed } from '@angular/core/testing';

import { TransactionMonitoringService } from './transaction-monitoring.service';

describe('TransactionMonitoringService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransactionMonitoringService = TestBed.get(TransactionMonitoringService);
    expect(service).toBeTruthy();
  });
});
