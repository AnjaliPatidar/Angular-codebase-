import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadershipRightpanelComponent } from './leadership-rightpanel.component';

describe('LeadershipRightpanelComponent', () => {
  let component: LeadershipRightpanelComponent;
  let fixture: ComponentFixture<LeadershipRightpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadershipRightpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadershipRightpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
