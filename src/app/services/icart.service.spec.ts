import { TestBed } from '@angular/core/testing';

import { ICartService } from './icart.service';

describe('ICartService', () => {
  let service: ICartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ICartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
