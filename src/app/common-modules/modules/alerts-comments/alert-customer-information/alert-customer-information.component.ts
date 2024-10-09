import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ViewChild,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, merge, BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AlertManagementService } from '../../../../modules/alert-management/alert-management.service';
import { AgGridTableService } from '../../ag-grid-table/ag-grid-table.service';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';

const datePipe = new DatePipe('en-US');
export interface RelatedAlert {
  alertId: string;
  feed: string;
  createdDate: string;
  status: string;
  confidenceLevel: string;
}
@Component({
  selector: 'app-alert-customer-information',
  templateUrl: './alert-customer-information.component.html',
  styleUrls: ['./alert-customer-information.component.scss']
})
export class AlertCustomerInformationComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  
  selectedType = 'shareholders';
  viewDropDownControl = new FormControl();
  categoriesList: any = [];
  isShowTable: boolean;

  displayedColumns: string[] = [];

  public customerInfoData: any = {
    branches: [],
    shareholders: [],
    officership: [],
    subsidiaries: []
  }

  private customerInfoDataOriginal: any = {
    ubo: [],
    legal_rep: [],
    key_managers: []
  }

  public entity_type: string = 'person';
  private subscriptions: Subscription[] = [];

  // filterForm: FormGroup;
  alertCount: number;
  permissionIdsList: Array<any> = [];
  loading$: Observable<boolean>;
  loadingSubject: BehaviorSubject<boolean>;
  filterString: string;
  constructor(
    private alertManagementService: AlertManagementService,
    // private formBuilder: FormBuilder,
    private agGridTableService: AgGridTableService,
    private translateService: TranslateService
  ) {}
  
  dataSource: MatTableDataSource<RelatedAlert>;
  @Input('alertInfo') alertInfo: any;
  @Output() alertChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() onReleatedAlertCountChanged: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @Input('customerInfo') set customerInfo(customerInfo: any) {
    this.dataSource = new MatTableDataSource<RelatedAlert>();
    let jsonresult = JSON.parse(customerInfo.completeRowData.alertMetaData)
    
    this.customerInfoData = jsonresult.customer_information;
    this.categoriesList = Object.keys(jsonresult.customer_information)

    this.isShowTable = (this.customerInfoData.constructor === Object)

    let defaultType = 'shareholders';
    if (defaultType === 'shareholders') {
      this.haddleChangeType(defaultType);
    }

  }

  ngOnInit() {
    this.loadingSubject = new BehaviorSubject<boolean>(
      false
    );
    this.loading$ = this.loadingSubject.asObservable();
    // this.createForm();
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 10;
    this.getComponentPermissionIds();
    // if (this.alertInfo) {
      this.onActiveAlertChanged();
    // }
    const sortSubscription: Subscription = this.sort.sortChange.subscribe(
      () => (this.paginator.pageIndex = 0)
    );
    const paginatorSubscriptions: Subscription = merge(
      this.sort.sortChange,
      this.paginator.page
    )
      .pipe(tap(() => this.onActiveAlertChanged()))
      .subscribe();
    this.subscriptions.push(paginatorSubscriptions);
    this.subscriptions.push(sortSubscription);
    this.paginator._intl.itemsPerPageLabel = this.translateService.instant(this.paginator._intl.itemsPerPageLabel);
    const rangeLabelOriginal = this.paginator._intl.getRangeLabel;
    this.paginator._intl.getRangeLabel = (page: number, size: number, len: number) => rangeLabelOriginal(page, size, len).replace('of', this.translateService.instant('of'));
  }

  haddleChangeType(selectedType: any) {
    // if officership
    if (selectedType && selectedType === 'officership' && this.customerInfoData !== undefined && this.customerInfoData.officership && this.customerInfoData.officership.length > 0) {
      this.displayedColumns = [
        'name',
        'address',
        'role'
      ]
      this.dataSource = this.customerInfoData.officership;
    // if shareholders
    } else if (selectedType && selectedType === 'shareholders' && this.customerInfoData !== undefined && this.customerInfoData.shareholders && this.customerInfoData.shareholders.length > 0) {
      this.displayedColumns = [
        'shareholderName',
        'isDomiciledIn',
        'shareholderAddress',
        'relationSource',
        'totalPercentage'
      ]
      this.dataSource = this.customerInfoData.shareholders.map(obj=>{
        obj.shareholderName = obj['vcard:organization-name']
        obj.shareholderAddress = obj['mdaas:RegisteredAddress'].fullAddress
        obj.relationSource = obj.relation.source
        obj.totalPercentage = obj.relation.totalPercentage ? parseFloat(obj.relation.totalPercentage).toFixed(2) : 0
        return obj;
      });
    // if branches
    } else if (selectedType && selectedType === 'branches' && this.customerInfoData.branches && this.customerInfoData.branches.length > 0) {
      this.displayedColumns = [
        'brancheName',
        'brancheIsDomiciledIn',
        'brancheAddress',
        'brancheSource'
      ]
      this.dataSource = this.customerInfoData.branches.map(obj=>{
        obj.brancheName = obj['vcard:organization-name']
        obj.brancheIsDomiciledIn = obj['isDomiciledIn']
        obj.brancheAddress = obj['mdaas:RegisteredAddress'].fullAddress
        obj.brancheSource = obj['@sourceReferenceID']
        return obj;
      });
    // if subsidiaries
    } else if (selectedType && selectedType === 'subsidiaries' && this.customerInfoData.subsidiaries && this.customerInfoData.subsidiaries.length > 0) {
      this.displayedColumns = [
        'subsidiarieName',
        'subsidiarieIsDomiciledIn',
        'subsidiarieAddress',
        'subsidiarieSource'
      ]
      this.dataSource = this.customerInfoData.subsidiaries.map(obj=>{
        obj.subsidiarieName = obj['vcard:organization-name']
        obj.subsidiarieIsDomiciledIn = obj['isDomiciledIn']
        obj.subsidiarieAddress = obj['mdaas:RegisteredAddress'].fullAddress
        obj.subsidiarieSource = obj['@sourceReferenceID']
        return obj;
      });
    }
  }

  ngAfterViewInit() {}

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'alertInfo': {
            if (changes.alertInfo.firstChange !== true) {
              if (this.alertInfo) {
                this.onActiveAlertChanged();
              }
            }
          }
        }
      }
    }
  }

  getAlertsByCustomerId(id: any): void {
    this.loadingSubject.next(true);
    const sortOrder: string = this.sort.direction
      ? this.sort.direction
      : 'desc';

    const pagination = {
      pageNumber: this.paginator.pageIndex + 1,
      recordsPerPage: this.paginator.pageSize,
      orderIn: sortOrder,
      orderBy: this.sort.active ? this.sort.active : 'createdDate',
      isAllRequired: false,
    };

    const filter = this.filterConfiguration(id);
    this.filterString = JSON.stringify(filter);

    this.alertManagementService
      .getAlertList(pagination, this.filterString)
      .subscribe((response: any) => {
        this.alertManagementService.getRelatedAlertObservable.next(response);
        const result: any[] = response.result;
        const paginationInformation = response.paginationInformation;
        const filterdData = result.map((data) => {
          return {
            alertId: data.alertId,
            feed: this.getFeedTypes(data.feed),
            createdDate: datePipe.transform(
              data.createdDate,
              'MMM d, y, h:mm a'
            ),
            status: data.statuse ? data.statuse.displayName : 'N/A',
            confidenceLevel: this.getConfidenceLvl(data.alertMetaData)
          };
        });
        this.dataSource.data = filterdData;
        this.paginator.length = paginationInformation.totalResults;
        this.alertCount = paginationInformation.totalResults;
        this.alertManagementService.sendReleatedAlertRowCount(this.alertCount);
        this.loadingSubject.next(false);
      }, () => {
        this.loadingSubject.next(false);
      });
  }

  onActiveAlertChanged(): void {
    this.dataSource.data = [];
    this.alertCount = 0;
    let cId = '12121221';
    this.getAlertsByCustomerId(cId);
  }

  filterConfiguration(customerId: string): any {
    let filters: any = {};
    filters = {
      customerId: {
        condition1: { type: 'contains', filter: customerId, filterType: 'text' },
      },
    };
    return filters;
  }

  switchAlert(alertId: any): void {
    this.alertChanged.emit(alertId);
  }

  releatedAlertCount(alertCount: any): void {
    this.onReleatedAlertCountChanged.emit(alertCount);
}

  getComponentPermissionIds() {
    this.agGridTableService.behaviorSubjectForAllPermisonIds$.subscribe(
      (ids) => {
        this.permissionIdsList = ids;
      }
    );
  }

  getConfidenceLvl(metaData: any): any {
    let confidanceLevel: any = 'N/A';
    const dataString: string = metaData ? metaData : {};
    const parseData = JSON.parse(dataString);
    if (parseData.results) {
      const screenList = parseData.results.screening
        ? parseData.results.screening
        : {};
      if (screenList.watchlists) {
        const watchlist = screenList.watchlists ? screenList.watchlists : {};
        const result = this.getMaxConfidence(watchlist);
        confidanceLevel =
          result !== 'N/A' ? this.getConfidencePercentage(result) : 'N/A';
      } else {
        confidanceLevel = 'N/A';
      }
    } else {
      confidanceLevel = 'N/A';
    }
    return confidanceLevel;
  }

  getMaxConfidence(watchlist: any): any {
    let confidanceLevel: any = 'N/A';
    let watchlistData = watchlist;
    watchlistData = watchlistData.sort(function(a, b) {
      return b.basic_info.id - a.basic_info.id;
    });
    let watchlistData2 = [];
    const ids: any[] = [];
    watchlistData.map((wl) => {
      if (ids.indexOf(wl.basic_info.id) === -1) {
        watchlistData2.push(wl);
        ids.push(wl.basic_info.id);
      }
    });
    watchlistData2 = watchlistData2.sort(function(a, b) {
      return a.basic_info.id - b.basic_info.id;
    });
    watchlistData = watchlistData2;
    watchlistData = watchlistData.sort(function(a, b) {
      return b.confidence - a.confidence;
    });
    if (watchlistData) {
      confidanceLevel = watchlistData[0].confidence
        ? watchlistData[0].confidence
        : 'N/A';
    }
    return confidanceLevel;
  }

  getConfidencePercentage(num: any) {
    if (num && num <= 1) {
      num = parseFloat(num) * 100;
      return num.toFixed(2);
    }
    return num;
  }

  getFeedTypes(feeds: any[]): any {
    let types = ' ';
    if (feeds.length) {
      feeds.forEach((element) => {
        types =
          types === ' ' ? element.feedName : types + ', ' + element.feedName;
      });
    } else {
      types = 'N/A';
    }
    return types;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
