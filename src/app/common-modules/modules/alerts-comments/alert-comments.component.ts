import { Component, OnInit, Input, ChangeDetectorRef, HostListener, Output, EventEmitter, Inject } from '@angular/core';
import { AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { AlertManagementService } from '@app/modules/alert-management/alert-management.service';
import { LoadEntityNetworkChartModule } from '../../../shared/charts/networkChartEntity.js';
import * as $ from 'jquery';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatSelect } from '@angular/material/select';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { AgGridTableService } from '../ag-grid-table/ag-grid-table.service';
import { displaCyENT } from '../../../../assets/js/displacy-entity ';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { countryRisk } from '../../constants/countryRisk';
import { find, isObject, omit, sortBy } from 'lodash-es';
import { Options } from '@angular-slider/ngx-slider';
import { Router } from '@angular/router';
import { ConfirmationComponent } from '../../modules/confirmation/confirmation.component';
import * as moment from 'moment';
import { CaseManagementService } from '@app/modules/case-management/case-management.service.js';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { GeneralSettingsApiService } from '../../../modules/systemsetting/services/generalsettings.api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { defaultIfEmpty, filter, map, mergeMap, share, switchMap, tap, toArray } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { WINDOW } from '../../../core/tokens/window.js';
const datePipe = new DatePipe('en-US');

@Component({
  selector: 'app-alert-comments',
  templateUrl: './alert-comments.component.html',
  styleUrls: ['./alert-comments.component.scss']
})
export class AlertCommentsComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe', { static: false }) private myScrollContainer: ElementRef;
  @ViewChild('closePop', { static: false }) closePop: ElementRef;
  @ViewChild('modalContent', { static: false }) modalContent: ElementRef;
  commentBoxPermissionView: boolean;
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) { this.modalService.dismissAll() }


  public isSystemCreated: boolean = false;
  public nextprev: boolean = false
  public relatedAlertCard: boolean = false;
  public relatedAlertCurrentRowData = [];
  public commentMssg: any = "";
  private commentListItems: any = [];
  public commentListItemsCount: any;
  public rolesInformation = [];
  public attachmentList = [];
  public getRowDataOnClick: any;
  private currentComment: any = {};
  public alertCard: any = {};
  public filteredItems: any;
  public listItemsValues: any;
  public permissionIdsList: Array<any> = [];
  public showListItems: boolean = false;
  public checkedItem: any;
  public watchListIndex: number = 0;
  public hitsList: any = [{ id: 1, firstName: "Ann", lastName: "hanjczx", country: "US", confidenceLevel: 75 },
  { id: 2, firstName: "Antasia", lastName: "hanjczx", country: "Germany", confidenceLevel: 69 },
  { id: 3, firstName: "Anna", lastName: "hanjczx", country: "US", confidenceLevel: 62 }];
  public isEntityIdentified: boolean;
  public alertStatus: boolean;
  public highlightrow: string = 'pep0';
  public selectedSource: string = "";
  public flages = GlobalConstants.flags;
  public dateFormat = GlobalConstants.globalDateFormat;
  public entityDetails = { 'name': "", 'type-icon': "" };
  public alertMetaData: any;
  public sampleText: string = '';
  public attributesKeysOriginal: any = [];
  public attributesKeys: any = [];
  public attributes: any = {};
  public ReviewEntityName: any;
  public watchlistData: any = [];
  public selectedWatchListIndex: number;
  public isIndexSelected: boolean = false;
  public currentWatchListData: any;
  public AttributesWithBadges: any[] = [];
  public activeTab = 'general';
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
    adverseMediaData: false
  };
  public likeClassification: any;
  public dislikeClassification = false;
  listForDropDown = [];
  selectedItems = [];
  public checkCurrentRole: boolean;
  public checkPreviousRole: boolean;
  public rolesText;
  public rolesTextLength: number = 30;
  public inactiveAsOf = {"attrName": null, "attrVal": null};
  dropdownSettings = {};
  traslationSettings = {};
  adverseDropdownSettings = {};
  public languageJson: any;
  public statusObjs_new: any = [];
  public localeText = {
    to: "-",
  }
  public selected: true
  public articleSearchQuery: any;
  public articalEntityId: any;
  public Array = Array;
  public selectedCountry="";
  selectedCountryDisplayName: "";
  public languageTranslateList = [];
  public AllowedStatusList = [];
  public RCAId: any;
  public RCAList = [];
  public validKeysFromBasicInfo = {

    Person: ['legal_type', 'given_name', 'citizenship', 'locations', 'entry_id', 'age', 'home_location', 'watchlist_record_id', 'identifiers', 'identifier', 'descriptions', 'date', 'active_status', 'first_name', 'city_of_birth', 'images', 'aka', 'alternative_names', 'address', 'gender', 'family_name', 'nationality', 'additional_names', 'images', 'honor_prefix','wl id','wl ver','place_of_birth','date_of_birth'],
    Organization: ['legal_type', 'entry_id', 'primary_name', 'locations', 'given_name', 'home_location', 'watchlist_record_id', 'identifiers', 'identifier', 'descriptions', 'date', 'active_status', 'name', 'address', 'date_of_registration', 'alternative_names', 'place_of_registration', 'organization_name', 'alias_name', 'website', 'registered_address', 'company_identifier', 'honor_prefix','wl id','wl ver']
  }
  public invalidAttributes = ["phone", "spelling", "additional_name", "low_quality_aka", "formerly_name_as", "expand_language_variation", "first_name", "last_name", "image", "jurisdiction", "probability", "job_title", "email", "description", "source_url", "source_description", "profile_notes", "name_type", "watchlist_id", "relatives", "entity_type", "id", "screening_type", "screening", "spouse", "children", "sibling", "knows", "alumni_of", "works_for", "mention_id", "country", "url", "wl_hit_index"];
  public attributesDisplayNameMapping = {
    Organization: {
      name: 'Organization Name',
      aka: "Alias Name",
      alternative_names: "Alias Name",
      address: "Registered Address",
      date_of_registration: 'Incorporated In',
      place_of_registration: 'Domiciled In',
      descriptions: "Watchlist Hit Type",
      active_status: "Watchlist Status",
      date: 'Watchlist Last Update Date',
    },
    person: {
      aka: "Additional Names",
      alternative_names: "Additional Names",
      address: 'Addresses',
      first_name: "Given Name",
      images: "Person Image",
      city_of_birth: "Birth Place",
      descriptions: "Watchlist Hit Type",
      active_status: "Watchlist Status",
      date: 'Watchlist Last Update Date',
    }
  }
  public showMatchType: boolean = false;
  public entityType: string;
  public reviewerStatusColor: any = "#657f8b";
  public reviewerStatusColors = { 'unconfirmed': "#657f8b", 'confirmed': "#26A69A", 'declined': 'rgb(239, 83, 80)' };
  public reviewerStatusList: any = [];
  public riskIndicatorsVal: any;
  public currentRowData: any;
  public currentAlertStatus: string;
  public reviewStatus: string;
  public confidenceFilter: number = 0;
  public currentModalRef: any;
  public tableData = [];
  public selectedIcon: any;
  public options: Options;
  public profileInfo;
  public profileNote;
  public selectedIconColor: any;
  public commentsPopover: any = {};
  public financeData = [];
  public financeArticleDetails: any = {};
  public financeSpinner = true;
  public adverseSelectedItems: any = [];
  public mainEntityRelationTypeStr: string = "Main Entity"
  public adverseListForDropDown: any = [];
  public allowUserToChangeReview: boolean = true;
  public basic_info_keys = [];
  public index = 0;
  public gridApi: any;
  public showReviewerIcon: boolean = false;
  public attributesDetails = [];
  public searchData: any;
  public customTemplateClass: any;
  public rightPanelData;
  public reclassificationInfo = [];
  public articalDetail: any = [];
  public validate: boolean;
  public alertStatusPermissionFlag: boolean;
  public EntityIdentificationAlertList = ['new', 'approved', 'identity approved', 'identity rejected', 'in progress', 'identity approved, needed review', 'identity rejected, needed review', 'conflict reassess', 'primary processed'];
  public relationshipTypes: any = {};
  private tempTitle = '';

  public nextTableData = [];
  public statusObjs: any = [];
  private tableCurrentPage: number = 0;
  private tableCurrentRows: number = 10;
  public prevButton: boolean = true;
  public nextButton: boolean = true;
  public nextPage: number = 0;
  public feedListForBulkTextSlider: any = [];
  private maximumAlerts: number = 0;
  private newcurrentState: any = {};
  public selectedEntityId: string;

  permisionIds: Array<any> = [];
  @Output() send: EventEmitter<any> = new EventEmitter<any>();
  @Output() sendPrev: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('alertCardBody', { static: false }) alertCardBody: ElementRef;
  @ViewChild('content', { static: false }) EICard: ElementRef;
  @Input('AutoOpen') AutoOpen: boolean = false;
  @Input('systemCreated') systemCreated: boolean = false;
  @Input('showComments') showComments: boolean = false;
  public latestRowData: any;
  public dropdown: boolean = false;
  public isDisable: boolean = false;
  public alert_ID: any;
  public alertPopUpByEntity: boolean = false;
  public redirectUrl: string;

  @Input('params') set rowData(params: any) {
    if (params && params.data) {
      this.alertPopUpByEntity = params.alertPopUpByEntity !== undefined ? params.alertPopUpByEntity : false
      this.redirectUrl = params.alertToEntityUrl !== undefined ? params.alertToEntityUrl : ''
      this.alert_ID = params.data.alertId;
      this.isDisable = params.data.completeRowData.isHitFrozen?params.data.completeRowData.isHitFrozen:false;
      this.isSystemCreated = params.data.systemCreated;
      this.latestRowData = params;
      this.rightPanelData = params;
      this.gridApi = params.api
      this.currentRowData = params.data
      this.showReviewerIcon = this.currentRowData && this.currentRowData.showReviewerIcon ? this.currentRowData.showReviewerIcon : false;
      this.customTemplateClass = (params.colDef && params.colDef.customTemplateClass) ? params.colDef.customTemplateClass : ''
      this.currentAlertStatus = (this.currentRowData.completeRowData && this.currentRowData.completeRowData.statuse && this.currentRowData.completeRowData.statuse.code) ? this.currentRowData.completeRowData.statuse.code.toLowerCase() : "";
      if (params.data.comments) {
        this.getRowDataOnClick = params.data;

        this.searchData = (params.data && params.data.completeRowData && params.data.completeRowData.alertMetaData) ? JSON.parse(params.data.completeRowData.alertMetaData) : "";
        for (const key in this.searchData) {
          if (this.searchData[key] && Array.isArray(this.searchData[key])) {
            this.searchData[key] = this.searchData[key].filter((val) => val)
          }
        }
        this.commentListItemsCount = params.data.commentsCount;
      }
      this.validate = (this.currentRowData.completeRowData && this.currentRowData.completeRowData && this.currentRowData.completeRowData.identityApproved) ? this.currentRowData.completeRowData.identityApproved : false;
    }

  }
  public relatedAlertsCount: number = 0;
  public alertCardWatchlist: any = [];

  public statusUpdateValidations = GlobalConstants.alertStatusValidation
  public alertEntityIdentificationStatusValidation = GlobalConstants.alertEntityIdentificationStatusValidation

  public vlaZoomIn = 0;
  public filterDropdownSettings: any;
  public vlaChartLoader: boolean = false;
  public selectedTabVal: any;
  public checkData: boolean = true;
  public checkFilterData: boolean = true;
  public personsVlaData: any = {};
  public personsDataVla: any;
  public maxCredibilitySourceValue: any;
  userType = [];
  public date = new Date();
  public articlesData: any;
  public maxValue: number;
  public minValue: number;
  public referencesList: any = [];
  public nodeLevel = 0;
  public classificationData: any = [];
  public requestId;
  public monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  public vlaRootIndexComp = 1;
  public listForFilterDropDown: any = [
    { item_id: 1, item_text: 'Main Entity' },
    { item_id: 2, item_text: 'UBO' },
    { item_id: 3, item_text: 'Shareholders' },
    { item_id: 4, item_text: 'Subsidiaries' }
  ];
  public filteredSelectedItems;
  public currentMonth;
  public currentDate;
  public vlaChartDataNotFound: boolean = false;
  public companyVlaData: any = {};
  allSelected = false;
  public rootCompanyVla: any;
  public entityIdentifier: any;
  public rolesModalRef: NgbModalRef;
  public coreKbIdentifier: any;
  public profileNotesLength: number = 30;
  public threeList: any = [];
  public newStatus: any;
  public newStatusList: any = [];

  @ViewChild('mySel', { static: false }) selectTag: MatSelect;
  @ViewChild('slider', { static: false }) slider;
  public userTypeFilters: any = [];
  public vlaExtendCount = 20000
  public showOnlyRelatedEntities = false;
  public checkTabSelected: any = 'pep';
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
  ]
  public activePanelId: string;
  public activeKeywordsPanels: any;
  public jurisdictionListValue: any = [];
  public alert_entityId = '';
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
    },
    articleSentimentList: [
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
      }],
    currentArticlepath: {}
  }

  public dummyReason = [];
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
  alertCardActiveTab = 'alertCardGeneral';
  watchlistAttribs = ['descriptions', 'watchlist record id', 'date', 'active status'];

  public loadCustomerInfo: any = {};
  latestStatusList = [];
  public relatedAlertsCountPhase02 : any = 0;
  public showFileSpinner: boolean = false;

  caseDetailsPermission: string;

  constructor(private _agGridTableService: AgGridTableService, private _commonServices: CommonServicesService, private modalService: NgbModal, private _alertService: AlertManagementService,
    private _sharedServicesService: SharedServicesService, public router: Router, public activeModal: NgbActiveModal, public _caseService: CaseManagementService,
    public ChangeDetectorRef: ChangeDetectorRef, private titlecasePipe: TitleCasePipe, private generalSettingsApiService: GeneralSettingsApiService, private ngxService: NgxUiLoaderService,
    public _generalSettingsApiService: GeneralSettingsApiService, 
    @Inject(WINDOW) private readonly window: Window
  ) {}

  ngOnInit() {
    // if (this.currentAlertStatus) {
    //   this.newStatus = this.currentAlertStatus;
    // }
    if (this.customTemplateClass != 'caselist-component') {
      this.jurisdictionList();
    }
    this.getComponentPermissionIds();

    // case permission to show case ID
    this.caseDetailsPermission = this.getUserCasePermission();

    this.scrollToBottom();
    if (this.AutoOpen) {
      if (!(this.currentAlertStatus == 'primary processed' || this.currentAlertStatus == 'new' || this.currentAlertStatus == 'identity rejected' || this.currentAlertStatus == 'identity rejected, needed review' || this.currentAlertStatus == 'identity approved, needed review' || this.currentAlertStatus == 'in progress' || this.currentAlertStatus == 'identity rejected, pending review' || this.currentAlertStatus == 'conflict reassess' || this.currentAlertStatus == 'identity approved')) {
        this.openAlertCard(this.alertCardBody, true);
      }
      else {
        this.open(this.EICard);
      }
    }
    this._commonServices.getLatstRowData.subscribe(data => {
      if (data)
        this.setRowData(data);
    });

    this._alertService.getUpdatedCommentCount.subscribe((resp: any) => {
      if (resp && resp.caseId) {
        if(this.currentRowData && this.currentRowData.caseId && this.currentRowData.caseId == resp.caseId){
          this.currentRowData.commentsCount = resp.commentsCount;
          this.commentListItemsCount = resp.commentsCount;
        }
      }
    });

    this._alertService.getTableCurrentPageObserver.subscribe((pagination: any) => {
      if(pagination) {
      this.tableCurrentPage = pagination;
      }
    });

    this._alertService.getTableRowsCountObserver.subscribe((rows: any) => {
      if(rows) {
        this.tableCurrentRows = rows;
      }
    });

    this._alertService.getStatusObserver.subscribe(data => {
      this.statusObjs = data;
    })

    this.maxValue = new Date().getFullYear();
    this.minValue = this.maxValue - 5;

    let date: Date = new Date();
    this.currentMonth = this.monthNames[date.getMonth()];
    this.currentDate = date.getDate();

    this.filterDropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true,
      enableCheckAll: false,
      noDataAvailablePlaceholderText: this.getLanguageKey('No Relations were defined')
    };
    this.adverseDropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true,
      enableCheckAll: false,
      noDataAvailablePlaceholderText: this.getLanguageKey('No Relations were defined')
    };
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
    this.closeModal();

  }
  ngAfterViewInit() {
    this.relatedAlertCard = false;
    this._alertService.getReleatedAlertRowCountObservable.subscribe(data=>{
      if(data){
        if(data > 0){
          this.relatedAlertsCountPhase02 = data - 1;
        }else{
          this.relatedAlertsCountPhase02 = data;
        }
      }

    });
    this.getLanguageList();
    this._alertService.getRowDataWhenUpdatedObserver.subscribe((resp: any) => {
      if (resp.length) {
        this.tableData = [...this.tableData, ...resp];
      }
    })
    this.nextTableData = [...this.nextTableData, ...this._alertService.getTableData];
    this.maximumAlerts = this._alertService.getTotalAlertCount;
    /*
 * Purpose : settings for ng multiselect dropdown for classificaton verification
 * Author : shravani
 * Date : 28-july-2020
*/

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
  /*
  * Purpose : on select the option from dropdown
  * Author : shravani
  * Date : 28-july-2020
 */
  onItemSelect(item: any, event) {
    this.dropdown = true;
  }

  /*
  * Purpose : on deselect the option from dropdown
  * Author : shravani
  * Date : 28-july-2020
 */
  OnItemDeSelect(item: any, event) {
    var removeIndex = this.selectedItems.findIndex((val) => val.displayName == item.displayName)
    if (removeIndex !== -1) {
    }
    this.dropdown = true;

  }

  getFormantDate(date:string): string {
    return moment(date).format('DD/MM/YYYY');
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }


  /**Getting Language text
   * Author : karnakar
   * Date : 20-Jan-2020
  */
  getLanguageKey(text) {
    var langKey = text;
    if (this.languageJson) {
      langKey = this.languageJson[text];
    }
    return langKey;
  }

  openRolesModal(content) {
    this.rolesModalRef = this.modalService.open(content, { windowClass: 'bst_modal alert-card-modal entity-identification-modal light-theme' })
  }

  setRowData(params) {
    if (params && params.completeRowData) {
      this.relatedAlertCurrentRowData = this.currentRowData;
      this.currentRowData = params;
      this.showReviewerIcon = this.currentRowData && this.currentRowData.showReviewerIcon ? this.currentRowData.showReviewerIcon : false;
      this.customTemplateClass = (params.colDef && params.colDef.customTemplateClass) ? params.colDef.customTemplateClass : '';
      this.currentAlertStatus = (this.currentRowData.completeRowData && this.currentRowData.completeRowData.statuse && this.currentRowData.completeRowData.statuse.code) ? this.currentRowData.completeRowData.statuse.code.toLowerCase() : "";
      if (params.comments) {
        this.getRowDataOnClick = params;
        this.searchData = (params && params.completeRowData && params.completeRowData.alertMetaData) ? JSON.parse(params.completeRowData.alertMetaData) : "";
        this.commentListItemsCount = params.commentsCount;
        if (this.searchData) {
          this.loadCustomerInfo = {
            results: this.searchData.customer_information ? this.searchData.customer_information.results : {},
            type: this.currentRowData.completeRowData.entiType
          };
        }
      }
      if(this.relatedEIAlertstatesList.length){
        this.getRelatedAlertsCount();
      }
      this.openAlertCard(this.alertCardBody, false);
      this.currentRowData  = this.relatedAlertCurrentRowData;
    }
  }

  setRelatedRowData(params) {
    if (params && params.completeRowData) {
      this.relatedAlertCurrentRowData = this.currentRowData;
      this.currentRowData = params;
      this.showReviewerIcon = this.currentRowData && this.currentRowData.showReviewerIcon ? this.currentRowData.showReviewerIcon : false;
      this.customTemplateClass = (params.colDef && params.colDef.customTemplateClass) ? params.colDef.customTemplateClass : '';
      this.currentAlertStatus = (this.currentRowData.completeRowData && this.currentRowData.completeRowData.statuse && this.currentRowData.completeRowData.statuse.code) ? this.currentRowData.completeRowData.statuse.code.toLowerCase() : "";
      if (params.comments) {
        this.getRowDataOnClick = params;
        this.searchData = (params && params.completeRowData && params.completeRowData.alertMetaData) ? JSON.parse(params.completeRowData.alertMetaData) : "";
        this.commentListItemsCount = params.commentsCount;
        if (this.searchData) {
          this.loadCustomerInfo = {
            results: this.searchData.customer_information ? this.searchData.customer_information.results : {},
            type: this.currentRowData.completeRowData.entiType
          };
        }
      }
      if(this.relatedEIAlertstatesList.length){
        this.getRelatedAlertsCount();
      }
      this.openAlertCard(this.alertCardBody, false);
      this.currentRowData  = this.relatedAlertCurrentRowData;
    }
  }

  /**Calculate lastpage of ag-grid table & disable next button
   * Author : sarmilan (AP-2061)
   * Date : 21-Jul-2021
  */
  nextButtonStatus(alertid){
    let rows = 0;
    if(this.tableCurrentRows < 10){
      rows = 10;
    }
    else{
      rows = this.tableCurrentRows
    }
    let count = Math.ceil(this.maximumAlerts / rows);

    if( this.tableCurrentPage == count){
      if (this.nextTableData[this.nextTableData.length-1] && this.nextTableData[this.nextTableData.length-1].length) {
        if(alertid == this.nextTableData[this.nextTableData.length-1].alertId){
        this.nextButton = false;
      }
      }
    }
  }

  setCurrentRowData() {
    let params = this.latestRowData.data;
    if(this.latestRowData.data && this.latestRowData.data.completeRowData) {
      this.selectedEntityId = this.latestRowData.data.completeRowData.selectedHitRecordId;
    }
    if (this.nextTableData && this.nextTableData.length) {
      if (this.tableCurrentPage == 1 && params.alertId == this.nextTableData[0].alertId){
        this.prevButton = false;
      }
    }

    this.nextButtonStatus(params.alertId);

    if (params && params.completeRowData) {
      this.currentRowData = params;
      this.showReviewerIcon = this.currentRowData && this.currentRowData.showReviewerIcon ? this.currentRowData.showReviewerIcon : false;
      this.customTemplateClass = (params.colDef && params.colDef.customTemplateClass) ? params.colDef.customTemplateClass : '';
      this.currentAlertStatus = (this.currentRowData.completeRowData && this.currentRowData.completeRowData.statuse && this.currentRowData.completeRowData.statuse.code) ? this.currentRowData.completeRowData.statuse.code.toLowerCase() : "";
      if (params.comments) {
        this.getRowDataOnClick = params;
        this.searchData = (params && params.completeRowData && params.completeRowData.alertMetaData) ? JSON.parse(params.completeRowData.alertMetaData) : "";
        this.commentListItemsCount = params.commentsCount;
        if (this.searchData) {
          this.loadCustomerInfo = {
            results: this.searchData.customer_information ? this.searchData.customer_information.results : {},
            type: this.currentRowData.completeRowData.entiType
          };
        }
       }
    }

    // used to load satus list for select filelds
    // this.getPossibleStates()

  }
  /**to get country jurisdiction list
 * Author : kamal
 * Date : 02-07-2020
*/
  jurisdictionList() {
    if (GlobalConstants.jurisdictionsListResponse) {
      this.jurisdictionListValue = GlobalConstants.jurisdictionsListResponse;
    }
    else {
      this._commonServices.getJurdictionlist()
        .then((response) => {
          if (response) {
            GlobalConstants.jurisdictionsListResponse = response;
            this.jurisdictionListValue = response
          }
        })
        .catch((err) => {
        })
    }
  }
  fullJursidictionName(code) {
    let data = code
    this.jurisdictionListValue.forEach((element) => {
      if (element.jurisdictionName == code) {
        data = element.jurisdictionOriginalName
      }
    });
    return data
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  /**Getting get the alert status list
 * Author : chinthaka
 * Date : 02-08-2020
*/
  openEICard() {
    let alertStatusList = this.getRowDataOnClick.status;
    this.getAlertStatusChangePermission();
    if (this.newStatusList.length == 0) {
      if (alertStatusList && alertStatusList.value && alertStatusList.value.length > 0) {
        alertStatusList.value.forEach(element => {
          let ele = element && element.values && element.values.code && element.values.code.toLowerCase() ? element.values.code.toLowerCase() : ''
          if (this.EntityIdentificationAlertList.includes(ele)) {
            this.newStatusList.push(element);
          }
        });
      }
    }
    if (this.newStatusList && this.newStatusList.length) {
      // this.validateStatus(this.currentAlertStatus, this.newStatusList, true);
      var mappedStatusObj = this.newStatusList.map((val) => {
        if (val.values.code == alertStatusList.key) {
          return val.values
        }
      }).filter((element) => { return element })[0];
    }
    if (mappedStatusObj && (mappedStatusObj.icon || mappedStatusObj.colorCode)) {
      this.selectedIcon = mappedStatusObj.icon;
      this.selectedIconColor = mappedStatusObj.colorCode;
    }
    this.entityIdentification();

    let index = this.getSelectedWatchlist(this.selectedWatchListIndex, this.selectedEntityId);

    if(index == undefined) {
      index = 0;
    }

    this.selectedWatchListIndex = index;
    this.setWatchList(index);
    this.setProfileNotes();
    this.setRolesInfo();
    this.setReferences();
    // this.getRCARelationData();
    this.setInactiveAsOf();

    this.getRelatedAlertsCount();
  }

  private relatedEIAlertStatesNames = ['new', 'identity approved', 'identity rejected', 'in progress', 'primary processed'];
  private relatedEIAlertstatesList: any = [];
  private getCustomerIdFilter(customerId) {
    return {
      'filter': customerId,
      'type': 'contains',
      'filterType': 'text'
    }
  }
  private getStatusFilter(statusList) {
    return {
      "type": "multiSelect",
      "filter": statusList.join('#'),
      "filterType": "text"
    }
  }

  /**Get related alerts
 * Author : Madushan
 * Date : 02-09-2020
*/
  private getRelatedAlertsCount() {
    if (!this.currentRowData.customerId) {
      this.relatedAlertsCount = 0;
      return;
    }
    if (this.relatedEIAlertstatesList.length == 0) {
      let allStatusList = this.getRowDataOnClick.status;
      if (allStatusList && allStatusList.value && allStatusList.value.length > 0) {
        allStatusList.value.forEach(element => {
          let ele = element && element.values && element.values.code && element.values.code.toLowerCase() ? element.values.code.toLowerCase() : ''
          if (this.relatedEIAlertStatesNames.includes(ele)) {
            this.relatedEIAlertstatesList.push(element);
          }
        });
      }
    }
    let statusListItemIds = this.relatedEIAlertstatesList.map((val) => {
      return val.listItemId;
    });
    let newFilterModel = {};
    newFilterModel['customerId'] = {
      'condition1': this.getCustomerIdFilter(this.currentRowData.completeRowData.customerId || this.currentRowData.customerId)
    }
    let requestParams = {
      pageNumber: 1,
      recordsPerPage: 10,
      orderIn: "desc",
      orderBy: "createdDate",
      isAllRequired: false,
    }
    let filterJson = JSON.stringify(newFilterModel);

    if (this.alertPopUpByEntity && this.alertPopUpByEntity === true) {
      this._alertService.getAlertByCIdAId(requestParams, filterJson).subscribe(resp => {
        if (resp && resp.paginationInformation && resp.paginationInformation.totalResults) {
          const selectedObj = resp.result.filter(item => item.alertId === this.currentRowData.alertId);
          this.newStatus = selectedObj[0].statuse.code;
          this.relatedAlertsCount = resp.paginationInformation.totalResults - 1;
          this.currentAlertStatus = selectedObj[0].statuse.code;
          this.getPossibleStates();
        }
      });
    } else {
      this._alertService.getAlertList(requestParams, filterJson).subscribe(resp => {
        if (resp && resp.paginationInformation && resp.paginationInformation.totalResults) {
          const selectedObj = resp.result.filter(item => item.alertId === this.currentRowData.alertId);
          this.newStatus = selectedObj[0].statuse.code;
          this.relatedAlertsCount = resp.paginationInformation.totalResults - 1;
          this.currentAlertStatus = selectedObj[0].statuse.code;
          this.getPossibleStates();
        }
      });
    }
  }

  public RelatedAlertsClick() {
    this._alertService.isRelatedAlertClicked = true;
    let statusListItemIds = this.relatedEIAlertstatesList.map((val) => {
      return val.listItemId;
    });
    let newFilterModel = {};
    newFilterModel['customerId'] = this.getCustomerIdFilter(this.currentRowData.customerId)
    this.gridApi.setFilterModel(newFilterModel);
    this.gridApi.refreshHeader();
    this.closeModal();
  }

  /**transalate based on the state
* Author : chinthaka
* Date : 02-08-2020
*/
  setTransition(currentAlertStatus, item) {
    let currentStatus = item && item.values && item.values.code ? item.values.code : "";
    this.newcurrentState = item && item.values ? item.values : {};
    this.openModal()
  }

  /* @purpose: to get next and previous row data.
  * @created: 8 January 2020
  * @author:Sivadasan Sarmilan*/

  getStatusForShowingReviewerIcon(val) {
    var flag = false;
    if (val && val.feed && val.feed[0] && val.feed[0].reviewer && val.feed[0].reviewer.length) {
        val.feed[0].reviewer.map((v) => {
        if (v.code && val.statuse && val.statuse.code && (v.code === val.statuse.code)) {
            flag = true;
        }
        });
    }
    return flag;
  }

  enablingTheRequiredOptionInGroupLevel(groupList, groupSelected) {
    groupList["groupLevel"].value.map((groupObj, index) => {
        if (groupObj.label == groupSelected && (index || index == 0)) {
        groupList["groupLevel"].value[index].disable = false;
        if (groupList["groupLevel"].value[index + 1]) {
            groupList["groupLevel"].value[index + 1].disable = false;
        }
        if (groupList["groupLevel"].value[index - 1]) {
            groupList["groupLevel"].value[index - 1].disable = false;
        }
        }
    })
    return groupList;
  }

  getUniqueValuesFromArray(arr, key) {
    var uniqueArr = arr.reduce((acc, val) => {
      if (!acc.find(el => el[key] === val[key])) {
        acc.push(val);
      }
      return acc;
    }, []);
    return uniqueArr;
  }

  getCompleteRowData(response, prevButton: boolean = false){
    var myFormattedDate;
    let rowDataSend: any = [];
    this.feedListForBulkTextSlider = [];
    var relatedAlertArray = [];
    this.nextTableData = [];

    response.result.map((value) => {
      let Status = value.statuse ? value.statuse.code : "";
      let identifiedEntityId = (value && value.statuse && value.statuse.code && (value.statuse.code.toLowerCase() == "new" || value.statuse.code.toLowerCase() == "identity approved, needed review" || value.statuse.code.toLowerCase() == "identity rejected, needed review" || value.statuse.code.toLowerCase() == "identity rejected")) ? "Multiple Results" : value.identifiedEntityId;
      if(this.dateFormat && this.dateFormat.ShortDateFormat && this.dateFormat.ShortTimeFormat && this.dateFormat.ShortDateFormat.toLowerCase() != 'undefined' && this.dateFormat.ShortTimeFormat.toLowerCase() != 'undefined'){
        myFormattedDate = datePipe.transform(value.createdDate,(this.dateFormat.ShortDateFormat+' '+this.dateFormat.ShortTimeFormat))
      } else {
        myFormattedDate = datePipe.transform(value.createdDate, 'MMM d, y, h:mm a')
      }

      let wlVersion: any = "";

      if ((value && value.statuse && value.statuse.code && (value.statuse.code.toLowerCase() == "new" || value.statuse.code.toLowerCase() == "identity approved, needed review" || value.statuse.code.toLowerCase() == "identity rejected, needed review" || value.statuse.code.toLowerCase() == "identity rejected"))) {
        wlVersion = "Multiple Results";
      }
      else {
        let alertMetaData: any;
        if (Object.keys(JSON.parse(value.alertMetaData)).indexOf('Result') == -1) {
          alertMetaData = JSON.parse(value.alertMetaData);
        }
        else {
          alertMetaData = JSON.parse(value.alertMetaData)['Result'];
        }
        let watchlists = (alertMetaData && alertMetaData.results && alertMetaData.results.screening && alertMetaData.results.screening.watchlists) ? alertMetaData.results.screening.watchlists : null;
        if (watchlists && watchlists.length > 0) {
          let date, name;
          date = watchlists[0] && watchlists[0]['basic_info'] && watchlists[0]['basic_info'][date] ? watchlists[0]['basic_info']['date'] : '';
          name = watchlists[0] && watchlists[0]['entries'] && watchlists[0]['entries'].length > 0 && watchlists[0]['entries'][0]['watchlist_id'] ? watchlists[0]['entries'][0]['watchlist_id'] : '';
          wlVersion = name + ", " + date;
        }
      }

      let formatFeeds = (feedObj) => {
        let name = [];
        feedObj.forEach((feed) => {
          name.push(feed.feedName);
        });
        return name.join(",");
      }

      var dataObj =
        {
          "alertId": value.alertId ? value.alertId : "",
          "customerId": value.customerId ? value.customerId : "",
          "createdDate": myFormattedDate ? myFormattedDate : "" ,
          "entityName": value.entityName ? value.entityName : "",
          "watchList": wlVersion,
          "identifiedEntityId": identifiedEntityId,
          "feed": value.feed ? formatFeeds(value.feed) : "",
          "groupLevel": { "key": "", "value": [] },
          "assignee": { "key": "", "value": [] },
          "reviewer": value,
          "status": { "key": Status, "value": this.statusObjs },
          'statusKeys':this.statusObjs_new,
          "comments": value.comments ? value.comments : [],
          "confidenceLevel": value.confidenceLevel ? value.confidenceLevel : "",
          "commentsCount": value.commentsCount ? value.commentsCount : "",
          "completeRowData": value,
          "selectBoxListData": [],
          "riskIndicators": value.riskIndicators ? value.riskIndicators : "",
          "timeInStatus": value.timeInStatus ? value.timeInStatus : "",
          "feedForBulk": (value.feed) ? value.feed.map((cfeed) => { return cfeed.feedName }) : [],
          "noOfdaysOfTimeStatus": value.timeStatusDuration ? value.timeStatusDuration : 0,
          'showReviewerIcon': this.getStatusForShowingReviewerIcon(value),
          'viwereSelectedValue': (value && value.reviewStatusId && value.reviewStatusId.displayName) ? value.reviewStatusId.displayName : 'Unconfirmed',
          'reviewerStatusList': this.reviewerStatusList,
          'userApproved': value.userApproved,
          'wlEntityName': value.wlEntityName ? value.wlEntityName : '',
          'hits': value.hits ? value.hits : 0,
          'TenantId':value.tenantId ? value.tenantId : 0,
        }

        value.feedGroups = value.feedGroups.sort((a, b) => parseFloat(a.rank) - parseFloat(b.rank));
        value.feedGroups.map((groupObj) => {
          dataObj["groupLevel"].value.push({ 'label': (groupObj.groupId && groupObj.groupId && groupObj.groupId.name) ? groupObj.groupId.name : '', disable: true, "values": groupObj })
          if (value.groupLevel == ((groupObj.groupId && groupObj.groupId && groupObj.groupId.id) ? groupObj.groupId.id : '')) {
            dataObj["groupLevel"].key = (groupObj.groupId && groupObj.groupId && groupObj.groupId.name) ? groupObj.groupId.name : '';
          }
        })
        if (Object.keys(dataObj).length > 0) {
          dataObj = this.enablingTheRequiredOptionInGroupLevel(dataObj, dataObj["groupLevel"].key);
        }

        if (value.asignee == null) {
          dataObj["assignee"].key = "UnAssigned";
          dataObj["assignee"].value.unshift({ 'label': "Unassigned", disable: false, "values": {} })
        } else {

          dataObj["assignee"].key = value.asignee ? value.asignee.firstName : "Unassigned";
          var label = value.asignee ? value.asignee.firstName : "Unassigned"
          dataObj["assignee"].value.unshift({ 'label': label, disable: false, "values": value.asignee })
        }
        if(this.relatedAlertCard) {
          relatedAlertArray.push(dataObj);
        } else {
          this.nextTableData.push(dataObj)
        }

        if (value && value.feed && value.feed.length) {
          value.feed.forEach((feed) => {
            this.feedListForBulkTextSlider.push(feed);
          })
        }
    });

    this.feedListForBulkTextSlider = this.getUniqueValuesFromArray(this.feedListForBulkTextSlider, 'feed_management_id');
    this._agGridTableService.getGridOptionsFromComponent(this.feedListForBulkTextSlider);
    if(this.relatedAlertCard) {
      return relatedAlertArray;
    } else {
      return rowDataSend;
    }

  }
  getNextPrevRowData(data) {
    if(data && data.identifiedEntityId) {
      this.selectedEntityId = data.identifiedEntityId;
    }
    let params = data;

    this.nextButtonStatus(params.alertId);

    if (params && params.completeRowData) {
      this.currentRowData = params;
      this.showReviewerIcon = this.currentRowData && this.currentRowData.showReviewerIcon ? this.currentRowData.showReviewerIcon : false;
      this.customTemplateClass = (params.colDef && params.colDef.customTemplateClass) ? params.colDef.customTemplateClass : '';
      this.currentAlertStatus = (this.currentRowData.completeRowData && this.currentRowData.completeRowData.statuse && this.currentRowData.completeRowData.statuse.code) ? this.currentRowData.completeRowData.statuse.code.toLowerCase() : "";
      if (params.comments) {
        this.getRowDataOnClick = params;
        this.searchData = (params && params.completeRowData && params.completeRowData.alertMetaData) ? JSON.parse(params.completeRowData.alertMetaData) : "";
        this.commentListItemsCount = params.commentsCount;
        if (this.searchData) {
          this.loadCustomerInfo = {
            results: this.searchData.customer_information ? this.searchData.customer_information.results : {},
            type: this.currentRowData.completeRowData.entiType
          };
        }
      }
    }

    // this.getPossibleStates()
  }

  getIndex(alertId: any) {
    this._alertService.getRowDataWhenUpdatedObserver.subscribe((resp: any) => {
      for (let i = 0; i < this.nextTableData.length; i++) {
        if (this.nextTableData[i].alertId === alertId) {
          this.index = i;
          break;
        }
      }
    });
  }

  getRelatedAlertIndex(relatedId: any) {
    this._alertService.getRelatedAlert.subscribe((response: any) => {
      if(this.relatedAlertCard){
        let relatedItem;
        var relatedData=this.getCompleteRowData(response);
        for (let i = 0; i < relatedData.length; i++) {
          if (relatedId === relatedData[i].alertId) {
            relatedItem = relatedData[i];
          }
        }

        this.currentRowData = relatedItem

        this.showReviewerIcon = this.currentRowData && this.currentRowData.showReviewerIcon ? this.currentRowData.showReviewerIcon : false;
        this.customTemplateClass = (relatedItem.colDef && relatedItem.colDef.customTemplateClass) ? relatedItem.colDef.customTemplateClass : ''
        this.currentAlertStatus = (this.currentRowData.completeRowData && this.currentRowData.completeRowData.statuse && this.currentRowData.completeRowData.statuse.code) ? this.currentRowData.completeRowData.statuse.code.toLowerCase() : "";
        this.validate = (this.currentRowData.completeRowData && this.currentRowData.completeRowData && this.currentRowData.completeRowData.identityApproved) ? this.currentRowData.completeRowData.identityApproved : false;

        var lowerCase = relatedItem.completeRowData.statuse.code.toLowerCase();
        lowerCase = lowerCase.replace('_',' ');

        if(lowerCase == 'primary processed' || lowerCase == 'new' || lowerCase == 'identity approved' || lowerCase == 'identity rejected' || lowerCase == 'identity rejected, needed review' || lowerCase == 'identity rejected, pending review' ||  lowerCase == 'identity approved, needed review'  || (lowerCase == 'in progress' && !this.validate) || (lowerCase == 'conflict reassess' && !this.validate)){
          this.closeModal();
          this.setRowData(relatedItem)
          this.open(this.EICard);
          this.openEICard();
          this.relatedAlertCard = false;
        }
        else if(!(lowerCase == 'primary processed' || lowerCase == 'new' || lowerCase == 'identity approved' || lowerCase == 'identity rejected' || lowerCase == 'identity rejected, needed review' || lowerCase == 'identity rejected, pending review' ||  lowerCase == 'identity approved, needed review'  || (lowerCase == 'in progress' && !this.validate) || (lowerCase == 'conflict reassess' && !this.validate))) {
          this.closeModal();
          this.setRowData(relatedItem)
          this.openAlertCard(this.alertCardBody,true);
          this.relatedAlertCard = false;
        }
      }
    })
  }

  auditLogWithNextPrevious(alertData: any){
    let auditLog = {};
    auditLog = {
      data: alertData
    };
    this.rightPanelData = auditLog;
  }

  private countRow = 1;

  public async getNextRow(considerAlterId: boolean = true) {
    if (considerAlterId) {
      this.getIndex(this.currentRowData.alertId);
    }

    this.prevButton = true;
    let nextIndex = this.index + 1;
    let nextItem = this.nextTableData[nextIndex];
    this.auditLogWithNextPrevious(nextItem);

    if (nextIndex < this.nextTableData.length) {
      this.index = nextIndex;
      var lowerCase = nextItem.completeRowData.statuse.code.toLowerCase();
      if (lowerCase) {
        this.newStatus = lowerCase.replace(/\b\w/g, (l) => l.toUpperCase());
      }
      if (
        lowerCase == "primary processed" ||
        lowerCase == "new" ||
        lowerCase == "identity rejected" ||
        lowerCase == "identity rejected, needed review" ||
        lowerCase == "identity rejected, pending review" ||
        lowerCase == "identity approved, needed review" ||
        (lowerCase == "in progress" && !this.validate) ||
        (lowerCase == "conflict reassess" && !this.validate)
      ) {
        this.closeModal();
        this.getNextPrevRowData(nextItem);
        this.open(this.EICard);
        this.openEICard();
      } else if (
        !(
          lowerCase == "primary processed" ||
          lowerCase == "new" ||
          lowerCase == "identity rejected" ||
          lowerCase == "identity rejected, needed review" ||
          lowerCase == "identity rejected, pending review" ||
          lowerCase == "identity approved, needed review" ||
          (lowerCase == "in progress" && !this.validate) ||
          (lowerCase == "conflict reassess" && !this.validate)
        )
      ) {
        this.closeModal();
        this.getNextPrevRowData(nextItem);
        this.openAlertCard(this.alertCardBody, true);
      }
    } else {
      try {
        this.nextprev = true;
        this.countRow = this.countRow + 1;
        if (this.countRow == 2) {
          this.nextPage = this.tableCurrentPage + 1;
        } else {
          this.nextPage = this.countRow;
        }
        this.tableCurrentPage = this.nextPage;
        let requestParams = {
          pageNumber: this.nextPage,
          recordsPerPage: this.tableCurrentRows,
          orderIn: this._alertService.getOrderIn,
          orderBy: this._alertService.getOrderBy,
          isAllRequired: false,
        };

        var jsonStringFilter = this._alertService.getfilter;
        let filterJson = "";
        if (jsonStringFilter == "{}") {
          filterJson = jsonStringFilter;
        } else {
          filterJson = JSON.stringify(
            this._alertService.formatFilters(this._alertService.getfilter)
          );
        }
        this._alertService.getAlertList(requestParams, filterJson).subscribe(
          (resp) => {
            this.nextprev = false;
            this.getCompleteRowData(resp);
            this.index = -1;
            this.countRow = 1;
            this.getNextRow(false);
          },
          (error) => {
            this.nextprev = false;
          }
        );
      } catch (error) {
        this.nextprev = false;
      }
    }
  }

  public async getPrevRow(considerAlterId: boolean = true) {
    if(this.nextButton == false){
      this.nextButton = true;
    }
    if (considerAlterId) {
      this.getIndex(this.currentRowData.alertId);
    }

    let prevIndex = this.index - 1;
    let prevItem = this.nextTableData[prevIndex];
    this.auditLogWithNextPrevious(prevItem);

    if (this.tableCurrentPage == 1 && prevIndex == 0) {
      if (prevItem == this.nextTableData[0]) {
        this.prevButton = false;
      }
    }
    if (prevIndex >= 0) {
      this.index = prevIndex;
      if (prevItem !== undefined) {
        var lowerCase = prevItem.completeRowData.statuse.code.toLowerCase();
        if (lowerCase) {
          this.newStatus = lowerCase.replace(/\b\w/g, (l) => l.toUpperCase());
        }
        if (
          lowerCase == "primary processed" ||
          lowerCase == "new" ||
          lowerCase == "identity rejected" ||
          lowerCase == "identity rejected, needed review" ||
          lowerCase == "identity rejected, pending review" ||
          lowerCase == "identity approved, needed review" ||
          (lowerCase == "in progress" && !this.validate) ||
          (lowerCase == "conflict reassess" && !this.validate)
        ) {
          this.closeModal();
          this.getNextPrevRowData(prevItem);
          this.open(this.EICard);
          this.openEICard();
        } else if (
          !(
            lowerCase == "primary processed" ||
            lowerCase == "new" ||
            lowerCase == "identity rejected" ||
            lowerCase == "identity rejected, needed review" ||
            lowerCase == "identity rejected, pending review" ||
            lowerCase == "identity approved, needed review" ||
            (lowerCase == "in progress" && !this.validate) ||
            (lowerCase == "conflict reassess" && !this.validate)
          )
        ) {
          this.closeModal();
          this.getNextPrevRowData(prevItem);
          this.openAlertCard(this.alertCardBody, true);
        }
      }
    } else {
      try {
        this.nextprev = true;
        this.tableCurrentPage = this.tableCurrentPage - 1;
        let requestParams = {
          pageNumber: this.tableCurrentPage,
          recordsPerPage: this.tableCurrentRows,
          orderIn: this._alertService.getOrderIn,
          orderBy: this._alertService.getOrderBy,
          isAllRequired: false,
        };

        var jsonStringFilter = this._alertService.getfilter;
        let filterJson = "";
        if (jsonStringFilter == "{}") {
          filterJson = jsonStringFilter;
        } else {
          filterJson = JSON.stringify(
            this._alertService.formatFilters(this._alertService.getfilter)
          );
        }
        this._alertService.getAlertList(requestParams, filterJson).subscribe(
          (resp) => {
           this.nextprev = false;
            this.getCompleteRowData(resp, true);
            this.index = this.tableCurrentRows;
            this.getPrevRow(false);
          },
          (error) => {
            this.nextprev = false;
          }
        );
      } catch (error) {
        this.nextprev = false;
      }
    }
  }

  /* @purpose:to change the adverse media acoording to length
  * @created: 16 september 2020
  * @returns:  nothing
  * @author:Sarvani Harshita*/
  public getChangedValue(event) {
    (this.checkData) ? (this.alertCard && this.alertCard.alertMetaData && this.alertCard.alertMetaData.results && this.alertCard.alertMetaData.results.screening && (this.articlesData = [...this.alertCard.alertMetaData.results.screening["Adverse Media Articles"]])) : (this.alertCard.alertMetaData.results.screening["Adverse Media Articles"] = [...this.articlesData]);
    this.alertCard.alertMetaData.results.screening["Adverse Media Articles"].map((record, index) => {
      this.getPublishedDate(record.published, index, event);
      if (this.alertCard && this.alertCard.alertMetaData && this.alertCard.alertMetaData.results && this.alertCard.alertMetaData.results.screening && this.alertCard.alertMetaData.results.screening["Adverse Media Articles"].length > 0) {
        this.alertCardUtilityObject.adverseMediaData = false
        $('#displacy').empty();
        var setEntites = this.financeArticleDetails.ent.map((val) => {
          val.start = val.BeginOffset;
          val.end = val.EndOffset;
          return val;
        })
        this.loadEntity(this.financeArticleDetails.text, setEntites, this.financeArticleDetails.types);
      } else {
        $('#displacy').empty();
        this.alertCardUtilityObject.adverseMediaData = true
      }
      this.checkData = false;
    });
  }

  public getPublishedDate(published, index, event) {
    let date = new Date(published).getFullYear();
    if (date >= event.highValue || date <= event.value) {
      this.alertCard.alertMetaData.results.screening["Adverse Media Articles"].splice(index, 1);
    }
    let arraylist = this.articlesData.filter(f => new Date(f.published).getFullYear() >= event.value && new Date(f.published).getFullYear() <= event.highValue);
    this.alertCard.alertMetaData.results.screening["Adverse Media Articles"] = arraylist;
    this.checkData = false;
  }

  filterAdverseMediaNews() {
    this.alertUtilityObject.financeSpinner = true;
    (this.checkData) ? (this.articlesData = [...this.alertCard.alertMetaData.results.screening["Adverse Media Articles"]]) : (this.alertCard.alertMetaData.results.screening["Adverse Media Articles"] = [...this.articlesData]);
    let arraylist = [];
    if (this.adverseSelectedItems.length > 0) {
      arraylist = this.articlesData.filter(f => this.adverseSelectedItems.includes(f.relation_type));
    } else {
      arraylist = [];
    }

    if (this.minValue && this.maxValue && arraylist && arraylist.length) {
      arraylist = arraylist.filter(f => new Date(f.published).getFullYear() >= this.minValue && new Date(f.published).getFullYear() <= this.maxValue);
    }
    this.alertCard.alertMetaData.results.screening["Adverse Media Articles"] = arraylist;

    this.checkData = false;
    if (this.alertCard.alertMetaData.results.screening["Adverse Media Articles"].length > 0) {
      this.getsingleArticleDetail(this.alertCard.alertMetaData.results.screening['Adverse Media Articles'][0]);
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

    /**Get comment Data
 * Author : Amritesh
 * Date : 02-02-2019
*/
  getCommentData(rowVal, popover, modalContent) {
    this.isCommentPermissionView();
    this.commentListItems = [];
    this.commentsPopover = popover;
    this.showListItems = false;
    this.modalService.open(modalContent, {windowClass: 'modal-popover unique-modal alert-card-popover-modal light-theme', backdropClass: 'custom-modal-backdrop', backdrop: 'static', keyboard: false })
    if (rowVal && rowVal.alertId) {
      this.showFileSpinner = true;
      this._alertService.getCommentsListByAlertID(rowVal.alertId).subscribe(resp => {
        resp.map((value) => {
          value.imgUrl = "../../../../assets/images/icon/usericon";
        })
        this.commentListItems = resp;
        this.showFileSpinner = false;
      })
      this.listItems(rowVal);
    }
    if (rowVal && rowVal.caseId) {
      this.showFileSpinner = true;
      this._caseService.getCommentsListBycaseID(rowVal.caseId).subscribe(resp => {
        resp.map((value) => {
          value.imgUrl = "../../../../assets/images/icon/usericon";
        })
        this.commentListItems = resp;
        this.showFileSpinner = false;
      })
    }
  }

  getCommentDataForAlertCard(rowData, modalContent) {
    this.isCommentPermissionView();
    this.commentListItems = [];
    this.showListItems = false;
    this.modalService.open(modalContent, { windowClass: 'alert-card-popover-modal light-theme', backdropClass: 'custom-modal-backdrop', backdrop: 'static', keyboard: false })
    if (rowData && rowData.alertId) {
      this._alertService.getCommentsListByAlertID(rowData.alertId).subscribe(resp => {
        resp.map((value) => {
          value.imgUrl = "../../../../assets/images/icon/usericon";
        })
        this.commentListItems = resp;
      })
      this.listItems(rowData);
    }
    if (rowData && rowData.caseId) {
      this._caseService.getCommentsListBycaseID(rowData.caseId).subscribe(resp => {
        resp.map((value) => {
          value.imgUrl = "../../../../assets/images/icon/usericon";
        })
        this.commentListItems = resp;
      })

    }
  }

  listItems(rowVal) {

    this._alertService.getListItems(rowVal.status.key).subscribe(response => {

      this.listItemsValues = response;

      this.assignCopy()
    })

  }

  public getTableData() {
    return this.tableData;
  }

  assignCopy() {
    this.filteredItems = Object.assign([], this.listItemsValues);
  }
  filterItem(value) {
    this.showListItems = true;
    if (!value) {
      this.assignCopy();
    }
    this.filteredItems = Object.assign([], this.listItemsValues).filter(
      item => item.displayName.toLowerCase().indexOf(value.toLowerCase()) > -1
    )
  }
  showList() {

    if (this.commentMssg == "") {
      this.showListItems = true;
    }
  }
  addItem(val) {
    this.commentMssg = val;
    this.showListItems = false;
  }
  commentMssgData(key, rowObj) {

    this.showListItems = false;
    var today: number = Date.now();
    var objTosend = {}

    if (rowObj && rowObj.alertId) {
      objTosend = {
        "alertId": {
          "alertId": rowObj.alertId

        },
        "comments": key.commentMssgForValid

      }
      this._alertService.addComment(objTosend).subscribe(response => {
        this.currentComment = response;
        response.imgUrl = "../../../../assets/images/icon/usericon";
        this.commentListItems.push(response);
        this.commentListItemsCount = this.commentListItems.length;
        this.commentMssg = "";
      })
    }
    if (rowObj && rowObj.caseId && key.commentMssgForValid) {
      objTosend = {
        "caseId": {
          "caseId": Number(rowObj.caseId)

        },
        "comments": key.commentMssgForValid

      }
      this._caseService.addComment(objTosend).subscribe(response => {
        this.currentComment = response;
        this.commentListItems.push(response);
        this.commentListItemsCount = this.commentListItems.length;
        this.commentMssg = "";

        this.currentRowData.commentsCount = this.commentListItemsCount;
        this.currentRowData['targetUpdates'] = ["commentsCount"];
        this.currentRowData['gridDataMapID'] = "caseId";
        this._agGridTableService.getUpdatedData(this.currentRowData);
      })
    }

  }
    /** Delete comments
   * Written by : Asheesh
   * Date : 13-May-2019
  */
  deleteComment(index) {
    this.commentListItems.splice(index, 1);
  }

  fileUpload(file) {
    if(file && file[0]) {
      let fileSize = (file[0] && file[0].size) ? file[0].size : 0;
      if (fileSize > 0) {
        let objTosend = {
          "alertId": {
            "alertId": this.currentRowData.alertId
          },
          "comments": " "
        }

        this._alertService.addComment(objTosend).subscribe(response => {
          this.currentComment = response;
          response.imgUrl = "../../../../assets/images/icon/usericon";
          this.commentListItems.push(response);
          this.commentListItemsCount = this.commentListItems.length;
          this.commentMssg = "";

          if (this.currentComment && this.currentComment.commentId) {
            this.uploadCommentFile(file);
          }
        });
      }
    }
  }

  uploadCommentFile(file) {
    this.showFileSpinner = true;
    let filesAr = [];

    const documentsLocalTxt = this.getLanguageKey('Document(s)') || 'Document(s)';
    const allreadyExistsLocalTxt = this.getLanguageKey('already exists') || 'already exists';
    const referenceLinkCreatedLocalTxt = this.getLanguageKey('in the repository. Reference link created.') || ' in the repository. Reference link created.';

    Array.from(file).forEach(f => {
      filesAr.push({
        lastModified: f['lastModified'],
        lastModifiedDate: f['lastModifiedDate'],
        name: f['name'],
        size: f['size'],
        type: f['type']
      });
    });

    let uploadDocDataArr = filesAr.map(file => ({
      analysis: true,
      created_by: GlobalConstants.systemSettings['ehubObject']['userId'].toString(),
      file_name: file.name,
      format: file.name.split('.')[1],
      last_updated: datePipe.transform(new Date(file.lastModifiedDate), GlobalConstants.DATE_TIME_FORMAT),
      timestamp: datePipe.transform(new Date(), GlobalConstants.DATE_TIME_FORMAT),
      reference_id: this.currentComment.commentId.toString(),
      reference_type: GlobalConstants.ALERT_COMMENT,
      size: (file.size/1048576).toString(),
      title: file.name.split('.')[0],
      updated_by: GlobalConstants.systemSettings['ehubObject']['userId'].toString(),
      main_entity_id: this.currentRowData.alertId.toString(),
      reference_name: this.searchData.name,
      meta_data: "{}"
    }));

    // upload attachments and share same response with all observables
    const uploadDocuments$ = this._commonServices.uploadRawDocuments(uploadDocDataArr).pipe(
      share()
    );

    // pipeline for handling new file uploads
    const uploadNewDocuments$ = uploadDocuments$.pipe(
      mergeMap(documents => documents),
      filter((document: any) => document.is_uploaded),
      map(document => document.file_info.file_name),
      toArray(),
      filter(fileNamesArr => !!fileNamesArr.length),
      map(fileNamesArr => ({
        file_names: fileNamesArr,
        location: GlobalConstants.LOCATION_DOC
      })),
      switchMap(docLocationPayload => this._commonServices.getDocumentLocation(docLocationPayload)),
      mergeMap(locationRespose => locationRespose),
      filter((locationResItem: any) => locationResItem.presignedUrl && locationResItem.fileName && locationResItem.filePath),
      map(locationResItem => {
        const documentFile = find(file, file => file.name === locationResItem.fileName || file.name === locationResItem.filePath);
        return {
          file: documentFile,
          url: locationResItem.presignedUrl
        }
      }),
      filter(({file, url}) => !!file),
      mergeMap(({file, url}) => this._commonServices.callUploadPresignedUrl(url, file)),
      defaultIfEmpty(null)
    );

    // pipeline for handling existing file uploads
    const uploadExistingDocuments$ = uploadDocuments$.pipe(
      mergeMap(documents => documents),
      filter((document: any) => !document.is_uploaded),
      map(document => document.file_info.file_name),
      toArray(),
      filter(existingDocNameList => !!existingDocNameList.length),
      tap(existingDocNameList => {
        const namesMerged = existingDocNameList.join(", ");
        this._sharedServicesService.showFlashMessage(`${documentsLocalTxt} '${namesMerged}' ${allreadyExistsLocalTxt} ${referenceLinkCreatedLocalTxt}`, 'danger');
      }),
      defaultIfEmpty(null)
    );

    // when file upload is complete refresh comment section
    forkJoin([uploadNewDocuments$, uploadExistingDocuments$]).subscribe( _ => {
      this._alertService.getCommentsListByAlertID(this.currentRowData.alertId).subscribe(resp => {
        resp.map((value) => {
          value.imgUrl = "../../../../assets/images/icon/usericon";
        });
        this.commentListItems = resp;
        this.showFileSpinner = false;
      });
    }, err => {
      this.showFileSpinner = false;
    });
  }

  multifileUpload(file) {
    let fileSizeFromSystemSettings = this.getFileSizeInNumber(GlobalConstants.systemsettingsData);

    let fileFormat = (file[0] && file[0].name) ? file[0].name.split(".")[file[0].name.split(".").length - 1] : '';
    let fileSize = (file[0] && file[0].size) ? file[0].size / 1024 / 1024 : 0;
    let allowedExtensions = [];
    GlobalConstants.systemsettingsData['General Settings'].forEach((item) => {
      if (item.section === 'File Settings' && item.selectedValue == 'On') {
        allowedExtensions.push(item.name);
      }
    });

    if (fileFormat && allowedExtensions.indexOf(fileFormat) > -1) {
      if (fileSize && fileSizeFromSystemSettings && (fileSize <= fileSizeFromSystemSettings && fileSize > 0)
      ) {

        var i = 0;

        for (i = 0; i < file.length; i++) {
          var docName = file[i].name;
          var params = {
            fileTitle: docName,
            remarks: docName,
            docFlag: 17,
            entityId: this.currentComment.commentId,
          }

          this.attachmentList = file;
        }

      } else if(fileSize == 0) {
        this._sharedServicesService.showFlashMessage('File size should be greater than ' + 0 + 'KB ...!', 'danger');
      }
      else{
        this._sharedServicesService.showFlashMessage('File size should not be greater than ' + fileSizeFromSystemSettings + 'MB ...!', 'danger');
      }

    } else {
      this._sharedServicesService.showFlashMessage(fileFormat + ' File not allowed...!', 'danger');
    }
  }

  /** Return file size of system settings
   * Written by : Ganapathi
   * Date : 13-May-2020
  */
  getFileSizeInNumber(obj) {
    var size: any = 0;
    if (obj && obj['General Settings'] && obj['General Settings'].length) {
      size = obj['General Settings'].map((val) => {
        if (val && val.name && val.name == 'Maximum file size allowed') {
          return val;
        }
      }).filter((v) => { return v })[0].selectedValue;

      if (size.indexOf('MB')) {
        size = Number(size.split("MB")[0]);
      }
    }
    return size;
  }

    /**file attach
   * Written by : Asheesh
   * Date : 13-May-2019
  */
  fileAttach(event) {
    event.preventDefault();
    var element = (<HTMLInputElement>document.getElementById('fileAttachment'));
    if(element) {
      element.value =""
      element.click();
    }
  }

  public parsedJson: any;
  public parsedJson1: any;
  public parsedJson2: any;

  openAlertCard(content, openContent: boolean) {
    this.getAlertStatusChangePermission()
    if (!content) {
      return;
    }
    this.entityIdentification();
    this.setWatchList(0);
    this.accodrianData = [];
    this.alertCard['name'] = this.getRowDataOnClick.completeRowData.entityName;
    this.alertCard['confidenceLevel'] = 0.1;
    this.alertCard.statusDetails = this.getRowDataOnClick.status;
    this.alertCardUtilityObject.statusMaintained = this.alertCard.statusDetails && this.alertCard.statusDetails.key ? this.alertCard.statusDetails.key : '';
    this.reviewStatus = (this.getRowDataOnClick.completeRowData.reviewStatusId && this.getRowDataOnClick.completeRowData.reviewStatusId.displayName) ? this.getRowDataOnClick.completeRowData.reviewStatusId.displayName.toLowerCase() : "";
    if (this.alertCard.statusDetails && this.alertCard.statusDetails.value && this.alertCard.statusDetails.value.length) {
      // this.validateStatus(this.currentAlertStatus, this.alertCard.statusDetails.value, false);
      var mappedStatusObj = this.alertCard.statusDetails.value.map((val) => {
        if (val.values.code == this.alertCard.statusDetails.key) {

          return val.values
        }
      }).filter((element) => { return element })[0];
    }
    if (mappedStatusObj && (mappedStatusObj.icon || mappedStatusObj.colorCode)) {
      this.selectedIcon = mappedStatusObj.icon;
      this.selectedIconColor = mappedStatusObj.colorCode;
    }
    try {
      let jsonresult = JSON.parse(this.getRowDataOnClick.completeRowData.alertMetaData)
      if (Object.keys(jsonresult).indexOf('Result') == -1) {

        this.alertMetaData = jsonresult;
        this.alertCard.alertMetaData = jsonresult;
      }
      else {
        this.alertMetaData = jsonresult['Result'];
        this.alertCard.alertMetaData = jsonresult['Result'];
      }
      if (this.alertCard.alertMetaData && this.alertCard.alertMetaData.results && this.alertCard.alertMetaData.results.screening && this.alertCard.alertMetaData.results.screening.watchlists) {
        var jurisdictionCode = this.getRowDataOnClick.completeRowData.jurisdictions && this.getRowDataOnClick.completeRowData.jurisdictions.code ? this.getRowDataOnClick.completeRowData.jurisdictions.code : '';
        this.alertCard.alertMetaData.results.screening.sanction = [];
        this.alert_entityId = this.alertCard.alertMetaData.name && jurisdictionCode ? this.hashCode(this.alertCard.alertMetaData.name + jurisdictionCode) : this.hashCode(this.alertCard.alertMetaData.name)
        this.alert_entityId = this.alert_entityId.replace(/[^a-zA-Z0-9 ]/g, "");
        this.alertCard.alertMetaData.results.screening.pep = [];
        this.alertCard.alertMetaData.results.screening['Adverse Media Articles'] = [];
        this.alertCard.alertMetaData.results.screening.jurisdiction = [];
        this.alertCard.alertMetaData.results.screening.selectedData = {};
        this.alertCard.alertMetaData.results.screening.watchlists.forEach((value) => {
          value.entries.forEach((val) => {
            const lowercase = val.classification.toLowerCase();
            const key = lowercase.indexOf('pep') !== -1 ? 'pep' : lowercase.indexOf('sanction') !== -1 ? 'sanction' : val.classification;

            if (this.alertCard.alertMetaData.results.screening[key]) {

              this.alertCard.alertMetaData.results.screening[key].push(value)

            } else {
              this.alertCard.alertMetaData.results.screening[key] = [];

              this.alertCard.alertMetaData.results.screening[key].push(value);

              this.accodrianData.push({
                "first_name": key,

                primaryOpen: false,
                id: key.toLowerCase().split(' ').join('')

              })
            }
          });
        });
        if (this.alertCard.alertMetaData.results.screening.pep && this.alertCard.alertMetaData.results.screening.pep.length > 0) {
          this.accodrianData.push({
            "first_name": "pep",
            primaryOpen: false,
            id: 'pep'
          })
        }
        if (this.alertCard.alertMetaData.results.screening.sanction && this.alertCard.alertMetaData.results.screening.sanction.length > 0) {
          this.accodrianData.push({
            "first_name": "sanction",
            primaryOpen: false,
            id: 'sanction'
          })
        }
        let classifications =  this.getRowDataOnClick.completeRowData && this.getRowDataOnClick.completeRowData.classification
        && this.getRowDataOnClick.completeRowData.classification.length > 0 ? this.getRowDataOnClick.completeRowData.classification.map(v=>v.toLowerCase().split(' ').join('')) : '';
      for(let i = 0; i < classifications.length; i++){
        let classifiedData = classifications[i].indexOf('pep') !== -1 ? 'pep' : classifications[i].indexOf('sanction') !== -1 ? 'sanction' : classifications[i];
        this.classificationData.push(classifiedData);
      }
        this.accodrianData = this.accodrianData.filter((val) => {
          for(let i=0; i<this.classificationData.length; i++){
            if(val.id == this.classificationData[i]){
              this.alertUtilityObject.showClassification = this.classificationData[i];
              return val.id;
            }
          }
        });
        if (this.alertCard.alertMetaData.results.screening && this.alertCard.alertMetaData.results.screening.news && this.alertCard.alertMetaData.results.screening.news.link) {
          let classifications: any = this.currentRowData.completeRowData['classification'];
          if (Array.isArray(classifications) && classifications.length > 0 && classifications[0] == "BST ADVERSE MEDIA") {
            this.accodrianData.push({
              "first_name": "Adverse Media Articles",
              primaryOpen: false,
              id: 'adversemediaarticles'
            })
          }
        }
      }
      if (this.accodrianData && Array.isArray(this.accodrianData) && this.accodrianData.length > 0) {
        if (this.alertCard.alertMetaData.results.screening.pep && this.alertCard.alertMetaData.results.screening.pep.length > 0 && (this.accodrianData && Array.isArray(this.accodrianData) && this.accodrianData.length > 0 && this.accodrianData[0].first_name === "pep")) {
          this.activePanelId = 'panel-pep';
          this.accodrianData[0].primaryOpen = true;
          this.selectedTab('pep', this.alertCard.alertMetaData.results.screening['pep'][0], 0);
        } else if (this.alertCard.alertMetaData.results.screening.sanction && this.alertCard.alertMetaData.results.screening.sanction.length > 0 && this.accodrianData[0].first_name === "sanction") {
          this.activePanelId = 'panel-sanction';
          if (this.accodrianData.length > 1) {
            this.accodrianData[1].primaryOpen = true;
          }
          this.selectedTab('sanction', this.alertCard.alertMetaData.results.screening['sanction'][0], 0);
        } else if (this.accodrianData.length > 0 && this.accodrianData[0].first_name === "Adverse Media Articles") {
          this.activePanelId = 'panel-adversemediaarticles';
          this.accodrianData[0].primaryOpen = true;
          this.checkTabSelected = 'Adverse Media Articles';
          this.alertUtilityObject.financeisfirst = true;
        } else {
          this.activePanelId = 'panel-' + this.accodrianData[0].id;
          this.accodrianData[0].primaryOpen = true;
          this.checkTabSelected = this.accodrianData[0].first_name;
          this.selectedTab(this.accodrianData[0].first_name, this.alertCard.alertMetaData.results.screening[this.accodrianData[0].first_name][0], 0);
        }
      }

      (openContent) ? this.open(content) : '';
    } catch (error) {
      this.parsedJson == false;
      this.alertCard['watchList'] = "N/A";
    }
    this.getReasons();
    this.getFinanceValues();
    this.setProfileNotes();
    this.setRolesInfo();
    this.setReferences();
    // this.getRCARelationData();
    this.setInactiveAsOf();
  }

  public openById() {
    this.window.open()
  }

  getDownload(doc) {
    this.showFileSpinner = true;
    this._sharedServicesService.showFlashMessage( 'Your file is being downloaded...', 'success');

    let getDownloadLocParams = {
      "document_paths": [doc.docName]
    };

    this._commonServices.getDownloadLocations(getDownloadLocParams).subscribe(downLocRes => {
      if (downLocRes && downLocRes.status && downLocRes.status == 'success' && downLocRes.presigned_url) {
        this._commonServices.callDownloadPresignedUrl(downLocRes.presigned_url).subscribe(downPresRes => {
          var blob = new Blob([downPresRes], {
            type: "application/" + doc.type,
          });
          let url = (this.window as any).URL.createObjectURL(blob);
          var FileToDownload: any = document.createElement("a");
          document.body.appendChild(FileToDownload);
          FileToDownload.style = "display:none";
          FileToDownload.setAttribute('href', url);
          FileToDownload.setAttribute('download', doc.docName);
          FileToDownload.click();
          this.showFileSpinner = false;
        });
      } else {
        this.showFileSpinner = false;
      }

    }, (err) => {
      this._sharedServicesService.showFlashMessage('Failed to download document with file name: ' + doc.docName, 'danger');
      this.showFileSpinner = false;
    });
  }

  setRolesInfo() {
    (this.watchlistData[this.watchListIndex] && this.watchlistData[this.watchListIndex].basic_info && this.watchlistData[this.watchListIndex].basic_info.roles && this.watchlistData[this.watchListIndex].basic_info.roles.length > 0) ? this.rolesInformation = this.watchlistData[this.watchListIndex].basic_info.roles : this.rolesInformation = [];
    if(this.rolesInformation && this.rolesInformation.length > 0){
      const sortByRoleType: string = "Primary Role";
      const arraySortedByPrimaryRole: any[] = this.rolesInformation.sort(function(x,y){ return x.role_type === sortByRoleType ? -1 : y.role_type === sortByRoleType ? 1 : 0; });
      this.getRolesText(arraySortedByPrimaryRole);
    }else{
      this.rolesText = '';
    }

    let uniqueRoleArray = this.rolesInformation.map(m => m.role_type).filter((value, index, self) => {
      return self.indexOf(value) === index;
    })
    let getRolesInOder = [];
    if (uniqueRoleArray.includes("Primary Role")) {
      getRolesInOder.push("Primary Role");
    }
    if (uniqueRoleArray.includes("Previous Roles")) {
      getRolesInOder.push("Previous Roles");
    }
    if (uniqueRoleArray.includes("Other Roles")) {
      getRolesInOder.push("Other Roles");
    }
    this.alertCardUtilityObject.rolesArry = [];
    getRolesInOder.forEach((val) => {
      this.alertCardUtilityObject.rolesArry.push({
        role: val,
        value: this.rolesInformation.filter(
          (roleval) => roleval.role_type == val
        ),
      });
    });
  }
  /**
   * @purpose: Format the roles text
   * @created: 5 Feb 2021
   * @author: shravani
   * @param [Array] of object.
   */
  getRolesText(rolesInfo){
    this.rolesText = '';
    if(rolesInfo && rolesInfo.length>0){
      for(let i =0;i<rolesInfo.length;i++){
        let occupation = rolesInfo[i] && rolesInfo[i]['occupation'] ? rolesInfo[i]['occupation']:'';
        let occupationType = rolesInfo[i] && rolesInfo[i]['occupation_type'] ? rolesInfo[i]['occupation_type']:''
        if(occupation && this.rolesText.length<=this.rolesTextLength){
          let concatRoles = this.rolesText ? this.rolesText +','+ occupation : occupation;
          this.rolesText = (concatRoles.length >this.rolesTextLength) ? concatRoles.substr(0, this.rolesTextLength) + '...' : concatRoles;
        }
        if(occupationType && this.rolesText.length<=this.rolesTextLength){
          let concatRoles = this.rolesText ? this.rolesText +','+ occupationType : occupationType;
          this.rolesText = (concatRoles && concatRoles.length >this.rolesTextLength) ? concatRoles.substr(0, this.rolesTextLength) + '...' :concatRoles;
        }
        if(occupation =='' && occupationType=='' ){
          return this.rolesText;
        }
        if(this.rolesText && this.rolesText.length> this.rolesTextLength){
          break ;
        }
      };
    }
  }

  setInactiveAsOf() {
    if (this.watchlistData && this.watchlistData[this.watchListIndex] && this.watchlistData[this.watchListIndex].basic_info && this.watchlistData[this.watchListIndex].basic_info.inactive_PEP && this.watchlistData[this.watchListIndex].basic_info.inactive_PEP !== '') {
      this.inactiveAsOf.attrName = 'Inactive as of (PEP)';
      this.inactiveAsOf.attrVal = this.watchlistData[this.watchListIndex].basic_info.inactive_PEP;
    } else if (this.watchlistData && this.watchlistData[this.watchListIndex] && this.watchlistData[this.watchListIndex].basic_info && this.watchlistData[this.watchListIndex].basic_info.inactive_RCA_rel_PEP && this.watchlistData[this.watchListIndex].basic_info.inactive_RCA_rel_PEP !== '') {
      this.inactiveAsOf.attrName = 'Inactive as of (RCA related to PEP)';
      this.inactiveAsOf.attrVal = this.watchlistData[this.watchListIndex].basic_info.inactive_RCA_rel_PEP;
    } else {
      this.inactiveAsOf.attrName = null;
      this.inactiveAsOf.attrVal = null;
    }
  }

  setReferences() {
    this.referencesList = (this.watchlistData && this.watchlistData[this.watchListIndex] && this.watchlistData[this.watchListIndex].basic_info && this.watchlistData[this.watchListIndex].basic_info.sanction_references) ? this.watchlistData[this.watchListIndex].basic_info.sanction_references : '';
  }

  setProfileNotes() {
    if (this.watchlistData.length && this.watchListIndex >= 0) {
      let note = (this.watchlistData[this.watchListIndex] && this.watchlistData[this.watchListIndex].basic_info && this.watchlistData[this.watchListIndex].basic_info.profile_notes) ? this.watchlistData[this.watchListIndex].basic_info.profile_notes : '';
      if (note.length > this.profileNotesLength) {
        this.profileInfo = note.substring(0, this.profileNotesLength) + '...';
      }
      else {
        this.profileInfo = note;
      }
      this.profileNote = (this.watchlistData[this.watchListIndex] && this.watchlistData[this.watchListIndex].basic_info && this.watchlistData[this.watchListIndex].basic_info.profile_notes) ? this.watchlistData[this.watchListIndex].basic_info.profile_notes : '';
    }
  }

  getSelectedWatchlist(index, entityId){
    if(entityId){
      if(this.watchlistData.length>0){
        for (let i = 0; i < this.watchlistData.length; i++) {
          if(this.watchlistData[i].basic_info.id == entityId) {
            return i;
          }
        }
      }
    } else {
      return index;
    }
  }

  selectedWatchList(index) {
    this.ChangeDetectorRef.detectChanges();
    this.selectedWatchListIndex = index;
    this.setWatchList(index);
    this.watchListIndex = index;
    this.setProfileNotes();
    // this.getRCARelationData();
    this.setReferences();
  }

  financepgraph(vlaData, vlaDataType) {
    var data = {
      "fetchers": ["1008", "1006", "1013", "1021"],
      "keyword": "adidas AG",

      "layout": "cise",
      "searchType": "Company",
      "lightWeight": true,
      "limit": 2,
      "iterations": 1,
      "alias": "Stock",
      "create_new_graph": false,
      "requires_expansion": true,
      "entity_resolution": true,
      "expansion_fetchers_lightweight": true,
      "expansion_fetchers": ["1005", "1009", "1010", "1011", "1012"]
    };
    var option = {
      data: vlaData,
      id: 'VLA',
      layouts: data,
      vlaDataType: vlaDataType
    }
    this.loadDataAndPlotGraphForEntity(option);
  }

  loadDataAndPlotGraphForEntity(options) {
    $('#' + options.id).html("");
    this.handleGraphData(options.data, options)
  }

  getComponentPermissionIds() {
    this._agGridTableService.behaviorSubjectForAllPermisonIds$.subscribe(ids => {
      this.permissionIdsList = ids;
    })
    this.permisionIds =
    GlobalConstants.permissionJson &&
    GlobalConstants.permissionJson[0] &&
    GlobalConstants.permissionJson[0]["alertsData"]
      ? GlobalConstants.permissionJson[0]["alertsData"]
      : "";
  }

  handleGraphData(data, options) {
    var finalData = { nodes: [], edges: [] };
    var edges = [];
    var nodeIDS = [];
    var nodes = [];
    data.vertices.map((val, i) => {
      nodeIDS.push(val.id)
      nodes.push({
        data: val
      });
    });
    data.edges.map((val, i) => {
      if ($.inArray(val.from, nodeIDS) != -1 && $.inArray(val.to, nodeIDS) != -1)
        edges.push({
          data: {
            source: val.from,
            target: val.to,
            labelE: val.labelE,
            id: val.id,
            totalPercentage: val.totalPercentage ? val.totalPercentage : ''
          }
        });
    });
    finalData.nodes = nodes;
    finalData.edges = edges;
    LoadEntityNetworkChartModule.loadEntityNetworkChart(finalData, options, "adidas AG", options.layouts.layout, options.vlaDataType, this.jurisdictionListValue);
    this.vlaChartLoader = false;
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  open(content) {
    if (!this.alertPopUpByEntity) {
      this.currentModalRef = this.modalService.open(content, { windowClass: 'bst_modal alert-card-modal entity-identification-modal light-theme' });
    } else {
      this.currentModalRef = this.modalService.open(content, { windowClass: 'bst_modal alert-card-modal entity-identification-modal entity-to-alert-identification-modal light-theme' });
    }
  }
  // display: contents;
  navigateToCasePage(){
    this.router.navigate(['element/case-management/case', this.getRowDataOnClick['relatedCaseId']],
    { queryParams: { fromAlert: true } })
    this.closeModal();
  }

  openModal() {
    let currentModalRef = this.modalService.open(ConfirmationComponent, { windowClass: 'bst_modal alert-card-modal entity-identification-modal light-theme confirmMe' });
    currentModalRef.componentInstance.emitData.subscribe(data => {
      if (data) {
        if (data == 'OK') {
          this.saveEntity();
        }
      }
    });
  }

  tab2(event, tabName) {
    let jurdictions = (this.currentRowData && this.currentRowData.completeRowData && this.currentRowData.completeRowData.jurisdictions && this.currentRowData.completeRowData.jurisdictions.code) ? this.currentRowData.completeRowData.jurisdictions.code : null;
    this.selectedTabVal = tabName
    if (this.selectedTabVal != "general" && this.entityType != 'person') {
      let newPersonVlaData = JSON.parse(JSON.stringify(this.personsDataVla));
      if (jurdictions) {
        newPersonVlaData['jurisdiction'] = jurdictions;
      }
      if (this.companyVlaData && this.companyVlaData.vertices && this.companyVlaData.edges) {
        this.applyFilters()
      } else {
        this.multiSource(newPersonVlaData, this.vlaRootIndexComp);

      }
    }
    if (this.selectedTabVal != "general" && this.entityType == 'person') {
      this.personVla(this.personsDataVla);
    }
  }

  closeRolesModal() {
    this.rolesModalRef.close();
  }

  validateUserToConfirm(userApproved) {
    let activeUser = GlobalConstants.systemSettings.ehubObject['userId'];
    if (userApproved && userApproved.userId == activeUser) {
      this.allowUserToChangeReview = false;
    }
  }
  entityIdentification() {
    if (this.currentRowData && this.currentRowData.completeRowData) {
      let completeRowData = (this.currentRowData && this.currentRowData.completeRowData) ? this.currentRowData.completeRowData : null;
      this.reviewerStatusList = this.currentRowData.reviewerStatusList
      this.currentAlertStatus = (this.currentRowData.completeRowData.statuse && this.currentRowData.completeRowData.statuse.code) ? this.currentRowData.completeRowData.statuse.code.toLowerCase() : "";
      this.reviewStatus = (this.currentRowData.completeRowData.reviewStatusId && this.currentRowData.completeRowData.reviewStatusId.code) ? this.currentRowData.completeRowData.reviewStatusId.code.toLowerCase() : "";
      this.reviewerStatusColor = this.reviewerStatusColors[this.reviewStatus];
      this.entityType = (completeRowData && completeRowData['entiType']) ? completeRowData['entiType'] : "";
      this.isEntityIdentified = completeRowData['isEntityIdentified'] ? completeRowData['isEntityIdentified'] : false;
      this.entityDetails['name'] = completeRowData.entityName ? completeRowData.entityName : "";
      this.entityDetails['type-icon'] = (this.entityType && typeof this.entityType == 'string' && this.entityType.trim().toLowerCase() == "person") ? "person" : "business";
      this.validateUserToConfirm(this.currentRowData.userApproved);
      if (completeRowData.alertMetaData) {
        if (Object.keys(JSON.parse(completeRowData.alertMetaData)).indexOf('Result') == -1) {

          this.alertMetaData = JSON.parse(completeRowData.alertMetaData);
        }
        else {
          this.alertMetaData = JSON.parse(completeRowData.alertMetaData)['Result'];
        }
        this.alertMetaData.tenantName = completeRowData.tenantName !=="N/A" ? completeRowData.tenantName : undefined
        this.attributesKeys = (this.alertMetaData && this.alertMetaData.results) ? Object.keys(this.alertMetaData.results) : [];


        this.attributesKeysOriginal = JSON.parse(JSON.stringify(this.attributesKeys));


        this.attributes = (this.alertMetaData && this.alertMetaData.results) ? this.alertMetaData.results : {};
        let makeSingleValueInSource = (obj) => {
          let sourceNames = Object.keys(obj);

          sourceNames.forEach((sourceName) => {
            obj[sourceName] = [this.maxCredibilityFromArray(obj[sourceName])];
          })
          return obj;
        }
        let concatValueBySource = (attributes) => {
          attributes.forEach((attribute) => {
            attribute = makeSingleValueInSource(attribute);
          })
          let FinalObj = {};

          attributes.forEach((attribute) => {
            let sources = Object.keys(attribute);

            sources.forEach((source) => {
              if (FinalObj.hasOwnProperty(source)) {
                if (FinalObj[source][0]['credibility'] == attribute[source][0]['credibility']) {
                  if (Array.isArray(FinalObj[source][0]['value'])) {
                    FinalObj[source][0]['value'] = FinalObj[source][0]['value'].concat(attribute[source][0]['value']);
                  }
                  else {
                    FinalObj[source][0]['value'] = FinalObj[source][0]['value'] + attribute[source][0]['value'];
                  }
                }
                else if (FinalObj[source][0]['credibility'] < attribute[source][0]['credibility']) {
                  FinalObj[source] = attribute[source];
                }
              }
              else {
                FinalObj[source] = attribute[source];
              }
            })
          });
          return FinalObj;
        }
        let attributesPassToConcate = [];
        if (this.attributes['aka']) {
          attributesPassToConcate.push(this.attributes['aka']);
          delete this.attributes['aka'];
        }
        if (this.attributes['alternative_names']) {
          attributesPassToConcate.push(this.attributes['alternative_names']);
          delete this.attributes['alternative_names'];
        }
        if (this.attributes['spelling']) {
          attributesPassToConcate.push(this.attributes['spelling']);
          delete this.attributes['spelling'];
        }
        if (this.attributes['additional_name']) {
          attributesPassToConcate.push(this.attributes['additional_name']);
          delete this.attributes['additional_name'];
        }
        if (this.attributes['low_quality_aka']) {
          attributesPassToConcate.push(this.attributes['low_quality_aka']);
          delete this.attributes['low_quality_aka'];
        }
        if (this.attributes['formerly_name_as']) {
          attributesPassToConcate.push(this.attributes['formerly_name_as']);
          delete this.attributes['formerly_name_as'];
        }
        if (this.attributes['expand_language_variation']) {
          attributesPassToConcate.push(this.attributes['expand_language_variation']);
          delete this.attributes['expand_language_variation'];
        }
        if (attributesPassToConcate.length > 0) {
          this.attributes['alternative_names'] = concatValueBySource(attributesPassToConcate);
        }

        let needsMerge = [];
        if (this.attributes['first_name']) {
          needsMerge.push(this.attributes['first_name'])
        }
        if (this.attributes['middle_name']) {
          needsMerge.push(this.attributes['middle_name'])
        }
        if (needsMerge.length > 0) {
          this.attributes['given_name'] = concatValueBySource(needsMerge);
          delete this.attributes['middle_name'];
          delete this.attributes['first_name'];
        }
        if (!this.attributes['family_name']) {
          if (this.attributes['last_name']) {
            this.attributes['family_name'] = this.attributes['last_name'];
            delete this.attributes['last_name'];
          }
        }

        if (!this.attributes['nationality']) {
          if (this.attributes['country_citizenship']) {
            this.attributes['nationality'] = Array.isArray(this.attributes['country_citizenship']) ? this.attributes['country_citizenship'] : [this.attributes['country_citizenship']];
            delete this.attributes['country_citizenship'];
          }
        }

        this.attributesKeys = (this.alertMetaData && this.alertMetaData.results) ? Object.keys(this.alertMetaData.results) : [];
        this.attributesKeysOriginal = JSON.parse(JSON.stringify(this.attributesKeys));
        this.attributes = (this.alertMetaData && this.alertMetaData.results) ? this.alertMetaData.results : {};
        if (this.attributes && this.attributes['identifiers']) {
          var other_company_id_number = {};
          for (const source in this.attributes['identifiers']) {
            this.attributes['identifiers'][source].forEach((val) => {
              if (val && val.value && val.value['other_company_id_number']) {
                if (!other_company_id_number[source]) {
                  other_company_id_number[source] = [];
                }
                other_company_id_number[source].push(
                  {
                    credibility: val.credibility,
                    source_url: val.source_url,
                    value: val.value.other_company_id_number
                  }
                )
                delete val.value.other_company_id_number
              }
            })
          }
          if (other_company_id_number && Object.keys(other_company_id_number).length > 0) {
            this.attributes['Internal_identifier'] = other_company_id_number;
            this.attributesKeys.push('Internal_identifier')
            this.attributesKeysOriginal.push('Internal_identifier')
          }
        }
        this.selectedSource = this.maxCredibilitySourceOfAttributes(this.attributes);
        this.ReviewEntityName = this.alertMetaData ? this.alertMetaData.name : "";

        const byUniqId = (uniqIds: Array<string>) => {
          return (item) => {
            if (uniqIds.indexOf(item.basic_info.id) === -1) {
              uniqIds.push(item.basic_info.id);
              return true;
            } else {
              return false;
            }
          }
        }
        const byConfidence = (a, b) => {
            if (b.confidence > a.confidence) return 1;
            if (b.confidence < a.confidence) return -1;
            return a.basic_info.id - b.basic_info.id;
        }
        const watchlistsExists = this.alertMetaData && this.alertMetaData.results && this.alertMetaData.results.screening && this.alertMetaData.results.screening.watchlists;
        this.watchlistData = watchlistsExists ? this.alertMetaData.results.screening.watchlists.filter(byUniqId([])).sort(byConfidence) : [];
        this.personsDataVla = this.alertMetaData ? this.alertMetaData : {};
        this.showReviewerIcon = this.currentRowData && this.currentRowData.showReviewerIcon ? this.currentRowData.showReviewerIcon : false;
        if (this.currentAlertStatus == 'identity approved, needed review' || this.currentAlertStatus == 'identity rejected, needed review') {
          this.watchlistData.forEach((watchList, index) => {
            if (watchList && watchList['basic_info'] && watchList['basic_info']['id'] && watchList['basic_info']['id'].toString() == completeRowData.identifiedEntityId) {
              this.selectedWatchListIndex = index;
              return;
            } else {
              this.selectedWatchListIndex = 0;
            }
          })
        }
        else {
          this.selectedWatchListIndex = 0;
        }
        this.isIndexSelected = true;
      }
    }
  }

  formatAttributeDetailsArray() {
    this.attributesDetails = [];
    let selectedSourceForToolTipIndex = (arr) => {
      let selected: any = 0;
      arr.forEach((item, index) => {
        if (item.value.selected) {
          selected = index;
        }
      });
      return selected;
    }
    let PersonValueFormatter = (attribute, value) => {
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
          return this.PersonSchema.identifiers(value);
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
        default:
          return this.PersonSchema.default(value);
          break;
      }
    }

    let organizationValueFormatter = (attribute, value, isToolTip: any = false) => {
      switch (attribute.toLowerCase().trim()) {
        case 'legal_type':
          return this.OrganisationSchema.legal_type(value);
          break;
        case 'business_classifier':
          return this.OrganisationSchema.business_classifier(value);
          break;
        case 'identifier':
          if (isToolTip) {
            return this.OrganisationSchema.identifierToolTip(value);
          }
          return this.OrganisationSchema.identifier(value);
          break;
        case 'identifiers':
          if (isToolTip) {
            return this.OrganisationSchema.identifierToolTip(value);
          }
          return this.OrganisationSchema.identifier(value);
          break;
        case 'stock_info':
          return this.OrganisationSchema.stockInfo(value);
          break;
        case 'address':
          return this.OrganisationSchema.address(value);
          break;
        case '_links':
          return this.OrganisationSchema.links(value);
          break;
        default:
          return this.OrganisationSchema.default(value);
      }
    }
    let AttributeNameMapper = (attribute) => {
      if ((this.entityType && this.entityType.toLowerCase() == 'person')) {
        if (this.attributesDisplayNameMapping.person && this.attributesDisplayNameMapping.person[attribute]) {
          return this.attributesDisplayNameMapping.person[attribute];
        }
        else {
          return this.formatAttribute(attribute);
        }
      }
      else {
        if (this.attributesDisplayNameMapping.Organization && this.attributesDisplayNameMapping.Organization[attribute]) {
          return this.attributesDisplayNameMapping.Organization[attribute];
        }
        else {
          return this.formatAttribute(attribute);
        }
      }
    }

    let formatWatchInformation = (attribute, value) => {
      if (typeof value == "string") {
        return value;
      }
      else if (Array.isArray(value) && this.simpleArrayFormatter(value)) {
        return this.simpleArrayFormatter(value);
      }
      else if (this.entityType && this.entityType.toLowerCase() == 'person') {
        return PersonValueFormatter(attribute, value);
      }
      else {
        return organizationValueFormatter(attribute, value);
      }

    }
    let allAttributes = [];

    this.attributesKeys.forEach((attribute) => {
      if (this.invalidAttributes.indexOf(attribute) == -1 && this.isValidRow(attribute, this.maxCredibilityValue(this.attributes[attribute]), this.currentWatchListData[attribute]['attribute_value'])) {
        let maxCredibilityValue;
        let newAttribute: any = {};
        newAttribute.name = this.formatAttribute(attribute);
        newAttribute.displayName = AttributeNameMapper(attribute);
        maxCredibilityValue = this.maxCredibilityValue(this.attributes[attribute]);
        if (this.entityType && this.entityType.toLowerCase() == 'person') {
          newAttribute.recordedValue = PersonValueFormatter(attribute, maxCredibilityValue);
        }
        else {
          newAttribute.recordedValue = organizationValueFormatter(attribute, maxCredibilityValue);
        }
        newAttribute.sourcesListForToolTip = [];
        newAttribute.noOfSources = this.returnNoOfSources(this.attributes[attribute]);
        newAttribute.getConfidencePercentage = 0;
        newAttribute.sourcesListForToolTip = this.getAttributeSources(this.attributes[attribute]);

        if (newAttribute.sourcesListForToolTip && newAttribute.sourcesListForToolTip.length > 0) {
          let seletedSourceIndex = selectedSourceForToolTipIndex(newAttribute.sourcesListForToolTip);
          let seletedSource = newAttribute.sourcesListForToolTip[seletedSourceIndex];
          newAttribute.sourcesListForToolTip.splice(seletedSourceIndex, 1);
          newAttribute.sourcesListForToolTip.unshift(seletedSource);
        }

        if (newAttribute.sourcesListForToolTip && Array.isArray(newAttribute.sourcesListForToolTip)) {
          newAttribute.sourcesListForToolTip.forEach((source) => {
            if (this.entityType && this.entityType.toLowerCase() == 'person') {
              source.displayValue = PersonValueFormatter(attribute, source.value.value)
            }
            else {
              source.displayValue = organizationValueFormatter(attribute, source.value.value, 'tooltip');
            }
          });
        }
        newAttribute.showMatchInfo = this.isRecordInfoHasData(this.currentWatchListData[attribute]['attribute_value']);
        newAttribute.showConfidenceBadge = false;
        if (newAttribute.showMatchInfo || true) {
          newAttribute.showConfidenceBadge = this.currentWatchListData[attribute]['confidence'] >= 0 && this.currentWatchListData[attribute]['confidence'] <= 100 && this.AttributesWithBadges.indexOf(attribute) != -1;
          newAttribute.matchInfo = formatWatchInformation(attribute, this.currentWatchListData[attribute]['attribute_value']);
          newAttribute.matcher = attribute == "primary_name" ? this.currentWatchListData[attribute]['matching_strategy']:this.currentWatchListData[attribute]['matcher'] ? this.currentWatchListData[attribute]['matcher'].charAt(0).toUpperCase() + this.currentWatchListData[attribute]['matcher'].slice(1): "";
          if (moment(newAttribute.matchInfo).isValid()) {
            newAttribute.isDate = true;
          } else {
            newAttribute.isDate = false;
          }
        }
        newAttribute.confidenceBadgeClass = 0;
        newAttribute.confidenceBadgeIcon = 0;
        newAttribute.confidencePercentage = 0;
        newAttribute.showBadgeValue = '';
        if (newAttribute.showConfidenceBadge) {
          if (this.currentWatchListData[attribute]['confidence'] >= 0) {
            newAttribute.confidencePercentage = this.currentWatchListData[attribute]['confidence'];
            if (newAttribute.confidencePercentage == 100) {
              newAttribute.confidenceBadgeClass = 'badge-success';
              newAttribute.confidenceBadgeIcon = 'drag_handle';
            }
            else if (newAttribute.confidencePercentage >= 80 && newAttribute.confidencePercentage < 100) {
              newAttribute.confidenceBadgeClass = 'badge-warning';
              newAttribute.confidenceBadgeIcon = '~';
            }
            else {
              newAttribute.confidenceBadgeClass = 'badge-danger ';
              newAttribute.confidenceBadgeIcon = 'close';
            }
          }
        }
        newAttribute.attributeValues = [];
        newAttribute.attributeValues = this.currentWatchListData[attribute] && this.currentWatchListData[attribute].attribute_value

          ? (typeof this.currentWatchListData[attribute].attribute_value === 'string' ? [this.currentWatchListData[attribute].attribute_value] : this.currentWatchListData[attribute].attribute_value) : []
        if (newAttribute.attributeValues && newAttribute.attributeValues.length > 0) {
          let flat = newAttribute.attributeValues.flat();
          newAttribute.attributeValues = flat.filter((v, i, a) => a.indexOf(v) === i);
        } else if (attribute.toLowerCase().trim() !== "identifiers" && typeof newAttribute.attributeValues && typeof newAttribute.attributeValues === 'object') {
          newAttribute.attributeValues = this.makeRecurrsiveObject(newAttribute.attributeValues);
        }
        newAttribute.setvalue = this.currentWatchListData[attribute].setvalue && typeof this.currentWatchListData[attribute].setvalue == 'string' ? this.currentWatchListData[attribute].setvalue :
          Array.isArray(this.currentWatchListData[attribute].setvalue) && this.currentWatchListData[attribute].setvalue.length > 0 ? this.currentWatchListData[attribute].setvalue[0] : "";
        if (this.entityType && this.entityType.toLowerCase() == 'person') {
          if (newAttribute.name.toLowerCase().trim() == "name") {
            newAttribute.Level = 1;
          }
          else if (newAttribute.name.toLowerCase().trim() == "honor prefix") {
            newAttribute.Level = 2;
          }
          else if (newAttribute.name.toLowerCase().trim() == "given name") {
            newAttribute.Level = 3;
          }
          else if (newAttribute.name.toLowerCase().trim() == "family name") {
            newAttribute.Level = 4;
          }
          else if (newAttribute.name.toLowerCase().trim() == "aka" || newAttribute.name.toLowerCase().trim() == "alternative_names") {
            newAttribute.Level = 5;
          }
          else if (newAttribute.name.toLowerCase().trim() == "date of birth") {
            newAttribute.Level = 6;
          }
          else if (newAttribute.name.toLowerCase().trim() == "city of birth") {
            newAttribute.Level = 7;
          }
          else if (newAttribute.name.toLowerCase().trim() == "gender") {
            newAttribute.Level = 8;
          }
          else if (newAttribute.name.toLowerCase().trim() == "images") {
            newAttribute.Level = 9;
          }
          else if (newAttribute.name.toLowerCase().trim() == "identifiers") {
            newAttribute.Level = 10;
          }
          else if (newAttribute.name.toLowerCase().trim() == "nationality") {
            newAttribute.Level = 11;
          }
          else if (newAttribute.name.toLowerCase().trim() == "home location") {
            newAttribute.Level = 12;
          }
          else if (newAttribute.name.toLowerCase().trim() == "address") {
            newAttribute.Level = 13;
          }
          else if (newAttribute.name.toLowerCase().trim() == "descriptions") {
            newAttribute.Level = 14;
          }
          else if (newAttribute.name.toLowerCase().trim() == "watchlist record id") {
            newAttribute.Level = 15;
          }
          else if (newAttribute.name.toLowerCase().trim() == "date") {
            newAttribute.Level = 16;
          }
          else if (newAttribute.name.toLowerCase().trim() == "active status") {
            newAttribute.Level = 17;
          }
          else {
            newAttribute.Level = 18;
          }
        }
        else {
          if (newAttribute.name.toLowerCase().trim() == "name") {
            newAttribute.Level = 1;
          }
          else if (newAttribute.name.toLowerCase().trim() == "aka" || newAttribute.name.toLowerCase().trim() == "alternative_names") {
            newAttribute.Level = 2;
          }
          else if (newAttribute.name.toLowerCase().trim() == "date of registration") {
            newAttribute.Level = 3;
          }
          else if (newAttribute.name.toLowerCase().trim() == "address") {
            newAttribute.Level = 4;
          }
          else if (newAttribute.name.toLowerCase().trim() == "place of registration") {
            newAttribute.Level = 5;
          }
          else if (newAttribute.name.toLowerCase().trim() == "business classifier") {
            newAttribute.displayName = "industy type"
            newAttribute.Level = 9;
          }
          else if (newAttribute.name.toLowerCase().trim() == "website") {
            newAttribute.Level = 7;
          }
          else if (newAttribute.name.toLowerCase().trim() == "identifiers") {
            newAttribute.Level = 8;
          }
          else if (newAttribute.name.toLowerCase().trim() == "legal type") {
            newAttribute.Level = 10;
          }
          else if (newAttribute.name.toLowerCase().trim() == "descriptions") {
            newAttribute.Level = 12;
          }
          else if (newAttribute.name.toLowerCase().trim() == "watchlist record id") {
            newAttribute.Level = 13;
          }
          else if (newAttribute.name.toLowerCase().trim() == "date") {
            newAttribute.Level = 14;
          }
          else if (newAttribute.name.toLowerCase().trim() == "active_status") {
            newAttribute.Level = 15;
          }
          else {
            newAttribute.Level = 16;
          }

        }

        newAttribute.watchlistAttrib = this.watchlistAttribs.includes(newAttribute.name.toLowerCase().trim()) ? true : false;
        allAttributes.push(newAttribute)
        allAttributes = allAttributes.sort(function (a, b) { return b.confidencePercentage - a.confidencePercentage });
        allAttributes = allAttributes.sort(function (a, b) {
          var x = a.displayName.toLowerCase();
          var y = b.displayName.toLowerCase();
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        });
        allAttributes = allAttributes.sort(function (a, b) { return a.Level - b.Level });
      }
    });

    allAttributes.forEach((element, index, selfArr) => {
      if (element.name === 'aka' || element.name === 'alternative names') {
        if (this.selectedWatchListIndex !== -1) {
          var object = this.watchlistData[this.selectedWatchListIndex];
          if (object && object.attributes && object.attributes.length > 0) {
            let attributeIndex = object.attributes.findIndex((val) => val.attribute_name == 'name')
            if (attributeIndex !== -1) {
              var propertyExist = object.attributes[attributeIndex].hasOwnProperty('is_primary');
              let primaryValue = object.attributes[attributeIndex]['is_primary'];
              if (propertyExist && (primaryValue === false || (typeof primaryValue == 'string' && primaryValue.toLowerCase() === 'false'))) {
                let findName = selfArr.findIndex(val => val.name == "name")
                if (findName !== -1) {
                  selfArr[findName].setvalue = '';
                  selfArr[findName].showConfidenceBadge = false;
                  element.matcher = selfArr[findName].matcher;
                  selfArr[findName].matcher = '';
                }
                element.confidencePercentage = object.attributes[attributeIndex].confidence;
                if (object.attributes[attributeIndex].confidence == 100) {
                  element.showConfidenceBadge = true;
                  element.setvalue = element.attributeValues[0]
                  element.confidenceBadgeIcon = 'drag_handle';
                  element.confidenceBadgeClass = 'badge-success';
                }
                else if (object.attributes[attributeIndex].confidence >= 80 && object.attributes[attributeIndex].confidence < 100) {
                  element.confidenceBadgeClass = 'badge-warning';
                  element.setvalue = element.attributeValues[0]
                  element.confidenceBadgeIcon = '~';
                  element.showConfidenceBadge = true;
                }
                else {
                  element.confidenceBadgeClass = 'badge-danger ';
                  element.confidenceBadgeIcon = 'close';
                  element.showConfidenceBadge = true;
                }
              }
            }
          }
        }

      }
      if (element.name === 'address') {
        element.attributeValues = this.alertCardUtilityObject.addressAttribute
      }
      if (element.name === 'identifiers') {
        if (typeof element.attributeValues === 'object') {
          var att = []
          for (const [key, value] of Object.entries(element.attributeValues)) {

            att.push((this.capitalize(key.replace(/_/g, " "))) + ' : ' + value)


          }
          element.attributeValues = att;
        }

      }
      if (element.name === "city of birth") {
        if (this.selectedWatchListIndex !== -1) {
          var object = this.watchlistData[this.selectedWatchListIndex];
          if (object && object.attributes && object.attributes.length > 0) {
            let attributeIndex = object.attributes.findIndex((val) => val.attribute_name == 'place_of_birth');
            if (attributeIndex !== -1) {
              let country = object.attributes[attributeIndex] && object.attributes[attributeIndex].attribute_value
                && object.attributes[attributeIndex].attribute_value[0] ? object.attributes[attributeIndex].attribute_value[0] : null;
              if (country && element.attributeValues && element.attributeValues.length > 0) {
                element.attributeValues.sort(function (x, y) {
                  if (x.includes(country) && y.includes(country)) {
                    return 0;
                  }
                  return x.includes(country) ? -1 : y.includes(country) ? 1 : 0;
                });
              }
              element.confidencePercentage = object.attributes[attributeIndex] && object.attributes[attributeIndex].confidence ? object.attributes[attributeIndex].confidence : 0;
              if (object.attributes[attributeIndex].confidence == 1 || object.attributes[attributeIndex].confidence == 100) {
                element.showConfidenceBadge = true;
                element.setvalue = element.attributeValues[0]
                element.confidenceBadgeIcon = 'drag_handle';
                element.confidenceBadgeClass = 'badge-success';
                element.confidencePercentage = 100;
              }
              else if ((object.attributes[attributeIndex].confidence >= 0.8 && object.attributes[attributeIndex].confidence < 1) || (object.attributes[attributeIndex].confidence >= 80 && object.attributes[attributeIndex].confidence < 100)) {
                element.confidenceBadgeClass = 'badge-warning';
                element.setvalue = element.attributeValues[0];
                element.confidenceBadgeIcon = '~';
                element.showConfidenceBadge = true;
                element.confidencePercentage = object.attributes[attributeIndex] && object.attributes[attributeIndex].confidence ? object.attributes[attributeIndex].confidence : 0;
              } else {
                element.showConfidenceBadge = true;
                element.confidenceBadgeClass = 'badge-danger ';
                element.confidenceBadgeIcon = 'close';
              }
            }

          }
        }
      }
    });

    if(allAttributes.findIndex(val => val.name == "alternative names") > 0
    && allAttributes.findIndex(val => val.name == "aka") > 0 ){
      const akaIndex = allAttributes.findIndex(val => val.name == "aka");
      const altIndex= allAttributes.findIndex(val => val.name == "alternative names");
      allAttributes[akaIndex].attributeValues.push(...allAttributes[altIndex].attributeValues);
      allAttributes.splice(altIndex,1);
    }

    if(allAttributes.findIndex(val => val.name == "place of birth") > 0 ){
      const placeOfBirthIndex = allAttributes.findIndex(val => val.name == "place of birth");
      let cityOfBirthIndex = null;
      if(allAttributes.findIndex(val => val.name == "city of birth") > 0 ){
        cityOfBirthIndex = allAttributes.findIndex(val => val.name == "city of birth");
        allAttributes[cityOfBirthIndex].recordedValue = ` ${allAttributes[placeOfBirthIndex].recordedValue}`;
        if(allAttributes[cityOfBirthIndex].sourcesListForToolTip && allAttributes[cityOfBirthIndex].sourcesListForToolTip.length) {
          allAttributes[cityOfBirthIndex].sourcesListForToolTip[0].displayValue += `, ${allAttributes[placeOfBirthIndex].recordedValue}`;
        }
        allAttributes.splice(placeOfBirthIndex,1);
      }
    }

    const capitalizeEachWord = (displayName:String) => {
      return displayName.replace(/\w\S*/g, (txt:string)=> {
          return txt.charAt(0).toUpperCase() + txt.substr(1);
      });
    }

    allAttributes.map((element, index)=>{
      const translatedDisplayName = capitalizeEachWord(element.displayName).replace(/ /g,'');
      if (this.languageJson && this.languageJson[translatedDisplayName]) {
        element.displayName = this.languageJson[translatedDisplayName];
      }
    });

    let selectedAttributesDetails = []
    selectedAttributesDetails = allAttributes.filter(item => item.name !== 'wl ver');
    this.attributesDetails = selectedAttributesDetails.filter(item => item.name !== 'wl id');

    let extra_data = this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex].extra_data;
    extra_data.wl_id = this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex].basic_info.list_id;
    extra_data.wl_ver = this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex].basic_info.watchlist_version;

    // alternative_names
    if (Array.isArray(extra_data.alternative_names)) {
      let alternative_names = []
      for (const resultkey in extra_data.alternative_names) {
        if (extra_data.alternative_names.hasOwnProperty(resultkey)) {
          alternative_names.push({
            alternative_name: extra_data.alternative_names[resultkey]
          })
        }
      }
      extra_data.alternative_names = alternative_names;
    }

    // classification
    if (Array.isArray(extra_data.classification)) {
      let classification_names = []
      for (const resultkey in extra_data.classification) {
        if (extra_data.classification.hasOwnProperty(resultkey)) {
          classification_names.push({
            classification: extra_data.classification[resultkey]
          })
        }
      }
      extra_data.classification = classification_names;
    }

    // categories
    if (Array.isArray(extra_data.categories)) {
      let categorie_names = []
      for (const resultkey in extra_data.categories) {
        if (extra_data.categories.hasOwnProperty(resultkey)) {
          categorie_names.push({
            category: extra_data.categories[resultkey]
          })
        }
      }
      extra_data.categories = categorie_names;
    }

    this.setAttributeDetailsArray(Object.keys(extra_data),extra_data);
  }

  setAttributeDetailsArray(keys , data){
    if(keys.length > 0){
      keys.forEach((value, index)=>{
        if(value === 'watchlistType' || isObject(data[value])){
         this.setAttributeDetailsArray(Object.keys(data[value]), data[value])
        } else if(!isObject(data[value])){
          if (!isNaN(value)) {
            this.attributesDetails.push({
              displayName: "Source link address",
              name: "source_links",
              watchlistAttrib: true,
              showMatchInfo: true,
              attributeValues: [data[value] || 'N/a'],
            });
          } else {
            this.attributesDetails.push({
              displayName: (value.includes("_") ? value.split("_").join(" ") : value.split(/(?=[A-Z])/).join(" ")),
              name: value,
              watchlistAttrib: true,
              showMatchInfo: true,
              attributeValues: [data[value] || 'N/a'],
            });
          }
        }
      })
    }

    this.attributesDetails.forEach(val=>{
      if(val.watchlistAttrib && val.attributeValues.length==0){
        val.attributeValues.push(val.recordedValue);
        val.showMatchInfo = true;
      }
    });
  }

  returnSource(obj, sourceIndex) {
    let keys = Object.keys(obj);


    let source = obj[keys[sourceIndex]];

    return source[0]['value'];
  }
  trackByFn(index, item) {
    return item;
  }
  maxCredibilityValue(obj) {
    if (obj && Object.keys(obj).length > 0) {

      if (obj && obj[this.selectedSource] && Array.isArray(obj[this.selectedSource]) && obj[this.selectedSource].length > 0) {
        let returnValue = this.maxCredibilityFromArray(obj[this.selectedSource])
        returnValue['selected'] = true;
        return returnValue.value;
      }
      else {
        return 'N/A';
      }
    }
    else {
      return 'N/A';
    }

  }
  maxCredibilityObject(obj) {
    let sources = Object.keys(obj);

    let credibility: any;
    let returnValue;
    sources.forEach((source) => {
      obj[source].forEach((list) => {
        if (typeof credibility != 'undefined') {
          if (credibility < list.credibility) {
            returnValue = list;
          }
        }
        else {
          credibility = list.credibility;
          returnValue = list;
        }
      })
    });
    return returnValue;
  }

  maxCredibilityFromArray(arr) {
    let credibility: any;
    let returnValue;
    arr.forEach((list) => {
      if (typeof credibility != 'undefined') {
        if (credibility < list.credibility) {
          credibility = list.credibility;
          returnValue = list;
        }
      }
      else {
        credibility = list.credibility;
        returnValue = list;
      }
    })
    return returnValue
  }

  maxCredibilityFromArray2(arr) {
    let credibility: any;
    let returnValue;
    arr.forEach((list) => {
      if (typeof credibility != 'undefined') {
        if (credibility < list.value.credibility) {
          credibility = list.value.credibility;
          returnValue = list;
        }
      }
      else {
        credibility = list.value.credibility;
        returnValue = list;
      }
    })
    return returnValue
  }

  maxCredibilitySourceOfAttribute(obj) {
    let sources = Object.keys(obj);

    let credibility: any;
    let returnValue;
    sources.forEach((source) => {
      obj[source].forEach((list) => {
        if (typeof credibility != 'undefined') {
          if (credibility < list.credibility) {
            credibility = list.credibility;
            returnValue = { source: source, credibility: credibility };
          }
        }
        else {
          credibility = list.credibility;
          returnValue = { source: source, credibility: credibility };
        }
      });
    });
    return returnValue;
  }
  maxCredibilitySourceOfAttributes(attributes) {
    let returnBestSource = (sources) => {
      let attributeKeys = Object.keys(attributes)


      let sourceWithDefects = {};
      let returnValue;
      sources.forEach((source) => {
        sourceWithDefects[source] = 0;
        attributeKeys.forEach((attribute) => {

          if (this.invalidAttributes.indexOf(attribute) == -1) {
            if (Object.keys(attributes[attribute]).indexOf(source) == -1) {

              sourceWithDefects[source] = sourceWithDefects[source] + 1;
            }
            else if (attributes[attribute][source]) {
              let maxCredibilityValueFromSource = this.maxCredibilityFromArray(attributes[attribute][source]);
              if (!(maxCredibilityValueFromSource && maxCredibilityValueFromSource.value && this.isRecordInfoHasData(maxCredibilityValueFromSource.value))) {
                sourceWithDefects[source] = sourceWithDefects[source] + 1;
              }
            }
          }
        })
      });

      let sourceWithDefectsKeys = Object.keys(sourceWithDefects);


      let sourceWithDefectsValues: number[] = Object.values(sourceWithDefects);
      let leastDefect = 0;
      let min: any = Math.min(...sourceWithDefectsValues)
      return sourceWithDefectsKeys[sourceWithDefectsValues.indexOf(min)];

    }
    let getHighOccuranceValue = (arr) => {
      let tally = (acc, x) => {
        if (!acc[x]) {
          acc[x] = 1;
          return acc;
        }
        acc[x] += 1;
        return acc;
      };
      let totals = arr.reduce(tally, {});
      let keys = Object.keys(totals);


      let values = keys.map(x => totals[x]);

      let results = keys.filter(x => totals[x] === Math.max(...values));

      return returnBestSource(results);
    }
    let sources = [];
    let attributeKeys = Object.keys(attributes)


    let atrributeValues = Object.values(attributes)
    attributeKeys.forEach((attribute) => {

      if (this.invalidAttributes.indexOf(attribute) == -1) {
        sources.push(this.maxCredibilitySourceOfAttribute(attributes[attribute]));
      }
    })
    let credibility = 0;
    for (let i = 0; i < sources.length; i++) {
      if (credibility < sources[i]['credibility']) {
        credibility = sources[i]['credibility'];
      }
    }

    let highCredibleSources = [];
    for (let i = 0; i < sources.length; i++) {
      if (credibility == sources[i]['credibility']) {
        highCredibleSources.push(sources[i]['source']);
      }
    }
    this.maxCredibilitySourceValue = getHighOccuranceValue(highCredibleSources);
    return getHighOccuranceValue(highCredibleSources);
  }

  getAttributeSources(obj) {
    if (obj) {
      let isAnySelected = (arr) => {
        let selected = false;
        arr.forEach((item) => {
          if (item.value.selected) {
            selected = true;
            return true;
          }
        });
        return selected;
      }
      obj = JSON.parse(JSON.stringify(obj));
      let sources = Object.keys(obj);

      sources.forEach((source) => {
        let maxCredibilityObj = this.maxCredibilityFromArray(obj[source]);
        obj[source] = maxCredibilityObj;
      });
      let keys = Object.keys(obj);


      let values = Object.values(obj);
      let arr = [];
      for (let i = 0; i < keys.length; i++) {

        let newObj = {}
        newObj['sourceName'] = keys[i];

        newObj['value'] = values[i];
        arr.push(newObj);
      }

      if (!isAnySelected(arr)) {
        let maxCreadibility = this.maxCredibilityFromArray2(arr);

        for (let i = 0; i < arr.length; i++) {
          let item = arr[i];
          if (maxCreadibility.value.value === item.value.value && maxCreadibility.value.credibility === item.value.credibility) {
            item.value.selected = true;
            break;
          }
        }
      }
      arr = arr.sort(function (a, b) { return b.value.credibility - a.value.credibility });
      return arr;
    }
    else {
      return [];
    }
  }
  returnNoOfSources(obj) {
    let total = 0;
    if (obj && typeof obj == 'object') {
      Object.keys(obj).forEach((source) => {

        if (Array.isArray(obj[source])) {
          if (this.isRecordInfoHasData(this.maxCredibilityFromArray(obj[source]))) {
            total = total + 1;
          }
        }
      });
      return total;
    }
    else {
      return 0;
    }
  }

  makeObjToArray = (obj) => {
    if (obj) {
      let keys = Object.keys(obj);


      let values = Object.values(obj);
      let arr = [];
      keys.forEach((key) => {


        arr[key] = obj[key];


      });
      return arr;
    }
    else {
      return [];
    }
  }
  getSourceOfAttribute(attribute) {
    Object.keys(this.attributes[attribute]);

  }
  setWatchList(index) {
    if (this.watchlistData[index]['basic_info'].hasOwnProperty('primary_name')) {
      this.watchlistData[index]['attributes'].forEach((attribute) => {
        if (attribute['attribute_name'] == "name") {
          attribute['attribute_value'] = this.watchlistData[index]['basic_info']['primary_name'];
        }
      })
    }
    if (this.watchlistData[index]['basic_info'].hasOwnProperty('date_of_birth')) {
      if (typeof this.watchlistData[index]['basic_info']['date_of_birth'] === 'string') {
        this.watchlistData[index]['attributes'].forEach((attribute) => {
          if (typeof attribute['attribute_value'] === 'string') {
            attribute.setvalue = attribute['attribute_value'];
            if (attribute['attribute_name'] == "date_of_birth" && attribute['attribute_value']) {
              var arr = [];
              arr.push(attribute['attribute_value']);
              arr.push(this.watchlistData[index]['basic_info']['date_of_birth'])
              attribute['attribute_value'] = arr;
            }
          }
        })
      } else if (Array.isArray(this.watchlistData[index]['basic_info']['date_of_birth'])) {
        this.watchlistData[index]['attributes'].forEach((attribute) => {
          if (!attribute.isConfigured) {
            attribute.setvalue = attribute['attribute_value'];
            if (attribute['attribute_name'] == "date_of_birth" || attribute['attribute_name'] == "birth_date") {
              var arr = [];
              if (attribute['attribute_name'] == "date_of_birth") {
                arr = [attribute['attribute_value']].concat(this.watchlistData[index]['basic_info']['date_of_birth'])
              } else {
                arr = [attribute['attribute_value']].concat(this.watchlistData[index]['basic_info']['date_of_birth'])
              }
              attribute['attribute_value'] = arr;
              attribute.isConfigured = true;
            }
          }
        })
      }

    }
    if (this.watchlistData[index]['basic_info'].hasOwnProperty('aka') || this.watchlistData[index]['basic_info'].hasOwnProperty('alternative_names')) {
      this.watchlistData[index]['attributes'].forEach((attribute) => {
        if (typeof attribute['attribute_value'] === 'string') {
          if (attribute['attribute_name'] == "aka" && attribute['attribute_value']) {
            this.alertCardUtilityObject['aka_matched'] = attribute['attribute_value']
          }
          if (attribute['attribute_name'] == "alternative_names" && attribute['attribute_value']) {
            this.alertCardUtilityObject['aka_matched'] = attribute['attribute_value']
          }
        }
      })
    }
    var alreadyHandled = ['date_of_birth', 'primary_name', 'aka', 'alternative_names'];
    for (const keyname in this.watchlistData[index]['basic_info']) {


      if (alreadyHandled.indexOf(keyname) === -1) {

        this.watchlistData[index]['attributes'].forEach((attribute) => {
          if (typeof attribute['attribute_value'] === 'string') {
            if (attribute['attribute_name'] && attribute['attribute_value']) {
              attribute.setvalue = attribute['attribute_value'];
            }
          } else if (attribute['attribute_name'] && Array.isArray(attribute['attribute_value']) && attribute['attribute_value'].length > 0) {
            attribute.setvalue = attribute['attribute_value'][0];
          }
        })
      }
    }

    if (this.watchlistData && this.watchlistData[index] && this.watchlistData[index] && this.watchlistData[index]['basic_info']) {
      this.watchlistData[index]['basic_info']['watchlist_record_id'] = (this.watchlistData && this.watchlistData[index] && this.watchlistData[index]['basic_info'] && this.watchlistData[index]['basic_info']['id']) ? this.watchlistData[index]['basic_info']['id'] : "N/A";
    }
    else {
      this.watchlistData[index]['basic_info'] = {};
      this.watchlistData[index]['basic_info']['watchlist_record_id'] = (this.watchlistData && this.watchlistData[index] && this.watchlistData[index]['basic_info'] && this.watchlistData[index]['basic_info']['id']) ? this.watchlistData[index]['basic_info']['id'] : "N/A";
    }

    if (!this.watchlistData[index]['basic_info'].hasOwnProperty('family_name')) {
      if (this.watchlistData[index]['basic_info'].hasOwnProperty('last_name')) {
        this.watchlistData[index]['basic_info']['family_name'] = this.watchlistData[index]['basic_info']['last_name'];
      }
    }

    if (!this.watchlistData[index]['basic_info'].hasOwnProperty('nationality')) {
      if (this.watchlistData[index]['basic_info'].hasOwnProperty('country_citizenship')) {
        this.watchlistData[index]['basic_info']['nationality'] = Array.isArray(this.watchlistData[index]['basic_info']['country_citizenship']) ? this.watchlistData[index]['basic_info']['country_citizenship'] : [this.watchlistData[index]['basic_info']['country_citizenship']];
        delete this.watchlistData[index]['basic_info']['country_citizenship'];
      }
    }

    let hasfamilyName = false;
    this.watchlistData[index]['attributes'].forEach((attribute, index) => {
      if (attribute['attribute_name'] == "family_name") {
        hasfamilyName = true;
        return true;
      }
    });
    if (!hasfamilyName) {
      this.watchlistData[index]['attributes'].forEach((attribute, index) => {
        if (attribute['attribute_name'] == "last_name") {
          attribute['attribute_name'] == "family_name"
          return true;
        }
      });
    }
    let mergeWLmainAttibutes = (MergeAttributes, valueType, newAttributeName) => {
      let isNeeded = false;
      let finalValue;
      if (valueType == "array") {
        finalValue = [];
      }
      else {
        finalValue = "";
      }
      this.watchlistData[index]['attributes'].forEach((attribute) => {
        if (MergeAttributes.indexOf(attribute['attribute_name']) != -1) {
          isNeeded = true;
          return true;
        }
      });
      if (isNeeded) {
        this.watchlistData[index]['attributes'].forEach((attribute, loopIndex) => {
          if (MergeAttributes.indexOf(attribute['attribute_name']) != -1) {
            if (valueType == "array") {
              finalValue = finalValue.concat(attribute['attribute_value']);
            }
            else {
              finalValue = finalValue + " " + attribute['attribute_value'];
            }
          }
        });
        this.watchlistData[index]['attributes'].push({
          "attribute_name": newAttributeName,
          "attribute_value": finalValue,
          "matcher": null,
        })
      }
    }
    let MergeAttributes = ["aka", "alternative_names", "spelling", "additional_name", "low_quality_aka", "formerly_name_as", "expand_language_variation"]
    let valueType = "array";
    let newAttributeName = "alternative_names";
    mergeWLmainAttibutes(MergeAttributes, valueType, newAttributeName);

    let hasNationality = false;
    this.watchlistData[index]['attributes'].forEach((attribute, index) => {
      if (attribute['attribute_name'] == "nationality") {
        hasNationality = true;
        return true;
      }
    });
    if (!hasNationality) {
      this.watchlistData[index]['attributes'].forEach((attribute, index) => {
        if (attribute['attribute_name'] == "country_citizenship") {
          attribute['attribute_name'] == "nationality"
          return true;
        }
      });
    }

    if (this.watchlistData && this.watchlistData[index] && this.watchlistData[index] && this.watchlistData[index]['basic_info'] && (this.watchlistData[index]['basic_info']['aka'] || this.watchlistData[index]['basic_info']['alternative_names'] || this.watchlistData[index]['basic_info']['spelling'] || this.watchlistData[index]['basic_info']['additional_name'])) {
      if (!this.watchlistData[index]['basic_info']['alternative_names']) {
        this.watchlistData[index]['basic_info']['alternative_names'] = [];
      }
      if (!this.watchlistData[index]['basic_info']['additional_name']) {
        this.watchlistData[index]['basic_info']['additional_name'] = [];
      }
      if (!this.watchlistData[index]['basic_info']['spelling']) {
        this.watchlistData[index]['basic_info']['spelling'] = [];
      }
      if (!this.watchlistData[index]['basic_info']['low_quality_aka']) {
        this.watchlistData[index]['basic_info']['low_quality_aka'] = [];
      }
      if (!this.watchlistData[index]['basic_info']['formerly_name_as']) {
        this.watchlistData[index]['basic_info']['formerly_name_as'] = [];
      }
      if (!this.watchlistData[index]['basic_info']['expand_language_variation']) {
        this.watchlistData[index]['basic_info']['expand_language_variation'] = [];
      }
      this.watchlistData[index]['basic_info']['alternative_names'] = this.watchlistData[index]['basic_info']['alternative_names'].concat(this.watchlistData[index]['basic_info']['spelling']);
      this.watchlistData[index]['basic_info']['alternative_names'] = this.watchlistData[index]['basic_info']['alternative_names'].concat(this.watchlistData[index]['basic_info']['additional_name']);
      this.watchlistData[index]['basic_info']['alternative_names'] = this.watchlistData[index]['basic_info']['alternative_names'].concat(this.watchlistData[index]['basic_info']['low_quality_aka']);
      this.watchlistData[index]['basic_info']['alternative_names'] = this.watchlistData[index]['basic_info']['alternative_names'].concat(this.watchlistData[index]['basic_info']['formerly_name_as']);
      this.watchlistData[index]['basic_info']['alternative_names'] = this.watchlistData[index]['basic_info']['alternative_names'].concat(this.watchlistData[index]['basic_info']['expand_language_variation']);

      delete this.watchlistData[index]['basic_info']['spelling'];
      delete this.watchlistData[index]['basic_info']['additional_name'];
      delete this.watchlistData[index]['basic_info']['low_quality_aka'];
      delete this.watchlistData[index]['basic_info']['formerly_name_as'];
      delete this.watchlistData[index]['basic_info']['expand_language_variation'];
    }

    if (this.watchlistData[index]['basic_info']['first_name'] || this.watchlistData[index]['basic_info']['middle_name']) {
      this.watchlistData[index]['basic_info']['given_name'] = "";
      if (this.watchlistData[index]['basic_info']['first_name']) {
        this.watchlistData[index]['basic_info']['given_name'] = this.watchlistData[index]['basic_info']['first_name'];
      }
      if (this.watchlistData[index]['basic_info']['middle_name']) {
        this.watchlistData[index]['basic_info']['given_name'] = this.watchlistData[index]['basic_info']['given_name'] + " " + this.watchlistData[index]['basic_info']['middle_name'];
        delete this.watchlistData[index]['basic_info']['middle_name'];
      }
    }

    let needGivenName = false;
    this.watchlistData[index]['attributes'].forEach((attribute) => {
      if (attribute['attribute_name'] == "first_name" || attribute['attribute_name'] == "middle_name") {
        needGivenName = true;
        return true;
      }
    });
    if (needGivenName) {
      let givenName = "";
      let firstNameIndex = -1;
      let middleNameIndex = -1;
      this.watchlistData[index]['attributes'].forEach((attribute, index) => {
        if (attribute['attribute_name'] == "first_name" || attribute['attribute_name'] == "middle_name") {
          givenName = givenName + " " + attribute['attribute_value'];
          firstNameIndex = index;
        }
      });
      this.watchlistData[index]['attributes'].forEach((attribute, index) => {
        if (attribute['attribute_name'] == "middle_name") {
          givenName = givenName + " " + attribute['attribute_value'];
          middleNameIndex = index;
        }
      });
      if (middleNameIndex != -1) {
        this.watchlistData[index]['attributes'].splice(middleNameIndex, 1)
      }
      if (firstNameIndex != -1) {
        this.watchlistData[index]['attributes'].splice(firstNameIndex, 1)
      }
      this.watchlistData[index]['attributes'].push({
        "attribute_name": "given_name",
        "attribute_value": givenName,
        "matcher": null,
      })
    }

    this.attributesKeys = JSON.parse(JSON.stringify(this.attributesKeysOriginal));

    this.watchlistData[index].basic_info.name = (this.watchlistData && this.watchlistData[index] && this.watchlistData[index]['basic_info'] && this.watchlistData[index]['basic_info'].primary_name) ? this.watchlistData[index]['basic_info'].primary_name : '';

    let EntriesAttributesTemp = (this.watchlistData && this.watchlistData[index] && this.watchlistData[index] && this.watchlistData[index]['attributes']) ? this.watchlistData[index]['attributes'] : [];
    let EntriesAttributesBasicInfo = (this.watchlistData && this.watchlistData[index] && this.watchlistData[index] && this.watchlistData[index]['basic_info']) ? this.watchlistData[index]['basic_info'] : {};
    EntriesAttributesBasicInfo["descriptions"]=(this.watchlistData && this.watchlistData[index] && this.watchlistData[index] && this.watchlistData[index]['extra_data'] && this.watchlistData[index]['extra_data']["classification"])?this.watchlistData[index]["extra_data"]["classification"][0]:"";
    let EntriesAttributesBasicInfoKeys = Object.keys(EntriesAttributesBasicInfo);



    this.AttributesWithBadges = [];
    EntriesAttributesTemp.forEach((attribute) => {
      if (this.attributesKeys.indexOf(attribute['attribute_name']) == -1 && attribute.attribute_name !== 'place_of_birth') {

        this.attributesKeys.push(attribute['attribute_name']);

      }
      this.AttributesWithBadges.push(attribute['attribute_name']);
    });

    let validKeysFromBasicInfo = [];
    EntriesAttributesBasicInfoKeys.forEach((attribute) => {

      if (this.validKeysFromBasicInfo.Person.indexOf(attribute) != -1 || this.validKeysFromBasicInfo.Organization.indexOf(attribute) != -1) {


        if (this.attributesKeys.indexOf(attribute) == -1 && (EntriesAttributesBasicInfo[attribute])) {

          this.attributesKeys.push(attribute);

          validKeysFromBasicInfo.push(attribute);

        }
      }
    })

    let watchlistAttributes = [];
    EntriesAttributesTemp.forEach((attr) => {
      if (attr.attribute_name) {
        watchlistAttributes[attr.attribute_name] = attr
      }
    });
    this.currentWatchListData = [];
    this.attributesKeys.forEach((value) => {

      if (this.invalidAttributes.indexOf(value) == -1) {
        if (watchlistAttributes[value]) {
          this.currentWatchListData[value] = watchlistAttributes[value];
          if (this.currentWatchListData[value] && this.currentWatchListData[value]['confidence'] >= 0) {
            this.currentWatchListData[value]['confidence'] = this.getConfidencePercentage(this.currentWatchListData[value]['confidence'])
          }
        }
        else if (EntriesAttributesBasicInfoKeys.indexOf(value) != -1) {

          this.currentWatchListData[value] = { attribute_value: this.isRecordInfoHasData(EntriesAttributesBasicInfo[value]) ? EntriesAttributesBasicInfo[value] : null, confidence: null, matcher: null };
          validKeysFromBasicInfo.push(value);

        }
        else {
          this.currentWatchListData[value] = { attribute_value: null, confidence: null, matcher: null };
        }
      }
    });
    this.basic_info_keys = validKeysFromBasicInfo;


    this.formatAttributeDetailsArray();
  }

  isRecordInfoHasData(value) {
    if (value && value != 'N/A') {
      if (typeof value == 'string' && value.trim().length > 0) {
        return true;
      }
      else if (Array.isArray(value) && value.length > 0) {
        return true;
      }
      else if (typeof value == 'object' && Object.values(value).length > 0) {
        return true;
      }
      else {
        false;
      }
    }
    else {
      return false;
    }
  }
  getConfidencePercentage(num) {
    if (num && num <= 1) {
      num = parseFloat(num) * 100
      return num.toFixed(2);
    }
    return num;
  }
  getClassifications(entriesObj) {
    let classifications = [];
    entriesObj.forEach(element => {
      if (element.classification instanceof Array) {
        classifications.concat(element.classification);
      } else {
        classifications.push(element.classification);
      }
    });
    return classifications;
  }
  approve: any;
  approveStaus: boolean;
  appoveConfirm(event) {
    if (event === 'OK') {
      this.saveEntity();
    } else {
      this.closeModal();
    }
  }
  saveEntity() {
    var jurisdiction = this.getRowDataOnClick.completeRowData.jurisdictions && this.getRowDataOnClick.completeRowData.jurisdictions.code ? this.getRowDataOnClick.completeRowData.jurisdictions.code : '';
    this.alert_entityId = this.alertMetaData.name && jurisdiction ? this.hashCode(this.alertMetaData.name + jurisdiction)
      : this.hashCode(this.alertMetaData.name);
    this.alert_entityId = this.alert_entityId.replace(/[^a-zA-Z0-9 ]/g, "");

    let statusApproved: any = null;
    if(this.newcurrentState){
      statusApproved = this.newcurrentState;
    }else{
    this.currentRowData.status.value.forEach((status) => {
      if (status.values.code.toLowerCase() == "identity approved") {
        statusApproved = status.values;
      }
    })}

    let place_of_birth = this.get_place_of_registration(this.watchlistData) ? this.get_place_of_registration(this.watchlistData) : this.get_place_of_birth(this.watchlistData);

    let params = [{
      identifiedEntityId: this.watchlistData[this.selectedWatchListIndex]['basic_info']['id'].toString(),
      isEntityIdentified: true,
      classification: this.getClassifications(this.watchlistData[this.selectedWatchListIndex]['entries']),
      source: this.alertMetaData['screening_type'],
      asignee: (this.getRowDataOnClick.completeRowData.asignee) ? this.getRowDataOnClick.completeRowData.asignee : {},
      statuse: statusApproved,
      alertId: this.getRowDataOnClick.completeRowData.alertId,
      reviewRequired: this.getRowDataOnClick.reviewRequired,
      jurisdiction: place_of_birth
    }]

    let hash_jurisdiction = this.getRowDataOnClick.completeRowData.jurisdictions && this.getRowDataOnClick.completeRowData.jurisdictions.code ? this.getRowDataOnClick.completeRowData.jurisdictions.code : place_of_birth;
    var second_watchlist_name = (this.watchlistData[this.selectedWatchListIndex] && this.watchlistData[this.selectedWatchListIndex].basic_info && this.watchlistData[this.selectedWatchListIndex].basic_info.name ? this.watchlistData[this.selectedWatchListIndex].basic_info.name : '');
    var hashCodeName = second_watchlist_name + this.alertMetaData.name;
    var firstname_person = this.watchlistData[this.selectedWatchListIndex] && this.watchlistData[this.selectedWatchListIndex].basic_info && this.watchlistData[this.selectedWatchListIndex].basic_info.FirstName ? this.watchlistData[this.selectedWatchListIndex].basic_info.FirstName : '';
    var lastname_person = this.watchlistData[this.selectedWatchListIndex] && this.watchlistData[this.selectedWatchListIndex].basic_info && this.watchlistData[this.selectedWatchListIndex].basic_info.lastname ? this.watchlistData[this.selectedWatchListIndex].basic_info.lastname : '';
    var hashCodeNamePerson = hashCodeName ? hashCodeName : (firstname_person + ' ' + lastname_person + this.alertMetaData.name);
    if (this.alertMetaData.entity_type = "person") {
      params[0]['screening_unique_id'] = (hash_jurisdiction) ? (this.hashCode(hashCodeNamePerson + hash_jurisdiction)) : this.hashCode(hashCodeNamePerson);
      params[0]['screening_unique_id'] = params[0]['screening_unique_id'] ? params[0]['screening_unique_id'].replace(/[^a-zA-Z0-9 ]/g, "") : '';
    }
    else {
      params[0]['screening_unique_id'] = (hash_jurisdiction) ? (this.hashCode(hashCodeName + hash_jurisdiction)) : this.hashCode(hashCodeName);
      params[0]['screening_unique_id'] = params[0]['screening_unique_id'] ? params[0]['screening_unique_id'].replace(/[^a-zA-Z0-9 ]/g, "") : '';
    }


    this.nextprev = true;
    this._alertService.updateAlertStatus_new(params).subscribe((response) => {
      if(response && response.ResponseMessage == "Updated successfully"){
        if (!this.alertPopUpByEntity) {
          this.gridApi.refreshInfiniteCache();
          this._sharedServicesService.showFlashMessage(this.getLanguageKey("UpdatedSuccessfully"), 'success');
          this.nextprev = false;
          this.closeModal()
        } else {
          this._sharedServicesService.showFlashMessage(this.getLanguageKey("UpdatedSuccessfully"), 'success');
          this.nextprev = false;
          this.recallGetAlertByCIdAId();
        }
      }else{
        this._sharedServicesService.showFlashMessage(this.getLanguageKey("Errorsoccured"), 'danger');
        this.nextprev = false;
        this.closeModal()
      }
    },(err)=>{
      this._sharedServicesService.showFlashMessage(this.getLanguageKey("Errorsoccured"), 'danger');
      this.nextprev = false;
      this.closeModal()
    })

  }

  recallGetAlertByCIdAId() {
    let newFilterModel = {};
    newFilterModel['customerId'] = {
      'condition1': this.getCustomerIdFilter(this.currentRowData.completeRowData.customerId || this.currentRowData.customerId)
    }
    let requestParams = {
      pageNumber: 1,
      recordsPerPage: 10,
      orderIn: "desc",
      orderBy: "createdDate",
      isAllRequired: false,
    }
    let filterJson = JSON.stringify(newFilterModel);

    if (this.alertPopUpByEntity && this.alertPopUpByEntity === true) {

      this._alertService.getAlertByCIdAId(requestParams, filterJson).subscribe(resp => {
        if (resp && resp.paginationInformation && resp.paginationInformation.totalResults) {
          const selectedObj = resp.result.filter(item => item.alertId === this.currentRowData.alertId);
          this.newStatus = selectedObj[0].statuse.code;
          this.relatedAlertsCount = resp.paginationInformation.totalResults - 1;
          this.currentAlertStatus = selectedObj[0].statuse.code;
          this.getPossibleStates();
        }
      });

    }
  }

  rejectEntity() {
    let rejectId = null;
    this.currentRowData.status.value.forEach((status) => {
      if (status.values.code.toLowerCase() == "identity rejected") {
        rejectId = status.values;
      }
    })
    let params = [{
      classification: this.getClassifications(this.watchlistData[this.selectedWatchListIndex]['entries']),
      source: this.alertMetaData['screening_type'],
      statuse: rejectId,
      alertId: this.getRowDataOnClick.completeRowData.alertId,
      asignee: this.currentRowData.assignee.value[0].values
    }];
    // this._alertService.saveOrUpdateAlerts(params, false).subscribe((response) => {
    //   this.closeModal();
    //   this.gridApi.refreshInfiniteCache();
    // });
  }
  sourcePanelChange(event: any, data) {
    data.primaryOpen = !data.primaryOpen;
  }
  selectedTab(val, selecteddata, index) {
    this.alertCardUtilityObject.langselected = false
    this.entityIdentification();
    this.checkTabSelected = val;
    this.alertCard.alertMetaData.results.screening.selectedData = {};
    this.highlightrow = '';
    this.highlightrow = val + index;
    if (val === 'pep' || val === 'sanction' || (val !== "Adverse Media Articles" && val !== "jurisdiction")) {
      this.setWatchList(0);
      this.alertCard.alertMetaData.results.screening.selectedData = selecteddata;
    } else if (val === "Adverse Media Articles") {
      this.alertUtilityObject.financeSpinner = true;
      this.getsingleArticleDetail(selecteddata);
    } else if (val === "jurisdiction") {
      this.alertCard.alertMetaData.results.screening.selectedData = selecteddata;
    }
    this.alertUtilityObject.financeisfirst = false;
  }
  loadEntity = function (text, entities, entityTypes) {
    var api = '';
    var displacy = new displaCyENT(api, {
      container: '#displacy'
    });

    displacy.render(text, entities, entityTypes);
  };

  reviewerStatusChange(status) {
    var paramsData = {};
    let getStatusWithLabel = (label) => {
      let ReturnStatus: string;
      this.currentRowData.status.value.forEach((status) => {
        if (status.label.toLowerCase() == label.toLowerCase()) {
          ReturnStatus = status.values;
          return;
        }
      });
      return ReturnStatus;
    }
    if (status.toLowerCase() == 'confirmed') {
      if (this.currentAlertStatus == 'approved, needed review') {
        paramsData['statuse'] = getStatusWithLabel("true positive");
      }
      else if (this.currentAlertStatus == 'rejected, needed review') {
        paramsData['statuse'] = getStatusWithLabel("false positive");
      }
    }
    if (status.toLowerCase() == 'declined') {
      if (this.currentAlertStatus == 'approved, needed review') {
        paramsData['statuse'] = getStatusWithLabel("identity approved");
      }
      else if (this.currentAlertStatus == 'rejected, needed review') {
        paramsData['statuse'] = getStatusWithLabel("identity approved");
      }
    }
    this.reviewerStatusColor = this.reviewerStatusColors[status];
    paramsData['alertId'] = this.currentRowData.alertId;
    paramsData["asignee"] = this.currentRowData.assignee.value[0].values;
    paramsData["reviewStatusId"] = this.reviewerStatusList.map((val) => {
      if (val.displayName == status) {
        return val;
      }
    }).filter(v => { return v })[0];
    this._alertService.saveOrUpdateAlerts([paramsData], '').subscribe((res) => {
      this.riskIndicatorsVal = status;
      this.closeModal();
      this.gridApi.refreshInfiniteCache();
    });
  }

  EI_reviewerStatusChange(state) {
    let updateAlertParams: any = {};
    let getStatusWithLabel = (label) => {
      let ReturnStatus: string;
      this.currentRowData.status.value.forEach((status) => {
        if (status.label.toLowerCase() == label.toLowerCase()) {
          ReturnStatus = status.values;
          return;
        }
      });
      return ReturnStatus;
    }
    let getReviewStatusWithCode = (code) => {
      let ReturnStatus: string;
      this.reviewerStatusList.forEach((status) => {
        if (status.code.toLowerCase() == code.toLowerCase()) {
          ReturnStatus = status;
          return;
        }
      });
      return ReturnStatus;
    }
    if (this.currentAlertStatus == 'identity approved, needed review') {
      if (state.toLowerCase() == 'confirmed') {
        updateAlertParams['alertId'] = this.currentRowData.alertId;
        updateAlertParams["asignee"] = this.currentRowData.assignee.value[0].values;
        updateAlertParams.classification = this.watchlistData[this.selectedWatchListIndex]['entries'] ? this.getClassifications(this.watchlistData[this.selectedWatchListIndex]['entries']) : '';
        updateAlertParams.source = this.alertMetaData['screening_type'];
        updateAlertParams.statuse = getStatusWithLabel("identity approved");
        updateAlertParams.isEntityIdentified = true;
        updateAlertParams["reviewStatusId"] = getReviewStatusWithCode(state);
        updateAlertParams.identifiedEntityId = this.watchlistData[this.selectedWatchListIndex]['basic_info']['id'].toString();
      }
      else if (state.toLowerCase() == 'declined') {
        updateAlertParams['statuse'] = getStatusWithLabel("new");
        updateAlertParams['alertId'] = this.getRowDataOnClick.completeRowData.alertId;
        updateAlertParams['asignee'] = this.currentRowData.assignee.value[0].values;
        updateAlertParams['isEntityIdentified'] = false;
      }
    }
    else if (this.currentAlertStatus == 'identity rejected, needed review') {
      if (state.toLowerCase() == 'confirmed') {
        updateAlertParams['alertId'] = this.currentRowData.alertId;
        updateAlertParams["asignee"] = this.currentRowData.assignee.value[0].values;
        updateAlertParams.classification = this.watchlistData[this.selectedWatchListIndex]['entries'] ? this.getClassifications(this.watchlistData[this.selectedWatchListIndex]['entries']) : '';
        updateAlertParams.source = this.alertMetaData['screening_type'];
        updateAlertParams.statuse = getStatusWithLabel("identity rejected");
        updateAlertParams["reviewStatusId"] = getReviewStatusWithCode(state);
      }
      else if (state.toLowerCase() == 'declined') {
        updateAlertParams['statuse'] = getStatusWithLabel("new");
        updateAlertParams["reviewStatusId"] = getReviewStatusWithCode(state);
        updateAlertParams['alertId'] = this.getRowDataOnClick.completeRowData.alertId;
        updateAlertParams['asignee'] = this.currentRowData.assignee.value[0].values;
        updateAlertParams['isEntityIdentified'] = false;
      }
    }

    this._alertService.saveOrUpdateAlerts([updateAlertParams], '').subscribe((response) => {
      if (this.currentAlertStatus == 'identity approved, needed review' && state.toLowerCase() == 'confirmed') {
        this.callSSBOnce()
      }
      this.closeModal();
      this.gridApi.refreshInfiniteCache();
    });
  }

  get_place_of_birth(data = false) {
    if (!data) {
      data = this.alertMetaData.results.screening.watchlists;
    }
    let place_of_birth;
    if (data[this.selectedWatchListIndex] && data[this.selectedWatchListIndex].basic_info && data[this.selectedWatchListIndex].basic_info.city_of_birth) {
      if (Array.isArray(data[this.selectedWatchListIndex].basic_info.city_of_birth) && data[this.selectedWatchListIndex].basic_info.city_of_birth.length > 0) {
        place_of_birth = data[this.selectedWatchListIndex].basic_info.city_of_birth[0];
      }
      else if (typeof data[this.selectedWatchListIndex].basic_info.city_of_birth == "string") {
        place_of_birth = data[this.selectedWatchListIndex].basic_info.city_of_birth;
      }
      else {
        place_of_birth = "";
      }
    }
    else {
      place_of_birth = "";
    }
    return place_of_birth;
  }
  get_place_of_registration(data = false) {
    let place_of_registration;
    if (!data) {
      data = this.alertMetaData.results.screening.watchlists;
    }
    if (data[this.selectedWatchListIndex] && data[this.selectedWatchListIndex].basic_info && data[this.selectedWatchListIndex].basic_info.place_of_registration) {
      if (Array.isArray(data[this.selectedWatchListIndex].basic_info.place_of_registration) && data[this.selectedWatchListIndex].basic_info.place_of_registration.length > 0) {
        place_of_registration = data[this.selectedWatchListIndex].basic_info.place_of_registration[0];
      }
      else if (typeof data[this.selectedWatchListIndex].basic_info.place_of_registration == "string") {
        place_of_registration = data[this.selectedWatchListIndex].basic_info.place_of_registration;
      }
      else {
        place_of_registration = "";
      }
    }
    else {
      place_of_registration = "";
    }
    return place_of_registration;
  }

  callSSBOnce() {
    return;
    let bagEntitiesData = {}
    if (this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex] && this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex].basic_info && this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex].basic_info.id) {
      bagEntitiesData['dj_id'] = this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex].basic_info.id;
    }
    if (this.alertMetaData && this.alertMetaData.entity_id) {
      bagEntitiesData['root_entity_id'] = this.alertMetaData.entity_id;
    }
    if (this.alertMetaData && this.alertMetaData.entity_type) {
      bagEntitiesData['entity_type'] = this.alertMetaData.entity_type;
    }
    if (this.alertMetaData && this.alertMetaData.results && this.alertMetaData.results.mention_id && this.alertMetaData.results.mention_id.core_kb && Array.isArray(this.alertMetaData.results.mention_id.core_kb) && this.alertMetaData.results.mention_id.core_kb[0]['value']) {
      bagEntitiesData['corekb_id'] = this.alertMetaData.results.mention_id.core_kb[0]['value'];
    }
    let caller = (params) => {
      let getJurisdictionfromwatchlist = () => {
        return this.get_place_of_registration();
      }
      let place_of_birth = this.get_place_of_registration() ? this.get_place_of_registration() : this.get_place_of_birth();
      const entity = {
        "entities": [
          {
            "names": [
              this.alertMetaData.name
            ],
            "jurisdiction": this.getRowDataOnClick.completeRowData.jurisdictions && this.getRowDataOnClick.completeRowData.jurisdictions.code ? this.getRowDataOnClick.completeRowData.jurisdictions.code : place_of_birth,
            "entity_id": this.alert_entityId,
          }
        ]
      }
      let data: any = {};
      if (this.alertMetaData.entity_type === "person") {
        data = {
          "person": entity,
          "min_confidence": 0.1,
          "max_responses": 10
        }
      } else {
        data = {
          "organization": entity,
          "min_confidence": 0.1,
          "max_responses": 10
        }
      }
      var second_watchlist_name = (this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex] && this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex].basic_info && this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex].basic_info.name ? this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex].basic_info.name : '');
      var hashCodeName = second_watchlist_name + this.alertMetaData.name;
      var firstname_person = this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex] && this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex].basic_info && this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex].basic_info.FirstName ? this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex].basic_info.FirstName : '';
      var lastname_person = this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex] && this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex].basic_info && this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex].basic_info.lastname ? this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex].basic_info.lastname : '';

      var hashCodeNamePerson = hashCodeName ? hashCodeName : (firstname_person + ' ' + lastname_person + this.alertMetaData.name);
      if (entity && entity.entities && (!entity.entities[0].jurisdiction)) {
        let country = this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex] && this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex].basic_info && this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex].basic_info.country_jurisdiction ? this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex].basic_info.country_jurisdiction : '';
        if (!country) {
          country = this.get_place_of_birth();
        }
        if (!country) {
          country = this.get_place_of_registration();
        }
        if (!country) {
          country = this.alertMetaData.jurisdiction ? this.alertMetaData.jurisdiction : getJurisdictionfromwatchlist();
        }
        if (country && country.length > 2) {
          this._alertService.getJurisdictionbycountryname(country).then((response: any) => {
            entity.entities[0].jurisdiction = response.code;

            if (data.organization && data.organization.entities[0].jurisdiction) {
              this.alert_entityId = (data.organization.entities[0].jurisdiction) ? (this.hashCode(hashCodeName + data.organization.entities[0].jurisdiction)) : this.hashCode(hashCodeName)
              this.alert_entityId = this.alert_entityId.replace(/[^a-zA-Z0-9 ]/g, "");
              data.organization.entities[0].entity_id = this.alert_entityId;
              if (second_watchlist_name) {
                data.organization.entities[0].names.push(second_watchlist_name)
              }
            } else {
              this.alert_entityId = (data.person.entities[0].jurisdiction) ? (this.hashCode(hashCodeNamePerson + data.person.entities[0].jurisdiction)) : this.hashCode(hashCodeNamePerson)
              this.alert_entityId = this.alert_entityId.replace(/[^a-zA-Z0-9 ]/g, "");
              data.person.entities[0].entity_id = this.alert_entityId;
              if (firstname_person || lastname_person) {
                data.person.entities[0].names.push(firstname_person + ' ' + lastname_person);
              }
            }

            params['id'] = this.alert_entityId;
            this._alertService.initiateScreeingBag(params, { "SSB": JSON.stringify(data) }).then().catch()
          }).catch((err) => {

          });
        } else if (country.length === 2) {
          entity.entities[0].jurisdiction = country;

          if (data.organization && data.organization.entities[0].jurisdiction) {
            this.alert_entityId = this.alertMetaData.name && data.organization.entities[0].jurisdiction ? this.hashCode(hashCodeName + data.organization.entities[0].jurisdiction) : this.hashCode(hashCodeName)
            this.alert_entityId = this.alert_entityId.replace(/[^a-zA-Z0-9 ]/g, "");
            data.organization.entities[0].entity_id = this.alert_entityId;
            if (second_watchlist_name) {
              data.organization.entities[0].names.push(second_watchlist_name)
            }
          } else {
            this.alert_entityId = this.alertMetaData.name && data.person.entities[0].jurisdiction ? this.hashCode(hashCodeNamePerson + data.person.entities[0].jurisdiction) : this.hashCode(hashCodeNamePerson)
            this.alert_entityId = this.alert_entityId.replace(/[^a-zA-Z0-9 ]/g, "");
            data.person.entities[0].entity_id = this.alert_entityId;
            if (firstname_person || lastname_person) {
              data.person.entities[0].names.push(firstname_person + ' ' + lastname_person);
            }
          }
          params['id'] = this.alert_entityId;
          this._alertService.initiateScreeingBag(params, { "SSB": JSON.stringify(data) }).then().catch()
        } else {
          if (data.organization) {
            data.organization.entities[0].jurisdiction = 'ANY';
          }
          if (data.person) {
            data.person.entities[0].jurisdiction = 'ANY';
          }
          params['id'] = this.alert_entityId;
          this._alertService.initiateScreeingBag(params, { "SSB": JSON.stringify(data) }).then().catch()
        }
      } else {

        if (data.organization && data.organization.entities[0].jurisdiction) {
          data.organization.entities[0].jurisdiction
          this.alert_entityId = this.alertMetaData.name && data.organization.entities[0].jurisdiction ? this.hashCode(hashCodeName + data.organization.entities[0].jurisdiction) : this.hashCode(hashCodeName);
          this.alert_entityId = this.alert_entityId.replace(/[^a-zA-Z0-9 ]/g, "");
          data.organization.entities[0].entity_id = this.alert_entityId;
          if (second_watchlist_name) {
            data.organization.entities[0].names.push(second_watchlist_name)
          }
        } else {
          this.alert_entityId = this.alertMetaData.name && data.person.entities[0].jurisdiction ? this.hashCode(hashCodeNamePerson + data.person.entities[0].jurisdiction) : this.hashCode(hashCodeNamePerson);
          this.alert_entityId = this.alert_entityId.replace(/[^a-zA-Z0-9 ]/g, "");
          data.person.entities[0].entity_id = this.alert_entityId;
          if (firstname_person || lastname_person) {
            data.person.entities[0].names.push(firstname_person + ' ' + lastname_person);
          }
        }
        params['id'] = this.alert_entityId;
        this._alertService.initiateScreeingBag(params, { "SSB": JSON.stringify(data) }).then().catch()
      }
    }
    caller(bagEntitiesData);
  }
  isArray(value) {
    return Array.isArray(value);
  }
  formatAttribute(attribute) {
    return attribute.replace(/_/g, " ");
  }

  isValidRow(attribute, recordedValue, matchValue) {
    if (recordedValue != "N/A" && this.isRecordInfoHasData(recordedValue)) {
      return true;
    }
    if (matchValue) {
      if (typeof matchValue == "string" && matchValue != "N/A") {
        return true
      }
      if (Array.isArray(matchValue) && matchValue.length > 0) {
        return true
      }
      if (matchValue != "N/A" && this.isRecordInfoHasData(matchValue)) {
        return true;
      }
    }
    if (attribute && this.alertMetaData && this.alertMetaData.results && typeof this.alertMetaData.results == "object") {
      if (this.alertMetaData.results[attribute] && typeof this.alertMetaData.results[attribute] == 'object') {
        if (Object.keys(this.alertMetaData.results[attribute]).length > 0) {

          return true;
        }
      }
    }
    return false;
  }
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

  simpleArrayFormatter(value) {
    let values = [];
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item && typeof item == 'string' && item.trim().length > 0 && values.indexOf(item) == -1) {
            values.push(item)
          }
          else if(typeof item == 'object'){
            let itemKeys = Object.keys(item);
            if(itemKeys.indexOf("first name") != -1){
              values.push(item["first name"])
            }
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
      if (value) {
        let identifiers = [];
        if (Array.isArray(value) && value.length >= 0) {
          value.forEach((item) => {
            let identifiersObj = [];
            if (typeof item == "object" && !Array.isArray(item)) {
              if (item.id_type && typeof item.id_type == "string" && item.id_type.trim().length > 0) {
                identifiersObj.push(item.id_type)
              }
              if (item.id_value && typeof item.id_value == "string" && item.id_value.trim().length > 0) {
                identifiersObj.push(item.id_value);
              }
              identifiers.push(identifiersObj.join(", "));
            }
          });
          return this.simpleArrayFormatter(identifiers);
        }
        else {
          return value;
        }
      }
      else {
        return 'N/A';
      }
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
          this.alertCardUtilityObject.addressAttribute = addresses;
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
  OrganisationSchema = {
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
    business_classifier: (value) => {
      if (Array.isArray(value)) {
        let classifiers = [];
        value.forEach((item) => {
          let returnValue = "";
          if (item.code) {
            returnValue = item.code + " : ";
          }
          if (item.label) {
            returnValue = returnValue + item.label;
          }
          classifiers.push(returnValue)

        })
        return this.simpleArrayFormatter(classifiers);
      }
    },
    address: (value) => {
      if (value) {
        if (Array.isArray(value)) {
          let addresses = [];
          value.forEach((item) => {
            if (typeof item == 'object' && !Array.isArray(item)) {
              let address = [];
              if (item.street_address && typeof item.street_address == "string" && item.street_address.trim().length > 0) {
                address.push(item.street_address)
              }
              if (item.city && typeof item.city == "string" && item.city.trim().length > 0) {
                address.push(item.city)
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
          this.alertCardUtilityObject.addressAttribute = addresses;


          return this.simpleArrayFormatter(addresses);
        }
        if (typeof value == 'object') {
          return JSON.stringify(value);
        }
        return value;
      }
      else {
        return 'N/A';
      }
    },
    identifierToolTip: (value) => {
      return this.simpleJsonFormater(value, ",");
    },
    identifier: (value) => {
      return this.simpleJsonFormater(value, ", <br>");
    },
    stockInfo: (value) => {
      return this.simpleJsonFormater(value);
    },

    default: (value) => {
      if (value) {
        if (typeof (value) == "string") {
          return value;
        }
        else if (Array.isArray(value)) {
          return this.simpleArrayFormatter(value);
        }
        else {
          let result = '';
          if (value.address) {
            for (let key in value.address) {

              result = result + (key + ':' + value.address[key]) + ', '


            }
            return result.slice(0, -2);
          }
          else if (value.overview) {
            for (let key in value.overview) {

              result = result + (key + ':' + value.overview[key]) + ', '


            }
            return result.slice(0, -2);
          }
        }
      }
      else {
        return 'N/A';
      }
    },
    links: (value) => {
      if (value && typeof value == "object") {
        return this.simpleJsonFormater(value);
      }
      else {
        return "N/A";
      }

    }

  }
  multiSource(dataComp, vlaRootIndexComp) {
    this.vlaChartLoader = true;
    let publicCallDone = 0;
    let coreCallDone = 0;
    let publicVlaData = {}
    let coreVlaData = {}
    let jurisdiction = ''
    let companyName = ''
    jurisdiction = dataComp && dataComp.jurisdiction ? dataComp.jurisdiction : '';
    companyName = dataComp && dataComp.name ? dataComp.name : '';

    if (jurisdiction && companyName) {
      let data = {
        query: companyName,
        jurisdiction: jurisdiction
      }
      let multiSourceApi = () => {
        this._alertService.multiSource(data).subscribe((res: any) => {
          if (res && res['is-completed'] && res.hasOwnProperty("is-completed")) {
            if (res && res.results && res.results[0] && res.results[0]['identifier']) {
              let selectEntity = res.results[0]['links']['select-entity']
              if (selectEntity.indexOf('core-kb') <= 0 && selectEntity.indexOf('public') <= 0) {
                this.entityIdentifier = res.results[0]['identifier'];
              }
              this.requestId = res.results[0]['links']['select-entity'].split("organizations/")[1].split("/")[1]
              let coreParam = {}
              let publicParam = {}
              if (selectEntity.indexOf('public') >= 0) {
                this.entityIdentifier = selectEntity.split('public=')[1].split('&')[0]
              }
              publicParam = {
                "identifier": this.entityIdentifier,
                "request_id": this.requestId,
                "jurisdiction": jurisdiction
              }

              if (selectEntity.indexOf('core-kb') >= 0) {
                this.coreKbIdentifier = selectEntity.split('core-kb=')[1].split('&')[0]
                coreParam = {
                  "identifier": this.coreKbIdentifier,
                  "alias": this.entityIdentifier,
                  "screening_core_kb_id": this.alertMetaData && this.alertMetaData.entity_id ? this.alertMetaData.entity_id : ''
                }
              }
              let combineCoreAndPublic = () => {
                if (publicCallDone && coreCallDone) {
                  let vlaData = {}
                  vlaData['edges'] = [];
                  vlaData['root'] = {};
                  vlaData['vertices'] = [];
                  if (coreVlaData && coreVlaData['vertices'] && coreVlaData['vertices'].length) {
                    coreVlaData['vertices'].forEach(element => {
                      element['fromCoreKb'] = '';
                      element['fromCoreKb'] = true;
                    });
                    vlaData['root'] = coreVlaData['root']
                    vlaData['vertices'] = vlaData['vertices'].concat(coreVlaData['vertices']);
                    vlaData['edges'] = vlaData['edges'].concat(coreVlaData['edges']);
                  }
                  if (publicVlaData && publicVlaData['vertices'] && publicVlaData['vertices'].length) {
                    vlaData['root'] = publicVlaData['root']
                    vlaData['vertices'] = vlaData['vertices'].concat(publicVlaData['vertices']);
                    vlaData['edges'] = vlaData['edges'].concat(publicVlaData['edges']);
                  }



                  if (vlaData['vertices'].length) {
                    this.generateIds(vlaData['vertices'], vlaData['root'], vlaData['edges'], dataComp, vlaRootIndexComp)
                  } else {
                    this.vlaChartLoader = false;
                    this.vlaChartDataNotFound = true;
                  }
                }
              }
              let callCore = () => {
                this._alertService.coreKbVlaData(coreParam).then((response: any) => {
                  if (response && response.status && response.message == 'VLA DONE') {
                    coreCallDone = 1;
                    coreVlaData = response.data
                    combineCoreAndPublic()

                  } else if (response && response.status) {
                    setTimeout(() => {
                      callCore()
                    }, 15000);
                  } else {
                    coreCallDone = 1;
                    combineCoreAndPublic()
                    this.vlaChartLoader = false;
                    this.vlaChartDataNotFound = true;
                  }
                }, (err) => {
                  coreCallDone = 1;
                  combineCoreAndPublic()
                })
              }

              let callAgain = () => {
                this._alertService.companyVladata(publicParam).then((response: any) => {
                  if (response && response.status && response.message == 'VLA DONE') {
                    publicCallDone = 1
                    response.data['root']['rootval'] = '';
                    publicVlaData = response.data
                    combineCoreAndPublic()

                  } else if (response && response.status) {
                    setTimeout(() => {
                      callAgain()
                    }, 15000);
                  } else {
                    publicCallDone = 1
                    this.vlaChartLoader = false;
                    this.vlaChartDataNotFound = true;
                  }
                }, (err) => {
                  publicCallDone = 1;
                  combineCoreAndPublic()
                })
              }
              if (this.entityIdentifier) {
                callAgain()
              } else {
                publicCallDone = 1;
                combineCoreAndPublic()
              }
              if (selectEntity.indexOf('core-kb') >= 0) {
                callCore()
              } else {
                coreCallDone = 1;
                combineCoreAndPublic()
              }
            } else {
              this.vlaChartLoader = false;
              this.vlaChartDataNotFound = true;
            }
          } else if (res && !res['is-completed'] && res.hasOwnProperty("is-completed")) {
            setTimeout(() => {
              multiSourceApi()
            }, 15000);
          } else {
            this.vlaChartLoader = false;
            this.vlaChartDataNotFound = true;
          }
        }, (err) => {
          this.vlaChartLoader = false;
          this.vlaChartDataNotFound = true;
        })
      }
      multiSourceApi()
    } else {
      this.vlaChartLoader = false;
      this.vlaChartDataNotFound = true;
    }
  }
  generateIds(vertices, root, edges, datacomp, rootIndex) {

    let mainIndexVal = rootIndex;
    let labels = [];
    vertices.forEach((element) => {
      if ((element.labelV && (element.labelV.toLowerCase() == "branch" || element.labelV.toLowerCase() == "shareholder" || element.labelV.toLowerCase() == "officership" || element.labelV.toLowerCase() == "person" || element.labelV.toLowerCase() == "document")) && !labels.includes(element.labelV)) {
        labels.push(element.labelV)
      }
    });


    let vlaData = {}
    vlaData['edges'] = [];
    vlaData['root'] = [];
    vlaData['vertices'] = [];
    if (rootIndex == 1) {

      root["rootval"] = ''
      root.id = `${rootIndex}`;
      root["rootval"] = "rootva";
      this.rootCompanyVla = root;
    }
    labels.forEach((val) => {
      let eachLabelV = []
      vlaData['edges'].push({ "labelE": val, "from": `${mainIndexVal}`, "id": `${mainIndexVal}:${rootIndex + 1}`, "to": `${rootIndex + 1}` })
      vlaData['root'].push({ "id": `${rootIndex + 1}`, "labelV": val })
      eachLabelV = vertices.filter((value) => value.labelV == val)

      eachLabelV.forEach((dta: any) => {
        let totalPercentage = '';
        dta["actualData"] = '';
        dta["actualData"] = dta.id;
        dta["level"] = '';
        if (dta['labelV'] == 'Branch') {
          if (dta['name'] == '') {
            dta['name'] = dta.properties['vcard:organization-name'] ? dta.properties['vcard:organization-name'] : (dta.properties && dta.properties.basic && dta.properties.basic['vcard:organization-name']) ? dta.properties.basic['vcard:organization-name'] : ''
          }
        }
        edges.forEach(element => {
          if (element.to == dta.id) {
            if (element && element.properties && element.properties.totalPercentage) {
              dta.properties['totalPercentage'] = '';
              dta.properties['totalPercentage'] = element.properties.totalPercentage;
              totalPercentage = element.properties.totalPercentage;
            }
          }
        });
        dta["level"] = this.nodeLevel;
        vlaData['edges'].push({ "labelE": val, "from": `${rootIndex + 1}`, "id": `${rootIndex + 1}:${this.vlaExtendCount + 1}`, "to": `${this.vlaExtendCount + 1}`, 'totalPercentage': totalPercentage });
        dta.id = `${this.vlaExtendCount + 1}`;
        vlaData['vertices'].push(dta);
        this.vlaExtendCount++
      })
      rootIndex++;
    })
    this.userTypeFilters = labels;
    this.userType = labels
    vlaData['root'].forEach((keys) => {

      if (keys.hasOwnProperty('labelV')) {

        vlaData['vertices'].push(keys)

      }
    })
    vlaData['vertices'].push(root)
    this.companyVlaData = vlaData;
    let vlaWithOutDoc = {}
    vlaWithOutDoc['edges'] = []
    vlaWithOutDoc['vertices'] = []
    vlaWithOutDoc['edges'] = vlaData['edges'].filter((val) => { return val.labelE != "Document" })
    vlaWithOutDoc['vertices'] = vlaData['vertices'].filter((val) => { return val.labelV != "Document" })
    this.userType = this.userType.filter((val) => { return val != "Document" })

    setTimeout(() => {
      this.financepgraph(vlaWithOutDoc, "companyVla")
    }, 1000);
  }
  vlaExpand() {

    var data = document.getElementById('multiSource').getAttribute("expandCompany");

    var vlasRoot = JSON.parse(data)

    if (vlasRoot.labelV == "Document" && vlasRoot.properties && vlasRoot.properties.url) {
      this.window.open(vlasRoot.properties.url, '_blank', 'noopener');
    }
    if (vlasRoot.labelV == "shareholder" && !vlasRoot.fromCoreKb) {
      this.extensionShareHolders(vlasRoot)
    }
    if (vlasRoot.labelV == "home_location" && vlasRoot.hasMap) {
      this.window.open(vlasRoot.hasMap, '_blank', 'noopener');
    }

  }
  extensionShareHolders(vlasRoot) {
    this.vlaChartLoader = true;
    let params = {
      entityId: this.entityIdentifier,
      parentId: vlasRoot.actualData,
      levels: vlasRoot.level,
      requestId: this.requestId
    }
    let shareholderRecur = () => {
      this._alertService.shareHolderData(params).subscribe((response: any) => {
        if (response && response.status && response.message == "VLA DONE") {
          let edges = response.data['edges']
          let vertices = response.data['vertices']
          if (edges.length || vertices.length) {
            this.vlaRootIndexComp = this.vlaRootIndexComp + 500
            this.vlaExtendCount = this.vlaExtendCount + 3000
            this.nodeLevel = this.nodeLevel + 1;
          }
          let rootIndex = this.vlaRootIndexComp
          let labels = [];
          vertices.forEach((element) => {
            if ((element.labelV && (element.labelV.toLowerCase() == "branch" || element.labelV.toLowerCase() == "shareholder" || element.labelV.toLowerCase() == "officership" || element.labelV.toLowerCase() == "person" || element.labelV.toLowerCase() == "document")) && !labels.includes(element.labelV)) {

              labels.push(element.labelV)
            }
          });
          let vlaData = {}
          vlaData['edges'] = [];
          vlaData['root'] = [];
          vlaData['vertices'] = [];
          labels.forEach((val) => {
            let eachLabelV = []
            eachLabelV = vertices.filter((value) => value.labelV == val)

            eachLabelV.forEach((dta: any) => {
              let totalPercentage = '';
              dta["actualData"] = '';
              dta["actualData"] = dta.id;
              dta["level"] = '';
              dta["level"] = this.nodeLevel;
              edges.forEach(element => {
                if (element.to == dta.id) {
                  if (element && element.properties && element.properties.totalPercentage) {
                    dta.properties['totalPercentage'] = '';
                    dta.properties['totalPercentage'] = element.properties.totalPercentage;
                    totalPercentage = element.properties.totalPercentage;
                  }
                }
              });
              vlaData['edges'].push({ "labelE": val, "from": `${vlasRoot.id}`, "id": `${vlasRoot.id}:${this.vlaExtendCount + 1}`, "to": `${this.vlaExtendCount + 1}`, 'totalPercentage': totalPercentage });
              dta.id = `${this.vlaExtendCount + 1}`;
              vlaData['vertices'].push(dta);
              this.vlaExtendCount++
            })
            rootIndex++;
          })
          labels.forEach((val) => {
            if (!this.userTypeFilters.includes(val)) {
              this.userTypeFilters.push(val)
            }
          })
          vlaData['root'].forEach((keys) => {

            if (keys.hasOwnProperty('labelV')) {

              vlaData['vertices'].push(keys)

            }
          })
          this.companyVlaData['vertices'] = this.companyVlaData['vertices'].concat(vlaData['vertices']);
          this.companyVlaData['edges'] = this.companyVlaData['edges'].concat(vlaData['edges'])

          this.applyFilters()
        } else if (response && response.status) {
          setTimeout(() => {
            shareholderRecur()
          }, 15000);
        } else {
          this.vlaChartLoader = false;
          this.vlaChartDataNotFound = true;
        }
      }, (err) => {
        this.vlaChartLoader = false;
      })
    }
    shareholderRecur()
  }
  zoomIn() {
    if (this.vlaZoomIn < 100) {
      this.vlaZoomIn = this.vlaZoomIn + 1
    }
  }
  vlaZoomOut() {
    if (this.vlaZoomIn >= 0) {
      this.vlaZoomIn = this.vlaZoomIn - 1
    }
  }
  personVla(data) {
    this.vlaChartLoader = true;
    let vlaPersonData = data.results
    this.personsVlaData['edges'] = [];
    this.personsVlaData['root'] = [];
    this.userTypeFilters = []
    this.personsVlaData['vertices'] = [];
    let spouseRoot = {}, spouseEdge = {}, workRoot = {}, workEdge = {}, alumniRoot = {}, alumniEdge = {}, addressRoot = {}, addressEdge = {}, homeLocationEdge = {}, homeLocationRoot = {}, childrenEdge = {}, childrenRoot = {}, siblingEdge = {}, siblingRoot = {}, knowsEdge = {}, knowsRoot = {}
    this.personsVlaData['root'].push({ "id": "1", "rootval": "rootva", "labelV": "person", "name": this.personsDataVla.name })

    let labels = Object.keys(vlaPersonData)

    if (labels.includes("spouse") || labels.includes("children") || labels.includes("sibling") || labels.includes("knows") || labels.includes("home_location") || labels.includes("alumni_of") || labels.includes("address") || labels.includes("works_for")) {
      var secondMaxSource = (vlaDt) => {
        var maxcredibleAllNodes = []
        for (var prop in vlaDt) {
          if (vlaDt[prop].length) {
            var z = vlaDt[prop].reduce((prev, current) => {
              return (prev.credibility >= current.credibility) ? prev : current
            })
            maxcredibleAllNodes.push(z)
          }
        }
        if (maxcredibleAllNodes.length) {

          var secondcredibleSource = maxcredibleAllNodes.reduce((prev, current) => {
            return (prev.credibility >= current.credibility) ? prev : current
          })
          return secondcredibleSource
        }

      }

      for (var key in vlaPersonData) {

        if (key == "spouse" || key == "children" || key == "sibling" || key == "knows" || key == "home_location" || key == "alumni_of" || key == "address" || key == "works_for") {

          this.userTypeFilters.push(key);

          this.userType.push(key)

          if (key == "spouse") {

            spouseEdge = { "labelE": "spouse", "from": "1", "id": "1:2", "to": "2" }
            spouseRoot = { "id": "2", "labelV": "spouse" }
            var rootValPushOrNot = false;
            let spouseCount = 1000
            var stoploop = true;
            for (var prop in vlaPersonData[key]) {

              let vlaDataInfo = (maxvalu) => {
                if (maxvalu == "withFirstMaxCredibility") {
                  var maxCredibility = vlaPersonData[key][prop].reduce((prev, current) => {
                    return (prev.credibility >= current.credibility) ? prev : current
                  })
                  vlaPersonData[key][prop] = [];

                  vlaPersonData[key][prop].push(maxCredibility)

                } else {
                  var vlamax = secondMaxSource(vlaPersonData[key])

                  vlaPersonData[key][prop] = [];

                  vlaPersonData[key][prop].push(vlamax)

                }
                for (var i = 0; i < vlaPersonData[key][prop].length; i++) {

                  if (vlaPersonData[key][prop][i] && vlaPersonData[key][prop][i].value && Array.isArray(vlaPersonData[key][prop][i].value)) {

                    for (var values in vlaPersonData[key][prop][i].value) {

                      this.personsVlaData['edges'].push({ "labelE": "spouse", "from": "2", "id": `2:${spouseCount + 1}`, "to": `${spouseCount + 1}` });
                      this.personsVlaData['vertices'].push({
                        "labelV": "spouse",
                        "source": prop,
                        "credibility": vlaPersonData[key][prop][i].credibility,
                        "name": `${vlaPersonData[key][prop][i].value[values] && vlaPersonData[key][prop][i].value[values].first_name ? vlaPersonData[key][prop][i].value[values].first_name : ''} ${vlaPersonData[key][prop][i].value[values] && vlaPersonData[key][prop][i].value[values].last_name ? vlaPersonData[key][prop][i].value[values].first_name : ''}`,
                        "id": `${spouseCount + 1}`,
                        "value": vlaPersonData[key][prop][i].value[values]
                      })
                      rootValPushOrNot = true;
                      spouseCount++;
                    }
                  }
                }
              }
              if (prop == this.maxCredibilitySourceValue && stoploop) {
                var maxvalue = "withFirstMaxCredibility"
                vlaDataInfo(maxvalue)
              } else if (stoploop) {
                vlaDataInfo("withoutval")
              }
              stoploop = false
            }
            if (rootValPushOrNot) {
              this.personsVlaData['vertices'].push(spouseRoot)
              this.personsVlaData['edges'].push(spouseEdge)
            }
          } else if (key == "works_for") {

            workEdge = { "labelE": "works_for", "from": "1", "id": "1:3", "to": "3" }
            workRoot = { "id": "3", "labelV": "works_for" }
            var rootValPushOrNot = false;
            let worksCount = 10000
            var stoploop = true;
            for (var prop in vlaPersonData[key]) {

              let vlaDataInfo = (maxvalu) => {
                if (maxvalu == "withFirstMaxCredibility") {
                  var maxCredibility = vlaPersonData[key][prop].reduce((prev, current) => {
                    return (prev.credibility >= current.credibility) ? prev : current
                  })
                  vlaPersonData[key][prop] = [];

                  vlaPersonData[key][prop].push(maxCredibility)

                } else {
                  var vlamax = secondMaxSource(vlaPersonData[key])

                  vlaPersonData[key][prop] = [];

                  vlaPersonData[key][prop].push(vlamax)

                }
                for (var i = 0; i < vlaPersonData[key][prop].length; i++) {

                  if (vlaPersonData[key][prop][i] && vlaPersonData[key][prop][i].value && Array.isArray(vlaPersonData[key][prop][i].value)) {

                    for (var values in vlaPersonData[key][prop][i].value) {

                      this.personsVlaData['edges'].push({ "labelE": key, "from": "3", "id": `3:${worksCount + 1}`, "to": `${worksCount + 1}` });

                      this.personsVlaData['vertices'].push({
                        "labelV": "works_for",
                        "source": prop,
                        "credibility": vlaPersonData[key][prop][i].credibility,
                        "value": vlaPersonData[key][prop][i].value[values],
                        "name": vlaPersonData[key][prop][i].value[values] && vlaPersonData[key][prop][i].value[values]["name"] ? vlaPersonData[key][prop][i].value[values]["name"] : '',
                        "address": vlaPersonData[key][prop][i].value[values] && vlaPersonData[key][prop][i].value[values]["address"] ? Object.values(vlaPersonData[key][prop][i].value[values]["address"]) : '',

                        "id": `${worksCount + 1}`
                      })
                      rootValPushOrNot = true;
                      worksCount++;

                    }
                  }
                }
              }
              if (prop == this.maxCredibilitySourceValue && stoploop) {
                var maxvalue = "withFirstMaxCredibility"
                vlaDataInfo(maxvalue)
              } else if (stoploop) {
                vlaDataInfo("withoutval")
              }
              stoploop = false
            }
            if (rootValPushOrNot) {
              this.personsVlaData['vertices'].push(workRoot)
              this.personsVlaData['edges'].push(workEdge)
            }
          } else if (key == "alumni_of") {

            alumniEdge = { "labelE": "alumni_of", "from": "1", "id": "1:4", "to": "4" }
            alumniRoot = { "id": "4", "labelV": "alumni_of" }
            var rootValPushOrNot = false;
            let alumniCount = 20000
            var stoploop = true;
            for (var prop in vlaPersonData[key]) {

              let vlaDataInfo = (maxvalu) => {
                if (maxvalu == "withFirstMaxCredibility") {
                  var maxCredibility = vlaPersonData[key][prop].reduce((prev, current) => {

                    return (prev.credibility >= current.credibility) ? prev : current
                  })
                  vlaPersonData[key][prop] = [];

                  vlaPersonData[key][prop].push(maxCredibility)

                } else {
                  var vlamax = secondMaxSource(vlaPersonData[key])

                  vlaPersonData[key][prop] = [];

                  vlaPersonData[key][prop].push(vlamax)

                }
                for (var i = 0; i < vlaPersonData[key][prop].length; i++) {

                  if (vlaPersonData[key][prop][i] && vlaPersonData[key][prop][i].value && Array.isArray(vlaPersonData[key][prop][i].value)) {

                    for (var values in vlaPersonData[key][prop][i].value) {

                      this.personsVlaData['edges'].push({ "labelE": key, "from": "4", "id": `4:${alumniCount + 1}`, "to": `${alumniCount + 1}` });

                      this.personsVlaData['vertices'].push({
                        "labelV": "alumni_of",
                        "source": prop,
                        "credibility": vlaPersonData[key][prop][i].credibility,

                        "value": vlaPersonData[key][prop][i].value[values],

                        "name": vlaPersonData[key][prop][i].value[values] && (vlaPersonData[key][prop][i].value[values].Name || vlaPersonData[key][prop][i].value[values].name) ? (vlaPersonData[key][prop][i].value[values].Name || vlaPersonData[key][prop][i].value[values].name) : '',

                        "id": `${alumniCount + 1}`
                      })
                      rootValPushOrNot = true;
                      alumniCount++;

                    }
                  }
                }
              }
              if (prop == this.maxCredibilitySourceValue && stoploop) {
                var maxvalue = "withFirstMaxCredibility"
                vlaDataInfo(maxvalue)
              } else if (stoploop) {
                vlaDataInfo("withoutval")
              }
              stoploop = false
            }
            if (rootValPushOrNot) {
              this.personsVlaData['vertices'].push(alumniRoot)
              this.personsVlaData['edges'].push(alumniEdge)
            }
          } else if (key == "address") {

            addressEdge = { "labelE": "address", "from": "1", "id": "1:5", "to": "5" }
            addressRoot = { "id": "5", "labelV": "address" }
            var rootValPushOrNot = false;
            let addressCount = 30000;
            var stoploop = true;
            for (var prop in vlaPersonData[key]) {

              let vlaDataInfo = (maxvalu) => {
                if (maxvalu == "withFirstMaxCredibility") {
                  var maxCredibility = vlaPersonData[key][prop].reduce((prev, current) => {
                    return (prev.credibility >= current.credibility) ? prev : current
                  })
                  vlaPersonData[key][prop] = [];

                  vlaPersonData[key][prop].push(maxCredibility)

                } else {
                  var vlamax = secondMaxSource(vlaPersonData[key])

                  vlaPersonData[key][prop] = [];

                  vlaPersonData[key][prop].push(vlamax)

                }
                for (var i = 0; i < vlaPersonData[key][prop].length; i++) {

                  if (vlaPersonData[key][prop][i] && vlaPersonData[key][prop][i].value && Array.isArray(vlaPersonData[key][prop][i].value)) {


                    for (var values in vlaPersonData[key][prop][i].value) {

                      this.personsVlaData['edges'].push({ "labelE": "address", "from": "5", "id": `5:${addressCount + 1}`, "to": `${addressCount + 1}` });
                      this.personsVlaData['vertices'].push({
                        "labelV": "address",
                        "source": prop,
                        "credibility": vlaPersonData[key][prop][i].credibility,

                        "address": Object.values(omit(vlaPersonData[key][prop][i].value[values], ['entity_type'])).join(','),

                        "id": `${addressCount + 1}`,
                        "value": vlaPersonData[key][prop][i].value[values]

                      })
                      rootValPushOrNot = true
                      addressCount++;

                    }
                  }
                }
              }
              if (prop == this.maxCredibilitySourceValue && stoploop) {
                var maxvalue = "withFirstMaxCredibility"
                vlaDataInfo(maxvalue)
              } else if (stoploop) {
                vlaDataInfo("withoutval")
              }
              stoploop = false
            }
            if (rootValPushOrNot) {
              this.personsVlaData['vertices'].push(addressRoot)
              this.personsVlaData['edges'].push(addressEdge)
            }
          } else if (key == "home_location") {

            homeLocationEdge = { "labelE": "home_location", "from": "1", "id": "1:6", "to": "6" }
            homeLocationRoot = { "id": "6", "labelV": "home_location" }
            var rootValPushOrNot = false;
            let homeLocationCount = 40000
            var stoploop = true;
            for (var prop in vlaPersonData[key]) {

              let vlaDataInfo = (maxvalu) => {
                if (maxvalu == "withFirstMaxCredibility") {
                  var maxCredibility = vlaPersonData[key][prop].reduce((prev, current) => {

                    return (prev.credibility >= current.credibility) ? prev : current
                  })
                  vlaPersonData[key][prop] = [];

                  vlaPersonData[key][prop].push(maxCredibility)

                } else {
                  var vlamax = secondMaxSource(vlaPersonData[key])

                  vlaPersonData[key][prop] = [];

                  vlaPersonData[key][prop].push(vlamax)

                }
                for (var i = 0; i < vlaPersonData[key][prop].length; i++) {

                  if (vlaPersonData[key][prop][i] && vlaPersonData[key][prop][i].value) {

                    this.personsVlaData['edges'].push({ "labelE": "home_location", "from": "6", "id": `6:${homeLocationCount + 1}`, "to": `${homeLocationCount + 1}` });
                    this.personsVlaData['vertices'].push({
                      "labelV": "home_location",
                      "source": prop,
                      "credibility": vlaPersonData[key][prop][i].credibility,
                      "address": Object.values(omit(vlaPersonData[key][prop][i].value['address'], ['entity_type'])),
                      "id": `${homeLocationCount + 1}`,
                      "hasMap": vlaPersonData[key][prop][i].value['has_map'] ? vlaPersonData[key][prop][i].value['has_map'] : '',
                      "value": vlaPersonData[key][prop][i].value

                    })
                    rootValPushOrNot = true;
                    homeLocationCount++;
                  }
                }
              }
              if (prop == this.maxCredibilitySourceValue && stoploop) {
                var maxvalue = "withFirstMaxCredibility"
                vlaDataInfo(maxvalue)
              } else if (stoploop) {
                vlaDataInfo("withoutval")
              }
              stoploop = false
            }
            if (rootValPushOrNot) {
              this.personsVlaData['vertices'].push(homeLocationRoot)
              this.personsVlaData['edges'].push(homeLocationEdge)
            }
          } else if (key == "children") {

            childrenEdge = { "labelE": "children", "from": "1", "id": "1:7", "to": "7" }
            childrenRoot = { "id": "7", "labelV": "children" }
            var rootValPushOrNot = false
            let childrenCount = 50000
            var stoploop = true;
            for (var prop in vlaPersonData[key]) {

              let vlaDataInfo = (maxvalu) => {
                if (maxvalu == "withFirstMaxCredibility") {
                  var maxCredibility = vlaPersonData[key][prop].reduce((prev, current) => {

                    return (prev.credibility >= current.credibility) ? prev : current
                  })
                  vlaPersonData[key][prop] = [];

                  vlaPersonData[key][prop].push(maxCredibility)

                } else {
                  var vlamax = secondMaxSource(vlaPersonData[key])

                  vlaPersonData[key][prop] = [];

                  vlaPersonData[key][prop].push(vlamax)

                }
                for (var i = 0; i < vlaPersonData[key][prop].length; i++) {

                  if (vlaPersonData[key][prop][i] && vlaPersonData[key][prop][i].value && Array.isArray(vlaPersonData[key][prop][i].value)) {

                    for (var values in vlaPersonData[key][prop][i].value) {

                      this.personsVlaData['edges'].push({ "labelE": "children", "from": "7", "id": `7:${childrenCount + 1}`, "to": `${childrenCount + 1}` });
                      this.personsVlaData['vertices'].push({
                        "labelV": "children",
                        "source": prop,
                        "credibility": vlaPersonData[key][prop][i].credibility,

                        "name": `${vlaPersonData[key][prop][i].value[values] && vlaPersonData[key][prop][i].value[values].first_name ? vlaPersonData[key][prop][i].value[values].first_name : ''} ${vlaPersonData[key][prop][i].value[values] && vlaPersonData[key][prop][i].value[values].last_name ? vlaPersonData[key][prop][i].value[values].first_name : ''}`,

                        "id": `${childrenCount + 1}`,
                        "value": vlaPersonData[key][prop][i].value[values]

                      })
                      rootValPushOrNot = true
                      childrenCount++;
                    }
                  }
                }
              }
              if (prop == this.maxCredibilitySourceValue && stoploop) {
                var maxvalue = "withFirstMaxCredibility"
                vlaDataInfo(maxvalue)
              } else if (stoploop) {
                vlaDataInfo("withoutval")
              }
              stoploop = false
            }
            if (rootValPushOrNot) {
              this.personsVlaData['vertices'].push(childrenRoot)
              this.personsVlaData['edges'].push(childrenEdge)
            }
          } else if (key == "sibling") {

            siblingEdge = { "labelE": "sibling", "from": "1", "id": "1:8", "to": "8" }
            siblingRoot = { "id": "8", "labelV": "sibling" }
            var rootValPushOrNot = false;
            let siblingCount = 60000
            var stoploop = true;
            for (var prop in vlaPersonData[key]) {

              let vlaDataInfo = (maxvalu) => {
                if (maxvalu == "withFirstMaxCredibility") {
                  var maxCredibility = vlaPersonData[key][prop].reduce((prev, current) => {

                    return (prev.credibility >= current.credibility) ? prev : current
                  })
                  vlaPersonData[key][prop] = [];

                  vlaPersonData[key][prop].push(maxCredibility)

                } else {
                  var vlamax = secondMaxSource(vlaPersonData[key])

                  vlaPersonData[key][prop] = [];

                  vlaPersonData[key][prop].push(vlamax)

                }
                for (var i = 0; i < vlaPersonData[key][prop].length; i++) {

                  if (vlaPersonData[key][prop][i] && vlaPersonData[key][prop][i].value && Array.isArray(vlaPersonData[key][prop][i].value)) {

                    for (var values in vlaPersonData[key][prop][i].value) {

                      this.personsVlaData['edges'].push({ "labelE": "sibling", "from": "8", "id": `8:${siblingCount + 1}`, "to": `${siblingCount + 1}` });
                      this.personsVlaData['vertices'].push({
                        "labelV": "sibling",
                        "source": prop,
                        "credibility": vlaPersonData[key][prop][i].credibility,

                        "name": `${vlaPersonData[key][prop][i].value[values] && vlaPersonData[key][prop][i].value[values].first_name ? vlaPersonData[key][prop][i].value[values].first_name : ''} ${vlaPersonData[key][prop][i].value[values] && vlaPersonData[key][prop][i].value[values].last_name ? vlaPersonData[key][prop][i].value[values].first_name : ''}`,

                        "id": `${siblingCount + 1}`,
                        "value": vlaPersonData[key][prop][i].value[values]

                      })
                      rootValPushOrNot = true
                      siblingCount++;
                    }
                  }
                }
              }
              if (prop == this.maxCredibilitySourceValue && stoploop) {
                var maxvalue = "withFirstMaxCredibility"
                vlaDataInfo(maxvalue)
              } else if (stoploop) {
                vlaDataInfo("withoutval")
              }
              stoploop = false
            }
            if (rootValPushOrNot) {
              this.personsVlaData['vertices'].push(siblingRoot)
              this.personsVlaData['edges'].push(siblingEdge)
            }
          } else if (key == "knows") {

            knowsEdge = { "labelE": "knows", "from": "1", "id": "1:9", "to": "9" }
            knowsRoot = { "id": "9", "labelV": "knows" }
            var rootValPushOrNot = false;
            let knowsCount = 70000
            var stoploop = true;
            for (var prop in vlaPersonData[key]) {

              let vlaDataInfo = (maxvalu) => {
                if (maxvalu == "withFirstMaxCredibility") {
                  var maxCredibility = vlaPersonData[key][prop].reduce((prev, current) => {

                    return (prev.credibility >= current.credibility) ? prev : current
                  })
                  vlaPersonData[key][prop] = [];

                  vlaPersonData[key][prop].push(maxCredibility)

                } else {
                  var vlamax = secondMaxSource(vlaPersonData[key])

                  vlaPersonData[key][prop] = [];

                  vlaPersonData[key][prop].push(vlamax)

                }
                for (var i = 0; i < vlaPersonData[key][prop].length; i++) {

                  if (vlaPersonData[key][prop][i] && vlaPersonData[key][prop][i].value && Array.isArray(vlaPersonData[key][prop][i].value)) {

                    for (var values in vlaPersonData[key][prop][i].value) {

                      this.personsVlaData['edges'].push({ "labelE": "knows", "from": "9", "id": `9:${knowsCount + 1}`, "to": `${knowsCount + 1}` });
                      this.personsVlaData['vertices'].push({
                        "labelV": "knows",
                        "source": prop,
                        "credibility": vlaPersonData[key][prop][i].credibility,

                        "name": `${vlaPersonData[key][prop][i].value[values] && vlaPersonData[key][prop][i].value[values].first_name ? vlaPersonData[key][prop][i].value[values].first_name : ''} ${vlaPersonData[key][prop][i].value[values] && vlaPersonData[key][prop][i].value[values].last_name ? vlaPersonData[key][prop][i].value[values].first_name : ''}`,

                        "id": `${knowsCount + 1}`,
                        "value": vlaPersonData[key][prop][i].value[values]

                      })
                      rootValPushOrNot = true;
                      knowsCount++;
                    }
                  }
                }
              }
              if (prop == this.maxCredibilitySourceValue && stoploop) {
                var maxvalue = "withFirstMaxCredibility"
                vlaDataInfo(maxvalue)
              } else if (stoploop) {
                vlaDataInfo("withoutval")
              }
              stoploop = false
            }
            if (rootValPushOrNot) {
              this.personsVlaData['vertices'].push(knowsRoot)
              this.personsVlaData['edges'].push(knowsEdge)
            }
          }
        }
      }
      this.personsVlaData['vertices'].push(this.personsVlaData['root'][0]);
      this.personsVlaData['edges'] = this.personsVlaData['edges'].filter((val) => { return val.hasOwnProperty('labelE') })
      this.personsVlaData['vertices'] = this.personsVlaData['vertices'].filter((val) => { return val.hasOwnProperty('labelV') })
      if (this.personsVlaData['edges'].length) {
        setTimeout(() => {
          this.financepgraph(this.personsVlaData, "personVla")
        }, 1000);
      } else {
        this.vlaChartLoader = false;
        this.vlaChartDataNotFound = true;
      }
    } else {
      this.vlaChartLoader = false;
      this.vlaChartDataNotFound = true;
    }
  }
  tosslePerOne(all) {
  }
  cancelFilters() {
    this.userType = [];
  }
  applyFilters() {
    this.vlaChartLoader = true;
    this.vlaChartDataNotFound = false;
    let filteredPersonVla = {};
    filteredPersonVla["edges"] = [];
    filteredPersonVla["vertices"] = [];
    if (this.userType && this.userType.length && this.entityType == 'person') {
      filteredPersonVla["edges"] = this.personsVlaData['edges'].filter((val) => { return this.userType.includes(val.labelE) })
      filteredPersonVla["vertices"] = this.personsVlaData['vertices'].filter((val) => { return this.userType.includes(val.labelV) })
      filteredPersonVla["vertices"].push({ "id": "1", "rootval": "rootva", "labelV": "person", "name": this.personsDataVla.name })
      if (filteredPersonVla["vertices"].length && filteredPersonVla["edges"].length) {
        setTimeout(() => {
          this.financepgraph(filteredPersonVla, "personVla")
        }, 0);
      } else {
        this.vlaChartLoader = false;
        this.vlaChartDataNotFound = true;
      }
    } else if (this.userType && this.userType.length && this.entityType != 'person') {
      filteredPersonVla["edges"] = this.companyVlaData['edges'].filter((val) => { return this.userType.includes(val.labelE) })
      filteredPersonVla["vertices"] = this.companyVlaData['vertices'].filter((val) => { return this.userType.includes(val.labelV) })
      filteredPersonVla["vertices"].push(this.rootCompanyVla)
      if (filteredPersonVla["vertices"].length && filteredPersonVla["edges"].length) {
        setTimeout(() => {
          this.financepgraph(filteredPersonVla, "companyVla")
        }, 0);
      } else {
        this.vlaChartLoader = false;
        this.vlaChartDataNotFound = true;
      }
    } else {
      this.vlaChartLoader = false;
      this.vlaChartDataNotFound = true;
    }
  }
  getBgColor(color) {
    let selectedColor = '#' + color;
    return this.hexToRGB(selectedColor, 0.2);
  }

  hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }
  getColor(color) {
    return '#' + color
  }

  updateStatusfromalertCard(item) {
    this.newcurrentState = item.values;
    if (this.alertCardUtilityObject.statusMaintained.toLowerCase() !== item.values.code.toLowerCase()) {
      var openModal = this.alertCard.statusDetails.reasons.some((arrVal) => arrVal.checked == true);
      if (openModal) {
        let currentModalRef = this.modalService.open(ConfirmationComponent, { windowClass: 'bst_modal alert-card-modal entity-identification-modal light-theme confirmMe' });
        currentModalRef.componentInstance.statusComment = 'ExistStatusReasons';
        currentModalRef.componentInstance.emitData.subscribe(data => {
          if (data) {
            if (data == 'OK') {
              this.saveEntity()
            }
          }
        });
      } else {
        this.saveEntity()
      }
    }
  }

  saveReasons(item) {

    this.setReasonOption();
    let params = [{
      asignee: (this.getRowDataOnClick.completeRowData.asignee) ? this.getRowDataOnClick.completeRowData.asignee : {},
      statuse: item.values,
      alertId: this.getRowDataOnClick.completeRowData.alertId,
    }];
    this.selectedIcon = item.values.icon;
    this.selectedIconColor = item.values.colorCode;

    this._alertService.saveOrUpdateAlerts(params, false).subscribe((response) => {
      this.gridApi.refreshInfiniteCache();
    });
  }
  closepopover() {
    this.commentsPopover.close()
  }

  getFinanceValues() {

    let data = {};
    let place_of_birth = this.get_place_of_birth() ? this.get_place_of_birth() : this.get_place_of_registration();
    const entity = {
      "entities": [
        {
          "names": [
            this.alertCard.alertMetaData.name
          ],
          "jurisdiction": this.getRowDataOnClick.completeRowData.jurisdictions && this.getRowDataOnClick.completeRowData.jurisdictions.code ? this.getRowDataOnClick.completeRowData.jurisdictions.code : place_of_birth,
          "entity_id": this.alert_entityId
        }
      ]
    }
    if (this.alertCard.alertMetaData.entity_type === "person") {
      data = {
        "person": entity,
        "min_confidence": this.alertCard.confidenceLevel,
        "max_responses": 10
      }
    } else {
      data = {
        "organization": entity,
        "min_confidence": this.alertCard.confidenceLevel,
        "max_responses": 10
      }
    }

    if (entity && entity.entities && (!entity.entities[0].jurisdiction)) {
      let country = this.alertCard.alertMetaData.results.screening.watchlists[0] && this.alertCard.alertMetaData.results.screening.watchlists[0].basic_info && this.alertCard.alertMetaData.results.screening.watchlists[0].basic_info.country_jurisdiction ? this.alertCard.alertMetaData.results.screening.watchlists[0].basic_info.country_jurisdiction : '';
      if (!country) {
        country = this.alertCard.alertMetaData.jurisdiction ? this.alertCard.alertMetaData.jurisdiction : this.getJurisdictionfromwatchlist();
      }
      if (!country) {
        country = this.get_place_of_birth()
      }
      if (!country) {
        country = this.get_place_of_registration()
      }
      if (country && country.length > 2) {
        this._alertService.getJurisdictionbycountryname(country).then((response: any) => {
          entity.entities[0].jurisdiction = response.code;
          this.postSSbscreening(data);
        }).catch((err) => {
          this.alertUtilityObject.errorMessage = true;
          this.alertUtilityObject.financeSpinner = false;
          this.alertCard.alertMetaData.results.screening['Adverse Media Articles'] = [];
        });
      } else if (country.length === 2) {
        entity.entities[0].jurisdiction = country;
        this.postSSbscreening(data);
      } else {
        if (this.entityType && this.entityType.toLowerCase() == "person") {
          this.postSSbscreening(data);
        }
        else {
          this.alertUtilityObject.financeSpinner = false;
          this.alertUtilityObject.errorMessage = true;
          this.alertCard.alertMetaData.results.screening['Adverse Media Articles'] = [];
        }
      }
    } else {
      this.postSSbscreening(data);
    }
  }

  postSSbscreening(data) {
    var name = this.alertMetaData.results.screening.watchlists[0] && this.alertMetaData.results.screening.watchlists[0].basic_info && this.alertMetaData.results.screening.watchlists[0].basic_info.name ? this.alertMetaData.results.screening.watchlists[0].basic_info.name : '';
    if (data.organization && data.organization.entities[0].jurisdiction) {
      if (name) {
        data.organization.entities[0].names.push(name);
      }
      let hasname = name + this.alertCard.alertMetaData.name;
      this.alert_entityId = (data.organization.entities[0].jurisdiction) ? (this.hashCode(hasname + data.organization.entities[0].jurisdiction)) : this.hashCode(hasname)
      this.alert_entityId = this.alert_entityId.replace(/[^a-zA-Z0-9 ]/g, "");
      data.organization.entities[0].entity_id = this.alert_entityId;
    } else {
      let hasname = name + this.alertCard.alertMetaData.name;
      this.alert_entityId = (data.person.entities[0].jurisdiction) ? (this.hashCode(hasname + data.person.entities[0].jurisdiction)) : this.hashCode(hasname)
      this.alert_entityId = this.alert_entityId.replace(/[^a-zA-Z0-9 ]/g, "");
      data.person.entities[0].entity_id = this.alert_entityId;
      if (name) {
        data.person.entities[0].names.push(name);
      }
    }
    let bagEntitiesData = {}
    if (this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex] && this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex].basic_info && this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex].basic_info.id) {
      bagEntitiesData['dj_id'] = this.alertMetaData.results.screening.watchlists[this.selectedWatchListIndex].basic_info.id;
    }
    if (this.alertMetaData && this.alertMetaData.entity_id) {
      bagEntitiesData['root_entity_id'] = this.alertMetaData.entity_id;
    }
    if (this.alertMetaData && this.alertMetaData.entity_type) {
      bagEntitiesData['entity_type'] = this.alertMetaData.entity_type;
    }
    if (this.alertMetaData && this.alertMetaData.results && this.alertMetaData.results.mention_id && this.alertMetaData.results.mention_id.core_kb && Array.isArray(this.alertMetaData.results.mention_id.core_kb) && this.alertMetaData.results.mention_id.core_kb[0]['value']) {
      bagEntitiesData['corekb_id'] = this.alertMetaData.results.mention_id.core_kb[0]['value'];
    }
    bagEntitiesData['id'] = this.alert_entityId;
    let classifications: any = this.currentRowData.completeRowData['classification'];
    if (Array.isArray(classifications) && classifications.length > 0 && classifications[0] == "BST ADVERSE MEDIA") {
      this.alertUtilityObject.financeSpinner = true;
      this.recurssivegetScreeningEntitiesBag(bagEntitiesData, data);
    }

  }

  recurssivegetScreeningEntitiesBag(bagEntitiesData, data) {
    this._alertService.getScreeningEntitiesBag(bagEntitiesData, {}).then((response: any) => {
      if (response && response.message && response.message.toLowerCase() === 'in progress') {
        setTimeout(() => {
          this.recurssivegetScreeningEntitiesBag(bagEntitiesData, data);
        })
      } else if (response && response.message === 'bag done' && response.relationships) {
        if (Object.keys(response.relationships).length > 0) {
          Object.keys(response.relationships).forEach(key => {
            if (response.relationships[key].length > 0) {
              response.relationships[key].forEach((id, index) => {
                response.relationships[key][index] = id.startsWith('-') ? id.replace(/-|\s/g, "") : id;
              });
            }
          });
          this.relationshipTypes = response.relationships;
        }
        this.recurssivegetSSBscreening();
      }
    })
  }

  recurssivegetSSBscreening() {
    this.alertUtilityObject.financeSpinner = true;
    this._alertService.getSSBScreeningData(this.alert_entityId).then((response: any) => {
      if (response && response.news && response.news.status && response.news.status.toLowerCase() === 'in progress') {
        setTimeout(() => {
          this.recurssivegetSSBscreening();
        }, 20000)
      } else if (response && response.message) {
        this.alertUtilityObject.errorMessage = true;
        this.alertUtilityObject.financeSpinner = false;
        this.alertCard.alertMetaData.results.screening['Adverse Media Articles'] = [];
        this.alertUtilityObject.errorMessagedetail = response.message;
      }
      else {
        let promises = []
        this.getFinanceArticles(response, promises);
        Promise.all(promises).then((success) => {
          if (this.alertCard.alertMetaData.results.screening['Adverse Media Articles'].length > 0) {
            this.getsingleArticleDetail(this.alertCard.alertMetaData.results.screening['Adverse Media Articles'][0]);

            if (this.adverseListForDropDown.length > 0) {
              this.adverseSelectedItems = [];
              this.adverseSelectedItems = this.adverseListForDropDown;
            }
            this.alertUtilityObject.financeSpinner = false;
          }
          else {
            this.alertUtilityObject.errorMessage = true;
            this.alertUtilityObject.financeSpinner = false;
          }
        }).catch((error) => {

        })
      }
    }).catch((err) => {
      this.alertUtilityObject.errorMessage = true;
      this.alertUtilityObject.financeSpinner = false;
      this.alertCard.alertMetaData.results.screening['Adverse Media Articles'] = [];
      if (err && err.message) {
        this.alertUtilityObject.errorMessagedetail = err.message;
      }
    });
  }

  getFinanceArticles(data, promises) {
    if(data && data.news) {
      let entityIds = Object.keys(data.news);

    entityIds.forEach((entityId) => {
      let relation_type;

      if (this.alert_entityId === entityId) {
        relation_type = this.mainEntityRelationTypeStr;
      } else {
        Object.keys(this.relationshipTypes).forEach(key => {
          if (this.relationshipTypes[key].includes(entityId)) {
            relation_type = this.titlecasePipe.transform(key);
          }
        });
      }
      if (!this.adverseListForDropDown.includes(relation_type)) {
        this.adverseListForDropDown.push(relation_type);
      }
      if(data.news.all_articles && data.news.all_articles.length > 0 ){
        data.news.all_articles.forEach(element => {
               if(element.entity_id == entityId){
                element['relation_type'] = relation_type;
               }
        });
      }
      });

    if(data.news.all_articles && data.news.all_articles.length > 0) {
       this.alertCard.alertMetaData.results.screening['Adverse Media Articles'] = [];
       promises.push(new Promise((resolve, reject) => {
       this.alertCard.alertMetaData.results.screening['Adverse Media Articles'] = this.alertCard.alertMetaData.results.screening['Adverse Media Articles'].concat(data.news.all_articles);
       this.alertCard.alertMetaData.results.screening['Adverse Media Articles'] = sortBy( this.alertCard.alertMetaData.results.screening['Adverse Media Articles'], 'article_title' );
       resolve("success")
       }));

    } else {
      this.alertUtilityObject.errorMessage = true;
      this.alertUtilityObject.financeSpinner = false;
      this.alertCard.alertMetaData.results.screening['Adverse Media Articles'] = [];
    }
    } else{
      this.alertUtilityObject.errorMessage = true;
      this.alertUtilityObject.financeSpinner = false;
      this.alertCard.alertMetaData.results.screening['Adverse Media Articles'] = [];
    }
   }

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
        let langCode = this.languageTranslateList.find(x=>x.displayName == this.articalDetail.results.language);
        let defaultLang = GlobalConstants.systemSettings.ehubObject['language'].replace(/\s/g, "").toLowerCase().trim();
        if(langCode){
          this.selectedCountry = langCode.code;
          this.selectedCountryDisplayName = "";
        }else if(defaultLang){
        let lang = this.languageTranslateList.find(x=>x.code.replace(/\s/g, "").toLowerCase().trim() == defaultLang);
          this.selectedCountry = lang.code;
          this.selectedCountryDisplayName = lang.displayName;

        }
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
        response.results.resultskeywordsOrigianal = accmulator;
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
        this.financeArticleDetails = response.results;
        this.tempTitle = this.financeArticleDetails.title;
        this.selectedItems = [];
        this.reclassificationInfo = response.results && response.results.reClassifications ? response.results.reClassifications.split(',') : []
        if (this.alertCard.statusDetails && this.alertCard.statusDetails.value && this.alertCard.statusDetails.value.length && response.results.status_key) {
          if (response.results && response.results.status_key) {
            var mappedStatusObj = this.alertCard.statusDetails.value.map((val) => {
              if (val.listItemId == response.results.status_key) {
                return val.values
              }
            }).filter((element) => { return element })[0];
          }
          if (mappedStatusObj && (mappedStatusObj.icon || mappedStatusObj.colorCode)) {
            this.alertCardUtilityObject.articleselectedIcon = mappedStatusObj.icon;
            this.alertCardUtilityObject.articleselectedIconColor = mappedStatusObj.colorCode;
            this.alertCardUtilityObject.articleStatus = mappedStatusObj.code ? mappedStatusObj.code : '';
          }
          var reasonIndex = this.dummyReason.findIndex((val: any) => {
            return val.status_key.toLowerCase() === response.results.status_key
          });
          if (reasonIndex !== -1) {
            this.alertCardUtilityObject.articleReasons = this.dummyReason[reasonIndex].reasons
            this.alertCardUtilityObject.articleReasons.forEach((val) => {
              val.checked = response.results.status_reason.indexOf(val.reason_id) === -1 ? false : true
            })
            this.alertCardUtilityObject.selectedArticleReason = this.alertCardUtilityObject.articleReasons.filter((val) => val.checked).map(val => val.reason);
          }
        }
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
            this.showKeywords(true);
            clearInterval(waitUntilDivExists);
            $('#descriptionContent').height(
              $('#descriptionWrapper').height() - $('#descriptionHeader').height() - $('#descriptionTitle').height() - 35);
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

  highlightKeywords(tabindex, valueindex, value, id) {

    let highlightEntitytype = []
    if (valueindex !== -1) {
      let tabValues = this.financeArticleDetails.resultskeywordsOrigianal[tabindex].values;
      const uniqueKeywordList: any[] = tabValues && tabValues.length ? this.getUniqueKeywordList(tabValues) : [];
      let checkedObject: any = {};
      if(uniqueKeywordList.length) {
        checkedObject = uniqueKeywordList[valueindex];
      }

      const realValueIndex = this.financeArticleDetails.resultskeywordsOrigianal[tabindex].values.findIndex((item) => item === checkedObject)

      if (realValueIndex !== -1) {
        this.financeArticleDetails.resultskeywordsOrigianal[tabindex].values[realValueIndex].checked = value;
        const selectedKeyName = this.financeArticleDetails.resultskeywordsOrigianal[tabindex].values[realValueIndex].name;
        this.financeArticleDetails.resultskeywordsOrigianal[tabindex].values.filter((item) => item.name === selectedKeyName).map(item2 =>
          {
            let item = item2;
            item.checked = value;
            return item;
          })
      }
    } else {
      this.financeArticleDetails.resultskeywordsOrigianal[tabindex].tabCheck = value;

      this.financeArticleDetails.resultskeywordsOrigianal[tabindex].values.forEach((val) => {

        val.checked = value;
      });
    }

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

  /* purpose: hide keywords which has same name(remove duplicates temporary from checkBox list)
  * created: 24 Jan 2021
  * returns:  nothing
  * author:kasun*/
  getUniqueKeywordList(items: any[]) {
    if (!items.length) {
      return [];
    }
    const keys = ['name'];
    const filtered = items.filter(
        (s => o =>
            (k => !s.has(k) && s.add(k))
            (keys.map(k => o[k]).join('|'))
        )
        (new Set)
    );

    return filtered;
  }

  setJurisdiction() {
    var person = ["city_of_birth", "address"];
    if (this.getRowDataOnClick.completeRowData && this.getRowDataOnClick.completeRowData.entiType !== "person") {
      person = ["address"];
    }
    var finalArr = this.getJurisdiction(person, this.alertCard.alertMetaData.results)
    let jurisdiction = [];
    finalArr.forEach((value) => {
      for (var key in value) {
        var country = '';
        if (value[key] && value[key].length > 0 && value[key][0].value && Array.isArray(value[key][0].value) && value[key][0].value.length > 0) {
          country = value[key][0].value[0].country ? value[key][0].value[0].country : ''

        } else if (typeof value[key][0].value === 'object' && value[key][0].value.address) {

          country = value[key][0].value.address.country ? value[key][0].value.address.country : ''

        } else if (value[key] && Array.isArray(value[key]) && value[key].length > 0 && value[key][0] && value[key][0].value && value[key][0].value.country) {

          country = value[key][0].value.country;

        }
        if (country) {
          country = country.trim();
          let filter = jurisdiction.map((val) => val.country).indexOf(country.toUpperCase());
          let countryrisk = countryRisk.filter((val) => {
            return val.COUNTRY === country.toUpperCase()
          })
          if (filter === -1) {
            jurisdiction.push({
              source: [key],

              credibility: value[key][0].credibility,

              country: country.toUpperCase(),
              risk: countryrisk.length > 0 && countryrisk[0]['FEC/ESR Risk Level'] ? countryrisk[0]['FEC/ESR Risk Level'] : ''
            })
          } else {
            jurisdiction[filter].source.push(key)

          }

        }
      }
    });
    return jurisdiction;
  }

  getJurisdiction(type, results) {
    const arr = [];
    type.forEach((val) => {
      arr.push(results[val]);

    })
    return arr;
  }

  _validateStatus(currentAlertStatus, statusList, isIdentified) {
    this.latestStatusList = statusList;
    this.AllowedStatusList = [];
    let selectedStatus = currentAlertStatus.toLowerCase();
    let allowedStatus
    if (isIdentified) {
      allowedStatus = this.alertEntityIdentificationStatusValidation[selectedStatus] ? this.alertEntityIdentificationStatusValidation[selectedStatus] : [];
    } else {
      allowedStatus = this.statusUpdateValidations[selectedStatus] ? this.statusUpdateValidations[selectedStatus] : [];
    }
    statusList.forEach((option) => {
      option.disable = false;
      if (option && option.values.code && allowedStatus.indexOf(option.values.code.toLowerCase()) == -1) {
        option.disable = true;
        if (option && option.values.code && option.values.code.toLowerCase() == selectedStatus) {
          this.AllowedStatusList.push(option);
        }
      } else {
        this.AllowedStatusList.push(option);
      }
    });
  }

  getJurisdictionfromwatchlist() {
    let countryFromwatchlist = '';
    if (this.alertCard.alertMetaData && this.alertCard.alertMetaData['place_of_registration']) {
      countryFromwatchlist = this.get_place_of_registration();
    }

    return countryFromwatchlist;
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
  changeSentiment(item) {
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
  generateRandomEntityId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  hashCode = function (str) {
    if (str) {
      str = str.trim();
      var hash = 0, i, chr;
      for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
      }
      return hash.toString();
    }
    else {
      return str;
    }
  }
  /* @purpose: To format the date
  * @created: 11 August 2020
  * @returns:  month+date+year
  * @author:Shravani*/
  formateTime(d) {
    if (d) {
      let pDate = new Date(d);
      return GlobalConstants.Months[pDate.getMonth()].slice(0, 3) + ' ' + pDate.getDate() + ' ,' + pDate.getFullYear();

    }
  }
  /* @purpose:on side on tab click show respective div
 * @created: 11 August 2020
 * @returns:  nothing
 * @author:Shravani*/
  RightPanelIntial(e, tabName) {
    this.activeTab = tabName;
    document.getElementById('general').style.display = "none";
    document.getElementById('vla').style.display = "none";
    document.getElementById('related').style.display = "none";
    let ele = document.getElementById(tabName).style.display = "block";
    this.tab2(e, tabName)
  }

  applyConfidence(type) {
    if (type === 'CANCEL') {
      this.confidenceFilter = 0;
      this.closeModal()
    } else {
      this.closeModal()
    }
  }
  capitalize = (s: string) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  /*
   * Purpose : If the classification is correct give the feedback
   * Author : shravani
   * Date : 28-july-2020
  */
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
      alertId: this.getRowDataOnClick.completeRowData.alertId,

    }
    this._alertService.storeArticleFeedback(data).then((response: any) => {
      if (response) {
      }
    })
  }

  /*
  * Purpose : If the classification is incorrcet
  * Author : shravani
  * Date : 28-july-2020
  */
  dislikeClassifiationArtical() {
    this.dislikeClassification = true;
    this.likeClassification = false;
    let selectedItems2 = [];
  }

  /*
   * Purpose : get the Article Classifications information
   * Author : shravani
   * Date : 28-july-2020
  */
  getArticlesInfo() {
    this._alertService.getListItemsByListType(null).then((response: any) => {
      let data = response;
      if (response) {
        this.listForDropDown = response ? response : [];
      }
    })
  }

  /*
   * Purpose : trigger when dropdown is closed
   * Author : shravani
   * Date : 30-july-2020
  */

  onDropDownClose(event) {
    if (this.dropdown) {
      this.dropdown = false;
      let reclassificationsIds = Array.from(new Set(this.selectedItems.map(item => item.listItemId)));
      let data = {
        alertId: this.getRowDataOnClick.completeRowData.alertId,
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
  makeRecurrsiveObject(object) {
    var singleObject = {};
    var finalArra = [];
    for (var key in object) {
      if (typeof object[key] === 'string') {
        singleObject[key] = object[key]
      } else if (Array.isArray(object[key])) {
        singleObject[key] = object[key].join(',')
      }
      else if (typeof object[key] === 'object') {
        singleObject = Object.assign(singleObject, object[key])
      }
    }
    for (var key in singleObject) {
      if (singleObject[key] && key !== "entity_type") {
        finalArra.push(singleObject[key])
      }
    }
    return finalArra;
  }

  /*
  * Purpose :show the rightpanel audit alerts
  * Author : shravani
  * Date : 30-july-2020
 */
  showRightPanel(param) {
    this._sharedServicesService.shareRowDAta(this.rightPanelData);
    let rightPanel = true;
    return this._sharedServicesService.hideAlertRightPanel(rightPanel);
  }

  setReasonOption() {
    var reasonIndex = this.dummyReason.findIndex((val: any) => {
      return val.status_value.toLowerCase() === this.alertCard.statusDetails.key.toLowerCase();
    });
    this.alertCard.statusDetails.reasons = reasonIndex !== -1 && this.dummyReason[reasonIndex].reasons ? this.dummyReason[reasonIndex].reasons : [];
    this.alertCard.statusDetails.reasonList = [];
    if (this.getRowDataOnClick.completeRowData && this.getRowDataOnClick.completeRowData.reason && this.getRowDataOnClick.completeRowData.reason.length > 0) {
      this.alertCard.statusDetails.reasons.forEach((reason) => {
        reason.checked = (this.getRowDataOnClick.completeRowData.reason).indexOf(reason.reason_id) !== -1 ? true : false;
      })
      this.alertCard.statusDetails.reasonList = this.alertCard.statusDetails.reasons.filter(val => val.checked).map(val => val.reason);
    }
  }
  /* @purpose: to call statusReason api and filter the data based on the response
* @created: 31 july 2020
* @returns:  nothing
* @author:Shravani*/
  getReasons() {
    this.generalSettingsApiService.getAllStatusReasons(null).then((resp: any) => {
      if (resp && resp.result) {
        this.dummyReason = resp.result.filter((val) => val.entity_name === "alert");
        this.alertCardUtilityObject.relatedArticleStatus = resp.result.filter((val) => val.entity_name === "article");
        this.setReasonOption();
      }

    })
  }

  updateReasons() {
    var statusIndex = this.alertCard.statusDetails.value.findIndex(val => val.values.code === this.alertCard.statusDetails.key)
    if (statusIndex !== -1) {
      var reasons =
        this.alertCard.statusDetails.reasonList.reduce((acc, element) => {
          this.alertCard.statusDetails.reasons.forEach(val => {
            if (element === val.reason) {
              val.checked = true;
              acc.push(val.reason_id)
            }
          });
          return acc;
        }, []);
      var data = {
        "entity_id": this.getRowDataOnClick.completeRowData.alertId,
        "entity_type": "alert",
        "reason": reasons,
        "status_key": this.alertCard.statusDetails.value[statusIndex].listItemId.toString()
      }
      if (this.getRowDataOnClick.completeRowData && this.getRowDataOnClick.completeRowData.reason) {
        var checkReasonaresame = JSON.stringify(reasons.sort((a, b) => { return a - b })) === JSON.stringify(this.getRowDataOnClick.completeRowData.reason.sort((a, b) => { return a - b })) ? false : true;
      }
      if (checkReasonaresame) {
        this.getRowDataOnClick.completeRowData.reason = reasons;
        this._alertService.updateEntityStatusReason(data).then((resp) => {
          this._sharedServicesService.showFlashMessage('Reason"s Updated Successfully', 'success');

        }).catch((er) => {
          this._sharedServicesService.showFlashMessage(er, 'danger');

        })
      }
    }
  }

  updateArticleReasons() {
    var reasons = [];
    this.alertCardUtilityObject.selectedArticleReason.forEach((element) => {
      this.alertCardUtilityObject.articleReasons.forEach((val) => {
        if (val.reason == element) {
          reasons.push(val.reason_id)
        }
      })
    })
    var statusObj = this.alertCard.statusDetails.value.filter((val) => val.values.code == this.alertCardUtilityObject.articleStatus)
    var data = {
      "entity_id": this.currentRowData.alertId,
      "entity_type": "alert",
      "reason": reasons,
      "status_key": statusObj && statusObj.length > 0 && statusObj[0].listItemId ? statusObj[0].listItemId.toString() : ''
    }
    this._alertService.updateStatusArticle(data).then((val) => {

    })

  }
  updateArticleStatus(item) {
    var openModal = this.alertCardUtilityObject.selectedArticleReason.some((arrVal) => arrVal.checked == true);
    if (openModal) {
      let currentModalRef = this.modalService.open(ConfirmationComponent, { windowClass: 'bst_modal alert-card-modal entity-identification-modal light-theme confirmMe' });
      currentModalRef.componentInstance.statusComment = 'ExistStatusReasons';
      currentModalRef.componentInstance.emitData.subscribe(data => {
        if (data) {
          if (data == 'OK') {
            this.articleStatusChange(item);
          }
        }
      });
    } else {
      this.articleStatusChange(item);
    }
  }
  articleStatusChange(item) {
    var reasonIndex = this.dummyReason.findIndex((val: any) => {
      return val.status_key == item.listItemId
    });
    this.alertCardUtilityObject.articleStatus = item.label;
    if (reasonIndex !== -1) {
      this.alertCardUtilityObject.articleReasons = this.dummyReason[reasonIndex].reasons;
    }
    this.updateArticleReasons();
  }
  /* @purpose: to close the note popover if it is open and open if it is closed
* @created: 11 August 2020
* @returns:  nothing
* @author:Shravani, Ram*/
  notesPopovertoggle(popoverElement) {
    if (!popoverElement) {
      this.alertCardUtilityObject.notesPopovertoggleObject.close();
    } else {
      this.alertCardUtilityObject.notesPopovertoggleObject = popoverElement;
    }
  }
  /* @purpose: to close the sanction popover if it is open and open if it is closed
* @created: 11 August 2020
* @returns:  nothing
* @author:Shravani, Ram*/
  sanctionPopovertoggle(popoverElement) {
    if (!popoverElement) {
      this.alertCardUtilityObject.sanctionPopovertoggleObject.close();
    } else {
      this.alertCardUtilityObject.sanctionPopovertoggleObject = popoverElement;
    }
  }

  /* @purpose: To call the api and assign the list of laguages to languageTranslateList
 * @created: 11 september 2020
 * @returns:  nothing
 * @author:Sarvani Harshita*/
  getLanguageList() {
    this.languageTranslateList = GlobalConstants.getTranslateLang
  }
  /* @purpose: To get the selected language and call the getranslatedapi to get the translated article and change the dom
* @created: 11 september 2020
* @returns:  nothing
* @author:Sarvani Harshita*/
  selectedlang(event, displayname) {
    if (displayname == this.alertCardUtilityObject.originalang || displayname==this.selectedCountryDisplayName) {
      this.alertCardUtilityObject.langselected = false
      this.financeArticleDetails.title = this.tempTitle;
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

        if(response.title){
          this.financeArticleDetails.title = response.title;
        }
        else{
          this.financeArticleDetails.title = this.tempTitle
        }
      })
        .catch((err) => {
        })
    }
  }
  ValidateDate(val) {
    if (val && val.indexOf && (val.indexOf('/') > -1 || val.indexOf('-') > -1)) {
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
      "articleAlertId": this.currentRowData.alertId,
      "entity_type": "article",
      "reason": reasons,
      "status_key": statusObj && statusObj.length > 0 && statusObj[0].status_key ? statusObj[0].status_key.toString() : ''
    }
    this._alertService.updateStatusArticle(data).then((val) => {

    })
  }
  toggleShowOnlyRelatedEntities(event) {
    this.showKeywords(event.currentTarget.checked);
  }

  showKeywords(showOnlyRelatedEntities: boolean){
    let checkedTabs = {}
    this.financeArticleDetails.resultskeywordsOrigianal.sort(this.dynamicSort("type"));
    this.financeArticleDetails.resultskeywordsOrigianal.forEach((keywordTabs, tabindex) => {
      keywordTabs.values.forEach((keywords, valueindex) => {
        if (showOnlyRelatedEntities) {
          keywordTabs.disabled = true;
          if (keywords.InBOE && !keywordTabs.tabCheck) {
            keywordTabs.tabCheck = true;
            checkedTabs['keytab' + keywordTabs.type] = true;
          } else {
            keywordTabs.tabCheck = false;
          }
          keywords.checked = keywords.InBOE;
          keywords.disabled = !keywords.InBOE;
        } else {
          keywordTabs.tabCheck = true;
          keywords.checked = true;
          keywords.disabled = false;
        }
        this.highlightKeywords(tabindex, valueindex, keywords.checked, ('keyword' + valueindex + '-' + tabindex))
      });
    });
    this.financeArticleDetails.resultskeywords = this.financeArticleDetails.resultskeywordsOrigianal;
    this.showOnlyRelatedEntities = showOnlyRelatedEntities;
    setTimeout(() => {
      this.activeKeywordsPanels = Object.keys(checkedTabs);
    }, 10);
  }

  /**
   * @purpose: Function to sort alphabetically an array of objects by some specific key.
   * @created: 31 December 2020
   * @author: Upeksha
   * @param {String} property Key of the object to sort.
   */
  dynamicSort(property) {
    var sortOrder = 1;

    if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }

    return function (a,b) {
      if(sortOrder == -1){
        return b[property].localeCompare(a[property]);
      }else{
        return a[property].localeCompare(b[property]);
      }
    }
  }
  /* purpose: To get id of selected watchlist person
  * created: 12 Oct 2020
  * returns:  returns the person or organization id
  * author:shravani*/
  getRCARelationData() {
    if (this.watchlistData && this.watchlistData.length) {
      this.RCAId = this.watchlistData && this.watchlistData[this.selectedWatchListIndex] && this.watchlistData[this.selectedWatchListIndex]['basic_info'] && this.watchlistData[this.selectedWatchListIndex]['basic_info']['id'] ? this.watchlistData[this.selectedWatchListIndex]['basic_info']['id'] : ''
    }
    if (this.RCAId != '') {
      this._alertService.getPEPandRCARelation(this.RCAId).then((resp: any) => {
        if (resp) {
          this.RCAList = resp && resp.results ? resp.results : [];
        }
      }).catch((err) => {
      })
    }
  }

  /* purpose: Reference to close the popover
  * created: 12 Oct 2020
  * returns:  nothing
  * author:shravani*/
  RCAPopoverToggle(popoverElement) {
    if (!popoverElement) {
      this.alertCardUtilityObject.RcaPopoverToggleObject.close();
    } else {
      this.alertCardUtilityObject.RcaPopoverToggleObject = popoverElement;
    }
  }

  /*
    * @purpose: change the active tab (alert card)
    * @created: 6 nov 2020
    * @author: Kasun
  */
  changeActiveAlertCardPanel(tabName): void {
    this.alertCardActiveTab = tabName;
    document.getElementById('alertCardGeneral').style.display = "none";
    document.getElementById('alertCardRelated').style.display = "none";
    let ele = document.getElementById(tabName);
    if (ele !== null) {
      ele.style.display = "block";
    }
  }

   /* purpose: checking weather alert has permission to change the status.
  * created: 3 Nov 2020
  * returns:  true/false
  * author:shravani*/

  getAlertStatusChangePermission() {
    this.entityIdentification();
    let statusObject: any = null;
    this.currentRowData.status.value.forEach((status) => {
      if (status.values.code.toLowerCase() == this.currentAlertStatus.toLowerCase()) {
        statusObject = status.values;
      }
    })
    let params = {
      identifiedEntityId: this.watchlistData[this.selectedWatchListIndex]['basic_info']['id'].toString(),
      isEntityIdentified: true,
      classification: this.getClassifications(this.watchlistData[this.selectedWatchListIndex]['entries']),
      source: this.alertMetaData['screening_type'],
      asignee: (this.getRowDataOnClick.completeRowData.asignee) ? this.getRowDataOnClick.completeRowData.asignee : {},
      statuse: statusObject ? statusObject : {},
      alertId: this.getRowDataOnClick.completeRowData.alertId,
    }
    let alertStatusObj = params;
    this._alertService.getAlertStatusPermission(alertStatusObj, false).subscribe((response) => {
      if (response) {
        this.alertStatusPermissionFlag = !(response && response.RESPONSE ? response.RESPONSE : false);
      }
      this.getChangeAlertStatusPermission()
    })
  }

  /*
  * purpose: Listen to the alert change in related alert tab then change the alert view according to that
  * created: 11 Nov 2020
  * author: Kasun
  */
  alertChangedFromRelatedAlertTab($event) {
    if(this.alertCardActiveTab === 'alertCardRelated') {
      this.changeActiveAlertCardPanel('alertCardGeneral');
      this.relatedAlertCard= true;
      this.getRelatedAlertIndex($event);
    }

    if (this.activeTab === 'related') {
      this.RightPanelIntial($event,'general');
      this.relatedAlertCard= true;
      // this.getRelatedAlertIndex($event);

      this._alertService.getRelatedAlert.subscribe((response: any) => {
        if(this.relatedAlertCard){
          let relatedItem;
          let relatedId = $event
          var relatedData=this.getCompleteRowData(response);
          for (let i = 0; i < relatedData.length; i++) {
            if (relatedId === relatedData[i].alertId) {
              relatedItem = relatedData[i];
            }
          }

          var StatusListPromise_new= new Promise((resolve, reject) => {
            this._generalSettingsApiService.getEntityWorkflows().then((res)=>{
              if(res  && res[0])  {
                var alertWorkflow = res.filter((item)=>{
                  return item.entityName.toLowerCase() == "alert"
                });

                this._alertService.getStatus_new(alertWorkflow[0].workflowModelKey).subscribe((statusList)=>{
                  statusList.forEach((e)=>{
                    var key = Object.keys(e)[0];
                    let statusObj = {
                            label: e[key],
                            disable: false,
                            values: key,
                            listItemId: key
                    }
                    this.statusObjs_new.push(statusObj)
                  })
                });
              }
              setTimeout(() => {
                    resolve("");
                  }, 500);
            }).catch(()=>{
              setTimeout(() => {
                    resolve("");
                  }, 500);
            });
          });

          this.currentRowData = relatedItem

          var lowerCase = relatedItem.completeRowData.statuse.code.toLowerCase();
          lowerCase = lowerCase.replace('_',' ');

          this.currentRowData = relatedItem
          this.getRowDataOnClick = relatedItem

          this.showReviewerIcon = this.currentRowData && this.currentRowData.showReviewerIcon ? this.currentRowData.showReviewerIcon : false;
          this.customTemplateClass = (relatedItem.colDef && relatedItem.colDef.customTemplateClass) ? relatedItem.colDef.customTemplateClass : ''
          this.currentAlertStatus = (this.currentRowData.completeRowData && this.currentRowData.completeRowData.statuse && this.currentRowData.completeRowData.statuse.code) ? this.currentRowData.completeRowData.statuse.code.toLowerCase() : "";
          this.validate = (this.currentRowData.completeRowData && this.currentRowData.completeRowData && this.currentRowData.completeRowData.identityApproved) ? this.currentRowData.completeRowData.identityApproved : false;

          var lowerCase = relatedItem.completeRowData.statuse.code.toLowerCase();
          lowerCase = lowerCase.replace('_',' ');

          this.setRelatedRowData(relatedItem)

          if (!(this.currentAlertStatus == 'primary processed' || this.currentAlertStatus == 'new' || this.currentAlertStatus == 'identity rejected' || this.currentAlertStatus == 'identity rejected, needed review' || this.currentAlertStatus == 'identity approved, needed review' || this.currentAlertStatus == 'in progress' || this.currentAlertStatus == 'identity rejected, pending review' || this.currentAlertStatus == 'conflict reassess' || this.currentAlertStatus == 'identity approved')) {
            this.openAlertCard(this.alertCardBody, true);
            this.relatedAlertCard = false;
          } else {
            this.closeModal();
            this.open(this.EICard);
            this.relatedAlertCard = false;
          }

        }
      })
    }
  }

  getSelectedStatusDisplayValue(code: string): string {
    const selectedStatus = this.latestStatusList.filter((status) => {
      return status.key === code;
    })

    if(selectedStatus.length > 0){
     const displayName = selectedStatus[0].values.displayName;
     return displayName;
    }
  }

  isCommentPermissionView() {
    const commentBoxPermission = this.getDomainPermissions(this.permissionIdsList, 'commentBox');
    const commentBoxPermissionLevel = this._commonServices.getPermissionStatusType(commentBoxPermission);
    this.commentBoxPermissionView = false;
    if (commentBoxPermissionLevel == 'view') {
      this.commentBoxPermissionView = true;
    }
  }

  getDomainPermissions(value, arg) {
    let result;
    if (value && value.length > 0) {
      result = value.find(ele => ele.hasOwnProperty(arg));
    }
    if (result) {
      return result[arg];
    }
    else {
      return {}
    }
  }

  //  getFormattedDate(date: string): Date {
  //   let dateReturn;
  //   try {
  //     const parts: string[] = date.match(/(\d+)/g);
  //     const dateSet = new Date(+parts[2], +parts[1] - 1, +parts[0]);
  //     dateReturn = datePipe.transform(dateSet,(this.dateFormat.ShortDateFormat))
  //   } catch (error) {
  //     dateReturn = 'Invalid Date';
  //   }
  //   return dateReturn;
  // }
  getFormattedDate(date: string): Date {
    let dateReturn;
    try {
      dateReturn = datePipe.transform(date, 'dd/MM/yyyy')
    } catch (error) {
      dateReturn = 'Invalid Date';
    }
    return dateReturn;
  }

  getPossibleStates( status?: any){
     this._generalSettingsApiService.getEntityWorkflows().then((res)=>{
        if(res  && res[0])  {
          var alertWorkflow = res.filter((item)=>{
            return item.entityName.toLowerCase() == "alert"
          });

          var currentState =  (this.currentRowData.statusKeys.find((i) =>  i.listItemId == this.currentAlertStatus));

          // this.latestStatusList = this.currentRowData.status.value;
          if (currentState) {
            this._alertService.getPosibleStatus_new(
              "A" + this.currentRowData.completeRowData.alertId,
              currentState.listItemId,
              alertWorkflow[0].workflowModelKey).subscribe((statusList)=>{
              this.AllowedStatusList = []; //this for the status select

              var currentStateObj = this.currentRowData.status.value.find((i) =>  i.values.code == this.currentAlertStatus);
              currentStateObj.key =  currentState.listItemId;
              this.AllowedStatusList.push(currentStateObj);

              statusList.forEach((e)=>{
                var key = e.key;
                let statusObj = this.currentRowData.status.value.find((i) =>  i.values.code == e.key);
                if(statusObj){
                  statusObj.key = key;
                  this.AllowedStatusList.push(statusObj)
                }
              })

              this.latestStatusList = this.AllowedStatusList;
            },(err)=>{
              this.AllowedStatusList = [];
              var currentStateObj = this.currentRowData.status.value.find((i) =>  i.values.code == this.currentAlertStatus);
              currentStateObj.key =  currentState.listItemId;
              this.selectedIcon = currentStateObj.values.icon;
              this.selectedIconColor = currentStateObj.values.colorCode
              this.AllowedStatusList.push(currentStateObj);
              this.latestStatusList = this.AllowedStatusList;
            });

          }
        }
      }).catch(()=>{
        this._sharedServicesService.showFlashMessage(this.getLanguageKey("Errorsoccured"), 'danger');
      });
  }

  // remove file from add comments
  // 2022-04-18
  // Lanka
  removeAttachment(i) {
    this.attachmentList.splice(i, 1);
  }

  /** Navigating to entity page on name click
   */
   navigateToEntity(entityUrl) {
    // old function
    // let eid = entityUrl.split('/')[6];
    // let url;
    // if (entityUrl && eid) {
    //   if (this.currentRowData.completeRowData.entiType == 'person') {
    //     url = AppConstants.Ehub_UI_API + 'element-new/dist/new/#/element/entity/overview?query=' + this.currentRowData.completeRowData.entityName + '&eId=' + eid
    //   } else {
    //     url = AppConstants.Ehub_UI_API + 'entity#!/company/' + this.searchData.entity_id + '?eid=' + eid
    //   }
    //   window.open(url, '_blank', 'noopener');
    // }

    // new function BE Passing URL simply pass to FE side.
    if (entityUrl) {
      this.window.open(entityUrl, '_blank', 'noopener');
    }
  }

  /**
   * Rdirect to case details page
   * @param caseId case id
   */
  openCase(caseId: number) {
    if(this.caseDetailsPermission == 'none') return;

    let caseUrl = '/element/case-management/case/'+caseId;
      if (GlobalConstants.systemSettings.openInNewtab) {
        const url = this.router.serializeUrl(this.router.createUrlTree([caseUrl]));
        this.window.open('#' + url, '_blank', 'noopener');
      } else {
        this.router.navigate([caseUrl]);
      }
  }

  /**
   * Get user permission level to access case details
   * @returns permission level as 'none' | 'view' | 'fuel'
   */
  getUserCasePermission(): string {
    const permissions: any[] = this._sharedServicesService.getPermissions();
    if (permissions.length) {
      const caseWorkbenchPermission = permissions[1].caseManagement.caseWorkbench;
      const caseDetailsPermissions = this._commonServices.getDomainPermissions(caseWorkbenchPermission, 'caseDetails');
      return this._commonServices.getPermissionStatusType(caseDetailsPermissions);
    }

    return "none";
  }

  getChangeAlertStatusPermission() {
    const permissions: any[] = this._sharedServicesService.getPermissions();
    if (permissions.length) {
      const changeAlertStatusPermission = this._commonServices.getDomainPermissions([permissions[0].alertsData], 'Change alert status');
      if (this._commonServices.getPermissionStatusType(changeAlertStatusPermission) == 'view') {
        this.alertStatusPermissionFlag = true
      }
    }
  }

  public trackById(_, item): string {
    return item.id;
  }
  public trackByDocName(_, item): string {
    return item.docName;
  }
  public trackByLabel(_, item): string {
    return item.label;
  }
  public trackByName(_, item): string {
    return item.name;
  }
  public trackBySourceName(_, item): string {
    return item.sourceName;
  }
  public trackByCode(_, item): string {
    return item.code;
  }
  public trackByType(_, item): string {
    return item.type;
  }
  public trackByDisplayName(_, item): string {
    return item.displayName;
  }
  public trackByValuesCode(_, item): string {
    return item.values.code;
  }
  public trackByReason(_, item): string {
    return item.reason;
  }
  public trackByStatusValue(_, item): string {
    return item.status_value;
  }

}

