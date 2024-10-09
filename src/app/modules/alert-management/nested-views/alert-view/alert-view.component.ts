import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AgGridTableService } from '../../../../common-modules/modules/ag-grid-table/ag-grid-table.service';
import { AlertManagementService } from '../../alert-management.service';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-alert-view',
  templateUrl: './alert-view.component.html',
  styleUrls: ['./alert-view.component.scss']
})
export class AlertViewComponent implements OnInit, OnDestroy {

  isLoaded: boolean = false;
  alertView: Object = {};
  private _unsubscribe$ = new Subject<boolean>();
  selectedHit: any;
  showAdverseMedia: boolean = false
  public userSelectedData

  constructor(private _agGridTableService: AgGridTableService, private _alertService: AlertManagementService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let uuid = params.uuid;
      if (uuid) {
        this.getAlertCardDetails(uuid);
      }
    });
    this.getAlertList()
  }

  getAlertList() {
    this._agGridTableService.getObserverOnRowClick.pipe(takeUntil(this._unsubscribe$)).subscribe(data => {
      if (data) {
        this.getAlertCardDetails(data.data.completeRowData.uuid)
      }
    });
  }

  getAlertCardDetails(uuid: string) {
    this._alertService.getAlertCardData(uuid).pipe(takeUntil(this._unsubscribe$)).subscribe((res: any) => {
      if (res) {
        this.isLoaded = true;
        this.alertView = res;
        this.alertView['uuid'] = uuid
      }
    })
  }

  selectedItem(e) {

    this.selectedHit = e ? e : {}
    this._alertService.getSelectedAlertCardData(e)
    this.userSelectedData = e

    if (this.selectedHit) {
      // for checking hit type
      this.showAdverseMedia = this.selectedHit.hit_producer_category === 'BST_ADVERSE_MEDIA' ? true : false

      this._alertService.setAlertExtraData(this.alertView)
      this._alertService.setWatchlistData(this.alertView, this.selectedHit)
      this._alertService.setGeneralAttributesData(this.alertView)
      this._alertService.setCustomerData(this.alertView)
    }
  }

  ngOnDestroy() {
    this._unsubscribe$.next(true);
    this._unsubscribe$.complete();
    this._alertService.resetUniformAlertCardData();
  }
}
