import { TestBed, async, inject } from '@angular/core/testing';

import { EmailGuardGuard } from './email-guard.guard';

describe('EmailGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailGuardGuard]
    });
  });

  it('should ...', inject([EmailGuardGuard], (guard: EmailGuardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
