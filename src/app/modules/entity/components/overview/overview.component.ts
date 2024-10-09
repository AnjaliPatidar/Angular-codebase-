import { Component, OnInit } from '@angular/core';
import { CustomTableRendererComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/custom-table-renderer.component';
import { EntityFunctionService } from '../../services/entity-functions.service';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonInfoEditComponent } from '../../modals/person-info-edit/person-info-edit.component';
import { EntityApiService } from '../../services/entity-api.service';
import { EntityConstants } from '../../constants/entity-company-constant';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { AppConstants } from '@app/app.constant';
import { TranslateService } from '@ngx-translate/core';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { ActivatedRoute } from '@angular/router';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  public overviewUtiltyObject: any = {
    columnDefs: [],
    rowData: [],
    educationInfo: [],
    finalEducationObj: [],
    openSources: false,
    PrimarySource: [],
    SecondarySource: [],
    personSearchResult: {},
    workInfo: [],
    finalWorkObj: [],
    gridOptions: {
      columnDefs: [],
    },
    screeningSelectedPromises: [],
    screeningRequestId: [],
    PersonscreeningrowSelected: [],
    showDownloadLoader: false,
    educationImageBroke: false,
    workforImageBroke: false,
    eduAr: [],
    eduArSet: false,
    workArr: [],
    workArrSet: false,
    formattedWorkEduInfo: {},
    statickey: String
  }
  public personEducationKeys = EntityConstants.personEducationKeys;
  public personWorkKeys = EntityConstants.personWorkKeys;

  myOptions = {
    'placement': 'bottom',
    'show-delay': 200,
    'hide-delay': 60,
    'width': 230,
    'max-width': 230,
    'autoPlacement': true,
  }

  customerInfoResultSet = {
    'data': [
      {
        'id': '1',
        'verified': false,
        'key': 'Existing Customer',
        'value': 'Since Nov 4, 2017',
        'primiarySources': [{
          'id': '1',
          'verified': true,
          'source': 'Yahoo Finance',
          'value': '58733'
        }, {
          'id': '2',
          'verified': false,
          'source': 'Morningstar',
          'value': '12345'
        }, {
          'id': '3',
          'verified': false,
          'source': 'Source0',
          'value': '12345'
        }],
        'secondarySources': [{
          'id': '1',
          'verified': true,
          'source': 'Yahoo Finance 2',
          'value': '58733'
        }, {
          'id': '2',
          'verified': false,
          'source': 'Morningstar',
          'value': '12345'
        }]
      }, {
        'id': '2',
        'verified': false,
        'key': 'Customer Number',
        'value': '12345678',
        'primiarySources': [{
          'id': '1',
          'verified': true,
          'source': 'Yahoo Finance',
          'value': '58733'
        }, {
          'id': '2',
          'verified': false,
          'source': 'Morningstar',
          'value': '12345'
        }],
        'secondarySources': [{
          'id': '1',
          'verified': true,
          'source': 'Yahoo Finance 2',
          'value': '58733'
        }, {
          'id': '2',
          'verified': false,
          'source': 'Morningstar 2',
          'value': '12345'
        }]
      }, {
        'id': '3',
        'verified': false,
        'key': 'Parent Customer Number',
        'value': '12345678',
        'primiarySources': [{
          'id': '1',
          'verified': true,
          'source': 'Yahoo Finance',
          'value': '58733'
        }, {
          'id': '2',
          'verified': false,
          'source': 'Morningstar',
          'value': '12345'
        }],
        'secondarySources': [{
          'id': '1',
          'verified': true,
          'source': 'Yahoo Finance 2',
          'value': '58733'
        }, {
          'id': '2',
          'verified': false,
          'source': 'Morningstar 2',
          'value': '12345'
        }]
      }
    ]
  };
  isProfileSummaryAvailable= false;
  profileSummary: '';
  screeningSelectedCount: number;
  sliderPepValue = 85;
  sliderPepHighValue = 100;
  sliderPepOptions: Options = {
    floor: 0,
    ceil: 100,
    translate: (value: number, label: LabelType): string => {
      return value + '%';
    }
  };
  sliderSanValue = 75;
  sliderSanHighValue = 100;
  sliderSanOptions: Options = {
    floor: 0,
    ceil: 100,
    translate: (value: number, label: LabelType): string => {
      return value + '%';
    }
  };
  sliderNewsPeriodValue = 1;
  sliderNewsPeriodHighValue = 2;
  sliderNewsPeriodOptions: Options = {
    floor: 1,
    ceil: 7,
    translate: (value: number, label: LabelType): string => {
      switch (value) {
        case 1:
          return value + ' Year';
        default:
          return value + ' Years';
      }
    }
  };

  personScreeningNotifier : Subject<boolean> = new Subject<boolean>();

  constructor(
    private entityFunctionService: EntityFunctionService,
    private commonService: CommonServicesService,
    private entityApiService: EntityApiService,
    private modalService: NgbModal,
    private translateService: TranslateService,
    private sharedServicesService: SharedServicesService,
    private route: ActivatedRoute
  ) {
    this.commonService.screeningObservable.subscribe((value) => {
      if (value) {
        this.overviewUtiltyObject.personSearchResult = value ? value : {};
        this.handleScreeningtableData(value);
        this.getPersonEducationalInformation(this.overviewUtiltyObject.personSearchResult);
        this.getPersonWorkInformation(this.overviewUtiltyObject.personSearchResult);
      }
    });
    this.commonService.activatescreeningObservable.subscribe((results: any) => {
      var screenedEntites = results.screeningSelected;
      this.overviewUtiltyObject.PersonscreeningrowSelected = results;
      if (screenedEntites && screenedEntites.length > 0) {
        this.overviewUtiltyObject.screeningRequestId = [];
        let data = {
          "person": {
            "entities": []
          },
          "organization": {
            "entities": []
          },
          "min_confidence": 0.2,
          "max_responses": 10
        };
        screenedEntites.forEach((screenedEntity, index) => {
          let entity = {
            "names": [screenedEntity.FullName],
            "jurisdiction": null,
            "entity_id": index.toString()
          }
          if (screenedEntity.Type == 'Person') {
            data.person.entities.push(entity);
          }
          else {
            data.organization.entities.push(entity);
          }
          this.overviewUtiltyObject.screeningRequestId.push({
            name: screenedEntity.FullName,
            entityId: index.toString(),
            status: false
          })
        });
        const mainEntityId = this.route.snapshot.queryParams.eId;
        this.entityApiService.getRequestIdforscreening(data, mainEntityId).subscribe((response: any) => {
          const data = {
            mainEntityId: mainEntityId,
            watchlist_request_id: response.watchlist_request_id,
            requestId: response.requestId
          }
          this.screeningdatabyRequestID(data, screenedEntites);
        });

      }
    });


  }
  queryParams: any;

  ngOnInit() {
    this.getLanguage();
    this.loadPersonProfileSummary();

    this.queryParams = this.entityFunctionService.getParams();
    setTimeout(() => {
      this.intializeScreeningCandidategrid();
    }, 5000);
  }


  loadPersonProfileSummary() {

    let data = JSON.parse(localStorage.getItem('personInfoObject'));

    if (data && data.profileSummary && data.profileSummary != '') {
      this.isProfileSummaryAvailable = true;

      this.profileSummary = "";
      let profileSummaryKeys = Object.keys(data.profileSummary);

      if (profileSummaryKeys && profileSummaryKeys.length > 0) {
        let valueKey = profileSummaryKeys[0];
        this.profileSummary = data.profileSummary[valueKey] && data.profileSummary[valueKey].length > 0 && data.profileSummary[valueKey][0].value ? data.profileSummary[valueKey][0].value : "";
      }

    }
    else {
      this.isProfileSummaryAvailable = false;
    }

  }


  getLanguage() {
    let getLanguageData = (language) => {
      // var key = language.slice(0, 3).toLowerCase();
      let key = this.commonService.get_language_name(language)
      var filename = key + '_entity.json'
      var param = {
        "fileName": filename,
        "languageName": language,
        "token": AppConstants.Ehubui_token
      };
      let url = AppConstants.Ehub_Rest_API + 'fileStorage/downloadFileByLanguageAndFileName?fileName=' + param.fileName + '&languageName=' + param.languageName;
      this.translateService.setDefaultLang(AppConstants.Ehub_Rest_API + 'fileStorage/downloadFileByLanguageAndFileName?fileName=en_alert_management.json&languageName=English');
      this.translateService.use(url).subscribe(
        res => {
          GlobalConstants.languageJson = res;
          this.commonService.sendLanguageJsonToComponents(res);
          GlobalConstants.localizationFiles.isMainModuleLoaded = true;
        },
        error => {
          if (error.status == 404 && key == 'de') {
            this.sharedServicesService.showFlashMessage('german file not found, loading default language..', 'danger');
            getLanguageData('english');
          } else if (error.status == 404 && key == 'en') {
            setTimeout(() => {
              this.sharedServicesService.showFlashMessage('english file ' + error.url + ' is missing', 'danger');
            }, 3000)
          }

        }
      );

    }
    if (GlobalConstants.systemSettings['ehubObject']['language']) {
      getLanguageData(GlobalConstants.systemSettings['ehubObject']['language']);
    }
    else {
      this.commonService.getSystemSettings().then((resp) => {
        resp['General Settings'].map((val) => {
          if (val.name == "Languages") {
            if (val.selectedValue) {
              getLanguageData(val.selectedValue)
            }
          }
        });
      }).catch((error) => {

      })
    }
  }


  intializeScreeningCandidategrid() {
    this.overviewUtiltyObject.gridOptions = {
      'resizable': true,
      'tableName': 'Person Screening Candidate',
      'columnDefs': [{
        'headerName': 'Full Name',
        'field': 'FullName',
        'colId': 'FullName',
        'width': 150,
        'initialShowColumn': true
      },
      {
        'headerName': 'Type',
        'field': 'Type',
        'colId': 'Type',
        'width': 150,
        'initialShowColumn': true
      },
      {
        'headerName': 'Relation',
        'field': 'Relation',
        'colId': 'Relation',
        'width': 150,
        'initialShowColumn': true
      },
      {
        'headerName': 'Jurisdiction',
        'field': 'Jurisdiction',
        'colId': 'Jurisdiction',
        'width': 150,
        'initialShowColumn': true,
        'customTemplateClass': "jurisdiction",
        'cellRendererFramework': CustomTableRendererComponent,
      },
      {
        'headerName': 'PEP',
        'field': 'PEP',
        'colId': 'PEP',
        'width': 150,
        'initialShowColumn': true,
        'customTemplateClass': "pep",
        'cellRendererFramework': CustomTableRendererComponent,

      },
      {
        'headerName': 'SAN',
        'field': 'Sanctions',
        'colId': 'Sanctions',
        'width': 150,
        'initialShowColumn': true,
        'customTemplateClass': "sanction",
        'cellRendererFramework': CustomTableRendererComponent,

      },
      {
        'headerName': 'RCA',
        'field': 'RCA',
        'colId': 'RCA',
        'width': 150,
        'initialShowColumn': true,
        'customTemplateClass': "rca",
        'cellRendererFramework': CustomTableRendererComponent,
      },
      {
        'headerName': 'News',
        'field': 'News',
        'colId': 'News',
        'width': 150,
        'initialShowColumn': true,
        'cellRendererFramework': CustomTableRendererComponent,
        'customTemplateClass': "reciept",

      },
      {
        'headerName': 'SIP',
        'field': 'SIP',
        'colId': 'SIP',
        'width': 150,
        'initialShowColumn': true,
        'customTemplateClass': "sip",
        'cellRendererFramework': CustomTableRendererComponent,

      },
      {
        'headerName': 'SIE',
        'field': 'SIE',
        'colId': 'SIE',
        'width': 150,
        'initialShowColumn': true,
        'cellRendererFramework': CustomTableRendererComponent,
        'customTemplateClass': "sie",

      },
      {
        'headerName': 'AME',
        'field': 'AME',
        'colId': 'AME',
        'width': 150,
        'initialShowColumn': true,
        'cellRendererFramework': CustomTableRendererComponent,
        'customTemplateClass': "ame",
      }
      ],
      'rowData': this.overviewUtiltyObject.rowData,
      'rowStyle': { 'border-bottom': '#424242 1px solid' },
      'rowSelection': 'multiple',
      'floatingFilter': true,
      'animateRows': true,
      'sortable': false,
      'tabs': false,
      'isShoHideColumns': false,
      'multiSortKey': 'ctrl',
      'componentType': 'overview Entity',
      'defaultGridName': 'Person Candiate',
      'changeBackground': "#ef5350",
      'rowModelType': 'clientSide',
      'enableTableViews': true,
      'pagination': true,
      'enableServerSideFilter': false,
      'enableServerSideSorting': false,
      'showBulkOperations': false,
      'filter': true,
      'suppressPaginationPanel': true,
      'enableCheckBoxes': true,
      'enableTopSection': false,
      'rowHeight': 53
    }
  }

  handleScreeningtableData(data) {
    var relations = ['children', 'spouse', 'parent', 'works_for'];
    var rowdata = [];
    rowdata.push({
      FullName: this.overviewUtiltyObject.personSearchResult['name'] && this.overviewUtiltyObject.personSearchResult['name'].value && this.overviewUtiltyObject.personSearchResult['name'].value.length ?
        this.overviewUtiltyObject.personSearchResult['name'].value[0] : '',
      Type: 'Person',
      Relation: 'Self',
      Jurisdiction: {},
      PEP: 0,
      Sanctions: 0,
      RCA: 0,
      News: 0,
      SIP: 0,
      SIE: 0,
      AME: 0,
      screeningResults: {}
    });
    for (var key = 0; key < relations.length; key++) {
      var relationkey = relations[key]
      if (data[relationkey] && data[relationkey].value) {
        for (var rel = 0; rel < data[relationkey].value.length; rel++) {
          let fullName = '';
          if (relationkey == 'works_for') {
            fullName = (data[relationkey].value[rel].name ? data[relationkey].value[rel].name : '');
          } else {
            fullName = (data[relationkey].value[rel].first_name ? data[relationkey].value[rel].first_name : '') + ' ' + (data[relationkey].value[rel].last_name ? data[relationkey].value[rel].last_name : '')
          }
          let obj = {
            FullName: fullName,
            Type: data[relationkey].value[rel].entity_type ? data[relationkey].value[rel].entity_type : '',
            Relation: (relationkey == 'works_for') ? 'Works for' : relationkey,
            Jurisdiction: {},
            PEP: 0,
            Sanctions: 0,
            RCA: 0,
            News: 0,
            SIP: 0,
            SIE: 0,
            AME: 0
          }
          rowdata.push(obj);
        }
      }
    }
    this.overviewUtiltyObject.rowData = rowdata;
    this.intializeScreeningCandidategrid();
  }

  // shravani : 04-10-2020 person education information
  getPersonEducationalInformation(data) {


    this.overviewUtiltyObject.educationInfo = data && data['alumni_of'] && data['alumni_of'].value ? data['alumni_of'].value : [];
    let educationObj = data && data['alumni_of'] ? data['alumni_of'] : [];
    if (this.overviewUtiltyObject.educationInfo && educationObj && this.overviewUtiltyObject.educationInfo.length > 0) {
      this.overviewUtiltyObject.educationInfo.forEach(info => {
        let objInfo = {};
        this.personEducationKeys.forEach(element => {
          if (element == 'primiarySources' || element == 'secondarySources') {
            objInfo[element] = educationObj && educationObj[element] ? educationObj[element] : {};
          } else if (element == 'primarySourceLength' || element == 'secondarySourceLength') {
            objInfo[element] = educationObj && educationObj[element] ? educationObj[element] : 0;
          } else {
            if (element == 'period') {
              let period: any;
              if (info && info['startDate'] && info['endDate'] && info['startDate'] != '' && info['endDate'] != '') {
                period = (info && info['endDate']) - (info && info['startDate']) + 'Years'
              } else if (((info && info['endDate'] == undefined) || (info && info['endDate'] == '')) && (info && info['startDate'] && info['startDate'] != '')) {
                period = '1 Year';
              } else {
                period = '';
              }
              objInfo[element] = period;
            } else {
              objInfo[element] = info && info[element] ? info[element] : '';
            }
          }
        });
        this.overviewUtiltyObject.finalEducationObj.push(objInfo);
      });
    };
  }

  onMouseHover(event, sourcesData) {
    if (event.type === 'mouseover') {
      this.overviewUtiltyObject.openSources = true;
      this.overviewUtiltyObject.PrimarySource = sourcesData && sourcesData.primiarySources ? sourcesData.primiarySources : [];
      this.overviewUtiltyObject.SecondarySource = sourcesData && sourcesData.secondarySources ? sourcesData.secondarySources : [];
    }
  }

  onMouseOut(event) {
    if (event.type === 'mouseout') {
      this.overviewUtiltyObject.openSources = false;
    }
  }

  screeningdatabyRequestID(data, screenedEntites) {
    let summaryCount = {};
    this.overviewUtiltyObject.showDownloadLoader = true;
    this.entityApiService.getscreeningDatabyRequestId(data).subscribe((screenedResponse: any) => {
      if (screenedResponse && screenedResponse.watchlists && screenedResponse.watchlists.status && screenedResponse.watchlists.status.toLowerCase() == "finished") {
        this.overviewUtiltyObject.showDownloadLoader = false;
        if (screenedResponse.watchlists.pep && screenedResponse.watchlists.pep['be-watchlist'] && screenedResponse.watchlists.pep['be-watchlist'].results) {
          screenedResponse.watchlists.pep['be-watchlist'].results.forEach(result => {
            const screeningRequest = this.overviewUtiltyObject.screeningRequestId.find(req => req.entityId == result.entity_id);
            if (screeningRequest) {
              let findIndextable = this.overviewUtiltyObject.PersonscreeningrowSelected.rowSelected.findIndex((val) => val.data.FullName == screeningRequest.name);
              if (findIndextable !== -1) {
                ['News', 'PEP', 'RCA', 'Sanctions', 'SIP', 'SIE', 'AME'].forEach((val) => {
                  this.overviewUtiltyObject.PersonscreeningrowSelected.rowSelected[findIndextable].data[val] = 0;
                });
                result.hits.forEach(hit => {
                  let classification = hit.entries && hit.entries[0] && hit.entries[0].classification.toLowerCase();
                  let key = ''
                  if (classification.indexOf('pep') != -1) {
                    key = 'PEP' //POLITICALLY EXPOSED PERSON (PEP)
                  } else if (classification == "adverse   ") {
                    key = 'News'//ADVERSE MEDIA
                  } else if (classification.indexOf('rca') != -1) {
                    key = 'RCA' //RELATIVE OR CLOSE ASSOCIATE (RCA)
                  } else if (classification == 'sanctions list') {
                    key = 'Sanctions' //SANCTIONS LIST
                  } else if (classification.indexOf('sip') != -1) {
                    key = 'SIP' //SPECIAL INTEREST PERSON (SIP)
                  } else if (classification == 'bst adverse media') {
                    key = 'AME' //BST ADVERSE MEDIA
                  } else if (classification.indexOf('sie') !== -1) {
                    key = 'SIE' //SPECIAL INTEREST ENTITY (SIE)
                  }
                  if (key) {
                    this.overviewUtiltyObject.PersonscreeningrowSelected.rowSelected[findIndextable].data[key] = this.overviewUtiltyObject.PersonscreeningrowSelected.rowSelected[findIndextable].data[key] + 1;
                    this.overviewUtiltyObject.PersonscreeningrowSelected.rowSelected[findIndextable].data.screeningResults = screenedResponse;
                    if(!summaryCount[key]){
                      summaryCount[key] = 0;
                    }
                    summaryCount[key] = summaryCount[key] + 1;
                    this.commonService.screenedCounts.next(summaryCount);
                  }
                });
              }
            }
          });
        }
      }
      else {
        setTimeout(() => {
          this.screeningdatabyRequestID(data, screenedEntites)
        }, 5000)
      }
    })
  }

  openPersonInfoModal(editedDataKey, statickeys) {
    const modalRef = this.modalService.open(PersonInfoEditComponent, {
      windowClass: 'PersonEditModal'
    });
    modalRef.componentInstance.PersonmodalData = editedDataKey;
    modalRef.componentInstance.statickeys = statickeys;
  }

  formatEducationWorkDatasetForModal(formatData, i) {
    let formattedRes = JSON.parse(JSON.stringify(formatData));
    if (formattedRes.primiarySources) {
      formattedRes.primiarySources.forEach(source => {
        let data = [];
        if (source && source.value && source.value.length > 0) {
          source.value.forEach((element) => {
            if (element && element.name !== '') {
              data.push(element.name)
            }
          });
          source.value = data;
        }

      });
    }
    if (formattedRes.secondarySources) {
      formattedRes.secondarySources.forEach(source => {
        let data = [];
        if (source && source.value && source.value.length > 0) {
          source.value.forEach((element) => {
            if (element && element.name !== '') {
              data.push(element.name)
            }
          });
        }
        source.value = data;
      });
    }
    this.overviewUtiltyObject.formattedWorkEduInfo = JSON.parse(JSON.stringify(formattedRes));
  }

  getPersonWorkInformation(data) {
    this.overviewUtiltyObject.workInfo = data && data['works_for'] && data['works_for'].value ? data['works_for'].value : [];
    let worksforObj = data && data['works_for'] ? data['works_for'] : [];
    if (this.overviewUtiltyObject.workInfo && worksforObj && this.overviewUtiltyObject.workInfo.length > 0) {
      this.overviewUtiltyObject.workInfo.forEach(info => {
        let objInfo = {};
        this.personWorkKeys.forEach(element => {
          if (element == 'primiarySources' || element == 'secondarySources') {
            objInfo[element] = worksforObj && worksforObj[element] ? worksforObj[element] : {};
          } else if (element == 'primarySourceLength' || element == 'secondarySourceLength') {
            objInfo[element] = worksforObj && worksforObj[element] ? worksforObj[element] : 0;
          } else {
            if (element == 'period') {
              let period: any;
              if ((info && info['endDate'] && info['endDate'] != '') && (info && info['startDate'] && info['startDate'] != '')) {
                period = this.dateDifferenciate(info['startDate'], info['endDate']);
              } else if (((info && info['endDate'] == undefined) || (info && info['endDate'] == '')) && (info && info['startDate'] && info['startDate'] != '')) {
                period = '1 Year';
              } else {
                period = '';
              }
              objInfo[element] = period;
            } else {
              objInfo[element] = info && info[element] ? info[element] : '';
            }
          }
        });
        this.overviewUtiltyObject.finalWorkObj.push(objInfo);
      });
    };
  }

  setCustomerInformation() { }

  getURLshort(urldata) {
    var Url = '';
    if (urldata) {
      Url = urldata.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
    } else if (urldata === '' && urldata !== undefined) {
      Url = 'user input';
    }
    return Url;
  }

  getHoverModalTemplate(data, i) {
    if (!data || ((!data.primiarySources || data.primarySourceLength == 'undefined' || data.primiarySources.length == 0) && (!data.secondarySources || data.secondarySourceLength == 'undefined' || data.secondarySources.length == 0))) {
      return;
    }
    var template = '';
    let tickAdded = false;

    if (data.primiarySources) {
      template =
        '<div class="col-sm-6 pad-l0">' +
        '<div class="top-heading pb-2 mb-3 justify-content-between border-thin-dark-cream-b d-flex ai-c">' +
        '<h4 class="mb-0 text-dark-black">Primary</h4>' +
        '<span class="text-dark-pastal-green text-dark-black font-regular mar-r5">' +
        '<i class="fa fa-link"></i> ' +
        data.primarySourceLength +
        "</span></div>" +
        '<div class="bottom-content-wrapper text-dark-black">' +
        '<ul class="custom-list pad-l0 item-1 panel-scroll">';
      if (data.primiarySources && data.primiarySources.length > 0) {
        data.primiarySources.map((d, index) => {
          if (i == -1) {
            if (d) {
              if (!tickAdded) {
                template +=
                  '<li class="d-flex ai-c"><span class="text-dark-black" style="word-break: break-word; white-space:pre-wrap">' +
                  this.getURLshort(d.sourceDisplayName || d.source) +
                  '</span><i class="fa fa-check-circle-o mar-x5 text-dark-blue f-11 "></i></li>';
                tickAdded = true;
              } else {
                template += '<li class="d-flex ai-c"><span class="text-dark-black" style="word-break: break-word; white-space:pre-wrap">' +
                  this.getURLshort(d.sourceDisplayName || d.source) +
                  "</span></li>";
              }
            }
          } else {
            template += '<li class="d-flex ai-c"><span class="text-dark-black" style="word-break: break-word; white-space:pre-wrap">' +
              this.getURLshort(d.sourceDisplayName || d.source) +
              "</span>";
            if (!tickAdded) {
              template += '<i class="fa fa-check-circle-o mar-x5 text-dark-blue f-11 "></i>';
              tickAdded = true;
            }
            template += '</li>';
          }
        });
      } else {
        template += '<li class="d-flex ai-c"><span  class="text-dark-black" style="word-break: break-word; white-space:pre-wrap">No Sources Available</span></li>';
      }
      template += '</ul></div></div>';
    }

    if (data.secondarySources) {
      template +=
        '<div class="col-sm-6 pad-r0">' +
        '<div class="top-heading pb-2 mb-3 justify-content-between border-thin-dark-cream-b d-flex ai-c">' +
        '<h4 class="mb-0 text-dark-black">Secondary</h4>' +
        '<span class="text-dark-cream font-regular mar-r5"><i class="fa fa-link"></i> ' +
        data.secondarySourceLength +
        "</span>" +
        "</div>" +
        '<div class="bottom-content-wrapper">' +
        '<ul class="custom-list pad-l0 item-1 panel-scroll">';
      if (data.secondarySources && data.secondarySources.length > 0) {
        data.secondarySources.map((d, index) => {
          if (i == -1) {
            var tickcls = '';
            if (d) {
              if (d.source == data.source && !data.isUserData) {
                tickcls = '<i class="fa fa-check-circle-o mar-x5 text-dark-blue f-11 "></i>';
              }
              template +=
                '<li class="d-flex ai-c"><span class="text-dark-black" style="word-break: break-word; white-space:pre-wrap">' +
                this.getURLshort(d.sourceDisplayName || d.source) +
                "</span>" +
                tickcls +
                "</li>";
            }
          } else {
            template += '<li class="d-flex ai-c"><span class="text-dark-black" style="word-break: break-word; white-space:pre-wrap">' +
              this.getURLshort(d.sourceDisplayName || d.source) +
              "</span></li>";
          }
        });
      } else {
        template +=
          '<li class="d-flex ai-c"><span class="text-dark-black" style="word-break: break-word; white-space:pre-wrap">No Sources Available</span></li>';
      }
    }
    template += '</ul></div></div>';
    return template;
  }

  open(content, formatData, i, key) {
    this.formatEducationWorkDatasetForModal(formatData, i);
    this.overviewUtiltyObject.statickey = key;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'custom-modal c-arrow bst_modal add-ownership-modal add-new-officer full_space_modal'
    }).result.then((result) => {
    }, (reason) => { });
  }
  /**When Image got broke
  * Author : shravani
  * Date : 24-11-2020
 */
  imgError(image, widgetType) {
    if (widgetType == 'work_for') {
      this.overviewUtiltyObject.workforImageBroke = true;
    } else {
      this.overviewUtiltyObject.educationImageBroke = true;
    }
  }

  /**To get the months and years difference
* Author : shravani
* Date : 4-12-2020
*/
  dateDifferenciate(startDate, endDate) {
    let DisplayTo;
    if (endDate == 'Present') {
      var date = new Date();
      DisplayTo = date;
    }
    else {
      DisplayTo = new Date(endDate);
    }

    let DisplayFrom = new Date(startDate);
    let timeSpan = DisplayTo.getMonth() - DisplayFrom.getMonth() + (12 * (DisplayTo.getFullYear() - DisplayFrom.getFullYear()));
    if (timeSpan > 12) {
      var months = timeSpan % 12;
      var years = (timeSpan - months) / 12;
      if (months == 0)
        return years + "Years";
      else
        return years + "Years" + " " + months + "Months";
    }
    else {
      if (timeSpan != 0)
        return timeSpan + "Months";
    }
  }

  personSelectionEventHandler(count: number) {
    this.screeningSelectedCount = count;
    console.log(count);
  }

  CallActivatePersonScreening() {
    this.personScreeningNotifier.next(true);
  }
  public trackByKey(_, item): string {
    return item.key;
  }
}
