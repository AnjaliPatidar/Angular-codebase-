import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogonFailureRendererComponent } from './logon-failure-renderer.component';

describe('LogonFailureRendererComponent', () => {
  let component: LogonFailureRendererComponent;
  let fixture: ComponentFixture<LogonFailureRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogonFailureRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogonFailureRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
