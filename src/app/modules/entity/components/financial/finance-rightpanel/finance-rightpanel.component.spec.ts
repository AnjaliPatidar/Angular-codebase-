import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceRightpanelComponent } from './finance-rightpanel.component';

describe('FinanceRightpanelComponent', () => {
  let component: FinanceRightpanelComponent;
  let fixture: ComponentFixture<FinanceRightpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceRightpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceRightpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
