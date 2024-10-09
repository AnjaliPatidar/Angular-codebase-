import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseRiskFactorComponent } from './case-risk-factor.component';

describe('CaseRiskFactorComponent', () => {
  let component: CaseRiskFactorComponent;
  let fixture: ComponentFixture<CaseRiskFactorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseRiskFactorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseRiskFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
