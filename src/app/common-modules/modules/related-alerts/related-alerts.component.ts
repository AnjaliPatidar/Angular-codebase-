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
  Inject,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, merge, BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AlertManagementService } from '../../../modules/alert-management/alert-management.service';
import { AgGridTableService } from '../ag-grid-table/ag-grid-table.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { WINDOW } from '../../../core/tokens/window';

const datePipe = new DatePipe('en-US');
export interface RelatedAlert {
  alertId: string;
  feed: string;
  createdDate: string;
  status: string;
  assignee: string;
  confidenceLevel: string;
}
@Component({
  selector: 'app-related-alerts',
  templateUrl: './related-alerts.component.html',
  styleUrls: ['./related-alerts.component.scss'],
})
export class RelatedAlertsComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  displayedColumns: string[] = [
    'alertId',
    'feed',
    'createdDate',
    'status',
    'assignee',
    'confidenceLevel',
  ];
  // Additional 'filter' column list
  displayedColumnFilters: string[] = [
    'alertIdFilter',
    'feedFilter',
    'createdDateFilter',
    'statusFilter',
    'assigneeFilter',
    'confidenceLevelFilter',
  ];
  dataSource: MatTableDataSource<RelatedAlert>;
  @Input('alertInfo') alertInfo: any;
  @Output() alertChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() onReleatedAlertCountChanged: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private subscriptions: Subscription[] = [];

  filterForm: FormGroup;
  alertCount: number;
  permissionIdsList: Array<any> = [];
  loading$: Observable<boolean>;
  loadingSubject: BehaviorSubject<boolean>;
  filterString: string;
  constructor(
    private alertManagementService: AlertManagementService,
    private formBuilder: FormBuilder,
    private agGridTableService: AgGridTableService,
    private translateService: TranslateService,
    @Inject(WINDOW) private readonly window: Window
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<RelatedAlert>();
    this.loadingSubject = new BehaviorSubject<boolean>(
      false
    );
    this.loading$ = this.loadingSubject.asObservable();
    this.createForm();
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 10;
    this.getComponentPermissionIds();
    if (this.alertInfo) {
      this.onActiveAlertChanged();
    }
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

  createForm(): void {
    this.filterForm = this.formBuilder.group({
      alertIdFilter: [''],
      typeFilter: [''],
      createdDateFilter: [''],
      statusFilter: [''],
      assigneeFilter: [''],
      confidenceLevelFilter: [''],
    });
  }

  getFormantDate(date:string): string {
    return moment(date).format('DD/MM/YYYY');
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


    let alertCardId = this.window.location.href.split('alertCard/')[1];
    let customerUrlId = '0';
    if (alertCardId !== undefined) {
      customerUrlId = alertCardId.split('/')[1];
    }

    const filter = this.filterConfiguration(id);
    this.filterString = JSON.stringify(filter);

    if (customerUrlId === id) {
      this.alertManagementService.getAlertByCIdAId(pagination, this.filterString).subscribe((response: any) => {
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
            assignee: data.asignee ? data.asignee.firstName : 'Unassigned',
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

    } else {
      this.alertManagementService.getAlertList(pagination, this.filterString).subscribe((response: any) => {
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
            assignee: data.asignee ? data.asignee.firstName : 'Unassigned',
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
  }

  onActiveAlertChanged(): void {
    this.dataSource.data = [];
    this.alertCount = 0;
    this.getAlertsByCustomerId(this.alertInfo.completeRowData.customerId);
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

  exportDataCSV() {
    let data = {
      filterString: this.filterString,
      recordsPerPage: this.alertCount,
      coloumnKey: this.dataSource.data.length > 0 ? Object.keys(this.dataSource.data[0]) : ''
    }
    document.getElementById("export-pdf-button").setAttribute('related-data', JSON.stringify(data));
    document.getElementById("export-button").click();
    let ele = (<HTMLInputElement>document.getElementById("alertExport"));
    ele.disabled = true;
    ele.innerHTML = "Exporting..."
  }
  
  exportDataPdf() {
    let data = {
      filterString: this.filterString,
      recordsPerPage: this.alertCount,
      coloumnKey: this.dataSource.data.length > 0 ? Object.keys(this.dataSource.data[0]) : ''
    }
    document.getElementById("export-pdf-button").setAttribute('related-data', JSON.stringify(data));
    document.getElementById("export-pdf-button").click();
    let ele = (<HTMLInputElement>document.getElementById("alertExport"));
    ele.disabled = true;
    ele.innerHTML = "Exporting..."
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
