import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogonFailuresComponent } from './logon-failures.component';

describe('LogonFailuresComponent', () => {
  let component: LogonFailuresComponent;
  let fixture: ComponentFixture<LogonFailuresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogonFailuresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogonFailuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
