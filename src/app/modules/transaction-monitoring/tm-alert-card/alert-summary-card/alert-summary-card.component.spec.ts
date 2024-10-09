import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertSummaryCardComponent } from './alert-summary-card.component';

describe('AlertSummaryCardComponent', () => {
  let component: AlertSummaryCardComponent;
  let fixture: ComponentFixture<AlertSummaryCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertSummaryCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
