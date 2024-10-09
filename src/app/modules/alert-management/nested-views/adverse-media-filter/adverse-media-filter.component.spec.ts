import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdverseMediaFilterComponent } from './adverse-media-filter.component';

describe('AdverseMediaFilterComponent', () => {
  let component: AdverseMediaFilterComponent;
  let fixture: ComponentFixture<AdverseMediaFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdverseMediaFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdverseMediaFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
