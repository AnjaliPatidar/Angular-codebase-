import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseRiskFlagItemComponent } from './case-risk-flag-item.component';

describe('CaseRiskFlagItemComponent', () => {
  let component: CaseRiskFlagItemComponent;
  let fixture: ComponentFixture<CaseRiskFlagItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseRiskFlagItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseRiskFlagItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
