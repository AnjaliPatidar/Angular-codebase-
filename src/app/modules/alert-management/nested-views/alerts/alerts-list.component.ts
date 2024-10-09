import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, Inject } from '@angular/core';
import { AgGridTableService } from '../../../../common-modules/modules/ag-grid-table/ag-grid-table.service';
import { AlertManagementService } from '../../alert-management.service';
import { SharedServicesService } from '../../../../shared-services/shared-services.service'
import { map, filter, switchMap, tap, catchError, shareReplay, takeUntil } from 'rxjs/operators';
import { SingleSelectRendererComponentComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/single-select-renderer-component/single-select-renderer-component.component';
import { CustomTableRendererComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/custom-table-renderer.component';
import { AppConstants } from '../../../../app.constant';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { combineLatest, Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { Title } from '@angular/platform-browser';
import { EntityNameComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/entity-name/entity-name.component';
import { ConfidenceLevelComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/confidence-level/confidence-level.component';
import { AlertCommentsComponent } from '@app/common-modules/modules/alerts-comments/alert-comments.component';
import { WebSocketAPI } from '../../websocket';
import { GroupAssignmentComponent } from "@app/common-modules/modules/ag-grid-table/modals/group-assignment/group-assignment.component";
import { MatDialog } from "@angular/material/dialog";
import { RelatedCaseIdComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/relatedCaseId/relatedCaseId.component';
import { GeneralSettingsApiService } from '@app/modules/systemsetting/services/generalsettings.api.service';
import { ActivatedRoute, Params } from '@angular/router';
import { CellRendererDateComponent } from '@app/common-modules/modules/ag-grid-table/cell-renderers/cell-renderer-date/cell-renderer-date.component';
import * as moment from 'moment';
import { UserService } from '../../../user-management/services/user.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { User } from '../../../../shared/user/user.model';
import { WINDOW } from '../../../../core/tokens/window';

@AutoUnsubscribe()
@Component({
  selector: 'app-alerts-list',
  templateUrl: './alerts-list.component.html',
  styleUrls: ['./alerts-list.component.scss']
})
export class AlertsListComponent implements OnInit, AfterViewInit, OnDestroy {

  /**====================== Public variables Start=======================*/
  public userGroups = GlobalConstants.systemSettings.userGroups;
  public gridOptions: any = {};
  public isGridOptionsLoaded: boolean = false;
  public tabsData: any = [];
  public showPanel: boolean = false;
  public assignList: any = [];
  public componentThis: any;
  public paginationPageSize: any;
  public getRowHeight: any;
  public dateFormat = GlobalConstants.globalDateFormat;
  public statusObjs_new: any = [];
  public table_lists_data: any = {
    feed_list: [],
    assignee_list: [],
    status_list: []
  }
  public showAlertMessage: boolean = false;
  public alert = {
    type: 'success',
    message: 'New alerts  has been generated. Please click here to check'
  };
  public Rowparams: any;
  public reviewerStatusList: any = [];
  public presentDate: any = new Date();
  public statusObjs: any = [];
  public alertStatus: any = [];
  public hasZeroAlerts: boolean = false;
  public unsubscribe$: any;
  public showTable: boolean = true;
  public hasErrorMessage: boolean;
  public modalReference: any;
  public alertsCount: number = 0;
  public groupLevelSelectedValue: any;
  public assigneeListForBulkDropDown: any = [];
  public feedListForBulkTextSlider: any = [];
  public languageJson: any;
  public userFeeds: any[];
  public feedFilterOptions: any[] = [];
  public showEICard: boolean = false;
  public screeningCompleted: boolean = false;
  public newAlertsCount: number;
  public showRefreshLink: boolean = false;
  public alertListUtilityObject: any = {
    suppressedMessage: '',
    createdMessage: '',
    suppressed: '',
    created: '',
    languageTranslateList: []
  }
  @ViewChild(CustomTableRendererComponent, { static: false }) customComponent: CustomTableRendererComponent;
  @ViewChild(AlertCommentsComponent, { static: false }) alertComments: AlertCommentsComponent;
  /**====================== Public variables End=======================*/

  /**====================== Private variables start =======================*/
  private columnDefs: any = [];
  private rowData: any = [];
  public alertListPermssionIds = [];
  private componentName = 'alertsList';
  /**====================== Private variables end =======================*/
  private adverseMediaWS: WebSocketAPI
  private suppressionAlertsWS: WebSocketAPI

  private screeningIds;
  groupFilterOptions: any[];
  screeningTimedOut: boolean = false;
  alertCardInitLoader = false;
  dateFromat:string;
  filterString: string;
  public queryParamLoaded: number = 0;
  public activeUsers$: Observable<User[]> = this.userService.getActiveUsers$().pipe(shareReplay(1));

  public unsubscribeObservable = new Subject();

  constructor(
    private _sharedService: SharedServicesService,
    private _agGridTableService: AgGridTableService,
    private _alertService: AlertManagementService,
    private translate: TranslateService,
    private _commonService: CommonServicesService,
    private _generalSettingsApiService: GeneralSettingsApiService,
    private titleService: Title,
    private readonly userService: UserService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    @Inject(WINDOW) private readonly window: Window
  ) { }


  /**This will load at component load
   * Author : karnakar
   * Date : 27-june-2019
  */
  params: any = {
    url: AppConstants.Ehub_Rest_API + "alertManagement/getAlertsCSV",
    skipHeader: false,
    columnGroups: true,
    skipFooters: true,
    skipGroups: true,
    skipPinnedTop: true,
    skipPinnedBottom: true,
    allColumns: true,
    fileName: 'alerts-' + this.presentDate.getDate() + "-" + (this.presentDate.getMonth() + 1) + "-" + this.presentDate.getFullYear(),
    sheetName: 1,
    columnSeparator: ",",
    columnKeys: ['alertId', 'relatedCaseId', 'customerId', 'Relationship', 'Main Entity', 'watchlistVersion', 'entityName', 'ConfidenceLevel', 'createdAt', 'feed', "group level", 'assignee', 'status', 'wlEntityName', 'Hits', 'tenantId'],
    processCellCallback: function (params) {
      if (params.column.colId == "group level" || params.column.colId == "assignee" || params.column.colId == "status") {
        return params.value.key
      } else {
        return params.value;
      }
    },
    processHeaderCallback: function (params) {
      return params.column.getColDef().headerName.toUpperCase();
    }

  }

  jurisdictionList() {
    this._commonService.getJurdictionlist()
      .then((response) => {
        if (response) {
          GlobalConstants.jurisdictionsListResponse = response;
        }
      })
      .catch((err) => {
      })
  }

  ngOnInit() {
    let alertCardId = this.window.location.href.split('alertCard/')[1];
    let alertPopUpByEntityShow = false;
    if (alertCardId !== undefined) {
      alertPopUpByEntityShow = true;
      this.params.url = AppConstants.Ehub_Rest_API + "alertManagement/getAlertsCSVForEntity"
      let alertUrlId = alertCardId.split('/')[0];
      let customerUrlId = alertCardId.split('/')[1];

      let entityUrlId = alertCardId.split('/')[2];
      let cUrlId = alertCardId.split('/')[3];
      let eUrlId = alertCardId.split('/')[4];

      alertUrlId = decodeURIComponent(alertUrlId);
      customerUrlId = decodeURIComponent(customerUrlId);
      entityUrlId = decodeURIComponent(entityUrlId);
      cUrlId = decodeURIComponent(cUrlId);
      eUrlId = decodeURIComponent(eUrlId);

      let newUrl_alertToEntityUrl = 'entity/#!/company/' + entityUrlId + '?eid=' + eUrlId + '&cid=' + cUrlId;

      const pagination = {
        pageNumber: 1,
        recordsPerPage: 10,
        orderIn: "desc",
        orderBy: "createdDate",
        isAllRequired: false,
      };
      this.filterString = "{\"customerId\":{\"condition1\":{\"filter\":\""+customerUrlId+"\",\"type\":\"contains\",\"filterType\":\"text\"}}}";

      this._alertService.getAlertByCIdAId(pagination, this.filterString).subscribe((response: any) => {

        let selectedObj1 = this.getAlerts(this, response);

        if (selectedObj1.length > 0) {
          selectedObj1 = selectedObj1.filter((item)=>{
            return item.alertId.toString() === alertUrlId.toString();
          });
        }

        let selectedObj = response.result[0]
        selectedObj.completeRowData = response.result[0]
        selectedObj.comments = []
        selectedObj.showReviewerIcon = false
        let obj = {
          alertId: alertUrlId,
          data: selectedObj1[0],
          rowIndex: 0,
          rowPinned:undefined,
          type: "cellClicked",
          value: "Econocom Products and Solutions Belux",
          alertPopUpByEntity: alertPopUpByEntityShow,
          alertToEntityUrl: newUrl_alertToEntityUrl
        }

        this._agGridTableService.getComponentDataOnRowClick(obj);
      })
    }

    this.getLanguageList();
    this.getAlertIndicatorList();
    this.getRunningScreeningRequestIDForLoggedInUser();
    let ehubObject = JSON.parse(localStorage.getItem('ehubObject'))
    let webSocketEndPoint: string = `${AppConstants.Ehub_Rest_API}ws?token=${ehubObject['token']}`;

    /* websockets fro alerts secondary alerts  count */
    let topic: string = `/topic/secondaryAlert/${ehubObject['userId']}`;
    this.adverseMediaWS = new WebSocketAPI(this, webSocketEndPoint, topic);
    this.adverseMediaWS._connect()

    /* websockets fro alerts suppressed count */
    let suppressed_topic: string = `/topic/suppression/${ehubObject['userId']}`;
    this.suppressionAlertsWS = new WebSocketAPI(this, webSocketEndPoint, suppressed_topic);
    this.suppressionAlertsWS._connect()

    this.jurisdictionList()
    this.getAlertListPermssionIds().then().catch();
    this.titleService.setTitle("Alert Management");
    this._commonService.reloadConetnt.subscribe(data => {
      if (data) {
        this.showTable = false;
        setTimeout(() => {
          this.showTable = true;
        }, 500)
      }
    });

    this._alertService.getAlertReviewerStatusList('Alert Review Status').subscribe((resp) => {
      this.reviewerStatusList = resp.length ? resp : [];
    });

    var FeedFilterOptionsPromise = new Promise((resolve, reject) => {
      var options = [];
      this._alertService.getFeedList().subscribe(resp => {
        var feedList = resp;
        if (feedList && feedList.result && feedList.result.length) {
          feedList.result.filter((v) => {
            options.push(
              {
                'label': v.feedName ? v.feedName : '',
                'listItemId': v.feed_management_id
              }
            )
          });
        }
        this.feedFilterOptions = options;
        resolve("");
      });
    });


    let groupsLevelBulkOperations;
    var GroupsFilterOptionsPromise = new Promise((resolve, reject) => {
      this._alertService.getAllGroupList().subscribe(resp => {
        this.groupFilterOptions = this.setSingleFilterSelectOptionsForComponent(resp.result);
        groupsLevelBulkOperations = resp.result;
        resolve("");
      })
    });



    this._commonService.getAlerts.subscribe((data: any) => {
      this.alertsNotification(data)
    })

    var StatusListPromise = new Promise((resolve, reject) => {
      this._alertService.getStatus().subscribe((response) => {
        this.alertStatus = response;
        response.forEach((element) => {
          let statusObj = {
            label: this.translate.instant(element.displayName),
            disable: false,
            values: element,
            listItemId: element.listItemId
          }
          this.statusObjs.push(statusObj)
        });
        if(this.statusObjs.length > 0){
          this._alertService.getStatusObservable.next(this.statusObjs);
        }
        setTimeout(() => {
          resolve("");
        }, 500);
      });
    });

    /**Getting all group levels */
    this._alertService.getAssigneeListBasedOnFeed('').subscribe((resp) => {
      this.getAllAssignees(resp).forEach((value) => {
        this.assignList.push({
          listItemId: value.values['userId'],
          label: value.name
        })
      })
    });

    var StatusListPromise_new= new Promise((resolve, reject) => {
      this._generalSettingsApiService.getEntityWorkflows().then((res)=>{
        if(res  && res[0])  {
          var alertWorkflow = res.filter((item)=>{
            return item.entityName.toLowerCase() == "alert"
          });

          this._alertService.getStatus_new(alertWorkflow[0].workflowModelKey).subscribe((statusList)=>{
            statusList.forEach((e)=>{
              var key = Object.keys(e)[0];
              let statusObj = {
                      label: e[key],
                      disable: false,
                      values: key,
                      listItemId: key
              }
              this.statusObjs_new.push(statusObj)
            })
          });
        }
        setTimeout(() => {
              resolve("");
            }, 500);
      }).catch(()=>{
        setTimeout(() => {
              resolve("");
            }, 500);
      });
    });

    this.componentThis = this;

    Promise.all([FeedFilterOptionsPromise, GroupsFilterOptionsPromise, StatusListPromise, StatusListPromise_new,  this.getAlertListPermssionIds()]).then((values) => {

      let getDomainPermissions = (value, arg) => {
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
      let domainPermissions_configureUi = getDomainPermissions(this.alertListPermssionIds, 'configureAlertManagementUi');
      let domainPermissions_groupLevel = getDomainPermissions(this.alertListPermssionIds, 'groupLevel');
      let domainPermissions_assignee = getDomainPermissions(this.alertListPermssionIds, 'assignee');
      let domainPermissions_status = getDomainPermissions(this.alertListPermssionIds, 'status');

      let configure_ui_disable = this._commonService.getPermissionStatus(domainPermissions_configureUi);
      let groupLevel_disable = this._commonService.getPermissionStatus(domainPermissions_groupLevel);
      let assignee_disable = this._commonService.getPermissionStatus(domainPermissions_assignee);
      let status_disable = this._commonService.getPermissionStatus(domainPermissions_status);

      this.columnDefs = [];
      this.columnDefs.push({
        'headerName': 'Type', //this.getLanguageKey('Type'),
        'field': 'Type',
        'colId': 'entiType',
        'dbKey': 'entiType',
        'width': 150,
        'initialShowColumn': true,
        'cellRendererFramework': CustomTableRendererComponent,
        'customTemplateClass': 'entityType',
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'colId': 'entiType',
          'suppressFilterButton': true,
          'filterName': "multiSelectString",
          'options': [{
            'label': 'Person',
            'listItemId': 'person'
          },
          {
            'label': 'Organization',
            'listItemId': 'organization'
          }]
        },
      })

      this.columnDefs.push({
        'headerName': 'AlertId', //this.getLanguageKey('AlertId'),
        'field': 'alertId',
        'colId': 'alertId',
        'dbKey': 'alertId',
        'width': 230,
        'initialShowColumn': true,
        'cellRenderer': "agGroupCellRenderer",
        'filter': "agNumberColumnFilter",
        'filterParams': {
          applyButton: true,
          clearButton: true
        }
      });
      this.columnDefs.push({
        'headerName': 'CustomerId', //this.getLanguageKey('CustomerId'),
        'field': 'customerId',
        'colId': 'customerId',
        'dbKey': 'customerId',
        'initialShowColumn': true,
        'width': 200,
        'filterParams': {
          applyButton: true,
          clearButton: true,
          filterOptions: ["contains", "notContains", "equals", "notEqual", "startsWith", "endsWith", "inRange",]
        }
      });
      this.columnDefs.push({
        'headerName': 'Main Entity', //this.getLanguageKey('Main Entity'),
        'field': 'primaryEntityName',
        'colId': 'primaryEntityName',
        'dbKey': 'primaryEntityName',
        'initialShowColumn': false,
        'width': 200,
        'filterParams': {
          applyButton: true,
          clearButton: true
        }
      });
      this.columnDefs.push({
        'headerName': 'Relationship', //this.getLanguageKey('Relationship'),
        'field': 'primaryEntityRelationshipType',
        'colId': 'primaryEntityRelationshipType',
        'dbKey': 'primaryEntityRelationshipType',
        'initialShowColumn': false,
        'width': 200,
        'filterParams': {
          applyButton: true,
          clearButton: true
        }
      });
      this.columnDefs.push({
        'headerName': 'Watchlist', //this.getLanguageKey('WLId'),
        'field': 'watchlistVersion',
        'colId': 'watchlistVersion',
        'dbKey': 'watchlistVersion',
        'initialShowColumn': true,
        'width': 180,
        'filterParams': {
          applyButton: true,
          clearButton: true
        }
      });
      this.columnDefs.push({
        'headerName': 'WatchListRecordId', // this.getLanguageKey('WatchListRecordId ')  //"Watchlist Record Id",
        'field': 'identifiedEntityId',
        'colId': 'watchListRecordId',
        'dbKey': 'watchListRecordId',
        'initialShowColumn': true,
        'width': 180,
        'filterParams': {
          applyButton: true,
          clearButton: true
        }
      });
      this.columnDefs.push({
        'headerName': 'EntityName', //this.getLanguageKey('EntityName'),
        'field': 'entityName',
        'colId': 'entityName',
        'dbKey': 'entityName',
        'initialShowColumn': true,
        'width': 200,
        'cellRendererFramework': EntityNameComponent,
        'filterParams': {
          applyButton: true,
          clearButton: true
        }
      });
      this.columnDefs.push({
        'headerName': 'ConfidenceLevelIP', //this.getLanguageKey('ConfidenceLevel') + ' (%)',
        'field': 'confidenceLevel',
        'colId': 'confidenceLevel',
        'dbKey': 'confidenceLevel',
        'width': 230,
        'initialShowColumn': true,
        'filter': "agNumberColumnFilter",
        'cellRendererFramework': ConfidenceLevelComponent,
        'filterParams': {
          applyButton: true,
          clearButton: true
        }
      });

      this.columnDefs.push({
        'headerName': 'Created',//this.getLanguageKey('Created'),
        'field': 'createdDate',
        'colId': 'createdDate',
        'dbKey': 'createdDate',
        // 'sort': 'asc',
        'initialShowColumn': true,
        'width': 190,
        'floatingFilterComponent': 'dateFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'createdDate',
        },
        'cellRendererFramework': CellRendererDateComponent,
        'suppressMenu': true
      });

      this.columnDefs.push({
        'headerName': 'Feed', //this.getLanguageKey('Feed'),
        'field': 'feed',
        'colId': 'feed',
        'width': 130,
        'dbKey': 'feed',
        'initialShowColumn': true,
        'class': "feed",
        'suppressMenu': true,
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'feed',
          'options': this.feedFilterOptions
        },
      });

      this.columnDefs.push({
        'headerName': 'Case Id', //this.getLanguageKey('CaseId'),
        'field': 'commentsCount',
        'colId': 'relatedCaseId',
        'dbKey': 'RelatedCaseId',
        'initialShowColumn': true,
        'width': 180,
        'cellRendererFramework': RelatedCaseIdComponent,
        'filter': "agNumberColumnFilter",
        'filterParams': {
          applyButton: true,
          clearButton: true
        }
      });

      this.columnDefs.push({
        'headerName': 'GroupLevel', //this.getLanguageKey('GroupLevel'),
        'field': 'groupLevel',
        'colId': 'groupLevel',
        'class': "group_level",
        'dbKey': 'groupLevel',
        'width': 200,
        'disable': groupLevel_disable,
        'initialShowColumn': true,
        'suppressMenu': true,
        'cellRendererFramework': SingleSelectRendererComponentComponent,
        'selectBoxListData': [],
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'groupLevel',
          'options': this.groupFilterOptions
        }
      });
      this.columnDefs.push({
        'headerName': 'Assignee', // this.getLanguageKey('Assignee'),
        'field': 'assignee',
        'colId': 'assignee',
        'dbKey': 'asignee',
        'width': 230,
        'filter': true,
        'disable': assignee_disable,
        'initialShowColumn': true,
        'class': "assignee",
        'suppressMenu': true,
        'cellRendererFramework': SingleSelectRendererComponentComponent,
        'selectBoxListData': [],
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'assignee',
          'options': this.assignList
        }
      });

      this.columnDefs.push({
        'headerName': 'Status',  //this.getLanguageKey('Status'),
        'field': 'status',
        'colId': 'status',
        'dbKey': 'statuse',
        'width': 150,
        'class': "status",
        'suppressMenu': true,
        'disable': true,
        'initialShowColumn': true,
        'cellRendererFramework': SingleSelectRendererComponentComponent,
        'selectBoxListData': [],
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'status',
          'options': this.statusObjs
        }
      });
      this.columnDefs.push({
        'headerName': 'Aging',
        'field': 'aging',
        'colId': 'aging',
        'dbKey': 'aging',
        'width': 150,
        'initialShowColumn': true,
        'cellRendererFramework': CustomTableRendererComponent,
        'filter': "agNumberColumnFilter",
        'customTemplateClass': 'alert-aging-component',
        'floatingFilterComponent': 'textSelectFilter',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'aging',
          'options': ['Hours', 'Days', 'Weeks', 'Months', 'Years']
        },
        'suppressMenu': true
      });
      this.columnDefs.push({
        'headerName': 'jobId', //this.getLanguageKey('jobId'),
        'field': 'jobId',
        'colId': 'jobId',
        'dbKey': 'jobId',
        'width': 230,
        'initialShowColumn': true,
        'cellRenderer': "agGroupCellRenderer",
        'filterParams': {
          applyButton: true,
          clearButton: true,
          filterOptions: ["contains", "notContains", "equals", "notEqual", "startsWith", "endsWith", "inRange",]
        }
      });
      this.columnDefs.push({
        'headerName': 'Indicators', //this.getLanguageKey('Indicators'),
        'field': 'riskIndicators',
        'colId': 'riskIndicators',
        'dbKey': 'riskIndicators',
        'width': 200,
        'class': "riskIndicators",
        'initialShowColumn': true,
        'customTemplateClass': 'alert-component',
        'cellRendererFramework': CustomTableRendererComponent,
        'selectBoxListData': [],
        'floatingFilterComponent': 'indicatorFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'riskIndicators',
        }
      });
      this.columnDefs.push({
        'headerName': "requestId", //this.getLanguageKey('requestId'),
        'field': 'requestId',
        'colId': 'requestId',
        'dbKey': 'requestId',
        'initialShowColumn': false,
        'cellRendererFramework': CustomTableRendererComponent,
        'customTemplateClass': 'requestId',
        'width': 180,
        'filterParams': {
          applyButton: true,
          clearButton: true
        }
      });
      this.columnDefs.push({
        'headerName': "WL EntityName",
        'field': 'wlEntityName',
        'colId': 'wlEntityName',
        'dbKey': 'wlEntityName',
        'initialShowColumn': false,
        'width': 180,
      });
      this.columnDefs.push({
        'headerName': "Hits",
        'field': 'hits',
        'colId': 'hits',
        'dbKey': 'hits',
        'initialShowColumn': false,
        'width': 80,
        'cellClass': 'hit-badge',
        'filter': 'agNumberColumnFilter',
        'type': 'numberColumn',
        'filterParams': {
          defaultOption: 'greaterThan'
        }
      });
      this.columnDefs.push({
        'headerName': "Tenant",
        'field': 'tenantId',
        'colId': 'tenantId',
        'dbKey': 'tenantId',
        'initialShowColumn': false,
        'width': 80,
        'cellClass': 'hit-badge',
        'type': 'numberColumn',
        'filterParams': {
          applyButton: true,
          clearButton: true
        }
      });


      //Permission level visibility check per column
      for (let index = 0; index < this.columnDefs.length; index++) {
        const elementColDef = this.columnDefs[index];

        let domainPermissionDynamic = getDomainPermissions(this.alertListPermssionIds, elementColDef.colId);
        let permissionType = this._commonService.getPermissionStatusType(domainPermissionDynamic);

        // If permission is none - delete column from the colums def
        if (permissionType == 'none') {
          delete this.columnDefs[index];
        }

      }


      this.gridOptions = {
        'resizable': true,
        'tableName': 'Alert list view',
        'columnDefs': this.columnDefs,
        'rowData': [],
        'rowStyle': { 'border-bottom': '#424242 1px solid' },
        'rowSelection': 'multiple',
        'floatingFilter': true,
        'animateRows': true,
        'sortable': true,
        'tabs': false,
        'isShoHideColumns': true,
        'multiSortKey': 'ctrl',
        'componentType': 'alert list',
        'defaultGridName': 'Alert View',
        'cellClass': 'ws-normal',
        'changeBackground': "#ef5350",
        "applyColumnDefOrder": true,
        'this': this.componentThis,
        'rowModelType': 'infinite',
        'enableTableViews': true,
        'cacheBlockSize': 10,
        'paginationPageSize': 10,
        'pagination': true,
        'enableServerSideFilter': true,
        'enableServerSideSorting': true,
        'showBulkOperations': false,
        'groupsLevelBulkOperations': groupsLevelBulkOperations,
        'filter': true,
        'instance': this._alertService,
        'method': "getAlertList",
        'dataModifier': "getAlerts",
        'enableCheckBoxes': true,
        'enableTopSection': true,
        'rowHeight': 53,
        'csvExportParams': this.params,
        'reviewerStatusList': this.reviewerStatusList,
        'statusKeys':this.statusObjs_new,
        'updateViews_disable': configure_ui_disable,
        'dateFilterProperties': {
          opensProperty: 'left',
          dropsPropertyType: 'up'
        },
        'onPaginationChanged': (params) => {
          if (params.newPage) {
            this._alertService.currentPage = params.api.paginationGetCurrentPage();
          }
        }
      }
      this.isGridOptionsLoaded = true;
    })


    this.getRowHeight = function (params) {
      if (params.node.group) {
        return 40;
      } else {
        return 25;
      }
    };

    this._sharedService.currentMessage.subscribe((v: any) => {
      this.showPanel = v;
    })

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

  getRunningScreeningRequestIDForLoggedInUser() {
    this._alertService.getRunningScreeningRequestIDForLoggedInUser()
      .then(async (response) => {
        this.screeningIds = response;
        while (this.screeningIds.length > 0) {
          await this.getStatsForScreeningRequestID();

        }

      })
      .catch((err) => {
      })
  }

  async getStatsForScreeningRequestID() {
    let completedfRes = [];
    const timer = ms => new Promise(res => setTimeout(res, ms))
    let resultList = []
    this.screeningIds.forEach(async res => {
      const result = new Promise((resolve, reject) => {
        this._alertService.getStatsForScreeningRequestID(res.requestId)
          .then((result) => {
            if (result && result['job_status'] && result['job_status'] == 'COMPLETED') {
              completedfRes.push(res);
              let data = {
                results: {
                  'created': result['ALERTS_CREATED'],
                  'failed': result['ALERTS_FAILED'],
                  'suppressed': result['ALERTS_CREATED'],
                  'pushed': result['ALERTS_PUSHED']
                },
                status: "finished"
              }
              this.alertsNotification(data)

            }
            resolve(true)
          })
          .catch((err) => {
          });
      });
      resultList.push(result);
    });
    await Promise.all(resultList).then(() => {
      this.screeningIds = this.screeningIds.filter(item => {
        return completedfRes.find(com => com.requestId == item.requestId) ? false : true;
      });
    });
    await timer(60000);
  }

  /**Getting Language text
   * Author : karnakar
   * Date : 20-Jan-2020
  */
  getLanguageKey(text) {
    var langKey = '';
    if (this.languageJson[text]) {
      langKey = this.languageJson[text];
    }else{
       langKey=text;
    }
    return langKey;
  }

  reloadContent() {
    this._commonService.behaviousSubjectForReloadTable.next(true)
  }

  close(alert) {
    this.showAlertMessage = false;
    this.screeningTimedOut = false;
  }

  private getAlertsSpinCount = 0;
  getAlerts(currentInstance = this, response) {
    this.getAlertsSpinCount = this.getAlertsSpinCount + 1;
    function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
    let rowDataSend: any = [];
    this.feedListForBulkTextSlider = [];
    if (response && response.result.length) {
      let statusObjs = [];
      let isStatusDisable = (assignee, status, userApproved) => {
        return true;
        if (!assignee || (assignee && GlobalConstants.systemSettings.ehubObject.userId == assignee.userId)) {
          let code = status['code'].toLowerCase();
          if (code == 'approved, needed review' || code == 'rejected, needed review') {
            let activeUser = GlobalConstants.systemSettings.ehubObject['userId'];
            if (userApproved && userApproved.userId == activeUser) {
              return true;
            }
          }
          return false;
        }
        else {
          return true;
        }
      }
      response.result.map((value) => {
        let Status = value.statuse ? value.statuse.code : "";
        let alertmetadatanew = JSON.parse(value.alertMetaData);

        let identifiedEntityId;
        if(value && alertmetadatanew && alertmetadatanew.results.screening.watchlists && alertmetadatanew.results.screening.watchlists.length>1){
          identifiedEntityId = alertmetadatanew.results.screening.watchlists.every( (val, i, arr) => val.record_id === arr[0].record_id) ? alertmetadatanew.results.screening.watchlists[0].record_id : this.getLanguageKey("Multiple Results");
        }
        else if(value && alertmetadatanew && alertmetadatanew.results.screening.watchlists && alertmetadatanew.results.screening.watchlists.length==1){
          identifiedEntityId = alertmetadatanew.results.screening.watchlists[0].record_id;
        }

        let formatFeeds = (feedObj) => {
          let name = [];
          feedObj.forEach((feed) => {
            name.push(feed.feedName);
          });
          return name.join(",");
        }

        let wlVersion: any = "";
        let alertMetaDataRes: any;
        if (Object.keys(JSON.parse(value.alertMetaData)).indexOf('Result') == -1) {
          alertMetaDataRes = JSON.parse(value.alertMetaData);
        }
        else {
          alertMetaDataRes = JSON.parse(value.alertMetaData)['Result'];
        }

        if (value.watchlistVersion && value.watchlistVersion.length > 1) {
          if (value.watchlistVersion.every((val, i, arr) => val === arr[0])) {
            wlVersion = value.watchlistVersion[0];
          }
          else {
            wlVersion = this.getLanguageKey("Multiple Results");
          }
        }
        else if (value.watchlistVersion && value.watchlistVersion.length == 1) {
          wlVersion = value.watchlistVersion[0];
        }

        let entityName = `<span onclick='document.getElementById("EI-${value.alertId ? value.alertId : ""}")'> ${value.entityName ? value.entityName : ""}</span>`
        let watch = []
        if (value.alertMetaData) {
          var parse = (JSON.parse(value.alertMetaData));
          watch = parse.results && parse.results.screening && parse.results.screening.watchlists ? parse.results.screening.watchlists : [];
        }

        var dataObj =
        {
          "alertId": value.alertId ? value.alertId : "",
          "customerId": alertMetaDataRes.is_synthetic_entity_id ? 'N/A' : value.customerId,
          "createdDate": value.createdDate ? this.dateFormatterWithoutTime(value.createdDate) : "",
          "entityName": value.entityName ? value.entityName : "",
          "relatedCaseId": value.relatedCaseId ? value.relatedCaseId : "",
          "watchlistVersion": wlVersion,
          "identifiedEntityId": identifiedEntityId,
          "feed": value.feed ? formatFeeds(value.feed) : "",
          "groupLevel": { "key": "", "value": [] },
          "assignee": { "key": "", "value": [] },
          "reviewer": value,
          "status": { "key": Status, "value": currentInstance.statusObjs },
          "comments": value.comments ? value.comments : [],
          "confidenceLevel": value.confidenceLevel ? value.confidenceLevel : "",
          "commentsCount": value.commentsCount ? value.commentsCount : "",
          "completeRowData": value,
          "selectBoxListData": [],
          "riskIndicators": value.riskIndicators ? value.riskIndicators : "",
          "timeInStatus": value.timeInStatus ? value.timeInStatus : "",
          "feedForBulk": (value.feed) ? value.feed.map((cfeed) => { return cfeed.feedName }) : [],
          "noOfdaysOfTimeStatus": value.timeStatusDuration ? value.timeStatusDuration : 0,
          'showReviewerIcon': this.getStatusForShowingReviewerIcon(value),
          'viwereSelectedValue': (value && value.reviewStatusId && value.reviewStatusId.displayName) ? value.reviewStatusId.displayName : 'Unconfirmed',
          'reviewerStatusList': this.reviewerStatusList,
          'statusKeys':this.statusObjs_new,
          'userApproved': value.userApproved,
          'wlEntityName': value.wlEntityName ? value.wlEntityName : '',
          'hits': value.hits ? value.hits : 0,
          'tenantId': (value.tenantName && value.tenantName != 'N/A') ? value.tenantName : (value.tenantId && value.tenantId != 'N/A') ? value.tenantId : 'N/A',
          'aging': value.aging ? value.aging : 0,
          'feeds': value.feed ? value.feed : [],
          'jobId': value.jobId ? value.jobId : '',
          'systemCreated': value.systemCreated ? value.systemCreated : false ,
          'primaryEntityName': value.primaryEntityName ? value.primaryEntityName : 'N/A',
          'primaryEntityRelationshipType': value.primaryEntityRelationshipType != 'N/A' ? value.primaryEntityRelationshipType.charAt(0).toUpperCase() + value.primaryEntityRelationshipType.slice(1) : '',
        }

        value.feedGroups = value.feedGroups.sort((a, b) => parseFloat(a.rank) - parseFloat(b.rank));
        value.feedGroups.map((groupObj) => {
          dataObj["groupLevel"].value.push({ 'label': (groupObj.groupId && groupObj.groupId && groupObj.groupId.name) ? groupObj.groupId.name : '', disable: true, "values": groupObj })
          if (value.groupLevel == ((groupObj.groupId && groupObj.groupId && groupObj.groupId.id) ? groupObj.groupId.id : '')) {
            dataObj["groupLevel"].key = (groupObj.groupId && groupObj.groupId && groupObj.groupId.name) ? groupObj.groupId.name : '';
          }
        })
        if (Object.keys(dataObj).length > 0) {
          dataObj = currentInstance.enablingTheRequiredOptionInGroupLevel(dataObj, dataObj["groupLevel"].key);
        }

        if (value.asignee == null) {
          dataObj["assignee"].key = "UnAssigned";
          dataObj["assignee"].value.unshift({ 'label': "Unassigned", disable: false, "values": {} })
        } else {

          dataObj["assignee"].key = value.asignee ? value.asignee.firstName : "Unassigned";
          var label = value.asignee ? value.asignee.firstName : "Unassigned"
          dataObj["assignee"].value.unshift({ 'label': label, disable: false, "values": value.asignee })
        }

        rowDataSend.push(dataObj);
        if (value && value.feed && value.feed.length) {
          value.feed.forEach((feed) => {
            this.feedListForBulkTextSlider.push(feed);
          })
        }
      });

      this.feedListForBulkTextSlider = this.getUniqueValuesFromArray(this.feedListForBulkTextSlider, 'feed_management_id');
      this.gridOptions['listForBulkSlider'] = this.feedListForBulkTextSlider;
      this._agGridTableService.getGridOptionsFromComponent(this.feedListForBulkTextSlider)
      this._alertService.sendRowDataToOtherComponent(rowDataSend);
      this._alertService.setTotalAlertCount = response.paginationInformation.totalResults;
      return rowDataSend;
    }

  }
  ngOnDestroy() {
    this.adverseMediaWS._disconnect();
    this.suppressionAlertsWS._disconnect();
    this.unsubscribeObservable.next();
    this.unsubscribeObservable.complete();
  }
  ngAfterViewInit() {
    this._agGridTableService.getObserverNavigator.subscribe(resp => {
      if (resp && resp.feed_id) {
        this.columnDefs.map((val) => {
          if (val.colId == 'feed') {
            val['filterObj'] = {
              'filter': resp['Feed Name'] ? resp['Feed Name'] : '',
              'filterType': 'text',
              'type': 'contains'
            };
            val['filterObj'] = {
              'filter': resp['Feed Name'] ? resp['Feed Name'] : '',
              'filterType': 'text',
              'type': 'contains'
            }
          }
        });
      }
    });

    this._agGridTableService.getObserverSelectedRows.subscribe(responce => {
      if (responce && responce.selectedRowsForAssignee && responce.selectedRowsForAssignee.api && !responce['avoidSubscriber']) {
        responce['avoidSubscriber'] = true;
        var bulkType = 'Assignee';
        var rowCount = responce.selectedRowsForAssignee.api.getSelectedNodes().length;
        var selectedRowsData = responce.selectedRowsForAssignee.api.getSelectedRows();
        let selectedRowsDataCopy =JSON.parse(JSON.stringify(selectedRowsData))
        var groupIdList = [];
        var groupNameList = []
        var sortedRowNodes = [];
        var finalAssigneeList = [];
        var finalSelectedAissignees = [];

        selectedRowsData.map((val) => {
          if (responce && responce.name && val && val.assignee && val.assignee.key && val.assignee.key.toLowerCase() != responce.name.toLowerCase()) {
            var name = (val.groupLevel && val.groupLevel.key) ? val.groupLevel.key : '';
            groupNameList.push(name);
          }
        });

        this.gridOptions.groupsLevelBulkOperations.map((v) => {
          groupNameList.map((i) => {
            if (v.name && i && v.name == i) {
              groupIdList.push({
                'id': v.id,
                'name': v.name
              });
            }
          })
        });
        responce.thisTableRef.storeAllRowSelected.map((val) => {
          if (responce && responce.name && val && val.data && val.data.assignee && val.data.assignee.key && val.data.assignee.key.toLowerCase() != responce.name.toLowerCase()) {
            sortedRowNodes.push(val);
          }
        });

        if (groupIdList.length) {
          var idList = [];
          groupIdList.map((k) => {
            idList.push(k.id);
          });
          sortedRowNodes.map((value) => {
            groupIdList.map((valu) => {
              if (value && value.data && value.data.groupLevel && value.data.groupLevel.key && (value.data.groupLevel.key == valu.name)) {
                value['changedGroupLevelId'] = valu.id;
              }
            })
          });
          this._alertService.getListOfUserByMultipleGroupLevels(idList).subscribe(resp => {
            sortedRowNodes.map((item) => {
              if (resp && resp.result && resp.result.length) {
                resp.result.map((va) => {
                  item.data["assignee"].value = [];
                  va.userList.map((v) => {
                    item.data["assignee"].value.push({ 'label': v.firstName, disable: false, "values": v });
                  });

                  this._alertService.assigneList.map((v) => {
                    if (va.groupId && item.changedGroupLevelId && (va.groupId == item.changedGroupLevelId)) {
                      if (v && v.firstName && (v.firstName.toLowerCase() == responce.name.toLowerCase())) {
                        var paramsData = {};
                        paramsData['alertId'] = item.data['alertId'];
                        paramsData["asignee"] = {
                          emailAddress: v.emailAddress,
                          firstName: v.firstName,
                          name: v.name,
                          userId: v.userId,
                          countryId: v.countryId,
                          label: v.label,
                          dob: v.dob,
                          screenName: v.screenName,
                          lastName: v.lastName
                        };
                        finalAssigneeList.push(paramsData);
                        item.data["assignee"].key = responce.name;
                        item.data["assignee"].value.unshift({ 'label': "Unassigned", disable: false, "values": {} });
                        item.data["assignee"].value.push({ 'label': v.label, disable: false, "values": paramsData["asignee"] });
                        finalSelectedAissignees.push(item);
                      }
                    }
                  });
                });
              }
            });
            if (finalAssigneeList.length) {
              finalAssigneeList = this.getUniqueValuesFromArray(finalAssigneeList, 'alertId');
              responce.thisTableRef.effectedAlerts = finalAssigneeList.length;
              const dialogRef = responce.dialogBox.open(responce.changeLevelModal, {
                width: '250px',
                panelClass: ['confirm-dialog', 'light-theme']
              });

              dialogRef.afterClosed().subscribe(result => {
                if (!result) {
                  sortedRowNodes.map(x=>{
                    let findData = selectedRowsDataCopy.find(d=> d.alertId == x.data.alertId)
                    x.data.assignee = findData.assignee
                  })
                  return false;
                }
                else {
                  this._alertService.saveOrUpdateAlerts(finalAssigneeList, bulkType).subscribe((resValue) => {
                    finalAssigneeList.forEach((val) => {
                      finalSelectedAissignees.forEach((ass) => {
                        var index = ass.data.assignee.value.findIndex((valInd) => valInd.label == val.asignee.label)
                        if (index == -1) {
                          ass.data.assignee.value.push({
                            'label': val.asignee.label,
                            disable: false,
                            "values": val.asignee
                          })
                        }
                      });
                    })

                    responce.thisTableGridApi.redrawRows({ rowNodes: finalSelectedAissignees });
                    this._sharedService.showFlashMessage(finalAssigneeList.length + ' alerts changed successfully!', 'success');

                  });
                  responce.thisTableRef.effectedAlerts = 0;
                }
              });
            }
            else if (finalAssigneeList && finalAssigneeList.length == 0) {
              responce.thisTableRef.effectedAlerts = 0;
              const dialogRef = responce.dialogBox.open(responce.changeLevelModal, {
                width: '250px',
                panelClass: ['confirm-dialog', 'light-theme']
              });

              dialogRef.afterClosed().subscribe(result => {
                return false;
              });
            }
          });
        }
        else if (groupIdList.length == 0 || finalAssigneeList.length == 0) {
          responce.thisTableRef.effectedAlerts = 0;
          const dialogRef = responce.dialogBox.open(responce.changeLevelModal, {
            width: '250px',
            panelClass: ['confirm-dialog', 'light-theme']
          });

          dialogRef.afterClosed().subscribe(result => {
            return false;
          });
        }
      }
      else {
        if (responce && !responce['avoidSubscriber']) {
          responce['avoidSubscriber'] = true;
          if (responce.firstFeedListApiCall) {

            var params: any = {
              'feedID': responce.selectedRowFeedsForAssignee.length ? responce.selectedRowFeedsForAssignee[0].feed_management_id : ''
            }
            this._alertService.getAssigneeListBasedOnFeed(params).subscribe((resp: any) => {
              responce.thisTableRef.assigneeList = this.getAllAssignees(resp);
            });
          }
          if (responce.getAssigneeList) {
            this._alertService.getAssigneeListBasedOnFeed('').subscribe((resp: any) => {
              responce.thisRef.assigneeList = this.getAllAssignees(resp);
            });
          }
          else {
            if (responce.feed_management_id) {
              var params: any = {
                'feedID': responce.feed_management_id ? responce.feed_management_id : ''
              }
              this._alertService.getAssigneeListBasedOnFeed(params).subscribe((resp: any) => {
                responce.thisRef.assigneeList = this.getAllAssignees(resp);
              })
            }
          }
        }
      }
    });

    // this._agGridTableService.getObserverOnRowClick.pipe(takeUntil(this.unsubscribeObservable)).subscribe(data => {
    //   this.showEICard = false;
    //   this.Rowparams = data;
    //   if (data) {
    //     setTimeout(() => {
    //       this.showEICard = true
    //     }, 0);
    //     setTimeout(() => {
    //       const openDialogBtn = document.getElementById("entity-identification-icon");
    //       openDialogBtn ? openDialogBtn.click() : '';
    //     }, 500);
    //   }
    //   else {
    //     setTimeout(() => {
    //       this.showEICard = false;
    //     }, 0);
    //   }
    // })

    let languagePromise = new Promise((resolve, reject) => {
      this._commonService.behaveObserverForgetLanguageJson.subscribe((resp) => {
        if (resp) {
          this.languageJson = resp;
          this.localizePaginationText(this.languageJson);
          resolve(this.languageJson);
        }
      });
    });

    const alertCardRoute$ = this.route.queryParams.pipe(
      filter(queryParams => queryParams.alertId),
      tap(_ => this.alertCardInitLoader = true),
      map(queryParams => ({
        requestParams: {
          pageNumber: 1,
          recordsPerPage: 10,
          orderIn: "asc",
          orderBy: "",
          isAllRequired: false,
        },
        filterJson: "{\"alertId\":{\"condition1\":{\"type\":\"equals\",\"filter\":" + queryParams.alertId + ",\"filterTo\":null,\"filterType\":\"number\"}}}"
      })),
      switchMap(({requestParams, filterJson}) => this._alertService.getAlertList(requestParams, filterJson)),
      filter(data => data && data.result && data.result.length > 0),
      map(data => this.getAlerts(this, data)),
      filter(data => data && data.length),
      map(data => data[0]),
      catchError(err => {
        throw 'Failed to get alert details ' + err;
      })
    );

    combineLatest([alertCardRoute$, this._alertService.onGridDataReadyObservable])
    .pipe(takeUntil(this.unsubscribeObservable))
    .subscribe(
      ([alertData, gridApi ]: [Params, any]) => {
        if (alertData && gridApi) {
          this.queryParamLoaded++;
          setTimeout(() => {
            this.showAlertCard(alertData.alertId, alertData, gridApi);
          });
        }
      }
    );


  }

  /**
   * Open screening alert card
   * @param alertId alert id
   * @param data alert data
   * @param gridApi grid api
   */
   showAlertCard(alertId, data, gridApi) {

    this.showEICard = false;

    this.Rowparams = {
      alertId,
      api: gridApi,
      data
    };

    if (gridApi && data) {
      setTimeout(() => {
        if(this.queryParamLoaded <= 1){
          this.showEICard = true;
        }
      }, 0);
      setTimeout(() => {
        document.getElementById("entity-identification-icon") ? document.getElementById("entity-identification-icon").click() : '';
        this.alertCardInitLoader = false;
      }, 500);
    }
    else {
      setTimeout(() => {
        this.showEICard = false;
      }, 0);
    }
  }

  localizePaginationText(languageJson) {

    setTimeout(() => {
      $(".ag-paging-panel span.ag-paging-page-summary-panel").contents()
        .filter(function () {
          if (this.nodeType === 3) {
            if (this.nodeValue.indexOf('Page') > -1) {
              this.nodeValue = languageJson['Page'] !== 'undefined' ? ` ${languageJson['Page']} ` : ' Page ';
            }
            if (this.nodeValue.indexOf('more') > -1) {
              this.nodeValue = languageJson['More'] !== 'undefined' ? ` ${languageJson['More']} ` : ' more ';

            }
            if (this.nodeValue.indexOf('of') > -1) {
              this.nodeValue = languageJson['Of'] !== 'undefined' ? ` ${languageJson['Of']} ` : ' of ';
            }
          }
          return null;
        });

      $(".ag-paging-panel span.ag-paging-row-summary-panel").contents()
        .filter(function () {
          if (this.nodeType === 3) {
            if (this.nodeValue.indexOf('to') > -1) {
              this.nodeValue = languageJson['To'] !== 'undefined' ? ` ${languageJson['To']} ` : ' to ';
            }
            if (this.nodeValue.indexOf('of') > -1) {
              this.nodeValue = languageJson['Of'] !== 'undefined' ? ` ${languageJson['Of']} ` : ' of ';
            }
          }
          return null;
        });
    }, 3000);

  }

  /**Removing duplicate objects from array
   * Author : karnakar
   * Date : 06-Nov-2019
  */

  getUniqueValuesFromArray(arr, key) {
    var uniqueArr = arr.reduce((acc, val) => {
      if (!acc.find(el => el[key] === val[key])) {
        acc.push(val);
      }
      return acc;
    }, []);
    return uniqueArr;
  }

  /**Getting all assignee list
    * Author : karnakar
    * Date : 06-Nov-2019
   */

  getAllAssignees(values) {
    var assigneeList = [];
    if (values && values.length) {
      values.map((val, key) => {
        val.feedUsers.map((v) => {
          assigneeList.push({
            'name': v.firstName ? v.firstName : '',
            'icon': v.userImage ? v.userImage : '',
            'values': v
          });
        })
      })
    }
    assigneeList = this.getUniqueValuesFromArray(assigneeList, 'name');

    return assigneeList;
  }

  /**Creating Grid Table by sending gridOptions to AgGridComponent through service
   * Author : karnakar
   * Date : 27-june-2019
  */
  createGridTable(options) {
    this._agGridTableService.getGridOptionsFromComponent(options);
  }
  /**enabling the required option user can escalate only one level up or de-escalate the alert only one level down
     * Author : Amritesh
     * Date : 25-sep-2019
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

  alertsNotification(data) {
    this.showRefreshLink = false;

    if (data) {
      if (data.status && data.status.toLowerCase() !== "running" && data.results) {
        setTimeout(() => {
          this.screeningTimedOut = data.timedOut
          this.showAlertMessage = true;
        }, 0);
        this.newAlertsCount = data.results['created'];
        if (this.newAlertsCount > 0) {
          this.showRefreshLink = true;
        }
      }
    }
  }


  sendPrevRow(ob) {
    let tableData = this.alertComments.getTableData();
    for (var i = ob.index; i >= 0; i--) {
      var keyPresent = tableData[i].completeRowData.hasOwnProperty("identityApproved")
      if (tableData[i] && tableData[i].completeRowData && keyPresent) {
        this.alertComments.setRowData(tableData[i]);
        break;
      }
    }
  }

  sendNextRow(ob) {
    let tableData = this.alertComments.getTableData();
    for (let i = ob.index; i < tableData.length; i++) {
      var keyPresent = tableData[i].completeRowData.hasOwnProperty("identityApproved")
      if (tableData[i] && tableData[i].completeRowData && keyPresent) {
        this.alertComments.setRowData(tableData[i]);
        break;
      }
    }
  }

  getStatusForShowingReviewerIcon(val) {
    var flag = false;
    if (val && val.feed && val.feed[0] && val.feed[0].reviewer && val.feed[0].reviewer.length) {
      val.feed[0].reviewer.map((v) => {
        if (v.code && val.statuse && val.statuse.code && (v.code === val.statuse.code)) {
          flag = true;
        }
      });
    }
    return flag;
  }

  setSingleFilterSelectOptionsForComponent(list) {
    var selectList = [];
    if (list.length) {
      list.filter(v => {
        selectList.push({
          listItemId: v.id,
          label: v.name
        })
      });
    }
    return selectList;
  }

  exportData() {
    document.getElementById("export-button").click();
    let ele = (<HTMLInputElement>document.getElementById("alertExport"));
    ele.disabled = true;
    ele.innerHTML = "Exporting..."
  }
  exportDataPdf() {
    document.getElementById("export-pdf-button").click();
    let ele = (<HTMLInputElement>document.getElementById("alertExport"));
    ele.disabled = true;
    ele.innerHTML = "Exporting..."

  }

  getAlertListPermssionIds() {
    let promise = new Promise((resolve, reject) => {
      this._alertService.getPermissionIds().pipe(map(res => {
        return res[this.componentName]
      })).subscribe(data => {
        this.alertListPermssionIds = data;
        resolve(true)
      });
    });
    return promise;
  }

  getButtonPermission(val) {
    return this.alertListPermssionIds.find(ele => ele.hasOwnProperty(val));
  }

  getHighestWatchlistValue(watchlists, attribute) {
    var attributes = []
    if (watchlists && watchlists.length > 0) {
      watchlists.forEach(element => {
        var filterAtt = element.attributes.filter((val) => val.attribute_name === attribute);
        filterAtt.forEach((val) => {
          val.confidence = element.confidence ? parseFloat(element.confidence) : 0
        })
        attributes = attributes.concat(filterAtt);
      });
    }
    attributes = attributes.sort((sort) => sort.confidence - sort.confidence)
    return attributes;
  }
  receivedAlerts(message) {
    if (message.alertType && message.alertType.toLowerCase() == "secondary") {
      let res = {
        results: {
          'created': (message && message.count) ? message.count : 0,
          'failed': 0,
          'suppressed': 0,
          'pushed': 0
        },
        status: "Running"
      }
      this.alertsNotification(res)
    }
    else if (message.alertType && message.alertType.toLowerCase() == "bst_alert_suppression") {
      let res = {
        results: {
          'created': 0,
          'failed': 0,
          'suppressed': (message && message.count) ? message.count : 0,
          'pushed': 0
        },
        status: "Running"
      }
      this.alertsNotification(res)
    }

  }
  getLanguageList() {
    let param = 'Translate language';
    this._alertService.getTranslateLanguagesList(param)
      .then((response: any) => {
        if (response) {
          GlobalConstants.getTranslateLang = response;
        }
      })
      .catch((err) => {
      })
  }

  getAlertIndicatorList() {
    this._alertService.getAllEntityAlertIndicators("Alert Risk");
  }

  openBulkAssignmentPopup() {
    const dialogRef = this.dialog.open(GroupAssignmentComponent, {
      disableClose: true,
      panelClass: [
        "user-popover",
        "custom-scroll-wrapper",
        "bg-screening",
        "light-theme",
      ],
      backdropClass: "modal-background-blur",
      data: {
        groupList: this.groupFilterOptions
      },
    });
  }

  dateFormatterWithoutTime(params) {
    return params ? moment.utc(params).format(this.dateFromat? this.dateFromat : 'DD-MMM-YYYY') : '';
  }

}
