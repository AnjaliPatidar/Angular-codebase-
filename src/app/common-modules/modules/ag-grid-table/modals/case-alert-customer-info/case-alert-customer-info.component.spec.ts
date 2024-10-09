import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseAlertCustomerInfoComponent } from './case-alert-customer-info.component';

describe('CaseAlertCustomerInfoComponent', () => {
  let component: CaseAlertCustomerInfoComponent;
  let fixture: ComponentFixture<CaseAlertCustomerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseAlertCustomerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseAlertCustomerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
