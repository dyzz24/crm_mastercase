import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureCreateComponent } from './signature-create.component';

describe('SignatureCreateComponent', () => {
  let component: SignatureCreateComponent;
  let fixture: ComponentFixture<SignatureCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignatureCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
