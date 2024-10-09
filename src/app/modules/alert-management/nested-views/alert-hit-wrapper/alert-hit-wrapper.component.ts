import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {GeneralSettingsApiService} from "@app/modules/systemsetting/services/generalsettings.api.service";
import {AlertManagementService} from "@app/modules/alert-management/alert-management.service";
import {ConfirmationComponent} from "@app/common-modules/modules/confirmation/confirmation.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-alert-hit-wrapper',
  templateUrl: './alert-hit-wrapper.component.html',
  styleUrls: ['./alert-hit-wrapper.component.scss']
})
export class AlertHitWrapperComponent implements OnInit {
  public data
  selectedIndex: Number = 0
  showMatchType: boolean = false

  @Input() set alertData(data) {
    if (!(data && data.alert_extra_data && data.alert_extra_data.status)) {
      return
    }
    this.data = data
  }

  constructor() {
  }
  ngOnInit() {
  }
  
  onTabChange(matIndex){
    this.selectedIndex = matIndex.index
  }
}
