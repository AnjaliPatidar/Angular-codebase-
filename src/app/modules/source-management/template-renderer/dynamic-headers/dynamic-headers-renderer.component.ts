import { Component, OnInit } from '@angular/core';
import { SourceManagementService } from '../../source-management.service';
import { TranslateService } from '@ngx-translate/core';

declare var $: any; //Jquery
@Component({
  selector: 'app-template-renderer',
  templateUrl: './dynamic-headers-renderer.component.html',
  styleUrls: ['./dynamic-headers-renderer.component.scss']
})
export class DynamicHeadersRendererComponent implements OnInit {

  //Public variables
  changedSliderValue:any = [];
  mainChangedSliderValue:any = [];
  classifications:any = [];
  subClassifications:any = [];
  dataAttributes: any = [];
  initialDataAttributes:any = [];
  tempColIndex:any;
  public addDisable:boolean = false;
  public sliderValue:any;
  public popoverData:any = [];
  public popoverHeaderData:any = {};
  public dataAttributesForPopover:any = [];
  public finalClassifications = [];
  public finalDataAttributes = [];
  public credibility_digit_map:any = {
    NONE: 0,
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3
  };
  public credibility_text_map:any = {
    0: "NONE",
    1: "LOW",
    2: "MEDIUM",
    3: "HIGH"
  };


  constructor(private _sourceManagementService:SourceManagementService, private translateService: TranslateService) { }

  agInit(params:any,event): void {
    this.popoverHeaderData = {},
    this.popoverData = [];
    this.dataAttributesForPopover = [];
    this.changedSliderValue = [];
    this.mainChangedSliderValue = [];
    this.popoverData.push(params);
    this.popoverHeaderData = {
      company_name : this.popoverData[0].data.source ? this.popoverData[0].data.source : '',
      field_name: this.popoverData[0].colDef.headerName ? this.popoverData[0].colDef.headerName : ''
    };

    if(this.popoverData[0].value){
      this.classifications = this.popoverData[0].value.classifications[0];
      this.subClassifications = $.extend(true, [],this.popoverData[0].value.classifications[0].subClassifications);
      var colIndex = this.subClassifications.findIndex(x => this.translateService.instant(x.subClassifcationName) === this.popoverData[0].colDef.headerName);
      this.tempColIndex = colIndex;
      this.dataAttributes = this.subClassifications[colIndex].dataAttributes;
      this.initialDataAttributes = $.extend(true, [],this.subClassifications[colIndex].dataAttributes);
    }


    if(this.popoverData[0] && this.popoverData[0].value && this.classifications && this.subClassifications.length){
      this.sliderValue = this.subClassifications[colIndex].subClassificationCredibility ? this.subClassifications[colIndex].subClassificationCredibility : '';
      this.mainChangedSliderValue.push(this.credibility_digit_map[this.sliderValue]);
      this.dataAttributes = this.setDataAttibutesValue(this.subClassifications,this.initialDataAttributes);

      if(this.dataAttributes !== undefined && this.dataAttributes.length){
        this.dataAttributesForPopover = this.dataAttributes;
      }
    }
  }


  ngOnInit() {
  }

  settingInitialSliderValues(e){
    this.changedSliderValue = [];
    this.finalDataAttributes = [];
    for(let j=0;j<this.dataAttributes.length;j++){
      if(this.dataAttributes[j].credibilityValue){
        this.changedSliderValue.push(this.credibility_digit_map[this.dataAttributes[j].credibilityValue]);
      }
    }
  }

  /**Setting data Attibutes value*/
  setDataAttibutesValue(subClassifcations,dataAttributes){
    this.mainChangedSliderValue = [];
    var equalValueFlag = dataAttributes.every( (v, i, arr) => v.credibilityValue === arr[0].credibilityValue);
    if(equalValueFlag){
      this.addDisable = false;
      this.sliderValue = subClassifcations[this.tempColIndex].subClassificationCredibility;
      var digit = this.credibility_digit_map[subClassifcations[this.tempColIndex].subClassificationCredibility]
      this.changedSliderValue.push(digit);
      this.mainChangedSliderValue.push(this.credibility_digit_map[subClassifcations[this.tempColIndex].subClassificationCredibility]);
    }
    else{
      this.addDisable = true;
      this.sliderValue = "NONE";
      this.mainChangedSliderValue.push(0);
    }
    return dataAttributes;
  }

  mainSliderValueChange(e){
    this.mainChangedSliderValue = [];
    this.changedSliderValue = [];
    const currentValMain = (e.target && e.target.value) ? e.target.value : 0;
    let mainSliderValue = this.credibility_text_map[currentValMain];
    this.sliderValue = mainSliderValue;
    for(let i=0;i<this.dataAttributesForPopover.length;i++){
      this.dataAttributesForPopover[i].credibilityValue = mainSliderValue;
      this.mainChangedSliderValue.push(this.credibility_digit_map[mainSliderValue]);
    };
    this.changedSliderValue = this.mainChangedSliderValue;
  }
  /**Change value onChange of slider from popover */
  sliderValueChangeInPopover(e,item){
    this.finalDataAttributes.push(item);
    const currentVal = (e.target && e.target.value) ? e.target.value : 0;
    e.target.previousElementSibling.textContent = this.credibility_text_map[currentVal];
  }

  /**saving the source after updating Credibility in popover*/
  public saveSourceUpdatedData = {};
  public tempValues:any=[];
  saveSource(e){
      this.finalClassifications = [];
      this.saveSourceUpdatedData = {};
      this.mainChangedSliderValue = [];
      this.tempValues = [];
      var equalFlag = this.changedSliderValue.every( (val, i, arr) => val === arr[0] );
      if(equalFlag){
        this.addDisable = false;
        this.sliderValue = this.credibility_text_map[this.changedSliderValue[0]];
        this.mainChangedSliderValue.push(this.changedSliderValue[0]);
      }
      else{
        this.addDisable = true;
        this.sliderValue = "NONE";
        this.mainChangedSliderValue.push(0);
      }

      for(let i=0;i<this.changedSliderValue.length;i++){
        var currentSliderValue = this.credibility_text_map[this.changedSliderValue[i]];
        this.tempValues.push(currentSliderValue);
        if(currentSliderValue && currentSliderValue !== undefined){
          if(this.popoverData[0] && this.popoverData[0].value && this.classifications && this.subClassifications){
            var colIndex = this.subClassifications.findIndex(ele => ele.subClassifcationName === this.popoverData[0].colDef.headerName);

            if(this.dataAttributes[i]){
              this.dataAttributes[i].credibilityValue =  currentSliderValue;
            }
          }
        }
      }
      this.classifications.subClassifications[this.tempColIndex].dataAttributes = this.finalDataAttributes;
      this.finalClassifications.push(this.classifications);
      this.saveSourceUpdatedData = {
        "classifications" : this.finalClassifications,
        "deleteMedia" : this.popoverData[0].value.deleteMedia,
        "entityId" : this.popoverData[0].value.entityId,
        "sourceCreatedDate" : this.popoverData[0].value.sourceCreatedDate,
        "sourceDisplayName" : this.popoverData[0].value.sourceDisplayName,
        "sourceDomain" : [],
        "sourceId" : this.popoverData[0].value.sourceId,
        "sourceIndustry" : [],
        "sourceJurisdiction" : [],
        "sourceMedia" : [],
        "sourceName" : this.popoverData[0].value.sourceName,
        "sourceType" : this.popoverData[0].value.sourceType,
        "sourceUrl" : this.popoverData[0].value.sourceUrl
      };

      var params = this.saveSourceUpdatedData;
      this._sourceManagementService.updateScource(params).subscribe(data => {

      },
      (error => {

      }));
    }

  resetPopoverValuesToDefault(e){
    this.changedSliderValue = [];
    for(let i=0;i<this.dataAttributesForPopover.length;i++){
      if(this.dataAttributesForPopover[i].credibilityValue !== this.initialDataAttributes[i].credibilityValue){
        this.dataAttributesForPopover[i].credibilityValue = this.initialDataAttributes[i].credibilityValue;
        this.changedSliderValue.push(this.credibility_digit_map[this.dataAttributesForPopover[i].credibilityValue]);
      }
    }
  }

  // getSlider(key){
  //   return '<span>'+ key +'</span><input [disabled]="true" type="range" name="points" min="0" max="3" data-action-type="main-sliders" class="range_status '+ key +' " value="'+ this.credibility_digit_map[key] +'">';
  // }

  trackByIndex(index: number, obj: any): any {
    return index;
  }
}
