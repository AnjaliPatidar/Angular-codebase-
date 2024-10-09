import { Component, OnInit, Input } from '@angular/core';
import { AgGridTableService } from '../../ag-grid-table.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';

var finalSelectedValues = [];
// var finalSelectedValues:any = [];
@Component({
  selector: 'app-multi-select-renderer-component',
  templateUrl: './multi-select-renderer-component.component.html',
  styleUrls: ['./multi-select-renderer-component.component.scss']
})
export class MultiSelectRendererComponentComponent implements OnInit {
  @Input() disableOptionCentering: boolean;
  @Input() searching = true;
  @Input() clearSearchInput = true;
  @Input() placeholderLabel = (GlobalConstants.languageJson && GlobalConstants.languageJson['Search']) ? GlobalConstants.languageJson['Search'] : 'Search';

  /**====================== Public variables Start=======================*/
  public rendererObject: any = {}
  public gridOptions: any = {};
  public colId: string = '';
  public selectedOptions: any = [];
  public gridApi: any;
  public firstTimeFlag: boolean = false;
  public currentRowData: any;
  public headerName: any;
  public firstColoumnColId: any;
  public rowData: any = [];
  public permissionIdsList: Array<any> = [];
  public disable  =  false;
  /**====================== Public variables End=======================*/

  /**====================== Private variables Start=======================*/
  /**====================== Private variables End=======================*/
  constructor(private _agGridTableService: AgGridTableService,
    private _commonService: CommonServicesService) { }

  ngOnInit() {
    this.getComponentPermissionIds();
  }

  /**agInit() will call for every row of column */
  agInit(params: any, $event): void {
    this.gridApi = params.api;
    this.selectedOptions = params.value ? params.value.split(',') : '';
    this.currentRowData = params.data ? params.data : {};
    this.headerName = (params.colDef && params.colDef.headerName) ? params.colDef.headerName : '';
    this.disable = (params.colDef && params.colDef.hasOwnProperty('disable')) ? params.colDef.disable : false;
    if (params && params.api && params.api.gridOptionsWrapper && params.api.gridOptionsWrapper.gridOptions) {
      this.gridOptions = params.api.gridOptionsWrapper.gridOptions;
      this.rowData = (this.gridOptions && this.gridOptions.rowData && this.gridOptions.rowData.length) ? this.gridOptions.rowData : [];
      this.colId = (params.colDef && params.colDef.colId) ? params.colDef.colId : '';

      this.rendererObject = {
        gridOpions: this.gridOptions,
        colId: this.colId,
        rowIndex: params.rowIndex ? params.rowIndex : '',
        multiSelectOptions: (this.rowData[params.rowIndex] && this.rowData[params.rowIndex].multiSelectBoxOptions) ? this.rowData[params.rowIndex].multiSelectBoxOptions : [],
        actualSelectOptions: (this.rowData[params.rowIndex] && this.rowData[params.rowIndex].multiSelectBoxOptions) ? JSON.parse(JSON.stringify(this.rowData[params.rowIndex].multiSelectBoxOptions)) : [],
      }

      this.firstColoumnColId = (this.rendererObject.gridOpions && this.rendererObject.gridOpions.columnDefs[0] && this.rendererObject.gridOpions.columnDefs[0].colId) ? this.rendererObject.gridOpions.columnDefs[0].colId : '';
      this.settingOptionsWhenNothingChange();
    }
  };

  /**============================================================================================================
    =================================ng-multiselect-dropdown functions start=====================================
    =============================================================================================================*/

  drop(event: CdkDragDrop<string[]>) {

    var obj = this.rendererObject.multiSelectOptions[event.previousIndex];
    moveItemInArray(this.rendererObject.multiSelectOptions, event.previousIndex, event.currentIndex);
    var index = this.selectedOptions.findIndex(item => item == obj.label);
    if (index !== -1) {
      moveItemInArray(this.selectedOptions, event.previousIndex, event.currentIndex);
      var arr = this.rendererObject.multiSelectOptions.filter(v => this.selectedOptions.some((value) => v.label.toLowerCase() === value.toLowerCase()));
      var dragedValues = [];
      arr.map((value) => {
        dragedValues.push(value.label);
      });
      this.selectedOptions = dragedValues;
      var selectedValues = dragedValues.length ? dragedValues.join() : '';
      this.sendingFinalSelectedValuesToComponent(selectedValues);
    }

    //this._agGridTableService.getMultiSelectOptionsFromComponent(finalSelectedValues);
  }

  /**Filter the options
   * Author : karnakar
   * Date : 27-Aug-2019
  */

  filterMyOptions(e) {
    if (e) {
      this.rendererObject.multiSelectOptions = this.rendererObject.actualSelectOptions.filter(val => { if (val.label) { return val.label.toLowerCase().indexOf(e.toLowerCase()) != -1 } });
    }
    else {
      this.rendererObject.multiSelectOptions = this.rendererObject.actualSelectOptions;
    }
  }

  /**Get selected options
   * Author : karnakar
   * Date : 27-Aug-2019
  */
  getSelectedOptions(e) {
    this.firstTimeFlag = true;
    finalSelectedValues = [];
    if (e && e.value) {
      var selectedArr = e.value;
      selectedArr.map((val, key) => {
        if (val) {
          finalSelectedValues.push({
            'value': val,
            'rank': key + 1
          })
        }
      });
      //this._agGridTableService.getMultiSelectOptionsFromComponent(finalSelectedValues);
      var selectedValues = this.selectedOptions.length ? this.selectedOptions.join() : '';
      this.sendingFinalSelectedValuesToComponent(selectedValues);
      this._commonService.getHeader(this.headerName);
    }
  }

  /**Seeting options before change
   * Author : karnakar
   * Date : 27-Aug-2019
  */

  settingOptionsWhenNothingChange() {
    finalSelectedValues = [];

    var reversArr = this.selectedOptions.length ? JSON.parse(JSON.stringify(this.selectedOptions)) : [];
    reversArr.reverse().map((val) => {
      var tempObj = {};
      if (val) {
        this.rendererObject.multiSelectOptions.map((v, k) => {
          if (v && v.label && v.label == val) {
            tempObj = this.rendererObject.multiSelectOptions.splice(k, 1);
            this.rendererObject.multiSelectOptions.unshift(tempObj[0]);
          }
        });
      }
    });

    if (!this.firstTimeFlag && this.selectedOptions.length) {
      this.selectedOptions.map((val, key) => {
        if (val) {
          finalSelectedValues.push({
            'value': val,
            'rank': key + 1
          })
        }
      });
      this._agGridTableService.getMultiSelectOptionsFromComponent(this.selectedOptions);
    }
  }

  /**Sending final selected values to component
   * Author : karnakar
   * Date : 19-Nov-2019
  */

  sendingFinalSelectedValuesToComponent(values) {
    if(this.headerName == 'Gruppenebenen' || this.headerName == 'Group Levels'){
      this.currentRowData['Group Levels'] = values;
    } else {
      this.currentRowData[this.headerName] = values;
    }
    var currentRowData = this.currentRowData;
    if (currentRowData) {
      currentRowData['thatGridApi'] = this.gridApi;
      currentRowData['filters'] = JSON.stringify(this.gridApi.getFilterModel());
      currentRowData['headerName']  = this.headerName;
    }
    if (currentRowData.avoidSecondApiCall) {
      delete currentRowData.avoidSecondApiCall;
    }
    this._commonService.getRowData(currentRowData);
  }


  getComponentPermissionIds() {
    this._agGridTableService.behaviorSubjectForAllPermisonIds$.subscribe(ids => {
      this.permissionIdsList = ids;
    })
  }

  public trackByLabel(_, item): string {
    return item.label;
  }
  /**============================================================================================================
    =================================ng-multiselect-dropdown functions end=======================================
    =============================================================================================================*/
}
