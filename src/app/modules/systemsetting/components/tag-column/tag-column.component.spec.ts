import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagColumnComponent } from './tag-column.component';

describe('TagColumnComponent', () => {
  let component: TagColumnComponent;
  let fixture: ComponentFixture<TagColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
