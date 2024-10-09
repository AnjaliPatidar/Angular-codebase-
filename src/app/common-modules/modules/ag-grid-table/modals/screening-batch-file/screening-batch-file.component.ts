import { UserSharedDataService } from './../../../../../shared-services/data/user-shared-data.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileUploader } from 'ng2-file-upload';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { AlertManagementService } from '@app/modules/alert-management/alert-management.service';
import { AgGridTableService } from '../../ag-grid-table.service';
import { CaseManagementService } from '@app/modules/case-management/case-management.service';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import * as moment from 'moment';
import { TagManagementApiService } from '@app/modules/systemsetting/services/tag-management.api.service';

@Component({
  selector: 'app-screening-batch-file',
  templateUrl: './screening-batch-file.component.html',
  styleUrls: ['./screening-batch-file.component.scss']
})
export class ScreeningBatchFileComponent implements OnInit {
  public showUploadLoader: any = false
  public sourceList: any = [];
  public selectedList: any = [];
  public showSelectedValues: string = '';
  public screeningStarted: boolean = false;
  public fileList: any = [];
  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean;
  public hasAnotherDropZoneOver: boolean;
  public response: string;
  public hasError: boolean;
  public screeningStatus: string;
  public screeningMessage: string;
  public showFirstSection: boolean = false;
  public showSecondSection: boolean = false;
  public showThirdSection: boolean = false;
  public enableRunButton: boolean = false;
  public disableSubmitButton: boolean = false;
  public fileSizeFromSystemSettings: any;
  public systemSettingObj: any = {};
  public fileName: string = '';
  public alerts_failed: any;
  public alerts_suppressed: any;
  public alert = {
    type: 'success',
    message: 'New alerts  has been generated. Please press here to check'
  };
  public confidencePercentage = 40;
  public progressBarValue = 0;
  public interval: any;
  public validatingStatus: string = "Pending";
  public stage: string;
  public showAlertMessage: boolean;
  public validatingFile: boolean = true;
  public getScreeningResults: any = " ";
  public screeningResponse: any = {
    'created': 0,
    'failed': 0,
    'suppressed': 0,
    'pushed': 0
  };
  public public_enriched: any;
  public private_enriched: any;
  public alerts_pushed: any;
  public batches_count: any;
  public batches_finished: any;
  public alerts_created: any;
  public fromComponent: string;
  public SSB_files_allowed: any = [];
  public Watchlist: any = [];
  public allWatchlist: any = [];
  public ssbScreeningTimeOut: any;
  repoDocumentList = []
  isShowFileSize:boolean = true
  currentUserDetails
  isShowDocumentRepo:boolean
  caseWorkBenchPermissionJSON: any = {};
  isHideUploadButton = true;
  isDesableButton:boolean;
  canAccessDocumentMgt: boolean;
  public feedClassification: any = [];
  public selectedFeedsforWl: any = [];
  public enableProgressBarModal: boolean = false;
  public fileUploadEnabled: boolean = true;
  public screenProcessedCompleted: boolean = false;
  public totalProcessingScreeningEntites: number = 0;
  public entitesFromEachCall: number = 0;
  public uploadScreenReasult: any = {};
  public enableSSBScreenModalWindow: boolean = true;
  public cdkOverlayHTMLElement: any;
  public totalErrorCounts: number = 0;
  public totalValidHitCounts: number = 0;
  public totalWarningHitsCounts: number = 0;
  public getScreeningIds = [];
  public completedScreeningIDResponse = {
    num_processed: 0,
    num_errors: 0,
    num_hits: 0
  }

  public completedScreeningArray = [];

  public screeningUploadReasult = [
    { state: "error", icon: "fa fa-exclamation-circle", bgColor: "rgb(252, 92, 102,0.2)", iconColor: "#fc5c66", text: ["Screening completed", "Data validation errors found"] },
    { state: "warning", icon: "fas fa-exclamation-triangle",  bgColor: "rgb(255, 155, 86,0.2)", iconColor: "#ff9b56", text: ["No hits for any entities submitted in screening."] },
    { state: "success", icon: "material-icons", bgColor: "rgb(0, 202, 152,0.2)", iconColor: "#00ca98",  iconText: "check_circle", text: ["Screening completed successfully. No errors found."] }
  ]

  constructor(
    public dialogRef: MatDialogRef<ScreeningBatchFileComponent>,
    @Inject(MAT_DIALOG_DATA) public incomingdata: any,
    private _sharedServicesService: SharedServicesService, private cmnSrvc: CommonServicesService,
    private _alertService: AlertManagementService,
    private _agGridTableService: AgGridTableService,
    private _caseService: CaseManagementService,
    private _userSharedDataService:UserSharedDataService,
    private _tagManagemntApiService:TagManagementApiService,

  ) {
    this.uploader = new FileUploader({
      url: '',
      disableMultipart: true,
      formatDataFunctionIsAsync: true,
      formatDataFunction: async (item) => {
        return new Promise((resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
    });
    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;
    this.uploader.onAfterAddingFile = (item) => {
      item.remove();
      if (this.uploader.queue.filter(f => f._file.name == item._file.name).length == 0) {
        this.uploader.queue.push(item);
      }
    };
    this.response = '';
    this.uploader.response.subscribe(res => {
      this.response = res;
    }
    );
  }

  ngOnInit() {
    this.getcurrentLoggedUser();
    this.showUploadLoader = true;

    //check if user can see document repository
    this.canAccessDocumentMgt = this.getUserDocRepoPermission() != 'none';

    this.getSystemSettingsAndWatchlistsData();

    this.isShowDocumentRepo = this.incomingdata.operation === 'upload attachement' || this.incomingdata.operation == 'case comments' ? true : false
    if (GlobalConstants && GlobalConstants.systemsettingsData && GlobalConstants.systemsettingsData['Alert Management Settings'] && Array.isArray(GlobalConstants.systemsettingsData['Alert Management Settings']) && this.isShowDocumentRepo ==false) {
        GlobalConstants.systemsettingsData['Alert Management Settings'].forEach((element) => {
          if (element.name == 'Allowed csv file for SSB upload' && element.selectedValue == "On") {
            this.SSB_files_allowed.push('.csv')
          }
          else if (element.name == 'Allowed xls file for SSB upload' && element.selectedValue == "On") {
            this.SSB_files_allowed.push('.xls')
          }
        })
      }
    this.showFirstSection = true;
    this._alertService.getListDataForEachType("Feed Source").subscribe(resp => {
      if (resp.length) {
        this.sourceList = resp;
      }
    });
    this._caseService.caseAttachments = (this.incomingdata && this.incomingdata.attachmentList) ? this.incomingdata.attachmentList : [];

    this.listeningRepoDocumentSelection();
    this.getAlertListPermssionIds();
    this.maxiMizeProcessingScreenModalWindow();
    this._sharedServicesService.maxMinizedProcessingModal(true)
    if(this.isShowDocumentRepo){
      this.getAlltagsForDocs()
    }
  }

  agInit(params: any) {
  }

  /**Return file size of system settings
   * Written by : Karunakar
   * Date : 04-Feb-2020
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

  /**Get File formats allowed types
   * Written by : Janaka Sampath
   * Date : 16-Nov-2022
  */
  checkSystemValuses(value) {
   if (
      value.type === 'Toggle On/Off' &&
      value.section === 'File Settings' &&
      value.systemSettingType === 'GENERAL_SETTING' &&
      value.selectedValue === 'On'
    ) {
      this.SSB_files_allowed.push(value.name);
    }
  }

  /**Get Selected Source listin screening batch file modal
   * Written by : Karunakar
   * Date : 31-Jan-2020
  */
  getSourceList() {
    this.showSelectedValues = this.selectedList.length ? this.selectedList.join(",") : '';
  }

  /**Upload file in screening batch file modal
   * Written by : Karunakar
   * Date : 31-Jan-2020
  */

  onFileSelected(event: any[]) {
    Array.from(event).map((file: any) => {
      var index = this.fileList.findIndex((files) => {
        return file.name == files.name
      })
      if (index === -1) {
        this.fileList.push(file)
        this.enableRunButton = true;
      }
    });

  }

  getSystemSettingsAndWatchlistsData() {
    if(this.incomingdata.operation == 'screening batch file'){
      this.cmnSrvc.getSystemSettingsAndWatchlists().subscribe({
        next: (response: any) => {
          this.systemSettingObj = response[0];
          this.allWatchlist = response[1].data;
          this.fileSizeFromSystemSettings = this.getFileSizeInNumber(
            this.systemSettingObj
          );
          this.systemSettingObj["General Settings"].forEach((val) => {
            this.checkSystemValuses(val);
          });
        },
        error: (error) => {},
        complete: () => {
          this.showUploadLoader = false;
	      },
      })
    } else {
      this.cmnSrvc.getSystemSettings().then((response: any) => {
        this.systemSettingObj = response;
        this.fileSizeFromSystemSettings = this.getFileSizeInNumber(
          this.systemSettingObj
        );
        this.systemSettingObj["General Settings"].forEach((val) => {
          this.checkSystemValuses(val);
        });
        this.showUploadLoader = false;
      }).catch((error) => {

      });
    }

  }

  removeUploadedDoc(item) {
    let fileLength = this.uploader.queue.length
    if (fileLength > 0) {
      for (var i = 0; i < this.uploader.queue.length; i++) {
        if (this.uploader.queue[i]._file.name === item._file.name) {
          this.uploader.queue[i].remove();
          this.fileList.splice(i, 1);
          if (fileLength == 1) {
            this.enableRunButton = false;
          }
          return;
        }
      }
    }
  }

  /**Validate Uploaded file in screening batch file modal
   * Written by : Karunakar
   * Date : 05-Feb-2020
  */
  // validateUploadedFile(from) {
  //   if (from = "case") {
  //     if (this.repoDocumentList.length) {
  //       this.connectDocumentsToCases();
  //     }
  //   }
  //   this.fromComponent = from;
  //   let files = this.fileList;
  //   let createCaseFormFiles = []
  //   this.hideShowSections(true, false, false);
  //   this.showUploadLoader = true;
  //   if (files) {
  //     this.fileName = (files[0] && files[0].name) ? files[0].name : '';
  //     if (from === 'case') {
  //       let fileValidationStatus = this.validateUploadedFiles(files, ['format', 'size']);
  //       if (fileValidationStatus) {
  //         let duplicateValidation = this.validateDuplicateFiles(files);
  //         this.connectDocumentsToCases();
  //         debugger;
  //         if (duplicateValidation) {
  //           for (let i = 0; i < files.length; i++) {
  //             createCaseFormFiles.push(files[i])
  //           }
  //           this._caseService.createNewCaseFromQuestioner(this.incomingdata.caseId, createCaseFormFiles).subscribe((resp: any) => {
  //             if (resp) {
  //               this.dialogRef.close();
  //               this.showUploadLoader = false;
  //               this._caseService.updateAttachmentTableData.next(true);
  //               this._sharedServicesService.showFlashMessage('Attachment upload successfully', 'success');
  //             }
  //           },
  //             (err) => {
  //               this.dialogRef.close();
  //               this.showUploadLoader = false;
  //               this._sharedServicesService.showFlashMessage('Unable to upload the file. please try again later', 'danger');
  //             })
  //         } else {
  //           this.showUploadLoader = false;
  //           this._sharedServicesService.showFlashMessage('File name already exists', 'danger');
  //         }
  //       }
  //     }
  //     else if (from === 'alert') {
  //       var fileFormat = (files[0] && files[0].name) ? files[0].name.split(".").pop() : '';
  //       var fileSize = (files[0] && files[0].size) ? files[0].size / 1024 / 1024 : 0;
  //       if (fileFormat && (this.SSB_files_allowed.indexOf("." + fileFormat) != -1)) {
  //         if (fileSize && this.fileSizeFromSystemSettings && (fileSize <= this.fileSizeFromSystemSettings && fileSize > 0)) {
  //           var params = {
  //             'confidence': this.confidencePercentage / 100
  //           };
  //           this._agGridTableService.getScreeningBatchID(params, files[0]).subscribe((resp) => {

  //             if (resp && resp.non_screened_count && resp.non_screened_count > 0) {
  //               this._sharedServicesService.showFlashMessage(`Last ${resp.non_screened_count} records won't be processed because batch size exceeds maximum allowed number of screening requests.
  //                   ` , 'danger');
  //             }
  //             var screeningId = (resp && resp.id) ? resp.id : '';
  //             if (screeningId) {
  //               this.hideShowSections(false, true, false);
  //               this.getScreeningResults = " ";
  //               this.screeningStarted = true;
  //               this.cmnSrvc.emitScreeningOptionsForSubmenu({
  //                 ods: { disable: true },
  //                 ssb: {
  //                   show: false,
  //                   icon: "hourglass_empty",
  //                   text: "Upload...",
  //                 }
  //               })
  //               this.getStatsForScreeningRequestID(screeningId)
  //             }
  //             else if (resp.responseMessage) {
  //               this._sharedServicesService.showFlashMessage(resp.responseMessage, 'danger');
  //             }
  //           }, (err) => {
  //             this._sharedServicesService.showFlashMessage(err, 'danger');
  //             this.hideShowSections(true, false, false);
  //           }
  //           );
  //         } else if (fileSize == 0) {
  //           this._sharedServicesService.showFlashMessage('File size should be greater than ' + 0 + 'KB ...!', 'danger');
  //         }
  //         else {
  //           this.enableRunButton = false;
  //           this._sharedServicesService.showFlashMessage('File size should not be greater than ' + this.fileSizeFromSystemSettings + 'MB.', 'danger');
  //         }
  //       }
  //       else {
  //         this.enableRunButton = false;
  //         if (this.SSB_files_allowed.length == 0) {
  //           this._sharedServicesService.showFlashMessage('Please enable the allowed SSB file formats from system settings.', 'danger');
  //         }
  //         else {
  //           this._sharedServicesService.showFlashMessage('Allowed file only ' + this.SSB_files_allowed.join(", ") + '.', 'danger');
  //         }
  //       }

  //     }
  //   }

  // }

  validateUploadedFile(from) {
    if(from == "case"){
      if(this.repoDocumentList.length){
        this.connectDocumentsToCases();
      }
    }
    this.fromComponent = from;
    let files = this.fileList;
    var uploadDocument = [];
    var fileNames = [];
    let userId: any = GlobalConstants.systemSettings['ehubObject']['userId'];
    this.hideShowSections(true, false, false);
    this.showUploadLoader = true;
    if (files) {
      this.fileName = (files[0] && files[0].name) ? files[0].name : '';
      if (from === 'case') {
        let fileValidationStatus = this.validateUploadedFiles(files, ['format', 'size']);
        if (fileValidationStatus) {
          let duplicateValidation = this.validateDuplicateFiles(files);
          if (duplicateValidation) {
            for (let i = 0; i < files.length; i++) {
              if (files[i].size) {
                let fileFormat = files[i] && files[i].name && files[i].name.split('.').length > 0 ? files[i].name.split('.').pop() : '';
                let fileSize = files[i] && files[i].size ? files[i].size / 1024 / 1024 : 0;
                let fileName = files[i] && files[i].name ? files[i].name : '';
                let lastUpdate = files[i] && files[i].lastModified ? files[i].lastModified : '';
                let title = files[i] && files[i].name.split('.').slice(0, -1).join('.');
                const params = {
                  "analysis": true,
                  "created_by": userId.toString(),
                  "file_name": fileName,
                  "format": fileFormat,
                  "last_updated": moment(lastUpdate).format('YYYY-MM-DD HH:mm:ss'),
                  "reference_id": this.incomingdata.caseId.toString(),
                  "reference_type": "case",
                  "size": fileSize.toString(),
                  "title": title,
                  "updated_by": userId.toString(),
                  "version_handler": "",
                  "main_entity_id": this.incomingdata && this.incomingdata.caseId ? this.incomingdata.caseId.toString() : "",
                  "reference_name": this.incomingdata && this.incomingdata.caseName ? this.incomingdata.caseName : "",
                  "timestamp": moment(new Date(), ["h:mm A"]).format('YYYY-MM-DD HH:mm:ss'),
                  "meta_data": '{}'
                }
                uploadDocument.push(params)
              }
            }
            return this._caseService.uploadDocumentForProof(uploadDocument).subscribe(resp => {
              const existsDocuments = [];
              const existsDocumentsReferences = [];
              if (resp) {
                let resultDocumentExistsMessage = '';
                var documents = this.getLanguageKey('Document(s)') ? this.getLanguageKey('Document(s)') : 'Document(s)'
                var newDocument = this.getLanguageKey('Attachment(s)') ? this.getLanguageKey('Attachment(s)') : 'Attachment(s)'
                var allreadyExists = this.getLanguageKey('already exists') ? this.getLanguageKey('already exists') : 'already exists'
                var uploadSuccess = this.getLanguageKey('upload successfully') ? this.getLanguageKey('upload successfully') : 'upload successfully'
                var referenceLinkCreated = this.getLanguageKey('in the repository. Reference link created.') ? this.getLanguageKey('in the repository. Reference link created.') : ' in the repository. Reference link created.'
                resp.forEach(element => {
                  if (element.is_uploaded) {
                    fileNames.push(element.file_info.file_path)
                  } else if (element.is_uploaded == false && element.reason[0].includes('New reference')) {
                    existsDocumentsReferences.push(element.file_info.file_name);
                  } else if (element.is_uploaded == false) {
                    existsDocuments.push(element.file_info.file_name);
                  }
                });
                if (existsDocuments.length) {
                  let documentName = existsDocuments.length > 1 ? existsDocuments.join(', ')
                    : (existsDocuments.length == 1) ? existsDocuments[0] : '';
                  this.showUploadLoader = false;
                  resultDocumentExistsMessage.length && (resultDocumentExistsMessage += '<br/>');
                  resultDocumentExistsMessage +=  documents + " '" + documentName + "' " + allreadyExists;
                }
                if (existsDocumentsReferences.length) {
                  let documentName = existsDocumentsReferences.length > 1 ? existsDocumentsReferences.join(', ')
                    : (existsDocumentsReferences.length == 1) ? existsDocumentsReferences[0] : '';
                  this.showUploadLoader = false;
                  resultDocumentExistsMessage.length && (resultDocumentExistsMessage += '<br/>');
                  resultDocumentExistsMessage +=  documents + " '" + documentName + "' " + allreadyExists + referenceLinkCreated;
                  this._caseService.updateAttachmentTableData.next(true);
                }
                (existsDocuments.length || existsDocumentsReferences.length) && this._sharedServicesService.showFlashMessage(resultDocumentExistsMessage, 'success');
                if (fileNames.length) {
                  this._caseService.getDocumentLocation(fileNames).then(res => {
                    if (res) {
                      for (let i = 0; i < res.length; i++) {
                        const found = files.find((element) => element.name === res[i].fileName);
                        if (found) {
                          this._caseService.callPresignedUrl(found, res[i].presignedUrl).then((response) => {
                            if (i == res.length - 1) {
                              this.dialogRef.close();
                              this.showUploadLoader = false;
                              this._caseService.updateAttachmentTableData.next(true);
                              res.forEach(element => {
                                newDocument += " " + "'" + element.fileName +"," + this.repoDocumentList + " "
                              });
                              newDocument = newDocument.slice(0, -2) + " " + uploadSuccess;
                              this._sharedServicesService.showFlashMessage(newDocument, 'success');
                            }
                          })
                        }
                      }
                    }
                  })
                }
              }
            },
              (err) => {
                this.dialogRef.close();
                this.showUploadLoader = false;
                this._sharedServicesService.showFlashMessage('Unable to upload the file. please try again later', 'danger');
              })
          } else {

            this.showUploadLoader = false;
            this._sharedServicesService.showFlashMessage('File name already exists', 'danger');
          }
        }
      }
      else if (from === 'alert') {
        var fileFormat = (files[0] && files[0].name) ? files[0].name.split(".").pop() : '';
        var fileSize = (files[0] && files[0].size) ? files[0].size / 1024 / 1024 : 0;
        if (fileFormat && (this.SSB_files_allowed.indexOf("." + fileFormat) != -1)) {
          if (fileSize && this.fileSizeFromSystemSettings && (fileSize <= this.fileSizeFromSystemSettings && fileSize > 0)) {
              var params = {
                'confidence': this.confidencePercentage / 100,
                'watchlist': JSON.stringify(this.Watchlist),
                "all_watchlist": this.allWatchlist.length === this.Watchlist.length ? true : false,
                "feed": this.feedClassification
              };
              this.disableSubmitButton = true;
              this._agGridTableService.getScreeningBatchID(params, files[0]).subscribe((resp) => {
                if (resp && resp.job_ids) {
                  this.fileUploadEnabled = false;
                  this.screenProcessedCompleted = false;
                  this.hideShowSections(false, true, false);
                  this.resetTheValue();
                  this.getScreeningResults = "RUNNING";
                  this.screeningStarted = true;
                  this.validatingFile = false;
                  this.disableSubmitButton = false;
                  this.cmnSrvc.emitScreeningOptionsForSubmenu({
                    ods: { disable: true },
                    ssb: {
                      show: false,
                      icon: "hourglass_empty",
                      text: "Upload...",
                    }
                  })
                  if(resp.job_ids.length === 1) {
                    this.getStatsForScreeningRequestID(resp.job_ids[0]);
                  } else {
                    this.ssbScreeningTimeOut = new Date().getTime() + (60 * 60000);
                    this.getStatsForTwoScreeningRequestIDs(resp.job_ids);
                    this.getScreeningIds.push(resp.job_ids);
                  }
                } else {
                  this.disableSubmitButton = false;
                  this._sharedServicesService.showFlashMessage('Something Went Wrong', 'danger');
                }
              }, (err) => {
                this.disableSubmitButton = false;
                this._sharedServicesService.showFlashMessage('Something Went Wrong', 'danger');
                this.hideShowSections(true, false, false);
              }
              );
          } else if (fileSize == 0) {
            this.disableSubmitButton = false;
            this._sharedServicesService.showFlashMessage('File size should be greater than ' + 0 + 'KB ...!', 'danger');
          }
          else {
            this.enableRunButton = false;
            this.disableSubmitButton = false;
            this._sharedServicesService.showFlashMessage('File size should not be greater than ' + this.fileSizeFromSystemSettings + 'MB.', 'danger');
          }
        }
        else {
          this.enableRunButton = false;
          this.disableSubmitButton = false;
          if (this.SSB_files_allowed.length == 0) {
            this._sharedServicesService.showFlashMessage('Please enable the allowed SSB file formats from system settings.', 'danger');
          }
          else {
            this._sharedServicesService.showFlashMessage('Allowed file only ' + this.SSB_files_allowed.join(", ") + '.', 'danger');
          }
        }

      }
    }
  }

  async getStatsForTwoScreeningRequestIDs(ids) {
    this.getScreeningResults = "RUNNING";
    let screeningIDS = ids;
    let completedfRes = [];
    const timer = ms => new Promise(res => setTimeout(res, ms))
    let resultList = [];
    let screeningReasult = [];
    screeningIDS.forEach(async id => {
      const promise = new Promise((resolve, reject) => {
        let response = {};
        this._alertService.getStatsForScreeningRequestID(id)
          .then((result) => {
            let screeningResponseReasult = {
              num_processed: 0,num_errors: 0,num_hits: 0
            };
            response[id] = result;
              if (response && response[id] && response[id].job_status && response[id].job_status.toLowerCase() === "running") {
                screeningReasult.push(response[id]);
                // if (screeningReasult.length >= this.getScreeningIds.length) {

                // }

                const num_processed = screeningReasult.map(item => item.stats.wl_screening.num_processed).reduce((prev, curr) => prev + curr, 0);
                const num_errors = screeningReasult.map(item => item.stats.wl_screening.num_errors + item.stats.alerts.errors).reduce((prev, curr) => prev + curr, 0);
                const num_hits = screeningReasult.map(item => item.stats.wl_screening.num_hits).reduce((prev, curr) => prev + curr, 0);

                screeningResponseReasult = {
                  num_processed: num_processed,
                  num_errors: num_errors,
                  num_hits: num_hits
                };

              } else if( response && response[id].job_status && response[id].job_status.toLowerCase() !== "running") {
                // const num_processed = screeningReasult.map(item => item.stats.wl_screening.num_processed).reduce((prev, curr) => prev + curr, 0);
                // const num_errors = screeningReasult.map(item => item.stats.wl_screening.num_errors).reduce((prev, curr) => prev + curr, 0);
                // const num_hits = screeningReasult.map(item => item.stats.wl_screening.num_hits).reduce((prev, curr) => prev + curr, 0);

                this.completedScreeningArray.push(response[id]);

                if (this.completedScreeningArray.length > 1) {
                  const num_processed = this.completedScreeningArray.map(item => item.stats.wl_screening.num_processed).reduce((prev, curr) => prev + curr, 0);
                  const num_errors = this.completedScreeningArray.map(item => item.stats.wl_screening.num_errors + item.stats.alerts.errors).reduce((prev, curr) => prev + curr, 0);
                  const num_hits = this.completedScreeningArray.map(item => item.stats.wl_screening.num_hits).reduce((prev, curr) => prev + curr, 0);

                  this.completedScreeningIDResponse = {
                    num_processed: num_processed,
                    num_errors: num_errors,
                    num_hits: num_hits
                  };
                }else{
                  this.completedScreeningIDResponse = {
                    num_processed: response[id].stats.wl_screening.num_processed,
                    num_errors: response[id].stats.wl_screening.num_errors + response[id].stats.alerts.errors,
                    num_hits: response[id].stats.wl_screening.num_hits
                  };
                }

                completedfRes.push(id);
              } else {
                this._sharedServicesService.showFlashMessage('Something Went Wrong', 'danger');
              }
            resolve(true);

            let finalResponse = {
              num_processed: screeningResponseReasult['num_processed'] + this.completedScreeningIDResponse['num_processed'],
              num_errors: screeningResponseReasult['num_errors'] + this.completedScreeningIDResponse['num_errors'],
              num_hits: screeningResponseReasult['num_hits'] + this.completedScreeningIDResponse['num_hits']
            }

            // calculate alerts generated
            let generated_alerts = 0;
            if(this.completedScreeningArray.length){
              this.completedScreeningArray.forEach(res =>{
                generated_alerts+=res.stats.alerts.generated_alerts
              });
            }


            this.screeningResponse = {
                'validHits': finalResponse.num_processed + finalResponse.num_errors - finalResponse.num_hits,
                'entities': finalResponse.num_processed + finalResponse.num_errors,
                'warningHits': finalResponse.num_hits,
                'errors': finalResponse.num_errors,
                'created': generated_alerts
            };
            this.countTheTotalTileCounts();
          })
          .catch((err) => {
            this._sharedServicesService.showFlashMessage('Something Went Wrong', 'danger');
            this.closeModal();
          });
      });
      resultList.push(promise);
    });
    await Promise.all(resultList).then(() => {
      screeningIDS = screeningIDS.filter(id => !completedfRes.includes(id));
      this.getScreeningIds = screeningIDS;
    });
    if (new Date().getTime() < this.ssbScreeningTimeOut) {
      if (ids.length > 0) {
        await timer(20000);
        if(screeningReasult.length == this.getScreeningIds.length) {
          screeningReasult = [];
        }
        this.getStatsForTwoScreeningRequestIDs(screeningIDS);
      } else {
        this.completeSSBScreening();
      }
    } else {
      this.completeSSBScreening(true);
    }
  }
  completeSSBScreening(timedOut:boolean = false) {
    this.getScreeningResults = "COMPLETED";
    this.screeningCompleted(true,this.screeningResponse,'multiple');
    // this.screeningPopUp('finished',timedOut);
  }

  async getStatsForScreeningRequestID(id) {
    const timer = ms => new Promise(res => setTimeout(res, ms));
    let end_time = new Date().getTime() + (60 * 60000);
    let response;
    do {
      await this._alertService.getStatsForScreeningRequestID(id)
        .then((result) => {
          response = result;
          this.receivedAlerts(response);
        })
        .catch((err) => {
          this._sharedServicesService.showFlashMessage('Something Went Wrong', 'danger');
          this.closeModal();
          response = null;
        });
      if (new Date().getTime() < end_time) {
        await timer(20000);
      } else {
        response.job_status = 'timed out';
        this.receivedAlerts(response,true);
      }
    } while (response && response.job_status && response.job_status.toLowerCase() === "running");
  }

  /**Validate Uploaded files
   * Written by : ASHEN
   * Date : 07 JAN 2021
  */
  validateUploadedFiles(files, validateTypesArray) {
    let validationsPassed = false;
    let breakValidation = false
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      let fileFormat = (file && file.name && file.name.split(".").length > 0) ? file.name.split(".").pop().toLowerCase() : '';
      let fileSize = (file && file.size) ? file.size / 1024 / 1024 : 0;
      let fileName = (file && file.name) ? file.name : '';

      if (validateTypesArray && validateTypesArray.includes('format')) {
        let validationFileFormatStatus = this.validateUploadedFileFormat(fileFormat, fileName);
        if (!validationFileFormatStatus) {
          validationsPassed = false;
          break;
        }
      }

      if (validateTypesArray && validateTypesArray.includes('size')) {
        let validationFileSizeStatus = this.validateUploadedFileSize(fileSize, fileName);
        if (!validationFileSizeStatus) {
          validationsPassed = false;
          break;
        }
      }
      validationsPassed = true;
    }

    return validationsPassed;
  }

  /**Validate Uploaded file format is allowee
   * Written by : ASHEN
   * Date : 07 JAN 2021
  */
  validateUploadedFileFormat(fileFormat, fileName) {

    let allowedExtensions = [];
    this.systemSettingObj['General Settings'].forEach((item) => {
      if (item.section === 'File Settings' && item.selectedValue == 'On') {
        allowedExtensions.push(item.name);
      }
    });
    allowedExtensions = allowedExtensions.map(item => item === 'Zip Archived' ? 'zip' : item);
    if (fileFormat && allowedExtensions.includes(fileFormat)) {
      return true;
    } else {
      this.enableRunButton = false;
      this.showUploadLoader = false;
      this._sharedServicesService.showFlashMessage(
        "File type not allowed. (" + fileName + ") " + (allowedExtensions.length > 0 ? "supported types are " + allowedExtensions.join() : ""),
        "danger"
      );
    }
    return false;
  }

  /**Validate Uploaded file size is allowee
   * Written by : ASHEN
   * Date : 07 JAN 2021
  */
  validateUploadedFileSize(fileSize, fileName) {
    if (fileSize && this.fileSizeFromSystemSettings && (fileSize <= this.fileSizeFromSystemSettings && fileSize > 0)) {
      return true;
    } else if (fileSize == 0) {
      this._sharedServicesService.showFlashMessage('File size should be greater than ' + 0 + 'KB ...!', 'danger');
      this.showUploadLoader = false;
    } else {
      this.enableRunButton = false;
      this.showUploadLoader = false;
      this._sharedServicesService.showFlashMessage('File size should not be greater than ' + this.fileSizeFromSystemSettings + 'MB. (' + fileName + ')', 'danger');
    }
    return false;
  }

  previousAlerts = 0;
  previousSuppressedAlerts = 0;

  receivedAlerts(response: any, timedOut: boolean = false) {
    this.screeningResponse = {
      'created': response.stats.alerts.generated_alerts,
      'failed': response.stats.alerts.errors,
      'suppressed': response.stats.alerts.alerts_suppressed,
      'pushed': 0,
      'validHits': response.stats.wl_screening.num_processed + response.stats.wl_screening.num_errors - response.stats.wl_screening.num_hits,
      'entities': response.stats.wl_screening.num_processed + response.stats.wl_screening.num_errors,
      'warningHits': response.stats.wl_screening.num_hits,
      'errors': response.stats.wl_screening.num_errors + response.stats.alerts.errors,

      //Acording the new requirement [RD-20331], new varialbles will be created as follows
      'generatedAlerts': response.stats.alerts.generated_alerts,
      'numErrors': response.stats.wl_screening.num_errors,
      'wlScreeningStatus': response.stats.wl_screening.status

    };
    this.getScreeningResults = response.workflow_status;
    if (response && response.workflow_status && response.workflow_status.toLowerCase() !== "running") {
      // this.screeningPopUp(response.workflow_status,timedOut);
      this.screeningCompleted(true,response,'single');
    }
    this.countTheTotalTileCounts();
  }

  screeningPopUp(status,timedOut: boolean = false) {
    let res = {
      results: this.screeningResponse,
      status: status,
      timedOut : timedOut
    }
    this.cmnSrvc.getAlertsFromServer(res);
    this.closeModal();
    if (this.screeningResponse.failed > 0) {
      this.hasError = true;
    }

    let ele: any = document.getElementsByClassName("cdk-overlay-container")
    if (ele && ele[0]) {
      ele[0].style.display = "block";
    }
  }

  closeModal() {
    this.dialogRef.close();
    this.cmnSrvc.emitScreeningOptionsForSubmenu({
      ods: { disable: false },
      ssb: {
        show: true,
        icon: "hourglass_empty",
        text: "Upload...",
      }
    });
    this.screeningStarted = false;
    this.validatingFile = false;
  }

  /**Hiding and showing sections in screening batch file modal
   * Written by : Karunakar
   * Date : 04-Feb-2020
  */
  hideShowSections(sec1, sec2, sec3) {
    this.showUploadLoader = false;
    this.showFirstSection = sec1;
    this.showSecondSection = sec2;
    this.showThirdSection = sec3;
  }

  /**Cancel upload in screening batch file modal
   * Written by : Karunakar
   * Date : 31-Jan-2020
  */
  cancelUpload() {
    this.dialogRef.close();
    clearInterval(this.interval);
  }

  uploadAnotherFileEvent(){
    for (var i = 0; i < this.uploader.queue.length; i++) {
      this.uploader.queue[i].remove();
      this.fileList.splice(i, 1);
    }
    this.hideShowSections(true,false,false);
    this.fileUploadEnabled = true;
    this.screenProcessedCompleted = false;
  }

  validationDone() {
    this.dialogRef.close();
  }
  close() {
    if (this.screeningStarted) {
      let modalEle: any = document.getElementsByClassName("cdk-overlay-container")[0]
      modalEle.style.display = "none"
      modalEle.style.height = "inherit";
      this.cmnSrvc.emitScreeningOptionsForSubmenu({
        ods: { disable: true },
        ssb: {
          show: false,
          icon: "hourglass_empty",
          text: "Upload Status...",
        }
      });
    }
    else {
      this.dialogRef.close();
    }
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  validateDuplicateFiles(files) {
    let validationsPassed = true;
    let caseAttachmentsList = [];
    caseAttachmentsList = this._caseService.caseAttachments;
    for (let i = 0; i < caseAttachmentsList.length; i++) {
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        let fileFormat = (file && file.name && file.name.split(".").length > 0) ? file.name.split(".").pop() : '';
        let fileName = (file && file.name) ? file.name : '';
        if (caseAttachmentsList[i].fileType == fileFormat && caseAttachmentsList[i].fileName == fileName) {
          validationsPassed = false;
          break;
        }
        validationsPassed = true;
      }
      if (!validationsPassed) {
        break;
      }
    }
    return validationsPassed;
  }

  updateWatchlist(watchlist) {
    this.Watchlist = watchlist;
  }

  // @reason : Add localization text
  // @author: Kasun Karunathilaka
  // @date: Apr 08 2022
  getLanguageKey(text) {
    var langKey = text;
    if (GlobalConstants.languageJson) {
      langKey = GlobalConstants.languageJson[text];
    }
    return langKey;
  }

  showFileSize(eventStatus):void{
    if(eventStatus && eventStatus.index == 1){
      this.isShowFileSize = false;
    }else{
      this.isShowFileSize = true;
    }
  }

  // @reason : listen to the selection change in table data
  // @author : Ammshathwan
  // @date : 21st APR 2022
  listeningRepoDocumentSelection():void{
    if(this.isShowDocumentRepo){
      this._caseService.updateCaseAttachmentDataObserver.subscribe(data => {
        this.repoDocumentList = this.getDocumentsFromDMS(data)
      })
    }
  }

  // @reason : get the list of selected document file path from DMS repo
  // @author : Ammshathwan
  // @date : 21st APR 2022
  getDocumentsFromDMS(selectedDocuments):any[]{
    let selectedDocumentsList = []
    this._caseService.repoDocumentListDataObserver.subscribe(data => {
      let documetList = data;
      selectedDocuments.forEach(document => {
        documetList.filter(data => {
          if(data.file_id == document.fileID){
            selectedDocumentsList.push(data.file_path)
          }
        })
      });
    })
    return selectedDocumentsList
  }

  // @reason : connect the selecetd document to case
  // @author : Ammshathwan
  // @date : 21st APR 2022
  connectDocumentsToCases():void{
    var uploadSuccesssMsg = this.getLanguageKey('upload successfully') ? this.getLanguageKey('upload successfully') : 'upload successfully'
    var newDocumentMsg = this.getLanguageKey('Attachment(s)') ? this.getLanguageKey('Attachment(s)') : 'Attachment(s)'
    var documentsMsg = this.getLanguageKey('Document(s)') ? this.getLanguageKey('Document(s)') : 'Document(s)'
    let params = {
      "documents_case_connection_request": [
        {
          "caseId": this.incomingdata && this.incomingdata.caseId ? this.incomingdata.caseId.toString() : "",
          "documentPaths": this.repoDocumentList,
          "caseName": this.incomingdata.caseName
        }
      ],
      "user_id": this.currentUserDetails && this.currentUserDetails.userId ? this.currentUserDetails.userId.toString() : ''
    }

    this._caseService.connectDocumentsToCases(params).subscribe(res => {
      if(res){
        if (res.length > 0) {

          const fileResponse = res[0] || {};

          this.showUploadLoader = false;

          if (fileResponse.status === 'error') {
            this._sharedServicesService.showFlashMessage(documentsMsg + ' ' +fileResponse.documentPaths+ ' ' +'already exists', 'danger');
          }

          this._caseService.updateAttachmentTableData.next(true);
          this.dialogRef.close();
        if(this.repoDocumentList.length && this.fileName == "" && res[0].status !== "error"){
         for(var k = 0 ;k < this.repoDocumentList.length ; k++  ){
          newDocumentMsg += " " + this.repoDocumentList[k]+","
         }
         newDocumentMsg += " " + uploadSuccesssMsg
             this._sharedServicesService.showFlashMessage(newDocumentMsg ,'success' )
        }
        }
      }
    })
  }

  // @reason : get current logged user details
  // @author : Ammshathwan
  // @date : 21st APR 2022
  getcurrentLoggedUser() {
    this._userSharedDataService.getCurrentUserDetails()
      .subscribe(response => {
        if (response) {
          this.currentUserDetails = response;
        }
      });
  }

  // @reason : Return the selected document data
  // @author : Ammshathwan
  // @date : 6 JUN 2022
  closeDialog(type:string):void{
    if(type === "comments"){
      let fileValidationStatus:boolean = this.validateUploadedFiles(this.fileList, ['format', 'size']);
        if(fileValidationStatus){
          this.dialogRef.close({fileList : this.fileList})
        }else if(this.repoDocumentList){
          this.dialogRef.close({fileList : []})
        }
    }
  }

  // @reason : Get alert management permission
  // @author : Kasun Karunathilaka
  // @date : 30 JUN 2022
  getAlertListPermssionIds() {
    const permissions: any[] = this._sharedServicesService.getPermissions();
    if (permissions.length) {
      this.caseWorkBenchPermissionJSON = permissions[0].alertManagement.alertsList;
      this.getPermissionForAlert()
    }
  }

  getPermissionForAlert() {
    const permission = this.cmnSrvc.getDomainPermissions(this.caseWorkBenchPermissionJSON, 'status');
    const permissionLevel = this.cmnSrvc.getPermissionStatusType(permission);
    if (permissionLevel == 'view') {
      this.isDesableButton = true
    }
    if (permissionLevel == 'none') {
      this.isHideUploadButton = false
    }
    this.isHideUploadButton = true
  }

  /**
   * Get user permission level to access document management module
   * @returns permission level as 'none' | 'view' | 'fuel'
   */
   getUserDocRepoPermission(): string {
    const permissions: any[] = this._sharedServicesService.getPermissions();
    if (permissions.length) {
      const modulePermissions = permissions[0].modules;
      const documentMgtPermission = this.cmnSrvc.getDomainPermissions(modulePermissions, 'Document Repository');
      return this.cmnSrvc.getPermissionStatusType(documentMgtPermission);
    }

    return "none";
  }

  screeningCompleted(completedStatus,response,watchListStatus){
    this.screenProcessedCompleted = true;

    // if(response.warningHits > 0 && response.validHits > 0 && response.failed > 0) {
    //   this.uploadScreenReasult = this.screeningUploadReasult[0];
    // }else if(response.warningHits > 0 && response.validHits > 0 && response.failed == 0){
    //   this.uploadScreenReasult = this.screeningUploadReasult[2];
    // }else if (response.validHits == 0) {
    //   this.uploadScreenReasult = this.screeningUploadReasult[1];
    // }else{
    //   this.uploadScreenReasult = this.screeningUploadReasult[2];
    // }

    //Acording the new requirement [RD-20331], new logics as follows
    if (response.generatedAlerts > 0 && response.numErrors == 0 && response.wlScreeningStatus == 'COMPLETE') {
      this.uploadScreenReasult = this.screeningUploadReasult[0];
    } else if (response.generatedAlerts == 0 && response.numErrors == 0 && response.wlScreeningStatus == 'COMPLETE') {
      this.uploadScreenReasult = this.screeningUploadReasult[1];
    } else {
      this.uploadScreenReasult = this.screeningUploadReasult[2];
    }

    let screening = {
      status: true,
      reasult: this.uploadScreenReasult
    }

    this._sharedServicesService.setscreeningData(screening);
  }

  hideScreenReasult(){
    this.screenProcessedCompleted = false;
    this.fileUploadEnabled = true;
    this.dialogRef.close();
    this.screeningPopUp('COMPLETED',false);
  }

  minimizeTheScreen(){
    this.showSecondSection = false;
    this.enableSSBScreenModalWindow = false;
    document.getElementsByClassName("cdk-overlay-container")[0]['style'].display = "none";
    this._sharedServicesService.getMinimizedPopValue(true);
    this._sharedServicesService.entitesValue(this.totalProcessingScreeningEntites);
    this._sharedServicesService.setscreeningData({ status: false, reasult: {} });
  }

  maxiMizeProcessingScreenModalWindow(){
    this._sharedServicesService.maxiMinzeProcessingModalWindow.subscribe(res=>{
      if (!res) {
        document.getElementsByClassName("cdk-overlay-container")[0]['style'].display = "block";
        this.showSecondSection = true;
        this.enableSSBScreenModalWindow = true;
      }
    });
  }

  countTheTotalTileCounts(){
    this.totalProcessingScreeningEntites = this.screeningResponse.entities;
    this.totalErrorCounts = this.screeningResponse.errors;
    this.totalValidHitCounts = this.screeningResponse.validHits;
    this.totalWarningHitsCounts =  this.screeningResponse.warningHits;
    this._sharedServicesService.entitesValue(this.totalProcessingScreeningEntites);
  }

  resetTheValue(){
    this.totalProcessingScreeningEntites = 0;
    this.totalErrorCounts = 0;
    this.totalValidHitCounts = 0;
    this.totalWarningHitsCounts = 0;
    this._sharedServicesService.entitesValue(0);
    this.completedScreeningArray = [];
    this.completedScreeningIDResponse = {
      num_processed: 0,
      num_errors: 0,
      num_hits: 0
    }
  }

  updateClassifications(classifications){
    let newClassification;
    let newSelectedFeeds;
    if(classifications.length > 0){
      newClassification = classifications.map(el => el.listItemId)
      newSelectedFeeds= classifications.map(el => el.code);
    }
    else{
      newClassification = [];
      newSelectedFeeds=[];
    }
    this.feedClassification = newClassification;
    this.selectedFeedsforWl = newSelectedFeeds;
  }

  public trackByDisplayName(_, item): string {
    return item.displayName;
  }

  public trackByFileName(_, item): string {
    return item._file.name;
  }

  // @purpose : get all the tags from DB for filtering
  // @author : ammshathwan
  // @date : 27 apr 2023
  getAlltagsForDocs():void {
    this.canAccessDocumentMgt = false;
    const params: any = { entity_type: 'Document', only_tags: true, "tag_entities": true, filter_model: '{}' };
    this._tagManagemntApiService.tagsSearch(params).then((tagList:any) => {
      this.canAccessDocumentMgt = true
      GlobalConstants.doucmentTagsList = tagList.result.filter(function(obj) {
        return obj.tag.content;
      })
      .map(function(obj) {
        return obj.tag;
      });
    }).catch(err => this.canAccessDocumentMgt = true)
  }
}
