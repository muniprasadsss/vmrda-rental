import { TestBed } from '@angular/core/testing';

import { ReceptDetailsService } from './recept-details.service';

describe('ReceptDetailsService', () => {
  let service: ReceptDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceptDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
