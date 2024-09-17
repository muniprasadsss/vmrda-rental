import { TestBed } from '@angular/core/testing';

import { DepartmentUsersService } from './department-users.service';

describe('DepartmentUsersService', () => {
  let service: DepartmentUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartmentUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
