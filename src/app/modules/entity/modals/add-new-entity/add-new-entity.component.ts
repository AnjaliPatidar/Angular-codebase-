import { Component, OnInit, Input,ViewChild, AfterViewInit } from '@angular/core';
import { EntityConstants } from '../../constants/entity-company-constant';
import {EntityOrgchartService} from '../../services/entity-orgchart.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {EntityApiService} from '../../services/entity-api.service'
import {Observable} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {NgForm} from '@angular/forms';
import { findIndex } from 'lodash-es';
@Component({
	selector: 'app-add-new-entity',
	templateUrl: './add-new-entity.component.html',
	styleUrls: ['./add-new-entity.component.scss']
})
export class AddNewEntityComponent implements OnInit ,AfterViewInit{

	ngAfterViewInit(): void {
		setTimeout(() => {
			this.entitytabSet.select(this.entitySearchResult.list.addEntitymodalChart);
		}, 0);
		// $('#'+this.entitySearchResult.list.addEntitymodalChart).click();
	}

	public today_date = ((new Date().getFullYear()) + '-' + (("0" + (new Date().getMonth() + 1)).slice(-2)) + '-' + (("0" + (new Date().getDate())).slice(-2)));

	public addOwnershipCompany: any = {
		totalPercentage: 50,
		indirectPercentage: 50,
		entity_id: ""
	};
	public addOwnershipPerson = {
		lastName: '',
		firstName: ''

	};
	public countryJurisdiction = {
		jurisdictionOriginalName: 'Select Country'
	};
	public customSelectedAddPerson :any = {};
	public searchedSourceInputValCompany = '';
	public searchedSourceInputValPerson = '';
	public addsourceInput = {
		searchedSourceInputCompany: '',
		searchedSourceInputPerson: ""
	};
	public searchedSourceInputDateCompany = this.today_date;
	public searchedSourceInputDatePerson = this.today_date;
	public overrideValue = false;
	public addModelClassification = EntityConstants.basicSharedObject.addModelClassification;
	public editModelClassification = EntityConstants.basicSharedObject.editModelClassification;;
	public example5customTexts = { buttonDefaultText: 'Classification' };
	public showDirectIndirectPercentagePerson: boolean = true;
	public showDirectIndirectPercentageCompany: boolean = true;
	public selectedItems = [];
	public personSettings = {
		singleSelection: false,
		idField: 'id',
		textField: 'label',
		selectAllText: 'Select All',
		unSelectAllText: 'UnSelect All',
	};
	public fiteredSourceList :any = [];
	public showAddNew :boolean = false;
	public showfiteredSourceList = false;
	public countryNames = [];
	@ViewChild('personInfoForm',{static:false}) public  personInfoForm :NgForm;
	@ViewChild('entitytabSet',{static:false}) public entitytabSet;
	@Input() entitySearchResult;
	@Input() sourceList;
	@Input() queryParams;
	@Input() entityDetails;
	@Input() popOverEditDataForOwnership;
	@Input() addEntityTypeList;
	@Input() entityDataOnClikOfOdg;
	@Input() deleteSelectedEntity;
	@Input() subsidaryFilterData;
	@Input() screeningData;
	@Input() actualScreeningData;
	@Input() showallFields;//this check it is from officer modal or entity modal (false for officers)
	constructor(
	public entityOrgchartService:EntityOrgchartService,
	public NgbActiveModal :NgbActiveModal,
	public entityApiService :EntityApiService
	) {


	 }

	ngOnInit() {
		this.countryNames = EntityConstants.countriesData;
		this.reintializeEditScreening();
	}


  formatter = (x: {name: string}) => x.name
	disabling(entitytype, whichKeyTodisable) {
		if (whichKeyTodisable === "" && entitytype === '') {
			return true;
		} else if (whichKeyTodisable === "" || entitytype === '') {
			return true;
		} else {
			return false;
		}
	}
	addEntitytabChange(value) {
		if (value.nextId == 'organization') {
			this.addModelClassification.companyListData = [{ id: 1, label: "General Partner" }, { id: 2, label: "Director" }, { id: 3, label: "Intermediate Parent" }, { id: 4, label: "Ultimate Legal Parent" }];
			// this.example9settings = { enableSearch: true };
			// this.example9settings = { enableSearch: true };
			this.entitySearchResult.list.addActiveTab = 1;
		} else {
			this.addModelClassification.personListData = [{ id: 1, label: "General Partner" }, { id: 2, label: "Director" }, { id: 3, label: "Main Prinicipals" }, { id: 4, label: "Principals" }, { id: 5, label: "Pesudo UBO" }, { id: 6, label: "UBO" }];
			this.personSettings = {
				singleSelection: false,
				idField: 'id',
				textField: 'label',
				selectAllText: 'Select All',
				unSelectAllText: 'UnSelect All',
			};
			this.addModelClassification.personRoleData = [{ id: 1, label: "Chief Executive Officer" }, { id: 2, label: "Chief Financial Officer" }, { id: 3, label: "Chief Operating Officer" }, { id: 4, label: "Chief Risk Officer" }, { id: 5, label: "Chief Compliance Officer" }, { id: 6, label: "Director" }, { id: 7, label: "Executive Board" }, { id: 8, label: "Management Board" }, { id: 10, label: "Vice President" }, { id: 11, label: "President" }, { id: 12, label: "Branch Manager" }, { id: 11, label: "Chairman" }];
			this.entitySearchResult.list.addActiveTab = 0;
		}
		this.entitySearchResult.list.addEntitymodalChart = value.nextId;
		this.searchedSourceInputValCompany = '';
		this.searchedSourceInputValPerson = '';
		this.addsourceInput.searchedSourceInputCompany = "";
		this.addsourceInput.searchedSourceInputPerson = "";
		this.entitySearchResult.list.searchedSourceURLPerson = "";
		this.entitySearchResult.list.searchedSourceURLCompany = "";
		this.reintializeEditScreening();
	}
	reintializeEditScreening() {
		this.addOwnershipCompany = {
			FalseNews: [],
			adverseNews_url: [],
			basic: {},
			country: "",
			entity_id: "",
			entity_ref_id: "",
			entity_type: "",
			finance_Crime_url: [],
			hasURL: "",
			id: "",
			identifier: "",
			indirectPercentage: 50,
			name: "",
			jurisdiction: "",
			news: [],
			non_negativenews: [],
			officership: [],
			parentIds: [],
			parents: [],
			pep: [],
			pep_url: [],
			sanction_source: [],
			sanctions: [],
			screeningFlag: '',
			screeningUrl: "",
			// source_evidence: "",
			subsidiaries: [],
			title: "",
			totalPercentage: 50,
			'sanction_bst:description': [],
			'Ubo_ibo': '',
			from: this.today_date,
			isUbo: false,
			date_of_birth: '',
			officer_role: '',
			classification: []
		};
		this.addOwnershipPerson.firstName = '';
		this.addOwnershipPerson.lastName = '';
		this.countryJurisdiction = {
			jurisdictionOriginalName: 'Select Country'
		};
		this.customSelectedAddPerson  = {};
		this.searchedSourceInputValCompany = '';
		this.searchedSourceInputValPerson = '';
		this.addsourceInput.searchedSourceInputCompany = "";
		this.addsourceInput.searchedSourceInputPerson = "";
		this.entitySearchResult.list.searchedSourceURLPerson = "";
		this.entitySearchResult.list.searchedSourceURLCompany = "";
		this.searchedSourceInputDateCompany = this.today_date;
		this.searchedSourceInputDatePerson = this.today_date;
		this.overrideValue = false;
		this.addModelClassification.personRoleModel = [];
		this.editModelClassification.editRoleModel = [];
		this.showDirectIndirectPercentageCompany = true;
		this.showDirectIndirectPercentagePerson = true;
		this.addModelClassification.personModel = [];
		this.addModelClassification.companyModel = [];
	}
	sourceSearchInput(value, type,event) {
		this.fiteredSourceList = [];
		if (value) {
			this.showfiteredSourceList = true;
			this.sourceList.forEach((source)=> {
				if (source.sourceName.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
					this.fiteredSourceList.push(source.sourceName);
				} else {
					this.showAddNew = true;
				}
			});
		} else {
			this.showAddNew = false;
			this["searchedSourceInput" + type] = '';
			this["searchedSourceInputVal" + type] = '';
			this["searchedSourceURL" + type] = '';
			this["searchedSourceInputDate" + type] = '';
		}
		if (event && event.keyCode === 13) {
			if (this.fiteredSourceList && this.fiteredSourceList.length > 0) {
				// this.fillSourceSearchedInput($scope.fiteredSourceList[0], type); uncomment
			} else if (this.fiteredSourceList.length == 0) {
				this.showAddNew = false;
			}
		}
		// 	}
		setTimeout(function () {
			$(".custom-list.auto-complete-list.searchSource").mCustomScrollbar({
				axis: "y",
				theme: "minimal-dark"
			});
		}, 0);
	}
	getNewSources(){
		this.entityOrgchartService.apiCallGetSources(this.queryParams,this.entityDetails).then((response)=>{

			this.sourceList = response;
		});
	}
	fillSourceSearchedInput (value, type) {
		if (type === "edit") {
			this.popOverEditDataForOwnership.source_evidence = value.sourceName ? value.sourceName : '';
			this.popOverEditDataForOwnership.source_evidence1 = value.sourceName ? value.sourceName : '';
			this.popOverEditDataForOwnership.sourceUrl = value.sourceUrl ? value.sourceUrl : '';
			this.showfiteredSourceList = false;
		} else if (value) {
			var sourceIndex = this.sourceList.findIndex(function (d) {
				return d.sourceName == value;
			});
			this.showfiteredSourceList = false;
			this.addsourceInput["searchedSourceInput" + type] = this.sourceList[sourceIndex].sourceName;
			this["searchedSourceInputVal" + type] = this.sourceList[sourceIndex].sourceName;
			this.entitySearchResult.list["searchedSourceURL" + type] = this.sourceList[sourceIndex].sourceUrl;
			var date = (new Date()).getFullYear()+'-'+(new Date()).getMonth()+'-'+(new Date).getDate();
			this.entitySearchResult.list["searchedSourceInputDate" + type] = date;
		}
	}
		/*
* @purpose: shows the country list drop down
* @created: 20 MArch 2019
* @author: Ram
*/
	selectedCountry = (x: {jurisdictionOriginalName: string}) =>{
		return  x.jurisdictionOriginalName
	};

	searchCountry = (text$: Observable<string>) =>{
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.countryNames.filter(v => v.jurisdictionOriginalName.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
	)
}
			/*
* @purpose: Add  new entity into graph
* @created: 20 MArch 2019
* @author: Ram
*/
	addNewCompanyOwnership = function (status: boolean, searchedSourceName: string) {
		if(this.showallFields){ //checking for Entittes and not officer
			if (searchedSourceName) {
			var searchedSourceObj = this.sourceList.find(function (value) {
				return value.sourceName == searchedSourceName;
			})
		}
		var name = this.entitySearchResult.list.addEntitymodalChart === 'person' ? (this.addOwnershipPerson.firstName + '' + (this.addOwnershipPerson.lastName ? (' ' + this.addOwnershipPerson.lastName) : '')) : this.addOwnershipCompany.name;
		var from = this.entitySearchResult.list.addEntitymodalChart === 'person' ? this.searchedSourceInputDatePerson : this.searchedSourceInputDateCompany;
		var source_evidence = this.entitySearchResult.list.addEntitymodalChart === 'person' ? this.addsourceInput.searchedSourceInputPerson : this.addsourceInput.searchedSourceInputCompany;
		var source = this.entitySearchResult.list.addEntitymodalChart === 'person' ? this.entitySearchResult.list.searchedSourceURLPerson : this.entitySearchResult.list.searchedSourceURLCompany;
		if ((this.addOwnershipPerson.firstName || this.addOwnershipCompany.name) && status && name.trim().length > 0 && (this.addsourceInput.searchedSourceInputPerson || this.addsourceInput.searchedSourceInputCompany)) {
			var idRandom = this.makeid();
			this.addOwnershipCompany.entity_type = this.entitySearchResult.list.addEntitymodalChart;
			this.addOwnershipCompany.entity_id = (this.entityDataOnClikOfOdg.entity_id === "orgChartsubEntity") ? "orgChartsubEntity" : "orgChartParentEntity";
			// if (this.selectedMultipleeEntities.length > 0) {

			// } else {
				var addcompanyIndex = -1;
				if (this.deleteSelectedEntity.identifier) {
					addcompanyIndex = findIndex(this.subsidaryFilterData, {
						identifier: this.deleteSelectedEntity.identifier
					});
				} else {
					addcompanyIndex = findIndex(this.subsidaryFilterData, {
						name: this.deleteSelectedEntity.name
					});
				}
				if (this.subsidaryFilterData[addcompanyIndex].parents && this.subsidaryFilterData[addcompanyIndex].parents.length > 0) {
					this.subsidaryFilterData[addcompanyIndex].parents.push(idRandom);
				} else {
					this.subsidaryFilterData[addcompanyIndex].parents = [idRandom];
				}
				this.addOwnershipCompany.child = this.subsidaryFilterData[addcompanyIndex].id;
			// }
			this.addOwnershipCompany.id = idRandom;
			this.addOwnershipCompany.name = name;
			this.addOwnershipCompany.title = this.addOwnershipCompany.name;
			this.addOwnershipCompany.jurisdiction = this.customSelectedAddPerson &&  this.customSelectedAddPerson.jurisdictionName ? this.customSelectedAddPerson.jurisdictionName.toUpperCase() : '';
			this.addOwnershipCompany.juridiction = this.addOwnershipCompany.jurisdiction;
			this.addOwnershipCompany.country =  this.customSelectedAddPerson && this.customSelectedAddPerson.jurisdictionOriginalName ? this.customSelectedAddPerson.jurisdictionOriginalName : '';
			this.addOwnershipCompany.officer_role = this.addModelClassification.personRoleModel && this.addModelClassification.personRoleModel.length > 0  ? this.addModelClassification.personRoleModel: '';
			this.addOwnershipCompany.sourceUrl = source ? source : '';
			this.addOwnershipCompany.source_evidence = source_evidence ? source_evidence : '';
			if (this.entitySearchResult.list.addEntitymodalChart === 'person') {
				this.addOwnershipCompany.Ubo_ibo = this.overrideValue === true ? "UBO " : (this.addOwnershipCompany.Ubo_ibo ? this.addOwnershipCompany.Ubo_ibo : '');
				this.addOwnershipCompany.isUbo = this.overrideValue === true ? true : false;
			}
			if (this.entitySearchResult.list.addEntitymodalChart === 'person') {
				this.addOwnershipCompany.classification = this.addModelClassification.personModel.map(function (val) { return val.label });
			} else {
				this.addOwnershipCompany.classification = this.addModelClassification.companyModel.map(function (val) { return val.label });
			}
			var isGP = this.addOwnershipCompany.classification.some((val) => val === "General Partner");
			var isDirector = this.addOwnershipCompany.classification.some((val) => val === "Director");
			this.addOwnershipCompany.totalPercentage = (isGP || isDirector) ? 100 : this.addOwnershipCompany.totalPercentage;
			// if (this.selectedMultipleeEntities && this.selectedMultipleeEntities.length > 0 || (deleteSelectedEntity && !deleteSelectedEntity.identifier)) {
			// 	addAndSavemultiSelectEntites($scope.addOwnershipCompany, deleteSelectedEntity, searchedSourceObj);
			// }
			// else {
				this.entityOrgchartService.addShareholderinGetCorporate(this.deleteSelectedEntity,this.addOwnershipCompany,
					'add',addcompanyIndex,
					 searchedSourceObj,this.queryParams,
					 this.subsidaryFilterData,this.screeningData,
					 this.actualScreeningData);
			// }
			// window.customerOutreachUpdateData(name, this.addOwnershipCompany.entity_type);uncomment
		} else if (!this.addOwnershipPerson.firstName) {
			this.enterFirstname = true;
		}
		this.NgbActiveModal.close('close');

	}else{
		this.addOfficerScreening();//add officers here
	}

	}

	makeid() {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for (var i = 0; i < 5; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	}
	//purpose called on selecting the general or director from classification
	onclassificationItemSelect(event,slected){
		setTimeout(() => {
				this.showDirectIndirectPercentageCompany = !this.addModelClassification.companyModel.some((val)=>{
					if(val.label == 'General Partner' || val.label == 'Director'){
						return true
					}
				})
				this.showDirectIndirectPercentagePerson  = !this.addModelClassification.personModel.some((val)=>{
					if(val.label == 'General Partner' || val.label == 'Director'){
						return true
					}
				})
		}, 500);
	}
	addOfficerScreening() {
		if (this.addOwnershipCompany.name || this.addOwnershipPerson.firstName) {
			var query = this.entitySearchResult.list.addEntitymodalChart === 'organization' ? this.addOwnershipCompany.name : (this.addOwnershipPerson.firstName + '' + (this.addOwnershipPerson.lastName !== '' ? ' ' + this.addOwnershipPerson.lastName : ''));
			var queryCompany :any= {
				name: query,
				website: this.addOwnershipCompany.hasURL ? this.addOwnershipCompany.hasURL :'',
				// country:$scope.countryJurisdiction.jurisdictionName,
				entityType: this.entitySearchResult.list.addEntitymodalChart,
				dob: this.addOwnershipCompany.date_of_birth ? this.addOwnershipCompany.date_of_birth : ''
			}
			if (this.customSelectedAddPerson && this.customSelectedAddPerson.jurisdictionOriginalName) {
				queryCompany.country =    this.customSelectedAddPerson.jurisdictionOriginalName;
			}
			var entity_identifier = Math.random().toString(36).substring(5);
			var classsification = [];
			if (this.entitySearchResult.list.addEntitymodalChart === 'person') {
				classsification = this.addModelClassification.personModel.map(function (val) { return val.label });
			} else {
				classsification = this.addModelClassification.companyModel.map(function (val) { return val.label });
			}

			var addScreeningObject = {
				"mdaas:RegisteredAddress": '',
				"name": query,
				"sanction_bst:description": [],
				"listId": '',
				"@source-id": '',
				"high_risk_jurisdiction": '',
				"pep_url": [],
				"finance_Crime_url": [],
				"adverseNews_url": [],
				"news": [],
				"FalseNews": [],
				"non_negativenews": [],
				"MainCompany": '',
				"hasURL": this.addOwnershipCompany.hasURL ? this.addOwnershipCompany.hasURL : '',
				"date_of_birth": this.addOwnershipCompany.date_of_birth ? this.addOwnershipCompany.date_of_birth : '',
				"@identifier": entity_identifier,
				"identifier": entity_identifier,
				"officer_role": this.addModelClassification.personRoleModel && this.addModelClassification.personRoleModel.length > 0  ? this.addModelClassification.personRoleModel: '',
				"officer_roles": this.addModelClassification.personRoleModel && this.addModelClassification.personRoleModel.length > 0  ? [this.addModelClassification.personRoleModel]   : [],
				'no-screening': true,
				"jurisdiction": this.customSelectedAddPerson && this.customSelectedAddPerson.jurisdictionName ? this.customSelectedAddPerson.jurisdictionName : '',
				"country": this.customSelectedAddPerson && this.customSelectedAddPerson.jurisdictionOriginalName ? this.customSelectedAddPerson.jurisdictionOriginalName : '',
				'showdeleteIcon': true,
				"showspinner": false,
				"screeningresultsloader": false,
				"isChecked": false,
				"entity_type": this.entitySearchResult.list.addEntitymodalChart,
				"classification": classsification ? classsification : [],
				"Ubo_ibo": 'officers',
				"officerIdentifier": '',
				"highCredibilitySource": ''
			}
			this.screeningData.push(addScreeningObject);
			this.actualScreeningData.push(addScreeningObject);
			// $scope.pageloader.zscreeningLoader = false;
			var requestBodyOfficer = {
				"classification": classsification ? JSON.stringify(classsification) : [],
				"dateOfBirth": this.addOwnershipCompany.date_of_birth ? this.addOwnershipCompany.date_of_birth : '',
				"from": "",
				"mainIdentifier": EntityConstants.queryParams.query,
				"officerCountry": this.customSelectedAddPerson && this.customSelectedAddPerson.jurisdictionOriginalName ? this.customSelectedAddPerson.jurisdictionOriginalName : '',
				"officerName": query,
				"officerRole": this.addModelClassification.personRoleModel && this.addModelClassification.personRoleModel.length > 0  ? this.addModelClassification.personRoleModel: '',
				"source": "",
				"sourceUrl": "",
				"totalPercentage": ""
			}
			this.entityApiService.saveUpdateEntityOfficer(requestBodyOfficer).subscribe(( (response)=> {
				var updatedData = {
					actualScreeningData:this.screeningData,
					screeningData:this.actualScreeningData,
					addScreeningObject:addScreeningObject
				}
				this.NgbActiveModal.close(updatedData);
			}));
		}
	}

}
