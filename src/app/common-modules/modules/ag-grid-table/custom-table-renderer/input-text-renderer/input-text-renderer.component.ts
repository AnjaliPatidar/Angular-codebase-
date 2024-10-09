import { Component, OnInit } from '@angular/core';
import { AgGridTableService } from '../../ag-grid-table.service';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { SharedServicesService } from '@app/shared-services/shared-services.service';

@Component({
  selector: 'app-input-text-renderer',
  templateUrl: './input-text-renderer.component.html',
  styleUrls: ['./input-text-renderer.component.scss']
})
export class InputTextRendererComponent implements OnInit {

  public gridApi: any;
  public inputValue: any;
  public originalInputValue: any;
  public enableText: boolean = true;
  public enableTextInput: boolean = false;
  public currentRowData: any;
  public headerName: any;
  public rowIndex: any;
  public componentRef = this;
  public originalCurrentData: any;
  public permissionIdsList = [];
  public disable =  false;
  constructor(private _agGridService: AgGridTableService, private _commonService: CommonServicesService, private _sharedServicesService: SharedServicesService) {
  }

  ngOnInit() {
    this._agGridService.behaviorSubjectForAllPermisonIds$.subscribe(ids => {
      this.permissionIdsList = ids;
    })

  }
  get_pattern(element){
    return this._commonService.get_pattern(element);
  }
  get_pattern_error(type){
    return this._commonService.get_pattern_error(type); 
  }
  ngAfterViewInit() {
  }

  /** agInit() will call for every row of column */
  agInit(params: any, event): void {
    if (params) {
      if (params.data && params.data.enableInput) {
        this.enableTextInput = params.data.enableInput;
        this.enableText = false;
      }
      this.gridApi = params.api ? params.api : '';
      this.inputValue = params.value ? params.value : '';
      this.originalInputValue = params.value ? params.value : '';
      this.headerName = (params.colDef && params.colDef.headerName) ? params.colDef.headerName : '';
      this.disable  = (params.colDef && params.colDef.hasOwnProperty('disable')) ? params.colDef.disable : false;
      this.rowIndex = params.rowIndex ? params.rowIndex : '';
      this.currentRowData = params.data ? params.data : {};
      this.originalCurrentData = JSON.parse(JSON.stringify(this.currentRowData));
    }

  }

  saveInputValue(event, type) {
    setTimeout(() => {
      if (this.inputValue) {
        if (type === 'enterClick') {
          this.originalCurrentData['headerName'] = this.headerName;
          this.sendFinalRowDataToComponent(this.originalCurrentData);
        } else {
          this.currentRowData['headerName'] = this.headerName;
          this.sendFinalRowDataToComponent(this.currentRowData);
        }
        this._commonService.getHeader(this.headerName);
      }
    });
  }

  keyDownFunction(e) {
    if (this.inputValue) {
      if (e && e.keyCode == 13) {
        this.saveInputValue(e, 'enterClick');
      }
    }
  }

  sendFinalRowDataToComponent(rowData) {
    rowData[this.headerName] = this.inputValue;
    var currentRowData = rowData;
    if (currentRowData) {
      currentRowData['thatGridApi'] = this.gridApi;
      currentRowData['filters']  = JSON.stringify(this.gridApi.getFilterModel())
      currentRowData['isFirstClick'] = true;
    }
    if (currentRowData.avoidSecondApiCall) {
      delete currentRowData.avoidSecondApiCall;
    }
    if (currentRowData && currentRowData.Type) {
      if (currentRowData.Source) {
        this.enableText = true;
        this.enableTextInput = false;
        this._commonService.getRowData(currentRowData);
      }
      else {
        this._sharedServicesService.showFlashMessage('Source should not be empty', 'danger');
      }
    }
    else {
      this._sharedServicesService.showFlashMessage('Type should not be empty', 'danger');
    }
  }
  openEditInput(event) {
    setTimeout(() => {
      this.enableText = false;
      this.enableTextInput = true;
    });
    setTimeout(() => {
      document.getElementById("inputId").focus();
    }, 200);
  }

  cancleInputValue(event) {
    setTimeout(() => {
      this.enableText = true;
      this.enableTextInput = false;
      this.inputValue = this.originalInputValue;
    });
  }

}
