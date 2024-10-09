import { Component, OnInit, ViewChild } from '@angular/core';
import { SourceManagementService } from '../source-management.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-template-renderer',
  templateUrl: './dynamic-headers-renderer.component.html',
  styleUrls: ['./dynamic-headers-renderer.component.scss']
})
export class DynamicHeadersRendererComponent implements OnInit {
  @ViewChild('popOver', { static: false }) public popover: NgbPopover;
  isDisabled: boolean;

  constructor(private sourceManagementService: SourceManagementService) { }
  public credibility_digit_map: any = {
    NONE: 0,
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3
  };
  public credibility_text_map: any = {
    0: "NONE",
    1: "LOW",
    2: "MEDIUM",
    3: "HIGH"
  };

  public sliderValue: string | number;
  public changedSliderValue: string | number;
  public dataAttributesForPopover: any;
  public popoverHeaderData: { source: any; headerName: any; };
  public dataAttributesSliderValues: any[] = [];
  public visibilityValue: any;

  private sourceId: any;
  private colIndex: string | number

  ngOnInit() {
  }

  agInit(params: any, event): void {
    if (!params.data || !params.value) {
      return;
    }
    this.sourceId = params.value.sourceId;
    let subClassifications = params.value.classifications[0].subClassifications;
    this.colIndex = subClassifications.findIndex(x => x.subClassifcationName === params.colDef.colId);
    this.sliderValue = subClassifications[this.colIndex].subClassificationCredibility;
    this.changedSliderValue = this.credibility_digit_map[this.sliderValue];
    this.visibilityValue = params.data.visibilityValue;

    this.popoverHeaderData = {
      source: params.data.source,
      headerName: params.colDef.headerName
    };
    this.dataAttributesForPopover = subClassifications[this.colIndex].dataAttributes;
    this.isDisabled = (!this.visibilityValue || params.data.changeCredibilityPermission !== 'full');
  }

  mainSliderValueChange(e) {
    this.sliderValue = this.credibility_text_map[this.changedSliderValue];
    let source = this.sourceManagementService.allSources.find(x => x.sourceId === this.sourceId);
    source.classifications[0].subClassifications[this.colIndex].subClassificationCredibility = this.sliderValue;
    this.sourceManagementService.updateScource(source).subscribe(data => {
    }, (error => {
    }));
  }

  settingInitialSliderValues() {
    if (this.dataAttributesSliderValues && this.dataAttributesSliderValues.length > 0) {
      return;
    }
    for (let j = 0; j < this.dataAttributesForPopover.length; j++) {
      if (this.dataAttributesForPopover[j].credibilityValue) {
        this.dataAttributesSliderValues.push(this.credibility_digit_map[this.dataAttributesForPopover[j].credibilityValue]);
      }
    }
  }

  saveSource(e) {
    for (let j = 0; j < this.dataAttributesForPopover.length; j++) {
      this.dataAttributesForPopover[j].credibilityValue = this.credibility_text_map[this.dataAttributesSliderValues[j]];
    }
    let source = this.sourceManagementService.allSources.find(x => x.sourceId === this.sourceId);
    source.classifications[0].subClassifications[this.colIndex].dataAttributes = this.dataAttributesForPopover;
    this.sourceManagementService.updateScource(source).subscribe(data => {
    }, (error => {
    }));
    this.popover.close();
  }

  resetPopoverValuesToDefault() {
    this.dataAttributesSliderValues = [];
    this.settingInitialSliderValues();
  }

  closePopup() {
    this.resetPopoverValuesToDefault();
    this.popover.close();
  }
}
