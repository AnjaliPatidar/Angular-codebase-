import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPannelComponent } from './top-pannel.component';

describe('TopPannelComponent', () => {
  let component: TopPannelComponent;
  let fixture: ComponentFixture<TopPannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopPannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopPannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
