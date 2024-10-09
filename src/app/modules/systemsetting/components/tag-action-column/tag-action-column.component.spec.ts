import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagActionColumnComponent } from './tag-action-column.component';

describe('TagActionColumnComponent', () => {
  let component: TagActionColumnComponent;
  let fixture: ComponentFixture<TagActionColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagActionColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagActionColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
