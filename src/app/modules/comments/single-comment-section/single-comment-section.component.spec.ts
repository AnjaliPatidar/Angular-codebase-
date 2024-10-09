import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCommentSectionComponent } from './single-comment-section.component';

describe('SingleCommentSectionComponent', () => {
  let component: SingleCommentSectionComponent;
  let fixture: ComponentFixture<SingleCommentSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleCommentSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleCommentSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
