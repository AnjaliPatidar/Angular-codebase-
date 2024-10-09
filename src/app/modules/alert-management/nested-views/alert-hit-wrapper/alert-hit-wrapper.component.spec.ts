import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertHitWrapperComponent } from './alert-hit-wrapper.component';

describe('AlertHitWrapperComponent', () => {
  let component: AlertHitWrapperComponent;
  let fixture: ComponentFixture<AlertHitWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertHitWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertHitWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
