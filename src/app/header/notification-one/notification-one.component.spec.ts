import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationOneComponent } from './notification-one.component';

describe('NotificationOneComponent', () => {
  let component: NotificationOneComponent;
  let fixture: ComponentFixture<NotificationOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
