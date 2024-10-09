import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AgGridTableService } from '../../../../common-modules/modules/ag-grid-table/ag-grid-table.service';
import { AlertManagementService } from '../../alert-management.service';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { ColorPickerRendererComponentComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/color-picker-renderer-component/color-picker-renderer-component.component';
import { CustomTableRendererComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/custom-table-renderer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SingleSelectRendererComponentComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/single-select-renderer-component/single-select-renderer-component.component';
import { MultiSelectRendererComponentComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/multi-select-renderer-component/multi-select-renderer-component.component';
import { InputTextRendererComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/input-text-renderer/input-text-renderer.component';
import { ReviewerComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/reviewer/reviewer.component';
import { Title } from '@angular/platform-browser';
import { GeneralSettingsApiService } from '@app/modules/systemsetting/services/generalsettings.api.service';
import { FeedGroupLevel, UpdateFeedParams } from '../../models/feed-model';

@Component({
  selector: 'app-feed-list',
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.scss']
})
export class FeedListComponent implements OnInit, OnDestroy, AfterViewInit {
  /**====================== Public variables Start=======================*/
  public presentDate = new Date();
  exportParams: any = {
    skipHeader: false,
    columnGroups: true,
    skipFooters: true,
    skipGroups: true,
    skipPinnedTop: true,
    skipPinnedBottom: true,
    allColumns: true,
    fileName: 'feeds-' + this.presentDate.getDate() + "-" + (this.presentDate.getMonth()+1) + "-" + this.presentDate.getFullYear(),
    sheetName: 1,
    columnSeparator: ",",
    columnKeys: ['feed name', 'color', 'type', 'source', 'assigned alerts', 'group levels'],
    processCellCallback: function (params) {
      return params.value
    },
    processHeaderCallback: function (params) {
      if (params.column.getColDef().headerName)
        return params.column.getColDef().headerName.toUpperCase();
    }

  }

  public gridOptions: any = {};
  public feedListApiData: any;
  public tabsData: any = [];
  public colorList: any = [];
  public componentThis: any;
  public paginationPageSize: any;
  public showRightPanel: boolean = false;
  public data: any;
  public deleteFeedId: any;
  public list_types: any = [
    { type: "Feed Classification" },
    { type: "Feed Source" },
    { type: "Group Level" },
    { type: "Alert Status" }
  ]
  public listsOfDataByHeader: any = {
    classificationList: [],
    sourceList: [],
    groupLevelList: [],
    statusList: []
  };
  public feedListPermssionIds: Array<any> = [];
  alertListPermssionIds : Array<any> = [];
  public languageJson: any;
  public promisObj: any;
  public showGridTable: boolean = false;
  /**====================== Public variables End=======================*/

  /**====================== Private variables start =======================*/
  private unsubscribe$: Subject<any> = new Subject<any>();
  private columnDefs: any = [];
  private rowData: any = [];
  public componentName = 'feedList';
  statusObjs_new: any = [];
  alertStatus: any;
  statusObjs: any[];
  /**====================== Private variables end =======================*/

  constructor(
    private AgGridTableService: AgGridTableService,
    private _alertService: AlertManagementService,
    private _commonService: CommonServicesService,
    private _generalSettingsApiService: GeneralSettingsApiService,
    private _sharedServicesService: SharedServicesService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle("Feed Management");
    this.getFeedListPermssionIds();
    this.getAlertListPermssionIds();
    this._alertService.getFeedList().subscribe(data => {
    })
    // this.promisObj = new Promise((resolve,reject)=>{
    this._commonService.behaveObserverForgetLanguageJson.subscribe((resp) => {
      if (resp != undefined && resp) {
        this.languageJson = resp;
        this.localizePaginationText(this.languageJson);
        // gridAssign();
        // resolve(this.languageJson);
      }
    })
    // });
    Promise.all([this.getFeedListPermssionIds()]).then((values) => {
      this.AgGridTableService.behaviorSubjectForAllPermisonIds.next(this.feedListPermssionIds);
        let getDomainPermissions = (value, arg) => {
          let result;
          if (value && value.length > 0) {
            result = value.find(ele => ele.hasOwnProperty(arg));
           }
          if (result) {
            return result[arg];
          }
          else{
            return {}
          }
        }
        let domainPermissions_color =   getDomainPermissions(this.feedListPermssionIds,'color') ;
        let domainPermissions_type =   getDomainPermissions(this.feedListPermssionIds,'type') ;
        let domainPermissions_source =   getDomainPermissions(this.feedListPermssionIds,'source') ;
        let domainPermissions_groupLevel =   getDomainPermissions(this.feedListPermssionIds,'groupLevel') ;
        if(domainPermissions_groupLevel  = {} ){
          domainPermissions_groupLevel  = getDomainPermissions(this.feedListPermssionIds,'groupLevels') ;
        }
        let domainPermissions_isReviewRequired =   getDomainPermissions(this.feedListPermssionIds,'isReviewRequired') ;
        let domainPermissions_edit =   getDomainPermissions(this.feedListPermssionIds,'edit') ;
        let domainPermissions_delete =   getDomainPermissions(this.feedListPermssionIds,'delete') ;
        let domainPermissions_audit =   getDomainPermissions(this.feedListPermssionIds,'feedAuditing') ;


        let permission_color = this._commonService.getPermissionStatus(domainPermissions_color);
        let permission_type = this._commonService.getPermissionStatus(domainPermissions_type);
        let permission_source = this._commonService.getPermissionStatus(domainPermissions_source);
        let permission_groupLevel = this._commonService.getPermissionStatus(domainPermissions_groupLevel);
        let permission_isReviewRequired = this._commonService.getPermissionStatus(domainPermissions_isReviewRequired);
        let permission_edit = this._commonService.getPermissionStatus(domainPermissions_edit);
        let permission_delete = this._commonService.getPermissionStatus(domainPermissions_delete);
        let permission_audit = this._commonService.getPermissionStatus(domainPermissions_audit);

      // let gridAssign = ()=>{
      this.columnDefs = [
        {
          'headerName': 'Feed Name',//this.getLanguageKey('FeedName'),
          'field': 'Feed Name',
          'colId': 'feed name',
          'width': 200,
          'disable' : permission_edit,
          'initialShowColumn': true,
          'sortable': false,
          'cellRendererFramework': InputTextRendererComponent,
          'editable': false,
          'filterParams': {
            applyButton: true,
            clearButton: true
          }

        },
        {
          'headerName': 'Color',//this.getLanguageKey('Color'),
          'field': 'Color',
          'colId': 'color',
          'disable' : permission_color,
          'width': 100,
          'filter': false,
          'initialShowColumn': true,
          'editable': false,
          'cellRendererFramework': ColorPickerRendererComponentComponent
        },
        {
          'headerName': 'Type',//this.getLanguageKey('Type'),
          'field': 'Type',
          'colId': 'type',
          'disable' : permission_type,
          'width': 150,
          'editable': true,
          'initialShowColumn': true,
          'cellRendererFramework': SingleSelectRendererComponentComponent,
          'cellEditor': "singleSelectRendererComponentComponent",
          'cellEditorParams': {
            'values': []
          },
          'singleClickEdit': true,
          'floatingFilterComponent': 'singleSelectFilterComponent',
          'floatingFilterComponentParams': {
            'suppressFilterButton': true,
            'colId': 'type',
            'options': []
          }
        },
        {
          'headerName': 'Source',//this.getLanguageKey('Source'),
          'field': 'Source',
          'colId': 'source',
          'disable' : permission_source,
          'width': 210,
          'initialShowColumn': true,
          'editable': true,
          'cellRendererFramework': SingleSelectRendererComponentComponent,
          'cellEditor': "singleSelectRendererComponentComponent",
          'cellEditorParams': {
            'values': []
          },
          'singleClickEdit': true,
          'floatingFilterComponent': 'singleSelectFilterComponent',
          'floatingFilterComponentParams': {
            'suppressFilterButton': true,
            'colId': 'source',
            'options': []
          }
        },
        // {
        //   'headerName': this.getLanguageKey('AssignedAlerts'),
        //   'field': 'Assigned Alerts',
        //   'colId': 'assigned alerts',
        //   'width': 250,
        //   'initialShowColumn': true,
        //   'editable': false,
        //   'singleClickEdit': true,
        //   'cellRendererFramework': CustomTableRendererComponent,
        //   'customTemplateClass': 'feed-assigned-alerts',
        //   'filterParams': {
        //     applyButton: true,
        //     clearButton: true
        //   }
        // },
        {
          'headerName': 'Group Levels', //this.getLanguageKey('GroupLevels'),
          'field': 'Group Levels',
          'colId': 'group levels',
          'width': 190,
          'editable': true,
          'disable' : permission_groupLevel,
          'initialShowColumn': true,
          'singleClickEdit': true,
          'cellRendererFramework': MultiSelectRendererComponentComponent,
          'cellEditor': "multiSelectRendererComponentComponent",
          'cellEditorParams': {
            'values': []
          },
          'selectBoxListData': [],
          'floatingFilterComponent': 'multiSelectFilterComponent',
          'floatingFilterComponentParams': {
            'suppressFilterButton': true,
            'colId': 'group levels',
            'options': []
          }
        },
        {
          'headerName': 'Reviewer',//this.getLanguageKey('Reviewer'),
          'field': 'Reviewer',
          'colId': 'reviewer',
          'width': 200,
          'disable' : permission_isReviewRequired,
          'editable': true,
          'initialShowColumn': true,
          'singleClickEdit': true,
          'cellRendererFramework': ReviewerComponent,
          'cellEditor': "multiSelectRendererComponentComponent",
          'cellEditorParams': {
            'values': []
          },
          'selectBoxListData': [],
          'floatingFilterComponent': 'multiSelectFilterComponent',
          'floatingFilterComponentParams': {
            'suppressFilterButton': true,
            'colId': 'reviewer',
            'options': []
          }
        },
        {
          'headerName': 'History',//this.getLanguageKey('History'),
          'field': 'History',
          'colId': 'history',
          'width': 150,
          'initialShowColumn': true,
          'filter': false,
          'cellRendererFramework': CustomTableRendererComponent,
          'customTemplateClass': 'feed-component'
        }
      ]

      /**gridOption*/
      this.gridOptions = {
        'resizable': true,
        'addFeedButtonEnable': true,
        'tableName': 'Feed list view',
        'columnDefs': this.columnDefs,
        'rowHeight': 53,
        'rowStyle': { 'border-bottom': '#545454 1px solid' },
        'pagination': true,
        'rowSelection': 'multiple',
        'floatingFilter': true,
        'animateRows': true,
        'isShoHideColumns': true,
        'cellClass': 'ws-normal',
        'rowModelType': 'clientSide',
        'paginationPageSize': 10,
        'showBulkOperations': false,
        'enableTopSection': true,
        'enableTableViews': true,
        'filter': true,
        'sortable': true,
        'tabs': false,
        'enableCheckBoxes': false,
        'multiSortKey': 'ctrl',
        'componentType': 'alert list',
        'defaultGridName': 'Alert View',
        'changeBackground': "#ef5350",
        'this': this.componentThis,
        'csvExportParams': this.exportParams,

      };
      Promise.all([this.getAllActivityStatusList()]).then((res)=>{
        Promise.all( [this.getAllGroupLevelsList(), this.getListDataForListTyps(this.list_types), this.getAllColorsFromList()]).then((values) => {
          this.getAllFeedsListData("");
        });
      })
      // }

    })

    this._sharedServicesService.currentMessage.subscribe((v: any) => {
      this.showRightPanel = v;
    });
  }


  // get status key values from the activivty side
  // lanka
  // 2022/03/22
  getAllActivityStatusList(){
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

          },(err)=>{
            resolve("");
          }
          );
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

    return StatusListPromise_new;
  }

  getAllGroupLevelsList() {
    let promise = new Promise((resolve, reject) => {
      this._alertService.getAllGroupList().subscribe(resp => {
        this.listsOfDataByHeader.groupLevelList = resp.result;
        this.columnDefs.map(value => {
          if (value.colId == 'group levels') {
            //value['selectBoxListData'] = this.setMultiSelectOptionsForComponent(this.listsOfDataByHeader.groupLevelList);
            //value.cellEditorParams.values = this.setDataForCellEditorParams(value['selectBoxListData']);
            value.floatingFilterComponentParams.options = this.setMultiSelectOptionsForComponent(this.listsOfDataByHeader.groupLevelList);
          }
        });
        if (this.gridOptions && this.gridOptions.rowData && this.gridOptions.rowData.length) {
          this.gridOptions.rowData.map((val) => {
            if (val) {
              val['multiSelectBoxOptions'] = this.setMultiSelectOptionsForComponent(this.listsOfDataByHeader.groupLevelList)
            }
          });
        }
        this.gridOptions.columnDefs = this.columnDefs;
        resolve("success");
      }, (err) => { })
    });
    return promise;
  }
  /**Get all lists data according to the perticular type
   * Author : karunakar
   * Date : 23-Aug-2019
  */
  getListDataForListTyps(listTypes) {
    let promise = new Promise((Bigresolve, Bigreject) => {
      let setValues = () => {
        this.columnDefs.map(value => {
          if (value.cellEditorParams) {
            if (value.colId == 'type') {
              value['selectBoxListData'] = this.listsOfDataByHeader.classificationList ? this.listsOfDataByHeader.classificationList : [];
              //value.cellEditorParams.values = this.setDataForCellEditorParams(this.listsOfDataByHeader.classificationList);
            }
            else if (value.colId == 'source') {
              value['selectBoxListData'] = this.listsOfDataByHeader.sourceList ? this.listsOfDataByHeader.sourceList : [];
              //value.cellEditorParams.values = this.setDataForCellEditorParams(this.listsOfDataByHeader.sourceList);
            }
            else if (value.colId == 'reviewer') {
              value['selectBoxListData'] = this.listsOfDataByHeader.statusList ? this.setAllListDataForSelectBoxOptions(this.listsOfDataByHeader.statusList) : [];
              //value.cellEditorParams.values = this.setDataForCellEditorParams(this.listsOfDataByHeader.sourceList);
            }
          }
        });

      }
      if (listTypes.length) {
        let allPromises = [];
        listTypes.filter(val => {
          var promise = new Promise((resolve, reject) => {
            this._alertService.getListDataForEachType(val.type).subscribe(resp => {
              if (resp.length) {
                if (val.type == "Feed Classification") {
                  this.listsOfDataByHeader.classificationList = this.setAllListDataForSelectBoxOptions(resp);
                  setValues();
                }
                else if (val.type == "Feed Source") {
                  this.listsOfDataByHeader.sourceList = this.setAllListDataForSelectBoxOptions(resp);
                  setValues();
                }
                else if (val.type == "Alert Status") {
                  var ifExist
                  var activityStatusList = [];
                  this.statusObjs_new.forEach(element => {
                    if(resp.length>0){
                      ifExist = resp.find((e)=>{
                      return e.code == element.listItemId
                    })
                    }

                    if(ifExist){
                      this.listsOfDataByHeader.statusList.push(ifExist)
                    }
                  });

                  this.listsOfDataByHeader.statusList.sort((a,b) => a.displayName.localeCompare(b.displayName));

                  this.gridOptions['reviewerDataFromFeed'] = this.listsOfDataByHeader.statusList;
                  setValues();
                  resolve("success")
                }
              }
              resolve("success")

            }, (err) => {
              resolve("success")
            });

          });
          allPromises.push(promise)
        });
        Promise.all(allPromises).then((values) => {
          Bigresolve("success")
        });
      }
    });
    return promise;
  }

  getAllColorsFromList() {
    let promise = new Promise((resolve, reject) => {
      this._alertService.getColorsList().subscribe(resp => {
        this.colorList = resp.length ? resp : [];
        this.gridOptions['colorList'] = this.colorList.length ? this.colorList : [];
        this.listsOfDataByHeader['colorList'] = this.colorList.length ? this.colorList : [];
        resolve("success");
      },
        (err) => { })
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

  /**Getting Language text
   * Author : karnakar
   * Date : 20-Jan-2020
  */
  getLanguageKey(text) {
    var langKey = '';
    if (this.languageJson !== undefined) {
      langKey = this.languageJson[text];
      return langKey;
    }
  }

  public ModalClose(ref, status) {
    if (status == 1) {
      this.deleteFeed(this.deleteFeedId);

      // this.RowClearMethod(this.RowParams)
    }
    ref.close("closed");
  }
  public deleteFeedSubscriber: any;
  deleteFeed(id) {
    this.deleteFeedSubscriber = this._alertService.deleteFeed(id);
    this.deleteFeedSubscriber.subscribe((responce: any) => {
      if (responce == true) {
        this.agInstance[this.RowClearMethod](this.RowParams);
        this._sharedServicesService.showFlashMessage(this.getLanguageKey('FeedDeletedSuccessfully') + '!', 'success');
        this.getAllFeedsListData("");
      }
      else {
        this._sharedServicesService.showFlashMessage(responce.responseMessage, 'warning');
      }

    },
      (err) => {
        this._sharedServicesService.showFlashMessage(err, 'danger');
      });
  }
  public agInstance: any;
  public RowClearMethod: any;
  public RowParams: any;
  ngAfterViewInit() {
    /** Bellow API's are calling when we get data from ag-grid table(module)*/
    // Row clicked data
    var data: any = [];
    this._commonService.getObserver.pipe(takeUntil(this.unsubscribe$)).subscribe(resp => {
      data = resp;
      if (Object.keys(data).length && !data.hasOwnProperty('avoidSecondApiCall')) {
        data['avoidSecondApiCall'] = true;

        const paramData = {
          feedName: data['Feed Name'] ? data['Feed Name'] : '',
          color: data.Color ? data.Color : 'Orange',
          type: data.Type ? this.listsOfDataByHeader.classificationList.map(val => { if (val.label && (val.label == data.Type)) { return val.listItemId; } }).filter(ele => ele)[0] : null,
          source: data.Source ? this.listsOfDataByHeader.sourceList.map(val => { if (val.label && (val.label == data.Source)) { return val.listItemId ? val.listItemId : null; } }).filter(ele => ele)[0] : null,
          groupLevels: this.arrangeGroupLevelesForSaveOrUpdate(data['Group Levels'] ? data['Group Levels'] : '') || [],
          isReviewerRequired: (data.reviewers && data.reviewers.length) ? true : false,
          reviewer: (data.reviewers && data.reviewers.length) ? data.reviewers : []
        } as UpdateFeedParams;
        if (data['typeOfEvent'] && data['typeOfEvent'] == 'delete') {
          this.deleteFeedId = data['feed_id'] ? data['feed_id'] : '';
          this.RowClearMethod = data['method'];
          this.RowParams = data['params'];
          this.agInstance = data['instance'];

          if (this.deleteFeedId) {
            document.getElementById("deleteModal").click();
          }
          else {
            this.agInstance[this.RowClearMethod](this.RowParams);
          }
        }
        else if (data.feed_id) {
          paramData['feed_management_id'] = data.feed_id;
          this._alertService.saveOrUpdateFeed(paramData).subscribe(responce => {
            // this._commonService.getHeaderName.subscribe((header) => {
              let header : any = (resp && resp['headerName'])?resp['headerName'] :  null

              if (header == "Feed Name" || header == "Name des Feeds") {
                this._sharedServicesService.showFlashMessage(header + ' ' + this.getLanguageKey('UpdatedSuccessfully') + '!', 'success');
              }
              else {
                this._sharedServicesService.showFlashMessage(this.getLanguageKey('Feed') + ' ' + header + ' ' + this.getLanguageKey('UpdatedSuccessfully') + '!', 'success');
              }
              this.getAllFeedsListData(resp['thatGridApi'],resp['filters']);
              data.thatGridApi.refreshClientSideRowModel()


            // });
            if(data && data['singleSelectRendererRef'] && header == data['singleSelectRendererRef']['headerName']){
              data['singleSelectRendererRef']['prevSelectedValue'] = data['singleSelectRendererRef']['selectedItem'];
              let header = data['singleSelectRendererRef']['headerName'];
              this._sharedServicesService.showFlashMessage(this.getLanguageKey('Feed') + ' ' + header + ' ' + this.getLanguageKey('UpdatedSuccessfully') + '!', 'success');
            }
          },
            (err) => {
              if (data && data['singleSelectRendererRef']) {
                data['singleSelectRendererRef']['selectedItem'] = data['singleSelectRendererRef']['prevSelectedValue'];
                data[data['singleSelectRendererRef']['headerName']] = data['singleSelectRendererRef']['prevSelectedValue'];
                this._sharedServicesService.showFlashMessage(err, 'danger');
                this.getAllFeedsListData(resp['thatGridApi'],resp['filters']);
                data.thatGridApi.refreshClientSideRowModel()


              }
              else {
                this._sharedServicesService.showFlashMessage(err, 'danger');
                this.getAllFeedsListData(resp['thatGridApi'],resp['filters']);
                data.thatGridApi.refreshClientSideRowModel()


              }

            });
        }
        else if (!data.feed_id && data.isFirstClick) {
          if (paramData.feedName) {
            if (paramData.type) {
              if (paramData.source) {
                this._alertService.saveOrUpdateFeed(paramData).subscribe(responce => {
                  this._sharedServicesService.showFlashMessage(this.getLanguageKey('FeedCreatedSuccessfully') + '!', 'success');
                  this.getAllFeedsListData(resp['thatGridApi'],resp['filters']);
                  data.thatGridApi.refreshClientSideRowModel()


                },
                  (err) => {
                    this._sharedServicesService.showFlashMessage(err, 'danger');
                    this.getAllFeedsListData(resp['thatGridApi'],resp['filters']);
                    data.thatGridApi.refreshClientSideRowModel()


                  });
              }
              else {
                this._sharedServicesService.showFlashMessage(this.getLanguageKey('SourceShouldNotBeEmpty'), 'danger');
              }
            }
            else {
              this._sharedServicesService.showFlashMessage(this.getLanguageKey('TypeShouldNotBeEmpty'), 'danger');
            }
          }
          if (data.isFirstClick) {
            delete data.isFirstClick;
          }
        }
        else if (data['reviewers'] && (data['reviewers'].length === 0 || data['reviewers'].length)) {
          let filters = data.thatGridApi.getFilterModel()

          this._alertService.saveOrUpdateFeed(paramData).subscribe(responce => {
            this._sharedServicesService.showFlashMessage(this.getLanguageKey('FeedUpdatedSuccessfully') + '!', 'success');
            this.getAllFeedsListData(resp['thatGridApi'],resp['filters']);
            data.thatGridApi.refreshClientSideRowModel()


          },
            (err) => {
              this._sharedServicesService.showFlashMessage(err, 'danger');
              this.getAllFeedsListData(resp['thatGridApi'],resp['filters']);
              data.thatGridApi.refreshClientSideRowModel()
            });
        }
      }
    },
      (err) => {
        this._sharedServicesService.showFlashMessage(err, 'danger');
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  arrangeGroupLevelesForSaveOrUpdate(valuesStr: string): FeedGroupLevel[] {
    if (valuesStr) {
      const values = valuesStr.split(',');
      const tempGroups: FeedGroupLevel[] = [];
      if (values.length) {
        values.map((v, k) => {
          if (v) {
            tempGroups.push({
              rank: k + 1,
              groupId: this.listsOfDataByHeader.groupLevelList.filter(val => {
                if (v && val.name && (v === val.name)) { return val; }
              })[0]
            } as FeedGroupLevel);
          }
        });
      }
      return tempGroups;
    }
    return null;
  }

  getAllFeedsListData(that,filters= null) {
    this._alertService.getFeedList().subscribe(resp => {
      var tempRowData = [];
      if (resp && resp.result.length) {
        resp.result.forEach(ele => {
          tempRowData.push({
            'feed_id': ele.feed_management_id ? ele.feed_management_id : '',
            'Feed Name': ele.feedName ? ele.feedName : '',
            'Color': ele.color ? ele.color : '',
            'Type': this.getSelectedValuesForColumn(this.listsOfDataByHeader.classificationList, ele.type),
            'Source': this.getSelectedValuesForColumn(this.listsOfDataByHeader.sourceList, ele.source),
            'Assigned Alerts': ele.assignedAlertsCount ? ele.assignedAlertsCount : 0,
            'Group Levels': this.setSelectedGroupLevels(ele.groupLevels),
            'Reviewer': this.setSelectedReviwerData(ele.reviewer),
            'reviewerData': this.getAllStatusesWithSelectedValues(ele.reviewer),
            'isReviewRequire': ele.isReviewerRequired ? ele.isReviewerRequired : false,
            'History': ele.history ? ele.history : ''
          });
        });

      }
      if (that) {
        // this.rowData = tempRowData; // Main row data
        tempRowData  = tempRowData.sort((a, b) => { if (a['Feed Name'].toLowerCase() < b['Feed Name'].toLowerCase()) { return -1 } });
        if (this.listsOfDataByHeader.groupLevelList.length) {
          tempRowData.map((val) => {
            if (val) {
              val['multiSelectBoxOptions'] = this.setMultiSelectOptionsForComponent(this.listsOfDataByHeader.groupLevelList)
            }
          });
        }
        that.setRowData(tempRowData);
        if(filters){
          filters = JSON.parse(filters);
          that.setFilterModel(filters);
        }
        return;
      }

      this.rowData = tempRowData; // Main row data
      this.gridOptions.rowData = this.rowData.sort((a, b) => { if (a['Feed Name'].toLowerCase() < b['Feed Name'].toLowerCase()) { return -1 } });
      this.columnDefs.map((val) => {
        if (val.colId == 'type') {
          val.floatingFilterComponentParams.options = this.unShiftAllTextInFilterOptions(JSON.parse(JSON.stringify(this.listsOfDataByHeader.classificationList)));
        }
        else if (val.colId == 'source') {
          val.floatingFilterComponentParams.options = this.unShiftAllTextInFilterOptions(JSON.parse(JSON.stringify(this.listsOfDataByHeader.sourceList)));
        }
        else if (val.colId == 'reviewer') {
          val.floatingFilterComponentParams.options = this.setAllListDataForSelectBoxOptions(this.listsOfDataByHeader.statusList);
        }
      });

      if (this.listsOfDataByHeader.groupLevelList.length) {
        this.gridOptions.rowData.map((val) => {
          if (val) {
            val['multiSelectBoxOptions'] = this.setMultiSelectOptionsForComponent(this.listsOfDataByHeader.groupLevelList)
          }
        });
      }


      this.showGridTable = true;
    }, (err) => {

    });
  }

  unShiftAllTextInFilterOptions(list) {
    var tempList = list ? list : [];
    tempList.unshift({
      'listItemId': null,
      'label': this.getLanguageKey('All')
    });

    return tempList;
  }

  getAllStatusesWithSelectedValues(actualValues) {
    var finalArr = [];
    if (this.listsOfDataByHeader.statusList.length) {
      this.listsOfDataByHeader.statusList.map((v) => {
        v['isShowList'] = false;
      });
    }
    finalArr = JSON.parse(JSON.stringify(this.listsOfDataByHeader.statusList));

    if (actualValues.length) {
      this.listsOfDataByHeader.statusList.filter((val, ind) => {
        actualValues.filter((v) => {
          if (val.displayName == v.displayName) {
            finalArr[ind].isShowList = true;
          }
        })
      });
    }
    return finalArr;
  }


  getSelectedValuesForColumn(list, value) {
    var selectedLabel = '';
    list.filter((val) => {
      if (val.listItemId && value && (val.listItemId == value)) {
        selectedLabel = val.label ? val.label : '';
      }
    });
    return selectedLabel;
  }

  /**Setting selected group levels
   * Author : karunakar
   * Date : 23-Aug-2019
  */
  setSelectedGroupLevels(val) {
    val = val.sort(function (a, b) { return a['rank'] - b['rank'] });
    var groupName = '';
    val.map((v) => {
      var name = (v.groupId && v.groupId.name) ? v.groupId.name : '';
      groupName = groupName + (groupName ? "," : "") + name;
    });
    return groupName;
  }

  /**Setting selected reviews
   * Author : karunakar
   * Date : 08-Jan-2020
  */
  setSelectedReviwerData(val) {
    var reviewText = '';
    val.map((v) => {
      var name = (v.listItemId && v.displayName) ? v.displayName : '';
      reviewText = reviewText + (reviewText ? "/" : "") + name;
    });
    return reviewText;
  }



  /**Setting list data for select box options in the table
   * Author : karunakar
   * Date : 23-Aug-2019
  */

  setAllListDataForSelectBoxOptions(list) {
    var listData = [];
    list.filter(v => {
      listData.push({
        listItemId: v.listItemId,
        label: v.displayName
      })
    });

    //
    return listData;
  }

  /** Setting list data to cellEditorParams(default key of ag-grid)
   * Author : karunakar
   * Date : 27-Aug-2019
  */
  setDataForCellEditorParams(list) {
    const values = [];
    list.filter(v => {
      values.push(v.label);
    });
    return values;
  }

  /** Get all group leves list
   * Author : karunakar
   * Date : 23-Sep-2019
  */


  /**Set multi select options */
  setMultiSelectOptionsForComponent(list) {
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

  /** Main function that send data to ag grid component */
  createGridTable(options) {
    /** Sending data to service behavoir subject next() */
    this.AgGridTableService.getGridOptionsFromComponent(options);
  }

  exportData() {
    document.getElementById("export-button").click();
    //this._sharedService.exportDataemit();
  }

  getFeedListPermssionIds() {

    let promise = new Promise((resolve, reject) => {
        this._alertService.getPermissionIds().pipe(map(res => {
          return res[this.componentName]
        })).subscribe(data => {
          this.feedListPermssionIds = data;
          resolve(true);
        });
    });
    return promise
    // this._alertService.getPermissionIds().pipe(map(res => {
    //   return res[this.componentName]
    // })).subscribe(data => {
    //   this.feedListPermssionIds = data;
    // });
  }

  getAlertListPermssionIds() {
    this._alertService.getPermissionIds().pipe(map(res => {
      return res['tabs']
    })).subscribe(data => {
      this.alertListPermssionIds = data;
    });
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
}
