import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , Router } from '@angular/router'
import { isEmpty, find } from 'lodash-es';
import * as d3 from '../../../../shared/charts/d3.v4.min';
import { EntityFunctionService } from '../../services/entity-functions.service';
import { EntityApiService } from '../../services/entity-api.service'
import { EntityCommonTabService } from '../../services/entity-common-tab.service'
import { EntityConstants } from '../../constants/entity-company-constant';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { snackRiskScoreModule } from '../../../../shared/charts/sankRiskScore';
import { PersonInfoEditComponent } from '../../modals/person-info-edit/person-info-edit.component';
import { SharedServicesService } from '@app/shared-services/shared-services.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootComponent implements OnInit {
  companyInfo: any;
  aggregationType: any;
  public riskScoreNoData = false;
  public entityType: String;
  public tabConfig = [];
  public personFinalObject = [];
  public PersonEntityDetails = {}
  public openSources = false;
  public selectedAttributePrimarySource = [];
  public selectedAttributeSecondarySource = [];
  public jurisdictionListValue = [];
  public selectedSource = "";
  public selectedDisplayAttribute = "";
  public jurdictionFlag = ""
  public personIdentifier = "";
  public imageBroke = false;
  public summaryCount = {};
  public isScreened: boolean;
  public currentEntityInfo:any;
  public isDataFound:boolean;

  constructor(
    public entityCommonTabService: EntityCommonTabService,
    public activatedRoute: ActivatedRoute,
    public entityApiService: EntityApiService,
    public entityFunctionService: EntityFunctionService,
    private _commonService: CommonServicesService,
    private modalService: NgbModal,
    private router :Router,
    private _sharedServicesService: SharedServicesService
  ) {

    // shravani : 1-06-2020 : based on entity id need to dynamically load the local JSON files
    const identifier = this.entityFunctionService.getParams().query;
    const Json_path_obj = EntityConstants.Json_path_obj;
    Json_path_obj.forEach((info) => {
      if (identifier === info.name) {
        this.entityApiService.getLocalJSON(info.path).subscribe((data: any) => {
          this.entityCommonTabService.getCompanyInfo(data);
        }, (err) => {
        });
      }
    })
  }

  queryParams: any;
  public countryNames: any = [];
  public ceriSearchResultObject: any = EntityConstants.complianceObject;
  public pageloader = EntityConstants.basicSharedObject.pageloader;
  public cumulativeRisk: any;
  public overviewRisks: any;
  public riskScoreData: any;
  public scaledNumArr: any = [];
  public PersonInfoKeys = EntityConstants.PersonKeys;
  public personArray = [];
  public PersonGeneralInfoKeys = EntityConstants.PersonGeneralInfoKeys

  // shravani:18-5-20 sample rating obj
  aggregateRating;
  rating_summary;
  businessClassifier;
  links: any;
  financialInfo: any;
  revenue: any;
  newEntityObj = EntityConstants.NewEntityObj;
  public entitySearchResult: any = {
    complianceWidgets: {
      description: false,
      popoverMsg: '',
      popoverDate: ''
    },
    twitter_retweets_count: 0,
    comapnyLogo: '',
    list: EntityConstants.basicSharedObject.list,
    is_data_not_found: EntityConstants.basicSharedObject.is_data_not_found,
    riskdata: [],
    'stocks': {
      'bloomberg_prop': {},
      'yahoo_prop': {},
      'cnn_prop': {}
    },
    name: EntityConstants.complianceObject['vcard:organization-name'] && EntityConstants.complianceObject['vcard:organization-name'].value ? EntityConstants.complianceObject['vcard:organization-name'].value : '',
  }
  public fetchLink_officershipScreeningData: any[] = []
  public screeningData: any[] = [];
  public actualScreeningData: any[] = [];
  /*
    adidas url
    http://localhost:4200/#/ehubui/entity/form-analysis?query=de000a1ewww0&cId=DE&eId=34c7210ca3724f46bcf0ff5a1a7e7382

    walmart url
    http://localhost:4200/#/ehubui/entity/form-analysis?query=us9311421039&cId=US&eId=c7879e76bdb54ed68a3215c2ec081e3b
  */

  public complianceData: any;
  public prevComplianceData: any;
  public selectSourceType: any;
  pageLoader = false;
  classifier;
  customerInfoSimilarCompData: any = {};
  ngOnInit() {
    this.getCountries();
    const entityUrl:string = (this.router.url).toLocaleLowerCase();
    this.entityType = entityUrl && entityUrl.includes("company") ? 'company' : 'person';
    if (this.entityType == 'person') {
      this.tabConfig = [
        { url: "overview", name: "Overview", icon: "fa-home" },
         { url: "personality", name: "Personality", icon: "fa-graduation-cap" },
      ]
    } else {
      this.tabConfig = [
        // { url: "overview", name: "Overview", icon: "fa-globe" },
        { url: "compliance", name: "Compliance", icon: "fa-building-o" },
        { url: "media", name: "Media", icon: "fa-picture-o" },
        { url: "rating", name: "Reviews", icon: "fa-star" },
        { url: "social-media", name: "Social Media", icon: "fa-share-alt-square" },
        // { url: "leadership", name: "Leadership", icon: "fa-users" },
        // { url: "financial", name: "Financial", icon: "fa-signal" },
        // { url: "risk-alerts", name: "Risk Alerts", icon: "fa-exclamation-triangle" },
        // { url: "threats-intelligence", name: "Threats Intelligence", icon: "fa-user-secret" },
        // { url: "latest-news", name: "Latest News", icon: "fa-newspaper-o" },
        // { url: "form-analysis", name: "Form Analysis", icon: "fa-tasks" }
      ]
    }
    this.queryParams = this.entityFunctionService.getParams();
    const identifier = this.queryParams.query;
    if (this.entityType == 'company') {
      this.selectentityUrl(this.queryParams);
      this.getCaseByRiskDetails(this.queryParams['query'])
    } else {
      this.personIdentifier = this.queryParams && this.queryParams.eId ? this.queryParams.eId : '';
      let data: any = {
        query: this.queryParams && this.queryParams.query && unescape(this.queryParams.query) ? unescape(this.queryParams.query) : '',
        jurisdiction: this.queryParams && this.queryParams.cId ? this.queryParams.cId : ''
      }
      this.getPersonEntityData();
    }

    // shravani : 1-06-2020 : based on entity id need to dynamically load the local JSON files
    const identifierId = this.entityFunctionService.getParams().query;
    const Json_path_obj = EntityConstants.Json_path_obj;
    Json_path_obj.forEach((info) => {
      if (identifierId === info.name) {
        this.entityApiService.getLocalJSON(info.path).subscribe((data: any) => {
          this.customerInfoSimilarCompData = data;
        }, (err) => {
        });
      }
    });
    this._commonService.screenedCounts.subscribe((counts) => {
      if (counts) {
        this.isScreened = true;
        this.summaryCount = counts;
      }
    }, (err) => { });
  }

  selectentityUrl(queryParams) {
    var encodeuri = localStorage.getItem('select_entity_url') ? JSON.parse(localStorage.getItem('select_entity_url')) : {};
    var url = encodeuri[queryParams.query] ? encodeuri[queryParams.query] : '';
    var part2 = url && url.split('select?') && url.split('select?').length > 0 ? url.split('select?')[1] : '';
    this.selectSourceType = part2 ? part2.substring(0, part2.indexOf("=")) : '';
    this.entityApiService.selectEntity({ url }).subscribe((response: any) => {
      if (response && response["is-completed"]) {
        if (response.results && response.results.length > 0 && response.results[0] && response.results[0].links && response.results[0].links.overview) {
          this.fetchdataLinkUrl(response.results[0].links);
        }
      } else {
        setTimeout(() => {
          this.selectentityUrl(queryParams);
        }, 5000);
      }
    }, function () {
    });
  }
  fetchdataLinkUrl(selecturllinks) {
    this.pageLoader = false;
    for (let [key, value] of Object.entries(["overview", "officership", "Finacial_Information"])) {
      this.entityApiService.complianceFieldsUrl({
        identifier: this.queryParams.query,
        fields: value,
        jurisdiction: this.queryParams.cId,
        url: selecturllinks[value],
        sourceType: this.selectSourceType
      })//comment this to bypass

        // this.entityCommonTabService.companybypassObserver //uncomment to bypass
        .subscribe((data: any) => {
          if (data) {
            if (value == "overview") {
              EntityConstants.overview = data;
              if (data && data.results && data.results.length > 0 && data['is-completed']) {
                const result = data;
                result.customerInfoSimilarCompData = this.customerInfoSimilarCompData;
                this.entityCommonTabService.getCompanyInfo(result);
                this.links = result;
                this.pageLoader = true;
                EntityConstants.basicSharedObject.org_structure_link = (data.results[0]['links'] && data.results[0]['links']['graph:shareholders']) ? data.results[0]['links']['graph:shareholders'] : '';
                // if (data.results[0].overview) {
                //   // this.businessClassifier = data.results[0]['overview']['asiakastieto.fi']['bst:businessClassifier']['description']
                //   EntityConstants.basicSharedObject.overViewDataLinksUrls[key] = value;

                // }
              } else if (!data['is-completed']) {
                setTimeout(() => {
                  this.fetchdataLinkUrl(selecturllinks);
                }, 5000);
              }
              let formatedData = this.formatJson(data, value);
              if (formatedData && formatedData.length > 0) {
                this.complianeCompanyDetails(data.results[0].overview.comapnyInfo, false);
                // this.pageLoader = false;
              }
            }
            if (value == "officers" || value == "officership") {
              var officer_data = [];
              if (data && (!isEmpty(data))) {
                //taking the first result
                var currentResult = data;
                for (var fetcher in currentResult) {
                  if (currentResult[fetcher] && currentResult[fetcher].length > 0 && fetcher !== "officershipInfo") {
                    var fetcherData = currentResult[fetcher].map(function (val) {
                      val.source = val.customSource ? val.customSource : val.source ? val.source : '';
                      return val;
                    });
                    var finalObject = {
                      source: fetcher,
                      value: fetcherData
                    }
                    officer_data.push(finalObject);
                  } else if (fetcher === "officershipInfo") {
                    if (currentResult['officershipInfo'].length > 0) {
                      currentResult['officershipInfo'] = currentResult['officershipInfo'].sort(function (a, b) {
                        if (a.name && b.name) {
                          if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
                          if (a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
                          return 0;
                        }
                      })
                      this.fetchLink_officershipScreeningData = currentResult['officershipInfo'].map(function (officerval) {
                        officerval.name = officerval.name ? officerval.name : (officerval.keyword ? officerval.keyword : '');
                        officerval.identifier = officerval.officerIdentifier ? officerval.officerIdentifier : (officerval.identifier ? officerval.identifier : (officerval.entity_id ? officerval.entity_id : ''));
                        officerval.officer_role = officerval.officer_role ? officerval.officer_role : (officerval.role ? officerval.role : '');
                        officerval.hasURL = officerval.hasURL ? officerval.hasURL : '';
                        officerval.source = officerval.customSource ? officerval.customSource : officerval.source ? officerval.source : '';
                        officerval.entity_type = ((officerval.hasOwnProperty('officer_role')) || (officerval.type && (officerval.type == "individual" || officerval.type == "person"))) ? 'person' : "organization";
                        return officerval;
                      });
                      // this.pageloader.screeningLoader = this.screeningData.length > 0 ? false : true;
                      EntityConstants.fetchLink_officershipScreeningData = this.fetchLink_officershipScreeningData;
                      //var conbinedSreening =this.actualScreeningData.concat(customEntites.screeningaddition);//this line of code is for total Enties
                      // screeningTableOriginal_custom(conbinedSreening);
                    }
                  }
                } //for loop each obect
              } //if ends
              if (officer_data.length > 0) {
                var totalOfficers_link = [];

                EntityConstants.entityChartSharedObject.officerData = { officership: officer_data };
                for (var index = 0; index < EntityConstants.entityChartSharedObject.officerData.officership.length; index++) {
                  if (EntityConstants.entityChartSharedObject.officerData.officership[index].value.length > 0) {
                    totalOfficers_link = totalOfficers_link.concat(EntityConstants.entityChartSharedObject.officerData.officership[index].value);
                  }
                }

                totalOfficers_link = totalOfficers_link.reverse();
                EntityConstants.basicSharedObject.totalOfficers_link = totalOfficers_link;
                this.entityCommonTabService.setOfficerData(EntityConstants.basicSharedObject.totalOfficers_link);
              } else {
                this.entitySearchResult.is_data_not_found.is_data_leadership = false;
                this.entitySearchResult.is_data_not_found.is_company_member = false;
                this.entitySearchResult.is_data_not_found.is_keyExecutive = false;
              }
              EntityConstants.basicSharedObject.totalOfficers_link.forEach(function (val) {
                if (val && val.name) {
                  var regex = /^(Mr.|MR.|Dr.|mr.|DR.|dr.|ms.|Ms.|MS.|Miss.|Mrs.|mrs.|miss.|MR|mr|Mr|Dr|DR|dr|ms|Ms|MS|miss|Miss|Mrs|mrs)[\.\s]*/
                  val.name = val.name.replace(regex, '');
                }
              });
              // if(this.mainInfoTabType === 'Overview' && EntityCommonTabService.lazyLoadingentity.leadershipTabFirsttime){
              //  $scope.$broadcast('overviewleadershipOnload');
              // }
            } //officers ends
            if (value == "Finacial_Information") {
              if (data && data.results && data.results.length > 0) {
                let revenue_data = (data.results[0].Finacial_Information) ? data.results[0].Finacial_Information : {};
                if (revenue_data[Object.keys(revenue_data)[0]]) {
                  let r = revenue_data[Object.keys(revenue_data)[0]];
                  this.revenue = r[0] && r[0].summary && r[0].summary.operating_revenue ? r[0].summary.operating_revenue : "";
                } else {
                  this.revenue = "";
                }
              } else {
                this.revenue = "";
              }
            }
          }
        }, (err: any) => {
        })
      // this.entityCommonTabService.Companylinkbypased(value)//uncomment to bypass
    }//forloop ends

  }
  isJson = function (str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };
  complianeCompanyDetails(data, json) {

    if (!json) {
      if (!isEmpty(data)) {
        if (data && data['lei:legalForm'] && !isEmpty(data['lei:legalForm']) && data['lei:legalForm'].value) {
          data['lei:legalForm'].value = this.isJson(data['lei:legalForm'].value) ? JSON.parse(data['lei:legalForm'].value) : data['lei:legalForm'].value;
          data['lei:legalForm'].value = data['lei:legalForm'] && data['lei:legalForm'] && data['lei:legalForm'].value && data['lei:legalForm'].value.hasOwnProperty('label') ? data['lei:legalForm'].value.label : (data['lei:legalForm'].value ? data['lei:legalForm'].value : '');
        }
        // - handling duplicates for primary and secondary sources
        // for (let [key, val] of data) {
        //   val.primarySource = _.compact(_.uniq(val.primarySource));
        // 	val.secondarySource = _.compact(_.uniq(val.secondarySource));
        // }
        this.entitySearchResult.name = data['vcard:organization-name'] && data['vcard:organization-name'].value ? data['vcard:organization-name'].value : '';
        this._commonService.companyName.next(this.entitySearchResult.name)
        var emitData = data;
        this.entityCommonTabService.emitOwnershiPath(emitData);
        this.getDataonPageLoad(data);
        EntityConstants.complianceObject = emitData;
        this.ceriSearchResultObject = emitData;

        if (this.ceriSearchResultObject.aggregateRating) {
          this.aggregateRating = JSON.parse(this.ceriSearchResultObject.aggregateRating.value);
        }
        if (this.ceriSearchResultObject.rating_summary) {
          this.rating_summary = JSON.parse(this.ceriSearchResultObject.rating_summary.value);
        }
        this.companyInfo = this.newEntityObj.results.overview;
        if (this.ceriSearchResultObject['bst:businessClassifier']) {
          this.classifier = JSON.parse(this.ceriSearchResultObject['bst:businessClassifier'].value);
          if (Array.isArray(this.classifier)) {
            if (this.classifier.length > 0) {
              let sample = '';
              for (let i = 0; i < this.classifier.length; i++) {
                sample = sample + this.classifier[i].description + ',';
              }
              this.businessClassifier = sample.replace(/,\s*$/, "");
            }
          } else {
            this.businessClassifier = this.classifier;
          }
        }
      }
    }
  }

  private formatJson(response, type) {
    var data = [];
    if (response.data && response.data.data && response.data.data.results && response.data.data.results.length > 0) {
      //taking the first result
      var currentResult = response.data.data.results[0].result ? (response.data.data.results[0].result.data ? response.data.data.results[0].result.data : {}) : {};
      for (var fetcher in currentResult) {
        for (var i = 0; i < currentResult[fetcher].length; i++) {
          if (!isEmpty(currentResult[fetcher][i])) {
            currentResult[fetcher][i][type].identifier = response.data.data.results[0].identifier ? response.data.data.results[0].identifier : '';
            currentResult[fetcher][i][type].source = fetcher;
            var finalObject = {
              source: currentResult[fetcher][i]['bst:registryURI'] ? currentResult[fetcher][i]['bst:registryURI'] : (currentResult[fetcher][i][type].source),
              value: currentResult[fetcher][i][type]
            }
            data.push(finalObject);
          }
        }//loop each fetcher
      }//for loop each obect
    }//if conditon for data
    else if (response && response.results && response.results.length > 0) {
      var currentResult = response.results[0] ? (response.results[0]['overview'] ? response.results[0]['overview'] : (type === 'documents' ? response.results[0].documents ? response.results[0].documents : {} : {})) : {};
      for (var fetcher in currentResult) {
        if (fetcher !== "comapnyInfo") {
          //	for (var i = 0; i < currentResult[fetcher].length; i++) {
          if (!isEmpty(currentResult[fetcher])) {
            currentResult[fetcher].identifier = response.results[0].identifier ? response.results[0].identifier : '';
            currentResult[fetcher].source = fetcher;
            var finalObject: { source: any, value: any } = {
              source: fetcher,
              value: currentResult[fetcher]
            };
            data.push(finalObject);
          }
        }
        //}//loop each fetcher
      }
    }
    return data;
  }

  catchRout(routname) {
    this._commonService.routPath.next(routname)
  }

  getCountries() {
    this.entityApiService.getJurisdiction().subscribe((data: any) => {
      if (data && data.length > 0) {
        this.jurisdictionListValue = data;
        for (var i = 0; i < data.length; i++) {
          if (data[i].jurisdictionOriginalName && data[i].jurisdictionOriginalName !== 'All') {
            data[i].jurisdictionName = data[i].jurisdictionName && data[i].jurisdictionName ? data[i].jurisdictionName.toLowerCase() : '';
            data[i].flag = '../vendor/$/flags/1x1/' + data[i].jurisdictionName + '.svg';
            if (!(find(this.countryNames, { 'jurisdictionName': data[i].jurisdictionName, 'jurisdictionOriginalName': data[i].jurisdictionName }))) {
              this.countryNames.push(data[i]);
            }
          }
        }
        EntityConstants.countriesData = this.countryNames;
      }
    }, (error: any) => {

    })
  }
  /* purpose: get Data API on PageLOad
  /*created:27 nov 2019*/
  /*author: Ram*/
  getDataonPageLoad(data) {
    var initialData = {
      keyword: data['vcard:organization-name'] && data['vcard:organization-name'].value ? data['vcard:organization-name'].value : '',
      fetchers: ['1016'],
      limit: 1,
      searchType: "Company"
    }

    // disable ehubrest/api/search/getData api call - kamila (AP-1844)
    // this.entityApiService.getEntityDataByTextId(initialData).subscribe((response: any) => {
    //   if (response && response.results && response.results.length > 0
    //     && response.results[0].entities
    //     && response.results[0].entities.length > 0 && response.results[0].entities[0].properties
    //     && response.results[0].entities[0].properties.url) {
    //     this.entitySearchResult.comapnyLogo = response.results[0].entities[0].properties.url;
    //   }

    // });
  }

  // shravani :29-05-2020 Risk score
  getCaseByRiskDetails(query) {
    let riskScoreData = [];
    // disable ehubrest/api/riskScore/score api call - kamila (AP-1844)
    // this.entityApiService.getRiskScoreData(query).subscribe((data: any) => {
    //   if (data.latest) {
    //     if (Math.abs(data.latest.entityRiskModel['overall-score']) > 1) {
    //       data.latest.entityRiskModel['overall-score'] = Math.abs(data.latest.entityRiskModel['overall-score']) / 100;
    //     }
    //     this.cumulativeRisk = data.latest.entityRiskModel['overall-score'] * 100;
    //     this.overviewRisks = data.latest.entityRiskModel;
    //     this.overviewRisks.cumulativeRisk = data.latest.entityRiskModel['overall-score'];
    //     this.riskScoreData = data.latest.entityRiskModel;
    //     riskScoreData = data.latest.entityRiskModel;
    //     EntityConstants.basicSharedObject.riskScoreData = riskScoreData;
    //     this.scaledNumArr[0] = 0;
    //     this.scaledNumArr[1] = data.latest.entityRiskModel['overall-score'] * 100;
    //     this.scaledNumArr[2] = 0;
    //   } else {
    //     this.cumulativeRisk = 0;
    //   }
    // }, (err) => {
    // });
  }
  // shravani:05-06-2020 for risk score popup copiyed from social media component
  openRiskScoreModal(content) {
    setTimeout(() => {
      this.modalService.open(content, { size: 'lg', centered: true, windowClass: 'bst_modal' });
    }, 1000)
    this.plotChart();
  }

  plotChart() {
    this.aggregationType = this.riskScoreData['operator-used'];

    var caseNameValue = this.entitySearchResult.name;
    // var caseNameValue = 'Adidas Ag';
    if (Math.abs(this.riskScoreData['overall-score']) > 1) {
      this.riskScoreData['overall-score'] = Math.abs(this.riskScoreData['overall-score']) / 100;
    }
    //  $scope.cumulativeRisk =this.riskScoreData['overall-score']*100;
    // $scope.isloading = true;
    if (!this.riskScoreData && !this.riskScoreData.attributeRiskScores && this.riskScoreData.attributeRiskScores.length > 0) {/*jshint ignore:line*/
      this.riskScoreNoData = true;
      // $scope.isloading = false;
      return;
    }
    // $scope.isloading = false;
    var finalData = { "nodes": [], "links": [] };
    var nodesId = 0;
    finalData.nodes.push({
      "name": caseNameValue ? caseNameValue.split("_").join(" ") : "",
      "id": nodesId
    });
    nodesId++;
    finalData.nodes.push({
      "name": "",
      "id": nodesId
    });
    nodesId++;

    if (this.riskScoreData && this.riskScoreData.attributeRiskScores && this.riskScoreData.attributeRiskScores.length > 0) {
      this.riskScoreData.attributeRiskScores.forEach((v) => {
        if (v.riskFactor.score) {
          finalData.nodes.push({
            "name": v.attributeName ? v.attributeName.split("_").join(" ") : "",
            "id": nodesId
          });
          if (Math.abs(v.riskFactor.score) > 1) {
            v.riskFactor.score = Math.abs(v.riskFactor.score) / 100;
          }
          finalData.links.push({
            "source": 0,
            "target": nodesId,
            "value": v.riskFactor.score,
            "label": "",
            "txt": "<div style='word-wrap:break-word;color':'#FFFFFF'>" + v.attributeName + " : " + (v.riskFactor.score * 100).toFixed(2) + "%</div>"

          });
          finalData.links.push({
            "source": nodesId,
            "target": 1,
            "value": v.riskFactor.score,
            "label": "",
            "txt": "<div style='word-wrap:break-word;color':'#FFFFFF'>" + v.attributeName + " : " + (v.riskFactor.score * 100).toFixed(2) + "%</div>"

          });
          nodesId++;
        }
      });

      if (finalData.links.length == 0) {
        this.riskScoreNoData = true;
      }
    }

    if (!this.riskScoreNoData) {
      setTimeout(() => {
        var options: any = {
          entityName: caseNameValue,
          container: "#chartContentDiv",
          height: 300,
          width: 700,
          rectWidth: 5,
          rectColor: "#4294D9",
          isfromOtherModules: true,
          isReport: true,
          // path_labels :['FFB','CPO','CPO','PK','CPKO']
        };
        var nodesList = {};
        finalData.nodes.map(function (d, i) {
          d.nodeId = d.id;
          d.id = i;
          nodesList[d.nodeId] = i;

        });
        finalData.links.map(function (d) {
          d.value = d.value;
          d.source = nodesList[d.source];
          d.target = nodesList[d.target];
        });
        // options.data = data;
        options.data = (finalData);
        // options.text_x_pos = '-40';
        options.edge_labels = $.map(finalData.links, function (i) { return i.label; });
        if (typeof this.entitySearchResult == 'object') {
          options.companyLogo = this.entitySearchResult.comapnyLogo;
        }

        snackRiskScoreModule.sankey_chart_risk_score(options);/*jshint ignore:line*/
        setTimeout(() => {
          this.loadRiskpieChart("", options);/*jshint ignore:line*/
        }, 100);

      }, 2000);
    }
  }

  loadRiskpieChart(setTitle, options) {
    var data = [
      { name: "Risk Score", value: this.cumulativeRisk },
      { name: " ", value: 100 - this.cumulativeRisk },

    ];
    var text = Math.round(this.cumulativeRisk);

    // var container= "#finalDiv";
    var width: any = $('.lastRect').attr('height');
    var height: any = $('.lastRect').attr('height');
    var ht: any;

    var thickness = 20;
    // var duration = 750;
    var labeltxtY = 115;
    if (options.edge_labels.length > 4) {
      labeltxtY = 95;
      width = width * 1.5;
      height = height * 1.5;
      ht = $('.lastRect').attr('height') ? $('.lastRect').attr('height') : 15;
      if (ht != 15) {
        ht = ht / 2;
      }
    }
    var radius = Math.min(width, height) / 2;
    // var color = d3.scaleOrdinal(d3.schemeCategory10);
    var colorObj = { " ": "#566a71", "Risk Score": "rgb(66, 148, 217)" };

    var svg = d3.select('#finalDiv').attr('height', 120).attr('width', 120)
      .append('svg')
      .attr("class", "sankPie")
      .attr('width', width)
      .attr('height', parseFloat(height) + 50);

    // var temp_width = $('.lastRect').attr('height') ? $('.lastRect').attr('height')/2 : 20;
    //	    $('#finalDiv').attr('transform', 'translate(' + (width / 2) + ',' + (-parseInt(temp_width)) + ')');
    $('#finalDiv').attr('transform', 'translate(' + (20) + ',' + 0 + ')');
    var g = svg.append('g')
      .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');



    var arc = d3.arc()
      .innerRadius(radius - thickness)
      .outerRadius(radius);

    var pie = d3.pie()
      .value(function (d) { return d.value; })
      .sort(null);

    g.selectAll('path')
      .data(pie(data))
      .enter()
      .append("g")

      .append('path')
      .attr('d', arc)
      .attr('fill', function (d) {
        return colorObj[d.data.name];
      })
      .each(function (d, i) { this._current = i; });

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('font-size', '14px')
      .attr("fill", "#ccc")
      .text(text);

    //	    if(setTitle){
    svg.append("text")
      .attr('x', 52)
      .attr('y', labeltxtY)
      .attr('width', 50)
      .attr('height', 80)
      .attr("text-anchor", "middle")
      .attr("stroke", 'none')
      .attr("font-weight", 'normal')
      .attr("fill", '#9B9FA2')
      .style("font-size", '12px')
      .text('RISK SCORE');
    //	    }
  };


  /**API call for getting person information from multisource API
   * Author : shravani
   * Date : 28-10-2020
  */
 //need to change
  getPersonInformation(data) {
    // let personResults = EntityConstants.personSearchConstant && EntityConstants.personSearchConstant['results'] && EntityConstants.personSearchConstant['results']['f12c723e8ed6f75e2db18966f8df6aa9'] ? EntityConstants.personSearchConstant['results']['f12c723e8ed6f75e2db18966f8df6aa9'] : {};
    // this.formatPersonInfo(personResults);
    if (data && Object.keys(data).length > 0) {
      let personSelectedInfo = data ? data : {};
      this.formatPersonInfo(personSelectedInfo);
    }

  }

  // shravani: 28-10-2020 Formating the result of person multisource API
  formatPersonInfo(personResults) {
    this.personFinalObject = [];
    this.PersonEntityDetails = {};
    if (personResults && (Object.keys(personResults)).length > 0) {
      this.PersonInfoKeys.map((key) => {
        if (personResults && personResults[key]) {
          this.sortBasedOnSourceandcredibility(personResults[key], key);
        }
      })
      this.PersonInfoKeys.forEach(elementKey => {
        let data = this.personArray.filter((el) => el.key.toLowerCase() == elementKey.toLowerCase());
        if (data && data.length > 0) {
          let sortedData = data.sort(function (a, b) { return b.credibility - a.credibility });
          if (sortedData && sortedData.length > 0) {
            var credibility = sortedData[0].credibility;
            let primiarySources = sortedData.filter((val) => val.credibility >= credibility);
            let secondarySources = sortedData.filter((val) => val.credibility < credibility);
            var obj = { ...sortedData[0] }
            obj['primiarySources'] = [...primiarySources];
            obj['secondarySources'] = [...secondarySources];
            obj['primarySourceLength'] = primiarySources.length;
            obj['secondarySourceLength'] = secondarySources.length;
            obj.value = obj.value ? (Array.isArray(obj.value) ? obj.value : [obj.value]) : [];
            this.personFinalObject.push(obj)
            this.PersonEntityDetails[elementKey] = obj;
          }
        }
      });
      this.handleAdressKeys();
    }
  }
  handleAdressKeys() {
    var address = this.personFinalObject.filter((val) => val.key == 'address')
    if (this.PersonEntityDetails && this.PersonEntityDetails['address'] && this.PersonEntityDetails['address'].value && this.PersonEntityDetails['address'].value.length) {
      for (const key in this.PersonEntityDetails['address'].value[0]) {
        this.PersonEntityDetails[key] = {
          primiarySources: [],
          secondarySources: []
        };
        if (address && address.length > 0) {
          let addressobj = address[0];
          if (addressobj.primiarySources) {
            addressobj.primiarySources.forEach((source) => {
              if (source.value && source.value.length > 0) {
                var fiirstObject = source.value[0];
                source.value = [fiirstObject]
              }
              source.value.forEach((val) => {
                if (key in val) {
                  this.PersonEntityDetails[key].primiarySources.push({
                    credibility: source.credibility,
                    key: key,
                    source: source.source ? source.source : '',
                    source_url: source.source_url ? source.source_url : '',
                    value: val[key]
                  })
                }
              })
            });
          }
          if (addressobj.secondarySources) {
            addressobj.secondarySources.forEach((source) => {
              if (source.value && source.value.length > 0) {
                var fiirstObject = source.value[0];
                source.value = [fiirstObject]
              }
              source.value.forEach((val) => {
                if (key in val) {
                  this.PersonEntityDetails[key].secondarySources.push({
                    credibility: source.credibility,
                    key: key,
                    source: source.source ? source.source : '',
                    source_url: source.source_url ? source.source_url : '',
                    value: val[key]
                  })
                }
              })
            });
          }
          var primary_data = this.PersonEntityDetails[key].primiarySources && this.PersonEntityDetails[key].primiarySources.length ? this.PersonEntityDetails[key].primiarySources[0] : {};
          this.PersonEntityDetails[key].credibility = this.PersonEntityDetails[key].primiarySources
          this.PersonEntityDetails[key].key = key
          this.PersonEntityDetails[key].secondarySources = this.PersonEntityDetails[key].secondarySources
          this.PersonEntityDetails[key].source = primary_data && primary_data.source ? primary_data.source : '';
          this.PersonEntityDetails[key].source_url = primary_data && primary_data.source_url ? primary_data.source_url : '';
          this.PersonEntityDetails[key].value = primary_data && primary_data.value ? [primary_data.value] : [];
          // if(key =='country'){
          //   this.PersonEntityDetails[key].fullJursidictionName
          // }
        }
      }
    }
    this._commonService.screeningDataSubject.next(this.PersonEntityDetails)

  }
  // shravani :29-10-2020 sorting the sources based on credibility
  sortBasedOnSourceandcredibility(personInfo, key) {
    let finalArray = [];
    if (personInfo && (Object.keys(personInfo)).length > 0) {
      let sourceKeys = Object.keys(personInfo);
      sourceKeys.map((sourcekey) => {
        let data = personInfo[sourcekey].sort(function (a, b) { return b.credibility - a.credibility });
        if (data && data.length > 0) {
          let dataObject = {
            'value': data && data[0] && data[0].value ? data[0].value : '',
            'credibility': data && data[0] && data[0].credibility,
            'source_url': data && data[0] && data[0].source_url,
            'source': sourcekey,
            'key': key
          }
          this.personArray.push(dataObject);
        }
      })
    }
  }

  // 29-10-2020 shravani get the attributes values based on key
  getValueByAttributeName(attribute, subkey) {
    if (this.personFinalObject && this.personFinalObject.length > 0 && attribute != '') {
      let result = this.personFinalObject.filter((el) => el.key.toLowerCase() == attribute.toLowerCase());
      if (result) {
        let filteredData = result[0];
        if (filteredData && filteredData['value']) {
          if (Array.isArray(filteredData['value'])) {
            if (attribute == 'address') {
              return this.adddressFormat(filteredData['value'][0], subkey)
            } else {
              return filteredData['value'][0];
            }
          } else {
            if (attribute == 'address') {
              return this.adddressFormat(filteredData['value'], subkey)
            } else {
              return filteredData['value'];
            }
          }
        } else {
          return '';
        }
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
  // Mouse events to when hover on rating
  onMouseHover(event, key, sourcesData) {
    if (event.type === 'mouseover') {
      this.openSources = true;
      // this.selectedDisplayAttribute = displayName;
      // let match = this.personFinalObject.filter((val) => val.key.toLowerCase() == key.toLowerCase())
      // if (match) {
      this.selectedSource = sourcesData && sourcesData.source ? sourcesData.source : "";
      this.selectedAttributePrimarySource = sourcesData && sourcesData.primiarySources ? sourcesData.primiarySources : [];
      this.selectedAttributeSecondarySource = sourcesData && sourcesData.secondarySources ? sourcesData.secondarySources : [];
      // }
    }
  }
  // Mouse events when hover out from rating
  onMouseOut(event) {
    if (event.type === 'mouseout') {
      this.openSources = false;
    }
  }

  // shravani :30-10-2020 format the address and return required data from address obj
  adddressFormat(data, subkey) {
    if (data && subkey) {
      if (subkey.toLowerCase() == 'country') {
        this.jurdictionFlag = data[subkey];
        return this.fullJursidictionName(data[subkey]);
      } else {
        return data && data[subkey];
      }
    } else {
      return
    }
  }

  // shravani :30-10-2020 format the address and return required data from address obj
  fullJursidictionName(code) {
    let data = '';
    if (code) {
      this.jurisdictionListValue.forEach((element) => {
        if (element.jurisdictionName.toLowerCase() == code.toLowerCase()) {
          data = element.jurisdictionOriginalName;
        }
      });
      return data;
    }
  }

  // ram : 31-10-2020 open the modal on click of sources link
  openPersonInfoEditModal(editedDataKey, statickeys) {
    const modalRef = this.modalService.open(PersonInfoEditComponent, {
      windowClass: 'PersonEditModal'
    });
    modalRef.componentInstance.PersonmodalData = editedDataKey;
    modalRef.componentInstance.statickeys = statickeys;
  }

  getURLshort(urldata) {
    var Url = '';
    if (urldata) {
      Url = urldata.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
    } else if (urldata === '' && urldata !== undefined) {
      Url = 'user input';
    }
    return Url;
  }

  getHoverModalTemplate(data) {
    var template = '';
    if (!data || ((!data.primiarySources || data.primiarySources.length == 0) && (!data.secondarySources || data.secondarySources.length == 0))) {
      template =
        '<div class="col-sm-6 pad-l0">' +
        '<div class="top-heading pb-2 mb-3 justify-content-between border-thin-dark-cream-b d-flex ai-c">' +
        '<h4 class="mb-0 text-dark-black">Primary</h4>' +
        '<span class="text-dark-pastal-green font-regular mar-r5">' +
        '<i class="fa fa-link text-dark-black"></i> 0' +
        "</span></div>" +
        '<div class="bottom-content-wrapper">' +
        '<ul class="custom-list pad-l0 item-1 panel-scroll">' +
        '<li class="d-flex ai-c"><span class="text-dark-black" style="word-break: break-word; white-space:pre-wrap">No Sources Available</span></li>' +
        '</ul></div></div>';

      template +=
        '<div class="col-sm-6 pad-r0">' +
        '<div class="top-heading pb-2 mb-3 justify-content-between border-thin-dark-cream-b d-flex ai-c">' +
        '<h4 class="mb-0 text-dark-black">Secondary</h4>' +
        '<span class="text-dark-cream text-dark-black font-regular mar-r5"><i class="fa fa-link"></i> 0' +
        "</span>" +
        "</div>" +
        '<div class="bottom-content-wrapper">' +
        '<ul class="custom-list pad-l0 item-1 panel-scroll">' +
        '<li class="d-flex ai-c"><span class="text-dark-black" style="word-break: break-word; white-space:pre-wrap">No Sources Available</span></li>' +
        '</ul></div></div>';

      return template;
    }

    // Primary Sources
    if (data.primiarySources) {
      template =
        '<div class="col-sm-6 pad-l0">' +
        '<div class="top-heading pb-2 mb-3 justify-content-between border-thin-dark-cream-b d-flex ai-c">' +
        '<h4 class="mb-0 text-dark-black">Primary</h4>' +
        '<span class="text-dark-pastal-green font-regular mar-r5">' +
        '<i class="fa fa-link text-dark-black"></i> ' +
        data.primiarySources.length +
        "</span></div>" +
        '<div class="bottom-content-wrapper">' +
        '<ul class="custom-list pad-l0 item-1 panel-scroll">';
      if (data.primiarySources && data.primiarySources.length > 0) {
        data.primiarySources.map((d, index) => {
          if (d) {
            if (d.source == data.source && !data.isUserData) { //index === 0 &&
              template +=
                '<li class="d-flex ai-c"><span class="text-dark-black" style="word-break: break-word; white-space:pre-wrap">' +
                this.getURLshort(d.sourceDisplayName || d.source) +
                '</span><i class="fa fa-check-circle-o mar-x5 text-dark-blue f-11 "></i></li>'; //
            } else {
              template += '<li class="d-flex ai-c"><span class="text-dark-black" style="word-break: break-word; white-space:pre-wrap">' +
                this.getURLshort(d.sourceDisplayName || d.source) +
                '</span></li>'; // <i class="fa fa-check-circle-o mar-x5 text-dark-blue f-11 "></i>
            }
          }
        });
      } else {
        template += '<li class="d-flex ai-c"><span class="text-dark-black" style="word-break: break-word; white-space:pre-wrap">No Sources Available</span></li>';
        // <i class="fa fa-check-circle-o mar-x5 text-dark-blue f-11 "></i>
      }
      template += '</ul></div></div>';
    }

    // Secondary Sources
    if (data.secondarySources) {
      template +=
        '<div class="col-sm-6 pad-r0">' +
        '<div class="top-heading pb-2 mb-3 justify-content-between border-thin-dark-cream-b d-flex ai-c">' +
        '<h4 class="mb-0 text-dark-black">Secondary</h4>' +
        '<span class="text-dark-cream text-dark-black font-regular mar-r5"><i class="fa fa-link"></i> ' +
        data.secondarySources.length +
        "</span>" +
        "</div>" +
        '<div class="bottom-content-wrapper">' +
        '<ul class="custom-list pad-l0 item-1 panel-scroll">';
      if (data.secondarySources && data.secondarySources.length > 0) {
        data.secondarySources.map((d, index) => {
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
        });
      } else {
        template +=
          '<li class="d-flex ai-c"><span class="text-dark-black" style="word-break: break-word; white-space:pre-wrap">No Sources Available</span></li>';
        // <i class="fa fa-check-circle-o mar-x5 text-dark-blue f-11 "></i>
      }
    }
    template += '</ul></div></div>';
    return template;
  }

  open(content) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'custom-modal c-arrow  bst_modal add-ownership-modal add-new-officer full_space_modal'
    }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
 /**When Image got broke
   * Author : shravani
   * Date : 24-11-2020
  */
  imgError(image) {
    this.imageBroke = true;
  }


  // @reason : get person entity info from BE
  // @params : none
  // @author : ammshathwan
  // @return : none
  // @date : 21 dec 2022
  getPersonEntityData():void{
    this.currentEntityInfo = this.getEntityValue();
    this.pageLoader = false;
    this.entityApiService.searchPersonMultisource(this.currentEntityInfo).subscribe((entutyResult:any) => {
      if(entutyResult && entutyResult.cached || entutyResult && entutyResult.results && entutyResult.results.length && entutyResult.results[this.currentEntityInfo.entityID]){
        if(entutyResult.results[this.currentEntityInfo.entityID]){
          this.pageLoader = true;
          this.isDataFound = false;
          this.getPersonInformation(entutyResult.results[this.currentEntityInfo.entityID])
        }else{
          this.isDataFound = true;
        }
      }else{
        this.isDataFound = true;
        this._sharedServicesService.showFlashMessage('Data not found','danger');
      }
    },err => {
      this.isDataFound = true;
      this._sharedServicesService.showFlashMessage('Data not found' ,'danger');
      this.pageLoader = false;
    })
  }

  // @reason : get entity name and entity id
  // @params : none
  // @author : ammshathwan
  // @return : object contain entity name and entity id ( {query:[ENTITY_NAME] , entityID:[ENTITY_ID]} )
  // @date : 21 dec 2022
  getEntityValue():any{
    let entityData:any = {}
    const entityUrl = this.router.url;
    const personParamsData = entityUrl.split('?')
    const queryArray = personParamsData && personParamsData.length ? personParamsData[1].split('&') : []
    if(queryArray && queryArray.length){
      queryArray.map(query => {
        const data =  query ? query.split('=') : [];
        if(data && data.length){
          if(data[0] == "query"){
            entityData.query = data[1].split('%20').join(' ');
          }else if(data[0] == "eId"){
            entityData.entityID = data[1];
          }
        }
      })
    }
    return entityData;
  }

  public trackByName(_, item): string {
    return item.name;
  }
}
