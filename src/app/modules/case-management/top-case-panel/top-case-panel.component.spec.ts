import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopCasePanelComponent } from './top-case-panel.component';

describe('TopCasePanelComponent', () => {
  let component: TopCasePanelComponent;
  let fixture: ComponentFixture<TopCasePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopCasePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopCasePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
