import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTwoComponent } from './notification-two.component';

describe('NotificationTwoComponent', () => {
  let component: NotificationTwoComponent;
  let fixture: ComponentFixture<NotificationTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
