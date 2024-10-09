import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseFileNameComponent } from './case-file-name.component';

describe('CaseFileNameComponent', () => {
  let component: CaseFileNameComponent;
  let fixture: ComponentFixture<CaseFileNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseFileNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseFileNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
