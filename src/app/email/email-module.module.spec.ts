import { EmailModuleModule } from './email-module.module';

describe('EmailModuleModule', () => {
  let emailModuleModule: EmailModuleModule;

  beforeEach(() => {
    emailModuleModule = new EmailModuleModule();
  });

  it('should create an instance', () => {
    expect(emailModuleModule).toBeTruthy();
  });
});
