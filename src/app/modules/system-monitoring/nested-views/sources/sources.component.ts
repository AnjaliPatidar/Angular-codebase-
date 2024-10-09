import { Component, OnInit } from '@angular/core';
import { SystemMonitoringService } from '../../system-monitoring.service';
import { SourceConstant } from '../../constants/sources.constant';
import { DatePipe } from '@angular/common';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';

const datePipe = new DatePipe('en-US');

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss']
})
export class SourcesComponent implements OnInit {
  /**====================== Public variables start=======================*/
  public gridOptions: any = {};
  public presentDate = new Date();
  public agGridLoader: boolean = false;
  public showErrorMag: boolean = false;
  public errorTextMsg: any;
  public componentName = 'sourceManagement';

  exportParams: any = {
    skipHeader: false,
    columnGroups: true,
    skipFooters: true,
    skipGroups: true,
    skipPinnedTop: true,
    skipPinnedBottom: true,
    allColumns: true,
    fileName: 'sources-' + this.presentDate.getDate() + "-" + (this.presentDate.getMonth()+1) + "-" + this.presentDate.getFullYear(),
    sheetName: 1,
    columnSeparator: ",",
    columnKeys: ['status', 'source', 'url', 'jurisdiction', 'category', 'domain', 'industry', 'last update', 'response time'],
    processCellCallback: function (params) {
      var colId = params.column && params.column.colId ? params.column.colId : '';
      if (colId == 'jurisdiction') {
        var country = '';
        var jurisdictionList = params.value;
        jurisdictionList.map((val) => {
          country = country + (country ? ',' : '') + val.values.jurisdictionOriginalName;
        });
        params.value = country;
      }
      else if (colId == 'url') {
        if (params.value) {
          params.value = params.value.split('_blank">')[1].split("</a>")[0];
        }
      }
      return params.value
    },
    processHeaderCallback: function (params) {
      return params.column.getColDef().headerName.toUpperCase();
    }

  }
  /**====================== Public variables End=======================*/

  /**====================== Private variables start =======================*/
  private columnDefs: any = [];
  private rowData: any = [];
  public statusObjs: any = [];
  public languageJson:any;
  permissionIdsList: any;

  /**====================== Private variables end =======================*/
  constructor(private _systemMonitoringService: SystemMonitoringService,
    private _sourceConstant: SourceConstant,
    private _commonService: CommonServicesService) { }

  ngOnInit() {
    this.sourcePermissions()
    var promisObj = new Promise((resolve,reject)=>{
      this._commonService.behaveObserverForgetLanguageJson.subscribe((resp)=>{
          if(resp){
            this.languageJson = resp;
            resolve(this.languageJson);
          }
      });
    });

    this.columnDefs = this._sourceConstant.columnDefs;

    promisObj.then((resp)=>{
    //   if(resp){
    //     if(this.columnDefs.length){
    //       this.columnDefs.map((val)=>{
    //         if(val && val.headerName){
    //           val.headerName = this.getLanguageKey(val.headerName ? val.headerName.split(' ').join(""):'');
    //           if(val.floatingFilterComponentParams && val.floatingFilterComponentParams.options && val.floatingFilterComponentParams.options.length){
    //             val.floatingFilterComponentParams.options.map((v)=>{
    //               if(v && v.label){
    //                 v.label = this.getLanguageKey(v.label ? v.label.split(' ').join(""):'');
    //               }
    //             });
    //           }
    //         }

    //       })
    //     }
    //   }
    });
    var itemToGetList;
    this.columnDefs.map((val) => {
      if (val.colId != "status" && val.colId != "source" && val.colId != "url" && val.colId != "last update" && val.colId != "response time") {
        if (val.colId == "category") {
          itemToGetList = 'categories';
        } else if (val.colId == 'industry') {
          itemToGetList = val.colId;
        }
        else {
          itemToGetList = val.colId.concat('s');
        }
        this._systemMonitoringService.getItemList(itemToGetList).subscribe((response) => {
          response.map((v) => {
            if (v.displayName != 'All') {
              if (val.colId == 'jurisdiction') {
                val.floatingFilterComponentParams.options.push({
                  'src': v.code ? './assets/css/flags/4x3/' + v.code.toLowerCase() + '.svg' : '',
                  'label': v.displayName ? v.displayName : '',
                  'values': v
                });
              }
              else {
                val.floatingFilterComponentParams.options.push({
                  'label': v.displayName ? v.displayName : '',
                  'values': v
                });
              }
            }
          })
        })
      }
    })
    this._sourceConstant.gridOptionsConstatnt.csvExportParams = this.exportParams;
    this.gridOptions = this._sourceConstant.gridOptionsConstatnt;
    this.gridOptions.columnDefs = this.columnDefs;
    /**Get all feeds list data */
    this.getAllSourcesListData();

    /* Function to remove pagination text */
    setTimeout(function () {
      $("span.ag-paging-page-summary-panel").contents().filter(function () { return this.nodeType != 1; }).remove();
      $("span.ag-paging-page-summary-panel").find('span').remove();
    }, 3000);

  }


  /**Getting Language text
     * Author : karnakar
     * Date : 20-Jan-2020
     */
    getLanguageKey(text){
      var langKey = '';
      if(this.languageJson){
      langKey = this.languageJson[text];
    }
    return langKey;
  }

  exportData() {
    if (document.getElementById("export-button")) {
      document.getElementById("export-button").click();
    }
    //this._sharedService.exportDataemit();
  }

  /**Getting all sources list
   * Author : karnakar
   * Date : 04-Dec-2019
  */
  getAllSourcesListData() {
    var promise = new Promise((resolve, reject) => {
      this.agGridLoader = true;
      this.showErrorMag = false;
      this._systemMonitoringService.getSourcesList().subscribe(resp => {
        var tempRowData = [];
        var data = resp.sourceMetadata;
        if (data) {
          Object.keys(data).map((val) => {
            if (data[val] && data[val].sourceName) {
              tempRowData.push({
                "sourceId": data[val].sourceId ? data[val].sourceId : '',
                "Status": data[val].resultStatus ? data[val].resultStatus : '',
                "Source": data[val].sourceName ? data[val].sourceName : '',
                "URL": data[val].url ? '<a class="text-white" href=' + data[val].url + ' target="_blank">' + data[val].url.split("//")[1] + '</a>' : '',
                "urlForPopover": data[val].url ? data[val].url : '',
                "Jurisdiction": this.getJurisdictionList(data[val].jurisdictions),
                "Category": data[val].category ? data[val].category : '',
                "Domain": this.getDomainValues(data[val].domain),
                "Industry": this.getIndustryValues(data[val].industry),
                "Last Update": data[val].responseDatetime ? datePipe.transform(data[val].responseDatetime, (GlobalConstants.globalDateFormat.LongDateFormat+' '+GlobalConstants.globalDateFormat.LongTimeFormat)) : '',
                "Response Time": (data[val].resultStatus && data[val].resultStatus == 'error') ? 'Error' : data[val].executionDuration ? Math.ceil(data[val].executionDuration.split(':')[2]) + "s" : '',
                "Response Time popover": data[val].executionDuration ? Math.ceil(data[val].executionDuration.split(':')[2]) + "s" : '',
                'Executione date time': data[val].executionDatetime ? datePipe.transform(data[val].executionDatetime, (GlobalConstants.globalDateFormat.LongDateFormat+' '+GlobalConstants.globalDateFormat.LongTimeFormat)) : '',
                "Section": data[val].section ? data[val].section : '',
                'Source Project': data[val].sourceProject ? data[val].sourceProject : '',
                'Cycle Id': data[val].cycleId ? data[val].cycleId : '',
              })
            }
          });
          this.rowData = tempRowData;
          resolve(this.rowData);
        }
      },
        (err) => {
          this.showErrorMag = true;
          this.agGridLoader = false;
          this.errorTextMsg = err ? err : '';
        });
    });

    promise.then((data) => {
      this.gridOptions.rowData = data;
      this._commonService.getDataFromComponentBehave.next(this.gridOptions);
      this.agGridLoader = false;
    })
  }

  /**Getting Jurisdictions
   * Author : karnakar
   * Date : 04-Dec-2019
  */
  getJurisdictionList(jurisdictionList) {
    var list = [];
    if (jurisdictionList && jurisdictionList.length) {
      jurisdictionList.map((v) => {
        list.push({
          label: v.jurisdictionName ? (v.jurisdictionName !== 'ANY') ? ("./assets/css/flags/4x3/" + v.jurisdictionName.toLowerCase() + ".svg") : "ANY" : "ANY",
          values: v ? v : {}
        })
      });
    }
    return list;
  }

  /**Getting domains
   * Author : karnakar
   * Date : 04-Dec-2019
  */
  getDomainValues(domainList) {
    var values = [];
    if (domainList && domainList.length) {
      domainList.map((v) => {
        values.push(v.domainName);
      });
    }
    return (values && values.length) ? values.join(',') : '';
  }

  /**Getting Industries
   * Author : karnakar
   * Date : 04-Dec-2019
  */
  getIndustryValues(industryList) {
    var values = [];
    if (industryList && industryList.length) {
      industryList.map((v) => {
        values.push(v.industryName);
      });
    }
    return (values && values.length) ? values.join(',') : '';
  }
  sourcePermissions(){
    // this._systemMonitoringService.getPermissionIdsSourceMoniting().pipe(map((res)=> {
      // return res['sourceManagement']})).subscribe((data:any)=>{
        this.permissionIdsList = GlobalConstants.permissionJson[0]['sourceManagement'];

    // });


  }
}
