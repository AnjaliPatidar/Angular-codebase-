/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CaseBatchMinimizedComponent } from './case-batch-minimized.component';

describe('CaseBatchMinimizedComponent', () => {
  let component: CaseBatchMinimizedComponent;
  let fixture: ComponentFixture<CaseBatchMinimizedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseBatchMinimizedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseBatchMinimizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
