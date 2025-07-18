import { TestBed } from '@angular/core/testing';

import { VacantpropertiesService } from './vacantproperties.service';

describe('VacantpropertiesService', () => {
  let service: VacantpropertiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VacantpropertiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
