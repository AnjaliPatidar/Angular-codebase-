import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewRightpanelComponent } from './overview-rightpanel.component';

describe('OverviewRightpanelComponent', () => {
  let component: OverviewRightpanelComponent;
  let fixture: ComponentFixture<OverviewRightpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewRightpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewRightpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
