import { TestBed } from '@angular/core/testing';

import { AddressSharedService } from './address-shared.service';

describe('AddressSharedService', () => {
  let service: AddressSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddressSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
