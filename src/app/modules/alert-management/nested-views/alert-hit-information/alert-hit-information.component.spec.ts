import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertHitInformationComponent } from './alert-hit-information.component';

describe('AlertHitInformationComponent', () => {
  let component: AlertHitInformationComponent;
  let fixture: ComponentFixture<AlertHitInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertHitInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertHitInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
