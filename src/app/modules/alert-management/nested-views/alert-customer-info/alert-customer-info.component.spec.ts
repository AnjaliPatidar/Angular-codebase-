import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertCustomerInfoComponent } from './alert-customer-info.component';

describe('AlertCustomerInfoComponent', () => {
  let component: AlertCustomerInfoComponent;
  let fixture: ComponentFixture<AlertCustomerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertCustomerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertCustomerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
