import { CustomHeaderColumnComponent } from './../../../../common-modules/modules/ag-grid-table/cell-renderers/custom-header-column/custom-header-column.component';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AgGridTableService } from '../../../../common-modules/modules/ag-grid-table/ag-grid-table.service';
import { SingleSelectRendererComponentComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/single-select-renderer-component/single-select-renderer-component.component';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { UserSharedDataService } from '../../../../shared-services/data/user-shared-data.service';
import { Title } from '@angular/platform-browser';
import { DatePipe } from '@angular/common'
import { AppConstants } from '@app/app.constant';
import { ListTypes } from '../../../../common-modules/constants/listItems';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { CaseManagementService } from '../../case-management.service';
import { TranslateService } from '@ngx-translate/core';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { CaseSharedDataService } from '../../../../shared-services/data/case-shared-data.service';
import * as moment from 'moment';
import { RiskOverrideRenderComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/risk-override-render/risk-override-render.component';
import { GridData } from '@app/common-modules/models/grid-data.model';
import { CaseDetails } from '../../models/case-list/case-details.model';
import { SingleSelectDropdown } from '@app/common-modules/modules/ag-grid-table/models/sigle-select-dropdown.model';
import { CustomTableRendererComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/custom-table-renderer.component';
import {GeneralSettingsApiService} from "@app/modules/systemsetting/services/generalsettings.api.service";
import { forkJoin, Observable, Subject } from 'rxjs';
import { mergeMap, shareReplay, takeUntil, map } from 'rxjs/operators';
import { ICaseRiskFlag } from '../../models/case-list/case-risk-flag.model';
import { CaseRiskFlagRendererComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/case-risk-flag-renderer/case-risk-flag-renderer.component';
import {CellRendererTextComponent} from "@app/common-modules/modules/ag-grid-table/cell-renderers/cell-renderer-text/cell-renderer-text.component";
import { CellRendererDateComponent } from '@app/common-modules/modules/ag-grid-table/cell-renderers/cell-renderer-date/cell-renderer-date.component';
import { UserService } from '../../../user-management/services/user.service';
import { AgGridEvent } from 'ag-grid-community';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { User } from '../../../../shared/user/user.model';
import { WINDOW } from '../../../../core/tokens/window';
import { map as lodashMap } from 'lodash';
const datePipe = new DatePipe('en-US');

@AutoUnsubscribe()
@Component({
  selector: 'app-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.scss']
})
export class CaseListComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  componentName = 'caseWorkbench';
  globalPermissionJSON: [];
  caseWorkBenchPermissionJSON: any = {};
  caseListPermssionIds = []
  gridOptions: any = {};
  columnDefs = [];
  rowData = [];
  showRightPanel = true;
  presentDate: any = new Date();
  isGridOptionsLoaded = false;
  groupsLevelBulkOperations: any;
  currentUserDetails: any;

  listsOfDataByHeader = {
    riskIndicatorsList: new Array<SingleSelectDropdown>(),
    assigneeList: new Array<SingleSelectDropdown>(),
    caseTypeFilterList: new Array<SingleSelectDropdown>(),
    statusList: new Array<SingleSelectDropdown>(),
    priorityList: new Array<SingleSelectDropdown>(),
    businessPriorityList: new Array<SingleSelectDropdown>(),
    regionUpliftList: new Array<SingleSelectDropdown>(),
    productList: [],
    userGroup: [],
    tenant: [],
    riskFlags: [] as ICaseRiskFlag[]
  };

  params: any = {
    url: AppConstants.Case_New_API + 'export',
    skipHeader: false,
    columnGroups: true,
    skipFooters: true,
    skipGroups: true,
    skipPinnedTop: true,
    skipPinnedBottom: true,
    allColumns: true,
    fileName: 'case-' + this.presentDate.getDate() + "-" + (this.presentDate.getMonth() + 1) + "-" + this.presentDate.getFullYear(),
    sheetName: 1,
    columnSeparator: ",",
    columnKeys: ['caseId', 'EntityID', 'CaseName', 'caseType', 'Originator', 'OriginatorClientID', 'Assignee', 'status', "RiskIndicators", 'NextRemediationDate'],
    processCellCallback: function (params) {
      return params.value;
    },
    processHeaderCallback: function (params) {
      return params.column.getColDef().headerName.toUpperCase();
    }
  }
  showCaseMessage: boolean = false;
  caseMessage: string;
  showRefreshLink: boolean = false;
  private allUserGroups = [];
  private allTenants = [];
  dateFromat:string
  showAssignLoader: boolean = false;
  regionUpliftList1
  statusListData
  caseFinacialProductsList
  userGroupsList
  caseTypeData
  riskListData
  assigneeListData
  priorityListData
  businessPriorityListData
  riskFlagColorList = [
    {
      key:"high",
      color:"#cb323c"
    },
    {
      key:"medium",
      color:"#a211d6"
    },
    {
      key:"low",
      color:"#007d5e"
    }
  ]
  public activeUsers$: Observable<User[]> = this.userService.getActiveUsers$().pipe(shareReplay(1));
  isShowWidget:boolean = true;

  constructor(
    private _agGridTableService: AgGridTableService,
    private _sharedServicesService: SharedServicesService,
    private _commonServicesService: CommonServicesService,
    private titleService: Title,
    public _caseService: CaseManagementService,
    private generalService: GeneralSettingsApiService,
    private translateService: TranslateService,
    private caseSharedDataService: CaseSharedDataService,
    private userSharedDataService: UserSharedDataService,
    private readonly userService: UserService,
    @Inject(WINDOW) private readonly window: Window
  ) { }

  ngOnInit() {
    this.getFormat();
    this.getLanguage();
    this.getCaseListPermssionIds();
    this.titleService.setTitle("Case Management");
    this.subscribeToChartSelection();

    this._sharedServicesService.currentMessage.subscribe((v: any) => {
      this.showRightPanel = v;
    });

    this._caseService.updateTableData.subscribe(res => {
      if (res) {
        // grid refresh
      }
      this._agGridTableService.getObserverSelectedRows.subscribe(responce => {
        this.userBulkOperation(responce);
      });

    })

    this.generalService.getListItemsByListType('Tenant').then((res: any[]) => {
      this.allTenants = res;
      this.caseSharedDataService.setTenantData(res)
      this.listsOfDataByHeader.tenant = res.map(el => {
        return {
          listItemId: el.listItemId,
          name: el.displayName,
          label: el.displayName,
        }
      });
    });
    this.caseListTableLoad();
    this.getCurrentLoggedUserDetails();
    this._commonServicesService.getNewCases().subscribe((data: any) => {
      this.casesNotification(data);
    });
  }

  private dateComparator(date1, date2) {
    var date1Number = date1 && new Date(date1).getTime();
    var date2Number = date2 && new Date(date2).getTime();

    if (!date1Number && !date2Number) {
      return 0;
    }

    if (!date1Number) {
      return -1;
    } else if (!date2Number) {
      return 1;
    }

    if (date1Number == null && date2Number == null) {
      return 0;
    }

    if (date1Number == null) {
      return -1;
    } else if (date2Number == null) {
      return 1;
    }

    return date1Number - date2Number;
  }

  getCurrentLoggedUserDetails() {
    this.userSharedDataService.getCurrentUserDetails()
      .subscribe(response => {
        if (response) {
          this.currentUserDetails = response;
          GlobalConstants.currentLoggedUser = response.screenName;
        }
      });
  }

  localizePaginationText(languageJson) {
    setTimeout(() => {
      $(".ag-paging-panel span.ag-paging-page-summary-panel").contents()
        .filter(function () {
          if (this.nodeType === 3) {
            if (this.nodeValue.indexOf('Page') > -1) {
              this.nodeValue = languageJson['Page'] ? ` ${languageJson['Page']} ` : ' Page ';
            }
            if (this.nodeValue.indexOf('more') > -1) {
              this.nodeValue = languageJson['More'] ? ` ${languageJson['More']} ` : ' more ';
            }
            if (this.nodeValue.indexOf('of') > -1) {
              this.nodeValue = languageJson['Of'] ? ` ${languageJson['Of']} ` : ' of ';
            }
          }
          return null;
        });

      $(".ag-paging-panel span.ag-paging-row-summary-panel").contents()
        .filter(function () {
          if (this.nodeType === 3) {
            if (this.nodeValue.indexOf('to') > -1) {
              this.nodeValue = languageJson['To'] ? ` ${languageJson['To']} ` : ' to ';
            }
            if (this.nodeValue.indexOf('of') > -1) {
              this.nodeValue = languageJson['Of'] ? ` ${languageJson['Of']} ` : ' of ';
            }
          }
          return null;
        });
    }, 3000);

  }

  dateFormatter(params) {
    return params.value ? moment(params.value).format('DD,MMM,YYYY HH:mm') : '';
  }

  dateFormatterWithoutTime(params) {
    return params.value ? moment.utc(params.value).format(this.dateFromat? this.dateFromat : 'DD,MMM-YYYY') : '';
  }

  getLanguageKey(text) {
    var langKey = text;
    var localJson = GlobalConstants.languageJson
    if (localJson && localJson[text]) {
      langKey = localJson[text];
    }

    return langKey;
  }

  getCases(currentInstance = this, response: GridData<CaseDetails>, params: AgGridEvent): Array<any> {
    if (response && response.result.length) {
      this.activeUsers$.subscribe((activeUsers) => {
        const columnDefs = params.columnApi.getAllColumns().map(col => col.getColDef());
        const assigneeColumn = columnDefs.find(cd => cd.colId === 'assignee');
        const updateColumn = columnDefs.find(cd => cd.colId === 'modified_person');

        if(assigneeColumn){
          assigneeColumn.floatingFilterComponentParams = {
            ...assigneeColumn.floatingFilterComponentParams,
            options: this.refactorGivenSelectOptions(activeUsers , assigneeColumn.colId)
          }
        }

        if(updateColumn){
          updateColumn.floatingFilterComponentParams = {
            ...updateColumn.floatingFilterComponentParams,
            options: this.refactorGivenSelectOptions(activeUsers , updateColumn.colId)
          }
        }
        params.api.setColumnDefs(columnDefs);

      })
      return response.result.map(rowData => {
        if (rowData) {
          return {
            'id': (rowData.id) ? rowData.id : '',
            'customer_internal_id': (rowData.customer_internal_id) ? rowData.customer_internal_id : 'N/A',
            'entity': (rowData.entity) ? rowData.entity.entity_url : '',
            'name': (rowData.name) ? rowData.name.trim() : '',
            'type': (rowData.type && rowData.type.display_name) ? rowData.type.display_name.toLowerCase().trim() : 'N/A',
            'originator': (rowData.originator) ? rowData.originator.toLowerCase().trim() : '',
            'assignee': (rowData.assignee && rowData.assignee.screen_name) ? rowData.assignee.screen_name : this.getLanguageKey('unAssigned'),
            'status': (rowData.status && rowData.status.value) ? rowData.status.value.toLowerCase() : '',
            'priority': (rowData.priority && rowData.priority.display_name) ? rowData.priority.display_name : '',
            'created_on': rowData.created_on ? this.getFormattedDateTime(rowData.created_on) : 'N/A',
            'risk_indicator': (rowData.risk_indicator && rowData.risk_indicator.id) ? rowData.risk_indicator.display_name : '',
            'riskIndicatorId': (rowData.risk_indicator && rowData.risk_indicator.id) ? rowData.risk_indicator.id : '',
            'remediation_date': (rowData.remediation_date) ? this.getFormatedDate(rowData.remediation_date) : '',
            'requested_date': (rowData.requested_date) ? rowData.requested_date : '',
            'commentsCount': (rowData.comment_count) ? rowData.comment_count : '',
            'entityUrl': (rowData.entity) ? rowData.entity.entity_url : '',
            'statusKey': (rowData.status) ? rowData.status.key : '',
            'products': (rowData.products) ? rowData.products.map(prod => prod && prod.display_name ).join(", ") : '',
            "reason": (rowData.status_reasons) ? rowData.status_reasons : [],
            "previous_status_reasons": (rowData.previous_status_reasons) ? rowData.previous_status_reasons : '',
            "reasonHistoryData": (rowData.status_reason_history) ? this.getHistortReasonArray(rowData.status_reason_history) : [],
            "regionUpliftObj": (rowData.region_uplift) ? rowData.region_uplift : "N/A",
            "region_uplift": (rowData.region_uplift && rowData.region_uplift.display_name) ? rowData.region_uplift.display_name : "N/A",
            "entityInfo": (rowData.entity && rowData.entity.entity_info) ? this.getEntityInfo(rowData.entity.entity_info) : "",
            "selectCellDisable": this.getPermissionForCellAssignee('caseDetails', (rowData.assignee) ? rowData.assignee : '') ? true : false,
            "riskOverrideId": (rowData.risk_override && rowData.risk_override.id) ? rowData.risk_override.id : '',
            "risk_override": (rowData.risk_override && rowData.risk_override.id) ? rowData.risk_override.display_name : '',
            "risk_override_reason": (rowData.risk_override_reason) ? rowData.risk_override_reason : '',
            "business_priority": (rowData.business_priority) ? rowData.business_priority.display_name : '',
            "group_id": (rowData.assignee && rowData.assignee['group_id']) ? this.getAssignedUserGroup(rowData.assignee['group_id']) : 'unassigned',
            "tenant": (rowData.tenant && rowData.tenant['display_name']) ? rowData.tenant['display_name'] : '',
            "entity_id": (rowData.entity && rowData.entity.entity_id ? rowData.entity.entity_id : ''),
            "risk_score": rowData.risk_score || '',
            "risk_flags" : (rowData && rowData.risk_flags ? rowData.risk_flags : []),
            "jurisdiction_code" :(rowData.jurisdiction_code) ? rowData.jurisdiction_code : '',
            "last_status_update":(rowData.last_status_update) ? this.getFormatedDate(rowData.last_status_update) : '',
            'modified_on': (rowData.modified_on) ? this.getFormatedDate(rowData.modified_on) : "N/A",
            'modified_person': (rowData.modified_person) ? rowData.modified_person : this.getLanguageKey('N/A'),
          }
        }
      });
    }
    return [];
  }

  getEntityInfo(entityInfo: string): string {
    if (entityInfo) {
      try {
          return JSON.parse(this.window.atob(entityInfo));
      } catch(e) {
          return '';
      }
    }
    return '';
  }

  getHistortReasonArray(reasonHistoryData) {
    var reasonHistoryArray = [];
    if (reasonHistoryData) {
      try {
        reasonHistoryArray = JSON.parse(reasonHistoryData).reverse()
      } catch (e) {
        reasonHistoryArray = [];
      }
    }
    return reasonHistoryArray
  }

  getDropDownListsData() {
    this.columnDefs.map(value => {
      if (value.cellEditorParams) {
        if (value.colId == 'risk_indicator') {
          value['selectBoxListData'] = this.listsOfDataByHeader.riskIndicatorsList ? this.listsOfDataByHeader.riskIndicatorsList : [];
          value.floatingFilterComponentParams.options = this.listsOfDataByHeader.riskIndicatorsList;
        } else if (value.colId == 'priority') {
          value['selectBoxListData'] = this.listsOfDataByHeader.priorityList ? this.listsOfDataByHeader.priorityList : [];
          value.floatingFilterComponentParams.options = this.listsOfDataByHeader.priorityList
        } else if (value.colId == 'business_priority') {
          value['selectBoxListData'] = this.listsOfDataByHeader.businessPriorityList ? this.listsOfDataByHeader.businessPriorityList : [];
          value.floatingFilterComponentParams.options = this.unShiftAllTextInFilterOptions(JSON.parse(JSON.stringify(this.listsOfDataByHeader.businessPriorityList)), value.colId);
        }
      }
      if (value.colId == 'risk_override') {
        value.floatingFilterComponentParams.options = this.listsOfDataByHeader.riskIndicatorsList;
        value.options = this.listsOfDataByHeader.riskIndicatorsList
      }

      if (value.colId == 'type') {
        value.floatingFilterComponentParams.options = this.unShiftAllTextInFilterOptions(JSON.parse(JSON.stringify(this.listsOfDataByHeader.caseTypeFilterList)), value.colId);
      } if (value.colId == 'status') {
        value.floatingFilterComponentParams.options = this.listsOfDataByHeader.statusList
      }
      if (value.colId == 'products') {
        value.floatingFilterComponentParams.options = this.unShiftAllTextInFilterOptions(JSON.parse(JSON.stringify(this.listsOfDataByHeader.productList)), value.colId);
      }
      if (value.colId == 'region_uplift') {
        value.floatingFilterComponentParams.options = this.listsOfDataByHeader.regionUpliftList
      }
      if (value.colId == 'group_id') {
        value.floatingFilterComponentParams.options = this.unShiftAllTextInFilterOptions(JSON.parse(JSON.stringify(this.listsOfDataByHeader.userGroup)), value.colId);
      }
      if (value.colId == 'tenant') {
        value.floatingFilterComponentParams.options = this.unShiftAllTextInFilterOptions(JSON.parse(JSON.stringify(this.listsOfDataByHeader.tenant)), value.colId);
      }
      if (value.colId == 'risk_flag') {
        value.floatingFilterComponentParams.options = this.unShiftAllTextInFilterOptions(JSON.parse(JSON.stringify(this.listsOfDataByHeader.riskFlags)), value.colId);
      }
    });
  }

  getSelectedValue(list, value) {
    var selectedLabel = '';
    list.filter((val) => {
      if (val.listItemId && value && (val.listItemId == value)) {
        selectedLabel = val.label ? val.label : '';
      }
    });
    return selectedLabel;
  }

  unShiftAllTextInFilterOptions(list , colID?:string) {
    var tempList = list ? list : [];
    if(colID !== 'products' && colID !== 'group_id' && colID !== 'business_priority' && colID !== 'tenant' && colID !== 'type'){
      tempList.unshift({
        'listItemId': null,
        'label': this.translateService.instant('All')
      });
    }
    return tempList;
  }



  exportData() {
    document.getElementById("export-button").click();
    // let ele = (<HTMLInputElement>document.getElementById("alertExport"));
    // ele.disabled = true;
    // ele.innerHTML = "Exporting..."
  }

  exportDataPdf() {
    document.getElementById("export-pdf-button").click();
    // let ele = (<HTMLInputElement>document.getElementById("alertExport"));
    // ele.disabled = true;
    // ele.innerHTML = "Exporting..."
  }

  getFormattedDate(date) {
    let myFormattedDate = datePipe.transform(date, 'MMM d, y')
    return myFormattedDate;
  }

  userBulkOperation(responce) {
    if (responce && responce.selectedRowsForAssignee && responce.selectedRowsForAssignee.api) {
      var statusPermissions = [];
      var caseIdList_permitted = [];
      var finalAssignedList_bluk = [];
      var caseIdList_non_permitted = [];

      const promisePermission = new Promise((resolve) => {
        this._caseService.getAllPermissionByStatus().subscribe((resp)=>{
          if (resp) {
            Object.keys(resp).forEach(status => {
              if(resp[status] == 2){
                statusPermissions.push(status)
              }
            });
            resolve('')
          } else {
            resolve('')
          }
        },()=>{
          resolve('')
        })
      })

      Promise.all([promisePermission]).then(() => {
        responce.thisTableRef.storeAllRowSelected.forEach((rowData)=>{
          if(statusPermissions.includes(rowData.data.statusKey)){
           caseIdList_permitted.push(rowData.data.id)
           finalAssignedList_bluk.push(rowData);
          }else if(rowData.data.statusKey == ''){
           caseIdList_permitted.push(rowData.data.id)
           finalAssignedList_bluk.push(rowData);
          }else{
           caseIdList_non_permitted.push(rowData.data.id)
          }
       })

       if (caseIdList_permitted.length) {
         responce.thisTableRef.effectedAlerts = caseIdList_permitted.length;
         const dialogRef = responce.dialogBox.open(responce
           .changeLevelModal, {
           width: '250px',
           panelClass: ['confirm-dialog', 'light-theme']
         });

         dialogRef.afterClosed().subscribe(result => {
           var promises = [];
           if (!result) {
             return false;
           }
           else {
             var data = {
               "assignee": (responce.values)? responce.values.userId: responce.userId,
               "cases_id_list": caseIdList_permitted
             }

             if(data.assignee == "unassigned"){
               data.assignee = 0;
             }

             this.showAssignLoader = true;
             this._caseService.updateCaseAssignAPI(data).subscribe((res)=>{
               var editedcount= Object.values(res).filter((i)=>{
                 return i == 1;
               }).length;

               var updatedArry = [];
               Object.keys(res).forEach((key)=>{
                 if(res[key] == 1){
                   updatedArry.push(key)
                 }
               })

               var bulkUpdateObj: any = {};
               bulkUpdateObj.formCaseBulk = true;
               this._agGridTableService.getUpdatedData(bulkUpdateObj);
               if(responce.screenName || responce.values.screenName){
                const assigneeName = (responce.screenName) ? responce.screenName : responce.values.screenName;
                this._sharedServicesService.showFlashMessage(`Assignee changed to ${assigneeName} for ${caseIdList_permitted.length} of ${responce.thisTableRef.storeAllRowSelected.length} records`, 'info');
                this.showAssignLoader = false;
               }
             },(err)=>{
               this._sharedServicesService.showFlashMessage("Internal Server Error",'danger');
               this.showAssignLoader = false;
             });
           }
         });
       }
       else if (caseIdList_permitted && caseIdList_permitted.length == 0) {
         responce.thisTableRef.effectedAlerts = 0;
         const dialogRef = responce.dialogBox.open(responce.changeLevelModal, {
           width: '250px',
           panelClass: ['confirm-dialog', 'light-theme']
         });

         dialogRef.afterClosed().subscribe(() => {
           return false;
         });
       }


      });
    }
  }

  getUniqueValuesFromArray(arr, key) {
    var uniqueArr = arr.reduce((acc, val) => {
      if (!acc.find(el => el[key] === val[key])) {
        acc.push(val);
      }
      return acc;
    }, []);
    return uniqueArr;
  }

  getLanguage() {
    let getLanguageData = (language) => {
      const key = this._commonServicesService.get_language_name(language);
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
          this._commonServicesService.sendLanguageJsonToComponents(res);
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
          this._commonServicesService.sendLanguageJsonToComponents(resp);
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

  getCaseListPermssionIds() {
    const permissions: any[] = this._sharedServicesService.getPermissions();
    if (permissions.length) {
      this.caseWorkBenchPermissionJSON =
        permissions[1].caseManagement.caseWorkbench;
    }
  }

  getPermissionForColumn(key) {
    let caseDetails = this.caseWorkBenchPermissionJSON.filter((val) => val[key])
    var caseDetailsObject = caseDetails && caseDetails.length > 0 && caseDetails[0] && caseDetails[0][key] ? caseDetails[0] && caseDetails[0][key] : {}
    if (caseDetailsObject) {
      var domain = localStorage.getItem('domain') ? localStorage.getItem('domain').split(' ').join('-').toLocaleLowerCase() : '';
      var domainValue = localStorage.getItem('domain') && caseDetailsObject[domain] ? caseDetailsObject[domain] : '';
    }
    var permissions = GlobalConstants.getPermissionsByRole.filter((val) => val.permissionId.permissionId == domainValue).sort((e) => e.permissionLevel);
    var CaseDetailpermissions = permissions.length > 0 ? permissions[0] : {}
    if (key === 'caseAssignment' && CaseDetailpermissions && CaseDetailpermissions.permissionLevel > 0) {
      return true;
    } else if (CaseDetailpermissions && CaseDetailpermissions.permissionLevel > 1) {
      return true;
    } else {
      return false;
    }
  }

  getPermissionForCellAssignee(key, assignee) {
    let caseDetails = this.caseWorkBenchPermissionJSON.filter((val) => val[key])
    var caseDetailsObject = caseDetails && caseDetails.length > 0 && caseDetails[0] && caseDetails[0][key] ? caseDetails[0] && caseDetails[0][key] : {}
    if (caseDetailsObject) {
      var domain = localStorage.getItem('domain') ? localStorage.getItem('domain').split(' ').join('-').toLocaleLowerCase() : '';
      var domainValue = localStorage.getItem('domain') && caseDetailsObject[domain] ? caseDetailsObject[domain] : '';
    }
    var permissions = GlobalConstants.getPermissionsByRole.filter((val) => val.permissionId.permissionId == domainValue).sort((e) => e.permissionLevel);
    var CaseDetailpermissions = permissions.length > 0 ? permissions[0] : {}

    if (!(CaseDetailpermissions && CaseDetailpermissions.permissionLevel > 1)) {
      return true
    }

    if (assignee == '') {
      return false
    }
    return false;
  }

  casesNotification(data) {
    this.showCaseMessage = true;
    this.caseMessage = `Batch file processing completed.${data} cases created for the file`;
    this.showRefreshLink = true;
  }

  closeCasesNotification() {
    this.showCaseMessage = false;
  }

  reloadContent(): void {
    this._caseService.updateTableData.next(true);
  }

  getAssignedUserGroup(groupId) {
    if(groupId){
      let obj = this.allUserGroups.find(o => o.id === groupId);
      if(obj){
        return obj.name;
      }
    }
  }

  getTenant(tenantId) {
    this.allTenants.find(el => {
      return el.id === tenantId;
    });
  }

  ngOnDestroy(): void {
    this._agGridTableService.dateModelFilter = {};
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getFormat():void{
    this._sharedServicesService.dateFormatValue.subscribe(date => this.dateFromat = date ? date : 'DD MMM YYYY');
  }

  caseListTableLoad() {
    forkJoin([
      this._commonServicesService.getCaseCreateData(ListTypes.caseType),
      this._commonServicesService.getCaseCreateData('Case Risk'),
      this._commonServicesService.getCaseCreateData('Case Priority'),
      this._commonServicesService.getCaseCreateData('Region Uplift'),
      this._commonServicesService.getCaseCreateData('Financial Product'),
      this._caseService.getAllUserGroupsAPI(),
      this._commonServicesService.getCaseCreateData('Case Business Priority'),
      this._commonServicesService.getCaseCreateData('Risk Flag'),
      this._caseService.getStructuredStatusList(),
    ])
    .subscribe((data) => {

      // caseTypeFilterList
      if(data[0]){
        this.caseSharedDataService.setCaseListTypeOptions(data[0]);
        data[0].map(val => {
          val['label'] = val.displayName;
          val['values'] = [];
          val['values']['icon'] = val.icon;
          val['values']['colorCode'] = val.colorCode;
        })
        this.listsOfDataByHeader.caseTypeFilterList = data[0]
      }

      //riskIndicatorsList
      if(data[1]){
        data[1].map(val => {
          val['label'] = val.displayName;
          val['values'] = [];
          val['values']['icon'] = val.icon;
          val['values']['colorCode'] = val.colorCode;
        })
        this.listsOfDataByHeader.riskIndicatorsList =  data[1];
      }

      // priorityList
      if(data[2]){
        data[2].map(val => {
          val['label'] = val.displayName;
          val['values'] = [];
          val['values']['icon'] = val.icon;
          val['values']['colorCode'] = val.colorCode;
        })
        this.listsOfDataByHeader.priorityList = data[2];
      }

      // regionUpliftList
      if(data[3]){
        data[3].map(val => {
          val['label'] = val.displayName;
          val['values'] = [];
          val['values']['icon'] = val.icon;
          val['values']['colorCode'] = val.colorCode;
        });
        this.listsOfDataByHeader.regionUpliftList = data[3];
      }

      // productList
      if(data[4]) {
        this.caseSharedDataService.setProductListData(data[4])
        data[4].map(val => {
          val['label'] = val.displayName;
          val['values'] = [];
          val['values']['icon'] = val.icon;
          val['values']['colorCode'] = val.colorCode;
        });
        this.listsOfDataByHeader.productList = data[4];
      }

      // userGroup
      if(data[5]){
        if(data[5] && data[5].length>0){
          this.allUserGroups = data[5];
          for(let i=0; i<data[5].length; i++){
            this.listsOfDataByHeader.userGroup.push({
              listItemId: data[5][i].id,
              name: data[5][i].name,
              label: data[5][i].name
            });
          }
        }
      }

      // businessPriorityList
      if(data[6]){
        this.listsOfDataByHeader.businessPriorityList = data[6].map(val => {
          return  {
            'label' : val.displayName,
            'value' : val.listItemId,
            'listItemId': val.listItemId
          }
        });
      }

      // riskFlags
      if(data[7]){
        this.listsOfDataByHeader.riskFlags = /* data[7] */['H', 'M', 'S'].map(val => {
          return  {
            label: val,
            value: val,
            color: '#c62828'
          }
        });
      }

      // statusList
      if(data[8]){
      let workflowStatusList = [];
      let caseWorkflowStatusList = [];

      workflowStatusList = data[8] && data[8].workflowStatus && data[8].workflowStatus.data ? data[8].workflowStatus.data :  data[8].workflowStatus;
      caseWorkflowStatusList = data[8] && data[8].caseStatus && data[8].caseStatus.data ? data[8].caseStatus.data : data[8].caseStatus;

      workflowStatusList.forEach(status => {
          const foundStatus = caseWorkflowStatusList.filter(workFlowStatus => this._caseService.getLowerCaseText(workFlowStatus.code) == this._caseService.getLowerCaseText(status.id));
          GlobalConstants.caseStatusList.push({
            value: status && status.id ? status.id : foundStatus[0].code,
            code: status && status.id ? status.id : foundStatus[0].code,
            listItemId : foundStatus && foundStatus.length ? foundStatus[0].listItemId : 0,
            text: status && status.name ? status.name : foundStatus[0].displayName,
            icon: foundStatus && foundStatus.length && foundStatus[0].icon ? foundStatus[0].icon : "ban",
            colorCode: foundStatus && foundStatus.length && foundStatus[0].colorCode ? foundStatus[0].colorCode : "ffffff"
          })
      })


      const assigneeTempList = GlobalConstants.caseStatusList;
      assigneeTempList.map(val => {
        val['label'] = val.text;
        val['values'] = [];
        val['values']['icon'] = val.icon;
        val['values']['colorCode'] = val.colorCode;
      });
        this.listsOfDataByHeader.statusList = assigneeTempList;

        this.configCaseList();
      } else {
        this.configCaseList();
      }
    })
  }

  configCaseList():void{
    this.columnDefs = [];
      function dateComparator(date1, date2) {
        var date1Number = date1 && new Date(date1).getTime();
        var date2Number = date2 && new Date(date2).getTime();

        if (!date1Number && !date2Number) {
          return 0;
        }

        if (!date1Number) {
          return -1;
        } else if (!date2Number) {
          return 1;
        }

        if (date1Number == null && date2Number == null) {
          return 0;
        }

        if (date1Number == null) {
          return -1;
        } else if (date2Number == null) {
          return 1;
        }

        return date1Number - date2Number;
      }

      this.columnDefs.push({
        'headerComponentFramework' : CustomHeaderColumnComponent,
        'headerName': 'Select',
        'field': 'select',
        'colId': 'select',
        'headerCheckboxSelection': true,
        'width': 150,
        'checkboxSelection': this.getPermissionForColumn('caseAssignment') ? true : false,
        'initialShowColumn': true,
        'filter': false,
        'floatingFilter': false,
        'sortable': true,
        'headerComponentParams': {
          headerCheckboxSelection: true,
          label: "Select",
          tableName: "Case list view"
        }
      });
      this.columnDefs.push({
        'headerName': 'Case_Id',
        'field': 'id',
        'colId': 'id',
        'width': 150,
        'initialShowColumn': true,
        'floatingFilterComponent': 'textFilter',
        'floatingFilterComponentParams': {
        'suppressFilterButton': true,
        'colId': 'id',
        'filterOptions': ['equals', 'lessThan', 'greaterThan'],
        },
      });
      this.columnDefs.push({
        'headerName': 'Customer_Internal_ID',
        'field': 'customer_internal_id',
        'colId': 'customer_internal_id',
        'width': 150,
        'initialShowColumn': true,
        'floatingFilterComponent': 'textFilter',
        'floatingFilterComponentParams': {
        'suppressFilterButton': true,
        'colId': 'customer_internal_id',
        'filterOptions': ['equals', 'lessThan', 'greaterThan'],
        }
      });
      this.columnDefs.push({
        'headerName': 'Entity_ID',
        'field': 'entity_id',
        'colId': 'entity_id',
        'width': 150,
        'initialShowColumn': false,
        'floatingFilterComponent': 'textFilter',
        'floatingFilterComponentParams': {
        'suppressFilterButton': true,
        'colId': 'entity_id',
        'filterOptions': ['equals', 'lessThan', 'greaterThan'],
        }
      });
      this.columnDefs.push({
        'headerName': 'Case_Name',
        'field': 'name',
        'colId': 'name',
        'width': 150,
        'initialShowColumn': true,
        'cellClass': 'c-pointer dots-text py-4 d-inline',
        'floatingFilterComponent': 'textFilter',
        'floatingFilterComponentParams': {
        'suppressFilterButton': true,
        'colId': 'name',
        'filterOptions': ['equals', 'lessThan', 'greaterThan'],
        }
      });
      this.columnDefs.push({
        'headerName': 'Case_Type',
        'field': 'type',
        'colId': 'type',
        'width': 150,
        'initialShowColumn': true,
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'type',
          'options': []
        },
        cellRendererFramework: CellRendererTextComponent
      });
      this.columnDefs.push({
        'headerName': 'Originator',
        'field': 'originator',
        'colId': 'originator',
        'width': 150,
        'initialShowColumn': true,
        'cellClass': '',
        'floatingFilterComponent': 'textFilter',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'originator',
          'filterOptions': ['equals', 'lessThan', 'greaterThan'],
        },
        cellRendererFramework: CellRendererTextComponent
    });
      this.columnDefs.push({
        'headerName': 'Assignee',
        'field': 'assignee',
        'colId': 'assignee',
        'width': 150,
        'initialShowColumn': true,
        'customTemplateClass': 'assigneeColumn',
        'selectBoxListData': [],
        'cellEditorParams': {
          'values': []
        },
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'assignee',
          'options': []
        },
        cellRendererFramework: CellRendererTextComponent,
      });
      this.columnDefs.push({
        'headerName': 'Status',
        'field': 'status',
        'colId': 'status',
        'width': 150,
        'initialShowColumn': true,
        'cellClass': 'text-capitalize',
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'status',
          'options': []
        },
        cellRendererFramework: CellRendererTextComponent,
      });
      this.columnDefs.push({
        'headerName': 'Risk_Indicators',
        'field': 'risk_indicator',
        'colId': 'risk_indicator',
        'width': 150,
        'class': "RiskIndicators",
        'initialShowColumn': true,
        'cellClass': 'text-capitalize',
        'selectBoxListData': [],
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'risk_indicator',
          'options': []
        },
        'cellEditorParams': {
          'values': []
        },
        cellRendererFramework: CellRendererTextComponent
      });

      this.columnDefs.push({
        'headerName': GlobalConstants.languageJson['Risk Score'] !== undefined ? `${GlobalConstants.languageJson['Risk Score']}` : this.translateService.instant('Risk Score'),
        'field': 'risk_score',
        'colId': 'risk_score',
        'width': 150,
        'initialShowColumn': false,
        'suppressFilterButton': true,
        'floatingFilterComponent': 'textFilter',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'risk_score',
          'filterOptions': ['equals', 'lessThan', 'greaterThan'],
        },
        cellRendererFramework: CellRendererTextComponent
      });

      this.columnDefs.push({
        'headerName': 'Risk Override',
        'field': 'risk_override',
        'colId': 'risk_override',
        'width': 150,
        'initialShowColumn': true,
        'cellRendererFramework': RiskOverrideRenderComponent,
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'risk_override',
          'options': []
        },
        'options': [],
      });
      this.columnDefs.push({
        'headerName': 'Risk Override Reason',
        'field': 'risk_override_reason',
        'colId': 'risk_override_reason',
        'width': 150,
        'initialShowColumn': true,
        'floatingFilterComponent': 'textFilter',
        'floatingFilterComponentParams': {
        'suppressFilterButton': true,
        'colId': 'risk_override_reason',
        'filterOptions': ['equals', 'lessThan', 'greaterThan'],
        }
      });
      this.columnDefs.push({
        'headerName': 'Next_Remediation_Date',
        'field': 'remediation_date',
        'colId': 'remediation_date',
        'sort': 'desc',
        'width': 200,
        'initialShowColumn': true,
        'floatingFilterComponent': 'dateFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'remediation_date',
          'datePickerOptions': 'futureDateOptions'
        },
        'suppressMenu': true,
        cellRendererFramework: CellRendererDateComponent,
        comparator: dateComparator
      });
      this.columnDefs.push({
        'headerName': 'Priority',
        'field': 'priority',
        'colId': 'priority',
        'width': 150,
        'class': "priority",
        'initialShowColumn': true,
        'cellRendererFramework': this.getPermissionForColumn('caseDetails') ? SingleSelectRendererComponentComponent : '',
        'selectBoxListData': [],
        'customTemplateClass': 'priorityColumn_ViewMode',
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'priority',
          'options': []
        },
        'options': [{ label: "All" }, { label: "Height" }, { label: "low" }],
        'cellEditorParams': {
          'values': []
        }
      });

      this.columnDefs.push({
        'headerName': 'Indicators',
        'field': 'Indicators',
        'colId': 'Indicators',
        'filter': false,
        'width': 150,
        'initialShowColumn': true,
        'cellRendererFramework': CustomTableRendererComponent,
        'customTemplateClass': 'caselist-component',
        'sortable': false
      })

      this.columnDefs.push({
        'headerName': 'Business Priority',
        'field': 'business_priority',
        'colId': 'business_priority',
        'width': 150,
        'class': "BusinessPriority",
        'initialShowColumn': false,
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'business_priority',
          'options': []
        },
        'cellEditorParams': {
          'values': []
        },
      });


      this.columnDefs.push({
        'headerName': 'User Group',
        'field': 'group_id',
        'colId': 'group_id',
        'width': 150,
        'class': "product",
        'initialShowColumn': false,
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'group_id',
          'options': []
        }
      });
      this.columnDefs.push({
        'headerName': 'Region_Uplift',
        'field': 'region_uplift',
        'colId': 'region_uplift',
        'width': 150,
        'initialShowColumn': true,
        'cellClass': 'regionUplift text-capitalize',
        'customTemplateClass': 'region-flags',
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'region_uplift',
          'options': []
        },
      });
      this.columnDefs.push({
        'headerName': 'Products',
        'field': 'products',
        'colId': 'products',
        'width': 150,
        'initialShowColumn': true,
        'cellClass': 'product text-capitalize',
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'products',
          'options': []
        },
      });
      this.columnDefs.push({
        'headerName': 'Case_Creation',
        'field': 'created_on',
        'colId': 'created_on',
        'width': 150,
        'initialShowColumn': true,
        'floatingFilterComponent': 'dateFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'created_on',
          'datePickerOptions': 'default'
        },
        'suppressMenu': true,
        cellRendererFramework: CellRendererDateComponent,
        comparator: dateComparator
      });
      this.columnDefs.push({
        'headerName': 'Tenant',
        'field': 'tenant',
        'colId': 'tenant',
        'width': 150,
        'class': "product",
        'initialShowColumn': false,
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'tenant',
          'options': []
        }
      });
      this.columnDefs.push({
        'headerName': 'Previous Status Reasons',
        'field': 'previous_status_reasons',
        'colId': 'previous_status_reasons',
        'width': 150,
        'initialShowColumn': true,
        'floatingFilterComponent': 'textFilter',
        'floatingFilterComponentParams': {
        'suppressFilterButton': true,
        'colId': 'previous_status_reasons',
        'filterOptions': ['equals', 'lessThan', 'greaterThan'],
        }
      });

      this.columnDefs.push({
        'headerName': GlobalConstants.languageJson['Risk Flag'] !== undefined ? `${GlobalConstants.languageJson['Risk Flag']}` : this.translateService.instant('Risk Flag'),
        'field': 'risk_flags',
        'colId': 'risk_flags',
        'width': 300,
        'initialShowColumn': true,
        'cellRendererFramework': CaseRiskFlagRendererComponent,
        'cellRendererParams': {flagColors: this.riskFlagColorList},
        'floatingFilterComponent': 'textFilter',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'risk_flags',
          'options': []
        }
      });

      this.columnDefs.push({
        'headerName': 'Status Update',
        'field': 'last_status_update',
        'colId': 'last_status_update',
        'width': 200,
        'initialShowColumn': false,
        'floatingFilterComponent': 'dateFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'last_status_update'
        }
      });

       this.columnDefs.push({
         'headerName': GlobalConstants.languageJson['Jurisdiction'] !== undefined ? `${GlobalConstants.languageJson['Jurisdiction']}` : this.translateService.instant('Jurisdiction'),
         'field': 'jurisdiction_code',
         'colId': 'jurisdiction_code',
         'width': 150,
         'initialShowColumn': true,
         'cellClass': 'text-capitalize',
         'floatingFilterComponent': 'textFilter',
         'floatingFilterComponentParams': {
           'suppressFilterButton': true,
          'colId': 'jurisdiction_code',
         'options': []
       }
       });

    this.columnDefs.push({
        'headerName': 'Updated',
        'field': 'modified_on',
        'colId': 'modified_on',
        'width': 150,
        'initialShowColumn': true,
        'floatingFilterComponent': 'dateFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'modified_on',
          'datePickerOptions': 'default'
        },
        'suppressMenu': true,
        cellRendererFramework: CellRendererDateComponent,
        comparator: dateComparator
      });

      this.columnDefs.push({
        'headerName': 'Updated By',
        'field': 'modified_person',
        'colId': 'modified_person',
        'width': 150,
        'initialShowColumn': true,
        'customTemplateClass': 'updateColumn',
        'selectBoxListData': [],
        'cellEditorParams': {
          'values': []
        },
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'modified_person',
          'options': []
        },
        cellRendererFramework: CellRendererTextComponent,
      });

      this.getDropDownListsData();
      this.gridOptions = {
        'resizable': true,
        'tableName': 'Case list view',
        'columnDefs': this.columnDefs,
        'rowData': this.rowData,
        'rowStyle': { 'border-bottom': '#424242 1px solid' },
        'rowSelection': 'multiple',
        'floatingFilter': true,
        'animateRows': true,
        'sortable': true,
        'tabs': false,
        'isShoHideColumns': true,
        'multiSortKey': 'ctrl',
        'componentType': 'case list',
        'defaultGridName': 'case View',
        'cellClass': 'ws-normal',
        'changeBackground': "#ef5350",
        'rowModelType': 'infinite',
        'instance': this._caseService,
        'this': this,
        'method': "getCasesListNew",
        'dataModifier': "getCases",
        'enableTableViews': true,
        'cacheBlockSize': 10,
        'paginationPageSize': 10,
        'pagination': true,
        'enableServerSideFilter': false,
        'enableServerSideSorting': false,
        'showBulkOperations': false,
        'groupsLevelBulkOperations': this.groupsLevelBulkOperations,
        'filter': true,
        'enableCheckBoxes': false,
        'enableTopSection': true,
        'rowHeight': 53,
        'csvExportParams': this.params,
        "sortingOrder": ["asc", "desc"],
        "suppressRowClickSelection": true,
        'dateFilterProperties': {
          opensProperty: 'left',
          dropsPropertyType: 'up'
        },
        'onPaginationChanged': (params) => {
          if (params.newPage) {
            this._caseService.currentPage = params.api.paginationGetCurrentPage();
          }
        },
      }

      this.getCurrentLoggedUserDetails();
      this._commonServicesService.getNewCases().subscribe((data: any) => {
        this.casesNotification(data);
      });
      this.isGridOptionsLoaded = true
  }



  getDecodedOject(encodedValue):string{
    let entityInfo:string = ""
    try{
      entityInfo = decodeURIComponent(escape(this.window.atob(encodedValue)));
    }
     catch(e){
      entityInfo = decodeURIComponent(this.window.atob(encodedValue).replace(/\%/g, "%25"));
    }
    return entityInfo
  }

  private subscribeToChartSelection(): void {
    this._caseService.chartSelectionSubject
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((caseData) => {
        const filterModel = {
          [caseData.chartId]: {
            filterType: 'text',
            type: 'contains',
            filter: caseData.data
          }
        };
        this._agGridTableService.updateGridFilters(filterModel, false);
      });
  }

  // @reason : format the given date using global format and change the time format UTC to local
  // @author : ammshathwan
  // @date : 24 jan 2023
  // @params : date
  // @return : formated date and time
  getFormattedDateTime(date:string):string{
    if(!date) return "N/A";
    return moment(date).format(this.dateFromat + ',hh:mm:ss A')
  }

  // @param date gets date value as a string
  // @returns date in DD-MMM-YYYY format

  getFormatedDate(date:string):string{
    if(!date) return "N/A";
    return moment(date).format('DD-MMM-YYYY');
  }


  // @reason : listen when widget hide and show funtion is called from child component
  // @author : ammshathwan
  // @date : 31 may 2023
  // @params : event from child component
  listenWidgetVissibleChanges(event){
    this.isShowWidget = event  ? event.showWidget : true;
    this._caseService.behaviorSubjectForWidgetVissibleChange.next(this.isShowWidget)
  }

  refactorGivenSelectOptions(selectOptions:any[] , colId:string):any[]{
    const assigneeList: Array<any> = [];
    selectOptions.map(activeUser => {
          assigneeList.push(
            {
              screenName: activeUser.screenName,
              userId: activeUser.userId.toString(),
            }
          )
    });

    const screenName = colId == 'assignee' ? 'unassigned' : 'n/a'
    let existValueUnAssigned = assigneeList.every(function (e) {
      return (e.screenName).toLowerCase() == screenName.toLowerCase();
    });

    if (!existValueUnAssigned && assigneeList && assigneeList.length) {
      const defaultLabelObj = {
        'label': colId == 'assignee' ? 'Unassigned' : 'N/A',
        'value': colId == 'assignee' ? 'unassignee' : 'n/a',
        'screenName': colId == 'assignee' ? 'unassigned' : 'N/A',
        'userId': colId == 'assignee' ? 'unassignee' : 'n/a'
      }

      assigneeList.unshift(defaultLabelObj);
    }

    assigneeList.map(val => {
      val['label'] = val.screenName;
      val['values'] = [];
      val['listItemId'] =  val.userId;
      val['value'] =  val.userId;
      val['displayName'] = val.screenName;
    });

    return assigneeList
  }
}
