import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedAlertsComponent } from './related-alerts.component';

describe('RelatedAlertsComponent', () => {
  let component: RelatedAlertsComponent;
  let fixture: ComponentFixture<RelatedAlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatedAlertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
