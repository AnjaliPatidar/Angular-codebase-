import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreatsRightpanelComponent } from './threats-rightpanel.component';

describe('ThreatsRightpanelComponent', () => {
  let component: ThreatsRightpanelComponent;
  let fixture: ComponentFixture<ThreatsRightpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreatsRightpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreatsRightpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
