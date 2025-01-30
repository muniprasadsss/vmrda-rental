import { TestBed } from '@angular/core/testing';

import { TransactionTrackingService } from './transaction-tracking.service';

describe('TransactionTrackingService', () => {
  let service: TransactionTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
