import { Component, OnInit } from '@angular/core';
import { AgGridTableService } from '../../ag-grid-table.service';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
@Component({
  selector: 'app-color-picker-renderer-component',
  templateUrl: './color-picker-renderer-component.component.html',
  styleUrls: ['./color-picker-renderer-component.component.scss']
})
export class ColorPickerRendererComponentComponent implements OnInit {

  /**====================== Public variables Start=======================*/
  public rendererObject: any = {}
  public gridOptions: any = {};
  public colId: string = '';
  public colorValue: string = '';
  public popTitleForColorList: any;
  public currentRowData: any;
  public gridApi: any;
  public headerName: any;
  public permissionIdsList: Array<any> = [];
  /**====================== Public variables End=======================*/

  /**====================== Private variables Start=======================*/
  /**====================== Private variables End=======================*/
  constructor(private _agGridTableService: AgGridTableService, private _commonService: CommonServicesService) { }

  ngOnInit() {
    this.getComponentPermissionIds();
  }

  /**agInit() will call for every row of column */
  agInit(params: any, event): void {
    if (params && params.api && params.api.gridOptionsWrapper && params.api.gridOptionsWrapper.gridOptions) {
      this.gridApi = params.api ? params.api : {};
      this.headerName = (params.colDef && params.colDef.headerName) ? params.colDef.headerName : '';
      this.gridOptions = params.api.gridOptionsWrapper.gridOptions;
      this.colId = (params.colDef && params.colDef.colId) ? params.colDef.colId : '';
      this.colorValue = params.value ? params.value : '';
      this.currentRowData = params.data ? params.data : {};
      this.rendererObject = {
        gridOpions: this.gridOptions,
        colorListFromComponent: (this.gridOptions.colorList && this.gridOptions.colorList.length) ? this.gridOptions.colorList : [],
        colId: this.colId,
        codeForColor: this.getColorCode(this.gridOptions.colorList, this.colorValue)
      }
    }
  };

  changeColor(e, color) {
    this.rendererObject.codeForColor = color ? color : '';
    var colorText = this.getColortext(this.gridOptions.colorList, color);
    this._agGridTableService.getColorFromColoComponent(colorText);
    if (colorText) {
      this.currentRowData[this.headerName] = colorText;
      var currentRowData = this.currentRowData;
      if (currentRowData) {
        currentRowData['thatGridApi'] = this.gridApi;
        currentRowData['filters']  = JSON.stringify(this.gridApi.getFilterModel())
        currentRowData['headerName']  = this.headerName
      }
      if (currentRowData.avoidSecondApiCall) {
        delete currentRowData.avoidSecondApiCall;
      }
      if (currentRowData && currentRowData.Type) {
        if (currentRowData.Source) {
          this._commonService.getRowData(currentRowData);
        }
      }
      // this._commonService.getHeader(this.headerName);
    }
  }

  getColorCode(colorlist, colorValue) {
    if (colorlist) {
      var colObj = colorlist.find(val => { if (val.color.toLowerCase() == colorValue.toLowerCase()) { return val; } });
      return (colObj && colObj.colorCode) ? colObj.colorCode : 'f28618';
    }
  }

  getColortext(colorlist, colorValue) {
    if (colorlist) {
      var colObj = colorlist.find(val => { if (val.colorCode.toLowerCase() == colorValue.toLowerCase()) { return val; } });
      return (colObj && colObj.color) ? colObj.color : 'Orange';
    }
  }

  getComponentPermissionIds() {
    this._agGridTableService.behaviorSubjectForAllPermisonIds$.subscribe(ids => {
      this.permissionIdsList = ids;
    })
  }

  public trackByColorCode(_, item):string {
    return item.colorCode;
  }
}
