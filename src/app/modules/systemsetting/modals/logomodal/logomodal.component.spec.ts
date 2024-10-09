import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogomodalComponent } from './logomodal.component';

describe('LogomodalComponent', () => {
  let component: LogomodalComponent;
  let fixture: ComponentFixture<LogomodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogomodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogomodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
