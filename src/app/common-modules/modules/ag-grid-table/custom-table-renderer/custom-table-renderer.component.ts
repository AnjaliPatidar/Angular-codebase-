import { CaseManagementService } from '@app/modules/case-management/case-management.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { SharedServicesService } from '../../../../shared-services/shared-services.service';
import { Router } from '@angular/router';
import { AgGridTableService } from '../ag-grid-table.service';
import { AlertManagementService } from '@app/modules/alert-management/alert-management.service';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { AlertCommentsComponent } from '../../alerts-comments/alert-comments.component';
import { CommentsComponent } from '@app/modules/comments/comments/comments.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CommonConfirmationModalComponent } from '../modals/common-confirmation-modal/common-confirmation-modal.component';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';

@Component({
  selector: 'app-custom-table-renderer',
  templateUrl: './custom-table-renderer.component.html',
  styleUrls: ['./custom-table-renderer.component.scss']
})
export class CustomTableRendererComponent implements OnInit, AfterViewInit {
  /**====================== Public variables Start =======================*/
  public rowIndex: any;
  private commentListItemsCount: any;
  public colId: any;
  public colTypesList: any = [];
  public queueList: any;
  public rightPanel: any = true;
  public currentURL: any;
  public colorList: any = [];
  public statusList: any = [];
  public queueName: any;
  public isChecked: boolean;
  public showHideElement: any = {
    enableEditIcon: true,
    enableSaveIcon: false,
    enableCancleIcon: false,
    enableDeleteIcon: true
  };
  public selectedQueueStatus: any;
  public enableSaveIcon: boolean = false;
  public templateClass: any;
  public valueFromComponent: any;
  public enableDeleteIcon: boolean = false;
  public valueForDelete: any = 0;
  public currentRowData: any;
  public showTrueMatch: boolean;
  public rowData: any;
  public riskIndicatorsVal: any;
  public permissionIdsList: Array<any> = [];
  public reviewersVal: any;
  public entityType: any;
  public params: any;
  isAuditOpen: boolean;
  showRightPanel = false;
  private rightPanelLoadCom: string = 'detailInfo';
  @ViewChild(AlertCommentsComponent, { static: false }) alertComments: AlertCommentsComponent;
  @ViewChild('caseComments', { static: false }) public caseComments: ElementRef;
  /**====================== Public variables End =======================*/

  /**<================= private variables starts =============================> */
  private originalQueueName: any;
  private grdiOptionsFromComponent: any;
  public CommentData: any;
  closeResult: string;
  caseWorkBenchPermissionJSON: any = {};
  public feedId: any;
  public timeInStatus;
  public alertColor: any = "rgb(239, 83, 80)";
  public reviewerStatusColor: any = "#657f8b";
  public alertColors = { 'High': "rgb(239, 83, 80)", 'Medium': "#9c27b0", 'Low': '#26A69A' };
  public reviewerStatusColors = { 'Unconfirmed': "#657f8b", 'Confirmed': "#26A69A", 'Declined': 'rgb(239, 83, 80)' };
  public timeInStatusColors = { "shortterm": "#26A69A", "pastdue": "rgb(239, 83, 80)", "longterm": "#9c27b0" }
  public timeInStatusColor;
  public timeInStatusBatteryHeight = { 'shortterm': 'full', 'pastdue': 'quarter', 'longterm': 'half' };
  public tableName: any;
  public reviewerStatusList: any = [];
  public showReviewerIcon: boolean = false;
  public showScreeningIcon: boolean = false;
  public gridApi: any;
  public currentReviewStatus: string;
  public alertStatus: string;
  public requestId: any;
  public alertRiskIndicators: any[] = [];
  public isUserAssignedPermission:boolean;
  // commentCountSubscribe;
  /**<================= private variables ends =============================> */
  constructor(private renderer2: Renderer2, public dialog: MatDialog, public SharedService: SharedServicesService, private ele: ElementRef, private router: Router, private _agGridTableService: AgGridTableService, private _alertService: AlertManagementService, private _commonService: CommonServicesService, private caseSerive: CaseManagementService) { }
  ngOnInit() {
    this.getComponentPermissionIds();
    this.processComments();
    this.updateCommentCount();
    this.getCaseListPermssionIds();

  }

  ngAfterViewInit() {
    this._alertService.getRowDataWhenUpdatedObserver.subscribe((resp) => {
      if (resp.length) {
        this.rowData = resp;
        var status = (this.rowData[this.rowIndex] && this.rowData[this.rowIndex].viwereSelectedValue) ? this.rowData[this.rowIndex].viwereSelectedValue : 'Unconfirmed';
        this.currentReviewStatus = status;
        this.reviewerStatusColor = this.reviewerStatusColors[status];
      }
    });
  }

  seteditingmode(val) {
    return this.SharedService.getEditableOption = val
  }

  sendPrevRow(ob) {
    let tableData = this.alertComments.getTableData();
    for (var i = ob.index; i >= 0; i--) {
      var keyPresent = tableData[i].completeRowData.hasOwnProperty("identityApproved")
      if (tableData[i] && tableData[i].completeRowData && keyPresent && tableData[i].completeRowData.identityApproved == ob.status) {
        this.alertComments.setRowData(tableData[i]);
        break;
      }
    }
  }

  sendNextRow(ob) {
    let tableData = this.alertComments.getTableData();
    for (let i = ob.index; i < tableData.length; i++) {
      var keyPresent = tableData[i].completeRowData.hasOwnProperty("identityApproved")
      if (tableData[i] && tableData[i].completeRowData && keyPresent && tableData[i].completeRowData.identityApproved == ob.status) {
        this.alertComments.setRowData(tableData[i]);
        break;
      }
    }
  }

  /**
   * agInit() will call for every row of column
  **/
  agInit(params: any, event): void {
    if (params) {
      this.CommentData = params;
      this.gridApi = (params.api) ? params.api : null;
      this.params = params;
      this.rowData = (params.api && params.api.gridOptionsWrapper && params.api.gridOptionsWrapper.gridOptions && params.api.gridOptionsWrapper.gridOptions.rowData) ? params.api.gridOptionsWrapper.gridOptions.rowData : [];
      this.rowIndex = params.rowIndex;
      this.tableName = (params.api && params.api.gridOptionsWrapper && params.api.gridOptionsWrapper.gridOptions && params.api.gridOptionsWrapper.gridOptions.tableName) ? params.api.gridOptionsWrapper.gridOptions.tableName : '';
      this.reviewerStatusList = (params.api && params.api.gridOptionsWrapper && params.api.gridOptionsWrapper.gridOptions && params.api.gridOptionsWrapper.gridOptions.reviewerStatusList && params.api.gridOptionsWrapper.gridOptions.reviewerStatusList.length) ? params.api.gridOptionsWrapper.gridOptions.reviewerStatusList : [];
      this.templateClass = (params.colDef && params.colDef.customTemplateClass) ? params.colDef.customTemplateClass : '';
      this.currentRowData = params.data ? params.data : {};
      this.entityType = (this.currentRowData && this.currentRowData.completeRowData && this.currentRowData.completeRowData.entiType && this.currentRowData.completeRowData.entiType == 'person') ? 'person' : 'business';

      this.valueFromComponent = params.value ? params.value : 0;
      let gridOptions = this.currentRowData;

      if (this.tableName && this.tableName == 'Alert list view') {
        this.alertStatus = (this.currentRowData && this.currentRowData.completeRowData && this.currentRowData.completeRowData.statuse && this.currentRowData.completeRowData.statuse.code) ? this.currentRowData.completeRowData.statuse.code.toLowerCase().trim() : "";
        this.riskIndicatorsVal = (this.currentRowData && this.currentRowData.riskIndicators) ? this.currentRowData.riskIndicators : '';
        this.reviewersVal = (this.currentRowData && this.currentRowData.riskIndicators) ? this.currentRowData.riskIndicators : '';
        this.timeInStatus = (this.currentRowData && this.currentRowData.timeInStatus) ? this.currentRowData.timeInStatus : '';
        let alertMetaData = this.currentRowData && this.currentRowData.completeRowData && this.currentRowData.completeRowData.alertMetaData ? this.currentRowData.completeRowData.alertMetaData : '';
        if (alertMetaData) {
          let parseData = JSON.parse(alertMetaData)
          this.requestId = parseData && parseData['request_id'] ? parseData['request_id'] : '';

          let tagsArray = parseData.tags ? parseData.tags : [];

          if (tagsArray.length > 0 && tagsArray.includes("Nightly Screening")) {
            this.showScreeningIcon = true;
          }
        }
        this.showReviewerIcon = this.currentRowData && this.currentRowData.showReviewerIcon ? this.currentRowData.showReviewerIcon : false;
        if (this.showReviewerIcon) {
          this.reviewerStatusColor = this.reviewerStatusColors[this.currentRowData.completeRowData.reviewStatusId.code];
        }
        if (this.timeInStatus) {
          this.timeInStatusColor = this.timeInStatusColors[this.timeInStatus.replace(" ", "").toLowerCase()];
        }
        this.alertColor = this.alertColors[this.riskIndicatorsVal];
        this.SharedService.statusTrue.subscribe((val: any) => {
          if (val != '' && val.indexR == params.rowIndex && val.statData.listType == "Alert Status") {
            this.showTrueMatch = ((val.statData.displayName.toLowerCase() == "true match") || (val.statData.displayName.toLowerCase() == "approved"))
          }
        });

        if (this.currentRowData && this.currentRowData.status) {
          this.showTrueMatch = ((this.currentRowData.status.key.toLowerCase() == "true match") || (this.currentRowData.status.key.toLowerCase() == "approved"))
        }
      }
      if (params.colDef && params.colDef.colId && params.colDef.colId == 'history') {
        this.valueForDelete = this.currentRowData['Assigned Alerts'] ? this.currentRowData['Assigned Alerts'] : 0;
        this.feedId = this.currentRowData['feed_id'] ? this.currentRowData['feed_id'] : '';
      }
      if (params.colDef && params.colDef.colId && params.colDef.colId == 'aging') {
        this._alertService.getAlertRiskIndicatorsObservable.subscribe((indicators) => {
          if (this.currentRowData.aging < 0 || this.currentRowData.aging == null) {
            this.currentRowData.riskIndicator = null;
            return;
          }
          else if (this.currentRowData.aging < 24) {
            this.currentRowData.agingDisplayObj = {
              value: this.currentRowData.aging,
              period: "Hours"
            }
          } else {
            this.currentRowData.agingDisplayObj = {
              value: Math.round(this.currentRowData.aging / 24),
              period: Math.round(this.currentRowData.aging / 24) == 1 ? 'Day' : "Days"
            }
          }
          this.alertRiskIndicators = indicators
          function compare(a, b) {
            if (a.hours < b.hours) {
              return -1;
            }
            if (a.hours > b.hours) {
              return 1;
            }
            return 0;
          }
          this.alertRiskIndicators.sort(compare);
          if (this.alertRiskIndicators.length > 0) {
            let indicator = null;
            this.alertRiskIndicators.map(element => {
              const existingFeeds = element.feedClasification.filter((value) => this.currentRowData.feeds.some(feed => feed.feed_management_id === value.feedCode));
              if (existingFeeds.length > 0) {
                if (element.operator === 'Above' && this.currentRowData.aging > element.hours) {
                  indicator = element
                } else if (element.operator === 'Up to' && this.currentRowData.aging <= element.hours) {
                  indicator = element
                }
              }
            })
            this.currentRowData.riskIndicator = indicator
          }
        })
      }
    }
    this.getCurrentLoggedUser();
  }

  /**
   * Navigating from feed management assigned alerts to alert management
   */
  navigateToOtherComponent(data) {
    if (this.valueFromComponent !== 0) {
      this.router.navigate(['/element/alert-management/alertsList']);
      this._agGridTableService.getComponentDataOnNavigation(data);
    }
  }
  /**
   * Changing the risk indicator
   */
  risckIndicator(set) {
    this.alertColor = this.alertColors[set];
    var paramsData = {};
    paramsData['alertId'] = this.currentRowData.alertId;
    paramsData["asignee"] = this.currentRowData.assignee.value[0].values;
    paramsData["riskIndicators"] = set
    this._alertService.saveOrUpdateAlerts([paramsData], '').subscribe((res) => {
      this.riskIndicatorsVal = set;

    })
  }

  getComponentPermissionIds() {
    this._agGridTableService.behaviorSubjectForAllPermisonIds$.subscribe(ids => {
      this.permissionIdsList = ids;
    })
  }
  /**
   * Changing reviewer status
   */
  reviewerStatusChange(status) {
    this.reviewerStatusColor = this.reviewerStatusColors[status];
    var paramsData = {};
    paramsData['alertId'] = this.currentRowData.alertId;
    paramsData["asignee"] = this.currentRowData.assignee.value[0].values;
    paramsData["reviewStatusId"] = this.reviewerStatusList.map((val) => {
      if (val.displayName == status) {
        return val;
      }
    }).filter(v => { return v })[0];
    this._alertService.saveOrUpdateAlerts([paramsData], '').subscribe((res) => {
      this.riskIndicatorsVal = status;
      this.gridApi.refreshInfiniteCache();
    });
  }

  openCommentsPopup() {
    const data = {
      positionRelativeToElement: this.caseComments,
      caseId: this.currentRowData && this.currentRowData.id ? this.currentRowData && this.currentRowData.id : 0,
      caseName: this.currentRowData && this.currentRowData.name ? this.currentRowData && this.currentRowData.name : "",
      caseWorkBenchPermissionJSON: this.caseWorkBenchPermissionJSON,
      editModeStatus: false,
      commentContainer: "case list"
    }
    this.dialog.open(CommentsComponent, {
      maxWidth: "auto",
      id: 'comments-popup',
      panelClass: ['custom-dialog-container', 'comments-dialog-container'],
      data
    });
  }

  updateCommentCount() {
    this.caseSerive.behaviorSubjectForGetCaseCommentCount.subscribe((res: any) => {
      for (let i = 0; i < res.length; i++) {
        if (this.currentRowData.id == res.id) {
          this.currentRowData.commentsCount = res.length;
          this.updateCommentCountData()
        }
      }
    });
  }

  updateCommentCountData(): void {
    this.processComments();
    this.currentRowData['targetUpdates'] = ["comment_count"];
    this.currentRowData['gridDataMapID'] = "id";
    this._agGridTableService.getUpdatedData(this.currentRowData);
  }

  processComments() {
    if (this.currentRowData) {
      this.commentListItemsCount = this.currentRowData && this.currentRowData.commentsCount ? this.currentRowData && this.currentRowData.commentsCount : 0;
    }
  }

  getCaseListPermssionIds() {
    const permissions: any[] = this.SharedService.getPermissions();
    if (permissions.length) {
      this.caseWorkBenchPermissionJSON = permissions[1].caseManagement.caseWorkbench;
    }
  }

  openCaseAudit(): void {
    this.caseSerive.showAuditPanelListObserver.subscribe(openState => {
      this.showRightPanel = openState
      this.isAuditOpen = openState
    })
    this.isAuditOpen = !this.isAuditOpen;
    this.caseSerive.openAuditPanel(this.isAuditOpen, this.currentRowData.id, this.currentRowData.name, 'dashboard');
  }

  openRightPanel(param) {
    return this.SharedService.hideAlertRightPanel(this.rightPanel);
  }
  openCopiedCaseDetails(){
    const title = this.getLanguageKey("Confirm Copy Case") ? this.getLanguageKey("Confirm Copy Case") : "Confirm Copy Case";
    const body = this.getLanguageKey("Are you sure you want to copy Case") ? this.getLanguageKey("Are you sure you want to copy Case") : "Are you sure you want to copy Case";
    const data = {
      title : title,
      body : body + " " + this.currentRowData.id + "?"
    }
    const dialogConfig: MatDialogConfig = {width: "600px" , data , panelClass: 'copy-case-modal'}
    const dialogRef = this.dialog.open(CommonConfirmationModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((isConfirmed:boolean) => {
      if(!isConfirmed) return null

      this.caseSerive.copyCaseLoader.next(true)
      this.caseSerive.getCopiedCase(this.currentRowData && this.currentRowData.id ? this.currentRowData.id : 0).subscribe((res) => {
         this.caseSerive.copyCaseLoader.next(false)
         if(res && res.success && res.id){
           this.caseSerive.openCaseInNewTab(res.id)
         }
       }, (error) => {
       this.caseSerive.copyCaseLoader.next(false)
       this.SharedService.showFlashMessage('Failed to copy case, please Try again', 'danger');
     })
    })
  }

  getLanguageKey(text) {
    var langKey = text;
    if (GlobalConstants.languageJson) {
      langKey = GlobalConstants.languageJson[text];
    }
    return langKey;
  }

  // @reason : find is logged user is the current case assignee
  // @date: 29 mar 2023
  // @author: ammshathwan
  getCurrentLoggedUser(){
    if(this.currentRowData && GlobalConstants.currentLoggedUser && this.currentRowData.assignee
      && this.currentRowData.assignee == GlobalConstants.currentLoggedUser){
        this.isUserAssignedPermission = true;
      }else {
        this.isUserAssignedPermission = false;
      }
  }
}
