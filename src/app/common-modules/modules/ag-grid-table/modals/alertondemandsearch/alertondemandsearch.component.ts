import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { AlertManagementService } from '@app/modules/alert-management/alert-management.service';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { DateAdapter } from '@angular/material/core';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { forkJoin, from, Observable, Subject } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { AlertOnDemandSearchTypes } from './alertondemandsearch.types';

@Component({
  selector: 'app-alertondemandsearch',
  templateUrl: './alertondemandsearch.component.html',
  styleUrls: ['./alertondemandsearch.component.scss']
})
export class AlertondemandsearchComponent implements OnInit {
  public AlertFormFiels: any = {
    entityType: 'person',
    entityID: '',
    entityName: '',
    country: '',
    date: '',
    confidence: 40,
    jurisdiction: '',
    countries: [],
    selcountry: {},
    tenantFilterData: [],
    seltenant:{},
    tenant:'',
  }
  public filterTenant: any = [];
  public filteredStates: any = [];
  public nationalities: any = [];
  public screeningId: any = '';
  public languageJson: any;
  public globalDateFormat = GlobalConstants.globalDateFormat;
  public ondemandSearchSpinner = false;
  public Watchlist: any = [];
  public feedClassification: any = [];
  public selectedFeedsforWl: any = [];
  public allWatchlist: any = [];
  public initialLoaded = false;

  private readonly changeEntityType$: Subject<string> = new Subject<string>();

  constructor(
    public dialogRef: MatDialogRef<AlertondemandsearchComponent>,
    public commonServicesService: CommonServicesService,
    private _alertService: AlertManagementService,
    private _sharedServicesService: SharedServicesService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale(this.globalDateFormat.Abbreviation)
  }

  public ngOnInit() {
    this.getTenantData()
    this.changeEntityType$
      .pipe(switchMap((entityType: string) => this.getWatchlists$(entityType)))
      .subscribe();

    const watchLists$ = this.getWatchlists$(this.AlertFormFiels.entityType);
    const jurisdictionsList$ = this.getJurisdictionsList$();

    forkJoin([watchLists$, jurisdictionsList$]).subscribe(() => {
      this.initialLoaded = true;
    });
  }

  ngAfterViewInit() {
    let promisObj = new Promise((resolve, reject) => {
      this.commonServicesService.behaveObserverForgetLanguageJson.subscribe((resp) => {
        if (resp) {
          this.languageJson = resp;
          this.languageJson['to'] = "-"
          resolve(this.languageJson);
        }
      });
    });
  }


  get_pattern(element) {
    return this.commonServicesService.get_pattern(element);
  }
  get_pattern_error(type) {
    return this.commonServicesService.get_pattern_error(type);
  }
  searchAlert(form) {
    if (this.AlertFormFiels && this.AlertFormFiels.entityName && (this.AlertFormFiels.entityName.trim().length < 1)) {
      this._sharedServicesService.showFlashMessage("entity name is required", 'danger');
      return;
    }
    var data = {
      "confidence": this.AlertFormFiels.confidence ? this.AlertFormFiels.confidence / 100 : 0,
      entity: {},
      feed_classification: this.feedClassification,
      tenant_code: this.AlertFormFiels.seltenant && this.AlertFormFiels.seltenant.code ? this.AlertFormFiels.seltenant.code : 'None'
    }

    if (this.AlertFormFiels.date) {
      var day_birth = this.AlertFormFiels.date && this.AlertFormFiels.date.getDate ? ('0' + this.AlertFormFiels.date.getDate()) : '';
      var month_birth = this.AlertFormFiels.date && this.AlertFormFiels.date.getMonth ? ('0' + (this.AlertFormFiels.date.getMonth() + 1)) : '';
      this.AlertFormFiels.date = this.AlertFormFiels.date && this.AlertFormFiels.date.getFullYear ? (this.AlertFormFiels.date.getFullYear() + '-' + (month_birth).slice(month_birth.length - 2, month_birth.length) + '-' + (day_birth).substring(day_birth.length - 2, day_birth.length)) : '';
    }

    data.entity = {
      "entity_id": this.AlertFormFiels.entityID,
      "entity_type": this.AlertFormFiels.entityType,
      "name": this.AlertFormFiels.entityName.trim(),
      "customer_id": "",
      "watchlists": this.Watchlist,
      "all_watchlist": this.allWatchlist.length === this.Watchlist.length ? true : false
    }
    if (form.value.hasOwnProperty('gender')) {
      data.entity['gender'] = form.value['gender'] ? form.value['gender'] : "";
    }

    if (form.value.hasOwnProperty('nationality')) {
      data.entity['nationality'] = [form.value['nationality'] ? form.value['nationality'] : ""];
    }
    if (form.value.hasOwnProperty('jobTitle')) {
      data.entity['job title'] = form.value['jobTitle'] ? form.value['jobTitle'] : "";
    }
    if (form.value.hasOwnProperty('address')) {
      data.entity['address'] = form.value['address'] ? form.value['address'] : "";
    }
    if (this.AlertFormFiels.entityType === 'person') {
      data.entity["date_of_birth"] = [this.AlertFormFiels.date ? this.AlertFormFiels.date : '']
      data.entity["place_of_birth"] = [this.AlertFormFiels.selcountry && this.AlertFormFiels.selcountry.jurisdictionName ? this.AlertFormFiels.selcountry.jurisdictionName : ''];
    } else {
      data.entity["jurisdiction"] = this.AlertFormFiels.selcountry && this.AlertFormFiels.selcountry.jurisdictionName ? this.AlertFormFiels.selcountry.jurisdictionName : '';
      data.entity["date_of_registration"] = [this.AlertFormFiels.date ? this.AlertFormFiels.date : ''];
      data.entity["place_of_registration"] = [this.AlertFormFiels.selcountry && this.AlertFormFiels.selcountry.jurisdictionOriginalName ? this.AlertFormFiels.selcountry.jurisdictionName : ''];
    }
    this.ondemandSearchSpinner = true;

    this.commonServicesService.searchAlertOndemand(data).then((response: any) => {
      if (response && response.job_id) {
        this.screeningId = response.job_id;
        this.getStats(this.screeningId);

        this._sharedServicesService.showFlashMessage(this.languageJson['SearchIsInitiatedWillUpdateOnceDone'], 'success');
      }
      else if (response && response.responseMessage) {
        this._sharedServicesService.showFlashMessage(response.responseMessage, 'danger');
      }
      else {
        this._sharedServicesService.showFlashMessage('Something Went Wrong', 'danger');
      }
      this.ondemandSearchSpinner = false;
      this.dialogRef.close();

    }).catch((err) => {
      this._sharedServicesService.showFlashMessage('Something Went Wrong', 'danger');
      this.ondemandSearchSpinner = false;
      this.dialogRef.close();
    });
  }

  async getStats(reqId) {
    const timer = ms => new Promise(res => setTimeout(res, ms))
    let end_time = new Date().getTime() + ( 60 * 60000 );
    let response;
    do {
      await this._alertService.getStatsForScreeningRequestID(reqId)
        .then((result) => {
          response = result;
          this.receivedAlerts(response);
        })
        .catch((err) => {
          this._sharedServicesService.showFlashMessage('Something Went Wrong', 'danger');
          response = null;
        });
      if(new Date().getTime() < end_time){
        await timer(20000);
      }else{
        response.job_status = 'timed out';
        this.receivedAlerts(response,true);
      }
    } while (response && response.job_status && response.job_status.toLowerCase() === "running");
  }

  receivedAlerts(response,timedOut: boolean = false) {
    if (response && response.job_status && response.job_status.toLowerCase() !== "running") {
      let res = {
        results: {
          'created': response.stats.alerts.generated_alerts,
          'failed': response.stats.alerts.errors,
          'suppressed': response.stats.alerts.alerts_suppressed,
          'pushed': 0
        },
        status: response.job_status,
        timedOut: timedOut
      }
      this.commonServicesService.getAlerts.next(res);
    }
  }
  private getJurisdictionsList$(): Observable<any> {
    return from(this.commonServicesService.getJurdictionlist()).pipe(
      filter((response) => !!response),
      tap((response) => {
        this.filteredStates = response;
        this.nationalities = response;
        this.AlertFormFiels.countries = response;
      })
    );
  }

  filterStates(value) {
    const filterValue = value.toLowerCase();
    this.filteredStates = this.AlertFormFiels.countries.filter((state) => {
      if (state.jurisdictionOriginalName) {
        return state.jurisdictionOriginalName.toLowerCase().indexOf(filterValue) === 0;
      }
    });
  }

  filterNationalities(value) {
    const filterValue = value.toLowerCase();
    this.nationalities = this.AlertFormFiels.countries.filter((state) => {
      if (state.jurisdictionOriginalName) {
        return state.jurisdictionOriginalName.toLowerCase().indexOf(filterValue) === 0;
      }
    });
  }
  selectedCountry(selected) {
    this.AlertFormFiels.selcountry = selected;
  }

  filterTenants(value) {
    const filterValue = value.toLowerCase();
    this.filterTenant = this.AlertFormFiels.tenantFilterData.filter((ele) => {
      if (ele.displayName) {
        return ele.displayName.toLowerCase().indexOf(filterValue) === 0;
      }
    });
  }

  selectedTenant(selected) {
    this.AlertFormFiels.seltenant = selected;
  }

  getTenantData() {
    this._alertService.getTenant().subscribe((res: AlertOnDemandSearchTypes.TenantTypeRes) => {
      if (res.data) {
        this.filterTenant = res.data.sort((a, b) => a.displayName.localeCompare(b.displayName))
        const index = this.filterTenant.findIndex((e) => e.displayName.toLowerCase() == 'none')
        const tenantNoneOption = this.filterTenant[index]
        this.filterTenant.splice(index, 1)
        this.filterTenant.unshift(tenantNoneOption)
        this.AlertFormFiels.tenantFilterData = res.data;
        this.AlertFormFiels.tenant = 'None';
      }
    },
      error => {
        this.AlertFormFiels.tenant = 'None';
      }
    )
  }

  private getWatchlists$(entityType: string): Observable<any> {
    this.initialLoaded = false;
    return from(this.commonServicesService.getWatchlists(entityType)).pipe(
      filter((response: any) => response && response.data),
      tap( (response) => {
        this.allWatchlist = response.data;
        this.initialLoaded = true;
      })
    )
  }

  updateWatchlist(watchlist) {
    this.Watchlist = watchlist;
  }

  updateClassifications(classifications) {
    let newClassification;
    let newSelectedFeeds;
    if(classifications.length > 0){
      newClassification = classifications.map(el => el.listItemId);
      newSelectedFeeds= classifications.map(el => el.code);
    }
    else{
      newClassification = [];
      newSelectedFeeds=[];
    }
    this.feedClassification = newClassification;
    this.selectedFeedsforWl = newSelectedFeeds;
  }

  public entityTypeChange(entityType: any): void {
    this.allWatchlist = [];
    this.changeEntityType$.next(entityType && entityType.value ? entityType.value : '');
  }

  public trackByDisplayName(_, item): string {
    return item.displayName;
  }

  public trackByJurisdictionOriginalName(_, item): string {
    return item.jurisdictionOriginalName;
  }

}
