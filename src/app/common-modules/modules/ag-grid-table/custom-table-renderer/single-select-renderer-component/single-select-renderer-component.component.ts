import { Component, OnInit, AfterViewInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { AgGridTableService } from '../../ag-grid-table.service';
import { AlertManagementService } from '@app/modules/alert-management/alert-management.service';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { CaseManagementService } from '@app/modules/case-management/case-management.service';
import { RelatedCasesConstants } from '@app/common-modules/constants/related-cases.constants';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
declare var recallKpiData;
declare var recallKpiDataCaseManagement;
// '../../../../alert-management.service'
@Component({
  selector: 'app-single-select-renderer-component',
  templateUrl: './single-select-renderer-component.component.html',
  styleUrls: ['./single-select-renderer-component.component.scss']
})
export class SingleSelectRendererComponentComponent implements OnInit, AfterViewInit, OnDestroy {
  /**====================== Public variables Start=======================*/
  public rendererObject: any = {}
  public gridOptions: any = {};
  public colId: string = '';
  public selectOptionsList: any = [];
  public headerName: any;
  public selectedItem: any;
  public rowId: any;
  public gridApi: any;
  public className: any;
  public currentRowData: any;
  public selectedIcon: any;
  public selectedIconColor: any;
  public tableName: any;
  public customTemplateClass:any;
  public rowData: any;
  public actualSelectOptions:any;
  public permissionIdsList: Array<any> = [];
  public selectDisable: boolean = false;
  public priorityDisable: boolean;
  public selectedValue:any;
  public selectCellDisable:any;
  public prevSelectedValue : string ;
  public storeParams:any
  public agGridApi:any

  public pageNumber: number = 1;
  public recsPerPage: number = 10;
  public totalPages: number;
  /*alert management bulk opertion variables*/
  public statusUpdateValidations = [];
  @Input() clearSearchInput = true;
  /*alert management bulk opertion variables*/

   /*case related entity variables*/
   showMainEntity: boolean = false;
   mainEntityId: boolean = false;
   unknownEntity: boolean = false;
   initValue:any;
   /*case related entity variables variables*/

  // public setValue:any=[];
  @ViewChild('select_1', { static: false }) select_1: MatSelect;
  /**====================== Public variables End=======================*/

  /**====================== Private variables Start=======================*/
  /**====================== Private variables End=======================*/

  private readonly destroyed$: Subject<undefined> = new Subject<undefined>();

  constructor(private _agGridTableService: AgGridTableService,
    private _commonService: CommonServicesService,
     private _alertService: AlertManagementService,
     public SharedService: SharedServicesService,
     private _caseService : CaseManagementService) {
  }

  ngOnInit() {
    this.statusUpdateValidations = GlobalConstants.alertStatusValidation
    this.getComponentPermissionIds();
  }

  loadGridParamsApi(paramsApi){
    this._alertService.getGridreadyApiObserver.pipe(takeUntil(this.destroyed$)).subscribe(res=>{
      if(paramsApi != undefined){
        this.agGridApi = paramsApi;
      }else{
        this.agGridApi = res;
      }
    });
  }

  ngAfterViewInit() {
  }
  /**agInit() will call for every row of column */
  agInit(params: any, event): void {
    this.loadGridParamsApi(params.api);
    this.storeParams = params;
    this.currentRowData = (this.agGridApi && this.agGridApi.gridOptionsWrapper && this.agGridApi.gridOptionsWrapper.gridOptions && this.agGridApi.gridOptionsWrapper.gridOptions.rowData && this.agGridApi.gridOptionsWrapper.gridOptions.rowData.length && this.agGridApi.gridOptionsWrapper.gridOptions.rowData[params.rowIndex]) ? this.agGridApi.gridOptionsWrapper.gridOptions.rowData[params.rowIndex] : {};
    this.rowData = params && params.data ? params.data : {};
    this.headerName = (params.colDef && params.colDef.headerName) ? params.colDef.headerName : '';
    this.actualSelectOptions = (params.colDef && params.colDef.selectBoxListData && params.colDef.selectBoxListData.length) ? params.colDef.selectBoxListData : [];
    this.selectedValue = (params && params.value) ? params.value : '';
    this.selectCellDisable = (params && params.data && params.data.hasOwnProperty('selectCellDisable') ) ? params.data.selectCellDisable : false;

    if (params) {
      // setTimeout(() => {

      // }, 1000);
      this.gridApi = this.agGridApi ? this.agGridApi : {};
        this.selectedItem = (params.value && params.value.key) ? params.value.key : '';
        this.className = params.colDef && params.colDef.class ? params.colDef.class : '';
        this.tableName = (this.agGridApi && this.agGridApi.gridOptionsWrapper && this.agGridApi.gridOptionsWrapper.gridOptions && this.agGridApi.gridOptionsWrapper.gridOptions.tableName) ? this.agGridApi.gridOptionsWrapper.gridOptions.tableName : '';
        this.customTemplateClass = params.colDef && params.colDef.customTemplateClass ? params.colDef.customTemplateClass : '';
        this.selectDisable = (params && params.colDef &&  params.colDef.hasOwnProperty('disable')) ? params.colDef.disable : false;
        if (this.tableName == 'Alert list view') {
          if (params.data && params.data.status && params.data.status.value && params.data.status.value.length) {
            var mappedStatusObj = params.data.status.value.map((val) => {
              if (val.values.code == params.data.status.key) {
                return val.values
              }
            }).filter((element) => { return element })[0];
          }
          if (mappedStatusObj && (mappedStatusObj.icon || mappedStatusObj.colorCode)) {
            this.selectedIcon = mappedStatusObj.icon;
            this.selectedIconColor = mappedStatusObj.colorCode;
            if (params && params.colDef && params.colDef.headerName && params.colDef.headerName == "Status") {
              this.selectedItem = mappedStatusObj.displayName;
            };
          }
          if (this.agGridApi && this.agGridApi.gridOptionsWrapper && this.agGridApi.gridOptionsWrapper.gridOptions) {
            this.gridOptions = this.agGridApi.gridOptionsWrapper.gridOptions;
            this.rendererObject = {
              gridOpions: this.gridOptions,
              colId: (params.colDef && params.colDef.colId) ? params.colDef.colId : '',
              rowId: params.rowIndex ? params.rowIndex : '',
              selectBoxListData: (params.value && params.value.value) ? params.value.value : [],
              className: this.className
            }
            this.selectOptionsList = this.rendererObject.selectBoxListData.length > 0 ? this.rendererObject.selectBoxListData : this.gridOptions.rowData[params.rowIndex] ? this.gridOptions.rowData[params.rowIndex].selectBoxListData : [];
            this.selectOptionsList = JSON.parse(JSON.stringify(this.selectOptionsList));
            if (params && params.colDef && params.colDef.headerName && params.colDef.headerName == "Status") {
              let selectedStatus = (params.value && params.value.key) ? params.value.key.toLowerCase() : 'new';
              let allowedStatus = this.statusUpdateValidations[selectedStatus] ? this.statusUpdateValidations[selectedStatus] : [];
              this.selectOptionsList.forEach((option) => {
                option.disable = false;
                if (option && option.values.code && allowedStatus && allowedStatus.indexOf(option.values.code.toLowerCase()) == -1) {
                  option.disable = true;
                }
              });

              // if (params.value && params.value.key && params.value.key == "New") {
              //   this.selectOptionsList.forEach((option) => {
              //     // if (option && option.label && (option.label.toLowerCase() == "identity approved" || option.label.toLowerCase() == "identity rejected")) {
              //     option.disable = true;
              //     // }
              //   })
              // }
              // else {
              //   this.selectOptionsList.forEach((option) => {
              //     if (option && option.label && (option.label.toLowerCase() == "identity approved" || option.label.toLowerCase() == "identity rejected")) {
              //       option.disable = true;
              //     }
              //   })
              // }
            }
          }
        }
        else if (this.tableName == 'Feed list view') {
          this.selectOptionsList = (params.colDef && params.colDef.selectBoxListData && params.colDef.selectBoxListData.length) ? params.colDef.selectBoxListData : [];
          this.selectedItem = params.value ? params.value : '';
        }
        else if(this.tableName == 'Case list view'){
          this.priorityDisable = (params && params.data && params.data.assignee == GlobalConstants.currentLoggedUser)? false:true;
          if (params.colDef && params.colDef.colId === 'RiskIndicators' && params.colDef.selectBoxListData && params.colDef.selectBoxListData.length) {
            var mappedStatusObj = params.colDef.selectBoxListData.map((val) => {
              if (val.label == params.value) {
                return val.values
              }
            }).filter((element) => { return element })[0];
          }
          if (params.colDef && params.colDef.colId === 'priority' && params.colDef.selectBoxListData && params.colDef.selectBoxListData.length) {
            var mappedStatusObj = params.colDef.selectBoxListData.map((val) => {
              if (val.label == params.value) {
                return val.values
              }
            }).filter((element) => { return element })[0];
          }
          if (mappedStatusObj && (mappedStatusObj.icon || mappedStatusObj.colorCode)) {
            this.selectedIcon = mappedStatusObj.icon;
            this.selectedIconColor = mappedStatusObj.colorCode;
          }

          this.selectOptionsList = (params.colDef && params.colDef.selectBoxListData && params.colDef.selectBoxListData.length) ? params.colDef.selectBoxListData : [];
          // this.selectedItem = params.value ? params.value : '';
          if(params && params.value && typeof params.value === 'string'){
            this.selectedItem = params.value ? params.value : '';
          }

        } else if (this.tableName == 'Case related entity') {
          if (params.colDef.selectBoxListData && params.data) {
            this.mainEntityId = (params.data && params.data.entity_id) ? params.data.entity_id.trim() : ""
            this.selectOptionsList.push({
              label: "Unknown",
              value: 0
            })

            this.showMainEntity = params.colDef.mainEntityId == this.mainEntityId;

            this.initValue = params.value;

            var mainEnitytId = ''
            params.colDef.selectBoxListData
              .forEach(element => {
                if(element.displayName.toUpperCase() != 'MAIN ENTITY'){
                this.selectOptionsList.push({
                  label: element.displayName,
                  value: element.listItemId
                })
              }else{
                mainEnitytId = element.listItemId
              }
              });

            if(params.value && params.colDef && params.colDef.selectBoxListData && params.colDef.selectBoxListData.length > 0 && mainEnitytId ==  params.value ){
              this.showMainEntity = true;
            }

            if (!params.value) {
              this.selectedItem = 0
            } else {
              if (!this.selectOptionsList.find((el) => {
                return el.value == params.value
              })) {
                this.selectedItem = 0
              } else {
                this.selectedItem = params.value
              }
            }
          }
        } else if(this.tableName == 'Related Cases view' || params.colDef.tableName == 'Related Cases view') {
          if (params.colDef &&
            (params.colDef.colId === 'priorityRC' || params.colDef.colId === 'risk' || params.colDef.colId === 'priority') &&
            params.colDef.selectBoxListData && params.colDef.selectBoxListData.length) {
            let opt = [];
            params.colDef.selectBoxListData.forEach(el => {
              opt.push({value:el.code, label:el.displayName, disable: true, colorCode:el.colorCode,listItemId:el.listItemId});
            });
            this.selectOptionsList = opt;
            this.selectedItem = (params.value && params.value.code) ? params.value.code : '';
            if (this.selectOptionsList) {
              var mappedStatusObj = params.colDef.selectBoxListData.map((val) => {
                if (params.value && params.value.listItemId && params.value.listItemId == val.listItemId) {
                  this.selectedIcon = val.icon
                  this.selectedIconColor = val.colorCode
                }
              }).filter((element) => { return element })[0];
            }
          }
        }
        this.prevSelectedValue = this.selectedItem;
    }
  }

  /**On change of dropdown in ALert from single rendered component
  * Author : Amritesh
  * Date : 19-sep-2019
 */
  getSelectedItem(e, ele, currentObj) {
    if (this.tableName == 'Alert list view') {
      var reviewerData = (this.rowData && this.rowData.completeRowData && this.rowData.completeRowData.feed && this.rowData.completeRowData.feed.reviewer && this.rowData.completeRowData.feed.reviewer.length) ? this.rowData.completeRowData.feed.reviewer : [];

      if (this.gridApi) {
        var rowNode = this.gridApi.getDisplayedRowAtIndex(this.rendererObject.rowId);
      }
      var feedObjToSend = ele.selectOptionsList.map((val) => {
        if (val.label == ele.selectedItem) {
          return val.values
        }
      }).filter((element) => { return element })[0];

      if (reviewerData.length) {
        var count = 1;
        reviewerData.map((v) => {
          if (v.code && currentObj.label && (v.code === currentObj.label)) {
            count++;
            rowNode.data.showReviewerIcon = true;
          }
        });
        if (count == 1) {
          rowNode.data.showReviewerIcon = false;
        }
      }
      let stat = {
        statData: feedObjToSend,
        indexR: rowNode.rowIndex
      }
      this.SharedService.statusData(stat);
      var paramsData = {};
      paramsData['alertId'] = (rowNode.data && rowNode.data['alertId']) ? rowNode.data['alertId'] : '';
      if (ele.className == "assignee") {
        paramsData["asignee"] = feedObjToSend;
      }
      else if (ele.className == "group_level") {
        paramsData['groupLevel'] = feedObjToSend.groupId.id;
        paramsData["asignee"] = null;
      }
      else if (ele.className == "status") {
        paramsData['statuse'] = feedObjToSend;
        paramsData["asignee"] = rowNode.data.assignee.value[0].values;
        this.selectedIcon = feedObjToSend.icon;
        this.selectedIconColor = feedObjToSend.colorCode;
        rowNode.data.status.key = feedObjToSend.code;

      }

      this._alertService.saveOrUpdateAlerts([paramsData], '').subscribe((response) => {
        if (ele.className == "assignee") {
          rowNode.data["assignee"].key = ele.selectedItem ? ele.selectedItem : null;
        }
        else if (ele.className == "group_level") {
          this._alertService.getUsersListByGroups(feedObjToSend.groupId.id).subscribe(resp => {
            rowNode.data["assignee"].key = "UnAssigned";
            rowNode.data["assignee"].value = [];
            resp.result.map(userName => {
              var label = userName.firstName ? userName.firstName : "UnAssigned"
              rowNode.data["assignee"].value.push({ 'label': label, disable: false, "values": userName });
            })
            rowNode.data["assignee"].value.unshift({ 'label': "UnAssigned", disable: false, "values": {} })
            this.gridApi.redrawRows({ rowNodes: [rowNode] });
          })
          rowNode.data['groupLevel'].value = [];
          response.result[0].feedGroups = response.result[0].feedGroups.sort((a, b) => parseFloat(a.rank) - parseFloat(b.rank));
          response.result[0].feedGroups.map((groupObj) => {
            rowNode.data['groupLevel'].value.push({ 'label': groupObj.groupId.name, disable: true, "values": groupObj })
          })
          rowNode.data['groupLevel'].key = ele.selectedItem;
          rowNode.data = this.enablingTheRequiredOptionInGroupLevel(rowNode.data, rowNode.data['groupLevel'].key)
        }
        else if (ele.className == "status" || ele.className == "assignee") {
          this.gridApi.refreshInfiniteCache();
        }
        recallKpiData = true;
      });
    }
    else if (this.tableName == 'Feed list view') {
      if (this.selectedItem) {
        this.rowData[this.headerName] = this.selectedItem;
        var currentRowData = this.rowData;
        if (currentRowData.avoidSecondApiCall) {
          delete currentRowData.avoidSecondApiCall;
        }
        // let data = [currentRowData, this.headerName];
        if(currentRowData){
          currentRowData['singleSelectRendererRef'] = this;
          currentRowData['headerName'] = this.headerName;
          currentRowData['filters'] = JSON.stringify(this.gridApi.getFilterModel());
        }
        this._commonService.getRowData(currentRowData);
        // this._commonService.getHeader(this.headerName);
      }
    } else if (this.tableName == 'Case list view') {
      if (this.gridApi && this.storeParams) {
        var rowNode = this.gridApi.getDisplayedRowAtIndex(this.storeParams.rowIndex);
      }
      var feedObjToSend = ele.selectOptionsList.map((val) => {
        if (val.label == ele.selectedItem) {
          return val
        }
      }).filter((element) => { return element })[0];
      this.selectedIcon = feedObjToSend.icon;
      this.selectedIconColor = feedObjToSend.colorCode;
      var sendObj: any = {};
      if (ele.selectedItem && feedObjToSend.listItemId) {
        sendObj.caseId = ele.rowData && ele.rowData.caseId ? ele.rowData.caseId : "";
        if(ele.className == "priority"){
          sendObj.priority = feedObjToSend.listItemId;
        }else{
          sendObj.riskIndicator = feedObjToSend.listItemId;
        }
        this._caseService.updateCaseAPI(sendObj).subscribe((resp) => {
          if(ele.className == "priority"){
            rowNode.data['priority'] = ele.selectedItem ? ele.selectedItem : "";
          }else{
            rowNode.data['RiskIndicators'] = ele.selectedItem ? ele.selectedItem : "";
          }
        })
      }

    } else if (this.tableName == 'Case related entity') {
      if(currentObj.value != this.initValue)
      {
        if(currentObj.value == 0){
          currentObj.value = null;
        }
        this._caseService.updateCaseRelatedEntityNew(this.storeParams.data.id, currentObj.value).subscribe((res) => {
        if (res) {
          this.SharedService.showFlashMessage("Type of relations was updated successfully", "success");
        }
      }, (err) => {
        this._caseService.updateCaseRelatedEntityTableData.next(true);
        this.SharedService.showFlashMessage('Failed to update Entity with name: ' + this.storeParams.data.entity_name, 'danger');
      });}

    }
    // this.prevSelectedValue = this.selectedItem;
  }


  onOpenedChange(event: any, select: string, ele) {
    if (event) {
      this[select].panel.nativeElement.addEventListener('scroll', (event: any) => {
        if (this[select].panel.nativeElement.scrollTop === this[select].panel.nativeElement.scrollHeight - this[select].panel.nativeElement.offsetHeight) {
          if(this.pageNumber <= this.totalPages ){

            var rowNode = this.gridApi.getDisplayedRowAtIndex(this.rendererObject.rowId);
          if (ele.className == "assignee") {
            var groupObjToSend = rowNode.data["groupLevel"].value.map((val) => {
              if (val.label == rowNode.data["groupLevel"].key) {
                return val.values
              }
            }).filter((element) => { return element })[0];


            this._alertService.getUsersListByGroupsByPage(groupObjToSend.groupId.id, this.pageNumber+1 ,this.recsPerPage).subscribe(resp => {

              if(resp.result && resp.result.length > 1){

                resp.result.map(userName => {
                  rowNode.data["assignee"].value.push({ 'label': userName.firstName, disable: false, "values": userName });
                })

                if (Object.keys(rowNode.data).indexOf('checkTrue') == -1) {
                  rowNode.data["checkTrue"] = false;
                }
                this.selectOptionsList = rowNode.data["assignee"].value;
                this.pageNumber=this.pageNumber+1;

              }

            })

          }

          }

        }
      });
    }
  }




  /**On click  of dropdown in ALert from single rendered component
  * Author : Amritesh
  * Date : 9-Oct-2019
 */
  getCommentRelatedData(e, ele) {
    var rowNode = this.gridApi.getDisplayedRowAtIndex(this.rendererObject.rowId);
    if (ele.className == "assignee") {
      var groupObjToSend = rowNode.data["groupLevel"].value.map((val) => {
        if (val.label == rowNode.data["groupLevel"].key) {
          return val.values
        }
      }).filter((element) => { return element })[0];

      this._alertService.getUsersListByGroups(groupObjToSend.groupId.id).subscribe(resp => {
        rowNode.data["assignee"].key = "UnAssigned";
        rowNode.data["assignee"].value = [];
        this.totalPages = Math.floor(resp.paginationInformation.totalResults/this.recsPerPage);
        resp.result.map(userName => {
          rowNode.data["assignee"].value.push({ 'label': userName.firstName, disable: false, "values": userName });
        })
        rowNode.data["assignee"].value.unshift({ 'label': "UnAssigned", disable: false, "values": {} })
        this.selectOptionsList = rowNode.data["assignee"].value
        if (Object.keys(rowNode.data).indexOf('checkTrue') == -1) {
          // this.gridApi.redrawRows({ rowNodes: [rowNode] });
          rowNode.data["checkTrue"] = false;
        }
        this.selectOptionsList = rowNode.data["assignee"].value
      })
    }

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
  getColor(color) {
    return '#' + color
  }
  getBackgroundColor(color) {
    return '#' + color
  }
  getBgColor(color) {
    let selectedColor = '#' + color;
    return this.hexToRGB(selectedColor, 0.2);
  }

  public getInitialNameAbbr(item): string {
    const formatted = item.label ? `${item.label.charAt(0).toUpperCase()}${item.label.charAt(1)}` : '';
    return formatted;
  }

  getPriorityBgColor(priority, addOpacity) {
    let colorCode = '';
    if (priority.trim().toLowerCase() === RelatedCasesConstants.HIGH) {
      colorCode = RelatedCasesConstants.HIGH_PRIO_COLOR;
    } else if (priority.trim().toLowerCase() === RelatedCasesConstants.MID) {
      colorCode = RelatedCasesConstants.MID_PRIO_COLOR;
    } else if (priority.trim().toLowerCase() === RelatedCasesConstants.LOW) {
      colorCode = RelatedCasesConstants.LOW_PRIO_COLOR;
    } else {
      colorCode = RelatedCasesConstants.DEFAULT_PRIO_COLOR;
    }
    if (addOpacity) {
      colorCode = this.hexToRGB(colorCode, 0.12);
    }
    return colorCode;
  }

  hexToRGB(hex, alpha?) {
    var r = hex ? parseInt(hex.slice(1, 3), 16) : "",
      g = hex ? parseInt(hex.slice(3, 5), 16) : "",
      b = hex ? parseInt(hex.slice(5, 7), 16) : "";

    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }

  getComponentPermissionIds() {
    this._agGridTableService.behaviorSubjectForAllPermisonIds$.subscribe(ids => {
      this.permissionIdsList = ids;
    })
  }

  filterMyOptions(e){
    if(e){
      this.selectOptionsList = this.actualSelectOptions.filter(val => {if(val.label){ return val.label.toLowerCase().indexOf(e.toLowerCase()) !=-1}});
    }
    else{
      this.selectOptionsList = this.actualSelectOptions;
    }
  }
 /**On change of dropdown in Case Management (assignee) from Table
  * Author : Amritesh
  * Date : 26-may-2020
 */
  selectItem(e, ele, currentObj){
    var paramsData:any = {};
    setTimeout(() => {
      if (this.gridApi && this.storeParams) {
        var rowNode = this.gridApi.getDisplayedRowAtIndex(this.storeParams.rowIndex);
      }
      if(ele && currentObj){
        paramsData.caseId =ele.rowData && ele.rowData.caseId?ele.rowData.caseId:"";
        paramsData.assignee = currentObj.userId ? currentObj.userId == "unassigned" ? 0 : currentObj.userId : 0;
        this._caseService.updateCaseAPI(paramsData).subscribe((resp)=>{
          rowNode.data['Assignee'] =currentObj.label?currentObj.label:"";
          recallKpiDataCaseManagement= true;
          this._caseService.updateTableData.next(true);
        })
      }
    },1000);
  }

  public trackByLabel(_, item): string {
    return item.label;
  }


  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
