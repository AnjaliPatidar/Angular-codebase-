import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HitTransactionListComponent } from './hit-transaction-list.component';

describe('HitTransactionListComponent', () => {
  let component: HitTransactionListComponent;
  let fixture: ComponentFixture<HitTransactionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HitTransactionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HitTransactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
