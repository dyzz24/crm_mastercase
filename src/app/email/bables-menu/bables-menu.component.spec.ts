import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BablesMenuComponent } from './bables-menu.component';

describe('BablesMenuComponent', () => {
  let component: BablesMenuComponent;
  let fixture: ComponentFixture<BablesMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BablesMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BablesMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
