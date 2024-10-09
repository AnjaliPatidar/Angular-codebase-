import { Component, OnInit, Input } from '@angular/core';
import { LineChartModule } from '../../../shared/charts/lineChart.js';
import { PieChartModule } from '../../../shared/charts/reusablePie.js';
import {heatMapChartModule} from '../../../shared/charts/D3heatMap.js';
import { GroupedColumChartModule } from '../../../shared/newCharts/groupedColumChart.js';

import { AlertManagementService } from '../alert-management.service.js';
import { SharedServicesService } from '../../../shared-services/shared-services.service';
import { iif, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
declare  var recallKpiData
@Component({
  selector: 'app-top-alert-panel',
  templateUrl: './top-alert-panel.component.html',
  styleUrls: ['./top-alert-panel.component.scss']
})
export class TopAlertPanelComponent implements OnInit {
  constructor(private _alertService: AlertManagementService,private _sharedService: SharedServicesService, private translateService: TranslateService) { }
  @Input() fromComponent:string;
  @Input() status: any;
  public totalPastAlertCount:any ={};
  public totalMyAlertCount:any;
  public pieData:any = [];
  public indicators:any;
  public lineData:any = [{
    "key": "alertAggregator",
    "values": []
  }];
  public showHideDataNotFound = {
    myAlertPie:false,
    groupBarChart:false,
    lineChartAlerts:false,

  }
  public transactionAggregator:any=[];
  public heatMapData:any=[];
  public NoDataFound={heatMapDataNotFound:false}
  public loader={heatMapLoader:true}

  pieFunction(pieData: any[], middleName,piecolor){
    var pieOptions = {
      container: "#myAlertPie",
      data: pieData,
      height: 140,
      colorsObj:piecolor,
      islegends: false,
      legendwidth: 30,
      format: true,
      istxt: middleName,
      istxtLabel: this.translateService.instant('Total'),
      legendmargintop: 30,
      islegendleft :false,
      radiusDividedValue:2.5
    };
    PieChartModule.reusableplotPie(pieOptions);
  }
  groupedFunction(transactionAggregator, barColor){
    var transbarData = this.handleData(transactionAggregator, "model", "", "bar");
    var baropt = {
      container: "#groupBarChart",
      data: transbarData,
      height: 140,
      width:1000,
      islegends: false,
      isHeaer: false,
      showlineaxisY: false,
      showlineaxisX: false,
      xtext: ' ',
      ytext: ' ',
      showgroupedstacked: false,
      colors: barColor,
      showxYTxt: false,
      rightSideYaxis:true,
      roundedBar:"allSideRounded",
      appendTextOnBar:true,
      gridY: true,
      gridYRightside:true
  };
    GroupedColumChartModule.groupedColumChart(baropt);
  }
  linefunction(lineData){
    var LineOptions = {
      container: "#lineChartAlerts",
      width: 200,
      height: 110,
      data: lineData,
      axisX: false,
      axisY: false,
      gridy: false,
      tickformat: "year",
      marginRight: 30,
      marginLeft: 40,
      gridcolor: "#2e424b",
      actualData: lineData[0].values,
      ystartsFromZero: true,
      labelRotate: '-65',
      colorsObj: ['#f28618','#e6ae20', '#2e7d32'],
      noXyAxis: false
    };
    LineChartModule.InitializeandPlotLine(LineOptions);
  }

handleData(data, x, y, type) {
  var str = JSON.stringify(data);
  str = str.replace(/model/g, 'x');
  var object = JSON.parse(str);
  return object;
}

  ngOnInit() {
    iif(() => !!this.translateService.currentLang, of(this.translateService.currentLang), this.translateService.onLangChange).subscribe(() => {
      setInterval(()=>{
        if(recallKpiData){
          this.lineData = [{
            "key": "alertAggregator",
            "values": []
          }]
          this.pieData =[];
          this.transactionAggregator=[];
          this.heatMapData=[];

          this.CallKPIRelatedAPI();
          recallKpiData = false;
        }
      },500);
      this.CallKPIRelatedAPI();
    });
  }

  heapMapPlot(icons){
    var optionHeatmap = {
      container: "#heatMapChart",
      marginTop: 20,
      marginRight: 10,
      marginBottom: 2,
      marginLeft: 75,
      height: 140,
      width: 550,
      itemSize: 30,
      rotate_XAxisText: true,
      rotate_XAxisTextValue: 'rotate(-30)',
      data:this.heatMapData,
      icons: icons,
      chartName: "agingChart"
    };
    heatMapChartModule.heatMap(optionHeatmap,this._sharedService);
  }
  getColor(color) {
   return '#'+color
  }
  CallKPIRelatedAPI(){
    // TODO: translate widget graph
    this._alertService.getPastDueAlerts().subscribe(resp=>{

      this.totalPastAlertCount.count=resp.latestPastDueCount;
      this.totalPastAlertCount.percentageThanLastWeek=resp.percentageThanLastWeek;
      resp.monthCountList.map(result=>{
       var obj ={
        "time": result.year+"-"+result.month,
        "value": result.count
      }
      this.lineData[0].values.push(obj)
      });
      if(this.lineData.length == 0){
        this.showHideDataNotFound.lineChartAlerts = true;
      }
      this.linefunction(this.lineData)
    })
    {
      this._alertService.getListItemsByListType("Alert Risk").then(indicators => {
        this.indicators = indicators
        this.indicators = this.indicators && this.indicators.length > 0 ? this.indicators : [];
        this.loader.heatMapLoader = false;
        // this.drawAlertAgeingChart();
      }).catch(error => {
        this.loader.heatMapLoader = false;
        this.NoDataFound.heatMapDataNotFound = true;
      })

      this._alertService.getMyAlerts().subscribe(resp => {
        var obj, colorPie = {};
       if(resp && resp.length && resp["0"].statusCountList){
        resp["0"].statusCountList.map(result => {
          var status = result.status ? result.status.split(" ").join("_") : "";
          obj = { alertStatus: status, count: result.count, key: result.status, value: result.count, 'statusObj': {} }
          this.status.filter((val) => {
            if (val.displayName == obj.key) {
              obj.statusObj = val;
              colorPie[val.displayName] = '#' + val.colorCode;
            }
          })
          this.pieData.push(obj);
        })

        this.pieFunction(this.pieData, resp[0].totalCount ? resp[0].totalCount : 0, colorPie);
       }

        if (this.pieData.length == 0) {
          this.showHideDataNotFound.myAlertPie = true;
        }
      })
      this._alertService.getAssociatedAlerts().subscribe(resp => {

        var obj = {}, colorBar = {};
        resp.map(grp => {
          obj = { "model": grp.groupName };
          grp.statusCountList.map(result => {
            obj[result.status] = result.count;
            this.status.filter((val) => {
              if (val.displayName == result.status) {
                colorBar[val.displayName] = '#' + val.colorCode;
              }
            })
          })
          this.transactionAggregator.push(obj);
        })
        var keys = []; this.transactionAggregator.map(function (d) { keys = keys.concat(Object.keys(d).filter(function (d) { return d != 'model' })) })
        this.transactionAggregator.map(function (d) {
          keys.forEach(function (k) {
            if (!d[k]) { d[k] = 0 }
          })
        });
        this.groupedFunction(this.transactionAggregator, colorBar);
        if (this.transactionAggregator.length == 0) {
          this.showHideDataNotFound.groupBarChart = true;
        }
      })
    }
  }
  /*
  * @purpose: Fetch API response for Alert Indicators (Aging Overview)
  * @created: December 15 2020
  * @author: Upeksha
  * params : none
  * return : none
*/
  drawAlertAgeingChart() {
    this._alertService.getAlertAgeingSummary().subscribe((resp: any) => {
      var steadyChartDetails = []
      var icons = []
      if (this.status && this.status.length > 0) {
        this.indicators.push({displayName: 'Other'})
        this.status.map(status => {
          this.indicators.map(indicator => {
            var existingDetails = resp.filter(element => element.status === status.listItemId && element.indicator === indicator.displayName)
            if (existingDetails.length > 0) {
              existingDetails[0].status = status.displayName
              existingDetails[0].statusCode = status.listItemId
              existingDetails[0].icon = status.icon
              steadyChartDetails.push(existingDetails[0])
            } else {
              steadyChartDetails.push({
                status: status.displayName, indicator: indicator.displayName, count: 0, icon: status.icon,statusCode: status.listItemId
              })
            }
          })
          icons.push({ icon: status.icon, color: `#${status.colorCode}` })
        })
        if (resp && resp.length > 0) {
          this.loader.heatMapLoader = false
          this.NoDataFound.heatMapDataNotFound = false;
          steadyChartDetails.map((data, i) => {
            var obj = {
              "country": data.indicator,
              "product": data.status,
              "value": data.count,
              "statusCode": data.statusCode
            }
            this.heatMapData.push(obj);
          })
          if (this.heatMapData.length > 0) {
            this.heapMapPlot(icons);
          } else {
            this.NoDataFound.heatMapDataNotFound = true;
          }

        } else {
          this.loader.heatMapLoader = false;
          this.NoDataFound.heatMapDataNotFound = true;
        }
      }else{
        this.loader.heatMapLoader = false;
        this.NoDataFound.heatMapDataNotFound = true;
      }
    },(error)=>{
      this.loader.heatMapLoader = false;
      this.NoDataFound.heatMapDataNotFound = true;
    })

  }

  public trackByKey(_, item): string {
    return item.key;
  }

}
