import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftCasePanelComponent } from './left-case-panel.component';

describe('LeftCasePanelComponent', () => {
  let component: LeftCasePanelComponent;
  let fixture: ComponentFixture<LeftCasePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftCasePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftCasePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
