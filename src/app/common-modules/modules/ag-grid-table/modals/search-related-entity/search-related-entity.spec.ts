import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchReleatedCasesComponent } from './search-related-entity';

describe('SearchReleatedCasesComponent', () => {
  let component: SearchReleatedCasesComponent;
  let fixture: ComponentFixture<SearchReleatedCasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchReleatedCasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchReleatedCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
