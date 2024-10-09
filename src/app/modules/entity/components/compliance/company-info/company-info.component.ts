import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';

import { EntityConstants } from '../../../constants/entity-company-constant';
import { NgbModal, ModalDismissReasons, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';

import { EntityCommonTabService } from '../../../services/entity-common-tab.service';
import { EntityApiService } from '../../../services/entity-api.service';
import { TopPanelConstants } from '@app/modules/entity/constants/top-panel-constants';
import { COMMON_CONST } from '@app/modules/entity/constants/common-constants';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
declare var $: any;

@AutoUnsubscribe()
@Component({
	selector: 'app-company-info',
	templateUrl: './company-info.component.html',
	styleUrls: ['./company-info.component.scss'],
	// changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyInfoComponent implements OnInit {
	customerMap;
	@Input('queryParams') queryParams: any;
	@Input('sourceList') sourceList: any;
	@Input('ceriSearchResultObject') ceriSearchResultObject: any = EntityConstants.complianceObject;
	@ViewChild('stickyNotes', { static: false }) stickyNotes: NgbPopoverConfig;
	public conplianceMapKeys = EntityConstants.utilityConstant.conplianceMapKeys;
	public pageloader = EntityConstants.basicSharedObject.pageloader;
	public entitySearchResult = {
		list: EntityConstants.basicSharedObject.list,
		is_data_not_found: EntityConstants.basicSharedObject.is_data_not_found,
	};
	public sticky_selected_type = '';
	public sticky_selected_section = '';
	public companyInfo = {
		key: 'bst:description',
		value: 'Company Informantion',
		class: '',
		edit: false,
		texts: '',
		title: 'Registerd Company Information Sources'
	}

	public ErrorHandling = {
		flowchart: false,
		companyInformation: false
	}
	public companyDetailsloader: boolean = true;
	public conplianceIdentifiers = EntityConstants.utilityConstant.conplianceIdentifiers;
	public filterIndustry: any;
	public cumulativeRisk: any;
	public overviewRisks: any;
	public riskScoreData: any;
	public scaledNumArr: any = [];
	public industryListsData = [];
	public compkeysNew = {
		texts: "",
	}
	public customerInformationDetails: any = {};
	// = EntityConstants.CustomerInformation;
	showCustomerInfo = false;
	showDescription = false;
	constructor(
		private entityCommonTabService: EntityCommonTabService,
		private entityApiService: EntityApiService,
		private modalService: NgbModal,
		private ref: ChangeDetectorRef,
	) { }

	ngOnInit() {
		this.entityCommonTabService.companyInfoObserver.subscribe((data) => {
			if (data) {
				this.ceriSearchResultObject = data;
				this.pageloader.companyDetailsloader = false;
				this.pageloader.companyInfoReview = true;
				this.pageloader.companyIdentifiersReview = false;
				if (this.ceriSearchResultObject['bst:description']) {
					this.showDescription = false;
				} else {
					this.showDescription = true;
				}
				this.ref.detectChanges()
			}
		})
		this.getIndustryLists();
		this.entityCommonTabService.sourceTargetDetails.subscribe((data: any) => {
			if (Object.keys(data).length > 0) {
				const response = data.customerInfoSimilarCompData;
				if (response !== null && response !== undefined && Object.keys(response).length > 0) {
					this.customerInformationDetails = response;
					this.customerMap = [
						{ name: 'Existing Customer', type: 'clientSince' },
						{ name: 'Products', type: 'products' },
						{ name: 'Potential Further Products', type: 'potentialFurtherProducts' },
						{ name: 'Current premium', type: 'currentPremium' },
						{ name: 'Additional premium potential', type: 'additionalPremiumPotential' },
						{ name: 'Remaining contract term', type: 'remainingContractTerm' },
						{ name: 'Recent changes', type: 'recentChanges' },
						{ name: 'Owner', type: 'clientName' },
						{ name: 'Owner privately insured', type: 'ownerPrivetelyInsured' },
						{ name: 'Claim history', type: 'numberOfClaims' },
						{ name: 'Green Sustainability Score', type: 'Green Sustainability Score' }
					]
				} else {
					this.showCustomerInfo = true;
				}
			}
		})
	}

	ngOnDestroy() {
	}

	ceriSearchResultObjectChange(data) {
		this.ceriSearchResultObject = data;
	}
	companyInfoChange(data) {
		this.companyInfo.texts = data;
	}
	isJson = function (str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}
	ConflicttooltipData(sourceLink, classstype, linktype, schema) {
		var appendcontent = '';
		let newLink = sourceLink
		let allKeys = Object.keys(newLink)
		Object.keys(newLink).forEach((item) => {
			let val: any = newLink[item];
			let index: any = item;
			var currval1 = '';
			var currval2 = '';
			if (schema == 'lei:legalForm') {
				currval1 = this.isJson(val.value1) ? JSON.parse(val.value1).label : val.value1;
				currval2 = this.isJson(val.value2) ? JSON.parse(val.value2).label : val.value2;
			}
			else if (schema == 'bst:stock_info') {
				currval1 = this.isJson(val.value1) ? JSON.parse(val.value1).main_exchange : val.value1;
				currval2 = this.isJson(val.value2) ? JSON.parse(val.value2).main_exchange : val.value2;
			} else if (schema == "Registed Legal Type Sources") {
				currval1 = this.isJson(val.value1) ? JSON.parse(val.value1).label : val.value1.toString();
				currval2 = this.isJson(val.value2) ? JSON.parse(val.value2).label : val.value2.toString();
			}
			else {
				currval1 = this.isJson(val.value1) ? JSON.parse(val.value1).toString() : val.value1.toString();
				currval2 = this.isJson(val.value2) ? JSON.parse(val.value2).toString() : val.value2.toString();
			}
			if (index === 0) {
				appendcontent = appendcontent + '<p class="" ><span  class="text-blue1 bold-anchor d-block f-14 pad-y5 mar-b0">' + this.getURLshort(val.source1) + '</span><a class="">' + (currval1) + '</a></p><p class=""><a class="text-blue1 mr-3">' + this.getURLshort(val.source2) + '</a><a style="">' + (currval2) + '</a></p>';
			} else {
				appendcontent = appendcontent + '<p class=""><a class="text-blue1 mr-3">' + this.getURLshort(val.source2) + '</a><a style="">' + (currval2) + '</a></p>';
			}
		})
		appendcontent = appendcontent + '</div></div><div class="secondary-section"></div></div></div>';
		return appendcontent;

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
	complianceCompanyDetailsModal(data) {
		if (!data || ((!data.primarySource || data.primarySource.length == 0) && (!data.secondarySource || data.secondarySource.length == 0))) {
			return;
		}
		var template = '';
		// Primary Source
		if (data.primarySource) {
			// data.primarySource = _.uniq(data.primarySource);
			template = '<div class="col-sm-6 pad-l0">' +
				'<div class="top-heading pb-2 mb-3  justify-content-between border-thin-dark-cream-b d-flex ai-c">' +
				'<h4 class="mb-0">Primary</h4>' +
				'<span class="text-dark-pastal-green font-regular mar-r5"> <i class="fa fa-link"></i> ' + data.primarySource.length + '</span>' +
				'</div>';
			'<div class="bottom-content-wrapper">' +
				'<ul class="custom-list pad-l0 item-1 panel-scroll">';
			if (data.primarySource && data.primarySource.length > 0) {
				data.primarySource.map((d, index) => {
					if (d) {
						if (d.source == data.source && !data.isUserData) { //index === 0 &&
							template = template + '<li class="d-flex ai-c"><span class="" style="word-break: break-word; white-space:pre-wrap">' + this.getURLshort(d.sourceDisplayName || d.source) + '</span><i class="fa fa-check-circle-o mar-x5 text-dark-blue f-11 "></i></li>'; //
						} else {
							template = template + '<li class="d-flex ai-c"><span class="" style="word-break: break-word; white-space:pre-wrap">' + this.getURLshort(d.sourceDisplayName || d.source) + '</span></li>'; // <i class="fa fa-check-circle-o mar-x5 text-dark-blue f-11 "></i>
						}
					}
				});
			} else {
				template = template + '<li class="d-flex ai-c"><span class="" style="word-break: break-word; white-space:pre-wrap">No Sources Available</span></li>'; // <i class="fa fa-check-circle-o mar-x5 text-dark-blue f-11 "></i>
			}
			template = template + '</ul></div></div>';
		}
		// Secondary Source
		if (data.secondarySource) {
			// data.secondarySource = _.uniq(data.secondarySource);
			template = template + '<div class="col-sm-6 pad-r0">' +
				'<div class="top-heading pb-2 mb-3 justify-content-between border-thin-dark-cream-b d-flex ai-c">' +
				'<h4 class="mb-0">Secondary</h4>' +
				'<span class="text-dark-cream font-regular mar-r5 "><i class=" fa fa-link"></i> ' + data.secondarySource.length + '</span>' +
				'</div>' +
				'<div class="bottom-content-wrapper">' +
				'<ul class="custom-list pad-l0 item-1 panel-scroll">';
			if (data.secondarySource && data.secondarySource.length > 0) {
				data.secondarySource.map((d, index) => {
					var tickcls = '';
					if (d) {
						if (d.source == data.source && !data.isUserData) {
							tickcls = '<i class="fa fa-check-circle-o mar-x5 text-dark-blue f-11 "></i>';
						}
						template = template + '<li class="d-flex ai-c"><span class="" style="word-break: break-word; white-space:pre-wrap">' + this.getURLshort(d.sourceDisplayName || d.source) + '</span>' + tickcls + '</li>';
					}
				});
			} else {
				template = template + '<li class="d-flex ai-c"><span class="" style="word-break: break-word; white-space:pre-wrap">No Sources Available</span></li>'; // <i class="fa fa-check-circle-o mar-x5 text-dark-blue f-11 "></i>
			}
		}
		template = template + '</ul></div></div>';
		return template;
	}

	editCompanyDetailsField(obj, tabname) {
		if (tabname == 'companyDetails') {
			let complianceKeyIdex = this.conplianceMapKeys.findIndex((d) => {
				return d.value == obj.value;
			});
			this.conplianceMapKeys[complianceKeyIdex].edit = !obj.edit;
			if (this.ceriSearchResultObject[obj.key]) {
				if (this.ceriSearchResultObject['bst:businessClassifier']) {
					this.ceriSearchResultObject[obj.key].value2 = this.getBussinessClassifer(this.ceriSearchResultObject[obj.key].value)
				} else {
					this.ceriSearchResultObject[obj.key].value2 = this.ceriSearchResultObject[obj.key].value.toString()
				}
			}
			else {
				this.ceriSearchResultObject[obj.key] = {
					"value2": "",
					valueRef: "",
					primarySource: [],
					isUserData: '',
					sourceDisplayName: "",
					isOverriddenData: '',
					conflicts: [],
					credibility: 0,
					source: "",
					secondarySource: [],
					sourceRef: "",
					value: "",
					sourceUrl: ""

				}
			}

		}
		if (tabname == 'companyIdentifiers') {
			let complianceKeyIdex = this.conplianceIdentifiers.findIndex((d) => {
				return d.value == obj.value;
			});
			this.conplianceIdentifiers[complianceKeyIdex].edit = !obj.edit;
			if (this.conplianceIdentifiers[complianceKeyIdex].key === obj.key) {
				this.conplianceIdentifiers[complianceKeyIdex].value2 = this.conplianceIdentifiers[complianceKeyIdex].value.toString()
			}
			if (this.ceriSearchResultObject[obj.key]) {
				this.ceriSearchResultObject[obj.key].value2 = this.ceriSearchResultObject[obj.key].value.toString()
			}
			else {
				this.ceriSearchResultObject[obj.key] = {
					"value2": "",
					valueRef: "",
					primarySource: [],
					isUserData: '',
					sourceDisplayName: "",
					isOverriddenData: '',
					conflicts: [],
					credibility: 0,
					source: "",
					secondarySource: [],
					sourceRef: "",
					value: "",
					sourceUrl: ""

				}
			}

		}
		if (tabname == 'companyInfo') {
			this.companyInfo.edit = !obj.edit;
			this.companyInfo.texts = this.ceriSearchResultObject['bst:description'].value;
		}
		if (this.ceriSearchResultObject['bst:description'] && this.ceriSearchResultObject['bst:description'].value == "") {
			this.ceriSearchResultObject['bst:description'].value = "no data";
		}

		$(".Screening_new_tooltip").css('display', 'none');

	}
	updateCompanyDetails(value, obj, tabname) {
		if (tabname != 'companyInfo') {
			value = this.ceriSearchResultObject[obj.key].value2;
		}

		var entityId = this.queryParams['query'];
		var data = null, complianceKeyIdex = null;
		if (tabname == 'companyDetails') {
			data = this.conplianceMapKeys;
			complianceKeyIdex = this.conplianceMapKeys.findIndex((d) => {
				return d.value == obj.value;
			});
			this.conplianceMapKeys[complianceKeyIdex].edit = !obj.edit;
			this.conplianceMapKeys[complianceKeyIdex].texts = value;

		} else if (tabname == 'companyIdentifiers') {
			data = this.conplianceIdentifiers;
			complianceKeyIdex = this.conplianceIdentifiers.findIndex((d) => {
				return d.value == obj.value;
			});
			this.conplianceIdentifiers[complianceKeyIdex].edit = !obj.edit;
			this.conplianceIdentifiers[complianceKeyIdex].texts = value;
		} else if (tabname == 'companyInfo') {
			data = [this.companyInfo];
			complianceKeyIdex = 0;
			this.companyInfo.edit = !obj.edit;
			this.companyInfo.texts = value;
		}
		if (!this.ceriSearchResultObject[data[complianceKeyIdex].key]) {
			if (obj.value === 'Alias Name') {
				this.ceriSearchResultObject[data[complianceKeyIdex].key] = { value: [] }
			} else if (obj.value == 'Stock Exchange') {
				this.ceriSearchResultObject[data[complianceKeyIdex].key] = { value: '' };
			} else {
				this.ceriSearchResultObject[data[complianceKeyIdex].key] = { value: '' }
			}
		}
		var prev_val = this.ceriSearchResultObject[data[complianceKeyIdex].key].value;
		var prev_date = this.ceriSearchResultObject[data[complianceKeyIdex].key].modifiedOn;
		var prev_isuserdata = this.ceriSearchResultObject[data[complianceKeyIdex].key].isUserData;
		var dataObjVal = null;
		if (obj.value === 'Alias Name') {
			if (!this.ceriSearchResultObject[data[complianceKeyIdex].key].value) {
				this.ceriSearchResultObject[data[complianceKeyIdex].key].value = [];
			}
			this.ceriSearchResultObject[data[complianceKeyIdex].key].value = []
			this.ceriSearchResultObject[data[complianceKeyIdex].key].value.push(value);
			prev_val = JSON.stringify(prev_val);
			dataObjVal = JSON.stringify(this.ceriSearchResultObject[data[complianceKeyIdex].key].value);
		} else if (obj.value == 'Stock Exchange') {
			this.ceriSearchResultObject[data[complianceKeyIdex].key].value = value;
			dataObjVal = this.ceriSearchResultObject[data[complianceKeyIdex].key].value;
		} else {
			this.ceriSearchResultObject[data[complianceKeyIdex].key].value = value;
			dataObjVal = this.ceriSearchResultObject[data[complianceKeyIdex].key].value
		}
		if (!this.ceriSearchResultObject[data[complianceKeyIdex].key].userValue) {
			this.ceriSearchResultObject[data[complianceKeyIdex].key].userValue = value;
		}
		var currentdate = new Date();
		var datetime = + currentdate.getFullYear() + "-"
			+ (currentdate.getMonth() + 1) + "-"
			+ currentdate.getDate() + " "
			+ currentdate.getHours() + ":"
			+ currentdate.getMinutes() + ":"
			+ currentdate.getSeconds() + ":"
			+ currentdate.getMilliseconds();
		var dataObj = {
			entityId: entityId,
			sourceSchema: data[complianceKeyIdex].key,
			value: dataObjVal,
			preValue: prev_val,
			isUserData: true
		}
		if (tabname == 'companyInfo') {
			this.pageloader.companyInfoReview = false;
		} else {
			this.pageloader.companyDetailsReview = true;
		}
		this.entityApiService.saveEntityAttributes(dataObj).subscribe((res) => {
			if (tabname == 'companyInfo') {
				this.pageloader.companyInfoReview = true;
			} else {
				this.pageloader.companyDetailsReview = true;
			}
			this.ceriSearchResultObject['bst:description'].value = this.companyInfo.texts;
			this.ceriSearchResultObject[data[complianceKeyIdex].key].modifiedOn = datetime;
			this.ceriSearchResultObject[data[complianceKeyIdex].key].isUserData = true;
			this.ceriSearchResultObject[data[complianceKeyIdex].key].modifiedBy = "test user " //this.ehubObject.fullName;
			this.ceriSearchResultObject[data[complianceKeyIdex].key].preValue = prev_val;
			this.getCaseByRiskDetails();
		}, (err) => {
			if (tabname == 'companyInfo') {
				this.pageloader.companyInfoReview = true;
			} else {
				this.pageloader.companyDetailsReview = false;
			}
			this.ceriSearchResultObject[data[complianceKeyIdex].key].value = prev_val;
			this.ceriSearchResultObject[data[complianceKeyIdex].key].modifiedOn = prev_date;
			this.ceriSearchResultObject[data[complianceKeyIdex].key].isUserData = prev_isuserdata;
		})
		this.filterIndustry = null;
	}


	getCaseByRiskDetails() {
		let riskScoreData = [];

		// disable ehubrest/api/riskScore/score api call - kamila (AP-1844)
		// this.entityApiService.getRiskScoreData(this.queryParams['query']).subscribe((data: any) => {
		// 	if (Math.abs(data.latest.entityRiskModel['overall-score']) > 1) {
		// 		data.latest.entityRiskModel['overall-score'] = Math.abs(data.latest.entityRiskModel['overall-score']) / 100;
		// 	}
		// 	this.cumulativeRisk = data.latest.entityRiskModel['overall-score'] * 100;
		// 	this.overviewRisks = data.latest.entityRiskModel;
		// 	this.overviewRisks.cumulativeRisk = data.latest.entityRiskModel['overall-score'];
		// 	this.riskScoreData = data.latest.entityRiskModel;
		// 	riskScoreData = data.latest.entityRiskModel;
		// 	EntityConstants.basicSharedObject.riskScoreData = riskScoreData;
		// 	this.scaledNumArr[0] = 0;
		// 	this.scaledNumArr[1] = data.latest.entityRiskModel['overall-score'] * 100;
		// 	this.scaledNumArr[2] = 0;
		// }, (err) => {
		// });
	}
	public origIndustryVal = null;
	fillIndustryTextbox(value, valtype) {
		let complianceKeyIdex = this.conplianceMapKeys.findIndex((d) => {
			return d.key == 'industryType';
		});
		if (complianceKeyIdex >= 0) {
			this.conplianceMapKeys[complianceKeyIdex].texts = value;

			this.filterIndustry = null;
			if (!this.ceriSearchResultObject[this.conplianceMapKeys[complianceKeyIdex].key]) {
				this.ceriSearchResultObject[this.conplianceMapKeys[complianceKeyIdex].key] = { value: '' }
			}
			this.origIndustryVal = this.ceriSearchResultObject[this.conplianceMapKeys[complianceKeyIdex].key].value;
			this.ceriSearchResultObject[this.conplianceMapKeys[complianceKeyIdex].key].value = value;
		}
	}
	cancelCompanyDetails(value, obj, tabname) {
		if (tabname == 'companyDetails') {
			if (obj.key !== 'industryType') {
				return;
			}
			let complianceKeyIdex = this.conplianceMapKeys.findIndex(function (d) {
				return d.key == 'industryType';
			});
			if (!this.ceriSearchResultObject[this.conplianceMapKeys[complianceKeyIdex].key]) {
				this.filterIndustry = null;
				return;
			}
			if (complianceKeyIdex >= 0) {
				this.ceriSearchResultObject[this.conplianceMapKeys[complianceKeyIdex].key].value = this.origIndustryVal;
				this.origIndustryVal = null;
				this.filterIndustry = null;
			}
		}
		if (this.ceriSearchResultObject['bst:description'].value == "no data") {
			this.ceriSearchResultObject['bst:description'].value = "";
		}
	}
	changedTooltipCompanyDetailsData(obj, classstype) {
		var data = null;
		if (classstype == 'companyDetailsTooltip') {
			data = this.ceriSearchResultObject[obj.key];
		} else if (classstype == 'companyIdentifierTooltip') {
			data = this.ceriSearchResultObject[obj.key];
		} else if (classstype == 'companyInfoTooltip') {
			data = this.ceriSearchResultObject['bst:description'];
		}
		if (!data || !data.isUserData) {
			$(".Screening_new_tooltip").html('');
			return;
		}
		var user = data.modifiedBy;
		var date = data.modifiedOn;
		var originalAns = '';
		if (obj.key == "bst:aka") {
			if (!data.preValue) {
				data.preValue = data.preValue ? data.preValue : (data.valueRef ? data.valueRef : '');
			}
			originalAns = this.isJson(data.preValue) ? JSON.parse(data.preValue).toString() : data.preValue.toString();
		} else if (obj.key == "bst:stock_info") {
			if (!data.preValue) {
				data.preValue = {};
				data.preValue.main_exchange = '';
			}
			originalAns = data.preValue.main_exchange;
		} else {
			if (!data.preValue) {
				data.preValue = data.preValue ? data.preValue : (data.valueRef ? data.valueRef : '');
			}
			originalAns = data.preValue;
		}
		$(".Screening_new_tooltip").html('<div class="col-sm-12 pad-x0"><div class="primary-section"><p class= "mar-b5 f-12 font-light text-cream" style=""><b class= "" text-dark-cream">Change Date:</b> ' + date + '</p><p class= "mar-b5 font-light f-12 text-cream"><b class= "" text-dark-cream">Changed by:</b> ' + user + '</p><p class= "mar-b5 font-light f-12 text-cream"><b class= "" text-dark-cream">Original Answer:</b> ' + originalAns + '</p></div></div>');
	}

	getIndustryLists() {
		this.entityApiService.getSourceIndustryList().subscribe((data: any) => {
			this.industryListsData = data.map((d: any) => {
				return d.industryName;
			});
		}, (err) => {
		})
	}


	onInputCompanyDetails(value, compkey, event: any = false, obj = false, tabname = false) {
		// value =
		let complianceKeyIdex = this.conplianceMapKeys.findIndex(function (d) {
			return d.key == compkey;
		});
		if (compkey == 'industryType') {
			if (complianceKeyIdex >= 0) {
				var output = [];
				this.industryListsData.forEach(function (industry) {
					if (industry.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
						output.push(industry);
					}
				});
				if (!value) {
					output = null;
				}
				this.filterIndustry = output;
				if (event && event.keyCode === 13) {
					if (output && output.length > 0) {
						this.fillIndustryTextbox(output[0], compkey);
						this.updateCompanyDetails(output[0], obj, tabname);
					} else if (!output || output.length == 0 || !output[0]) {
						this.saveIndustryOption(obj, compkey);
						this.fillIndustryTextbox(value, compkey);
						this.updateCompanyDetails(value, obj, tabname);
					}
				}
			}
			setTimeout(function () {
				$(".custom-list.auto-complete-list").mCustomScrollbar({
					axis: "y",
					theme: "minimal-dark"
				});
			}, 0);
		} else {
			if (event.keyCode === 13) {
				this.updateCompanyDetails(value, obj, tabname);
			}
		}
	}
	saveIndustryOption(compkeys, key) {
		var data = {
			"industryName": compkeys.texts
		};
		this.pageloader.companyDetailsReview = true;
		this.entityApiService.saveSourceIndustryList(data).subscribe((res: any) => {
			this.industryListsData.push(data.industryName);
			this.onInputCompanyDetails(data.industryName, 'industryType');
			this.pageloader.companyDetailsReview = false;
			this.getCaseByRiskDetails();
		}, (err: any) => {
			this.pageloader.companyDetailsReview = false;
		})
	}

	open(content) {
		this.modalService.open(content, {
			ariaLabelledBy: 'modal-basic-title',
			windowClass: 'custom-modal c-arrow  bst_modal add-ownership-modal add-new-officer full_space_modal'
		}).result.then((result) => {
			//this.closeResult = `Closed with: ${result}`;


		}, (reason) => {
			//this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}
	// $scope.conflictPopUpmodal = function (source, type, index, schema, title) {
	// 	var data = {
	// 		source: source,
	// 		type: type,
	// 		index: index,
	// 		schema: schema,
	// 		title: title
	// 	};
	// 	if (!data.source) {
	// 		return;
	// 	}
	// 	$scope.pdfLoader = true;
	// 	var dataModal = $uibModal.open({
	// 		templateUrl: 'entityComplianceModal.html',
	// 		controller: 'EntityDataModalController',
	// 		scope: $scope,
	// 		size: 'xs',
	// 		// backdrop: 'static',
	// 		windowClass: 'custom-modal bst_modal  c-arrow bst_modal modal_md full_space_modal',
	// 		resolve: {
	// 			data: function () {
	// 				return data;
	// 			}
	// 		}
	// 	});
	// 	dataModal.result.then(function (response) {
	// 		$scope.pdfLoader = false;
	// 	}, function (reject) {
	// 		$scope.pdfLoader = false;
	// 	});
	// }



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
			setTimeout(() => {
				//this.$apply(function () {
				TopPanelConstants.showMyEntityClipboard = true;
				//});
			}, 0);
			TopPanelConstants.entityselection = section;
		} else if (section !== TopPanelConstants.entityselection) {
			TopPanelConstants.showMyEntityClipboard = false;
			TopPanelConstants.entityselection = section;
			setTimeout(() => {
				//this.$apply(function () {
				TopPanelConstants.showMyEntityClipboard = true;
				//});
			}, 0);
		} else if (section === TopPanelConstants.entityselection && this.sticky_selected_type === type) {
			setTimeout(() => {
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
		// if ($("#entityWrapper").width() && $("#entityWrapper").width() > 0) {
		// 	TopPanelConstants.clipBoardObject.modal_postion.top = (event.pageY + 262) + 'px';
		// 	TopPanelConstants.clipBoardObject.modal_postion.left = (event.pageX - 270) + 'px';
		// 	var p = $(".entity-page")
		// 	var position = p.offset();
		// 	var tooltipWidth = $("#entityWrapper").width() + 50
		// 	var cursor = event.pageX;
		// 	if ((position.left < event.pageX) && (cursor > tooltipWidth)) {
		// 		TopPanelConstants.clipBoardObject.modal_postion.top = (position.top + 262) + 'px';
		// 		TopPanelConstants.clipBoardObject.modal_postion.left = (event.pageX - 30 - ($("#entityWrapper").width() / 2)) + 'px';
		// 	} else {
		// 		TopPanelConstants.clipBoardObject.modal_postion.top = (position.top + 262) + 'px';
		// 		TopPanelConstants.clipBoardObject.modal_postion.left = (event.pageX - 20) + 'px';
		// 	}
		// } else {
		// 	setTimeout(()=> {
		// 		var p = $(".entity-page")
		// 		var position = p.offset();
		// 		var tooltipWidth = $("#entityWrapper").width() + 50;
		// 		TopPanelConstants.clipBoardObject.modal_postion.top = (position.top + 262) + 'px';
		// 		TopPanelConstants.clipBoardObject.modal_postion.left = (event.pageX - 270) + 'px';
		// 		var cursor = event.pageX;
		// 		if ((position.left < event.pageX) && (cursor > tooltipWidth)) {
		// 			TopPanelConstants.clipBoardObject.modal_postion.left = (event.pageX - 30 - ($("#entityWrapper").width() / 2)) + 'px';
		// 		} else {
		// 			TopPanelConstants.clipBoardObject.modal_postion.left = (event.pageX - 20) + 'px';
		// 		}
		// 	}, 0);
		// }
	}
	/* @purpose:To open Doc files modal popup from compliance page sections
	*
	* @created: 25 may 2019
	* @params: type(string), events
* @returns none
	* @author: Amritesh*/
	UploadFilesCompliance = function (event, section) {
		event.stopPropagation();
		event.preventDefault();
		TopPanelConstants.isFromEntitySection = false;
		TopPanelConstants.isUploadFromEntitySection = true;
		this.entityClipboardSizeandPosition(event, section, 'file');
	}
	/* @purpose:To convert normal date to (date,month,year) format
	*
	* @created: 28 may 2020
	* @params: type(string)
	* @returns formmated date
	* @author: shravani*/

	formateTime(d) {
		if (d) {
			let pDate = new Date(d);
			return COMMON_CONST.Months[pDate.getMonth()].slice(0, 3) + ' ,' + pDate.getDate() + ' ,' + pDate.getFullYear();
		}
	}

	getBussinessClassifer(value) {
		let classifier;
		if (value) {
			classifier = JSON.parse(value);
			if (classifier.length > 0) {
				let data = '';
				for (let i = 0; i < classifier.length; i++) {
					data = data + classifier[i].description + ',';
				}
				return data.replace(/,\s*$/, "");
			}
		}
	}

}
