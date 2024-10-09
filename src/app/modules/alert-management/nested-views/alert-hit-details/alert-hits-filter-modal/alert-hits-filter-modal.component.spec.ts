import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertHitsFilterModalComponent } from './alert-hits-filter-modal.component';

describe('AlertHitsFilterModalComponent', () => {
  let component: AlertHitsFilterModalComponent;
  let fixture: ComponentFixture<AlertHitsFilterModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertHitsFilterModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertHitsFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
