import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { Component, OnInit, ElementRef, Renderer2, AfterViewInit, HostListener, Inject } from '@angular/core';
import * as moment from 'moment';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { Router } from '@angular/router';
import { AgGridTableService } from '../../ag-grid-table.service';
import { WINDOW } from '../../../../../core/tokens/window';
import { GridApi, GridOptions, IFloatingFilterParams } from 'ag-grid-community';
import { IFloatingDateFilterParams } from './models/floating-date-filter-params.model';
import { CaseManagementService } from '@app/modules/case-management/case-management.service';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss']
})
export class DateFilterComponent implements OnInit, AfterViewInit {
  public gridApi: GridApi;
  public colId: string;
  public selected: { startDate: moment.Moment | string; endDate: moment.Moment | string };
  public gridOptions: GridOptions & {
    tableName: string;
    dateFilterProperties: {
      opensProperty: 'left' | 'center' | 'right';
      dropsProperty: 'up' | 'down';
      dropsPropertyType: 'up' | 'down';
    };
  };
  public rowData: any[];
  public isNotFutureOptions = true;
  public opensProperty: 'left' | 'center' | 'right' = 'left';
  public dropsProperty: 'up' | 'down';
  public ranges: any = {};
  public languageJson: any = {};

  private rowModelType: 'infinite' | 'clientSide';
  private datePickerOptions: 'futureDateOptions' | 'default' = 'default';
  private calenderOpened: boolean;
  private passedRanges = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  };
  private prevSelectedDate: { startDate: moment.Moment | string; endDate: moment.Moment | string } = null;
  private currentSelectedRange: IRangeClickedEvent;

  constructor(
    private readonly agGridTableService: AgGridTableService,
    private readonly commonServices: CommonServicesService,
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    private readonly router: Router,
    private readonly sharedService: SharedServicesService,
    @Inject(WINDOW) private readonly window: Window,
    private _caseService:CaseManagementService
  ) {}

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const element: HTMLElement = event.target as HTMLElement;
    if (!element.classList.contains('date-picker')) {
      document.querySelectorAll('.ag-header').forEach((header) => header.classList.remove('ag-header-hover'));
    }
  }

  public agInit(params: IFloatingDateFilterParams & IFloatingFilterParams<any, any>): void {
    this.gridApi = params.api;
    this.colId = params.colId;
    this.gridOptions = params.api['gridOptionsWrapper'].gridOptions;
    this.rowData = this.gridOptions.rowData || [];
    this.datePickerOptions = params.datePickerOptions || 'default';
    const opensProperty = this.gridOptions.dateFilterProperties && this.gridOptions.dateFilterProperties.opensProperty ? this.gridOptions.dateFilterProperties.opensProperty : 'left'
    const dropsProperty = this.gridOptions.dateFilterProperties && this.gridOptions.dateFilterProperties.dropsPropertyType ? this.gridOptions.dateFilterProperties.dropsPropertyType : 'up'
    this.rowModelType = params.api['gridOptionsWrapper'].gridOptions.rowModelType;
    this.opensProperty = opensProperty || 'left';
    this.dropsProperty = dropsProperty || 'up';
    if(this.gridOptions.tableName === 'Case list view'){
      this.onChangeWidget();
    }
    if (
      this.gridOptions.tableName === 'Case list view' &&
      this.colId &&
      this.agGridTableService.dateModelFilter &&
      Object.keys(this.agGridTableService.dateModelFilter).includes(this.colId) &&
      this.agGridTableService.dateModelFilter[this.colId].filter
    ) {
      const filterDate = this.agGridTableService.dateModelFilter[this.colId].filter.split('#');
      this.selected = { startDate: filterDate[0] ? moment(filterDate[0]) : null, endDate: filterDate[1] ? moment(filterDate[1]) : null };
      this.languageJson.separator = ' To ';
      this.languageJson.displayFormat = 'DD/MM/YYYY';
    } else {
      this.setTableData();
    }
  }

  public ngOnInit(): void {
    if (this.datePickerOptions === 'futureDateOptions') {
      this.isNotFutureOptions = false;
      this.ranges = {
        Today: [moment(), moment()],
        'Next 7 days': [moment().add(1, 'days').startOf('days'), moment().add(8, 'days')],
        'Next 30 days': [moment().add(1, 'days').startOf('days'), moment().add(31, 'days')],
        'Next Month': [moment().add(1, 'months').startOf('month'), moment().add(1, 'months').endOf('month')],
        'Next Quarter': [moment().add(1, 'quarters').startOf('quarter'), moment().add(1, 'quarters').endOf('quarter')],
        'Next Year': [moment().add(1, 'years').startOf('year'), moment().add(1, 'years').endOf('year')]
      };
    } else {
      this.isNotFutureOptions = true;
      this.ranges = this.passedRanges;
    }
    this.ranges = Object.keys(this.ranges).reduce(
      (obj, k) =>
        Object.assign(obj, {
          [GlobalConstants.languageJson && GlobalConstants.languageJson[k] ? GlobalConstants.languageJson[k] : k]: this.ranges[k]
        }),
      {}
    );
  }

  public ngAfterViewInit(): void {
    this.commonServices.getDataFromComponentBehaveObserver.subscribe((resp) => {
      if (resp && resp.rowData && resp.rowData.length) {
        this.gridOptions.rowData = resp.rowData;
        this.rowData = this.gridOptions.rowData;
      }
    });
    this.commonServices.behaveObserverForgetLanguageJson.subscribe((resp) => {
      if (resp || GlobalConstants.languageJson) {
        if (!resp) {
          resp = GlobalConstants.languageJson;
        }
        this.languageJson = resp;
        this.languageJson.format =
          GlobalConstants.globalDateFormat && GlobalConstants.globalDateFormat.ShortDateFormat ? 'MM.DD.YY' : 'MM.DD.YY';
        this.languageJson.direction = 'ltr';
        this.languageJson.weekLabel = 'W';
        this.languageJson.firstDay = 0;
        this.languageJson.separator = ' - ';
      }
    });
  }

  public addDateClassToTableHeader(): void {
    this.setCalenderPosition();
    const element: HTMLElement = this.elementRef.nativeElement.closest('.ag-header') as HTMLElement;
    if (!this.elementRef.nativeElement.closest('.ag-header-hover')) {
      this.renderer.addClass(element, 'ag-header-hover');
    }
  }

  public choseDate(event: { startDate: any; endDate: any }): void {
    this.hideCalenderFromViewOnCancel(event);
    const FormatDate = function (obj) {
      let month, day;
      const year = `${obj.getFullYear()}`;
      month = parseInt(obj.getMonth() + 1);
      if (month < 10) {
        month = `0${month}`;
      }
      day = obj.getDate();
      if (day < 10) {
        day = `0${day}`;
      }
      return `${year}-${month}-${day}`;
    };
    const allFilters = this.gridApi.getFilterModel();
    const prevFilters = Object.assign({}, allFilters);
    if (allFilters[this.colId] && this.selected && !this.prevSelectedDate) {
      const res: string[] = allFilters[this.colId].filter.split('#');
      this.selected.startDate = res[0] ? moment(res[0]).format('MM/DD/YYYY') : null;
      this.selected.endDate = res[1] ? moment(res[1]).format('MM/DD/YYYY') : null;
      this.prevSelectedDate = Object.assign({}, this.selected);
    }
    try {
      if (this.rowModelType === 'infinite') {
        if (this.colId === 'timestamp' && this.gridOptions.tableName === 'Attachment view') {
          allFilters[this.colId] = {
            filter: `${FormatDate(event.startDate._d)}#${FormatDate(event.endDate._d)}`,
            type: 'inRange',
            filterType: 'date'
          };
        } else {
          allFilters[this.colId] = {
            filter: `${FormatDate(event.startDate._d)}#${FormatDate(event.endDate._d)}`,
            type: 'between date',
            filterType: 'date'
          };
        }
        this.gridApi.setFilterModel(allFilters);
      }

      if (this.rowModelType === 'clientSide' && this.selected && this.selected.endDate !== null && this.selected.startDate !== null) {
        allFilters[this.colId] = {
          filter: `${FormatDate(event.startDate._d)}#${FormatDate(event.endDate._d)}`,
          type: 'between date',
          filterType: 'date'
        };
        if (Object.keys(this.agGridTableService.dateModelFilter).includes(this.colId)) {
          delete this.agGridTableService.dateModelFilter[this.colId];
          this.agGridTableService.dateModelFilter[this.colId] = allFilters[this.colId];
        } else {
          this.agGridTableService.dateModelFilter[this.colId] = allFilters[this.colId];
        }
      }

      if (
        this.rowModelType === 'clientSide' &&
        Object.keys(this.agGridTableService.dateModelFilter).includes(this.colId) &&
        this.calenderOpened
      ) {
        if (
          this.selected &&
          this.selected.endDate === null &&
          this.selected.startDate === null &&
          this.agGridTableService.dateModelFilter[this.colId]
        ) {
          delete this.agGridTableService.dateModelFilter[this.colId];
          this.calenderOpened = false;
          this.setClearTableData();
        }
      }

      this.prevSelectedDate = Object.assign({}, this.selected);
    } catch (e) {
      if (
        this.rowModelType === 'infinite' &&
        this.prevSelectedDate &&
        JSON.stringify(this.prevSelectedDate) !== JSON.stringify(this.selected)
      ) {
        delete allFilters[this.colId];
        this.prevSelectedDate = null;
      }
      if (
        this.router &&
        this.router.routerState &&
        this.router.routerState.snapshot &&
        this.router.routerState.snapshot.url.split('/')[5] !== 'assigned-users'
      ) {
        if (JSON.stringify(allFilters) !== JSON.stringify(prevFilters)) {
          this.gridApi.setFilterModel(allFilters);
        }
      }
    }
  }

  public onKey(event: KeyboardEvent): void {
    const element: HTMLInputElement = event.target as HTMLInputElement;
    if (element.value === '') {
      this.selected = null;
    }
  }

  public rangeClicked(event: IRangeClickedEvent): void {
    this.currentSelectedRange = event;
  }

  public onRemoveFilter(): void {
    this.selected = null;
    this.sharedService.resetFilters(this.gridApi, this.colId);
  }

  private getDataForGivenDate<T>(data: T[], from: string, to: string, testKey: string = ''): T[] {
    let result = [];
    const key: string = testKey || this.colId;
    if (data.length && (from || to)) {
      const fromDate = new Date(from).getTime();
      const toDate = new Date(to).getTime();
      data.filter((value) => {
        const date: Date | string = value[key] === null ? '' : value[key];
        const objDate = moment(date).format('MM/DD/YYYY');
        const objDateFormat = new Date(objDate).getTime();
        if (objDateFormat >= fromDate && objDateFormat <= toDate) {
          result.push(value);
        }
      });
    } else if (data.length && (!from || !to)) {
      result = data;
    }
    return result;
  }

  private setTableData(): void {
    const allFilters = this.gridApi.getFilterModel();
    let currentDateData: any[];
    Object.keys(this.passedRanges).filter((key: string) => {
      if (this.currentSelectedRange && this.currentSelectedRange.label && this.currentSelectedRange.label === key) {
        currentDateData = this.passedRanges[key];
      }
    });
    if (allFilters && allFilters[this.colId] && allFilters[this.colId].filter) {
      this.selected = {
        startDate: currentDateData && currentDateData[0] ? currentDateData[0] : '',
        endDate: currentDateData && currentDateData[1] ? currentDateData[1] : ''
      };
    }
  }

  private setClearTableData(): void {
    const allFilters = this.gridApi.getFilterModel();
    const dateModelFilter = this.agGridTableService.dateModelFilter;
    let filterDate: any;
    let tableData = [];
    if (dateModelFilter && Object.keys(dateModelFilter).length) {
      const colIdKey = Object.keys(dateModelFilter).find((x) => x !== this.colId);
      if (colIdKey) {
        filterDate = dateModelFilter[colIdKey].filter;
      }
      const dateArray: string[] = filterDate.split('#');
      const dateFrom = dateArray && dateArray[0] ? dateArray[0] : '';
      const dateTo = dateArray && dateArray[1] ? dateArray[1] : '';
      tableData = this.getDataForGivenDate(this.rowData, dateFrom, dateTo, colIdKey);
    } else {
      tableData = this.getDataForGivenDate(this.rowData, '', '');
    }
    this.gridApi.setRowData(tableData);
    this.gridApi.setFilterModel(allFilters);
  }

  private hideCalenderFromViewOnCancel(event: { startDate: any; endDate: any }): void {
    this.setCalenderPosition();
    let allRangeElements: HTMLCollectionOf<HTMLLIElement>;
    if (document.getElementsByClassName('ranges')[0] && document.getElementsByClassName('ranges')[0].getElementsByTagName('li')) {
      allRangeElements = document.getElementsByClassName('ranges')[0].getElementsByTagName('li');
    }
    if (allRangeElements) {
      const customRangeElem = allRangeElements[allRangeElements.length - 1];
      if (customRangeElem) {
        customRangeElem.addEventListener('click', () => {
          if (document.body.classList.contains('remove-calendar')) {
            this.renderer.removeClass(document.body, 'remove-calendar');
          }
        });
      }
    }

    if (this.datePickerOptions === 'futureDateOptions' && event && !event.startDate && !event.endDate) {
      this.renderer.addClass(document.body, 'remove-calendar');
    } else {
      this.renderer.removeClass(document.body, 'remove-calendar');
    }
  }

  private setCalenderPosition(): void {
    let wrapper: HTMLElement;
    setTimeout(() => {
      if (document.getElementById('DateFilterCalendar')) {
        wrapper = document.getElementById('DateFilterCalendar');
      }
      if (wrapper) {
        const element: Element = wrapper.getElementsByClassName('md-drppicker')[0];
        if (element) {
          const elementBoundingClientRect = element.getBoundingClientRect();
          if (elementBoundingClientRect && this.window && document) {
            if (
              !(
                elementBoundingClientRect.top &&
                elementBoundingClientRect.top >= 0 &&
                elementBoundingClientRect.left &&
                elementBoundingClientRect.left >= 0 &&
                elementBoundingClientRect.bottom &&
                elementBoundingClientRect.bottom <= (this.window.innerHeight || document.documentElement.clientHeight) &&
                elementBoundingClientRect.right &&
                elementBoundingClientRect.right <= (this.window.innerWidth || document.documentElement.clientWidth)
              )
            ) {
              if (elementBoundingClientRect.left && Math.sign(elementBoundingClientRect.left) === -1) {
                element.classList.add('date-picker-move-right');
              } else {
                if (element.classList.contains('date-picker-move-right')) {
                  element.classList.remove('date-picker-move-right');
                }
              }
            }
          }
        }
      }
    }, 100);
  }

  onChangeWidget():void{
    this._caseService.observableWidgetVissibleChange.subscribe((isShowWidget:boolean) => {
      this.dropsProperty = isShowWidget ? 'up' : 'down';
    })
  }

  getDropsFuntions():string{
    return this.dropsProperty;
  }
}

interface IRangeClickedEvent {
  label: string;
  dates: [any, any];
}
