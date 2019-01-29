import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyTemplateComponent } from './empty-template.component';

describe('EmptyTemplateComponent', () => {
  let component: EmptyTemplateComponent;
  let fixture: ComponentFixture<EmptyTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
