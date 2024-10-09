import { CommonConfirmationModalComponent } from './../common-confirmation-modal/common-confirmation-modal.component';
import { CaseFileNameComponent } from './../../custom-table-renderer/case-file-name/case-file-name.component';
import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild, AfterContentInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CaseDetailIconsComponent } from '../../custom-table-renderer/case-detail-icons/case-detail-icons.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AppConstants } from '@app/app.constant';
import * as moment from 'moment';
import { ScreeningBatchFileComponent } from '../screening-batch-file/screening-batch-file.component';
import { CaseManagementService } from '@app/modules/case-management/case-management.service';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { AgGridTableService } from '@app/common-modules/modules/ag-grid-table/ag-grid-table.service';
import { ConfirmationComponent } from '@app/common-modules/modules/confirmation/confirmation.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { filter, finalize, map, mergeMap, shareReplay, switchMap, take, takeUntil, timeout } from 'rxjs/operators';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { UserSharedDataService } from '../../../../../shared-services/data/user-shared-data.service';
import { UserService } from '@app/modules/user-management/services/user.service';
import { GeneralSettingsApiService } from '../../../../../modules/systemsetting/services/generalsettings.api.service';
import { CaseSharedDataService } from '../../../../../shared-services/data/case-shared-data.service';
import { combineLatest, from, Observable, ReplaySubject, Subscription, timer } from 'rxjs';
import { CaseRiskOverrideHistoryComponent } from '@app/modules/case-management/nested-views/case-dashboard/modals/case-risk-override-history/case-risk-override-history.component';
import { CaseRiskFactorComponent } from '@app/modules/case-management/nested-views/case-dashboard/modals/case-risk-factor/case-risk-factor.component';
import { CaseRiskOverrideComponent } from '@app/modules/case-management/nested-views/case-dashboard/modals/case-risk-override/case-risk-override.component';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { CommentsComponent } from '@app/modules/comments/comments/comments.component';
import { RelatedCase } from '@app/modules/case-management/models/case-list/related-case.model';
import { RelatedCaseData } from '@app/modules/case-management/models/case-list/related-case-data.model';
import { GridData } from '@app/common-modules/models/grid-data.model';
import { TagManagementApiService } from '@app/modules/systemsetting/services/tag-management.api.service';
import { SingleSelectDropdown } from '../../models/sigle-select-dropdown.model';
import { SingleSelectRendererComponentComponent } from '../../custom-table-renderer/single-select-renderer-component/single-select-renderer-component.component';
import { CaseRelatedEntityCountryComponent } from '../../custom-table-renderer/case-related-entity-country/case-related-entity-country.component';
import { CaseOverrideHistoryDialog } from '@app/modules/case-management/models/case-override/case-override-dialog-history.model';
import { CaseOverrideDialog } from '@app/modules/case-management/models/case-override/case-override-dialog.model';
import { DropDownData } from '@app/shared/model/drop-down-data.model';
import { AssociatedRecord } from '@app/modules/case-management/models/case-list/associated-record.model';
import { CaseTypesConstants } from '@app/common-modules/constants/case-types.constants';
import {CaseDetailInfoService} from '@app/common-modules/modules/ag-grid-table/modals/case-detail-info/case-detail-info.service';
import {TooltipRendererComponent} from "@app/common-modules/modules/ag-grid-table/custom-table-renderer/tooltip-renderer/tooltip-renderer.component";
import { Title } from '@angular/platform-browser';
import { CaseFiledsLoader } from '@app/modules/systemsetting/models/case-management/sub-tag.model';
import { CellRendererDateComponent } from '@app/common-modules/modules/ag-grid-table/cell-renderers/cell-renderer-date/cell-renderer-date.component';
import { CellClickedEvent } from 'ag-grid-community/dist/lib/events';
import { CaseManagementCaseCellRendererCellNameWithLoaderComponent } from './cell-renderer-cell-name-with-loader/cell-renderer-cell-name-with-loader.component';
import { DateTimeColumnComponent } from '../../cell-renderers/date-time-column/date-time-column.component';
import { ToggleRenderComponent } from '../../custom-table-renderer/toggle-render/toggle-render.component';
import {ThemeService} from "@app/shared-services/theme.service";
import { CustomHeaderColumnComponent } from '../../cell-renderers/custom-header-column/custom-header-column.component';
import { AgGridEvent } from 'ag-grid';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { User } from '../../../../../shared/user/user.model';
import { WINDOW } from '../../../../../core/tokens/window';

const datePipe = new DatePipe('en-US');

declare var recallKpiDataCaseManagement;

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD MMM YYYY',
  },
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD MMM YYYY',
    monthYearA11yLabel: 'MMM YYYY',
  },
};
@AutoUnsubscribe()
@Component({
  selector: 'app-case-detail-info',
  templateUrl: './case-detail-info.component.html',
  styleUrls: ['./case-detail-info.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CaseDetailInfoComponent implements OnInit {
  @ViewChild('caseRiskIcon', { static: false }) public caseRiskIcon: ElementRef;
  @ViewChild('caseComments', { static: false }) public caseComments: ElementRef;
  @ViewChild('caseRiskDropdown', { static: false }) public caseRiskDropdown: ElementRef;

  // For tabindex customized feature
  @ViewChild('selectCaseType', { static: false }) selectCaseType:any;  
  @ViewChild('selectUserGrp', { static: false }) selectUserGrp:any;  
  @ViewChild('selectAssignee', { static: false }) selectAssignee:any;  
  @ViewChild('selectRegion', { static: false }) selectRegion:any;  
  @ViewChild('selectProducts', { static: false }) selectProducts:any;  
  @ViewChild('selectBusinessPriority', { static: false }) selectBusinessPriority:any;  
  @ViewChild('selectInternalID', { static: false }) selectInternalID:any;  
  @ViewChild('selectCaseRisk', { static: false }) selectCaseRisk:any;  
  @ViewChild('selectPriority', { static: false }) selectPriority:any;  
  @ViewChild('selectNextRmdznDate', { static: false }) selectNextRmdznDate:any;  
  @ViewChild('selectStatusdd', { static: false }) selectStatusdd:any;  
  @ViewChild('selectReasons', { static: false }) selectReasons:any;  
  @ViewChild('selectDueDate', { static: false }) selectDueDate:any;  
  @ViewChild('remedationDate', { static: false }) remedationDate:any;  
  @ViewChild('requestedDate', { static: false }) requestedDate:any;  
  
  private commentListItemsCount: any;
  private rightPanelLoadCom: string = 'detailInfo';
  private subscriptions = new Subscription();
  private _onDestroy: ReplaySubject<boolean> = new ReplaySubject(1);
  private temp_assigneelist = [];
  selectedRemedationDateController: FormControl = new FormControl();
  selectedDueDateController: FormControl = new FormControl();
  showRightPanel = false;
  currentScreen: string = 'home';
  todayDate: Date = new Date();
  showDownloadLoader = false;
  columnDefs: any;
  rowData: any = [];
  selectedAssignee: any;
  selectedAssigneeID: any;
  selectedTenant: any;
  selectItemFromPriority: any = {};
  selectItemFromBusinessPriority: any = {};
  // requestedDate: any;
  selectedCasePriority: any;
  selectedCaseBusinessPriority: any;
  relatedEntriesLoaded = false;
  associatedRecordsLoaded = false;
  relatedCasesLoaded = false;
  assigneeList = [];
  tenantList: any = [];
  entityUrl: any;
  actualAssigneeOptions = [];
  entityId: any;
  gridOptions: any = {};
  finalResult: any = {};
  statusList: any;
  componentName = 'caseWorkbench';
  caseWorkBenchPermissionJSON: any = {};
  relatedEntriesOptions: any = {};
  associatedRecordOptions: any = {};
  caseContactsOptions: any = {};
  relatedCasesOptions: any = {};
  relatedCasesFirstTime = true;
  relatedEntriesRowData: any = [];
  entityList: any = [];
  relatedEntriesColDefs: any;
  isAttachmentLoaded = false;
  selectedDate: any;
  listCasePriorities: any = [];
  caseBusinessPriority: any = [];
  stateValue: any;
  casedetailUtilityObject = {
    dummyReason: [],
    reasonList: '',
    statusList: [],
    statusSelected: '',
    reasons: [],
    statusChange: '',
    reasonSelected: [],
    products: [],
    productSelected: []
  };
  showRelatedCasesOverlay: boolean = false;
  hasViewPermission: boolean = false;
  editModeStatus: boolean = false;
  currentUserDetails: any;
  filteredRegionStates: any = [];
  regionStatesArray: any = [];
  attachmentsCount: number = 0;
  isEndEvent: boolean = false;
  permissionIdsList: Array<any> = [];
  isHideAttachmentTab = true;
  caseAttachments: any[] = [];
  caseRisks: any = [];
  casePriorities: any = [];
  caseTypes: any = [];
  caseBusinessPriorityTypes: any = [];
  relatedCaseRiskTypes: RelatedCaseData;
  oldRiskId: any;
  selectedRisk;
  isOverride: boolean = false;
  selectedRiskType;
  data = { rowData: null };
  entity_info: any;
  caseTypeList;
  selectedCaseType;
  isCaseNameEdit: boolean;
  caseName: string;
  savedCaseName: string;
  selectedProductsList: any[] = []
  dueDate;
  caseRiskType: any = [
    {
      listItemId: 0,
      displayName: "New",
      icon: "bell",
      colorCode: "00ca98"
    },
    {
      listItemId: 1,
      displayName: "Recent",
      icon: "ban",
      colorCode: "f28618"
    }
  ];
  caseUnitType: any;
  caseUserGroups: any = [];
  jurisdictions: any = [];
  products: any = [];
  selectedUnit = {};
  defaultColDef = {};
  isAuditOpen: boolean;
  attachmentStatus: Array<SingleSelectDropdown> = [];
  caseModifiedBy: Array<SingleSelectDropdown> = [];
  caseCatergoryType: Array<SingleSelectDropdown> = [];
  caseTag: Array<SingleSelectDropdown> = [];
  caseType: Array<SingleSelectDropdown> = [];
  isOverrideRisk: boolean;
  isEndStatusEvent: boolean = true;
  dateFromat: string = "DD,MMM,YYYY"
  tagList;
  documentTags = [];
  temp_AssigneeGroup = [];
  typeOfRelations: any = [];
  countryList: any = [{}];
  rcAttachmentsCount = 0;
  aeAttachmentsCount = 0;
  currentCaseId: number;
  caseTypeId: number;
  checkIsOverrideRisk: boolean;
  alertID: number = 0;
  alertType: string = '';
  entityName: string = '';
  entityType: string = '';
  jurisdictionCode: string
  entityInfo: string = '';
  riskFactors: any = {};
  selectEntity: string = '';
  selectEntityURL: string = '';
  priorityValue: string = '';
  caseFiledsLoader:CaseFiledsLoader = {
    caseType:false,
    userGroup:false,
    assignee:false,
    regionUplift:false,
    products:false,
    businessPriority:false,
    customerInternalId:false,
    caseRisk:false,
    priority:false,
    nextRemedationDate:false,
    status:false,
    reasons:false,
    dueDate:false,
  };
  workFlowList:any[];
  userId: any;
  showFullPageLoader: boolean = false;
  showEntityDataLoader: boolean = false;
  isCaseContactLoad:boolean;
  caseContactsCount:Number;
  entityContactUserRole:any[]
  isLoggedUser:boolean;

  isRelatedCaseEntityAddHidden: boolean = false;
  private readonly activeUsers$: Observable<User[]> = this.userService.getActiveUsers$().pipe(shareReplay(1));

  constructor(
    private translateService: TranslateService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public _caseService: CaseManagementService,
    private _agGridTableService: AgGridTableService,
    private modalService: NgbModal,
    private _sharedServicesService: SharedServicesService,
    private userSharedDataService: UserSharedDataService,
    private tagManagementApiService: TagManagementApiService,
    public commonServicesService: CommonServicesService,
    private userService: UserService,
    private generalSettingsApiService: GeneralSettingsApiService,
    private caseSharedDataService: CaseSharedDataService,
    private renderer2: Renderer2,
    public router: Router,
    private caseDetailInfoService: CaseDetailInfoService,
    private titleService: Title,
    public themeService: ThemeService,
    @Inject(MAT_DATE_FORMATS) public date: any,
    @Inject(WINDOW) private readonly window: Window
  ) {
    this._sharedServicesService.dateFormatValue.subscribe((dateFormat) => {
      if (dateFormat) {
        date.parse.dateInput = dateFormat
        date.display.dateInput = dateFormat
        date.display.dateA11yLabel = dateFormat
      }
    });
  }

  ngOnInit() {
    this.activeUsers$.subscribe();
    this.getDocumentCategory();
    this.userId = GlobalConstants.systemSettings['ehubObject']['userId'];
    this.getAllEntityWorkFlowList();
    this.getOverRideRisk();
    this.route.url.subscribe(res => {
      this.currentCaseId = Number(res[1].path);
    });
    this.getLanguage();
    this.getFormart();
    this.route.params.subscribe(params => {
      localStorage.setItem("caseIdForBulkDownload", params['id']);
      this.getCaseDetails(params['id']).then(res => {
        if (res) {
          this.data.rowData = res;
          this.data.rowData['entity_info'] = (this.data.rowData && this.data.rowData.entity && this.data.rowData.entity.entity_info) ? JSON.parse(this.window.atob(this.data.rowData && this.data.rowData.entity && this.data.rowData.entity.entity_info)) : '';
          this.data.rowData['tenant'] = res.tenant;

          this.alertID = (this.data.rowData && this.data.rowData.alerts && this.data.rowData.alerts.length > 0 && this.data.rowData.alerts[0].alert_id) ? this.data.rowData.alerts[0].alert_id : 0;
          this.alertType = (this.data.rowData && this.data.rowData.alerts && this.data.rowData.alerts.length > 0 && this.data.rowData.alerts[0].alert_type) ? this.data.rowData.alerts[0].alert_type : '';
          this.entityId = (this.data.rowData && this.data.rowData.entity && this.data.rowData.entity.entity_id) ? this.data.rowData.entity.entity_id : '';
          this.entityName = (this.data.rowData && this.data.rowData.name) ? this.data.rowData.name : '';
          this.entityType = (this.data.rowData && this.data.rowData.entity && this.data.rowData.entity.entity_type) ? this.data.rowData.entity.entity_type : '';
          this.entityInfo = (this.data.rowData && this.data.rowData.entity && this.data.rowData.entity.entity_info) ? this.data.rowData.entity.entity_info : '';
          this.selectEntity = (this.data.rowData && this.data.rowData.entity && this.data.rowData.entity.select_entity) ? this.data.rowData.entity.select_entity : '';
          this.selectEntityURL = (this.data.rowData && this.data.rowData.entity && this.data.rowData.entity.select_entity_url) ? this.data.rowData.entity.select_entity_url : '';
          this.entityUrl = (this.data && this.data.rowData && this.data.rowData.entity.entity_url) ? this.data.rowData.entity.entity_url : '';
          this.selectedAssignee = this.data.rowData && this.data.rowData.assignee && this.data.rowData.assignee.screen_name ? this.data.rowData.assignee.screen_name : 'unassigned';
          (this.selectedUnit as any).id = this.data.rowData && this.data.rowData.assignee && this.data.rowData.assignee.group_id ? this.data.rowData.assignee.group_id : 'unassigned';
          this.riskFactors = (this.data.rowData &&  this.data.rowData.risk_factors) ? this.data.rowData.risk_factors: null;
          this.selectedAssigneeID = this.data.rowData && this.data.rowData.assignee && this.data.rowData.assignee.assigned_to ? this.data.rowData.assignee.assigned_to : 0;
          this.jurisdictionCode = this.data && this.data.rowData && this.data.rowData.jurisdiction_code ? this.data.rowData.jurisdiction_code : null

          this.loadCaseRiskData().then(()=>{
            this.loadCaseData();
          })

          if(this.window.location.href.includes("fromAlert=true")){
            this._caseService.onChangeCaseDetailsTabBehavior.next("associatedRecord");
            this.currentScreen = "associatedRecord";
            this.titleService.setTitle("Case Management");
          }
        }
      }
      );
      this.loadRegionUpLiftList();
    });
    this.updateCommentCount();
    this.setFilterOptions();
    this.caseDetailInfoService.toggleCaseDetailInfoLoader.subscribe((showLoader) => {
      this.showFullPageLoader = showLoader;
    });
  }


  getCaseUserGroups() {
    return new Promise((resolve) => {
      this._caseService.getAllUserGroupsAPI().subscribe((data: any) => {
        if (data && data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            this.caseUserGroups.push({
              listItemId: data[i].id,
              name: data[i].name,
              label: data[i].name
            });
          }
        }
        resolve("");
      });
    });
  }

  getJurisdictions() {
    return new Promise((resolve) => {
      this.commonServicesService.getJurdictionlist()
        .then((response: any) => {
          if (response) {
            this.jurisdictions = response;
            this.jurisdictions.map(val => {
              val['value'] = val.jurisdictionName;
              val['label'] = val.jurisdictionOriginalName;
            });
          }
          resolve("");
        })
        .catch(() => {
        })
    });
  }
  getProducts() {
    const caseFinacialProductsList = new Promise((resolve) => {
      this.commonServicesService.getCaseCreateData('Financial Product')
        .subscribe((response: any) => {
          if (response) {
            this.caseSharedDataService.setProductListData(response)
            response.map(val => {
              val['label'] = val.displayName;
              val['values'] = [];
              val['values']['icon'] = val.icon;
              val['values']['colorCode'] = val.colorCode;
            });
            this.products = response;
          }
          resolve("");

        }),
        () => {
        }
    });
    return caseFinacialProductsList;
  }

  async loadCaseData() {
    this.getEntityContactUserRole();
    this.getCaseListPermssionIds();
    this.getTenantData()
    this.getStatusList({ caseId: this.data.rowData.id, statusKey: this.data.rowData && this.data.rowData.status && this.data.rowData.status.key });

    this.casePriorities = await this.commonServicesService.getCaseCreateData('Case Priority').toPromise();

    this._caseService.reloadAttachmentsListObserver.pipe(takeUntil(this._onDestroy)).subscribe((data) => {
      if (data) {
        this.rowData = [];
        this.getAllAttachmentForACase();
      }
      this.subscriptions.unsubscribe();
    });

    this._caseService.onChangeCaseDetailsTabObserver.pipe(takeUntil(this._onDestroy)).subscribe((tab) => {
      if (tab) {
        this.currentScreen = tab;
        if (tab === 'relatedCases') {
          this.configRelatedCases();
        }
      }
    });

    this._caseService.attachmentsCount.pipe(takeUntil(this._onDestroy)).subscribe((data) => {
      if (data) {
        if (this.attachmentsCount > 0) {
          this.attachmentsCount = this.attachmentsCount - 1;
        }
      }
      this.subscriptions.unsubscribe();
    });
    this.getPermissionByStatus(this.data.rowData && this.data.rowData.status && this.data.rowData.status.key);
    this.getCaseType();
    this.setCaseTypeList();
    this.getCaseProducts();

    this._caseService.showDocDownloadLoader.subscribe(res => {
      if (res) {
        this.showDownloadLoader = true;
      } else {
        this.showDownloadLoader = false;
      }
    });

    this.stateValue = this.data && this.data.rowData && this.data.rowData.region_uplift ? this.data.rowData.region_uplift.display_name : '';
    if (this.data.rowData.assignee == null) {
      this.data.rowData.assignee = 'unassigned';
    }
    this.selectedCaseBusinessPriority = this.data && this.data.rowData && this.data.rowData.business_priority && this.data.rowData.business_priority.display_name ? this.data.rowData.business_priority.display_name : ''
    let fromAttachmentTab = false;
    this.getcurrentLoggedUser(fromAttachmentTab);

    let date = (this.data && this.data.rowData && this.data.rowData.remediation_date) ? this.data && this.data.rowData && this.data.rowData.remediation_date : '';
    this.selectedRemedationDateController.patchValue(moment(date))

    this.dueDate = (this.data && this.data.rowData && this.data.rowData.due_date) ? this.data && this.data.rowData && this.data.rowData.due_date : '';
    this.selectedDueDateController.patchValue(moment(this.dueDate))

    this.todayDate.setDate(this.todayDate.getDate());

    this.getAllAttachmentForACase();
    this.getAllRelatedEntries();
    await this.getReasons();
    this.configAssociatedRecord();
    this.configRelatedCases();
    this.getCaseContactsById();
  }

  buildAttachmentColumns() {
    this.columnDefs = [
      {
        'headerName': GlobalConstants.languageJson['ID'] !== undefined ? `${GlobalConstants.languageJson['ID']}` : 'ID',
        'headerComponentFramework' : CustomHeaderColumnComponent,
        'field': 'fileID',
        'colId': 'fileID',
        'width': 115,
        'headerCheckboxSelection': true,
        'checkboxSelection': true,
        'initialShowColumn': true,
        'floatingFilterComponent': 'textFilter',
        'floatingFilterComponentParams': {
          'suppressFilterButton': false,
          'colId': 'fileID',
          'options': this.caseType,
          'filterOptions': ['equals', 'lessThan', 'greaterThan'],
        },
        'suppressMenu': true,
        'headerComponentParams': {
          headerCheckboxSelection: true,
          label: GlobalConstants.languageJson['ID'] !== undefined ? `${GlobalConstants.languageJson['ID']}` : 'ID',
          tableName: "Attachment view"
        }
      },
      {
        'headerName': GlobalConstants.languageJson['File_Name'] !== undefined ? `${GlobalConstants.languageJson['File_Name']}` : 'File Name',
        'field': 'fileName',
        'colId': 'fileName',
        'width': 166,
        'cellRendererFramework': CaseFileNameComponent,
        'initialShowColumn': true,
        'floatingFilterComponent': 'textFilter',
        'floatingFilterComponentParams': {
          'suppressFilterButton': false,
          'colId': 'fileName',
          'options': this.caseType
        },
        'sortable': true
      },
      // commented below columns according to the comment in https://blackswantechnologies.atlassian.net/browse/AP-6833
      // {
      //   'headerName': GlobalConstants.languageJson['Type'] !== undefined ? `${GlobalConstants.languageJson['Type']}` : 'Type',
      //   'field': 'Type',
      //   'colId': 'Type',
      //   'width': 118,
      //   'initialShowColumn': true,
      //   'floatingFilterComponent': 'singleSelectFilterComponent',
      //   'floatingFilterComponentParams': {
      //     'suppressFilterButton': false,
      //     'colId': 'Type',
      //     'options': this.caseType
      //   },
      //   'sortable': true
      // },
      // {
      //   'headerName': GlobalConstants.languageJson['Status'] !== undefined ? `${GlobalConstants.languageJson['Status']}` : 'Status',
      //   'field': 'Status',
      //   'colId': 'Status',
      //   'width': 234,
      //   'initialShowColumn': true,
      //   'cellRendererFramework': DropDownColumnComponent,
      //   'dropDownData': {
      //     showIcon: true,
      //     showColor: true,
      //     dropDownList: this.getAlltableStatus()
      //   },
      //   'floatingFilterComponent': 'singleSelectFilterComponent',
      //   'floatingFilterComponentParams': {
      //     'suppressFilterButton': false,
      //     'colId': 'Status',
      //     'options': this.attachmentStatus
      //   },
      //   'sortable': true
      // },
      {
        'headerName': GlobalConstants.languageJson['Size_MB'] !== undefined ? `${GlobalConstants.languageJson['Size_MB']}` : `${this.translateService.instant('Size')} (MB)`,
        'field': 'size',
        'colId': 'size',
        'width': 118,
        'initialShowColumn': true,
        'floatingFilterComponent': 'textFilter',
        'floatingFilterComponentParams': {
          'suppressFilterButton': false,
          'colId': 'size',
          'options': this.caseType
        },
        'sortable': true
      },
      {
        'headerName': GlobalConstants.languageJson['Modified_By'] !== undefined ? `${GlobalConstants.languageJson['Modified_By']}` : this.translateService.instant('Modified By'),
        'field': 'updatedBy',
        'colId': 'updatedBy',
        'width': 132,
        'initialShowColumn': true,
        'floatingFilterComponent': 'singleSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'updatedBy',
          'options': []
        },
        'filterParams': {
          'filterOptions': ['equals']
        },
        'suppressMenu': true,
        'cellClassRules': {
          'remove-empty': function (params) {
            return params && params.value ? false : true;
          }
        },
        'sortable': true
      },
      {
        'headerName': GlobalConstants.languageJson['Modified_Date'] !== undefined ? `${GlobalConstants.languageJson['Modified_Date']}` : this.translateService.instant('Modified Date'),
        'field': 'timestamp',
        'colId': 'timestamp',
        'width': 165,
        'initialShowColumn': true,
        'floatingFilterComponent': 'dateFilterComponent',
        'floatingFilterComponentParams': {
          'opensProperty': 'left',
          'dropsPropertyType': 'down',
          'suppressAndOrCondition': true,
          'suppressFilterButton': false,
          'colId': 'timestamp',
        },
        'filterParams': {
          'filterOptions': ['inRange']
        },
        'sortable': true,
        cellRendererFramework: CellRendererDateComponent
      },
      {
        'headerName': GlobalConstants.languageJson['Expiry_Date'] !== undefined ? `${GlobalConstants.languageJson['Expiry_Date']}` : 'Expiry Date',
        'field': 'expiryDate',
        'colId': 'expiryDate',
        'width': 160,
        'initialShowColumn': true,
        'cellClass': 'expiry-column',
        'cellRendererFramework': DateTimeColumnComponent,
        'floatingFilterComponent': 'dateFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'opensProperty': 'left',
          'dropsPropertyType': 'down',
        },
        'filterParams': {
          'filterOptions': ['inRange'],
        },
        'suppressMenu': true,
        'cellClassRules': {
          'warning-icon': function (params) {
            if (params && params.data && params.data.status && params.data.notification) {
              return params.data.status !== 'expired';
            }
          },
          'text-label__mandatory': function (params) {
            if (params && params.data && params.data.status) {
              return params.data.status === 'expired';
            }
          },
        },
      },
      // commented below columns according to the comment in https://blackswantechnologies.atlassian.net/browse/AP-6833
      // {
      //   'headerName': GlobalConstants.languageJson['Catergory_Type'] !== undefined ? `${GlobalConstants.languageJson['Catergory_Type']}` : 'Catergory Type',
      //   'field': 'CatergoryType',
      //   'colId': 'CatergoryType',
      //   'width': 142,
      //   'initialShowColumn': true,
      //   'floatingFilterComponent': 'singleSelectFilterComponent',
      //   'floatingFilterComponentParams': {
      //     'suppressFilterButton': false,
      //     'colId': 'CatergoryType',
      //     'options': this.caseCatergoryType
      //   },
      //   'sortable': true
      // },
      // {
      //   'headerName': GlobalConstants.languageJson['Version'] !== undefined ? `${GlobalConstants.languageJson['Version']}` : 'Version',
      //   'field': 'Version',
      //   'colId': 'Version',
      //   'width': 118,
      //   'initialShowColumn': true,
      //   'floatingFilterComponent': 'textFilter',
      //   'floatingFilterComponentParams': {
      //     'suppressFilterButton': false,
      //     'colId': 'Version',
      //     'options': this.caseType
      //   },
      //   'sortable': true
      // },
      // {
      //   'headerName': GlobalConstants.languageJson['Tags'] !== undefined ? `${GlobalConstants.languageJson['Tags']}` : 'Tags',
      //   'field': 'Tags',
      //   'colId': 'Tags',
      //   'width': 230,
      //   'initialShowColumn': true,
      //   'cellRendererFramework': CaseTagsCellComponent,
      //   'floatingFilterComponent': 'singleSelectFilterComponent',
      //   'floatingFilterComponentParams': {
      //     'suppressFilterButton': false,
      //     'colId': 'Tags',
      //     'options': this.caseTag
      //   },
      //   'sortable': true
      // },
      {
        'headerName': '',
        'field': 'Operations',
        'colId': 'Operations',
        'initialShowColumn': true,
        'cellRendererFramework': CaseDetailIconsComponent,
        'customTemplateClass': 'Operations-icon',
        'filter': false,
        'sortable': true,
        'pinned': 'right',
        'minWidth': 230
      },
    ];
  }

  getUploadedDocument() {
    this.subscriptions.add(this._caseService.updateAttachmentTableData.subscribe(res => {
      if (res) {
        this.rowData = [];
        this.getAllAttachmentForACase();
        this.subscriptions.unsubscribe();
      }
    }));
  }

  getLastStatusReason(id) {
    this._caseService.getLastReason(id).subscribe((res: any) => {
      this.data.rowData['previous_status_reasons'] = res && res.previous_status_reasons;
      this.data.rowData['targetUpdates'] = ["previous_status_reasons"];
      this._agGridTableService.getUpdatedData(this.data.rowData);
    })
  }

  getcurrentLoggedUser(fromAttachmentTab) {
    this.userSharedDataService.getCurrentUserDetails()
      .subscribe(response => {
        if (response) {
          this.currentUserDetails = response;
        }
        else {
          this.fetchcurrentLoggedUser();
        }
        if (fromAttachmentTab) {
          this.currentScreen = 'relatedEntries';
        }
        else {
          this.editModeUpdate();
        }
      });
      this.checkAssignee();
  }

  fetchcurrentLoggedUser() {
    this.userService.getUserById(this.userId)
      .then((response: any) => {
        if (response.status && response.status == "success" && response && response.data) {
          this.userSharedDataService.setUserDetails(response);
          this.currentUserDetails = response;
        }
      });
  }

  getCaseListPermssionIds() {
    const permissions: any[] = this._sharedServicesService.getPermissions();
    if (permissions.length) {
      this.caseWorkBenchPermissionJSON = permissions[1].caseManagement.caseWorkbench;
      this.checkAttachmentTabPermissions();
    }
  }

  getCaseDetails(id: string): Promise<any> {
    return this._caseService.getCaseById(id).toPromise();
  }

  setCaseTypeList(): void {
    this._caseService
    .getfilteredTenantsList()
    .then((resp) => {
      if (resp.types.length>0) {
        this.caseTypeList = resp.types;
        if(this.data.rowData && this.data.rowData.type && this.data.rowData.type.display_name){
          this.selectedCaseType = this.caseTypeList.find((type: any) => type.displayName.toLowerCase() == (this.data.rowData && this.data.rowData.type && this.data.rowData.type.display_name && this.data.rowData.type.display_name.toLowerCase()))
        }
      } else {
        this.commonServicesService.getCaseCreateData("Case Type").subscribe((res: any) => {
          this.caseTypeList = res;
          this.selectedCaseType = this.caseTypeList.find((type: any) => type.displayName.toLowerCase() == (this.data.rowData && this.data.rowData.type && this.data.rowData.type.display_name && this.data.rowData.type.display_name.toLowerCase()))
        })
      }
    })
  }

  caseTypeSelected(caseType, caseInfo): void {
    if (caseType) {
      this.selectedCaseType = caseType;
      const body: any = {} as any;

      body.id = caseInfo.data && caseInfo.data.rowData.id && caseInfo.data.rowData.id ? caseInfo.data.rowData.id : '';
      body.type = caseType.listItemId;
      this.caseFiledsLoader.caseType = true;
      this._caseService.updateCaseAPINew(body).subscribe((response) => {
        if (response) {
          this.caseFiledsLoader.caseType = false;
          caseInfo.data.rowData.type.display_name = caseType.displayName;
          caseInfo.data.rowData.type.code = caseType.code;
          caseInfo.data.rowData['targetUpdates'] = ["type"];
          caseInfo.data.rowData['gridDataMapID'] = "id";
          this._agGridTableService.getUpdatedData(caseInfo.data.rowData);
          const message = this.getLanguageKey('Successfully updated') ? this.getLanguageKey('Successfully updated') : 'Successfully updated ';
          const messageKey = this.getLanguageKey('Case_Type') ? this.getLanguageKey('Case_Type') : 'Case Type'
          this._sharedServicesService.showFlashMessage(message + ' ' + messageKey, 'success');
        }
      },
        (err) => {
          this.caseFiledsLoader.caseType = false;
          const message = this.getLanguageKey('Something bad happened. please try again later.') ? this.getLanguageKey('Something bad happened. please try again later.') : 'Something bad happened. please try again later.'
          this._sharedServicesService.showFlashMessage(message, 'danger');
        })
    }
    this.selectCaseType.close();
  }

  /** Changing text to capitalize
   * Author : ganapathi
   * Date : 26-May-2020
   */
  capitalizeText(text) {
    if (text && text.length && text != null) {
      let val = text.toLowerCase();
      return val.charAt(0).toUpperCase() + val.substr(1);
    } else {
      return '';
    }
  }

  /** Getting related entries from selectEntityByUrl
   * Author : ganapathi
   * Date : 22-May-2020
   */
  getAllRelatedEntries() {
    if (this.data && this.data.rowData && this.data.rowData.entity.entity_info) {
      this.finalResult.ID = this.data.rowData.entity.entity_info.identifier ? this.data.rowData.entity.entity_info.identifier : "";
      this.finalResult['Type'] = this.data.rowData.entity.entity_info.case_entity_type && this.data.rowData.entity.entity_info.case_entity_type == 'personnel' ? 'Personnel' : 'Organization';
      this.finalResult['countryFlag'] = this.data.rowData.entity.entity_info.isDomiciledIn ? this.data.rowData.entity.entity_info.isDomiciledIn.toLowerCase() : '';
      this.finalResult['jurdictionName'] = this.data.rowData.entity.entity_info.isDomiciledIn ? this.data.rowData.entity.entity_info.isDomiciledIn : '';
      this.finalResult['Date'] = this.data.rowData.entity.entity_info.hasLatestOrganizationFoundedDate ? this.data.rowData.entity.entity_info.hasLatestOrganizationFoundedDate : '';
      this.finalResult['entityName'] = this.data.rowData.entity.entity_info['vcard:organization-name'] ? this.data.rowData.entity.entity_info['vcard:organization-name'] : '';
      this.finalResult.Country = this.data.rowData.entity.entity_info['mdaas:RegisteredAddress'] && this.data.rowData.entity.entity_info['mdaas:RegisteredAddress'].country ? this.data.rowData.entity.entity_info['mdaas:RegisteredAddress'].country : '';
      this.finalResult.Address = this.data.rowData.entity.entity_info['mdaas:RegisteredAddress'] && this.data.rowData.entity.entity_info['mdaas:RegisteredAddress'].fullAddress ? this.data.rowData.entity.entity_info['mdaas:RegisteredAddress'].fullAddress : '';
    } else {
      this.relatedEntriesLoaded = true;
    }

    if (this.finalResult.Date) {
      this.finalResult.Date = datePipe.transform(this.finalResult.Date, 'MMM d, y');
    }
    if (this.caseWorkBenchPermissionJSON.length) {
      this.caseRelationTypes();
    } else {
      const permissions: any[] = this._sharedServicesService.getPermissions();
      if (permissions.length) {
        this.caseWorkBenchPermissionJSON = permissions[1].caseManagement.caseWorkbench;
        this.caseRelationTypes();
      }
    }
  }

  getAllAttachmentForACase() {
    var caseID = (this.data && this.data.rowData) ? this.data.rowData.id : "";
    var params = {
      'references': [
        {
          'referenceId': caseID.toString(),
          'referenceType': 'case'
        }
      ]
    }
    this._caseService.getAttachMentListBycaseIDNew(params).subscribe((resp: any) => {
      var ObjRowdata = {};
      // resp.forEach((document) => {
      //   if (document && document.documents.length > 0) {
      //     var ReferrenceId = document.referenceId;
      //     var ReferrenceType = document.referenceType;
      //     this.caseAttachments = document.documents;
      if (resp && resp[0].documents.length) {
        var ReferrenceId = resp[0].referenceId;
        var ReferrenceType = resp[0].referenceType;
        this.caseAttachments = resp[0].documents;
        this.rowData = [];
        const tagMappingList$ = from(this.tagManagementApiService.getTagMappingList({ 'DocID': this.caseAttachments.map(val => val.fileId) }));
        combineLatest([tagMappingList$, this.activeUsers$]).subscribe(([tags, activeUsers]) => {
          this.tagList = tags;
          this.caseAttachments.forEach(val => {
            const user = activeUsers.find((user) => user.userId.toString() == val.updatedBy);
            ObjRowdata = {
              'ID': val.fileId ? val.fileId : "",
              'FileName': val.fileName ? val.fileName : "",
              'Size': val.size ? this.convertToMb(val.size) : "",
              'ModifiedDate': val.timestamp ? this.changeDateFormat(val.timestamp) : "",
              'ModifiedBy': user ? user.screenName : '',
              "FileType": val.format ? val.format : "",
              "Source": val.source ? val.source : "",
              "Path": val.filePath ? val.filePath : "",
              "CaseId": caseID,
              'Type': val.title ? val.title : "",
              'Status': val.status ? val.status : "",
              'CatergoryType': this.fetchCatergoryName(val.category),
              'Version': val.version ? val.version : "",
              'Tags': val.fileId ? this.fetchDocumentTags(val.fileId) : "",
              'ReferrenceId': ReferrenceId,
              'ReferrenceType': ReferrenceType,
              'ExpiryDate':  val.expiryDate ? val.expiryDate : ""
            }
            this.rowData.push(ObjRowdata);
          })
          this.canDeleteAttachmentsForStatus();
        })
      }
    })
  }

  fetchCatergoryName(catergoryId: string) {
    let catergory:any
    let catergoryType:string = ""
    if(catergoryId && GlobalConstants.categoryList && GlobalConstants.categoryList.length){
      catergory = GlobalConstants.categoryList.find((cat) => cat.listItemId == catergoryId);
      catergoryType = catergory ? catergory.displayName : "";
    }
    return catergoryType;
  }

  canDeleteAttachmentsForStatus() {
    this._sharedServicesService.getSystemSettings().then((settings) => {
      let caseAttachmentsPermission = this.getPermissionForColumn("caseAttachments");
      let editModeStatus = this.editModeStatus;
      let caseID = (this.data && this.data.rowData) ? this.data.rowData.id : "";
      let params = {
        "caseId": 'C' + caseID,
        "currentStatus": this.data.rowData && this.data.rowData.status && this.data.rowData.status.key,
        "workflowKey": this.getCaseWorkflow()
      };
      this._caseService.getStatusList(params).subscribe((resp: any) => {
        let isEndEvent: boolean;
        if (resp && resp.length) {
          isEndEvent = false;
        } else {
          isEndEvent = true;
        }
        this.rowData.forEach(function (element) {
          element.canDeleteAttachments = caseAttachmentsPermission && !isEndEvent && editModeStatus;
        });
        this.loadAttachmentTable();
      },  (err) => {
        this.rowData.forEach(function (element) {
          element.canDeleteAttachments = false;
        });
        this.loadAttachmentTable();
      });
    });
  }


  /** converting file size from kb to mb
   *  Author : ganapathi
   *  Date : 24-May-2020
   */
  convertToMb(sizeInKb) {
    let sizeInMB = (Number(sizeInKb)).toFixed(2);
    return sizeInMB;
  }

  /** changing date format to MMM d, y
   *  Author : ganapathi
   *  Date : 24-May-2020
   */
  changeDateFormat(value) {
    return datePipe.transform(value, 'dd.MM.yyyy , hh:mm a');
  }

  /** Getting all assignee list
   *  Author : ganapathi
   *  Date : 15-May-2020
   */
  getAssigneeList() {
    var activeUser: any;
    this.activeUsers$.subscribe((activeUsers: Array<any>) => {
      if (activeUsers) {
        activeUser = activeUsers.filter((val) => {
          if (val.statusId && val.statusId.code) {
            val['label'] = val.screenName;
            return val.statusId.code == "Active";
          }
        });

        let existValueUnAssigned = activeUser.every(function (e) {
          return e.label == "unassigned";
        });

        if (!existValueUnAssigned) {
          activeUser.unshift({ 'label': this.translateService.instant('Unassigned'), 'screenName': "unassigned", 'userId': "unassigned" , 'id': "unassigned" });
        }
        var temp_array = [];
        for(let i=1;i < activeUser.length;i++){
           for(let j=0; j < activeUser[i].usersGroups.length; j++){
            if((this.selectedUnit as any).id === activeUser[i].usersGroups[j].id){
              temp_array.push(activeUser[i]);
            }
           }
        }
        if (temp_array.length > 0) {
          this.assigneeList = temp_array;
        } else {
          this.assigneeList = activeUser;
        }
        this.temp_assigneelist = activeUser;
        this.actualAssigneeOptions = this.assigneeList;

        let assigneeId = this.data && this.data.rowData && this.data.rowData.assignee && this.data.rowData.assignee.assigned_to &&
        this.data.rowData.assignee.assigned_to ? this.data.rowData.assignee.assigned_to : "unassigned";
        this.getAllUserGroups(assigneeId);
        if(activeUser && (this.selectedUnit as any).id == "unassigned") {
          this.assigneeList = activeUser;
        }
      }
    })
  }

  /** Getting all permission level
   *  Author : saliya
   *  Date : 15-Sep-2020
   */
  getPermissionByStatus(statusKey) {
    if (statusKey) {
      this._caseService.getPermissionByStatus(statusKey).subscribe((resp: any) => {
        if (resp) {
          this.hasViewPermission = resp === 1 ? true : false;
        } else {
          this.hasViewPermission = true;
        }
      })
    }
  }

  /**Setting Related Entries Table Options
   * Author : ganapathi
   * Date : 05-May-2020
   */
  getRelatedEntriesData() {

    this.relatedEntriesColDefs = [
      {
        'headerName': GlobalConstants.languageJson['ID'] !== undefined ? `${GlobalConstants.languageJson['ID']}` : 'ID',
        'field': 'entity_id',
        'colId': 'entity_id',
        'width': 150,
        'initialShowColumn': true
      },
      {
        'headerName': GlobalConstants.languageJson['Type'] !== undefined ? `${GlobalConstants.languageJson['Type']}` : 'Type',
        'field': 'entity_type',
        'colId': 'entity_type',
        'width': 150,
        'initialShowColumn': true,
        'cellRenderer': function (params) {
          return (params && params.value) ? ( (params.value.toLowerCase() == "personnel" || params.value.toLowerCase() == "person" ) ?
                                                      '<span><span class="material-icons mr-2 f-22 align-sub color-gray">person</span>' + params.value + '</span>' :
                                                      '<span><span class="material-icons mr-2 f-22 align-sub color-gray">business</span>' + params.value + '</span>')
                                            : '<span><span class="material-icons mr-2 f-22 align-sub color-gray">business</span>Organization</span>';
        }
      },
      {
        'headerName': GlobalConstants.languageJson['Name'] !== undefined ? `${GlobalConstants.languageJson['Name']}` : 'Name',
        'field': 'entity_name',
        'colId': 'entity_name',
        'width': 150,
        'initialShowColumn': true,
        // 'onCellClicked': this.selectedAssigneeID == this.userId ? this.onRelatedEntityClick.bind(this) : '',
        'onCellClicked': (event:CellClickedEvent) => {
          if(event.data) this.getEntityURL(event.data.entity_url , event.data.entity_name, event.data.entity_type , event.data.country, true)
        },
        'cellClass': this.relatedEnitityNameStyle.bind(this),
        'cellRendererParams': {tooltip: 'To learn more visit Entity Page'},
        'cellRendererFramework': this.selectedAssigneeID == this.userId ? CaseManagementCaseCellRendererCellNameWithLoaderComponent : ''
      },
      {
        'headerName': GlobalConstants.languageJson['Type of Relation'] !== undefined ? `${GlobalConstants.languageJson['Type of Relation']}` : 'Type of Relation',
        'field': 'relation_type',
        'colId': 'relation_type',
        'width': 200,
        'cellRendererFramework': SingleSelectRendererComponentComponent,
        'cellEditor': "singleSelectRendererComponentComponent",
        'class': 'typeOfRelations',
        'selectBoxListData': this.typeOfRelations,
        'mainEntityId': this.data.rowData.entity.entity_id,
        'floatingFilterComponent': 'singleSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': false,
          'colId': 'relation_type',
          'options': this.typeOfRelations
        },
        'initialShowColumn': true,
      },
      {
        'headerName': GlobalConstants.languageJson['Country'] !== undefined ? `${GlobalConstants.languageJson['Country']}` : 'Country',
        'field': 'country',
        'colId': 'country_name',
        'width': 150,
        'initialShowColumn': true,
        'cellRendererFramework': CaseRelatedEntityCountryComponent,
        'countryList': this.countryList,
      },
      {
        'headerName': GlobalConstants.languageJson['Address'] !== undefined ? `${GlobalConstants.languageJson['Address']}` : 'Address',
        'field': 'address',
        'colId': 'address',
        'width': 250,
        'cellClass': 'dots-text py-4 d-inline',
        'initialShowColumn': true,
      },
      {
        'headerName': '',
        'field': 'rowOptions',
        'colId': 'rowOptions',
        'cellRendererFramework': CaseDetailIconsComponent,
        'mainEntityId': this.data.rowData.entity.entity_id,
        'selectBoxListData': this.typeOfRelations,
        'customTemplateClass': 'Operations-icon-related',
        'filter': false,
        'pinned': 'right',
        'initialShowColumn': true,
        'width': 50
      },
    ]

    this.relatedEntriesOptions = {
      'resizable': true,
      'tableName': 'Case related entity',
      'columnDefs': this.relatedEntriesColDefs,
      'rowData': this.rowData,
      'rowStyle': { 'border-bottom': '#424242 1px solid' },
      'rowSelection': 'multiple',
      'floatingFilter': true,
      'animateRows': true,
      'sortable': true,
      'tabs': false,
      'isShoHideColumns': true,
      'multiSortKey': 'ctrl',
      'componentType': 'case detail info',
      'defaultGridName': 'case detail',
      'changeBackground': "#ef5350",
      'rowModelType': 'infinite',
      'enableTableViews': true,
      'pagination': true,
      'cacheOverflowSize': 2,
      'cacheBlockSize': 10,
      'paginationPageSize': 10,
      'enableServerSideFilter': false,
      'enableServerSideSorting': false,
      'showBulkOperations': false,
      'filter': true,
      'instance': this._caseService,
      'method': "getCaseRelatedEntityNew",
      'dataModifier': "getRelatedEntity",
      'this': this,
      'caseId': this.data.rowData.id,
      'suppressPaginationPanel': false,
      'enableCheckBoxes': false,
      'enableTopSection': true,
      'rowHeight': 53,
      'hideGridTopRowsperpage': false,
      'alertType': this.data.rowData.alerts,
      'hideGridTopViewDropdownSection': false,
      'currentCaseName' : this.caseName,
    }
    this.relatedEntriesLoaded = true;
  }

  /*
 * @purpose: get Case type of relations to related entities.
 * @created: jan 21 2022
 * @author: Lanka
 */
  async caseRelationTypes() {
    this.typeOfRelations = await this.commonServicesService.getCaseCreateData('Relation Type').toPromise();
    this.countryList = await this.commonServicesService.getCaseCreateData('Jurisdictions').toPromise();
    this.casePriorities = await this.commonServicesService.getCaseCreateData('Case Priority').toPromise();
    this.caseTypes = await this.commonServicesService.getCaseCreateData('Case Type').toPromise();
    this.caseBusinessPriorityTypes = await this.commonServicesService.getCaseCreateData('Case Business Priority').toPromise();
    Promise.all([this.getJurisdictions(), this.getCaseUserGroups(), this.getProducts()]).then(() => {
      this.getRelatedEntriesData();
    });
  }

  navigateToCase(cellData) {
    if (cellData && cellData.data && cellData.data.caseId) {
      let alertCardUrl = 'element/case-management/case';
      if (GlobalConstants.systemSettings.openInNewtab) {
        const url = this.router.serializeUrl(
          this.router.createUrlTree([`${alertCardUrl}/${cellData.data.caseId}`])
        );
        this.window.open('#' + url, '_blank', 'noopener');
      } else {
        this.router.navigate([alertCardUrl, cellData.data.caseId]);
      }
    }
  }

  loadAttachmentTable() {
    this.buildAttachmentColumns();

    this.gridOptions = {
      'resizable': true,
      'tableName': 'Attachment view',
      'columnDefs': this.columnDefs,
      'rowData': this.rowData,
      'rowStyle': { 'border-bottom': '#424242 1px solid' },
      'rowSelection': 'multiple',
      'floatingFilter': true,
      'sortable': true,
      'animateRows': true,
      'tabs': false,
      'isShoHideColumns': true,
      'multiSortKey': 'ctrl',
      'componentType': 'case detail info',
      'downloadSelectedActionName': 'DOWNLOAD_SELECTED_CASE_ATTACHMENTS',
      'defaultGridName': 'case detail',
      'changeBackground': "#ef5350",
      'rowModelType': 'infinite',
      'enableTableViews': true,
      'paginationPageSize': 10,
      'pagination': true,
      'showBulkOperations': false,
      'filter': true,
      'suppressPaginationPanel': false,
      'enableCheckBoxes': false,
      'enableTopSection': true,
      'rowHeight': 53,
      'hideGridTopRowsperpage': false,
      'hideGridTopViewDropdownSection': false,
      'enableGridTopSection': true,
      'showHideColumnHeaders': true,
      "applyColumnDefOrder": true,
      'enableServerSideFilter': true,
      'enableServerSideSorting': false,
      'enableFilter': true,
      'ensureDomOrder': true,
      'instance': this._caseService,
      'this': this,
      'method': "getAttachMentListBycaseIDNew",
      'dataModifier': "getAttachment",
      "sortingOrder": ["asc", "desc"],
      'caseId': this.data.rowData.id,
      'cacheBlockSize': 10,
      'currentCaseName' : this.caseName,
    }
    // this.setFilterOptions();
    this.attachmentsCount = (this.rowData && this.rowData.length) ? this.rowData.length : 0;
    this.isAttachmentLoaded = true;
  }

  /** Opening attachment modal to upload documents
   * Author : ganapathi
   * Date : 05-May-2020
   */
  openUploadAttachementModal() {
    const dialogRef = this.dialog.open(ScreeningBatchFileComponent, {
      disableClose: true,
      panelClass: ['user-popover', 'custom-scroll-wrapper', 'bg-screening', 'light-theme'],
      backdropClass: 'modal-background-blur',
      data: {
        operation: "upload attachement",
        'caseId': (this.data && this.data.rowData && this.data.rowData.id) ? this.data.rowData.id : '',
        attachmentList: this.caseAttachments,
        'caseName': (this.data && this.data.rowData && this.data.rowData.name) ? this.data.rowData.name : ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUploadedDocument();
    })
  }

  /** Filtering options in assignee autocomplete
   *  Author : ganapathi
   *  Date : 15-May-2020
   */
  filterMyOptions(e) {
    if (e) {
      this.assigneeList = this.actualAssigneeOptions.filter(val => { if (val.label) { return val.label.toLowerCase().indexOf(e.toLowerCase()) != -1 } });
    }
    else {
      this.assigneeList = this.actualAssigneeOptions;
    }
  }

  /** On change of dropdown in Case Management (assignee) from Table
   *  Author : Amritesh
   *  Date : 26-may-2020
   */
  selectItem(e, ele, currentObj) {
    var paramsData: any = {};
    if (ele && currentObj) {
      paramsData.id = ele.data && ele.data.rowData.id && ele.data.rowData.id ? ele.data.rowData.id : "";
      paramsData.assignee = currentObj.userId ? currentObj.userId == "unassigned" ? 0 : currentObj.userId : 0;
      this.selectedAssigneeID = paramsData.assignee;
      this.caseFiledsLoader.assignee = true;
      this.relatedEntriesLoaded = false;

      this._caseService.updateCaseAPINew(paramsData).subscribe((resp) => {
        this.caseFiledsLoader.assignee = false;
        ele.data.rowData['assignee'] = currentObj.label ? currentObj.label : "";
        ele.data.rowData['targetUpdates'] = ["assignee"];
        ele.data.rowData['gridDataMapID'] = "id";
        this._agGridTableService.getUpdatedData(ele.data.rowData);

        recallKpiDataCaseManagement = true;
        this.getStatusList({ caseId: this.data.rowData.id, statusKey: this.data.rowData && this.data.rowData.status && this.data.rowData.status.key });
        this.getRelatedEntriesData();
        const message = this.getLanguageKey('Successfully updated') ? this.getLanguageKey('Successfully updated') : 'Successfully updated ';
        const messageKey = this.getLanguageKey('Assignee') ? this.getLanguageKey('Assignee') : 'Assignee'
        this._sharedServicesService.showFlashMessage(message + ' ' + messageKey, 'success');
      },
        (err) => {
          this.caseFiledsLoader.assignee = false;
          const message = this.getLanguageKey('Something bad happened. please try again later.') ? this.getLanguageKey('Something bad happened. please try again later.') : 'Something bad happened. please try again later.'
          this._sharedServicesService.showFlashMessage(message, 'danger');
        })
    }
    this.checkAssignee();
    this.selectAssignee.close();
  }

  checkAssignee(){
    this._caseService.setAssignedUser(this.selectedAssignee === this.currentUserDetails.screenName)
  }

  /** Edit Mode for popup
    * Author : ASHEN
    * Date : 13-NOV-2020.
   */
  editModeUpdate() {
    if (this.currentUserDetails && (this.selectedAssignee == this.currentUserDetails.screenName)) {
      this.isLoggedUser = true;
      this.editModeStatus = !this.isEndStatusEvent;
    } else {
      this.isLoggedUser = false;
      this.editModeStatus = false;
    }
    this._caseService.caseDeleteButtonBehavior.next(this.editModeStatus);
    this.canDeleteAttachmentsForStatus();
    this.getRelatedEntriesData();
    this._caseService.updateAttachmentTableData.next(true);
  }

  checkEndStatus(selectedStatus){
    this._caseService.getEndStatus(this.getCaseWorkflow()).subscribe(resp=>{
      const item = resp.find(item=>item.id===selectedStatus);
      this.isEndStatusEvent = Boolean(item && item.type === 'EndNoneEvent');
      this.editModeUpdate();
    })
  }

  onEditCaseName(): void {
    this.isCaseNameEdit = true;
    this.caseName = this.data && this.data.rowData && this.data.rowData.name ? this.data.rowData.name : ''
    this.savedCaseName = this.data && this.data.rowData && this.data.rowData.name ? this.data.rowData.name : ''
  }

  onSaveCaseName(rowData: any): void {
    this.caseName = this.removeWhiteSapce(this.caseName);
    if (this.caseName.length === 0) {
      this.caseName = this.savedCaseName;
      const message = 'Enter a Valid Case Name';
      this._sharedServicesService.showFlashMessage(message, 'danger');
      this.isCaseNameEdit = false;
      return;
    }
    const caseNameParams = {
      "caseName": this.removeWhiteSapce(this.caseName),
      "caseId": this.data.rowData.id
    }
    var paramsData: any = {};
    paramsData.id = rowData && rowData.id ? rowData.id : "";
    paramsData.name = this.caseName ? this.removeWhiteSapce(this.caseName) : "";
    this._caseService.updateCaseAPINew(paramsData).subscribe((resp) => {
      this.data.rowData.name = this.caseName ? this.removeWhiteSapce(this.caseName) : "";
      rowData['targetUpdates'] = ["name"];
      rowData['gridDataMapID'] = "id";
      this._agGridTableService.getUpdatedData(rowData);
      recallKpiDataCaseManagement = true;
      this.isCaseNameEdit = false;
      const message = this.getLanguageKey('Successfully updated') ? this.getLanguageKey('Successfully updated') : 'Successfully updated ';
      const messageKey = this.getLanguageKey('Case_Name') ? this.getLanguageKey('Case_Name') : 'Case Name';
      this._sharedServicesService.showFlashMessage(message + ' ' + messageKey, 'success');
    },
      (err) => {

        if (err && err.error && err.error.detail) {
          const message = this.getLanguageKey(err.detail) ? this.getLanguageKey(err.detail) : 'Case with such name already exists';
          this._sharedServicesService.showFlashMessage(message, 'danger');
        } else {
          const message = this.getLanguageKey('Something bad happened. please try again later.') ? this.getLanguageKey('Something bad happened. please try again later.') : 'Something bad happened. please try again later.'
          this._sharedServicesService.showFlashMessage(message, 'danger');
        }
      });
  }

  onCancelCaseName(): void {
    this.caseName = ""
    this.isCaseNameEdit = false;
  }

  updateProducts(rowData): void {
    var selctedAllProduct = []
    var products = this.casedetailUtilityObject.productSelected.reduce((productIDs, displayName) => {
      this.casedetailUtilityObject.products.forEach(product => {
        if (displayName && product && product.displayName && product.listItemId && displayName === product.displayName) {
          productIDs.push(product.listItemId)
          selctedAllProduct.push(product.displayName)
        }
      });
      return productIDs;
    }, []);

    var paramsData: any = {};
    paramsData.id = rowData && rowData.id ? rowData.id : "";
    paramsData.products = products ? products : "";
    this.caseFiledsLoader.products = true;
    this._caseService.updateCaseAPINew(paramsData).subscribe((resp) => {
      this.caseFiledsLoader.products = false;
      this.data.rowData.products = this.casedetailUtilityObject.products ? this.casedetailUtilityObject.products : "";
      rowData['targetUpdates'] = ["products"];
      rowData['gridDataMapID'] = "id";
      this._agGridTableService.getUpdatedData(rowData);
      recallKpiDataCaseManagement = true;
      const message = this.getLanguageKey('Successfully updated') ? this.getLanguageKey('Successfully updated') : 'Successfully updated ';
      const messageKey = this.getLanguageKey('Products') ? this.getLanguageKey('Products') : 'Products'
      this._sharedServicesService.showFlashMessage(message + ' ' + messageKey, 'success');
    },
      (err) => {
        this.caseFiledsLoader.products = false;
        const message = this.getLanguageKey('Something bad happened. please try again later.') ? this.getLanguageKey('Something bad happened. please try again later.') : 'Something bad happened. please try again later.'
        this._sharedServicesService.showFlashMessage(message, 'danger');
      });
    this.selectProducts.close();
  }

  getCaseProducts(): void {
    this.caseSharedDataService.getProductListData().subscribe(productsList => {
      if (productsList.length) {
        this.casedetailUtilityObject.products = productsList ? productsList : []
      }
      else {
        this.commonServicesService.getCaseCreateData('Financial Product')
          .subscribe((response: any) => {
            this.casedetailUtilityObject.products = response ? response : []
          })
      }
    })
    this.getSelectedProduct()
  }

  getSelectedProduct(): void {
    if (this.data && this.data.rowData && this.data.rowData.products) {
      let productList: any = [];
      this.data.rowData.products.forEach(element => {
        if (element) {
          productList.push(element.display_name)
        }
      });

      if (productList.length) {
        this.casedetailUtilityObject.productSelected = productList;
      }
    }
  }

  updateDueDate(event, rowData): void {
    if (event && event.value && rowData) {
      const dueDate = moment(event.value).format();
      if (dueDate) {
        this.caseFiledsLoader.dueDate = true;
        var paramsData: any = {};
        paramsData.id = rowData && rowData.id ? rowData.id : "";
        paramsData.due_date = dueDate ? dueDate : "";
        this._caseService.updateCaseAPINew(paramsData).subscribe((resp) => {
          this.data.rowData.requested_date = dueDate ? dueDate : "";
          rowData['targetUpdates'] = ["due_date"];
          rowData['gridDataMapID'] = "id";
          this._agGridTableService.getUpdatedData(rowData);
          recallKpiDataCaseManagement = true;
          const message = this.getLanguageKey('Successfully updated') ? this.getLanguageKey('Successfully updated') : 'Successfully updated ';
          const messageKey = this.getLanguageKey('Due_Date') ? this.getLanguageKey('Due_Date') : 'Due Date'
          this._sharedServicesService.showFlashMessage(message + ' ' + messageKey, 'success');
          this.caseFiledsLoader.dueDate = false;
        },
          (err) => {
            const message = this.getLanguageKey('Something bad happened. please try again later.') ? this.getLanguageKey('Something bad happened. please try again later.') : 'Something bad happened. please try again later.'
            this._sharedServicesService.showFlashMessage(message, 'danger');
            this.caseFiledsLoader.dueDate = false;
          });
      }
    }
  }

  updateNextRemidiationDate(event, rowData): void {
    if (event && event.value && rowData) {
      this.caseFiledsLoader.nextRemedationDate = true;
      const nextRemidiationDate = moment(event.value).format();
      if (nextRemidiationDate) {
        var paramsData: any = {};
        paramsData.id = rowData && rowData.id ? rowData.id : "";
        paramsData.remediation_date = nextRemidiationDate ? nextRemidiationDate : "";
        this._caseService.updateCaseAPINew(paramsData).subscribe((resp) => {
          this.data.rowData.remediation_date = nextRemidiationDate ? nextRemidiationDate : "";
          rowData['targetUpdates'] = ["remediation_date"];
          rowData['gridDataMapID'] = "id";
          this._agGridTableService.getUpdatedData(rowData);
          recallKpiDataCaseManagement = true;
          const message = this.getLanguageKey('Successfully updated') ? this.getLanguageKey('Successfully updated') : 'Successfully updated ';
          const messageKey = this.getLanguageKey('Next Remedation Date') ? this.getLanguageKey('Next Remedation Date') : 'Next Remedation Date'
          this._sharedServicesService.showFlashMessage(message + ' ' + messageKey, 'success');
          this.caseFiledsLoader.nextRemedationDate = false;
        },
          (err) => {
            const message = this.getLanguageKey('Something bad happened. please try again later.') ? this.getLanguageKey('Something bad happened. please try again later.') : 'Something bad happened. please try again later.'
            this._sharedServicesService.showFlashMessage(message, 'danger');
            this.caseFiledsLoader.nextRemedationDate = false;
          });
      }
    }
  }


  /** Related enitity hyperlink styles
   *  Author : ASHEN
   *  Date : 13-NOV-2020.
   */
  relatedEnitityNameStyle() {
    const entityNamePermission = this.getPermissionForColumn('relatedEntities')
    if (this.currentUserDetails && (this.selectedAssignee == this.currentUserDetails.screenName)) {
      if (entityNamePermission) {
        return 'text-blue c-pointer';
      } else if (!entityNamePermission) {
        return 'c-ban';
      }
    }
    return '';
  }

  /** check if assignee is the current user
   *  Author : ASHEN
   *  Date : 13-NOV-2020.
   */
  isAssigneeCurrentUser() {
    if (this.currentUserDetails && (this.selectedAssignee == this.currentUserDetails.screenName)) {
      return true;
    }
    return false;
  }


  /** Getting selected date and Update the table in case List
   *  Author : ganapathi.
   *  Date : 26-May-2020.
   */
  // onDateSelected(value, rowNode) {
  //   this.selectedDate = datePipe.transform(value, 'MMM d, y');
  //   var paramsData: any = {};
  //   if (this.selectedDate && rowNode) {
  //     paramsData.id = rowNode && rowNode.caseId ? rowNode.caseId : "";
  //     paramsData.remediation_date = this.selectedDate;
  //     this._caseService.updateCaseAPINew(paramsData).subscribe((resp) => {
  //       rowNode['NextRemediationDate'] = this.selectedDate;

  //       rowNode['targetUpdates'] = ["NextRemediationDate"];
  //       rowNode['gridDataMapID'] = "caseId";
  //       this._agGridTableService.getUpdatedData(rowNode);

  //     })
  //   }
  // }

  /** Getting selected status and Update the table in case List
   *  Author : ganapathi.
   *  Date : 26-May-2020.
   */
  selectStatus(name, key, ele, currentObj) {
    var paramsData: any = {};
    if (ele && key) {
      paramsData.caseId = (ele.data && ele.data.rowData.id) ? ele.data.rowData.id : "";
      paramsData.status = (key) ? key : "";
      this._caseService.updateCaseAPINew(paramsData).subscribe(() => {
        ele.data.rowData['status'] = (name) ? name : "";
        ele.data.rowData['status']['key'] = (key) ? key : "";

        ele.data.rowData['targetUpdates'] = ["status", "status.key"];
        ele.data.rowData['gridDataMapID'] = "id";
        this._agGridTableService.getUpdatedData(ele.data.rowData);
        recallKpiDataCaseManagement = true;
      })
    }
  }

  /** Getting selected status and Update the table in case List below function is writtren as above was not Clear to Ram
   *  Author : ganapathi.
   *  Date : 26-May-2020.
   */
  selectStatusNew(ele) {
    var paramsData: any = {};
    if (ele) {
      this.caseFiledsLoader.status = true;
      paramsData.id = (this.data && this.data.rowData && this.data.rowData.id) ? this.data.rowData.id : "";
      paramsData.status = ele.key ? ele.key : "";
      this._caseService.updateCaseAPINew(paramsData).toPromise().then((res) => {
        this.editModeUpdate();
        setTimeout(()=>{
          this.editModeStatus = false;
        },1000)
        this.data.rowData['status']['value'] = ele.name ? ele.name : "";
        this.data.rowData['status']['key'] = ele.key ? ele.key : "";

        this.data.rowData['targetUpdates'] = ["status", "assignee"];
        this.data.rowData['gridDataMapID'] = "id";
        this._agGridTableService.getUpdatedData(this.data.rowData);
        recallKpiDataCaseManagement = true;
        this.getLastStatusReason(this.data && this.data.rowData && this.data.rowData.id);
        this.statusList = [ele];
        let statusStr =  this.getLanguageKey('Status') ? this.getLanguageKey('Status') : "Status";
        let message = this.getLanguageKey('Successfully updated') ?
        (this.getLanguageKey('Successfully updated') + " "+ statusStr )
        :'Successfully updated'  + " "+ statusStr;
        this._sharedServicesService.showFlashMessage(message, 'success');
        this.caseFiledsLoader.status = false;
        if(res){
          if(res.message == "Status updated successfully" && res.success == "true"){
            this.selectedAssignee = 'unassigned';
          }
        }
      },
        (err) => {
          this.resetStatusValue()
          const message = this.getLanguageKey('Something bad happened. please try again later.') ? this.getLanguageKey('Something bad happened. please try again later.') : 'Something bad happened. please try again later.'
          this._sharedServicesService.showFlashMessage(message, 'danger');
          this.caseFiledsLoader.status = false;
          this.editModeStatus = !this.isEndStatusEvent;
        })
    }
  }

  getStatusList(currentCase: any) {
    if (currentCase) {
      this._sharedServicesService.getSystemSettings().then((settings) => {
        let paramsData: any = {};
        paramsData.caseId = 'C' + currentCase.caseId;
        paramsData.currentStatus = currentCase.statusKey;
        paramsData.workflowKey = this.getCaseWorkflow();
        this._caseService.getStatusList(paramsData).subscribe((response: any) => {
          if (response && response.length) {
            this.statusList = this.statusList.filter(function (value) {
              return value.key.toLowerCase() === paramsData.currentStatus.toLowerCase();
            });
            response.forEach(element => {
              var ListIndex = this.statusList.findIndex((val) => val.name == element.name);
              if (ListIndex == -1) {
                this.statusList.push(element)
              }
            });
          }
          this.statusList.forEach(element => {
            var statusIndex = this.casedetailUtilityObject.statusList.findIndex((val) => val.status_key == element.key);
            if (statusIndex !== -1 && element && element.status_reasons) {
              element.status_reasons = this.casedetailUtilityObject.statusList[statusIndex].reasons;
              element.status_reasons.forEach((val) => {
                if (val && val.status_reasons_id && this.data && this.data.rowData && this.data.rowData.status_reasons) {
                  val.checked = (this.data.rowData.status_reasons).indexOf(val.status_reasons_id) !== -1 ? true : false;
                }
              })
            } else {
              element.status_reasons = [];
            }
          });

          this.checkEndStatus(paramsData.currentStatus)

        }, err =>{
          if(currentCase.fromUI){
            const message = this.getLanguageKey('Error occurred while loading Available Status List') ? this.getLanguageKey('Error occurred while loading Available Status List') : 'Error occurred while loading Available Status List'
            this._sharedServicesService.showFlashMessage(message, 'danger');
          }
        })
      });
    }
  }

  // @reason : Get selected case work flow through entity workflow
  // @author: Ammshathwan
  // @date: Sep 02 2022
  getCaseWorkflow(){
    if (this.workFlowList && this.workFlowList.length > 0) {
      let caseWorkflowSettings = this.workFlowList.filter(workFlow => workFlow.entityName === 'Case');
      if (caseWorkflowSettings.length > 0 && caseWorkflowSettings[0].workflowModelKey) {
        return caseWorkflowSettings[0].workflowModelKey;
      }
    }
    return '';
  }

  /*
   * @purpose: get Case Priorities.
   * @created: may 07 2020
   * @author: Amritesh
   * params : none
   * return : none
   */
  casePrioritiesList() {
    this.commonServicesService.getCaseCreateData('Case Priority')
      .subscribe((response: any) => {
        if (response) {
          this.listCasePriorities = response;
          this.selectItemFromPriority = this.listCasePriorities.find((type: any) => type.displayName.toLowerCase() == (this.data.rowData && this.data.rowData.priority && this.data.rowData.priority.display_name && this.data.rowData.priority.display_name.toLowerCase()))
          this.priorityValue = this.selectItemFromPriority && this.selectItemFromPriority.displayName ? this.selectItemFromPriority.displayName : '';
        }
      }),
      (err) => {
      }
  }

  caseBusinessPriorityList() {
    this.commonServicesService.getCaseCreateData('Case Business Priority')
      .subscribe((response: any) => {
        if (response) {
          this.caseBusinessPriority = response;
          this.selectItemFromBusinessPriority = response.filter(val => {
            if (val.displayName && this.data && this.data.rowData && this.data.rowData.business_priority) {
              return val.displayName.toLowerCase() == this.data && this.data.rowData && this.data.rowData.business_priority.display_name.toLowerCase()
            }
          })[0]
        }
      }),
      (err) => {
      }
  }

  /** On change of dropdown in Case Management (Priority) from Table
   *  Author : Amritesh
   *  Date : 22-June-2020
   */
  getSelectedPriority(e, ele, currentObj) {
    this.selectItemFromPriority = currentObj;
    var paramsData: any = {};
    this.caseFiledsLoader.priority = true;
    if (ele && currentObj) {
      paramsData.id = ele.data && ele.data.rowData.id && ele.data.rowData.id ? ele.data.rowData.id : "";
      paramsData.priority = currentObj.listItemId ? currentObj.listItemId : "";
      this._caseService.updateCaseAPINew(paramsData).subscribe((resp) => {
        ele.data.rowData['priority'].display_name = currentObj.displayName ? currentObj.displayName : "";
        ele.data.rowData['priority'].code = currentObj.code ? currentObj.code : "";

        ele.data.rowData['targetUpdates'] = ["priority"];
        ele.data.rowData['gridDataMapID'] = "id";
        this._agGridTableService.getUpdatedData(ele.data.rowData);
        const message = this.getLanguageKey('Successfully updated') ? this.getLanguageKey('Successfully updated') : 'Successfully updated ';
        const messageKey = this.getLanguageKey('Priority') ? this.getLanguageKey('Priority') : 'Priority'
        this._sharedServicesService.showFlashMessage(message + ' ' + messageKey, 'success');
        this.caseFiledsLoader.priority = false;
      },
        (err) => {
          const message = this.getLanguageKey('Something bad happened. please try again later.') ? this.getLanguageKey('Something bad happened. please try again later.') : 'Something bad happened. please try again later.'
          this._sharedServicesService.showFlashMessage(message, 'danger');
          this.caseFiledsLoader.priority = false;
        })
    }
    this.selectPriority.close();
  }

  getSelectItemBusinessPriority(e, ele, currentObj) {
    this.selectItemFromBusinessPriority = currentObj;
    var paramsData: any = {};
    if (ele && currentObj) {
      this.caseFiledsLoader.businessPriority = true;
      paramsData.id = ele.data && ele.data.rowData.id && ele.data.rowData.id ? ele.data.rowData.id : "";
      paramsData.business_priority = currentObj.listItemId ? currentObj.listItemId : "";
      this._caseService.updateCaseAPINew(paramsData).subscribe((resp) => {
        this.caseFiledsLoader.businessPriority = false;
        if(ele.data.rowData['business_priority'] == null){
           ele.data.rowData['business_priority'] = {};
        }
        ele.data.rowData['business_priority']['display_name'] = currentObj.displayName ? currentObj.displayName : "";
        ele.data.rowData['business_priority']['code'] = currentObj.code ? currentObj.code : "";

        ele.data.rowData['targetUpdates'] = ["business_priority"];
        ele.data.rowData['gridDataMapID'] = "id";
        this._agGridTableService.getUpdatedData(ele.data.rowData);
        const message = this.getLanguageKey('Successfully updated') ? this.getLanguageKey('Successfully updated') : 'Successfully updated ';
        const messageKey = this.getLanguageKey('Case Business Priority') ? this.getLanguageKey('Case Business Priority') : 'Case Business Priority'
        this._sharedServicesService.showFlashMessage(message + ' ' + messageKey, 'success');
      },
        (err) => {
          this.caseFiledsLoader.businessPriority = false;
          const message = this.getLanguageKey('Something bad happened. please try again later.') ? this.getLanguageKey('Something bad happened. please try again later.') : 'Something bad happened. please try again later.'
          this._sharedServicesService.showFlashMessage(message, 'danger');
        })
    }
    this.selectBusinessPriority.close();
  }

  async getReasons(): Promise<void> {
    try {
      this.statusList = [
        { name: this.data.rowData && this.data.rowData.status && this.data.rowData.status.value, key: this.data.rowData && this.data.rowData.status && this.data.rowData.status.key },
      ];
      this.casedetailUtilityObject.statusSelected = this.data.rowData && this.data.rowData.status && this.data.rowData.status.value;
      if (!this.caseSharedDataService.statusReasonsList) {
        const reasons: any = await this.generalSettingsApiService.getAllStatusReasons(
          null
        );
        if (reasons) {
          this.caseSharedDataService.statusReasonsList = reasons;
        }
      }

      if (this.caseSharedDataService.statusReasonsList) {
        if (this.caseSharedDataService.statusReasonsList && this.caseSharedDataService.statusReasonsList.result) {
          this.casedetailUtilityObject.statusList = this.caseSharedDataService.statusReasonsList.result.filter(
            (val) => val.entity_name === 'case'
          );
        }
        if (this.data.rowData && this.data.rowData.status && this.data.rowData.status.key) {
          const index = this.casedetailUtilityObject.statusList.findIndex(
            (val) => val.status_key === this.data.rowData.status.key
          );
          if (index !== -1) {
            const findIndexStatusList = this.statusList.findIndex(
              (val) =>
                val.key ===
                this.casedetailUtilityObject.statusList[index].status_key
            );
            if (findIndexStatusList !== -1) {
              this.statusList[
                findIndexStatusList
              ].name = this.casedetailUtilityObject.statusList[
                index
              ].status_value;
            }
            this.casedetailUtilityObject.statusSelected = this.casedetailUtilityObject.statusList[
              index
            ].status_value;
            this.casedetailUtilityObject.reasons = this.casedetailUtilityObject.statusList[
              index
            ].reasons;
            this.casedetailUtilityObject.reasons.forEach((val) => {
              val.checked =
                this.data && this.data.rowData && this.data.rowData.status_reasons.indexOf(val.reason_id) !== -1
                  ? true
                  : false;
            });
            this.casedetailUtilityObject.reasonSelected = this.casedetailUtilityObject.reasons
              .filter((val) => val.checked)
              .map((val) => val.reason);
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }

  statusSelected(item) {
    if (item.key) {
      this.getPermissionByStatus(item.key);
    }
    if (!this.casedetailUtilityObject.statusChange || (this.casedetailUtilityObject.statusChange.toLowerCase() !== item.name.toLowerCase())) {
      this.casedetailUtilityObject.statusChange = item.status_value ? item.status_value : item.name ? item.name : '';
      var openModal = this.casedetailUtilityObject.reasons.some((arrVal) => arrVal.checked == true);
      if (!openModal) {
        let currentModalRef = this.modalService.open(ConfirmationComponent, { windowClass: 'bst_modal alert-card-modal entity-identification-modal light-theme confirmMe z-9999' });
        currentModalRef.componentInstance.statusComment = 'ExistStatusReasons';
        currentModalRef.componentInstance.emitData.subscribe(data => {
          if (data) {
            if (data == 'OK') {
              if (item && item.name) {
                var index = this.casedetailUtilityObject.statusList.findIndex((val) => val.status_value.toLowerCase() == item.name.toLowerCase());
                if (index !== -1) {
                  this.casedetailUtilityObject.statusSelected = this.casedetailUtilityObject.statusList[index].status_value;
                  this.casedetailUtilityObject.reasons = this.casedetailUtilityObject.statusList[index].reasons;
                  this.casedetailUtilityObject.reasons.forEach((val) => {
                    val.checked = (this.data && this.data.rowData && this.data.rowData.status_reasons).indexOf(val.reason_id) !== -1 ? true : false;
                  })

                  this.casedetailUtilityObject.reasonSelected = this.casedetailUtilityObject.reasons.filter(val => val.checked).map((val) => val.reason);
                }
              } else {
                this.casedetailUtilityObject.reasons = [...item.status_reasons];
              }

              this.selectStatusNew(item);


            }else if(data == "CANCEL"){
              this.resetStatusValue();
            }
          }
        });
      } else {

        if (item && item.name) {
          var index = this.casedetailUtilityObject.statusList.findIndex((val) => val.status_value.toLowerCase() == item.name.toLowerCase());
          if (index !== -1) {
            this.casedetailUtilityObject.statusSelected = this.casedetailUtilityObject.statusList[index].status_value;
            this.casedetailUtilityObject.reasons = this.casedetailUtilityObject.statusList[index].reasons;

            this.casedetailUtilityObject.reasons.forEach((val) => {
              val.checked = (this.data.rowData.status_reasons).indexOf(val.reason_id) !== -1 ? true : false;
            })

            this.casedetailUtilityObject.reasonSelected = this.casedetailUtilityObject.reasons.filter(val => val.checked).map((val) => val.reason);
          }
        }

        this.selectStatusNew(item);
      }
    }
    // this.selectStatusdd.close();
  }

  // lanka
  // RD-10858 (2021-07/11)
  // revert status when modal cancel and on err
  resetStatusValue(){
    this.casedetailUtilityObject.statusChange = "";
    this.casedetailUtilityObject.statusSelected = (this.data.rowData && this.data.rowData.status && this.data.rowData.status.value)?this.data.rowData.status.value : "";
  }

  updateReason() {
    var reasons = this.casedetailUtilityObject.reasonSelected.reduce((acc, element) => {
      this.casedetailUtilityObject.reasons.forEach(val => {
        if (element === val.reason) {
          acc.push(val.reason_id)
        }
      });
      return acc;
    }, []);

    if (reasons.length > 0) {
      this.caseFiledsLoader.reasons = true;
      var checkReasonaresame = JSON.stringify(reasons.sort((a, b) => { return a - b })) === JSON.stringify(this.data && this.data.rowData && this.data.rowData.status_reasons.sort((a, b) => { return a - b })) ? false : true;
      if (checkReasonaresame) {
        var data = {
          "id": this.data.rowData && this.data.rowData.id ? this.data.rowData && this.data.rowData.id : '',
          "entity_type": "case",
          "reason": reasons,
          "status_key": this.data.rowData && this.data.rowData.status && this.data.rowData.status.key ? this.data.rowData && this.data.rowData.status && this.data.rowData.status.key : '',
          "created_date": moment(new Date(), ["h:mm A"]).format('YYYY-MM-DD HH:mm:ss')
        }
        this._caseService.updateCaseAPINew(data).subscribe((resp) => {
          if (resp) {
            const message = this.getLanguageKey("Reason's updated successfully") ? this.getLanguageKey("Reason's updated successfully") : "Reason's updated successfully"
            this._sharedServicesService.showFlashMessage(message, 'success');
            this.data.rowData.status_reasons = reasons;
            this.data.rowData['targetUpdates'] = ["status_reasons"];
            this.data.rowData['gridDataMapID'] = "id";
            this._agGridTableService.getUpdatedData(this.data.rowData);
            this.getHistoryReason(this.data && this.data.rowData && this.data.rowData.id);
            this.caseFiledsLoader.reasons = false;
          } (err) => {
            const message = this.getLanguageKey('Something bad happened. please try again later.') ? this.getLanguageKey('Something bad happened. please try again later.') : 'Something bad happened. please try again later.'
            this._sharedServicesService.showFlashMessage(message, 'danger');
            this.caseFiledsLoader.reasons = false;
          }
        })
      }
    }
    // this.selectReasons.close();
  }

  getHistoryReason(id: number): void {
    this._caseService.getLastReason(id).subscribe((res: any) => {
      this.data.rowData.status_reason_history = [];
      this.data.rowData.status_reason_history = res.status_reason_history;
      this.data.rowData['targetUpdates'] = ["status_reason_history"];
      this._agGridTableService.getUpdatedData(this.data.rowData);
    })
  }

  getPermissionForColumn(key, setNoneFalse?: boolean) {
    const permission = this.commonServicesService.getDomainPermissions(this.caseWorkBenchPermissionJSON, key);
    const permissionLevel = this.commonServicesService.getPermissionStatusType(permission);
    if (permissionLevel == 'view') {
      return false;
    }
    if (setNoneFalse && permissionLevel == 'none') {
      return false;
    }
    return true;
  }

  /*
  * @purpose: get Region Uplift list
  * @created: Oct 29 2020
  * @author: Kasun Gamaage
  */
  loadRegionUpLiftList() {
    this.commonServicesService.getCaseCreateData('Region Uplift')
      .subscribe((response) => {
        if (response) {
          this.filteredRegionStates = response;
          this.regionStatesArray = response;
        }
      });
  }


  /*
  * @purpose: selected country from Autocomplete Region uplift list
  * @created: Oct 29 2020
  * @author: Kasun Gamaage
  */
  selectedRegion(selected: any, caseInfo: any) {
    const body: any = {} as any;
    body.id = caseInfo.data && caseInfo.data.rowData.id && caseInfo.data.rowData.id ? caseInfo.data.rowData.id : '';
    body.region_uplift = selected.listItemId;
    this.caseFiledsLoader.regionUplift = true;
    this._caseService.updateCaseAPINew(body).subscribe((response) => {
      if (response) {
        this.caseFiledsLoader.regionUplift = false;
        if(caseInfo.data.rowData.region_uplift == null){
          caseInfo.data.rowData.region_uplift = {};
        }
        caseInfo.data.rowData.region_uplift.display_name = selected.displayName;
        if (caseInfo.data.rowData.region_uplift && caseInfo.data.rowData.region_uplift.code && caseInfo.data.rowData.region_uplift.displayName) {
          caseInfo.data.rowData.region_uplift.code = selected.code;
          caseInfo.data.rowData.region_uplift.display_name = selected.displayName;
        }
        caseInfo.data.rowData['targetUpdates'] = ["region_uplift"];
        caseInfo.data.rowData['gridDataMapID'] = "id";
        this._agGridTableService.getUpdatedData(caseInfo.data.rowData);
        recallKpiDataCaseManagement = true;
        const message = this.getLanguageKey('Successfully updated') ? this.getLanguageKey('Successfully updated') : 'Successfully updated ';
        const messageKey = this.getLanguageKey('Region_Uplift') ? this.getLanguageKey('Region_Uplift') : 'Region Uplift'
        this._sharedServicesService.showFlashMessage(message + ' ' + messageKey, 'success');
      }
      (err) => {
        this.caseFiledsLoader.regionUplift = false;
        const message = this.getLanguageKey('Something bad happened. please try again later.') ? this.getLanguageKey('Something bad happened. please try again later.') : 'Something bad happened. please try again later.'
        this._sharedServicesService.showFlashMessage(message, 'danger');
      }
      this._sharedServicesService.showFlashMessage('Successfully updated Region Uplift', 'success');
    },
      (err) => {
        this._sharedServicesService.showFlashMessage(err, 'danger');
      });
    // this.selectRegion.close();
  }

  /*
   * @purpose: filter selected country from Autocomplete Region uplift list
   * @created: Oct 29 2020
   * @author: Kasun Gamaage
   */
  filterRegionStatesList(value) {
    const filterValue = value.toLowerCase();
    this.filteredRegionStates = this.regionStatesArray.filter((state) => {
      if (state.displayName) {
        return state.displayName.toLowerCase().indexOf(filterValue) === 0;
      }
    });
  }

  /** On change of Customer ID update DB
   *  Author : ASHEN
   *  Date : 29-OCT-2020
   */
  updateCustomerID(event, rowData) {
    let newCusID = event.target.value;
    var paramsData: any = {};
    paramsData.id = rowData && rowData.id ? rowData.id : "";
    paramsData.customer_internal_id = newCusID ? newCusID : "";
    this.caseFiledsLoader.customerInternalId = true;
    this._caseService.updateCaseAPINew(paramsData).subscribe((resp) => {
      this.caseFiledsLoader.customerInternalId = false;
      this.data.rowData.customer_internal_id = newCusID ? newCusID : "";
      rowData['targetUpdates'] = ["customer_internal_id"];
      rowData['gridDataMapID'] = "id";
      this._agGridTableService.getUpdatedData(rowData);
      recallKpiDataCaseManagement = true;
      const message = this.getLanguageKey('Successfully updated') ? this.getLanguageKey('Successfully updated') : 'Successfully updated ';
      const messageKey = this.getLanguageKey('Customer_Internal_ID') ? this.getLanguageKey('Customer_Internal_ID') : 'Customer Internal ID'
      this._sharedServicesService.showFlashMessage(message + ' ' + messageKey, 'success');
    },
      (err) => {
        this.caseFiledsLoader.customerInternalId = false;
        const message = this.getLanguageKey('Something bad happened. please try again later.') ? this.getLanguageKey('Something bad happened. please try again later.') : 'Something bad happened. please try again later.'
        this._sharedServicesService.showFlashMessage(message, 'danger');
      })
  }

  /*
   * @purpose: Preparing comments for case details popup
   * @created: 25 NOV 2020
   * @author: ASHEN
   */
  processComments() {
    if (this.data.rowData) {
      this.commentListItemsCount = this.data && this.data.rowData && this.data.rowData.comment_count ? this.data && this.data.rowData && this.data.rowData.comment_count : 0;
    }
  }

  /*
   * @purpose: Dynamic load right panel by params
   * @created: 25 NOV 2020
   * @author: ASHEN
   */
  rightPanelShow(type) {
    if (this.showRightPanel && this.rightPanelLoadCom == type) {
      this.showRightPanel = false;
    } else {
      this.showRightPanel = true;
    }

    this.rightPanelLoadCom = type;
  }

  getComponentPermissionIds() {
    this._agGridTableService.behaviorSubjectForAllPermisonIds$.subscribe(ids => {
      this.permissionIdsList = ids;
    })
  }

  checkAttachmentTabPermissions(): void {
    const caseAttachmentPermissions = this.commonServicesService.getDomainPermissions(this.caseWorkBenchPermissionJSON, 'caseAttachments');
    const caseAttachmentLevel = this.commonServicesService.getPermissionStatusType(caseAttachmentPermissions);

    if (caseAttachmentLevel === 'none') {
      this.isHideAttachmentTab = true;
      if (this.currentUserDetails) {
        this.currentScreen = 'relatedEntries';
      } else {
        let fromAttachmentTab = true;
        this.getcurrentLoggedUser(fromAttachmentTab);

      }
      return;
    } else {
      this.isHideAttachmentTab = false;
      return;
    }
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  caseRiskOverride() {
    const oldRisk = this.caseRisks.find(risk => risk.listItemId === this.oldRiskId);
    const data: CaseOverrideDialog = {
      caseId: this.data && this.data.rowData && this.data.rowData.id,
      caseRiskNewId: this.selectedRisk.listItemId,
      caseRiskNew: this.selectedRisk.displayName ? this.selectedRisk.displayName : '',
      caseRiskOldId: this.oldRiskId,
      caseRiskOld: oldRisk ? oldRisk.displayName : '',
      positionRelativeToElement: this.caseRiskIcon || (this.caseRiskDropdown as any)._elementRef,
      caseName: this.data && this.data.rowData && this.data.rowData.name ? this.data.rowData.name : ""
    }

    const dialogConfig: MatDialogConfig = { width: "400px", data, panelClass: 'override-dialog-container' };

    const dialogRef = this.dialog.open(CaseRiskOverrideComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((dialogResult) => {
      this.caseFiledsLoader.caseRisk = true;
      if (dialogResult) {
        this.oldRiskId = this.selectedRisk.listItemId;
        this.data.rowData.risk_override = this.selectedRisk.oldRiskIddisplayName;

        this.data.rowData.risk_override = this.selectedRisk.displayName;
        this.data.rowData.risk_override_reason = this._caseService.caseRiskReason;
        this.data.rowData.remediation_date = this._caseService.riskNextRemidiationDate;
        this.selectedRemedationDateController.patchValue(moment(this._caseService.riskNextRemidiationDate))

        this.data.rowData['targetUpdates'] = ["risk_override", "risk_override_reason", "remediation_date"];
        this.data.rowData['gridDataMapID'] = "caseId";
        this._agGridTableService.getUpdatedData(this.data.rowData);
        this._caseService.caseRiskReason = '';
        this._caseService.riskNextRemidiationDate = '';
        const message = this.getLanguageKey('Successfully updated') ? this.getLanguageKey('Successfully updated') : 'Successfully updated ';
        const messageKey = this.getLanguageKey('Case_risk') ? this.getLanguageKey('Case_risk') : 'Case Risk'
        this._sharedServicesService.showFlashMessage(message + ' ' + messageKey, 'success');
        this.caseFiledsLoader.caseRisk = false;
      }
      else {
        this.isOverride = (this.data.rowData.risk_override.id !== null)
        this.selectedRisk = { ...oldRisk };
        this.caseFiledsLoader.caseRisk = false;
      }
    });
  }

  caseRiskOverrideHistory() {
    const data: CaseOverrideHistoryDialog = {
      caseId: this.data && this.data.rowData && this.data.rowData.id,
      riskIndicatorId: this.data && this.data.rowData && this.data.rowData.risk_indicator && this.data.rowData.risk_indicator.id,
      positionRelativeToElement: this.caseRiskIcon,
      caseRisks: this.caseRisks,
      editStatus: this.editModeStatus
    }
    const dialogRef = this.dialog.open(CaseRiskOverrideHistoryComponent, {
      maxWidth: "400px",
      id: 'dialog2',
      panelClass: ['custom-dialog-container', 'override-dialog-container'],
      data,
    });

    dialogRef.afterClosed().subscribe((riskId) => {
      if (riskId) {
        this.oldRiskId = riskId;
        this.selectedRisk = { ...this.caseRisks.find(risk => risk.listItemId === this.oldRiskId) };
        this._caseService.isNextRemedationChangedObserver.subscribe((date:string) => {
          this.selectedRemedationDateController.patchValue(moment(date))
        })
      }
    });
  }

  caseRiskFactor() {
    const data = {
      positionRelativeToElement: this.caseRiskIcon,
      riskFactors:this.riskFactors ? this.riskFactors : {}
    }
    const dialogRef = this.dialog.open(CaseRiskFactorComponent, {
      maxWidth: "650px",
      id: 'dialog2',
      panelClass: ['risk-dialog-modal'],
      data,
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  selectedCaseRisk(caseRisk: any): void {
    this.selectedRisk = { ...caseRisk };
    if (this.selectedRisk.listItemId !== this.oldRiskId) {
      this.isOverride = true;
      this.caseRiskOverride();
    }
    // this.selectCaseRisk.close();
  }

  selectedUserGroup(group: any, rowData): void {
    if (group) {
      let temp_array = [];
      this.selectedUnit = group;
      var paramsData: any = {};
      paramsData.id = rowData && rowData.id ? rowData.id : 0;
      paramsData.group_id = group && group.id && group.id !== "unassigned"? group.id : 0;
      this.caseFiledsLoader.userGroup = true;
      this.caseFiledsLoader.assignee = true;
      this._caseService.updateCaseAPINew(paramsData).subscribe(data => {
        if (data && data.success && data.success == "true") {
          this.caseFiledsLoader.userGroup = false;
          const message = this.getLanguageKey('Successfully updated') ? this.getLanguageKey('Successfully updated') : 'Successfully updated ';
          const messageKey = this.getLanguageKey(' User Group') ? this.getLanguageKey('User Group') : 'User Group'
          this._sharedServicesService.showFlashMessage(message + ' ' + messageKey, 'success');

          this._caseService.getRequesterAPI().subscribe((resp: any) => {
            let activeUser: any;
            if (resp && resp.result && resp.result.length > 0) {
              activeUser = resp.result.filter((val) => {
                if (val && val.statusId && val.statusId.code) {
                  val['label'] = val.screenName;
                  return val.statusId.code == "Active";
                }
              });

              let existValueUnAssigned = activeUser.every(function (e) {
                return e.label == "unassigned";
              });

              if (!existValueUnAssigned) {
                activeUser.unshift({ 'label': this.translateService.instant('Unassigned'), 'screenName': "unassigned", 'userId': "unassigned" });
              }

              let status = 'start';
              if (activeUser && activeUser.length && group.id !== "unassigned") {
                for (let i = 0; i < activeUser.length; i++) {
                  if (activeUser[i] && activeUser[i].usersGroups && activeUser[i].usersGroups.length > 0) {
                    for (let j = 0; j < activeUser[i].usersGroups.length; j++) {
                      if (activeUser[i].usersGroups[j].name == group.name) {
                        temp_array.push(this.temp_assigneelist[i]);
                      }
                    }
                  }
                  if (i == activeUser.length - 1) {
                    status = 'end';
                  }
                }
              }else{
                temp_array = activeUser;
              }

              if (status == 'end' && temp_array.length >= 0) {
                temp_array.unshift({
                  label: "unassigned",
                  screenName: "unassigned",
                  userId: "unassigned",
                  id: "unassigned"
                });
                this.assigneeList = [];
                let obj = this.temp_AssigneeGroup.find(o => o.name === group.name);
                if (!obj) {
                  this.selectedAssignee = "unassigned";
                }
              }
            }
            if(temp_array){
              this.assigneeList = temp_array;
              this.actualAssigneeOptions = this.assigneeList;
            }
            this.caseFiledsLoader.assignee = false;
          });
        }
      },
        (err) => {
          this.caseFiledsLoader.userGroup = false;
          const message = this.getLanguageKey('Something bad happened. please try again later.') ? this.getLanguageKey('Something bad happened. please try again later.') : 'Something bad happened. please try again later.'
          this._sharedServicesService.showFlashMessage(message, 'danger');
        });
    }
    // this.selectUserGrp.close();
  }

  setSelectedCaseRiskType(caseRisk: any): void {
    if (caseRisk) this.selectedRiskType = { ...caseRisk };
  }

  private getCaseRisks(): Promise<any> {
    return this.generalSettingsApiService.getListItemsByListType('Case Risk');
  }
  getCaseType(): void {
    this.selectedRiskType = this.caseRiskType.find(risk => risk && risk.displayName ? risk.displayName : '' === this.data.rowData && this.data.rowData.type ? this.data.rowData.type : '');
  }

  configAssociatedRecord(): void {
    const columns = [
      {
        'headerName': GlobalConstants.languageJson['Select'] !== undefined ? `${GlobalConstants.languageJson['Select']}` : 'Select',
        'field': 'select',
        'colId': 'select',
        'headerCheckboxSelection': true,
        'checkboxSelection': true,
        'width': 100,
        'initialShowColumn': true,
        'filter': false,
        'lockPosition': true
      },
      {
        'headerName': GlobalConstants.languageJson['Record Id'] !== undefined ? `${GlobalConstants.languageJson['Record Id']}` : 'Record Id',
        'field': 'recordId',
        'colId': 'recordId',
        'width': 150,
        'initialShowColumn': true,
        'onCellClicked': this.getPermissionForColumn('associatedRecords', true) ? this.openAlertCard.bind(this) : () => { },
        'cellRenderer': (params) => this.getPermissionForColumn('associatedRecords', true) ? `<span class="linked-text c-pointer alert-id">${params.value}</span>` : '<span>' + params.value + '</span>',
        'lockPosition': true
      },
      {
        'headerName': GlobalConstants.languageJson['Record Type'] !== undefined ? `${GlobalConstants.languageJson['Record Type']}` : 'Record Type',
        'field': 'recordType',
        'colId': 'recordType',
        'width': 220,
        'initialShowColumn': true,
        'cellClass': 'dots-text py-4 d-inline ar-rec-type',
        'resizable': true,
        'lockPosition': true
      },
      {
        'headerName': GlobalConstants.languageJson['Record Subject'] !== undefined ? GlobalConstants.languageJson['Record Subject'] : 'Record Subject Type',
        'field': 'subject',
        'colId': 'subject',
        'width': 190,
        'initialShowColumn': true,
        'lockPosition': true
      },
      {
        'headerName': GlobalConstants.languageJson['Record Subject Name'] !== undefined ? `${GlobalConstants.languageJson['Record Subject Name']}` : 'Record Subject Name',
        'field': 'subjectName',
        'colId': 'subjectName',
        'width': 230,
        'initialShowColumn': true,
        // 'onCellClicked': this.onAssociatedRecordEntityClick.bind(this),
        'onCellClicked': (event:CellClickedEvent) => {
          this.getEntityURL(this.entityUrl , this.entityName, this.entityType , this.jurisdictionCode);
        },
        'lockPosition': true,
        'cellClass': (params) => this.selectedAssigneeID == this.userId && params.value ? 'text-blue c-pointer' : '',
        'cellRendererParams': {tooltip: 'To learn more visit Entity Page'},
        'cellRendererFramework': CaseManagementCaseCellRendererCellNameWithLoaderComponent
      },
      {
        'headerName': GlobalConstants.languageJson['Record Subject Number'] !== undefined ? `${GlobalConstants.languageJson['Record Subject Number']}` : 'Record Subject Number',
        'field': 'recordNumber',
        'colId': 'recordNumber',
        'width': 240,
        'initialShowColumn': true,
        'resizable': true,
        'lockPosition': true
      },
      {
        'headerName': GlobalConstants.languageJson['Create Date'] !== undefined ? `${GlobalConstants.languageJson['Create Date']}` : 'Create Date',
        'field': 'created',
        'colId': 'created',
        'width': 170,
        // 'valueFormatter': this.dateFormatter,
        'initialShowColumn': true,
        'resizable': true,
        'lockPosition': true,
        'cellRendererFramework': CellRendererDateComponent
      },
      {
        'headerName': GlobalConstants.languageJson['Highlight'] !== undefined ? `${GlobalConstants.languageJson['Highlight']}` : 'Highlight',
        'field': 'highlight',
        'colId': 'highlight',
        'width': 210,
        'initialShowColumn': true,
        'cellRendererFramework': TooltipRendererComponent,
        'resizable': true,
        'lockPosition': true
      },
      {
        'headerName': GlobalConstants.languageJson['Insights'] !== undefined ? `${GlobalConstants.languageJson['Insights']}` : 'Insights',
        'field': 'insights',
        'colId': 'insights',
        'width': 210,
        'initialShowColumn': true,
        'cellRenderer': this.insightCellRenderer,
        'resizable': true,
        'lockPosition': true
      },
      {
        'headerName': GlobalConstants.languageJson['Score'] !== undefined ? `${GlobalConstants.languageJson['Score']}` : 'Score',
        'field': 'score',
        'colId': 'score',
        'width': 130,
        'initialShowColumn': true,
        'cellRenderer': this.scoreCellRenderer,
        'resizable': true,
        'lockPosition': true
      },
      // {
      //   'headerName': GlobalConstants.languageJson['Risk'] !== undefined ? `${GlobalConstants.languageJson['Risk']}` : 'Risk',
      //   'field': 'risk',
      //   'colId': 'risk',
      //   'width': 210,
      //   'initialShowColumn': true,
      //   'cellRendererFramework': DropDownColumnComponent,
      //   'dropDownData': {
      //     showIcon: true,
      //     showColor: true,
      //     dropDownList: this.getAllRisks(),
      //   },
      // },
      // {
      //   'headerName': GlobalConstants.languageJson['Name'] !== undefined ? `${GlobalConstants.languageJson['Name']}` : 'Status',
      //   'field': 'status',
      //   'colId': 'status',
      //   'width': 210,
      //   'initialShowColumn': true,
      //   'cellRendererFramework': DropDownColumnComponent,
      //   'dropDownData': {
      //     showIcon: true,
      //     showColor: true,
      //     dropDownList: this.getAllStatus(),
      //   },
      // },
      // {
      //   'headerName': '',
      //   'field': 'Operations',
      //   'colId': 'Operations',
      //   'initialShowColumn': true,
      //   'cellRendererFramework': AssociatedRecordsActionsComponent,
      //   'customTemplateClass': 'Operations-icon',
      //   'filter': false,
      //   'sortable': true,
      //   'pinned': 'right',
      //   'minWidth': 100,
      //   'width': 100,
      // },
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
      fileName: 'AssociatedRecords',
      sheetName: 1,
      columnSeparator: ",",
      columnKeys: [],
      showExportbutton: true,
      processCellCallback: function (params) {
        return params.value;
      },
      processHeaderCallback: function (params) {
        return params.column.getColDef().headerName.toUpperCase();
      }
    }

    const rowData = [];

    this.associatedRecordOptions = {
      'resizable': true,
      'tableName': 'Associated Record view',
      'columnDefs': columns,
      'rowStyle': { 'border-bottom': '#424242 1px solid' },
      'rowSelection': 'multiple',
      'floatingFilter': true,
      'animateRows': true,
      'sortable': false,
      'tabs': false,
      'isShoHideColumns': true,
      'multiSortKey': 'ctrl',
      'componentType': 'case detail info',
      'defaultGridName': 'associated record detail',
      'changeBackground': "#ef5350",
      'rowModelType': 'infinite',
      'enableTableViews': true,
      'paginationPageSize': 10,
      'pagination': true,
      'enableServerSideFilter': true,
      'enableServerSideSorting': false,
      'showBulkOperations': false,
      'filter': true,
      'suppressPaginationPanel': false,
      'enableCheckBoxes': false,
      'enableTopSection': true,
      'rowHeight': 53,
      'rowData': this.rowData,
      'cellClass': 'ws-normal',
      "applyColumnDefOrder": true,
      'this': this,
      'cacheBlockSize': 10,
      'instance': this._caseService,
      'method': "getAlertsById",
      'dataModifier': "getAssociatedRecords",
      'csvExportParams': csvExportParam,
      'alerts': [
        {
          'type': this.alertType,
          'alert_id': this.alertID,
          'entityId': this.entityId,
          'entityName': this.entityName,
          'entityUrl': this.entityUrl
        }
      ],
      'currentCaseName' : this.caseName,
    }
    this.associatedRecordsLoaded = true;

  }

  getAssociatedRecords(currentInstance = this, response: GridData<AssociatedRecord>): Array<any> {
    if (response && response.result && response.result.length) {
      this.caseDetailInfoService.associatedRecords$.next(response.result);
      // this.aeAttachmentsCount = response.paginationInformation.totalResults;
      this.aeAttachmentsCount = response.result.length;
      return response.result.map(rowData => {
        return {
          'recordId': (rowData && rowData.record_id) ? rowData.record_id : '',
          'recordType': (rowData && rowData.record_type) ? rowData.record_type : '',
          'subject': (rowData && rowData.record_subject_type) ? rowData.record_subject_type : '',
          'subjectName': (rowData && rowData.record_subject_name) ? rowData.record_subject_name : '',
          'recordNumber': (rowData && rowData.record_subject_number) ? rowData.record_subject_number : '',
          'created': (rowData && rowData.create_date) ? this.getCreatedDate(rowData.create_date , rowData.alert_type ? rowData.alert_type : '') : '',
          'highlight': (rowData && rowData.highlights) ? rowData.highlights : '',
          'insights': this.getInsightsData(rowData),
          'score': (rowData && rowData.score) ? rowData.score : ''
        }
      });
    }
  }

  getInsightsData(rowData): string {
    try {
      const insight = rowData && rowData.insights ? JSON.parse(rowData.insights) : []
      return insight && insight.length && insight[0] ? this.capitalizeText(insight[0].name) + ' : ' + this.capitalizeText(insight[0].value) : ''
    } catch (err) {
      return '';
    }
  }
  configRelatedCases(): void {
    var statusesList = []

    this.caseSharedDataService.statusReasonsList.result.forEach(element => {
      statusesList.push({ 'label': element.status_value, 'screenName': element.status_value, 'code': element.status_key })
    });

    this.relatedCasesFirstTime = false;
    const columns = [
      {
        'headerName': GlobalConstants.languageJson['Name'] !== undefined ? `${GlobalConstants.languageJson['Name']}` : 'Name',
        'field': 'name',
        'colId': 'name',
        'initialShowColumn': true,
        'onCellClicked': this.navigateToCase.bind(this),
        'cellClass': 'rc-name-cell'
      },
      {
        'headerName': GlobalConstants.languageJson['Case_Id'] !== undefined ? `${GlobalConstants.languageJson['Case_Id']}` : 'Case ID',
        'field': 'caseId',
        'colId': 'id',
        'initialShowColumn': true,
        'cellClass': 'dots-text py-4 d-inline',
      },
      {
        'headerName': GlobalConstants.languageJson['Risk'] !== undefined ? `${GlobalConstants.languageJson['Risk']}` : 'Risk',
        'field': 'risk',
        'colId': 'risk',
        'class': "risk",
        'initialShowColumn': true,
        'cellRendererFramework': SingleSelectRendererComponentComponent,
        'selectBoxListData': this.caseRisks,
        'tableName': "Related Cases view",
        'currentCaseName' : this.caseName,
        'customTemplateClass': 'priorityColumn_RC',
        'floatingFilterComponent': 'singleSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': false,
          'colId': 'risk',
          'options': this.caseRisks
        },
        'options': [{ label: "High" }, { label: "Medium" }, { label: "Low" }],
        'cellEditorParams': {
          'values': []
        }
      },
      {
        'headerName': GlobalConstants.languageJson['Status'] !== undefined ? `${GlobalConstants.languageJson['Status']}` : 'Status',
        'field': 'status',
        'colId': 'status',
        'initialShowColumn': true,
        'cellRenderer': this.statusCellRenderer,
        'selectBoxListData': statusesList,
        'floatingFilterComponent': 'singleSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': false,
          'colId': 'status',
          'options': statusesList
        },
      },
      {
        'headerName': GlobalConstants.languageJson['Type'] !== undefined ? `${GlobalConstants.languageJson['Type']}` : 'Type',
        'field': 'type',
        'colId': 'type',
        'initialShowColumn': true,
        'floatingFilterComponent': 'singleSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': false,
          'colId': 'type',
          'options': this.caseTypes
        }
      },
      {
        'headerName': GlobalConstants.languageJson['Assignee'] !== undefined ? `${GlobalConstants.languageJson['Assignee']}` : 'Assignee',
        'field': 'assignee',
        'colId': 'assignee',
        'initialShowColumn': true,
        'sortable': true,
        'cellRenderer': this.assigneeCellRenderer,
        'selectBoxListData': [],
        'floatingFilterComponent': 'singleSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': false,
          'colId': 'assignee',
          'options': []
        },
      },
      {
        'headerName': GlobalConstants.languageJson['Due_Date'] !== undefined ? `${GlobalConstants.languageJson['Due_Date']}` : 'Due Date',
        'field': 'due_date',
        'colId': 'due_date',
        'width': 200,
        'initialShowColumn': false,
        'floatingFilterComponent': 'dateFilterComponent',
        'floatingFilterComponentParams': {
          'opensProperty': 'left',
          'dropsPropertyType': 'down',
          'suppressAndOrCondition': true,
          'suppressFilterButton': false,
          'colId': 'due_date',
        }
      },
      {
        'headerName': GlobalConstants.languageJson['Priority'] !== undefined ? `${GlobalConstants.languageJson['Priority']}` : 'Priority',
        'field': 'priorityRC',
        'colId': 'priority',
        'class': "priority",
        'initialShowColumn': true,
        'cellRendererFramework': SingleSelectRendererComponentComponent,
        'selectBoxListData': this.caseRisks,
        'tableName': "Related Cases view",
        'customTemplateClass': 'priorityColumn_RC',
        'floatingFilterComponent': 'singleSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': false,
          'colId': 'priority',
          'options': this.casePriorities
        },
        'options': [{ label: "High" }, { label: "Medium" }, { label: "Low" }],
        'cellEditorParams': {
          'values': []
        }
      },
      {
        'headerName': GlobalConstants.languageJson['Case Business Priority'] !== undefined ? `${GlobalConstants.languageJson['Case Business Priority']}` : 'Case Business Priority',
        'field': 'caseBusinessPriority',
        'colId': 'business_priority',
        'initialShowColumn': false,
        'floatingFilterComponent': 'singleSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': false,
          'colId': 'business_priority',
          'options': this.caseBusinessPriorityTypes
        }
      },
      {
        'headerName': 'Jurisdiction Uplift',
        'field': 'jurisdiction_code',
        'colId': 'jurisdiction_code',
        'width': 150,
        'class': "product",
        'initialShowColumn': false,
        'floatingFilterComponent': 'singleSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': false,
          'colId': 'jurisdiction_code',
          'options': this.jurisdictions,
        }
      },
      {
        'headerName': 'Case User Group',
        'field': 'group_id',
        'colId': 'group_id',
        'sortable': false,
        'width': 150,
        'class': "product",
        'initialShowColumn': false,
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': false,
          'colId': 'group_id',
          'options': this.caseUserGroups,
          'filterOptions': 'equals'
        }
      },
      {
        'headerName': 'Products',
        'field': 'products',
        'colId': 'products',
        'sortable': false,
        'width': 150,
        'initialShowColumn': false,
        'cellClass': 'product text-capitalize',
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': false,
          'colId': 'products',
          'options': this.products
        },
      }
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
      fileName: 'RelatedCases',
      sheetName: 1,
      columnSeparator: ",",
      columnKeys: [],
      showExportbutton: true,
      processCellCallback: function (params) {
        return params.value;
      },
      processHeaderCallback: function (params) {
        return params.column.getColDef().headerName.toUpperCase();
      }
    }

    const rowData = []

    this.relatedCasesOptions = {
      'resizable': true,
      'tableName': 'Related Cases view',
      'columnDefs': columns,
      'rowStyle': { 'border-bottom': '#424242 1px solid' },
      'rowSelection': 'multiple',
      'floatingFilter': true,
      'animateRows': true,
      'sortable': true,
      'tabs': false,
      'isShoHideColumns': true,
      'multiSortKey': 'ctrl',
      'componentType': 'case detail info',
      'defaultGridName': 'related cases detail',
      'changeBackground': "#ef5350",
      'rowModelType': 'infinite',
      'enableTableViews': true,
      'paginationPageSize': 10,
      'pagination': true,
      'enableServerSideFilter': true,
      'enableServerSideSorting': false,
      'showBulkOperations': false,
      'filter': true,
      'suppressPaginationPanel': false,
      'enableCheckBoxes': false,
      'enableTopSection': true,
      'rowHeight': 53,
      'rowData': this.rowData,
      'cellClass': 'ws-normal',
      "applyColumnDefOrder": true,
      'this': this,
      'cacheBlockSize': 10,
      'instance': this._caseService,
      'method': "getRelatedCasesBycaseID",
      'dataModifier': "getRelatedCases",
      'csvExportParams': csvExportParam,
      'caseId': this.currentCaseId,
      'currentCaseName' : this.caseName,
    }
    this.relatedCasesLoaded = true;
  }

  getRelatedCases(currentInstance = this, response: GridData<RelatedCase>, params: AgGridEvent): Array<any> {
    if (response && response.result && response.result.length) {
      this.caseDetailInfoService.relatedCases$.next(response.result);
      this.showRelatedCasesOverlay = false;
      this.relatedCasesFirstTime = false;
      this.rcAttachmentsCount = response.paginationInformation.totalResults;
      this.activeUsers$.subscribe((activeUsers) => {
        const columnDefs = params.columnApi.getAllColumns().map(col => col.getColDef());

        const assigneeColumn = columnDefs.find(cd => cd.colId === 'assignee');
        const assigneeList = activeUsers.map(activeUser => {
          return {
            label: activeUser.screenName,
            screenName: activeUser.screenName,
            userId: activeUser.userId.toString()
          }
        });
        assigneeColumn['selectBoxListData'] = assigneeList;
        assigneeColumn.floatingFilterComponentParams = {
          ...assigneeColumn.floatingFilterComponentParams,
          options: assigneeList
        }
        params.api.setColumnDefs(columnDefs);
      })
      return response.result.map(rowData => {
        let textCap1 = 10;
        let textCap2 = 8;
        return {
          'name': (rowData && rowData.name) ? rowData.name.trim() : '',
          'caseId': (rowData && rowData.case_id) ? rowData.case_id : '',
          'risk': (rowData && rowData.risk && rowData.risk.listItemId) ? rowData.risk : '',
          'status': (rowData && rowData.status) ? rowData.status.length > textCap1 ? this.clipText(rowData.status, textCap1) : rowData.status : '',
          'type': (rowData && rowData.type && rowData.type.displayName) ? rowData.type.displayName : '',
          'assignee_icon': (rowData && rowData.assignee && rowData.assignee.icon) ? rowData.assignee.icon : '',
          'assignee_name': (rowData && rowData.assignee && rowData.assignee.screen_name) ? rowData.assignee.screen_name.length > textCap2 ? this.clipText(rowData.assignee.screen_name, textCap2) : rowData.assignee.screen_name : '',
          'due_date': (rowData && rowData.due_date) ? this.formatDueDate(rowData.due_date) : '',
          'priorityRC': (rowData && rowData.priority && rowData.priority.listItemId) ? rowData.priority : '',
          'jurisdiction_code': (rowData && rowData.jurisdiction_code) ? rowData.jurisdiction_code : '',
          'group_id': (rowData && rowData.user_group) ? rowData.user_group : '',
          'caseBusinessPriority': (rowData && rowData.case_business_priority && rowData.case_business_priority.displayName) ? rowData.case_business_priority.displayName : '',
          'products': (rowData.products) ? rowData.products.map(prod => prod && prod.display_name).join(", ") : '',
        }
      });
    } else {
      if (this.relatedCasesFirstTime) {
        this.showRelatedCasesOverlay = true;
        this.relatedCasesFirstTime = false;
      }
    }
    return [];
  }

  statusCellRenderer(params) {
    if (params && params.data && params.data.status && params.data.status.value) {
      return (
        `<div class="status-box"><span class="material-icons-round avatar-icon play-icon">play_circle_filled</span>
        <span class="status-text">${params.data.status.value}</span></div>`
      );
    }
  }

  clipText(text: string, limit: number) {
    return text.substring(0, limit) + '...';
  }

  formatDueDate(text: string) {
    return text.replace("T", " ");
  }

  assigneeCellRenderer(params) {
    if (params && params.data) {
      if (params.data.assignee_icon && params.data.assignee_name) {
        return (
          `<div class="assignee-box"><img class="assignee-img" src="${params.data.assignee_icon}">
          <span>${params.data.assignee_name}</span></div>`
        );
      } else if (!params.data.assignee_icon && params.data.assignee_name) {
        return (
          `<div class="assignee-box"><span class="material-icons-round avatar-icon user-profile">person</span>
          <span>${params.data.assignee_name}</span></div>`
        );
      } else if (params.data.assignee_icon && !params.data.assignee_name) {
        return (
          `<div class="assignee-box"><img class="assignee-img" src="${params.data.assignee_icon}"></div>`
        );
      }
    }
    return (
      `<div class="assignee-box"><span>N/A</span></div>`
    );
  }

  dateFormatter(params) {
    if (params && params.value) {
      var dateAsString = params.value.date;
      var dateParts = dateAsString.split('.');
      return `${dateParts[0]} - ${dateParts[1]} - ${dateParts[2]}`;
    } return params.value
  }

  insightCellRenderer(params) {
    if (params && params.value) {
      return params.value;
    }
    return (
      `<span class="notAvailable">N/A</span>`
    );
  }

  scoreCellRenderer(params) {
    if (params && params.value) {
      return (
        `<span class="text-red2 f-20" >${params.value}</span>`
      );
    }
    return (
      `<span class="notAvailable">0</span>`
    );
  }

  getAllRisks(): Array<DropDownData> {
    return [
      {
        value: 'Highest',
        text: 'Highest',
        icon: 'exclamation-triangle',
        colorCode: "#fc5c66"
      },
      {
        value: 'Medium',
        text: 'Medium',
        icon: 'exclamation-triangle',
        colorCode: "#c521ff"
      },
      {
        value: 'Low',
        text: 'Low',
        icon: 'exclamation-triangle',
        colorCode: "#00ca98"
      },

    ];
  }
  getAllStatus(): Array<DropDownData> {
    return [
      {
        value: 'Approved',
        text: 'Approved',
        icon: 'check-circle',
        colorCode: "#00ca98"
      },
      {
        value: 'Rejected',
        text: 'Rejected',
        icon: 'play-circle',
        colorCode: "#42b7ff"
      },

    ];
  }

  openAlertCard(cellData) {
    if (this.alertType == CaseTypesConstants.SCREENING) {
      // redirect to screening alert card instead of opening the new card
      let alertListUrl = 'element/alert-management/alertsList';
      if (GlobalConstants.systemSettings.openInNewtab) {
        const url = this.router.serializeUrl(this.router.createUrlTree([alertListUrl], { queryParams: { alertId: this.alertID } }));
        this.window.open('#' + url, '_blank', 'noopener');
      } else {
        this.router.navigate([alertListUrl], { queryParams: {alertId: this.alertID} });
      }
    } else if (this.alertType == CaseTypesConstants.TM) {
      let alertCardUrl = 'element/transaction-monitoring/alertCard';
      if (GlobalConstants.systemSettings.openInNewtab) {
        const url = this.router.serializeUrl(
          this.router.createUrlTree([`${alertCardUrl}/${cellData.value}`])
        );
        this.window.open('#' + url, '_blank', 'noopener');
      } else {
        this.router.navigate([alertCardUrl, cellData.value]);
      }
    }
  }

  // @purpose : Return the color with alpha or without alpha
  // @author : Ammshathwan
  getBgColor(hex: string, alpha?: number): string {
    if (hex) {
      const r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

      if (alpha) {
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
      } else {
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
      }
    }
  }

  getLanguage() {
    let getLanguageData = (language) => {
      const key = this.commonServicesService.get_language_name(language);
      const filename = key + '_case_management.json';
      const param = {
        fileName: filename,
        languageName: language
      };
      this.translateService.setDefaultLang(
        AppConstants.Ehub_Rest_API +
        'fileStorage/downloadFileByLanguageAndFileName?fileName=en_case_management.json&languageName=English'
      );
      const url =
        AppConstants.Ehub_Rest_API +
        'fileStorage/downloadFileByLanguageAndFileName?fileName=' +
        param.fileName +
        '&languageName=' +
        param.languageName;
      this.translateService.use(url).subscribe(
        (res) => {
          this.commonServicesService.sendLanguageJsonToComponents(res);
        },
        (error) => {
          if (error.status === 404 && key === 'de') {
            this._sharedServicesService.showFlashMessage(
              'german file not found, loading default language..',
              'danger'
            );
            getLanguageData('english');
          } else if (error.status === 404 && key === 'en') {
            setTimeout(() => {
              this._sharedServicesService.showFlashMessage(
                'english file ' + error.url + ' is missing',
                'danger'
              );
            }, 3000);
          }
        }
      );

      this._caseService.getTranslationjson.subscribe((resp) => {
        if (JSON.stringify(resp) !== "{}") {
          GlobalConstants.languageJson = resp;
          this.localizePaginationText(GlobalConstants.languageJson);
          this.commonServicesService.sendLanguageJsonToComponents(resp);
        }
      });
    };
    if (GlobalConstants.systemSettings['ehubObject']['language']) {
      getLanguageData(GlobalConstants.systemSettings['ehubObject']['language']);
    } else {
      this._sharedServicesService.getSystemSettings().then(resp => {
        if (resp) {
          resp['General Settings'].map((val) => {
            if (val.name === 'Languages') {
              if (val.selectedValue) {
                getLanguageData(val.selectedValue);
              }
            }
          });
        }
      });
    }
  }
  localizePaginationText(languageJson) {
    setTimeout(() => {
      $(".ag-paging-panel span.ag-paging-page-summary-panel").contents()
        .filter(function () {
          if (this.nodeType === 3) {
            if (this.nodeValue.indexOf('Page') > -1) {
              this.nodeValue = languageJson['Page'] !== undefined ? ` ${languageJson['Page']} ` : ' Page ';
            }
            if (this.nodeValue.indexOf('more') > -1) {
              this.nodeValue = languageJson['More'] !== undefined ? ` ${languageJson['More']} ` : ' more ';

            }
            if (this.nodeValue.indexOf('of') > -1) {
              this.nodeValue = languageJson['Of'] !== undefined ? ` ${languageJson['Of']} ` : ' of ';
            }
          }
          return null;
        });

      $(".ag-paging-panel span.ag-paging-row-summary-panel").contents()
        .filter(function () {
          if (this.nodeType === 3) {
            if (this.nodeValue.indexOf('to') > -1) {
              this.nodeValue = languageJson['To'] !== undefined ? ` ${languageJson['To']} ` : ' to ';
            }
            if (this.nodeValue.indexOf('of') > -1) {
              this.nodeValue = languageJson['Of'] !== undefined ? ` ${languageJson['Of']} ` : ' of ';
            }
          }
          return null;
        });
    }, 3000);

  }
  // @purpose: open comment popup
  // @date: 08/12/2021
  // @author: ammshathwan
  openCommentsPopup(): void {
    const data = {
      positionRelativeToElement: this.caseComments,
      caseId: this.data && this.data.rowData && this.data.rowData.id ? this.data.rowData.id : 0,
      caseName: this.data && this.data.rowData && this.data.rowData.name ? this.data.rowData.name : "",
      caseWorkBenchPermissionJSON: this.caseWorkBenchPermissionJSON,
      editModeStatus: this.editModeStatus,
      commentContainer: "case card"
    }
    this.dialog.open(CommentsComponent, {
      maxWidth: "392px",
      id: 'comments-popup',
      panelClass: ['custom-dialog-container', 'comments-dialog-container'],
      data
    });
  }

  // @purpose: open case audit left panel
  // @date: 08/12/2021
  // @author: ammshathwan
  openCaseAudit(): void {
    this._caseService.showAuditPanelListObserver.subscribe(openState => {
      this.showRightPanel = openState
      this.isAuditOpen = openState
    })
    this.isAuditOpen = !this.isAuditOpen;
    this._caseService.openAuditPanel(this.isAuditOpen, this.data.rowData.id , this.data.rowData.name);
    if (this.isAuditOpen) {
      this.renderer2.addClass(document.body, 'audit-sideBar-open');
    } else {
      this.renderer2.removeClass(document.body, 'audit-sideBar-open');
    }
  }

  updateCommentCount() {
    this._caseService.behaviorSubjectForGetCommentCount.subscribe((res) => {
      if (this.data && this.data.rowData && this.data.rowData.comment_count) {
        if (res === 0) {
          this.data.rowData.comment_count = 0;
        } else {
          this.data.rowData.comment_count = res ? res : this.data && this.data.rowData && this.data.rowData.comment_count;
        }
        this.updateCommentCountData();
      } else if (res) {
        this.data.rowData.comment_count = res ? res : this.data && this.data.rowData && this.data.rowData.comment_count;
        this.updateCommentCountData();
      }
    })
  }

  updateCommentCountData(): void {
    this.processComments();
    this.data.rowData['targetUpdates'] = ["comment_count"];
    this.data.rowData['gridDataMapID'] = "id";
    this._agGridTableService.getUpdatedData(this.data.rowData);
  }

  private getAlltableStatus(): Array<DropDownData> {
    return [
      {
        value: 'Pending',
        text: 'Pending',
        icon: 'clock',
        colorCode: "#f28618"
      },
      {
        value: 'New',
        text: 'New',
        icon: 'play-circle',
        colorCode: "#42b7ff"
      },
      {
        value: 'Verified',
        text: 'Verified',
        icon: 'check-circle',
        colorCode: "#00796b"
      },
      {
        value: 'On Hold',
        text: 'On Hold',
        icon: 'pause-circle',
        colorCode: "#e6ae20"
      },
      {
        value: 'Past Due',
        text: 'Past Due',
        icon: 'exclamation-triangle',
        colorCode: "#ef5350"
      }
    ];
  }

  private getCellTags(): any[] {
    return [
      {
        "color_code": "#f26c0e",
        "content": "PEP Tag 22",
        "id": 33
      },
      {
        "color_code": "#fae069",
        "content": "PEP Tag 3",
        "id": 35
      },
      {
        "color_code": "#545454",
        "content": "SANCTION Tag 2",
        "id": 39
      },
      {
        "color_code": "#cb323c",
        "content": "Adverse Media 3",
        "id": 48
      },
      {
        "color_code": "#c521ff",
        "content": "Sales",
        "id": 57
      },
      {
        "color_code": "#2dc439",
        "content": "Credit",
        "id": 59
      },
      {
        "color_code": "#42b7ff",
        "content": "city",
        "id": 73
      }
    ]
  }

  unShiftAllTextInFilterOptions(list): void {
    var tempList = list ? list : [];

    tempList.unshift({
      'listItemId': null,
      'label': 'All'
    });
    return tempList;
  }


  setFilterOptions(): void {
    this.attachmentStatus = [
      { label: 'New', value: 'new' },
      { label: 'Accepted With Waiver', value: 'acceptedWithWaiver' },
      { label: 'Accepted', value: 'accepted' },
      { label: 'QA Review for Screening', value: 'holdPendingReview' },
    ]

    this.caseModifiedBy = [
      { label: 'Admin', value: 'admin' },
      { label: 'sameer', value: 'sameer' },
      { label: 'User 2', value: 'user2' },
    ]
    this.caseCatergoryType = [
      { label: 'Category 1', value: 'category1' },
      { label: 'Category 2', value: 'category2' },
      { label: 'Category 3', value: 'category3' },
    ]

    this.caseTag = [
      { label: 'Tag 1', value: 'tag1' },
      { label: 'Tag 2', value: 'tag2' },
      { label: 'Tag 3', value: 'tag3' },
    ]

    this.caseType = [
      { label: 'Annual Report', value: 'AnnualReport' },
      { label: 'Case Type 2', value: 'case2' },
      { label: 'Case Type 3', value: 'case3' },
    ]
  }
  setCaseRisks(res) {
    if (res) {
      this.relatedCaseRiskTypes = res;
      this.caseRisks = res;
      this.isOverride = this.data && this.data.rowData && this.data.rowData.risk_override && this.data.rowData.risk_override.id !== null;

      this._sharedServicesService.getSystemSettings().then((data) => {
        if (data) {
          if (data["Case Settings"]) {
            data["Case Settings"].forEach((setting) => {
              if (setting && setting.selectedValue && setting.name === "Override Selection") {
                if (setting.selectedValue == "Calculated Risk") {
                  this.isOverrideRisk = false;
                  this.oldRiskId = this.data && this.data.rowData && this.data.rowData.risk_override && this.data.rowData.risk_override.id;
                }
                else if (setting.selectedValue == "Override Risk") {
                  this.isOverrideRisk = true;
                  this.oldRiskId = this.isOverride ?
                    this.data.rowData && this.data.rowData.risk_override && this.data.rowData.risk_override.id : this.data.rowData && this.data.rowData.risk_indicator && this.data.rowData.risk_indicator.id;
                }
              }
            });
            const selected = this.caseRisks.find(
              (risk) => risk.listItemId === this.oldRiskId
            );
            if (selected) {
              this.selectedRisk = { ...selected };
            }
          }
        }
      });
    }
  }

  getAllUserGroups(userId): void {
    if (userId !== undefined || userId !== '') {
      this._caseService.getAllUserGroupsAPI().subscribe(data => {
        if (data && data.length > 0) {
          this.caseUnitType = [];
          this.caseUnitType = data;

          let isUnassigned =  this.caseUnitType.filter(group => {
            return group && group.id && group.id == "unassigned"
          })

          if(isUnassigned && !isUnassigned.lebgth){
            this.caseUnitType.unshift({ 'name': this.translateService.instant('Unassigned'), 'group_code': "unassigned" , 'id': "unassigned" });
          }
          if (userId !== 'unassigned') {
            this._caseService.getUserGroupsById(userId).subscribe(data => {
              if (data && data.length > 0) {
                this.temp_AssigneeGroup = [];
                this.selectedUnit = {};
                this.temp_AssigneeGroup = data;
                if (this.data && this.data.rowData && this.data.rowData.assignee && this.data.rowData.assignee.group_id) {
                  let obj = this.caseUnitType.find(o => o.id === this.data.rowData.assignee.group_id);
                  if (obj) {
                    this.selectedUnit = obj;
                  }
                }
              }
              else {
                this.unassignedUserGroup();
              }
            },
              (err) => {
                const message = this.getLanguageKey('Something bad happened. please try again later.') ? this.getLanguageKey('Something bad happened. please try again later.') : 'Something bad happened. please try again later.'
                this._sharedServicesService.showFlashMessage(message, 'danger');
              });
          }
          else {
            if(!(this.selectedUnit as any).id){
              this.selectedUnit = {};
              this.unassignedUserGroup();
            }
          }
        }
      },
        (err) => {
          const message = this.getLanguageKey('Something bad happened. please try again later.') ? this.getLanguageKey('Something bad happened. please try again later.') : 'Something bad happened. please try again later.'
          this._sharedServicesService.showFlashMessage(message, 'danger');
        });
    }
  }

  unassignedUserGroup() {
    let obj = this.caseUnitType.find(o => o.id === 'unassigned');
    if (obj) {
      this.selectedUnit = obj;
    }
  }

  getAssigneeId(name) {
    if (name && this.assigneeList) {
      for (let i = 0; i < this.assigneeList.length; i++) {
        if (this.assigneeList[i].screenName == name) {
          return this.assigneeList[i].userId;
        }
      }
    }
  }

  removeWhiteSapce(content: string): string {
    return content.trim();
  }

  getLanguageKey(text) {
    var langKey = text;
    if (GlobalConstants.languageJson) {
      langKey = GlobalConstants.languageJson[text];
    }
    return langKey;
  }


  getFormart() {
    this._sharedServicesService.dateFormatValue.subscribe((date) => this.dateFromat = date ? date : 'DD MMM YYYY');
  }

  // @purpose: Convert UTC dates to local dates
  // @date: 08/12/2021
  // @author: ammshathwan
  // @params: date , type - case , screening , etc
  getCreatedDate(createdDate:string ,  type:string): string {
    let date:Date
    if(type && type.toLowerCase() === 'screening'){
      date = new Date(moment(createdDate).format())
    }else{
      date = new Date(createdDate + ".000Z")
    }
    return moment(date).format(this.dateFromat + ',hh:mm:ss A')
  }

  fetchDocumentTags(fileId: any) {
    if (fileId) {
      var tags: any;
      this.documentTags = [];
      if (Object.keys(this.tagList).find(ele => ele == fileId)) {
        this.tagList[fileId].forEach(tag => {
          if (tag) {
            let tagElement = tag.content ? tag.content : '';
            let subTagElement = tag.subtag ? ' : ' + tag.subtag['content'] : '';
            tags = {
              content: tagElement + subTagElement,
              colorCode: tag.color_code ? tag.color_code : '',
              id: tag.id ? tag.id : ''
            }
            this.documentTags.push(tags)
          } else {
            this.documentTags = [];
          }
        });
      }
      return this.documentTags;
    }
  }

  getRelatedEntity(currentInstance = this, response): Array<any> {
    if (response && response.result.length) {
      this.caseDetailInfoService.associatedEntities$.next(response.result);
      return response.result.map(rowData => {
        return {
          "entity_id": (rowData.entity_id) ? rowData.entity_id : "",
          "entity_url": (rowData.entity_url) ? rowData.entity_url : "",
          "entity_name": (rowData.entity_name) ? rowData.entity_name : '',
          "entity_info": (rowData.entity_info) ? rowData.entity_info : '',
          "entity_type": (rowData.entity_type) ? rowData.entity_type : '',
          "relation_type": (rowData.relation_type) ? rowData.relation_type : '',
          "country": (rowData.country) ? rowData.country : '',
          "address": (rowData.address) ? rowData.address : '',
          "case_id": (rowData.case_id) ? rowData.case_id : '',
          "id": (rowData.id) ? rowData.id : '',
          "rowOptions": (rowData.id) ? rowData.id : '',
          "caseName": this.data.rowData.name,
          "country_name ": this.data.rowData.country_name ? this.data.rowData.country_name  : ''
        }
      });
    }
    return [];
  }

  // @reason : case name title set max charcaters length 75
  // @author: Kasun Karunathilaka
  // @date: Mar 01 2022
  // @@Modified case name as 100 max 
  onKeyUp() {
    if (this.caseName.length > 99) {
      const message = this.getLanguageKey('Case name can be max 100 characters long.') ? this.getLanguageKey('Case name can be max 100 characters long.') : 'Case name can be max 100 characters long.'
      this._sharedServicesService.showFlashMessage(message, 'danger');
    }
  }

  // @reason : Case Risk dropdown should not be available and cannot override the given risk manually.
  // @author: Kasun Karunathilaka
  // @date: Mar 07 2022
  getOverRideRisk() {
    const caseSetting = GlobalConstants.systemsettingsData && GlobalConstants.systemsettingsData["Case Settings"] ? GlobalConstants.systemsettingsData["Case Settings"] : []
    if (caseSetting) {
      this.checkIsOverrideRisk = caseSetting.find(caseObj => {
        return caseObj && caseObj.selectedValue && caseObj.selectedValue && caseObj.name == "Override Selection" && caseObj.selectedValue == "Override Risk"
      });
    }
  }

  // @reason : set attachment table data.
  // @author: Kasun Karunathilaka
  // @date: Apr 07 2022
  getAttachment(currentInstance = this, response, params: AgGridEvent): Array<any> {
    var temArray = [];
    if (response && response.result && response.result.length) {
      response.result.forEach(rowData => {
        temArray.push({
          'fileID': (rowData.fileId) ? rowData.fileId : '',
          'fileName': (rowData.fileName) ? rowData.fileName : '',
          'size': (rowData.size) ? this.convertToMb(rowData.size) : '',
          'timestamp': (rowData.timestamp) ? this.changeDateFormat(rowData.timestamp) : '',
          'expiryDate': (rowData.expiryDate) ? rowData.expiryDate : '',
          'notification': (rowData.notification) ? rowData.notification : '',
          'status': rowData.status ? rowData.status : '',

          'updatedBy': rowData.updatedBy, // assign use id here and after convert to user name below
          "fileType": (rowData.format) ? rowData.format : '',
          // "Source": rowData.documents.source
          "path": (rowData.filePath) ? rowData.filePath : '',
          "user_Id": (rowData.user_id) ? rowData.user_id : '',
          'type': (rowData.title) ? rowData.title : '',
          // 'Status': rowData.documents.
          // 'CatergoryType': rowData.documents.
          'version': (rowData.version) ? rowData.version : '',
          'Operations': (rowData) ? rowData : '',
          // 'Tags': (rowData.fileId) ? this.fetchDocumentTags(rowData.fileId) : '',
        })
      });

      this.activeUsers$.subscribe((activeUsers) => {
        // convert user id to user name
        temArray.forEach((item) => {
          const user = activeUsers.find((user) => user.userId.toString() == item.updatedBy);
          item.updatedBy = user ? user.screenName : '';
        })
        const columnDefs = params.columnApi.getAllColumns().map(col => col.getColDef());
        // update filter column with user dropdown options
        const modifiedByColumn = columnDefs.find(cd => cd.colId === 'updatedBy');
        const newOptions = activeUsers.map(activeUser => {
          return {
            label: activeUser.screenName,
            value: activeUser.userId.toString()
          }
        });
        // To not make infinity loop, when call setColumnDefs it re-init filter components and loop calling data requests
        if (JSON.stringify(modifiedByColumn.floatingFilterComponentParams.options) !== JSON.stringify(newOptions)) {
          modifiedByColumn.floatingFilterComponentParams = {
            ...modifiedByColumn.floatingFilterComponentParams,
            options: newOptions
          }

          params.api.setColumnDefs(columnDefs);
        }

      })

      this.canDeleteAttachmentsForStatus();
      return temArray;
    }
    return [];
  }

  async loadCaseRiskData() {
    await this.getCaseListPermssionIds();
    await this.getTenantData()
    await this.getStatusList({ caseId: this.data.rowData.id, statusKey: this.data.rowData && this.data.rowData.status && this.data.rowData.status.key });
    await this.getPermissionByStatus(this.data.rowData && this.data.rowData.status && this.data.rowData.status.key);
    await this.getCaseType();
    await this.setCaseTypeList();
    await this.getCaseProducts();
    await this.processComments();
    await this.casePrioritiesList()
    await this.caseBusinessPriorityList()
    this.getAssigneeList();
    await this.getReasons();
    return new Promise((resolve) => {
      this.caseSharedDataService.getRiskData().subscribe(riskList => {
        this.isOverride = (this.data.rowData && this.data.rowData.risk_override && this.data.rowData.risk_override.id !== null);
        this.oldRiskId = (this.isOverride) ? this.data.rowData && this.data.rowData.risk_override && this.data.rowData.risk_override.id : this.data.rowData && this.data.rowData.risk_indicator && this.data.rowData.risk_indicator.id;
        if (riskList.length) {
          this.caseRisks = riskList;
          this.setCaseRisks(riskList);
          const selected = riskList.find(risk => risk.listItemId === this.oldRiskId);
          if (selected) {
            this.selectedRisk = { ...selected };
          }
          resolve('')
        } else {
          this.getCaseRisks().then(res => {
            if (res) {
              this.caseRisks = riskList;
              this.setCaseRisks(res);
              this.caseSharedDataService.setRiskData(res)
              const selected = res.find(risk => risk.listItemId === this.oldRiskId);
              if (selected) {
                this.selectedRisk = { ...selected };
              }
            }
            resolve("");
          });
        }
      })
    });

  }
  getTenantData() {
    this.caseSharedDataService.getTenantData().subscribe(list => {
      if (list.length) {
        this.tenantList = list;
        this.getSelectedTenant()
      } else {
        this.commonServicesService.getCaseCreateData('Tenant').subscribe(data => {
          this.tenantList = data;
          this.getSelectedTenant()
        });
      }
    })
  }
  getSelectedTenant() {
    let temp_tenantList = this.tenantList.filter(el => {
      if (this.data && this.data.rowData && this.data.rowData['tenant'] && this.data.rowData['tenant'].id) {
        return el.listItemId == this.data.rowData['tenant'].id;
      }
    })[0];
    this.selectedTenant = {
      id: temp_tenantList && temp_tenantList.listItemId ? temp_tenantList.listItemId : '',
      name: temp_tenantList && temp_tenantList.displayName ? temp_tenantList.displayName : '',
      code: temp_tenantList && temp_tenantList.code ? temp_tenantList.code : ''
    }
  }

  // @reason : Get case related entity alerts type.
  // @author: Kasun Karunathilaka
  // @date: Jun 10 2022
  getAlertType(alerts): string {
    let alertType: string = ''
    if (alerts && alerts.length && alerts[0].alert_type) {
      if (alerts[0].alert_type.toLowerCase() === "screening") {
        alertType = "screening"
      } if (alerts[0].alert_type.toLowerCase() === "tm") {
        alertType = "tm"
      }
    }
    return alertType
  }

  // @reason : Get all workflow through entities workflows
  // @author: Ammshathwan
  // @date: Sep 02 2022
  getAllEntityWorkFlowList():void{
    this.generalSettingsApiService.getEntityWorkflows().then((res)=>{
      if(res  && res[0])  {
        this.workFlowList = res;
      }
    });
  }

  /**
   * Initiate polling for entity url and info values. Will poll every 5 seconds until entity_url and entity_info is available
   * @param name entity name
   * @param type entity type
   * @param jurisdiction entity jurisdiction
   * @param caseId current case ID
   * @returns Observable emitting entity_url and entity_info
   */
  initiateFetchingRelatedEntityData(name: string, type: string, jurisdiction: string, caseId: number): Observable<{entityUrl: string, entityInfo: string, selctedEntityURL: string}> {
    return this._caseService.updateCaseRelatedEntityData(name, type, jurisdiction, caseId).pipe(
      takeUntil(this._onDestroy),
      mergeMap(_ => timer(0, 5000)
        .pipe(
          switchMap(_ => this._caseService.getCaseEntityData(name, caseId)),
          map(response => ({ entityUrl: response.entity_url, entityInfo: response.entity_info, selctedEntityURL: response.select_entity_url})),
          filter(({entityUrl, entityInfo}) => !!entityUrl && !!entityInfo),
          take(1)
        )),
      timeout(20*60*1000),
    );
  }

  // @reason : get all docuemnt category from DMS
  // @date : 28 NOV 2022
  // @params : none
  // @author : ammshawthan
  getDocumentCategory(): void{
    this.commonServicesService.getListItemsByListType('Document Category').then((list) => {
      GlobalConstants.categoryList = list && list.length ? list : [];
    })
  }

  // @reason : get the entity URL from BE
  // @date : 15 dec 2022
  // @params : entity url , entity name , entity type , jurisdiction code , is click is trigger from tables (false)
  // @author : ammshawthan
  getEntityURL(entityUrl , entity_name , entity_type , jurisdiction_code , isNotCellClicked:boolean = false): void{
    if (!this.isAssigneeCurrentUser()) return;
    if (this.showEntityDataLoader) return;

    if((entityUrl && entity_type !== "personnel" && this.selectEntityURL) || (entityUrl && entity_type == "personnel")){
      if (!localStorage.getItem('select_entity_url')) {
        var select_entity_url = { [this.entityId]: this.selectEntityURL };
        localStorage.setItem('select_entity_url', JSON.stringify(select_entity_url));
      } else {
        var getlist = JSON.parse(localStorage.getItem('select_entity_url'));
        getlist[this.entityId] = this.selectEntityURL;
        localStorage.setItem('select_entity_url', JSON.stringify(getlist));
      }
      entityUrl = entityUrl + `&caseID=${this.currentCaseId}&caseName=${this.data.rowData.name}`;
      if (this.data.rowData && this.data.rowData.tenant && this.data.rowData.tenant.display_name) {
        entityUrl += `&tenantId=${this.data.rowData.tenant.code}`;
      }

      this.window.open(entityUrl, '_blank','noopener');
    }else{
      if(entity_type !== "personnel" || !entityUrl){
        if(isNotCellClicked) this.showEntityDataLoader = true;
        this.getEntityData(entity_name , entity_type , jurisdiction_code , isNotCellClicked);
      }
    }
  }

  // @reason :get entity data if entity URL is not found
  // @date : 15 dec 2022
  // @params : entity url , entity name , entity type , jurisdiction code , is click is trigger from tables (false)
  // @author : ammshawthan
  getEntityData(entity_name, entity_type , jurisdiction_code , isNotCellClicked){
    if(!isNotCellClicked) this._caseService.isAssociatedEntityClicked.next(true);
    if(entity_name && entity_type && this.currentCaseId){
      if( entity_type.toLowerCase() == 'organization' && !jurisdiction_code) return null

      this.initiateFetchingRelatedEntityData(entity_name, entity_type, jurisdiction_code, this.currentCaseId)
      .pipe(
        finalize(() => {
          isNotCellClicked ?  this.showEntityDataLoader = false : this._caseService.isAssociatedEntityClicked.next(false);
        }),
        takeUntil(this._onDestroy)
      )
      .subscribe(({ entityInfo, entityUrl , selctedEntityURL }) => {
        if(isNotCellClicked){
          this.showEntityDataLoader = false;
          this.entityUrl = entityUrl;
          if (this.data && this.data.rowData && this.data.rowData.entity) {
            this.data.rowData.entity.entity_info = entityInfo;
            this.data.rowData.entity.entity_url = entityUrl;
            this.selectEntityURL = selctedEntityURL;
            this.data.rowData.entity.select_entity_url = selctedEntityURL;
          }
        }

        this.getEntityURL(entityUrl , entity_name , entity_type , jurisdiction_code, isNotCellClicked)
      }, err => {
        this.showEntityDataLoader = false;
        this._caseService.isAssociatedEntityClicked.next(false);
        this._sharedServicesService.showFlashMessage('Failed to open entity page, Try again later.', 'danger');
      });
    }
  }

  // @reason : copy case and open it in new tab
  // @date : 05 jan 2023
  // @params : none
  // @author : janaka sampath , ammshathwan
  openCopiedCaseDetails(){
    const title = this.getLanguageKey("Confirm Copy Case") ? this.getLanguageKey("Confirm Copy Case") : "Confirm Copy Case";
    const body = this.getLanguageKey("Are you sure you want to copy Case") ? this.getLanguageKey("Are you sure you want to copy Case") : "Are you sure you want to copy Case";
    const data = {
      title : title,
      body : body + " " + this.data.rowData.id + "?"
    }
    const dialogConfig: MatDialogConfig = {width: "600px" , data , panelClass: 'copy-case-modal'}
    const dialogRef = this.dialog.open(CommonConfirmationModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((isConfirmed:boolean) => {
      if(!isConfirmed) return null

      this.showFullPageLoader = true;
      this._caseService.getCopiedCase(this.data.rowData.id).subscribe((res) => {
        this.showFullPageLoader = false;
        if(res && res.success && res.id){
          this._caseService.openCaseInNewTab(res.id)
        }
      }, (error) => {
        this.showFullPageLoader = false;
        this._sharedServicesService.showFlashMessage('Failed to copy case, please Try again', 'danger');
      })
    })
  }
  // @reason :get case contact data for requested case
  // @date : 15 dec 2022
  // @params : entity url , entity name , entity type , jurisdiction code , is click is trigger from tables (false)
  // @author : ammshawthan
  getCaseContactsById():void{
    const caseContactColumns = [
      // {
      //   'headerName': GlobalConstants.languageJson['contact_id'] !== undefined ? `${GlobalConstants.languageJson['contact_id']}` : 'Contact ID',
      //   'field': 'contact_id',
      //   'colId': 'contact_id',
      //   'width': 115,
      //   'initialShowColumn': false,
      // },
      {
        'headerName': GlobalConstants.languageJson['relevant'] !== undefined ? `${GlobalConstants.languageJson['relevant']}` : 'Relevant',
        'field': 'relevant',
        'colId': 'relevant',
        'width': 115,
        'minWidth': 115,
        'initialShowColumn': true,
        'cellRendererParams': {caseId: this.rowData.id},
        'cellRendererFramework': ToggleRenderComponent,
        'filter': false,
        'floatingFilter': false,
        'suppressMenu': true
      },
      {
        'headerName': GlobalConstants.languageJson['contact_type'] !== undefined ? `${GlobalConstants.languageJson['contact_type']}` : 'Contact Type',
        'field': 'contact_type',
        'colId': 'contact_type',
        'width': 160,
        'minWidth': 160,
        'initialShowColumn': true,
        'floatingFilterComponent': 'textFilter',
        'floatingFilterComponentParams': {
          'suppressFilterButton': false,
          'colId': 'contact_type',
          'options': [],
          'filterOptions': ['equals', 'lessThan', 'greaterThan'],
        },
        'suppressMenu': true
      },
      {
        'headerName': GlobalConstants.languageJson['first_name'] !== undefined ? `${GlobalConstants.languageJson['first_name']}` : 'First Name',
        'field': 'first_name',
        'colId': 'first_name',
        'width': 230,
        'minWidth': 230,
        'initialShowColumn': true,
        'floatingFilterComponent': 'textFilter',
        'floatingFilterComponentParams': {
          'suppressFilterButton': false,
          'colId': 'first_name',
          'options': [],
          'filterOptions': ['equals', 'lessThan', 'greaterThan'],
        },
        'suppressMenu': true
      },
      {
        'headerName': GlobalConstants.languageJson['last_name'] !== undefined ? `${GlobalConstants.languageJson['last_name']}` : 'Last Name',
        'field': 'last_name',
        'colId': 'last_name',
        'width': 230,
        'minWidth': 230,
        'initialShowColumn': true,
        'floatingFilterComponent': 'textFilter',
        'floatingFilterComponentParams': {
          'suppressFilterButton': false,
          'colId': 'last_name',
          'options': this.caseType,
          'filterOptions': ['equals', 'lessThan', 'greaterThan'],
        },
        'suppressMenu': true
      },
      {
        'headerName': GlobalConstants.languageJson['Role/Position'] !== undefined ? `${GlobalConstants.languageJson['Role/Position']}` : 'Role/Position',
        'field': 'position',
        'colId': 'position',
        'width': 165,
        'minWidth': 165,
        'initialShowColumn': true,
        'floatingFilterComponent': 'textFilter',
        'floatingFilterComponentParams': {
          'suppressFilterButton': false,
          'colId': 'position',
          'options': this.caseType,
          'filterOptions': ['equals', 'lessThan', 'greaterThan'],
        },
        'suppressMenu': true
      },
      {
        'headerName': GlobalConstants.languageJson['phone_number'] !== undefined ? `${GlobalConstants.languageJson['phone_number']}` : 'Phone Number',
        'field': 'phone_number',
        'colId': 'phone_number',
        'width': 170,
        'minWidth': 170,
        'initialShowColumn': true,
        'floatingFilterComponent': 'textFilter',
        'floatingFilterComponentParams': {
          'suppressFilterButton': false,
          'colId': 'phone_number',
          'options': this.caseType,
          'filterOptions': ['equals', 'lessThan', 'greaterThan'],
        },
        'suppressMenu': true
      },
      {
        'headerName': GlobalConstants.languageJson['email'] !== undefined ? `${GlobalConstants.languageJson['email']}` : 'Email Address',
        'field': 'email',
        'colId': 'email',
        'width': 230,
        'minWidth': 230,
        'initialShowColumn': true,
        'floatingFilterComponent': 'textFilter',
        'floatingFilterComponentParams': {
          'suppressFilterButton': false,
          'colId': 'email',
          'options': this.caseType,
          'filterOptions': ['equals', 'lessThan', 'greaterThan'],
        },
        'suppressMenu': true
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
      fileName: 'CaseContacts',
      sheetName: 1,
      columnSeparator: ",",
      columnKeys: [],
      showExportbutton: true,
      processCellCallback: function (params) {
        return params.value;
      },
      processHeaderCallback: function (params) {
        return params.column.getColDef().headerName.toUpperCase();
      }
    }

    this.caseContactsOptions = {
      'resizable': true,
      'tableName': 'Case contacts View',
      'columnDefs': caseContactColumns,
      'rowStyle': { 'border-bottom': '#424242 1px solid' },
      'rowSelection': 'multiple',
      'floatingFilter': true,
      'animateRows': true,
      'sortable': true,
      'tabs': false,
      'isShoHideColumns': true,
      'multiSortKey': 'ctrl',
      'componentType': 'case detail info',
      'defaultGridName': 'Case contacts View',
      'changeBackground': "#ef5350",
      'rowModelType': 'infinite',
      'enableTableViews': true,
      'paginationPageSize': 10,
      'pagination': true,
      'enableServerSideFilter': true,
      'enableServerSideSorting': false,
      'showBulkOperations': false,
      'filter': true,
      'suppressPaginationPanel': false,
      'enableCheckBoxes': false,
      'enableTopSection': true,
      'rowHeight': 53,
      'rowData': this.rowData,
      'cellClass': 'ws-normal',
      "applyColumnDefOrder": true,
      'this': this,
      'cacheBlockSize': 10,
      'instance': this._caseService,
      'method': "getCaseContacts",
      'dataModifier': "getCaseContactsInfo",
      'csvExportParams': csvExportParam,
      'caseId': this.currentCaseId,
      'isLatestUi' : true,
      'isFilterEnable' : true,
      'isExportEnable' : true,
      'isRefreshEnable' : true,
      'isMoreEnable' : false,
      'isCaseGrid' : true,
      'currentCaseName' : this.caseName,
    }
    this.isCaseContactLoad = true;
  }

  // @reason : Render case contact response data to table
  // @date : 30 dec 2022
  // @params : response from caseContacts?case_id= API
  // @author : ammshawthan
  getCaseContactsInfo(currentInstance = this, response: GridData<any>):Array<any>{
    if(response && response.result && response.result.length){
      this.caseContactsCount = response.result.length;
      return response.result.map(contact => {
        return {
          'case_id': (this.data && this.data.rowData && this.data.rowData.id) ? this.data.rowData.id : 0,
          // 'contact_id': (contact && contact.contact_id) ? contact.contact_id : 'N/A',
          'relevant': {'status' : contact.relevant , 'contactId' : contact.contact_id },
          'contact_type': this.getAllCaseContacttype(contact.contact_type),
          'first_name': (contact && contact.first_name) ? contact.first_name : 'N/A',
          'last_name': (contact && contact.last_name) ? contact.last_name : 'N/A',
          'position': (contact && contact.position) ? this.getUserRoleLabel(contact.position) : 'N/A',
          'phone_number': (contact && contact.phone_number) ? contact.phone_number : 'N/A',
          'email': (contact && contact.email) ? contact.email : 'N/A',
        }
      })
    }
  }

  // @reason : get all merged contact type lable
  // @date : 01 jan 2023
  // @params : contact type | array
  // @author : ammshawthan
  getAllCaseContacttype(contactType):string{
    let type = "N/A"
    if(contactType && contactType.length) type = `${(contactType.map(type => type.label)).join(', ')}`
    return type;
  }

  // @reason : get user label text
  // @date : 12 jan 2023
  // @params : role code
  // @author : ammshawthan
  // @return : user role
  getEntityContactUserRole():void{
    this._caseService.getEntityContactUserRole().subscribe((response:any) => {
      this.entityContactUserRole = response ? response : [];
    })
  }

  // @reason : get user label text
  // @date : 12 jan 2023
  // @params : role code
  // @author : ammshawthan
  // @return : user role
  getUserRoleLabel(userCode):string{
    let userRoleName = ''
    if(!userCode) return "N/A"
    this.entityContactUserRole.filter((role:any) => {
      if(role && role.code && role.code.toLowerCase() == userCode.toLowerCase()){
        userRoleName = role.displayName  ? role.displayName : role.code;
      }
    })
    return userRoleName ? userRoleName : 'N/A';
  }


  onFieldFocus01(): void {
    this.selectCaseType.open();
  }

  onFieldFocus02(): void {
    this.selectUserGrp.open();
  }

  onFieldFocus03(): void {
    this.selectAssignee.open();
  }

  onFieldFocus04(): void {
    this.selectRegion.open();
  }

  onFieldFocus05(): void {
    this.selectProducts.open();
  }

  onFieldFocus06(): void {
    this.selectBusinessPriority.open();
  }

  onFieldFocus08(): void {
    this.selectCaseRisk.open();
  }

  onFieldFocus09(): void {
    this.selectPriority.open();
  }

  onFieldFocus10(): void {
    this.remedationDate.open();
  }

  onFieldFocus11(): void {
    this.selectStatusdd.open();
  }

  onFieldFocus12(): void {
    this.selectReasons.open();
  }

  onFieldFocus13(): void {
    this.requestedDate.open();
  }

  public trackByListItemId(_, item): string {
    return item.listItemId;
  }

  public trackById(_, item): string {
    return item.id;
  }

  public trackByScreenName(_, item): string {
    return item.screenName;
  }

  public trackByDisplayName(_, item): string {
    return item.displayName;
  }
  public trackByName(_, item): string {
    return item.name;
  }
  public trackByReason(_, item): string {
    return item.reason;
  }
}
