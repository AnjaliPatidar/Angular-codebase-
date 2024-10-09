import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskalertRightpanelComponent } from './riskalert-rightpanel.component';

describe('RiskalertRightpanelComponent', () => {
  let component: RiskalertRightpanelComponent;
  let fixture: ComponentFixture<RiskalertRightpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskalertRightpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskalertRightpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
