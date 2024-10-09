import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { EntityConstants } from '../../constants/entity-company-constant';
import { EntityOrgchartService } from '../../services/entity-orgchart.service';
import { EntityCommonTabService } from '../../services/entity-common-tab.service';
import { find, findIndex, uniqBy, isEmpty } from 'lodash-es';
declare const $: any;
@Component({
	selector: 'enity-edit',
	templateUrl: './enity-edit.component.html',
	styleUrls: ['./enity-edit.component.scss']
})
export class EnityEditComponent implements OnInit {
	public editshowDirectIndirectPercentagePerson: boolean = true;
	public editModelClassification: any = {
		editPersonListData: [{ id: 1, label: "General Partner" }, { id: 2, label: "Director" }, { id: 3, label: "Main Prinicipals" }, { id: 4, label: "Principals" }, { id: 5, label: "Pesudo UBO" }, { id: 6, label: "UBO" }],
		editRoleData: [{ id: 1, label: "Chief Executive Officer" }, { id: 2, label: "Chief Financial Officer" }, { id: 3, label: "Chief Operating Officer" }, { id: 4, label: "Chief Risk Officer" }, { id: 5, label: "Chief Compliance Officer" }, { id: 6, label: "Director" }, { id: 7, label: "Executive Board" }, { id: 8, label: "Management Board" }, { id: 10, label: "Vice President" }, { id: 11, label: "President" }, { id: 12, label: "Branch Manager" }, { id: 13, label: "Chairman" }],
		editCompanyListData: [{ id: 1, label: "General Partner" }, { id: 2, label: "Director" }, { id: 3, label: "Intermediate Parent" }, { id: 4, label: "Ultimate Legal Parent" }],
		editCompanyModel:[],		editPersonModel:[]
	};

	public example5customTexts = { buttonDefaultText: 'Classification' };
	public editCustomSelected: any = {};
	//   public sourceList :any =[];
	public showfiteredSourceList: boolean = false;
	public personSettings = {
		singleSelection: false,
		idField: 'id',
		textField: 'label',
		selectAllText: 'Select All',
		unSelectAllText: 'UnSelect All',
	}
	public editUBOValue: boolean = false;
	public fiteredSourceList = [];
	@Input() public entityDataOnClikOfOdg;
	@Input() public popOverEditDataForOwnership;
	@Input() public subsidiaries;
	@Input() public sourceList;
	@Input() public entitySearchResult;
	@Input() public EditEntityTypeList;
	@Input() public entityDetails;
	@Input() public queryParams;
	@Input() public subsidariesfilteredData;
	@Input() public subsidaryFilterData;
	public countryNames = [];
	@ViewChild('companynameRef', { static: false }) companynameRef: ElementRef;
	constructor(public activeModal: NgbActiveModal,
		public entityOrgchartService: EntityOrgchartService,
		public entityCommonTabService: EntityCommonTabService) {
	}

	ngOnInit() {
		this.countryNames = EntityConstants.countriesData;
		if (this.entityDataOnClikOfOdg && this.entityDataOnClikOfOdg.jurisdiction) {
			var countryEdit = find(this.countryNames, {
				'jurisdictionName': this.entityDataOnClikOfOdg.jurisdiction.toLowerCase()
			});
			if (countryEdit) {
				countryEdit.country = countryEdit.jurisdictionOriginalName;
				this.editCustomSelected = countryEdit;
			} else {
				this.editCustomSelected.jurisdictionOriginalName = 'Select Country';
			}
		}
		if (this.entityDataOnClikOfOdg && !this.entityDataOnClikOfOdg.numberOfShares) {
			var ReportcompanyIndex = findIndex(this.subsidiaries[0].subsidiaries, {
				'identifier': this.popOverEditDataForOwnership.identifier
			});
			if (ReportcompanyIndex !== -1) {
				this.popOverEditDataForOwnership.numberOfShares = this.subsidiaries[0].subsidiaries[ReportcompanyIndex].numberOfShares;
			}
		}
		if (this.popOverEditDataForOwnership && this.popOverEditDataForOwnership.officer_role) {
			var officerRoleSelected = findIndex(this.editModelClassification.editRoleData, {
				'label': this.popOverEditDataForOwnership.officer_role
			});
			this.editModelClassification.editRoleModel = officerRoleSelected !== -1 ? this.editModelClassification.editRoleData[officerRoleSelected].label : '';
		}
		this.popOverEditDataForOwnership.source_evidence1 = this.entityDataOnClikOfOdg.source_evidence ? this.entityDataOnClikOfOdg.source_evidence : this.entityDataOnClikOfOdg.information_provider ? this.entityDataOnClikOfOdg.information_provider : '';
		if (this.popOverEditDataForOwnership.source_evidence1 && !this.popOverEditDataForOwnership.sourceUrl) {
			const value = find(this.sourceList, {
				'sourceName': this.popOverEditDataForOwnership.source_evidence1
			});
			if (value) {
				this.fillSourceSearchedInput(value, 'edit');
			}
		}
		if (this.entityDataOnClikOfOdg.SelectedEntityType) {
			this.entitySearchResult.list.recognized_entity.entityType = this.entityDataOnClikOfOdg.SelectedEntityType;
		}
		var classification =[];
		if(this.popOverEditDataForOwnership.classification && this.popOverEditDataForOwnership.classification.length  > 0){
			if (this.popOverEditDataForOwnership.Ubo_ibo !== 'officers') {
				this.popOverEditDataForOwnership.classification.forEach(element => {
					var findClassification =  find(this.editModelClassification.editCompanyListData, {
						'label': element
					});

				if(findClassification){
					classification.push(findClassification);
				}
				});
				this.editModelClassification.editCompanyModel  = classification;
			} else {
				this.popOverEditDataForOwnership.classification.forEach(element => {
					var findClassification =  find(this.editModelClassification.editPersonListData, {
						'label': element
					});

				if(findClassification){
					classification.push(findClassification);
				}
				});
			}
			this.editModelClassification.editPersonModel = classification;
		}

	}
	fillSourceSearchedInput = function (value, type) {
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
			// this.entitySearchResult.list["searchedSourceInputDate" + type] = $filter('date')(new Date(), 'yyyy-MM-dd');

		}
		//   $scope.showfiteredSourceList = !$scope.showfiteredSourceList;
	}
	entitySelected = function (entity) {
		this.entitySearchResult.list.recognized_entity = entity;
		this.popOverEditDataForOwnership.SelectedEntityType = entity;
	}
	toggleSourcedropDown() {
		this.fiteredSourceList = [];
		var filterSource = this.sourceList.filter((d) => {
			return (d.sourceName.indexOf(this.popOverEditDataForOwnership.source_evidence) > -1);
		});
		this.fiteredSourceList = filterSource;
		if (filterSource && filterSource.length > 0) {
			this.showfiteredSourceList = true;
		} else {
			this.showfiteredSourceList = false;
		}
	}
	getNewSources = function () {
		this.entityOrgchartService.apiCallGetSources(this.queryParams, this.entityDetails).then((response) => {
			this.sourceList = response;
		});
	}
	/*
* @purpose: shows the country list drop down
* @created: 20 MArch 2019
* @author: Ram
*/
	selectedCountry = (x: { jurisdictionOriginalName: string }) => {
		this.editCustomSelected = x;
		return x.jurisdictionOriginalName
	};

	searchCountry = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			map(term => term === '' ? []
				: this.countryNames.filter(v => v.jurisdictionOriginalName.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
		)

	saveTheValueOfOwnership = function (status, UBOstatus) {
		var sourceChanged = true;

		if (this.popOverEditDataForOwnership.name && status && this.popOverEditDataForOwnership.source_evidence) {

			this.subsidariesfilteredData = uniqBy(this.subsidariesfilteredData, 'identifier');
			// var currentOPts = jQuery.extend(true, {}, options);
			// currentOPts.items = jQuery.extend(true, [], this.subsidariesfilteredData);
			var index = this.subsidariesfilteredData.map(function (d) {
				return d['identifier'];
			}).indexOf(this.popOverEditDataForOwnership.identifier);
			var subsidary_level = this.popOverEditDataForOwnership.level;
			this.popOverEditDataForOwnership.totalPercentage = this.editshowDirectIndirectPercentagePerson ? this.popOverEditDataForOwnership.totalPercentage : 100;
			this.popOverEditDataForOwnership.title = this.popOverEditDataForOwnership.name;
			this.popOverEditDataForOwnership.source_evidence = this.popOverEditDataForOwnership.source_evidence ? this.popOverEditDataForOwnership.source_evidence : this.popOverEditDataForOwnership.source_evidence1;
			this.popOverEditDataForOwnership.country = this.editCustomSelected && this.editCustomSelected.jurisdictionOriginalName ? this.editCustomSelected.jurisdictionOriginalName : "";
			this.popOverEditDataForOwnership.jurisdiction = this.editCustomSelected && this.editCustomSelected.jurisdictionName ? this.editCustomSelected.jurisdictionName : '';
			this.popOverEditDataForOwnership.juridiction = this.editCustomSelected && this.editCustomSelected.jurisdictionName ? this.editCustomSelected.jurisdictionName : '';
			this.popOverEditDataForOwnership.classification = [];
			this.popOverEditDataForOwnership.officer_role = this.editModelClassification && this.editModelClassification.editRoleModel ? this.editModelClassification.editRoleModel : '';
			this.popOverEditDataForOwnership.date_of_birth = (this.popOverEditDataForOwnership.date_of_birth || this.popOverEditDataForOwnership.dateOfBirth || this.popOverEditDataForOwnership['vcard:bday']) ? (this.popOverEditDataForOwnership.date_of_birth || this.popOverEditDataForOwnership.dateOfBirth || this.popOverEditDataForOwnership['vcard:bday']) : '';
			if (this.popOverEditDataForOwnership.entity_type === "organization") {
				this.popOverEditDataForOwnership.classification = this.editModelClassification.editCompanyModel && this.editModelClassification.editCompanyModel.length > 0 ? this.editModelClassification.editCompanyModel.map(function (val) { return val.label }) : [];
			} else if (this.popOverEditDataForOwnership.entity_type === "person") {
				this.popOverEditDataForOwnership.classification = this.editModelClassification.editPersonModel && this.editModelClassification.editPersonModel.length > 0 ? this.editModelClassification.editPersonModel.map(function (val) { return val.label }) : [];
			}
			var isGP = this.popOverEditDataForOwnership.classification.some((val) => val === "General Partner");
			var isDirector = this.popOverEditDataForOwnership.classification.some((val) => val === "Director");
			this.popOverEditDataForOwnership.totalPercentage = (isGP || isDirector) ? 100 : this.popOverEditDataForOwnership.totalPercentage;
			this.popOverEditDataForOwnership.Ubo_ibo = (!this.popOverEditDataForOwnership.Ubo_ibo || this.popOverEditDataForOwnership.Ubo_ibo === "UBO ") ? (UBOstatus === true ? 'UBO ' : '') : this.popOverEditDataForOwnership.Ubo_ibo;
			this.popOverEditDataForOwnership.SelectedEntityType = (!isEmpty(this.entitySearchResult.list.recognized_entity) && this.entitySearchResult.list.recognized_entity.entityType) ? this.entitySearchResult.list.recognized_entity.entityType : '';
			this.popOverEditDataForOwnership.basic = {};
			if (this.popOverEditDataForOwnership && this.popOverEditDataForOwnership.id && index !== -1) {
				this.subsidaryFilterData[index].country = this.popOverEditDataForOwnership.country ? this.popOverEditDataForOwnership.country : '';//here we are assigining respective chart entity the Edited object (-_-)
				this.subsidaryFilterData[index].jurisdiction = this.popOverEditDataForOwnership.country ? (this.popOverEditDataForOwnership.jurisdiction ? this.popOverEditDataForOwnership.jurisdiction : '') : '';//here we are assigining respective chart entity the Edited object (-_-)
				this.subsidaryFilterData[index].juridiction = this.popOverEditDataForOwnership.country ? (this.popOverEditDataForOwnership.jurisdiction ? this.popOverEditDataForOwnership.jurisdiction : '') : '';//here we are assigining respective chart entity the Edited object (-_-)
				this.subsidaryFilterData[index].numberOfShares = this.popOverEditDataForOwnership.numberOfShares ? this.popOverEditDataForOwnership.numberOfShares : '';//here we are assigining respective chart entity the Edited object (-_-)
				this.subsidaryFilterData[index].SelectedEntityType = this.popOverEditDataForOwnership.SelectedEntityType ? this.popOverEditDataForOwnership.SelectedEntityType : '';//here we are assigining respective chart entity the Edited object (-_-)
				this.subsidaryFilterData[index].indirectPercentage = this.popOverEditDataForOwnership.indirectPercentage ? this.popOverEditDataForOwnership.indirectPercentage : '';//here we are assigining respective chart entity the Edited object (-_-)
				this.subsidaryFilterData[index].totalPercentage = this.popOverEditDataForOwnership.totalPercentage ? this.popOverEditDataForOwnership.totalPercentage : '';//here we are assigining respective chart entity the Edited object (-_-)
				this.subsidaryFilterData[index].hasURL = this.popOverEditDataForOwnership.hasURL ? this.popOverEditDataForOwnership.hasURL : '';//here we are assigining respective chart entity the Edited object (-_-)
				this.subsidaryFilterData[index].source_evidence = this.popOverEditDataForOwnership.source_evidence ? this.popOverEditDataForOwnership.source_evidence : '';//here we are assigining respective chart entity the Edited object (-_-)
				this.subsidaryFilterData[index].sourceUrl = this.popOverEditDataForOwnership.sourceUrl ? this.popOverEditDataForOwnership.sourceUrl : '';//here we are assigining respective chart entity the Edited object (-_-)
				this.subsidaryFilterData[index].from = this.popOverEditDataForOwnership.from ? this.popOverEditDataForOwnership.from : '';//here we are assigining respective chart entity the Edited object (-_-)
				this.subsidaryFilterData[index].Ubo_ibo = this.editUBOValue ? "UBO " : this.popOverEditDataForOwnership.Ubo_ibo ? this.popOverEditDataForOwnership.Ubo_ibo : '';//here we are assigining respective chart entity the Edited object (-_-) uncomm
				this.subsidaryFilterData[index].isUbo = this.subsidaryFilterData[index].Ubo_ibo === "UBO " ? true : '';
				this.subsidaryFilterData[index].classification = this.popOverEditDataForOwnership.classification ? this.popOverEditDataForOwnership.classification : [];
				this.subsidaryFilterData[index].title = this.popOverEditDataForOwnership.name;
				this.subsidaryFilterData[index].name = this.popOverEditDataForOwnership.name;
				// $scope.showSubsidariesInchart($scope.showSubsidaries, subsidary_level); already handle in subscribe
			}
			// EntityorgChartService.editChartEntity(this.popOverEditDataForOwnership);//uncommment
			if (this.popOverEditDataForOwnership && this.popOverEditDataForOwnership.identifier) {//uncommnet
				// addShareholderinGetCorporate(this.popOverEditDataForOwnership, {}, 'edit'); //uncommnet
				this.entityOrgchartService.addShareholderinGetCorporate(this.popOverEditDataForOwnership,
					{}, 'edit', '', '', this.queryParams,
					this.subsidaryFilterData, this.screeningData, this.actualScreeningData);
			}//uncommnet
			var mainscreeningIndex = findIndex(this.actualScreeningData, {
				'@identifier': this.popOverEditDataForOwnership.identifier
			});
			var shownScreeninIndex = findIndex(this.screeningData, {
				'@identifier': this.popOverEditDataForOwnership.identifier
			});
			var ReportcompanyIndex = findIndex(this.subsidiaries[0].subsidiaries, {
				'identifier': this.popOverEditDataForOwnership.identifier
			});
			var findEntityScreened = findIndex(EntityConstants.customEntites.screeningaddition, {//check for parent index in the screening Results
				"@identifier": this.popOverEditDataForOwnership.identifier
			});
			if (findEntityScreened !== -1) {
				this.popOverEditDataForOwnership['isChecked'] = EntityConstants.customEntites.screeningaddition[findEntityScreened]['isChecked'];
				this.popOverEditDataForOwnership['no-screening'] = EntityConstants.customEntites.screeningaddition[findEntityScreened]['no-screening'];
			} else {
				this.popOverEditDataForOwnership['isChecked'] = false;
				this.popOverEditDataForOwnership['no-screening'] = true;
			}
			if (shownScreeninIndex !== -1) {
				this.screeningData[shownScreeninIndex].name = this.popOverEditDataForOwnership.name;
				this.screeningData[shownScreeninIndex].country = this.popOverEditDataForOwnership.country ? this.popOverEditDataForOwnership.country : this.screeningData[shownScreeninIndex].country ? this.screeningData[shownScreeninIndex].country : '';
				this.screeningData[shownScreeninIndex].jurisdiction = this.popOverEditDataForOwnership.country ? (this.popOverEditDataForOwnership.jurisdiction ? this.popOverEditDataForOwnership.jurisdiction : '') : '';
				this.screeningData[shownScreeninIndex].numberOfShares = this.popOverEditDataForOwnership.numberOfShares ? this.popOverEditDataForOwnership.numberOfShares : '';
				this.screeningData[shownScreeninIndex].SelectedEntityType = this.popOverEditDataForOwnership.SelectedEntityType ? this.popOverEditDataForOwnership.SelectedEntityType : '';
				this.screeningData[shownScreeninIndex].indirectPercentage = this.popOverEditDataForOwnership.indirectPercentage ? this.popOverEditDataForOwnership.indirectPercentage : '';
				this.screeningData[shownScreeninIndex].totalPercentage = this.popOverEditDataForOwnership.totalPercentage ? this.popOverEditDataForOwnership.totalPercentage : '';
				this.screeningData[shownScreeninIndex].hasURL = this.popOverEditDataForOwnership.hasURL ? this.popOverEditDataForOwnership.hasURL : '';
				sourceChanged = (this.screeningData[shownScreeninIndex].source_evidence) ? ((this.popOverEditDataForOwnership.source_evidence && this.screeningData[shownScreeninIndex].source_evidence && this.popOverEditDataForOwnership.source_evidence !== this.screeningData[shownScreeninIndex].source_evidence) ? true : false) : true;
				this.screeningData[shownScreeninIndex].source_evidence = this.popOverEditDataForOwnership.source_evidence ? this.popOverEditDataForOwnership.source_evidence : '';
				this.screeningData[shownScreeninIndex].sourceUrl = this.popOverEditDataForOwnership.sourceUrl ? this.popOverEditDataForOwnership.sourceUrl : '';
				this.screeningData[shownScreeninIndex].from = this.popOverEditDataForOwnership.from ? this.popOverEditDataForOwnership.from : '';
				this.screeningData[shownScreeninIndex].Ubo_ibo = this.popOverEditDataForOwnership.Ubo_ibo ? this.popOverEditDataForOwnership.Ubo_ibo : '';
				this.screeningData[shownScreeninIndex].date_of_birth = this.popOverEditDataForOwnership.date_of_birth ? this.popOverEditDataForOwnership.date_of_birth : '';
				this.screeningData[shownScreeninIndex].classification = this.popOverEditDataForOwnership.classification ? this.popOverEditDataForOwnership.classification : [];
				this.screeningData[shownScreeninIndex].officer_roles = this.editModelClassification && this.editModelClassification.editRoleModel ? [this.editModelClassification.editRoleModel] : this.screeningData[shownScreeninIndex].officer_roles ? this.screeningData[shownScreeninIndex].officer_roles : [];
				this.screeningData[shownScreeninIndex].officer_role = this.editModelClassification && this.editModelClassification.editRoleModel ? this.editModelClassification.editRoleModel : this.screeningData[shownScreeninIndex].officer_role ? this.screeningData[shownScreeninIndex].officer_role : '';
				this.screeningData[shownScreeninIndex].report_jurisdiction_risk = this.screeningData[shownScreeninIndex].country ? this.entityCommonTabService.calculateCountryRisk(this.screeningData[shownScreeninIndex].country_of_residence || this.screeningData[shownScreeninIndex].country) : this.screeningData[shownScreeninIndex].jurisdiction ? this.entityCommonTabService.calculateCountryRisk(this.entityCommonTabService.getCountryName(this.screeningData[shownScreeninIndex].jurisdiction)) : '';
				if (this.popOverEditDataForOwnership.source_evidence && this.popOverEditDataForOwnership.entity_type === "person") {
					if (this.screeningData[shownScreeninIndex].sources.length > 0) {
						var sourceIndex = this.screeningData[shownScreeninIndex].sources.indexOf(this.popOverEditDataForOwnership.source_evidence);
						if (sourceIndex === -1) {
							this.screeningData[shownScreeninIndex].sources.push(this.popOverEditDataForOwnership.source_evidence);
							const findofficerAlreadyExist = findIndex(EntityConstants.basicsharedObject.totalOfficers_link, {
								name: this.popOverEditDataForOwnership.name,
								source: this.popOverEditDataForOwnership.source_evidence
							});
							if (findofficerAlreadyExist !== -1) {
								EntityConstants.basicsharedObject.totalOfficers_link[findofficerAlreadyExist]["officer_role"] = this.editModelClassification.editRoleModel ? this.editModelClassification.editRoleModel : '';
								EntityConstants.basicsharedObject.totalOfficers_link[findofficerAlreadyExist]["country"] = this.popOverEditDataForOwnership.country ? this.popOverEditDataForOwnership.country : '';
								EntityConstants.basicsharedObject.totalOfficers_link[findofficerAlreadyExist]["date_of_birth"] = this.popOverEditDataForOwnership.date_of_birth;
								EntityConstants.basicsharedObject.totalOfficers_link[findofficerAlreadyExist]["source"] = this.popOverEditDataForOwnership.source_evidence ? this.popOverEditDataForOwnership.source_evidence : '';
								EntityConstants.basicsharedObject.totalOfficers_link[findofficerAlreadyExist]["sourceUrl"] = this.popOverEditDataForOwnership.sourceUrl ? this.popOverEditDataForOwnership.sourceUrl : '';
								EntityConstants.basicsharedObject.totalOfficers_link[findofficerAlreadyExist]["name"] = this.popOverEditDataForOwnership.name ? this.popOverEditDataForOwnership.name : '';
								EntityConstants.basicsharedObject.totalOfficers_link[findofficerAlreadyExist]["from"] = this.popOverEditDataForOwnership.country.from ? this.popOverEditDataForOwnership.from : '';
								EntityConstants.basicsharedObject.totalOfficers_link[findofficerAlreadyExist]["customSource"] = this.popOverEditDataForOwnership.source_evidence ? this.popOverEditDataForOwnership.source_evidence : '';
								EntityConstants.basicsharedObject.totalOfficers_link[findofficerAlreadyExist]["source_url"] = this.popOverEditDataForOwnership.sourceUrl ? this.popOverEditDataForOwnership.sourceUrl : '';
							} else {
								EntityConstants.basicsharedObject.totalOfficers_link.push({
									"officer_role": this.editModelClassification.editRoleModel ? this.editModelClassification.editRoleModel : '',
									"country": this.popOverEditDataForOwnership.country ? this.popOverEditDataForOwnership.country : '',
									"date_of_birth": this.popOverEditDataForOwnership.date_of_birth,
									"source": this.popOverEditDataForOwnership.source_evidence ? this.popOverEditDataForOwnership.source_evidence : '',
									"sourceUrl": this.popOverEditDataForOwnership.sourceUrl ? this.popOverEditDataForOwnership.sourceUrl : '',
									"name": this.popOverEditDataForOwnership.name ? this.popOverEditDataForOwnership.name : '',
									"from": this.popOverEditDataForOwnership.country.from ? this.popOverEditDataForOwnership.from : '',
									"customSource": this.popOverEditDataForOwnership.source_evidence ? this.popOverEditDataForOwnership.source_evidence : '',
									"source_url": this.popOverEditDataForOwnership.sourceUrl ? this.popOverEditDataForOwnership.sourceUrl : '',
								})
							}
						}
					} else {
						var source = [this.popOverEditDataForOwnership.source_evidence];
						this.screeningData[shownScreeninIndex].sources = $.extend(true, [], source)
					}
					this.screeningData[shownScreeninIndex].information_provider = this.popOverEditDataForOwnership.source_evidence;
				}
				// this.screeningData[shownScreeninIndex] =this.popOverEditDataForOwnership;
			}
			if (mainscreeningIndex !== -1) {
				this.actualScreeningData[mainscreeningIndex].name = this.popOverEditDataForOwnership.name;
				this.actualScreeningData[mainscreeningIndex].country = this.popOverEditDataForOwnership.country ? this.popOverEditDataForOwnership.country : '';
				this.actualScreeningData[mainscreeningIndex].jurisdiction = this.popOverEditDataForOwnership.country ? (this.popOverEditDataForOwnership.jurisdiction ? this.popOverEditDataForOwnership.jurisdiction : '') : '';
				this.actualScreeningData[mainscreeningIndex].numberOfShares = this.popOverEditDataForOwnership.numberOfShares ? this.popOverEditDataForOwnership.numberOfShares : '';
				this.actualScreeningData[mainscreeningIndex].SelectedEntityType = this.popOverEditDataForOwnership.SelectedEntityType ? this.popOverEditDataForOwnership.SelectedEntityType : '';
				this.actualScreeningData[mainscreeningIndex].indirectPercentage = this.popOverEditDataForOwnership.indirectPercentage ? this.popOverEditDataForOwnership.indirectPercentage : '';
				this.actualScreeningData[mainscreeningIndex].totalPercentage = this.popOverEditDataForOwnership.totalPercentage ? this.popOverEditDataForOwnership.totalPercentage : '';
				this.actualScreeningData[mainscreeningIndex].hasURL = this.popOverEditDataForOwnership.hasURL ? this.popOverEditDataForOwnership.hasURL : '';
				this.actualScreeningData[mainscreeningIndex].source_evidence = this.popOverEditDataForOwnership.source_evidence ? this.popOverEditDataForOwnership.source_evidence : '';
				this.actualScreeningData[mainscreeningIndex].sourceUrl = this.popOverEditDataForOwnership.sourceUrl ? this.popOverEditDataForOwnership.sourceUrl : '';
				this.actualScreeningData[mainscreeningIndex].from = this.popOverEditDataForOwnership.from ? this.popOverEditDataForOwnership.from : '';
				this.actualScreeningData[mainscreeningIndex].Ubo_ibo = this.popOverEditDataForOwnership.Ubo_ibo ? this.popOverEditDataForOwnership.Ubo_ibo : '';
				this.actualScreeningData[mainscreeningIndex].date_of_birth = this.popOverEditDataForOwnership.date_of_birth ? this.popOverEditDataForOwnership.date_of_birth : '';
				this.actualScreeningData[mainscreeningIndex].officer_roles = this.editModelClassification && this.editModelClassification.editRoleModel ? [this.editModelClassification.editRoleModel] : this.actualScreeningData[mainscreeningIndex].officer_roles ? this.actualScreeningData[mainscreeningIndex].officer_roles : [];
				this.actualScreeningData[mainscreeningIndex].officer_role = this.editModelClassification && this.editModelClassification.editRoleModel ? this.editModelClassification.editRoleModel : this.actualScreeningData[mainscreeningIndex].officer_role ? this.actualScreeningData[mainscreeningIndex].officer_role : '';
				this.actualScreeningData[mainscreeningIndex].classification = this.popOverEditDataForOwnership.classification ? this.popOverEditDataForOwnership.classification : [];
				this.popOverEditDataForOwnership.numberOfShares = this.subsidiaries[0].subsidiaries[ReportcompanyIndex] && this.subsidiaries[0].subsidiaries[ReportcompanyIndex].numberOfShares ? this.subsidiaries[0].subsidiaries[ReportcompanyIndex].numberOfShares : '';
				this.actualScreeningData[mainscreeningIndex].report_jurisdiction_risk = this.actualScreeningData[mainscreeningIndex].country ? this.entityCommonTabService.calculateCountryRisk(this.actualScreeningData[mainscreeningIndex].country_of_residence || this.actualScreeningData[mainscreeningIndex].country) : this.actualScreeningData[mainscreeningIndex].jurisdiction ? this.entityCommonTabService.calculateCountryRisk(this.entityCommonTabService.getCountryName(this.actualScreeningData[mainscreeningIndex].jurisdiction)) : '';
				if (this.popOverEditDataForOwnership.source_evidence && this.popOverEditDataForOwnership.entity_type === "person") {
					if (this.actualScreeningData[mainscreeningIndex].sources.length > 0) {
						var sourceIndex = this.actualScreeningData[mainscreeningIndex].sources.indexOf(this.popOverEditDataForOwnership.source_evidence);
						if (sourceIndex === -1) {
							this.actualScreeningData[mainscreeningIndex].sources.push(this.popOverEditDataForOwnership.source_evidence);
						}
					} else {
						var sources = [this.popOverEditDataForOwnership.source_evidence];
						this.actualScreeningData[mainscreeningIndex].sources = $.extend(true, [], sources);
					}
					this.actualScreeningData[mainscreeningIndex].information_provider = this.popOverEditDataForOwnership.source_evidence;
				}
			}
			// var ownIndex = $scope.createNewArrayReportData.findIndex(function (d) { return d.name.toLowerCase() == this.popOverEditDataForOwnership.name.toLowerCase() })
			// if (ownIndex >= 0) {
			// 	$scope.createNewArrayReportData[ownIndex].recognizedEntityType = this.popOverEditDataForOwnership.recognizedEntityType;
			// }
			this.editModelClassification.editRoleModel = '';//empty The Role Value after submit
			if (this.popOverEditDataForOwnership.entity_type === "person") {
				let object = {
					"entityId": this.entitySearchResult.list.topHeaderObject.identifier,
					"name": this.popOverEditDataForOwnership.name,
					"source": this.popOverEditDataForOwnership.source_evidence
				};
				// updateSourceRole(object);
			}
			var newFormatedData = {
				actualScreeningData: this.actualScreeningData,
				screeningData: this.screeningData,
				subsidaryFilterData: this.subsidaryFilterData
			}
			this.entityOrgchartService.modified_screeningSubject.next(newFormatedData);
			this.activeModal.close();
		}
		// this.popOverEditDataForOwnership.classification =[];
	}
	//purpose called on selecting the general or director from classification
	onclassificationItemSelect(event, slected) {
		setTimeout(() => {
			if (this.popOverEditDataForOwnership.Ubo_ibo !== 'officers') {
				this.editshowDirectIndirectPercentagePerson = !this.editModelClassification.editCompanyModel.some((val) => {
					if (val.label == 'General Partner' || val.label == 'Director') {
						return true
					}
				})
			} else {
				this.editshowDirectIndirectPercentagePerson = !this.editModelClassification.editPersonModel.some((val) => {
					if (val.label == 'General Partner' || val.label == 'Director') {
						return true
					}
				})
			}


		}, 500);
	}
  public trackByEntityType(_, item): string {
    return item.entityType;
  }
  public trackByLabel(_, item): string {
    return item.label;
  }
  public trackBySourceName(_, item): string {
    return item.sourceName;
  }
}
