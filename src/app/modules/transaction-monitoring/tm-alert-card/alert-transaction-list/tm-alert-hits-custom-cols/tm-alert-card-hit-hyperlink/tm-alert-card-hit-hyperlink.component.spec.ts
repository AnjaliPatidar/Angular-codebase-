import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmAlertCardHitHyperlinkComponent } from './tm-alert-card-hit-hyperlink.component';

describe('TmAlertCardHitHyperlinkComponent', () => {
  let component: TmAlertCardHitHyperlinkComponent;
  let fixture: ComponentFixture<TmAlertCardHitHyperlinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmAlertCardHitHyperlinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmAlertCardHitHyperlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
