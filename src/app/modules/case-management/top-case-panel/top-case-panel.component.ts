import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PieChartModule } from '../../../shared/charts/reusablePie.js';
import { heatMapChartModule } from '../../../shared/charts/D3heatMap.js';
import { CaseManagementService } from '../case-management.service';
import { CaseSharedDataService } from '../../../shared-services/data/case-shared-data.service';
import { ListTypes } from '../../../common-modules/constants/listItems';
import { Subject } from 'rxjs';
import { ChartSelectionFilter } from '../models/case-list/case-filter-model.js';

declare var recallKpiDataCaseManagement;
@Component({
  selector: 'app-top-case-panel',
  templateUrl: './top-case-panel.component.html',
  styleUrls: [
    '../../alert-management/top-alert-panel/top-alert-panel.component.scss',
    './top-case-panel.component.scss',
  ],
})
export class TopCasePanelComponent implements OnInit, OnDestroy {
  @Input() onSelectionSubject: Subject<ChartSelectionFilter>;

  pieData: any = [];
  loader = {
    myOpencasesLoader: true,
    caseByTypeLoader: true,
    heatMapLoader: true,
  };
  NoDataFound = {
    myOpencasesDataNotFound: false,
    caseByTypeDataNotFound: false,
    heatMapDataNotFound: false,
  };
  casesByTypePieData: any = [];
  private heatMapData: any = [];
  private pieStaticColor: string[] = [
    'f28618',
    '42b7ff',
    'e6ae20',
    'ef5350',
    '00796b',
    '3f51b5',
    '4c7cff',
    '9c27b0',
  ];
  private pieStaticIcon: string[] = [
    'watch_later',
    'play_circle_filled',
    'pause_circle_filled',
    'warning',
    'report_off',
    'check_circle',
    'block',
    'cancel',
  ];
  private caseTypesFromListItem: any = [];
  private timer: any = null;
  private filteredStatusList:any[] = []
  private caseStatusList:any[] = []

  constructor(
    private caseManagementService: CaseManagementService,
    private caseSharedDataService: CaseSharedDataService
  ) { }

  ngOnInit(): void {
    this.caseTypesList();
    this.getAllStatusFromWorkFLow()
    this.timer = setInterval(() => {
      if (recallKpiDataCaseManagement) {
        this.caseTypesFromListItem = [];
        this.casesByTypePieData = [];
        this.pieData = [];
        this.heatMapData = [];
        this.getAllStatusFromWorkFLow()
        this.caseTypesList();
        recallKpiDataCaseManagement = false;
      }
    }, 500);
  }

  caseTypesList(): void {
    this.caseSharedDataService.getCaseListTypeOptions()
      .subscribe((response) => {
        if (response.length) {
          this.caseTypesFromListItem = response;
          this.manipulateGetCaseByTypeAPIResponse(ListTypes.caseType);
        }
      });
  }

  agingAPICall(): void {
    this.caseManagementService
      .getCaseStatistics('', '30,100')
      .subscribe((resp: any) => {
        if (resp && resp.length > 0) {
          this.loader.heatMapLoader = false;
          this.NoDataFound.heatMapDataNotFound = false;

          resp.map((result: any) => {
            result.list.map((val: any) => {
              const currentStatus = this.getCurrentStatusData(val.status)
              const obj: any = {
                country: result.label,
                product: currentStatus.text,
                value: val.count,
              };
              this.heatMapData.push(obj);
            });
          });
          if (this.heatMapData.length > 0) {
            this.heapMapPlot();
          } else {
            this.NoDataFound.heatMapDataNotFound = true;
          }
        } else {
          this.loader.heatMapLoader = false;
          this.NoDataFound.heatMapDataNotFound = true;
        }
      });
  }

  heapMapPlot(): void {
    const optionHeatmap: any = {
      container: '#heatMapChart',
      marginTop: 60,
      marginRight: 10,
      marginBottom: 2,
      marginLeft: 60,
      height: 120,
      itemSize: 30,
      data: this.heatMapData,
    };
    heatMapChartModule.heatMap(optionHeatmap);
    this.setHeatMapValue()
  }

  manipulateGetCaseByTypeAPIResponse(caseTypeReq: string): void {
    const caseTypes = caseTypeReq ? caseTypeReq : '';
    const caseStatusList:any[] = [];
    this.caseManagementService
      .getCaseStatistics(caseTypes, '')
      .subscribe((resp: any) => {
        if (caseTypes === ListTypes.caseType) {
          let obj: any;
          let colorPie: any = {};
          if (resp && resp.list.length > 0) {
            this.NoDataFound.caseByTypeDataNotFound = false;
            this.loader.caseByTypeLoader = false;
            resp.list.map((result: any) => {
              const status = result.type
                ? result.type.split(' ').join('_')
                : '';
              obj = {
                alertStatus: status,
                count: result.count,
                key: result.type,
                value: result.count,
                columnID: 'caseType',
              };
              this.caseTypesFromListItem.filter((val) => {
                if (val.displayName === obj.key) {
                  obj.statusObj = val;
                  colorPie[val.displayName] = '#' + val.colorCode;
                }
              });
              this.casesByTypePieData.push(obj);
            });

            this.casesByTypeFunction(
              this.casesByTypePieData,
              resp.totalCount,
              colorPie,
              'CaseByTypePie',
              'type'
            );
          } else {
            this.loader.caseByTypeLoader = false;
            this.NoDataFound.caseByTypeDataNotFound = true;
          }
        } else {
          let obj: any;
          let colorPie: any = {};

          if (resp && resp.list.length > 0) {
            this.loader.myOpencasesLoader = false;
            this.NoDataFound.myOpencasesDataNotFound = false;

            resp.list.map((result: any, i: any) => {
              const status: any = result.type
                ? result.type.split(' ').join('_')
                : '';
              const currentStatus = this.getCurrentStatusData(result.type)

              const statusCode = currentStatus && currentStatus && currentStatus.code ? currentStatus.code : "";
              const statusColorCode = currentStatus && currentStatus && currentStatus.colorCode ? currentStatus.colorCode : "ffffff";
              obj = {
                alertStatus: statusCode ? statusCode : status,
                count: result.count,
                key:  statusCode ? statusCode : result.type,
                value: result.count,
                columnID: 'status',
              };

              obj.statusObj = {
                colorCode: statusColorCode,
                displayName: currentStatus && currentStatus && currentStatus.text ? currentStatus.text : result.type,
                icon: currentStatus && currentStatus && currentStatus.icon ? currentStatus.icon : "ban",
              };

              colorPie[statusCode ? statusCode : result.type] = '#' + statusColorCode;
              this.pieData.push(obj);
            });
            this.casesByTypeFunction(
              this.pieData,
              resp.totalCount,
              colorPie,
              'openCasePie'
            );
          } else {
            this.loader.myOpencasesLoader = false;
            this.NoDataFound.myOpencasesDataNotFound = true;
          }
        }
      });
  }

  casesByTypeFunction(
    pieData: any,
    middleName: any,
    piecolor: any,
    id: string,
    columnName?: string
  ): void {
    const pieOptions = {
      container: '#' + id,
      data: pieData,
      height: 140,
      colorsObj: piecolor,
      islegends: false,
      legendwidth: 30,
      format: true,
      istxt: middleName,
      legendmargintop: 30,
      islegendleft: false,
      radiusDividedValue: 2.5,
      onItemClick: (d: any) => {
        if (this.onSelectionSubject && columnName) {
          this.onSelectionSubject.next({
            chartId: columnName,
            data: d && d.data && d.data.statusObj.listItemId
          });
        }
      },
    };
    PieChartModule.reusableplotPie(pieOptions);
  }

  getColor(color: string): string {
    return '#' + color;
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  setHeatMapValue(): void {
    const textList = document.getElementById('heatMapChart')
      && document.getElementById('heatMapChart').querySelectorAll('.chart-block-text')
    ? document.getElementById('heatMapChart').querySelectorAll('.chart-block-text')
    : [];

    if (textList) {
      textList.forEach(textNode => {
        if (textNode && textNode.innerHTML){
          const textLength: number = String(textNode.innerHTML).split('') && String(textNode.innerHTML).split('').length
            ? String(textNode.innerHTML).split('').length
            : 0;
          if (textLength && textLength > 3) {
            textNode.innerHTML = textNode.innerHTML.substring(0, 3) + '...';
          }
        }
      });
    }
  }

  public trackByKey(_, item): string {
    return item.key;
  }

  // @purpose : get all status from worflow and system settings than make a status array
  // @author: ammshathwan
  // @date: 18 may 2023
  getAllStatusFromWorkFLow():void {
    const caseStatusList:any[] = [];
    this.caseManagementService.getStructuredStatusList().subscribe((data:any) => {
      const workflowStatusList: any = data && data.workflowStatus.data ? data.workflowStatus.data : data.workflowStatus;
      this.caseStatusList = data && data.caseStatus && data.caseStatus.data ? data.caseStatus.data :  data.caseStatus;
      workflowStatusList.map(status => {
          const foundStatus = this.caseStatusList.filter(workFlowStatus => this.caseManagementService.getLowerCaseText(workFlowStatus.code) == this.caseManagementService.getLowerCaseText(status.id));
          if(foundStatus){
            caseStatusList.push({
              value: status && status.id ? status.id : foundStatus[0].code,
              text: status && status.name ? status.name : foundStatus[0].displayName,
              icon: foundStatus && foundStatus.length && foundStatus[0].icon ? foundStatus[0].icon : "ban",
              colorCode: foundStatus && foundStatus.length && foundStatus[0].colorCode ? foundStatus[0].colorCode : "ffffff"
              })
          }
        })
        this.filteredStatusList = caseStatusList;
        this.agingAPICall();
        this.manipulateGetCaseByTypeAPIResponse("");
      })
  }

  // @purpose : get the current status object from filtered array
  // @params: status code | type of string
  // @author: ammshathwan
  // @date: 18 may 2023
  getCurrentStatusData(statusValue:string):any {
    let currentStatus:any
    currentStatus = this.filteredStatusList.find((status:any) => {
      return statusValue && status && status.value && this.caseManagementService.getLowerCaseText(status.value) == this.caseManagementService.getLowerCaseText(statusValue)
    })

    if(!currentStatus){
      const currentCaseStatus = this.caseStatusList.find((status:any) => {
        return statusValue && status && status.code && this.caseManagementService.getLowerCaseText(status.code) == this.caseManagementService.getLowerCaseText(statusValue)
      })

      currentStatus = {
        value: currentCaseStatus && currentCaseStatus.code ? currentCaseStatus.code : statusValue,
        text: currentCaseStatus && currentCaseStatus.displayName ? currentCaseStatus.displayName : statusValue,
        icon: currentCaseStatus && currentCaseStatus.icon ? currentCaseStatus.icon : "ban",
        colorCode: currentCaseStatus && currentCaseStatus.colorCode ? currentCaseStatus.colorCode : "ffffff"
  }
    }
    return currentStatus
  }
}
