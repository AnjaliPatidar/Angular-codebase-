import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelinepopmodalComponent } from './timelinepopmodal.component';

describe('TimelinepopmodalComponent', () => {
  let component: TimelinepopmodalComponent;
  let fixture: ComponentFixture<TimelinepopmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelinepopmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelinepopmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
