import { Component, OnInit } from '@angular/core';
import { SharedServicesService } from '../../../shared-services/shared-services.service'
import { CommonServicesService } from '@app/common-modules/services/common-services.service.js';
import { AlertManagementService } from '@app/modules/alert-management/alert-management.service';
import * as d3 from 'd3';
import { UtilitiesService } from '@app/modules/user-management/services/utilities/utilities.service.js';
import { UserService } from '@app/modules/user-management/services/user.service';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelComponent implements OnInit {
  /**<================= Public variables starts =============================> */
  public dataFromTable: any = [];
  public searchAuditText: any;
  public pieData = [
    { alertStatus: "CLOSE", count: 2, key: "CLOSE", value: 2 },
    { alertStatus: "OPEN", count: 360, key: "OPEN", value: 360 }
  ];
  public showInfo: boolean = true;
  public nameOfAudit: boolean = false;
  public nameOfUser: boolean = false;
  public auditName: any;
  public auditId: any;
  public index: any;
  public hideShowHeadersForBulk: boolean = true;
  public rightPanelData: any = [];
  public profileImage: any;
  public userName;
  public dateFormat = GlobalConstants.globalDateFormat;
  public imagePath: any;
  public profileIcon: any;

  /**<================= Public variables ends =============================> */

  /**<================= private variables starts =============================> */
  /**<================= private variables ends =============================> */
  public showEntityUser: any;
  public intialId: any;

  constructor(private _sharedService: SharedServicesService, private userService: UserService,private utilitiesService: UtilitiesService, private _commonServices: CommonServicesService, private _alertService: AlertManagementService) {
    this.showEntityUser = "false";
  }
  ngOnInit() {
    this._sharedService.currentMessage.subscribe(param => {
      if (Array.isArray(param)) {
        this.showEntityUser = param[0];
        this.bulkData()
      }
      else {
        this.showEntityUser = param
      }
    },
      (err) => {

      });
    //getting row data through the service
    this._sharedService.rData.subscribe((val: any) => {
      this.hideShowHeadersForBulk = true;
      if (val.data && val.data.entityName) {
        this.auditName = val.data.entityName;
        this.auditId = val.data.alertId;
        this.nameOfAudit = true;
      } else if (val.data && val.data["Feed Name"]) {
        this.auditName = val.data["Feed Name"];
        this.nameOfAudit = false;
        this.auditId = val.data.feed_id;
      }
      this.RightPanelData(val);
    });
    this.userProfile();
  }
  //Right panel api for the data of alert audit
  RightPanelData(_value) {
    var params = {};
    if (_value.data && _value.data.alertId) {
      params = {
        type: "Alert Management",
        typeId: _value.data.alertId
      }
    }
    else if (_value.data && _value.data.feed_id) {
      params = {
        type: "Feed Management",
        typeId: _value.data.feed_id
      }
    }
    if (params) {
      this.GetRightPanelData(params);
    }
  }

  GetRightPanelData(params) {
    var months = ["December", "November", "October", "September", "August", "July",
      "June", "May", "April", "March", "February", "January"];
    if (params.typeId) {
      this._alertService.RightPanelAlertData(params).subscribe((response) => {
        if (response) {
          this.formatData(response);
          this.rightPanelData.sort(function (a, b) {
            return months.indexOf(a.key)
              - months.indexOf(b.key);
          });
        }
      })
    }
  }

  formatData(response) {
    this.rightPanelData = d3.nest().key((d: any) => { return new Date(d.timestamp).toLocaleString('default', { month: 'long' }) })
      .key((d: any) => { return new Date(d.timestamp).toDateString() })
      .key((d: any) => { return d.type }).entries(response);
  }
  getTableDataFromEntity() {
    this._commonServices.getObserver.subscribe((resp) => {
      this.dataFromTable = resp;
    },
      (err) => {

      });
  }
  userProfile() {
    let userId = JSON.parse(localStorage.getItem('ehubObject'))
    this.userService.getUserById(userId['userId'])
      .then((response: any) => {
        if (response.status && response.status == "success") {
          let user = response.data ? response.data : {};
          this.userName = user.firstName.charAt(0) + user.lastName.charAt(0);
          if (user && user.userImage) {
            let imageFile = this.utilitiesService.convertBase64ToJpeg(user.userImage)
            var reader = new FileReader();
            reader.onload = (e: any) => {
              this.profileImage = e.target.result
            };
            reader.readAsDataURL(imageFile);
          }
        }
      }).catch((error) => {
        throw error;
      })
  }
  //to close the right panel
  removeRightPanel() {
    return this._sharedService.hideAlertRightPanel(false);
  }
  //to show the info of alert with time
  alertInfo(_index) {
    if (_index['toggle']) {
      _index['toggle'] = false;
    }
    else {
      ;
      _index['toggle'] = true;
    }
    // this.showInfo = !this.showInfo ;
    // this.index = _index;
  }
  closeOpenToggle(ele: any) {
    return ele.getAttribute('aria-expanded')
  }
  bulkData() {
    this.nameOfAudit = true;
    this.hideShowHeadersForBulk = false;
    this._alertService.getAlertAuditBulkData().subscribe(response => {
      this.formatData(response)
    })
  }
  public trackByKey(_, item): string {
    return item.key;
  }

  public trackByTimestamp(_, item): string {
    return item.timestamp;
  }
}
