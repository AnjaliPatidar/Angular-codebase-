import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomHeaderColumnComponent } from './custom-header-column.component';

describe('CustomHeaderColumnComponent', () => {
  let component: CustomHeaderColumnComponent;
  let fixture: ComponentFixture<CustomHeaderColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomHeaderColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomHeaderColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
