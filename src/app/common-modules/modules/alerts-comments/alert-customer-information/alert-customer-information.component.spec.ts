import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertCustomerInformationComponent } from './alert-customer-information.component';

describe('AlertCustomerInformationComponent', () => {
  let component: AlertCustomerInformationComponent;
  let fixture: ComponentFixture<AlertCustomerInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertCustomerInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertCustomerInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});