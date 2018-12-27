import { TestBed } from '@angular/core/testing';

import { NewMessageService } from './new-message.service';

describe('NewMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewMessageService = TestBed.get(NewMessageService);
    expect(service).toBeTruthy();
  });
});
