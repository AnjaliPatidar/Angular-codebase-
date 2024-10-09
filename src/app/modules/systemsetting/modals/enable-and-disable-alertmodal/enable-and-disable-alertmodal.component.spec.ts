import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnableAndDisableAlertmodalComponent } from './enable-and-disable-alertmodal.component';

describe('EnableAndDisableAlertmodalComponent', () => {
  let component: EnableAndDisableAlertmodalComponent;
  let fixture: ComponentFixture<EnableAndDisableAlertmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnableAndDisableAlertmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnableAndDisableAlertmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
