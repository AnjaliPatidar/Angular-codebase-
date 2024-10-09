import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseAduitComponent } from './case-aduit.component';

describe('CaseAduitComponent', () => {
  let component: CaseAduitComponent;
  let fixture: ComponentFixture<CaseAduitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseAduitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseAduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
