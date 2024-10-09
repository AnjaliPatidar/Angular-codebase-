import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipRendererComponent } from './tooltip-renderer.component';

describe('TooltipRendererComponent', () => {
  let component: TooltipRendererComponent;
  let fixture: ComponentFixture<TooltipRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TooltipRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TooltipRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
