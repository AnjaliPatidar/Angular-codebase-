import { Component, OnInit } from '@angular/core';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { AgGridTableService } from '../../ag-grid-table.service';

@Component({
  selector: 'app-reviewer',
  templateUrl: './reviewer.component.html',
  styleUrls: ['./reviewer.component.scss']
})
export class ReviewerComponent implements OnInit {
  public tableName: any;
  public templateClass: any;
  public value: any;
  public tableDataParams: any;
  public rowData: any = [];
  public rowIndex: any;
  public gridApi: any;
  public currentRow: any = {};
  public revieweSwitchEnableDisable: boolean = false;
  public showStatusListBlock: boolean = false;
  public reviewerData: any = [];
  public statusList: any = [];
  public selectedOptions: any = [];
  public headerName: any;
  public currentTableRowData: any;
  public selectedItem: any;
  public groupList: any = [];
  public disableOptionForNotRequired: boolean = false;
  public languageJson: any;
  public permissionIdsList: Array<any> = [];
  public selectedReviewerList: Array<any> = [];
  public disableReviewer: boolean = false;
  constructor(private _agGridTableService: AgGridTableService, private _commonService: CommonServicesService) { }

  ngOnInit() {
    this.getComponentPermissionIds();
  }

  /**agInit() will call for every row of column */
  agInit(params: any, $event): void {
    if (params) {
      // var selectedReviewerList = []
      this.value = '';
      this.tableName = (params.api && params.api.gridOptionsWrapper && params.api.gridOptionsWrapper.gridOptions && params.api.gridOptionsWrapper.gridOptions.tableName) ? params.api.gridOptionsWrapper.gridOptions.tableName : '';
      this.rowData = (params.api && params.api.gridOptionsWrapper && params.api.gridOptionsWrapper.gridOptions && params.api.gridOptionsWrapper.gridOptions.rowData) ? params.api.gridOptionsWrapper.gridOptions.rowData : [];
      this.rowIndex = params.rowIndex;
      this.currentRow = params.data ? params.data : {};
      this.disableReviewer = this.currentRow.disableReviewer ? this.currentRow.disableReviewer : false
      // if(this.currentRow.reviewerData && this.currentRow.reviewerData.length == 0){
      this.currentRow.reviewerData = params.api.gridOptionsWrapper.gridOptions.reviewerDataFromFeed;
      // }

      this.gridApi = params.api;
      this.currentTableRowData = params.data ? params.data : {}
      this.headerName = (params.colDef && params.colDef.headerName) ? params.colDef.headerName : '';
      this.revieweSwitchEnableDisable = (this.currentRow && this.currentRow.isReviewRequire) ? this.currentRow.isReviewRequire : false;
      this.templateClass = (params.colDef && params.colDef.customTemplateClass) ? params.colDef.customTemplateClass : '';
      this.value = params.value ? params.value : '';
      this.tableDataParams = params;

      if (this.revieweSwitchEnableDisable) {
        this.showStatusListBlock = true;
      }
      this._commonService.behaveObserverForgetLanguageJson.subscribe((resp) => {
        if (resp) {
          this.languageJson = resp;
        }
      });
      this.selectedReviewerList = this.currentRow.Reviewer ? this.currentRow.Reviewer.split("/") : [];

      if (this.tableName == 'Alert list view') {
        this.groupList = [];
        this.selectedItem = (this.currentRow.groupLevel && this.currentRow.reviewer && this.currentRow.reviewer.feed && this.currentRow.reviewer.feed.reviewer && this.currentRow.reviewer.feed.reviewer.length && this.currentRow.groupLevel.key) ? this.currentRow.groupLevel.key : this.getLanguageKey('NotRequired');
        this.reviewerData = (this.currentRow && this.currentRow.reviewer && this.currentRow.reviewer.feed && this.currentRow.reviewer.feed[0] && this.currentRow.reviewer.feed[0].reviewer) ? this.currentRow.reviewer.feed[0].reviewer : [];
        if (this.reviewerData && this.reviewerData.length) {
          this.groupList = (this.currentRow.groupLevel && this.currentRow.groupLevel.value && this.currentRow.groupLevel.value.length) ? this.currentRow.groupLevel.value : [];
        }
        else {
          this.selectedItem = this.getLanguageKey('NotRequired');
          this.disableOptionForNotRequired = true;
          this.groupList.push({
            'label': this.getLanguageKey('NotRequired'),
            'disable': true
          })
        }
      }
    }

  }

  updateReview() {
    this.currentRow.reviewerData.map((v) => {
      if (this.selectedReviewerList.indexOf(v.displayName) !== -1) {
        v.isShowList = true
      } else {
        v.isShowList = false
      }
      return v
    });
  }
  /**Getting Language text
    * Author : karnakar
    * Date : 20-Jan-2020
   */
  getLanguageKey(text) {

    var langKey = '';
    if (this.languageJson) {
      langKey = this.languageJson[text];
    }
    return langKey;
  }
  enableListBlock(e) {
    this.showStatusListBlock = !this.showStatusListBlock;
    if (!this.showStatusListBlock && this.currentRow && this.currentRow.reviewerData && this.currentRow.reviewerData.length) {
      this.currentRow.reviewerData.map((val) => {
        val.isShowList = false;
      });

      this.currentTableRowData[this.headerName] = '';
      var currentRowData = this.currentTableRowData;
      currentRowData['reviewers'] = [];
      currentRowData['thatGridApi'] = this.gridApi;
      currentRowData['filters'] = JSON.stringify(this.gridApi.getFilterModel());
      currentRowData['headerName'] = this.headerName;
      if (currentRowData.avoidSecondApiCall) {
        delete currentRowData.avoidSecondApiCall;
      }
      this._commonService.getRowData(currentRowData);
    }
  }

  getSelectedOptions(e, list) {
    this.selectedOptions = [];
    if (this.tableName == 'Feed list view') {
      this.currentRow.reviewerData.map((val) => {
        if (val.isShowList) {
          this.selectedOptions.push(val);
        }
      });
    }
    else if (this.tableName == 'Alert list view') {

    }
  }

  cancelReview() {
  }

  svaeOrUpdateReview() {
    this.currentTableRowData[this.headerName] = this.setSelectedReviwerData(this.selectedOptions);
    var currentRowData = this.currentTableRowData;
    currentRowData['reviewers'] = this.selectedOptions;
    currentRowData['thatGridApi'] = this.gridApi;
    currentRowData['isFirstClick'] = true;
    currentRowData['filters'] = JSON.stringify(this.gridApi.getFilterModel());
    currentRowData['headerName'] = this.headerName;
    if (currentRowData.avoidSecondApiCall) {
      delete currentRowData.avoidSecondApiCall;
    }
    if (this.selectedOptions.length) {
      this._commonService.getRowData(currentRowData);
    }
    // this._commonService.getHeader(this.headerName);
  }

  /**Setting selected reviews
   * Author : karunakar
   * Date : 08-Jan-2020
  */
  setSelectedReviwerData(val) {
    var reviewText = '';
    val.map((v) => {
      var name = (v.listItemId && v.displayName) ? v.displayName : '';
      reviewText = reviewText + (reviewText ? "," : "") + name;
    });
    return reviewText;
  }

  getSelectedItem(e, values) {

  }

  getComponentPermissionIds() {
    this._agGridTableService.behaviorSubjectForAllPermisonIds$.subscribe(ids => {
      this.permissionIdsList = ids;
    })
  }

  public trackByLabel(_, item): string {
    return item.label;
  }

  public trackByDisplayName(_, item): string {
    return item.displayName;
  }

}
