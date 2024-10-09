import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilitiesPanelComponent } from './utilities-panel.component';

describe('UtilitiesPanelComponent', () => {
  let component: UtilitiesPanelComponent;
  let fixture: ComponentFixture<UtilitiesPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilitiesPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilitiesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
