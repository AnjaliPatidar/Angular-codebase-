import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreatsIntelligenceComponent } from './threats-intelligence.component';

describe('ThreatsIntelligenceComponent', () => {
  let component: ThreatsIntelligenceComponent;
  let fixture: ComponentFixture<ThreatsIntelligenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreatsIntelligenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreatsIntelligenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
