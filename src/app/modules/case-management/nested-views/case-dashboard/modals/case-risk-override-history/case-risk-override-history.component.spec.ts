import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseRiskOverrideHistoryComponent } from './case-risk-override-history.component';

describe('CaseRiskOverrideHistoryComponent', () => {
  let component: CaseRiskOverrideHistoryComponent;
  let fixture: ComponentFixture<CaseRiskOverrideHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseRiskOverrideHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseRiskOverrideHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
