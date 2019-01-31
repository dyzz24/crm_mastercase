import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyLettersComponent } from './empty-letters.component';

describe('EmptyLettersComponent', () => {
  let component: EmptyLettersComponent;
  let fixture: ComponentFixture<EmptyLettersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyLettersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyLettersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
