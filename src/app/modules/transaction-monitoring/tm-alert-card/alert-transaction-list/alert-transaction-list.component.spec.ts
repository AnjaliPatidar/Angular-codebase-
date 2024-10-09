import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertTransactionListComponent } from './alert-transaction-list.component';

describe('AlertTransactionListComponent', () => {
  let component: AlertTransactionListComponent;
  let fixture: ComponentFixture<AlertTransactionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertTransactionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertTransactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
