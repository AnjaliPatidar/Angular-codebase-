import { Component, Input, OnInit } from '@angular/core';
import {
  EntityName,
  Status,
  RequestObject
} from "@app/modules/alert-management/nested-views/alert-hit-information/IAlertHitInformation";
import { GeneralSettingsApiService } from "@app/modules/systemsetting/services/generalsettings.api.service";
import { AlertManagementService } from "@app/modules/alert-management/alert-management.service";
import { ConfirmationComponent } from "@app/common-modules/modules/confirmation/confirmation.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-bst-alert-status',
  templateUrl: './bst-alert-status.component.html',
  styleUrls: ['./bst-alert-status.component.scss']
})
export class BstAlertStatusComponent implements OnInit {
  selectedOption: string;
  dropDownValues: object[]
  defaultValue: string
  public AllowedStatusList: object[];
  public workFlowKey
  public currentStatusCode: string
  public currentStatus: string
  public currentStatusCodeDisplayName
  public entityId: string
  public updatedStatus
  public identifiedEntityId
  public selectedHitRecordId

  @Input() set alertData(data) {
    if (!(data && data.alert_extra_data && data.alert_extra_data.status)) {
      return
    }
    this.entityId = data.alert_metadata.alert_id
    this.currentStatus = data.alert_extra_data.status
    this.selectedHitRecordId = data.alert_extra_data.selectedHitRecordId
    this.getStatus()
  }


  constructor(private modalService: NgbModal, public _generalSettingsApiService: GeneralSettingsApiService, private _alertService: AlertManagementService) {
  }

  getStatus() {
    this._generalSettingsApiService.getEntityWorkflows().then(res => {
      let alertObject = res.find(obj => obj.entityName === EntityName.Alert);
      this.workFlowKey = alertObject.workflowModelKey
      this.processWorkFlowKey()
    }).catch((e) => {
      console.log(e)
    })
  }

  async processWorkFlowKey() {
    const response = await this._alertService.getListItems('Alert Status').toPromise();
    this.currentStatusCode = response.find(obj => obj.displayName === this.currentStatus).code
    this.currentStatusCodeDisplayName = response.find(obj => obj.displayName === this.currentStatus).displayName
    const currentStatusObj = { name: this.currentStatusCodeDisplayName, key: this.currentStatusCode }

    this._alertService.getPosibleStatus_new(
      "A" + this.entityId,
      this.currentStatusCode,
      this.workFlowKey
    ).subscribe(statusList => {
      this.AllowedStatusList = statusList
      this.AllowedStatusList.unshift(currentStatusObj)
    })
  }

  ngOnInit() {
    this._alertService.getSelectedAlertCardObserver.subscribe(data => {
      if (!data) {
        return
      }
      this.identifiedEntityId = data.hit_id
    });
  }

  setTransition(item) {
    this.updatedStatus = item
    this.openModal()
  }

  openModal() {
    let currentModalRef = this.modalService.open(ConfirmationComponent, { windowClass: 'bst_modal alert-card-modal entity-identification-modal light-theme confirmMe' });
    currentModalRef.componentInstance.emitData.subscribe(data => {
      if (data) {
        if (data == Status.OK) {
          this.saveNewStatus()
        }
      }
    });
  }

  saveNewStatus() {
    if (!this.identifiedEntityId) {
      this.identifiedEntityId = this.selectedHitRecordId
    }
    const reqObject: RequestObject[] = [{
      alertId: this.entityId,
      identifiedEntityId: this.identifiedEntityId,
      statuse: {
        code: this.updatedStatus
      }
    }]
    this._alertService.updateAlertStatus_new(reqObject).subscribe((response) => { })
  }
}
