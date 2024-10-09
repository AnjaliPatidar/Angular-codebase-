import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {GridOptions} from 'ag-grid-community';
import {fromEvent, Subject} from 'rxjs';
import {map, switchMap, takeUntil } from 'rxjs/operators'
import {AgGridTableService} from './ag-grid-table.service';
import {CommonServicesService} from '@app/common-modules/services/common-services.service';
import {AgGridNg2} from 'ag-grid-angular';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import {SliderFilterComponent} from './custom-filters/slider-filter/slider-filter.component';
import {SingleSelectFilterComponent} from './custom-filters/single-select-filter/single-select-filter.component';
import {DateFilterComponent} from './custom-filters/date-filter/date-filter.component';
import {MultiSelectFilterComponent} from './custom-filters/multi-select-filter/multi-select-filter.component';
import {SharedServicesService} from '../../../shared-services/shared-services.service';
import {
  MultiSelectRendererComponentComponent
} from './custom-table-renderer/multi-select-renderer-component/multi-select-renderer-component.component';
import {
  SingleSelectRendererComponentComponent
} from './custom-table-renderer/single-select-renderer-component/single-select-renderer-component.component';
import {AlertManagementService} from '@app/modules/alert-management/alert-management.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {InputTextRendererComponent} from './custom-table-renderer/input-text-renderer/input-text-renderer.component';
import {IndicatorFilterComponent} from './custom-filters/indicator-filter/indicator-filter.component';
import {AutoCompleteComponent} from './custom-filters/auto-complete/auto-complete.component';
import {
  UserActionsComponent
} from '@app/modules/user-management/components/manage/users/actions/user-actions/user-actions.component';
import {UserConstant} from '@app/modules/user-management/constants/ag-grid/user-table.constants';
import {ActivatedRoute, Router} from '@angular/router';
import {CaseBatchFileComponent} from './modals/case-batch-file/case-batch-file.component';
import {ReviewerComponent} from './custom-table-renderer/reviewer/reviewer.component';
import {DateRendererComponent} from './custom-table-renderer/date-renderer/date-renderer.component';
import {GlobalConstants} from '@app/common-modules/constants/global.constants';
import {
  CreateCaseManagementComponent
} from '../ag-grid-table/modals/create-case-management/create-case-management.component';
import * as d3 from 'd3';
import {convertArrayToCSV} from 'convert-array-to-csv';
import {
  UserCreateComponent
} from '@app/modules/user-management/components/manage/users/modals/user-create/user-create.component';
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import {CaseManagementService} from '@app/modules/case-management/case-management.service';
import {PersonAlertCardComponent} from '@app/modules/entity/modals/person-alert-card/person-alert-card.component';
import {TextSelectFilterComponent} from './custom-filters/text-select-filter/text-select-filter.component';
import {UserSharedDataService} from '../../../shared-services/data/user-shared-data.service';
import {GridMetaData} from '../../../shared/model/gridMetaData.model';
import {GeneralSettingsApiService} from '@app/modules/systemsetting/services/generalsettings.api.service';
import {TagManagementApiService} from '@app/modules/systemsetting/services/tag-management.api.service';
import {AppConstants} from '@app/app.constant';
import * as XLSX from "xlsx";
import {SearchReleatedEntityComponent} from './modals/search-related-entity/search-related-entity';
import {TextFilterComponent} from './custom-filters/text-filter/text-filter.component';
import {RelatedCasesConstants} from '@app/common-modules/constants/related-cases.constants';
import {AgGridEvent, BodyScrollEvent} from 'ag-grid-community/dist/lib/events';
import {
  CaseDetailInfoService
} from "@app/common-modules/modules/ag-grid-table/modals/case-detail-info/case-detail-info.service";
import {TranslateService} from '@ngx-translate/core';
import {PlatformLocation} from '@angular/common';
import { FormControl } from '@angular/forms';
import { find } from 'lodash-es';
import {LazyLoadLibraryService} from "@app/common-modules/services/lazy-load-library.service";
import { GridActionsIcons } from '@app/common-modules/models/grid-actions-icons.model';
import { User } from '../../../shared/user/user.model';
import { WINDOW } from '../../../core/tokens/window';

declare var $: any;
var finalColumns = [];

@Component({
  selector: 'app-ag-grid-table',
  templateUrl: './ag-grid-table.component.html',
  styleUrls: ['./ag-grid-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AgGridTableComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @ViewChild("agGrid", { static: true }) agGrid: AgGridNg2;
  @ViewChild("changeLevelConfirmModal", { static: true }) changeLevelConfirmModal;
  @ViewChild("downloadModal", { static: true }) downloadModal;
  @Output('onSeletionDocument') onSeletionDocument?: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() updateClientSideRowModelTable: EventEmitter<any> = new EventEmitter<any>();
  @Output() cellMouseOver: EventEmitter<any> = new EventEmitter<any>();
  @Input() disabledAssignToMe: boolean;
  isRelatedCaseEntityAddHidden: boolean = true;
  @Input() set tableData(data: any) {
    if (data) {
      this._commonService.behaveObserverForgetLanguageJson.subscribe((resp) => {
        if ((resp && Object.keys(resp).length > 0) || (GlobalConstants.languageJson && Object.keys(GlobalConstants.languageJson).length > 0)) {
          if (!resp) {
            resp = GlobalConstants.languageJson;
          }
          this.languageJson = resp;
          this.languageJson['to'] = "-"
          this.localeText = this.languageJson;
          if (data && data.columnDefs) {
            data.columnDefs.forEach(element => {
              this.originalHeaders[(this.languageJson && this.languageJson[element['headerName']]) ? this.languageJson[element['headerName']] : element['headerName']] = element['headerName'];
            });
          }
          this.getTableDataFromService(data).then(() => {
          }).catch((err) => {
          });
        }
      });

    }
  }
  @Input() set fromComponent(comsponentName: string) {
    if (comsponentName) {
      if (comsponentName == 'caseWorkbench') {
        const permissions: any[] = this._sharedService.getPermissions();
        if (permissions.length) {
          this._agGridTableService.behaviorSubjectForAllPermisonIds.next(permissions[1].caseManagement.caseWorkbench);
          this._agGridTableService.behaviorSubjectForAllPermisonIds$.subscribe((ids: Array<any>) => {
            if (!ids.includes('other')){
              this.caseWorkBenchPermissionJSON = ids
            }
          })
        }
      } else if (comsponentName == 'domainSearch') {
        this.setFiltersFromSourceMangeDomainSearchChart();
      } else {
        this.getAlertListPermssionIds(comsponentName).then((res: Array<any>) => {
          res = (res || []);
          if(!(res.includes('other'))) {
            res.push('other')
          }

          this._agGridTableService.behaviorSubjectForAllPermisonIds.next(res);
          this._agGridTableService.behaviorSubjectForAllPermisonIds$.subscribe(ids => {
            if (ids.includes('other')){
              ids.pop();
            }
            this.permissionIdsList = ids;

          })
          this._alertService.getAllEntityAlertIndicators("Alert Risk");
          this.setFiltersFromAlertAgingChart();
        })
      }
    }
  };

  @Input() public set assigneeListSetter(assigneeListInput: User[]) {
    if (!assigneeListInput) {
      return;
    }
    if (this.originalGirdTableName === "Case list view") {
      this.assigneeList = assigneeListInput.map((assignee) => {
        return {
          ...assignee,
          name: assignee.screenName ? assignee.screenName : '',
          userId: assignee.userId.toString() ? assignee.userId.toString() : ''
        }
      })
    }

    if (this.originalGirdTableName == "Alert list view") {
      this.assigneeList = assigneeListInput.map((assignee) => {
        return {
          ...assignee,
          name: assignee.screenName ? assignee.screenName : ''
        }
      })

      this._alertService.assigneList = this.assigneeList;
      this.disabledAssignToMe = this.assigneeList.length > 0 ? false : true;
    }

    let existValueUnAssigned = this.assigneeList.every(function (e) {
      return e.label == "unassigned";
    });

    if (!existValueUnAssigned) {
      this.assigneeList.unshift(
        {
          "userId": "unassigned",
          "emailAddress": "",
          "firstName": "",
          "lastName": "",
          "middleName": null,
          "screenName": "unassigned",
          "countryId": {},
          "statusId": {
            "listItemId": 0,
            "code": "Active",
            "displayName": "Active",
            "icon": "check-circle",
            "allowDelete": false,
            "listType": "User Status",
            "colorCode": "#3eb6ff",
            "flagName": null
          },
          "userImage": null,
          "jobTitle": null,
          "extension": null,
          "phoneNumber": null,
          "department": null,
          "source": null,
          "usersRoles": [],
          "usersGroups": [],
          "isModifiable": false,
          "label": "unassigned",
          "name": "unassigned"
        }
      );
    }
  }

  @Output() onCompleteIntialize = new EventEmitter();
  @Output() personSelectionEventDispatcher: EventEmitter<number> = new EventEmitter();
  @Output() onGridReadyEvent: EventEmitter<AgGridEvent> = new EventEmitter<AgGridEvent>();
  @Input() personScreeningNotifier: Subject<boolean>;
  @Input('attachmentsCount') attachmentsCount!: number;

  public gridOptions: GridOptions;
  public getRowHeight: any;
  public agGridLoader: boolean = true;
  public frameworkComponents: any;
  public defaultColDef: any;
  public rowSelection: any;
  public multiSortKey: any;
  public sortingOrder: any;
  public sideBar: any;
  public editType;
  public rowModelType: any;
  currentUrl = '';
  currentState: any;
  currentStates: any;
  tabsFlag: boolean = false;
  isEdit: boolean = false;
  tabsDataFromComponent: any;
  originalGirdTableName: string = '';
  originaViewName: string = 'Original View';
  savedGridViewName: any;
  listOfSavedGridViews: any = [];
  originalViewData: any = [];
  selectedViewName: string = '';
  columnsStatesData: any = {};
  showHideColumns: any = [];
  isRowSelectable: any;
  addNewView: any = {
    isDefaultView: false,
    changedFilterCount: 0,
    chnagedColumnsCount: 0
  };
  originalHeaders = {};
  popoverData: any = {};
  defaultFilteredData: any = {};
  defaultSortingData: any = [];
  listForDropDown: any = [];
  selectedItems = [];
  dropdownSettings = {};
  indexForDeSelectItem: any;
  showAddFeedButton: boolean = false;
  showTagAddButton: boolean = false;
  userManageButton: boolean = false;
  firstColoumnColId: any;
  getColorValueFromColorComponent: any;
  getMultiSelectOptionsFromComponent: any;
  renderActualRowData: boolean = false;
  rowValues = [];
  showHideViews: boolean = false;
  showHideColumnHeaders: boolean = false;
  enableDisableFilters: boolean = false;
  enableGridTopSection: boolean = false;
  hideGridTopViewDropdownSection: boolean = false;
  hideGridTopRowsperpage: boolean = false;
  pagenationlist: any = ["10", "20", "50", "100", "200"];
  recordsInPage: any;
  pageNumberForAlert: number = 0;
  showBulkOperations: boolean = false;
  selectedRowCount: number = 0;
  globalRowIndex: any;
  showFeedSlider: boolean = true;
  enableAllFeeds: boolean = false;
  assigneeList: Array<any> = [];
  showAddSource: boolean = false;
  listForBulkSlider = [];
  displaySearch: boolean = false;
  itemNumber = 0;
  selectedRowsForBulk: any;
  keyword = 'name';
  languageJson: any;
  promisObj: any;
  fromAdvSearch = false;
  entityCompanyName: any;
  tableName: any;
  defaultView: any;
  gridToggle = true;
  originalViewHiddenColumns = [];
  caseNameForService = '';
  caseName: any;
  public documentDownloaded: boolean = false;
  private pdfData: any;
  private pdfNameOfFileToDownload: any;
  private pdfColumns: any;
  private pdfRows: any;

  private unsubscribe$: Subject<any> = new Subject<any>();
  private gridApi: any;
  private gridColumnApi: any;
  private optionsFromComponent: any;
  originalView: any = {
    originalColumnDefs: [],
    originalRowData: []
  }
  storeAllRowSelected: any = [];
  currentUserDetails: any;
  paginationSize: number;
  localeText = {
    to: "-",
  }

  effectedAlerts;
  info: string;
  private permissionIdsList: Array<any> = [];
  private caseWorkBenchPermissionJSON: Array<any> = [];
  cacheBlockSize: any;
  @Input() gridShow: boolean = true;
  noRowsTemplate: string;

  callFirstTime: boolean = true;
  isPrevFilterEmply = true;
  requestsToIgnore: boolean = false;
  prevFilterModel = null;

  statusUpdateValidations = GlobalConstants.alertStatusValidation;
  aggrid_table_utilty = {
    type_of_alert: 'Alerts',
    WillEffectAlert: 'WillEffectAlert',
    WillnotEffectAlert: 'WillNotEffectAlert',
    screeningSelected: []
  }
  totalresults: number = 0;
  isFilterBarOpen: boolean = true;
  datasource: { getRows: (givenParams: any) => void; };
  apiData: any;
  showAuditPanel: boolean
  recordsPerPage = 15
  isScrolled:boolean
  documentTotalCount:number
  tableTopPossition = 300
  tableChangeEvent;
  viewDropDownControl = new FormControl();
  selectedTableView: any = '';
  isOpenCreateNewEditor:boolean
  newViewName:string
  isViewUpdate:boolean
  updateInputModal:string
  downloadModalRef: MatDialogRef<any>;
  Object = Object;
  isLatestUi:boolean;
  tableIconsStatus:GridActionsIcons;
  isCaseGrid:boolean;
  isCaseContactView:boolean;
  isShowWidget:boolean;

  fabActionMenuActive: boolean = false;

  constructor(private _agGridTableService: AgGridTableService,
    private _commonService: CommonServicesService,
    private _sharedService: SharedServicesService,
    private _alertService: AlertManagementService,
    public config: NgbDropdownConfig,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private userSharedDataService: UserSharedDataService,
    public dialog: MatDialog,
    public _caseService: CaseManagementService,
    public generalSettingsApiService: GeneralSettingsApiService,
    private caseDetailInfoService: CaseDetailInfoService,
    private tagService: TagManagementApiService,
    private translateService: TranslateService,
    private platformLocation: PlatformLocation,
    private lazyLoadScript: LazyLoadLibraryService,
    @Inject(WINDOW) private readonly window: Window
  ) {
    config.placement = 'bottom-left';
    config.autoClose = false;
  }


  ngOnInit() {
    this._caseService.isLoggedInUserAssignedObserver.subscribe(resp => {
      this.isRelatedCaseEntityAddHidden = resp;
    })
    this.activatedRoute.params.subscribe(params => {
      if (params && params['id']) {
        this.getCaseName(params['id']).then(res => {
          this.caseName = res;
        })
      }
    })
    if (this.activatedRoute && this.activatedRoute['_routerState'] && this.activatedRoute['_routerState'].snapshot.url) {
      this.currentUrl = this.activatedRoute['_routerState'].snapshot.url
      this.currentState = this.currentUrl.split('/');
    }
    this.getcurrentLoggedUser();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: this.getLanguageKey('SelectAll') ? this.getLanguageKey('SelectAll') : 'Select All',
      unSelectAllText: this.getLanguageKey('UnSelectAll') ? this.getLanguageKey('UnSelectAll') : 'Un SelectAll',
      allowSearchFilter: true,
      searchPlaceholderText: this.getLanguageKey('Search') ? this.getLanguageKey('Search') : 'Search',
    };
    this.checkForAdvSearch();
    if (this.personScreeningNotifier) {
      this.personScreeningNotifier.subscribe(x => {
        this.activatePersonScreening();
      });
    }

    this._caseService.updateCaseRelatedEntityTableDataObserver.subscribe((res) => {
      res && this.refreshTable();
    })
    this._caseService.tableData.subscribe((res) => {
      res && this.refreshTable();
    })
    this._caseService.attachementTableData.subscribe((res) => {
      res && this.refreshTable();
    })
    this.isAuditShow()
    // On event where a row needs to be selected/ deselected dynamically
    this._agGridTableService.rowNodeManualSelectionSubject.subscribe(({rowNodeId, status, tableName}) => {
      if (!tableName || (tableName === this.tableName)) {
        // if the row is currently displayed get from current rows or else find it from selected nodes when setting status = false
        const rowNode = this.gridApi.getRowNode(rowNodeId) || (!status && find(this.gridApi.getSelectedNodes(), {id: rowNodeId}));
        if (rowNode) {
          rowNode.setSelected(status);
        }
      }
    });

    this._agGridTableService.updateFilterSub.pipe(takeUntil(this.unsubscribe$)).subscribe((updateData) => {
      let filterModel: any = {};

      if (!updateData.override) {
        filterModel = this.gridApi.getFilterModel();
      }
      filterModel = { ...filterModel, ...updateData.filterModel };
      this.gridApi.setFilterModel(filterModel);
    });
  }

  ngOnChanges() {
    this._caseService.releatedEntityTableObserver.subscribe(res => {
      if (res) {
        this._caseService.updateCaseRelatedEntityTableData.next(true);
        this.refreshTable();
      }
    })
  }

  getcurrentLoggedUser() {
    this.userSharedDataService.getCurrentUserDetails()
      .subscribe(response => {
        if (response) {
          this.currentUserDetails = response;
        }
      });
  }

  checkForAdvSearch() {
    this.entityCompanyName = localStorage.getItem('case_mgt_entity_name');
    if (this.entityCompanyName != null && this.entityCompanyName != "") {
      this.fromAdvSearch = true;
      this.openCreateCaseModal('fromAdvSearch');
    } else {
      this.fromAdvSearch = false;
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit() {
    this.promisObj = new Promise((resolve, reject) => {
      this._commonService.behaveObserverForgetLanguageJson.subscribe((resp) => {
        if (resp && this.Object.keys(resp).length > 0) {
          this.languageJson = resp;
          this.languageJson['to'] = "-"
          this.localeText = this.languageJson;
          resolve(this.languageJson);
          this._commonService.getDataFromComponentBehaveObserver.subscribe((resp) => {
            if (resp) {
              this.getTableDataFromService(resp).then(() => {
                this._agGridTableService.getObserver.subscribe((resp: any) => {
                  if (resp && this.gridOptions) {
                    this.gridOptions['listForBulkSlider'] = resp;
                  }
                })

                this._agGridTableService.getObserverForGetColor.pipe(takeUntil(this.unsubscribe$)).subscribe(resp => {
                  this.getColorValueFromColorComponent = resp ? resp : '';
                },
                  (err) => {

                  });

                this._agGridTableService.getObserverForGetMultiSelectOptions.pipe(takeUntil(this.unsubscribe$)).subscribe(resp => {
                  this.getMultiSelectOptionsFromComponent = resp ? resp : '';
                },
                  (err) => {

                  });

                let addingFilterEnterEvent = (event: any) => {
                  if (event.keyCode === 13) {
                    this.showBulkOperations = false;
                    this.selectedRowCount = 0;
                    document.getElementById("applyButton").click();
                  }
                }

                let filterEnterEvent = function (event: any) {
                  let element: any = document.getElementById("filterText");
                  if (event.keyCode === 13) {
                    this.showBulkOperations = false;
                    this.selectedRowCount = 0;
                    document.getElementById("applyButton").click();
                  }
                  if (element.value.length > 0) {
                    setTimeout(() => {
                      try {
                        this.showBulkOperations = false;
                        this.selectedRowCount = 0;
                        document.getElementById("filterConditionText").removeEventListener('keyup', addingFilterEnterEvent);
                        document.getElementById("filterConditionText").addEventListener('keyup', addingFilterEnterEvent);
                      }
                      catch {
                      }
                    }, 2000)
                  }
                }
                setTimeout(() => {
                  let filters: any = document.getElementsByClassName("ag-floating-filter-button");
                  let i = 0;
                  for (i = 0; i < filters.length; i++) {
                    filters[i].addEventListener('click', function () {
                      setTimeout(function () {
                        try {
                          let textFilter = document.getElementById("filterText");
                          const element: any = textFilter;
                          element.removeEventListener('keyup', filterEnterEvent)
                          element.addEventListener('keyup', filterEnterEvent)
                        }
                        catch { }
                      }, 2000)
                    })
                  }
                }, 3000)
              })
            }
          })
        }
      });
    });
  }

  updateNode(node) {
    this.gridApi.redrawRows({ rowNodes: [node] });
  }

  onGridReady(params) {
    this.onGridReadyEvent.next(params);
    this._alertService.sendGridReadyApiParams(params.api);
    this._caseService.casAPInBehavior.next(this.gridApi)
    this._caseService.currentPage = 0;
    this.getAllSavedListViews(params.api.gridOptionsWrapper.gridOptions.tableName, true);
    this.tableName = params.api.gridOptionsWrapper.gridOptions.tableName;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.setCurrenttableStatus(this.tableName);
    if(this.tableName === 'Case list view'){
      this.onChangeWidget();
    }
    this._commonService.updateRow.subscribe(
      (node) => {
        if (node) {
          this.updateNode(node);
        }
      }, (err) => { });

    if (this.gridOptions && this.gridOptions.rowData) {
      this.gridApi.setRowData(this.gridOptions.rowData);
    }
    var datasource = {
      getRows: (givenParams: any) => {
        if (this.requestsToIgnore || this.callFirstTime) {
          this.requestsToIgnore = false;
          givenParams.failCallback();

          if (this.tableName == 'Users') {

            let LocalgridOptions: any = params.api.gridOptionsWrapper.gridOptions;
            let recordsPerPage = this.paginationSize;
            let filterModel = []
            let page: number;
            page = Math.ceil(givenParams.endRow / recordsPerPage);
            let requestParams = {};
            var newFilterModel = this.formatFilters(givenParams.filterModel);

            requestParams = {
              filterModel: filterModel,
              orderIn: givenParams && givenParams.sortModel[0] && givenParams.sortModel[0].sort,
              orderBy: givenParams && givenParams.sortModel[0] && givenParams.sortModel[0].colId,
              pageNumber: 1,
              recordsPerPage: 10,
              isAllRequired:false
            };

            LocalgridOptions.instance[LocalgridOptions.method](
              requestParams,
              JSON.stringify(newFilterModel)
            ).subscribe((data: any) => {
              params.rowData = LocalgridOptions.this[LocalgridOptions.dataModifier](
                LocalgridOptions.this,
                data,
                params
              );

              this.totalresults = data && data.paginationInformation && data.paginationInformation.totalResults ? data.paginationInformation.totalResults : 0;
            if (document.getElementById("sub-panel-export")) {
              if (data.paginationInformation.totalResults == 0) {
                document.getElementById("sub-panel-export").style.display =
                  "none";
              } else {
                document.getElementById("sub-panel-export").style.display =
                  "block";
              }
            }
            if (
              data &&
              data.result &&
              Array.isArray(data.result) &&
              data.result.length > 0
            ) {
              params.api.gridOptionsWrapper.gridOptions;
              if (this.tableName != "Case related entity") {
                this.gridApi.setRowData(params.rowData);
                this.gridApi.gridOptionsWrapper.gridOptions["totalresults"] =
                  data.paginationInformation.totalResults - 1;
              }

              givenParams.successCallback(params.rowData, data.paginationInformation.totalResults);

              this.pageNumberForAlert = data.paginationInformation.totalResults;
              this.onCompleteIntialize.emit(true);
            }
            if (
              data &&
              data.result &&
              Array.isArray(data.result) &&
              data.result.length == 0
            ) {
              params.api.showNoRowsOverlay();
              givenParams.successCallback(
                [],
                data.paginationInformation.totalResults
              );
            }

            this._alertService.sendGridDataReadyApiParams(params.api);
            });
          }
        }
        else {
          if(this.isCaseContactView){
            this.listForDropDown = this.listForDropDown.filter(column => column && column.item_text && column.item_text !== "Contact ID");
          }
          if (JSON.stringify(givenParams.filterModel) != JSON.stringify({})) {
            this.isPrevFilterEmply = false;
          }
          this.prevFilterModel = givenParams.filterModel;
          let body = document.getElementsByTagName("body")[0];
          body.click();
          params.api.showLoadingOverlay();
          this.onCompleteIntialize.emit(false);
          if (!this.paginationSize) {
            this.paginationSize = this.gridOptions.paginationPageSize;
          }
          this.selectedRowCount = 0;
          let keys = Object.keys(givenParams.filterModel);
          let values = Object.values(givenParams.filterModel);
          var newFilterModel = this.formatFilters(givenParams.filterModel);
          let LocalgridOptions: any = params.api.gridOptionsWrapper.gridOptions;
          this.isCaseGrid = LocalgridOptions.isCaseGrid;
          this.isLatestUi = LocalgridOptions.isLatestUi;
          this.tableIconsStatus = {
              isFilterEnable : LocalgridOptions.isFilterEnable,
              isExportEnable : LocalgridOptions.isExportEnable,
              isRefreshEnable : LocalgridOptions.isRefreshEnable,
              isMoreEnable : LocalgridOptions.isMoreEnable
            }
          let requestParams = {};
          let recordsPerPage = this.paginationSize;
          let page: number;
          let filterModel = []
          page = Math.ceil(givenParams.endRow / recordsPerPage);
          this.documentTotalCount = this.gridOptions.paginationPageSize
          if (
            givenParams.sortModel &&
            givenParams.sortModel.length &&
            givenParams.sortModel[0] &&
            givenParams.sortModel[0].sort
          ) {
            this._alertService.setOrderIn = givenParams.sortModel[0].sort;
            this._alertService.setOrderBy = givenParams.sortModel[0].colId;
            requestParams = {
              pageNumber: page,
              recordsPerPage: this.paginationSize,
              orderIn: givenParams.sortModel[0].sort,
              orderBy: givenParams.sortModel[0].colId,
              isAllRequired: false,
              filterModel: JSON.stringify(newFilterModel),
            };
          } else {
            this._alertService.setOrderIn = "";
            this._alertService.setOrderBy = "";
            requestParams = {
              pageNumber: page,
              recordsPerPage: recordsPerPage,
              isAllRequired: false,
              filterModel: JSON.stringify(newFilterModel),
            };
          }
          if (this.tableName == "Tags List") {
            requestParams = {
              entity_type: this._agGridTableService.tagEntity,
              page: page,
              count: recordsPerPage,
              order_in: givenParams && givenParams.sortModel[0] && givenParams.sortModel[0].sort,
              order_by: givenParams && givenParams.sortModel[0] && givenParams.sortModel[0].colId,
              only_tags: false,
              tag_entities: true,
              filter_model: JSON.stringify(newFilterModel),
            };
          }
          if (this.tableName == "Attachment view") {
            if (givenParams && givenParams.filterModel) {
              Object.keys(givenParams.filterModel).forEach((key) => {
                filterModel.push({
                  name: key,
                  filterType: (givenParams.filterModel && givenParams.filterModel[key]) ? givenParams.filterModel[key].filterType : '',
                  type: (givenParams.filterModel && givenParams.filterModel[key] && givenParams.filterModel[key].type) ? givenParams.filterModel[key].type : '',
                  filter: givenParams.filterModel && givenParams.filterModel[key] ? givenParams.filterModel[key].filter : ''
                });
              });
            }
            requestParams = {
              count: recordsPerPage,
              filterModel: filterModel,
              order_in: givenParams && givenParams.sortModel[0] && givenParams.sortModel[0].sort,
              order_by: givenParams && givenParams.sortModel[0] && givenParams.sortModel[0].colId,
              page: page,
              references: [
                {
                  referenceId: LocalgridOptions.caseId.toString(),
                  referenceType: 'case'
                }
              ]
            };
          }
          if (this.tableName == "Doucment repository") {
            if (givenParams && givenParams.filterModel) {
              Object.keys(givenParams.filterModel).forEach((key) => {
                filterModel.push({
                  name: key,
                  filterType: (givenParams.filterModel && givenParams.filterModel[key]) ? givenParams.filterModel[key].filterType : '',
                  type: (givenParams.filterModel && givenParams.filterModel[key] && givenParams.filterModel[key].type) ? givenParams.filterModel[key].type : '',
                  filter: givenParams.filterModel && givenParams.filterModel[key] ? givenParams.filterModel[key].filter : ''
                });
              });
            }
            requestParams = {
              page:page,
              count: this.recordsPerPage,
              filterModel:filterModel,
              order_in: givenParams && givenParams.sortModel[0] && givenParams.sortModel[0].sort,
              order_by: givenParams && givenParams.sortModel[0] && givenParams.sortModel[0].colId,
            }
          }

          if (this.tableName == "Case related entity") {
            requestParams = {
              pageNumber: page,
              recordsPerPage: recordsPerPage,
              isAllRequired: false,
              filterModel: JSON.stringify(newFilterModel),
              caseId: LocalgridOptions.caseId,
              alertType: LocalgridOptions.alertType,
            };
          }

          if (this.tableName == "Related Cases view") {
            requestParams = {
              entity_type: this._agGridTableService.tagEntity,
              page: page,
              count: recordsPerPage,
              order_in: givenParams && givenParams.sortModel[0] && givenParams.sortModel[0].sort,
              order_by: givenParams && givenParams.sortModel[0] && givenParams.sortModel[0].colId,
              only_tags: false,
              tag_entities: true,
              filter_model: JSON.stringify(newFilterModel),
              caseId: LocalgridOptions.caseId
            };
            this.apiData = { requestParams: requestParams, filterModel: JSON.stringify(newFilterModel) };
          }

          if (this.tableName == "Events Lookup view") {
            requestParams = {
              entity_type: this._agGridTableService.tagEntity,
              page: page,
              count: recordsPerPage,
              order_in: givenParams && givenParams.sortModel[0] && givenParams.sortModel[0].sort,
              order_by: givenParams && givenParams.sortModel[0] && givenParams.sortModel[0].colId,
              only_tags: false,
              tag_entities: true,
              filter_model: JSON.stringify(newFilterModel),
              caseId: LocalgridOptions.caseId
            };
            this.apiData = { requestParams: requestParams, filterModel: JSON.stringify(newFilterModel) };
          }

          if (this.isCaseContactView) {
            requestParams = {
              filter_model: givenParams && givenParams.filterModel ? JSON.stringify(this.formatFilters(givenParams.filterModel)) : {},
              order_in: givenParams && givenParams.sortModel[0] && givenParams.sortModel[0].sort,
              order_by: givenParams && givenParams.sortModel[0] && givenParams.sortModel[0].colId,
              case_id: LocalgridOptions.caseId,
              pagination_information : {
                page : page,
                page_size : recordsPerPage
              }
            };
          }

          if (this.tableName == "Associated Record view") {
            requestParams = {
              pageNumber: page,
              recordsPerPage: recordsPerPage,
              isAllRequired: false,
              filterModel: JSON.stringify(newFilterModel),
              alerts: LocalgridOptions.alerts
            };
          }

          LocalgridOptions.instance[LocalgridOptions.method](
            requestParams,
            JSON.stringify(newFilterModel)
          ).subscribe((data: any) => {
            if (this.tableName == "Tags List") {
              data = {
                "result": data.result,
                "paginationInformation": {
                  'totalResults': data.paginationInformation.total_result
                }
              }
            }
            else if (this.tableName == "Case list view") {
              data = {
                "result": data.results,
                "paginationInformation": {
                  'totalResults': data.pagination_information.total_result
                }
              }
            }
            else if (this.tableName == "Case related entity") {
              this.apiData = { requestParams: requestParams, filterModel: JSON.stringify(newFilterModel) };

              data = {
                "result": data.results,
                "paginationInformation": {
                  'pageNumber': (data.pagination_information.page) ? data.pagination_information.page : data && data.results ? data.results.length : 1,
                  'recordsPerPage': (data.pagination_information.page_size) ? data.pagination_information.page_size : 10,
                  'totalResults': (data && data.pagination_information && data.pagination_information.total_result) ? data.pagination_information.total_result : 0
                }
              }
            }
            else if (this.tableName == "Related Cases view") {
              data = {
                "result": data.results,
                "paginationInformation": {
                  'totalResults': (data && data.pagination_information && data.pagination_information.total_result) ? data.pagination_information.total_result : 0,
                  'page_size': (data && data.pagination_information && data.pagination_information.page_size) ? data.pagination_information.page_size : 10,
                  'page': (data && data.pagination_information && data.pagination_information.page) ? data.pagination_information.page : 1
                }
              }
            }
            else if (this.tableName == "Events Lookup view") {
              if (!data) {
                data = {
                  results: []
                };
              }
              const pagingButtons = document.getElementsByClassName('ag-paging-button');
              for (let i = 0; i < pagingButtons.length; i++) {
                if ((pagingButtons[i].innerHTML.toLowerCase() === 'first') || (pagingButtons[i].innerHTML.toLowerCase() === 'last')) {
                  // @ts-ignore
                  pagingButtons[i].style.display = 'none';
                }
              }

              this.attachmentsCount = data.total_records_count;
              data = {
                result: data.results,
                paginationInformation: {
                  totalResults: data.total_records_count,
                  page_size: (data && data.pagination_information && data.pagination_information.page_size) ? data.pagination_information.page_size : 10,
                  page: (data && data.pagination_information && data.pagination_information.page) ? data.pagination_information.page : 1
                }
              }
            }
            else if (this.tableName == "Associated Record view") {
              data = {
                "result": data.results,
                "paginationInformation": {
                  'totalResults': data && data.pagination_information && data.pagination_information.total_result ? data.pagination_information.total_result : data && data.results ? data.results.length : 0,
                  'page_size': data && data.pagination_information && data.pagination_information.page_size ? data.pagination_information.page_size : 10,
                  'page': data && data.pagination_information && data.pagination_information.page ? data.pagination_information.page : 1
                }
              }

              let customAlerts = [];
              if(LocalgridOptions && LocalgridOptions.alerts){
                for(let i=0; i<LocalgridOptions.alerts.length; i++){
                  customAlerts.push( {
                    alert_type: LocalgridOptions.alerts[i].type,
                    alert_id: LocalgridOptions.alerts[i].alert_id,
                    entity_id: LocalgridOptions.alerts[i].entityId,
                    entity_name: LocalgridOptions.alerts[i].entityName,
                    entity_url: LocalgridOptions.alerts[i].entityUrl,
                  })
                }
              }

              let exportParams =  {
                filter_model: JSON.stringify(newFilterModel),
                pagination_information: data.paginationInformation,
                order_in: givenParams && givenParams.sortModel[0] && givenParams.sortModel[0].sort,
                order_by: givenParams && givenParams.sortModel[0] && givenParams.sortModel[0].colId,
                columns: [],
                alert: customAlerts.length > 0 ? customAlerts : []
              }
              this.apiData = { requestParams: exportParams, filterModel: JSON.stringify(newFilterModel) };
            }
            else if (this.tableName == "Attachment view") {
              data = {
                "result": data[0].documents,
                "paginationInformation": {
                  'totalResults': data && data[0].paginationInformation && data[0].paginationInformation.total_result ? data[0].paginationInformation.total_result : data[0] && data[0].documents ? data[0].documents.length : 0,
                  'page_size': data && data[0].paginationInformation && data[0].paginationInformation.page_size ? data[0].paginationInformation.page_size : 10,
                  'page': data && data[0].paginationInformation && data[0].paginationInformation.page ? data[0].paginationInformation.page : 1
                }
              }
              this.isScrolled = true;
            }
            else if (this.tableName == "Doucment repository") {
              data = {
                "result": data && data.results && data.results.data? data.results.data : [],
                "tags" : data && data.tags ? data.tags : [],
                "paginationInformation": {
                  'totalResults': data && data.results && data.results.paginationInformation && data.results.paginationInformation.totalResult ? data.results.paginationInformation.totalResult : data && data.data ? data.data.length : 0,
                  'page_size': data && data.results.paginationInformation && data.results.paginationInformation.count ? data.results.paginationInformation.count : 10,
                  'page': data && data.results.paginationInformation && data.results.paginationInformation.page ? data.results.paginationInformation.page : 1
                },
              }
              this.isScrolled = true;
            }else if(this.isCaseContactView){
              data = {
                "result": data &&  data.results? data.results : [],
                "paginationInformation": {
                  'totalResults': data && data.pagination_information && data.pagination_information.total_result ? data.pagination_information.total_result : 0,
                  'page_size': data && data.pagination_information && data.pagination_information.page_size && data.pagination_information.total_result ? data.pagination_information.page_size : 0,
                  'page': data && data.pagination_information && data.pagination_information.page && data.pagination_information.total_result ? data.pagination_information.page : 0
                }
              }


            let colIds = this.getColumnsForExport()
            let exportParams =  {
              filter_model: JSON.stringify(newFilterModel),
              pagination_information: data.paginationInformation,
              order_in: givenParams && givenParams.sortModel[0] && givenParams.sortModel[0].sort,
              order_by: givenParams && givenParams.sortModel[0] && givenParams.sortModel[0].colId,
              columns: colIds,
              is_export: true,
              language: this.getLanguageName(),
              file_name: this.getLocalizationFileName(),
              case_id: LocalgridOptions.caseId,
            }
            this.apiData = { requestParams: exportParams, filterModel: JSON.stringify(newFilterModel) };
            }
            params.api.hideOverlay();
            if(this.tableName == "Doucment repository"){
              params.rowData = LocalgridOptions.this[LocalgridOptions.dataModifier](
                this.gridApi,
                data,
                params
              );
            }else{
              params.rowData = LocalgridOptions.this[LocalgridOptions.dataModifier](
                LocalgridOptions.this,
                data,
                params
              );
            }

            this.totalresults = data && data.paginationInformation && data.paginationInformation.totalResults ? data.paginationInformation.totalResults : 0;
            if (document.getElementById("sub-panel-export")) {
              if (data.paginationInformation.totalResults == 0) {
                document.getElementById("sub-panel-export").style.display =
                  "none";
              } else {
                document.getElementById("sub-panel-export").style.display =
                  "block";
              }
            }
            if (
              data &&
              data.result &&
              Array.isArray(data.result) &&
              data.result.length > 0
            ) {
              params.api.gridOptionsWrapper.gridOptions;
              if (this.tableName != "Case related entity") {
                this.gridApi.setRowData(params.rowData);
                this.gridApi.gridOptionsWrapper.gridOptions["totalresults"] =
                  data.paginationInformation.totalResults - 1;
              }

              givenParams.successCallback(params.rowData, data.paginationInformation.totalResults);

              this.pageNumberForAlert = data.paginationInformation.totalResults;
              this.onCompleteIntialize.emit(true);
            }
            if (
              data &&
              data.result &&
              Array.isArray(data.result) &&
              data.result.length == 0
            ) {
              params.api.showNoRowsOverlay();
              givenParams.successCallback(
                [],
                data.paginationInformation.totalResults
              );
            }

            this._alertService.sendGridDataReadyApiParams(params.api);
          });
        }

        if (this.callFirstTime && (this.originalGirdTableName == 'Associated Record view' || this.tableName == 'Attachment view' || this.tableName == 'Case related entity' || this.tableName == 'Case list view' || this.tableName == 'Related Cases view' ||  this.tableName == 'Events Lookup view' || this.tableName == 'Associated Record view' || this.isCaseContactView)) {
          this.hideFloatingFilters();
        }

        if (this.callFirstTime && (this.tableName == 'Related Cases view')) {
          this.gridApi.sizeColumnsToFit();
        }
        this.callFirstTime = false;

      },
    };

    this.datasource = datasource;

    let hasDefaultView = false;
    let isOrginalViewChecked = false;
    if (Array.isArray(this.listOfSavedGridViews)) {
      this.listOfSavedGridViews.forEach((view) => {
        if (view.isDefaultView && view.isDefaultChecked) {
          hasDefaultView = true;
        }
      });

      if (hasDefaultView) {
        this.listOfSavedGridViews.forEach((item) => {
          if (item.isDefaultView && item.viewMetaData && item.viewName !== this.getLanguageKey('OriginalView')) {
            this.selectedViewName = item.viewName ? item.viewName : '';
            var updatedColumnDefs = item.viewMetaData.columnDefs;
            this.originalView.originalColumnDefs.map((val, key) => {
              updatedColumnDefs.map((v, k) => {
                if (val && v && val.colId == v.colId && val.hasOwnProperty('cellRendererFramework') && !v.hasOwnProperty('cellRendererFramework')) {
                  v['cellRendererFramework'] = val.cellRendererFramework ? val.cellRendererFramework : '';
                }
              });
            });
            this.reCreateTable(updatedColumnDefs, item.viewMetaData.filterData, item.viewMetaData.sortingData);
            this.selectedItems = this.getSelectedItems(updatedColumnDefs);
            finalColumns = $.extend(true, [], updatedColumnDefs);
            this.columnSizesFitToTable(updatedColumnDefs);
          }
        })
      }
      else {
        this.listOfSavedGridViews.forEach((item) => {
          if (item.isDefaultOriginalView && item.viewName === this.getLanguageKey('OriginalView')) {
            if (this.gridApi) {
              this.gridApi.setSortModel(this.defaultSortingData.length ? this.defaultSortingData : null);
              this.gridApi.setFilterModel(this.defaultFilteredData ? this.defaultFilteredData : null);
            }
            this.gridOptions.columnDefs.forEach(element => {
              element['OrginalHeaderName'] = element['headerName'];
              element['headerName'] = this.languageJson[element['headerName']] ? this.languageJson[element['headerName']] : element['headerName'];
            });
            this.gridApi.setColumnDefs(this.gridOptions.columnDefs);
            this.columnSizesFitToTable(this.gridOptions.columnDefs);
          }
        });
      }
    }


    if (params.api.gridOptionsWrapper.gridOptions.tableName == "Users") {
      this.gridApi.setFilterModel(UserConstant.filterData ? UserConstant.filterData : []);
      UserConstant.filterData = [];
      if (UserConstant['autocompleteFilter']) {
        delete UserConstant['autocompleteFilter']
      }
      if (this.router.routerState.snapshot.url.split("/")[5] == "assigned-users") {
      }
    }
    if (params.api.gridOptionsWrapper.gridOptions.tableName == "Tags List") {
      this.noRowsTemplate = '<span class="tag-no-data">No data. Click "+" button to add data</span>'
      var Params = {
        entity_type: this._agGridTableService.tagEntity,
        only_tags: true,
        filter_model: '{}',
      }

      this.generalSettingsApiService.getTagList(Params).subscribe(res => {
        if (res && res.result) {
          this.generalSettingsApiService.behaviorSubjectForAllTagList.next(res.result)
        }
      })
    }

    params.api.setDatasource(datasource);
    this.gridApi.gridOptionsWrapper.gridOptions['dataSource'] = datasource;
    this._agGridTableService.getObserverForUpdatedData.subscribe((resp) => {
      if(resp && resp['formCaseBulk']){
        this._caseService.getCurrentSelectRowCount.next({
          tableName : this.originalGirdTableName,
          selectedCount: null
        })
        this.refreshTable();
        return 1;
      }
      if (resp && resp["gridDataMapID"] && resp["targetUpdates"]) {

        let gridDataMapID = resp["gridDataMapID"];
        let targetUpdates = resp["targetUpdates"];
        var itemsToUpdate = [];
        this.gridApi.forEachNode(function (rowNode, index) {

          var data = rowNode.data;
          if (data[gridDataMapID] == resp[gridDataMapID]) {
            for (let index = 0; index < targetUpdates.length; index++) {
              const updateKey = targetUpdates[index];
              if (data.hasOwnProperty(updateKey) && resp.hasOwnProperty(updateKey)) {
                data[updateKey] = resp[updateKey];
              }
            }
            itemsToUpdate.push(data);
          }
          rowNode.setSelected(false);
        });
        if (itemsToUpdate.length > 0) {
          var res = this.gridApi.updateRowData({ update: itemsToUpdate });
        }
      }
    });

    this._caseService.emitHeaderSelectionObserver.subscribe((isChecked:boolean) => {
      this.gridApi.forEachNode((rowNode) => {
        rowNode.setSelected(isChecked);
      })
    })
  }

  //@reason : set the Zip file name as case name
  // @author : Janaka Sampath
  // @date : 14 July 2022
  getCaseName(id: string): Promise<any> {
    return this._caseService.getCaseById(id).toPromise();
  }

  /**On table row click
   * Author : karnakar
   * Date : 27-june-2019
  */
  public newEvnt: any;
  onRowClicked(e) {
    if (e) {
      setTimeout(() => {
        var gridOptions = (e.api && e.api.gridOptionsWrapper && e.api.gridOptionsWrapper.gridOptions) ? e.api.gridOptionsWrapper.gridOptions : {};
        var parent_element = e.event.target.parentElement ? e.event.target.parentElement : '';
        var classList = parent_element.className['baseVal'] ? parent_element.className['baseVal'].split(" ") : '';
        var className = !classList ? parent_element.className.split(' ')[0] : '';
        var rowIndex = e.rowIndex;

        if (classList || className) {
          if ((classList && classList.includes("fa-history")) || (className == "clockIcon")) {
            this._sharedService.shareRowDAta(e);
          }
          if (classList && classList.includes("fa-comments")) {
            let comentData = {
              commentData: e,
              classList: classList
            }
            this._commonService.getCommentRowData(comentData);
          }

          if (classList.indexOf("fa-trash") != -1 || className == 'deleteIcon') {
            var currentRowData = e.data;
            currentRowData['typeOfEvent'] = 'delete'
            currentRowData['instance'] = this.gridApi
            currentRowData['method'] = 'updateRowData'
            currentRowData['filters'] = JSON.stringify(this.gridApi.getFilterModel())
            currentRowData['params'] = { remove: [e.data] };
            if (currentRowData.avoidSecondApiCall) {
              delete currentRowData.avoidSecondApiCall;
            }
            this._commonService.getRowData(currentRowData);
          } else {
            var currentRowData = e.data;
            currentRowData['typeOfEvent'] = 'update'
          }
        }
      }, 0);
    }
  }

  /**On table row selected
   * Author : ASHEN
   * Date : 29-MARCH-2021
  */
  onRowSelected(e) {
    switch (this.originalGirdTableName) {
      case "domain search view":
        this.domainSearchSelectRows(e);
        break;

      default:
        break;
    }
  }

  domainSearchSelectRows(e) {
    let selectdata = e.api.getSelectedRows();
    let data = {
      data: selectdata,
      originalGirdTableName: this.originalGirdTableName
    }
    this._agGridTableService.getComponentDataOnRowSelected(data);
  }

  /**On Selecting Particular Row in Alert table
   * Author : Amritesh
   * Date : 4-nov-2019
  */
  onSelectionChanged(event) {
    this.tableChangeEvent = event;
    var feedList = [];
    var rowCount = event.api.getSelectedNodes().length;
    this._caseService.getCurrentSelectRowCount.next({
      tableName: this.originalGirdTableName,
      selectedCount: rowCount
    })
    this.storeAllRowSelected = event.api.getSelectedNodes();
    if (this.originalGirdTableName == "Alert list view" || this.originalGirdTableName == "Case list view" || this.originalGirdTableName == "Case detail view") {
      if (this.originalGirdTableName === "Case list view") {
        this.aggrid_table_utilty.type_of_alert = 'Cases';
        this.aggrid_table_utilty.WillEffectAlert = 'WillEffectCase';
        this.aggrid_table_utilty.WillnotEffectAlert = 'WillNotEffectCase';
      } else {
        this.aggrid_table_utilty.type_of_alert = 'Alerts';
      }

      if (event.firstFeedListApiCall) {
        delete event.firstFeedListApiCall;
      }
      this.storeAllRowSelected.map((val) => {
        if (this.gridOptions['listForBulkSlider'] && this.gridOptions['listForBulkSlider'].length) {
          this.gridOptions['listForBulkSlider'].map((v) => {
            if (val && val.data && val.data.feedForBulk && v && v.feedName && val.data.feedForBulk.indexOf(v.feedName) != -1) {
              feedList.push(v);
            }
          });
          let removeDupes = (values) => values.filter((v, i) => values.indexOf(v) === i)
          feedList = removeDupes(feedList);

          this.listForBulkSlider = feedList;
          event['selectedRowFeedsForAssignee'] = this.listForBulkSlider;
          event['thisTableGridApi'] = this.gridApi;
          event['thisTableRef'] = this;
        }
      });
      if (feedList.length == 1) {
        event['firstFeedListApiCall'] = true;
        this._agGridTableService.getComponentDataForSelectedROws(event);
      }
      this.selectedRowCount = rowCount;
      this.selectedRowsForBulk = event;
      this.showBulkOperations = true;
      if (this.selectedRowCount == 0) {
        this.showBulkOperations = false;
      }
      $(".ag-paging-panel").css("top", this.showBulkOperations ? "-140px" : "-56px")
      if (this.originalGirdTableName == "Case detail view") {
        if (this.selectedRowCount > 1) {
          this.showBulkOperations = true;
        } else {
          this.showBulkOperations = false;
        }
      }
    } else if (this.originalGirdTableName == 'Users' && this.router.routerState.snapshot.url.split("/")[5] == "assigned-users") {
      let userId = [];
      this.storeAllRowSelected.forEach(ele => {
        userId.push(ele.data.completeResponse.userId)
      });
      UserConstant.userId = userId;
    } else if (this.originalGirdTableName == "Person Screening Candidate") {
      this.aggrid_table_utilty.screeningSelected = this.storeAllRowSelected.map((val) => val.data)
      this.personSelectionEventDispatcher.emit(this.aggrid_table_utilty.screeningSelected.length);
    } else if (this.originalGirdTableName == "Doucment repository") {
      this.onSeletionDocument.emit(event.api.getSelectedNodes())
    }
  }

  onPaginationChanged() {
    const el = (document.querySelector('.caseList-table .pagination-dropdown.case-pagination') as HTMLElement);
    if (el) el.style.cssText = `right: ${(document.querySelector('.case-grid-table .ag-paging-panel.ag-unselectable') as HTMLElement).offsetWidth+208}px!important`
  }

  onColumnVisible(e) {
  }

  /**get current page data from ag-grid table
   * Author : sarmilan (AP-2061)
   * Date : 21-Jul-2021
  */
  getGridTableData($event) {
    if (this.gridApi && (this.originalGirdTableName == "Alert list view" || this.originalGirdTableName == "Users")) {
      this._caseService.currentPage = this.gridApi.paginationGetCurrentPage();
      const pagenumber = this.gridApi.paginationGetCurrentPage() + 1;
      const pageSize = this.gridOptions.paginationPageSize;

      this._alertService.sendCurrentTablePageCount(pagenumber);
      this._alertService.sendCurrentTableRowsCount(pageSize);

      const firstDisplayRow = this.gridApi.getFirstDisplayedRow();
      const lastDisplayRow = firstDisplayRow + pageSize;
      this._alertService.nextPrevTableData = [];

      for (let i = firstDisplayRow; i < lastDisplayRow; i++) {
        const node = this.gridApi.getDisplayedRowAtIndex(i);
        if (node && node.data) {
          this._alertService.setTableData = node.data;
        }
      }
    }
    if (this.gridApi && (this.originalGirdTableName == "Attachment view" || this.originalGirdTableName == "Related Cases view" || this.originalGirdTableName == "Events Lookup view" || this.originalGirdTableName == "Case related entity" || this.originalGirdTableName == "Associated Record view")) {
      this._caseService.currentPage = this.gridApi.paginationGetCurrentPage() === undefined ? this._caseService.currentPage : this.gridApi.paginationGetCurrentPage();
    }
    this.onPaginationChanged()
  }

  /**On cell Clickes
   * Author : karnakar
   * Date : 27-Aug-2019
  */
  onCellClicked(e) {
    if (e.column.colId.toLowerCase() == "entityname") {
      this._agGridTableService.getComponentDataOnRowClick(e);
      this.router.navigate(['element/alert-management/alertView'])
    }
    if (e.column.colDef.field.toLowerCase() == "name") {
      const caseName = (e.data && e.data.name) ? e.data.name : '';
      const caseId = (e.data && e.data.id) ? e.data.id : ''
      localStorage.setItem("caseNameForBulkDownload", caseName);
      localStorage.setItem("caseIdForBulkDownload", caseId);
      this.caseNameForService = caseName;

      let caseDetails = this.caseWorkBenchPermissionJSON ? this.caseWorkBenchPermissionJSON.filter((val) => val['caseDetails']):null;
      var caseDetailsObject = caseDetails && caseDetails.length > 0 && caseDetails[0] && caseDetails[0].caseDetails ? caseDetails[0] && caseDetails[0].caseDetails : {}
      if (caseDetailsObject) {
        var domain = localStorage.getItem('domain') ? localStorage.getItem('domain').split(' ').join('-').toLocaleLowerCase() : '';
        var domainValue = localStorage.getItem('domain') && caseDetailsObject[domain] ? caseDetailsObject[domain] : '';
      }
      var permissions = GlobalConstants.getPermissionsByRole.filter((val) => val.permissionId.permissionId == domainValue).sort((e) => e.permissionLevel);
      if (permissions.length > 0 && permissions[0].permissionLevel > 0) {
        if (GlobalConstants.systemSettings.openInNewtab) {
          const href = AppConstants.Ehub_UI_API + 'element-new/dist/new/#/element/case-management/case/' + caseId;
          this.window.open(href, '_blank', 'noopener');
        }
        else {
          this.router.navigate(['element/case-management/case', caseId]);
        }
      }
    }
    var columns = ["news", "financecrime", "rca", "pep", "sanctions", "sip", "ame"]
    if (columns.indexOf(e.column.colDef.field.toLowerCase()) != -1) {
      if (e.data[e.column.colDef.field]) {
        let dialogReference = this.dialog.open(PersonAlertCardComponent, {
          autoFocus: false,
          disableClose: false,
          panelClass: ['user-popover', 'person-alert-modal', 'custom-scroll-wrapper', 'bg-screening', 'light-theme', 'mnw-1200'],
          backdropClass: 'modal-background-blur',
          data: {
            rowData: e ? e : ''
          }
        });
      }
    }
    if (e.column.colId.toLowerCase() == "edit" && e.data.visibilityValue) {
      this._commonService.clickedEdit.next(e);
    }
    if (e.column.colId.toLowerCase() == "visible") {
      this._commonService.clickedVisible.next(e);
    }
  }

  /** bulk download option in case details info view
   *  Author : kamila
   *  Date : 09-December-2020
   */
  bulkDownload() {
    this.caseNameForService = localStorage.getItem("caseNameForBulkDownload");
    const caseId = parseInt(localStorage.getItem("caseIdForBulkDownload"));
    const getFile = this.gridApi.getSelectedRows();
    const urlPathParts = this.router.url.split('/');
    const zipName = `${this.caseNameForService}.zip`;
    const selectedRowPathNamesArray = getFile.map((filePath) => filePath.Path)
    const params = {
      document_paths: selectedRowPathNamesArray,
      zipfile_name: zipName,
    };

    this._caseService.showDocDownloadLoader.next(true);
    let fileType = '.zip';
    this._commonService.getDownloadDocumentpresignedUrl(params).then((response: any) => {
      this._caseService.showDocDownloadLoader.next(false);
      if (response && response.presigned_url && response.status !== "error") {
        this._commonService.downloadFromPresigned(response.presigned_url, zipName);
        this._sharedService.showFlashMessage('Successfully downloaded document with file name: ' + this.changeToCapital(this.caseNameForService) + zipName, 'success');
        this.deselect();
      }else {
        this._caseService.showDocDownloadLoader.next(false);
        this._sharedService.showFlashMessage('Failed to download document with file name: ' + this.changeToCapital(this.caseNameForService) + zipName, 'danger');
      }
    });
  }

  deselect() {
    this.gridApi.deselectAll();
  }

  changeToCapital(text) {
    if (text && text.length && text != null) {
      let val = text.toLowerCase();
      return val.charAt(0).toUpperCase() + val.substr(1);
    } else {
      return '';
    }
  }

  check_colId_exists(columns, colId) {
    let returnValue = false;
    columns.forEach(element => {
      if (element.colId == colId) {
        returnValue = true;
        return;
      }
    });
    return returnValue;
  }
  onItemSelect(item: any, event) {
    let orderedColumns = this.gridApi.gridOptionsWrapper.columnApi.getColumnState()
    let columns = [];
    this.gridOptions.columnDefs.forEach((column, index) => {
      column['headerName'] = this.getLanguageKey(column['headerName']) ? this.getLanguageKey(column['headerName']) : column['headerName'];
      if (item.item_id == index) {
        column['initialShowColumn'] = true;
        column['hide'] = false;
        if (!this.check_colId_exists(orderedColumns, column['colId'])) {
          orderedColumns.push(column)
        }
      }
    })
    let colIds = [];
    orderedColumns.forEach(element => {
      colIds.push(element.colId)
    });

    this.showOnlyColumns(colIds, this.getDefaultMetaData());
  }
  OnItemDeSelect(item: any) {
    let orderedColumns = this.gridApi.gridOptionsWrapper.columnApi.getColumnState()
    let columns = [];
    let not_required_colids = [];
    this.gridOptions.columnDefs.forEach((column, index) => {
      column['headerName'] = this.getLanguageKey(column['headerName']) ? this.getLanguageKey(column['headerName']) : column['headerName'];
      if (item.item_id == index) {
        column['initialShowColumn'] = false;
        not_required_colids.push(column['colId']);
      }
    })
    let colIds = [];
    orderedColumns.forEach(element => {
      if (not_required_colids.indexOf(element['colId']) == -1) {
        colIds.push(element.colId)
      }
    });
    this.showOnlyColumns(colIds, this.getDefaultMetaData());
  }
  onSelectAll(items: any) {
    let orderedColumns = this.gridApi.gridOptionsWrapper.columnApi.getColumnState()
    let columns = [];
    this.gridOptions.columnDefs.forEach((column, index) => {
      column['headerName'] = this.getLanguageKey(column['headerName']) ? this.getLanguageKey(column['headerName']) : column['headerName'];
      column['initialShowColumn'] = true;
      column['hide'] = false;
      if (!this.check_colId_exists(orderedColumns, column['colId'])) {
        orderedColumns.push(column)
      }
    })
    let colIds = [];
    orderedColumns.forEach(element => {
      colIds.push(element.colId)
    });
    this.showOnlyColumns(colIds, this.getDefaultMetaData());
  }
  onDeSelectAll(items: any) {
    let columns = [];
    this.gridOptions.columnDefs.forEach((column, index) => {
      column['headerName'] = this.getLanguageKey(column['headerName']) ? this.getLanguageKey(column['headerName']) : column['headerName'];
      column['initialShowColumn'] = false;
    })
    this.gridApi.setColumnDefs(columns);
    this.columnSizesFitToTable(columns);
  }

  getDefaultMetaData() {
    let metaData = {}
    metaData['columns'] = []
    metaData['filters'] = this.gridApi.getFilterModel();
    metaData['sort'] = this.gridApi.getSortModel();
    this.gridOptions.columnDefs.forEach((column) => {
      if (column['initialShowColumn']) {
        metaData['columns'].push(column['colId']);
      }
    })
    return metaData;
  }

  getAllSavedListViews(tableName, renderDefaultView = false) {
    this._agGridTableService.getAllSavedListOfViewsDataAPI(tableName).subscribe(resp => {

      // commented because of https://blackswantechnologies.atlassian.net/browse/RD-17760
      // if(tableName === 'Attachment view') {
      //   let gridViewMetaData = JSON.parse(resp[0].gridViewMetaData);
      //   if(!gridViewMetaData.columns.includes('expiryDate')){
      //     gridViewMetaData.columns.push('expiryDate')
      //     gridViewMetaData.orderedColumns.push('expiryDate')
      //     gridViewMetaData.columnSizes.push({colKey: 'expiryDate', newWidth:160})

      //     resp[0].gridViewMetaData = JSON.stringify(gridViewMetaData)
      //     this._agGridTableService.saveOrUpdateGridTableAPI(resp[0]).subscribe(resp => {
      //       this.getAllSavedListViews(this.tableName, false)
      //     })
      //   }
      // }

      if (renderDefaultView) {
        this.selectedViewName = this.translateService.instant('Original View');
      }
       let hasOriginalView = false;

      resp.forEach((element) => {
        if (element.gridViewName === 'Original View') {
          hasOriginalView = true
        }
      });

      if(resp.length === 0 || !hasOriginalView) {
        this.newViewName = "Original View";
        const options = {
          isDefaultView: resp.length === 0,
          changedFilterCount: 0,
          chnagedColumnsCount: 0
        }
        this.saveOrUpdateGridView('save', options, false);
      }

    let defaultViews = [];
    resp.forEach((element) => {
      if (element["defaultView"]) {
        defaultViews.push(element);
      }
    });

      if (defaultViews.length > 0) {
        defaultViews.sort(function (a, b) {
          return (
            JSON.parse(a["gridViewMetaData"]["date"]) -
            JSON.parse(b["gridViewMetaData"]["date"])
          );
        });
        this.defaultView = defaultViews[0];
      }
      if (resp && Array.isArray(resp)) {
        resp.forEach((view) => {
          if (view && view.defaultView) {
           this.selectedViewName = view.gridViewName;
       }});
        this.listOfSavedGridViews = resp;
      }
      if (renderDefaultView) {
        this.showDefaultView();
      }
      if (resp && resp.length) {
        this.setColumnsWidthOnGridViewsLoad(resp);
      }
      this.getSelectedView();
      this.agGridLoader = false;
    })
  }

  setColumnsWidthOnGridViewsLoad(gridViews: any[]): void {
    const selectedViewMetaData: any[] = gridViews.filter(
      (entry: any) => entry.gridViewName === this.selectedViewName
    );
    selectedViewMetaData.forEach((element) => {
      if (element.gridViewMetaData) {
        const metaData: any = JSON.parse(element.gridViewMetaData);
        if (metaData.columnSizes && metaData.columnSizes.length) {
          const columnsWidth: any[] = metaData.columnSizes;
          if (columnsWidth && columnsWidth.length) {
            columnsWidth.forEach((entry) => {
              this.gridColumnApi.setColumnWidth(
                entry.colKey,
                entry.newWidth,
                true
              );
            });
          }
        }
      }
    });
  }

  showDefaultView() {
    if (this.defaultView && this.defaultView['gridViewId'] != 1) {
      let parsedData = JSON.parse(this.defaultView['gridViewMetaData']);
      let defaultViewColumns = parsedData['orderedColumns'] ? parsedData['orderedColumns'] : parsedData['columns'];
      if (defaultViewColumns === undefined) {
        let showOnly = [];
        if (this.gridOptions.columnDefs && this.gridOptions.columnDefs.length > 0) {
          this.gridOptions.columnDefs.forEach((column) => {
            if (this.originalViewHiddenColumns && this.originalViewHiddenColumns.indexOf(column['colId']) == -1) {
              showOnly.push(column['colId'])
            }
          })
        }
        this.showOnlyColumns(showOnly);
      } else {
        this.requestsToIgnore = true;
        this.showOnlyColumns(defaultViewColumns, parsedData);
      }
    }
    else {

      let showOnly = [];
      if (this.gridOptions.columnDefs && this.gridOptions.columnDefs.length > 0) {
        this.gridOptions.columnDefs.forEach((column) => {
          if (this.originalViewHiddenColumns && this.originalViewHiddenColumns.indexOf(column['colId']) == -1) {
            showOnly.push(column['colId'])
          }
        })
      }
      this.showOnlyColumns(showOnly);
    }
  }

  showOnlyColumns(colIds, parseviewData = null, isChangeView = false) {
    if (colIds && Array.isArray(colIds)) {
      let columns = [];
      this.gridOptions.columnDefs.forEach((column: any, index) => {
        column['headerName'] = this.getLanguageKey(column['headerName']) ? this.getLanguageKey(column['headerName']) : column['headerName'];
        if (colIds && colIds.indexOf(column.colId) != -1) {
          column['initialShowColumn'] = true;
          column['hide'] = false;
        }
        else {
          column['initialShowColumn'] = false;
        }
        if (column['initialShowColumn']) {
          columns.push(column)
        }
      })
      let ordered = [];
      colIds.forEach((id) => {
        columns.forEach((column) => {
          if (id == column['colId']) {
            ordered.push(column);
            return;
          }
        })
      })

      this.gridApi.setColumnDefs(ordered);
      this.columnSizesFitToTable(ordered);

      let viewFilters = parseviewData && parseviewData['filters'] ? parseviewData['filters'] : {};
      let viewSortDetails = parseviewData && parseviewData['sort'] ? parseviewData['sort'] : {};

      if ((!isChangeView && JSON.stringify(viewFilters) == JSON.stringify({})) ||
        (this.prevFilterModel != null && this.isPrevFilterEmply)) {
        this.requestsToIgnore = false;
      }
      this.applyViewFilters(viewFilters);
      this.applyViewSort(viewSortDetails);

      this.selectedColumns();
    }
  }

  /** View Filters assigning
   *  Author : ASHEN AP-1373
   *  Date : 11-NOV-2020
   */
  applyViewFilters(filters) {
    if (this.router && this.router.routerState && this.router.routerState.snapshot && this.router.routerState.snapshot.url.split("/")[5] !== "assigned-users") {
      this.gridApi.setFilterModel(filters);
    }
  }

  applyViewSort(sortDetails) {
    if (this.router && this.router.routerState && this.router.routerState.snapshot && this.router.routerState.snapshot.url.split("/")[5] !== "assigned-users") {
      this.gridApi.setSortModel(sortDetails);
    }
  }

  /** Formating filters
   *  Author : kamal
   *  Date : 29-Sep-2019
   */
  formatFilters(filterModel) {
    let keys = Object.keys(filterModel)
    let values: any = Object.values(filterModel)

    if (keys.length > 0) {
      this._alertService.nextPrevTableData = [];
    }

    let newFilterModel = {}
    for (let index = 0; index < keys.length; index++) {
      if (values[index]['type'] == 'between date') {
        values[index]['filterType'] = 'date';
      }
      if (values[index]['filterType'] == 'text' && values[index]['type'] != 'inRange' && !this.isCaseContactView) {
        values[index]['filter'] = values[index]['filter'];
      }
      if (Object.keys(values[index]).indexOf("condition1") == -1) {
        if (keys[index] == 'customerId' && this._alertService.isRelatedAlertClicked) {
          values[index]['type'] = 'equals'
          this._alertService.isRelatedAlertClicked = false
        }
        newFilterModel[keys[index]] = { 'condition1': values[index] }
      }
      else {
        newFilterModel[keys[index]] = values[index]
      }
      if (this.gridApi.gridOptionsWrapper.gridOptions.defaultGridName === "case View") {
        values[index]['filter_type'] = values[index]['filterType'];
        delete values[index]['filterType'];
        newFilterModel[keys[index]] = { 'condition1': values[index] }
      }
      if(this.tableName == "Doucment repository"){
        if(values[index]['filter'] && (values[index]['filterType'] == "text")){
          let filterString:any[] = values[index]['filter'] && values[index]['filter'].indexOf(',') > -1 ? values[index]['filter'].split(",") : values[index]['filter'];
          if(filterString && Array.isArray(filterString)){
            filterString = filterString.filter((id:string) => Number(id))
          }
          values[index]['filter'] = filterString
          values[index]['filterType'] = "equals"
          newFilterModel[keys[index]] = values[index];
        }
      }
    }
    this._alertService.setFilter = newFilterModel;
    this._alertService.clearTableData();
    return newFilterModel;
  }

  /** Getting selected columns
   *  Author : karnakar
   *  Date : 10-Aug-2019
   */
  getSelectedItems(columns) {
    var selectItemList = [];
    let activeHeaders = [];
    let orders = {}
    this.listForDropDown.forEach(element => {
      orders[element['item_colId']] = element['item_id'];
    });
    let originalHeaders = this.originalHeaders;
    let values = []
    Object.values(originalHeaders).forEach((key: string) => {
      if (key) {
        values.push(key.toLowerCase());
      }
    })
    let keys = Object.keys(originalHeaders);
    originalHeaders = {}
    for (var i = 0; i < keys.length; i++) {
      originalHeaders[keys[i]] = values[i];
    }
    if (columns) {
      columns.filter((v, k) => {
        if (v && v.initialShowColumn) {
          selectItemList.push(
            {
              item_id: orders[v.colId],
              item_text: originalHeaders[v.headerName],
              item_colId: v.colId,
              item_values: v
            }
          );
        }
      });
    }
    return selectItemList;
  }

  openAddUserModal(event) {
    let dialogRef = this.dialog.open(UserCreateComponent, {
      panelClass: ['user-popover', 'custom-scroll-wrapper'],
      backdropClass: 'modal-background-blur',
      data: { operation: "add", 'systemSettings': GlobalConstants.systemSettings }
    });
    event.stopPropagation();
  }

  /**Get the data from other component by subscribing service function
   * Author : karnakar
   * Date : 02-June-2019
   */
  getTableDataFromService(resp) {
    let promise = new Promise((resolve, reject) => {
      this.originalView = {};
      this.optionsFromComponent = resp;

      this.editType = "fullRow";
      this.showAddFeedButton = this.optionsFromComponent.addFeedButtonEnable ? this.optionsFromComponent.addFeedButtonEnable : false;
      this.userManageButton = this.optionsFromComponent.userManagementAddUser ? this.optionsFromComponent.userManagementAddUser : false;
      this.originalGirdTableName = this.optionsFromComponent.tableName ? this.optionsFromComponent.tableName : '';
      this.showTagAddButton = this.optionsFromComponent.showTagAddButton ? this.optionsFromComponent.showTagAddButton : false;;

      if (this.originalGirdTableName && (this.originalGirdTableName == 'Source list view' || this.originalGirdTableName == 'Source Management list view')) {
        this.agGridLoader = false;
      }


      this.defaultColDef = {
        'resizable': this.optionsFromComponent.resizable ? this.optionsFromComponent.resizable : false,
        'animateRows': this.optionsFromComponent.animateRows ? this.optionsFromComponent.animateRows : false,
        'filter': this.optionsFromComponent.filter ? this.optionsFromComponent.filter : false,
        'sortable': this.optionsFromComponent.sortable ? this.optionsFromComponent.sortable : false,
        'headerCheckboxSelection': this.optionsFromComponent.enableCheckBoxes ? isFirstColumn : '',
        'checkboxSelection': this.optionsFromComponent.enableCheckBoxes ? isFirstColumn : ''
      };

      if (this.optionsFromComponent && this.optionsFromComponent.rowModelType) {
        this.rowModelType = this.optionsFromComponent.rowModelType;
        if (this.optionsFromComponent.rowModelType == 'infinite') {
          this.enableDisableFilters = true;
        }
      }
      this.showHideViews = (this.optionsFromComponent && this.optionsFromComponent.enableTableViews) ? this.optionsFromComponent.enableTableViews : false;
      this.showHideColumnHeaders = (this.optionsFromComponent && this.optionsFromComponent.isShoHideColumns) ? this.optionsFromComponent.isShoHideColumns : false;
      this.rowSelection = this.optionsFromComponent.rowSelection ? this.optionsFromComponent.rowSelection : 'single';
      this.multiSortKey = this.optionsFromComponent.multiSortKey ? this.optionsFromComponent.multiSortKey : '';
      this.enableGridTopSection = this.optionsFromComponent.enableTopSection ? this.optionsFromComponent.enableTopSection : false;
      this.showBulkOperations = this.optionsFromComponent.showBulkOperations ? this.optionsFromComponent.showBulkOperations : false;
      this.hideGridTopViewDropdownSection = this.optionsFromComponent.hideGridTopViewDropdownSection ? this.optionsFromComponent.hideGridTopViewDropdownSection : false;
      this.hideGridTopRowsperpage = this.optionsFromComponent.hideGridTopRowsperpage ? this.optionsFromComponent.hideGridTopRowsperpage : false;

      this.frameworkComponents = {
        multiSelectRendererComponentComponent: MultiSelectRendererComponentComponent,
        reviewerComponent: ReviewerComponent,
        singleSelectRendererComponentComponent: SingleSelectRendererComponentComponent,
        inputTextRendererComponent: InputTextRendererComponent,
        sliderFilterComponent: SliderFilterComponent,
        singleSelectFilterComponent: SingleSelectFilterComponent,
        dateFilterComponent: DateFilterComponent,
        dateRendererComponent: DateRendererComponent,
        multiSelectFilterComponent: MultiSelectFilterComponent,
        indicatorFilterComponent: IndicatorFilterComponent,
        autoCompleteComponent: AutoCompleteComponent,
        userActionsComponent: UserActionsComponent,
        textSelectFilter: TextSelectFilterComponent,
        textFilter: TextFilterComponent
      };
      this.sideBar = { toolPanels: ["columns"] };
      if (this.optionsFromComponent) {
        if (this.optionsFromComponent.tabs) {
          this.tabsFlag = true;
          this.tabsDataFromComponent = this.optionsFromComponent.tabsData;
        }
        if (this.optionsFromComponent.columnDefs) {
          this.firstColoumnColId = this.optionsFromComponent.columnDefs[0].colId;
          this.optionsFromComponent.columnDefs.filter((v, k) => { v['orderNumber'] = k + 1; });
          this.showHideColumns = $.extend(true, [], this.optionsFromComponent.columnDefs);
          this.showHideColumns.map((val, key) => { });
          this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: this.getLanguageKey('SelectAll') ? this.getLanguageKey('SelectAll') : 'Select All',
            unSelectAllText: this.getLanguageKey('UnSelectAll') ? this.getLanguageKey('UnSelectAll') : 'UnSelect All',
            allowSearchFilter: true
          };
          finalColumns = this.showHideColumns;
        }

        this.gridOptions = $.extend(true, {}, this.optionsFromComponent);
        this.gridOptions.suppressRowClickSelection = true;
        this.listForBulkSlider = (this.optionsFromComponent.listForBulkSlider && this.optionsFromComponent.listForBulkSlider.length) ? this.optionsFromComponent.listForBulkSlider : [];
        this.originalView = {
          originalColumnDefs: this.optionsFromComponent.columnDefs ? $.extend(true, [], this.optionsFromComponent.columnDefs) : [],
          originalRowData: this.optionsFromComponent.rowData ? $.extend(true, [], this.optionsFromComponent.rowData) : []
        };
        if (this.gridOptions.columnDefs) {
          let columns = [];
          let selected_columns = [];
          this.gridOptions.columnDefs.forEach((column, index) => {
            columns.push({ item_id: index, item_text: this.getLanguageKey(column['headerName']) ? this.getLanguageKey(column['headerName']) : column['headerName'] });
            if (column['initialShowColumn']) {
              column['hide'] = false;
              selected_columns.push({ item_id: index, item_text: this.getLanguageKey(column['headerName']) ? this.getLanguageKey(column['headerName']) : column['headerName'] });
            }
            else {
              column['hide'] = true;
              this.originalViewHiddenColumns.push(column['colId']);
            }
          })
            this.listForDropDown = columns;
          // }
          this.selectedItems = selected_columns;

          this.gridOptions.columnDefs.filter(val => {
            if (val['filterObj']) {
              this.defaultFilteredData[val['colId']] = {
                'filter': val['filterObj'].filter,
                'filterType': val['filterObj'].filterType,
                'type': val['filterObj'].type
              }
            }
            if (val['sort']) {
              this.defaultSortingData.push({
                'colId': val['colId'],
                'sort': val['sort']
              });
            }
          });
        }
        this.recordsInPage = this.gridOptions.rowData.length;
        this.cacheBlockSize = this.tableName == "Doucment repository" ? this.gridOptions.cacheBlockSize :  this.gridOptions.cacheBlockSize;
        if (this.gridOptions && this.gridOptions.rowData) {
          if (this.gridApi) {
            this.gridApi.setRowData(this.gridOptions.rowData);
            this.gridApi.gridOptionsWrapper.gridOptions = this.gridOptions;
          }
        }
        if (this.router.routerState.snapshot.url.split("/")[5] == "assigned-users" && this.originalGirdTableName == 'Users') {
          let roleName = this.router['browserUrlTree'].queryParams.roleName ? decodeURIComponent(this.router['browserUrlTree'].queryParams.roleName) : decodeURIComponent(this.router['browserUrlTree'].root.children.primary.segments[5].path)
          let groupName = this.router['browserUrlTree'].queryParams.groupName ? decodeURIComponent(this.router['browserUrlTree'].queryParams.groupName) : decodeURIComponent(this.router['browserUrlTree'].root.children.primary.segments[5].path)
          let roleOrGroup = this.router.routerState.snapshot.url.split("/")[4]
          this.isRowSelectable = function (rowNode) {
            if (roleOrGroup == "roles") {
              return rowNode.data ? !rowNode.data.userRoles.includes(roleName) : false;
            } else if (roleOrGroup == "groups") {
              return rowNode.data ? !rowNode.data.userGroups.includes(groupName) : false;
            }
          };
        }
      }

      if (this.optionsFromComponent.rowModelType == 'clientSide') {
        this.totalresults = this.optionsFromComponent.rowData.length;
      }
      resolve(true);
    });
    return promise;
  }

  /**Getting Language text after resolving promis
   * Author : karnakar
   * Date : 20-Jan-2020
   */
  getLanKeyWhenPromisResolve(text) {
    var val = ''
    this.promisObj.then((resp) => {
      if (resp && text) {
        val = this.getLanguageKey(text);
      }
    })
    return val;
  }

  /** Getting Language text
   *  Author : karnakar
   *  Date : 20-Jan-2020
   */
  getLanguageKey(text) {
    var langKey = text;
    if (this.languageJson) {
      langKey = this.languageJson[text];
    }
    return langKey;
  }

  /** Getting pagination list
   *  Author : karnakar
   *  Date : 31-July-2019
   */
  paginationList(gridOptions, item) {
    this._alertService.nextPrevTableData = [];
    this.paginationSize = Number(item);
    this.gridApi.gridOptionsWrapper.setProperty('cacheBlockSize', Number(item));
    if (this.gridApi && this.gridApi.infinitePageRowModel) {
      this.gridApi.infinitePageRowModel.resetCache();
    }
    this.gridApi.paginationSetPageSize(Number(item));
  }

  /** Getting current slider value
   *  Author : karnakar
   *  Date : 06-Nov-2019
   */
  getListOfParticularFeed(operation) {
    $(".input-container input").focusout(function () {
      $(this).click();
    });
    this.openAutoComplete('');

    var obj = {};
    if (operation == 'prev' && this.itemNumber !== 0) {
      this.itemNumber--;
      obj = this.listForBulkSlider[this.itemNumber];
    }
    else if (operation == 'next' && this.itemNumber < this.listForBulkSlider.length - 1) {
      this.itemNumber++;
      obj = this.listForBulkSlider[this.itemNumber];
    }
    if (obj) {
      obj['thisRef'] = this;
      this._agGridTableService.getComponentDataForSelectedROws(obj);
    }
  }

  /** Getting current slider selected value
   *  Author : karnakar
   *  Date : 06-Nov-2019
   */
  selectEventOfBulkAssignee(event, type) {
    if (type && type == 'FromAissigneeToMe') {
      event['name'] = (this.currentUserDetails && this.currentUserDetails.firstName) ? this.currentUserDetails.firstName : '';
      event['values'] = this.currentUserDetails ? this.currentUserDetails : {};
    }

    event['selectedRowsForAssignee'] = this.selectedRowsForBulk;
    event['thisTableGridApi'] = this.gridApi;
    event['thisTableRef'] = this;
    event['dialogBox'] = this.dialog;
    event['changeLevelModal'] = this.changeLevelConfirmModal;
    this._agGridTableService.getComponentDataForSelectedROws(event);
  }

  saveOrUpdateGridView(type, values, index, fromUpdateBtn ?: boolean) {
    const allDisplayCols: any[] = this.gridColumnApi.getAllDisplayedColumns();
    const allDisplayColsIds: any[] = allDisplayCols.map((entry) => entry.colId);

    let body: any = {
      gridTableName: this.tableName,
      gridViewMetaData: "",
    };
    if (type != "save") {
      body.gridViewId = values && values.gridViewId ? values.gridViewId : "";
      body.gridViewName = this.updateInputModal ? this.updateInputModal : this.popoverData.viewName
      ? this.popoverData.viewName
      : "";
      body.defaultView = this.popoverData.isDefaultView;
      this.listOfSavedGridViews.forEach((element) => {
        if (element.gridViewId == values && values.gridViewId) {
          element.gridViewName = body.gridViewName;
        }
      });
      if(!fromUpdateBtn){
        this.toggleUpdateViewButton();
      }
    } else {
      body.gridViewName = this.newViewName ? this.newViewName : "";
      body.defaultView = values.isDefaultView;
      this.newViewName = "";
      this.isOpenCreateNewEditor = false;
    }
    let metaData: GridMetaData = {} as GridMetaData;
    metaData.columns = allDisplayColsIds;
    metaData.filters = this.gridApi.getFilterModel();
    metaData.sort = this.gridApi.getSortModel();
    metaData.orderedColumns = allDisplayColsIds;
    metaData.isDefaultView = values.isDefaultView;
    metaData.date = new Date();
    metaData.columnSizes = this.getHeaderColumnsWidth();

    let dateFilterData = this._agGridTableService.dateModelFilter;
    if (dateFilterData && this.Object.keys(dateFilterData).length) {
      if (Object.keys(dateFilterData).includes('createdOn')) {
        let createdOn = dateFilterData['createdOn']
        metaData.filters = { ...metaData.filters, createdOn };
      }
      if (Object.keys(dateFilterData).includes('NextRemediationDate')) {
        let NextRemediationDate = dateFilterData['NextRemediationDate']
        metaData.filters = { ...metaData.filters, NextRemediationDate };
      }
    }

    body.gridViewMetaData = JSON.stringify(metaData);
    this._agGridTableService
      .saveOrUpdateGridTableAPI(body)
      .subscribe((resp) => {
        if (type == "save") {
          this.showOnlyColumns(metaData.orderedColumns, metaData);
          this.selectedViewName = body.gridViewName;
          this.getAllSavedListViews(this.tableName, false);
        } else {
          this.selectedViewName = body.gridViewName;
          this.getAllSavedListViews(this.tableName, false);
          this.newViewName = ""
          this.isOpenCreateNewEditor = false;
        }
      });
  }

  getHeaderColumnsWidth(): any {
    let allColumns: any[] = [];
    let allColumnsUpdated: any[] = [];
    allColumns = this.gridColumnApi.getAllColumns();
    allColumnsUpdated = allColumns.map((entry) => {
      return {
        colKey: entry.colId,
        newWidth: entry.actualWidth
      }
    })
    return allColumnsUpdated;
  }

  updatePreviousDefaultView() {
    this.listOfSavedGridViews.forEach((view) => {
      if (view && view.defaultView) {
        view.defaultView = false;
        this._agGridTableService.saveOrUpdateGridTableAPI(view).subscribe(resp => {
        })
      }
    })
  }

  /** recreating table with columns data,filters data and sorting data
   *  Author : karunakar
   *  Date : 20-Aug-2019
   */
  reCreateTable(columnDefs, filterData, sortingData) {
    this.gridApi.setSortModel(sortingData.length ? sortingData : null);
    this.gridApi.setFilterModel(filterData ? filterData : null);
    columnDefs.forEach(element => {
      element['OrginalHeaderName'] = element['headerName'];
      element['headerName'] = this.languageJson[element['headerName']] ? this.languageJson[element['headerName']] : element['headerName'];
    });
    this.gridApi.setColumnDefs(columnDefs);
  }

  /** Get current columns data,filters data and sorting data
   *  Author : karunakar
   *  Date : 05-Aug-2019
   */
  getCurrentRowColumnFilterSortingStateData() {
    var currentState = {
      stateData: this.gridColumnApi.getColumnState(),
      filterData: this.gridApi.getFilterModel(),
      sortingData: this.gridApi.getSortModel()
    }
    return currentState;
  }

  getColor(color) {
    return '#' + color
  }

  /** setting table columns with sorting and column state
   *  Author:karnakar
   *  Date:31-July-2019
   */
  setColumnsWithUpdatedValues(columns, stateData, sortingData) {
    var columnsAfterSettings = [];
    stateData.filter((val) => {
      columns.filter((v, k) => {
        v['sort'] = (sortingData[0] && v['colId'] && sortingData[0].colId && sortingData[0].sort && (v['colId'] == sortingData[0].colId)) ? sortingData[0].sort : '';
        if (val.colId == v['colId'] && val.width !== v['width']) {
          v['width'] = val.width;
        }
        if (val.colId == v['colId']) {
          v['orderNumber'] = k + 1;
          columnsAfterSettings.push(v);
        }
      });
    });
    return columnsAfterSettings;
  }

  /** Making First Letter capital of each word
   *  Author:karnakar
   *  Date:31-July-2019
   */
  firstLetterCapitalOfEveryWord(text): any {
    return text.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
  }

  /** Sending current view name data to popover
   *  Author : karnakar
   *  Date:05-Aug-2019
   */
  sendDataToPopover(selectedObj, index, event ?: any) {

    this.popoverData = $.extend(true, {}, selectedObj);
    this.popoverData['index'] = index ? index : '';
    this.popoverData['viewName'] = (selectedObj && selectedObj['gridViewName']) ? selectedObj['gridViewName'] : " ";
    this.popoverData['isDefaultView'] = (selectedObj && this.defaultView  && selectedObj.gridViewId == this.defaultView.gridViewId) ? true : false;
    this.popoverData['viewId'] = (selectedObj && selectedObj['gridViewId']) ? selectedObj['gridViewId'] : " ";

    if(event){
    this.resetGridView(this.popoverData.viewName, this.popoverData.viewId, event);
    }

  }

  /** Getting current table row data
   *  Author : karnakar
   *  Date:31-July-2019
   */
  getCurrentTableRowData() {
    var currentRowData = [];
    var count = this.gridApi.getDisplayedRowCount();
    for (var i = 0; i < count; i++) {
      var rowNode = this.gridApi.getDisplayedRowAtIndex(i);
      currentRowData.push(rowNode.data);
    }
    return currentRowData;
  }

  /**  Reset grid view
   *   Author : karnakar
   *   Date : 30-July-2019
   */
  resetGridView(currentViewName, currentViewId, event) {
      this.selectSavedGridView(currentViewName, currentViewId, event);
  }

  /** Show selected grid view table
   *  Author : karnakar
   *  Date : 31-July-2019
   */
  selectSavedGridView(viewName, viewId, event) {
    event.preventDefault();
    this.requestsToIgnore = true;
    this._agGridTableService.dateModelFilter = {};
    if (viewId != 1) {
      let SelectedviewDetails;
      this.listOfSavedGridViews.forEach((view) => {
        if (view && view.gridViewId == viewId) {
          SelectedviewDetails = view["gridViewMetaData"];
          SelectedviewDetails = JSON.parse(SelectedviewDetails);

          let newFilterModel = {};
          if (SelectedviewDetails && this.Object.keys(SelectedviewDetails).length) {
            if (Object.keys(SelectedviewDetails.filters).includes('createdOn')) {
              newFilterModel['createdOn'] = SelectedviewDetails.filters['createdOn'];
              delete SelectedviewDetails.filters['createdOn'];
            }
            if (Object.keys(SelectedviewDetails.filters).includes('NextRemediationDate')) {
              newFilterModel['NextRemediationDate'] = SelectedviewDetails.filters['NextRemediationDate'];
              delete SelectedviewDetails.filters['NextRemediationDate'];
            }
            this._agGridTableService.dateModelFilter = {};
            this._agGridTableService.dateModelFilter = newFilterModel;
          }
        }
      });
      let colIds = SelectedviewDetails["orderedColumns"];

      if (
        SelectedviewDetails &&
        SelectedviewDetails["orderedColumns"] &&
        SelectedviewDetails.orderedColumns.length > 0
      ) {
        colIds = SelectedviewDetails.orderedColumns;
      }
      this.showOnlyColumns(colIds, SelectedviewDetails, true);
      if (SelectedviewDetails) {
        this.setColumnsWidthOnSelectedGridChange(SelectedviewDetails);
      }
    }
    else {
      let showOnly = [];
      this.gridOptions.columnDefs.forEach((column) => {
        if (this.originalViewHiddenColumns.indexOf(column['colId']) == -1) {
          showOnly.push(column['colId'])
        }
      })
      this.showOnlyColumns(showOnly, null, true);
      this.gridApi.setRowData(this.gridOptions.rowData);
    }
    this.selectedViewName = viewName;
    this.selectedColumns();
  }

  setColumnsWidthOnSelectedGridChange(selectedviewDetails: any): void {
    if (
      selectedviewDetails.columnSizes &&
      selectedviewDetails.columnSizes.length
    ) {
      const columnsWidth: any[] = selectedviewDetails.columnSizes;
      if (columnsWidth && columnsWidth.length) {
        columnsWidth.forEach((entry) => {
          this.gridColumnApi.setColumnWidth(entry.colKey, entry.newWidth, true);
        });
      }
    } else {
      this.gridColumnApi.autoSizeAllColumns(true);
    }
  }

  selectedColumns() {
    let selected_columns = [];
    this.gridOptions.columnDefs.forEach((column, index) => {
      if (column['initialShowColumn']) {
        column['hide'] = false;
        selected_columns.push({ item_id: index, item_text: this.languageJson[column['headerName']] ? this.languageJson[column['headerName']] : column['headerName'] })
      }
      else {
        column['hide'] = true;
      }
    })
    this.selectedItems = selected_columns;
  }


  /** Making columns size fit to the table
   *  Author : karnakar
   *  Date : 31-July-2019
   */
  columnSizesFitToTable(columns) {
    if (columns && columns.length <= 7 && this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  rowDragLeave(event) {
  }

  /** Delete Saved grid view table
   *  Author : karnakar
   *  Date : 31-July-2019
   */
  deleteSavedView(viewId): any {
    var params = {
      "viewId": viewId ? viewId : ''
    }
    this._agGridTableService.deleteSavedViewTableAPI(params).subscribe(resp => {
      this.getAllSavedListViews(this.tableName, true);
    });
  }

  /** Get order of the columns
   *  Author : karnakar
   *  Date : 30-july-2019
   */
  mapOrderForColumns(array, orderArr, key) {
    array.sort(function (a, b) {
      var A = a[key], B = b[key];
      if (orderArr.map(function (e) { return e.colId; }).indexOf(A) > orderArr.map(function (e) { return e.colId; }).indexOf(B)) {
        return 1;
      } else {
        return -1;
      }
    });
    return array;
  };

  /** Adding new empty row to table
   *  Aithor : karnakar
   *  Date : 02-June-2019
   */
  addNewRow(e, api) {
    if (this.tableName === 'Tags List') {
      this.tagService.updatedTag = "";
      var tempObj = {};
      this.gridOptions.columnDefs.filter((val: any) => {
        tempObj[val.colId] = '';
        tempObj['enableInput'] = true;
        tempObj['isAdded'] = true;
      })
      var newItem = [tempObj];
      if (api) {
        this.getAllRows().then((res: any[]) => {
          if (!res.length || (res.length && res[0] && !res[0].isAdded)) {
            api.updateRowData({ add: newItem, addIndex: 0 });
            const allRows = this.getAllRows()
          }
        })
      }
    }
    else {
      var tempObj = {};
      this.gridOptions.columnDefs.filter((val: any) => {
        tempObj[val.headerName] = '';
        tempObj['valueForDelete'] = true;
        tempObj['enableInput'] = true;
        tempObj['disableReviewer'] = false;
      })
      var newItem = [tempObj];
      if (api) {
        api.updateRowData({ add: newItem, addIndex: 0 });
      }
    }
  }

  getAllRows() {
    let rowData = [];
    this.gridApi.forEachNode(node => rowData.push(node.data));
    return new Promise(function (resolve) {
      resolve(rowData);
    });
  }

  /** Autocomplete defualt input focus of bulk assignee
   *  Aithor : karnakar
   *  Date : 10-Nov-2019
   */
  openAutoComplete(e) {
    setTimeout(() => {
      $(".input-container input").focus();
    }, 0);
    setTimeout(() => {
      $(".overlay").remove();
    }, 1000);
  }

  tabChange(item, event) {
  }

  /** On cclick from change label get selected values
   *  Author : Amritesh
   *  Date : 4-nov-2019
   */
  getClickedGroupLevel(value, item) {
    this.effectedAlerts = 0;
    let selectedRows = this.gridApi.getSelectedRows();
    let checkLabelExists = (obj) => {
      return (obj.label == item.name && !obj.disable);
    }
    selectedRows.forEach(element => {
      if (element['groupLevel'].key != item.name) {
        element['groupLevel'].value.forEach((obj) => {
          if (checkLabelExists(obj)) {
            this.effectedAlerts = this.effectedAlerts + 1;
            return false;
          }
        })
      }
    });
    const dialogRef = this.dialog.open(this.changeLevelConfirmModal, {
      width: '250px',
      panelClass: ['confirm-dialog', 'light-theme']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return false;
      }
      else {
        var ArrayToRedrawRowNode = [], ParamsArray = [];
        var bulkType = 'groupLevel'
        if (this.storeAllRowSelected.length > 0) {
          this.storeAllRowSelected.map((rowGroupValue) => {
            if (rowGroupValue.data['groupLevel'].key != item.name) {
              rowGroupValue.data['groupLevel'].value.map((groupName) => {
                if (groupName.label == item.name && !groupName.disable) {
                  var paramsData = {};
                  paramsData['alertId'] = rowGroupValue.data['alertId'];
                  paramsData['groupLevel'] = groupName.values.groupId.id;
                  paramsData["asignee"] = null;
                  rowGroupValue.data['groupLevel'].key = item.name;
                  rowGroupValue.data["assignee"].key = "UnAssigned";
                  rowGroupValue.data["assignee"].value.unshift({ 'label': "Unassigned", disable: false, "values": {} });

                  ArrayToRedrawRowNode.push(rowGroupValue);
                  ParamsArray.push(paramsData);
                }
              });
            }
          });
          if (ParamsArray.length) {
            this._alertService.saveOrUpdateAlerts(ParamsArray, bulkType).subscribe((response) => {
              if (response && response.result.length > 0) {
                this.gridApi.redrawRows({ rowNodes: ArrayToRedrawRowNode });
              }
              ArrayToRedrawRowNode.map((val) => {
                val.data['groupLevel'].value = [];
                response.result[0].feedGroups = response.result[0].feedGroups.sort((a, b) => parseFloat(a.rank) - parseFloat(b.rank));
                response.result[0].feedGroups.map((groupObj) => {
                  val.data['groupLevel'].value.push({ 'label': groupObj.groupId.name, disable: true, "values": groupObj })
                })
                val.data['groupLevel'].key = item.name;
                val.data = this.enablingTheRequiredOptionInGroupLevel(val.data, val.data['groupLevel'].key);
              });
              this._sharedService.showFlashMessage(ArrayToRedrawRowNode.length + ' alerts changed successfully!', 'success');
            });
          }
        }
      }
    });
  }

  /** enabling the required option user can escalate only one level up or de-escalate the alert only one level down
   *  Author : Amritesh
   *  Date : 25-sep-2019
   */
  enablingTheRequiredOptionInGroupLevel(groupList, groupSelected) {
    groupList["groupLevel"].value.map((groupObj, index) => {
      if (groupObj.label == groupSelected && (index || index == 0)) {
        groupList["groupLevel"].value[index].disable = false;
        if (groupList["groupLevel"].value[index + 1]) {
          groupList["groupLevel"].value[index + 1].disable = false;
        }
        if (groupList["groupLevel"].value[index - 1]) {
          groupList["groupLevel"].value[index - 1].disable = false;
        }
      }
    })
    return groupList;
  }

  /** On click from set status get selected values os status
   *  Author : Amritesh
   *  Date : 4-nov-2019
   */
  getSelectedStatus(statusVal) {
    this.effectedAlerts = 0;
    var bulkType = 'status'

    var ParamsArray = []
    if (this.storeAllRowSelected.length > 0) {
      this.storeAllRowSelected.map((rowGroupValue: any) => {
        var paramsData = {};
        let selectedStatus = rowGroupValue.data['status']['key'].toLowerCase();
        let allowedStatus = this.statusUpdateValidations[selectedStatus];
        let statusToBeUpdated = statusVal.values.code.toLowerCase();
        if (allowedStatus.indexOf(statusToBeUpdated) != -1 && !rowGroupValue.data['status']['disable']) {
          paramsData['alertId'] = rowGroupValue.data['alertId'];
          paramsData['statuse'] = statusVal.values;
          paramsData["asignee"] = rowGroupValue.data.assignee.value[0].values;
          rowGroupValue.data.status.key = statusVal.label;
          ParamsArray.push(paramsData)
        }
      });
      this.effectedAlerts = ParamsArray.length;
    }
    const dialogRef = this.dialog.open(this.changeLevelConfirmModal, {
      width: '250px',
      panelClass: ['confirm-dialog', 'light-theme']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return false;
      }
      else {
        this._alertService.saveOrUpdateAlerts(ParamsArray, bulkType).subscribe((response) => {
          if (response) {
            this._sharedService.showFlashMessage(ParamsArray.length + ' alerts changed successfully!', 'success');
          }
          this.gridApi.redrawRows({ rowNodes: this.storeAllRowSelected });
        })
      }
    })
  }

  /** Showing ang hiding save,edit,cancle icons
   *  Author : karnakar
   *  Date : 05-Sep-2019
   */
  changeClientServerSideFilters(val) {
    if (val) {
      this.enableDisableFilters = true;
      this.gridOptions.rowModelType = 'infinite';
      this.rowModelType = 'infinite';
      this.gridApi.setDatasource();
    }
    else {
      this.enableDisableFilters = false;
      this.gridOptions.rowModelType = 'clientSide';
      this.rowModelType = 'clientSide';

    }
  }

  /** Getting all assignees based on feed
   *  Author : karnakar
   *  Date : 04-Nov-2019
   */
  getAllAssigneesOnChangeOfFeedInBulk(flag, id) {
    this.openAutoComplete('');
    this.showFeedSlider = !this.showFeedSlider;
    var that = this;
    var obj = {
      'getAssigneeList': flag,
      'id': id,
      'thisRef': that
    }
    this._agGridTableService.getComponentDataForSelectedROws(obj);
  }


  /** Custom styles for pagination
   *  Author : Asheesh
   *  Date : 04-Nov-2019
   */
  stylesForPagination() {
    $(".ag-paging-panel .ag-paging-row-summary-panel").html($(".ag-paging-panel .ag-paging-row-summary-panel").html().replace('to', '-'));
    $(".ag-paging-panel .ag-paging-row-summary-panel").html($(".ag-paging-panel .ag-paging-row-summary-panel").html().replace('more', this.pageNumberForAlert));

  }

  /** Export ag-grid table to CSV
   *  Author : kamal
   *  Date : 04-Nov-2019
   */
  formatDataToExport(exportType:string = '') {
    const exportPDFButton = document.getElementById("export-pdf-button");
    let relatedValue;
    let relatedData;
    if (exportPDFButton) {
      relatedValue = document.getElementById("export-pdf-button").getAttribute('related-data');
      relatedData = JSON.parse(relatedValue);
    }
    let promise = new Promise((resolve, reject) => {
      if (this.gridApi.gridOptionsWrapper.gridOptions.rowModelType == "clientSide" && this.gridApi.gridOptionsWrapper.gridOptions.defaultGridName != "case View") {
        this.gridApi.exportDataAsCsv(this.gridApi.gridOptionsWrapper.gridOptions.csvExportParams);
        this.documentDownloaded = false;
      }
      else {
        let newFilterModel = {};
        let paramsFilterJson;
        if (Object.keys(this.gridApi.getFilterModel()).length > 0) {
          newFilterModel = this.gridApi.getFilterModel()
        }

        if (newFilterModel && this.Object.keys(newFilterModel).length) {
          if (Object.keys(newFilterModel).find(element => element === 'product') && this._agGridTableService.productFilterID) {
            newFilterModel['product'].filterId = this._agGridTableService.productFilterID
          }
          if (Object.keys(newFilterModel).find(element => element === 'status') && this._agGridTableService.statusFilterKey) {
            newFilterModel['status'].filterId = this._agGridTableService.statusFilterKey
          }
        }

        var dateFilterData = this._agGridTableService.dateModelFilter;
        if (dateFilterData && this.Object.keys(dateFilterData).length) {
          if (Object.keys(dateFilterData).includes('createdOn')) {
            newFilterModel['createdOn'] = dateFilterData['createdOn']
          }
          if (Object.keys(dateFilterData).includes('NextRemediationDate')) {
            newFilterModel['NextRemediationDate'] = dateFilterData['NextRemediationDate']
          }
        }

        paramsFilterJson = JSON.stringify(this.formatFilters(newFilterModel));

        let sortModel = this.gridApi.getSortModel()
        let requestParams = {
          isAllRequired: false,
          pageNumber: 1,
          recordsPerPage: this.pageNumberForAlert,
          filterModel: paramsFilterJson,
        }
        if (sortModel && sortModel.length > 0) {
          requestParams['orderIn'] = sortModel[0].sort;
          requestParams['orderBy'] = sortModel[0].colId;
        }

        let url: string;
        if (requestParams['orderIn'] && this.gridApi.gridOptionsWrapper.gridOptions.defaultGridName != "case View") {
          url = this.gridApi.gridOptionsWrapper.gridOptions.csvExportParams.url + "?orderIn=" + requestParams['orderIn'] + "&orderBy=" + requestParams['orderBy'] + "&isAllRequired=" + requestParams.isAllRequired + "&pageNumber=" + requestParams.pageNumber + "&recordsPerPage=" + requestParams.recordsPerPage;
        }
        else if (this.gridApi.gridOptionsWrapper.gridOptions.defaultGridName === "case View") {
          url = this.gridApi.gridOptionsWrapper.gridOptions.csvExportParams.url;
        }
        else {
          url = this.gridApi.gridOptionsWrapper.gridOptions.csvExportParams.url + "?isAllRequired=" + requestParams.isAllRequired + "&pageNumber=" + requestParams.pageNumber + "&recordsPerPage=" + requestParams.recordsPerPage;
        }
        if (this.gridApi.gridOptionsWrapper.gridOptions.defaultGridName === "Source Management View") {
          url = url + "&classificationId=" + this.gridApi.gridOptionsWrapper.gridOptions.csvExportParams.classificationId + "&subSlassificationId=&visible=";
        }

        let getDB_key = (colId) => {
          let returnValue = null;
          this.gridOptions.columnDefs.forEach((column, index) => {
            if (colId == column['colId']) {
              returnValue = column['dbKey'];
              return;
            }
          })
          return returnValue;
        }
        let orderedColumns = this.gridApi.gridOptionsWrapper.columnApi.getColumnState()
        let colIds = [];
        orderedColumns.forEach(element => {
          let key = element.colId;
          if (key) {
            let val = element.colId;
            if (val) {
              colIds.push(val);
            }
          }
        });
        var params;
        if (this.gridApi.gridOptionsWrapper.gridOptions.defaultGridName === "case View") {
          colIds.forEach((element, i) => {
            if (element == 'select') {
              colIds.splice(i, 1);
            }
            if (element == 'Indicators') {
              colIds.splice(i, 1);
            }
          })
          params = {
            filter_model: requestParams.filterModel,
            columns: colIds,
            order_by: requestParams['orderBy'],
            order_in: requestParams['orderIn'],
            language: this.getLanguageName(),
            file_name: this.getLocalizationFileName()
          }
        } else {
          params = {
            filterModel: requestParams.filterModel,
            columns: colIds,
            orderBy: requestParams['orderBy'],
            orderIn: requestParams['orderIn'],
          }
        }
        if (relatedData !== null) {
          document.getElementById("export-pdf-button").removeAttribute('related-data');
          params = {
            filterModel: relatedData.filterString,
            columns: relatedData.coloumnKey
          }
          url = this.gridApi.gridOptionsWrapper.gridOptions.csvExportParams.url + "?isAllRequired=" + requestParams.isAllRequired + "&pageNumber=" + requestParams.pageNumber + "&recordsPerPage=" + relatedData.recordsPerPage;
        }

        if(this.gridApi.gridOptionsWrapper.gridOptions.defaultGridName === "case View" && exportType == "pdf"){
          this._agGridTableService.caseExportAsType(exportType , params).subscribe((respone: Blob) => {
            var file = new Blob([respone], { type: 'application/pdf' })
            var fileURL = URL.createObjectURL(file);
            resolve(fileURL)
          },(err) => {
            this._sharedService.showFlashMessage('Failed to create the download document ', 'danger');
            if(this.tableName !== 'Case list view') {
              let ele = (<HTMLInputElement>document.getElementById("alertExport"));
              ele.disabled = false;
              ele.innerHTML = this.getLanguageKey('ExportData');
            }
            this.documentDownloaded = false;
          })
        }else{
          this._agGridTableService.csvExport(url, params).subscribe((response: any) => {
            var blob = new Blob([response], { type: 'text/csv' });
            let myReader: any = new FileReader();
            myReader.addEventListener("load", (e: any) => {
              let parseData = d3.csvParse(myReader.result);
              let getLanguageKey = (text) => {
                var langKey = text;
                if (GlobalConstants.languageJson && GlobalConstants.languageJson[text]) {
                  langKey = GlobalConstants.languageJson[text];
                }
                return langKey;
              }
              let columns = parseData.columns.map((column) => {
                return getLanguageKey(column);
              })
              let rows = [];
              rows.push(columns)
              parseData.forEach((row) => {
                rows.push(Object.values(row));
              })
              resolve([rows, columns])
            })
            let text = myReader.readAsText(blob);
          }, (err) => {
            this._sharedService.showFlashMessage('Failed to create the download document ', 'danger');
            if(this.tableName !== 'Case list view') {
              let ele = (<HTMLInputElement>document.getElementById("alertExport"));
              ele.disabled = false;
              ele.innerHTML = this.getLanguageKey('ExportData');
            }
            this.documentDownloaded = false;
          })
        }
      }
    })
    return promise
  }

  getCurrentLangCode() {
    if (GlobalConstants.systemSettings.ehubObject.language === 'german') {
      return true;
    } else if (localStorage.getItem('langKey') && localStorage.getItem('langKey').toLowerCase() === 'german') {
      return true;
    } else {
      return false;
    }
  }

  getLanguageName() {
    return this.getCurrentLangCode() ? RelatedCasesConstants.DE_LANG_NAME : RelatedCasesConstants.EN_LANG_NAME;
  }

  getLocalizationFileName() {
    return this.getCurrentLangCode() ? RelatedCasesConstants.DE_LOC_FILE_NAME : RelatedCasesConstants.EN_LOC_FILE_NAME;
  }

  exportCsv() {
    this.documentDownloaded = true;
    this.formatDataToExport().then((data) => {
      let myReader: any = new FileReader();
      let filename = this.gridApi.gridOptionsWrapper.gridOptions.csvExportParams.fileName
      let nameOfFileToDownload = filename + ".csv";
      let columns = data[1]
      let rows = data[0]
      let csvFromArrayOfArrays: any = convertArrayToCSV(rows, {
        columns,
        separator: ','
      });
      let blob = new Blob(['\ufeff' + csvFromArrayOfArrays], { type: 'text/csv;charset=utf-8;' });
      if (this.window.navigator && this.window.navigator.msSaveOrOpenBlob) {
        this.window.navigator.msSaveOrOpenBlob(blob, nameOfFileToDownload);
      } else {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = nameOfFileToDownload;
        if (a.href && a.download) {
          this.downloadModalRef = this.dialog.open(this.downloadModal, {
            width: '250px',
            minHeight: '240px',
            panelClass: ['confirm-dialog', 'light-theme'],
          });

          this.downloadModalRef.afterOpened().subscribe(result => {
            var test = document.getElementById('reportDownload');
            test.setAttribute("href", a.href);
            test.setAttribute("download", a.download);
          });

          this.downloadModalRef.afterClosed().subscribe(result => {
            this.documentDownloaded = false;
          });

        } else {
          this._sharedService.showFlashMessage('Failed to create the document', 'danger');
        }
      }
      let text = myReader.readAsText(blob);
      if(this.tableName !== 'Case list view') {
        let ele = (<HTMLInputElement>document.getElementById("alertExport"));
        if(ele){
          ele.disabled = false;
          ele.innerHTML = this.getLanguageKey('ExportData');
        }
      }
    });
  }

  onDownloadFileClick() {
    let langName = this.getLanguageName();
    let filename = this.getLocalizationFileName();
    if (this.tableName == 'Case related entity') {
      this.caseDetailInfoService.associatedEntities.subscribe(data => {
        if (data.length > 0) {
          this._caseService.exportCaseRelatedEntityNew(this.apiData.requestParams, this.apiData.filterModel, langName, filename).toPromise().then((res) => {
            if (res) {
              let expFileName = `RelatedEntities-${new Date().toISOString()}`;
              this.downloadXlsxFile(res, expFileName);
              this.caseDetailInfoService.associatedEntities$.next(null);
            }
          }).catch(() => {
            this.caseDetailInfoService.associatedEntities$.next(null);
            this._sharedService.showNewFlashMessage(this.getLanguageKey("Internal Server Error"), 'danger');
          });
        }
      });
    } else if (this.tableName == 'Related Cases view') {
      this.caseDetailInfoService.relatedCases.subscribe(data => {
        if (data.length > 0) {
          this._caseService.exportRelatedCases(this.apiData.requestParams, this.apiData.filterModel, langName, filename).toPromise().then((res) => {
            if (res) {
              let expFileName = `RelatedCases-${new Date().toISOString()}`;
              this.downloadXlsxFile(res, expFileName);
              this.caseDetailInfoService.relatedCases$.next(null);
            }
          }).catch(() => {
            this.caseDetailInfoService.relatedCases$.next(null);
            this._sharedService.showNewFlashMessage(this.getLanguageKey("Internal Server Error"), 'danger');
          });
        }
      });
    } else if (this.tableName === 'Events Lookup view') {
      this._caseService.exportEventLookupTransactions(this.apiData.requestParams, this.apiData.filterModel, langName, filename).toPromise().then((res) => {
        if (res) {
          const expFileName = `EventsLookupTransactions-${new Date().toISOString()}`;
          this.downloadXlsxFile(res, expFileName);
        }
      }).catch(() => {
        this._sharedService.showNewFlashMessage(this.getLanguageKey("Internal Server Error"), 'danger');
      });
    } else if (this.tableName == "Associated Record view") {
      this.caseDetailInfoService.associatedRecords.subscribe(data => {
        if (data.length > 0) {
          this._caseService.exportAssociateRecords(this.apiData.requestParams, this.apiData.filterModel, langName, filename).toPromise().then((res) => {
            if (res) {
              let expFileName = `AssociateRecords-${new Date().toISOString()}`;
              this.downloadXlsxFile(res, expFileName);
              this.caseDetailInfoService.associatedRecords$.next(null);
            }
          }).catch(() => {
            this.caseDetailInfoService.associatedRecords$.next(null);
            this._sharedService.showNewFlashMessage(this.getLanguageKey("Internal Server Error"), 'danger');
          });
        }
      });
    }else if (this.isCaseContactView){
      this._caseService.getCaseContacts(this.apiData.requestParams).subscribe((res) => {
        let expFileName = `CaseContacts-${new Date().toISOString()}`;
        this.downloadXlsxFile(res, expFileName);
      })
    }
     else {
      if (this.gridApi.gridOptionsWrapper.gridOptions.downloadSelectedActionName === 'DOWNLOAD_SELECTED_CASE_ATTACHMENTS') {
        this.downloadZipDocument();
      } else {
        this.formatDataToExport().then((data: any[]) => {
          const name = this.gridApi.gridOptionsWrapper.gridOptions.csvExportParams.fileName;
          let fileName = `${name}-${new Date().toISOString()}`;
          var wb = XLSX.utils.book_new();
          var ws = XLSX.utils.json_to_sheet(data);
          XLSX.utils.book_append_sheet(wb, ws, name);
          XLSX.writeFile(wb, `${fileName}.xlsx`);
        });
      }
    }
  }

  private downloadZipDocument(): void {
    const urlPathParts = this.router.url.split('/');
    const zipName = `${this.caseName.name}.zip`;
    const selectedRowPathNamesArray = this.storeAllRowSelected.reduce((acc, curr) => {
      acc.push(curr.data.path);
      return acc;
    }, []);
    const params = {
      document_paths: selectedRowPathNamesArray,
      zipfile_name: zipName,
    };

    if (selectedRowPathNamesArray.length < 2) {
      // this._sharedService.showFlashMessage(this.getLanguageKey('Please select at least 2 attachments to download as a zip'), 'warning');
      this._sharedService.displayNotificationBar(true, 'warning', 'Please select at least 2 attachments to download as a zip', false , '');
      return;
    }
    this._caseService.showDocDownloadLoader.next(true);
    this._commonService.getDownloadDocumentpresignedUrl(params).then((response: any) => {
      this._caseService.showDocDownloadLoader.next(false);
      if (response && response.presigned_url && response.status !== "error") {
        this._commonService.downloadFromPresigned(response.presigned_url, zipName);
        this._sharedService.showFlashMessage(this.getLanguageKey('Successfully downloaded document with file name') + zipName, 'success');
        this.deselect();
      } else {
        this._sharedService.showFlashMessage(this.getLanguageKey('Failed to download document with file name') + zipName, 'danger');
      }
    });
  }

  exportPdf() {
    const isCaseListView = this.gridApi.gridOptionsWrapper.gridOptions.defaultGridName === "case View" ? true : false;
    this.documentDownloaded = true;
    this.formatDataToExport(isCaseListView ? 'pdf' : '').then((data:any) => {
      this.pdfData = data;
      let filename = this.gridApi.gridOptionsWrapper.gridOptions.csvExportParams.fileName
      this.pdfNameOfFileToDownload = filename + ".pdf";
      if(this.pdfData){
        if(isCaseListView){
           this.onExportDialogOpen();
          this.downloadModalRef.afterOpened().pipe(
            switchMap(_ =>  fromEvent(
              document.getElementById('reportDownload'),
              'click'
            )
          )).subscribe(result => {
            var a         = document.createElement('a');
            a.href        = data;
            a.target      = '_blank';
            a.download    = this.gridApi.gridOptionsWrapper.gridOptions.csvExportParams.fileName + ".pdf";
            document.body.appendChild(a);
            a.click();
          });
          this.onExportDialogClose();
          }else{
            this.pdfColumns = this.pdfData[1];
            this.pdfRows = this.pdfData[0];
            if (this.pdfRows.length > 0) {
              this.pdfRows.shift()
            }
            const doc: any = new jsPDF('l','px')
            this.onExportDialogOpen();
            this.downloadModalRef.afterOpened().pipe(
                    switchMap(_ => this.lazyLoadScript.loadScript('./assets/js/NotoSansCJKjp-Regular-normal.js')),
                    switchMap(_ =>  fromEvent(
                      document.getElementById('reportDownload'),
                      'click'
                    )
            )).subscribe(result => {
                    const self = this;
                    doc.addFont(self.platformLocation.getBaseHrefFromDOM() + 'assets/fonts/NotoSansCJKjp-Regular.ttf', 'NotoSansCJKjp-Regular', 'normal');
                    doc.autoTable({
                      head: [self.pdfColumns],
                      body: self.pdfRows,
                      styles: { overflow: 'linebreak', fontSize: 4.5, font: 'NotoSansCJKjp-Regular', minCellWidth: 15 }
                    })
                    doc.save(self.pdfNameOfFileToDownload);
            });
            this.onExportDialogClose();
          }
      }else{
        this._sharedService.showFlashMessage('Failed to download the document', 'danger');
      }
    })
  }

  downloadXlsxFile(csvData, fileName) {
    let blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8;'
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    navigator.userAgent.indexOf('Chrome') == -1;
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", fileName + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  /* Open Search Releated Cases
  Author: Upeksha (AP-8080)
  Date: 21th Jan 2021
  */
  openSearchReleatedCasesModal(data) {
    let dialogReference = this.dialog.open(SearchReleatedEntityComponent, {
      disableClose: false,
      panelClass: [
        "user-popover",
        "custom-scroll-wrapper",
        "bg-screening",
        "light-theme",
      ],
      backdropClass: "modal-background-blur",
      data: {
        fromAdvSearch: data ? this.fromAdvSearch : false,
        companyName: data ? this.entityCompanyName : "",
      },
    });
    this.fabAddCloseIfOpen();
  }

  // /** Show Right panel
  //  *  Author : kamal
  //  *  Date : 04-Nov-2019
  //  */
  // showRightPanel() {
  //   return this._sharedService.hideAlertRightPanel([true]);
  // }

  getAlertListPermssionIds(componentName: string): Promise<any> {
    if (componentName == 'sourceManagement') {
      return this._alertService.getPermissionIdsSourceMoniting().pipe(map(res => {
        return res[componentName]
      })).toPromise();

    } else {
      return this._alertService.getPermissionIds().pipe(map(res => {
        return res[componentName]
      })).toPromise();

    }
  }

  getLetters(name) {
    let value = name.replace(/<.*?>/g, '');
    return value.charAt(0) + value.charAt(1);
  }

  openCreateCaseModal(data) {
    let dialogReference = this.dialog.open(CreateCaseManagementComponent, {
      disableClose: false,
      panelClass: ['user-popover', 'custom-scroll-wrapper', 'bg-screening', 'light-theme', 'create-case-popup'],
      backdropClass: 'modal-background-blur',
      data: { "fromAdvSearch": data ? this.fromAdvSearch : false, "companyName": data ? this.entityCompanyName : '' }
    });
    this.fabAddCloseIfOpen();
  }
  openBatchCreateCaseModal(data) {
    const dialogRef = this.dialog.open(CaseBatchFileComponent, {
      disableClose: true,
      panelClass: ['user-popover', 'custom-scroll-wrapper', 'bg-screening', 'light-theme'],
      backdropClass: 'modal-background-blur',
      data: { operation: "case batch upload", fileSizeFromSystemSettings: GlobalConstants.systemSettings.maxFileSize }
    });
    this.fabAddCloseIfOpen();
  }

  mouseover(event) {
    this.cellMouseOver.emit(event);
  }

  activatePersonScreening() {
    this._commonService.activatescreeningDataSubject.next({
      screeningSelected: this.aggrid_table_utilty.screeningSelected,
      gridOptions: this.gridApi,
      rowSelected: this.storeAllRowSelected
    })
  }

  /** Checkbox in the first column
   *  Author : Ashen
   *  Date : 30-DEC-2020
   */
  toggleFab() {
    this.fabActionMenuActive = !this.fabActionMenuActive;
    
    const caseSearchPermissions = this.getDomainPermissions(this.caseWorkBenchPermissionJSON, 'caseCreationSearch');
    const caseBatchPermissions = this.getDomainPermissions(this.caseWorkBenchPermissionJSON, 'caseCreationBatch');

    const caseCreationSearchLevel = this._commonService.getPermissionStatusType(caseSearchPermissions);
    const caseCreationBatchLevel = this._commonService.getPermissionStatusType(caseBatchPermissions);

    if (caseCreationBatchLevel === 'none' && caseCreationSearchLevel === 'full') {

      this.openCreateCaseModal('');
      return;
    } else if (caseCreationBatchLevel === 'full' && caseCreationSearchLevel === 'none') {

      this.openBatchCreateCaseModal('');
      return;
    }

    this.fabAddOpenClose();
  }

  fabAddOpenClose(): void {
    let btnsfabElement = document.getElementById('btnsfab');
    let checkOpenClass = btnsfabElement.classList.contains('open');
    checkOpenClass ? btnsfabElement.classList.remove("open") : btnsfabElement.classList.add("open");
  }

  fabAddCloseIfOpen(): void {
    let btnsfabElement = document.getElementById('btnsfab');
    let checkOpenClass = btnsfabElement.classList.contains('open');
    if (checkOpenClass) {
      btnsfabElement.classList.remove("open")
    }
  }

  getDomainPermissions(value, arg) {
    let result;
    if (value && value.length > 0) {
      result = value.find(ele => ele.hasOwnProperty(arg));
    }
    if (result) {
      return result[arg];
    }
    else {
      return {}
    }
  }

  setFiltersFromSourceMangeDomainSearchChart() {
    this._sharedService.sourceMangeDomainSearchChartFilterObservable.subscribe(res => {
      if (res) {
        const assignFilter = this.gridApi.getFilterModel();
        let filters = assignFilter;
        filters['jurisdiction'] = {
          'filter': res,
          'type': 'contains',
          'filterType': 'text'
        }
        this.gridApi.setFilterModel(filters);
      }
    });
  }

  setFiltersFromAlertAgingChart() {
    this._sharedService.alertAgingChartFilterObservable.subscribe(res => {
      if (res) {
        if (this.gridApi) {
          let alertRiskIndicators = [];
          this._alertService.getAlertRiskIndicators.subscribe(indicators => {
            alertRiskIndicators = indicators
          })
          const assignFilter = this.gridApi.getFilterModel();
          let filters = assignFilter;
          if (res.country) {
            let selectedRisk = alertRiskIndicators.filter(indicator => indicator.code == res.country)
            if (selectedRisk.length > 0) {
              filters['aging'] = {
                'filter': selectedRisk[0].hours,
                'type': 'greaterThan',
                'filterType': 'number'
              }
            } else {
              delete filters['aging'];
            }
          }
          if (res.statusCode) {
            filters['status'] = {
              'filter': res.statusCode,
              'type': 'multiSelect',
              'filterType': 'text'
            }
          } else {
            delete filters['status']
          }
          this.gridApi.setFilterModel(filters);
        }
      }
    })
  }

  // hide floating filtes
  // Lanka
  // 2022-01-26
  hideFloatingFilters() {
    this.isFilterBarOpen = !this.isFilterBarOpen;
    const element = <HTMLElement>document.getElementsByClassName('ag-body-viewport')[0];
    element.style.marginTop = (element.style.marginTop == '-50px') ? '0px' : '-50px';
    this.gridOptions.floatingFilter = this.isFilterBarOpen;
    this.gridApi.refreshHeader()
  }

  // refresh case erelated entity table
  // Lanka
  // 2022-01-26
  refreshTable() {
    if (this.gridApi) {
      if (this.originalGirdTableName == "Attachment view") {
        this.gridApi.refreshCells();
        this.gridApi.redrawRows();
      }
      this.gridApi.setDatasource(this.datasource);
    }
  }

  // Should refreshs tables with client side row model
  // Denis Politykin
  // 2022-05-20
  refreshClientSideRowModelTable() {
    if (this.gridApi) {
      this.updateClientSideRowModelTable.emit();
    }
  }

  gridRefresh(): void {
    this.gridApi.setDatasource(this.datasource);
  }


  onFirstDataRendered() {
    let pageToNavigate = this._caseService.currentPage;
    if(this.gridApi && this.originalGirdTableName == "Alert list view"){
      pageToNavigate = this._alertService.currentPage;
    }
    if (this.gridApi) {
      this.gridApi.paginationGoToPage(pageToNavigate);
    }
  }

  afterDataLoad(event) {
    this.onFirstDataRendered()
  }

  isAuditShow(): void {
    this._caseService.showAuditPanelListObserver.subscribe(openState => {
      this.showAuditPanel = openState;
    })
  }
  bodyScroll(event:BodyScrollEvent):void{
    if(this.tableName == "Doucment repository"){
      this.tableTopPossition = document.getElementsByClassName("document-repository-table")[0].getElementsByClassName("ag-body-viewport")[0].clientHeight
      if(event.top + 300 >= this.tableTopPossition && this.recordsPerPage <= this.documentTotalCount && this.isScrolled){
        this.recordsPerPage = this.recordsPerPage + 15
        this.tableTopPossition = this.tableTopPossition + this.tableTopPossition
        this.isScrolled = false
        event.api.refreshInfiniteCache();
      }
      }
    }

    // @reason : Open new view create editor
    // @author : Ammshathwan
    // @date : 21 JUL 2022
    openCreateNewEditor(event: Event) {
      this.newViewName = ""
      this.isOpenCreateNewEditor = true;
      event.stopPropagation();
      event.preventDefault();
    }

    // @reason : Update input value for new view input
    // @author : Ammshathwan
    // @date : 21 JUL 2022
    onDoneCreateNewEdit(option: any) {
      this.isOpenCreateNewEditor = false;
    }

    // @reason : Clear create new input on click on close
    // @author : Ammshathwan
    // @date : 21 JUL 2022
    onCloseCreateNewEdit(event: Event) {
      this.isOpenCreateNewEditor = false;
      this.newViewName = ""
    }

    // @reason : set the default view
    // @author : Ammshathwan
    // @date : 20 JUL 2022
    setViewAsDefault():void{
      this.popoverData['isDefaultView'] = true;
       this.saveOrUpdateGridView('update', this.popoverData, this.popoverData.index)
       }

    // @reason : Update dropdown and view oprions
    // @author : Ammshathwan
    // @date : 21 JUL 2022
    getSelectedView(){
      let index
      if(this.selectedViewName == "Originalansicht"){
        this.selectedViewName = "Original View";
      }
      const currentView =  this.listOfSavedGridViews.find((view => view.gridViewName === this.selectedViewName))
      if(currentView){
        index = this.listOfSavedGridViews.indexOf(currentView)
      }
      this.viewDropDownControl.setValue(this.selectedViewName);
      this.sendDataToPopover(currentView ? currentView : {} , index ? index : 0)
    }

    // @reason : Find selected view is Original View
    // @author : Ammshathwan
    // @date : 21 JUL 2022
    isOriginalView():boolean{
      if(this.popoverData && this.popoverData.gridViewName === 'Original View'){
        return true
      }else{
        return false
      }
    }

    // @reason : toggle and reset update view states
    // @author : Ammshathwan
    // @date : 21 JUL 2022
    toggleUpdateViewButton():void{
      this.isViewUpdate = !this.isViewUpdate
      this.updateInputModal = ""
    }

    // @reason : Update new view name or show error message
    // @author : Ammshathwan
    // @date : 21 JUL 2022
    updateViewName():void{
      if(this.updateInputModal){
        this.saveOrUpdateGridView('update', this.popoverData, this.popoverData.index)
      }else{
        this._sharedService.showFlashMessage("View Name Can't be empty", 'danger');
      }
    }

    // @reason : Close update popup when opening  menu
    // @author : Ammshathwan
    // @date : 21 JUL 2022
    closeUpdateInput():void{
      this.isViewUpdate = false
    }

    /**
     * @description Closes the Download Dialog.
     * @Date 21 Oct 2022
     */
    closeDownloadModal(){
      this.downloadModalRef.close();
    }

    setCurrenttableStatus(tableName:string):void{
      if(!tableName) return null
      if(tableName.toLocaleLowerCase() === "case contacts view"){
        this.isCaseContactView = true;
      }else{
        this.isCaseContactView = false;
      }
    }

    getColumnsForExport():any{
      let orderedColumns = this.gridApi.gridOptionsWrapper.columnApi.getColumnState()
      let colIds = [];
      orderedColumns.forEach(element => {
      let key = element.colId;
        if (key) {
            let val = element.colId;
          if (val) {
            colIds.push(val);
          }
        }
      });

      if(this.isCaseContactView){
        colIds.forEach((element, i) => {
          if (element == 'relevant') {
            colIds.splice(i, 1);
          }
          if (element == 'case_id') {
            colIds.splice(i, 1);
          }
          if (element == 'contact_id') {
            colIds.splice(i, 1);
          }

        })
      }

      return colIds;
    }

    public trackByTitle(_, item): string {
      return item.title;
    }

    public trackByGridViewName(_, item): string {
      return item.gridViewName;
    }

    public trackByItem(_, item) {
      return item;
    }

    public trackByName(_, item): string {
      return item.name;
    }

    public trackByLabel(_, item): string {
      return item.name;
    }

    // @purpose : reset the export UI and funtionality to starting level
    // @author : ammshathwan
    // @date : 20 apr 2023
    onExportDialogClose():void{
      this.pdfData = null;
      this.pdfNameOfFileToDownload = null;
      this.pdfColumns = null;
      this.pdfRows = null;
      this.documentDownloaded = false;
      if(this.tableName !== 'Case list view') {
        let ele = (<HTMLInputElement>document.getElementById("alertExport"));
        ele.disabled = false;
        ele.innerHTML = this.getLanguageKey('ExportData');
      }
    }

    // @purpose : trigger export dialog on click opn export funtionality
    // @author : ammshathwan
    // @date : 20 apr 2023
    onExportDialogOpen():void{
      this.downloadModalRef = this.dialog.open(this.downloadModal, {
        width: '250px',
        minHeight: '240px',
        panelClass: ['confirm-dialog', 'light-theme'],
      });
    }

    onChangeWidget():void{
      this._caseService.observableWidgetVissibleChange.subscribe((isShowWidget:boolean) => {
        this.isShowWidget = isShowWidget;
      })
    }
}

/** Checkbox in the first column
 *  Author : Asheesh
 *  Date : 27-june-2019
 */
function isFirstColumn(params) {
  if (params && params.columnApi) {
    var displayedColumns = params.columnApi.getAllDisplayedColumns();
    var thisIsFirstColumn = displayedColumns[0] === params.column;
    return thisIsFirstColumn;
  } else {
    return false;
  }
}

