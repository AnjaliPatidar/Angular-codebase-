import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {GlobalConstants} from '@app/common-modules/constants/global.constants';
import {CaseManagementService} from '@app/modules/case-management/case-management.service';
import {ThemeService} from '@app/shared-services/theme.service';
import {GroupsService} from '@app/modules/user-management/services/groups.service';

@Component({
  selector: 'app-case-details-events-lookup',
  templateUrl: 'events-lookup.component.html',
  styleUrls: ['events-lookup.component.scss']
})
export class EventsLookupComponent implements OnInit {

  @Input() private caseId;
  @Input() private caseName;
  @ViewChild('agGridTableComponentHelper', {static: false}) agGridTableComponentHelper: any;
  public eventsLookupLoaded = false;
  public showEventsLookupOverlay = false;
  public eventLookupOptions: any;
  public eventsLookupAttachmentsCount: any;
  private rowData: any = [];
  private countries: Country[] = [];
  constructor(
    private caseService: CaseManagementService,
    public themeService: ThemeService,
    private groupsService: GroupsService,
  ) {
  }

  public ngOnInit(): void {
    this.getJurisdictionList();
  }

  configureEventsLookup(): void {
    const columns = [
      {
        headerName: GlobalConstants.languageJson.Date !== undefined
          ? `${GlobalConstants.languageJson.Date}`
          : 'Date',
        field: 'date',
        colId: 'date',
        initialShowColumn: true,
        suppressMenu: true,
        floatingFilterComponent: 'dateFilterComponent',
        floatingFilterComponentParams: {
          opensProperty: 'left',
          dropsPropertyType: 'down',
          suppressAndOrCondition: true,
          suppressFilterButton: true,
          colId: 'date',
        }
      },
      {
        headerName: GlobalConstants.languageJson['Account number'] !== undefined
          ? `${GlobalConstants.languageJson['Account number']}`
          : 'Account number',
        field: 'accountNumber',
        colId: 'accountNumber',
        initialShowColumn: true,
        suppressMenu: true,
      },
      {
        headerName: GlobalConstants.languageJson['Transaction ID'] !== undefined
          ? `${GlobalConstants.languageJson['Transaction ID']}`
          : 'Transaction ID',
        field: 'transactionID',
        colId: 'transactionID',
        initialShowColumn: true,
        cellClass: 'dots-text py-4 d-inline',
        suppressMenu: true,
      },
      {
        headerName: GlobalConstants.languageJson['Transaction Type'] !== undefined
          ? `${GlobalConstants.languageJson['Transaction Type']}`
          : 'Transaction Type',
        field: 'transactionType',
        colId: 'transactionType',
        initialShowColumn: true,
        cellClass: 'rc-name-cell'
      },
      {
        headerName: GlobalConstants.languageJson['Transaction Amount Range'] !== undefined
          ? `${GlobalConstants.languageJson['Transaction Amount Range']}`
          : 'Transaction Amount Range',
        field: 'transactionAmountRange',
        colId: 'transactionAmountRange',
        initialShowColumn: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          applyButton: true,
          clearButton: true,
          debounceMs: 500,
          suppressAndOrCondition: true,
          suppressMiniFilter: true,
          filterOptions: ['inRange'],
          inRangeInclusive: true,
          inRangeStart: 1000,
          inRangeEnd: 5000
        }
      },
      {
        headerName: GlobalConstants.languageJson['Transaction Debit-Credit Indicator'] !== undefined
          ? `${GlobalConstants.languageJson['Transaction Debit-Credit Indicator']}`
          : 'Transaction Debit-Credit Indicator',
        field: 'transactionDebitCreditIndicator',
        colId: 'transactionDebitCreditIndicator',
        initialShowColumn: true,
        cellClass: 'rc-name-cell',
        customTemplateClass: 'priorityColumn_RC',
        floatingFilterComponent: 'singleSelectFilterComponent',
        floatingFilterComponentParams: {
          suppressFilterButton: false,
          colId: 'transactionDebitCreditIndicator',
          options: [{label: 'D', value: 'D'}, {label: 'C', value: 'C'} ]
        },
        suppressMenu: true,
      },
      {
        headerName: GlobalConstants.languageJson['Product Type'] !== undefined
          ? `${GlobalConstants.languageJson['Product Type']}`
          : 'Product Type',
        field: 'productID',
        colId: 'productID',
        initialShowColumn: true,
        cellClass: 'dots-text py-4 d-inline'
      },
      {
        headerName: GlobalConstants.languageJson['Counter Party Name'] !== undefined
          ? `${GlobalConstants.languageJson['Counter Party Name']}`
          : 'Counter Party Name',
        field: 'counterPartyName',
        colId: 'counterPartyName',
        initialShowColumn: true,
        cellClass: 'rc-name-cell',
        suppressMenu: true,
      },
      {
        headerName: GlobalConstants.languageJson['Counter Party Location'] !== undefined
          ? `${GlobalConstants.languageJson['Counter Party Location']}`
          : 'Counter Party Location',
        field: 'counterPartyLocation',
        colId: 'counterPartyLocation',
        initialShowColumn: true,
        cellClass: 'rc-name-cell',
        floatingFilterComponent: 'singleSelectFilterComponent',
        floatingFilterComponentParams: {
          suppressFilterButton: false,
          colId: 'counterPartyLocation',
          options: this.countries
        },
        suppressMenu: true,
      },
      {
        headerName: GlobalConstants.languageJson['Transaction Description'] !== undefined
          ? `${GlobalConstants.languageJson['Transaction Description']}`
          : 'Transaction Description',
        field: 'transaction_description',
        colId: 'transaction_description',
        initialShowColumn: true,
        cellClass: 'rc-name-cell',
        suppressAndOrCondition: true
      },
    ];

    const csvExportParam = {
      url: '',
      skipHeader: false,
      columnGroups: true,
      skipFooters: true,
      skipGroups: true,
      skipPinnedTop: true,
      skipPinnedBottom: true,
      allColumns: true,
      fileName: 'EventsLookup',
      sheetName: 1,
      columnSeparator: ',',
      columnKeys: [],
      showExportbutton: true,
      processCellCallback(params) {
        return params.value;
      },
      processHeaderCallback(params) {
        return params.column.getColDef().headerName.toUpperCase();
      }
    };

    this.eventLookupOptions = {
      resizable: true,
      tableName: 'Events Lookup view',
      columnDefs: columns,
      rowStyle: { 'border-bottom': '#424242 1px solid' },
      rowSelection: 'multiple',
      floatingFilter: true,
      animateRows: true,
      sortable: true,
      tabs: false,
      isShoHideColumns: true,
      multiSortKey: 'ctrl',
      componentType: 'case detail info',
      defaultGridName: 'related cases detail',
      changeBackground: '#ef5350',
      rowModelType: 'infinite',
      enableTableViews: true,
      paginationPageSize: 10,
      pagination: true,
      enableServerSideFilter: true,
      enableServerSideSorting: false,
      showBulkOperations: false,
      filter: true,
      suppressPaginationPanel: false,
      enableCheckBoxes: false,
      enableTopSection: true,
      rowHeight: 53,
      rowData: this.rowData,
      cellClass: 'ws-normal',
      applyColumnDefOrder: true,
      this: this,
      cacheBlockSize: 10,
      instance: this.caseService,
      method: 'getEventsLookupByCaseId',
      dataModifier: 'getEventsLookup',
      csvExportParams: csvExportParam,
      caseId: this.caseId,
      currentCaseName : this.caseName,
    };
    this.eventsLookupLoaded = true;
  }

  public getEventsLookup(currentInstance = this, response: any): Array<any> {
    if (response && response.result && response.result.length) {
      response.result = response.result.map(el => {
        return {
          associated_alerts: el.associated_alerts,
          associated_hits: el.associated_hits,
          ...el.transaction
        };
      });

      this.showEventsLookupOverlay = false;
      return response.result.map(rowData => {
        return {
          date: (rowData && rowData.transaction_date) ? rowData.transaction_date : '',
          accountNumber: (rowData && rowData.accountNumber) ? rowData.accountNumber : '',
          transactionID: (rowData && rowData.id) ? rowData.id : '',
          transactionType: (rowData && rowData.transaction_type) ? rowData.transaction_type : '',
          transactionAmountRange: (rowData && rowData.origination_transaction_amount) ? rowData.origination_transaction_amount : '',
          transactionDebitCreditIndicator: (rowData && rowData.debit_credit_indicator) ? rowData.debit_credit_indicator : '',
          productID: (rowData && rowData.product_reference) ? rowData.product_reference : '',
          counterPartyName: (rowData && rowData.counterparty_name) ? rowData.counterparty_name : '',
          counterPartyLocation: (rowData && rowData.counterparty_country) ? rowData.counterparty_country : '',
          transaction_description: (rowData && rowData.transaction_description) ? rowData.transaction_description : '',
        };
      });
    } else {
        // this.showEventsLookupOverlay = true;
    }
    return [];
  }

  private getJurisdictionList(): void {
    this.groupsService.getJurdictions({listType: 'Jurisdictions'}).then((resp: any[]) => {
      resp.map(el => {
        el.value = el.code;
        el.label = el.displayName;
        return el;
      });
      this.countries = resp;
      this.countries = this.countries.filter(el => {
        return el.displayName && el.displayName.toUpperCase() !== 'ALL';
      });
      this.configureEventsLookup();
    });
  }
}

export interface Country {
  allowDelete: boolean;
  code: string;
  colorCode: string;
  displayName: string;
  file_id: string;
  flagName: string;
  icon: string;
  listItemId: number;
  listType: string;
  selected: boolean;
}

