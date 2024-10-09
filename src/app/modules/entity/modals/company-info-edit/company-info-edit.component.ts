import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { formatDate } from '@angular/common';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { EntityConstants } from '../../constants/entity-company-constant';
import { AppConstants } from '../../../../app.constant';
import { EntityApiService } from '../../services/entity-api.service';
import { EntityOrgchartService } from '../../services/entity-orgchart.service';
import { EntityCommonTabService } from '../../services/entity-common-tab.service';
import { uniq, compact, findIndex } from 'lodash-es';
import { WINDOW } from '../../../../core/tokens/window';
declare var $: any;

@Component({
  selector: 'app-company-info-edit',
  templateUrl: './company-info-edit.component.html',
  styleUrls: ['./company-info-edit.component.scss']
})
export class CompanyInfoEditComponent implements OnInit {

  @Input('ceriSearchResultObject') ceriSearchResultObject: any = EntityConstants.complianceObject;
  @Input('modalInstance') modal;
  @Input('sourceList') sourceList;
  @Input('queryParams') queryParams: any;
  @Output() ceriSearchResultObjectChange = new EventEmitter();
  @Output() companyInfoChange = new EventEmitter();
  @ViewChild('dob',{static:false}) public  dob;

  companyInfo
  public modaldata: any;
  public schema: any;
  public sourceUrlList: any;
  public originalAns: any;
  public title: any;
  public activePanelId:string;


  @Input() set params(data: any) {
    this.modaldata = data;
    this.schema = data.schema;
    this.sourceUrlList = false;
    this.originalAns = data.source ? data.source.preValue ? (this.isJson(data.source.preValue) ? JSON.parse(data.source.preValue).toString() : data.source.preValue) : '' : '';
    this.title = data.title;
    this.sourceList_forModal = $.extend(true, [], this.sourceList);
    this.onload();
  }
  isJson = function (str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };
  //public $parent.pdfLoader = false;

  public oneAtATime = false;
  public primarySource = [];
  public secondarySource = [];
  public userInputSource = null;
  public userModifiedBy = '';
  public userModifiedOn = '';
  public userModifiedValue = '';
  public textArea = { userModifiedValue: '' };
  public overrideSource = '';
  public overrideSrcValue = '';
  public isUserdataSelected = false;

  public dataPopObject :any= {
    overideSearchedInputSourceEdit: '',
    overideSearchedInputURLEdit: '',
    overideSearchedInputDateEdit: ''
  };
  public accordian = {
    primaryOpen: false,
    secondaryOpen: false
  };
  public sourceList_forModal: any = [];


  public disableInput = false;
  public showAddbutton = false;
  public overideSearchedInputSourceEditVal: any;
  public sourceTypeName: any;
  public overrideValue: any;
  public showSavebtnwithclass: any;
  public header: any;
  public overridesourceUrl: any;
  public source_DisplayName: any;
  public dateError = false;
  public documentListsData: any = [];
  public evidenceDocumentsListsData: any = [];
  public showAddNew: boolean;
  public slectedDoc_DocId: any;
  public showEditMode: any;
  public fiteredSourceList: any;
  public showfiteredSourceList: any;

  constructor(
    private entityApiService: EntityApiService,
    private entityOrgchartService: EntityOrgchartService,
    private entityCommonTabService: EntityCommonTabService,
    private calendar: NgbCalendar,
    @Inject(WINDOW) private readonly window: Window
  ) { }

  ngOnInit() {
    // this.sourceList_forModal = $.extend(true, [], this.sourceList);
    // this.onload();
  }
  makeUrlSecureToWork(url){
    return this.entityCommonTabService.makeUrlSecureToWork(url)
  }

  getKeyByValue(object, value) {

    return Object.keys(object).find(key => object[key] === value[value.indexOf(object[key])]);
  }
  changeOverrideValue(source, value, sourceUrl,source_DisplayName){
    this.overrideSrcValue = value;
    if(source){
      this.overrideSource = source;
      this.isUserdataSelected = true;
      this.disableInput = true;
      this.showSavebtnwithclass = false;
      this.overridesourceUrl = sourceUrl;
      this.source_DisplayName = source_DisplayName ? source_DisplayName : '';
    }else{
      this.overrideSource = '';
      this.isUserdataSelected = false;
      this.disableInput = false;
      this.showSavebtnwithclass = true;
    }
  };


  overRide() {
    let data = this.modaldata;
    var saveEntityData: any = {};
    if (this.overrideSource) {
      saveEntityData = {
        "source": this.overrideSource,
        "sourceUrl": this.overridesourceUrl ? this.overridesourceUrl : '',
        "value": this.overrideSrcValue.toString(),
        "sourceSchema": data.schema,
        "entityId": this.queryParams.query,
        "isUserData": false,
        "sourceDisplayName": this.source_DisplayName,
        "sourceType": this.sourceTypeName ? this.sourceTypeName : 'link',
        "docId": ''
      };
    }
    else {
      var sourceName = this.dataPopObject.overideSearchedInputSourceEdit;
      var prev_val = this.ceriSearchResultObject[data.schema].value;

      if (data.schema && data.schema == "bst:aka") {
        if (!this.isJson(prev_val)) {
          prev_val = JSON.stringify(prev_val);
        }
      }
      // var prev_date = this.$parent.ceriSearchResultObject[data.schema].modifiedOn;
      // var prev_isuserdata = this.$parent.ceriSearchResultObject[data.schema].isUserData;
      var src_type = this.sourceTypeName;
      if (this.showAddNew) { // this.showAddNew if custom source and sourceurl is added by the user
        src_type = "link";
      }
      saveEntityData = {
        "value": this.textArea.userModifiedValue ? this.textArea.userModifiedValue : data.source.userValue,
        "sourceSchema": data.schema,
        "entityId": this.queryParams.query,
        "source": sourceName ? sourceName : '',
        "sourceUrl": this.dataPopObject.overideSearchedInputURLEdit ? this.dataPopObject.overideSearchedInputURLEdit : '',
        "preValue": prev_val,
        "isUserData": true,
        "sourceType": src_type ? src_type : 'link',
        "publishedDate": this.dataPopObject.overideSearchedInputDateEdit ? this.dataPopObject.overideSearchedInputDateEdit.year +'-'+('0'+this.dataPopObject.overideSearchedInputDateEdit.month).slice(-2)+'-'+('0'+this.dataPopObject.overideSearchedInputDateEdit.day).slice(-2):'',
        "docId": this.slectedDoc_DocId ? this.slectedDoc_DocId : ''
      };
    }
    // $scope.$parent.pageloader.companyDetailsReview = true;

    // if(saveEntityData.isUserData){
    // 	var sourceIndex = $scope.sourceList_forModal.findIndex(function(d){
    // 		return d.sourceName == $scope.dataPopObject.overideSearchedInputSourceEdit;
    // 	});
    // 	if(sourceIndex === -1){
    // 			$scope.addSource();
    // 			return;
    // 	}
    // }
    var currentdate = new Date();
    var datetime = + currentdate.getFullYear() + "-"
      + (currentdate.getMonth() + 1) + "-"
      + currentdate.getDate() + " "
      + currentdate.getHours() + ":"
      + currentdate.getMinutes() + ":"
      + currentdate.getSeconds() + ":"
      + currentdate.getMilliseconds();

    //$scope.$parent.pageloader.companyDetailsReview = true;

    this.entityApiService.saveEntityAttributes(saveEntityData).subscribe((response: any) => {

      if (this.overrideSource) {
        this.ceriSearchResultObject[data.schema].source = this.overrideSource;
        this.ceriSearchResultObject[data.schema].sourceUrl = this.overridesourceUrl;
      }
      if (this.overrideSource) {
        this.ceriSearchResultObject[data.schema].value = saveEntityData.value;
      } else {
        this.ceriSearchResultObject[data.schema].value = this.textArea.userModifiedValue ? this.textArea.userModifiedValue : data.source.userValue;
      }

      if (!this.isUserdataSelected) {
        this.ceriSearchResultObject[data.schema].modifiedOn = datetime;
        this.ceriSearchResultObject[data.schema].isUserData = true;
        this.ceriSearchResultObject[data.schema].modifiedBy = "username";
        this.ceriSearchResultObject[data.schema].source = saveEntityData.source;
        this.ceriSearchResultObject[data.schema].sourceUrl = saveEntityData.sourceUrl;
        this.ceriSearchResultObject[data.schema].publishedDate = saveEntityData.publishedDate;
        this.ceriSearchResultObject[data.schema].preValue = prev_val;
        this.ceriSearchResultObject[data.schema].userValue = saveEntityData.value ? saveEntityData.value : '';
        this.ceriSearchResultObject[data.schema].userSource = saveEntityData.source ? saveEntityData.source : '';
        this.ceriSearchResultObject[data.schema].userSourceUrl = saveEntityData.sourceUrl ? saveEntityData.sourceUrl : '';
        this.ceriSearchResultObject[data.schema].userPublishedDate = saveEntityData.publishedDate ? saveEntityData.publishedDate : '';
        this.ceriSearchResultObject[data.schema].docId = saveEntityData.docId ? saveEntityData.docId : '';

      } else {
        this.ceriSearchResultObject[data.schema].isUserData = false;
      }
      if (data.schema == 'bst:description') {
        this.companyInfoChange.emit(this.ceriSearchResultObject[data.schema].value)
        //$scope.$parent.companyInfo.texts = this.ceriSearchResultObject[data.schema].value;
      }
      this.ceriSearchResultObject[data.schema].sourceType = src_type ? src_type : '';
      this.ceriSearchResultObjectChange.emit(this.ceriSearchResultObject);
      //$scope.$parent.pageloader.companyDetailsReview = false;
      // $scope.$parent.getCaseByRiskDetails();
      //           $uibModalInstance.close();

      // }).catch(function(error){
      //$scope.$parent.pageloader.companyDetailsReview = false;
    });
   this.close();
  };
  toggleAccordian(accordianType, event) {
    if ($(event.target).parent().parent().parent().attr("role") === 'tab') {
      if (accordianType == 'primary') {
        this.accordian.primaryOpen = !!this.accordian.primaryOpen;
        this.activePanelId = "primary-panel";
      } else if (accordianType == 'secondary') {
        this.accordian.secondaryOpen = !!this.accordian.secondaryOpen;
        this.activePanelId = "secondary-panel";
      }
    } else {
      return;
    }
  };
  editInputSource(value, cancel) {
    this.showEditMode = value;
    let data = this.modaldata;
    if (cancel) {
      this.overideSearchedInputSourceEditVal = data.source.source ? data.source.source : data.source.modifiedBy;
      this.dataPopObject.overideSearchedInputSourceEdit = data.source.source ? data.source.source : data.source.modifiedBy;
      this.dataPopObject.overideSearchedInputURLEdit = data.source.sourceUrl ? data.source.sourceUrl : "";
      var splittedvalue = data.source.publishedDate ? data.source.publishedDate.split(' ') : "";
      this.dataPopObject.overideSearchedInputDateEdit = splittedvalue ? splittedvalue[0] : "";
    }
  }
  addSourceOveride() {
    var url = AppConstants.Ehub_Rest_API + 'sourceManagement/#!/sourceManagement';
    this.window.open(url, '_blank');
    localStorage.setItem('toAdd', 'yes');
    this.showAddNew = false;
    this.dataPopObject.overideSearchedInputSourceEdit = "";
    this.overideSearchedInputSourceEditVal = "";
    //		modalInstanceAdd.dismiss('close');

  }
  sourceSearchInputOveride(event: any, value, type) {
    this.fiteredSourceList = [];
    this.sourceUrlList = true;
    if (this.dataPopObject.overideSearchedInputSourceEdit == "") {
      this.sourceUrlList = false;
    }
    if (value) {
      this.showfiteredSourceList = true;
      this.sourceList_forModal.forEach((source: any) => {
        if (source.sourceName.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
          this.fiteredSourceList.push({ sourceName: source.sourceName, source_type: source.source_type });
        } else {
          this.showAddNew = true;
        }
      })
    } else {
      this.showAddNew = false;
      this.dataPopObject.overideSearchedInputSourceEdit = '';
      this.dataPopObject.overideSearchedInputURLEdit = '';
      this.dataPopObject.overideSearchedInputDateEdit = '';
    }
    if (event.keyCode === 13) {
      if (this.fiteredSourceList && this.fiteredSourceList.length > 0) {
        this.fillSourceSearchedInputOveride(this.fiteredSourceList[0].sourceName, type);
        // $scope.updateCompanyDetails(output[0],obj,tabname);
      } else if (this.fiteredSourceList.length == 0) {
        // $scope.saveIndustryOption(obj,compkey);
        this.showAddNew = false;
        // $scope.updateCompanyDetails(value,obj,tabname);
      }
    }
    // 	}
    // setTimeout(function () {
    //   $(".custom-list.auto-complete-list.searchSource").mCustomScrollbar({
    //     axis: "y",
    //     theme: "minimal-dark"
    //   });
    // }, 0);

  }
  fillSourceSearchedInputOveride(value, type) {
    type = value.source_type;
    this.sourceTypeName = value.source_type;
    if (value) {
      var sourceIndex = this.sourceList_forModal.findIndex(function (d) {
        return (d.sourceName == value.sourceName && (d.type === type || d.source_type === type || d.sourceType === type));
      });
      // $scope.showfiteredSourceList =false;
      this.dataPopObject.overideSearchedInputSourceEdit = this.sourceList_forModal[sourceIndex].sourceName;
      this.overideSearchedInputSourceEditVal = this.sourceList_forModal[sourceIndex].sourceName;
      if (type === 'link') {
        this.dataPopObject.overideSearchedInputURLEdit = this.sourceList_forModal[sourceIndex].sourceUrl;
      } else if (type === 'doc' || type === 'docx' || type === "png" || type === "pdf") {
        this.dataPopObject.overideSearchedInputURLEdit = this.sourceList_forModal[sourceIndex].sourceUrl;
        this.slectedDoc_DocId = this.sourceList_forModal[sourceIndex].docId ? this.sourceList_forModal[sourceIndex].docId : '';
      }
      this.dataPopObject.overideSearchedInputDateEdit = formatDate(new Date(), 'yyyy-MM-dd', 'en');


    }
  };
  addSource() {
    var sourcename = this.dataPopObject.overideSearchedInputSourceEdit;
    var sourceUrl = this.dataPopObject.overideSearchedInputURLEdit;
    // var sourceDate = $scope.dataPopObject.overideSearchedInputDateEdit;

    var reqData = {
      "classifications": [{
        "classifcationName": "GENERAL",
        "classificationId": null,
        "hideStatusDto": null,
        "subClassifications": []
      }],
      "sourceName": sourcename ? sourcename : "",
      "sourceUrl": sourceUrl ? sourceUrl : "",
      "sourceDisplayName": sourcename ? sourcename : "",
      "entityId": "",
      "sourceType": "",
      "sourceDomain": [],
      "sourceIndustry": [],
      "sourceJurisdiction": [],
      "sourceMedia": [],
    };

    return;
    //  EntityApiService.addNewSourceAPI(reqData).then(function (response) {
    // 			var obj = {
    // 				classifications: null,
    // 				deleteMedia: false,
    // 				entityId: null,
    // 				sourceCreatedDate: null,
    // 				sourceDisplayName: null,
    // 				sourceDomain: null,
    // 				sourceId: 0,
    // 				sourceIndustry: null,
    // 				sourceJurisdiction: null,
    // 				sourceMedia: null,
    // 				sourceName: reqData.sourceName,
    // 				sourceType: null,
    // 				sourceUrl: reqData.sourceUrl
    // 			};
    // 			$scope.sourceList_forModal.push(obj);
    // 			$scope.overRide();
    // 	}, function (err) {
    // 	});
  };
  dateValidate() {
    var dateString = this.dataPopObject.overideSearchedInputDateEdit;
    var regex = /^\d{4}(\-)(((0)[0-9])|((1)[0-2]))(\-)([0-2][0-9]|(3)[0-1])$/;
    //Check whether valid yyyy-MM-dd Date Format.
    if (regex.test(dateString)) {
      this.dateError = false;
    } else {
      this.dateError = true;
    }
  };
  enabledSouceInputs(){
    this.showAddbutton = true;
    this.showSavebtnwithclass = true;
    this.disableInput = false;
  };
  closeSourceListPopUp(){
    let data = this.modaldata;
    if(data.source.isUserData){
    this.dataPopObject.overideSearchedInputSourceEdit=data.source.source?data.source.source:data.source.modifiedBy;
    this.overideSearchedInputSourceEditVal= data.source.source?data.source.source:data.source.modifiedBy;
    this.dataPopObject.overideSearchedInputURLEdit = data.source.sourceUrl?data.source.sourceUrl:"";
    let splittedvalue = data.source.publishedDate?data.source.publishedDate.split(' ') :"";
    this.dataPopObject.overideSearchedInputDateEdit  = splittedvalue?splittedvalue[0]:"";
  }else {
    this.dataPopObject.overideSearchedInputSourceEdit=data.source.userSource?data.source.userSource:'';
    this.overideSearchedInputSourceEditVal= data.source.userSource?data.source.userSource:'';
    this.dataPopObject.overideSearchedInputURLEdit = data.source.userSourceUrl?data.source.userSourceUrl:"";
    let splittedvalue = data.source.userPublishedDate?data.source.userPublishedDate.split(' ') :"";
    this.dataPopObject.overideSearchedInputDateEdit  = splittedvalue?splittedvalue[0]:"";
  }
    this.sourceUrlList = false;
  }
  applySourceEvidence(sourceData){
    var patt = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    var result = patt.test(this.dataPopObject.overideSearchedInputURLEdit);
    if(result && !this.sourceTypeName){
      this.sourceTypeName = "link";
    }
    if(this.fiteredSourceList && this.fiteredSourceList.length == 0){
      this.sourceTypeName = "link";
      this.showAddNew = true;
    }
    if(this.fiteredSourceList && this.fiteredSourceList.length > 0){
      this.showAddNew = false;
    }
    this.sourceUrlList = false;

  }

  onload() {
    let data = this.modaldata;
    if (data && data.source &&data.source.isUserData) {
      this.disableInput = false;
      this.userModifiedBy = this.isJson(data.source.modifiedBy) ? JSON.parse(data.source.modifiedBy) : data.source.modifiedBy;
      this.userModifiedOn = data.source.modifiedOn;
      this.dataPopObject.overideSearchedInputSourceEdit = data.source.source ? data.source.source : data.source.modifiedBy;
      this.overideSearchedInputSourceEditVal = data.source.source ? data.source.source : data.source.modifiedBy;
      this.dataPopObject.overideSearchedInputURLEdit = data.source.sourceUrl ? data.source.sourceUrl : "";
      var splittedvalue = data.source.publishedDate ? data.source.publishedDate.split('-') : "";
      var date :NgbDateStruct= {
        "year": splittedvalue[0],
        "month": splittedvalue[1],
        "day": splittedvalue[2]
      }
      setTimeout(() => {
        var editedDate  = this.calendar.getToday();
        editedDate.day = +date.day;
        editedDate.month = +date.month;
        editedDate.year = +date.year;
        this.dataPopObject.overideSearchedInputDateEdit = editedDate;
      }, 1000);
      this.dataPopObject.overideSearchedInputDateEdit  =  splittedvalue ? date : "";
      if (data.source.sourceType && data.source.sourceType !== "") {
        this.sourceTypeName = data.source.sourceType;
      } else if (data.source.userSource) {
        this.sourceTypeName = data.source.userSource.split('.')[1];
      }

      if (!data.source.sourceUrl) {
        this.dataPopObject.overideSearchedInputSourceEdit = '';
        this.overideSearchedInputSourceEditVal = '';
        this.dataPopObject.overideSearchedInputURLEdit = '';
        this.dataPopObject.overideSearchedInputDateEdit = '';
      }
      if (data.schema == "bst:aka") {
        this.userModifiedValue = data.source.value.toString();
        if (!data.source.preValue) {
          data.source.preValue = '';
        }
        this.originalAns = this.isJson(data.source.preValue) ? JSON.parse(data.source.preValue).toString() : data.source.preValue.toString();
      } else if (data.schema == 'bst:stock_info') {
        this.userModifiedValue = data.source.value.main_exchange; //+value.main_exchange"_"+ data.source. ;
        if (!data.source.preValue) {
          data.source.preValue = {};
          data.source.preValue.main_exchange = '';
        }
        this.originalAns = data.source.preValue.main_exchange;
      } else {
        if (data.source && data.source.value) {
          this.userModifiedValue = data.source.value.replace(/(\r\n|\n|\r)/gm, ",");
        }
        if (!data.source.preValue) {
          data.source.preValue = '';
        }
        this.originalAns = data.source.preValue;
      }
      this.userModifiedValue = this.isJson(this.userModifiedValue) ? JSON.parse(this.userModifiedValue) : this.userModifiedValue;
      this.overrideValue = this.userModifiedValue;
      this.textArea.userModifiedValue = this.userModifiedValue.toString();
      this.showAddbutton = true;
      this.showSavebtnwithclass = true;
    } else {
      if (data.schema == "bst:aka") {
        this.overrideValue = data.source.source //+"_"+data.source.value [0];
      } else if (data.schema == 'bst:stock_info') {
        this.overrideValue = data.source.source //+"_"+ data.source.value.main_exchange ;
      }
      else {
        this.overrideValue = data.source.source //+"_"+  data.source.value ;
      }
      // this.userModifiedBy = data.source.modifiedBy;
      this.userModifiedBy = this.isJson(data.source.modifiedBy) ? JSON.parse(data.source.modifiedBy) : data.source.modifiedBy;
      this.userModifiedOn = data.source.modifiedOn;
      this.userModifiedValue = data.source.userValue;
      this.overrideValue = this.isJson(this.overrideValue) ? JSON.parse(this.overrideValue) : this.overrideValue;
      this.showAddbutton = false;
      this.showSavebtnwithclass = false;
      this.userModifiedValue = this.isJson(this.userModifiedValue) ? JSON.parse(this.userModifiedValue) : this.userModifiedValue;
      if (this.userModifiedValue && this.userModifiedValue.toString()) {
        this.showAddbutton = true;
        this.showSavebtnwithclass = true;
        this.textArea.userModifiedValue = this.isJson(data.source.userValue) ? JSON.parse(data.source.userValue) : data.source.userValue;
        this.dataPopObject.overideSearchedInputSourceEdit = data.source.userSource ? data.source.userSource : '';
        this.overideSearchedInputSourceEditVal = data.source.userSource ? data.source.userSource : '';
        this.dataPopObject.overideSearchedInputURLEdit = data.source.userSourceUrl ? data.source.userSourceUrl : "";
        var splittedvalue = data.source.userPublishedDate ? data.source.userPublishedDate.split(' ') : "";
        this.dataPopObject.overideSearchedInputDateEdit = splittedvalue ? splittedvalue[0] : "";
        this.disableInput = true;
      }
    }

    if (data.source.primarySource && data.source.primarySource.length > 0) {
      data.source.primarySource = uniq(data.source.primarySource);

      data.source.primarySource.forEach((d) => {
        this.primarySource.push({
          source: d.source,
          sourceDisplayName: d.sourceDisplayName ? d.sourceDisplayName : '',
          sourceUrl: d.sourceUrl,
          value: this.isJson(d.value) ? JSON.parse(d.value) : d.value
        });
      });

    }
    if (data.source.secondarySource && data.source.secondarySource.length > 0 && compact(data.source.secondarySource).length > 0) {
      data.source.secondarySource = uniq(data.source.secondarySource);
      data.source.secondarySource.forEach((d) => {
        this.secondarySource.push({
          source: d.source,
          sourceDisplayName: d.sourceDisplayName ? d.sourceDisplayName : '',
          sourceUrl: d.sourceUrl,
          value: this.isJson(d.value) ? JSON.parse(d.value) : d.value
        });

      });
    }

    if (this.overrideValue) {
      if (findIndex(this.primarySource, (d) => { return d.source == this.overrideValue }) >= 0) {
        this.accordian.primaryOpen = !this.accordian.primaryOpen;
        this.activePanelId = "primary-panel";
      } else if (findIndex(this.secondarySource, (d) => { return d.source == this.overrideValue }) >= 0) {
        this.accordian.secondaryOpen = !this.accordian.secondaryOpen;
        this.activePanelId = "secondary-panel";
      }
    }

    if (data.name) {
      this.header = data.name;
    }
    else if (data.secondary) {
      this.header = 'Secondary Links';
    } else {
      this.header = 'Primary Links';
    }
    this.showSavebtnwithclass = false;
    this.overridesourceUrl = '';
    this.source_DisplayName = '';

    var params: any = {
      "pageNumber": 1,
      "orderIn": 'desc',
      "orderBy": 'uploadedOn',
      "recordsPerPage": 9,
      "entityId": this.queryParams.query
    };
    let allres = this.entityOrgchartService.getllSourceDocuments(params).subscribe((response: any) => {
      this.entityOrgchartService.getSuccessReportDocuments(response.paginationInformation.totalResults, 'docs', this.queryParams.query).then(
        (success: any) => {
          if (success && success.documentListsData.length > 0) {
            // $scope.sourceList  = $scope.sourceList.concat(response[0].documentListsData);
            this.documentListsData = success.documentListsData;
            success.documentListsData.forEach((val) => {
              var sourceArray = this.sourceList_forModal.filter((searchedval) => searchedval.sourceName === val.sourceName);
              var sourceObject = sourceArray.filter((searchVal) => searchVal.type === val.type);
              if (sourceObject.length == 0) {
                this.sourceList_forModal.push(val);
              }
            });
          }
        }
      ).catch(
        (err) => {

        }
      )
      var evidences = this.entityOrgchartService.getEvidenceListDocs(params).subscribe((data: any) => {
        this.entityOrgchartService.getSuccessReportDocuments(data.paginationInformation.totalResults, 'evidence_docs', this.queryParams.query).then((success: any) => {
          if (success && success.evidenceDocumentsListsData.length > 0) {
            // $scope.sourceList  = $scope.sourceList.concat(response[1].evidenceDocumentsListsData);
            this.evidenceDocumentsListsData = success.evidenceDocumentsListsData;
            success.evidenceDocumentsListsData.forEach((val) => {
              var sourceArray = this.sourceList_forModal.filter((searchedval) => searchedval.sourceName === val.sourceName);
              var sourceObject = sourceArray.filter((searchVal) => searchVal.type === val.type);
              if (sourceObject.length === 0) {
                this.sourceList_forModal = this.sourceList_forModal.push(val);
              }
            });

          }
        });

      }, (error: any) => {

      })


    }, (err: any) => {

    });


  }
  close(){
    this.modal.close();
  }
  sourceTracker(obj:any){
    return obj.sourceTracker
  }
  sourcePanelChange(event:any){
   if(event.panelId == "primary-panel"){
         this.accordian.primaryOpen =  ! this.accordian.primaryOpen;
   }
   else{
        this.accordian.secondaryOpen =  ! this.accordian.secondaryOpen;
   }
  }

}
