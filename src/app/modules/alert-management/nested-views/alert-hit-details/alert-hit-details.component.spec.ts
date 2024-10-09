import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertHitDetailsComponent } from './alert-hit-details.component';

describe('AlertHitDetailsComponent', () => {
  let component: AlertHitDetailsComponent;
  let fixture: ComponentFixture<AlertHitDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertHitDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertHitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
