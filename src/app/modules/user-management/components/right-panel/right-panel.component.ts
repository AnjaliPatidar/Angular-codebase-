import { Component, OnInit } from '@angular/core';

import { AlertManagementService } from '@app/modules/alert-management/alert-management.service';

import * as d3 from 'd3';
import { UserConstant } from '@app/modules/user-management/constants/ag-grid/user-table.constants.js';
import { UtilitiesService } from '@app/modules/user-management/services/utilities/utilities.service.js';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { AppConstants } from '@app/app.constant';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelComponent implements OnInit {
  /**<================= Public variables starts =============================> */
  public dataFromTable:any = [];
  public searchAuditText:any;
  public pieData = [
    { alertStatus: "CLOSE", count: 2, key: "CLOSE", value: 2 },
    { alertStatus: "OPEN", count: 360, key: "OPEN", value: 360 }
  ];
  public showInfo : boolean = true;
  public nameOfAudit :boolean = false;
  public nameOfUser :boolean = false;
  public auditName :any;
  public auditId :any;
  public dateFormat = GlobalConstants.globalDateFormat;
  public index : any;
  public hideShowHeadersForBulk:boolean = true;
  public rightPanelData : any = [];
  public colors = ["#5d96c8", "#b753cd", "#69ca6b", "#af3251", "#c1bd4f", "#db3f8d", "#669900", "#334433"];
  public pieOptions = {
    container: "#queueChart",
    data: this.pieData,
    height: 160,
    colors: this.colors,
    // colorsObj:['#D53F8B', '#2773B3'],
    islegends: true,
    legendwidth: 30,
    format: true,
    // istxt: sum ==0?0:parseInt((maxval/sum)*100)+"%",
    istxt: 25 + "%",
    legendmargintop: 30
  };
  public imagePath:any;
  public profileIcon:any;

  /**<================= Public variables ends =============================> */

  /**<================= private variables starts =============================> */
  /**<================= private variables ends =============================> */

  showEntityUser: any;
  intialId: any;
  constructor(private _sharedService: SharedServicesService,private utilitiesService: UtilitiesService, private _commonServices: CommonServicesService, private _alertService: AlertManagementService) {

    this.showEntityUser = "false";
  }
  ngOnInit() {


    this._sharedService.currentMessage.subscribe(param => {
      if(Array.isArray(param)){
        this.showEntityUser = param[0];
        // this.bulkData()
      }
      else{
        this.showEntityUser = param
      }
     },
    (err) => {

    });
    //getting row data through the service
    this._sharedService.rData.subscribe((val:any)=>{
     // this.hideShowHeadersForBulk = true;
      //
     if(val.data && val.data["screenName"]){
        this.auditId = val.data[UserConstant.fullName.field];
        this.auditName = val.data.screenName;
        this.nameOfUser = true;
        let makeImage = (imgData) => {
          if (imgData) {
            let imageFile = this.utilitiesService.convertBase64ToJpeg(imgData);
            var reader = new FileReader();
            reader.onload = (e: any) => {
              this.imagePath = e.target.result;

            };
            reader.readAsDataURL(imageFile);
          }
          else {
            this.imagePath=''
            this.profileIcon = val.data.completeResponse['firstName'].charAt(0) + val.data.completeResponse['lastName'].charAt(0);
          }
        }
        makeImage(val.data.completeResponse['userImage']);

      }

      this.RightPanelData(val);
    })
  }
  //Right panel api for the data of alert audit
  RightPanelData(_value){
   if(_value.data && _value.data.userId) {
    let params = {
      token : AppConstants.Ehubui_token,
      title : "User Management",
      typeId : _value.data.completeResponse.userId
      }
      this.GetRightPanelData(params)
   }
}
  GetRightPanelData(params) {
    var months = ["December", "November", "October", "September", "August", "July",
    "June", "May", "April", "March", "February", "January"];
    if(params.title){
    this._alertService.RightPanelUserData(params).subscribe((response) => {
       if (response) {
         this.formatData(response);
         this.rightPanelData.sort(function(a, b){
         return months.indexOf(a.key)
               - months.indexOf(b.key);
       });
       }
     })
  }
  }
  formatData(response){
    this.rightPanelData = d3.nest().key((d: any) => { return new Date(d.timestamp).toLocaleString('default', { month: 'long' }) })
    .key((d: any) => { return new Date(d.timestamp).toDateString() })
    .key((d: any) => { return d.type }).entries(response);
  }
  getTableDataFromEntity(){
    this._commonServices.getObserver.subscribe((resp) => {

      this.dataFromTable = resp;
    },
    (err) => {

    });
  }
  //to close the right panel
  removeRightPanel() {
    return this._sharedService.hideAlertRightPanel(false);
  }
  //to show the info of alert with time
  alertInfo(_index){
    if( _index['toggle']){
      _index['toggle'] = false;
    }
    else{;
      _index['toggle'] = true;
    }
  // this.showInfo = !this.showInfo ;
  // this.index = _index;
  }
  closeOpenToggle(ele:any){
   return ele.getAttribute('aria-expanded')
  }
  // bulkData(){
  //   this.nameOfAudit = true;
  //   this.hideShowHeadersForBulk = false;
  //   this._alertService.getAlertAuditBulkData().subscribe(response=>{
  //     this.formatData(response)
  //   })
  // }

  public trackByKey(_, item): string {
    return item.key;
  }

  public trackByTimestamp(_, item): string {
    return item.timestamp;
  }
}
