import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreMultiSelectComponent } from './multi-select.component';

describe('MultiSelectComponent', () => {
  let component: CoreMultiSelectComponent;
  let fixture: ComponentFixture<CoreMultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoreMultiSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
