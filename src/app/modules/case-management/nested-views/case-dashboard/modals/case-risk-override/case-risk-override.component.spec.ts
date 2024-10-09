import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseRiskOverrideComponent } from './case-risk-override.component';

describe('CaseRiskOverrideComponent', () => {
  let component: CaseRiskOverrideComponent;
  let fixture: ComponentFixture<CaseRiskOverrideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseRiskOverrideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseRiskOverrideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
