import { Component, Inject, OnInit } from "@angular/core";
import { EntityGraphService } from "@app/modules/entity/services/entity-graph.service";
import { GlobalConstants } from "@app/common-modules/constants/global.constants";
import { CommonServicesService } from "@app/common-modules/services/common-services.service";
import { GroupedColumChartModule } from "../../../../shared/charts/groupedColumChart.js";
import { StackedBarModule } from "../../../../shared/charts/stackedtime.js";
import { CaseManagementService } from "../../case-management.service.js";
// import { FetcherListConstant } from "@app/modules/entity/constants/fetchers-list-constant.js";
import { map } from "rxjs/operators";
import * as d3 from "../../../../shared/charts/d3.v3.min";
import { MatDialog } from "@angular/material/dialog";
import { CaseWidgetDeleteComponent } from "./modals/widget-delete/case-widget-delete.component";
import { Subscription } from "rxjs/Subscription";
import { UtilitiesService } from "@app/modules/user-management/services/utilities/utilities.service";
import { SharedServicesService } from '../../../../shared-services/shared-services.service';
import { WidgetMasterDataResponse, WidgetMasterEntity } from '../../models/case-widget';
import { TranslateService } from '@ngx-translate/core';
import { iif, of } from 'rxjs';
import { WINDOW } from "../../../../core/tokens/window.js";

@Component({
  selector: "app-case-dashboard",
  templateUrl: "./case-dashboard.component.html",
  styleUrls: ["./case-dashboard.component.scss"],
})
export class CaseDashboardComponent implements OnInit {
  public componentName = "caseDashboard";
  public caseWorkBenchPermissionJSON: any = [];
  public data: any;
  public totalErrorCount = 0;
  public totalSuccesCountsMoreThan100 = 0;
  public totalSuccesCountsBetweeen50To100 = 0;
  public totalSuccesCountsLessThan50 = 0;
  public worldMapFinalDataForExpand: any;
  public languageJson: any;
  public status: any;
  public worldMapLoader: boolean = false;
  public transactionAggregator: any = [];
  public transactionAggregatorAggregated: any = [];
  public caseTypesList: any = {};
  public worldMapShowDataNotFound = false;
  // public worldCaseDashboardLocation: any = {
  //   container: "#mapCaseDashBoardChart",
  //   uri1: "../../../../assets/js/worldJson.json", // Url of data
  //   uri2: "../../../../assets/js/worldMapData.json", // Url of data
  //   height: 300,
  //   // width: 250,
  //   markers: [],
  //   data: [FetcherListConstant.worldCountryDetailList, []],
  // };
  public widgetChartInfoGblObject: any = {
    widgetpanel: false,
    settingsObj: {},
    copySettingsObj: {},
    widgetgraphTypeList: [],
    xAxisPeriodData: [],
    xAxisPeriodType: [],
    periodDetails: [],
    entityType: [],
    entityTypeList: [],
    entityStauses: [],
    yAxisList: [],
    yAxisAttributesList: [],
    aggregationList: [],
    entityMatch: [],
    selectedPeriod: "",
    selectedGraphType: "",
    selectedPeriodType: "",
    numberOfPeriodsFilter: 0,
    selectedEntityType: "",
    selectedYAxisattribute: "",
    showXsubTitleIndicator: true,
    showYsubTitleIndicator: true,
    widgetsideBargraphTitle: "",
    selectedAggrigateType: "",
    editWidgetChartName: true,
    copyWidgetTitle: "",
    widgetgraphTitle: "",
    showXsubTitle: "",
    showYsubTitle: "",
    WidgetChartData: [],
    widgetFilterRespData: {},
    themeList: [{ key: 1, value: "standard" }],
    selectedTheme: "standard",
    allWidgetInstanceOfUser: [],
    activeWidget: {},
    widgetLoader: false,
    currentWidgetIndex: 0,
    activedasboardId: "",
    activeWidgetId: "",
    widgetSettingsFlag: false,
    widgetFilterFlag: false,
    statusList: [],
    selectedStatus: [],
    disableMultiselectDD: false,
    statusFiltersList: [],
    multiSelectSettingList: [],
    widgetFilterInfo: {},
    selectedFilterStatusData: [],
    displayWidgetFilterData: [],
    WidgetFilterDataObj: [],
    dataLoaded: true
  };
  // public sampleOBJ =[ { x: "Under Review", new: "10", refresh: "15",},{ x: "Client Outreach", new: "10", refresh: "15",}]

  public staticStacked = [
    [
      {
        time: "Under Review",
        y: 10,
        type: "new",
      },
      {
        time: "Client Outreach",
        y: 0,
        type: "new",
      },
    ],
    [
      {
        time: "Under Review",
        y: 0,
        type: "new",
      },
      {
        time: "Client Outreach",
        y: 5,
        type: "new",
      },
    ],
  ];
  // public barStaticColor:any = ['f28618','42b7ff','e6ae20','ef5350','00796b','3f51b5','4c7cff','9c27b0'];
  public barStaticColor: any = [
    "00796b",
    "3f51b5",
    "4c7cff",
    "9c27b0",
    "f28618",
    "42b7ff",
    "e6ae20",
    "ef5350",
    "00796b",
    "3f51b5",
    "4c7cff",
    "9c27b0",
    "f28618",
    "42b7ff",
    "e6ae20",
    "ef5350",
    "00796b",
    "3f51b5",
    "4c7cff",
    "9c27b0",
    "f28618",
    "42b7ff",
    "e6ae20",
    "ef5350",
  ];
  public showHideDataNotFound = {
    groupBarChartCaseDashboard: false,
    groupBarChartCaseDashboardCaseStatus: false,
  };
  public multiSelectSetting;
  item: number;
  subscription: Subscription;
  customizeStatus: any;
  addNewWidgetStatus: boolean = false;

  subscriptionNewWidget: Subscription;
  isFilterWidgetViewPermissionEnabled: boolean;
  isWidgetSettingViewPermissionEnabled: boolean;
  constructor(
    private utilitiesService: UtilitiesService,
    private _commonService: CommonServicesService,
    public entityGraphService: EntityGraphService,
    private _caseService: CaseManagementService,
    public dialog: MatDialog,
    private sharedService: SharedServicesService,
    private translateService: TranslateService,
    @Inject(WINDOW) private readonly window: Window
  ) {}

  groupedFunction(transactionAggregator, barColor, id) {
    var transbarData = this.handleData(
      transactionAggregator,
      "model",
      "",
      "bar"
    );
    var baropt: any = {
      container: "#" + id,
      data: transbarData,
      height: 240,
      islegends: false,
      isHeaer: false,
      showlineaxisY: false,
      showlineaxisX: false,
      xtext: " ",
      ytext: " ",
      showgroupedstacked: false,
      colors: barColor,
      showxYTxt: false,
      rightSideYaxis: true,
      // xLabelRotation: "rotate(0)",
      roundedBar: "allSideRounded",
      appendTextOnBar: true,
      gridY: true,
      gridYRightside: true,
    };

    if (id == "groupBarChartCaseDashboardCaseStatus") {
      baropt.height = 320;
    }
    GroupedColumChartModule.groupedColumChart(baropt);
    // GroupedColumChartModule.plotStackedChart(baropt);
  }
  /*
   * Purpose :To pass the chart data to stackedbar column module
   * Author : Amritesh
   * Date : 14-Aug-2020
   */
  stackedBarOption(data, widgetData) {
    var options = {
      container: "#politicaldonations_" + widgetData.widgetId,
      width: $("#politicaldonations_" + widgetData.widgetId).width()
        ? $("#politicaldonations_" + widgetData.widgetId).width()
        : 300,
      height: 270,
      data: data ? data : this.staticStacked,
      marginTop: 20,
      marginBottom: 15,
      marginRight: 30,
      marginLeft: 50,
      tickColor: "rgb(51, 69, 81)",
      showXaxisTitle:
        widgetData && widgetData.xAxisTitle ? widgetData.xAxisTitle : "",
      showYaxisTitle:
        widgetData && widgetData.yAxisTitle ? widgetData.yAxisTitle : "",
      showlabel: true,
      widgetId: widgetData && widgetData.widgetId ? widgetData.widgetId : "",
      widgetName:
        widgetData && widgetData.widgetName
          ? widgetData.widgetName
          : "widget chart",
      arrayTypeColorSet: widgetData.arrayTypeColorSet
        ? widgetData.arrayTypeColorSet
        : [],
    };
    StackedBarModule.stackedbarTimelinechartProto(options, d3);
  }

  ngOnInit() {
    /**
     * @description wait until translations ready
     */
    iif(() => !!this.translateService.currentLang, of(this.translateService.currentLang), this.translateService.onLangChange).subscribe(() => {
      this.multiSelectSetting = {
        singleSelection: false,
        idField: "key",
        textField: "value",
        itemsShowLimit: 2,
        selectAllText: this.translateService.instant('Select All'),
        unSelectAllText: this.translateService.instant('Unselect All'),
        noDataAvailablePlaceholderText: this.translateService.instant('No data available'),
        placeholder: this.translateService.instant('Status'),
        enableCheckAll: false,
      };

      // Subscribing to customize status service from sub-menu
      this._commonService.statusCustomizeLayout.subscribe(
          (status) => (this.customizeStatus = status)
      );



      // this.stackedBarOption(this.staticStacked)
      this.transactionAggregator = [];
      this.transactionAggregatorAggregated = [];
      this.worldMapLoader = true;
      /* this._caseService.getCasesList().subscribe((res: any) => {
       if (res && res.result && res.result.length) {
       var groups: any = {};
       for (var i = 0; i < res.result.length; i++) {
       var groupName: any = res.result[i].jurdictionName;
       if (!groups[groupName]) {
       groups[groupName] = [];
       }
       groups[groupName].push(res.result[i]);
       }
       var myArray: any = [];
       for (var groupName1 in groups) {
       myArray.push({ group: groupName1, count: groups[groupName1] });
       }
       var markers = myArray.map((val) => {
       var name = countryRisk.filter(
       (countryCode) =>
       countryCode.ISO.toLowerCase() == val.group.toLowerCase()
       );
       var obj = {
       jurisdictionName: val.group.toLowerCase(),
       count: val.count.length,
       name: name && name.length > 0 ? name[0].COUNTRY : "",
       };
       return obj;
       });
       this.worldCaseDashboardLocation.markers = markers;
       setTimeout(() => {
       this.entityGraphService.plotWorldLocationChart(
       this.worldCaseDashboardLocation
       );
       this.worldMapLoader = false;
       }, 2000);
       //
       } else {
       this.worldMapLoader = false;
       this.worldMapShowDataNotFound = true;
       }
       }); */

      this._caseService
          .getCaseStatistics("Case Type", "")
          .subscribe((resp: any) => {
            this.caseTypesList = {};
            var obj = {},
                colorBar = {};
            var caseTypesList: any = {};

            resp.list.map((result, i) => {
              var status = result.type ? result.type.split(" ").join("_") : "";
              obj = { model: status };
              obj[status] = result.count;
              colorBar[status] = "#" + this.barStaticColor[i];
              this.transactionAggregator.push(obj);

              var groupName: any = status;
              if (!caseTypesList[groupName]) {
                caseTypesList[groupName] = [];
              }
              caseTypesList[groupName].push(result.count);
            });
            //
            this.caseTypesList = caseTypesList;

            var keys = [];
            this.transactionAggregator.map(function (d) {
              keys = keys.concat(
                  Object.keys(d).filter(function (d) {
                    return d != "model";
                  })
              );
            });
            this.transactionAggregator.map(function (d) {
              keys.forEach(function (k) {
                if (!d[k]) {
                  d[k] = 0;
                }
              });
            });
            this.groupedFunction(
                this.transactionAggregator,
                colorBar,
                "groupBarChartCaseDashboard"
            );
            if (this.transactionAggregator.length == 0) {
              this.showHideDataNotFound.groupBarChartCaseDashboard = true;
            }
          });
      this._caseService.getAggregatedCaseStatus().subscribe((resp: any) => {
        var obj = {},
            colorBar = {};

        if(resp){
          resp.map((grp) => {
            obj = { model: grp.group_name };
            grp.status_count.map((result, i) => {
              obj[result.status] = result.count;
              colorBar[result.status] = "#" + this.barStaticColor[i];
            });

            this.transactionAggregatorAggregated.push(obj);
          });
        }
        var keys = [];
        this.transactionAggregatorAggregated.map(function (d) {
          keys = keys.concat(
              Object.keys(d).filter(function (d) {
                return d != "model";
              })
          );
        });
        this.transactionAggregator.map(function (d) {
          keys.forEach(function (k) {
            if (!d[k]) {
              d[k] = 0;
            }
          });
        });
        this.groupedFunction(
            this.transactionAggregatorAggregated,
            colorBar,
            "groupBarChartCaseDashboardCaseStatus"
        );
        if (this.transactionAggregatorAggregated.length == 0) {
          this.showHideDataNotFound.groupBarChartCaseDashboard = true;
        }
      });
      this.getCaseWidgetDetails();
      setTimeout(() => {
        this.getAllInstanceOfUserWidgets();
      }, 500);
      this.getCaseListPermssionIds();

      this.subscriptionNewWidget = this._commonService.getNewWidgetStatus().subscribe(status => {
        if (status) {
          this.addNewWidget(status)
        } else {
          // clear messages when empty message received
          this.addNewWidget(false);
        }
      });
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
      this.subscriptionNewWidget.unsubscribe();
  }

  addNewWidget(status) {
    this.addNewWidgetStatus = status;

    if (this.addNewWidgetStatus) {
      this.createNewWidget(true);
    }
  }

  getAllInstanceOfUserWidgets(newWidgetID = null) {
    this._caseService.getWidgetinstancebyUser().pipe(
        map((data) => {
          data.forEach((n) => {
            n.data.data = n.data.data.map((o) => ({
              ...o,
              x: o.x ? this.translateService.instant(o.x) : ''
            }))
          })
          return data;
        })
    ).subscribe((resp: any) => {
      if (resp && Array.isArray(resp) && resp.length) {
        this.widgetChartInfoGblObject.allWidgetInstanceOfUser = resp;
        // this.widgetChartInfoGblObject.allWidgetInstanceOfUser = GlobalConstants.widgetInstanaceObj;
        if (this.widgetChartInfoGblObject.allWidgetInstanceOfUser) {
          this.widgetChartInfoGblObject.allWidgetInstanceOfUser.forEach(
            (element, i) => {
              this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                i
              ].editTitle = true;

              let settingsInfo =
                this.widgetChartInfoGblObject.allWidgetInstanceOfUser[i] &&
                this.widgetChartInfoGblObject.allWidgetInstanceOfUser[i]
                  .user_settings_json
                  ? JSON.parse(
                      this.window.atob(
                        this.widgetChartInfoGblObject.allWidgetInstanceOfUser[i]
                          .user_settings_json
                      )
                    )
                  : {};

              if (settingsInfo) {
                this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                  i
                ].widgetTitle = settingsInfo.widgetName
                  ? settingsInfo.widgetName
                  : "";

                this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                  i
                ].widgetName = settingsInfo.widgetName
                  ? settingsInfo.widgetName
                  : "";

                this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                  i
                ].widgetSpinner = false;

                this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                  i
                ].displayWidgetFilterData = [];

                this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                  i
                ].WidgetFilterDataObj = [];

                if (
                  settingsInfo &&
                  settingsInfo.widgetFilters &&
                  Object.keys(settingsInfo.widgetFilters).length != 0
                ) {
                  // Adding a new key to hold full widget filter data
                  this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                    i
                  ].WidgetFilterDataObj = settingsInfo.widgetFilters;

                  let keys = Object.keys(settingsInfo.widgetFilters);
                  keys.forEach((key) => {
                    let data = settingsInfo.widgetFilters[key].map((j) => {
                      return j.displayName;
                    });
                    this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                      i
                    ].displayWidgetFilterData.push(...data);
                  });
                }
                let Chartobj = {
                  widgetId: element.widget_id ? element.widget_id : "",
                  xAxisTitle:
                    settingsInfo && settingsInfo.showXAxisSubTitle
                      ? settingsInfo && settingsInfo.xAxisSubTitle
                      : "",
                  yAxisTitle:
                    settingsInfo && settingsInfo.showYAxisSubTitle
                      ? settingsInfo && settingsInfo.yAxisSubTitle
                      : "",
                  widgetName: this.widgetChartInfoGblObject
                    .allWidgetInstanceOfUser[i].widgetName,
                };
                if (
                  element.data &&
                  element.data["data"] &&
                  element.data["data"].length > 0
                ) {
                  setTimeout(() => {
                    this.manipulateChartData(element.data["data"], Chartobj);
                  }, 0);
                }
              }
            }
          );
        }

        // When a New Widget is added
        if (newWidgetID) {
          for (
            let index = 0;
            index <
            this.widgetChartInfoGblObject.allWidgetInstanceOfUser.length;
            index++
          ) {
            const element = this.widgetChartInfoGblObject
              .allWidgetInstanceOfUser[index];
            if (element.widget_id == newWidgetID) {
              this.triggerWidgetSettings(element, index);
            }
          }
        }
      }

      // Reset widgets if there are no instances
      if (Array.isArray(resp) && resp.length == 0) {
        this.widgetChartInfoGblObject.allWidgetInstanceOfUser = [];
      }
      this._commonService.setAddWidgetBtnDisableStatus(false);
    }, (err) => {
      this._commonService.setAddWidgetBtnDisableStatus(false);
    });
  }
  handleData(data, x, y, type) {
    var str = JSON.stringify(data);
    str = str.replace(/model/g, "x");
    var object = JSON.parse(str);
    return object;
  }
  ngAfterViewInit() {
    // this._commonService.getSystemSettings().then((response)=>{
    let response = GlobalConstants.systemsettingsData;
    response["General Settings"].map((val) => {
      if (val.name == "Languages") {
        if (val.selectedValue) {
          this._commonService
            .getLanguageJson(val.selectedValue)
            .subscribe((resp: any) => {
              if (resp) {
                this.languageJson = resp;
              }
            });
        }
      }
    });
    // }).catch((error) => {
    //

    // })
  }

  /*
   * Purpose :To load the side panel widget settings details
   * Author : shravani
   * Date : 14-Aug-2020
   */
  getCaseWidgetDetails() {
    // this.widgetChartInfoGblObject.settingsObj = GlobalConstants.dummyWidgetJson;
    // this.widgetChartInfoGblObject.copySettingsObj = GlobalConstants.dummyWidgetJson;
    this._caseService.getWidgetMasterData().subscribe((resp) => {
      if (resp) {
        this.widgetChartInfoGblObject.settingsObj = resp;
        this.widgetChartInfoGblObject.copySettingsObj = resp;
        this.bindcaseWidgetDetails(this.widgetChartInfoGblObject.settingsObj);
      }
    });
  }

  /*
   * Purpose :binding widget master data
   * Author : shravani
   * Date : 14-Aug-2020
   */
  bindcaseWidgetDetails(respGblObj: WidgetMasterDataResponse): void {
    this.widgetChartInfoGblObject.widgetgraphTypeList =
      respGblObj && respGblObj.series && respGblObj.series.widget_type
        ? respGblObj.series.widget_type
        : [];
    this.widgetChartInfoGblObject.entityType =
      respGblObj && respGblObj.series && respGblObj.series.entity
        ? respGblObj.series.entity
        : [];
    this.widgetChartInfoGblObject.entityTypeList =
      this.widgetChartInfoGblObject.entityType &&
      this.widgetChartInfoGblObject.entityType.length
        ? this.widgetChartInfoGblObject.entityType.map(
            (value) => value.entity_type
          )
        : [];
    if (this.widgetChartInfoGblObject.entityTypeList.length) {
      const entityTypeMatch = this.widgetChartInfoGblObject.entityTypeList.findIndex(
        (item) => item && item.value == "case"
      );
      if (entityTypeMatch !== -1) {
        this.widgetChartInfoGblObject.selectedEntityType = this.widgetChartInfoGblObject.entityTypeList[
          entityTypeMatch
        ].value;
      } else {
        this.widgetChartInfoGblObject.selectedEntityType = "case";
      }
    }
    if (this.widgetChartInfoGblObject.widgetgraphTypeList.length) {
      const graphTypeMatch = this.widgetChartInfoGblObject.widgetgraphTypeList.findIndex(
        (item) => item.value == "Stacked Column Chart"
      );
      if (graphTypeMatch !== -1) {
        this.widgetChartInfoGblObject.selectedGraphType = this.widgetChartInfoGblObject.widgetgraphTypeList[
          graphTypeMatch
        ].value;
      } else {
        this.widgetChartInfoGblObject.selectedGraphType =
          "Stacked Column Chart";
      }
    }
    // this.widgetChartInfoGblObject.statusList = this.widgetChartInfoGblObject.entityType && this.widgetChartInfoGblObject.entityType.length ? this.widgetChartInfoGblObject.entityType.filter((value) => (value.entityType['value'] === this.widgetChartInfoGblObject.selectedEntityType)).map((obj) => { return obj.status }) : [];
    this.widgetChartInfoGblObject.entityMatch =
      respGblObj && respGblObj.widget_entities
        ? respGblObj.widget_entities.filter(
            (el) =>
              el.entity_type.value ==
              this.widgetChartInfoGblObject.selectedEntityType
          )
        : [];

    this.widgetChartInfoGblObject.periodDetails =
      this.widgetChartInfoGblObject.entityMatch.length &&
      this.widgetChartInfoGblObject.entityMatch[0] &&
      this.widgetChartInfoGblObject.entityMatch[0].x_axis
        ? this.widgetChartInfoGblObject.entityMatch[0].x_axis
        : [];
    this.widgetChartInfoGblObject.xAxisPeriodData =
      this.widgetChartInfoGblObject.periodDetails &&
      this.widgetChartInfoGblObject.periodDetails.length
        ? this.widgetChartInfoGblObject.periodDetails.map(
            (value) => value.group_by
          )
        : [];
    let yData =
      this.widgetChartInfoGblObject.entityMatch.length &&
      this.widgetChartInfoGblObject.entityMatch[0] &&
      this.widgetChartInfoGblObject.entityMatch[0].y_axis
        ? this.widgetChartInfoGblObject.entityMatch[0].y_axis
        : [];
    yData = yData
      ? yData
          .map((data) => {
            return data.attributes;
          })
          .flat()
          .map((val) => val.attribute)
      : [];
    yData.forEach((val) => {
      val.value = val.value ? val.value : "number of cases per status";
    });
    this.widgetChartInfoGblObject.statusList =
      this.widgetChartInfoGblObject &&
      this.widgetChartInfoGblObject.xAxisPeriodData
        ? this.widgetChartInfoGblObject.xAxisPeriodData.map((o) => ({ ...o, value: o.value ? this.translateService.instant(o.value) : '' }))
        : [];
    this.widgetChartInfoGblObject.yAxisList = yData;
    this.widgetChartInfoGblObject.showXsubTitleIndicator =
      respGblObj && respGblObj.titles && respGblObj.titles.show_xaxis_sub_title
        ? respGblObj.titles.show_xaxis_sub_title
        : false;
    this.widgetChartInfoGblObject.showYsubTitleIndicator =
      respGblObj && respGblObj.titles && respGblObj.titles.show_yaxis_sub_title
        ? respGblObj.titles.show_yaxis_sub_title
        : false;
    this.widgetChartInfoGblObject.widgetgraphTitle =
      respGblObj && respGblObj.titles && respGblObj.titles.widget_name
        ? respGblObj.titles.widget_name
        : "";
    this.widgetChartInfoGblObject.widgetsideBargraphTitle = JSON.parse(
      JSON.stringify(this.widgetChartInfoGblObject.widgetgraphTitle)
    );
    this.widgetChartInfoGblObject.showXsubTitle =
      respGblObj && respGblObj.titles && respGblObj.titles.x_axis_sub_title
        ? respGblObj.titles.x_axis_sub_title
        : "";
    this.widgetChartInfoGblObject.showYsubTitle =
      respGblObj && respGblObj.titles && respGblObj.titles.y_axis_sub_title
        ? respGblObj.titles.y_axis_sub_title
        : "";

     this.widgetChartInfoGblObject.xAxisPeriodData.sort((a,b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
     this.widgetChartInfoGblObject.yAxisList.sort((a,b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
    // bind the dropdown values
    this.widgetChartInfoGblObject.selectedPeriod =
      this.widgetChartInfoGblObject.xAxisPeriodData &&
      this.widgetChartInfoGblObject.xAxisPeriodData.length &&
      this.widgetChartInfoGblObject.xAxisPeriodData[0] &&
      this.widgetChartInfoGblObject.xAxisPeriodData[0].value
        ? this.widgetChartInfoGblObject.xAxisPeriodData[0].value
        : "";
    this.widgetChartInfoGblObject.selectedYAxisattribute =
      this.widgetChartInfoGblObject.yAxisList &&
      this.widgetChartInfoGblObject.yAxisList.length &&
      this.widgetChartInfoGblObject.yAxisList[0] &&
      this.widgetChartInfoGblObject.xAxisPeriodData[0].value
        ? this.widgetChartInfoGblObject.xAxisPeriodData[0].value
        : "";

    this.onChangeSelectedYAttribute();
  }


  /*
   * Purpose :on change the widget graph type
   * Author : shravani
   * Date : 14-Aug-2020
   */
  onChangeSelectedGraphType() {}

  /*
   * Purpose :on change the xAis period
   * Author : shravani
   * Date : 14-Aug-2020
   */
  onChangexAxisPeriod() {
    //
    if (
      this.widgetChartInfoGblObject.xAxisPeriodData.length &&
      this.widgetChartInfoGblObject.periodDetails.length != -1
    ) {
      let match = this.widgetChartInfoGblObject.xAxisPeriodData.findIndex(
        (item) => item.value == this.widgetChartInfoGblObject.selectedPeriod
      );
      if (match !== -1) {
        this.widgetChartInfoGblObject.xAxisPeriodType =
          this.widgetChartInfoGblObject.periodDetails[match-1] &&
          this.widgetChartInfoGblObject.periodDetails[match-1].groupby_type
           ? this.widgetChartInfoGblObject.periodDetails[match-1].groupby_type
           : [];
        // Adding ShowText data to the period type dropdown AP-820
        if (
          this.widgetChartInfoGblObject.periodDetails[match-1].number_of_periods &&
          this.widgetChartInfoGblObject.periodDetails[match-1]
            .number_of_periods instanceof Array &&
          this.widgetChartInfoGblObject.periodDetails[match-1].number_of_periods
            .length > 0
        ) {
          if (this.widgetChartInfoGblObject.xAxisPeriodType.length > 0) {
            for (
              let index = 0;
              index < this.widgetChartInfoGblObject.xAxisPeriodType.length;
              index++
            ) {
              const element = this.widgetChartInfoGblObject.xAxisPeriodType[
                index
              ];

              let typeIndex = this.widgetChartInfoGblObject.periodDetails[
                match-1
              ].number_of_periods.findIndex(
                (item) => item.groupbyType === element.key
              );

              if (typeIndex != -1) {
                element.showText = this.widgetChartInfoGblObject.periodDetails[
                  match-1
                ].number_of_periods[typeIndex].showText
                  ? this.widgetChartInfoGblObject.periodDetails[match-1]
                      .number_of_periods[typeIndex].showText
                  : "Missing Settings";
              } else {
                element.showText = "Missing Settings";
              }
            }
          }
        }

        this.widgetChartInfoGblObject.numberOfPeriodsFilter =
          this.widgetChartInfoGblObject.periodDetails[match-1] &&
          this.widgetChartInfoGblObject.periodDetails[match-1].number_of_periods &&
          this.widgetChartInfoGblObject.periodDetails[match-1].number_of_periods.value
            ? this.widgetChartInfoGblObject.periodDetails[match-1].number_of_periods.value
            : 0;

        // Load Default periods when period data initialized - ASHEN
        if (
          this.widgetChartInfoGblObject.selectedPeriod.toLowerCase() ==
            "period" &&
          this.widgetChartInfoGblObject.selectedPeriodType == ""
        ) {
          if (this.widgetChartInfoGblObject.xAxisPeriodType.length > 0) {
            this.widgetChartInfoGblObject.selectedPeriodType = this.widgetChartInfoGblObject.xAxisPeriodType[0].value;
            this.getPeriodValidationMax();
          }
        }
      }
    }
  }

  /*
   * Purpose :on change XAxis period type
   * Author : shravani
   * Date : 14-Aug-2020
   */
  onChangeSelectedPeriodType() {
    //
    this.getPeriodValidationMax();
  }

  /*
   * Purpose :on change the entity type
   * Author : shravani
   * Date : 14-Aug-2020
   */
  onChangeSelectedEntityType() {
    //
  }

  /*
   * Purpose :on change the YAttribute
   * Author : shravani
   * Date : 14-Aug-2020
   */
  onChangeSelectedYAttribute() {
    //
    // let yData = this.widgetChartInfoGblObject.yAxisList ? this.widgetChartInfoGblObject.yAxisList :[];
    var aggreateDataRaw =
      this.widgetChartInfoGblObject.entityMatch.length > 0 &&
      this.widgetChartInfoGblObject.entityMatch[0].yAxis
        ? this.widgetChartInfoGblObject.entityMatch[0].yAxis
        : [];
    var aggreateData = aggreateDataRaw.reduce((acc, val) => {
      acc = acc.concat(val.attributes);
      return acc;
    }, []);
    let aggregate =
      aggreateData &&
      aggreateData.filter(
        (data) =>
          data.attribute.value ===
          this.widgetChartInfoGblObject.selectedYAxisattribute
      );
    this.widgetChartInfoGblObject.aggregationList =
      aggregate && aggregate[0] && aggregate[0].aggregationType
        ? aggregate[0].aggregationType
        : [];

    if (this.widgetChartInfoGblObject.aggregationList.length) {
      this.widgetChartInfoGblObject.aggregationList.map((val) => {
        val.value =
          val.value && val.value.toLowerCase() == "total" ? "count" : val.value;
      });
      let aggregationTypeMatch = this.widgetChartInfoGblObject.aggregationList.findIndex(
        (item) => item.value == "count"
      );
      if (aggregationTypeMatch !== -1) {
        this.widgetChartInfoGblObject.selectedAggrigateType = this.widgetChartInfoGblObject.aggregationList[
          aggregationTypeMatch
        ].value;
      } else {
        this.widgetChartInfoGblObject.selectedAggrigateType = "count";
      }
    }
  }

  close() {
    this._commonService.addNewWidgetBehavior.next(false);
    this.widgetChartInfoGblObject.widgetpanel = false;
  }
  /*
   * Purpose :To show and hide the side widget settings panel
   * Author : shravani
   * Date : 14-Aug-2020
   */
  triggerWidgetSettings(widget, index) {
    this.isFilterWidgetViewPermissionEnabled =false;
    this.isWidgetSettingViewPermissionEnabled =false;
    const widgetSettingPermission = this._commonService.getDomainPermissions(this.caseWorkBenchPermissionJSON, 'widgetSettings');
    const widgetSettingPermissionLevel = this._commonService.getPermissionStatusType(widgetSettingPermission);
     if(widget && widgetSettingPermissionLevel && widgetSettingPermissionLevel=='view'){
       this.isWidgetSettingViewPermissionEnabled =true;
     }
      this.widgetChartInfoGblObject.widgetSettingsFlag = true;
      this.widgetChartInfoGblObject.widgetFilterFlag = false;
      this.widgetChartInfoGblObject.activeWidget = widget;
      this.widgetChartInfoGblObject.activedasboardId =
        this.widgetChartInfoGblObject.activeWidget &&
        this.widgetChartInfoGblObject.activeWidget.dashboardId
          ? this.widgetChartInfoGblObject.activeWidget.dashboardId
          : null;
      this.widgetChartInfoGblObject.activeWidgetId =
        this.widgetChartInfoGblObject.activeWidget &&
        this.widgetChartInfoGblObject.activeWidget.widget_id
          ? this.widgetChartInfoGblObject.activeWidget.widget_id
          : "";
      let respData =
        this.widgetChartInfoGblObject.activeWidget &&
        this.widgetChartInfoGblObject.activeWidget.user_settings_json
          ? JSON.parse(
              this.window.atob(
                this.widgetChartInfoGblObject.activeWidget.user_settings_json
              )
            )
        : {};
      if (
        this.widgetChartInfoGblObject.activeWidget.data &&
        this.widgetChartInfoGblObject.activeWidget.data["data"]
      ) {
        this.widgetChartInfoGblObject.widgetFilterData = respData;
        this.bindWidgetSettingsFilterData(respData);

      }

      this.getPeriodValidationMax();

      this.widgetChartInfoGblObject.currentWidgetIndex = index;
      this.widgetChartInfoGblObject.widgetpanel = true;
      this._commonService.addNewWidgetBehavior.next(true);

  }



  /*
   * Purpose :cancel the widget filters
   * Author : shravani
   * Date : 14-Aug-2020
   */
  canelWidgetSettings() {
    if (this.widgetChartInfoGblObject.widgetSettingsFlag) {
      if (this.widgetChartInfoGblObject.WidgetChartData.length) {
        this.bindWidgetSettingsFilterData(
          this.widgetChartInfoGblObject.widgetFilterData
        );
      } else {
        this.bindcaseWidgetDetails(
          this.widgetChartInfoGblObject.copySettingsObj
        );
      }
    }
    this.widgetChartInfoGblObject.widgetpanel = false;
    this._commonService.addNewWidgetBehavior.next(false);
  }

  /*
   * Purpose : Apply widget filters
   * Author : shravani
   * Date : 15-Aug-2020
   */

  applyWidgetSettings(save) {
    let settingsInfo: any;
    let Chartobj: any;
    let currentIndex = this.widgetChartInfoGblObject.currentWidgetIndex;
    let dataObj: any = {
      // widgetName: save ? this.widgetChartInfoGblObject.widgetsideBargraphTitle : this.widgetChartInfoGblObject.widgetgraphTitle,
      user_settings_json: {
        entityType: this.widgetChartInfoGblObject.selectedEntityType,
        // widgetName: save ? this.widgetChartInfoGblObject.widgetsideBargraphTitle : this.widgetChartInfoGblObject.widgetgraphTitle,
        widgetName: save
          ? this.widgetChartInfoGblObject.widgetsideBargraphTitle
          : this.widgetChartInfoGblObject.allWidgetInstanceOfUser[currentIndex]
              .widgetName,
        widgetType: this.widgetChartInfoGblObject.selectedGraphType,
        xAxis: {
          groupBy: this.widgetChartInfoGblObject.selectedPeriod,
          groupbyType: "",
          numberOfPeriods: "",
        },
        yAxis: {
          attribute: this.widgetChartInfoGblObject.selectedYAxisattribute,
          aggregationType: this.widgetChartInfoGblObject.selectedAggrigateType,
        },
        showXAxisSubTitle: this.widgetChartInfoGblObject.showXsubTitleIndicator,
        showYAxisSubTitle: this.widgetChartInfoGblObject.showYsubTitleIndicator,
        xAxisSubTitle: this.widgetChartInfoGblObject.showXsubTitle,
        yAxisSubTitle: this.widgetChartInfoGblObject.showYsubTitle,
        widgetFilters: this.widgetChartInfoGblObject.widgetFilterInfo,
      },
      dashboard_id: this.widgetChartInfoGblObject.activedasboardId,
      widget_id: this.widgetChartInfoGblObject.activeWidgetId,
    };
    if (
      this.widgetChartInfoGblObject.selectedPeriod.toLowerCase() === "period"
    ) {
      dataObj.user_settings_json.xAxis.groupbyType = this.widgetChartInfoGblObject.selectedPeriodType;
      dataObj.user_settings_json.xAxis.numberOfPeriods = this.widgetChartInfoGblObject.numberOfPeriodsFilter;
    }

    if (
      dataObj &&
      dataObj.user_settings_json.entityType &&
      dataObj.user_settings_json.widgetType &&
      dataObj.user_settings_json.xAxis &&
      dataObj.user_settings_json.xAxis.groupBy &&
      dataObj.user_settings_json.yAxis.aggregationType
    ) {
      dataObj.user_settings_json = this.window.btoa(
        JSON.stringify(dataObj.user_settings_json)
      );
      if (this.widgetChartInfoGblObject.allWidgetInstanceOfUser.length > 0) {
        dataObj.widgetDefinitionId = this.widgetChartInfoGblObject.allWidgetInstanceOfUser[0].widgetDefinitionId;

        // this.widgetChartInfoGblObject.widgetLoader = true;
        this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
          currentIndex
        ].widgetSpinner = true;
        this._caseService.updateWidgetDefinition(dataObj).pipe(
            map((data) => {
              data.data.data = data.data.data.map((o) => ({
                ...o,
                x: o.x ? this.translateService.instant(o.x) : ''
              }))
              return data;
            })
        ).subscribe(
          (resp: any) => {
            if (resp) {
              this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                currentIndex
              ].widgetSpinner = false;
              // this.getAllInstanceOfUserWidgets()
              if (resp.data && resp.data["data"] && resp.data["data"].length) {
                (this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                  currentIndex
                ].user_settings_json =
                  resp && resp.user_settings_json ? resp.user_settings_json : ""),
                  (this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                    currentIndex
                  ].data = resp && resp.data ? resp.data : {}),
                  (this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                    currentIndex
                  ].widgetId = resp && resp.widget_id ? resp.widget_id : ""),
                  (settingsInfo =
                    this.widgetChartInfoGblObject.allWidgetInstanceOfUser &&
                    this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                      currentIndex
                    ] &&
                    this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                      currentIndex
                    ].user_settings_json
                      ? JSON.parse(
                          this.window.atob(
                            this.widgetChartInfoGblObject
                              .allWidgetInstanceOfUser[currentIndex]
                              .user_settings_json
                          )
                        )
                      : {});
                this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                  currentIndex
                ].widgetName = settingsInfo.widgetName;

                // Adding a new key to hold full widget filter data - ASHEN
                this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                  currentIndex
                ].WidgetFilterDataObj = settingsInfo.widgetFilters;
                Chartobj = {
                  widgetId:
                    this.widgetChartInfoGblObject.allWidgetInstanceOfUser &&
                    this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                      currentIndex
                    ] &&
                    this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                      currentIndex
                    ].widget_id
                      ? this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                          currentIndex
                        ].widget_id
                      : "",
                  xAxisTitle:
                    settingsInfo && settingsInfo.showXAxisSubTitle
                      ? settingsInfo && settingsInfo.xAxisSubTitle
                      : "",
                  yAxisTitle:
                    settingsInfo && settingsInfo.showYAxisSubTitle
                      ? settingsInfo && settingsInfo.yAxisSubTitle
                      : "",
                  widgetName: this.widgetChartInfoGblObject
                    .allWidgetInstanceOfUser[currentIndex].widgetName,
                };
                this.widgetChartInfoGblObject.allWidgetInstanceOfUser.forEach(
                  (element, i) => {
                    this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                      i
                    ].displayWidgetFilterData = [];

                    let Info =
                      this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                        i
                      ] &&
                      this.widgetChartInfoGblObject.allWidgetInstanceOfUser[i]
                        .user_settings_json
                        ? JSON.parse(
                            this.window.atob(
                              this.widgetChartInfoGblObject
                                .allWidgetInstanceOfUser[i].user_settings_json
                            )
                          )
                        : {};
                    if (
                      Info &&
                      Info.widgetFilters &&
                      Object.keys(Info.widgetFilters).length > 0
                    ) {
                      let keys = Object.keys(Info.widgetFilters);
                      keys.forEach((key) => {
                        let data = Info.widgetFilters[key].map((j) => {
                          return j.displayName;
                        });
                        this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                          i
                        ].displayWidgetFilterData.push(...data);
                      });
                    }
                  }
                );

                setTimeout(() => {
                  this.manipulateChartData(resp.data["data"], Chartobj);
                }, 0);
              } else {
                if (
                  resp.data &&
                  resp.data["data"] &&
                  resp.data["data"].length == 0
                ) {
                  this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                    currentIndex
                  ].data = resp.data;
                }
              }
            }
          },
          (error) => {
            let data = { data: [] };
            this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
              currentIndex
            ].widgetSpinner = false;
            this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
              currentIndex
            ].data = data;
          }
        );
      }
      // else if (this.widgetChartInfoGblObject.allWidgetInstanceOfUser.length == 0) {
      //   this._caseService.createWidgetDefinition(dataObj).subscribe((resp: any) => {
      //     if (resp) {

      //       // this.widgetChartInfoGblObject.WidgetChartData = resp && resp.data ? resp.data : [];
      //       if (resp.data && resp.data['data'] && resp.data['data'].length) {
      //         this.manipulateChartData(resp.data['data'], resp.widgetId)
      //       }

      //       let respData = resp && resp.user_settings_json ? JSON.parse(this.window.atob(resp.user_settings_json)) : {};
      //       this.widgetChartInfoGblObject.widgetFilterData = respData;
      //       this.bindWidgetSettingsFilterData(respData);
      //       // this.stackedBarOption(this.widgetChartInfoGblObject.WidgetChartData);
      //     }
      //   })
      // }
      this.widgetChartInfoGblObject.widgetpanel = false;
      this._commonService.addNewWidgetBehavior.next(false);
      // this.widgetChartInfoGblObject.widgetgraphTitle = JSON.parse(JSON.stringify(this.widgetChartInfoGblObject.widgetsideBargraphTitle));
    }
  }

  /*
   * Purpose :Edit widget name Title
   * Author : shravani
   * Date : 15-Aug-2020
   */
  editWidgetName(index) {
    this.widgetChartInfoGblObject.currentWidgetIndex = index;
    this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
      index
    ].editTitle = false;
    this.widgetChartInfoGblObject.copyWidgetTitle =
      this.widgetChartInfoGblObject.allWidgetInstanceOfUser[index] &&
      this.widgetChartInfoGblObject.allWidgetInstanceOfUser[index].widgetName
        ? this.widgetChartInfoGblObject.allWidgetInstanceOfUser[index]
            .widgetName
        : "";
    // this.widgetChartInfoGblObject.copyWidgetTitle = JSON.parse(JSON.stringify(this.widgetChartInfoGblObject.widgetgraphTitle));
  }

  /*
   * Purpose : Save widget name title
   * Author : shravani
   * Date : 15-Aug-2020
   */
  saveWidgetName(index) {
    this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
      index
    ].editTitle = true;
    // this.widgetChartInfoGblObject.widgetsideBargraphTitle = JSON.parse(JSON.stringify(this.widgetChartInfoGblObject.widgetgraphTitle))
    this.widgetChartInfoGblObject.activeWidgetId =
      this.widgetChartInfoGblObject.allWidgetInstanceOfUser &&
      this.widgetChartInfoGblObject.allWidgetInstanceOfUser[index] &&
      this.widgetChartInfoGblObject.allWidgetInstanceOfUser[index].widget_id
        ? this.widgetChartInfoGblObject.allWidgetInstanceOfUser[index].widget_id
        : "";
    this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
      index
    ].widgetDefinitionId = this.widgetChartInfoGblObject.widgetsideBargraphTitle;

    // Commented due to chart overwrite issue - AShen
    // this.applyWidgetSettings(false);

    // Added by ASHEN to fix the widget overwrite issue
    let jsonSettingsData = JSON.parse(
      this.window.atob(
        this.widgetChartInfoGblObject.allWidgetInstanceOfUser[index]
          .user_settings_json
      )
    );

    let updatedWigetName = this.widgetChartInfoGblObject
      .allWidgetInstanceOfUser[index].widgetName;
    jsonSettingsData.widgetName = updatedWigetName;

    //Overiding with updated settings
    this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
      index
    ].user_settings_json = this.window.btoa(JSON.stringify(jsonSettingsData));

    let dataObj: any = {
      user_settings_json: this.window.btoa(JSON.stringify(jsonSettingsData)),
      dashboardId: this.widgetChartInfoGblObject.activedasboardId,
      widgetId: this.widgetChartInfoGblObject.allWidgetInstanceOfUser[index]
        .widget_id,
    };

    //Updating Widget settings and reload chart
    this.updateWidgetJSONSettings(dataObj, index);
  }

  /*
   * Purpose :cancel edited widget name
   * Author : shravani
   * Date : 15-Aug-2020
   */
  cancelEditWidgetName(index) {
    this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
      index
    ].editTitle = true;
    // this.widgetChartInfoGblObject.editWidgetChartName = true;
    this.widgetChartInfoGblObject.widgetgraphTitle = this.widgetChartInfoGblObject.copyWidgetTitle;
    this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
      index
    ].widgetName = this.widgetChartInfoGblObject.copyWidgetTitle;
  }

  /*
   * Purpose :binding the widget data
   * Author : shravani
   * Date : 15-Aug-2020
   */
  bindWidgetSettingsFilterData(respData) {
    if (Object.keys(respData).length != 0) {
      this.widgetChartInfoGblObject.widgetsideBargraphTitle =
        respData && respData.widgetName ? respData.widgetName : "";
      this.widgetChartInfoGblObject.widgetgraphTitle =
        respData && respData.widgetName ? respData.widgetName : "";
      this.widgetChartInfoGblObject.selectedEntityType =
        respData && respData.entityType ? respData.entityType : "";
      this.widgetChartInfoGblObject.selectedGraphType =
        respData && respData.widgetType ? respData.widgetType : "";
      this.widgetChartInfoGblObject.selectedPeriod =
        respData && respData.xAxis && respData.xAxis.groupBy
          ? respData.xAxis.groupBy
          : "";
      this.onChangexAxisPeriod();
      this.widgetChartInfoGblObject.selectedPeriodType =
        respData && respData.xAxis && respData.xAxis.groupbyType
          ? respData.xAxis.groupbyType
          : "";
      this.widgetChartInfoGblObject.numberOfPeriodsFilter =
        respData && respData.xAxis && respData.xAxis.numberOfPeriods
          ? respData.xAxis.numberOfPeriods
          : 0;
      this.widgetChartInfoGblObject.selectedYAxisattribute =
        respData && respData.yAxis && respData.yAxis.attribute
          ? respData.yAxis.attribute
          : "";
      this.widgetChartInfoGblObject.selectedAggrigateType =
        respData && respData.yAxis && respData.yAxis.aggregationType
          ? respData.yAxis.aggregationType == "total"
            ? "count"
            : respData.yAxis.aggregationType
          : "";
      this.widgetChartInfoGblObject.showXsubTitleIndicator =
        respData && respData.showXAxisSubTitle
          ? respData.showXAxisSubTitle
          : "";
      this.widgetChartInfoGblObject.showYsubTitleIndicator =
        respData && respData.showYAxisSubTitle
          ? respData.showYAxisSubTitle
          : "";
      this.widgetChartInfoGblObject.showXsubTitle =
        respData && respData.xAxisSubTitle ? respData.xAxisSubTitle : "";
      this.widgetChartInfoGblObject.showYsubTitle =
        respData && respData.yAxisSubTitle ? respData.yAxisSubTitle : "";
      let widgetFilterdata =
        respData && respData.widgetFilters ? respData.widgetFilters : {};
      this.bindingWidgetFilters(widgetFilterdata);
    }
  }

  /*
   * Purpose :Get widget Info by the widgetid
   * Author : shravani
   * Date : 20-Aug-2020
   */
  getDetailsByWidgetId(widgetId) {
    if (widgetId) {
      this._caseService.getWidgetDataById(widgetId).subscribe((resp: any) => {
        if (resp) {
          let respData =
            resp && resp.user_settings_json
              ? JSON.parse(this.window.atob(resp.user_settings_json))
              : {};
          if (resp.data && resp.data["data"] && resp.data["data"].length) {
            // this.manipulateChartData( resp.data['data']);
          }
          this.widgetChartInfoGblObject.widgetFilterData = respData;
          this.bindWidgetSettingsFilterData(respData);
        }
      });
    }
  }

  /*
   * Purpose :show the widget setting feilds based on the API resp
   * Author : shravani
   * Date : 20-Aug-2020
   */
  showWidgetSettingsTabFeilds(data) {
    if (Object.keys(data).length > 0) {
      return true;
    } else {
      return false;
    }
  }

  /*
   * Purpose :Manipulate The chart Data
   * Author : Amritesh
   * Date : 20-Aug-2020
   */
  manipulateChartData(data: any, widgetData) {
    // var keys =data.reduce((acc,val)=>{
    //   acc = acc.concat(Object.keys(val))
    //   return acc
    //   },[]).filter(val=> val != 'x');

    //   data.forEach((val)=>{
    //     var innerarr =[];
    //     keys.forEach((key)=>{
    //       innerarr.push({
    //              time: key,
    //               y: val[key] ? val[key] : 0,
    //               type:val.x

    //             });
    //     })
    //     this.widgetChartInfoGblObject.WidgetChartData.push(innerarr);
    //   })
    //   this.stackedBarOption(this.widgetChartInfoGblObject.WidgetChartData);
    // data =[
    //   {
    //     "New": "2",
    //     "Submitted": "0",
    //     "Returned": "0",
    //     "Outreach - Pending Review": "0",
    //     "Hold-Pending Review": "0",
    //     "Escalation": "0",
    //     "Clarification": "0",
    //     "Research": "0",
    //     "Cancelled": "0",
    //     "Returned-Pending Review": "0",
    //     "Abandoned": "0",
    //     "Accepted": "0",
    //     "Clarification- Pending Review": "0",
    //     "Submit-Pending Review": "0",
    //     "Escalation - Pending Review": "0",
    //     "Outreach": "0",
    //     "Hold": "0",
    //     "x": "New"
    //   },
    //   {
    //     "New": "2",
    //     "Submitted": "4",
    //     "Returned": "0",
    //     "Outreach - Pending Review": "0",
    //     "Hold-Pending Review": "0",
    //     "Escalation": "0",
    //     "Clarification": "0",
    //     "Research": "0",
    //     "Cancelled": "0",
    //     "Returned-Pending Review": "0",
    //     "Abandoned": "2",
    //     "Accepted": "0",
    //     "Clarification- Pending Review": "0",
    //     "Submit-Pending Review": "0",
    //     "Escalation - Pending Review": "0",
    //     "Outreach": "0",
    //     "Hold": "0",
    //     "x": "client"
    //   }
    // ]
    iif(() => !!this.translateService.currentLang, of(this.translateService.currentLang), this.translateService.onLangChange).subscribe(() => {
      this.widgetChartInfoGblObject.WidgetChartData = Object.keys(data[0])
          .map((type) => {
            if (type && type !== "x") {
              return data.map((d) => {
                return { time: d.x, y: +d[type]==0?+d[type]:+d[type], type: this.translateService.instant(type) };
              });
            }
          })
          .filter((val) => val);

      // New Legend Color Data - ASHEN - AP-822
      let arrayTypeColorSet = [];
      Object.keys(data[0]).map(function (type) {
        if (type && type !== "x") {
          data.map(function (d) {
            if (d[type] > 0) {
              let typeExist = arrayTypeColorSet.filter((element) => {
                return element.type == type;
              });
              if (typeExist.length == 0) {
                arrayTypeColorSet.push({ type: type });
              }
            }
          });
        }
      });

      const themeColors = GlobalConstants.globalThemeColors;

      for (let index = 0; index < arrayTypeColorSet.length; index++) {
        const element = arrayTypeColorSet[index];
        if (themeColors[index]) {
          element.color = themeColors[index];
        } else {
          element.color = "red";
        }
      }

      widgetData.arrayTypeColorSet = arrayTypeColorSet.map((o) => ({
        ...o,
        type: this.translateService.instant(o.type)
      }));
      this.stackedBarOption(
          this.widgetChartInfoGblObject.WidgetChartData,
          widgetData
      );
    });
  }

  /*
   * Purpose :Onclick filter icon open filter sidebar
   * Author : shravani
   * Date : 26-Aug-2020
   */
  filterWidgetSettings(widget, index) {
    this.isFilterWidgetViewPermissionEnabled =false;
    this.isWidgetSettingViewPermissionEnabled =false;
    const widgetFIlteringPermission = this._commonService.getDomainPermissions(this.caseWorkBenchPermissionJSON, 'widgetFiltering');
    const widgetFilteringPermissionLevel = this._commonService.getPermissionStatusType(widgetFIlteringPermission);

    if(widget && widgetFilteringPermissionLevel && widgetFilteringPermissionLevel=='view'){
      this.isFilterWidgetViewPermissionEnabled =true;
    }
    this.widgetChartInfoGblObject.widgetpanel = true;
    this.widgetChartInfoGblObject.widgetSettingsFlag = false;
    this.widgetChartInfoGblObject.widgetFilterFlag = true;
    this.widgetChartInfoGblObject.activeWidget = widget;
    this.widgetChartInfoGblObject.activedasboardId =
      this.widgetChartInfoGblObject.activeWidget &&
      this.widgetChartInfoGblObject.activeWidget.dashboardId
        ? this.widgetChartInfoGblObject.activeWidget.dashboardId
        : null;
    this.widgetChartInfoGblObject.activeWidgetId =
      this.widgetChartInfoGblObject.activeWidget &&
      this.widgetChartInfoGblObject.activeWidget.widget_id
        ? this.widgetChartInfoGblObject.activeWidget.widget_id
        : "";
    let respData =
      this.widgetChartInfoGblObject.activeWidget &&
      this.widgetChartInfoGblObject.activeWidget.user_settings_json
        ? JSON.parse(
            this.window.atob(
              this.widgetChartInfoGblObject.activeWidget.user_settings_json
            )
          )
        : {};

    if (
      this.widgetChartInfoGblObject.activeWidget.data &&
      this.widgetChartInfoGblObject.activeWidget.data["data"] &&
      this.widgetChartInfoGblObject.activeWidget.data["data"].length
    ) {
      this.widgetChartInfoGblObject.widgetFilterData = respData;
      this.bindWidgetSettingsFilterData(respData);
    }
    this.widgetChartInfoGblObject.currentWidgetIndex = index;
    this.widgetChartInfoGblObject.widgetpanel = true;
    this._commonService.addNewWidgetBehavior.next(true);
  }

  /*
   * Purpose :multiselect droprdown (on select the status)
   * Author : shravani
   * Date : 27-Aug-2020
   */
  onStatusItemSelect(item) {
    if (
      this.widgetChartInfoGblObject.statusFiltersList &&
      this.widgetChartInfoGblObject.statusFiltersList.length > 0
    ) {
      let matchStatus = this.widgetChartInfoGblObject.statusFiltersList.filter(
        (status) => status.key === item.key
      );
      if (matchStatus.length > 0) {
      } else {
        this.getItemListInfo(item);
      }
    } else {
      this.getItemListInfo(item);
    }
  }

  /*
   * Purpose :multiselect droprdown (on deselect the status)
   * Author : shravani
   * Date : 27-Aug-2020
   */
  onStatusItemDeSelect(item) {
    if (
      this.widgetChartInfoGblObject.statusFiltersList &&
      this.widgetChartInfoGblObject.statusFiltersList.length > 0
    ) {
      // let index = this.widgetChartInfoGblObject.statusFiltersList.indexOf(item.key);
      // if (index > -1) {
      //   this.widgetChartInfoGblObject.statusFiltersList.splice(index, 1);
      // }
      this.widgetChartInfoGblObject.statusFiltersList.forEach((element, i) => {
        if (element.key === item.key) {
          this.widgetChartInfoGblObject.statusFiltersList.splice(i, 1);

          // Removing the selected data by index - AP-939 ASHEN
          if (this.widgetChartInfoGblObject.selectedFilterStatusData[i]) {
            this.widgetChartInfoGblObject.selectedFilterStatusData.splice(i, 1);
          }

          if (
            this.widgetChartInfoGblObject.widgetFilterInfo &&
            Object.keys(this.widgetChartInfoGblObject.widgetFilterInfo).length
          ) {
            if (this.widgetChartInfoGblObject.widgetFilterInfo[item.key]) {
              delete this.widgetChartInfoGblObject.widgetFilterInfo[item.key];
            }
          }
        }
      });

      // Removing added filter, this approch needed to update ng-multiselect-dropdown - AP-939 ASHEN
      for (
        let index = 0;
        index < this.widgetChartInfoGblObject.selectedStatus.length;
        index++
      ) {
        const element = this.widgetChartInfoGblObject.selectedStatus[index];
        if (element.key == item.key) {
          this.widgetChartInfoGblObject.selectedStatus.splice(index, 1);
        }
      }

      // Reassiging due to splice did not update DOM ng-multiselect-dropdown - Delete Button - AP-939 ASHEN
      const editedStatuses = Object.assign(
        [],
        this.widgetChartInfoGblObject.selectedStatus
      );
      this.widgetChartInfoGblObject.selectedStatus = editedStatuses;
    }
  }

  /*
   * Purpose :Selected status dropdowns dynamically
   * Author : shravani
   * Date : 01-Sep-2020
   */
  onSelectedFilterStatus(flag, j, filterKey, item) {
    if (item && filterKey) {
      if (
        this.widgetChartInfoGblObject.widgetFilterInfo &&
        Object.keys(this.widgetChartInfoGblObject.widgetFilterInfo).length
      ) {
        let keys = Object.keys(this.widgetChartInfoGblObject.widgetFilterInfo);
        if (keys.length) {
          let index = keys.indexOf(filterKey);
          if (index > -1) {
            this.widgetChartInfoGblObject.widgetFilterInfo[filterKey].push(
              item
            );
          } else {
            this.widgetChartInfoGblObject.widgetFilterInfo[filterKey] = [];
            this.widgetChartInfoGblObject.widgetFilterInfo[filterKey].push(
              item
            );
          }
        }
      } else {
        this.widgetChartInfoGblObject.widgetFilterInfo[filterKey] = [];
        this.widgetChartInfoGblObject.widgetFilterInfo[filterKey].push(item);
      }
      if (flag) {
        this.widgetChartInfoGblObject.selectedFilterStatusData[
          j
        ] = this.widgetChartInfoGblObject.widgetFilterInfo[filterKey];
      }
    }
  }

  /*
   * Purpose :Deselected status dropdowns dynamically
   * Author : shravani
   * Date : 01-Sep-2020
   */
  onDeselectFilterStatus(j, filterKey, item) {
    if (filterKey && item) {
      if (
        this.widgetChartInfoGblObject.widgetFilterInfo &&
        Object.keys(this.widgetChartInfoGblObject.widgetFilterInfo).length
      ) {
        if (this.widgetChartInfoGblObject.widgetFilterInfo[filterKey]) {
          this.widgetChartInfoGblObject.widgetFilterInfo[filterKey].forEach(
            (element, i) => {
              if (element.displayName === item.displayName) {
                this.widgetChartInfoGblObject.widgetFilterInfo[
                  filterKey
                ].splice(i, 1);
              }
            }
          );
        }
      }
    }
  }
  // {"entityType":"case","widgetName":"Widget 1","widgetType":"Stacked Column Chart","xAxis":{"groupBy":"case status","groupbyType":"","numberOfPeriods":""},"yAxis":{"attribute":"Case Type","aggregationType":"count"},"showXAxisSubTitle":false,"showYAxisSubTitle":true,"xAxisSubTitle":"case status","yAxisSubTitle":"case type","widgetFilters":{"status":[{"key":"new","value":"New"},{"key":"holdPendingReview","value":"QA Review for Screening"}],"risk":[{"key":"new","value":"New"},{"key":"holdPendingReview","value":"QA Review for Screening"}],"priority":[{"key":"new","value":"New"},{"key":"holdPendingReview","value":"QA Review for Screening"}]}}

  /*
   * Purpose :On page loage binding the status dropdown data
   * Author : shravani
   * Date : 01-Sep-2020
   */
  bindingWidgetFilters(filterData) {
    this.widgetChartInfoGblObject.selectedStatus = [];
    this.widgetChartInfoGblObject.widgetFilterInfo = {};
    this.widgetChartInfoGblObject.statusFiltersList = [];
    this.widgetChartInfoGblObject.selectedFilterStatusData = [];
    if (Object.keys(filterData).length > 0) {
      let keys = Object.keys(filterData);
      if (keys && keys.length > 0) {
        keys.forEach((ele, i) => {
          let matchedIndex = this.widgetChartInfoGblObject.statusList.findIndex(
            (item) => item.key == ele
          );
          if (matchedIndex !== -1) {
            let data = {
              key: this.widgetChartInfoGblObject.statusList[matchedIndex].key,
              value: this.widgetChartInfoGblObject.statusList[matchedIndex]
                .value,
            };
            setTimeout(() => {
              this.onStatusItemSelect(data);
            }, 100);
            this.widgetChartInfoGblObject.selectedStatus.push(data);
            filterData[ele].forEach((item, j) => {
              let filterObj = {};
              filterObj["listItemId"] = item.listItemId;
              filterObj["displayName"] = item.displayName;
              filterObj["key"] = item.key;
              this.onSelectedFilterStatus(true, i, ele, filterObj);
            });
          }
        });
      }
    }
  }

  /*
   * Purpose :API call for the selected status
   * Author : shravani
   * Date : 01-Sep-2020
   */
  getItemListInfo(item: any): void {
    const fetchFromMasterDataKeys = [
      "case status",
      "Jurisdictions",
      "Uplift",
      "Region Uplift",
      "Assignee",
    ];

    if (
      !this.isEmptyObject(item) &&
      item.hasOwnProperty("key") &&
      fetchFromMasterDataKeys.includes(item.key)
    ) {
      let widgetFilterData = [];
      const entityMatch = (this.widgetChartInfoGblObject.entityMatch || []) as WidgetMasterEntity[];
      if (
        entityMatch.length > 0 &&
        entityMatch[0].x_axis
      ) {
        const groupXAxisFilterData = entityMatch[0].x_axis;
        const filterGroupSet = groupXAxisFilterData.filter((group) => {
          return group.group_by.key == item.key;
        });

        if (filterGroupSet.length > 0 && filterGroupSet[0].groupby_type) {
          widgetFilterData = filterGroupSet[0].groupby_type
            .filter(el => el.value && el.key)
            .map(el => ({
              allowDelete: true,
              code: el.key,
              colorCode: "f28618",
              displayName: el.value ? this.translateService.instant(el.value) : '',
              file_id: null,
              flagName: null,
              icon: "ban",
              listItemId: el.key,
              selected: false,
              listType: item.key,
              key: el.key,
            }));
        }
      }

      item.options = widgetFilterData;
      item.multiSelectSettingList = {
        singleSelection: false,
        idField: "key",
        textField: "displayName",
        itemsShowLimit: 2,
        selectAllText: "Select All",
        unSelectAllText: "UnSelect All",
        placeholder: "Status",
        enableCheckAll: false,
      };
      this.widgetChartInfoGblObject.statusFiltersList.push(item);

      return;
    }
    this.widgetChartInfoGblObject.statusFiltersList.push(item);
    if(item.key == "User Group"){
      this._caseService.getAllUserGroupsAPI().subscribe((resp: any) => {
       if (resp) {
        resp = resp.map(({ name,id, ...e }) => ({ ...e,displayName: name , key:id }));
        item.options = resp.map((o) => ({
          ...o,
          displayName: this.translateService.instant(o.displayName)
        }));
        item.multiSelectSettingList = {
          singleSelection: false,
          idField: "key",
          textField: "displayName",
          itemsShowLimit: 2,
          selectAllText: "Select All",
          unSelectAllText: "UnSelect All",
          placeholder: "Status",
          enableCheckAll: false,
        };

          let foundIndex = this.widgetChartInfoGblObject.statusFiltersList.findIndex(x => x.key == item.key);
          this.widgetChartInfoGblObject.statusFiltersList[foundIndex] = item;
          this.widgetChartInfoGblObject.dataLoaded = false;
          setTimeout(() => {
            this.widgetChartInfoGblObject.dataLoaded = true;
          }, 0);
      }

     });

     }
   else{
    this._caseService.getItemList(item.key).subscribe((resp: any) => {
       if (resp) {
        item.options = resp.map((o) => ({
          ...o,
          displayName: this.translateService.instant(o.displayName)
        }));
        item.multiSelectSettingList = {
          singleSelection: false,
          idField: "listItemId",
          textField: "displayName",
          itemsShowLimit: 2,
          selectAllText: "Select All",
          unSelectAllText: "UnSelect All",
          placeholder: "Status",
          enableCheckAll: false,
        };

          let foundIndex = this.widgetChartInfoGblObject.statusFiltersList.findIndex(x => x.key == item.key);
          this.widgetChartInfoGblObject.statusFiltersList[foundIndex] = item;
          this.widgetChartInfoGblObject.dataLoaded = false;
          setTimeout(() => {
            this.widgetChartInfoGblObject.dataLoaded = true;
          }, 0);
      }
    });
  }
  }

  /*
   * Purpose : Calling exportChart - HTML2Canvas funtion inside stackedtime.js
   * Author : Ashen
   * Date : 10-Sep-2020
   */
  exportChart(element_id, widget_name, type) {
    StackedBarModule.exportChart(element_id, widget_name, type);
  }

  /*
   * Purpose : Period type Validations -  Map with the numberOfPeriods by using the selectedPeriodType
   * Author : Ashen
   * Date : 15-Sep-2020
   */
  getPeriodValidationMax() {
    if (
      this.widgetChartInfoGblObject.selectedPeriod.toLowerCase() == "period"
    ) {
      let selectedPeriodType = this.widgetChartInfoGblObject.selectedPeriodType;
      let periodValidationData = this.widgetChartInfoGblObject.periodDetails.filter(
        function (element) {
          //Checking if period related data is available
          if (element.group_by.key == "period") {
            return element;
          }
        }
      );

      // Fetching the period validation group data by selected period type
      if (periodValidationData.length > 0) {
        let groupValidationData = periodValidationData[0].number_of_periods.filter(
          function (groupdata) {
            return groupdata.type == selectedPeriodType;
          }
        );

        if (groupValidationData.length > 0) {
          this.widgetChartInfoGblObject["periodSliderValidations"] =
            groupValidationData[0];
        } else {
          this.widgetChartInfoGblObject["periodSliderValidations"] = {
            periodMin: 1,
            periodMax: 1,
            showText: "",
          };
        }

        // Reset selected period value to periodMin
        if (
          this.widgetChartInfoGblObject.numberOfPeriodsFilter <
          this.widgetChartInfoGblObject.periodSliderValidations.periodMin
        ) {
          this.widgetChartInfoGblObject.numberOfPeriodsFilter = this.widgetChartInfoGblObject.periodSliderValidations.periodMin;
        }

        // Reset selected period value to periodMax
        if (
          this.widgetChartInfoGblObject.numberOfPeriodsFilter >
          this.widgetChartInfoGblObject.periodSliderValidations.periodMax
        ) {
          this.widgetChartInfoGblObject.numberOfPeriodsFilter = this.widgetChartInfoGblObject.periodSliderValidations.periodMax;
        }
      }
    }
  }

  /*
   * Purpose : Clear all filters applied to a widget - Clear Filter Button click
   * Author : Ashen
   * Date : 17-Sep-2020
   */
  clearWidgetFilters(index, type, filterName) {
    let jsonSettingsData = JSON.parse(
      this.window.atob(
        this.widgetChartInfoGblObject.allWidgetInstanceOfUser[index]
          .user_settings_json
      )
    );

    if (type == "SINGLE") {
      // Removing current widget filter with filter name
      delete jsonSettingsData.widgetFilters[filterName];
    } else {
      // Removing current widget all filter data
      jsonSettingsData.widgetFilters = {};
    }

    //Overiding with updated settings
    this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
      index
    ].user_settings_json = this.window.btoa(JSON.stringify(jsonSettingsData));

    let dataObj: any = {
      user_settings_json: this.window.btoa(JSON.stringify(jsonSettingsData)),
      dashboard_id: this.widgetChartInfoGblObject.activedasboardId ? this.widgetChartInfoGblObject.activedasboardId : null,
      widget_id: this.widgetChartInfoGblObject.allWidgetInstanceOfUser[index]
        .widget_id,
    };

    // Reset Wiget Filters
    this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
      index
    ].WidgetFilterDataObj = [];

    this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
      index
    ].displayWidgetFilterData = [];

    this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
      index
    ].WidgetFilterDataObj = [];

    //Updating Widget settings and reload chart
    this.updateWidgetJSONSettings(dataObj, index);
  }

  /*
   * Purpose : Update Widget settings and reload chart
   * Author : Ashen
   * Date : 17-Sep-2020
   */
  updateWidgetJSONSettings(dataObj, index) {
    let settingsInfo: any;
    let Chartobj: any;
    let currentIndex = index;
    this._caseService.updateWidgetDefinition(dataObj).subscribe(
      (resp: any) => {
        if (resp) {
          this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
            currentIndex
          ].widgetSpinner = false;
          // this.getAllInstanceOfUserWidgets()
          if (resp.data && resp.data["data"] && resp.data["data"].length) {
            (this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
              currentIndex
            ].user_settings_json =
              resp && resp.user_settings_json ? resp.user_settings_json : ""),
              (this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                currentIndex
              ].data = resp && resp.data ? resp.data : {}),
              (this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                currentIndex
              ].widgetId = resp && resp.widget_id ? resp.widget_id : ""),
              (settingsInfo =
                this.widgetChartInfoGblObject.allWidgetInstanceOfUser &&
                this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                  currentIndex
                ] &&
                this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                  currentIndex
                ].user_settings_json
                  ? JSON.parse(
                     this.window.atob(
                        this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                          currentIndex
                        ].user_settings_json
                      )
                    )
                  : {});
            this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
              currentIndex
            ].widgetName = settingsInfo.widgetName;

            // Adding a new key to hold full widget filter data - ASHEN
            this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
              currentIndex
            ].WidgetFilterDataObj = settingsInfo.widgetFilters;

            Chartobj = {
              widgetId:
                this.widgetChartInfoGblObject.allWidgetInstanceOfUser &&
                this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                  currentIndex
                ] &&
                this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                  currentIndex
                ].widget_id
                  ? this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                      currentIndex
                    ].widget_id
                  : "",
              xAxisTitle:
                settingsInfo && settingsInfo.showXAxisSubTitle
                  ? settingsInfo && settingsInfo.xAxisSubTitle
                  : "",
              yAxisTitle:
                settingsInfo && settingsInfo.showYAxisSubTitle
                  ? settingsInfo && settingsInfo.yAxisSubTitle
                  : "",
              widgetName: this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                currentIndex
              ].widgetName,
            };

            if (
              settingsInfo &&
              settingsInfo.widgetFilters &&
              Object.keys(settingsInfo.widgetFilters).length > 0
            ) {
              let keys = Object.keys(settingsInfo.widgetFilters);
              keys.forEach((key) => {
                let data = settingsInfo.widgetFilters[key].map((j) => {
                  return j.displayName;
                });
                this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                  currentIndex
                ].displayWidgetFilterData.push(...data);
              });
            }

            setTimeout(() => {
              this.manipulateChartData(resp.data["data"], Chartobj);
            }, 0);
          } else {
            if (
              resp.data &&
              resp.data["data"] &&
              resp.data["data"].length == 0
            ) {
              this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
                currentIndex
              ].data = resp.data;
            }
          }
        }
      },
      (error) => {
        let data = { data: [] };
        this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
          currentIndex
        ].widgetSpinner = false;
        this.widgetChartInfoGblObject.allWidgetInstanceOfUser[
          currentIndex
        ].data = data;
      }
    );
  }

  /**Method:To get the case permission ids
   * Author : shravani
   * Date : 17-Sep-2020
   */
  getCaseListPermssionIds() {
    const permissions: any[] = this.sharedService.getPermissions();
    if (permissions.length) {
      this.caseWorkBenchPermissionJSON = permissions[1].caseManagement.caseDashboard;
    }
  }

  /**Method: To remove unwanted filter options
   * Author : Ashen
   * Date : 22-Sep-2020
   */
  filterValidation(data) {
    const dataClone = Object.assign([], data);
    let periodPos = dataClone
      .map(function (e) {
        return e.key;
      })
      .indexOf("period");

    if (periodPos != -1) {
      delete dataClone[periodPos];
    }

    return dataClone;
  }

  getPeriodDetailsInSettings(settingsData) {
    let jsonData = settingsData ? JSON.parse(this.window.atob(settingsData)) : {};
    // Preparing the period badge text
    if (jsonData && jsonData.x_axis && jsonData.x_axis.group_by) {
      if (
        jsonData.x_axis.group_by.toLowerCase() == "period" &&
        jsonData.x_axis.groupby_type &&
        jsonData.x_axis.number_of_periods
      ) {
        let periodShowText = "";

        //fetching textvalue of period type
        let periodValidationData = this.widgetChartInfoGblObject.periodDetails.filter(
          function (element) {
            //Checking if period related data is available
            if (element.groupBy.key.toLowerCase() == "period") {
              return element;
            }
          }
        );

        // Fetching the period validation group data by selected period type
        if (periodValidationData.length > 0 && jsonData.x_axis.groupby_type) {
          let groupValidationData = periodValidationData[0].number_of_periods.filter(
            function (groupdata) {
              return groupdata.groupbyType == jsonData.x_axis.groupby_type;
            }
          );

          if (groupValidationData.length > 0) {
            periodShowText = groupValidationData[0].showText
              ? groupValidationData[0].showText
              : "";
          }
        }

        return (
          "Period: Last " +
          jsonData.x_axis.number_of_periods +
          " " +
          periodShowText
        );
      }
    }

    return "";
  }

  /*
   * Purpose : Create new widget with default settings
   * Date : 14-Oct-2020
   * Author : Ashen
   */

  createNewWidget(save) {
    let dataObj: any = {
      // widgetName: save ? this.widgetChartInfoGblObject.widgetsideBargraphTitle : this.widgetChartInfoGblObject.widgetgraphTitle,
      user_settings_json: {
        entityType: "case",
        // widgetName: save ? this.widgetChartInfoGblObject.widgetsideBargraphTitle : this.widgetChartInfoGblObject.widgetgraphTitle,
        widgetName: this.translateService.instant('New Widget'),
        widgetType: "Stacked Column Chart",
        xAxis: {
          groupBy: "Case Risk",
          groupbyType: "",
          numberOfPeriods: "",
        },
        yAxis: {
          attribute: "Case Priority",
          aggregationType: "count",
        },
        showXAxisSubTitle: false,
        showYAxisSubTitle: false,
        xAxisSubTitle: "",
        yAxisSubTitle: "",
        widgetFilters: {},
      },
    };

    if (
      dataObj &&
      dataObj.user_settings_json.entityType &&
      dataObj.user_settings_json.widgetType &&
      dataObj.user_settings_json.xAxis &&
      dataObj.user_settings_json.xAxis.groupBy &&
      dataObj.user_settings_json.yAxis.aggregationType
    ) {
      dataObj.user_settings_json = this.window.btoa(
        JSON.stringify(dataObj.user_settings_json)
      );
      this._caseService.updateWidgetDefinition(dataObj).subscribe(
        (resp: any) => {
          if (resp && resp.widget_id) {
            this._commonService.addNewWidgetBehavior.next(true);
            this.getAllInstanceOfUserWidgets(resp.widget_id);

            //Resetting add new widget service
            this._commonService.clearNewWidgetStatus();
          }
        },
        (error) => {
          this._commonService.setAddWidgetBtnDisableStatus(false);
        }
      );
      this.widgetChartInfoGblObject.widgetpanel = false;
    } else {
      this._commonService.setAddWidgetBtnDisableStatus(false);
    }
  }

  deleteWidget(widget, index) {
    let widgetName =
      widget && widget.widgetName ? widget.widgetName : "this widget";
    // let's call our delete modal window
    const dialogRef = this.dialog.open(CaseWidgetDeleteComponent, {
      maxWidth: "400px",
      data: {
        message: widgetName,
        ctype: "widget_delete",
      },
    });

    // listen to response
    dialogRef.afterClosed().subscribe((dialogResult) => {
      // if user pressed yes dialogResult will be true,
      // if he pressed no - it will be false
      if (dialogResult && widget && widget.widget_id) {
        this._caseService
          .deleteWidgetBywID(widget.widget_id)
          .subscribe((resp: any) => {
            if (resp) {
              this.getAllInstanceOfUserWidgets();
              this.utilitiesService.openSnackBar(
                "success",
                this.translateService.instant('The widget has been removed successfully.')
              );
            } else {
              this.utilitiesService.openSnackBar(
                "error",
                this.translateService.instant('Failed to delete the widget.')
              );
            }
          });
      }
    });
  }

  /*
   * Purpose : check if passed object is empty
   * Author : Ashen
   * Date : 17-Sep-2020
   */
  isEmptyObject(obj) {
    return obj && Object.keys(obj).length === 0;
  }

  public trackByKey(_, item): string {
    return item.key;
  }
  public trackByDisplayName(_, item): string {
    return item.displayName;
  }
  public trackByValue(_, item): string {
    return item.value;
  }
}
