import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HitRulesColumnComponent } from './hit-rules-column.component';

describe('HitRulesColumnComponent', () => {
  let component: HitRulesColumnComponent;
  let fixture: ComponentFixture<HitRulesColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HitRulesColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HitRulesColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
