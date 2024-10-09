import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertCustomerDetailsComponent } from './alert-customer-details.component';

describe('AlertCustomerDetailsComponent', () => {
  let component: AlertCustomerDetailsComponent;
  let fixture: ComponentFixture<AlertCustomerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertCustomerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertCustomerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
