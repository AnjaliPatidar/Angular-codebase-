import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDashboardComponent } from './case-dashboard.component';

describe('CaseDashboardComponent', () => {
  let component: CaseDashboardComponent;
  let fixture: ComponentFixture<CaseDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
