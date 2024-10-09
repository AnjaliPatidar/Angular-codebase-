import { Component, OnInit } from '@angular/core';
import { SharedServicesService } from '../../../shared-services/shared-services.service';
import { Router} from '@angular/router';
import { AlertManagementService } from '../alert-management.service';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {
  /**<================= Public variables starts =============================> */
  /**<================= Public variables ends =============================> */

  /**<================= private variables starts =============================> */
  /**<================= private variables ends =============================> */
  public alertListPermssionIds : any = [];
  constructor(private _alertService : AlertManagementService , private _sharedSearvice: SharedServicesService,public router: Router) { }

  ngOnInit() {
    this.getAlertListPermssionIds();
  }
  RightPanelIntial(){
    return this._sharedSearvice.hideAlertRightPanel("")
  }
  getAlertListPermssionIds() {
    this._alertService.getPermissionIds().pipe(map(res => {
      return res['tabs']
    })).subscribe(data => {
      this.alertListPermssionIds = data;
    });
  }
}
