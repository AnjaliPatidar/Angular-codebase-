import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertManagementService } from '@app/modules/alert-management/alert-management.service';
import { displaCyENT } from "../../../../../assets/js/displacy-entity ";
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { ConfirmationComponent } from "../../../../common-modules/modules/confirmation/confirmation.component";
import * as moment from 'moment';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { Options } from '@angular-slider/ngx-slider';
import { TitleCasePipe } from '@angular/common';
import { GeneralSettingsApiService } from '../../../../modules/systemsetting/services/generalsettings.api.service';
declare const $: any;

@Component({
  selector: 'app-person-alert-card',
  templateUrl: './person-alert-card.component.html',
  styleUrls: ['./person-alert-card.component.scss']
})
export class PersonAlertCardComponent implements OnInit {
  public personAlertCardUtilityObject: any = {
    watchListattrData: [],
    mainData: [],
    generalObjKeys: [
      { displayName: 'Name', key: 'name' },
      { displayName: 'Given Name', key: 'given_name' },
      { displayName: 'Family Name', key: 'family_name' },
      { displayName: 'Birth Place', key: 'city_of_birth' },
      { displayName: 'Gender', key: 'gender' },
      { displayName: 'Person Image', key: 'images' },
      { displayName: 'Identifiers', key: 'identifiers' },
      { displayName: 'Nationality', key: 'nationality' },
      { displayName: 'Home Location', key: 'home_location' },
      { displayName: 'Addresses', key: 'address' },
      { displayName: 'Additional Names', key: 'alternative_names' },
      { displayName: 'Additional Names', key: 'aka' },
      { displayName: 'Legal Type', key: 'legal_type' },
      { displayName: 'Identifier', key: 'identifier' },
      { displayName: 'Given Name', key: 'first_name' },
      // {displayName:'Additional Names',key:'additional_names'},
      // {displayName:'',key:'honor_prefix'},
    ],
    personkeys: ['legal_type', 'given_name', 'home_location', 'watchlist_record_id', 'identifiers', 'identifier', 'descriptions', 'date', 'active_status', 'first_name',
      'city_of_birth', 'images', 'aka', 'alternative_names', 'address', 'gender', 'family_name', 'nationality', 'additional_names', 'honor_prefix'],
    watchlistKeys: [
      { displayName: 'Watchlist Hit Type', key: 'descriptions' },
      { displayName: 'Watchlist Record Id', key: 'watchlist_record_id' },
      { displayName: 'Watchlist Last Update Date', key: 'date' },
      { displayName: 'Watchlist Status', key: 'active_status' },
    ],
    watchlistMainData: [],
    articlesData: []
  };
  public alertCardUtilityObject: any = {
    'aka_matched': '',
    addressAttribute: [],
    statusMaintained: '',
    articleStatus: '',
    articleReasons: [],
    rolesArry: [],
    selectedArticleReason: [],
    articleselectedIcon: '',
    articleselectedIconColor: '',
    notesPopovertoggleObject: {},
    sanctionPopovertoggleObject: {},
    RcaPopoverToggleObject: {},
    relatedArticleStatus: [],
    relatedArticleReasons: [],
    relatedArticleselectedReason: [],
    relatedArticleselectedStatus: '',
    tempselectedrelatedStatus: '',
    originalang: '',
    langselected: false,
    adverseMediaData: false,
    currentArticlepath: {}
  };
  public likeClassification: any;
  public dislikeClassification = false;
  public localeText = {
    to: "-",
  }
  public dummyReason = [];
  public dateFormat = GlobalConstants.globalDateFormat;
  public financeArticleDetails: any = {};
  public showOnlyRelatedEntities = false;
  public mainEntityRelationTypeStr: string = "Main Entity"
  public reclassificationInfo = [];
  public articalDetail: any = [];
  public languageJson: any;
  public dropdownSettings = {};
  public date = new Date();
  public highlightrow: string = 'pep0';
  public activeKeywordsPanels: any;
  public languageTranslateList = [];
  public selectedItems = [];
  public listForDropDown = [];
  public articleSearchQuery: any;
  public dropdown: boolean = false;
  public articalEntityId: any;
  public selectedCountry;
  public currentAlertStatus: string;
  public profileNotes: any;
  public profileInfo: any;
  public entityDetails = { 'name': "", 'type-icon': "" };
  public articleSentimentList = [
    {
      "label": "Pending Confirmation",
      "disable": false,
      "values": {
        "listItemId": 883,
        "code": "Pending Confirmation",
        "displayName": "Pending Confirmation",
        "icon": "question-circle",
        "allowDelete": false,
        "listType": "Alert Status",
        "colorCode": "#000",
        "flagName": "",
        "file_id": null,
        "selected": false
      },
      "listItemId": 883
    },
    {
      "label": "Confirmed",
      "disable": false,
      "values": {
        "listItemId": 884,
        "code": "Confirmed",
        "displayName": "Confirmed",
        "icon": "check-circle",
        "allowDelete": false,
        "listType": "Alert Status",
        "colorCode": "rgb(0,128,0) ",
        "flagName": "",
        "file_id": null,
        "selected": false
      },
      "listItemId": 884
    },

    {
      "label": "Decline",
      "disable": false,
      "values": {
        "listItemId": 885,
        "code": "Decline",
        "displayName": "Decline",
        "icon": "times-circle",
        "allowDelete": false,
        "listType": "Alert Status",
        "colorCode": "rgb(255,0,0)",
        "flagName": "",
        "file_id": null,
        "selected": false
      },
      "listItemId": 887
    }];
  public hitType: any;
  public personAttributes: ["name", "family_name", "date_of_birth", "gender", "nationality", "home_location", "address", "alternative_names"];
  public confidenceFilter = 0;
  public screenData: any;
  public personData: any;
  public maxValue: number;
  public currentMonth;
  public currentDate;
  public options: Options;
  public minValue: number;
  public adverseSelectedItems: any = [];
  public adverseListForDropDown: any = [];
  public relationshipTypes: any = {};
  public monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  public alert_entityId = '';
  public articlesData: any;
  public finalData: any[];
  public rowData: any;
  public checkData: boolean = true;
  public checkTabSelected: any = 'pep';
  public activePanelId: string;
  public selectedFeed: any;
  public personScreenData: any;
  public personWatchListData: any;
  public accodrianData: any = [
    {
      "first_name": "pep",
      primaryOpen: false,
      id: "pep"
    },
    {
      "first_name": "sanction",
      primaryOpen: false,
      id: "pep"

    },
    {
      "first_name": "finance",
      primaryOpen: false,
      id: "finance"
    },
    {
      "first_name": "jurisdiction",
      primaryOpen: false,
      id: "jurisdiction"
    }
  ];
  public alertUtilityObject: any = {
    financeSpinner: true,
    errorMessage: false,
    errorMessagedetail: 'Something Went Wrong',
    financeisfirst: false,
    showReasons: false,
    isFactavailable: false,
    showClassification: '',
    article_sentiment: {
      "label": "Pending Confirmation"
    }
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modalService: NgbModal,
    private _alertService: AlertManagementService,
    private _commonServices: CommonServicesService,
    private titlecasePipe: TitleCasePipe,
    public ChangeDetectorRef: ChangeDetectorRef,
    public dialogReference: MatDialogRef<PersonAlertCardComponent>,
    private generalSettingsApiService: GeneralSettingsApiService
  ) { }

  ngOnInit() {
    this.rowData = (this.data && this.data.rowData) ? this.data.rowData : {};
    this.selectedFeed = (this.rowData && this.rowData.column && this.rowData.column.colDef && this.rowData.column.colDef.field) ? this.rowData.column.colDef.field : '';
    this.personData = (this.rowData && this.rowData.data) ? this.rowData.data : {};
    this.personWatchListData = (this.personData && this.personData.screeningResults && this.personData.screeningResults.results && this.personData.screeningResults.results.screening &&
      this.personData.screeningResults.results.screening.watchlists && this.personData.screeningResults.results.screening.watchlists.length && this.personData.screeningResults.results.screening.watchlists[0] && this.personData.screeningResults.results.screening.watchlists[0]) ? (this.personData.screeningResults.results.screening.watchlists[0]) : [];

    this.personScreenData = (this.personWatchListData && this.personWatchListData.basic_info) ? (this.personWatchListData.basic_info) : {};

    if (this.personScreenData && Object.keys(this.personScreenData).length > 0) {
      this.hitType = (this.personWatchListData && this.personWatchListData.entries[0] && this.personWatchListData.entries[0].classification) ? this.personWatchListData.entries[0].classification : "";
      this.screenData = (this.personData && this.personData.screeningResults && this.personData.screeningResults.results && this.personData.screeningResults.results.screening) ? this.personData.screeningResults.results.screening : {};
      this.personAttributes = ["name", "family_name", "date_of_birth", "gender", "nationality", "home_location", "address", "alternative_names"]
      let keysOfObject = Object.keys(this.personScreenData);
      this.profileInfo = this.profileNotes = this.personScreenData ? this.personScreenData.profile_notes : "";
      if (keysOfObject && keysOfObject.length > 0) {
        keysOfObject.forEach((attribute) => {
          // pushing basic info attributes to general arrays
          this.personAlertCardUtilityObject.generalObjKeys.forEach((element, index) => {
            if (element.key == attribute) {
              let valuesOfObject = this.personScreenData[attribute];
              let data = this.PersonValueFormatter(attribute, valuesOfObject)
              this.personAlertCardUtilityObject.mainData.push({ displayName: this.personAlertCardUtilityObject.generalObjKeys[index].displayName, value: data });
            }
          });
          // pushing basic info attributes to watchlist arrays
          // this.personAlertCardUtilityObject.watchlistKeys.forEach((element, index) => {
          //   if (element.key == attribute) {
          //     let valuesOfObject;
          //     if(attribute == 'descriptions'){
          //       valuesOfObject = this.personScreenData[attribute]
          //       .filter(f=>{
          //         return f.indexOf(this.selectedFeed) >- 1
          //       })
          //     }
          //     else{
          //       valuesOfObject = this.personScreenData[attribute];
          //     }
          //     let data = this.PersonValueFormatter(attribute, valuesOfObject)
          //     this.personAlertCardUtilityObject.watchlistMainData.push({ displayName: this.personAlertCardUtilityObject.watchlistKeys[index].displayName, value: data });
          //   }
          // });
        })
      }

      this.entityDetails['name'] = this.personData.FullName ? this.personData.FullName : "";
      this.entityDetails['type-icon'] = (this.personData && typeof this.personData.Type == 'string' && this.personData.Type.trim().toLowerCase() == "person") ? "person" : "business";
      let date: Date = new Date();
      this.currentMonth = this.monthNames[date.getMonth()];
      this.currentDate = date.getDate();
      this.maxValue = new Date().getFullYear();
      //last five years
      this.minValue = this.maxValue - 5;
      this.profileInfo = this.profileNotes = this.personScreenData ? this.personScreenData.profile_notes : "";
      let year = this.date.getFullYear();
      this.options = {
        showTicks: true,
        floor: 0,
        ceil: 6,
        draggableRange: true,
        stepsArray: [
          { value: year - 4 },
          { value: year - 3 },
          { value: year - 2 },
          { value: year - 1 },
          { value: year }
        ]
      };
      let hasname = this.screenData.watchlists[0].basic_info.name + this.personData.FullName;
      this.alert_entityId = (this.personWatchListData.basic_info.city_of_birth) ? (this.hashCode(hasname + this.personWatchListData.basic_info.city_of_birth)) : this.hashCode(hasname) //this.alertCard.alertMetaData.name && data.person.entities[0].jurisdiction ? this.hashCode(hasname) + data.person.entities[0].jurisdiction : this.generateRandomEntityId(8);
      this.alert_entityId = this.alert_entityId.replace(/[^a-zA-Z0-9 ]/g, "");
      this.accodrianData = [];
      this.screenData['Politically Exposed Person (PEP)'] = [];
      this.screenData['Adverse Media'] = [];
      this.screenData['Relative or Close Associate (RCA)'] = [];
      this.screenData['Sanctions List'] = [];
      this.screenData['Special Interest Person (SIP)'] = [];
      this.screenData['Bst Adverse Media'] = [];
      this.screenData['Special Interest Entity (SIE)'] = [];
      this.screenData.jurisdiction = [];
      this.screenData.selectedData = {};
      let feedValue = this.screenData.watchlists.forEach((element) => {
        element.entries.forEach(entries => {
          let key = '';
          if (entries.classification.indexOf(this.selectedFeed) !== -1 || entries.classification === this.selectedFeed) {
            key = entries.classification;
            if (this.screenData[key]) {
              this.screenData[key].push(element);
            }
            if (this.screenData[key].length == 1) {
              this.accodrianData.push({
                "first_name": key,
                primaryOpen: false,
                id: key.toLowerCase().split(' ').join('')
              })
            }
          }
        })
      })
    };
    if (this.accodrianData && Array.isArray(this.accodrianData) && this.accodrianData.length > 0) {
      if (this.screenData['Politically Exposed Person (PEP)'] && this.screenData['Politically Exposed Person (PEP)'].length > 0 && (this.accodrianData && Array.isArray(this.accodrianData) && this.accodrianData.length > 0 && this.accodrianData[0].first_name === "Politically Exposed Person (PEP)")) {
        this.activePanelId = 'panel-politicallyexposedperson(pep)';
        this.accodrianData[0].primaryOpen = true;
        this.selectedTab('Politically Exposed Person (PEP)', this.screenData['Politically Exposed Person (PEP)'][0], 0);
      } else if (this.screenData['Sanctions List'] && this.screenData['Sanctions List'].length > 0 && this.accodrianData[0].first_name === "Sanction") {
        this.activePanelId = 'panel-sanction';
        if (this.accodrianData.length > 1) {
          this.accodrianData[1].primaryOpen = true;
        }
        this.selectedTab('sanction', this.screenData['Sanctions List'][0], 0);
      } else if (this.accodrianData.length > 0 && this.accodrianData[0].first_name === "Adverse Media Articles") {
        this.activePanelId = 'panel-adversemediaarticles';
        this.accodrianData[0].primaryOpen = true;
        this.checkTabSelected = 'Adverse Media Articles';
        this.alertUtilityObject.financeisfirst = true;
        this.getarticles();
      } else {
        this.activePanelId = 'panel-' + this.accodrianData[0].id;
        this.accodrianData[0].primaryOpen = true;
        this.checkTabSelected = this.accodrianData[0].first_name;
        this.selectedTab(this.accodrianData[0].first_name, this.screenData[this.accodrianData[0].first_name][0], 0);
      }
    }
  }


  ngAfterViewInit() {
    this.getLanguageList();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'listItemId',
      textField: 'displayName',
      allowSearchFilter: true,
      enableCheckAll: false,
      noDataAvailablePlaceholderText: this.getLanguageKey('No classifications were defined')
    };
    let promisObj = new Promise((resolve, reject) => {
      this._commonServices.behaveObserverForgetLanguageJson.subscribe((resp) => {
        if (resp) {
          this.languageJson = resp;
          this.languageJson['to'] = "-"
          this.localeText = this.languageJson;
          resolve(this.languageJson);
        }
      });
    });

  }
  getLanguageKey(text) {
    var langKey = text;
    if (this.languageJson) {
      langKey = this.languageJson[text];
    }
    return langKey;
  }
    /* @purpose: get list of articles
* @created: 26 August 2020
* @returns:
* @author:Shravani*/
  getarticles() {
    if (this.alert_entityId) {
      this._alertService.getSSBScreeningData(this.alert_entityId).then((response: any) => {
        if (response && response.news) {
          let promises = [];
          this.getFinanceArticles(response, promises);
        }
      })
    }
  }

  hashCode = function (str) {
    if (str) {
      str = str.trim();
      var hash = 0, i, chr;
      for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash.toString();
    }
    else {
      return str;
    }
  }


  getFinanceArticles(data, promises) {
    let entityIds = Object.keys(data.news);
    entityIds.forEach((entityId) => {
      let relation_type;
      if (this.alert_entityId === entityId) {
        relation_type = this.mainEntityRelationTypeStr;
        // } else if (entityId == '421148228212762499') {
        //   relation_type =  "Test Relation"// fake relationship types used for testing
        // } else if (entityId == '1815492684129638286') {
        //   relation_type =  "New Relation"// fake relationship types used for testing
      } else {
        Object.keys(this.relationshipTypes).forEach(key => {
          if (this.relationshipTypes[key].includes(entityId)) {
            relation_type = this.titlecasePipe.transform(key);
          }
        });
      }

      if (data && data.news && data.news[entityId] && data.news[entityId].classifications) {
        data.news[entityId].classifications.forEach((classification, index) => {
          if (classification && classification.count > 0 && classification['_links'] && classification['_links'].articles) {
            promises.push(new Promise((resolve, reject) => {
              this._alertService.getarticleList({ articlePath: classification['_links'].articles }).then((response: any) => {
                if (response && response.results && response.results.length > 0) {
                  response.results.forEach(element => {
                    if (element && element['classification_1'] && element['classification_1']['classes'] && Array.isArray(element['classification_1']['classes'])) {
                      if (classification && classification.classification) {
                        element['classification_1']['classes'].unshift(classification.classification)
                        element['classification_1']['classes'] = element['classification_1']['classes'].filter(function (item, pos) {
                          return element['classification_1']['classes'].indexOf(item) == pos;
                        })
                      }
                    }
                    element['relation_type'] = relation_type;
                  });
                  this.personAlertCardUtilityObject.articlesData = this.personAlertCardUtilityObject.articlesData.concat(response.results);
                  if (this.personAlertCardUtilityObject.articlesData.length > 0) {
                    this.alertUtilityObject.financeSpinner = true;
                    this.getsingleArticleDetail(this.personAlertCardUtilityObject.articlesData[0]);
                  }
                  if (!this.adverseListForDropDown.includes(relation_type)) {
                    this.adverseListForDropDown.push(relation_type);
                  }
                  resolve("success")

                } else {
                  resolve("success")
                }
              }).catch((err) => {
                resolve("success")
                // this.alertUtilityObject.financeSpinner = false;
                // this.alertCard.alertMetaData.results.screening['Adverse Media Articles'] = [];
              })
            }));
          }
        });
      }
    })
  }
    /* @purpose: get selected article details
* @created: 26 August 2020
* @returns:
* @author:Shravani*/
  getsingleArticleDetail(article) {
    this.articalDetail = [];
    this.alertUtilityObject.showReasons = false;
    this.alertUtilityObject.isFactavailable = false;
    this.alertUtilityObject.currentArticlepath = article;
    this.alertCardUtilityObject.articleStatus = '';
    this.alertCardUtilityObject.articleReasons = [];
    this.alertCardUtilityObject.selectedArticleReason = [];
    this.alertCardUtilityObject.articleselectedIcon = '';
    this.alertCardUtilityObject.articleselectedIconColor = '';
    this._alertService.getarticleDetail({ articlePath: article.view_article_path }).then((response: any) => {
      if (response && response.results) {
        if (response && response.results && response.results['classification_1'] && response.results['classification_1']['classes'] && Array.isArray(response.results['classification_1']['classes'])) {
          if (article && article.classification_1 && article.classification_1['classes'] && Array.isArray(article.classification_1['classes']) && article.classification_1['classes'].length > 0) {
            response.results['classification_1']['classes'].unshift(article.classification_1['classes'][0])
            response.results['classification_1']['classes'] = response.results['classification_1']['classes'].filter(function (item, pos) {
              return response.results['classification_1']['classes'].indexOf(item) == pos;
            })
          }
        }
        this.showOnlyRelatedEntities = false;
        this.activeKeywordsPanels = [];
        this.articalDetail = response;
        this.alertCardUtilityObject.originalang = this.articalDetail.results.language
        this.articleSearchQuery = response && response.search_query ? response.search_query : '';
        this.articalEntityId = response && response.results.entity_id ? response.results.entity_id : '';
        var txt = response.results.text ? response.results.text : '';
        var ent = response.results.entities ? response.results.entities : [];
        var types = [];
        response.results.keywords = [];

        if (response.results.sentiment) {
          var index = this.alertUtilityObject.articleSentimentList.findIndex((val) => val.label === response.results.sentiment);
          if (index !== -1) {
            this.alertUtilityObject.article_sentiment = this.alertUtilityObject.articleSentimentList[index];
          } else {
            this.alertUtilityObject.article_sentiment = this.alertUtilityObject.articleSentimentList[0];
          }
        } else {
          this.alertUtilityObject.article_sentiment = {
            label: "Pending Confirmation"
          }

        }
        var accmulator = [];
        var checkedTabs = {}
        ent.forEach((val) => {
          val.type = val.Type ? val.Type : val.type ? val.type : '';
          val.text = val.text ? val.text : val.name ? val.name : '';
          val.Text = val.text ? val.text : val.name ? val.name : '';
          val.start = val.start ? val.start : (val.BeginOffset ? val.BeginOffset : 0);
          val.end = val.end ? val.end : (val.EndOffset ? val.EndOffset : 0);
          val.checked = true;
          var findIndex = types.indexOf(val.type.toLowerCase());
          if (val.type && findIndex === -1) {
            types.push(val.type.toLowerCase());
            checkedTabs['keytab' + val.type] = true;
            accmulator.push({
              "type": val.type,
              "values": [val],
              "tabCheck": true
            })
          } else {
            accmulator[findIndex].values.push(val)
          }
        });
        response.results.resultskeywords = accmulator;
        this.activeKeywordsPanels = Object.keys(checkedTabs);

        response.results.types = types;
        response.results.ent = ent;
        if (response.results.facts && response.results.facts.length > 0) {
          response.results.facts = response.results.facts.filter((val) => {
            if (val.answer) {
              return val;
            }
          }).filter((val) => val)
          this.alertUtilityObject.isFactavailable = response.results.facts.length > 0 ? true : false;
        }
        const r = /:\/\/(.[^/]+)/;
        response.results.source_url = response.results.url ? response.results.url.match(r)[1] : '';
        // binding the classification verification values
        this.financeArticleDetails = response.results;
        this.selectedItems = [];
        this.reclassificationInfo = response.results && response.results.reClassifications ? response.results.reClassifications.split(',') : []
        // if (this.alertCard.statusDetails && this.alertCard.statusDetails.value && this.alertCard.statusDetails.value.length && response.results.status_key) {
        //   this.validateStatus(this.currentAlertStatus, this.alertCard.statusDetails.value, false);
        //   if (response.results && response.results.status_key) {
        //     var mappedStatusObj = this.alertCard.statusDetails.value.map((val) => {
        //       if (val.listItemId == response.results.status_key) {
        //         return val.values
        //       }
        //     }).filter((element) => { return element })[0];
        //   }
        //   if (mappedStatusObj && (mappedStatusObj.icon || mappedStatusObj.colorCode)) {
        //     this.alertCardUtilityObject.articleselectedIcon = mappedStatusObj.icon;
        //     this.alertCardUtilityObject.articleselectedIconColor = mappedStatusObj.colorCode;
        //     this.alertCardUtilityObject.articleStatus = mappedStatusObj.displayName ? mappedStatusObj.displayName : '';
        //   }
        //   var reasonIndex = this.dummyReason.findIndex((val: any) => {
        //     return val.status_key.toLowerCase() === response.results.status_key
        //   });
        //   if (reasonIndex !== -1) {
        //     this.alertCardUtilityObject.articleReasons = this.dummyReason[reasonIndex].reasons
        //     this.alertCardUtilityObject.articleReasons.forEach((val) => {
        //       val.checked = response.results.status_reason.indexOf(val.reason_id) === -1 ? false : true
        //     })
        //     this.alertCardUtilityObject.selectedArticleReason = this.alertCardUtilityObject.articleReasons.filter((val) => val.checked).map(val => val.reason);// here reason filter with checked value and only reason is returned
        //   }
        // }
        this.alertCardUtilityObject.relatedArticleselectedStatus = '';
        this.alertCardUtilityObject.relatedArticleReasons = [];
        this.alertCardUtilityObject.relatedArticleselectedReason = [];
        if (response.results && response.results.status_key) {
          var index = this.alertCardUtilityObject.relatedArticleStatus.findIndex(val => val.status_key == response.results.status_key);
          if (index !== -1) {
            this.alertCardUtilityObject.relatedArticleselectedStatus = this.alertCardUtilityObject.relatedArticleStatus[index].status_value;
            this.alertCardUtilityObject.relatedArticleReasons = this.alertCardUtilityObject.relatedArticleStatus[index].reasons;
            if (response.results.status_reason && response.results.status_reason.length > 0) {
              this.alertCardUtilityObject.relatedArticleReasons.forEach((val) => {
                if (response.results.status_reason.indexOf(val.reason_id) !== -1) {
                  this.alertCardUtilityObject.relatedArticleselectedReason.push(val.reason)
                }
              });
            }
          }
        }

        this.reclassificationInfo.forEach((ele, i) => {
          let match = this.listForDropDown.findIndex((item) => item.listItemId == ele);
          if (match !== -1) {
            this.selectedItems.push({
              listItemId: this.listForDropDown[match].listItemId,
              displayName: this.listForDropDown[match].displayName
            });
          }
        })
        if (this.financeArticleDetails.preference == 0) {
          this.likeClassification = false;
          this.dislikeClassification = false;
        } else if (this.financeArticleDetails.preference == -1) {
          this.likeClassification = false;
          this.dislikeClassification = true;
        } else if (this.financeArticleDetails.preference == 1) {
          this.likeClassification = true;
          this.dislikeClassification = false;
        }

        let waitUntilDivExists = setInterval(() => {
          let ele: any = document.getElementById("displacy")
          if (ele && ele.clientWidth && ele.clientWidth > 0) {
            $('#displacy').empty();
            this.loadEntity(txt, ent, types);
            this.alertUtilityObject.financeSpinner = false;
            clearInterval(waitUntilDivExists)
          }
        }, 10)

      } else if (response && response.message) {
        this.alertUtilityObject.errorMessagedetail = response.message;
      }
    }).catch(() => {
      this.alertUtilityObject.financeSpinner = false;
      let waitUntilDivExists = setInterval(() => {
        let ele = document.getElementById("displacy")
        if (ele && ele.clientWidth && ele.clientWidth > 0) {
          $('#displacy').empty();
          $('#displacy').html('<p class="text-dark-black d-flex justify-content-center">Something Went Wrong</p>');

          clearInterval(waitUntilDivExists)
        }
      }, 10)

    });
    this.getArticlesInfo();
  }
  getArticlesInfo() {
    this._alertService.getListItemsByListType(null).then((response: any) => {
      let data = response;
      if (response) {
        this.listForDropDown = response ? response : [];
      }
    })
  }
  addQuestionAndAnswers() {
    var entityTypes = ['answer', 'question'];
    var entities = [];
    var questionsLength = 0;
    var questioAnswers = [];
    var presentMArkEntites = this.financeArticleDetails && this.financeArticleDetails.entities ? this.financeArticleDetails.entities : [];
    var Splicetext = this.financeArticleDetails.text;
    if (this.financeArticleDetails && this.financeArticleDetails.facts.length > 0) {
      this.financeArticleDetails.facts.sort(function (a, b) { return a.start - b.start; });
      questioAnswers = [...this.financeArticleDetails.facts];
    }
    if (this.alertUtilityObject.showReasons) {
      questioAnswers.forEach((val, k) => {
        if (val.question && val.answer && val.end && val.start && ((val.end - val.start) === val.answer.length) && (val.end > val.start)) {
          val.type = "answer";
          var questionPosition = Splicetext.indexOf(val.answer);
          var text = this.spilce(Splicetext);
          Splicetext = text.splice(questionPosition, 0, val.question);
          var questionPoints = {
            type: "question",
            start: questionPosition,
            end: questionPosition + val.question.length,
            text: val.question
          };
          questionsLength = questionsLength + val.question.length;
          val.start = questionPosition + val.question.length;
          val.end = val.start + val.answer.length;
          entities.push(questionPoints);
          entities.push(val);
          for (var i = 0; i < presentMArkEntites.length; i++) {
            if (presentMArkEntites[i].start > questionPosition) {
              presentMArkEntites[i].start = presentMArkEntites[i].start + val.question.length;
              presentMArkEntites[i].end = presentMArkEntites[i].end + val.question.length;
            }
          }
        }
      });
      var showMArksWith_question = [];
      var totalEntitytype = (this.financeArticleDetails.types).concat(entityTypes);
      showMArksWith_question = presentMArkEntites.concat(entities);
      const removehighlitngRepeating = showMArksWith_question.filter((val, index, self) => {
        return val.type.toLowerCase() === 'question';
      })
      var finalll = removehighlitngRepeating.reduce((acc, val) => {
        showMArksWith_question.forEach((valueinside) => {
          if (!(val.start > valueinside.start && val.end < valueinside.end)) {
            acc.push(valueinside)
          }
        })
        return acc;
      }, []);
      showMArksWith_question = finalll;
      showMArksWith_question.sort(function (a, b) {
        return a.start - b.start;
      });
      let waitUntilDivExists = setInterval(() => {
        let ele = document.getElementById("displacy")
        if (ele && ele.clientWidth && ele.clientWidth > 0) {
          $('#displacy').empty();
          this.loadEntity(Splicetext, showMArksWith_question, totalEntitytype);
          clearInterval(waitUntilDivExists)
        }
      }, 10)
    }
    else {
      let waitUntilDivExists = setInterval(() => {
        let ele = document.getElementById("displacy")
        if (ele && ele.clientWidth && ele.clientWidth > 0) {
          $('#displacy').empty();
          var setEntites = this.financeArticleDetails.ent.map((val) => {
            val.start = val.BeginOffset;
            val.end = val.EndOffset;
            return val;
          })
          this.loadEntity(this.financeArticleDetails.text, setEntites, this.financeArticleDetails.types);
          clearInterval(waitUntilDivExists)
        }
      }, 10)
    }
  }
  spilce(text) {
    text['__proto__'].splice = function (idx, rem, str) {
      return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
    };
    return text;
  }
    /* @purpose: update related Article Status
* @created: 26 August 2020
* @returns:
* @author:Shravani*/
  updaterelatedArticleStatus(item) {
    var openModal = this.alertCardUtilityObject.relatedArticleReasons.some((arrVal) => arrVal.checked == true);
    if (openModal) {
      let currentModalRef = this.modalService.open(ConfirmationComponent, { windowClass: 'bst_modal alert-card-modal entity-identification-modal light-theme confirmMe' });
      currentModalRef.componentInstance.statusComment = 'ExistStatusReasons';
      currentModalRef.componentInstance.emitData.subscribe(data => {
        if (data) {
          if (data == 'OK') {
            this.alertCardUtilityObject.tempselectedrelatedStatus = item.status_value;
            this.alertCardUtilityObject.relatedArticleselectedReason = [];
            this.alertCardUtilityObject.relatedArticleReasons = item.reasons;
            this.relatedArticlestatusUpdate();
          } else if (data == 'cancel') {
            this.alertCardUtilityObject.relatedArticleselectedStatus = this.alertCardUtilityObject.tempselectedrelatedStatus;
          }
        }
      });
    } else {
      this.alertCardUtilityObject.tempselectedrelatedStatus = item.status_value;
      this.alertCardUtilityObject.relatedArticleReasons = item.reasons;
      this.relatedArticlestatusUpdate();
    }
  }
    /* @purpose: uupdate Related Article Reasons
* @created: 26 August 2020
* @returns:
* @author:Shravani*/
  updateRelatedArticleReasons() {
    this.alertCardUtilityObject.relatedArticleReasons.forEach(element => {
      if (this.alertCardUtilityObject.relatedArticleselectedReason.indexOf(element.reason) !== -1) {
        element.checked = true;
      } else {
        element.checked = false;
      }
    });
    this.relatedArticlestatusUpdate()
  }

  relatedArticlestatusUpdate() {
    var reasons = this.alertCardUtilityObject.relatedArticleReasons.filter((element) => element.checked).map(val => val.reason_id).filter(val => val)
    var statusObj = this.alertCardUtilityObject.relatedArticleStatus.filter((val) => val.status_value == this.alertCardUtilityObject.relatedArticleselectedStatus)
    var data = {
      "entity_id": this.articleSearchQuery,
      "articleAlertId": this.screenData.watchlist[0].id,
      "entity_type": "article",
      "reason": reasons,
      "status_key": statusObj && statusObj.length > 0 && statusObj[0].status_key ? statusObj[0].status_key.toString() : ''
    }
    this._alertService.updateStatusArticle(data).then((val) => {

    })
  }

    /* @purpose: List of languages to translate the article
* @created: 26 August 2020
* @returns:
* @author:Shravani*/
  getLanguageList() {
    let param = 'Translate language';
    this._alertService.getTranslateLanguagesList(param)
      .then((response: any) => {
        if (response) {
          this.languageTranslateList = response
        }
      })
      .catch((err) => {
      })
  }
  /* @purpose: To get the list of reasons
* @created: 26 August 2020
* @returns:
* @author:Shravani*/
  getReasons() {
    this.generalSettingsApiService.getAllStatusReasons(null).then((resp: any) => {
      if (resp && resp.result) {
        this.dummyReason = resp.result.filter((val) => val.entity_name === "alert");
        this.alertCardUtilityObject.relatedArticleStatus = resp.result.filter((val) => val.entity_name === "article");
        // this.setReasonOption();
      }

    })
  }
    /* @purpose: Language selection for Article
* @created: 26 August 2020
* @returns:
* @author:Shravani*/

  selectedlang(event, displayname) {
    if (displayname == this.alertCardUtilityObject.originalang) {
      this.alertCardUtilityObject.langselected = false
      $('#displacy').empty();
      var setEntites = this.financeArticleDetails.ent.map((val) => {
        val.start = val.BeginOffset;
        val.end = val.EndOffset;
        return val;
      })
      this.loadEntity(this.articalDetail.results.text, setEntites, this.financeArticleDetails.types);
    }
    else {
      this.alertCardUtilityObject.langselected = true
      var singleArticleJson = this.alertUtilityObject.currentArticlepath.view_article_path + '&translate=' + displayname;
      this._alertService.getTranslatedArticle(singleArticleJson).then((response: any) => {
        $('#displacy').empty();
        var setEntites = this.financeArticleDetails.ent.map((val) => {
          val.start = val.BeginOffset;
          val.end = val.EndOffset;
          return val;
        })
        if (response.data) {
          this.loadEntity(response.data, [], []);
        }
        else {
          this.loadEntity(this.financeArticleDetails.text, [], []);
        }
      })
        .catch((err) => {
        })
    }
  }
  /* @purpose: Store the feedback of article for classification verification
* @created: 26 August 2020
* @returns:
* @author:Shravani*/
  onDropDownClose(event) {
    if (this.dropdown) {
      this.dropdown = false;
      let reclassificationsIds = Array.from(new Set(this.selectedItems.map(item => item.listItemId)));
      let data = {
        alertId: this.screenData.watchlist[0].id,
        articleId: this.articleSearchQuery,
        reClassifications: reclassificationsIds.toString(),
        entityId: this.articalEntityId,
        preference: -1,
        clientId: null,
        articleLink: this.financeArticleDetails && this.financeArticleDetails.url ? this.financeArticleDetails.url : '',
        category: this.financeArticleDetails && this.financeArticleDetails.classification_1 && this.financeArticleDetails.classification_1.classes && this.financeArticleDetails.classification_1.classes.length ? this.financeArticleDetails.classification_1.classes[0] : '',
        eventId: this.financeArticleDetails && this.financeArticleDetails.event_id ? this.financeArticleDetails.event_id : ''
      }
      this._alertService.storeArticleFeedback(data).then((response: any) => {
        if (response) {
        }
      })
    } else {
    }
  }

  /* @purpose: on deseelct the classification verificatio options
* @created: 26 August 2020
* @returns:
* @author:Shravani*/
  OnItemDeSelect(item: any, event) {
    var removeIndex = this.selectedItems.findIndex((val) => val.displayName == item.displayName)
    if (removeIndex !== -1) {
      // this.selectedItems.splice(removeIndex,1);
    }
    this.dropdown = true;

  }

  /* @purpose: Validate Date
* @created: 26 August 2020
* @returns:
* @author:Shravani*/
  ValidateDate(val) {
    if (val && val.indexOf && (val.indexOf('/') > -1 || val.indexOf('-') > -1)) {
      // let date = parseInt(val);
      if (val && moment(val).isValid() && this.dateFormat && this.dateFormat.ShortDateFormat && this.dateFormat.ShortDateFormat.toLowerCase() != 'undefined') {
        let formattedDate = moment(val).format(this.dateFormat.ShortDateFormat.toUpperCase());
        if (formattedDate != 'Invalid date') {
          return formattedDate;
        } else {
          return val;
        }
      } else {
        return val;
      }
    } else {
      return val;
    }
  }

  onItemSelect(item: any, event) {
    this.dropdown = true;
  }

  /* @purpose: Article classification verification is corrcet
* @created: 26 August 2020
* @returns:
* @author:Shravani*/
  likeClassifiationArtical() {
    this.likeClassification = true;
    this.dislikeClassification = false;
    let reclassificationsIds = [];
    let data = {
      articleId: this.articleSearchQuery,
      reclassifications: reclassificationsIds,
      entityId: this.articalEntityId,
      preference: 1,
      clientId: null,
      alertId: this.screenData.watchlists[0].id,

    }
    this._alertService.storeArticleFeedback(data).then((response: any) => {
      if (response) {
      }
    })
  }

  /* @purpose: Article classification verification is not corrcet
* @created: 26 August 2020
* @returns:
* @author:Shravani*/
  dislikeClassifiationArtical() {
    this.dislikeClassification = true;
    this.likeClassification = false;
    let selectedItems2 = [];
  }

  changeSentiment(item) {
    // this.alertUtilityObject.article_sentiment =item;
    this.alertUtilityObject.article_sentiment = { label: '' }
    var index = this.articleSentimentList.findIndex((val) => val.label === item.label)
    this.alertUtilityObject.article_sentiment = { ...this.articleSentimentList[index] };
    this.alertUtilityObject.articleSentimentList = [...this.articleSentimentList];
    var data = {
      "articleUrl": this.alertUtilityObject.currentArticlepath.view_article_path,
      "classification": this.financeArticleDetails.classification_1 ? this.financeArticleDetails.classification_1.classes[0] : '',
      "comment": "status change",
      "entityId": this.financeArticleDetails.entity_id ? this.financeArticleDetails.entity_id : '',
      "sentiment": item.label,
      "significantNews": false,
      "uuid": this.financeArticleDetails.thread && this.financeArticleDetails.thread.uuid ? this.financeArticleDetails.thread.uuid : ''
    }
    this._alertService.changeSentimentsstatus(data).then((response) => {
    });
  }

  toggleShowOnlyRelatedEntities(event) {
    let checkedTabs = {}
    this.financeArticleDetails.resultskeywords.forEach((keywordTabs, tabindex) => {
      keywordTabs.values.forEach((keywords, valueindex) => {
        if (event.currentTarget.checked) {
          if (keywords.InBOE && !keywordTabs.tabCheck) {
            keywordTabs.tabCheck = true;
            checkedTabs['keytab' + keywordTabs.type] = true;
          } else {
            keywordTabs.tabCheck = false;
          }
          keywords.checked = keywords.InBOE;
        } else {
          keywordTabs.tabCheck = true;
          keywords.checked = true;
        }
        this.highlightKeywords(tabindex, valueindex, keywords.checked, ('keyword' + valueindex + '-' + tabindex))
      });
    });
    setTimeout(() => {
      this.activeKeywordsPanels = Object.keys(checkedTabs);
    }, 10);
  }

  /* @purpose: Highlight the BST atricles keyword
* @created: 26 August 2020
* @returns:
* @author:Shravani*/
  highlightKeywords(tabindex, valueindex, value, id) {

    let highlightEntitytype = []
    if (valueindex !== -1) {
      this.financeArticleDetails.resultskeywords[tabindex].values[valueindex].checked = value;

    } else {
      this.financeArticleDetails.resultskeywords[tabindex].tabCheck = value;

      this.financeArticleDetails.resultskeywords[tabindex].values.forEach((val) => {

        val.checked = value;
      });
    }

    //taking entities for highliging from this.financeArticleDetails.ent to maintain the keywords order correctly - by saliya
    highlightEntitytype = this.financeArticleDetails.ent.filter(val => val.checked);

    this.ChangeDetectorRef.detectChanges();
    let waitUntilDivExists = setInterval(() => {
      let ele = document.getElementById("displacy")
      if (ele && ele.clientWidth && ele.clientWidth > 0) {
        $('#displacy').empty();
        this.loadEntity(this.financeArticleDetails.text, highlightEntitytype, this.financeArticleDetails.types);
        clearInterval(waitUntilDivExists)
      }
    }, 10)
  }

  keywordtabchange(event) {

    setTimeout(() => {
      $('#' + event.panelId).find('.card-body').addClass('mxh-300 overflow-a custom-scroll-wrapper');
    }, 0);

  }

  /* @purpose: Filterning the Adverse Media news
* @created: 26 August 2020
* @returns:
* @author:Shravani*/
  filterAdverseMediaNews() {
    this.alertUtilityObject.financeSpinner = true;
    (this.checkData) ? (this.articlesData = [...this.personAlertCardUtilityObject.articlesData]) : (this.personAlertCardUtilityObject.articlesData = [...this.articlesData]);
    let arraylist = [];
    if (this.adverseSelectedItems.length > 0) {
      arraylist = this.articlesData.filter(f => this.adverseSelectedItems.includes(f.relation_type));
    } else {
      arraylist = this.articlesData;
    }

    if (this.minValue && this.maxValue && arraylist && arraylist.length) {
      arraylist = arraylist.filter(f => new Date(f.published).getFullYear() >= this.minValue && new Date(f.published).getFullYear() <= this.maxValue);
    }
    this.personAlertCardUtilityObject.articlesData = arraylist;

    this.checkData = false;
    if (this.personAlertCardUtilityObject.articlesData.length > 0) {
      this.getsingleArticleDetail(this.personAlertCardUtilityObject.articlesData[0]);
    } else {
      this.alertUtilityObject.financeSpinner = false;
      $('#displacy').empty();
    }
  }

  toggleAllAdverseSelected(selall) {
    if (selall.checked) {
      this.adverseSelectedItems = this.adverseListForDropDown;
    } else {
      this.adverseSelectedItems = []
    }
  }

  loadEntity = function (text, entities, entityTypes) {
    // Your API
    // $('#displacy').empty()
    var api = '';
    // Init displaCY ENT
    var displacy = new displaCyENT(api, {
      container: '#displacy'
    });

    displacy.render(text, entities, entityTypes);
  };

  selectedTab(val, selecteddata, index) {
    this.alertCardUtilityObject.langselected = false
    // this.entityIdentification();
    this.checkTabSelected = val;
    this.screenData.selectedData = {};
    this.highlightrow = '';
    this.highlightrow = val + index;
    if (val === 'Politically Exposed Person (PEP)' || val === 'Sanctions List' || (val !== "Adverse Media Articles" && val !== "jurisdiction")) {
      this.alertUtilityObject.financeSpinner = true;
      // this.getsingleArticleDetail(selecteddata);
      // this.setWatchList(0);
      this.screenData.selectedData = selecteddata;
      this.setWatchListData(selecteddata);
    } else if (val === "Adverse Media Articles") {
      this.alertUtilityObject.financeSpinner = true;
      this.getsingleArticleDetail(selecteddata);
    } else if (val === "jurisdiction") {
      this.screenData.selectedData = selecteddata;
    }
    this.alertUtilityObject.financeisfirst = false;
  }

  /* @purpose: set the watchlist Data
* @created: 26 August 2020
* @returns:
* @author:Shravani*/
  setWatchListData(watchListData) {
    if (watchListData) {
      let info = watchListData.basic_info;
      let keysOfObject = Object.keys(info);
      this.personAlertCardUtilityObject.mainData = [];
      this.personAlertCardUtilityObject.watchlistMainData = [];
      // this.profileInfo = this.profileNotes = info ? info.profile_notes : "";
      if (keysOfObject && keysOfObject.length > 0) {
        keysOfObject.forEach((attribute) => { // pushing basic info attributes to general and watchlist arrays
          this.personAlertCardUtilityObject.generalObjKeys.forEach((element, index) => {
            if (element.key == attribute) {
              let valuesOfObject = info[attribute];
              let data = this.PersonValueFormatter(attribute, valuesOfObject)
              this.personAlertCardUtilityObject.mainData.push({ displayName: this.personAlertCardUtilityObject.generalObjKeys[index].displayName, value: data });
            }
          });
          this.personAlertCardUtilityObject.watchlistKeys.forEach((element, index) => {
            if (element.key == attribute) {
              let valuesOfObject;
              if(attribute == 'descriptions'){
                valuesOfObject = info[attribute]
                .filter(f=>{
                  return f.indexOf(this.selectedFeed) >- 1
                })
              }
              else{
                valuesOfObject = info[attribute];
              }
              let data = this.PersonValueFormatter(attribute, valuesOfObject)
              this.personAlertCardUtilityObject.watchlistMainData.push({ displayName: this.personAlertCardUtilityObject.watchlistKeys[index].displayName, value: data });
            }
          });

          if(attribute === 'id'){
            if(!this.personAlertCardUtilityObject.watchlistMainData.find( x => x.displayName === "Watchlist Record Id")){
              const data = this.PersonValueFormatter(attribute, info[attribute]);
              this.personAlertCardUtilityObject.watchlistMainData.push({displayName: "Watchlist Record Id", value: data})
            }
          }

        })
      }
    }
  }

  /* @purpose: get the confidence Percentage
* @created: 26 August 2020
* @returns:
* @author:Shravani*/
  getConfidencePercentage(num) {
    if (num && num <= 1) {
      num = parseFloat(num) * 100
      return num.toFixed(2);
    }
    return num;
  }

  sourcePanelChange(event: any, data) {
    data.primaryOpen = !data.primaryOpen;
  }
  /* @purpose: format the basic_info attributes of person
* @created: 26 August 2020
* @returns:
* @author:Shravani*/

  PersonValueFormatter(attribute, value) {
    switch (attribute.toLowerCase().trim()) {
      case 'legal_type':
        return this.PersonSchema.legal_type(value);
        break;
      case 'city_of_birth':
        return this.PersonSchema.place_of_birth(value);
        break;
      case 'birthPlace':
        return this.PersonSchema.place_of_birth(value);
        break;
      case 'country':
        return this.PersonSchema.country(value);
        break;
      case 'identifier':
        return this.PersonSchema.identifier(value);
        break;
      case 'identifiers':
        return this.PersonSchema.identifier(value);
        break;
      case 'additional_name':
        return this.PersonSchema.additional_name(value);
        break;
      case 'email':
        return this.PersonSchema.email(value);
        break;
      case 'home_location':
        return this.PersonSchema.home_location(value);
        break;
      case 'works_for':
        return this.PersonSchema.works_for(value);
        break;
      case 'alumni_of':
        return this.PersonSchema.alumni_of(value);
        break;
      case 'address':
        return this.PersonSchema.address(value);
        break;
      case 'images':
        return value;
      default:
        return this.PersonSchema.default(value);
        break;
    }
  }

  /* @purpose: format the basic_info attributes of person schema
* @created: 26 August 2020
* @returns:
* @author:Shravani*/

  PersonSchema = {
    legal_type: (value) => {
      if (value && typeof value == 'object' && !Array.isArray(value)) {
        let returnValue = "";
        if (value.code) {
          returnValue = value.code + " : ";
        }
        if (value.label) {
          returnValue = returnValue + value.label;
        }
        return returnValue;
      }
    },
    place_of_birth: (value) => {
      if (Array.isArray(value)) {
        return this.simpleArrayFormatter(value)
      }
      else if (value) {
        if (typeof value == 'string') {
          return value;
        }
        else if (typeof value == 'object') {
          let address = [];
          if (value.locality) {
            address.push(value.locality);
          }
          if (value.region) {
            address.push(value.region);
          }
          if (value.country) {
            address.push(value.country);
          }
          return address.join(", ");
        }
        else {
          return "N/A";
        }
      }
      else {
        return "N/A";
      }
    },
    identifier: (value) => {
      return this.simpleJsonFormater(value, ",");
    },
    identifiers: (value) => {
      return this.simpleJsonFormater(value, ", ");
    },
    country: (value) => {
      return this.simpleArrayFormatter(value);
    },
    additional_name: (value) => {
      return this.simpleArrayFormatter(value);
    },
    email: (value) => {
      return this.simpleArrayFormatter(value);
    },
    stockInfo: (value) => {
      return this.simpleJsonFormater(value);
    },
    address: (value) => {
      if (value) {
        let addresses = [];
        if (Array.isArray(value) && value.length >= 0) {
          value.forEach((item) => {
            let address = [];
            if (typeof item == "object" && !Array.isArray(item)) {
              if (item.street_address && typeof item.street_address == "string" && item.street_address.trim().length > 0) {
                address.push(item.street_address)
              }
              if (item.address_locality && typeof item.address_locality == "string" && item.address_locality.trim().length > 0) {
                address.push(item.address_locality);
              }
              if (item.locality && typeof item.locality == "string" && item.locality.trim().length > 0) {
                address.push(item.locality);
              }
              if (item.city && typeof item.city == "string" && item.city.trim().length > 0) {
                address.push(item.city)
              }
              if (item.region && typeof item.region == "string" && item.region.trim().length > 0) {
                address.push(item.region);
              }
              if (item.country && typeof item.country == "string" && item.country.trim().length > 0) {
                address.push(item.country)
              }
              if (item.zip && typeof item.zip == "string" && item.zip.trim().length > 0) {
                address.push(item.zip)
              }
              if (item.postal_code && typeof item.postal_code == "string" && item.postal_code.trim().length > 0) {
                address.push(item.postal_code)
              }
              addresses.push(address.join(" "));
            }
          });
          // this.alertCardUtilityObject.addressAttribute = addresses;
          return this.simpleArrayFormatter(addresses);
        }
        else {
          return value;
        }
      }
      else {
        return 'N/A';
      }

    },
    knows: (value) => {
      return this.simpleJsonFormater(value);
    },
    home_location: (value) => {
      if (value) {
        if (Array.isArray(value)) {
          return this.simpleArrayFormatter(value);
        }
        else if (typeof value == 'object') {
          let items = [];
          if (value.address) {
            if (value.address.street_address && typeof value.address.street_address == "string" && value.address.street_address.trim().length > 0) {
              items.push(value.address.street_address)
            }
            if (value.address.locality) {
              items.push(value.address.locality);
            }
            if (value.address.address_locality && typeof value.address.address_locality == "string" && value.address.address_locality.trim().length > 0) {
              items.push(value.address.address_locality);
            }
            if (value.address.city && typeof value.address.city == "string" && value.address.city.trim().length > 0) {
              items.push(value.address.city)
            }
            if (value.address.region && typeof value.address.region == "string" && value.address.region.trim().length > 0) {
              items.push(value.address.region);
            }
            if (value.address.country && typeof value.address.country == "string" && value.address.country.trim().length > 0) {
              items.push(value.address.country);
            }
            if (value.address.postal_code && typeof value.address.postal_code == "string" && value.address.postal_code.trim().length > 0) {
              items.push(value.address.postal_code);
            }
            if (value.address.zip && typeof value.address.zip == "string" && value.address.zip.trim().length > 0) {
              items.push(value.address.zip);
            }
            return items.join(", ");
          }
        }
        else {
          return value;
        }
      }
      else {
        return 'N/A';
      }

    },
    works_for: (value) => {
      if (value) {
        return value.join(", ")
      }
      else {
        return 'N/A';
      }
    },
    alumni_of: (value) => {
      if (value) {
        return value.join(", ")
      }
      else {
        return 'N/A';
      }
    },
    default: (value) => {
      if (typeof value == 'string') {
        return value;
      }
      if (typeof value == 'number') {
        return value;
      }
      else if (Array.isArray(value)) {
        return this.simpleArrayFormatter(value);
      }
      else {
        return 'N/A';
      }
    }
  }

  /* @purpose: Json formator
 * @created: 26 August 2020
 * @returns:  formatted json
 * @author:Shravani*/
  simpleJsonFormater(value, sep = ",") {
    const capitalize = (s) => {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
    }
    if (value) {
      if (typeof value == "object") {
        let returnValue = [];
        let keys = Object.keys(value);
        keys.forEach((key) => {
          if (value[key] && typeof value[key] == 'string' && value[key].trim().length > 0) {
            returnValue.push(capitalize(key.replace(/_/g, " ")) + " : " + value[key]);
          }
        })
        return returnValue.join(sep);
      }
      else {
        return value;
      }
    }
    else {
      return 'N/A';
    }
  }
  /* @purpose: To format Array
 * @created: 26 August 2020
 * @returns:  formated array
 * @author:Shravani*/
  simpleArrayFormatter(value) {
    let values = [];
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item && typeof item == 'string' && item.trim().length > 0 && values.indexOf(item) == -1) {
            values.push(item)
          }
        });
        return values.join(", ");
      }
      else if (typeof value == 'string') {
        return value;
      }
      else {
        return;
      }
    }
    else {
      return 'N/A';
    }
  }

  public trackById(_, item): string {
    return item.id;
  }
  public trackByLabel(_, item): string {
    return item.label;
  }
  public trackByCode(_, item): string {
    return item.code;
  }
  public trackByName(_, item): string {
    return item.name;
  }
  public trackByType(_, item): string {
    return item.type;
  }
  public trackByStatusValue(_, item):string {
    return item.status_value;
  }
  public trackByReason(_, item): string {
    return item.reason;
  }
  public trackByDisplayName(_, item): string {
    return item.displayName;
  }
}
