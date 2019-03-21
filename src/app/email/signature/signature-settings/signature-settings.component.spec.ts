import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureSettingsComponent } from './signature-settings.component';

describe('SignatureSettingsComponent', () => {
  let component: SignatureSettingsComponent;
  let fixture: ComponentFixture<SignatureSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignatureSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
