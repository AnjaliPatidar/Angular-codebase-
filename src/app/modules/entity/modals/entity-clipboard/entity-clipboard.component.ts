import { Component, OnInit, AfterViewInit, ElementRef, Inject } from '@angular/core';
import { AppConstants } from '@app/app.constant';
import { EntityConstants } from '../../constants/entity-company-constant';
import { TopPanelConstants } from '../../constants/top-panel-constants'
import { EntityCommonTabService } from '../../services/entity-common-tab.service';
import { EntityFunctionService } from '../../services/entity-functions.service';
import { TopPanelApiService } from '../../services/top-panel-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddMediaModalComponent } from '../add-media-modal/add-media-modal.component';
import { GetNotesNameModalComponent } from '../get-notes-name-modal/get-notes-name-modal.component'
import { GraphchangesourceconfirmationComponent } from '../../modals/graphchangesourceconfirmation/graphchangesourceconfirmation.component';
import { WINDOW } from '../../../../core/tokens/window';
declare var $: any;
declare var saveAs: any;
@Component({
	selector: 'app-entity-clipboard',
	templateUrl: './entity-clipboard.component.html',
	styleUrls: ['./entity-clipboard.component.scss']
})
export class EntityClipboardComponent implements OnInit, AfterViewInit {
	public filterFiles = "";
	public showMyEntityClipboard = false;
	public sticky_selected_type = '';
	public sticky_selected_section = '';
	//public entityselection = '';
	public showMyClipboard = false;
	public isFromEntitySection = TopPanelConstants.isFromEntitySection;
	public isUploadFromEntitySection = TopPanelConstants.isUploadFromEntitySection;
	public pageMydocumentSticky = 1;
	public pageMydocumentUploaded = 1;
	public pageMysharedSticky = 1;
	public pageMysharedUploaded = 1;
	public stickydocTotalLength;
	public shareddocTotalLength;
	public uploaddocTotalLength;
	public loadDocument = true;
	public documents = [];
	public mydocumentUploaded = [];
	public caseId;
	public totalDocumentLength;
	public mysharedUploaded;
	public mysharedUploadedLength;
	public stickydocLength;
	public mydocumentStickyLength;
	public mydocumentSticky;
	public evidenceReportAddToPageFromclipLength;
	public mydocumentUploadedLength;
	public evidenceReportAddToPageFromclip;
	public documentListsData_Clip: any;
	public OpenNoteForm: any = "noteForm";
	public mysharedSticky;
	public mysharedStickyLength;
	public source_link_val = '';
	public documentId;
	public sourcelink_title = '';
	public selected_doc_docId = '';
	public stickySavedText = '';
	public stickyNoteContent: any;
	public current_link;
	public curr_title;
	public dataPopObjectEntityClipBoard = {
		overideSearchedInputSourceEdit: '',
		overideSearchedInputURLEdit: '',
		overideSearchedInputDateEdit: '',
		selectedSourceTitle: '',
		srctype: ''
	};
	public overideSearchedInputDateEdit = "";
	public popover_open = false;
	public showAddNew;
	public fiteredSourceListEntityClipBoard = [];
	public sourceUrlListEntityClipBoard;
	public showfiteredSourceListEntityClipBoard;
	public doc;
	public addMediaPreloader = false;

	queryParams: any;
	public overideSearchedInputSourceEditValEntityClipBoard: any;
	public evidenceDocumentsListsData_clip: any = [];
	public source_list_clipboard_for_edit = [];
	public source_list_clipboard: any = [];
	public clipBoardObject: any = { modal_postion: { top: '', left: '' }, file_wraper: '' };
	public loadDocumentContent  = true;
	constructor(public entityFunctionService: EntityFunctionService,
		public entityCommonTabService: EntityCommonTabService,
		public topPanelApiService: TopPanelApiService,
		public modalService: NgbModal,
		public stickyNote: ElementRef,
		@Inject(WINDOW) private readonly window: Window
	) { }
	// @ViewChild("stickyNote",{static:true}) set content(content: ElementRef) {
	// 	this.stickyNote = content;
	//  };
	ngOnInit() {

		this.queryParams = this.entityFunctionService.getParams();
		this.entityClipboard();
		this.getAllDocuments();
		this.getListOfDocuments('', '');

		let ehubObject = {
			userId: 1
		}
		this.window.localStorage.setItem('ehubObject', JSON.stringify(ehubObject));
		//this.entityClipboardSizeandPosition();
		this.source_list_clipboard = jQuery.extend(true, [], TopPanelConstants.sourceListData);
		this.source_list_clipboard_for_edit = jQuery.extend(true, [], TopPanelConstants.sourceListData);
	}
	entityClipboard() {
		if (TopPanelConstants.entityselection) {
			this.showMyEntityClipboard = false;
		}
		this.showMyEntityClipboard = !this.showMyEntityClipboard;
		this.showMyClipboard = false;
		// TopPanelConstants.isFromEntitySection = false;
		// this.isUploadFromEntitySection = false;
		// TopPanelConstants.entityselection = '';
		this.clipBoardObject.modal_postion = { top: '116px', left: '' };
		// this.clipBoardObject.file_wraper = '';
		$(".popover-inner").parent().addClass("d-none");
	}
	entityClipboardSizeandPosition(event, section, type) {
		this.clipBoardObject.file_wraper = 'clipboard_entity_file_wraper';
		this.showMyEntityClipboard = !TopPanelConstants.entityselection ? true : (section === TopPanelConstants.entityselection && this.sticky_selected_type === type) ? false : ((section === TopPanelConstants.entityselection && this.sticky_selected_type !== type) ? true : (section !== TopPanelConstants.entityselection && this.sticky_selected_type !== type ? true : false));
		if (!TopPanelConstants.entityselection || (this.sticky_selected_type !== type && section === TopPanelConstants.entityselection)) {
			setTimeout(function () {
				this.showMyEntityClipboard = true;
				// this.$apply(function () {
				// });
			}, 0);
			TopPanelConstants.entityselection = section;
		} else if (section !== TopPanelConstants.entityselection) {
			this.showMyEntityClipboard = false;
			TopPanelConstants.entityselection = section;
			setTimeout(function () {
				this.showMyEntityClipboard = true;
				this.$apply(function () {
				});
			}, 0);
		} else if (section === TopPanelConstants.entityselection && this.sticky_selected_type === type) {
			setTimeout(function () {
				this.$apply(function () {
					this.showMyEntityClipboard = false;
				});
			}, 0);
			this.sticky_selected_type = '';
			this.sticky_selected_section = '';
			TopPanelConstants.entityselection = '';
		} else {
			this.showMyEntityClipboard = false;
			this.sticky_selected_type = '';
			this.sticky_selected_section = '';
			TopPanelConstants.entityselection = '';
		}
		this.sticky_selected_type = type;
		// if ($("#entityWrapper").width() && $("#entityWrapper").width() > 0) {
		// 	this.clipBoardObject.modal_postion.top = (event.pageY + 262) + 'px';
		// 	this.clipBoardObject.modal_postion.left = (event.pageX - 270) + 'px';
		// 	var p = $(".entity-page")
		// 	var position = p.offset();
		// 	var tooltipWidth = $("#entityWrapper").width() + 50
		// 	var cursor = event.pageX;
		// 	if ((position.left < event.pageX) && (cursor > tooltipWidth)) {
		// 		this.clipBoardObject.modal_postion.top = (position.top + 262) + 'px';
		// 		this.clipBoardObject.modal_postion.left = (event.pageX - 30 - ($("#entityWrapper").width() / 2)) + 'px';
		// 	} else {
		// 		this.clipBoardObject.modal_postion.top = (position.top + 262) + 'px';
		// 		this.clipBoardObject.modal_postion.left = (event.pageX - 20) + 'px';
		// 	}
		// } else {
		// 	setTimeout(() => {
		// 		var p = $(".entity-page")
		// 		var position = p.offset();
		// 		var tooltipWidth = $("#entityWrapper").width() + 50;
		// 		this.clipBoardObject.modal_postion.top = (position.top + 262) + 'px';
		// 		this.clipBoardObject.modal_postion.left = (event.pageX - 270) + 'px';
		// 		var cursor = event.pageX;
		// 		if ((position.left < event.pageX) && (cursor > tooltipWidth)) {
		// 			this.clipBoardObject.modal_postion.left = (event.pageX - 30 - ($("#entityWrapper").width() / 2)) + 'px';
		// 		} else {
		// 			this.clipBoardObject.modal_postion.left = (event.pageX - 20) + 'px';
		// 		}
		// 	}, 0);
		// }
	}
	/*
   * @purpose : Get all documents list
   * @author : Amarjith Kumar
   * @Date : 30-March-2019
   */
	getAllDocuments() {
		var params = {
			"token": AppConstants.Ehubui_token,
			"pageNumber": 1,
			"orderIn": 'desc',
			"orderBy": 'uploadedOn',
			"recordsPerPage": 9,
			"entityId": this.queryParams['query']
		};
		this.documentListsData_Clip = [];
		//return new Promise(function (resolve, reject) {
		this.topPanelApiService.getAllDocuments(params).subscribe((res: any) => {

			this.getSuccessReportDocuments(res.paginationInformation.totalResults, 'docs');

			this.getEvidenceListDocs(params);
			//resolve(true);
			this.loadDocument = false;
		})
		// 	.catch(function (err) {
		// 		reject(false);
		// 	});
		// });
	}
	getSuccessReportDocuments(pagerecords, docOrSticky) {
		var params = {
			"token": AppConstants.Ehubui_token,
			"pageNumber": 1,
			"orderIn": 'desc',
			"orderBy": 'uploadedOn',
			"recordsPerPage": pagerecords,
			"entityId": this.queryParams['query']
		};
		var params3 = {
			"token": AppConstants.Ehubui_token,
			"docFlag": 6,
			"pageNumber": 1,
			"orderIn": 'desc',
			"orderBy": 'uploadedOn',
			"recordsPerPage": pagerecords,
			"entityId": this.queryParams['query']
		};

		if (docOrSticky === 'docs') {
			// return new Promise(function (resolve, reject) {
			this.topPanelApiService.getAllDocuments(params).subscribe((res: any) => {
				if (res && res.result && res.result.length) {
					res.result.forEach((val, key) => {
						val.source_type = val.type || 'doc';
						val.sourceName = val.title || val.docName;
					});
					this.documentListsData_Clip = res.result;
					this.source_list_clipboard = this.source_list_clipboard.concat(this.documentListsData_Clip);
					this.source_list_clipboard_for_edit = this.source_list_clipboard_for_edit.concat(this.documentListsData_Clip);
				}
				// resolve(true);
			})
			// .catch(function (err) {
			// 	reject(false);
			// });
			// });
		}
		else if (docOrSticky === "evidence_docs") {
			// return new Promise(function(resolve, reject) {
			this.topPanelApiService.getAllDocuments(params3).subscribe((res: any) => {
				res.result.forEach((val, key) => {
					val.source_type = val.type || 'png';
					val.sourceName = val.title || val.docName;
				});
				this.evidenceDocumentsListsData_clip = res.result;

				this.source_list_clipboard = this.source_list_clipboard.concat(this.evidenceDocumentsListsData_clip);
				this.source_list_clipboard_for_edit = this.source_list_clipboard_for_edit.concat(this.evidenceDocumentsListsData_clip);
				// resolve(true);
			})
			// 	.catch(function(err){

			// 		reject(false);
			// 	});
			// });
		}
	}
	/*
	* @purpose : Get all evidence documents list
	* @author : karnakar
	* @Date : 01-july-2019
	*/

	getEvidenceListDocs(paramFromApiFunc) {
		var params = paramFromApiFunc;
		params.docFlag = 6;
		this.documentListsData_Clip = [];
		//return new Promise(function(resolve, reject) {
		this.topPanelApiService.getAllEvidenceDocuments(params).subscribe((res: any) => {
			this.getSuccessReportDocuments(res.paginationInformation.totalResults, 'evidence_docs');
			//resolve(true);
		})
		//});
	}
    /*
     * @purpose: Get all mysticky notes and uploaded document
     * @created: 1 april 2018
     * @return: no
     * @author: varsha
     */

	getListOfDocuments(event, orderIn) {
		this.loadDocument = true;
		this.documents = [];
		this.mydocumentUploaded = [];
		var params2;
		if (orderIn != undefined && orderIn != "") {
			params2 = {
				"token": AppConstants.Ehubui_token,
				"docFlag": 5,
				"pageNumber": this.pageMydocumentSticky,
				"orderIn": orderIn,
				"orderBy": 'uploadedOn',
				"recordsPerPage": 9,
				"entityId": this.queryParams['query']
			};
		} else {
			params2 = {
				"token": AppConstants.Ehubui_token,
				"docFlag": 5,
				"pageNumber": this.pageMydocumentSticky,
				"orderIn": 'desc',
				"orderBy": 'uploadedOn',
				"recordsPerPage": 9,
				"entityId": this.queryParams['query']
			};
		}
		if (this.caseId != undefined) {
			params2["caseId"] = this.caseId;
		}
		if (TopPanelConstants.entityselection) {
			params2["docSection"] = TopPanelConstants.entityselection;
		}
		this.topPanelApiService.getAllDocuments(params2).subscribe((response2: any) => {
			this.stickydocLength = response2.paginationInformation.totalResults;
			this.stickydocTotalLength = response2.paginationInformation.totalResults;
			this.mydocumentStickyLength = response2.paginationInformation.totalResults;
			if (!TopPanelConstants.entityselection && response2.result.length > 0) {
				this.mydocumentSticky = response2.result.filter((val) => {
					return !val.docSection;
				});
			} else {
				this.mydocumentSticky = response2.result;

			}
			this.documents = response2.result;
			var params3 = {
				"token": AppConstants.Ehubui_token,
				"pageNumber": this.pageMydocumentUploaded,
				"recordsPerPage": 9,
				"orderBy": 'uploadedOn',
				"orderIn": 'desc',
				"entityId": this.queryParams['query']
			};
			if (orderIn != undefined && orderIn != "") {
				params3.orderIn = orderIn;
			}

			if (this.caseId != undefined) {
				params3["caseId"] = this.caseId;
			}
			if (TopPanelConstants.entityselection) {
				params3["docSection"] = TopPanelConstants.entityselection;
			}
			this.topPanelApiService.getAllDocuments(params3).subscribe((response3: any) => {
				this.uploaddocTotalLength = response3.paginationInformation.totalResults;
				this.mydocumentUploadedLength = response3.paginationInformation.totalResults;
				if (!TopPanelConstants.entityselection && response3.result.length > 0) {
					this.mydocumentUploaded = response3.result.filter((val) => {
						return !val.docSection;
					});
				} else {
					this.mydocumentUploaded = response3.result;

				}
				this.documents = $.merge($.merge([], this.documents), response3.result);
				this.loadDocument = false;
				this.totalDocumentLength = this.stickydocTotalLength + this.uploaddocTotalLength;
				//                getAllSharedDocument(this.documents, orderIn);
				var params4 = {
					"token": AppConstants.Ehubui_token,
					"docFlag": 6,
					"pageNumber": this.pageMydocumentUploaded,
					"orderIn": 'desc',
					"orderBy": 'uploadedOn',
					"recordsPerPage": 9,
					"entityId": this.queryParams['query']
				};
				this.topPanelApiService.getAllEvidenceDocuments(params4).subscribe((response4: any) => {
					this.uploaddocTotalLength = response4.paginationInformation.totalResults;
					this.evidenceReportAddToPageFromclipLength = response4.paginationInformation.totalResults;
					this.evidenceReportAddToPageFromclip = response4.result;
					this.evidenceReportAddToPageFromclip.forEach((val: any, key) => {
						if (val.docSection && TopPanelConstants.entityselection && (val.docSection == TopPanelConstants.entityselection)) {
							this.mydocumentUploaded.push(val);
						}
					});
					this.documents = $.merge($.merge([], this.documents), response4.result);
					this.loadDocument = false;
					this.totalDocumentLength = this.stickydocTotalLength + this.uploaddocTotalLength;
					//getAllSharedDocument(this.documents, orderIn);
				});
			});
		});
	}
	ngAfterViewInit() {
		$('body').off('click', '#entityClipboard', function (e) {
			e.stopPropagation();
			// this.getListOfDocuments(e);
		});
		$('#entityClipboard').unbind().click(function (e) {
			e.stopPropagation();
			// this.getListOfDocuments(e);
		});
	}
	/*
		 * @purpose: open add media modal
		 * @created: 20 sep 2017
		 * @params: null
		 * @return: no
		 * @author: swathi
		 */
	clipboardUploadFile = function () {

		// if (this.window.location.hash.indexOf("#!/") >= 0) {
		// 	var modalPath = '../scripts/common/modal/views/add.media.modal.html';
		// } else {
		// 	var modalPath = 'scripts/common/modal/views/add.media.modal.html';
		// }

		const AddMediaModalRef = this.modalService.open(AddMediaModalComponent,
			{
				windowClass: 'custom-modal upload-media-modal',
				backdrop: 'static',
				centered: true
			});


		AddMediaModalRef.result.then((response) => {
			this.getListOfDocuments();
		});
	};
	/*
	* @purpose: Create sticky Notes
	* @created: 30 mar 2018
	* @returns: no
	* @author: varsha
	*/

	createSticky() {
		const getNotesuibModalRef = this.modalService.open(GetNotesNameModalComponent,
			{
				windowClass: 'custom-modal sticky-prompt-modal',
				backdrop: 'static',
				centered: true
			});

		getNotesuibModalRef.result.then((response) => {
			if (response.status != 'close') {

				var getTitle = response.getTitle;
				if (response.status == 'sticky') {
					getTitle = getTitle + ".snt";
				}
				if (getTitle == '' || getTitle == undefined) {
					// HostPathService.FlashErrorMessage('ERROR', 'Please enter title');
				} else {
					this.addNewSticky(getTitle);
				}
			}
		});
	};
	/*
     * @purpose: Delete sticky/documents
     * @created: 25th April 2019
     * @params: null
     * @return: no
     * @author: Amritesh
     */

	deleteDoc(event, docId, documentObject) {
		event.stopPropagation();
		const getDeleteModalRef = this.modalService.open(GraphchangesourceconfirmationComponent,
			{

				backdrop: 'static',
				windowClass: 'custom-modal bst_modal update-entities-modal related-person-modal data-popup-wrapper',

			});
		getDeleteModalRef.componentInstance.purpose = 'deleteConfirmation';
		getDeleteModalRef.result.then((response) => {
			if (response == 'resData') {
				this.loadDocument = true;
				this.topPanelApiService.deleteEntityDocument(docId).subscribe((res: any) => {
					this.getListOfDocuments('', '');
					if (documentObject.type && documentObject.type.toLowerCase() !== 'snt') {
						this.saveAddtoPage(documentObject);
					}
					this.loadDocument = false;
				});
			}
		}), function (error) {
			this.loadDocument = false;
		};
	};


	saveAddtoPage(documentObject) {
		var srcName = documentObject.entitySource ? documentObject.entitySource : "";
		//    var srcName = TopPanelApiService.uploadFromScreenShotPopupUploadIcon.value ? TopPanelApiService.uploadFromScreenShotPopupUploadIcon.value.sourceName:"";
		this.topPanelApiService.deleteSourceAddtoPage(srcName, this.queryParams['query']).subscribe((response: any) => {
			//
			TopPanelConstants.uploadFromScreenShotPopupUploadIcon.deletedSrcObj = {};
			TopPanelConstants.uploadFromScreenShotPopupUploadIcon.deletedSrcObj.showHideScreenIcon = false;
			TopPanelConstants.uploadFromScreenShotPopupUploadIcon.deletedSrcObj.uploadedFileName = "";
			TopPanelConstants.uploadFromScreenShotPopupUploadIcon.deletedSrcObj.downloadLink = "";
			TopPanelConstants.uploadFromScreenShotPopupUploadIcon.deletedSrcObj.showUploadIcon = true;
			var addtopagedata = [{
				"entityId": this.queryParams['query'],
				"isAddToPage": false,
				"sourceName": TopPanelConstants.uploadFromScreenShotPopupUploadIcon.value ? TopPanelConstants.uploadFromScreenShotPopupUploadIcon.value.sourceName : "",
			}];
			this.topPanelApiService.saveSourcesAddToPage(addtopagedata).subscribe((res: any) => {
				TopPanelConstants.uploadFromScreenShotPopupUploadIcon.deletedSrcObj.showHideAddtoPage = false;
				// this.sourceWithBSTRegistry[TopPanelApiService.uploadFromScreenShotPopupUploadIcon.rowIndex].showHideAddtoPage = false;
				// this.sourceWithBSTRegistry[TopPanelApiService.uploadFromScreenShotPopupUploadIcon.rowIndex].showHideScreenIcon = false;


			}, function (err) {

			})
		}, function (error) {
		})



	}
	/* * @purpose: Icon path for different dashboard *
     *   @created: 03 apr 2018
     *   @returns: no
     *   @author: varsha */

	pathChange(type) {
		if (this.window.location.hash.indexOf("#!/") < 0 && type != '	') {
			return true;
		}
	};
	/*  @purpose: full text search *
     *   @created: 03 apr 2018
     *   @returns: no
     *   @author: varsha */

	fullTextSearch(e) {
		if (e.target.value == '') {
			this.pageMydocumentSticky = 1;
			this.getListOfDocuments('', '');
		} else {
			var obj = {
				"token": AppConstants.Ehubui_token,
				"keyword": e.target.value,
				"entityId": this.queryParams['query'],
				"docFlag": 5
			};
			var obj2 = {
				"token": AppConstants.Ehubui_token,
				"searchKeyWord": e.target.value,
				"entityId": this.queryParams['query'],
				"docFlag": 5
			};
			var obj4 = {
				"token": AppConstants.Ehubui_token,
				"entityId": this.queryParams['query'],
				"searchKeyWord": e.target.value
			};
			var obj3 = {
				"token": AppConstants.Ehubui_token,
				"entityId": this.queryParams['query'],
				"keyword": e.target.value,
			};
			this.topPanelApiService.fullTextSearchDocument(obj).subscribe((response: any) => {
				this.mydocumentSticky = response.result;
				this.mydocumentStickyLength = response.paginationInformation.totalResults;
				this.topPanelApiService.fullTextSearchSharedDocument(obj2).subscribe((response2: any) => {
					this.mysharedSticky = response2.result;
					this.mysharedStickyLength = response2.paginationInformation.totalResults;
					this.documents = $.merge($.merge([], response.result), response2.result);
					this.topPanelApiService.fullTextSearchSharedDocument(obj4).subscribe((response4: any) => {
						this.mysharedUploaded = response4.result;
						this.mysharedUploadedLength = response4.paginationInformation.totalResults;
						this.documents = $.merge($.merge([], this.documents), response4.result);
						this.topPanelApiService.fullTextSearchDocument(obj3).subscribe((response3: any) => {
							this.mydocumentUploaded = response3.result;
							this.mydocumentUploadedLength = response3.paginationInformation.totalResults;
							this.documents = $.merge($.merge([], this.documents), response3.result);
						});
					});
				});

			}, function (e) {
				//HostPathService.FlashErrorMessage('ERROR', e.responseMessage);
			});
		}
	};
	/*
     * @purpose: open sticky
     * @created: 30 mar 2018
     * @returns: no
     * @author: varsha
     */
	// var getNotesuibModalInstance;
	//    confirmDocument(status,sticky) {

	// 	else if(status == 'close'){
	// 	  this.NgbActiveModal.close('close');
	// 	  }
	//   };
	/*
	* @purpose: Upload sticky notes
	* @created: 30 mar 2018
	* @returns: no
	* @author: varsha
	*/

	addNewSticky(getTitle) {
		$('#documentTextEntity').val('').empty();

		var myBlob = new Blob([' '], {
			type: "text/plain"
		});
		var file = new File([myBlob], getTitle);
		this.loadDocument = true;
		this.uploadStickyNotes(file, getTitle)
		// .subscribe((res:any)=>{
		//     var stickyNotes = document.getElementById('stickyNotesEntity');
		//     $('#stickyNotesEntity').css('display', 'block');
		//     $('#documentTitleEntitySec').val(getTitle);
		//     if(getTitle.indexOf('.snt') !== -1){
		//     $('#documentTitleEntitySec').val(getTitle.split('.snt')[0]);
		//     }
		//     var  isFromEntitySection = TopPanelConstants.isFromEntitySection;
		//     if(!isFromEntitySection){
		//         stickyNotes.style.left = "-360px";
		//         stickyNotes.style.top = "25px";
		//     }else{
		//         stickyNotes.style.left = "100px";
		//         stickyNotes.style.top = "110px";
		//     }
		// }).catch(function(err){
		// });
		this.dragElement(document.getElementById(("stickyNotesEntity")));
	}
	/*
	   * @purpose: upload sticky notes
	   * @created: 09 mar 2018
	   * @params: file(object)
	   * @returns: no
	   * @author: swathi
	   */
	uploadStickyNotes(file, name) {
		var params = {
			"token": AppConstants.Ehubui_token,
			"fileTitle": name,
			"remarks": "",
			"docFlag": 5,
			"docName": name,
			"entityId": EntityConstants.queryParams.query,
			"entityName": EntityConstants.complianceObject["vcard:organization-name"].value,
			"entitySource": ""
		};
		var data = file;
		if (TopPanelConstants.entityselection) {
			params['docSection'] = TopPanelConstants.entityselection;
		}

		//return new Promise(function (resolve, reject) {
		this.topPanelApiService.uploadDocument(params, data).subscribe((response: any) => {
			this.documentId = response.docId;
			this.doc = response;
			this.doc.title = params.fileTitle;
			if (response) {
				var stickyNotes = document.getElementById('stickyNotesEntity');
				$('#stickyNotesEntity').css('display', 'block');
				$('#documentTitleEntitySec').val(name);
				if (name.indexOf('.snt') !== -1) {
					$('#documentTitleEntitySec').val(name.split('.snt')[0]);
				}
				var isFromEntitySection = TopPanelConstants.isFromEntitySection;
				if (!isFromEntitySection) {
					stickyNotes.style.left = "-360px";
					stickyNotes.style.top = "25px";
				} else {
					stickyNotes.style.left = "100px";
					stickyNotes.style.top = "110px";
				}
			}
			this.getListOfDocuments('', '');
			var data =
			{
				"subject": "upload sticky",
				"body": 'New sticky is created',
				"recipients": [TopPanelConstants.ehubObject.userId]
			};
			this.topPanelApiService.postNotification(data).subscribe(() => {
			}, function () {
			});
			// resolve(true);
			//this.NgbActiveModal.close('close');

		}, function () {
			this.addMediaPreloader = false;
			//reject(false);
			//HostPathService.FlashErrorMessage('ERROR', 'file format not supported');
		});
		//});

	}
	/* * @purpose: draggable sticky notes *
	*   @created: 11 apr 2018
	*   @returns: no
	*   @author: varsha */

	dragElement(elmnt) {
		var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
		if (document.getElementById(elmnt.id + "header")) {
			/* if present, the header is where you move the DIV from:*/
			document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
		} else {
			/* otherwise, move the DIV from anywhere inside the DIV:*/
			elmnt.onmousedown = dragMouseDown;
		}

		function dragMouseDown(e) {
			e = e || this.window.event;
			// get the mouse cursor position at startup:
			pos3 = e.clientX;
			pos4 = e.clientY;
			document.onmouseup = closeDragElement;
			// call a function whenever the cursor moves:
			document.onmousemove = elementDrag;
		}

		function elementDrag(e) {
			e = e || this.window.event;
			// calculate the new cursor position:
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;
			// set the element's new position:
			elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
			elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
		}

		function closeDragElement() {
			/* stop moving when mouse button is released:*/
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}
	/*
	   * @purpose: close sticky notes
	   * @created: 30 mar 2018
	   * @returns: no
	   * @author: varsha
	   */
	closeSticky() {
		$('#stickyNotesEntity').css('display', 'none');
		this.getListOfDocuments('', '');
		if (this.documentId) {
			if (!this.stickyNoteContent) {
				var texts = this.stickySavedText;
				this.stickyNoteContent = new File([texts], this.doc.title);
			}
			var file = this.stickyNoteContent;
			if (file) {
				this.updateStickyNotes(file, this.documentId);
			}
			this.stickyNoteContent = '';
		}
	};
	/*
	  * @purpose: update sticky notes
	  * @created: 30 mar 2018
	  * @params: file(object)
	  * @returns: no
	  * @author: varsha
	  */
	updateStickyNotes(file, id) {
		var params = {
			"token": AppConstants.Ehubui_token,
			"docId": id
		};
		var data = file;
		this.topPanelApiService.updateDocumentContent(params, data).subscribe(() => {
		}, function () { });
	}
	/*
	  * @purpose: auto save sticky title
	  * @created: 03 april 2018
	  * @returns: no
	  * @author: varsha
	  */

	stickyTitleAutoSave(e) {
		if (e.target.value == "") {
			this.updateDocumentTitle(this.doc, " ");
		} else {
			this.updateDocumentTitle(this.doc, e.target.value);
		}
	};
	updateDocumentTitle(doc, title) {
		var param = {
			"token": AppConstants.Ehubui_token,
			"docId": this.doc.docId,
			"title": title
		};
		this.topPanelApiService.updateDocumentTitle(param).subscribe(() => { }, function (e) {
			// HostPathService.FlashErrorMessage('ERROR UPDATE STICKY NOTES', e.responseMessage);
		});

	}

	sourceSearchInputOverideEntityClipBoard(value, type, event: KeyboardEvent) {
		this.fiteredSourceListEntityClipBoard = [];
		this.sourceUrlListEntityClipBoard = true;
		if (value === "") {
			this.sourceUrlListEntityClipBoard = false;
		}
		if (value) {
			this.showfiteredSourceListEntityClipBoard = true;
			this.source_list_clipboard.forEach((source) => {
				if (source && source.sourceName.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
					this.fiteredSourceListEntityClipBoard.push(
						{
							sourceName: source.sourceName ? source.sourceName : '',
							source_type: source.source_type ? source.source_type : ''
						});
				} else {
					this.showAddNew = true;
				}
			});
		} else {
			this.showAddNew = false;
			this.dataPopObjectEntityClipBoard.overideSearchedInputSourceEdit = '';
			this.dataPopObjectEntityClipBoard.overideSearchedInputURLEdit = '';
			this.dataPopObjectEntityClipBoard.overideSearchedInputDateEdit = '';
		}
		if (event.keyCode === 13) {
			if (this.fiteredSourceListEntityClipBoard && this.fiteredSourceListEntityClipBoard.length > 0) {
				this.fillSourceSearchedInputOverideEntityClipBoard(this.fiteredSourceListEntityClipBoard[0].sourceName, type);
				//this.updateCompanyDetails(output[0],obj,tabname);
			} else if (this.fiteredSourceListEntityClipBoard.length == 0) {
				//this.saveIndustryOption(obj,compkey);
				this.showAddNew = false;
				//this.updateCompanyDetails(value,obj,tabname);
			}
		}
		setTimeout(() => {
			$(".custom-list.auto-complete-list.searchSource").mCustomScrollbar({
				axis: "y",
				theme: "minimal-dark"
			});
		}, 0);
	}
	fillSourceSearchedInputOverideEntityClipBoard(value, type) {

		type = value.source_type ? value.source_type : '';
		if (value) {
			var sourceIndex = this.source_list_clipboard.findIndex((d: any) => {
				return d.sourceName == value.sourceName;
			});
			// this.showfiteredSourceList =false;
			this.dataPopObjectEntityClipBoard.overideSearchedInputSourceEdit = (this.source_list_clipboard[sourceIndex] && this.source_list_clipboard[sourceIndex].sourceName) ? this.source_list_clipboard[sourceIndex].sourceName : '';
			this.overideSearchedInputSourceEditValEntityClipBoard = (this.source_list_clipboard[sourceIndex] && this.source_list_clipboard[sourceIndex].sourceName) ? this.source_list_clipboard[sourceIndex].sourceName : '';
			this.dataPopObjectEntityClipBoard.srctype = '';
			if (type === 'link') {
				this.dataPopObjectEntityClipBoard.overideSearchedInputURLEdit = (this.source_list_clipboard[sourceIndex] && this.source_list_clipboard[sourceIndex].sourceUrl) ? this.source_list_clipboard[sourceIndex].sourceUrl : '';
				this.dataPopObjectEntityClipBoard.srctype = 'link';
			} else if (type === 'doc' || type === 'docx' || type === "png" || type === "pdf") {
				this.dataPopObjectEntityClipBoard.overideSearchedInputURLEdit = (this.source_list_clipboard[sourceIndex] && this.source_list_clipboard[sourceIndex].docName) ? this.source_list_clipboard[sourceIndex].docName : '';
				this.dataPopObjectEntityClipBoard.srctype = type;
				this.selected_doc_docId = this.source_list_clipboard[sourceIndex].docId;
			}
			this.dataPopObjectEntityClipBoard.overideSearchedInputDateEdit = (new Date(), 'yyyy-MM-dd');
		}
	};
	applySourceEvidenceEntityClipBoard(sourceData) { // href="'+selectedSourceLink+'"
		var source = sourceData;
		if (source && source.value && source.value.sourceURL) {
			var selectedSourceLink = source.value.sourceURL;
			this.sourcelink_title = this.dataPopObjectEntityClipBoard.selectedSourceTitle;
			var link_type = this.dataPopObjectEntityClipBoard.srctype;
			var sourceurlvalue = (link_type === 'link') ? selectedSourceLink : (this.dataPopObjectEntityClipBoard.overideSearchedInputURLEdit || this.dataPopObjectEntityClipBoard.overideSearchedInputSourceEdit);
			var target_blank = (link_type === 'link') ? ' target="_blank"' : '';
			if (link_type === 'link') {
				sourceurlvalue = this.addHttpProtoCol(sourceurlvalue);
			}
			var srcName = this.dataPopObjectEntityClipBoard.overideSearchedInputSourceEdit;
			var srcId = this.dataPopObjectEntityClipBoard.selectedSourceTitle;
			if (link_type !== 'link' && link_type !== 'png' && link_type !== 'jpg' && link_type !== 'jpeg' && link_type !== 'gif' && link_type !== 'tiff' && link_type !== 'bmp') {
				sourceurlvalue = sourceurlvalue.split(" ").join("_");
				sourceurlvalue = AppConstants.Ehub_Rest_API + 'documentStorage/downloadDocument?docId=' + this.selected_doc_docId + '&token=' + AppConstants.Ehubui_token;
				srcName = this.dataPopObjectEntityClipBoard.overideSearchedInputSourceEdit.split(" ").join("_");
				srcId = this.dataPopObjectEntityClipBoard.selectedSourceTitle.split(" ").join("_");
				target_blank = ' target="_blank"';
			}
			if (link_type === 'png' || link_type === 'jpg' || link_type === 'jpeg' || link_type === 'gif' || link_type === 'tiff' || link_type === 'bmp') {
				sourceurlvalue = '#' + sourceurlvalue.split(" ").join("_");
				srcName = this.dataPopObjectEntityClipBoard.overideSearchedInputSourceEdit.split(" ").join("_");
				srcId = this.dataPopObjectEntityClipBoard.selectedSourceTitle.split(" ").join("_");
			}
			var appendLinkText = this.stickySavedText +
				'<a class="editableDiv" sourceType= ' + link_type + ' href="' + (link_type === 'link' ? '' : '') + sourceurlvalue + '" id="source_' + srcId + '" ' + target_blank + ' sourcename=' + srcName + ' doc_id=' + this.selected_doc_docId + '><span id="sourcelinkname">' + this.dataPopObjectEntityClipBoard.selectedSourceTitle + '</span></a>';
			this.stickyNoteContent = new File([appendLinkText], this.doc.title);
			$('#documentTextEntity').html(appendLinkText);
			appendLinkText = '';
		}
		this.sourceUrlListEntityClipBoard = false;
		$(".sticky-link-popover").css("cssText", "display: none !important;");
		this.showCustomSourceLinkEditPopover();
		this.sendObjectFun(this.dataPopObjectEntityClipBoard)
	}
	addHttpProtoCol(val) {
		if (val && !val.match(/^[a-zA-Z]+:\/\//)) {
			var x = this.window.location.protocol + '//' + val;
			return x;
		} else {
			return val;
		}
	}
	sendObjectFun(data) {
		this.dataPopObjectEntityClipBoard = data;
	}
	showCustomSourceLinkEditPopover() {
		$('.editableDiv').on('keyup', (ev) => {
			if (ev.target.id == "sourceUrlId") {
				this.editSourceLinkEntityClipBoard(ev.target, ev.target.value)
			} else if (ev.target.id == "sourceNameId") {
				this.editSourceTitleEntityClipBoard(ev.target, ev.target.value)
			}
		});
		$('.editableDiv').on('click', (ev) => {
			if (ev.target.innerText == "Cancel") {
				this.closeSourceListEditPopUp()
			} else if (ev.target.innerText == "Apply") {
				this.updateStickySource(ev.target, ev.target.value)
			} else if (ev.target.id == "sourceIdndUrl") {
				this.editSelectedValue(ev.target)
			}
			$('#showPop').removeClass('d-none');
			ev.preventDefault();
			ev.stopPropagation();
			if ($(ev.target).attr('class') === 'editableDiv' || $(ev.target).parent().attr("class") === 'editableDiv') {
				$(ev.delegateTarget).find('#showPop').remove();
				if (!this.popover_open) {
					this.current_link = ev.delegateTarget['href'].split("//")[1] ? ev.delegateTarget['href'].split("//")[1] : ev.delegateTarget['href'].split("//")[0];
					let link_type = this.dataPopObjectEntityClipBoard.srctype ? this.dataPopObjectEntityClipBoard.srctype : ev.delegateTarget['sourceType'];
					// var sourceurlvalue = (link_type === 'link') ? selectedSourceLink :  (this.dataPopObjectEntityClipBoard.overideSearchedInputURLEdit || this.dataPopObjectEntityClipBoard.overideSearchedInputSourceEdit);
					this.dataPopObjectEntityClipBoard.srctype = link_type;
					this.current_link = (link_type === 'link') ? this.current_link : ev.delegateTarget['href'].split("#")[1];
					var id_index = ev.delegateTarget['id'].indexOf("_");
					this.sourcelink_title = ev.delegateTarget['id'].slice((id_index + 1), ev.delegateTarget['id'].length);

					this.source_link_val = this.current_link;
					this.current_link = $(ev.delegateTarget).attr("sourcename") || this.dataPopObjectEntityClipBoard.overideSearchedInputSourceEdit;
					this.curr_title = $(ev.delegateTarget).text();
					if (link_type !== 'link') {
						this.current_link = this.current_link.split("_").join(" ");
					}
					if (link_type !== 'link' && link_type !== 'png' && link_type !== 'jpg' && link_type !== 'jpeg' && link_type !== 'gif' && link_type !== 'tiff' && link_type !== 'bmp') {
						this.selected_doc_docId = $(ev.delegateTarget).attr("doc_id") ? $(ev.delegateTarget).attr("doc_id") : '';
					}
					if (link_type === 'png' || link_type === 'jpg' || link_type === 'jpeg' || link_type === 'gif' || link_type === 'tiff' || link_type === 'bmp') {
						this.selected_doc_docId = '';
					}
					// var current_xpos = ((ev.pageX - $('#stickyNotesEntity').offset().left) - 20) + 'px' ;
					// var current_ypos = (ev.pageY - $('#stickyNotesEntity').offset().top) + 'px';
					var parent_offset = $(ev.delegateTarget).parent().parent().offset();
					var child_offset = $(ev.delegateTarget).offset();
					var current_xpos = ((child_offset.left - parent_offset.left)) + 'px';
					var current_ypos = ((child_offset.top - parent_offset.top) + 67) + 'px';
					$(ev.delegateTarget).append(
						`<div id="showPop" (click)="$event.stopPropagation();" contenteditable="false" class="popover d-block bottom sticky-link-popover width-100 bottom-pop-wrapper mxh-none bottom-right" style="top:${current_ypos};left:${current_xpos};height: 180px;">
					<div class="arrow" style="top: -11px; left:30px; right: 6px;"></div>
					<div class="popover-inner  height-100">
						<div class="popover-content  height-100">
					<div class="width-100 p-rel height-100 d-block">
						<form class="form jc-sb pad-x0" name="form" autocomplete="off">
							<div class="bst_input_group p-rel bst_input_group_r  height-a">
								<input (keyup)="editSourceTitleEntityClipBoard(ev.delegateTarget)" id="sourceNameId" class="custom-input pad-r10 pad-l15 pad-t15 lh-18 height-a mar-r10" value="${this.curr_title}"/>
								<span class="label f-12 text-dark-cream">Title</span>
							</div>
							<div class="bst_input_group bst_input_group_r mar-t10 p-rel z-999 height-a">
								<input
									class="custom-input pad-r10 pad-l15 pad-t15 lh-18 height-a mar-r10"
									autocomplete="no-place"
									placeholder="source"
									(keyup)="editSourceLinkEntityClipBoard(ev.delegateTarget)"
									value="${this.current_link}"
									id="sourceUrlId"
									/>
								<span class="label f-12 text-dark-cream">Source</span>
								<ul class="custom-list searchSource z-99 mxh-140 l-0 pad-b35 pad-y10 item-1" style="display:none">

								</ul>
							</div>
							<div class="pad-x10 width-100 d-flex p-abs  b-0 ai-c mar-t10">
								<button type="button" class="btn mar-autol sm-btns mar-r10 bordered-button" (click)="closeSourceListEditPopUp();$event.stopPropagation()">Cancel</button>
								<button type="button" class="btn grad-button sm-btns" (click)="updateStickySource(ev.delegateTarget);$event.stopPropagation()">Apply</button>
							</div>
						</form>
					</div>
				</div></div></div>`
					);
					this.popover_open = true;
				} else {
					this.popover_open = false;
				}
			}
		});
	}
	stickyAutoSave(e) {
		/*jshint unused:false*/
		var myBlob = new Blob([' '], {
			type: "text/plain"
		});//e.target.value
		if (e.target.innerHTML == "") {
			this.stickyNoteContent = new File(["  "], this.doc.title);
		} else {
			var text = e.target.innerHTML;
			this.stickySavedText = e.target.innerHTML;
			this.stickyNoteContent = new File([text], this.doc.title);
			//this.stickyNoteContent = new File([e.target.value], this.doc.title);
		}
	};
	updateStickySource(that, value) {
		var link_type = this.dataPopObjectEntityClipBoard.srctype;
		var sourceHrefVal = '';
		if (link_type === 'link') {
			this.source_link_val = this.addHttpProtoCol(this.source_link_val);
			sourceHrefVal = this.source_link_val;
		}
		if (link_type !== 'link' && link_type !== 'png' && link_type !== 'jpg' && link_type !== 'jpeg' && link_type !== 'gif' && link_type !== 'tiff' && link_type !== 'bmp') {
			this.source_link_val = this.source_link_val ? this.source_link_val.split(" ").join("_") : '';
			sourceHrefVal = this.source_link_val;
			sourceHrefVal = AppConstants.Ehub_Rest_API + 'documentStorage/downloadDocument?docId=' + this.selected_doc_docId + '&token=' + AppConstants.Ehubui_token;
		}
		if (link_type === 'png' || link_type === 'jpg' || link_type === 'jpeg' || link_type === 'gif' || link_type === 'tiff' || link_type === 'bmp') {
			this.source_link_val = this.source_link_val.split(" ").join("_");
			sourceHrefVal = '#' + this.source_link_val;
		}
		$(that).closest("a#source_" + this.sourcelink_title).attr("href", (link_type === 'link' ? sourceHrefVal : (sourceHrefVal)));
		if (link_type !== 'link' && link_type !== 'png' && link_type !== 'jpg' && link_type !== 'jpeg' && link_type !== 'gif' && link_type !== 'tiff' && link_type !== 'bmp') {
			$(that).closest("a#source_" + this.sourcelink_title).attr('target', "_blank");
			$(that).closest("a#source_" + this.sourcelink_title).attr('doc_id', this.selected_doc_docId);
		} else if (link_type === 'png' || link_type === 'jpg' || link_type === 'jpeg' || link_type === 'gif' || link_type === 'tiff' || link_type === 'bmp') {
			$(that).closest("a#source_" + this.sourcelink_title).removeAttr('target', "_blank");
			$(that).closest("a#source_" + this.sourcelink_title).attr('doc_id', '');
		} else {
			$(that).closest("a#source_" + this.sourcelink_title).attr('target', "_blank");
			$(that).closest("a#source_" + this.sourcelink_title).attr('doc_id', '');
		}
		$(that).closest("a#source_" + this.sourcelink_title).find('#sourcelinkname').text($("#sourceNameId").val());
		$(that).closest("a#source_" + this.sourcelink_title).attr('id', ("source_" + $("#sourceNameId").val()));
		$(that).closest("a#source_" + this.sourcelink_title).attr('sourceType', link_type);
		$(that).closest("a#source_" + this.sourcelink_title).attr("sourcename", this.dataPopObjectEntityClipBoard.overideSearchedInputSourceEdit);
		this.sourcelink_title = $("#sourceNameId").val();

		$(that).closest('#showPop').remove();
		//this.source_link_val = '';
		this.popover_open = false;
		var appendLinkText = $("#documentTextEntity").html();
		this.stickyNoteContent = new File([appendLinkText], this.doc.title);
		// this.dataPopObjectEntityClipBoard.selectedSourceTitle = $("#sourceNameId").val();

	}
	/*
     * @purpose: Edit source title in sticky
     * @created: 12 july 2019
     * @returns: no
     * @author: karnakar
     */
	editSourceTitleEntityClipBoard(that, value) {
		var cur_title = value;
	}

	closeEntityClipboard() {
		//setTimeout(function () {
		//this.$apply( ()=> {
		TopPanelConstants.showMyEntityClipboard = false;
		this.showMyEntityClipboard = false;

		//});
		//}, 0);
	}
	/*
     * @purpose: Edit source link in sticky
     * @created: 12 july 2019
     * @returns: no
     * @author: karnakar
     */
	editSourceLinkEntityClipBoard(that, value) {
		var cur_val = value;
		var editFiteredSourceListEntityClipBoard = [];
		if (cur_val === "") {
			$('.editableDiv ul').css("display", "none");
		}
		if (cur_val) {
			$('.editableDiv ul').css("display", "block");
			$('.editableDiv ul').html('');
			this.source_list_clipboard_for_edit.map((val) => {
				if (val && val.sourceName.toLowerCase().indexOf(cur_val.toLowerCase()) >= 0) {
					editFiteredSourceListEntityClipBoard.push(
						{
							sourceName: val.sourceName ? val.sourceName : '',
							source_type: val.source_type ? val.source_type : '',
							source_url: (val.source_type && val.source_type === 'link') ? (val.sourceUrl ? val.sourceUrl : '') : (val.docName ? val.docName : ''),
							title: val.title ? val.title : '',
							doc_id: val.docId ? val.docId : ''
						});
				}
			});
			$('.editableDiv ul').append(`<div class="width-95 mar-b0 mar-x10 p-rel d-block">
                <div class="bst_input_group bst_input_group_r  height-a">
                    <input type="text" ng-disabled="disableInput" id="sourceLinkValue" placeholder="sourceURL"  value="" name="sourceURL" class="custom-input text-cream mar-b0 pad-x15 pad-t15 f-12 height-100"/>
                    <span class="label">Source URL *</span>
                </div>
            </div>`);
			editFiteredSourceListEntityClipBoard.map((val) => {
				if (val.source_type !== 'link') {
					val.source_url = val.source_url.split(" ").join("_");
				}
				var liTab = '<li id="sourceIdndUrl"  class="pad-x10 f-14 h-30 d-flex ai-c" sourceUrl=' + (val.source_type === 'link' ? val.source_url : val.source_url) + ' sourceType= ' + val.source_type + ' doc_id= ' + (val.doc_id ? val.doc_id : '') + '><span>' +
					(val.source_type === 'link' ? '<i class="fa pad-r10 c-pointer fa-link"></i>' : '') +
					(val.source_type === 'doc' || val.source_type === 'docx' ? '<i class="fa pad-r10 c-pointer fa-file-word-o"></i>' : '') +
					(val.source_type === 'pdf' ? '<i class="fa pad-r10 c-pointer fa-file-pdf-o"></i>' : '') +
					(val.source_type === 'png' ? '<i class="fa pad-r10 c-pointer fa-file-image-o"></i>' : '') +
					'</span>' + val.sourceName + '</li>';

				$('.editableDiv ul').append(liTab);
			});
			// $('.editableDiv ul').append(``);
		} else {
			$('.editableDiv ul').html('');
		}
		setTimeout(function () {
			$(".custom-list.auto-complete-list.searchSource").mCustomScrollbar({
				axis: "y",
				theme: "minimal-dark"
			});
		}, 0);
	}
	editSelectedValue(value) {
		if ($(value).attr("sourceUrl")) {
			this.dataPopObjectEntityClipBoard.srctype = $(value).attr("sourceType");
			// source_link_val = this.dataPopObjectEntityClipBoard.srctype === 'link' ? $(value).attr("sourceUrl") : $(value).text();
			this.source_link_val = $(value).attr("sourceUrl");
			if (this.dataPopObjectEntityClipBoard.srctype === 'link') {
				this.source_link_val = this.addHttpProtoCol(this.source_link_val);
				this.selected_doc_docId = '';
			}
			if (this.dataPopObjectEntityClipBoard.srctype !== 'link' && this.dataPopObjectEntityClipBoard.srctype !== 'png' && this.dataPopObjectEntityClipBoard.srctype !== 'jpg' && this.dataPopObjectEntityClipBoard.srctype !== 'jpeg' && this.dataPopObjectEntityClipBoard.srctype !== 'gif' && this.dataPopObjectEntityClipBoard.srctype !== 'tiff' && this.dataPopObjectEntityClipBoard.srctype !== 'bmp') {
				this.source_link_val = this.source_link_val.split(" ").join("_");
				this.selected_doc_docId = $(value).attr("doc_id");
			}
			if (this.dataPopObjectEntityClipBoard.srctype === 'png' || this.dataPopObjectEntityClipBoard.srctype === 'jpg' || this.dataPopObjectEntityClipBoard.srctype === 'jpeg' || this.dataPopObjectEntityClipBoard.srctype === 'gif' || this.dataPopObjectEntityClipBoard.srctype === 'tiff' || this.dataPopObjectEntityClipBoard.srctype === 'bmp') {
				this.source_link_val = this.source_link_val.split(" ").join("_");
				this.selected_doc_docId = '';
			}
			$("#sourceLinkValue").val(this.source_link_val);
			$("#sourceUrlId").val($(value).text());
			this.dataPopObjectEntityClipBoard.overideSearchedInputSourceEdit = $(value).text();
			$('.editableDiv ul').html('');
			$('.editableDiv ul').hide();
		}
	}
	/*
		 * @purpose: Edit source link in sticky
		 * @created: 12 july 2019
		 * @returns: no
		 * @author: karnakar
		 */
	closeSourceListEditPopUp() {
		event.preventDefault();
		event.stopPropagation()
		$('#sourceNameId').val(this.curr_title);
		$('#sourceUrlId').val(this.current_link);
		$('#showPop').addClass("d-none");
		this.popover_open = false;
	}
	showSourceLinkModal() {
		this.dataPopObjectEntityClipBoard.overideSearchedInputURLEdit = "";
		this.dataPopObjectEntityClipBoard.overideSearchedInputSourceEdit = "";
		this.overideSearchedInputSourceEditValEntityClipBoard = "";
		this.overideSearchedInputDateEdit = ""
		this.dataPopObjectEntityClipBoard.overideSearchedInputDateEdit = "";
		this.sourceUrlListEntityClipBoard = false;
		this.showfiteredSourceListEntityClipBoard = false;
		this.dataPopObjectEntityClipBoard.selectedSourceTitle = "";
	}
	closeSourceListPopUp() {
		this.dataPopObjectEntityClipBoard.overideSearchedInputURLEdit = "";
		this.dataPopObjectEntityClipBoard.overideSearchedInputSourceEdit = "";
		this.overideSearchedInputSourceEditValEntityClipBoard = "";
		this.overideSearchedInputDateEdit = ""
		this.dataPopObjectEntityClipBoard.overideSearchedInputDateEdit = "";
		this.sourceUrlListEntityClipBoard = false;
		this.showfiteredSourceListEntityClipBoard = false;
		this.dataPopObjectEntityClipBoard.selectedSourceTitle = "";
		$(".sticky-link-popover").css("cssText", "display: none !important;")
	}

	/*
		 * @purpose: download document
		 * @created: 20 sep 2017
		 * @params: doc(object)
		 * @return: no
		 * @author: swathi
		 */
	downloadDocument(doc, type) {
		var docId = doc.docId;
		//var docName = doc.docName;
		var docType = doc.type;
		var docTitle = doc.title;
		var params = {
			"docId": docId,
			"token": AppConstants.Ehubui_token
		};
		this.topPanelApiService.downloadDocument(params).subscribe((response: any) => {
			var blob = new Blob([response], {
				type: "application/" + docType,
			});
			if (type == 'download') {
				if (docType == '') {
					saveAs(blob, (docTitle || doc.docName) + '.txt');// jshint ignore:line
				} else {
					saveAs(blob, (docTitle || doc.docName) + '.' + docType);// jshint ignore:line
				}
				//HostPathService.FlashSuccessMessage('SUCCESSFUL DOWNLOAD DOCUMENT', 'Successfully downloaded document with file title: ' + docTitle);
			} else {
				var reader = new FileReader();
				reader.addEventListener('loadend', function (e: any) {
					var text = e.srcElement.result;/*jshint unused:false*/
				});
				// Start reading the blob as text.
				var x = reader.readAsText(blob);/*jshint unused:false*/
			}
		}, function () {
			//HostPathService.FlashErrorMessage('ERROR DOWNLOAD DOCUMENT', 'Failed to download document with file title: ' + docTitle);
		});
	};
	/*
     * @purpose: Open menu on click of document
     * @created: 30 mar 2018
     * @returns: no
     * @author: varsha
     */
    getMenuForDoc(e, doc) {
        this.doc = doc;
          var  isFromEntitySection = TopPanelConstants.isFromEntitySection;
        this.dragElement($("#context_menu"));
		  	this.viewStickyNotes(isFromEntitySection);
	};

    /*
     * @purpose: view sticky notes
     * @created: 30 mar 2018
     * @returns: no
     * @author: varsha
     */
    viewStickyNotes(isFromEntitySection) {
			  var stickyNotes = document.getElementById('stickyNotesEntity');
			  $('#stickyNotesEntity').css('display', 'block');
			  if(!isFromEntitySection){
				  stickyNotes.style.left = "-360px";
				  stickyNotes.style.top = "25px";
			  }else{
				  stickyNotes.style.left = "100px";
				  stickyNotes.style.top = "110px";
			  }
			 this.displayDocumentOnView(this.doc);
			  this.dragElement(document.getElementById(("stickyNotesEntity")));
		  };
		  /*
     * @purpose: Display content of sticky notes
     * @created: 30 mar 2018
     * @returns: no
     * @param : clicked document object
     * @author: varsha
     */

    displayDocumentOnView(doc) {
        $('#documentTextEntity').html('');
        $('#documentTitleEntity').val(doc.title);
		this.documentId = doc.docId;
        var docId = doc.docId;
        var docType = doc.type;
        var docTitle = doc.title;
        var params = {
            "docId": docId,
            "token": this.queryParams.query
        };
        this.topPanelApiService.downloadDocument(params).subscribe( ((response:any) =>{
            var blob = new Blob([response], {
                type: "application/" + docType,
            });
            var reader = new FileReader();
            reader.addEventListener('loadend',  (e:any)=> {
                var text = e.srcElement.result;
                this.popover_open = false;
                var showPopIndex = text.indexOf('<div id="showPop"');
                if(showPopIndex !== -1){
                    text = text.slice(0,showPopIndex) + "</a>";
                }
                $('#documentTextEntity').html(text);
                $('#documentTitleEntitySec').val(doc.title);
                if(doc.title.indexOf('.snt') !== -1){
                    $('#documentTitleEntitySec').val(doc.title.split('.snt')[0]);
                }
                this.stickySavedText = text;
                this.showCustomSourceLinkEditPopover();
            });
            // Start reading the blob as text.
            var x = reader.readAsText(blob);// jshint ignore:line
            this.loadDocumentContent = false;
        }),(  () =>{
            this.loadDocumentContent = false;
            // HostPathService.FlashErrorMessage('ERROR DOWNLOAD DOCUMENT', 'Failed to download document with file title: ' + docTitle);uncomment
        }) );
    }

    public trackByDocId(_, item): string {
      return item.docId;
    }
}
