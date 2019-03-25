import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignPreviewComponent } from './sign-preview.component';

describe('SignPreviewComponent', () => {
  let component: SignPreviewComponent;
  let fixture: ComponentFixture<SignPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
