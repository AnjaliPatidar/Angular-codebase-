import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingIndetailComponent } from './rating-indetail.component';

describe('RatingIndetailComponent', () => {
  let component: RatingIndetailComponent;
  let fixture: ComponentFixture<RatingIndetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingIndetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingIndetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
