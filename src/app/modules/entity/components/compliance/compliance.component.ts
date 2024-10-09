import { Component, OnInit,ChangeDetectorRef,ViewChild, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as d3 from "d3";

import { NgbModal,NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { TopPanelConstants } from '../../constants/top-panel-constants';

import { EntityFunctionService } from '../../services/entity-functions.service';
import { EntityCommonTabService } from '../../services/entity-common-tab.service';
import { EntityApiService } from '../../services/entity-api.service';
import {EntityOrgchartService} from '../../services/entity-orgchart.service';
import {SharedServicesService} from '../../../../shared-services/shared-services.service';
import { EntityConstants } from '../../constants/entity-company-constant';
import {Screeningconstructor} from '../../common-classes/ScreeningConstructor';
import {EnityEditComponent } from '../../modals/enity-edit/enity-edit.component';
import {AddNewEntityComponent} from '../../modals/add-new-entity/add-new-entity.component';
import {GraphchangesourceconfirmationComponent} from  '../../modals/graphchangesourceconfirmation/graphchangesourceconfirmation.component';
import {EntityShareHolderEvidenceModalComponent} from  '../../modals/entity-share-holder-evidence-modal/entity-share-holder-evidence-modal.component';
import { findIndex, find, isEmpty, uniqBy, filter, uniq } from 'lodash-es';
import { AppConstants } from '@app/app.constant';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { TranslateService } from '@ngx-translate/core';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { WINDOW } from '../../../../core/tokens/window';

declare var primitives: any
declare var $: any

@Component({
  selector: 'app-compliance',
  templateUrl: './compliance.component.html',
  styleUrls: ['./compliance.component.scss'],
//   changeDetection: ChangeDetectionStrategy.OnPush

})
export class ComplianceComponent implements OnInit {
  @ViewChild('graphtab',{static:false}) public graphtab: NgbTabset;
  private orgChartReady: boolean = true;
  public newLink :any;
  private entityDetails: any = {};
  public message: {};
  public sticky_selected_type = '';
  public sticky_selected_section = '';
  public pageloader = EntityConstants.basicSharedObject.pageloader;
  public countryNames: any[] = []
  public customChartView: boolean = false;
  public entitySearchResult :any= {
    list: EntityConstants.basicSharedObject.list,
    is_data_not_found: EntityConstants.basicSharedObject.is_data_not_found,
  };
  public actualScreeningData:Screeningconstructor[] = [];
  public screeningData: Screeningconstructor[]=[];
  public summaryScreenig: Screeningconstructor[]=[];
  public personEntitytype = ['person'];
  public filteredChart = EntityConstants.basicSharedObject.filteredChart;
  public identifiedRisk:number =0;
  public ScreeningRisk:number =0;
  public unique_officer_roles_array:any[] =[];
  public Rolechecklist = {
		all_checkedRole: true,
		singlearray: []
  };
//   public managerDetails = {"imgUrl": "assets/images/alex.png","managerName": "Dominik RudersDorf","number": '+49 30 49084353'};
  public mainAdverseNews = [];
  public hierarchyData:any =[];
  public originalHierrachyData:any =[];
  public subsidariesfilteredData:any =[];
  public isCustomAvailable:boolean =false;
  public mainofficersNews:any =[];
  public intialSelectedRoles:any =[];
  public totalScreenedEntity :any[]=[];
  public subsidaryFilterData :any=[];
  public subsidaryFilterData_originalView :any=[];
  public subsidaryFilterData_customView :any=[];
  public generateReport = false;
  public complianceRightAdverseNews:any = [];

public filterIndustry:any[] =[];
 public conplianceIdentifiers =  EntityConstants.utilityConstant.conplianceIdentifiers;
  public conplianceMapKeysReport = EntityConstants.utilityConstant.conplianceMapKeysReport;

  public subsidiaries :any= [{
	"name": '',
	"source_url": '',
	"subsidiaries": [],
	"natures_of_control": [],
	"parent_companies": []
}];
	public mainCompanyobject = {
		id: 'p0',
		indirectPercentage: 0,
		title: this.entityDetails && this.entityDetails['vcard:organization-name'] && this.entityDetails['vcard:organization-name'].value ? this.entityDetails['vcard:organization-name'].value : '',
		totalPercentage: 0,
		entity_id: "orgChartmainEntity"
	};
	public showSubsidaries: boolean = false;
	public ownershipCount = {
		parentCount: 0,
		subsidaryCount: 0
	};
	public CountryShareHolders :any[] =[];
	public totalOfficers_link = [];


	public filteredApplied :any = 0;

	public CountryOperations :any[] =[];
	public CountryOperationsViewForMap :any[] =[];
	public  nested_countries_report_data :any[] =[];
	public entites_renderedIn_chart :any=[];
	public orgChartOptions :any= {};
	public entityDataOnClikOfOdg :any  = [];
	public FlagTooltipData :any ={}
	public 	div4 = d3.select("body").append("div").attr("class", "selectedEntityOptions").style("position", "absolute").style("width", "auto").style("max-height", "none").style("height", "auto").style("min-width", "auto").style("max-width", "376px").style("background", "rgba(84, 84, 84,1)").style("border-radius", "10px").style("display", "block").style("z-index", "99999").style("box-shadow", "0 2px 6px 0 rgba(0, 0, 0, 0.71);");
	public  div3 = d3.select("body").append("div").attr("class", "entity_popover").style("position", "absolute").style("width", "auto").style("max-height", "none").style("height", "auto").style("min-width", "300px").style("max-width", "376px").style("background", "rgba(84, 84, 84,1)").style("border-radius", "10px").style("display", "none").style("z-index", "99999").style("box-shadow", "0 2px 6px 0 rgba(0, 0, 0, 0.71);");
	public popOverEditDataForOwnership :any ={};
	public  deleteSelectedEntity:any ={};
	public corporateOlddata :any='';
	public graphUtilites = {
		originalClicked:false
	};
	public sliderUtilitesobj ={
		sliderMinValue : 25,
		sliderMaxValue : 100
	}
	public appliedOwnerShipControlPercentageMinVal = 25;
	public appliedOwnerShipControlPercentageMaxVal = 100;
	public sourceList :any = [];
	public scrollbarOptions = { axis: 'yx', theme: 'minimal-dark' };
	public totalSelectedEntiesForScreening = [];
	public activateScreeningEnabled = false;
	public enableSelectUnselect = false;
	public popoverDetails :any = {};
	public createNewArrayReportData : any = [];
	public customerOutreachDoc :any= [];
	public EditEntityTypeList:any =[];
	public addEntityTypeList:any = [];
	public mouseevent:MouseEvent;
	public rootComponentData :any = {
		hyperLinksNewTab : true,
		companyViewSelected : "default",
		qbServeyID : 612, // default qb(Questionnaire) servey Id
		customerLogo:'',
		genpactReportV2 : true,
		complianceReport : false,
		sourcesListsData : [],
		allowChecklist:true,
		uploadDocTypeList:[],
		maxFile_size:0,
		maxFileSize:0,
		identifier:''
	}
	public  worldComplianceLocationsOptionsAtBottom :any = {
		container: "#companyComplianceWorldMap",
		uri1: "../../../../../assets/js/worldCountries.json",// Url of data
		uri2: "../../../../../assets/js/worldMapData.json",// Url of data
		height: 300,
		width: 500,
		markers: {}
	}
	public complexObj = {
		complexOwnershipStructure: false
	}
	public complexOwnershipToggle = false;
	public complexStructureLoader :boolean = false;
  constructor(
    public entityCommonTabService: EntityCommonTabService,
    private entityFunctionService: EntityFunctionService,
    public activatedRoute: ActivatedRoute,
	public entityApiService: EntityApiService,
	private ref: ChangeDetectorRef,
	public  modalService: NgbModal,
	public ngbTabset:NgbTabset,
	private _commonService : CommonServicesService,
	private translateService: TranslateService,
	public entityOrgchartService:EntityOrgchartService,
	public sharedServicesService : SharedServicesService,
	@Inject(WINDOW) private readonly window: Window
  ) {
	this.entityCommonTabService.officerObservable.subscribe((handledofficerData) => {
      if (handledofficerData && handledofficerData['mixed_company_key_executives'].length === 0) {
        this.entitySearchResult.is_data_not_found.is_keyExecutive = false;
      }
      if (handledofficerData&&  handledofficerData['has_company_members'].length === 0) {
        this.entitySearchResult.is_data_not_found.is_company_member = false;
	  }
	});
	this.entityCommonTabService.iniateOwnershipPath.subscribe((data) => {
		this.orgChart();//InitalizeChart
		this.CreatefinalJson(EntityConstants.dummyscreeening.data, '', 'vlaContainer_customView', true);//uncomment to bypass
		this.entityCommonTabService.sendTocompanyInfo(data)
		// this.getOwnershippath(data, true);
		this.complianceCountriesofOperation(data);
		// this.apiCallGetSources();
		// this.customerOutreach();
		// let ele:any = document.getElementById("generateReport")
		// ele.disabled = false;

	  });

	this.entityOrgchartService.modified_screeningObservable.subscribe((changedData)=>{
		  if(changedData &&(changedData.screeningData.length > 0 || changedData.subsidaryFilterData.length > 0)){
			  this.screeningData = changedData.screeningData;
			  this.actualScreeningData = changedData.actualScreeningData;
			  this.subsidaryFilterData = changedData.subsidaryFilterData;
			  if(changedData.fromScreening){
				this.screeningData = changedData.screeningData;
				}else{
				  this.screeningTableOriginal_custom(this.actualScreeningData);
			  }
			  this.showSubsidariesInchart(this.showSubsidaries);
			  this.pageloader.treeGraphloader = false;
			  this.pageloader.screeningLoader = false;
			//   this.selectedMultipleeEntities = [];
			  this.ref.markForCheck();

		}

	  });
  }
  queryParams: any;
  ngOnInit() {
	this.queryParams = this.entityFunctionService.getParams();
	EntityConstants.queryParams = this.queryParams;
	//this.mScrollbarService.initScrollbar(document.body, { axis: 'y', theme: 'dark-3' });
	this.getSystemSettings();
	this.getLanguage();
  }



  getLanguage() {
    let getLanguageData = (language) => {
	//   var key = language.slice(0, 3).toLowerCase();
	  let key = this._commonService.get_language_name(language)
	  var filename = key + '_entity.json'
      var param = {
        "fileName": filename,
        "languageName": language,
        "token": AppConstants.Ehubui_token
      };
	  let url = AppConstants.Ehub_Rest_API + 'fileStorage/downloadFileByLanguageAndFileName?fileName=' + param.fileName + '&languageName=' + param.languageName;
      this.translateService.setDefaultLang(AppConstants.Ehub_Rest_API + 'fileStorage/downloadFileByLanguageAndFileName?fileName=en_entity.json&languageName=English');

      this.translateService.use(url).subscribe(
        res => {
			GlobalConstants.languageJson = res;
          this._commonService.sendLanguageJsonToComponents(res);
        },
		error =>{
			if(error.status == 404 && key == 'de'){
			  this.sharedServicesService.showFlashMessage('german file not found, loading default language..', 'danger');
			  getLanguageData('english');
			} else if(error.status == 404 && key == 'en'){
			  setTimeout(() => {
				this.sharedServicesService.showFlashMessage('english file '+error.url+' is missing', 'danger');
			  },3000)
			}

		}
      );

    //   this._commonService.getModuleJsonData(param).subscribe((resp) => {
    //     if (resp) {
    //       GlobalConstants.languageJson = resp;
    //       // this._commonService.sendLanguageJsonToComponents(resp);
    //     }
    //   })
    }
    if(GlobalConstants.systemSettings['ehubObject']['language']){
      getLanguageData(GlobalConstants.systemSettings['ehubObject']['language']);
    }
    else{
      this._commonService.getSystemSettings().then((resp) => {
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

  getSystemSettings(){
	this.entityApiService.getGeneralSettings().subscribe((data)=>{
		if(data && data['General Settings']){
			data['General Settings'].forEach((val,k)=>{
				if(!val.options && val.name == "Open link in a new tab"){
					this.rootComponentData.hyperLinksNewTab = val.selectedValue == "On"?true:false;
				}
				if(val.name == "Company View"){
					this.rootComponentData.companyViewSelected = val.selectedValue;
				}
				if(!val.options && val.name == "Allow checklist"){
					this.rootComponentData.allowChecklist = val.selectedValue == "On"?true:false;
				}
				if(val.name == "Compliance Report"){
					this.rootComponentData.complianceReport = val.selectedValue == 'default' ? false: true;
					if(val.selectedValue && val.selectedValue.toLowerCase() == 'genpact v2'){
						this.rootComponentData.genpactReportV2 = true;
					}
				}
				if(val.defaultValue == "On" && val.selectedValue == "On" && val.section == "File Settings"){
					TopPanelConstants.uploadDocTypeList.push(val.name);
				}
				if(val.name == "Maximum file size allowed" && val.section == "File Settings"){
					TopPanelConstants.maxFile_size = val.selectedValue;
					var maxFileSizeNum = TopPanelConstants.maxFile_size.match(/\d+/g).map(Number);
					TopPanelConstants.maxFileSize = maxFileSizeNum[0]*1048576;
				}
				if(val.section.toLowerCase() === 'branding'){
					this.rootComponentData.customerLogo = val.customerLogoImage || val.defaultValue;
				}
				if(val.options && val.options.length && val.name.toLowerCase() == 'questionnaries'){
					val.options.forEach(v1 => {
						if(v1.selected){
							this.rootComponentData.qbServeyID = v1.attributeId;
					    }
					});
				}
			})
			this.rootComponentData.identifier = this.queryParams.query;
			TopPanelConstants.utilityObject.rootComponentData = this.rootComponentData;
			this.sharedServicesService.setGeneralSettings(this.rootComponentData);//here we are sharing the rootcomponent from compliance to shared srvice to submenu
		}
	},(error)=>{

	});
}


  /* @purpose:  Ownership data Compliance Data
     *
     * @created: 07 may 2018
     * @params: type(string)
     * @returns: no
     * @author: Ram Singh */
  getOwnershippath(complianceData, firsttime) {
    this.entityDetails = complianceData;
    const param = {
      identifier: this.queryParams.query,
      url: {
        "url": EntityConstants.basicSharedObject.org_structure_link
      },
      numnberoflevel: 5,
      lowRange: 25,
      highRange: 100,
      organisationName: complianceData && complianceData['vcard:organization-name'] && complianceData['vcard:organization-name'].value ? complianceData['vcard:organization-name'].value : '',
      juridiction: this.queryParams.cid ? (this.queryParams.cid).toUpperCase() : complianceData && complianceData['isDomiciledIn'] && complianceData['isDomiciledIn'].value ? complianceData['isDomiciledIn'].value : '',
      noOfSubsidiaries: 5,
      isSubsidiariesRequired: false,
      Start_date: EntityConstants.basicSharedObject.filteredChart.toyear,
      End_date: EntityConstants.basicSharedObject.filteredChart.fromyear
    };

    this.entityApiService.getOwnershipPath(param).subscribe((response: { path: string }) => {

      EntityConstants.basicSharedObject.curr_time_to_20min = new Date();
      if (response && response.path) {
        if (firsttime) {
          EntityConstants.basicSharedObject.curr_time_to_20min.setMinutes(EntityConstants.basicSharedObject.curr_time_to_20min.getMinutes() + 20);
          this.updateOwnershipRecurssive(response.path);
        } else {
          setTimeout(function () {
            this.updateOwnershipRecurssive(response.path)
          }, 15000);
        }
      }
    }, (error) => {

    });
  }




  public chartTimeIntreval(path) {
    var curr_time = new Date();
    if (curr_time.getTime() <= EntityConstants.basicSharedObject.curr_time_to_20min.getTime()) {
      setTimeout(() => {
        this.updateOwnershipRecurssive(path);
      }, 15000);
    }
    // else if (subsidaryFilterData.length === 0) {
    // 	this.pageloader.screeningLoader = false;
    // 	this.pageloader.treeGraphloader = false;
    // 	this.entitySearchResult.is_data_not_found.is_rightScreening_data = false;
    // 	this.pageloader.loadingText = false;
    // 	var mainCompanyobject = {
    // 		id: 'p0',
    // 		indirectPercentage: 0,
    // 		title:   this.entityDetails &&   this.entityDetails['vcard:organization-name'] &&   this.entityDetails['vcard:organization-name'].value ?   this.entityDetails['vcard:organization-name'].value : '',
    // 		totalPercentage: 0,
    // 		entity_id: "orgChartmainEntity"
    // 	};
    // var currentOPts = $.extend(true, {}, options);
    // currentOPts.items = [mainCompanyobject];
    // $('#vlaContainer').find('.orgdiagram .custom-scroll-wrapper').remove();
    // $("#vlaContainer").famDiagram(currentOPts);
    // orgChartRemake(currentOPts)
    // }
  }
  private firstReload = [];
  private firsttimeChart = true;
  public repeater = 0;
  // this.createNewArrayReportData = [];
  updateOwnershipRecurssive(path) {


    this.entityApiService.getCorporateStructure(path).subscribe((response: any) => {
		this.repeater = this.repeater + 1;

      if (response && response.status && response.status !== "completed" || response.data.length=== 0) {// && this.entitySearchResult.list.sourceFilterChart_not_Started
        this.chartTimeIntreval(path);
        this.pageloader.loadingText = true;//on the flag when api is in progress
        this.pageloader.disableFilters = true;
        $("#yearsliderCompliance").slider({ disabled: true });
        $("#sliderAvgExpenCompliance").slider({ disabled: true });//filter disable is off when API is completed
        $("#sanctionsliderCompliance").slider({ disabled: true });//filter disable is off when API is completed
        $("#pepliderCompliance").slider({ disabled: true });//filter disable is off when API is completed
      } else {

        this.pageloader.disableFilters = false;
        $("#yearsliderCompliance").slider({ disabled: false });
        $("#sliderAvgExpenCompliance").slider({ disabled: false });//filter disable is off when API is completed
        $("#sanctionsliderCompliance").slider({ disabled: false });//filter disable is off when API is completed
        $("#pepliderCompliance").slider({ disabled: false });//filter disable is off when API is completed
		this.pageloader.loadingText = false;//off  the loading text flag when api is completed
		if (this.complianceRightAdverseNews.length === 0) {
			this.entitySearchResult.is_data_not_found.is_rightadverseNews = false;
		}
		let ele:any = document.getElementById("generateReport")
		ele.classList.remove("c-ban");
		ele.disabled = false;

	}
      if (response.data && response.data && response.data.length > 0) {
        response.data.forEach((val, key) => {
          val.country = !val.country ? (val.jurisdiction ? this.getCountryName(val.jurisdiction, 'fromNode') : '') : val.country;
        });
        if (this.firsttimeChart) {
          this.firstReload = ($.extend(true, [], response.data));
          this.customerOutreachDataForReport(response);
          var divId = 'vlaContainer';
          if (this.customChartView && this.entitySearchResult.list.graphviewIndex) {
            divId = "vlaContainer_customView";
          } else if (this.customChartView && !this.entitySearchResult.list.graphviewIndex) {
            divId = 'vlaContainer_originalView';
          }
		  this.entitySearchResult.list.currentVLArendered = divId;
		  this.corporateOlddata = JSON.stringify(response.data);
          this.CreatefinalJson(response.data, '', divId, response.status);
          this.firsttimeChart = false;
        } else {

          var corporatenewdata = JSON.stringify(response.data);
          if (corporatenewdata !== this.corporateOlddata) {
            this.firstReload = ($.extend(true, [], response.data));
            var divId = 'vlaContainer';
            if (this.customChartView && this.entitySearchResult.list.graphviewIndex) {
              divId = "vlaContainer_customView";
            } else if (this.customChartView && !this.entitySearchResult.list.graphviewIndex) {
              divId = 'vlaContainer_originalView';
            }
            this.entitySearchResult.list.currentVLArendered = divId;
            this.CreatefinalJson(response.data, '', divId, response.status);
          }
		}

		this.pageloader.screeningLoader = false;
        this.pageloader.coropoateloader = false;
        this.pageloader.treeGraphloader = false;
        var curr_time = new Date();
        if (curr_time.getTime() > EntityConstants.basicSharedObject.curr_time_to_20min.getTime()) {
          this.pageloader.loadingText = false;
        }
      }
    },
      (error) => {
        this.chartTimeIntreval(path);
        this.pageloader.screeningLoader = false;
        this.pageloader.coropoateloader = false;
        this.pageloader.treeGraphloader = false;
        this.pageloader.loadingText = false;
      });
  }

  /* @purpose:To map the country based on country code in the Report
	* @created: 7 June 2019
	* @params: type(string)
		* @returns country name.
	* @author: Amarjith*/
  getCountryName = function (countryCode, fromNode) {
    if (countryCode.toLowerCase() === 'us') {
      countryname = 'United States Of America';
      if (fromNode) {
        countryname = 'United State';
      }
      return countryname;
    }
    var curObj = this.countryNames.find(obj => {
      return obj.jurisdictionName.toLowerCase() === countryCode.toLowerCase();
    });
    if (curObj) {
      var countryname = curObj.jurisdictionOriginalName ? curObj.jurisdictionOriginalName : '';
      return countryname;
    }
  }
	orgChart() {
		var options = new primitives.famdiagram.Config();
		options.pageFitMode = 0;
		options.cursorItem = 2;
		options.linesWidth = 1;
		options.linesColor = "rgb(88, 107, 113)";
		options.normalLevelShift = 20;
		options.dotLevelShift = 20;
		options.lineLevelShift = 20;
		options.normalItemsInterval = 10;
		options.dotItemsInterval = 10;
		options.lineItemsInterval = 10;
		options.hasSelectorCheckbox = primitives.common.Enabled.False;
		options.defaultTemplateName = "info";
		options.templates = [this.getInfoTemplate()];
		options.onItemRender = this.onTemplateRender;
		options.onHighlightChanged = function (e, data) {
			var name = "";
			var subtitile = "";
			if (data && data.context) {
				this.FlagTooltipData = (data && data.context) ? data.context : '';
			}
			$("#vlaContainer").find(".orgdiagram").find('.orgChartParentEntity').parent().find("i.fa-university").remove();
			$("#vlaContainer").find(".orgdiagram").find('.orgChartParentEntity').parent().find("i.fa-user").remove();
			$("#vlaContainer").find(".orgdiagram").find(".orgChartmainEntity").parent().find("i.fa-university").remove();
			$("#vlaContainer").find(".orgdiagram").find(".orgChartmainEntity").parent().find("i.fa-user").remove();
			$("#vlaContainer").find(".orgdiagram").find(".orgChartsubEntity").parent().find("i.fa-university").remove();
			$("#vlaContainer").find(".orgdiagram").find(".orgChartsubEntity").parent().find("i.fa-user").remove();
			$("#vlaContainer").find(".orgdiagram").find(".orgChartParentEntity.comapny_icon").parent().prepend('<i class="fa fa-university" style="color:#4c9d20"></i>');
			$("#vlaContainer").find(".orgdiagram").find(".orgChartParentEntity.person_icon").parent().prepend('<i class="fa fa-user" style="color:#4c9d20"></i>');
			$($("#vlaContainer").find(".orgdiagram").find(".orgChartmainEntity")).parent().parent().css({ 'background-color': 'none' });
			$($("#vlaContainer").find(".orgdiagram").find(".orgChartmainEntity").parent().prepend('<i class="fa fa-university"></i>')).css({ 'background-color': 'none' });
			$("#vlaContainer").find(".orgdiagram").find(".orgChartsubEntity.comapny_icon").parent().prepend('<i class="fa fa-university" style="color:#c7990c"></i>');
			$("#vlaContainer").find(".orgdiagram").find(".orgChartsubEntity.person_icon").parent().prepend('<i class="fa fa-user" style="color:#c7990c"></i>');
			$('#vlaContainer').find('.orgdiagram').css({
				width: "100%",
			})
		};
		var currentClickedData;
		options.onMouseClick =  (e, data)=> {
		if (data.context) {
			//	currentClickedData = data.context;
			this.entityDataOnClikOfOdg = (data && data.context) ? data.context : '';
			currentClickedData = find(EntityConstants.basicSharedObject.actualScreeningData, {
				'@identifier': data.context.identifier
			});
			if (!this.entityDataOnClikOfOdg || !this.entityDataOnClikOfOdg.classification) {
				this.entityDataOnClikOfOdg.classification = currentClickedData.classification ? currentClickedData.classification : [];
			}
		}
		// this.onChartClickData(e);

	}
		// var currentClickedData;
		// var currentOPts = $.extend(true, {}, options);
		this.orgChartOptions  = $.extend(true, {}, options);
		// currentOPts.items = orgdata;
		// $("#vlaContainer_originalView").famDiagram(currentOPts);
	}
	getInfoTemplate() {
		var result = new primitives.orgdiagram.TemplateConfig();
		result.name = "info";
		result.itemSize = new primitives.common.Size(250, 61);
		result.minimizedItemSize = new primitives.common.Size(3, 3);
		result.highlightPadding = new primitives.common.Thickness(4, 4, 4, 4);
		var itemTemplate = $(
			'<div class="bp-corner-all org-chart-item bt-item-frame z-999">'
			+ '<div name="title-wrapper" class="width-100 top-heading">'
			/* +'<i class="icon-wrapper pad-l5 pad-t10 f-16 text-dark-grey fa fa-building-o" />'
			+ '</i>' */
			+ '<span class="flag-icon mar-x5 text-cream flag-icon-squared flag-wrapper flag-pop c-pointer f-9"></span>'
			+ '<h3 name="title" class="bp-item text-overflow">'
			+ '</h3>'
			+ '<span class="square-16 mar-l10 pad-t3 p-rel showspinner d-none" style="position: absolute; right: 5%; bottom: 1%; transform: translate(-5%,-1%);"><span class="custom-spinner square-16 p-rel ">'
			+ '<i class="fa fa-spinner fa-spin"></i>'
			+ '</span></span>'
			+ '<div class="bottom-details-wrapper" style="padding-left:55px;">'
			+ '<span name= "description" class="text-cream orgTooltipclass description percentageInfo"></span>'
			+ '<ul class="list-unstyled progressbar-list d-flex mar-b0" name ="ownershipPercentages">'
			+ '</ul>'
			+ '<div class="mar-autol mar-b0 bst-checkbox-wrapper"> <div class="mar-l5 checkbox-inline"> <input type="checkbox" class="mar-l0 d-block z-99 c-pointer op-0 multiparentcheck" /> <span class="mar-r0"> <i class="fa fa-check multicheck"></i></span> </div> </div>'
			+ '</div>'
			+ '<ul class="d-flex ai-c">'
			+ '<li>'
			+ '<i class= "fa text-cream fa-ban user-pop c-pointer">'
			+ '</i>'
			+ '</li>'
			+ '<li>'
			+ '<i class= "fa text-cream fa-street-view street-pop c-pointer ">'
			+ '</i>'
			+ '</li>'
			+ '<li>'
			+ '<i class= "fa text-cream fa-globe globe-pop c-pointer ">'
			+ '</i>'
			+ '</li>'
			+ '<li>'
			+ '<i class= "fa text-cream fa-gavel gavel-pop c-pointer ">'
			+ '</i>'
			+ '</li>'
			+ '<li>'
			+ '<i class= "fa text-cream fa-newspaper-o newspaper-pop c-pointer ">'
			+ '</i>'
			+ '</li>'
			+ '</ul>'
			+ '</div>'
			+ '</div>'
		).css({
			width: result.itemSize.width + "%",
			height: result.itemSize.height + "px"
		}).addClass("bp-item bp-corner-all bt-item-frame");
		result.itemTemplate = itemTemplate.wrap('<div>').parent().html();
		return result;
	}
	onTemplateRender(event, data) {
		var personEntitytype = ['person'];
		data.renderingMode = this.filteredApplied;
		switch (data.renderingMode) {
			case primitives.common.RenderingMode.Create:
				/ Initialize widgets here /
				break;
			case primitives.common.RenderingMode.Update:
				/ Update widgets here /
				break;
		}
		var itemConfig = data.context;
		$(data.element[0]).attr('id', itemConfig.id);
		function isJson(str: any) {
			try {
				JSON.parse(str);
			} catch (e) {
				return false;
			}
			return true;
		}
		if (itemConfig.classification) {
			itemConfig.classification = itemConfig.classification ? isJson(itemConfig.classification) ? JSON.parse(itemConfig.classification) : itemConfig.classification : [];
			var showDirectIndirectPercentage = itemConfig.classification.find(function (key) {
				return key == "Director" || key == "General Partner"
			})
		} else if (itemConfig.classification && typeof itemConfig.classification === 'string' && JSON.parse(itemConfig.classification) && (JSON.parse(itemConfig.classification)).length > 0) {
			var showDirectIndirectPercentage = JSON.parse(itemConfig.classification).find(function (key) {
				return key == "Director" || key == "General Partner"
			})
		}
		itemConfig.showDirectIndirectPercentage = showDirectIndirectPercentage ? false : true;
		if (data.templateName == "info") {
			var indirectPercentage = itemConfig.indirectPercentage ? itemConfig.indirectPercentage.toFixed(2) : '';
			var int_percentage = indirectPercentage ? parseFloat(indirectPercentage) : 0;
			var totalstringPercentage = itemConfig.totalPercentage ? itemConfig.totalPercentage.toFixed(2) : '';
			var totalPercentage = totalstringPercentage ? parseFloat(totalstringPercentage) : 0;
			if (!(data.element.find("[name=title]").hasClass("orgChartsubEntity") || data.element.find("[name=title]").hasClass("orgChartParentEntity") || data.element.find("[name=title]").hasClass("orgChartmainEntity"))) {
				var dynamicFontSize = itemConfig.title.length > 50 ? 'f-9' : itemConfig.title.length > 42 ? 'f-10' : itemConfig.title.length > 35 ? 'f-12' : 'f-14';
				data.element.find("[name=title]").text(itemConfig.title);
				data.element.find("[name=title]").addClass(itemConfig.entity_id);
				data.element.find("[name=title]").addClass(dynamicFontSize);
				if ((itemConfig.entity_type && (personEntitytype.indexOf(itemConfig.entity_type.toLowerCase()) !== -1))) {
					data.element.find("[name=title]").addClass('person_icon');
				} else {
					data.element.find("[name=title]").addClass('comapny_icon');
				}
				if (itemConfig.isConflict) {
					data.element.css('border', '2px solid #ef5350');
				}
				if ((int_percentage || int_percentage === 0 || totalPercentage || totalPercentage === 0) && (itemConfig.entity_id !== "orgChartsubEntity") && itemConfig.showDirectIndirectPercentage) {
					data.element.find("[name=ownershipPercentages]").append('<li class="progressbar-list-item pad-t0">'
						+ '<div class="progress progress-gradient-grey" style="width:100%"> <span class="p-rel z-99">' + int_percentage + '%</span>'
						+ '<div class="progress-bar z-9 progress-gradient-blue" role="progressbar" aria-valuenow="' + int_percentage + '"'
						+ 'aria-valuemin="0" aria-valuemax="100" style="width:' + int_percentage + '%">'
						+ '<span class="sr-only ">' + int_percentage + '%</span>'
						+ '</div>'
						+ '</div>'
						+ '</li>'
						+ '<li class="progressbar-list-item">'
						+ '<div class="progress progress-gradient-grey" style="width:100%"><span class="p-rel z-99">' + totalPercentage + '%</span>'
						+ ' <div class="progress-bar z-9 progress-gradient-curious-blue" role="progressbar" aria-valuenow="' + totalPercentage + '"'
						+ 'aria-valuemin="0" aria-valuemax="100" style="width:' + totalPercentage + '%">'
						+ '<span class="sr-only ">' + totalPercentage + '</span>'
						+ '</div>'
						+ '</div>'
						+ '</li>');
				}
				//	data.element.find("[name=title]").addClass("orgTooltipclass");
				// https://blackswantechnologies.atlassian.net/browse/EL-3788 as refernce
				//below Im checking entity as person
				var ownershipdependency = '';
				if (itemConfig.entity_id === 'orgChartmainEntity') {
					ownershipdependency = '';
				}
				else if (itemConfig.Ubo_ibo) {
					var trim_ubo = itemConfig.Ubo_ibo.trim();
					var ubo_ibo_value = ((trim_ubo === 'UBO' && itemConfig.isUbo) ? 'UBO' : (trim_ubo === 'IBO' ? trim_ubo : ''));
					data.element.find("[name=description]").text(ubo_ibo_value);
				}
				data.element.find("[name=description]").addClass("indirectpercenOwnship");
				data.element.find("[name=description]").addClass("indirectpercenOwnship");
				if (!itemConfig.source_evidence && itemConfig.source_evidence_url) {
					data.element.find("[name=sourceevidence]").attr('href', itemConfig.source_evidence_url).text(itemConfig.source_evidence_url);
				} else if ((itemConfig.source_evidence && itemConfig.source_evidence_url) || (itemConfig.source_evidence && !itemConfig.source_evidence_url)) {
					data.element.find("[name=sourceevidence]").text(itemConfig.source_evidence);
				}
				if (itemConfig.source_evidence_url) {
					data.element.find("[name=source_evidence_url]").attr('href', itemConfig.source_evidence_url);
				} else if (!itemConfig.source_evidence_url) {
					data.element.find("[name=source_evidence_url]").css('display', 'none');
				}
			}
			if (itemConfig.addCubeIcon) {
				data.element.find("[name=title]").addClass("shareCubes");
			}
			if (itemConfig.showspinner) {
				data.element.find(".showspinner").removeClass("d-none");
			} else {
				data.element.find(".showspinner").addClass("d-none");
			}
			//Hide icon if result is false
			if (itemConfig.jurisdiction) {
				$(data.element[0]).find('span.flag-icon-squared').addClass("flag-icon-" + itemConfig.jurisdiction.toLowerCase()).css('display', 'block')
			} else if (itemConfig.basic && !isEmpty(itemConfig.basic) && itemConfig.basic.isDomiciledIn) {
				$(data.element[0]).find('span.flag-icon-squared').addClass("flag-icon-" + itemConfig.basic.isDomiciledIn.toLowerCase()).css('display', 'block')
			} else {
				$(data.element[0]).find('span.flag-icon-squared').css('display', 'none');
			}
			if (!itemConfig.adverseNews_url || itemConfig.adverseNews_url.length === 0) {
				$(data.element[0]).find('ul').find('.fa-newspaper-o').parent().css('display', 'none')
			} else if (itemConfig.adverseNews_url && itemConfig.adverseNews_url.length > 0) {
				$(data.element[0]).find('ul').find('.fa-newspaper-o').parent().css('display', 'block')
			}
			if (!itemConfig.finance_Crime_url || itemConfig.finance_Crime_url.length === 0) {
				$(data.element[0]).find('ul').find('.fa-gavel').parent().css('display', 'none')
			} else if (itemConfig.finance_Crime_url && itemConfig.finance_Crime_url.length > 0) {
				$(data.element[0]).find('ul').find('.fa-gavel').parent().css('display', 'block')
			}
			if (!itemConfig.pep_url || itemConfig.pep_url.length === 0) {
				$(data.element[0]).find('ul').find('.fa-street-view').parent().css('display', 'none')
			} else if (itemConfig.pep_url && itemConfig.pep_url.length > 0) {
				$(data.element[0]).find('ul').find('.fa-street-view').parent().css('display', 'block')
			}
			if (!itemConfig.high_risk_jurisdiction || itemConfig.high_risk_jurisdiction.toLowerCase() === 'low') {
				$(data.element[0]).find('ul').find('.fa-globe').parent().css('display', 'none')
			} else if (itemConfig.high_risk_jurisdiction && itemConfig.high_risk_jurisdiction.toLowerCase() !== 'low') {
				$(data.element[0]).find('ul').find('.fa-globe').parent().css('display', 'block')
			}
			if (!itemConfig.sanction_source || itemConfig.sanction_source.length === 0) {
				$(data.element[0]).find('ul').find('.fa-ban').parent().css('display', 'none')
			} else if (itemConfig.sanction_source && itemConfig.sanction_source.length > 0) {
				$(data.element[0]).find('ul').find('.fa-ban').parent().css('display', 'block')
			}
			if (itemConfig.entity_id === 'orgChartmainEntity') {
				$(data.element[0]).addClass("child-container additional-container");
			}
			else if (itemConfig['entity_id'] == 'orgChartsubEntity') { //yellow side border
				$(data.element[0]).addClass("child-container subsidery-container");
				$(data.element[0]).find(".percentageInfo").remove()
			} //company and not UBO
			else if (itemConfig.isUbo && itemConfig.entity_id !== 'orgChartmainEntity' && (itemConfig.entity_type && personEntitytype.indexOf(itemConfig.entity_type.toLowerCase()) !== -1)) {
				$(data.element[0]).addClass("");
			}
			else if (!itemConfig.isUbo || (!itemConfig.isUbo && itemConfig.entity_id !== 'orgChartmainEntity' && (itemConfig.entity_type && personEntitytype.indexOf(itemConfig.entity_type.toLowerCase()) === -1))) { //blue side border
				$(data.element[0]).addClass("child-container");
			}
			var listindirectsubsidary;
			var listindirectshareholder;
			if (itemConfig.indirectEntity == 'indirectsubsidary') { //dashed line in direct entity
				listindirectsubsidary = itemConfig.id;
				$(data.element[0]).addClass("border-red-thin-dashed-t");
			} else if (itemConfig.indirectEntity == 'indirectshareholder') {
				listindirectshareholder = itemConfig.id;
				$(data.element[0]).addClass("border-red-thin-dashed-b");
			}
			if (listindirectsubsidary) {
				$('#' + listindirectsubsidary).addClass('border-red-thin-dashed-t')
			}
			if (listindirectshareholder) {
				$('#' + listindirectshareholder).addClass('border-red-thin-dashed-b')
			}
			// if (this.entitySearchResult.list.currentVLArendered !== 'vlaContainer_customView') {
			// $(data.element[0]).find(".multiparentcheck").remove()
			// $(data.element[0]).find(".multicheck").remove()
			// }
		}
	}
	onChartClickData(e){
		e.preventDefault();
		e.stopPropagation();
		if (this.entitySearchResult.list.currentVLArendered === "vlaContainer_customView") {
		$(".entity_popover").css("display", "none");
			$(".entity_popover").html("");
			var Ubo_ibo = '';
			if (this.entityDataOnClikOfOdg.isUbo) {
				Ubo_ibo = 'UBO '; // +pop_totalPercentage;
			}
			var deletebtn = true;
			if (this.entityDataOnClikOfOdg.entity_id !== "orgChartmainEntity" && this.entityDataOnClikOfOdg.parents && this.entityDataOnClikOfOdg.parents.length > 0 && this.entityDataOnClikOfOdg.subsidiaries && this.entityDataOnClikOfOdg.subsidiaries.length > 0 && !this.showSubsidaries) {
				deletebtn = false;
			} else if ((this.entityDataOnClikOfOdg.entity_id !== "orgChartmainEntity" || !this.entityDataOnClikOfOdg.entity_id) && (!this.entityDataOnClikOfOdg.parents || this.entityDataOnClikOfOdg.parents.length == 0)) {
				deletebtn = true;
			} else if (this.entityDataOnClikOfOdg.parents && this.entityDataOnClikOfOdg.parents.length > 0 && this.entityDataOnClikOfOdg.subsidiaries && this.entityDataOnClikOfOdg.subsidiaries.length > 0 && this.showSubsidaries) {
				deletebtn = false;
			} else if (this.entityDataOnClikOfOdg.entity_id !== "orgChartmainEntity" && this.entityDataOnClikOfOdg.parents && this.entityDataOnClikOfOdg.parents.length > 0 && (!this.entityDataOnClikOfOdg.subsidiaries || this.entityDataOnClikOfOdg.subsidiaries.length > 0) && this.showSubsidaries) {
				deletebtn = true;
			} else if (this.entityDataOnClikOfOdg.entity_id === "orgChartmainEntity") {
				deletebtn = false;
			}
			// deletebtn = this.entityDataOnClikOfOdg.entity_id !=="orgChartmainEntity" ? true : false;
			setTimeout( ()=>{
				this.deleteSelectedEntity = this.entityDataOnClikOfOdg
			}, 500);
			this.popOverEditDataForOwnership = this.entityDataOnClikOfOdg;
			var banSymbol = this.entitySearchResult.list.currentVLArendered === 'vlaContainer_customView' ? '' : 'c-ban';
			var penoneSymbol = this.entitySearchResult.list.currentVLArendered === 'vlaContainer_customView' ? '' : 'pe-none';
			$(".selectedEntityOptions").css("display", "block");
			$(".selectedEntityOptions").html('<ul class="d-flex ai-c selected-entity-wrapper custom-list pad-l0">' +
				//As UBO cant have Parents Im dviding Person and Org Icon into two parts depending on UBO
				((Ubo_ibo === 'UBO ') ? ('<li class="d-flex ai-c c-ban">Add: <span class="entity-icon-wrapper d-flex ai-c jc-c mar-x5 addCompanyInchart"><i class="fa fa-building addCompanyInchart pe-none"></i></span><span class="entity-icon-wrapper d-flex ai-c jc-c c-ban addPersonInchart"><i class="fa fa-user addPersonInchart pe-none"></i></span></li>') : ('<li class="d-flex ai-c ' + (banSymbol) + '">Add: <span class="entity-icon-wrapper d-flex ai-c jc-c mar-x5">' + '<i class="fa fa-building addCompanyInchart ' + (penoneSymbol) + '"></i></span><span class="entity-icon-wrapper d-flex ai-c jc-c ' + (banSymbol) + '"><i class="fa fa-user addPersonInchart ' + (penoneSymbol) + '"></i></span></li>')) +
				'<li class="d-flex ai-c"><i class="fa fa-info-circle mar-r10 entityDetails"></i><span class="' + (banSymbol) + '"><i class="fas fa-pencil  mar-r10 ownerShipEntityEdit' + (penoneSymbol) + '" "></i></span>' +
				(deletebtn ? '<span class ="' + (banSymbol) + '"><i class="fa fa-trash text-coral-red deleteScreening ' + (penoneSymbol) + '"></i></span></li>' : '') +
				'</ul>');
			var windowWidth = this.window.innerWidth;
			var tooltipWidth = windowWidth - $('.selectedEntityOptions').width() - 100;
			if ((e.pageX > tooltipWidth)) {
				$(".selectedEntityOptions").css("left", ((e.pageX) - $('.selectedEntityOptions').width() - 100) + "px");
			} else {
				$(".selectedEntityOptions").css("left", (e.pageX) + 5 + "px");
			}
			$(".selectedEntityOptions").css("z-index", "9999");
			$(".selectedEntityOptions").css("display", "block");
			return $(".selectedEntityOptions").css("top", e.pageY-20 + "px");
		} else {
			this.showEntitesDetails(e);
		}
	}

		handlepop(event) {
			event.preventDefault();
			event.stopPropagation();
			var _this = $(this);
			// setTimeout( ()=> {
			// 	var data = $.extend(true, {}, this.currentClickedData);
			// 	// currentClickedData = undefined;
			// 	if (_this.attr("class").indexOf("newspaper-pop") > -1) {
			// 		var index = (data.entity_id && data.entity_id === 'orgChartmainEntity') ? 0 : 1;
			// 		this.openAdverseDirectly(index, data, 'adverse');
			// 		//adversenews
			// 	} else if (_this.attr("class").indexOf("globe-pop") > -1) {
			// 		data.txt = '<table class="table data-custom-table"><tr><th>Name</td><td>' + data.name + '</td></tr><tr><th>Risk Jurisdiction</td><td>' + data.high_risk_jurisdiction + '</td></tr></tr></table>';
			// 		// openmodal(data);
			// 		this.openAdverseDirectly(index, data, 'highRisk');
			// 		//jurrisdiction
			// 	} else if (_this.attr("class").indexOf("gavel-pop") > -1) {
			// 		this.openAdverseDirectly(0, data, 'finance');
			// 		//finance_Crime_url
			// 	} else if (_this.attr("class").indexOf("street-pop") > -1) {
			// 		data.txt = '<table class="table data-custom-table"><tr><th>Name</td><td>' + data.name + '</td></tr><tr><th>Source</td><td><a href="' + data.pep_url + '" target="_blank">' + data.pep_url + '</td></tr></tr></table>';
			// 		//	openmodal(data);
			// 		this.openAdverseDirectly(index, data, 'pep');
			// 		//pep_url
			// 	} else if (_this.attr("class").indexOf("user-pop") > -1) {
			// 		var adversecontent = '';
			// 		angular.forEach(data.sanction_source, function (val, key) {
			// 			adversecontent = adversecontent + '<tr class= "border-b0"><td><a href="' + val.url + '"target="_blank"> ' + val.title + '</a></td></tr>';
			// 		});
			// 		data.txt = '<table class="table data-custom-table"><tr  class= "border-b0"><td>' + data.name + '</td></tr>' + adversecontent + '</table>';
			// 		//	openmodal(data);
			// 		this.openAdverseDirectly(index, data, 'sanction');
			// 		//sanction_source
			// 	} else if (_this.attr("class").indexOf("multiparentcheck") > -1) {
			// 		multiSelectedEntity(data, _this);
			// 	}
			// }, 0)
		}

   /* @purpose: to Populate Screening Table with screening Data
	* @created: 7 June 2019
	* @params: type(string)
		* @returns country name.
	* @author: Ram Singh*/
  companyScreening(screening, subsidaries) {
		for (var j = 0; j < screening.length; j++) {
			if (screening[j].name) {
				const findEntityScreened = findIndex(EntityConstants.customEntites.screeningaddition, {//check for parent index in the screening Results
					"@identifier": screening[j].identifier
				});
				const checkname_Inscreening = find(this.actualScreeningData, ['name', screening[j].name]);
				const checkname_InscreeningIndex = findIndex(this.actualScreeningData, ['name', screening[j].name]);
				if ((!(checkname_Inscreening)) && findEntityScreened === -1) {
					var address = {
						country: screening[j].country ? screening[j].country : ''
					}
					var currentadverse = [];
					//	var pepParsedData = screening[j].pep_url ? (screening[j].pep_url.length > 0 ? JSON.parse(screening[j].pep_url[0].raw) : '') : '';
					var pepParsedData = (screening[j].pep && screening[j].pep.length > 0) ? screening[j].pep : [];
					var sanctionData = (screening[j].sanctions && screening[j].sanctions.length > 0) ? screening[j].sanctions : [];
					screening[j].sanction_source = sanctionData;
					screening[j].pep_url = pepParsedData;
					if (screening[j].adverseNews_url && screening[j].adverseNews_url.length) {
						screening[j].adverseNews_url.map( (val)=> {
							var dateRange = false;
							if (val.published) {
								var publisheddate = new Date(val.published).getFullYear();
								dateRange = (((publisheddate <  new Date(this.filteredChart.fromyear).getFullYear()) || (publisheddate == new Date(this.filteredChart.fromyear).getFullYear())) && ((publisheddate > new Date( this.filteredChart.toyear).getFullYear() || publisheddate == new Date( this.filteredChart.toyear).getFullYear()) || (publisheddate == new Date( this.filteredChart.toyear).getFullYear()))) ? true : false;//need to check conditions
								if (dateRange) {
									val.name = screening[j].name;
									val.identifier = screening[j].identifier;
									val.queue = val.queue ? val.queue : 'high';
									val.isSignificant = val.isSignificant ? val.isSignificant : false;
									currentadverse.push(val);
								}
							}
						});
					}
					if (screening[j].finance_Crime_url && screening[j].finance_Crime_url.length) {
						screening[j].finance_Crime_url.map(function (val) {
							var dateRange = false;
							if (val.published) {
								var publisheddate = new Date(val.published).getFullYear();
								dateRange = (((publisheddate <= this.filteredChart.fromyear) || (publisheddate == this.filteredChart.fromyear)) && ((publisheddate >= this.filteredChart.toyear) || (publisheddate == this.filteredChart.toyear))) ? true : false;
								if (dateRange) {
									val.name = screening[j].name;
									val.identifier = screening[j].identifier;
									val.queue = val.queue ? val.queue : 'high';
									val.isSignificant = val.isSignificant ? val.isSignificant : false;
									currentadverse.push(val);
								}
							}
						});
					}
					var Ubo_ibo = '';
					var pop_totalPercentage = (screening[j].totalPercentage) ? screening[j].totalPercentage : 0;
					if (screening[j].isUbo) {
						Ubo_ibo = 'UBO ';// +pop_totalPercentage;
					} else if ((screening[j].entity_type && (this.personEntitytype.indexOf(screening[j].entity_type.toLowerCase()) === -1)) && ((pop_totalPercentage && parseInt(pop_totalPercentage) > 25) || (pop_totalPercentage && parseInt(pop_totalPercentage) > 10 && screening[j].high_risk_jurisdiction && screening[j].high_risk_jurisdiction.toLowerCase() === 'high'))) {
						Ubo_ibo = 'IBO '; //+pop_totalPercentage;
					} else {
						Ubo_ibo = "Shareholder";
					}
					if (subsidaries === 'officers') {
						Ubo_ibo = "officers";
					}
					if (subsidaries === 'subsidaries') {
						Ubo_ibo = "subsidaries";
					}
					screening[j].Ubo_ibo = Ubo_ibo;
					var adverseNews = screening[j].news ? (screening[j].news.length > 0 ? this.classtype(screening[j].news, screening[j], 'Neutral') : []) : [];
					var financeNews = screening[j].news ? (screening[j].news.length > 0 ? this.classtype(screening[j].news, screening[j], 'Financial Crime') : []) : [];
					var showdeleteIcon = true;
					// if(screening[j].entity_id === "orgChartmainEntity" && (!screening[j].parents || screening[j].parents.length == 0 || !screening[j].subsidiaries || !screening[j].subsidiaries.length == 0)){
					if (screening[j].entity_id === "orgChartmainEntity") {
						showdeleteIcon = false;
					}
					if (subsidaries === 'officers') {
						showdeleteIcon = true;
					}
					screening[j].officer_roles = screening[j].officer_roles ? uniq(screening[j].officer_roles) : [];
					screening[j].report_jurisdiction_risk = screening[j].country ? this.entityCommonTabService.calculateCountryRisk(screening[j].country_of_residence || screening[j].country) : screening[j].jurisdiction ? this.entityCommonTabService.calculateCountryRisk(this.entityCommonTabService.getCountryName(screening[j].jurisdiction)) : '';
					const findsimilarname = filter(EntityConstants.basicSharedObject.totalOfficers_link, {
						'name': screening[j].name
					});
					var entityRefernce = uniqBy(findsimilarname, 'source');
					// var mappedSources = findsimilarname.map(function (val) { return val.source });
					if (screening[j] && screening[j].highCredibilitySource && screening[j].officerSources && screening[j].officerSources.length > 0) {
						screening[j].officerSources.push(screening[j].highCredibilitySource);
					}
					var sources = screening[j].officerSources && screening[j].officerSources.length > 0 ? (screening[j].officerSources.filter((val) => val !== 'element').filter((item, pos, self)=> {
						return self.indexOf(item) == pos;
					})) : [];
					screening[j].classification = screening[j].classification && typeof screening[j].classification === "string" ? JSON.parse(screening[j].classification) : (screening[j].classification ? screening[j].classification : []);
					if (screening[j].entity_id !== "orgChartmainEntity") {
						screening[j]["mdaas:RegisteredAddress"] = address;
						screening[j].sanctions = sanctionData;
						screening[j].pep = pepParsedData ? $.extend(true, [], pepParsedData) : [];
						screening[j].finance_Crime_url= financeNews;
						screening[j].adverseNews_url = adverseNews;
						screening[j]["no-screening"] = screening[j].screeningFlag ? screening[j].screeningFlag : true;
						screening[j].country = screening[j].country ? screening[j].country : ((screening[j].basic && screening[j].basic["mdaas:RegisteredAddress"] && screening[j].basic["mdaas:RegisteredAddress"].country) ? screening[j].basic["mdaas:RegisteredAddress"].country : '');
						screening[j].Ubo_ibo =Ubo_ibo;
						screening[j].showdeleteIcon = showdeleteIcon;
						screening[j].isChecked= false;
						screening[j].bvdId = screening[j].bvdId ? screening[j].bvdId : (screening[j].identifier ? screening[j].identifier : '');
						screening[j].date_of_birth = screening[j].date_of_birth ? (screening[j].date_of_birth.year ? (screening[j].date_of_birth.year && screening[j].date_of_birth.month ? (screening[j].date_of_birth.year && screening[j].date_of_birth.month && screening[j].date_of_birth.day ? screening[j].date_of_birth.year + '-' + screening[j].date_of_birth.month + '-' + screening[j].date_of_birth.day : screening[j].date_of_birth.year + '-' + screening[j].date_of_birth.month) : screening[j].date_of_birth.year + '-' + screening[j].date_of_birth.month) : screening[j].date_of_birth.year) : '';
						screening[j].sources = sources;
						screening[j].information_provider = screening[j].information_provider ? screening[j].information_provider : screening[j].source ? screening[j].source : '';
						screening[j].source_evidence = screening[j].highCredibilitySource ? screening[j].highCredibilitySource : screening[j].source ? screening[j].source : screening[j].information_provider ? screening[j].information_provider : '';
						screening[j].entityRefernce = entityRefernce && entityRefernce.length > 0 ? entityRefernce : [];
						screening[j].officerIdentifier = subsidaries === 'officers' ? (screening[j].officerIdentifier ? screening[j].officerIdentifier : screening[j].identifier ? screening[j].identifier : '') : '';
						var newscreeningObject = new Screeningconstructor(screening[j]);
						this.actualScreeningData.push(newscreeningObject);
					}
					var filteredSanctions = sanctionData.length > 0 ? this.pep_sanctionScreeningRange(this.filteredChart.sanction_slider_min, this.filteredChart.sanction_slider_max, sanctionData) : [];
					var filteredpep = pepParsedData.length > 0 ? this.pep_sanctionScreeningRange(this.filteredChart.pep_slider_min, this.filteredChart.pep_slider_max, pepParsedData) : [];
					if ((sanctionData.length > 0) || (financeNews && financeNews.length > 0) || (adverseNews && adverseNews.length > 0) || (screening[j].high_risk_jurisdiction && screening[j].high_risk_jurisdiction !== 'LOW') || (pepParsedData.length > 0)) {
						this.identifiedRisk = this.identifiedRisk + 1;
						var newscreeningObject = new Screeningconstructor(screening[j]);
						 this.summaryScreenig.push(newscreeningObject);
					}
					if (screening[j].officer_role) {
						if (!(find(this.unique_officer_roles_array, { 'name': screening[j].officer_role }))) {
							this.unique_officer_roles_array.push({
								'name': screening[j].officer_role,
								'value': true,
								'pos':this.unique_officer_roles_array.length
							});
							this.Rolechecklist.singlearray.push(true);
						}
					}
					this.intialSelectedRoles = $.extend(true, [], this.unique_officer_roles_array);
					if (filteredSanctions.length > 0) {
						this.entitySearchResult.list.summaryCount.sanctionCount = this.entitySearchResult.list.summaryCount.sanctionCount + filteredSanctions.length;
					}
					if (financeNews && financeNews.length > 0) {
						this.entitySearchResult.list.summaryCount.financeCount = this.entitySearchResult.list.summaryCount.financeCount + (financeNews[0].count ? financeNews[0].count : 0);
					}
					if (adverseNews && adverseNews.length > 0) {
						this.entitySearchResult.list.summaryCount.adverseCount = this.entitySearchResult.list.summaryCount.adverseCount + (adverseNews[0].count ? adverseNews[0].count : 0);
					}
					if (screening[j].high_risk_jurisdiction && screening[j].high_risk_jurisdiction.toLowerCase() !== 'low') {
						this.entitySearchResult.list.summaryCount.highRiskCount = this.entitySearchResult.list.summaryCount.highRiskCount + 1;
					}
					if (filteredpep.length > 0) {
						this.entitySearchResult.list.summaryCount.pepCount = this.entitySearchResult.list.summaryCount.pepCount + filteredpep.length;
					}
					if (subsidaries) {//reflecting the subsidaries screening into  parent company
						var financearticle = screening[j].news ? (screening[j].news.length > 0 ? this.classtype(screening[j].news, screening[j], 'Financial Crime') : []) : [];
						var adverseArticle = screening[j].news ? (screening[j].news.length > 0 ? this.classtype(screening[j].news, screening[j], 'Neutral') : []) : [];
						let cumulativeScreening = {
							totalCompanyAdverseNews: adverseArticle,
							totalCompanyFinancialNews: financearticle
						}
						let findParentScreeningIndex = findIndex(this.actualScreeningData, {//check for parent index in the screening Results
							"@identifier": screening[j].Paridentifier
						});
						let hirreacheyIndex = findIndex(this.hierarchyData, {//check for parent index in the chart
							"identifier": screening[j].Paridentifier
						});
						if (findParentScreeningIndex != -1 && hirreacheyIndex != -1) {
							this.addScreeningToMainCompany(cumulativeScreening, findParentScreeningIndex, hirreacheyIndex,'');
						}
					}
				} else if (checkname_InscreeningIndex !== -1 && subsidaries === 'officers') {
					var address = {
						country: screening[j].country ? screening[j].country : ''
					}
					this.actualScreeningData[checkname_InscreeningIndex]["mdaas:RegisteredAddress"] = address ? address : this.actualScreeningData[checkname_InscreeningIndex]["mdaas:RegisteredAddress"] ? this.actualScreeningData[checkname_InscreeningIndex]["mdaas:RegisteredAddress"] :'';
					this.actualScreeningData[checkname_InscreeningIndex].identifier = screening[j].identifier ? screening[j].identifier : this.actualScreeningData[checkname_InscreeningIndex].identifier ? this.actualScreeningData[checkname_InscreeningIndex].identifier : '';
					this.actualScreeningData[checkname_InscreeningIndex]["@identifier"] = screening[j].identifier ? screening[j].identifier : this.actualScreeningData[checkname_InscreeningIndex]["@identifier"] ? this.actualScreeningData[checkname_InscreeningIndex]["@identifier"] : '';
					this.actualScreeningData[checkname_InscreeningIndex].high_risk_jurisdiction = screening[j].high_risk_jurisdiction ? screening[j].high_risk_jurisdiction.toLowerCase() : this.actualScreeningData[checkname_InscreeningIndex].high_risk_jurisdiction ? this.actualScreeningData[checkname_InscreeningIndex].high_risk_jurisdiction : '';
					this.actualScreeningData[checkname_InscreeningIndex].hasURL = screening[j].hasURL ? screening[j].hasURL : this.actualScreeningData[checkname_InscreeningIndex].hasURL ? this.actualScreeningData[checkname_InscreeningIndex].hasURL : '';
					this.actualScreeningData[checkname_InscreeningIndex].country = screening[j].country ? screening[j].country : ((screening[j].basic && screening[j].basic["mdaas:RegisteredAddress"] && screening[j].basic["mdaas:RegisteredAddress"].country) ? screening[j].basic["mdaas:RegisteredAddress"].country : '');
					this.actualScreeningData[checkname_InscreeningIndex].entity_id = screening[j].entity_id ? screening[j].entity_id : this.actualScreeningData[checkname_InscreeningIndex].entity_id ? this.actualScreeningData[checkname_InscreeningIndex].entity_id : '';
					this.actualScreeningData[checkname_InscreeningIndex].jurisdiction = screening[j].jurisdiction ? screening[j].jurisdiction : this.actualScreeningData[checkname_InscreeningIndex].jurisdiction ? this.actualScreeningData[checkname_InscreeningIndex].jurisdiction : '';
					this.actualScreeningData[checkname_InscreeningIndex].isCustom = screening[j].isCustom ? screening[j].isCustom : this.actualScreeningData[checkname_InscreeningIndex].isCustom ? this.actualScreeningData[checkname_InscreeningIndex].isCustom : false;
					this.actualScreeningData[checkname_InscreeningIndex].bvdId = screening[j].bvdId ? screening[j].bvdId : (screening[j].identifier ? screening[j].identifier : this.actualScreeningData[checkname_InscreeningIndex].bvdId ? this.actualScreeningData[checkname_InscreeningIndex].bvdId : '');
					this.actualScreeningData[checkname_InscreeningIndex].classification = screening[j].classification && typeof screening[j].classification === "string" ? JSON.parse(screening[j].classification) : (screening[j].classification ? screening[j].classification : this.actualScreeningData[checkname_InscreeningIndex].classification);
					this.actualScreeningData[checkname_InscreeningIndex].date_of_birth = screening[j].date_of_birth ? screening[j].date_of_birth : this.actualScreeningData[checkname_InscreeningIndex].date_of_birth;
					this.actualScreeningData[checkname_InscreeningIndex].officer_role = screening[j].officer_role ? screening[j].officer_role : this.actualScreeningData[checkname_InscreeningIndex].officer_role;
				} else if (checkname_InscreeningIndex !== -1 && subsidaries !== 'officers') {
					screening[j].classification = screening[j].classification && typeof screening[j].classification === "string" ? JSON.parse(screening[j].classification) : (screening[j].classification ? screening[j].classification : []);
					if (screening[j].entity_id !== "orgChartmainEntity") 	{
						screening[j]["mdaas:RegisteredAddress"] = address;
						screening[j].sanctions = sanctionData;
						screening[j].pep = pepParsedData ? $.extend(true, [], pepParsedData) : [];
						screening[j].finance_Crime_url= financeNews;
						screening[j].adverseNews_url = adverseNews;
						screening[j]["no-screening"] = screening[j].screeningFlag ? screening[j].screeningFlag : true;
						screening[j].country = screening[j].country ? screening[j].country : ((screening[j].basic && screening[j].basic["mdaas:RegisteredAddress"] && screening[j].basic["mdaas:RegisteredAddress"].country) ? screening[j].basic["mdaas:RegisteredAddress"].country : '');
						screening[j].Ubo_ibo =Ubo_ibo;
						screening[j].showdeleteIcon = showdeleteIcon;
						screening[j].isChecked= false;
						screening[j].bvdId = screening[j].bvdId ? screening[j].bvdId : (screening[j].identifier ? screening[j].identifier : '');
						screening[j].date_of_birth = screening[j].date_of_birth ? (screening[j].date_of_birth.year ? (screening[j].date_of_birth.year && screening[j].date_of_birth.month ? (screening[j].date_of_birth.year && screening[j].date_of_birth.month && screening[j].date_of_birth.day ? screening[j].date_of_birth.year + '-' + screening[j].date_of_birth.month + '-' + screening[j].date_of_birth.day : screening[j].date_of_birth.year + '-' + screening[j].date_of_birth.month) : screening[j].date_of_birth.year + '-' + screening[j].date_of_birth.month) : screening[j].date_of_birth.year) : '';
						screening[j].sources = sources;
						screening[j].information_provider = screening[j].information_provider ? screening[j].information_provider : screening[j].source ? screening[j].source : '';
						screening[j].source_evidence = screening[j].highCredibilitySource ? screening[j].highCredibilitySource : screening[j].source ? screening[j].source : screening[j].information_provider ? screening[j].information_provider : '';
						screening[j].entityRefernce = entityRefernce && entityRefernce.length > 0 ? entityRefernce : [];
						screening[j].officerIdentifier = subsidaries === 'officers' ? (screening[j].officerIdentifier ? screening[j].officerIdentifier : screening[j].identifier ? screening[j].identifier : '') : '';
						this.actualScreeningData.push(new Screeningconstructor(screening[j]));
				}
			} else {
					if (findEntityScreened !== -1) {
						this.actualScreeningData.splice(findEntityScreened, 1);
						this.actualScreeningData.push(EntityConstants.customEntites.screeningaddition[findEntityScreened]);
					}
				}
			} //if condition for name
		} //for loop ends
		EntityConstants.basicSharedObject.actualScreeningData = this.actualScreeningData;
		this.ref.markForCheck();
	}

  	/* @purpose: divides the finace and adverse code
			*
			* @created: 19 sep  2019
			* @params: type(string)
				* @returns array of news
			* @author: Ram Singh */
  classtype(news, val, type) {
		let data = find(news, { 'classification': type });
		let news1:any[] = [];
		if (data && data.count && data['_links'] && data['_links'].articles) {
			news.push({
				article: data['_links'].articles,
				name: val.name,
				entity_id: val.entity_id,
				val: val,
				Ubo_ibo: val.Ubo_ibo,
				count: data.count
			});
		}
		return news1;
  }

  	/* @purpose: checks the got  avaible range of screening is under silder range
			*
			* @created: 19 sep  2019
			* @params: type(string)
				* @returns array  in the slide range
			* @author: Ram Singh */
	 pep_sanctionScreeningRange(minValue, maxValue, totalarray) {
		var array_in_range = totalarray.filter(function (singleObject) {
			if (singleObject.confidence && (singleObject.confidence * 100 > minValue || singleObject.confidence * 100 == minValue) && (singleObject.confidence * 100 < maxValue || singleObject.confidence * 100 == maxValue)) {
				return singleObject;
			} else {
				return;
			}
		});
		return array_in_range;
	}
/* @purpose:add the screening of company and officers to the main comoany*
	* @created: 07 may 2018
	* @params: type(string)
	* @returns: no
	* @author: Ram Singh */
	addScreeningToMainCompany(cumluativeScreening:any, index:any, hirreacheyIndex:any, subsidaries:any) {
		if (this.actualScreeningData && this.actualScreeningData.length > 0) {
			if (this.actualScreeningData[index].adverseNews_url) {
				this.hierarchyData[hirreacheyIndex].adverseNews_url = this.hierarchyData[hirreacheyIndex].adverseNews_url ? this.hierarchyData[hirreacheyIndex].adverseNews_url.concat(cumluativeScreening.totalCompanyAdverseNews) : cumluativeScreening.totalCompanyAdverseNews;
				if (subsidaries && subsidaries !== 'officers' && subsidaries !== 'subsidaries') {
					this.actualScreeningData[index].adverseNews_url = this.actualScreeningData[index].adverseNews_url.concat(cumluativeScreening.totalCompanyAdverseNews);
				}
				if (index === 0) {
					this.mainofficersNews = this.mainofficersNews.concat(cumluativeScreening.totalCompanyAdverseNews);
				}
			} else {
				this.hierarchyData[hirreacheyIndex].adverseNews_url = cumluativeScreening.totalCompanyAdverseNews;
				if (subsidaries && subsidaries !== 'officers' && subsidaries !== 'subsidaries') {
					this.actualScreeningData[index].adverseNews_url = cumluativeScreening.totalCompanyAdverseNews;
				}
			}
			if (this.actualScreeningData[index].finance_Crime_url) { //checking for key defined
				this.hierarchyData[hirreacheyIndex].finance_Crime_url = this.hierarchyData[hirreacheyIndex].finance_Crime_url.concat(cumluativeScreening.totalCompanyFinancialNews);
				if (this.hierarchyData[hirreacheyIndex].finance_Crime_url && subsidaries && subsidaries !== 'officers' && subsidaries !== 'subsidaries') {
					this.actualScreeningData[index].finance_Crime_url = this.actualScreeningData[index].finance_Crime_url.concat(cumluativeScreening.totalCompanyFinancialNews);
				} else {
					this.hierarchyData[hirreacheyIndex].finance_Crime_url = cumluativeScreening.totalCompanyFinancialNews;
				}
			} else { //else key is defined and assigned
				this.hierarchyData[hirreacheyIndex].finance_Crime_url = cumluativeScreening.totalCompanyFinancialNews;
				if (subsidaries && subsidaries !== 'officers' && subsidaries !== 'subsidaries') {
					this.actualScreeningData[index].finance_Crime_url = cumluativeScreening.totalCompanyFinancialNews;
				}
			}
    }
  }

  /* @purpose:  Create final struture
		 *
		 * @created: 07 may 2018
		 * @params: type(string)
		 * @returns: no
		 * @author: Ram Singh */
	CreatefinalJson(arr, parent, divId, status) {
		arr.forEach((val, key)=> {
			val.innerSource = (val.innerSource && val.innerSource.toLowerCase() !== 'bst') ? val.innerSource : '';
			val.classification = val.classification ? val.classification : [];
		});
		var FinalData = [];
		// this.screeningData = [];
		this.actualScreeningData = [];
		FinalData = arr;
		this.subsidaryFilterData = arr;
		this.subsidaryFilterData_originalView = arr;
		this.subsidaryFilterData_customView = arr;
		this.subsidiaries[0].subsidiaries = [];
		var subsidarycount = [];
		var parentCount = [];
		var subsidariesScreening = [];
		this.entitySearchResult.list.summaryCount = {
			highRiskCount:this.entitySearchResult.list.summaryCount.highRiskCount ?this.entitySearchResult.list.summaryCount.highRiskCount : 0,
			financeCount:this.entitySearchResult.list.summaryCount.financeCount ?this.entitySearchResult.list.summaryCount.financeCount : 0,
			adverseCount:this.entitySearchResult.list.summaryCount.adverseCount ?this.entitySearchResult.list.summaryCount.adverseCount : 0,
			pepCount:this.entitySearchResult.list.summaryCount.pepCount ?this.entitySearchResult.list.summaryCount.pepCount : 0,
			sanctionCount:this.entitySearchResult.list.summaryCount.sanctionCount ?this.entitySearchResult.list.summaryCount.sanctionCount : 0
		};
		this.identifiedRisk = 0;
		this.ScreeningRisk = 0;
		arr.forEach((val, index, array)=> {
			val.name = val.title;
			if (val.entity_id === "orgChartParentEntity") {
				parentCount.push(val);
				// var financeUrl = find(val.news, {
				// 	'classification': 'Financial Crime'
				// });
				// var adverseUrl = find(val.news, {
				// 	'classification': 'Neutral'
				// });
				val.finance_Crime_url = [];
				// if (financeUrl && financeUrl.count) {
				// 	val.finance_Crime_url = [{
				// 	article: financeUrl['_links'].articles,
				// 	name: val.name,
				// 	entity_id:val.entity_id,
				// 	count:financeUrl.count
				// 	 }];
				// } else {
				// 	val.finance_Crime_url = [];
				// }
				// if (adverseUrl && adverseUrl.count) {
				// 	val.adverseNews_url = [{
				// 			article: adverseUrl['_links'].articles,
				// 			name: val.name,
				// 			entity_id:val.entity_id,
				// 			count:adverseUrl.count
				// 	}];
				// } else {
				// 	val.adverseNews_url = [];
				// }
				val.adverseNews_url = [];
				val.addCubeIcon = true;
				val.sanction_source = (val.sanctions && val.sanctions.length > 0) ? val.sanctions : [];
				val.pep_url = (val.pep && val.pep.length > 0) ? val.pep : [];
				var Ubo_ibo = '';
				var pop_totalPercentage = (val.totalPercentage) ? val.totalPercentage : 0;
				if (val.isUbo) {
					Ubo_ibo = 'UBO';
				} else if ((!val.isUbo && val.isUbo === false) || (!val.isUbo && val.entity_type === "person")) {
					Ubo_ibo = ''
				}
				else if ((val.entity_type && (this.personEntitytype.indexOf(val.entity_type.toLowerCase()) === -1)) && ((pop_totalPercentage && parseInt(pop_totalPercentage) > 25) || (pop_totalPercentage && parseInt(pop_totalPercentage) > 10 && val.high_risk_jurisdiction && val.high_risk_jurisdiction.toLowerCase() === 'high'))) {
					Ubo_ibo = 'IBO'; //+pop_totalPercentage;
				}
				val.Ubo_ibo = Ubo_ibo;
				if (val.subsidiaries && val.subsidiaries.length > 0) {
					var findMaincompany = findIndex(val.subsidiaries, { entity_id: "orgChartmainEntity" });
					if (findMaincompany !== -1) {
						val.subsidiaries.splice(findMaincompany, 1);
					}
					this.subsidaryFilterData = this.subsidaryFilterData.concat(val.subsidiaries);
				}
				if (this.showSubsidaries) {
					FinalData = FinalData.concat(this.subsidaryFilterData);
				}
				for (let index = 0; index <  EntityConstants.customEntites.adddeleteEntity.length; index++) {
					var findEntityExist = findIndex(FinalData, {
						"identifier": EntityConstants.customEntites.adddeleteEntity[index].identifier
					});
					if(findEntityExist === -1){
						FinalData.push(EntityConstants.customEntites.adddeleteEntity[index]);
					}
				}
				this.isEntityEdited(val, FinalData);
			} else if (val.entity_id === "orgChartsubEntity") {
				// subsidarycount.push(val);
			} else if (val.entity_id === "orgChartmainEntity") {
				this.entitySearchResult.list.orgChartSources = val.sources ? val.sources : [];
				if (this.entitySearchResult.list.sourceFirsttimeSelected && val.sources && val.sources.length > 0) {
					var getSourceIndexInSources = val.source_evidence ? val.sources.indexOf(val.source_evidence) : '';
					this.entitySearchResult.list.graphSourceSelected = val.source_evidence && val.source_evidence === 'Annual Report' ? 'companyhouse.co.uk' : (this.entitySearchResult.list.orgChartSources.length > 0 && (this.entitySearchResult.list.graphSourceSelected !== this.entitySearchResult.list.orgChartSources[0]) ? (getSourceIndexInSources !== -1 ? val.source_evidence : this.entitySearchResult.list.orgChartSources[0]) : this.entitySearchResult.list.graphSourceSelected);
					this.entitySearchResult.list.sourceFirsttimeSelected = false;
					this.entitySearchResult.list.intialSourceSelected = this.entitySearchResult.list.graphSourceSelected;
					this.entitySearchResult.list.previousSourceSelected = this.entitySearchResult.list.intialSourceSelected;
				}
				val.FalseNews = [];
				val.non_negativenews = [];
				var address = {
					country: val.country ? val.country : ''
				}
				//var pepParsedData = val.pep_url ? (val.pep_url.length > 0 ? JSON.parse(val.pep_url[0].raw) : '') : '';
				var pepParsedData = (val.pep && val.pep.length > 0) ? val.pep : [];
				var sanctionData = (val.sanctions && val.sanctions.length > 0) ? val.sanctions : [];
				val.sanction_source = sanctionData;
				val.pep_url = $.extend(true, [], pepParsedData);
				const financeUrl = find(val.news, {
					'classification': 'Financial Crime'
				});
				const adverseUrl = find(val.news, {
					'classification': 'Neutral'
				});
				if (financeUrl && financeUrl.count) {
					val.finance_Crime_url = [{
						article: adverseUrl['_links'].articles,
						name: val.name,
						entity_id: val.entity_id,
						count: financeUrl.count
					}];
				} else {
					val.finance_Crime_url = [];
				}
				val.finance_Crime_url = [];
				if (adverseUrl && adverseUrl.count) {
					val.adverseNews_url = [{
						article: adverseUrl['_links'].articles,
						name: val.name,
						entity_id: val.entity_id,
						count: adverseUrl.count
					}];
				} else {
					val.adverseNews_url = [];
				}
				// val.adverseNews_url = [];
				if (val.subsidiaries && val.subsidiaries.length > 0) {
					this.subsidaryFilterData = FinalData.concat(val.subsidiaries);
				}
				if (this.showSubsidaries) {
					FinalData = FinalData.concat(this.subsidaryFilterData);
				}
				for (let index = 0; index < EntityConstants.customEntites.adddeleteEntity.length; index++) {
					var findEntityExist = findIndex(FinalData, {
						"identifier": EntityConstants.customEntites.adddeleteEntity[index].identifier
					});
					if(findEntityExist === -1){
						FinalData.push(EntityConstants.customEntites.adddeleteEntity[index]);
					}
				}
				this.isEntityEdited(val, FinalData);
				this.mainAdverseNews = val.adverseNews_url ? this.mainAdverseNews.concat(val.adverseNews_url) : this.mainAdverseNews;
				this.complianceRightAdverseNews = this.mainAdverseNews;
				var Ubo_ibo = '';
				var pop_totalPercentage = (val.totalPercentage) ? val.totalPercentage : 0;
				var findEntityScreened = findIndex(EntityConstants.customEntites.screeningaddition, {//check for parent index in the screening Results
					"@identifier": val.identifier
				});
				var financeNews = val.news ? (val.news.length > 0 ? this.classtype(val.news, val, 'Financial Crime') : []) : [];
				var adverseNews = val.news ? (val.news.length > 0 ? this.classtype(val.news, val, 'Neutral') : []) : [];
				var findIdinchart = findIndex(this.subsidaryFilterData, {
					"identifier": val.identifier
				});
				if (findIdinchart !== -1 && findEntityScreened !== -1) {
					this.subsidaryFilterData[findIdinchart].pep_url = (EntityConstants.customEntites.screeningaddition[findEntityScreened].pep ? EntityConstants.customEntites.screeningaddition[findEntityScreened].pep : []);
					this.subsidaryFilterData[findIdinchart]['sanction_bst:description'] = (EntityConstants.customEntites.screeningaddition[findEntityScreened].sanctions ? EntityConstants.customEntites.screeningaddition[findEntityScreened].sanctions : []);
					this.subsidaryFilterData[findIdinchart]['adverseNews_url'] = (EntityConstants.customEntites.screeningaddition[findEntityScreened].news ? EntityConstants.customEntites.screeningaddition[findEntityScreened].news : []);
					this.showSubsidariesInchart(this.showSubsidaries);
				}
				val.report_jurisdiction_risk = val.country ? this.entityCommonTabService.calculateCountryRisk(val.country_of_residence || val.country) : val.jurisdiction ? this.entityCommonTabService.calculateCountryRisk(this.entityCommonTabService.getCountryName(val.jurisdiction)) : '';
				val.screeningresultsloader = false;
				val['mdaas:RegisteredAddress']  = address;
				val.sanctions = sanctionData;
				val.high_risk_jurisdiction = val.high_risk_jurisdiction ? val.high_risk_jurisdiction.toLowerCase() : '';
				val.finance_Crime_url = val.news ? (val.news.length > 0 ?this.classtype(val.news, val, 'Financial Crime') : []) : [];
				val.adverseNews_url = val.news ? (val.news.length > 0 ? this.classtype(val.news, val, 'Neutral') : []) : [];
				val.Ubo_ibo = Ubo_ibo;
				val.juridiction = val.jurisdiction;
				val.screeningresultsloader = false;
				val.isChecked = false;
				val['no-screening'] = true;
				var screeningobject = new Screeningconstructor(val);
				if (findEntityScreened === -1) {
					this.actualScreeningData.unshift(screeningobject);
				} else {
					this.actualScreeningData.unshift(screeningobject);
				}
				var filteredSanctions = sanctionData.length > 0 ? this.pep_sanctionScreeningRange(this.filteredChart.sanction_slider_min, this.filteredChart.sanction_slider_max, sanctionData) : [];
				var filteredpep = pepParsedData.length > 0 ? this.pep_sanctionScreeningRange(this.filteredChart.pep_slider_min, this.filteredChart.pep_slider_max, pepParsedData) : [];
				if (filteredSanctions.length > 0) {
					this.entitySearchResult.list.summaryCount.sanctionCount = this.entitySearchResult.list.summaryCount.sanctionCount + filteredSanctions.length;
				}
				if (financeNews && financeNews.length > 0) {
					this.entitySearchResult.list.summaryCount.financeCount = this.entitySearchResult.list.summaryCount.financeCount + (financeNews[0].count ? financeNews[0].count : 0);
				}
				if (adverseNews && adverseNews.length > 0) {
					this.entitySearchResult.list.summaryCount.adverseCount = this.entitySearchResult.list.summaryCount.adverseCount + (adverseNews[0].count ? adverseNews[0].count : 0);
				}
				if (val.high_risk_jurisdiction && val.high_risk_jurisdiction.toLowerCase() !== 'low') {
					this.entitySearchResult.list.summaryCount.highRiskCount = this.entitySearchResult.list.summaryCount.highRiskCount + 1;
				}
				if (filteredpep.length > 0) {
					this.entitySearchResult.list.summaryCount.pepCount = this.entitySearchResult.list.summaryCount.pepCount + filteredpep.length;
				}
				this.entitySearchResult.is_data_not_found.is_rightScreening_data = false;
				this.entitySearchResult.is_data_not_found.is_rightadverseNews = false;
				if (sanctionData.length > 0 || (financeNews.length > 0) || (adverseNews.length > 0) || (val.high_risk_jurisdiction && val.high_risk_jurisdiction !== "" && val.high_risk_jurisdiction.toLowerCase() !== 'low') || pepParsedData.length > 0) {
					this.summaryScreenig.unshift(screeningobject);
				}
				//counts the risk of the company
				var TotalRisk = (val.adverseNews_url && val.adverseNews_url.length > 0) ? 1 : 0;
				if (sanctionData.length > 0) {
					TotalRisk = TotalRisk + 1;
				}
				if (val.high_risk_jurisdiction && val.high_risk_jurisdiction !== "" && val.high_risk_jurisdiction.toLowerCase() !== 'low') {
					TotalRisk = TotalRisk + 1;
				}
				if (val.finance_Crime_url && val.finance_Crime_url.length > 0) {
					TotalRisk = TotalRisk + 1;
				}
				if (pepParsedData.length > 0) {
					TotalRisk = TotalRisk + 1;
				}
				this.ScreeningRisk = TotalRisk;
				this.mainCompanyobject = {
					id: val.id,
					indirectPercentage: val.indirectPercentage,
					title: val.title,
					totalPercentage: val.totalPercentage,
					entity_id: val.entity_id
				};
			}
			if (val.subsidiaries && val.subsidiaries.length > 0) {
				val.subsidiaries.map(function (subsidaryVal) {
					subsidaryVal.title = subsidaryVal.keyword ? subsidaryVal.keyword : (subsidaryVal.name ? subsidaryVal.name : '');
					subsidaryVal.Paridentifier = val.identifier ? val.identifier : '';
						return subsidaryVal;
				});
				var findMaincompany = findIndex(val.subsidiaries, { entity_id: "orgChartmainEntity" });
				if (findMaincompany !== -1) {
					val.subsidiaries.splice(findMaincompany, 1);
				}
				subsidariesScreening = subsidariesScreening.concat(val.subsidiaries);
			}
		}); // finaliniquelist for  loop ends
		var finaliniquelist = ($.extend(true, [], arr));
		finaliniquelist = uniqBy(finaliniquelist, 'identifier');
		this.subsidiaries[0].subsidiaries = finaliniquelist;
		this.ownershipCount.parentCount = parentCount.length;
		this.ownershipCount.subsidaryCount = subsidarycount.length;
		this.hierarchyData = FinalData;
		this.subsidariesfilteredData = this.hierarchyData;
		var filterOriginal = FinalData.filter(function (entites) {
			if ((!entites.isCustom && entites.isCustom === false) || (!entites.isCustom)) {
				return !entites.isCustom;
			}
		})
		var filterCustom = FinalData.filter(function (entites) {
			return entites.isCustom || entites.id == "p00";
		})
		this.isCustomAvailable = (filterCustom.length > 1) ? true : false;
		if (this.isCustomAvailable && !this.graphUtilites.originalClicked) {
			divId = 'vlaContainer_customView';
			this.entitySearchResult.list.currentVLArendered = 'vlaContainer_customView';
			this.entitySearchResult.list.graphviewIndex = 1;
			this.customChartView = true;
			// this.graphtab.select('vlaContainer_customViewtab');//changes the Graph Tab
			if (!this.graphtab) {
				setTimeout(() => {
					this.graphtab.select('vlaContainer_customViewtab');//changes the Graph Tab
					$("#vlaContainer_customViewtab").click();//graph tab clicked by jquery to be safe
				}, 3000);
			} else {
				this.graphtab.select('vlaContainer_customViewtab');//changes the Graph Tab
				$("#vlaContainer_customViewtab").click();//graph tab clicked by jquery to be safe
			}
		}
		this.originalHierrachyData = ($.extend(true, [], filterOriginal));
		this.companyScreening(arr,'');
		if (subsidariesScreening.length > 0) {
			this.companyScreening(subsidariesScreening, 'subsidaries');//this function is used for shareholders  and subsidaries but screening reflection is for subsidaries
		} else {
			this.pageloader.screeningLoader = false;
		}
		if (EntityConstants.fetchLink_officershipScreeningData.length > 0) {
			this.companyScreening(EntityConstants.fetchLink_officershipScreeningData, 'officers');
		} else {
			this.screeningData = $.extend(true, [], this.actualScreeningData);
			this.pageloader.screeningLoader = false;
		}
		var conbinedSreening = this.actualScreeningData.concat(EntityConstants.customEntites.screeningaddition);//this line of code is for total Enties
		this.screeningTableOriginal_custom(conbinedSreening);
		// this.screeningTable_OfficersPrioritySources().then((response:any[])=> {
		// 	this.screeningData = response;
		// });
		// this.orgChart(this.hierarchyData);
		// $rootScope.ownershipScope = hierarchyData;
			// var currentOPts = $.extend(true, {}, options);
			var graphschartData = this.originalHierrachyData;
			if (this.entitySearchResult.list.currentVLArendered === 'vlaContainer_customView') {
				graphschartData = filterCustom;
			} else if (this.entitySearchResult.list.currentVLArendered === 'vlaContainer_originalView' || this.entitySearchResult.list.currentVLArendered === 'vlaContainer') {
				graphschartData = this.originalHierrachyData;
			}
			graphschartData =  this.calculateGraphConflictData(graphschartData);
			// graphschartData.forEach((subSidaryVal, key, self) =>{
			// 	if (subSidaryVal.parents && subSidaryVal.parents.length > 0) {
			// 		var total_percentage_all = 0;
			// 		var allParentsIndexs = [];
			// 		for (var i = 0; i < subSidaryVal.parents.length; i++) {
			// 			var parentTotalIndex = findIndex(self, {
			// 				id: subSidaryVal.parents[i]
			// 			});
			// 			if (parentTotalIndex !== -1 && self[parentTotalIndex].totalPercentage) {
			// 				allParentsIndexs.push(parentTotalIndex);
			// 				total_percentage_all = total_percentage_all + self[parentTotalIndex].totalPercentage;
			// 			} //inner if
			// 		} //for loops ends
			// 		// if (total_percentage_all > 100) {
			// 		allParentsIndexs.forEach(function (val) {
			// 			graphschartData[val].isConflict = total_percentage_all > 100 ? true : false;
			// 		});
			// 		// }//inner if ends
			// 	} //if ends
			// });
			this.orgChartOptions.items = $.extend(true, [], graphschartData);
			EntityConstants.basicSharedObject.entites_renderedIn_chart = this.orgChartOptions.items;
			//EntityConstants.basicSharedObject.entites_renderedIn_chart = this.entites_renderedIn_chart;
			const entities_items = uniqBy(this.entites_renderedIn_chart.filter(function (d) { return d.entity_type === 'person' }), 'identifier')
			this.orgChartOptions.annotations = this.graphAnnotations(entities_items);
			var str1 =new String("#");
  			divId = str1.concat(divId);
			$(divId).find('.orgdiagram .custom-scroll-wrapper').remove();
			setTimeout(()=>  {
				$(divId).famDiagram(this.orgChartOptions);
				setTimeout(()=>  {
					if (this.filteredApplied) {
						$(divId).famDiagram("update", /*Refresh: use fast refresh to update chart*/ primitives.orgdiagram.UpdateMode.Recreate);
						$(divId).children(".orgdiagram").addClass("custom-scroll-wrapper");
					}
					$(divId).children().css("width", "100%");
					$(divId).children().addClass('custom-scroll-wrapper');
					this.entityCommonTabService.AppendOrgGraphIcon(divId);
					if ( $(divId).html() && $(divId).html().length) {
						$(divId).famDiagram("update", /*Refresh: use fast refresh to update chart*/ primitives.orgdiagram.UpdateMode.Recreate);
						this.entityCommonTabService.AppendOrgGraphIcon(divId);
						$(divId).children(".orgdiagram").addClass("custom-scroll-wrapper");
					}
				}, 2000);
				// if ($(divId).html() && $(divId).html().length) {
				// 	$(divId).famDiagram("update", /*Refresh: use fast refresh to update chart*/ primitives.orgdiagram.UpdateMode.Recreate);
				// 	this.entityCommonTabService.AppendOrgGraphIcon(divId);
				// 	$(divId).children(".orgdiagram").addClass("custom-scroll-wrapper");
				// }
			}, 2000);
			this.pageloader.treeGraphloader = false;
			if (status && status === 'completed') {
				this.getComplexStructureIndicator();
			}
			if (status && status === 'completed' && arr && arr.length == 1 && arr[0]['is-error'] && arr[0].error) {
				// HostPathService.FlashErrorMessage('ERROR', arr[0].error);
			}
			//this.generateReport = true;
	} //function ends

	/*
	* @Purpose: Function to check for Edited and deleted company from the chart
	* @Params :  obj<Object>, tabname<classstype>
	* @Date : 01-04-2019
	* @author: Ram Singh
	*/
	 isEntityEdited(checkCompany, self) {
		const isCompanydeleted = findIndex(EntityConstants.customEntites.deleteEntityChart, {
			name: checkCompany.name
		});
		if (isCompanydeleted !== -1) {
			const deletedIndex = this.entityIndexInchart(self, checkCompany);
			self.splice(deletedIndex, 1);
			const addcompanyIndex = findIndex(this.subsidaryFilterData, {
				identifier: checkCompany.identifier
			});
			this.subsidaryFilterData.splice(addcompanyIndex, 1);
		};
		const isCompanyEdited = find(EntityConstants.customEntites.editedEnties, {
			name: checkCompany.name
		});
		if (isCompanyEdited && !isEmpty(isCompanyEdited)) {
			var EditedIndex = this.entityIndexInchart(self, checkCompany);
			if (EditedIndex !== -1) {
				self[EditedIndex].country = isCompanyEdited.jurisdictionOriginalName !== "Select Country" ? isCompanyEdited.jurisdictionOriginalName : "";
				self[EditedIndex].jurisdiction = isCompanyEdited.jurisdiction ? isCompanyEdited.jurisdiction : (isCompanyEdited.juridiction ? isCompanyEdited.juridiction : '');
				self[EditedIndex].juridiction = isCompanyEdited.juridiction ? isCompanyEdited.juridiction : (isCompanyEdited.jurisdiction ? isCompanyEdited.jurisdiction : '');
				self[EditedIndex].indirectPercentage = isCompanyEdited.indirectPercentage ? isCompanyEdited.indirectPercentage : self[EditedIndex].indirectPercentage;
				self[EditedIndex].indirectPercentage = isCompanyEdited.indirectPercentage ? isCompanyEdited.indirectPercentage : self[EditedIndex].indirectPercentage;
				self[EditedIndex].totalPercentage = isCompanyEdited.totalPercentage ? isCompanyEdited.totalPercentage : self[EditedIndex].totalPercentage;
				self[EditedIndex].Ubo_ibo = isCompanyEdited.Ubo_ibo ? isCompanyEdited.Ubo_ibo : self[EditedIndex].Ubo_ibo;
			}
		}
		var isParentAdded = find(EntityConstants.customEntites.adddeleteEntity, {
			child: checkCompany.id
		});
		if (isParentAdded && !isEmpty(isParentAdded)) {
			var parenrAddedto = this.entityIndexInchart(self, checkCompany);
			if (parenrAddedto !== -1) {
				self[parenrAddedto].parents.push(isParentAdded.id);
			}
		}
	}
	/*
	* @Purpose: Function to check the Index of Main Company
	* @Params :   >
	* @Date : 01-04-2019
	* @author: Ram Singh
	*/
		entityIndexInchart(self, checkCompany) {
		var EditedIndex = findIndex(self, {
			name: checkCompany.name
		});
		return EditedIndex;
	}
	/*
	* @Purpose: //function for Showing only Orginal Entites in The Screening
	* @Params :   >
	* @Date : 01-04-2019
	* @author: Ram Singh
	*/
		screeningTableOriginal_custom = (combinedscreeenig) => {
			this.screeningData = combinedscreeenig.filter((val) => {
				if ((val.isCustom === this.isCustomAvailable) || val.Ubo_ibo === "officers" || val.entity_id === "orgChartmainEntity" || val.entity_id === "orgChartsubEntity") {
					return val;
				} else if (val.entity_id === "orgChartParentEntity" && !val.isCustom && (this.entitySearchResult.list.currentVLArendered === "vlaContainer" || this.entitySearchResult.list.currentVLArendered === "vlaContainer_originalView")) {
					return val;
				}
			});
		}
		/*
	* function :checks the screening Table Entites marked as high priporite
	* @author : Ram Singh
	* @date : 11 july 2019
	*/
	screeningTable_OfficersPrioritySources = () => {
		this.totalOfficers_link = EntityConstants.basicSharedObject.totalOfficers_link;
		let promise = new Promise( (resolve, reject)=> {
			resolve(this.success());
			reject('syntax issue');

		});
		return promise;
	}
	success() {
		var highCreditableOfficers = this.actualScreeningData.filter((val) => {
			if (val.highCredibilitySource) {
				return val.highCredibilitySource
			}
		});//filter Ends
		if (highCreditableOfficers.length > 0) {
			highCreditableOfficers.forEach((val) => {
				var changeManagerValue = find(EntityConstants.basicSharedObject.totalOfficers_link, {
					'name': val.name,
					'source': val.highCredibilitySource
				});
				var findIndex_actualScreening = this.actualScreeningData.findIndex( (d)=> {
					return (d.name == val.name && d.highCredibilitySource == val.highCredibilitySource);
				});
				var findIndex_ScreeningData = this.screeningData.findIndex((d)=> {
					return (d.name == val.name && d.highCredibilitySource == val.highCredibilitySource);
				});
				this.populateScreeningTable(findIndex_actualScreening, findIndex_ScreeningData, changeManagerValue)
			});	//for eachs Ends
		}
		return this.screeningData;
	}
	/*
	* function to Manipulate/update the Entites having  Data
	* @author : Ram Singh
	* @date : 11 july 2019
	*/
	populateScreeningTable = (actualIndex, screeningIndex, changeManagerValue) => {
		if (changeManagerValue) {
			var country = changeManagerValue.country_of_residence ? changeManagerValue.country_of_residence : (changeManagerValue.address && changeManagerValue.address.country) ? changeManagerValue.address.country : '';
			if (screeningIndex !== -1) {
				this.screeningData[screeningIndex].officer_role = changeManagerValue.officer_role ? changeManagerValue.officer_role : '';
				this.screeningData[screeningIndex].officer_roles = changeManagerValue.officer_role ? [changeManagerValue.officer_role] : '';
				this.screeningData[screeningIndex].country = country ? country : changeManagerValue.country ? changeManagerValue.country : '';
				this.screeningData[screeningIndex].date_of_birth = changeManagerValue.dateOfBirth ? changeManagerValue.dateOfBirth : '';
				this.screeningData[screeningIndex].information_provider = changeManagerValue.source_url ? changeManagerValue.source_url : '';
			}
			if (actualIndex !== -1) {
				this.actualScreeningData[actualIndex].officer_role = changeManagerValue.officer_role ? changeManagerValue.officer_role : '';
				this.actualScreeningData[actualIndex].officer_roles = changeManagerValue.officer_role ? [changeManagerValue.officer_role] : '';
				this.actualScreeningData[actualIndex].country = country ? country : changeManagerValue.country ? changeManagerValue.country : '';
				this.actualScreeningData[actualIndex].date_of_birth = changeManagerValue.dateOfBirth ? changeManagerValue.dateOfBirth : '';
				this.actualScreeningData[actualIndex].information_provider = changeManagerValue.source_url ? changeManagerValue.source_url : '';
			}
		}
	}

		complianceCountriesofOperation(response) {
			var ComplianceLocations = [];
			var CountriesData = {
				allcountries: [],
				finallist: []
			}
			if (response && response.CountryOperations && response.CountryOperations.length) {
				var countryValue = response.CountryOperations;
				for (var index = 0; index < countryValue.length; index++) {
					var camelCase = countryValue[index].country ? countryValue[index].country.toUpperCase() : '';
					var countryName = find(EntityConstants.chartsConst.countryRisk, ['COUNTRY', camelCase]);
					if (countryName) {
						countryValue[index].CountryRisk = this.entityCommonTabService.calculateCountryRisk(countryName.COUNTRY);
						if (countryValue[index].CountryRisk === 'UHRC' || countryValue[index].CountryRisk === 'High') {
							this.entitySearchResult.list.highcountryRisk += 1;
						}
						countryValue[index].country_code = camelCase;
						countryValue[index].country_name = countryName.COUNTRY;
						countryValue[index].primary_url = countryValue[index].primarySource ? countryValue[index].primarySource : [];
						countryValue[index].secondary_url = countryValue[index].secondarySource ? countryValue[index].secondarySource : [];
						var camelCase = this.entityCommonTabService.toTitleCase(countryValue[index].country_name);
						ComplianceLocations.push({ 'name': camelCase });
						CountriesData.allcountries.push(countryValue[index])
					}
				}
			}
			if (ComplianceLocations.length > 0) {
				var sortedCountries = this.sortCountryOfOperations(CountriesData.allcountries);
				this.CountryOperations = sortedCountries;
				this.CountryOperationsViewForMap = this.formateCountriesOperationsForWorldMapInReport(this.CountryOperations);
				this.nested_countries_report_data = this.gorupedCountriesBasedOnSources(this.CountryOperationsViewForMap);
				this.worldComplianceLocationsOptionsAtBottom.markers = ComplianceLocations;
			}
			// this.entityCommonTabService.World(entityCommonTabService.tabsWorldMap.worldComplianceLocationsOptions);
			this.worldComplianceLocationsOptionsAtBottom.markers = [];
			this.entityCommonTabService.World(this.worldComplianceLocationsOptionsAtBottom, this.CountryOperations);
			this.pageloader.countriesloader = false;
			this.pageloader.companyOperationReview = false;
		}
		/* @purpose: grouping country operations
		* @created:04/02/2019
		* @author: Ram
	*/
		 gorupedCountriesBasedOnSources(tempOperationsForReport) {
			var groupedCountries = d3.nest()
				.key( (d:any)=> { return d.country })
				// .key(function (d) { d.Risk = d.Risk ?  d.Risk : (d.countryRisk ?  d.countryRisk : false)
				// 	return d.Risk })
				.entries(tempOperationsForReport);
			return groupedCountries;
		}
		/* @purpose: Sorting contries of operations
		* @created:04/02/2019
		* @author: karnakar
	*/
	sortCountryOfOperations(countryOperations) {
		var highRiskCountries = [];
		var lowRiskCountries = [];
		var mediumRiskCountries = [];
		var uhrcRiskCountries = [];
		countryOperations.forEach((val)=> {
			if ((val.Risk && val.Risk.toLowerCase() === 'uhrc') || (val.CountryRisk && val.CountryRisk.toLowerCase() === 'uhrc')) {
				uhrcRiskCountries.push(val);
				this.sortEachRiskOfContries(uhrcRiskCountries);
			}
			else if ((val.Risk && val.Risk.toLowerCase() === 'high') || (val.CountryRisk && val.CountryRisk.toLowerCase() === 'high')) {
				highRiskCountries.push(val);
				this.sortEachRiskOfContries(highRiskCountries);
			}
			else if ((val.Risk && val.Risk.toLowerCase() === 'medium') || (val.CountryRisk && val.CountryRisk.toLowerCase() === 'medium')) {
				mediumRiskCountries.push(val);
				this.sortEachRiskOfContries(mediumRiskCountries);
			}
			else {
				lowRiskCountries.push(val);
				this.sortEachRiskOfContries(lowRiskCountries);
			}
		});
		var sortedData = uhrcRiskCountries.concat(highRiskCountries, mediumRiskCountries, lowRiskCountries);
		return sortedData;
	}
	sortEachRiskOfContries(riskContries) {
		if(riskContries){
			riskContries.sort(function (a, b) {
				if ((a.country_name && b.country_name && (a.country_name < b.country_name)) || (a.Country && b.Country && (a.Country < b.Country))) { return -1; }
				if ((a.country_name && b.country_name && (a.country_name > b.country_name)) || (a.Country && b.Country && (a.Country > b.Country))) { return 1; }
			return 0;
			});
		}

	}
	/* @purpose: return graph Annoataions
 *
 * @created: 24 sep 2019
 * @params: type(string)
 * @returns: no
 * @author: Ram Singh */
	graphAnnotations(entities_items){
		var linesannotatios = [];
		entities_items.forEach((val:any, key) => {
		  if (val.entity_type === 'person') {
			if (val.indirectChilds && val.indirectChilds.length) {
			  val.indirectChilds.forEach( (data, index)=> {
				var lineann = new primitives.orgdiagram.ConnectorAnnotationConfig();
				lineann.fromItem = data.id;
				lineann.toItem = val.id;
				lineann.label = "<div class='bp-badge' style='width:50px; height:17px;background-color:#388E3C; color: white;line-height:0.9;top:6px;position:relative;'>" + data.indirectPercentage.toFixed(2) + "%</div>";
				lineann.labelSize = new primitives.common.Size(80, 30);
				lineann.offset = 0;
				lineann.connectorShapeType = primitives.common.ConnectorShapeType.OneWay;
				lineann.color = '#388E3C';
				lineann.lineWidth = 2;
				lineann.lineType = primitives.common.LineType.Dashed;
				lineann.selectItems = false;
				lineann.connectorPlacementType = primitives.common.ConnectorPlacementType.Offbeat;
				if (data.isDirect) {
				  lineann.lineWidth = 1;
				  lineann.lineType = primitives.common.LineType.Solid;
				  lineann.connectorPlacementType = primitives.common.ConnectorPlacementType.Straight;
				  lineann.color = "rgb(88, 107, 113)";
				}
				const lineannAlreadyExist = find(linesannotatios, {
				  'fromItem':  data.id,
				  'toItem': val.id
				});
				if(!lineannAlreadyExist){
				  linesannotatios.push(lineann);
				}
			  });
			}
		  }
		});
		return linesannotatios;
	  }
	ngAfterViewInit(){
		$("body").on("click", ".entityDetails", (e)=> {
			e.preventDefault();
			e.stopPropagation();
			this.showEntitesDetails(e);
		});
		$("body").on("click", function (e) {
			if (!$(e.target).parents('.entity_popover').hasClass('entity_popover') || $(e.target).attr("id") == "closeentityModal") {
				$(".entity_popover").html('');
				$(".entity_popover").css("display", "none");
				$(".selectedEntityOptions").html('');
				$(".selectedEntityOptions").css("display", "none");
			}
		})
		$("body").on("click", ".org-chart-item",(event)=>{
			this.onChartClickData(event);
		});
		this.sliderAvgExpen(this.sliderUtilitesobj.sliderMinValue, this.sliderUtilitesobj.sliderMaxValue);
		this.sanctionsliderfilter(this.filteredChart.sanction_slider_min, this.filteredChart.sanction_slider_max);
		this.pepsliderfilter(this.filteredChart.pep_slider_min, this.filteredChart.pep_slider_max);
		this.yearsliderfilter(this.filteredChart.yearliderMinValue, this.filteredChart.yearsliderMaxValue);

		// TODO: check if it is used
		 $("body").on("click",".ownerShipEntityEdit",(e)=>{

			this.openEditModal(e);
		 });
		 $("body").on("click", ".addCompanyInchart",  (e)=> {
			this.addEntityOwnership('', 'organization');
			// this.addModelClassification.companyListData = [{ id: 1, label: "General Partner" }, { id: 2, label: "Director" }, { id: 3, label: "Intermediate Parent" }, { id: 4, label: "Ultimate Legal Parent" }]; this.example9settings = { enableSearch: true };
		});
		$("body").on("click", ".addPersonInchart",  (e)=>{
			this.addEntityOwnership('', 'person');
			// this.addModelClassification.personRoleData = [{ id: 1, label: "Chief Executive Officer" }, { id: 2, label: "Chief Financial Officer" }, { id: 3, label: "Chief Operating Officer" }, { id: 4, label: "Chief Risk Officer" }, { id: 5, label: "Chief Compliance Officer" }, { id: 6, label: "Director" }, { id: 7, label: "Executive Board" }, { id: 8, label: "Management Board" }, { id: 10, label: "Vice President" }, { id: 11, label: "President" }, { id: 12, label: "Branch Manager" }, { id: 13, label: "Chairman" }];
			// this.personRoleSettings = { enableSearch: false, idProperty: 'id' };
			// this.companyRoleSettings = { enableSearch: false, idProperty: 'id' };
			// this.addModelClassification.personListData = [{ id: 1, label: "General Partner" }, { id: 2, label: "Director" }, { id: 3, label: "Main Prinicipals" }, { id: 4, label: "Principals" }, { id: 5, label: "Pesudo UBO" }, { id: 6, label: "UBO" }]; this.personSettings = { enableSearch: true };
		});
		//function to delete entity ownership corporatestructure
		$("body").on("click", '.shareholderEvidenceIcon',  ()=> {
			this.openShareHolderModal(this.entityDataOnClikOfOdg);
		});
		$("body").on("click", '.deleteScreening',  (e)=> {
			this.openDeleteConfirmationModal(this.deleteSelectedEntity,false);
		});
		$('body').on('click', "#flowChartViewDiv1 #btn50",  ()=> {
			this.onScale(0.5);
		})
		$('body').on('click', "#flowChartViewDiv1 #btn100",  ()=> {
			this.onScale(1);
		});
		$('body').on('click', "#flowChartViewDiv1 #btn150",  ()=> {
			this.onScale(1.5);
		});
	}
	showEntitesDetails(e) {
		$(".entity_popover").html('');
		$(".selectedEntityOptions").html('');
		$(".selectedEntityOptions").css("display", "none");
		$(".entity_popover").css("display", "none");
		//below section handles the Data for popover on click of entity
		var flagCountry = (this.entityDataOnClikOfOdg && this.entityDataOnClikOfOdg.country) ? this.entityDataOnClikOfOdg.country : '';
		var flag_class_code = this.entityDataOnClikOfOdg.jurisdiction ? ('flag-icon-' + this.entityDataOnClikOfOdg.jurisdiction.toLowerCase()) : this.entityDataOnClikOfOdg.juridiction ? ('flag-icon-' + this.entityDataOnClikOfOdg.juridiction.toLowerCase()) : ((this.entityDataOnClikOfOdg.basic && this.entityDataOnClikOfOdg.basic.isDomiciledIn) ? ('flag-icon-' + this.entityDataOnClikOfOdg.basic.isDomiciledIn.toLowerCase()) : '');
		var person_company_icon = this.entityDataOnClikOfOdg.entity_type ? (((this.personEntitytype.indexOf(this.entityDataOnClikOfOdg.entity_type.toLowerCase())) !== -1) ? 'fa-user' : 'fa-university') : 'fa-university'
		var evidenceUrl = this.entityDataOnClikOfOdg.source_evidence_url ? this.entityDataOnClikOfOdg.source_evidence_url : (this.entityDataOnClikOfOdg.source_evidence ? this.entityDataOnClikOfOdg.source_evidence : 'javascript:void(0);');
		var evidenceUrl_href = this.entityDataOnClikOfOdg.source_evidence_url ? this.entityDataOnClikOfOdg.source_evidence_url : 'javascript:void(0);'
		var evidenceSource = this.entityDataOnClikOfOdg.source_evidence ? this.entityDataOnClikOfOdg.source_evidence : '';
		var evidence_pointer = this.entityDataOnClikOfOdg.source_evidence_url ? 'c-pointer' : 'c-arrow';
		var evidence_pointer_link = this.entityDataOnClikOfOdg.source_evidence_url ? '' : 'hidden';
		var pop_indirectPercentage = (this.entityDataOnClikOfOdg && this.entityDataOnClikOfOdg.indirectPercentage) ? this.entityDataOnClikOfOdg.indirectPercentage : 0;
		var pop_totalPercentage = (this.entityDataOnClikOfOdg && this.entityDataOnClikOfOdg.totalPercentage) ? this.entityDataOnClikOfOdg.totalPercentage : 0;
		var fulladdress = this.entityDataOnClikOfOdg.basic && this.entityDataOnClikOfOdg.basic['mdaas:RegisteredAddress'] && this.entityDataOnClikOfOdg.basic['mdaas:RegisteredAddress'].fullAddress ? this.entityDataOnClikOfOdg.basic['mdaas:RegisteredAddress'].fullAddress : '';
		var entity_role = '';
		var numberOfShares = 50//this.entityDataOnClikOfOdg.numberOfShares ? (!isNaN(this.entityDataOnClikOfOdg.numberOfShares) ? Number(this.entityDataOnClikOfOdg.numberOfShares).formatAmt(0) : this.entityDataOnClikOfOdg.numberOfShares) : 'N/A';
		if (this.entityDataOnClikOfOdg.entity_id) {
			entity_role = this.entityDataOnClikOfOdg.entity_id === 'orgChartmainEntity' ? 'child-container additional-container' : (this.entityDataOnClikOfOdg.entity_id === 'orgChartsubEntity' ? 'child-container' : '');
		}
		var hide_subsidaries = (this.entityDataOnClikOfOdg && this.entityDataOnClikOfOdg.entity_id === 'orgChartsubEntity') ? 'd-none' : '';
		var pepclass = (this.entityDataOnClikOfOdg.pep_url && this.entityDataOnClikOfOdg.pep_url.length > 0) ? '' : 'd-none';
		var adverseclass = (this.entityDataOnClikOfOdg.adverseNews_url && this.entityDataOnClikOfOdg.adverseNews_url.length > 0) ? '' : 'd-none';
		var financeclass = (this.entityDataOnClikOfOdg.finance_Crime_url && this.entityDataOnClikOfOdg.finance_Crime_url.length > 0) ? '' : 'd-none';
		var sanctionclass = (this.entityDataOnClikOfOdg.sanction_source && this.entityDataOnClikOfOdg.sanction_source.length > 0) ? '' : 'd-none';
		var jurisdictionclass = (this.entityDataOnClikOfOdg.high_risk_jurisdiction && this.entityDataOnClikOfOdg.high_risk_jurisdiction.toLowerCase() !== 'low') ? '' : 'd-none';
		var pepLength = (this.entityDataOnClikOfOdg.pep_url && this.entityDataOnClikOfOdg.pep_url.length > 0) ? this.entityDataOnClikOfOdg.pep_url.length : 0;
		var adversenewsLength = 0;
		if (this.entityDataOnClikOfOdg.adverseNews_url && this.entityDataOnClikOfOdg.adverseNews_url.length > 0) {
			this.entityDataOnClikOfOdg.adverseNews_url.map(function (val) {
				adversenewsLength = adversenewsLength + (val.count ? val.count : 0)
			});
		}
		var financenewsLength = 0;
		if (this.entityDataOnClikOfOdg.finance_Crime_url && this.entityDataOnClikOfOdg.finance_Crime_url.length > 0) {
			this.entityDataOnClikOfOdg.finance_Crime_url.map(function (val) {
				financenewsLength = financenewsLength + (val.count ? val.count : 0)
			});
		}
		var sanctionLength = (this.entityDataOnClikOfOdg.sanction_source && this.entityDataOnClikOfOdg.sanction_source.length > 0) ? this.entityDataOnClikOfOdg.sanction_source.length : 0;
		var jurisdictionLength = (this.entityDataOnClikOfOdg.high_risk_jurisdiction && this.entityDataOnClikOfOdg.high_risk_jurisdiction.toLowerCase() !== 'low') ? 1 : 0;
		var showScreeningList = (pepLength === 0 && adversenewsLength === 0 && financenewsLength === 0 && sanctionLength === 0 && jurisdictionLength === 0) ? 'd-none' : '';
		var uboClass = '';
		var Ubo_ibo = '';
		if (this.entityDataOnClikOfOdg.entity_id === 'orgChartmainEntity') {
			entity_role = 'child-container additional-container';
			uboClass = 'd-none';
		} else if (this.entityDataOnClikOfOdg.entity_id === 'orgChartsubEntity') {
			entity_role = 'child-container subsidery-container';
			uboClass = 'd-none';
		} else if (this.entityDataOnClikOfOdg.Ubo_ibo === "UBO " || this.entityDataOnClikOfOdg.Ubo_ibo === "UBO") {
			Ubo_ibo = this.entityDataOnClikOfOdg.isUbo ? 'UBO ' : ''; // +pop_totalPercentage;
			entity_role = '';
		} else if ((this.entityDataOnClikOfOdg.Ubo_ibo === "IBO ") || (this.entityDataOnClikOfOdg.Ubo_ibo === "IBO")) {
			Ubo_ibo = 'IBO '; //+pop_totalPercentage;
			entity_role = 'child-container';
		} else {
			entity_role = 'child-container';
			Ubo_ibo = ''; //pop_totalPercentage;
			uboClass = 'd-none';
		}
		var deletebtn = false;
		if (this.entityDataOnClikOfOdg.entity_id !== "orgChartmainEntity" && this.entityDataOnClikOfOdg.parents && this.entityDataOnClikOfOdg.parents.length > 0 && this.entityDataOnClikOfOdg.subsidiaries && this.entityDataOnClikOfOdg.subsidiaries.length > 0 && !this.showSubsidaries) {
			deletebtn = false;
		} else if ((this.entityDataOnClikOfOdg.entity_id !== "orgChartmainEntity" || !this.entityDataOnClikOfOdg.entity_id) && (!this.entityDataOnClikOfOdg.parents || this.entityDataOnClikOfOdg.parents.length == 0)) {
			deletebtn = true;
		} else if (this.entityDataOnClikOfOdg.parents && this.entityDataOnClikOfOdg.parents.length > 0 && this.entityDataOnClikOfOdg.subsidiaries && this.entityDataOnClikOfOdg.subsidiaries.length > 0 && this.showSubsidaries) {
			deletebtn = false;
		} else if (this.entityDataOnClikOfOdg.entity_id !== "orgChartmainEntity" && this.entityDataOnClikOfOdg.parents && this.entityDataOnClikOfOdg.parents.length > 0 && (!this.entityDataOnClikOfOdg.subsidiaries || this.entityDataOnClikOfOdg.subsidiaries.length > 0) && this.showSubsidaries) {
			deletebtn = true;
		}
		this.popOverEditDataForOwnership = this.entityDataOnClikOfOdg;
		var innerSourceHtml = '';
		var sourceUrl_href = this.entityDataOnClikOfOdg.sourceUrl ? this.entityDataOnClikOfOdg.sourceUrl : 'javascript:void(0);';
		var sourceUrl_source = this.entityDataOnClikOfOdg.source_evidence ? this.entityDataOnClikOfOdg.source_evidence : '';
		var sourceUrl_href_pointer = this.entityDataOnClikOfOdg.sourceUrl ? 'c-pointer' : 'c-arrow';
		var published_date = this.entityDataOnClikOfOdg.from ? this.entityDataOnClikOfOdg.from : '';
		var sourceUrl_pointer_link = this.entityDataOnClikOfOdg.sourceUrl ? '' : 'hidden';
		if (this.entityDataOnClikOfOdg.innerSource && sourceUrl_source && (this.entityDataOnClikOfOdg.innerSource == sourceUrl_source)) {
			sourceUrl_source = '';
		}
		if (this.entityDataOnClikOfOdg.innerSource && sourceUrl_source && published_date) {
			innerSourceHtml = '<a class="text-dark-cream font-regular f-12 ' + sourceUrl_href_pointer + '" href="' + sourceUrl_href + '" target="_blank">' + sourceUrl_source + '<span class= "fa mar-x5 fa-external-link ' + sourceUrl_href_pointer + ' ' + sourceUrl_pointer_link + '"> </span></a>';
			innerSourceHtml = innerSourceHtml + '<p class="text-dark-cream mar-b0">' + (this.entityDataOnClikOfOdg.innerSource) + ' (' + published_date + ')' + '</p>';
		} else if (!this.entityDataOnClikOfOdg.innerSource && sourceUrl_source && published_date) {
			innerSourceHtml = '<a class="text-dark-cream font-regular f-12 ' + sourceUrl_href_pointer + '" href="' + sourceUrl_href + '" target="_blank">' + sourceUrl_source + '<span class= "fa mar-x5 fa-external-link ' + sourceUrl_href_pointer + ' ' + sourceUrl_pointer_link + '"> </span></a>' + ' (' + published_date + ')';
		} else if (this.entityDataOnClikOfOdg.innerSource && !sourceUrl_source && published_date) {
			innerSourceHtml = '<p class="text-dark-cream mar-b0">' + (this.entityDataOnClikOfOdg.innerSource) + ' (' + published_date + ')</p>';
		} else if (this.entityDataOnClikOfOdg.innerSource && !sourceUrl_source && !published_date) {
			innerSourceHtml = '<p class="text-dark-cream mar-b0">' + (this.entityDataOnClikOfOdg.innerSource) + '</p>';
		} else if (this.entityDataOnClikOfOdg.innerSource && sourceUrl_source && !published_date) {
			innerSourceHtml = '<a class="text-dark-cream font-regular f-12 ' + sourceUrl_href_pointer + '" href="' + sourceUrl_href + '" target="_blank">' + sourceUrl_source + '<span class= "fa mar-x5 fa-external-link ' + sourceUrl_href_pointer + ' ' + sourceUrl_pointer_link + '"> </span></a>';
			innerSourceHtml = innerSourceHtml + '<p class="text-dark-cream mar-b0">' + (this.entityDataOnClikOfOdg.innerSource) + '</p>';
		} else if (!this.entityDataOnClikOfOdg.innerSource && sourceUrl_source && !published_date) {
			innerSourceHtml = '<p class="text-dark-cream mar-b0">' + (sourceUrl_source) + '</p>';
		}
		if (this.entityDataOnClikOfOdg.classification) {
			var showDirectIndirectPercentage = this.entityDataOnClikOfOdg.classification.find(function (key) {
				return key == "Director" || key == "General Partner"
			})
		}
		this.entityDataOnClikOfOdg.showDirectIndirectPercentage = showDirectIndirectPercentage ? false : true;
	setTimeout(function () {
			this.deleteSelectedEntity = $.extend({}, true, this.entityDataOnClikOfOdg);
		}, 500);
		$(".entity_popover").css("display", "block");
		if (this.entityDataOnClikOfOdg.name) {
			$(".entity_popover").html('<div class="ownership-popover-wrapper right-pop ownership-container ' + entity_role + ' height-100 border-b0">' +
				'<div class="top-content-wrapper pad-b5 border-cream-thin-b">' +
				'<div class="bp-corner-all bt-item-frame bg-transparent">' +
				'<div class="width-100 d-flex detailed-pop-wrapper top-heading">' +
				'<div class="p-rel mar-r5 icon-flag-wrapper">' +
				'<span class="flag-icon mar-x5 text-cream popover-flag flag-icon-squared flag-wrapper flag-pop c-pointer f-9 ' + flag_class_code + '"></span>' +
				'<i class="entity-icon fa ' + person_company_icon + '" style="color:#4c9d20"></i>' +
				'</div>' +
				'<div>' +
				'<div class= "d-flex ai-c jc-sb">' +
				'<h3 name="title" class="bp-item pad-t5 orgChartParentEntity shareCubes" style="display:inline-block;">' +
				this.entityDataOnClikOfOdg.name +
				' </h3>' +
				((this.entityDataOnClikOfOdg.entity_id && this.entityDataOnClikOfOdg.entity_id === 'orgChartParentEntity' && (this.entityDataOnClikOfOdg.classification.includes('Intermediate Parent') || this.entityDataOnClikOfOdg.classification.includes('Ultimate Legal Parent'))) ? '<i class="pad-t5 f-16 fa fa-camera text-dark-cream c-pointer shareholderEvidenceIcon"  ></i>' : '') +
				'<div class= "d-if ai-c pad-r25 mar-l10">' +
				// ((Ubo_ibo.trim() == 'UBO')  ? '' : ('<button class="as-fs" style="background: transparent;border:transparent;" onclick="window.addEntityOwnership()" ><i class="fa fa-plus-circle f-16 text-dark-blue c-pointer" style="position: relative;top: 3px;"></i></button>'))+
				// '<button class="as-fs" style="background: transparent;border:transparent;" onclick="window.showOwnerShipEntityEdit()" ><i class="fa fa-pencil f-14 text-dark-cream c-pointer" style="position: relative;top: 3px;"></i></button>'+
				// (deletebtn ? ('<button class="as-fs" style="background: transparent;border:transparent;"><i class="fa fa-trash-o f-16 text-coral-red deleteScreening" style="position: relative;top: 3px;"></i></button>') : '') +
				'</div>' +
				'</div>' +
				'<span class="f-16 c-pointer p-abs t-0 r-0 pull-right text-dark-cream mar-l10" id="closeentityModal">✖</span>' +
				'<p class="mar-t0 mar-b10 text-cream" style="line-height:14px!important">' + fulladdress + '</p>' +
				'</div>' +
				'</div>' +
				'<div class="bottom-list-wrapper text-right ' + showScreeningList + '">' +
				'<ul class="d-if pad-x5 custom-list ai-c">' +
				'<li class="text-capitalize  street-pop ' + pepclass + ' bst_tooltip_wrapper" name="Pep alerts"><i class="fa text-cream fa fa-street-view c-pointer "></i><span>(' + pepLength + ')</span></li>' +
				'<li class="text-capitalize  user-pop ' + sanctionclass + ' bst_tooltip_wrapper" name="Sanction alerts"><i class="fa text-cream fa-ban c-pointer "></i><span>(' + sanctionLength + ')</span></li>' +
				'<li class="text-capitalize  globe-pop ' + jurisdictionclass + ' bst_tooltip_wrapper" name="Jurisdiction"><i class="fa text-cream fa-globe c-pointer"></i><span>(' + jurisdictionLength + ')</span></li>' +
				'<li class ="text-capitalize  gavel-pop ' + financeclass + ' bst_tooltip_wrapper " name="Finance news"><i class="fa text-cream fa-gavel  c-pointer "></i> <span>(' + financenewsLength + ')</span></li>' +
				'<li class="text-capitalize  newspaper-pop ' + adverseclass + '  bst_tooltip_wrapper" name="news"><i class="fa text-cream fa-newspaper-o c-pointer"></i><span>(' + adversenewsLength + ')</span></li>' +
				'</ul>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'<div class="bottom-content-wrapper border-cream-thin-t">' +
				'<div class="' + hide_subsidaries + '">' +
				'<p class="text-cream d-flex mar-b5 mar-t10  ai-c"><span name="description" class="text-cream mar-r5 f-10 pad-x5 description percentageInfo ' + uboClass + '">' + Ubo_ibo + '</span><span>Number of shares : ' + numberOfShares + '</span></p>' +
				(this.entityDataOnClikOfOdg.showDirectIndirectPercentage ? ('<ul class="list-unstyled progressbar-list mar-b0">' +
					'<li class="progressbar-list-item mar-b5 pad-t0">' +
					'<div class="left-col f-12 text-cream" style="width: 120px;">Indirect Ownership </div>' +
					'<div class="progress progress-gradient-grey" style="width: calc(100% - 180px);">' +
					'<div class="progress-bar progress-gradient-blue" role="progressbar" aria-valuenow="' + parseInt(pop_indirectPercentage) + '" aria-valuemin="0" aria-valuemax="100" style="width:' + parseInt(pop_indirectPercentage) + '%">' +
					'<span class="sr-only ">' + parseInt(pop_indirectPercentage).toFixed(2) + '</span></div>' +
					'</div>' +
					'<div class="right-col f-12 text-cream" style="width: 60px;">' + pop_indirectPercentage.toFixed(2) + '%</div>' +
					'</li>' +
					'<li class="progressbar-list-item mar-b5">' +
					'<div class="left-col f-12 text-cream" style="width:120px;">Direct Ownership</div>' +
					'<div class="progress progress-gradient-grey" style="width: calc(100% - 180px);">' +
					'<div class="progress-bar progress-gradient-curious-blue" role="progressbar" aria-valuenow="' + parseInt(pop_totalPercentage) + '" aria-valuemin="0" aria-valuemax="100" style="width:' + parseInt(pop_totalPercentage) + '%">' +
					'<span class="sr-only ">' + pop_totalPercentage.toFixed(2) + '%' + '</span>' +
					'</div>' +
					'</div>' +
					'<div class="right-col f-12 text-cream" style="width: 60px;">' + pop_totalPercentage.toFixed(2) + '%</div>' +
					'</li>') : '') +
				'</ul>' + innerSourceHtml +
				'</div>' +
				'</div>');
			var p = $('#flowChartViewDiv1')
			var position = p.offset();
			var windowWidth = this.window.innerWidth;
			var tooltipWidth = windowWidth - $('.entity_popover').width() - 100;
			if ((e.pageX > tooltipWidth)) {
				$(".entity_popover").css("left", ((e.pageX) - $('.entity_popover').width() - 100) + "px");
			} else {
				$(".entity_popover").css("left", (e.pageX) + 5 + "px");
			}
			$(".entity_popover").css("z-index", "9999");
			$(".entity_popover").css("display", "block");
			return $(".entity_popover").css("top", e.pageY + "px");

		}
	}



	showGraphView(id:any){

		setTimeout(() => {
			id.preventDefault();
			return;
			}, 2000);
			var newId = id.nextId === "vlaContainer_originalViewtab" ? "vlaContainer_originalView" : "vlaContainer_customView";
		this.entitySearchResult.list.graphviewIndex = newId === "vlaContainer_originalView" ? 0 : 1;
		this.entitySearchResult.list.currentVLArendered = newId;
		this.showSubsidariesInchart(this.showSubsidaries);
		this.graphUtilites.originalClicked =  id.nextId === "vlaContainer_originalViewtab" ? true : false;
		// this.graphtab.select(id.nextId);

	}
	showSubsidariesInchart(value){
		var divId = this.entitySearchResult.list.currentVLArendered;
		this.showSubsidaries = value;
		this.subsidariesfilteredData = [];
		this.pageloader.treeGraphloader = true;
		if (EntityConstants.customEntites && EntityConstants.customEntites.adddeleteEntity && EntityConstants.customEntites.adddeleteEntity.length > 0) {
			for (var i = 0; i < EntityConstants.customEntites.adddeleteEntity.length; i++) {
				if (EntityConstants.customEntites.adddeleteEntity[i] && EntityConstants.customEntites.adddeleteEntity[i].identifier) {
					var checkEntity_Existisence_totalData = findIndex(this.subsidaryFilterData, {
						identifier: EntityConstants.customEntites.adddeleteEntity[i].identifier
					});
					if (checkEntity_Existisence_totalData === -1) {
						this.subsidaryFilterData.push(EntityConstants.customEntites.adddeleteEntity[i]);
					}
				}
			}
		}
		if (value) {
			this.subsidariesfilteredData = this.subsidaryFilterData;
		} else {
			this.subsidariesfilteredData = this.subsidaryFilterData.filter(function (val) {
				if (val.entity_id !== "orgChartsubEntity") {
					return val;
				}
			});
		}
		var currentRefreshData = this.subsidariesfilteredData;
		if (divId === 'vlaContainer_originalView' || divId === 'vlaContainer') {
			currentRefreshData = this.originalHierrachyData;
		}
		else {
			var filterCustom = this.subsidariesfilteredData.filter(function (entites) {
				return entites.isCustom || entites.id == "p00";
			})
			currentRefreshData = ($.extend(true, [], filterCustom));
		}
		const uniqSubsidary = uniqBy(currentRefreshData, 'identifier');
		this.subsidiaries[0].subsidiaries = $.extend(true, [], uniqSubsidary);
		if (currentRefreshData.length > 0) {
			this.subsidariesfilteredData = uniqBy(this.subsidariesfilteredData, 'identifier');
			currentRefreshData =  this.calculateGraphConflictData(currentRefreshData);
			var currentOPts = $.extend(true, {}, this.orgChartOptions);
			currentOPts.items = $.extend(true, [], currentRefreshData);
			currentOPts.annotations = this.graphAnnotations(currentRefreshData);
			$('#' + divId).find('.orgdiagram .custom-scroll-wrapper').remove();
			setTimeout(()=>{
				$("#" + divId).famDiagram(currentOPts);
				if(divId === "vlaContainer_customView"){
					this.graphtab.select("vlaContainer_customViewtab");
					$("#vlaContainer_customViewtab").click();
				}
				setTimeout( ()=> {
					$("#" + divId).famDiagram("update", primitives.orgdiagram.UpdateMode.Recreate);
					this.entites_renderedIn_chart = currentOPts.items;
					this.entityCommonTabService.AppendOrgGraphIcon("#" + divId)
				}, 2000);
				this.pageloader.treeGraphloader = false;this.ref.markForCheck();
			}, 2000);
		} else {
			this.pageloader.treeGraphloader = false;
		}
		// this.ref.markForCheck();
	}//function Ends

	 /* @purpose:  calculate the conflict entites
     *
     * @created: 280 sep 2019
     * @params: array
     * @returns: conflicted Parents(red PArent border)
     * @author: Ram Singh */

	 calculateGraphConflictData(graphschartData:any){
		graphschartData.forEach((subSidaryVal, key, self) =>{
			if (subSidaryVal.parents && subSidaryVal.parents.length > 0) {
				var total_percentage_all = 0;
				var allParentsIndexs = [];
				for (var i = 0; i < subSidaryVal.parents.length; i++) {
					var parentTotalIndex = findIndex(self, {
						id: subSidaryVal.parents[i]
					});
					if (parentTotalIndex !== -1 && self[parentTotalIndex].totalPercentage) {
						allParentsIndexs.push(parentTotalIndex);
						total_percentage_all = total_percentage_all + self[parentTotalIndex].totalPercentage;
					} //inner if
				} //for loops ends
				// if (total_percentage_all > 100) {
				allParentsIndexs.forEach(function (val) {
					graphschartData[val].isConflict = total_percentage_all > 100 ? true : false;
				});
				// }//inner if ends
			} //if ends
		});
		return graphschartData;
	 }
	 screeningTrackby(index,screeningTableEntity){
		return screeningTableEntity.name;
	 }
	 	/*
 * @purpose: Apply the filter values and call API
 * @created: 3 oct 2018
 * @returns: none
 * @author:Ram
 */
	changeChartLevels(){
		if (this.filteredChart.not_screening) {
			this.complianceRightAdverseNews = [];

			this.pageloader.coropoateloader = true;
			this.pageloader.treeGraphloader = true;
			this.pageloader.screeningLoader = true;
			this.entitySearchResult.is_data_not_found.is_rightadverseNews = true;
			this.pageloader.disableFilters = true;//filter disable is ON
			this.pageloader.loadingText = true;//off the loading text when filter is applied
			this.filteredApplied = 1;
			this.filteredChart.applyButton = true;
			this.ScreeningRisk = 0;
			this.identifiedRisk = 0;
			this.unique_officer_roles_array = [];
			this.screeningData = [];//empty screening Data  the section that is visible
			this.actualScreeningData = [];//empty actualscreening Data
			this.summaryScreenig = [];//empty the summary screening
			var param = {
				identifier: this.queryParams.query,
				url: {
				  "url": EntityConstants.basicSharedObject.org_structure_link
				},
				numnberoflevel: this.filteredChart.selectedNumberofLevel,
				lowRange: this.sliderUtilitesobj.sliderMinValue,
				highRange: this.sliderUtilitesobj.sliderMaxValue,
				organisationName: this.entityDetails && this.entityDetails['vcard:organization-name'] && this.entityDetails['vcard:organization-name'].value ? this.entityDetails['vcard:organization-name'].value : '',
				noOfSubsidiaries: this.filteredChart.numberofcomapnies ? this.filteredChart.numberofcomapnies : 5,
				juridiction: this.queryParams.cid ? (this.queryParams.cid).toUpperCase() : this.entityDetails && this.entityDetails['isDomiciledIn'] && this.entityDetails['isDomiciledIn'].value ? this.entityDetails['isDomiciledIn'].value : '',
				isSubsidiariesRequired:this.showSubsidaries,
				Start_date: this.filteredChart.toyear,
				End_date: this.filteredChart.fromyear,
				source: this.entitySearchResult.list.graphSourceSelected
			};
			$("#yearsliderCompliance").slider({ disabled: true });
			$("#sliderAvgExpenCompliance").slider({ disabled: true }); //sfilter sliders are disabled
			$("#sanctionsliderCompliance").slider({ disabled: true });//filter disable is off when API is completed
			$("#pepliderCompliance").slider({ disabled: true });//filter disable is off when API is completed
			var currentOPts = $.extend(true, {}, this.orgChartOptions);
			currentOPts.items = [this.mainCompanyobject];
			$('#' + this.entitySearchResult.list.currentVLArendered).find('.orgdiagram .custom-scroll-wrapper').remove();
			$("#" +this.entitySearchResult.list.currentVLArendered).famDiagram(currentOPts);
			// orgChartRemake(cu/rrentOPts, this.entitySearchResult.list.currentVLArendered);
			setTimeout( ()=>{
				$("#" + this.entitySearchResult.list.currentVLArendered).famDiagram("update", primitives.orgdiagram.UpdateMode.Recreate);
			},500)
			this.entityCommonTabService.AppendOrgGraphIcon("#"+this.entitySearchResult.list.currentVLArendered);
			// if (this.entitySearchResult.org_structure_link){
			this.entityApiService.getOwnershipPath(param).subscribe(((response:any)=> {
				if (response &&  response.path) {
					this.appliedOwnerShipControlPercentageMinVal = this.sliderUtilitesobj.sliderMinValue;
					this.appliedOwnerShipControlPercentageMaxVal = this.sliderUtilitesobj.sliderMaxValue;
					setTimeout( ()=>{
						// tag cloud variables initializations for person
						this.updateOwnershipRecurssive(response.path);
					}, 15000);
				}
			}),(err)=>{

			});
		}
	};//function ends

	/* @purpose: check the get data API already made a get sources call
			*
			* @created: 17 may 2019
			* @params: type(string)
				* @returns get sources
			* @author: Amritesh */
	apiCallGetSources() {
		this.entityOrgchartService.apiCallGetSources(this.queryParams,this.entityDetails).then((response)=>{

			this.sourceList = response;
			TopPanelConstants.sourceListData = this.sourceList
		});
		// let allres = this.entityOrgchartService.getSources().subscribe((response: any) => {
		// 	this.sourceList = response.result.map((value)=> {
		// 		if (value && value.sourceName && value.sourceName.toLowerCase() === 'website') {
		// 			value.sourceName = this.entityDetails && this.entityDetails.hasURL && this.entityDetails.hasURL.value ? this.entityDetails.hasURL.value : value.sourceName;
		// 		}
		// 		value.source_type = 'link';
		// 		return value;
		// 	});
		// 	var params: any = {
		// 		"pageNumber": 1,
		// 		"orderIn": 'desc',
		// 		"orderBy": 'uploadedOn',
		// 		"recordsPerPage": 9,
		// 		"entityId": this.queryParams.query
		// 	};
		// 	this.entityOrgchartService.getllSourceDocuments(params).subscribe(
		// 		(response: any) => {
		// 			if (response && response.length > 0) {
		// 				if (response[0].documentListsData && response[0].documentListsData.length > 0) {
		// 					response[0].documentListsData.forEach((val) => {
		// 						var sourceArray = this.sourceList.filter((searchedval: any) => searchedval.sourceName === val.sourceName);
		// 						var sourceObject = sourceArray.filter((searchVal: any) => searchVal.type === val.type);
		// 						if (sourceObject.length == 0) {
		// 							this.sourceList.push(val);
		// 						}
		// 					});
		// 				}
		// 				if (response[1].evidenceDocumentsListsData && response[1].evidenceDocumentsListsData.length > 0) {
		// 					response[1].evidenceDocumentsListsData.forEach((val: any) => {
		// 						var sourceArray = this.sourceList.filter((searchedval: any) => searchedval.sourceName === val.sourceName);
		// 						var sourceObject = sourceArray.filter((searchVal: any) => searchVal.type === val.type);
		// 						if (sourceObject.length == 0) {
		// 							this.sourceList.push(val);
		// 						}
		// 					});
		// 				}
		// 			}
		// 		}
		// 	)
		// })
	}
																	//  sliders in the Compliance Chart Starts ////////

	/* @purpose: Initialize the value of Slider
	 * @created: 3 oct 2018
	 * @returns: none
	 * @author:Ram
	 */
	sliderAvgExpen(min, max) {
		this.sliderUtilitesobj.sliderMinValue = min;
		this.sliderUtilitesobj.sliderMaxValue = max;
		$("#sliderAvgExpenCompliance").find(".price-range-min").html(min);
		$("#sliderAvgExpenCompliance").find(".price-range-max").html(max);
		 setTimeout(() => {
			$('#sliderAvgExpenCompliance').slider({
				range: true,
				min: 0,
				max: 100,
				values: [min, max],
				slide: (event, ui)=> {
					this.percentageRange(ui.values, false);
					this.activateDisablebutton(ui.values[0], ui.values[1],false);
				},
				stop: (event, ui)=> {
					if (ui.values[0] == ui.values[1]) {
						$('#sliderAvgExpenCompliance .price-range-both i').css('display', 'none');
					} else {
						$('#sliderAvgExpenCompliance .price-range-both i').css('display', 'inline');
					}
					if (this.collision(ui.values[0], ui.values[1])) {
						$('#sliderAvgExpenCompliance .price-range-min, #sliderAvgExpenCompliance .price-range-max').css('opacity', '0');
						$('#sliderAvgExpenCompliance .price-range-both').css('display', 'block');
					} else {
						$('#sliderAvgExpenCompliance .price-range-min,#slider2 .price-range-max').css('opacity', '1');
						$('#sliderAvgExpenCompliance .price-range-both').css('display', 'none');
					}
				}
			});
		 }, 1000);

	}
	pepsliderfilter(min, max) {
		this.filteredChart.pep_slider_min = min;
		this.filteredChart.pep_slider_max = max;
		$("#pepliderCompliance").find(".price-range-min").html(min);
		$("#pepliderCompliance").find(".price-range-max").html(max);
		setTimeout(() => {
			$('#pepliderCompliance').slider({
			range: true,
			min: 0,
			max: 100,
			values: [min, max],
			slide: (event, ui) => {
				this.percentageRange(ui.values, 'pep');
			},
			stop: (event, ui) => {
				if (ui.values[0] == ui.values[1]) {
					$('#pepliderCompliance .price-range-both i').css('display', 'none');
				} else {
					$('#pepliderCompliance .price-range-both i').css('display', 'inline');
				}
				if (this.collision(ui.values[0], ui.values[1])) {
					$('#pepliderCompliance .price-range-min, #pepliderCompliance .price-range-max').css('opacity', '0');
					$('#pepliderCompliance .price-range-both').css('display', 'block');
				} else {
					$('#pepliderCompliance .price-range-min,#slider2 .price-range-max').css('opacity', '1');
					$('#pepliderCompliance .price-range-both').css('display', 'none');
				}
			}
		});
		}, 1000);

	}
	sanctionsliderfilter(min, max) {
		this.filteredChart.sanction_slider_min = min;
		this.filteredChart.sanction_slider_max = max;
		$("#sanctionsliderCompliance").find(".price-range-min").html(min);
		$("#sanctionsliderCompliance").find(".price-range-max").html(max);
		setTimeout(() => {
			$('#sanctionsliderCompliance').slider({
			range: true,
			min: 0,
			max: 100,
			values: [min, max],
			slide: (event, ui) => {
				this.percentageRange(ui.values, 'sanction');
			},
			stop: (event, ui) => {
				if (ui.values[0] == ui.values[1]) {
					$('#sanctionsliderCompliance .price-range-both i').css('display', 'none');
				} else {
					$('#sanctionsliderCompliance .price-range-both i').css('display', 'inline');
				}
				if (this.collision(ui.values[0], ui.values[1])) {
					$('#sanctionsliderCompliance .price-range-min, #sanctionsliderCompliance .price-range-max').css('opacity', '0');
					$('#sanctionsliderCompliance .price-range-both').css('display', 'block');
				} else {
					$('#sanctionsliderCompliance .price-range-min,#slider2 .price-range-max').css('opacity', '1');
					$('#sanctionsliderCompliance .price-range-both').css('display', 'none');
				}
			}
		});
		}, 1000);
	}
	/* @purpose: Initialize the value of Slider
* @created: 3 oct 2018
* @returns: none
* @author:Ram
*/
	yearsliderfilter(min, max) {
		this.filteredChart.yearliderMinValue = min;
		this.filteredChart.yearsliderMaxValue = max;
		$("#yearsliderCompliance").find(".price-range-min").html(min);
		$("#yearsliderCompliance").find(".price-range-max").html(max);
		setTimeout(() => {
			$('#yearsliderCompliance').slider({
			range: true,
			min: 0,
			max: 7,
			values: [min, max],
			slide: (event, ui) => {
				this.adverseNewsDatefilter(ui.values[0], ui.values[1])
			},
			stop: (event, ui) => {
				if (ui.values[0] == ui.values[1]) {
					$('#yearsliderCompliance .price-range-both i').css('display', 'none');
				} else {
					$('#yearsliderCompliance .price-range-both i').css('display', 'inline');
				}
				if (this.collision(ui.values[0], ui.values[1])) {
					$('#yearsliderCompliance .price-range-min, #yearsliderCompliance .price-range-max').css('opacity', '0');
					$('#yearsliderCompliance .price-range-both').css('display', 'block');
				} else {
					$('#yearsliderCompliance .price-range-min,#slider2 .price-range-max').css('opacity', '1');
					$('#yearsliderCompliance .price-range-both').css('display', 'none');
				}
			}
		});
		}, 1000);

	}
	adverseNewsDatefilter(from, to) {
		var today = new Date();
		this.filteredChart.startYear = from;
		this.filteredChart.endYear = to;
		var EndDate = (today.getFullYear() - from) + '-' + (("0" + (today.getMonth() + 1)).slice(-2)) + '-' + (("0" + (today.getDate())).slice(-2));
		this.filteredChart.fromyear = EndDate;
		var startDate = (today.getFullYear() - to) + '-' + (("0" + (today.getMonth() + 1)).slice(-2)) + '-' + (("0" + (today.getDate())).slice(-2));
		this.filteredChart.toyear = startDate;
		$("#yearsliderCompliance").find(".price-range-min").html(from);
		$("#yearsliderCompliance").find(".price-range-max").html(to);
		this.activateDisablebutton(from, to, true);
	}
	/* @purpose: Slider function hides when slideer key collide
	 * @created: 3 oct 2018
	 * @returns: none
	 * @author:Ram
	 */
	 collision($div1, $div2) {
		var x1 = $div1;
		var w1 = 0.5;
		var r1 = x1 + w1;
		var x2 = $div2;
		var w2 = 0.5;
		var r2 = x2 + w2;
		if (r1 < x2 || x1 > r2){
			 return false;
			}
		return true;
	}
	/* @purpose: get the values of slider and show on the slider move
	 * @created: 3 oct 2018
	 * @returns: none
	 * @author:Ram
	 */
	percentageRange(values, yearslider) {
		if (yearslider && yearslider === 'sanction') {
			setTimeout(() => {
				this.filteredChart.sanction_slider_min = values[0];
				this.filteredChart.sanction_slider_max = values[1];
				this.checkenableOrDisableApplybutton();
			}, 0);
		} else if (yearslider && yearslider === 'pep') {
			setTimeout(() => {
				this.filteredChart.pep_slider_min = values[0];
				this.filteredChart.pep_slider_max = values[1];
				this.checkenableOrDisableApplybutton();
			}, 0);
		}
		else {
			setTimeout(() => {
				$("#sliderAvgExpenCompliance").find(".price-range-min").html(values[0]);
				$("#sliderAvgExpenCompliance").find(".price-range-max").html(values[1]);
			}, 0);

		}
	}
	activateDisablebutton(val1, val2, yearslider){
		if (yearslider) {
			setTimeout( ()=> {
				this.filteredChart.yearliderMinValue = val1;
				this.filteredChart.yearsliderMaxValue = val2;
			}, 0);
		} else {
			this.sliderUtilitesobj.sliderMinValue = val1;
			this.sliderUtilitesobj.sliderMaxValue = val2;
		}
		this.checkenableOrDisableApplybutton();
		this.ref.markForCheck();
	}//function ends
	/* @purpose: check to Enable or Diable APply button
		* @created: 3 oct 2018
		* @returns: none
		* @author:Ram
		*/
	 checkenableOrDisableApplybutton(){
		var EndDate = ((new Date().getFullYear()) + '-' + (("0" + (new Date().getMonth() + 1)).slice(-2)) + '-' + new Date().getDate());
		var startDate = ((new Date().getFullYear() - 2) + '-' + (("0" + (new Date().getMonth() + 1)).slice(-2)) + '-' + new Date().getDate());
		if ((this.filteredChart.selectedNumberofLevel !== 5) || (this.filteredChart.riskRatio !== 1) || (this.filteredChart.numberofcomapnies !== 5) || (this.sliderUtilitesobj.sliderMinValue !== this.appliedOwnerShipControlPercentageMinVal) || (this.sliderUtilitesobj.sliderMaxValue !== this.appliedOwnerShipControlPercentageMaxVal) || (this.filteredChart.fromyear !== EndDate) || (this.filteredChart.toyear !== startDate) || this.showSubsidaries) {
			this.filteredChart.applyButton = false;
			this.filteredChart.not_screening = true;
		} else if (this.filteredChart.pep_slider_min !== 85 || this.filteredChart.pep_slider_max !== 100 || this.filteredChart.sanction_slider_min !== 70 || this.filteredChart.sanction_slider_max !== 100) {
			this.filteredChart.applyButton = false;
			this.filteredChart.not_screening = false;
		} else {
			this.filteredChart.applyButton = true;
			this.filteredChart.not_screening = true;
		}
		this.ref.markForCheck();
	};
	checkForsubsidaryApplybutton = function () {
		// this.showSubsidaries = !this.showSubsidaries;
		this.checkenableOrDisableApplybutton();
	}
																//  sliders in the Compliance Chart ENDS ////////
																//  Add and Edit  of ORG Chart in complice  Starts ////////
	openEditModal(e){
		const editmodalRef = this.modalService.open(EnityEditComponent,
			{
				windowClass:'custom-modal c-arrow  bst_modal add-ownership-modal add-new-officer add-popup'
			});
			editmodalRef.componentInstance.popOverEditDataForOwnership = this.popOverEditDataForOwnership;
			editmodalRef.componentInstance.subsidiaries = this.subsidiaries;
			editmodalRef.componentInstance.sourceList = this.sourceList;
			editmodalRef.componentInstance.entityDataOnClikOfOdg = this.entityDataOnClikOfOdg;
			editmodalRef.componentInstance.entitySearchResult  = this.entitySearchResult;
			editmodalRef.componentInstance.EditEntityTypeList = this.EditEntityTypeList;
			editmodalRef.componentInstance.entityDetails =  this.entityDetails;
			editmodalRef.componentInstance.queryParams =  this.queryParams;
			editmodalRef.componentInstance.subsidariesfilteredData =  this.subsidariesfilteredData;
			editmodalRef.componentInstance.subsidaryFilterData =  this.subsidaryFilterData;
			editmodalRef.componentInstance.subsidiaries =  this.subsidiaries;
			editmodalRef.componentInstance.screeningData = this.screeningData;
			editmodalRef.componentInstance.actualScreeningData =  this.actualScreeningData;
		}
	addEntityOwnership (fromMultiselect, typeOfEntity) {
		this.entitySearchResult.list.addEntitymodalChart = typeOfEntity ? typeOfEntity : 'person';
		this.entitySearchResult.list.addActiveTab = (typeOfEntity === 'person') ? 0 : 1;
		this.popOverEditDataForOwnership = jQuery.extend({}, true, this.entityDataOnClikOfOdg);
		const addModalRef = this.modalService.open(AddNewEntityComponent,
			{
				windowClass:'custom-modal c-arrow  bst_modal add-ownership-modal add-new-officer add-popup'
			});
			addModalRef.componentInstance.entitySearchResult = this.entitySearchResult;
			addModalRef.componentInstance.sourceList = this.sourceList;
			addModalRef.componentInstance.queryParams = this.queryParams;
			addModalRef.componentInstance.entityDetails = this.entityDetails;
			addModalRef.componentInstance.popOverEditDataForOwnership =this.popOverEditDataForOwnership;
			addModalRef.componentInstance.countryNames =this.countryNames;
			addModalRef.componentInstance.addEntityTypeList  = this.addEntityTypeList;
			addModalRef.componentInstance.entityDataOnClikOfOdg  = this.entityDataOnClikOfOdg;
			addModalRef.componentInstance.deleteSelectedEntity  = this.deleteSelectedEntity;
			addModalRef.componentInstance.subsidaryFilterData  = this.subsidaryFilterData;
			addModalRef.componentInstance.screeningData = this.screeningData;
			addModalRef.componentInstance.actualScreeningData =  this.actualScreeningData;
			addModalRef.componentInstance.showallFields = true;

	}
	openDeleteConfirmationModal(deleteSelectedEntity, removeCustomView) {
		const sourceChangeConfirmationModalRef = this.modalService.open(GraphchangesourceconfirmationComponent,
			{
				windowClass: 'custom-modal c-arrow  bst_modal add-ownership-modal add-new-officer',
				backdrop: 'static'
			});
		sourceChangeConfirmationModalRef.componentInstance.deleteSelectedEntity = deleteSelectedEntity;
		sourceChangeConfirmationModalRef.componentInstance.deleteSelectedEntity.removeCustomView = removeCustomView;
		sourceChangeConfirmationModalRef.componentInstance.purpose = 'delterConfirmation';
		sourceChangeConfirmationModalRef.result.then((selectedItem) => {
			var query = {
				identifier: selectedItem.identifier ? selectedItem.identifier : '',
				field: 'vertex'
			};
			if (selectedItem.removeCustom) {
				query.identifier = (this.entitySearchResult.list.topHeaderObject && this.entitySearchResult.list.topHeaderObject.identifier) ? this.entitySearchResult.list.topHeaderObject.identifier : (this.queryParams.qid ? this.queryParams.qid : ''),
					query.field = 'custom_graph';
				this.subsidaryFilterData = this.originalHierrachyData.filter((val) => {
					if (!val.isCustom && val.isCustom === false) {
						return val;
					}
				});
				this.customChartView = false;
				this.isCustomAvailable = false;
				EntityConstants.customEntites.adddeleteEntity = [];
				this.showSubsidariesInchart(this.showSubsidaries);
				this.screeningTableOriginal_custom(this.actualScreeningData);
				this.entityApiService.deleteCustomEntites(query).subscribe(((deleteResponse) => {
					this.entitySearchResult.list.currentVLArendered = "vlaContainer"
					this.showSubsidariesInchart(this.showSubsidaries);
				}));
				this.showSubsidariesInchart(this.showSubsidaries);
			} else {
				this.removeEntityAndParents(selectedItem);
			}

		});
	}
	/*
* @purpose: Delete the Entity and Parents from  from Screening,chart and report
* @created: 14 may 2019
* @author: Ram
*/
	removeEntityAndParents(selectedEntity) {
		this.subsidaryFilterData = uniqBy(this.subsidaryFilterData, function (d) { return d['identifier'] }); //temp fix change to uniq
		const removedCompanyIndex = findIndex(this.subsidaryFilterData, {
			'identifier': selectedEntity.identifier,
			'name': selectedEntity.name
		});
		const actualscreeningCompanyIndex = findIndex(this.actualScreeningData, {
			'@identifier': selectedEntity.identifier,
			'name': selectedEntity.name
		});
		const screeningDatacompanyIndex = findIndex(this.screeningData, {
			'@identifier': selectedEntity.identifier,
			'name': selectedEntity.name
		});
		const reportsubsidaryIndex = findIndex(this.subsidiaries[0].subsidiaries, {
			'identifier': selectedEntity.identifier,
			'name': selectedEntity.name
		});
		const customAddedscreeningIndex = findIndex(EntityConstants.customEntites.adddeleteEntity, {
			'@identifier': selectedEntity.identifier,
			'name': selectedEntity.name
		});
		if (removedCompanyIndex !== -1) {
			this.subsidaryFilterData.splice(removedCompanyIndex, 1);
			this.entityOrgchartService.deleteEntityFomChart(selectedEntity);
		}
		if (actualscreeningCompanyIndex !== -1) {
			this.actualScreeningData.splice(actualscreeningCompanyIndex, 1);
			if (this.entitySearchResult.list.summaryCount.sanctionCount > 0 && selectedEntity.sanction_source.length > 0) {
				this.entitySearchResult.list.summaryCount.sanctionCount = this.entitySearchResult.list.summaryCount.sanctionCount - selectedEntity.sanction_source.length;
			}
			if (this.entitySearchResult.list.summaryCount.pepCount > 0 && selectedEntity.pep_url.length > 0) {
				this.entitySearchResult.list.summaryCount.pepCount = this.entitySearchResult.list.summaryCount.pepCount - selectedEntity.pep_url.length;
			}
			if (this.entitySearchResult.list.summaryCount.adverseCount > 0 && selectedEntity.adverseNews_url.length > 0) {
				this.entitySearchResult.list.summaryCount.adverseCount = this.entitySearchResult.list.summaryCount.adverseCount - selectedEntity.adverseNews_url.length;
			}
			if (this.entitySearchResult.list.summaryCount.financeCount > 0 && selectedEntity.finance_Crime_url.length > 0) {
				this.entitySearchResult.list.summaryCount.financeCount = this.entitySearchResult.list.summaryCount.financeCount - selectedEntity.finance_Crime_url.length;
			}
		}
		if (screeningDatacompanyIndex !== -1) {
			this.screeningData.splice(screeningDatacompanyIndex, 1);
		}
		if (reportsubsidaryIndex !== -1) {
			this.subsidiaries[0].subsidiaries.splice(reportsubsidaryIndex, 1);
		}
		if (selectedEntity && selectedEntity.parents && selectedEntity.parents.length > 0) {
			for (var i = 0; i < selectedEntity.parents.length; i++) {
				const parentObject = find(this.subsidaryFilterData, {
					'id': selectedEntity.parents[i],
					'isCustom': true
				});
				var is_multi_parent_entity = [];
				for (var multi_index = 0; multi_index < this.subsidaryFilterData.length; multi_index++) {
					if (this.subsidaryFilterData[multi_index] && this.subsidaryFilterData[multi_index].parents && this.subsidaryFilterData[multi_index].parents.length > 0) {
						is_multi_parent_entity = this.subsidaryFilterData[multi_index].parents.filter(function (val) { return val === selectedEntity.parents[i] });
						if (is_multi_parent_entity.length > 0) {
							break;
						}
					}
				}
				if (parentObject && is_multi_parent_entity.length === 0) {
					if (customAddedscreeningIndex !== -1) {
						EntityConstants.customEntites.adddeleteEntity.splice(customAddedscreeningIndex, 1)
					}
					var query = {
						identifier: selectedEntity.identifier ? selectedEntity.identifier : '',
						field: 'vertex'
					};
					this.entityApiService.deleteCustomEntites(query).subscribe((deleteResponse) => {
						this.showSubsidariesInchart(this.showSubsidaries);
					});
					this.removeEntityAndParents(parentObject);
				}
			}
		} else {
			if (customAddedscreeningIndex !== -1) {
				EntityConstants.customEntites.adddeleteEntity.splice(customAddedscreeningIndex, 1)
			}
			var query = {
				identifier: selectedEntity.identifier ? selectedEntity.identifier : '',
				field: 'vertex'
			};
			this.entityApiService.deleteCustomEntites(query).subscribe((deleteResponse) => {
				this.showSubsidariesInchart(this.showSubsidaries);
			});
		}
		this.showSubsidariesInchart(this.showSubsidaries);
	}//functions Ends
	deleteCustomView = function (event) {
		event.stopPropagation();
		event.preventDefault();
		this.openDeleteConfirmationModal(this.deleteSelectedEntity, true);
	}
	//  Add and Edit  of ORG Chart in complice Ends////////

	//// Screening Data Entites  ////

	// TODO: check and delete
	//  selectEntitiesForscreening = function (entityscreened, index) {
	// 	//below we are checking is alreadyselected
	// 	var findEntityAlreadySelected = findIndex(this.totalSelectedEntiesForScreening, {
	// 		"identifier": entityscreened.identifier
	// 	});
	// 	var findEntityInScreeningData = findIndex(this.screeningData, {
	// 		"identifier": entityscreened.identifier
	// 	});
	// 	if (findEntityAlreadySelected === -1) {
	// 		var screenig_loading =this.screeningData.filter(function (d) {
	// 			return d.screeningresultsloader;
	// 		});
	// 		if (!screenig_loading.length) {
	// 			this.activateScreeningEnabled = true;
	// 			this.enableSelectUnselect = false;
	// 		}
	// 		this.totalSelectedEntiesForScreening.push(entityscreened);
	// 		// this.screeningData[findEntityInScreeningData]['no-screening'] = false;
	// 	} else {
	// 		this.activateScreeningEnabled = true;
	// 		this.enableSelectUnselect = false;
	// 		var screened = this.screeningData.filter(function (d) {
	// 			return (d['isChecked']);
	// 		});
	// 		if (!screened.length) {
	// 			this.activateScreeningEnabled = false;
	// 		}
	// 		this.totalSelectedEntiesForScreening.splice(findEntityAlreadySelected, 1);
	// 		this.actualScreeningData[findEntityInScreeningData]['isChecked'] = false;
	// 	}
	// }//function Ends

	// /*
	// * @function to select entities from screening table
	// * @author : Amarjith Kumar
	// *
	// */
	// getCustomSelectedScreenig(){
	// 	var data = [];
	// 	this.totalSelectedEntiesForScreening.forEach((val, key)=> {
	// 		var screeningdataIndex = findIndex(this.screeningData, {
	// 			'identifier': val.identifier
	// 		});
	// 		if (screeningdataIndex !== -1) {
	// 			this.screeningData[screeningdataIndex].screeningresultsloader = true;
	// 		}
	// 		if (val.jurisdiction) {
	// 			data.push({
	// 				"entityName": val.name,
	// 				"entityType": val.entity_type,
	// 				"identifier": val.identifier,
	// 				"jurisdiction": val.jurisdiction ? val.jurisdiction.toUpperCase() : ''
	// 			})
	// 		} else {
	// 			data.push({
	// 				"entityName": val.name,
	// 				"entityType": val.entity_type,
	// 				"identifier": val.identifier,
	// 			})
	// 		}
	// 	});
	// 	this.activateScreeningEnabled = false;
	// 	this.enableSelectUnselect = true;
	// 	this.entityApiService.getRequestIdOfScreening(this.queryParams.query, this.filteredChart.toyear, this.filteredChart.fromyear, data).subscribe((res:any)=> {
	// 		var request_id = res.requestId;
	// 		this.getEntitiesSelectedScreening(request_id, data);
	// 	}),((err)=> {
	// 		this.activateScreeningEnabled = false;
	// 		this.enableSelectUnselect = false;
	// 		this.screeningData.forEach((val, key)=> {
	// 			val.screeningresultsloader = false;
	// 		});

	// 	})
	// }
	// /*
	// * @function to send request for screening entities and handling to display the screening
	// * @author : Amarjith Kumar
	// *
	// */
	// getEntitiesSelectedScreening(request_id, requestedEntities) {
	// 	var mainentityId = this.queryParams.query;
	// 	this.entityApiService.getEntitiesScreening(mainentityId, request_id).subscribe((response:any) =>{
	// 		if (!response.status) {
	// 			setTimeout(()=> {
	// 				this.getEntitiesSelectedScreening(response.requestId, requestedEntities);
	// 			}, 5000);
	// 			// return;
	// 		}
	// 		// this.getEntitiesSelectedScreening = true;
	// 		//start handle identifier dashes issue
	// 		requestedEntities.forEach( (val)=> {
	// 			if (val.identifier && val.identifier.split("-").length > 1 && response[val.identifier.split("-").join("")]) {
	// 				response[val.identifier] = response[val.identifier] ? response[val.identifier] : {};
	// 				Object.assign(response[val.identifier], response[val.identifier.split("-").join("")]);
	// 				delete response[val.identifier.split("-").join("")];
	// 			}
	// 		});
	// 		//end handle identifier dashes issue
	// 		var responseObjData = response;
	// 		var keys = Object.keys(response).filter( (d)=> { return (d !== 'requestId' && d !== 'status') }); // keys => entitiesID
	// 		this.entitySearchResult.list.summaryCount.pepCount = this.entitySearchResult.list.summaryCount.pepCount ? this.entitySearchResult.list.summaryCount.pepCount : 0;
	// 		this.entitySearchResult.list.summaryCount.sanctionCount = this.entitySearchResult.list.summaryCount.sanctionCount ? this.entitySearchResult.list.summaryCount.sanctionCount : 0;
	// 		this.entitySearchResult.list.summaryCount.adverseCount = this.entitySearchResult.list.summaryCount.adverseCount ? this.entitySearchResult.list.summaryCount.adverseCount : 0;
	// 		this.entitySearchResult.list.summaryCount.financeCount = this.entitySearchResult.list.summaryCount.financeCount ? this.entitySearchResult.list.summaryCount.financeCount : 0;
	// 		this.summaryScreenig = [];
	// 		var totalarr = this.totalScreenedEntity.map( (d)=> { return d.identifier });
	// 		var entities = [];
	// 		// pushing keys (entities id ) to new array(enities) in sequence way as per the enitites selection
	// 		keys.forEach((item, k)=> {
	// 			if (totalarr.indexOf(item) == -1) {
	// 				entities.push(item);
	// 			} else {
	// 				entities.unshift(item);
	// 			}
	// 		});
	// 		// making loader off or showing check
	// 		this.totalSelectedEntiesForScreening.forEach((val, k)=> {
	// 			this.actualScreeningData = uniqBy(this.actualScreeningData, 'identifier');
	// 			var findIdfromactualScreening = findIndex(this.actualScreeningData, {
	// 				"identifier": val.identifier
	// 			});
	// 			// var findIdfromScreening = findIndex(this.screeningData, {
	// 			// 	"identifier": val.identifier
	// 			// });
	// 			var ent_obj = responseObjData[val.identifier];
	// 			if (ent_obj) {
	// 				var entity_obj_screening_boolen_keys = Object.keys(ent_obj).filter((d)=> {
	// 					return typeof (ent_obj[d]) === 'boolean';
	// 				});
	// 			}
	// 			var current_status = false;
	// 			if (entity_obj_screening_boolen_keys && entity_obj_screening_boolen_keys.length) {
	// 				for (var st = 0; st < entity_obj_screening_boolen_keys.length; st++) {
	// 					if (!ent_obj[entity_obj_screening_boolen_keys[st]]) {
	// 						current_status = false;
	// 						break;
	// 					}
	// 					current_status = true;
	// 				};
	// 			}
	// 			if (findIdfromactualScreening !== -1) {
	// 				if (current_status) {
	// 					this.actualScreeningData[findIdfromactualScreening].screeningresultsloader = false;
	// 					this.actualScreeningData[findIdfromactualScreening]['isChecked'] = true;
	// 				} else {
	// 					this.actualScreeningData[findIdfromactualScreening].screeningresultsloader = true;
	// 					this.actualScreeningData[findIdfromactualScreening]['isChecked'] = false;
	// 				}
	// 				this.actualScreeningData[findIdfromactualScreening]['no-screening'] = false;
	// 			}
	// 			// if (findIdfromScreening !== -1) {
	// 			// 	if (current_status) {
	// 			// 		this.screeningData[findIdfromScreening].screeningresultsloader = false;
	// 			// 		this.screeningData[findIdfromScreening]['isChecked'] = true;
	// 			// 	} else {
	// 			// 		this.screeningData[findIdfromScreening].screeningresultsloader = true;
	// 			// 		this.screeningData[findIdfromScreening]['isChecked'] = false;
	// 			// 	}
	// 			// 	this.screeningData[findIdfromScreening]['no-screening'] = false;
	// 			// }
	// 		});
	// 		// handling selected enities screening
	// 		entities.forEach((id, k)=>{
	// 			var id = id;
	// 			var ent_obj = responseObjData[id];
	// 			var entity_obj_screening_boolen_keys = Object.keys(ent_obj).filter( (d)=>{
	// 				return typeof (ent_obj[d]) === 'boolean';
	// 			});
	// 			var current_status = false;
	// 			for (var st = 0; st < entity_obj_screening_boolen_keys.length; st++) {
	// 				if (!ent_obj[entity_obj_screening_boolen_keys[st]]) {
	// 					current_status = false;
	// 					break;
	// 				}
	// 				current_status = true;
	// 			};
	// 			this.actualScreeningData = uniqBy(this.actualScreeningData, 'identifier');
	// 			var findIdfromactualScreening = findIndex(this.actualScreeningData, {
	// 				"identifier": id
	// 			});
	// 			// var findIdfromScreening = findIndex(this.screeningData, {
	// 			// 	"identifier": id
	// 			// });
	// 			var findIdinchart = findIndex(this.subsidaryFilterData, {
	// 				"identifier": id
	// 			});
	// 			var find_currIndex = this.totalScreenedEntity.findIndex( (d)=>{ return d.identifier === id });
	// 			if (find_currIndex >= 0) {
	// 				this.entitySearchResult.list.summaryCount.pepCount = 0;
	// 				this.entitySearchResult.list.summaryCount.sanctionCount = 0;
	// 				this.entitySearchResult.list.summaryCount.adverseCount = 0;
	// 				this.entitySearchResult.list.summaryCount.financeCount = 0;
	// 			} else {
	// 				this.entitySearchResult.list.summaryCount.pepCount = this.entitySearchResult.list.summaryCount.pepCount ? this.entitySearchResult.list.summaryCount.pepCount : 0;
	// 				this.entitySearchResult.list.summaryCount.sanctionCount = this.entitySearchResult.list.summaryCount.sanctionCount ? this.entitySearchResult.list.summaryCount.sanctionCount : 0;
	// 				this.entitySearchResult.list.summaryCount.adverseCount = this.entitySearchResult.list.summaryCount.adverseCount ? this.entitySearchResult.list.summaryCount.adverseCount : 0;
	// 				this.entitySearchResult.list.summaryCount.financeCount = this.entitySearchResult.list.summaryCount.financeCount ? this.entitySearchResult.list.summaryCount.financeCount : 0;
	// 			}
	// 			this.entitySearchResult.list.summaryCount.pepCount = this.entitySearchResult.list.summaryCount.pepCount + (response[id].pep ? response[id].pep.length : 0);
	// 			this.entitySearchResult.list.summaryCount.sanctionCount = this.entitySearchResult.list.summaryCount.sanctionCount + (response[id].sanctions ? response[id].sanctions.length : 0);
	// 			var adverseNews = [];
	// 			var financeCrime = [];
	// 			var responsePep = (response[id].pep ? jQuery.extend(true, [], response[id].pep) : []);
	// 			var responseSanction = (response[id].sanctions ? jQuery.extend(true, [], response[id].sanctions) : []);
	// 			if (response[id] && response[id].news && response[id].news.length > 0) {
	// 				var financeUrl = find(response[id].news, {
	// 					'classification': 'Financial Crime'
	// 				});
	// 				var adverseUrl = find(response[id].news, {
	// 					'classification': 'Neutral'
	// 				});
	// 				if (financeUrl && financeUrl.count) {
	// 					financeCrime = [{
	// 						article: financeUrl['_links'].articles,
	// 						name: '',
	// 						entity_id: '',
	// 						count: financeUrl.count
	// 					}];
	// 					this.entitySearchResult.list.summaryCount.financeCount = this.entitySearchResult.list.summaryCount.financeCount + (financeUrl.count ? financeUrl.count : 0);
	// 				}
	// 				if (adverseUrl && adverseUrl.count) {
	// 					adverseNews = [{
	// 						article: adverseUrl['_links'].articles,
	// 						name: '',
	// 						entity_id: '',
	// 						count: adverseUrl.count
	// 					}];
	// 					this.entitySearchResult.list.summaryCount.adverseCount = this.entitySearchResult.list.summaryCount.adverseCount + (adverseUrl.count ? adverseUrl.count : 0);
	// 				}
	// 			}
	// 			if (findIdfromactualScreening !== -1) {
	// 				if (adverseNews.length > 0) {
	// 					adverseNews[0].name = this.actualScreeningData[findIdfromactualScreening].name;
	// 					adverseNews[0].entity_id = this.actualScreeningData[findIdfromactualScreening].identifier ? this.actualScreeningData[findIdfromactualScreening].identifier : this.actualScreeningData[findIdfromactualScreening]['@identifier'] ? this.actualScreeningData[findIdfromactualScreening]['@identifier'] : '';
	// 				}
	// 				if (financeCrime.length > 0) {
	// 					financeCrime[0].name = this.actualScreeningData[findIdfromactualScreening].name;
	// 					financeCrime[0].entity_id = this.actualScreeningData[findIdfromactualScreening].identifier ? this.actualScreeningData[findIdfromactualScreening].identifier : this.actualScreeningData[findIdfromactualScreening]['@identifier'] ? this.actualScreeningData[findIdfromactualScreening]['@identifier'] : '';
	// 				}
	// 				this.actualScreeningData[findIdfromactualScreening].adverseNews_url = adverseNews;
	// 				this.actualScreeningData[findIdfromactualScreening].finance_Crime_url = financeCrime;
	// 				this.actualScreeningData[findIdfromactualScreening].pep_url = jQuery.extend(true, [], responsePep);
	// 				this.actualScreeningData[findIdfromactualScreening]['sanction_bst:description'] = jQuery.extend(true, [], responseSanction);
	// 				if (current_status) {
	// 					this.actualScreeningData[findIdfromactualScreening]['screeningresultsloader'] = false;
	// 					this.actualScreeningData[findIdfromactualScreening]['isChecked'] = true;
	// 				} else {
	// 					this.actualScreeningData[findIdfromactualScreening]['screeningresultsloader'] = true;
	// 					this.actualScreeningData[findIdfromactualScreening]['isChecked'] = false;
	// 				}
	// 				this.actualScreeningData[findIdfromactualScreening]['no-screening'] = false;
	// 				this.summaryScreenig.push(this.actualScreeningData[findIdfromactualScreening]);
	// 				// this.entityOrgchartService.addscreeningTotable(this.actualScreeningData[findIdfromactualScreening]); uncomment
	// 				var find_currIndex = this.totalScreenedEntity.findIndex( (d)=> { return d.identifier === this.actualScreeningData[findIdfromactualScreening].identifier });
	// 				if (find_currIndex == -1) {
	// 					this.totalScreenedEntity.push(this.actualScreeningData[findIdfromactualScreening]);
	// 				}
	// 			}
	// 			// if (findIdfromScreening !== -1) {
	// 			// 	if (adverseNews.length > 0) {
	// 			// 		adverseNews[0].name = this.screeningData[findIdfromScreening].name;
	// 			// 		adverseNews[0].entity_id = this.screeningData[findIdfromScreening].identifier ? this.screeningData[findIdfromScreening].identifier : this.screeningData[findIdfromScreening]['@identifier'] ? this.screeningData[findIdfromScreening]['@identifier'] : '';
	// 			// 	}
	// 			// 	if (financeCrime.length > 0) {
	// 			// 		financeCrime[0].name = this.screeningData[findIdfromScreening].name;
	// 			// 		financeCrime[0].entity_id = this.screeningData[findIdfromScreening].identifier ? this.screeningData[findIdfromScreening].identifier : this.screeningData[findIdfromScreening]['@identifier'] ? this.screeningData[findIdfromScreening]['@identifier'] : '';
	// 			// 	}
	// 			// 	this.screeningData[findIdfromScreening].entity_type = this.screeningData[findIdfromScreening].entity_type;
	// 			// 	this.screeningData[findIdfromScreening].jurisdiction = this.screeningData[findIdfromScreening].jurisdiction;
	// 			// 	this.screeningData[findIdfromScreening].pep_url = jQuery.extend(true, [], responsePep);
	// 			// 	this.screeningData[findIdfromScreening].adverseNews_url = adverseNews;
	// 			// 	this.screeningData[findIdfromScreening].finance_Crime_url = financeCrime;
	// 			// 	this.screeningData[findIdfromScreening]['sanction_bst:description'] = jQuery.extend(true, [], responseSanction);
	// 			// 	if (current_status) {
	// 			// 		this.screeningData[findIdfromScreening].screeningresultsloader = false;
	// 			// 		this.screeningData[findIdfromScreening]['isChecked'] = true;
	// 			// 	} else {
	// 			// 		this.screeningData[findIdfromScreening].screeningresultsloader = true;
	// 			// 		this.screeningData[findIdfromScreening]['isChecked'] = false;
	// 			// 	}
	// 			// 	this.screeningData[findIdfromScreening]['no-screening'] = false;
	// 			// 	// this.entityOrgchartService.addscreeningTotable(this.actualScreeningData[findIdfromactualScreening]); uncomment
	// 			// 	var find_currIndex = this.totalScreenedEntity.findIndex( (d)=> { return d.identifier === this.screeningData[findIdfromScreening].identifier });
	// 			// 	if (find_currIndex == -1) {
	// 			// 		this.totalScreenedEntity.push(this.screeningData[findIdfromScreening]);
	// 			// 	}
	// 			// }
	// 			if (findIdinchart !== -1) {
	// 				if (adverseNews.length > 0) {
	// 					adverseNews[0].name = this.subsidaryFilterData[findIdinchart].name;
	// 					adverseNews[0].entity_id = this.subsidaryFilterData[findIdinchart].entity_id;
	// 				}
	// 				if (financeCrime.length > 0) {
	// 					financeCrime[0].name = this.subsidaryFilterData[findIdinchart].name;
	// 					financeCrime[0].entity_id = this.subsidaryFilterData[findIdinchart].entity_id;
	// 				}
	// 				this.subsidaryFilterData[findIdinchart].pep_url = (response[id].pep ? jQuery.extend(true, [], response[id].pep) : []);
	// 				this.subsidaryFilterData[findIdinchart]['sanction_source'] = (response[id].sanctions ? jQuery.extend(true, [], response[id].sanctions) : []);
	// 				this.subsidaryFilterData[findIdinchart]['adverseNews_url'] = adverseNews;
	// 				this.subsidaryFilterData[findIdinchart]['finance_Crime_url'] = financeCrime;
	// 				if (current_status) {
	// 					this.subsidaryFilterData[findIdinchart].screeningresultsloader = false;
	// 				} else {
	// 					this.subsidaryFilterData[findIdinchart].screeningresultsloader = true;
	// 				}
	// 				this.subsidaryFilterData[findIdinchart]['no-screening'] = false;
	// 				// this.showSubsidariesInchart(this.showSubsidaries);
	// 			}
	// 		});
	// 		this.activateScreeningEnabled = false;
	// 		this.enableSelectUnselect = false;
	// 		// calling filterScreeningWithPep function to display the screening as per the pep/sanction filters
	// 		this.filterScreeningWithPep(false);
	// 			this.ref.markForCheck();

	// 	},((err)=>{
	// 		// this.getEntitiesSelectedScreening = false;
	// 		this.activateScreeningEnabled = false;
	// 		this.enableSelectUnselect = false;
	// 		this.screeningData.forEach((val, key)=> {
	// 			val.screeningresultsloader = false;
	// 			val['isChecked'] = false;
	// 		});
	// 		this.totalSelectedEntiesForScreening = [];
	// 		// HostPathService.FlashErrorMessage('ERROR', err.responseMessage);

	// 	}))
	// }
	 customerOutreach() {
		this.entityApiService.customerOutreach().subscribe( (response:any)=> {
			this.customerOutreachDoc = response;
			this.EditEntityTypeList = response;
			this.addEntityTypeList = response;
		});
	}
	customerOutreachDataForReport(response) {
		this.createNewArrayReportData = [];
		response.data.map( (d)=> {
			if (d.recognizedEntityType && d.recognizedEntityType != 'UBO') {
				var ind = this.customerOutreachDoc.map((d)=> {
					return d.entityType;
				}).indexOf(d.recognizedEntityType)
				this.createNewArrayReportData.push({
					'name': d.name,
					'recognizedEntityType': d.recognizedEntityType,
					'document': this.customerOutreachDoc && this.customerOutreachDoc[ind] && this.customerOutreachDoc[ind].requirementsList ? this.customerOutreachDoc[ind].requirementsList : ''
				});
			}
		})
	}
	customerOutreachUpdateData(name:any, entityType:any) {
		var ind = this.customerOutreachDoc.map(function (d) {
			return d.entityType;
		}).indexOf(entityType)
		var listData = [];
		if (ind != -1) {
			listData = this.customerOutreachDoc[ind].requirementsList
		}
	    this.createNewArrayReportData.push({
			'name': name,
			'recognizedEntityType': entityType,
			'document': listData
		});
	}
	/* @purpose:Loads the Custom Charts
		*
		* @created: 07 may 2019
		* @params: type(string)
	* @returns fetcher for API call is not made
		* @author: Ram Singh */

		loadCustomChart = function (divId, tabIndex, isCreate) {
			this.customChartView = true;
			this.selectedMultipleeEntities = [];
			this.entitySearchResult.list.currentVLArendered = divId;
			if (isCreate) {
				//call function to create custom chart
				this.isCustomAvailable = true;
				this.entitySearchResult.list.graphviewIndex = 1;
				this.createCustomChart(divId, isCreate);
			} else {
				this.showSubsidariesInchart(!this.customChartView);
			}
			this.screeningTableOriginal_custom(this.actualScreeningData);
		}
		createCustomChart(divId, isCreate) {
			var addcustoms = $.extend(true, [], this.subsidariesfilteredData);
			var duplicate_entites = [];
			var sort_duplicate_entites = [];
			addcustoms.forEach( (val, key) =>{
				if (val.id != "p00" && !val.isCustom) {
					//call api to add the current entity
					val.identifier = "";
					var childIndex = findIndex(addcustoms, {
						id: val.child
					});
					if (childIndex !== -1) {
						val.childEntity = addcustoms[childIndex]
					};
					if (val.source_evidence) {
						val.searchedSourceObj = this.sourceList.find( (value)=> {
							return value.sourceName == val.source_evidence;
						})
					}
					duplicate_entites.push(val);
				}
			});
			sort_duplicate_entites = duplicate_entites.sort(function (a, b) {
				return a.level - b.level;
			});
			if (sort_duplicate_entites.length > 0 && sort_duplicate_entites[0]) {
				this.entityOrgchartService.addShareholderinGetCorporate(sort_duplicate_entites[0].childEntity,sort_duplicate_entites[0],
					'add',sort_duplicate_entites[0].childIndex,sort_duplicate_entites[0].searchedSourceObj,this.queryParams,
					this.subsidaryFilterData, this.screeningData, this.actualScreeningData);
			}
			this.showSubsidariesInchart(!this.customChartView);
		}

		public tempOperationsForReport = [];
		formateCountriesOperationsForWorldMapInReport(countriesOfOperations:any) {
			countriesOfOperations.forEach((val:any)=>{
				if (val.Risk == 'UHRC' || val.Risk == 'High' || val.Risk == 'Medium' || val.CountryRisk == 'UHRC' || val.CountryRisk == 'High' || val.CountryRisk == 'Medium') {
					this.tempOperationsForReport.push(val);
				}
			})

			return this.tempOperationsForReport;
		}
	///// screenign Data Ends

	//////Add and Edit Screening Data starts //////////

	//////Add and Edit Screening Data Ends ///////
	/////Chart Related ////
	sourceChangegraph(sourceSelected){
		const sourceChangeConfirmationModalRef = this.modalService.open(GraphchangesourceconfirmationComponent,
			{
				windowClass:'custom-modal c-arrow  bst_modal add-ownership-modal add-new-officer',
				backdrop:'static'
			});
			sourceChangeConfirmationModalRef.componentInstance.purpose ='graphchange';
			sourceChangeConfirmationModalRef.result.then((response)=>{
				if(response){
					EntityConstants.customEntites.adddeleteEntity = [];
						this.entitySearchResult.list.sourceFilterChart_not_Started = false;
						this.pageloader.chartFailureMessage = '';
						this.entitySearchResult.list.currentVLArendered = "vlaContainer";
						this.isCustomAvailable = false;
						this.customChartView = false;
						this.pageloader.loadingText = false;//loading flag is off by default
						this.entitySearchResult.list.graphviewIndex = 0;
						this.entitySearchResult.list.intialSourceSelected = sourceSelected;
						this.entitySearchResult.list.previousSourceSelected = sourceSelected;
						this.pageloader.treeGraphloader = true;
						$("#generateReport").parent().addClass("c-ban");
						$("#generateReport").addClass("pe-none");
						var param = {
							identifier: this.queryParams.query,
							url: {
								"url":  EntityConstants.basicSharedObject.org_structure_link
							},
							numnberoflevel: this.filteredChart.selectedNumberofLevel,
							lowRange:this.sliderUtilitesobj.sliderMinValue,
							highRange:this.sliderUtilitesobj.sliderMaxValue,
							organisationName: this.entityDetails && this.entityDetails['vcard:organization-name'] && this.entityDetails['vcard:organization-name'].value ? this.entityDetails['vcard:organization-name'].value :  '',
							juridiction:  this.queryParams.cid ? ( this.queryParams.cid).toUpperCase() : this.entityDetails && this.entityDetails['isDomiciledIn'] && this.entityDetails['isDomiciledIn'].value ? this.entityDetails['isDomiciledIn'].value :'',
							noOfSubsidiaries: this.filteredChart.numberofcomapnies ? this.filteredChart.numberofcomapnies : 5,
							isSubsidiariesRequired: this.showSubsidaries,
							Start_date: this.filteredChart.toyear,
							End_date: this.filteredChart.fromyear,
							source: sourceSelected
						};
						this.entityApiService.getOwnershipPath(param).subscribe (( (response:any)=> {
							if (response && response.path) {
								setTimeout( ()=> {
									EntityConstants.basicSharedObject.curr_time_to_20min = new Date();
									EntityConstants.basicSharedObject.curr_time_to_20min.setMinutes(EntityConstants.basicSharedObject.curr_time_to_20min.getMinutes() +20);
									this.pageloader.treeGraphloader = false;
									// tag cloud variables initializations for person
									this.entitySearchResult.list.sourceFilterChart_not_Started = true;
									this.updateOwnershipRecurssive(response.path);
								}, 17000);
							}
						}),( (err)=> {
							this.pageloader.treeGraphloader = false;
						}));
						this.pageloader.treeGraphloader = true;


				}
			});

	}
	onScale(scale){
		this.pageloader.treeGraphloader = true;
		if (scale != null) {
			$("#" + this.entitySearchResult.list.currentVLArendered).famDiagram({
				scale: scale
			});
			setTimeout(() => {
				$("#" + this.entitySearchResult.list.currentVLArendered).famDiagram("update", /*Refresh: use fast refresh to update chart*/
					primitives.orgdiagram.UpdateMode.Recreate);
				this.entityCommonTabService.AppendOrgGraphIcon("#"+this.entitySearchResult.list.currentVLArendered);
			}, 1000);

		}
		this.pageloader.treeGraphloader = false;

	}
	//////////////////// Complex Structure Code Starts//////////////////
	//function for keeping complex structure intial when page was refreshed
	 getComplexStructureIndicator() {
		var params = {
			entityId: this.queryParams.query,
			entitySource: this.entitySearchResult.list.graphSourceSelected,
			entityName: this.entityDetails && this.entityDetails['vcard:organization-name'] && this.entityDetails['vcard:organization-name'].value ? this.entityDetails['vcard:organization-name'].value : '',
		}
		this.entityApiService.getComplexStructureOnRefresh(params).subscribe(( (response:any)=> {
			if (response ) {
				this.complexObj.complexOwnershipStructure = response.isComplexStructure ? response.isComplexStructure : response;
			}
		}));
	}

	setComplexOwnership(value) {
		this.complexOwnershipToggle = value;
		const complexStructureConfirmationModalRef = this.modalService.open(GraphchangesourceconfirmationComponent,{
				windowClass: 'custom-modal c-arrow bst_modal',
				backdrop: 'static'
			});
		complexStructureConfirmationModalRef.componentInstance.purpose = 'complexStruture';
		complexStructureConfirmationModalRef.componentInstance.complexOwnershipToggle = value;

		complexStructureConfirmationModalRef.result.then((selectedItem) => {
			if(selectedItem){
				this.dataOverOwnerShipModal();
			}
		});


	}
	dataOverOwnerShipModal() {
		var params = {
			isComplexStructure: this.complexOwnershipToggle,
			entityId: this.queryParams.query,
			entitySource: this.entitySearchResult.list.graphSourceSelected,
			entityName: this.entityDetails && this.entityDetails['vcard:organization-name'] && this.entityDetails['vcard:organization-name'].value ? this.entityDetails['vcard:organization-name'].value : '',
		}
	 this.complexStructureLoader = true;
		setTimeout(()=> {
			this.entityApiService.updateComplexStructureAPI(params).subscribe( ((response:any)=> {
				this.complexObj.complexOwnershipStructure = response && response.isComplexStructure ? response.isComplexStructure :false;
				if (response  && response.isComplexStructure) {
					this.openShareHolderModal(false);
				}
				this.complexStructureLoader = false;
			}),
			((error)=> {
				this.complexStructureLoader = false;
			}));
		}, 100);

	}
	/* @purpose : function to open share holder screen modal
	* @params :  no
	*
	*/
	openShareHolderModal(current_entity_node) {
		var filter_shareholders = this.subsidariesfilteredData.filter( (obj:any)=> {
			return (obj.entity_id && obj.entity_id == "orgChartParentEntity" && (obj.classification.includes('Intermediate Parent') || obj.classification.includes('Ultimate Legal Parent')));
		});
		const shareholderEvidence = this.modalService.open(EntityShareHolderEvidenceModalComponent,{
			windowClass: 'custom-modal bst_modal  c-arrow bst_modal modal_md evidence-modal-wrapper adverse-full-modal mxw-auto modal-large',
			backdrop: 'static'
		});
		shareholderEvidence.componentInstance.shareHolderData = this.subsidariesfilteredData;
		shareholderEvidence.componentInstance.currentEntityNode = current_entity_node;

		shareholderEvidence.result.then((selectedItem) => {
	});




		// var templateUrl = 'shareHolderEvidenceModal.html';
		// var templateSize = 'lg';
		// var full_modalClass = 'adverse-full-modal';
		// if (filter_shareholders.length === 0) {
		// 	templateUrl = 'EntityShareHolderNoData.html';
		// 	templateSize = 'xs';
		// 	full_modalClass = '';
		// }
		// var datashareModal = $uibModal.open({
		// 	templateUrl: templateUrl,
		// 	controller: 'EntityShareHolderEvidenceModalController',
		// 	scope: this,
		// 	size: templateSize,
		// 	windowClass: 'custom-modal bst_modal  c-arrow bst_modal modal_md evidence-modal-wrapper ' + full_modalClass,
		// 	resolve: {
		// 		shareHolderData: function () {
		// 			return subsidariesfilteredData;
		// 		},
		// 		currentEntityNode: function () {
		// 			return current_entity_node;
		// 		}
		// 	}
		// });
		// datashareModal.result.then(function (response) {
		// }, function (reject) {
		// });
	}



	//////////////////// Complex Structure Code ENds//////////////////

	enableGenerateReportComponent(val){
		this.generateReport = val;
	}
	stickyFilesCompliance(event, section) {
		event.stopPropagation();
		event.preventDefault();
		TopPanelConstants.isFromEntitySection = true;
		TopPanelConstants.isUploadFromEntitySection = false;
		this.entityClipboardSizeandPosition(event, section, 'sticky');
	}
	entityClipboardSizeandPosition(event, section, type) {
		TopPanelConstants.clipBoardObject.file_wraper = 'clipboard_entity_file_wraper';
		TopPanelConstants.showMyEntityClipboard = !TopPanelConstants.entityselection ? true : (section === TopPanelConstants.entityselection && this.sticky_selected_type === type) ? false : ((section === TopPanelConstants.entityselection && this.sticky_selected_type !== type) ? true : (section !== TopPanelConstants.entityselection && this.sticky_selected_type !== type ? true : false));
		if (!TopPanelConstants.entityselection || (this.sticky_selected_type !== type && section === TopPanelConstants.entityselection)) {
			setTimeout( ()=> {
				//this.$apply(function () {
					TopPanelConstants.showMyEntityClipboard = true;
				//});
			}, 0);
			TopPanelConstants.entityselection = section;
		} else if (section !== TopPanelConstants.entityselection) {
			TopPanelConstants.showMyEntityClipboard = false;
			TopPanelConstants.entityselection = section;
			setTimeout( ()=> {
				//this.$apply(function () {
					TopPanelConstants.showMyEntityClipboard = true;
				//});
			}, 0);
		} else if (section === TopPanelConstants.entityselection && this.sticky_selected_type === type) {
			setTimeout( ()=> {
				//this.$apply(function () {
					TopPanelConstants.showMyEntityClipboard = false;
				//});
			}, 0);
			this.sticky_selected_type = '';
			this.sticky_selected_section = '';
			TopPanelConstants.entityselection = '';
		} else {
			TopPanelConstants.showMyEntityClipboard = false;
			this.sticky_selected_type = '';
			this.sticky_selected_section = '';
			TopPanelConstants.entityselection = '';
		}
		this.sticky_selected_type = type;
		if ($("#entityWrapper").width() && $("#entityWrapper").width() > 0) {
			TopPanelConstants.clipBoardObject.modal_postion.top = (event.pageY + 262) + 'px';
			TopPanelConstants.clipBoardObject.modal_postion.left = (event.pageX - 270) + 'px';
			var p = $(".entity-page")
			var position = p.offset();
			var tooltipWidth = $("#entityWrapper").width() + 50
			var cursor = event.pageX;
			if ((position.left < event.pageX) && (cursor > tooltipWidth)) {
				TopPanelConstants.clipBoardObject.modal_postion.top = (position.top + 262) + 'px';
				TopPanelConstants.clipBoardObject.modal_postion.left = (event.pageX - 30 - ($("#entityWrapper").width() / 2)) + 'px';
			} else {
				TopPanelConstants.clipBoardObject.modal_postion.top = (position.top + 262) + 'px';
				TopPanelConstants.clipBoardObject.modal_postion.left = (event.pageX - 20) + 'px';
			}
		} else {
			setTimeout(()=> {
				var p = $(".entity-page")
				var position = p.offset();
				var tooltipWidth = $("#entityWrapper").width() + 50;
				TopPanelConstants.clipBoardObject.modal_postion.top = (position.top + 262) + 'px';
				TopPanelConstants.clipBoardObject.modal_postion.left = (event.pageX - 270) + 'px';
				var cursor = event.pageX;
				if ((position.left < event.pageX) && (cursor > tooltipWidth)) {
					TopPanelConstants.clipBoardObject.modal_postion.left = (event.pageX - 30 - ($("#entityWrapper").width() / 2)) + 'px';
				} else {
					TopPanelConstants.clipBoardObject.modal_postion.left = (event.pageX - 20) + 'px';
				}
			}, 0);
		}
	}
}
