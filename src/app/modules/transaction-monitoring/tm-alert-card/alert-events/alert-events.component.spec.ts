import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertEventsComponent } from './alert-events.component';

describe('AlertEventsComponent', () => {
  let component: AlertEventsComponent;
  let fixture: ComponentFixture<AlertEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
