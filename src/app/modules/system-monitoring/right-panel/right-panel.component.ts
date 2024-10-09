import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PieChartModule } from '../../../shared/charts/reusablePie.js';
import { EntityCommonTabService } from '../../entity/services/entity-common-tab.service';
import { TimeScaleBubbleChartModule } from '../../../shared/charts/timescaleBubble.js'
import { SystemMonitoringService } from '../system-monitoring.service.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';

var worldMapData = [];
@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelComponent implements OnInit, AfterViewInit {

  public colors = ["#EF5350", "#388E3C", "#69ca6b", "#af3251", "#c1bd4f", "#db3f8d", "#669900", "#334433"];
  public data: any;
  public totalErrorCount = 0;
  public totalSuccesCountsMoreThan100 = 0;
  public totalSuccesCountsBetweeen50To100 = 0;
  public totalSuccesCountsLessThan50 = 0;
  public modalReference: any;
  public worldMapFinalDataForExpand: any;
  public worldMapLoader: boolean = false;
  public statusChartLoader: boolean = false;
  public statusSuccessCount: any = 0;
  public statusErrorCount: any = 0;
  public errorBubbleCharttLoader: boolean = false;
  public errorBubbleShowDataNotFound: boolean = false;
  public statusChartShowDataNotFound: boolean = false;
  public worldMapShowDataNotFound: boolean = false;
  public languageJson:any;
  permissionIdsList: any;
  bubbleChartPlot(bubbleData) {
    var timeScaleChartOptions = {
      container: '#errorBubbleChart',
      data: bubbleData,
      height: '200',
      isheader: false,
      ytext: " ",
      xticks: 3,
      yticks: 5,
      show_XAxisPath: false,
      show_XAxisTicks: false,
      show_YAxisPath: false,
      show_YAxisTicks: false,
      circleColor: '#ef5350',
      grid_Y: true,
      margin: { top: 20, right: 0, bottom: 30, left: 30 },
      localLanguageDate:(this.languageJson && this.languageJson['Date']) ? this.languageJson['Date'] : 'Date',
      localLanguageError:(this.languageJson && this.languageJson['errors']) ? this.languageJson['errors'] : 'errors'
    };
    TimeScaleBubbleChartModule.timescalebubbleChart(timeScaleChartOptions);
  }
  pieChartPlot(data, total) {
    var pieOptions = {
      container: "#statusChart",
      data: data,
      radiusDividedValue:2.5,
      innerTextWrap : 9,
      height: 160,
      colors: this.colors,
      txtColor:'#ffffff',
      // colorsObj:['#D53F8B', '#2773B3'],
      islegends: false,
      legendwidth: 50,
      format: true,
      // istxt: sum ==0?0:parseInt((maxval/sum)*100)+"%",
      istxt: total,
      legendmargintop: 30,
      localLanguageActive:(this.languageJson && this.languageJson['ActiveSources']) ? this.languageJson['ActiveSources'] : 'Active Sources',
      localLanguageFailed:(this.languageJson && this.languageJson['FailedSources']) ? this.languageJson['FailedSources'] : 'Failed Sources',
    };
    PieChartModule.reusableplotPie(pieOptions);
  }
  public worldComplianceLocationsOptionsAtBottom: any = {
    container: "#mapChart",
    uri1: "../../../../assets/js/worldJson.json",// Url of data
    uri2: "../../../../assets/js/worldMapData.json",// Url of data
    height: 300,
    // width: 250,
    markers: []
  }

  public worldComplianceLocationsOptionsModal: any = {
    container: "#mapChartModal",
    uri1: "../../../../assets/js/worldJson.json",// Url of data
    uri2: "../../../../assets/js/worldMapData.json",// Url of data
    height: 400,
    width: 600,
    markers: []

  }
  constructor(public entityCommonTabService: EntityCommonTabService,
    private _SystemMonitoringService: SystemMonitoringService,
    private modalService: NgbModal
   ) {

   }

  ngOnInit() {
    this.sourcePermissions()
    this.languageJson = GlobalConstants.languageJson
    // this._commonService.behaveObserverForgetLanguageJson.subscribe((response)=>{
    //   if(response){
    //     this.languageJson = response;
    //   }
    // });
    // LineChartGradientModule.gradientLineChart(this.gradientLineOption);
    var promise = new Promise((resolve, reject) => {
      this.statusChartLoader = true;
      this.worldMapLoader = true;
      this._SystemMonitoringService.getSourcesList().subscribe(resp => {
        this.statusSuccessCount = (resp && resp.successCount) ? resp.successCount : 0;
        this.statusErrorCount = (resp && resp.failedCount) ? resp.failedCount : 0;
        this.data = resp ? resp : {};
        var pieData = [], total = 0;
        Object.keys(resp).map((val, ind) => {
          if (val !== 'sourceMetadata') {
            total = total + parseInt(resp[val])
            pieData.push(
              { alertStatus: val, count: resp[val], key: val, value: resp[val], columnID:"status"})
          }

        })
        this.pieChartPlot(pieData, total);

        resolve(this.data);
        this.statusChartLoader = false;

      });
    });

    promise.then((data) => {
      if (data) {
        if (data['sourceMetadata']) {
          var sourceData = [];
          Object.values(data['sourceMetadata']).map((val, key) => {
            if (val['jurisdictions'] && val['jurisdictions'].length) {
              val['jurisdictions'].map((va) => {
                var flag = val['jurisdictions'].some((v) => {
                  return v.jurisdictionName == va.jurisdictionName;
                });
                if (flag) {
                  sourceData.push(
                    {
                      'country': va.jurisdictionOriginalName,
                      'jurisdiction': va.jurisdictionName,
                      'source': val['sourceName'],
                      'id': val['sourceId'],
                      'status': val['resultStatus']
                    });
                }
              })
            }
          });

          var sortedSourceListWithJD = sourceData.sort((a, b) => (a.jurisdiction > b.jurisdiction) ? 1 : -1);
          var finalSources = {};
          sortedSourceListWithJD.map((value, key) => {
            var sourceName = value.jurisdiction;
            if (!finalSources[sourceName]) {
              finalSources[sourceName] = [];
            }
            finalSources[sourceName].push(
              {
                'source': value.source,
                'status': value.status,
                'country': value.country
              });
          });
          var arrangedSources = [];
          for (let item in finalSources) {
            arrangedSources.push({
              'jurisdiction': item,
              'sources': finalSources[item],
              'country': finalSources[item][0].country
            })
          }
          arrangedSources.map((ve) => {
            var errorCount = 0;
            var successCount = 0;
            if (ve && ve.jurisdiction) {
              if (ve.sources && ve.sources.length) {
                ve.sources.map((vi) => {
                  if (vi.status && vi.status == 'error') {
                    errorCount++;
                  }
                  else {
                    successCount++;
                  }
                });
                worldMapData.push({
                  'jurisdiction': ve.jurisdiction,
                  'failedCount': errorCount,
                  'succesCount': successCount,
                  'country_name': ve.country,
                  'values': ve
                })
              }
            }
          });
        }
      }
      worldMapData.filter((v) => {
        if (v) {
          if (v.failedCount) {
            this.totalErrorCount++;
          }
          else if (v.succesCount && v.succesCount > 100) {
            this.totalSuccesCountsMoreThan100++;
          }
          else if (v.succesCount && (v.succesCount > 50 && v.succesCount < 100)) {
            this.totalSuccesCountsBetweeen50To100++;
          }
          else if (v.succesCount && v.succesCount < 50) {
            this.totalSuccesCountsLessThan50++;
          }
        }
      });

      this.worldMapFinalDataForExpand = worldMapData;
      this.worldComplianceLocationsOptionsAtBottom.Sucess =(this.languageJson && this.languageJson['Success']) ? this.languageJson['Success'] : 'Success';
      this.worldComplianceLocationsOptionsAtBottom.Error =(this.languageJson && this.languageJson['errors']) ? this.languageJson['errors'] : 'errors';
      this.worldMapFinalDataForExpand.Sucess =(this.languageJson && this.languageJson['Success']) ? this.languageJson['Success'] : 'Success';
      this.worldMapFinalDataForExpand.Error =(this.languageJson && this.languageJson['errors']) ? this.languageJson['errors'] : 'errors';
      this.entityCommonTabService.World(this.worldComplianceLocationsOptionsAtBottom, this.worldMapFinalDataForExpand);
      this.worldMapLoader = false;
      if (worldMapData.length === 0) {
        this.worldMapShowDataNotFound = true;
      }
    });

    var bubbleData = [];
    this.errorBubbleCharttLoader = true;
    this._SystemMonitoringService.getErrorBubbleData().subscribe(resp => {
      resp.map((val) => {
        bubbleData.push({
          "date": val.date,
          "size": val.errorCount,
        })
      })
      this.bubbleChartPlot(bubbleData);
      this.errorBubbleCharttLoader = false;
      if (bubbleData.length === 0) {
        this.errorBubbleShowDataNotFound = true;
      }
    });

  }
  ngAfterViewInit() {
    // this._commonService.getSystemSettings().then((response)=>{
      // let response = GlobalConstants.systemsettingsData
      // response['General Settings'].map((val)=>{
      //   if(val.name == "Languages"){
      //     if(val.selectedValue){
      //       this._commonService.getLanguageJson(val.selectedValue).subscribe((resp:any)=>{
      //         if(resp){
      //           this.languageJson =resp
      //         }
      //       })
      //     }
      //   }
      // });
    // }).catch((error) => {

    // })
  }

  open(content) {
    this.worldMapLoader = true;
    setTimeout(() => {
      this.worldComplianceLocationsOptionsModal.Sucess = (this.languageJson && this.languageJson['Success']) ? this.languageJson['Success'] : 'Success';;
      this.worldComplianceLocationsOptionsModal.Error =(this.languageJson && this.languageJson['errors']) ? this.languageJson['errors'] : 'errors';;
      this.entityCommonTabService.World(this.worldComplianceLocationsOptionsModal, this.worldMapFinalDataForExpand);
      this.worldMapLoader = false;
    }, 1000)

    this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'bst_modal world_map_modal light-theme' }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public ModalClose(ref, status) {
    ref.close("closed");
  }
  sourcePermissions(){
    // this._SystemMonitoringService.getPermissionIdsSourceMoniting().pipe(map((res)=> {
      // return res['sourceManagement']})).subscribe((data:any)=>{
        this.permissionIdsList = GlobalConstants.permissionJson[0]['sourceManagement'];
    // });


  }
}
