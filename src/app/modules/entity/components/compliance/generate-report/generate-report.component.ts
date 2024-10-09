import { Component, OnInit, Input, Inject } from '@angular/core';
import { EntityApiService } from '../../../services/entity-api.service';
import { EntityConstants } from '../../../constants/entity-company-constant';
import { EntityCommonTabService } from '../../../services/entity-common-tab.service';
import {EntityOrgchartService} from '../../../services/entity-orgchart.service';
import { nest as d3Nest } from "d3";
import { chunk, find, compact, flatMap, isEmpty, groupBy, uniq } from 'lodash-es';
import * as moment from 'moment';
import domtoimage from 'dom-to-image';
import {LazyLoadLibraryService} from "@app/common-modules/services/lazy-load-library.service";
import { takeUntil } from "rxjs/operators";
import {Subject} from "rxjs";
import { WINDOW } from '../../../../../core/tokens/window';

// declare  var $:any;
declare var currentDocID;




@Component({
	selector: 'app-generate-report',
	templateUrl: './generate-report.component.html',
	styleUrls: ['./generate-report.component.scss']
})
export class GenerateReportComponent implements OnInit {
	@Input('rootComponentData') rootComponentData;
	@Input('queryParams') queryParams;
	@Input('createNewArrayReportData') createNewArrayReportData;
	@Input('screeningData') screeningData;
	@Input('sliderUtilitesobj') sliderUtilitesobj;
	@Input('entitySearchResult') entitySearchResult;
	@Input('complianceRightAdverseNews') complianceRightAdverseNews;
	@Input('showSubsidaries') showSubsidaries;
	@Input('tempOperationsForReport') tempOperationsForReport;
	@Input('countryNames') countryNames;
	public screeningCheckedData :any = [];
	public screeningDataforReport:any = []
	public generateReportData: any = [];
	public genpact_summaryresults = [];
	public conplianceMapKeys = EntityConstants.utilityConstant.conplianceMapKeys;
	public ceriSearchResultObject: any = EntityConstants.complianceObject;
	public reportv2Data:any =EntityConstants.utilityConstant.reportv2Data;
	public companyAssociatedDocDetailsInfo;
	public documentsListForReport;
	public worldComplianceLocationsOptionsForReport:any = {
		container: "#companyexampleReport",
		uri1: "../vendor/data/worldCountries.json",// Url of data
		uri2: "../vendor/data/worldMapData.json",// Url of data
		height: 700,
		markers: {}
	};
	public alertSummary :any ={}
	public evidenceDocumentsListForReport:any;
	public evidenceDocumentsListDocotherThanPNG:any;
	public showReport = false;
	public is_dom_img = false;
	public complexImg:any;
	public stickyListForReport:any;
    ngAfterViewInit(){
		var divContents = document.querySelector("#report_generation_div").innerHTML;
	    //this.complianceReportTemplate("RENAME", divContents,true);
	}
  private unsubscribe$: Subject<any> = new Subject<any>();
	constructor(
		private entityApiService: EntityApiService,
		public entityCommonTabService: EntityCommonTabService,
		public entityOrgchartService:EntityOrgchartService,
    	private scriptLoader: LazyLoadLibraryService,
		@Inject(WINDOW) private readonly window: Window
    ) { }

	ngOnInit() {
      this.scriptLoader.loadScript('./assets/js/dom-to-image.js').pipe(takeUntil(this.unsubscribe$)).subscribe();
        this.entityCommonTabService.companyAssociatedDocDetailsInfoObserver.subscribe((data)=>{
			this.companyAssociatedDocDetailsInfo = data;
		})
		this.generateReport();
		let ele:any = document.getElementById("generateReport")
		ele.classList.add("c-ban");
		ele.disabled = true;
	}
	generateReport(){
		// entityCompanyNewController($scope);
		//$scope.$parent.pdfLoader = true;
		var ajax1 = this.getEntityQuestionsByEntityId();
		var ajax2 = this.getAllSignificantNewsIn();
		var ajax3 = this.getAllDocuments();
		var ajax4 = this.getAllStickyNotes();
		Promise.all([ajax1, ajax2, ajax3,ajax4]).then((resp:any)=>{

			this.generateReportPdf();

			this.auditLogGeneratedReport();
			this.showReport = true;
		}).catch((err)=>{
		})

	}
	getSuccessReportDocuments(pagerecords, docOrSticky) {
		var params = {
			"pageNumber": 1,
			"orderIn": 'desc',
			"orderBy": 'uploadedOn',
			"recordsPerPage": pagerecords,
			"entityId": this.queryParams['query']
		};
		var params2 = {
			"docFlag": 5,
			"pageNumber": 1,
			"orderIn": 'desc',
			"orderBy": 'uploadedOn',
			"recordsPerPage": pagerecords,
			"entityId": this.queryParams['query']
		};
		var params3 = {
			"docFlag": 6,
			"pageNumber": 1,
			"orderIn": 'desc',
			"orderBy": 'uploadedOn',
			"recordsPerPage": pagerecords,
			"entityId": this.queryParams['query']
		};
		if (docOrSticky === 'docs') {
			return new Promise( (resolve, reject)=> {
				this.entityOrgchartService.getllSourceDocuments(params).subscribe((data:any) =>{
					this.documentsListForReport = data.result;
					resolve(true);
				},(err:any)=>{
					reject(false);
				})
			});
		} else if (docOrSticky === 'sticky') {
			return new Promise( (resolve, reject) =>{
				this.entityOrgchartService.getllSourceDocuments(params2).subscribe( (data:any)=> {
					this.stickyListForReport =data.result;
					let numberOfdocuments = 0;
					data.result.forEach((val, key)=>{
						let params = {
							"docId": val.docId
						};
						// return new Promise(function (resolve, reject) {
							this.entityOrgchartService.downloadDocument(params).subscribe( (docContent:any) =>{
							let blob = new Blob([docContent.data], {
								type: "application/text",
							});
							let reader = new FileReader();
							reader.addEventListener('loadend', (e:any)=> {
								let text = e.srcElement.result;
								let index = this.stickyListForReport.findIndex( (d)=> { return d.docId === val.docId });
								this.stickyListForReport[index].content = text;
							});
							// Start reading the blob as text.
							let x = reader.readAsText(blob);// jshint ignore:line
							if (data.result.length - 1 === numberOfdocuments) {
								resolve(true);
							}
							numberOfdocuments = numberOfdocuments + 1;
						}, function () {
							if (data.result.length - 1 === numberOfdocuments) {
								resolve(true);
							}
							numberOfdocuments = numberOfdocuments + 1;
						});
					})

					if (data.result.length === 0) {
						resolve(true)
					}
					// resolve(true);
				},(err:any)=>{
					reject(true);
				})
			});
		} else if (docOrSticky === "evidence_docs") {
			return new Promise( (resolve, reject) =>{
				this.entityOrgchartService.getllSourceDocuments(params3).subscribe( (data:any)=> {
					// $scope.evidenceDocumentsListForReport = res.data.result;
					this.evidenceDocumentsListForReport = data.result.filter( (value)=> {
						return value.type.toLowerCase() == "png"
					})
					this.evidenceDocumentsListDocotherThanPNG = data.result.filter( (value) =>{
						return value.type.toLowerCase() != "png"
					})
					let numberOfdocuments = 0;
					data.result.forEach((val, key)=>{
						let params = {

							"docId": val.docId
						};
						// return new Promise(function (resolve, reject) {
							this.entityOrgchartService.downloadDocument(params).subscribe( (docContent:any)=> {
							let blob = new Blob([docContent.data], {
								type: "application/text",
							});
							let urlCreator = (this.window as any).URL;
							let imageUrl = urlCreator.createObjectURL(blob);
							let index = this.evidenceDocumentsListForReport.findIndex( (d)=> { return d.docId === val.docId });
							if (index || index == 0) {
								// this.sourceWithBSTRegistry.filter( (d)=> {
								// 	if (d.sourceName && this.evidenceDocumentsListForReport[index] && this.evidenceDocumentsListForReport[index].docName && d.sourceName == this.evidenceDocumentsListForReport[index].docName.split('.png')[0]) {
								// 		if (d) {
								// 			this.evidenceDocumentsListForReport[index].title = d.sourceName;
								// 		}
								// 	}
								// });
							}
							if (index !== -1) {
								this.evidenceDocumentsListForReport[index]['url'] = imageUrl;
								this.evidenceDocumentsListForReport[index]['sourceId'] = val.title;
							}
							if (data.result.length - 1 === numberOfdocuments) {
								resolve(true);
							}
							numberOfdocuments = numberOfdocuments + 1;
						}, function () {
							if (data.result.length - 1 === numberOfdocuments) {
								resolve(true);
							}
							numberOfdocuments = numberOfdocuments + 1;
							//								HostPathService.FlashErrorMessage('ERROR DOWNLOAD DOCUMENT', 'Failed to download document with file title: ' + docTitle);
							// reject(false);
						});
					})

					if (data.result.length === 0) {
						resolve(true)
					}
					// resolve(true);
				},(err:any)=>{
					reject(false);
				})
			});
		}
	}
	getEvidenceListDocs(paramFromApiFunc) {
		var params = paramFromApiFunc;
		params.docFlag = 6;
		// $scope.documentsListForReport = [];
		return new Promise( (resolve, reject) => {
			this.entityOrgchartService.getEvidenceListDocs(params).subscribe( (res:any)=> {
				this.getSuccessReportDocuments(res.paginationInformation.totalResults, 'evidence_docs').then(function (res) {
					resolve(true);
				});
			},(err:any)=>{
				reject(false);
			})
		});
	}
	getAllStickyNotes() {
		var params = {

			"docFlag": 5,
			"pageNumber": 1,
			"orderIn": 'desc',
			"orderBy": 'uploadedOn',
			"recordsPerPage": 9,
			"entityId": this.queryParams['query']
		};
		// $scope.documentsListForReport = [];
		return new Promise( (resolve, reject) =>{
			this.entityOrgchartService.getllSourceDocuments(params).subscribe( (res:any) =>{
				this.getSuccessReportDocuments(res.paginationInformation.totalResults, 'sticky').then(function (res) {
					resolve(true);
				});
			}, (err:any)=> {
				reject(false)
			})
		});
	}
	getAllDocuments() {
		let params = {
			"pageNumber": 1,
			"orderIn": 'desc',
			"orderBy": 'uploadedOn',
			"recordsPerPage": 9,
			"entityId": this.queryParams["query"]
		};
		this.documentsListForReport = [];
		return new Promise( (resolve, reject) =>{
			this.entityOrgchartService.getllSourceDocuments(params).subscribe( (data:any) =>{
				let reportDocumentpromise = this.getSuccessReportDocuments(data.paginationInformation.totalResults, 'docs');
				reportDocumentpromise.then( (response)=> {
					this.getEvidenceListDocs(params).then(function (response) {
						resolve(true);
					});
				});
			},(err:any)=>{reject(false);})
		});
	}
	public generateReportofficernews:any;
	public generateReportofficernewsByGroup:any;
	getAllSignificantNewsIn() {
		let params = {
			identifier: this.queryParams["query"]
		};
		return new Promise( (resolve, reject) => {
			this.entityApiService.getAllSignificantNews(params).subscribe( (data)=> {
				if (data) {
					this.generateReportofficernews = data;
					this.generateReportofficernews.map( (d:any) =>{
						d.search_query = d.results.search_query;
					});
					this.generateReportofficernewsByGroup = d3Nest().key( (d:any)=>{ return d.search_query }).entries(this.generateReportofficernews);
				}
				// $window.generateReportPdf() ;
				//
				resolve(true);
			}, function (failure) {
				// $window.generateReportPdf();
				reject(false);
			});
		});
	}
	getEntityQuestionsByEntityId() {
		return new Promise((resolve, reject) => {
			this.entityApiService.getEntityQuestionsByEntityId(this.queryParams['query'], this.rootComponentData['qbServeyID']).subscribe((data: any) => {
				if (data) {
					if (data.length > 0 && data[data.length - 1].questionName == "Entity Name") {
						data = data.reverse();
					}
					// try{
					this.generateReportData = [];
					this.genpact_summaryresults = [];
					if (this.rootComponentData.complianceReport || this.rootComponentData.genpactReportV2) {
						let industryIndex = this.conplianceMapKeys.findIndex((d: any) => { return d.key == 'industryType' });
						let industryObj = this.conplianceMapKeys[industryIndex];
						let industrydata = this.ceriSearchResultObject[industryObj.key];
					}
					let nestedData = d3Nest()
						.key((d: any) => { return d.groupName; })
						.key((d: any) => { return d.questionName; })
						.entries(data);
					let sortFunction = function (a: any, b: any) {
						return a.createdDate > b.createdDate ? -1 : 1;
					};
					nestedData.forEach((val1: any, key1) => {
						val1.values.forEach((val2: any, key2) => {
							val2.values = val2.values.sort(sortFunction);
						})
					})

					var finalData = {};
					nestedData.map((d: any) => {
						var tempData = d.values.map((obj: any) => {
							obj.values.map((val: any) => {
								if (val.questionOptions) {
									val.questionOptions = JSON.parse(val.questionOptions);
								}
							});
							return obj;
						});
						finalData[d.key] = tempData;
						// finalData[d.key]=d.values;
					});
					if (finalData['#Principals'] || finalData['#Principals- Only applicable if country risk is High']) {
						finalData['#Principals'] = finalData['#Principals'] ? finalData['#Principals'] : finalData['#Principals- Only applicable if country risk is High'];
					}
					finalData['#Customer Related Information - Business Activities'] = finalData['#Customer Related Information - Business Activities'] ? finalData['#Customer Related Information - Business Activities'] : [];
					finalData['#Customer Related Information - Nature of Relationship & Third Party Identification'] = finalData['#Customer Related Information - Nature of Relationship & Third Party Identification'] ? finalData['#Customer Related Information - Nature of Relationship & Third Party Identification'] : [];
					finalData['#Customer Related Information - Source of Funds'] = finalData['#Customer Related Information - Source of Funds'] ? finalData['#Customer Related Information - Source of Funds'] : [];
					finalData['#KYC Representative'] = finalData['#KYC Representative'] ? finalData['#KYC Representative'] : [];
					// concatinating due_deligance into one attibute
					let standard_due_deligance = finalData['#Customer Related Information - Business Activities'].concat(finalData['#Customer Related Information - Nature of Relationship & Third Party Identification'], finalData['#Customer Related Information - Source of Funds'], finalData['#KYC Representative'], finalData['#Proof of Listing'], finalData['#Proof of Regulation']);
					finalData['#Standard Due Diligence: Identity and Legal Existence'] = standard_due_deligance;
					this.generateReportData = finalData;
					if (this.rootComponentData.complianceReport) {
						let customerOutreachdata = false;
						if (this.createNewArrayReportData && this.createNewArrayReportData.length > 0) {
							customerOutreachdata = true;
						}
						this.genpact_summaryresults.push({
							questionAnswer: (customerOutreachdata) ? 'Yes' : 'No',
							questionName: 'Out Reach Required:',
							questionOptions: [{ text: 'Yes', selected: ((customerOutreachdata) ? 'Yes' : '') },
							{ text: 'No', selected: ((!customerOutreachdata) ? 'No' : '') }],
							questionType: 'radioButton'
						});
						//
					}
					if (this.rootComponentData.genpactReportV2) {
						this.generateGenpactReportv2();
					} else {
						/* still to do */
						// this.conplianceMapKeysReport.forEach((mapkeys, mapindex) => {
						// 	if (this.ceriSearchResultObject[mapkeys.key]) {
						// 		this.ceriSearchResultObject[mapkeys.key] = addingIsTackenScreenShotKeyForOldReport(this.ceriSearchResultObject[mapkeys.key], 2, "oldreport");
						// 	}
						// })
						/* still to do */



					}
				}
				// getAllSignificantNewsIn();
				resolve(true);
			}, (error) => {
				// getAllSignificantNewsIn();
				reject(false);
			});
		});
	}
	getCheckListAnswer(checklistArr:any, question_name:any, selectedValue:any=false, productSection:any=false) {
		var obj_ans = null;
		if (checklistArr && checklistArr.length) {
			// var findQuesObj = find(checklistArr,function(d){ return d.questionName.includes(question_name)});
			var findQuesObj = checklistArr.find(function (d) { return d.key == question_name });
			if (findQuesObj) {
				if (findQuesObj.values.length && (findQuesObj.values[0].questionType === "radioButton" || findQuesObj.values[0].questionType === "checklist")) {
					obj_ans = [];
					if (selectedValue) {
						obj_ans = findQuesObj.values[0].questionOptions.find(function (d) {
							return d.selected === selectedValue;
						});
					} else {
						if (productSection) {
							obj_ans = findQuesObj.values[0].questionOptions.filter(function (d) {
								return d.selected;
							});
						} else {
							obj_ans = findQuesObj.values[0].questionOptions.find(function (d) {
								return d.selected;
							});
						}
					}
				} else if (findQuesObj.values.length && findQuesObj.values[0].questionType === "text") {
					obj_ans = '';
					obj_ans = findQuesObj.values[0].questionAnswer;
				} else if (findQuesObj.values.length && findQuesObj.values[0].questionType === "multiple-short-txt") {
					obj_ans = [];
					if (selectedValue) {
						obj_ans = findQuesObj.values[0].questionOptions.find(function (k) {
							return k.label && k.label === selectedValue;
						});;
					} else {
						obj_ans = findQuesObj.values[0].questionOptions;
					}
				}
			}
			return obj_ans;
		}
	}
	auditLogGeneratedReport(){
		var data = {
			name:this.ceriSearchResultObject['vcard:organization-name'].value,
			identifier:this.queryParams['query']
		}
		this.entityApiService.auditLogGenerateReport(data).subscribe(function(response){

		});
    }
	getSourceInfo(obj) {
		return this.entityCommonTabService.getSourceInfo(obj);
	}
	getJsonParse(data) {
		var newData = [];
		data.forEach((val: any, key: any) => {
			if (val.questionType == "multiple-short-txt") {
				// val.questionOptions = JSON.parse(val.questionOptions);
				val.questionOptions = val.questionOptions
			}
			if (val.questionType == 'checklist') {
				// var all_options = JSON.parse(val.questionOptions);
				var all_options = (val.questionOptions);
				var options = (all_options).filter(function (d) {
					return (!d.commenthead && d.selected);
				});
				var comments = (all_options).filter(function (d) {
					return (d.commenthead)
				});
				val.questionOptions = chunk(options, 2);
				val.comments = comments;
			}
			newData.push(val);
		})
		return newData;

	}
	/* still to do */
	// addingIsTackenScreenShotKey(values, arrSize, oldreport) {
	// 	if (values.length) {
	// 		let legal_data = values.flat();
	// 		legal_data.forEach((val)=>{
	// 			let findsrcIndx = this.sourceWithBSTRegistry.findIndex( (d:any)=> {
	// 				return d.sourceName === val.source
	// 			});
	// 			if (findsrcIndx !== -1) {
	// 				if (this.sourceWithBSTRegistry[findsrcIndx].showHideAddtoPage) {
	// 					let docname = this.sourceWithBSTRegistry[findsrcIndx].SourceValue.source_screenshot;
	// 					if (this.sourceWithBSTRegistry[findsrcIndx].uploadedFileName) {
	// 						docname = this.sourceWithBSTRegistry[findsrcIndx].uploadedFileName;
	// 					}
	// 					let docIndex = (docname.lastIndexOf("/")) + 1;
	// 					docname = docname.slice(docIndex, docname.length);
	// 					let docid = this.sourceWithBSTRegistry[findsrcIndx].docid;
	// 					if (this.sourceWithBSTRegistry[findsrcIndx].uploadedFileName) {
	// 						docname = this.sourceWithBSTRegistry[findsrcIndx].uploadedFileName;
	// 					}
	// 					if (docname) {
	// 						let pointIndex = (docname.lastIndexOf(".")) + 1;
	// 						let srcType = docname.slice(pointIndex, docname.length);
	// 						val.sourceType = srcType;
	// 						val.sourceUrl = docname;
	// 						val.docId = docid;
	// 					}
	// 				}
	// 			}
	// 		})

	// 		if (!oldreport) {
	// 			values = chunk(legal_data, arrSize);
	// 		}
	// 		return values;
	// 	}
	// }
	/* still to do */
	generateGenpactReportv2(){

	// Source of Funds checklist answer
	if (this.generateReportData['#Source of Funds']) {
		let sourceFundOutreachAns = null;
		sourceFundOutreachAns = this.getCheckListAnswer(this.generateReportData['#Source of Funds'], 'Is the source of fund info available from public sources.');
		this.reportv2Data['sourceOfFundOutreach'] = sourceFundOutreachAns.text ? sourceFundOutreachAns.text : "";
		let sourceFundOutreachInfoAns = null;
		sourceFundOutreachInfoAns = this.getCheckListAnswer(this.generateReportData['#Source of Funds'], 'Please provide the details');
		this.reportv2Data['sourceOfFundOutreachInfo'] = sourceFundOutreachInfoAns ? sourceFundOutreachInfoAns : "";
	}
	// Main Principle creating table from checklist
	if (this.generateReportData['#Main Principals']) {
		let sourceFundOutreachAns = '';
		let main_principal_identified = this.getCheckListAnswer(this.generateReportData['#Main Principals'], 'All the main principals identified?');
		if (main_principal_identified && main_principal_identified.text && main_principal_identified.text.toLowerCase() === 'yes') {
			sourceFundOutreachAns = this.getCheckListAnswer(this.generateReportData['#Main Principals'], 'Please mention Main Principals information');
		} else if (main_principal_identified && main_principal_identified.text && main_principal_identified.text.toLowerCase() === 'partial') {
			sourceFundOutreachAns = this.getCheckListAnswer(this.generateReportData['#Main Principals'], 'Please state the document/s required from client to capture Main Principal info');
		} else if (main_principal_identified && main_principal_identified.text && main_principal_identified.text.toLowerCase() === 'no') {
			sourceFundOutreachAns = this.getCheckListAnswer(this.generateReportData['#Main Principals'], 'Please state the document/s required from client to capture Main Principal info');
		}
		let main_principalsDatafilter = this.screeningData.filter( (d:any)=> {
			return d.classification && d.classification.length && d.classification.includes('Main Prinicipals');
		});
		this.reportv2Data['main_priociples_data'] = main_principalsDatafilter;
	};
	var principalsDatafilter = this.screeningData.filter( (d:any)=> {
		return d.classification && d.classification.length && d.classification.includes("Principals");
	});
	this.reportv2Data['Principals_Details_High_Risk'] = principalsDatafilter;
	var ubo_psudeoUbo_Datafilter = this.screeningData.filter( (d:any)=> {
		return d.classification && d.classification.length && (d.classification.includes("UBO") || d.classification.includes("Pesudo UBO"));
	});
	this.reportv2Data['UBO_Details'] = ubo_psudeoUbo_Datafilter;
	//legal existence section details;
	if (this.generateReportData['#Legal Existence']) {
		var legal_existenceAns = this.getCheckListAnswer(this.generateReportData['#Legal Existence'], 'Legal existence verified?');
		var legal_existenceVerified_Ans = this.getCheckListAnswer(this.generateReportData['#Legal Existence'], 'Verification Details');
		var trade_registration_Ans = this.getCheckListAnswer(this.generateReportData['#Legal Existence'], 'Grid ID');
		this.reportv2Data['legal_existence_verified'] = {
			question: 'Legal existence verified?',
			answer: legal_existenceAns ? legal_existenceAns.text : ''
		}
		this.reportv2Data['legal_existence_verificationDetails'] = {
			question: 'Verification Details',
			answer: legal_existenceVerified_Ans ? legal_existenceVerified_Ans : ''
		}
		this.reportv2Data['#Trade_Registration_No'] = trade_registration_Ans ? trade_registration_Ans : '';
	}
	// Associated parties details section
	if (this.generateReportData['#Associated Parties']) {
		var assc_partiesquesAns = this.getCheckListAnswer(this.generateReportData['#Associated Parties'], 'Are there any Intermediate Parents or related parties identified in the ownership structure ?');
		this.reportv2Data['Associated_Parties_QuesAns'] = {
			question: 'Are there any Intermediate Parents or related parties identified in the ownership structure ?',
			answer: assc_partiesquesAns ? assc_partiesquesAns.text : ''
		}
	}
	// Set and get Outreach Required 'yes' or 'no'
	if (this.generateReportData['#Ownership Structure'] || this.generateReportData['#Source of Funds'] || this.generateReportData['#Complex Ownership Structure']) {
		var ownership_ans = this.getCheckListAnswer(this.generateReportData['#Ownership Structure'], 'Is the ownership identified upto the UBO level?', 'Outreach Required');
		var complex_ownership_ans = this.getCheckListAnswer(this.generateReportData['#Complex Ownership Structure'], 'Is there a complex ownership structure identified?', 'Outreach Required');
		var sorceofFunds_ans = this.getCheckListAnswer(this.generateReportData['#Source of Funds'], 'Is the source of fund info available from public sources.', 'Outreach Required');
		ownership_ans = ownership_ans ? ownership_ans.text : '';
		complex_ownership_ans = complex_ownership_ans ? complex_ownership_ans.text : '';
		sorceofFunds_ans = sorceofFunds_ans ? sorceofFunds_ans.text : '';
		var concatoutreach = [ownership_ans, complex_ownership_ans, sorceofFunds_ans];
		if (concatoutreach.indexOf('Outreach Required') !== -1) {
			this.reportv2Data['outreach_required'] = 'Yes';
		} else {
			this.reportv2Data['outreach_required'] = 'No';
		}
	}
	// get level of due diligence value from checklist
	if (this.generateReportData['#Profile Summary']) {
		var level_due_diligence = this.getCheckListAnswer(this.generateReportData['#Profile Summary'], 'Level of Due Diligence Applied', 'Level of Due Diligence');
		this.reportv2Data['level_due_diligence'] = level_due_diligence ? level_due_diligence.value : '';
	}
	// get mlro_management_approval value from checklist
	if (this.generateReportData['#Screening']) {
		var mlro_required = this.getCheckListAnswer(this.generateReportData['#Screening'], 'MLRO involvement or Senior Management approval required ?', 'Yes');
		this.reportv2Data['mlro_management_approval'] = mlro_required ? mlro_required.text : 'No';
	}
	//get regulated by , stock exchane and ticker code from checkist
	if (this.generateReportData['#Listing & Regulation Status']) {
		var regulated = this.getCheckListAnswer(this.generateReportData['#Listing & Regulation Status'], 'Name of the regulator');
		this.reportv2Data['regulated_by'] = regulated ? regulated : '';
		var stock_exchange = this.getCheckListAnswer(this.generateReportData['#Listing & Regulation Status'], 'Name of the stock exchange');
		this.reportv2Data['stock_exchange'] = stock_exchange ? stock_exchange : '';
		var ticker_code = this.getCheckListAnswer(this.generateReportData['#Listing & Regulation Status'], 'Ticker code of the stock listing');
		this.reportv2Data['ticker_code'] = ticker_code ? ticker_code : '';
	}
	// get country risk and risk rating
	if (this.generateReportData['#INITIAL_RISK_RATING']) {
		var risk_level_ans = this.getCheckListAnswer(this.generateReportData['#INITIAL_RISK_RATING'], 'Initial Risk Rating per Risk Classifcation Methodology.');
		this.reportv2Data['#RiskRating'] = risk_level_ans ? risk_level_ans.text : '';
		var countryrisk_ans = this.getCheckListAnswer(this.generateReportData['#INITIAL_RISK_RATING'], 'Select Country Risk:');
		this.reportv2Data['#CountryRisk'] = countryrisk_ans ? countryrisk_ans.text : '';
	}
	// get legal_ultimate_parent from ownership checklist
	if (this.generateReportData['#Ownership Structure']) {
		var legal_ultimate_parent = this.getCheckListAnswer(this.generateReportData['#Ownership Structure'], 'Details of ultimate parent/s or holding company');
		this.reportv2Data['legal_ultimate_parent'] = legal_ultimate_parent ? legal_ultimate_parent : "";
	}
	// get uhrc from checklist
	var uhrc_nexus = this.generateReportData['#UHRC'] ? this.generateReportData['#UHRC'] : [];
	if (uhrc_nexus && uhrc_nexus.length) {
		uhrc_nexus.forEach((val, key)=>{
			val.values.forEach((val1, key1)=>{
				if (val1.questionType === "radioButton") {
					this.reportv2Data['#UHRC'].selected = val1.questionOptions.find( (opt:any)=> {
						return opt.selected
					}).text;
				}
				if (val1.questionType === "checklist") {
					this.reportv2Data['#UHRC'].values = val1.questionOptions ? val1.questionOptions.map( (d:any) =>{ return d.selected }) : [];
					this.reportv2Data['#UHRC'].values = compact(this.reportv2Data['#UHRC'].values);
				}
			})
		})
	}
	var cdd_proces_and_cdd_results_keys = [
		{ label: 'Level of Due Diligence', value: this.reportv2Data['level_due_diligence'] },
		{ label: 'Initial Risk Rating', value: this.reportv2Data['#RiskRating'] },
		{ label: 'Outreach Required', value: (this.reportv2Data['outreach_required'] ? 'Yes' : 'No') },
		// {label: 'MLRO/Management Approval',value: this.reportv2Data['mlro_management_approval']},
		{ label: 'MLRO/Management Approval', value: "" },
		{ label: 'Analyst Name', value: "this.ehubObject.fullName" }, //this.ehubObject.fullName
		{ label: 'Processing Date', value: moment().format('MM-DD-YYYY') }
	];
	this.reportv2Data['CDD_Process_and_CDD_Results_Fields'] = chunk(cdd_proces_and_cdd_results_keys, 3); // 3=> size to chunk the array data
	// get Party/Customer Product Information
	var ing_product_types = [];
	if (this.generateReportData['#Party/Customer Product Information']) {
		var productTypeAnswer = this.getCheckListAnswer(this.generateReportData['#Party/Customer Product Information'], 'Please provide the product related information if received from ING');
		productTypeAnswer = productTypeAnswer ? productTypeAnswer.text : "";
		if (productTypeAnswer.toLowerCase() == "yes") {
			ing_product_types = this.getCheckListAnswer(this.generateReportData['#Party/Customer Product Information'], 'High Risk Product', '', 'productSection');
		}
	}
	var information_recevied_from_ing_keys = [
		{ label: 'Name of Client', value: (this.ceriSearchResultObject['vcard:organization-name'].value ? this.ceriSearchResultObject['vcard:organization-name'].value : '') },
		{ label: 'Registered Address', value: (this.ceriSearchResultObject['fullAddress'].value ? this.ceriSearchResultObject['fullAddress'].value : '') },
		{ label: 'Product Type', value: (ing_product_types && ing_product_types.length ? ing_product_types : []) }
	];
	this.reportv2Data['information_recevied_from_ing'] = chunk(information_recevied_from_ing_keys, 3);
	var party_information_data = [
		{
			label: 'Legal Name',
			value: this.getSourceInfo(this.ceriSearchResultObject['vcard:organization-name']).value,
			source: this.getSourceInfo(this.ceriSearchResultObject['vcard:organization-name']).source,
			sourceUrl: this.getSourceInfo(this.ceriSearchResultObject['vcard:organization-name']).sourceUrl,
			sourceType: this.getSourceInfo(this.ceriSearchResultObject['vcard:organization-name']).sourceType,
			docId: this.getSourceInfo(this.ceriSearchResultObject['vcard:organization-name']).docId
		},
		{
			label: 'Legal Ultimate Parent',
			value: this.reportv2Data['legal_ultimate_parent'],
			source: '',
			sourceUrl: '',
			sourceType: '',
			docId: ''
		},
		{
			label: 'Trading Name/Alias Name',
			value: this.getSourceInfo(this.ceriSearchResultObject['bst:aka']).value.toString(),
			source: this.getSourceInfo(this.ceriSearchResultObject['bst:aka']).source,
			sourceUrl: this.getSourceInfo(this.ceriSearchResultObject['bst:aka']).sourceUrl,
			sourceType: this.getSourceInfo(this.ceriSearchResultObject['bst:aka']).sourceType,
			docId: this.getSourceInfo(this.ceriSearchResultObject['bst:aka']).docId
		},
		{
			label: 'Company Status',
			value: this.getSourceInfo(this.ceriSearchResultObject['hasActivityStatus']).value,
			source: this.getSourceInfo(this.ceriSearchResultObject['hasActivityStatus']).source,
			sourceUrl: this.getSourceInfo(this.ceriSearchResultObject['hasActivityStatus']).sourceUrl,
			sourceType: this.getSourceInfo(this.ceriSearchResultObject['hasActivityStatus']).sourceType,
			docId: this.getSourceInfo(this.ceriSearchResultObject['hasActivityStatus']).docId
		},
		{
			label: 'Legal Form/Type',
			value: this.getSourceInfo(this.ceriSearchResultObject['lei:legalForm']).value,
			source: this.getSourceInfo(this.ceriSearchResultObject['lei:legalForm']).source,
			sourceUrl: this.getSourceInfo(this.ceriSearchResultObject['lei:legalForm']).sourceUrl,
			sourceType: this.getSourceInfo(this.ceriSearchResultObject['lei:legalForm']).sourceType,
			docId: this.getSourceInfo(this.ceriSearchResultObject['lei:legalForm']).docId
		},
		{
			label: 'Industry',
			value: this.getSourceInfo(this.ceriSearchResultObject['industryType']).value,
			source: this.getSourceInfo(this.ceriSearchResultObject['industryType']).source,
			sourceUrl: this.getSourceInfo(this.ceriSearchResultObject['industryType']).sourceUrl,
			sourceType: this.getSourceInfo(this.ceriSearchResultObject['industryType']).sourceType,
			docId: this.getSourceInfo(this.ceriSearchResultObject['industryType']).docId
		},
		{
			label: 'Regulated By',
			value: this.getSourceInfo(this.ceriSearchResultObject['RegulationStatus']).value,
			source: this.getSourceInfo(this.ceriSearchResultObject['RegulationStatus']).source,
			sourceUrl: this.getSourceInfo(this.ceriSearchResultObject['RegulationStatus']).sourceUrl,
			sourceType: this.getSourceInfo(this.ceriSearchResultObject['RegulationStatus']).sourceType,
			docId: this.getSourceInfo(this.ceriSearchResultObject['RegulationStatus']).docId
		},
		{
			label: 'Listed on Stock Ex',
			value: this.getSourceInfo(this.ceriSearchResultObject['main_exchange']).value,
			source: this.getSourceInfo(this.ceriSearchResultObject['main_exchange']).source,
			sourceUrl: this.getSourceInfo(this.ceriSearchResultObject['main_exchange']).sourceUrl,
			sourceType: this.getSourceInfo(this.ceriSearchResultObject['main_exchange']).sourceType,
			docId: this.getSourceInfo(this.ceriSearchResultObject['main_exchange']).docId
		},
		{
			label: 'Website',
			value: this.getSourceInfo(this.ceriSearchResultObject['hasURL']).value,
			source: this.getSourceInfo(this.ceriSearchResultObject['hasURL']).source,
			sourceUrl: this.getSourceInfo(this.ceriSearchResultObject['hasURL']).sourceUrl,
			sourceType: this.getSourceInfo(this.ceriSearchResultObject['hasURL']).sourceType,
			docId: this.getSourceInfo(this.ceriSearchResultObject['hasURL']).docId
		},
		{
			label: 'Ticker Code',
			value: this.getSourceInfo(this.ceriSearchResultObject['ticket_symbol']).value,
			source: this.getSourceInfo(this.ceriSearchResultObject['ticket_symbol']).source,
			sourceUrl: this.getSourceInfo(this.ceriSearchResultObject['ticket_symbol']).sourceUrl,
			sourceType: this.getSourceInfo(this.ceriSearchResultObject['ticket_symbol']).sourceType,
			docId: this.getSourceInfo(this.ceriSearchResultObject['ticket_symbol']).docId
		},
		{
			label: 'Swift Codes',
			value: this.getSourceInfo(this.ceriSearchResultObject['swift_code']).value,
			source: this.getSourceInfo(this.ceriSearchResultObject['swift_code']).source,
			sourceUrl: this.getSourceInfo(this.ceriSearchResultObject['swift_code']).sourceUrl,
			sourceType: this.getSourceInfo(this.ceriSearchResultObject['swift_code']).sourceType,
			docId: this.getSourceInfo(this.ceriSearchResultObject['swift_code']).docId
		},
	];
	this.reportv2Data['party_information'] = chunk(party_information_data, 2);
	var party_address_details_data = [
		{
			label: 'Street Name and Number',
			value: this.getSourceInfo(this.ceriSearchResultObject['streetAddress']).value,
			source: this.getSourceInfo(this.ceriSearchResultObject['streetAddress']).source,
			sourceUrl: this.getSourceInfo(this.ceriSearchResultObject['streetAddress']).sourceUrl,
			sourceType: this.getSourceInfo(this.ceriSearchResultObject['streetAddress']).sourceType,
			docId: this.getSourceInfo(this.ceriSearchResultObject['streetAddress']).docId
		},
		{
			label: 'ZIP Code/Postal Code',
			value: this.getSourceInfo(this.ceriSearchResultObject['zip']).value,
			source: this.getSourceInfo(this.ceriSearchResultObject['zip']).source,
			sourceUrl: this.getSourceInfo(this.ceriSearchResultObject['zip']).sourceUrl,
			sourceType: this.getSourceInfo(this.ceriSearchResultObject['zip']).sourceType,
			docId: this.getSourceInfo(this.ceriSearchResultObject['zip']).docId
		},
		{
			label: 'City/Town',
			value: this.getSourceInfo(this.ceriSearchResultObject['city']).value.toString(),
			source: this.getSourceInfo(this.ceriSearchResultObject['city']).source,
			sourceUrl: this.getSourceInfo(this.ceriSearchResultObject['city']).sourceUrl,
			sourceType: this.getSourceInfo(this.ceriSearchResultObject['city']).sourceType,
			docId: this.getSourceInfo(this.ceriSearchResultObject['city']).docId
		},
		{
			label: 'Country',
			value: this.getSourceInfo(this.ceriSearchResultObject['country']).value,
			source: this.getSourceInfo(this.ceriSearchResultObject['country']).source,
			sourceUrl: this.getSourceInfo(this.ceriSearchResultObject['country']).sourceUrl,
			sourceType: this.getSourceInfo(this.ceriSearchResultObject['country']).sourceType,
			docId: this.getSourceInfo(this.ceriSearchResultObject['country']).docId
		},
		{
			label: 'Country Risk Level',
			value: this.reportv2Data['#CountryRisk'],
			source: '',
			sourceUrl: '',
			sourceType: '',
			docId: ''
		}
	];
	this.reportv2Data['Party_Address_Details'] = chunk(party_address_details_data, 2);
	var party_registration_details_data = [
		{
			label: 'Trade Registration',
			value: this.getSourceInfo(this.ceriSearchResultObject['trade_register_number']).value,
			source: this.getSourceInfo(this.ceriSearchResultObject['trade_register_number']).source,
			sourceUrl: this.getSourceInfo(this.ceriSearchResultObject['trade_register_number']).sourceUrl,
			sourceType: this.getSourceInfo(this.ceriSearchResultObject['trade_register_number']).sourceType,
			docId: this.getSourceInfo(this.ceriSearchResultObject['trade_register_number']).docId
		},
		{
			label: 'TIN/VAT',
			value: this.getSourceInfo(this.ceriSearchResultObject['vat_tax_number']).value,
			source: this.getSourceInfo(this.ceriSearchResultObject['vat_tax_number']).source,
			sourceUrl: this.getSourceInfo(this.ceriSearchResultObject['vat_tax_number']).sourceUrl,
			sourceType: this.getSourceInfo(this.ceriSearchResultObject['vat_tax_number']).sourceType,
			docId: this.getSourceInfo(this.ceriSearchResultObject['vat_tax_number']).docId
		},
		{
			label: 'LEI',
			value: this.getSourceInfo(this.ceriSearchResultObject['legal_entity_identifier']).value.toString(),
			source: this.getSourceInfo(this.ceriSearchResultObject['legal_entity_identifier']).source,
			sourceUrl: this.getSourceInfo(this.ceriSearchResultObject['legal_entity_identifier']).sourceUrl,
			sourceType: this.getSourceInfo(this.ceriSearchResultObject['legal_entity_identifier']).sourceType,
			docId: this.getSourceInfo(this.ceriSearchResultObject['legal_entity_identifier']).docId
		},
		{
			label: 'Date of Incorporation',
			value: this.getSourceInfo(this.ceriSearchResultObject['isIncorporatedIn']).value,
			source: this.getSourceInfo(this.ceriSearchResultObject['isIncorporatedIn']).source,
			sourceUrl: this.getSourceInfo(this.ceriSearchResultObject['isIncorporatedIn']).sourceUrl,
			sourceType: this.getSourceInfo(this.ceriSearchResultObject['isIncorporatedIn']).sourceType,
			docId: this.getSourceInfo(this.ceriSearchResultObject['isIncorporatedIn']).docId
		},
		{
			label: 'ISIN #',
			value: this.getSourceInfo(this.ceriSearchResultObject['international_securities_identifier']).value,
			source: this.getSourceInfo(this.ceriSearchResultObject['international_securities_identifier']).source,
			sourceUrl: this.getSourceInfo(this.ceriSearchResultObject['international_securities_identifier']).sourceUrl,
			sourceType: this.getSourceInfo(this.ceriSearchResultObject['international_securities_identifier']).sourceType,
			docId: this.getSourceInfo(this.ceriSearchResultObject['international_securities_identifier']).docId
		},
		{
			label: 'Phone #',
			value: this.getSourceInfo(this.ceriSearchResultObject['tr-org:hasHeadquartersPhoneNumber']).value,
			source: this.getSourceInfo(this.ceriSearchResultObject['tr-org:hasHeadquartersPhoneNumber']).source,
			sourceUrl: this.getSourceInfo(this.ceriSearchResultObject['tr-org:hasHeadquartersPhoneNumber']).sourceUrl,
			sourceType: this.getSourceInfo(this.ceriSearchResultObject['tr-org:hasHeadquartersPhoneNumber']).sourceType,
			docId: this.getSourceInfo(this.ceriSearchResultObject['tr-org:hasHeadquartersPhoneNumber']).docId
		}
	];
	this.reportv2Data['Registration_and_TAX_Details'] = chunk(party_registration_details_data, 3);
	var LegalQuestionnaire = this.generateReportData['#Profile Summary'] ? this.generateReportData['#Profile Summary'].map( (d:any)=> { return d.values }).flat() : [];
	this.reportv2Data['#LegalQuestionnaire'] = this.getJsonParse(LegalQuestionnaire).reverse();
	this.reportv2Data['associated_parties'] = this.screeningData.filter( (d:any)=> { return ((d.entity_id && d.entity_id === "orgChartParentEntity") && (find(EntityConstants.basicSharedObject.entites_renderedIn_chart, { 'name': d.name }))) });
	// sources of funds
	// var companyDocuments = jQuery.extend(true, [], this.companyAssociatedDocDetailsInfo);
  const companyDocuments = JSON.parse(JSON.stringify(this.companyAssociatedDocDetailsInfo));
	this.reportv2Data['sourcesOfFunds'] = companyDocuments.sort( (a:any, b:any) => {
		if (b.date && a.date) {
			let bdate:any = new Date(b.date);
			let adate:any = new Date(a.date);
			return bdate - adate;
		}
	});
	this.reportv2Data['sourcesOfFunds'] = this.reportv2Data['sourcesOfFunds'] ? this.reportv2Data['sourcesOfFunds'].filter( (d:any)=> {
		if (d.description) {
			return (d.description.includes('Annual') || d.description.includes('Annual Report') || d.description.includes('Annual Return') || d.description.includes('BVD') || d.description.includes('BA'))
		}
	}) : [];
	this.reportv2Data['sourcesOfFunds'] = this.reportv2Data['sourcesOfFunds'] && this.reportv2Data['sourcesOfFunds'].length ? [this.reportv2Data['sourcesOfFunds'][0]] : [];
	this.reportv2Data['ubo_greater_threshold'] = this.screeningData.some( (d:any)=> {
		return (d.Ubo_ibo && d.Ubo_ibo.toLowerCase().trim() === "ubo") && (d.indirectPercentage && d.indirectPercentage > this.sliderUtilitesobj.sliderMinValue);
	});
	if (this.generateReportData['#Complex Ownership Structure']) {
		var complex_structure = this.generateReportData['#Complex Ownership Structure'].find( (d:any)=> { return d.key == 'Which of the following complex ownership parameters are identified.' });
		if (complex_structure) {
			this.reportv2Data['complex ownership structure'] = this.getJsonParse(complex_structure.values);
			this.reportv2Data['complex ownership structure'] = groupBy(this.reportv2Data['complex ownership structure'],  (d:any)=> { return d.questionName });
		} else {
			this.reportv2Data['complex ownership structure'] = [];
		}
	}
	if (this.generateReportData['#Party/Customer Product Information']) {
		var dataObj = this.generateReportData['#Party/Customer Product Information'].find( (d:any)=> { return d.key == 'High Risk Product' });
		if (dataObj && Object.keys(dataObj).length) {
			var parseData = this.getJsonParse(dataObj.values);
			const groupData = groupBy(parseData,  (d:any)=> { return d.questionName });
			this.reportv2Data['#Party/Customer Product Information'] = groupData
		} else {
			this.reportv2Data['#Party/Customer Product Information'] = [];
		}
		var dataAns = this.getCheckListAnswer(this.generateReportData['#Party/Customer Product Information'], 'Please provide the product related information if received from ING');
		this.reportv2Data['#Party/Customer_Product_InformationQuestionAns'] = dataAns ? dataAns.text : 'No';
	}
	if (this.generateReportData['#Party/Customer Activity – High Risk']) {
		var dataObj = this.generateReportData['#Party/Customer Activity – High Risk'].find( (d:any)=> { return d.key == 'Activity Type' });
		if (dataObj && Object.keys(dataObj).length) {
			var parseData = this.getJsonParse(dataObj.values);
			const groupData = groupBy(parseData,  (d:any)=> { return d.questionName });
			this.reportv2Data['#Party/Customer Activity – High Risk'] = groupData
		} else {
			this.reportv2Data['#Party/Customer Activity – High Risk'] = [];
		}
		var dataAns = this.getCheckListAnswer(this.generateReportData['#Party/Customer Activity – High Risk'], 'Does customer/party have any high-risk risk business activity as part of its portfolio');
		this.reportv2Data['#Party/Customer_Activity_High_RiskQuestionAns'] = dataAns ? dataAns.text : 'No';;
	}
	if (this.generateReportData['#UBO']) {
		var dataAns = this.getCheckListAnswer(this.generateReportData['#UBO'], 'Are there UBOs identified in the ownership structure?');
		this.reportv2Data['#UBO_Identified_in_ownership'] = dataAns ? dataAns.text : 'No';
	}
	if (this.generateReportData['#Main Principals']) {
		var dataAns = this.getCheckListAnswer(this.generateReportData['#Main Principals'], 'All the main principals identified?');
		this.reportv2Data['#Main_principals_question'] = dataAns ? dataAns.text : 'No';
	}
	if (this.generateReportData['#Principals']) {
		var dataAns = this.getCheckListAnswer(this.generateReportData['#Principals'], 'Is the entity incorporated in a high risk country?');
		this.reportv2Data['#Principals_question'] = dataAns ? dataAns.text : 'No';
	}
	if (this.generateReportData['#Screening']) {
		var dataAns = this.getCheckListAnswer(this.generateReportData['#Screening'], 'Are all the main principals/principals, UBO, associated/related parties screened against Sanctions & PEP lists ?');
		this.reportv2Data['#screeing_question'] = dataAns ? dataAns.text : 'No';
	}
	/* still to do */
	// this.reportv2Data['party_information'] = addingIsTackenScreenShotKey(this.reportv2Data['party_information'], 2);
	// this.reportv2Data['Party_Address_Details'] = addingIsTackenScreenShotKey(this.reportv2Data['Party_Address_Details'], 2);
	// this.reportv2Data['Registration_and_TAX_Details'] = addingIsTackenScreenShotKey(this.reportv2Data['Registration_and_TAX_Details'], 3);
	/* still to do */

}
generateReportPdf(){
	//$scope.$parent.pdfLoader = true;
	var reportAdverseObject:any = {};
	var reportAdverseNews:any = [];
	this.alertSummary = {
		pep: 0,
		sanction: 0,
		financeCrime: 0,
		adversenews: 0,
		total: 0
	};
	if (this.complianceRightAdverseNews.length > 0) {
		// var adversenews_link = jQuery.extend(this.complianceRightAdverseNews, [], true);
    var adversenews_link = JSON.parse(JSON.stringify(this.complianceRightAdverseNews));
    var entities = adversenews_link.map(function (val) {
			return val.name
		}).filter(function (value, index, self) {
			if (self.indexOf(value) === index) return value
		});
		for (var i = 0; i < entities.length; i++) {
			reportAdverseObject = {
				name: entities[i],
				news: adversenews_link.filter(function (value) {
					return value.name === entities[i]
				})
			}
			reportAdverseObject.company = reportAdverseObject.news.length > 0 ? reportAdverseObject.news[0].officersCompany : '';
			reportAdverseNews.push(reportAdverseObject);
		};
	}
	var show_sub = this.showSubsidaries;
	if (this.screeningData && this.screeningData.length > 0) {
		// this.screeningDataforReport = jQuery.extend(true, [], this.screeningData);
    this.screeningDataforReport = JSON.parse(JSON.stringify(this.screeningData));
		// this.screeningCheckedData = jQuery.extend(true, [], this.screeningData);
    this.screeningCheckedData = JSON.parse(JSON.stringify(this.screeningData));
    this.screeningDataforReport = this.screeningDataforReport.filter(function (d) {
			return (!d['no-screening']);
		});
		this.screeningCheckedData = this.screeningCheckedData.filter(function (d) {
			return (d['isChecked']);
		});
		this.screeningDataforReport.forEach((val, key)=>{
			val.anySanction__significant = false;
			val.anyPep_significant = false;
			val.officer_role = typeof val.officer_role === 'string' ? val.officer_role : uniq(uniq(val.officer_role).toString().split(','));
			val.pepUrldata = { name: [], count: 0 };
			val.sanctionUrldata = { name: [], count: 0 };
			val.reason = [];
			var reason = [];
			val.pep_url.forEach((d, i)=>{
				if (d.pep) {
					d.entries.forEach((d1, k)=>{
						val.anyPep_significant = true;
						// val.pepUrldata.name[d1.watchlist_id] = !val.pepUrldata.name[d1.watchlist_id] ? 1 : val.pepUrldata.name[d1.watchlist_id]+1;
						if (val.pepUrldata.name.indexOf(d1.watchlist_id) == -1) {
							val.pepUrldata.name.push(d1.watchlist_id);
						}
					})

				}
				if (d.reason) {
					reason.push(d.reason);
				}
				if (d.comments && d.comments.length > 0) {
					for (let i = 0; i < d.comments.length; i++) {
						if (d.comments[i].comment) {
							reason.push(d.comments[i].comment);
						}
					}//for loop ends
				}//comment if loop
			})
			val['sanction_bst:description'].forEach((d, i)=>{
				if (d.sanction) {
					d.entries.forEach((d1, k)=>{
						val.anySanction__significant = true;
						// val.sanctionUrldata.name[d1.watchlist_id] = !val.sanctionUrldata.name[d1.watchlist_id] ? 1 : val.sanctionUrldata.name[d1.watchlist_id]+1;
						if (val.sanctionUrldata.name.indexOf(d1.watchlist_id) == -1) {
							val.sanctionUrldata.name.push(d1.watchlist_id);
						}
					})

				}
				if (d.reason) {
					reason.push(d.reason);
				}
				if (d.comments && d.comments.length > 0) {
					for (let i = 0; i < d.comments.length; i++) {
						if (d.comments[i].comment) {
							reason.push(d.comments[i].comment);
						}
					}//for loop ends
				}//comment if loop
			})

			val.reason = uniq(reason);

		})

		this.screeningDataforReport = this.screeningDataforReport.filter( (val:any) =>{
			if (show_sub) {
				return val;
			} else {
				if (val.entity_id !== "orgChartsubEntity") {
					return val;
				}
			}
		});
		//here(d.pep) we are checking whether they are marked as significant or not
		this.alertSummary.pep = compact(flatMap(this.screeningDataforReport.map(function (d) { if (d.pep_url) { return d.pep_url } })).map( (d:any)=> { if (d.pep) { return d.pep } })).length;
		//here(d.sanction) we are checking whether they are marked as significant or not
		this.alertSummary.sanction = compact(flatMap(this.screeningDataforReport.map(function (d) {
			if (d && d['sanction_bst:description']) {
				return d['sanction_bst:description']
			}
		})).map(function (d:any) {
			if (d && d.sanction) {
				return d.sanction
			}
		})).length;
		this.alertSummary.financeCrime = compact(flatMap(this.screeningDataforReport.map(function (d) { if (d.finance_Crime_url) { return d.finance_Crime_url } }))).length;
		this.alertSummary.jurisdictions = compact(this.screeningDataforReport.map(function (d) { return d.high_risk_jurisdiction && d.high_risk_jurisdiction.toLowerCase() == "high" })).length;
		//this.alertSummary.adversenews = compact(flatMap(this.generateReportofficernews.map(function(d){return d.news}))).length;
		this.alertSummary.adversenews = this.generateReportofficernews.length ? this.generateReportofficernews.length : 0;
		this.alertSummary.total = this.alertSummary.pep + this.alertSummary.sanction + this.alertSummary.financeCrime + this.alertSummary.jurisdictions + this.alertSummary.adversenews;
	}
	if (!this.rootComponentData.genpactReportV2) {
		// this.worldComplianceLocationsOptionsForReport.width = $("#reportchartRefDiv").width();
    this.worldComplianceLocationsOptionsForReport.width = (document.querySelector("#reportchartRefDiv")as HTMLElement).offsetWidth;
		this.worldComplianceLocationsOptionsForReport.markers = this.tempOperationsForReport.map((val)=> {
			var obj = {name:val.country}
			return obj;
			})
	    this.entityCommonTabService.World(this.worldComplianceLocationsOptionsForReport,this.tempOperationsForReport);
	}
	if (!this.rootComponentData.complianceReport && !this.rootComponentData.genpactReportV2) { //if the compliance report is bst
		           //plotChart();
	}
	setTimeout( ()=> {

		// var mainNode  =  $("#vlaContainer").html();
		// var mainNode = $("#" + this.entitySearchResult.list.currentVLArendered).html();
		// $("#vlaContainer1").html(mainNode);//copying the html to another div as we might lose the content when teh chart is loading
		// $("#vlaContainer1").find(".placeholder.orgdiagram").attr("id", "ownershipStructChartOrgDiagram");
    var mainNode = document.getElementById(this.entitySearchResult.list.currentVLArendered).innerHTML;
    document.getElementById("vlaContainer1").innerHTML = mainNode;
    document.getElementById("vlaContainer1").querySelector(".placeholder.orgdiagram").setAttribute("id", "ownershipStructChartOrgDiagram");
    var node = document.getElementById("ownershipStructChartOrgDiagram");
		if (node) {
			domtoimage.toPng(node).then( (dataUrl)=> {
				// var img = new Image();
				// img.src = dataUrl;
				// $("#vlaContainer1").html("");
				// $('#corporate_structure_diagram').html(img);
				// $('#corporate_structure_diagram').find("img").addClass("img-responsive").css("margin", "auto");
				// this.$parent.pdfLoader = false;
				// this.$apply();
				this.complexImg  =dataUrl;
				var getNews_name = this.generateReportofficernewsByGroup.map(function (d) { return d.key });
				getNews_name.map( (d)=> {
				/*	$('.highlightWordSpan').highlight(d, {
						class: "report_highlight_text"
					});*/
          document.querySelectorAll('.highlightWordSpan').forEach(function(element) {
            element.classList.add("report_highlight_text");
          });
				});
			/*	if (typeof currentDocID === undefined) {
					$("#questionnaireReportDiv").css("display", "block");
				} else {
					$("#questionnaireReportDiv").css("display", "none");
				}*/
        if (typeof currentDocID === undefined) {
          (document.querySelector("#questionnaireReportDiv")as HTMLElement).style.display = "block";
        } else {
          (document.querySelector("#questionnaireReportDiv")as HTMLElement).style.display = "none";
        }
				// var dataTopics_report = jQuery.extend(true, [], []);//this.TopicKPIData
				var dataTopics_report = [];
				var colorsObj = {
					"unevaluated": "rgb(150, 165, 162)",
					"met": "#6892b4",
					"not met": "#d28085",
					"overachieved": "#6892b4",
					"underachieved": "#d28085",
					"no info": "#667f8b",
					"not applicable": "#667f8b"
				}
				dataTopics_report.forEach((val, key )=> {
					val.values.map( (d:any) =>{
						d.key = (d.key == 'not_met_at_all' || d.key == 'not_met') ? 'not met' : d.key;
						d.value = d.values.length;
						d.doc_count = d.values.length;
					});
					this.entityCommonTabService.InitializeandPlotPie(val.values, 'topicSummaryPie_' + key, colorsObj, '', true,false,false);
				});

				setTimeout( () =>{
					this.is_dom_img = true;
					this.complianceReportTemplate(this.ceriSearchResultObject['vcard:organization-name'].value);
				}, 1000);

			}).catch( (error) =>{
				setTimeout( ()=> {
					var getNews_name = this.generateReportofficernewsByGroup.map( (d)=> { return d.key });
					/*if ($('.highlightWordSpan').length) {
						getNews_name.map( (d)=> {
							$('.highlightWordSpan').highlight(d, {
								class: "report_highlight_text"
							});
						});
					}
					if ($("#report_generation_div").find(".sticky-link-popover").length) {
						$("#report_generation_div").find(".sticky-link-popover").remove();
					}*/
          if (document.querySelectorAll('.highlightWordSpan').length) {
            getNews_name.map(d => {
              document.querySelectorAll('.highlightWordSpan').forEach(element => {
                element.classList.add("report_highlight_text");
              });
            });
          }
          if (document.querySelector('#report_generation_div').querySelectorAll(".sticky-link-popover").length) {
            document.querySelectorAll('#report_generation_div .sticky-link-popover').forEach(element => {
              element.parentNode.removeChild(element);
            });
          }
				this.is_dom_img = true;
				this.complianceReportTemplate(this.entitySearchResult.name);
				}, 1000);
			});
		} else {
			setTimeout( ()=> {
				var getNews_name = this.generateReportofficernewsByGroup.map(function (d) { return d.key });
			/*	if ($('.highlightWordSpan').length) {
					getNews_name.map(function (d) {
						$('.highlightWordSpan').highlight(d, {
							class: "report_highlight_text"
						});
					});
				}
				if ($("#report_generation_div").find(".sticky-link-popover").length) {
					$("#report_generation_div").find(".sticky-link-popover").remove();
				}*/
        if (document.querySelectorAll('.highlightWordSpan').length) {
          getNews_name.map(function (d) {
            document.querySelectorAll('.highlightWordSpan').forEach(function(element) {
              element.classList.add("report_highlight_text");
            });
          });
        }
        if (document.querySelector('#report_generation_div').querySelectorAll(".sticky-link-popover").length) {
          document.querySelectorAll('#report_generation_div .sticky-link-popover').forEach(function(element) {
            element.remove();
          });
        }
        this.is_dom_img = true;
			    this.complianceReportTemplate(this.entitySearchResult.name);
			}, 1000);
		}
	}, 100);
}
removeSntExt(val){
	if(val){
		var findIndexSnt = val.lastIndexOf(".");
		if(findIndexSnt !== -1){
			val = val.slice(0,findIndexSnt);
			return val;
		}
	}
}
addhttpProtocol(val){
	var httpUrl = '';
	if(val && !val.match(/^[a-zA-Z]+:\/\//)){
		httpUrl = this.window.location.protocol + '//' + val;
		return httpUrl;
	}else{
		return val;
	}
}

complianceReportTemplate(entytiName) {
	setTimeout(()=>{
		// if( (!$("#report_generation_div")  || isEmpty($("#report_generation_div")) || $("#report_generation_div").length === 0 )
		// && this.is_dom_img)
    if ((!document.getElementById('report_generation_div') || isEmpty(document.querySelectorAll("#report_generation_div")) || document.querySelectorAll('#report_generation_div').length === 0) && this.is_dom_img)
    {
			this.complianceReportTemplate(entytiName);
			return ;
		}
		// var divContent = $("#report_generation_div").html();
    var divContent = document.querySelector("#report_generation_div").innerHTML;
		var printWindow = this.window.open('', '', 'height=600,width=1000');
		printWindow.document.write('<html><head><title>Compliance Report</title>');
		printWindow.document.write('<script src="../vendor/jquery/js/jquery.min.js"></script>');
		printWindow.document.write('<link href="http://localhost:4200/assets/css/entity/entity-report-styles.css" rel="stylesheet">');
		printWindow.document.write('<link href="http://localhost:4200/assets/css/entity/entity-reportv2-style.css" rel="stylesheet">');
		printWindow.document.write('<link href="http://localhost:4200/assets/css/entity/entity-styles.css" rel="stylesheet">');
		printWindow.document.write('<link href="../vendor/jquery/css/flag-icon.min.css" rel="stylesheet">');
		//printWindow.document.write('<link href="../entity/assets/css/font-awesome.css" rel="stylesheet">');
		printWindow.document.write('<style>@font-face {font-family: opensans-light;src: url(/assets/fonts/open-sans/OpenSans-Light.ttf);}</style>');
		if (true) {
			printWindow.document.write('</head><body style="position: relative;padding-top: 0!important;">');
		} else {
			printWindow.document.write('</head><body oncontextmenu="return false;" style="position: relative;padding-top: 0!important;">');
			printWindow.document.onkeydown = function (e:any) {
				if (e.keyCode == 123) {
					return false;
				}
				if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
					return false;
				}
				if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
					return false;
				}
				if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
					return false;
				}
				if (e.ctrlKey && e.keyCode == 80) {
					return false;
				}
			}
		}
		printWindow.document.write(divContent);
		printWindow.document.write('</body>');
		printWindow.document.write('</html>');
		// printWindow.document.close();
		if (true) {
			setTimeout(function () {
				//printWindow.print();
				document.getElementById("disableGenerateReportComponent").click();
				this.is_dom_img = false;
				let ele:any = document.getElementById("generateReport")
				ele.classList.remove("c-ban");
				ele.disabled = false;
			}, 15000);

		}
	},10000)

}

/* @purpose:To map the country based on country code in the Report
	*
	* @created: 7 June 2019
	* @params: type(string)
		* @returns country name.
	* @author: Amarjith*/
  getCountryName(countryCode, fromNode) {
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
 toTitleCase(str){
	if (str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}
 }

 calculateCountryRiskForReport(country) {
	var captialCaseCountry = this.toTitleCase(country);
	var risk;
	if (captialCaseCountry) {
		//	d3.json("./constants/countryrisk.json", function (error, root) {
		risk = find(EntityConstants.chartsConst.countryRisk.countryRisk, ['COUNTRY', captialCaseCountry.toUpperCase()]);
		if (risk) {
			return risk["FEC/ESR Risk Level"];
		} else {
			return '';
		}
	}
}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public trackByValue(_, item): string {
    return item.value;
  }
  public trackByLabelAndValue(_, item): string {
    return item.label + item.value;
  }
  public trackByDocId(_, item) {
    return item.docId || item;
  }
}
