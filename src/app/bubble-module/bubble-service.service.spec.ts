import { TestBed } from '@angular/core/testing';

import { BubbleServiceService } from './bubble-service.service';

describe('BubbleServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BubbleServiceService = TestBed.get(BubbleServiceService);
    expect(service).toBeTruthy();
  });
});
