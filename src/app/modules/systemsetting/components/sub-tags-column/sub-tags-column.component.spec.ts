import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTagsColumnComponent } from './sub-tags-column.component';

describe('SubTagsColumnComponent', () => {
  let component: SubTagsColumnComponent;
  let fixture: ComponentFixture<SubTagsColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTagsColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTagsColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
