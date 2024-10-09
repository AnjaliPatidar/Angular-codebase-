import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopAlertPanelComponent } from './top-alert-panel.component';

describe('TopAlertPanelComponent', () => {
  let component: TopAlertPanelComponent;
  let fixture: ComponentFixture<TopAlertPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopAlertPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopAlertPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
