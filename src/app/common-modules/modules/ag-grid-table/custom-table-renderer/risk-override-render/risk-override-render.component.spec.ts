import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskOverrideRenderComponent } from './risk-override-render.component';

describe('RiskOverrideRendererComponent', () => {
  let component: RiskOverrideRenderComponent;
  let fixture: ComponentFixture<RiskOverrideRenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskOverrideRenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskOverrideRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
