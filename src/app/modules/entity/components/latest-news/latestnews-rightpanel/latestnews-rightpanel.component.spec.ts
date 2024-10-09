import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestnewsRightpanelComponent } from './latestnews-rightpanel.component';

describe('LatestnewsRightpanelComponent', () => {
  let component: LatestnewsRightpanelComponent;
  let fixture: ComponentFixture<LatestnewsRightpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestnewsRightpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestnewsRightpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
