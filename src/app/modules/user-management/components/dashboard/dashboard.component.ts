import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GroupedColumChartModule } from '../../../../shared/newCharts/groupedColumChart.js';
import { AreaLineChartModule } from '../../../../shared/charts/chartsNew/areaLineChart.js';
import { verticalBarGraphModule } from '../../../../shared/charts/chartsNew/verticalBarChart.js';
import { PieChartModule } from '../../../../shared/charts/chartsNew/reusablePie.js'
import { MatDialog } from '@angular/material/dialog';

/*constants*/
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
/*constants*/

/*components */
import { UserCreateComponent } from '../manage/users/modals/user-create/user-create.component';
import { ObserverService } from '../../services/observer.service.js';
import { DashboardService } from '../../services/dashboard.service.js';
import { LogonFailuresComponent } from './logon-failures/logon-failures.component'
/*components */

/*Services*/
import { UserService } from '../../services/user.service.js';
import * as d3 from 'd3';
import { Router } from '@angular/router';
/*services*/

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit ,AfterViewChecked{
  public userChartPeriod = "12";
  public logonUsersDays = "1";
  public LogonFailuresPeriod = "1";
  public topLogonFailuresPeriod = "7";

  public systemSettings: any = [];
  public kpiDataval: any = {};
  public userStatus;

  // public keys = {
  //   maxFileSize : "Maximum file size allowed",
  // }
  constructor(
    public dialog: MatDialog,
    public observerService: ObserverService,
    public dashboardService: DashboardService,
    public userService: UserService,
    public router: Router,
    public _cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.systemSettings = GlobalConstants.systemSettings;
    this.kpiData();
    this.usersChartIntialize(this.userChartPeriod);
    this.logOnUsersByHourChartIntialize();
    this.logOnFailuresChartIntialize();
    this.TopUserLogOnFailuresChartIntialize();
    this.groupsChartIntialize();
    this.rolesChartIntialize();

    // this.getSystemSettings();
  }
  ngAfterViewChecked(){
    this._cdr.detectChanges();
  }

  kpiData() {
    this.dashboardService.mainKpiData().then((res: any) => {
      if (res) {
        this.kpiDataval = res;
      }
    }).catch((error) => {
      throw error
    })
  }
  usersChartIntialize(noOfMonths) {
    let months: Array<string> = [];

    let transbarData: Array<any> = [];
    var theMonths = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    var now = new Date();

    for (var i = 0; i < noOfMonths; i++) {
      var future = new Date(now.getFullYear(), now.getMonth() - i, 1);
      var month = theMonths[future.getMonth()];
      var year = future.getFullYear();
      months.push(month + " " + year);
    }
    this.dashboardService.userChartData().then((res: any) => {
      let userStat: Array<any> = [];
      res.data.forEach((ele: any) => {
        if (ele && ele.status) {
          userStat.push(ele);
        }
      });

      let  selectedMonths=months;
      this.userStatus = d3.nest().key((d: any) => { return new Date(d.date).toLocaleString('default', { month: 'short', year: 'numeric' }) }).entries(userStat)
      this.userStatus.sort(
        (a, b) => {
          let dateA:any = new Date(a.key), dateB:any = new Date(b.key);
          return dateB - dateA
        }
      );
      // this.userStatus.forEach((ele: any) => {
      //   let statusdata = {}
      //   if (months.includes(ele.key)) {

      //     statusdata["month"] = ele.key
      //     ele.values.forEach((val: any) => {
      //       if (val && val.status && val.status == "Active") {
      //         statusdata["activeCount"] = (val && val.count) ? val.count : 0;
      //       } else if (val && val.status && val.status == "Blocked") {
      //         statusdata["blockedCount"] = (val && val.count) ? val.count : 0;
      //       } else if (val && val.status && val.status == "Deactivated") {
      //         statusdata["deactivatedCount"] = (val && val.count) ? val.count : 0;
      //       } else if (val && val.status && val.status == "Pending") {
      //         statusdata["pendingCount"] = (val && val.count) ? val.count : 0;
      //       } else if (val && val.status && val.status == "Suspended") {
      //         statusdata["suspendedCount"] = (val && val.count) ? val.count : 0;
      //       }
      //     })
      //     transbarData.push(
      //       {
      //         "x": statusdata["month"],
      //         "pending": statusdata["pendingCount"] ? statusdata["pendingCount"] : 0,
      //         "active": statusdata["activeCount"] ? statusdata["activeCount"] : 0,
      //         "suspended": statusdata["suspendedCount"] ? statusdata["suspendedCount"] : 0,
      //         "blocked": statusdata["blockedCount"] ? statusdata["blockedCount"] : 0,
      //         "deactivated": statusdata["deactivatedCount"] ? statusdata["deactivatedCount"] : 0
      //       }
      //     )
      //   }
      // });
      selectedMonths.forEach((ele: any) => {
        let statusdata = {}
        let matchedMonths =this.userStatus.filter((item)=>item.key == ele);
        if (matchedMonths.length>0) {
          statusdata["month"] = matchedMonths[0].key;
          matchedMonths[0].values.forEach((val: any) => {
            if (val && val.status && val.status == "Active") {
              statusdata["activeCount"] = (val && val.count) ? val.count : 0;
            } else if (val && val.status && val.status == "Blocked") {
              statusdata["blockedCount"] = (val && val.count) ? val.count : 0;
            } else if (val && val.status && val.status == "Deactivated") {
              statusdata["deactivatedCount"] = (val && val.count) ? val.count : 0;
            } else if (val && val.status && val.status == "Pending") {
              statusdata["pendingCount"] = (val && val.count) ? val.count : 0;
            } else if (val && val.status && val.status == "Suspended") {
              statusdata["suspendedCount"] = (val && val.count) ? val.count : 0;
            }
          })

          transbarData.push(
            {
              "x": statusdata["month"],
              "pending": statusdata["pendingCount"] ? statusdata["pendingCount"] : 0,
              "active": statusdata["activeCount"] ? statusdata["activeCount"] : 0,
              "suspended": statusdata["suspendedCount"] ? statusdata["suspendedCount"] : 0,
              "blocked": statusdata["blockedCount"] ? statusdata["blockedCount"] : 0,
              "deactivated": statusdata["deactivatedCount"] ? statusdata["deactivatedCount"] : 0
            }
          )

        }
        else {
          transbarData.push(
            {
              "x": ele,
              "pending": 0,
              "active": 0,
              "suspended": 0,
              "blocked": 0,
              "deactivated": 0
            }
          )
        }
      });

      let barColor = { pending: "#00796b", active: "#3eb5fe", suspended: "#e6ae20", blocked: "#ef5350", deactivated: "#9e9e9e" }
      var baropt = {
        container: "#groupBarChart",
        data: transbarData,

        height: 340,
        islegends: false,
        isHeaer: false,
        showlineaxisY: false,
        showlineaxisX: false,
        xtext: ' ',
        ytext:  this.getLanguageKey('Number of users'),
        showgroupedstacked: false,
        colors: barColor,
        showxYTxt: false,
        rightSideYaxis: false,
        xAxisType: "number",
        // xLabelRotation: "rotate(0)",
        roundedBar: "allSideRounded",
        appendTextOnBar: false,
        gridY: true,
        gridYRightside: true
      };
      GroupedColumChartModule.groupedColumChart(baropt);
    }).catch((error) => {
      throw error
    })
  }
  userChartPeriodChange() {
    this.usersChartIntialize(this.userChartPeriod)
  }

  logOnUsersByHourChartIntialize(noOfDays: any = 1) {
    let xAxisType = "number";
    let xAxiesNoOfTicks: any = 24;
    let formatDate = (dateObj) => {
      if(dateObj instanceof Date){
        let year = dateObj.getFullYear();
        let month = dateObj.getMonth() + 1;
        let date = dateObj.getDate();
        return `${year}-${month}-${date}`;
      }
      else{
        return null;
      }
    }
    let data: Array<any> = [];
    let domain: Array<any> = [];
    let params = {};
    if (noOfDays == 7 || noOfDays == 14) {
      let endDate = new Date();
      params['period'] = "Day";
      params['from'] = formatDate(new Date(endDate.getTime() - (noOfDays * 24 * 60 * 60 * 1000)));
      params['to'] = formatDate(new Date());
    }
    if (noOfDays == 6 || noOfDays == 12) {
      let endDate = new Date();
      endDate = new Date(endDate.setMonth(endDate.getMonth() - noOfDays))
      params['period'] = "Month";
      params['from'] = formatDate(endDate);
      params['to'] = formatDate(new Date());
    }
    this.userService.getLogonUsersChartsData(params).then((response) => {
      if (noOfDays == 1) {
        let responseKeys = Object.keys(response);
        let responseValues = Object.values(response);
        let formatResponse = [];
        responseKeys.forEach((element, key) => {
          formatResponse[new Date(element).getHours()] = (responseValues && responseValues[key]) ? responseValues[key] : null;
        });
        for (let i = 0; i < 24; i++) {
          let j: any = i < 10 ? "0" + i : i;
          domain.push(parseInt(j))
          data.push(
            {
              date: parseInt(j),
              close: formatResponse[i] ? parseInt(formatResponse[i]) : 0
            }
          )
        }
      }
      if (noOfDays == 7 || noOfDays == 14) {
        xAxisType = "date";
        xAxiesNoOfTicks = noOfDays;
        domain = [];
        let responseKeys = Object.keys(response);
        let responseValues = Object.values(response);
        let formatResponse = [];
        responseKeys.forEach((element, key) => {
          formatResponse[formatDate(new Date(element))] = (responseValues && responseValues[key]) ? responseValues[key] : null;
        });
        for (let i = 0; i <= noOfDays; i++) {
          let date = formatDate(new Date(new Date().getTime() - (i * 24 * 60 * 60 * 1000)));
          domain.push(date);
          data.push(
            {
              date: date,
              close: formatResponse[date] ? parseInt(formatResponse[date]) : 0
            }
          )
        }
      }
      if (noOfDays == 6 || noOfDays == 12) {
        let formatDate = (dateObj) => {
          if(dateObj instanceof Date){
            let year = dateObj.getFullYear();
            let month = dateObj.getMonth() + 1;
            let date = dateObj.getDate();
            return `${year}-${month}-00`;
          }
        }
        xAxisType = "date";
        xAxiesNoOfTicks = parseInt(noOfDays) + 1;
        domain = [];
        let responseKeys = Object.keys(response);
        let responseValues = Object.values(response);
        let formatResponse = [];
        responseKeys.forEach((element, key) => {
          formatResponse[formatDate(new Date(element))] = (responseValues && responseValues[key]) ? responseValues[key] : null;
        });
        for (let i = 0; i <= noOfDays; i++) {
          let endDate = new Date();
          let date = formatDate(new Date(endDate.setMonth(endDate.getMonth() - i)));
          domain.push(date);
          data.push(
            {
              date: date,
              close: formatResponse[date] ? parseInt(formatResponse[date]) : 0
            }
          )
        }
      }
      var baropt = {
        container: "areaLineChart",
        height: 340,
        // xAxisDomain :domain,
        data: data,
        showGrid: true,
        stroke: "rgba(255, 255, 255, 0.2)",
        shapeRendering: "crispEdges",
        toolTipTextColor: "white",
        toolTipText: this.getLanguageKey('logged users'),
        ShowDataOpacity: false,
        toolTipBorder: "3px",
        toolTipBackground: "",
        strokeWidth: '1px',
        xAxisType: xAxisType,
        xAxiesNoOfTicks: xAxiesNoOfTicks,
        xAxisLine: false,
        yAxisLine: false,
        xAxisValues: true,
        yAxisValues: true,
        valuesColor: "#aaabaa",
        curveColor: "#4687b1",
        dotFill: "#4687b1",
        dotStroke: "#4687b1",
        //xAxisHeading: "X-axies heading",
        yAxisHeading: this.getLanguageKey('Number of logons'),
        pathColor: "red",
        gradientColor: [{
          offset: "0%",
          color: "#304959",
          opacity: "1",
        }, {
          offset: "30%",
          color: "#304959",
          opacity: "0.5",
        }, {
          offset: "60%",
          color: "#304959",
          opacity: "0.3",
        }, {
          offset: "100%",
          color: "#304959",
          opacity: "0",
        }]
      };
      AreaLineChartModule.areaLineChart(baropt);
    });
  }


  logOnFailuresChartIntialize(noOfDays: any = 1) {
    noOfDays = parseInt(noOfDays);
    let params = {}
    let data: Array<any> = [];
    let formatDate = (dateObj) => {
      if(dateObj instanceof Date){
        let year = dateObj.getFullYear();
        let month = dateObj.getMonth() + 1;
        let date = dateObj.getDate();
        return `${year}-${month}-${date}`;
      }
      return null;
    }
    if (noOfDays == 7 || noOfDays == 14) {
      let endDate = new Date();
      params['period'] = "Day";
      params['from'] = formatDate(new Date(endDate.getTime() - (noOfDays * 24 * 60 * 60 * 1000)));
      params['to'] = formatDate(new Date());
    }
    else if (noOfDays == 6 || noOfDays == 12) {
      let endDate = new Date();
      endDate = new Date(endDate.setMonth(endDate.getMonth() - noOfDays));
      params['period'] = "Month";
      params['from'] = formatDate(endDate);
      params['to'] = formatDate(new Date());
    }
    this.userService.getLogonFailuresChartsData(params)
      .then((response: any) => {
        if (noOfDays == 1) {
          let responseKeys = Object.keys(response);
          let responseValues = Object.values(response);
          let formatResponse = [];
          responseKeys.forEach((element, key) => {
            formatResponse[new Date(element).getHours()] = (responseValues && responseValues[key]) ? responseValues[key] : null;
          });
          for (let i = 0; i < 24; i++) {
            let j: any = i < 10 ? "0" + i : i;
            data.push(
              {
                x : parseInt(j),
                y : formatResponse[i] ? parseInt(formatResponse[i]) : 0
              }
            )
          }
        }

        if (response && (noOfDays == 7 || noOfDays == 14)) {
          let responseKeys = Object.keys(response);
          let responseValues = Object.values(response);
          let formatResponse = [];
          responseKeys.forEach((element, key) => {
            formatResponse[formatDate(new Date(element))] = (responseValues && responseValues[key]) ? responseValues[key] : null;
          });
          let dateFormt = (dateObj) => {
            return new Date(dateObj).toLocaleString('default', { day: 'numeric', month: 'short', year: 'numeric' })
          }
          for (let i = 0; i <= noOfDays; i++) {
            let date = formatDate(new Date(new Date().getTime() - (i * 24 * 60 * 60 * 1000)));
            let dateX = dateFormt(new Date(new Date().getTime() - (i * 24 * 60 * 60 * 1000)));
            data.push(
              {
                x: dateX,
                y: formatResponse[date] ? parseInt(formatResponse[date]) : 0
              }
            )
          }

        }
        if (noOfDays == 6 || noOfDays == 12) {
          let formatDate = (dateObj) => {
            return new Date(dateObj).toLocaleString('default', { month: 'short', year: 'numeric' })
          }
          let responseKeys = Object.keys(response);
          let responseValues = Object.values(response);
          let formatResponse = [];
          responseKeys.forEach((element, key) => {
            formatResponse[formatDate(new Date(element))] =  (responseValues && responseValues[key]) ? responseValues[key] : null;
          });
          for (let i = 0; i <= noOfDays; i++) {
            let endDate = new Date();
            let date = formatDate(new Date(endDate.setMonth(endDate.getMonth() - i)))
            data.push(
              {
                x: date,
                y: formatResponse[date] ? parseInt(formatResponse[date]) : 0
              }
            )
          }
        }
        var options = { "valuesColor": "rgba(255, 255, 255, 0.6)", "yaxisHeadingText": this.getLanguageKey('Number of Failures'), "yaxisHeadingTextColor": "rgba(255, 255, 255, 0.6)", "toolTipOpacity": 0.9, "toolTipTextColor": "white", "toolTipText": "open failures On", "toolTipBackground": "", "toolTipBorder": "2px", "showlineaxisY": false, "showlineaxisX": false, "paddingX": 0.4, "id": "logOnFailures", "rx": 4, "ry": 4, "height": 340, "marginTop": 20, "marginBottom": 50, "stroke": " rgba(255, 255, 255, 0.2)", "marginRight": 20, "marginLeft": 40, "tickColor": "rgb(51, 69, 81)", "color_hash": { "0": ["Invite", "#8F4582"] }, "colors": "#3eb6ff", "xParam": {}, "yParam": {}, "gridx": true, "gridy": false, "axisX": true, "axisY": false, "showxYaxis": false, "xtext": "", "showGrid": false, "showBarData": true, "dataColor": "white" }
        verticalBarGraphModule.verticalBarGraph(data, options)
      })
  }
  TopUserLogOnFailuresChartIntialize(noOfDays: any = 7) {
    noOfDays = parseInt(noOfDays);
    let params = {}
    let data: Array<any> = [];
    let formatDate = (dateObj) => {
      if(dateObj instanceof Date){
        let year = dateObj.getFullYear();
        let month = dateObj.getMonth() + 1;
        let date = dateObj.getDate();
        return `${year}-${month}-${date}`;
      }
      return null;
    }
    if (noOfDays == 7 || noOfDays == 14) {
      let endDate = new Date();
      params['period'] = "Day";
      params['from'] = formatDate(new Date(endDate.getTime() - (noOfDays * 24 * 60 * 60 * 1000)));
      params['to'] = formatDate(new Date());
    }
    else if (noOfDays == 6 || noOfDays == 12) {
      let endDate = new Date();
      endDate = new Date(endDate.setMonth(endDate.getMonth() - noOfDays));
      params['period'] = "Month";
      params['from'] = formatDate(endDate);
      params['to'] = formatDate(new Date());
    }
    this.userService.getTopLogonFailuresChartsData(params)
      .then((response: any) => {
        if(response){
          let responseKeys = Object.keys(response);
          let responseValues = Object.values(response);
          let formatResponse = [];
          responseKeys.forEach((element, key) => {
            let obj = {};
            obj['x'] = element;
            obj['y'] = responseValues[key];
            data.push(obj);
          });
          var options = { "valuesColor": "rgba(255, 255, 255, 0.6)", "yaxisHeadingText": this.getLanguageKey('Number of Failures'), "yaxisHeadingTextColor": "rgba(255, 255, 255, 0.6)", "toolTipOpacity": 0.9, "toolTipTextColor": "white", "toolTipText": "openFailuresOn", "toolTipBackground": "", "toolTipBorder": "2px", "showlineaxisY": false, "showlineaxisX": false, "paddingX": 0.4, "id": "TopUserLogOnFailures", "rx": 4, "ry": 4, "height": 340, "marginTop": 20, "marginBottom": 50, "stroke": " rgba(255, 255, 255, 0.2)", "marginRight": 20, "marginLeft": 40, "tickColor": "rgb(51, 69, 81)", "color_hash": { "0": ["Invite", "#8F4582"] }, "colors": "#3eb6ff", "xParam": {}, "yParam": {}, "gridx": true, "gridy": false, "axisX": true, "axisY": false, "showxYaxis": false, "xtext": "", "showGrid": false, "showBarData": true, "dataColor": "white" };
          verticalBarGraphModule.verticalBarGraph(data, options);
        }
      });
  }

  groupsChartIntialize() {
    this.dashboardService.groupsWithUser().then((res: any) => {
      let data: Array<any> = [];
      if(res ){
        for (var property in res) {
          data.push(
            {
              "key": property,
              "value": (res && res[property]) ? res[property] : ''
            }
          )
        }
      }
      var pieData = { container: "#groupsChart", radius: { outerRadius: 92, innerRadius: 67 }, data: data, height: 193, colors: ["#5d96c8", "#b753cd", "#69ca6b", "#69ca6b", "#c1bd4f", "#db3f8d", "#669900", "#334433"], islegends: true, islegendleft: false, legendwidth: '', istxt: data.length,divideTxt:this.getLanguageKey('Groups'), paddingTop: "33px", legendmargintop: 30, legendHeight: "280px" }
      PieChartModule.ReusablePie(pieData);

    }).catch((error) => {
      throw error;
    })

  }
  rolesChartIntialize() {
    this.dashboardService.rolesWithUser().then((res: any) => {
      let data: Array<any> = [];
      if(res ){
        for (var property in res) {
          data.push(
            {
              "key": property,
              "value": (res && res[property]) ? res[property] : ''
            }
          )
        }
      }
      var pieData = { container: "#rolesChart", radius: { outerRadius: 92, innerRadius: 67 }, data: data, height: 193, colors: ["#5d96c8", "#b753cd", "#69ca6b", "#69ca6b", "#c1bd4f", "#db3f8d", "#669900", "#334433"], islegends: true, islegendleft: false, legendwidth: '', istxt: data.length,divideTxt:this.getLanguageKey("Roles"), paddingTop: "33px", legendmargintop: 30, legendHeight: "280px" }
      PieChartModule.ReusablePie(pieData);
    }).catch((error) => {
      throw error;
    });
  }
  openAddUserModal(event) {
    let dialogRef = this.dialog.open(UserCreateComponent, {
      panelClass: ['user-popover', 'custom-scroll-wrapper'],
      backdropClass:'modal-background-blur',
      data: { operation: "add", 'systemSettings': GlobalConstants.systemSettings }
    });
    event.stopPropagation();
  }
  logOnFailuresTable() {
    let logOnDialogRef = this.dialog.open(LogonFailuresComponent, {
      panelClass: ['user-popover', 'custom-scroll-wrapper'],
    });
  }
  navigateTo(event, url) {
    this.router.navigate([url]);
    event.stopPropagation();
  }

  getLanguageKey(text){
    var langKey = text
    if(GlobalConstants.languageJson){
    langKey = GlobalConstants.languageJson[text];
  }
  return langKey;
}

}
