import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { CaseSharedDataService } from './../../../shared-services/data/case-shared-data.service';
import { CaseManagementService } from '@app/modules/case-management/case-management.service';
import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import * as d3 from 'd3';
import {MatAccordion} from '@angular/material/expansion';

@Component({
  selector: 'app-case-aduit',
  templateUrl: './case-aduit.component.html',
  styleUrls: ['./case-aduit.component.scss']
})
export class CaseAduitComponent implements OnInit {
  keyWord:string = ""
  rightPanelData: any = [];
  isLoading:boolean
  currentYear:number = new Date().getFullYear();
  isInputHasValue:boolean
  showOverride:boolean
  caseTypeList

  isOpen:boolean;
  caseId:number;
  name:string;
  component: string;
  @ViewChild(MatAccordion , {static:false}) accordion: MatAccordion;

  constructor(
    private caseManagementService:CaseManagementService,
    private caseSharedDataService:CaseSharedDataService,
    private commonServicesService:CommonServicesService,
    private renderer2:Renderer2

  ) {}

  ngOnInit() {
    this.setAuditData();
    this.inizialDataForComponent();
    this.getCaseTypes();
  }

  setAuditData(){
    this.caseManagementService.showAuditPanelListObserver.subscribe(openState => {
      if(openState){
        this.isOpen = this.caseManagementService.auditPanelData.isOpen;
        this.caseId = this.caseManagementService.auditPanelData.caseId;
        this.name = this.caseManagementService.auditPanelData.name;
        this.component = this.caseManagementService.auditPanelData.component;
      }
    })
  }

  // @purpose: Close the audit right panel
  // @date: 12/16/2021
  // @author: ammshathwan
  close():void{
    this.caseManagementService.showAuditPanelListBehavior.next(false)
    if(document.body.classList.contains('audit-sideBar-open')){
      this.renderer2.removeClass(document.body, 'audit-sideBar-open');
    }
  }

  // @purpose: get all data realated to Audit
  // @date: 12/16/2021
  // @author: ammshathwan
  getRightPanelData(params: any): void {
    const months: string[] = [
      'December',
      'November',
      'October',
      'September',
      'August',
      'July',
      'June',
      'May',
      'April',
      'March',
      'February',
      'January',
    ];
    if (params.typeId) {
      this.caseManagementService
        .rightPanelAlertData(params)
        .subscribe((response) => {
          if (response) {
            this.formatDate(response.reverse());
            this.isLoading = false;
            return this.rightPanelData;
          }
        });
    }
  }

  // @purpose: format the date for audit info
  // @date: 12/16/2021
  // @author: ammshathwan
  formatDate(response: any): void {
    this.rightPanelData = d3
      .nest()
      .key((d: any) => {
        return new Date(d.timestamp).toLocaleString('default', {
          month: 'long',
        });
      })
      .key((d: any) => {
        return new Date(d.timestamp).toDateString();
      })
      .key((d: any) => {
        return d.type;
      })
      .entries(response);
  }

  // @purpose: send the needed params for get right panel data response
  // @date: 12/16/2021
  // @author: ammshathwan
  setRightPanelData(value: any): void {
    let params: any = {};
    if (value.data && value.data.caseId) {
      params = {
        type: 'Case Management',
        typeId: value.data.caseId,
      };
    }
    if (params) {
      this.getRightPanelData(params);
    }
  }

  // @purpose: trigger all needed fuintion while compoenent is mount
  // @date: 12/16/2021
  // @author: ammshathwan
  inizialDataForComponent(){
    this.isLoading = true;
    if(this.caseId){
      const val: any = {
        data: { caseId: this.caseId },
      };
    this.setRightPanelData(val);
    }
  }

  // @reson: temp funtion to return only the history date
  // @date: 12/16/2021
  // @author: ammshathwan
  getAuditDay(date:string):string{
    if(date){
      var tempDate = date.split(' ')
      if(tempDate[2]){
        var dateToReutrn = tempDate[2]
      }
    }
    return dateToReutrn;
  }

  getAuditYear(date){
    if(date){
      var tempDate = date.key.split(' ')
      if(tempDate[3]){
        var dateToReutrn = tempDate[3]
      }
    }
    return dateToReutrn;
  }

  // @reson: clear input button
  // @date: 12/17/2021
  // @author: ammshathwan
  clearInput():void{
    this.keyWord = "";
    this.isInputHasValue = false;
  }

  // @reson: show clear input button
  // @date: 12/17/2021
  // @author: ammshathwan
  activeClearicon(value:string):void{
    if(value){
      this.isInputHasValue = true;
    }else{
      this.isInputHasValue = false;
    }
  }

  // @reson: Find is the history is related to case risk
  // @date: 01 jan 2022
  // @author: ammshathwan
  isCaseOverRide(attribute:string):boolean{
    let status:boolean
    if(attribute){
      const type = attribute.toLowerCase()
      if(type.includes('case risk')) status = true
    }
    return status
  }

  getCaseTypes():void{
    this.caseSharedDataService.getCaseListTypeOptions().subscribe(res => {
      if(res.length) {
        this.caseTypeList = res;
      } else {
        this.commonServicesService.getCaseCreateData("Case Risk").subscribe((res: any) => {
          this.caseTypeList = res;
        })
      }
    })
  }

  getCaseIcon(filename:string , type:string){
    const caseInfor = this.caseTypeList.find(e => e.displayName  ==  filename)
    if(caseInfor && caseInfor.icon && type === "icon"){
      return caseInfor.icon
    }else if(caseInfor && caseInfor.colorCode && type === "color"){
      const r = parseInt(caseInfor.colorCode.slice(1, 3), 16),
        g = parseInt(caseInfor.colorCode.slice(3, 5), 16),
        b = parseInt(caseInfor.colorCode.slice(5, 7), 16);
      return 'rgb(' + r + ', ' + g + ', ' + b + ')'
    }
  }

  public trackByKey(_, item): string {
    return item.key;
  }

  public trackByTimestamp(_, item): string {
    return item.timestamp;
  }
}
