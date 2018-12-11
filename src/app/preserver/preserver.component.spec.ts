import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreserverComponent } from './preserver.component';

describe('PreserverComponent', () => {
  let component: PreserverComponent;
  let fixture: ComponentFixture<PreserverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreserverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
