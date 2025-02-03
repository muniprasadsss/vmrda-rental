import { TestBed } from '@angular/core/testing';

import { ComplexServiceService } from './complex-service.service';

describe('ComplexServiceService', () => {
  let service: ComplexServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplexServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
