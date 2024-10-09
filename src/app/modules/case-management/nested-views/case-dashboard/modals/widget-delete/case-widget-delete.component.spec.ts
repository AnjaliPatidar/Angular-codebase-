import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseWidgetDeleteComponent } from './case-widget-delete.component';

describe('CaseWidgetDeleteComponent', () => {
  let component: CaseWidgetDeleteComponent;
  let fixture: ComponentFixture<CaseWidgetDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseWidgetDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseWidgetDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
