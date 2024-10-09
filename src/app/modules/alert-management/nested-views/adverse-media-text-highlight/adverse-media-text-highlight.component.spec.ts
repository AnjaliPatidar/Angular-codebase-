import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdverseMediaTextHighlightComponent } from './adverse-media-text-highlight.component';

describe('AdverseMediaTextHighlightComponent', () => {
  let component: AdverseMediaTextHighlightComponent;
  let fixture: ComponentFixture<AdverseMediaTextHighlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdverseMediaTextHighlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdverseMediaTextHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
