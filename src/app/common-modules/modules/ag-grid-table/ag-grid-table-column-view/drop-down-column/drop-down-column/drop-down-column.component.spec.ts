import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropDownColumnComponent } from './drop-down-column.component';

describe('DropDownColumnComponent', () => {
  let component: DropDownColumnComponent;
  let fixture: ComponentFixture<DropDownColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropDownColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropDownColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
