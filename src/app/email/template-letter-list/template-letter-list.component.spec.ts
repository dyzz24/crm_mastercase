import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateLetterListComponent } from './template-letter-list.component';

describe('TemplateLetterListComponent', () => {
  let component: TemplateLetterListComponent;
  let fixture: ComponentFixture<TemplateLetterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateLetterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateLetterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
