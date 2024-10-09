import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseBatchFileComponent } from './case-batch-file.component';

describe('CaseBatchFileComponent', () => {
  let component: CaseBatchFileComponent;
  let fixture: ComponentFixture<CaseBatchFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseBatchFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseBatchFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
