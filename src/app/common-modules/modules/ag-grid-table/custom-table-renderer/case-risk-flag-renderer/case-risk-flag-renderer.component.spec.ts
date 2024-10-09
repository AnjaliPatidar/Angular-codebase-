import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseRiskFlagRendererComponent } from './case-risk-flag-renderer.component';

describe('CaseRiskFlagRendererComponent', () => {
  let component: CaseRiskFlagRendererComponent;
  let fixture: ComponentFixture<CaseRiskFlagRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseRiskFlagRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseRiskFlagRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
