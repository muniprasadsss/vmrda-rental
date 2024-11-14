import { TestBed } from '@angular/core/testing';

import { IssuenoticeService } from './issuenotice.service';

describe('IssuenoticeService', () => {
  let service: IssuenoticeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssuenoticeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
