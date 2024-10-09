import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdverseMediaMetadataComponent } from './adverse-media-metadata.component';

describe('AdverseMediaMetadataComponent', () => {
  let component: AdverseMediaMetadataComponent;
  let fixture: ComponentFixture<AdverseMediaMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdverseMediaMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdverseMediaMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
