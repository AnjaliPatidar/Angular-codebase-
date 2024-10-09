import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertGeneralInfoComponent } from './alert-general-info.component';

describe('AlertGeneralInfoComponent', () => {
  let component: AlertGeneralInfoComponent;
  let fixture: ComponentFixture<AlertGeneralInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertGeneralInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertGeneralInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
