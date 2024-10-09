import { Component, OnInit ,AfterViewInit} from '@angular/core';
import {LineChartGradientModule} from '../../../../../shared/charts/gradientLineChart.js';
import { SystemMonitoringService } from '../../../../../modules/system-monitoring/system-monitoring.service.js';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { AgGridTableService } from '../../ag-grid-table.service.js';
import { AlertManagementService } from '@app/modules/alert-management/alert-management.service.js';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';

@Component({
  selector: 'app-icons-renderer',
  templateUrl: './icons-renderer.component.html',
  styleUrls: ['./icons-renderer.component.scss']
})

export class IconsRendererComponent implements OnInit, AfterViewInit {
  public tableName: any;
  public templateClass: any;
  public componentPopoverValues: any;
  public value: any;
  public tableDataParams: any;
  public rowData: any = [];
  public rowIndex: any;
  public gridApi: any;
  public currentRow: any;
  public lineChartLoader: boolean = false;
  public headerName:any;
  public scrollbarOptions = { axis: 'x', theme: 'minimal-dark' };
  public permissionIdsList:Array<any> = [];

  lineGradientPlot(data) {
    if (data) {
      var gradientLineOption = {
        container: "errorLineChart",
        marginTop: 7,
        marginRight: 20,
        marginBottom: 38,
        marginLeft: 20,
        height: 250,
        itemSize: 30,
        data: $.extend(true, [], data),
        circleRadius: 4,
        // width:200
      };
      if (document.getElementById("errorLineChart")) {
        LineChartGradientModule.gradientLineChart(gradientLineOption);
      }
    }
  }

  constructor(    private _alertService: AlertManagementService,private _sourceMonitoringService: SystemMonitoringService,private _agGridTableService:AgGridTableService, private mScrollbarService: MalihuScrollbarService) { }
  agInit(params: any, event): void {
    if (params) {
      this.gridApi = params.api ? params.api : '';
      this.tableName = (params.api && params.api.gridOptionsWrapper && params.api.gridOptionsWrapper.gridOptions && params.api.gridOptionsWrapper.gridOptions.tableName) ? params.api.gridOptionsWrapper.gridOptions.tableName : '';
      this.rowData = (params.api && params.api.gridOptionsWrapper && params.api.gridOptionsWrapper.gridOptions && params.api.gridOptionsWrapper.gridOptions.rowData && params.api.gridOptionsWrapper.gridOptions.rowData.length) ? params.api.gridOptionsWrapper.gridOptions.rowData : [];
      this.rowIndex = params.rowIndex ? params.rowIndex : '';
      this.templateClass = (params.colDef && params.colDef.customTemplateClass) ? params.colDef.customTemplateClass : '';
      this.value = params.value ? params.value : '';
      this.tableDataParams = params ? params : '';
      this.headerName = (params.colDef && params.colDef.headerName) ? params.colDef.headerName : '';
    }
  }
  ngOnInit() {
    this.getComponentPermissionIds();
  }
  ngAfterViewInit() {

  }
  /**More detailed popover
   * Written by : karnakar
   * Date : 03-Dec-2019
  */
  showPopover(e) {
    this.lineChartLoader = true;
    var currentRowData = this.getCurrentTableRowData();
    this.currentRow = currentRowData[this.rowIndex] ? JSON.parse(JSON.stringify(currentRowData[this.rowIndex])) : {};
    if (this.currentRow['urlForPopover']) {
      this.currentRow['urlText'] = this.currentRow['urlForPopover'].split("//")[1];
    }
    if (this.currentRow['Status']) {
      this.currentRow['Status'] = this.currentRow['Status'] == 'success' ? 'success' : this.currentRow['Status'] == 'error' ? '500 Internal server error' : '';
    }

    var lineChartData = [];
    setTimeout(() => {
      this._sourceMonitoringService.getSparklineDataBySourceAndDatelimit(this.tableDataParams.data.sourceId, 10).subscribe((resp) => {
        resp.map((val) => {
          lineChartData.push({ "date": val.executionDatetime, "y": val.executionDuration, "iserr": val.resultStatus == "success" ? false : true })
        });
        this.lineGradientPlot(lineChartData);
        this.lineChartLoader = false;
      })

    },0)
  }
  outputDataFromSourceMonotoring(value) {
    this.lineChartLoader = true;
    var datalimit = value.label == "Yesterday" ? 1 : value.label == "Last 7 Days" ? 7 : value.label == "Last 30 Days" ? 30 : 10
    var lineChartData = [];
    setTimeout(()=>{
      this._sourceMonitoringService.getSparklineDataBySourceAndDatelimit(this.tableDataParams.data.sourceId, datalimit).subscribe((resp) => {
        resp.map((val) => {
          lineChartData.push({ "date": val.executionDatetime, "y": val.executionDuration, "iserr": val.resultStatus == "success" ? false : true })
        })
        this.lineGradientPlot(lineChartData);
        this.lineChartLoader = false;
      })
    },0)
  }
  /**Getting complete table current row data
   * Written by : karnakar
   * Date : 03-Dec-2019
  */
  getCurrentTableRowData() {
    var currentRowData = [];
    //Getting rows count from current table
    var count = this.gridApi.getDisplayedRowCount();
    for (var i = 0; i < count; i++) {
      //Getting rowNodes and its data from current table
      var rowNode = this.gridApi.getDisplayedRowAtIndex(i);
      currentRowData.push(rowNode.data);
    }
    return currentRowData;

  }
  getComponentPermissionIds(){
    // this._alertService.getPermissionIdsSourceMoniting().pipe(map((res)=> {
      // return res['sourceManagement']})).subscribe((data:any)=>{
      this.permissionIdsList = GlobalConstants.permissionJson[0]['sourceManagement'];
    // });
  }

  public trackByLabel(_, item): string {
    return item.label;
  }
}
