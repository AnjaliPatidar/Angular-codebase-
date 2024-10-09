import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { ITMAlertHit } from '../models/alert-hit.model';
import { TransactionMonitoringService } from '../services/transaction-monitoring.service';
import { HitRulesColumnComponent } from './tm-alert-hits-custom-cols/hit-rules-column/hit-rules-column.component';
import { TmAlertCardHitHyperlinkComponent } from './tm-alert-hits-custom-cols/tm-alert-card-hit-hyperlink/tm-alert-card-hit-hyperlink.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alert-transaction-list',
  templateUrl: './alert-transaction-list.component.html',
  styleUrls: ['./alert-transaction-list.component.scss']
})
export class AlertTransactionListComponent implements OnInit {

  columnDefs: any[] = [];
  public gridOptions: any = {};
  public componentName = 'alertTransactionList';
  componentThis = this;
  public gridShow = false;

  @Input() alertId: number;

  constructor(private tmService: TransactionMonitoringService, private translateService: TranslateService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.alertId.currentValue) {
      this.alertId = changes.alertId.currentValue;
      this.getHitList();
    }
  }

  ngOnInit() {
    this.translateService.onLangChange.subscribe((res) => {
      this.setAgGridOptions([]);
    })
    this.columnDefs.push({
      'headerName': this.translateService.instant('Hit ID'),
      'field': 'hitId',
      'colId': 'hitId',
      'dbKey': 'hitId',
      'width': 50,
      'initialShowColumn': true,
      'filter': 'agTextColumnFilter',
      cellRendererFramework: TmAlertCardHitHyperlinkComponent,
    },
    {
      'headerName': this.translateService.instant('Hit Name'),
      'field': 'name',
      'colId': 'name',
      'dbKey': 'name',
      'width': 100,
      'initialShowColumn': true,
      'filter': 'agTextColumnFilter',
      cellRendererFramework: TmAlertCardHitHyperlinkComponent,
    },
    {
      'headerName': this.translateService.instant('Hit Rule Name'),
      'field': 'ruleName',
      'colId': 'ruleName',
      'dbKey': 'ruleName',
      'width': 100,
      'initialShowColumn': true,
      'filter': 'agTextColumnFilter',
    },
    {
      'headerName': this.translateService.instant('Hit Score'),
      'field': 'score',
      'colId': 'score',
      'dbKey': 'score',
      'width': 50,
      'initialShowColumn': true,
      'filter': 'agNumberColumnFilter'
    },
    {
      'headerName': this.translateService.instant('Category'),
      'field': 'ruleCategory',
      'colId': 'ruleCategory',
      'dbKey': 'ruleCategory',
      'width': 100,
      'initialShowColumn': true,
      'filter': true
    },
    {
      'headerName': this.translateService.instant('Hit Rules'),
      'field': 'rule',
      'colId': 'rule',
      'dbKey': 'rule',
      'width': 35,
      'initialShowColumn': true,
      'filter': false,
      cellRendererFramework: HitRulesColumnComponent,
      cellStyle: {
        'display': 'flex',
        'flex-direction': 'row',
        'justify-content': 'center'
      },
    },
    {
      'headerName': this.translateService.instant('Hit Date & Time'),
      'field': 'hitCreatedTime',
      'colId': 'hitCreatedTime',
      'dbKey': 'hitCreatedTime',
      'width': 100,
      'initialShowColumn': true,
      'filter': 'agDateColumnFilter',
      'filterParams': {
        'applyButton': true,
        'clearButton': true,
          comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {

            if (!cellValue) {
              return 0;
            }

            //since filter only supports date component
            const currentDate = new Date(cellValue);
            filterLocalDateAtMidnight.setHours(currentDate.getHours())
            filterLocalDateAtMidnight.setMinutes(currentDate.getMinutes())
            filterLocalDateAtMidnight.setSeconds(currentDate.getSeconds())

            if (currentDate < filterLocalDateAtMidnight) {
              return -1;
            } else if (currentDate > filterLocalDateAtMidnight) {
              return 1;
            }
            return 0;
        }
      },
      'cellRenderer': (data) => {return data.value ? moment.utc(data && data.value ? data.value : '').local().format('MM-DD-YYYY HH:mm:ss'): ''},
    });

    this.setAgGridOptions([]);

    this.getHitList();

  }

  getHitList() {
    if (this.alertId) {
      this.gridShow = false;
      this.tmService.getHits(this.alertId).subscribe(hits => this.setAgGridOptions(hits || []));
    }
  }

  setAgGridOptions(rowData: ITMAlertHit[]) {
    this.gridShow = true;
    this.gridOptions = {
      'resizable': true,
      'tableName': 'Hit list',
      'columnDefs': this.columnDefs,
      'rowData': rowData,
      'rowStyle': { 'border-bottom': '#424242 1px solid' },
      'rowSelection': 'multiple',
      'floatingFilter': true,
      'animateRows': true,
      'sortable': true,
      'tabs': false,
      'isShoHideColumns': true,
      'multiSortKey': 'ctrl',
      'componentType': 'hit list',
      'defaultGridName': 'Transaction View',
      'cellClass': 'ws-normal',
      'changeBackground': "#ef5350",
      "applyColumnDefOrder": true,
      'rowModelType': 'clientSide',
      'enableTableViews': true,
      'cacheBlockSize': 10,
      'paginationPageSize': 10,
      'pagination': true,
      'enableServerSideFilter': false,
      'enableServerSideSorting': false,
      'showBulkOperations': false,
      'filter': true,
      'enableCheckBoxes': false,
      'enableTopSection': true,
      'rowHeight': 43,
      'dateFilterProperties': {
        opensProperty: 'left',
        dropsPropertyType: 'up'
      }
    };
  }

}
