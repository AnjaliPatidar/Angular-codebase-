import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSearchUserTableComponent } from './advanced-search-user-table.component';

describe('AdvancedSearchUserTableComponent', () => {
  let component: AdvancedSearchUserTableComponent;
  let fixture: ComponentFixture<AdvancedSearchUserTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedSearchUserTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSearchUserTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
