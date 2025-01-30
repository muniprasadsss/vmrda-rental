import { TestBed } from '@angular/core/testing';

import { DummyUserService } from './dummy-user.service';

describe('DummyUserService', () => {
  let service: DummyUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DummyUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
