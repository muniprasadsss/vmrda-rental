import { TestBed } from '@angular/core/testing';

import { UserTaggingService } from './user-tagging.service';

describe('UserTaggingService', () => {
  let service: UserTaggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTaggingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
