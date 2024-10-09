import { Component, Input, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertMetaDataUtility } from './alert-metadata.utility';

@Component({
  selector: 'app-alert-metadata',
  templateUrl: './alert-metadata.component.html',
  styleUrls: ['./alert-metadata.component.scss']
})
export class AlertMetadataComponent implements OnInit {

  @Input() alertData: any;
  // alertMetaData: any;
  data : any;
  isOpenComment: boolean=false;
  isOpenAudit: boolean = false;
  selectedVal: any = 'Colorado';
  // needs refactoring 
  states_single: string[] = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois"
  ];

  selectedStates = this.states_single;
  hasMoreSingleSelectOptions: boolean = false;
  //
  selectControl10_S01 = new FormControl();
  selectedIconBasicSingleSelect_S01: string = "error";
  selectedIconColorBasicSingleSelect_S01: string = "rgba(255, 255, 255, 0.87)";
  selectedIconNameBasicSingleSelect_S01: string = "error";
  selected10_S01: any;
  
  status10_values_S1: any = [
    { name: 'Open', value: 'open', icon: 'error', color: '#ff822b' },
    { name: 'In Progress', value: 'inprogress', icon: 'play_circle_outline', color: '#42b7ff' },
    { name: 'On Hold', value: 'onhold', icon: 'pause_circle_filled', color: '#fbcf4d' },
    { name: 'True Match', value: 'truematch', icon: 'warning', color: '#fc5c66' },
    { name: 'Customer Decline', value: 'customerdecline', icon: 'cancel', color: 'rgba(255, 255, 255, 0.54)' },
  ];
  //
  constructor(public router: Router) { }

  ngOnInit() {
   
    if (this.states_single.length > 5) {
      this.hasMoreSingleSelectOptions = true;
    } else {
      this.hasMoreSingleSelectOptions = false;
    }
    this.data =AlertMetaDataUtility.parseMetaData(this.alertData);
  }

  onCommentClick() {
    this.isOpenComment = !this.isOpenComment;
 }

 navigateToCasePage(){
  if(this.data.caseId){
    this.router.navigate(['element/case-management/case', this.data.caseId],
    { queryParams: { fromAlert: true } })
  }
}

  isOpenCommentChangedHandler(value: boolean){
    this.isOpenComment=value;
  }

  onAuditClick() {
    this.isOpenAudit = !this.isOpenAudit;
  }

  isOpenAuditChangedHandler(value: boolean) {
    this.isOpenAudit = value;
  }

  openedChange_SB02(e: any) {
    // Set search textbox value as empty while opening selectbox
  }

  getSelectedItem_S01(item: { icon: string; color: string; name: string; }) {
    this.selectedIconBasicSingleSelect_S01 = item.icon;
    this.selectedIconColorBasicSingleSelect_S01 = item.color;
    this.selectedIconNameBasicSingleSelect_S01 = item.name;
  }

}
