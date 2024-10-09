import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {GeneralSettingsApiService} from "@app/modules/systemsetting/services/generalsettings.api.service";
import {AlertManagementService} from "@app/modules/alert-management/alert-management.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmationComponent} from "@app/common-modules/modules/confirmation/confirmation.component";
import { EntityName, RequestObject } from './IAlertHitInformation';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-alert-hit-information',
  templateUrl: './alert-hit-information.component.html',
  styleUrls: ['./alert-hit-information.component.scss']
})
export class AlertHitInformationComponent implements OnInit, OnDestroy {

  public AllowedStatusList: object[];
  public workFlowKey
  public currentStatus
  public entityId
  public updatedStatus
  public selectedHit
  public selectedHitRecordId
  public receivedData
  public identifiedEntityId
  public currentStatusCode
  public currentStatusCodeDisplayName
  private _unsubscribe$ = new Subject<boolean>();
  hitData: object = {};
  public data

  @Input() set alertData(data) {
    if (!(data && data.alert_extra_data && data.alert_extra_data.status)) {
      return
    }
    this.data = data
    this.currentStatus = data.alert_extra_data.status
    this.entityId = data.alert_metadata.alert_id
    this.selectedHitRecordId = data.alert_extra_data.selectedHitRecordId
    this.selectedHit = data.hits[0].hit_generated.find(item => item.hit_id === this.selectedHitRecordId);
    this.getStatus()
  }

  constructor(public _generalSettingsApiService: GeneralSettingsApiService, private _alertService: AlertManagementService, private modalService: NgbModal, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this._alertService.getSelectedAlertCardObserver.subscribe(data => {
      if (!data) {
        return
      }
      this.identifiedEntityId = data.hit_id
    });

    this.getHitInformation()
  }

  /**
   * This getStatus function is used for load data to the dropdown
   */
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
    const currentStatusObj = {name:this.currentStatusCodeDisplayName, key:this.currentStatusCode}

    this._alertService.getPosibleStatus_new(
      "A" + this.entityId,
      this.currentStatusCode,
      this.workFlowKey
    ).subscribe(statusList => {
      this.AllowedStatusList = statusList
      this.AllowedStatusList.unshift(currentStatusObj)
    })
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

    this._alertService.updateAlertStatus_new(reqObject).subscribe((response) => {})

  }

  openModal() {
    let currentModalRef = this.modalService.open(ConfirmationComponent, {windowClass: 'bst_modal alert-card-modal entity-identification-modal light-theme confirmMe'});
    currentModalRef.componentInstance.emitData.subscribe(data => {
      if (data) {
        if (data == 'OK') {
          this.saveNewStatus()
        }
      }
    });
  }

  setTransition(item) {
    this.updatedStatus = item
    this.cdr.detectChanges()
    this.openModal()
  }

  getHitInformation() {
    this._alertService.getWatchlistData().pipe(takeUntil(this._unsubscribe$)).subscribe((data: any) => {
      if (data && data.hit_attributes) {
        this.hitData = {
          confidenceLevel: this.getConfidencePercentage(data.hit_attributes.confidence),
          watchlistName: data.hit_attributes.basic_info.list_name,
          createdDate: data.hit_attributes.basic_info.created_date,
          hitEntityName: data.hit_attributes.basic_info.primary_name ? data.hit_attributes.basic_info.primary_name : data.hit_attributes.basic_info.name ? data.hit_attributes.basic_info.name : "N/A"
        }
      } else {
        this.hitData = {}
      }
    })
  }

  getConfidencePercentage(num) {
    if (num && num <= 1) {
      num = parseFloat(num) * 100
      return num.toFixed(2);
    }
    return num;
  }

  ngOnDestroy() {
    this._unsubscribe$.next(true);
    this._unsubscribe$.complete();
  }
}
