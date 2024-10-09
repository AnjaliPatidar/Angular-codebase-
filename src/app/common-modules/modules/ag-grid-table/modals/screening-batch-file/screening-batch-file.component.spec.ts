import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreeningBatchFileComponent } from './screening-batch-file.component';

describe('ScreeningBatchFileComponent', () => {
  let component: ScreeningBatchFileComponent;
  let fixture: ComponentFixture<ScreeningBatchFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreeningBatchFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreeningBatchFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
