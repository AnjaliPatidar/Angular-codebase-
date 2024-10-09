import { convertArrayToCSV } from 'convert-array-to-csv';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileUploader } from 'ng2-file-upload';
import { SharedServicesService } from '../../../../../shared-services/shared-services.service';
import { CommonServicesService } from '../../../../../common-modules/services/common-services.service';
import { CaseManagementService } from '../../../../../modules/case-management/case-management.service';
import { WebSocketAPI } from '../../../../../modules/alert-management/websocket';
import {CaseBatchSearchKeys} from '../../../../constants/case-search-keys';
import { WebSocketSubject } from "rxjs/webSocket";
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { WINDOW } from '../../../../../core/tokens/window';
@Component({
  selector: "app-case-batch-file",
  templateUrl: "./case-batch-file.component.html",
  styleUrls: ["./case-batch-file.component.scss"],
})
export class CaseBatchFileComponent implements OnInit, OnDestroy {
  fileList: any[] = [];
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasError: boolean;
  showFirstSection = false;
  showSecondSection = false;
  showThirdSection = false;
  enableUploadButton = false;
  fileSizeFromSystemSettings: any = 0;
  systemSettingObj: any = {};
  fileName = "";
  isUploadStart = false;
  casedWebSocket: WebSocketAPI;
  fromComponent: string;

  // case batch upload
  totalCasesCount = 0;
  casesPushed = 0;
  casesFinished = 0;
  casesValidCount = 0;
  casesWarningCount = 0;
  casesErrorsCount = 0;
  createCaseFormFiles: any[] = [];
  batchCaseFiles: any[] = [];
  updatedCsvData: any;
  uploadedFileName: string;
  updatedCsvFileName: string;
  validationProgressStatus = "Ready";
  progress: number = 0;
  languageJson: any;
  isValidating: boolean = false;
  validateProgress: number = 60;
  validationWarnings: boolean = false;
  validationErrors: boolean = false;
  validationSuccess: boolean = false;
  isFileCountValidationError: boolean = false;
  validatedCsvData: any;
  options = {
    autoClose: false,
    keepAfterRouteChange: false,
  };
  isUploadErrorFileSize: boolean = false;
  isUploadErrorFileType: boolean = false;
  isUploadError: boolean = false;
  allowedFileType: any;
  allowedFileSize: any;
  closeUploadError: boolean = false;

 subject: WebSocketSubject<any>;
 webSocketCallWithUserID: WebSocketSubject<any>;

 isNofiticationClosed: boolean = false;

 caseBatchId: string;
 iscasesFinished:boolean

 caseBatchUploadStatusSubscription: Subscription;
 isBatchFileDeleted:boolean

  constructor(
    public dialogRef: MatDialogRef<CaseBatchFileComponent>,
    @Inject(MAT_DIALOG_DATA) public incomingdata: any,
    private sharedService: SharedServicesService,
    private commonService: CommonServicesService,
    private caseManagementService: CaseManagementService,
    @Inject(WINDOW) private readonly window: Window
  ) {
    this.uploader = new FileUploader({
      url: "",
      disableMultipart: true,
      formatDataFunctionIsAsync: true,
      formatDataFunction: async (item) => {
        return new Promise((resolve) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date(),
          });
        });
      },
    });
    this.hasBaseDropZoneOver = false;
    this.uploader.onAfterAddingFile = (item) => {
      item.remove();
      if (
        this.uploader.queue.filter((f) => f._file.name === item._file.name)
          .length === 0
      ) {
        this.uploader.queue.push(item);
      }
    };
    this.uploader.response.subscribe((res) => {});
  }

  ngOnInit() {
    if(!this.incomingdata.detailData){
      this.showFirstSection = true;
      this.allowedFileSize =
        this.incomingdata && this.incomingdata.fileSizeFromSystemSettings
          ? this.incomingdata.fileSizeFromSystemSettings
          : 0;
    } else {
      this.showThirdSection = true;

      this.fileName = this.incomingdata.detailData.documents && this.incomingdata.detailData.documents[0] &&  this.incomingdata.detailData.documents[0].fileName;
      this.progress = this.incomingdata.detailData.progress;

      if(this.progress===100){
        this.iscasesFinished = true;
        this.validationProgressStatus = "Finished";
        this.casesFinished = this.incomingdata.detailData.createdCount;
        this.casesWarningCount = this.incomingdata.detailData.totalCasesCount - this.incomingdata.detailData.createdCount;
      }else{
        this.subscribeToCurrentBatchUploadStatus(this.incomingdata.detailData.batch_id);
      }
    }

    this.commonService.behaveObserverForgetLanguageJson.subscribe((resp) => {
      if (resp) {
        this.languageJson = resp;
      }
    });
  }

  ngOnDestroy(): void {
    // unsubscribe from case batch upload subscription
    this.caseBatchUploadStatusSubscription && this.caseBatchUploadStatusSubscription.unsubscribe();
  }

  /**
   * Subscribe to get live batch upload status updates
   * @param batchId current batch id
   */
  subscribeToCurrentBatchUploadStatus(batchId: string) {
    this.caseBatchUploadStatusSubscription = this.caseManagementService.caseBatchUploadSubject.subscribe((batchDataMap: any) => {
      if (batchDataMap[batchId]) {
        this.receivedCases(batchDataMap[batchId]);
      }
    });

    // start the websocket incase it was diconnected due to inactivity
    this.caseManagementService.reconnectCaseBatchUploadWS();
  }

  onFileSelected(event: FileList) {
    this.setValidateStatus(false, false, false, false, false);

    if(event.length>1){
      this.uploader.queue.length = 0;
      this.showFirstSection = true;
      this.isFileCountValidationError = true;
      return null;
    }

    const lastItem = this.uploader.queue.pop();
    this.uploader.queue.length = 0;
    this.uploader.queue.push(lastItem);
    const file: File = event[event.length - 1];
    const index = this.fileList.findIndex((files) => {
      return file.name === files.name;
    });

    if (index === -1) {
      if (this.fileList.length === 1) {
        this.fileList = [];
        this.fileList.push(file);
      } else {
        this.fileList.push(file);
      }
      this.enableUploadButton = true;
    }
  }

  removeUploadedDoc(item: any) {
    const fileLength = this.uploader.queue.length;
    if (fileLength > 0) {
      for (let i = 0; i < this.uploader.queue.length; i++) {
        if (this.uploader.queue[i]._file.name === item._file.name) {
          this.uploader.queue[i].remove();
          this.fileList.splice(i, 1);
          if (fileLength === 1) {
            this.enableUploadButton = false;
          }
          return;
        }
      }
    }
  }

  validateUploadedFile(from) {
    this.setValidateStatus(false, false, true, false, false);

    this.fromComponent = from;
    const files = this.fileList;
    this.createCaseFormFiles = [];
    this.casesValidCount = 0;
    this.casesWarningCount = 0;
    this.validationWarnings = false;
    this.validationErrors = false;

    if (files) {
      this.fileName = files[0] && files[0].name ? files[0].name : "";
      for (const file of files) {
        this.createCaseFormFiles.push(file);
      }
      this.batchCaseFiles = this.createCaseFormFiles;
      if (from === 'case_batch_upload') {
          this.validateFileFromSystemSettings(from);
        this.isValidating = true;
        this.caseManagementService
          .validateBatchCaseFile(this.createCaseFormFiles)
          .subscribe(
            (resp: any) => {
              if (resp) {
                this.isValidating = false;
                this.casesValidCount = resp.validCasesCount;
                this.openNotification();
                if (resp && resp.errors && resp.errors.length === 0) {
                  this.hideShowSections(false, true, false);
                } else if (resp && resp.errors && resp.errors.length === 1) {
                  if (resp.errors.includes(CaseBatchSearchKeys.fileType)) {
                    this.isUploadErrorFileType = true;
                    this.allowedFileType = resp.allowedFileTypes;
                    this.closeUploadError = false;
                  } else if (resp.errors.some(e => e.includes(CaseBatchSearchKeys.fileSize))) {
                    this.isUploadErrorFileSize = true;
                    this.allowedFileSize = resp.maximumFileSize;
                    this.closeUploadError = false;
                  } else if (resp.errors.length > 0) {
                    this.validationErrors = true;
                    this.casesErrorsCount = resp.totalErrorCount;
                    this.hideShowSections(false, true, false);
                  } else {
                    this.hideShowSections(false, true, false);
                  }
                } else if (
                  resp &&
                  resp.totalErrorCount
                ) {
                  this.validationErrors = true;
                  this.casesErrorsCount = resp.totalErrorCount;
                  this.hideShowSections(false, true, false);
                }
                if (resp && resp.totalWarningCount) {
                  this.validationWarnings = true;
                  this.casesWarningCount = resp.totalWarningCount;
                }
                if(resp && resp.csvReport) {
                  this.validatedCsvData = resp.csvReport;
                }
              } else {
                this.setValidateStatus(false, true, false, false, false);
              }
            },
            (err) => {
              if (err.status === CaseBatchSearchKeys.fileUploadErrorCode) {
                this.setValidateStatus(false, true, false, false, false);
              } else if (from) {
                this.validateFileFromSystemSettings(from);
              } else {
                this.setValidateStatus(false, true, false, false, false);
              }
            }
          );
      }
    }
  }

  validateFileFromSystemSettings(from) {
   this.isValidating = true;
   this.fromComponent = from;
   const files = this.fileList;

   this.commonService.getSystemSettings().then((resp) => {
      this.systemSettingObj = resp;
      this.fileSizeFromSystemSettings = this.getFileSizeInNumber(
        this.systemSettingObj
      );
      if (files) {
        this.fileName = files[0] && files[0].name ? files[0].name : '';
        if (from === 'case_batch_upload') {
          const fileValidationStatus = this.validateUploadedFiles(files, [
            'format',
            'size',
          ]);
          if (fileValidationStatus) {
            this.validateBatchCaseFile();
          }
        }
      }
    });
  }

   /*
   Validate Batch Case File
   Author: Upeksha  (AP-7003)
   Date: 23th November 2021
  */
   validateBatchCaseFile(): void {
    this.hideShowSections(false, true, false);
    this.isValidating = true;
    this.validationSuccess = false;
    this.validationErrors = false;
    this.validationWarnings = false;
    this.caseManagementService
    .validateBatchCaseFile(this.createCaseFormFiles)
    .subscribe(
      (resp: any) => {
        if (resp) {
          this.isValidating = false;
          if (resp && resp.errors && resp.errors.length === 0) {
            this.casesValidCount = resp.validCasesCount;
           } else if (resp && resp.errors && resp.errors.length === 1) {
             if (resp.errors.length > 0) {
              this.validationErrors = true;
              this.casesErrorsCount = resp.totalErrorCount;
            } else {
            }
          } else if (
            resp &&
            resp.totalErrorCount
          ) {
            this.validationErrors = true;
            this.casesErrorsCount = resp.totalErrorCount;
          }
          if (resp && resp.totalWarningCount) {
            this.validationWarnings = true;
            this.casesWarningCount = resp.totalWarningCount;
          }
          if (!this.validationErrors && !this.validationWarnings && !this.isUploadError){
            this.validationSuccess = true;
          }
          if (resp && resp.csvReport) {
            this.validatedCsvData = resp.csvReport;
          }
        } else {
          this.setValidateStatus(false, true, false, false, false);
        }
      },
      (err) => {
        if (err.status === CaseBatchSearchKeys.fileUploadErrorCode) {
          this.setValidateStatus(false, true, false, false, false);
        } else {
          this.setValidateStatus(false, true, false, false, false);
        }
      }
    );
  }

  setValidateStatus(validating: boolean, uploadError: boolean, closeError: boolean, fileTypeError: boolean, fileSizeError: boolean) {
    this.isValidating = validating;
    this.isUploadError = uploadError;
    this.closeUploadError = closeError;
    this.isUploadErrorFileType = fileTypeError;
    this.isUploadErrorFileSize = fileSizeError;
    this.isFileCountValidationError = false;
  }

  closeUploadErrorMessage(): void {
    this.closeUploadError = true;
    this.isValidating = false;
    this.isUploadError = false;
    this.closeUploadError = false;
    this.isUploadErrorFileType = false;
    this.isUploadErrorFileSize = false;
    this.isFileCountValidationError = false;
  }

  getFileSizeInNumber(obj) {
    let size: any = 0;
    if (obj && obj["General Settings"] && obj["General Settings"].length) {
      size = obj["General Settings"]
        .map((val) => {
          if (val && val.name && val.name === "Maximum file size allowed") {
            this.allowedFileSize =  val.selectedValue;
            return val;
          }
        })
        .filter((v) => {
          return v;
        })[0].selectedValue;

      if (size.indexOf("MB")) {
        size = Number(size.split("MB")[0]);
      }
    }
    return size;
  }

  validateUploadedFiles(files: any, validateTypesArray: any) {
    let validationsPassed = false;

    for (const file of files) {
      const fileFormat =
        file && file.name && file.name.split('.').length > 0
          ? file.name.split('.').pop()
          : '';
      const fileSize = file && file.size ? file.size / 1024 / 1024 : 0;
      const fileName = file && file.name ? file.name : '';

      if (validateTypesArray && validateTypesArray.includes('format')) {
        const validationFileFormatStatus = this.validateUploadedFileFormat(
          '.' + fileFormat,
          fileName
        );
        if (!validationFileFormatStatus) {
          validationsPassed = false;
          break;
        }
      }

      if (validateTypesArray && validateTypesArray.includes('size')) {
        const validationFileSizeStatus = this.validateUploadedFileSize(
          fileSize,
          fileName
        );
        if (!validationFileSizeStatus) {
          validationsPassed = false;
          break;
        }
      }
      validationsPassed = true;
    }
    return validationsPassed;
  }

  validateUploadedFileFormat(fileFormat: any, fileName: any) {
    const allowedExtensions = [];
    allowedExtensions.push(CaseBatchSearchKeys.allowedExtension);

    if (fileFormat && allowedExtensions.includes(fileFormat)) {
      return true;
    } else {
      this.allowedFileType = allowedExtensions.length > 0 ?  allowedExtensions.join() : allowedExtensions;
      this.setValidateStatus(false, false, false, true, false);
    }
    return false;
  }

  validateUploadedFileSize(fileSize: any, fileName: any) {
    if (
      fileSize &&
      this.fileSizeFromSystemSettings &&
      fileSize <= this.fileSizeFromSystemSettings &&
      fileSize > 0
    ) {
      return true;
    } else if (fileSize === 0) {
      this.setValidateStatus(false, false, false, false, true);
    } else {
      this.setValidateStatus(false, false, false, false, true);
     }
    return false;
  }

  runProceess(): void {
    if (!this.validationErrors) {
      this.validationProgressStatus = this.languageJson["In Progress"];
      this.isUploadStart = true;
      setTimeout(() => {
        if (this.casesErrorsCount > 0) {
          this.hasError = true;
        } else {
          this.hideShowSections(false, false, true);
        }
      }, 3000);

      this.caseManagementService
        .createNewCaseBulkUpload(this.createCaseFormFiles)
        .subscribe(
          (resp: any) => {
            if (resp) {
              this.setFileNames();

              this.caseBatchId = resp;
              const bulkCaseCreationId = resp;
              if (bulkCaseCreationId) {
                const ehubObject = JSON.parse(localStorage.getItem("ehubObject"));
                const path = JSON.parse(localStorage.getItem("paths"));

                // subscribe to get live batch upload status updates
                this.subscribeToCurrentBatchUploadStatus(bulkCaseCreationId);

                  var uploadDocument = [];
                  var fileNames = [];
                  let userId: any = GlobalConstants.systemSettings['ehubObject']['userId'];
                  var bulkCaseId = bulkCaseCreationId;
                  if (this.batchCaseFiles.length) {
                    for (let i = 0; i < this.batchCaseFiles.length; i++) {
                      let fileFormat = this.batchCaseFiles[i] && this.batchCaseFiles[i].name && this.batchCaseFiles[i].name.split('.').length > 0 ? this.batchCaseFiles[i].name.split('.').pop() : '';
                      let fileSize = this.batchCaseFiles[i] && this.batchCaseFiles[i].size ? this.batchCaseFiles[i].size / 1024 / 1024 : 0;
                      let fileName = this.batchCaseFiles[i] && this.batchCaseFiles[i].name ? this.batchCaseFiles[i].name : '';
                      let lastUpdate = this.batchCaseFiles[i] && this.batchCaseFiles[i].lastModified ? this.batchCaseFiles[i].lastModified : '';
                      let title = this.batchCaseFiles[i] && this.batchCaseFiles[i].name.split('.').slice(0, -1).join('.');
                      const params = {
                        "analysis": true,
                        "created_by": userId.toString(),
                        "file_name": fileName,
                        "format": fileFormat,
                        "last_updated": moment(lastUpdate).format('YYYY-MM-DD HH:mm:ss'),
                        "reference_id": bulkCaseId.toString(),
                        "reference_type": "batch case",
                        "size": fileSize.toString(),
                        "title": title,
                        "updated_by": userId.toString(),
                        "version_handler": "",
                        "main_entity_id": bulkCaseId.toString(),
                        "reference_name": "",
                        "timestamp": moment(new Date(), ["h:mm A"]).format('YYYY-MM-DD HH:mm:ss'),
                        "meta_data": '{}'
                      }
                      uploadDocument.push(params)
                    }
                    return this.caseManagementService.uploadDocumentForProof(uploadDocument).subscribe(resp => {
                      const existsDocuments = [];
                      const existsDocumentsReferences = [];
                      this.openNotification();
                      if (resp) {
                             resp.forEach(element => {
                           if (element.is_uploaded) {
                             fileNames.push(element.file_info.file_path)
                           } else if (element.is_uploaded == false && element.reason[0].includes('New reference')) {
                             existsDocumentsReferences.push(element.file_info.file_name);
                           } else if (element.is_uploaded == false) {
                            existsDocuments.push(element.file_info.file_name);
                           }
                         })
                        if (fileNames.length) {
                          this.caseManagementService.getDocumentLocation(fileNames).then(res => {
                            if (res) {
                              for (let i = 0; i < res.length; i++) {
                                const found = this.batchCaseFiles.find(
                                  (element) => element.name === res[i].fileName
                                );
                                if (found) {
                                  this.caseManagementService.callPresignedUrl(found, res[i].presignedUrl).then((response) => {
                                    if (i == res.length - 1) {
                                      this.caseManagementService.updateTableData.next(true);
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
                        this.caseManagementService.updateTableData.next(true);
                      })
                  } else {
                    this.caseManagementService.updateTableData.next(true);
                  }
              }
            }
          },
          (err) => {

            this.isUploadStart = false;
            this.validationProgressStatus = this.languageJson["Failed"];
            if (err && err.error.responseMessage) {
              this.sharedService.showFlashMessage(
                err.error.responseMessage,
                "danger"
              );
            } else {
              this.sharedService.showFlashMessage(
                this.languageJson["UnableToUploadTheFile"],
                "danger"
              );
            }
          }
        );
    }
  }
  getLanguageKey(text) {
    var langKey = text;
    if (GlobalConstants.languageJson) {
      langKey = GlobalConstants.languageJson[text];
    }
    return langKey;
  }

  receivedCases(response: any) {
    if(response){
    this.totalCasesCount = response.totalCasesCount;
    if (response.message && response.status) {
      this.casesPushed = response.validCasesCount;
      this.casesFinished = response.createdCount;
      this.progress = response.progress;
      if(this.progress <= 100){
        if(response.status == "Finished"){
          this.progress = 100;
          this.iscasesFinished = true;
          if(response.createdCount !== response.totalCasesCount){
            this.casesWarningCount = response.totalCasesCount - response.createdCount;
          }
        }else{
          if (this.progress === 100){
            this.progress = this.progress - 1;
          }
        }
      }
    }
    if (response.status === "Warning") {
      if (response.message) {
        this.casesWarningCount = this.casesWarningCount + 1;
      }
    } else if (response.status === "Error") {
      if (response.message) {
        this.casesErrorsCount = this.casesErrorsCount + 1;
      }
    } else if (response.status === "Complete") {
      if (response.message) {
        this.casesValidCount = this.casesValidCount + 1;
      }
    } else if (response.status === "Finished") {
      this.validationProgressStatus = "Finished";
      if(response.csv_status){
           this.updatedCsvData = response.csv_status;
      }
    }
    }
  }

  hideShowSections(sec1: boolean, sec2: boolean, sec3: boolean) {
    this.showFirstSection = sec1;
    this.showSecondSection = sec2;
    this.showThirdSection = sec3;
    if (this.showFirstSection) {
      this.updatedCsvData = null;
      this.updatedCsvFileName = null;
      this.uploadedFileName = null;
      this.hasError = false;
    }
    if (this.showSecondSection) {
      this.validationProgressStatus = this.languageJson["Ready"];
    }
    if (this.showThirdSection) {
      this.isUploadStart = false;
    }
  }

  clearValues(isBatchDeleted:boolean = false) {
    this.totalCasesCount = 0;
    this.casesPushed = 0;
    this.casesValidCount = 0;
    this.casesWarningCount = 0;
    this.casesErrorsCount = 0;
    this.casesFinished = 0;
    this.updatedCsvData = null;
    this.isUploadStart = false;
    this.progress = 0;
    this.validationErrors = false;
    this.isFileCountValidationError = false;
    this.isUploadError = false;
    this.isUploadErrorFileSize = false;
    this.isUploadErrorFileType = false;
    this.isUploadError = false;
    this.closeUploadError = true;

    if(this.showThirdSection &&  this.validationProgressStatus === 'Finished' && isBatchDeleted){
      this.removeBatchProgress();
    }
  }

  closeDialog() {
    this.clearValues();
    this.dialogRef.close();
  }

  closeFromTop(isBatchCompleted:boolean = false) {
    this.clearValues(isBatchCompleted);
    this.dialogRef.close();
  }

  removeBatchProgress(){
    this.caseManagementService.setRemovedBatch(this.caseBatchId || this.incomingdata.detailData.batch_id);
  }

  onFileOver(event: any): void {
    this.hasBaseDropZoneOver = event;
  }

  checkReport(): void {
    if (this.updatedCsvData && !this.updatedCsvFileName) {
      this.setFileNames();
      this.downloadReport();
    } else if (this.updatedCsvData && this.updatedCsvFileName) {
      this.downloadReport();
    } else {
      if(this.incomingdata.detailData){
        this.updatedCsvData = this.incomingdata.detailData.csv_status;
        this.updatedCsvFileName = this.caseManagementService.getCSVFileName(this.incomingdata.detailData.documents && this.incomingdata.detailData.documents.length ? this.incomingdata.detailData.documents[0] : {} , true);
        if (this.updatedCsvData && this.updatedCsvFileName) {
          this.downloadReport();
        }
      }
    }
  }

  downloadReport() {
  if (this.updatedCsvData && this.updatedCsvFileName) {
      const csvContent = atob(this.updatedCsvData);
      const blob = new Blob([csvContent], {
        type: "data:application/octet-stream;base64",
      });
      const url = (this.window as any).URL.createObjectURL(blob);
      const dlnk: any = document.createElement("a");
      dlnk.href = url;
      dlnk.download = this.updatedCsvFileName;
      dlnk.click();
      URL.revokeObjectURL(url);
    } else {
      this.setFileNames();
      this.checkReport();
    }
  }

  setFileNames(): void {
    if (this.createCaseFormFiles) {
      const fileExtention = this.createCaseFormFiles
        ? this.createCaseFormFiles.length
          ? this.createCaseFormFiles[0].name.split(".").pop()
          : "csv"
        : "csv";
      const fileName = this.createCaseFormFiles
        ? this.createCaseFormFiles.length
          ? this.createCaseFormFiles[0].name.split(".").slice(0, -1).join(".")
          : "updatedFile"
        : "updatedFile";
      this.uploadedFileName = fileName + "." + fileExtention;
      this.updatedCsvFileName = fileName + "_status" + "." + fileExtention;
    }
  }

  checkValidationReport(): void {
    if (this.validatedCsvData && this.updatedCsvFileName) {
      const csvContent = atob(this.validatedCsvData);
      const convertedCSV:any[] = this.csvToArray(csvContent)
      const columns = convertedCSV && convertedCSV.length ? convertedCSV[0] : [];
      const rows = convertedCSV && convertedCSV.length ? convertedCSV : [];
      let csvFromArrayOfArrays: any = convertArrayToCSV(rows, {
        columns,
        separator: ','
      });
      let blob = new Blob(['\ufeff' + csvFromArrayOfArrays], { type: 'text/csv;charset=utf-8;' });

      const url = (this.window as any).URL.createObjectURL(blob);
      const dlnk: any = document.createElement("a");
      dlnk.href = url;
      dlnk.download = this.updatedCsvFileName;
      dlnk.click();
      URL.revokeObjectURL(url);
    } else {
      this.setFileNames();
      this.checkValidationReport();
    }
  }

  downloadUploadedFile(): void {
    const blob = new Blob([this.createCaseFormFiles[0]], { type: "text/csv" });
    const url = (this.window as any).URL.createObjectURL(blob);
    const dlnk: any = document.createElement("a");
    dlnk.href = url;
    dlnk.download = this.uploadedFileName;
    dlnk.click();
    URL.revokeObjectURL(url);
  }

  downloadBatchFile(){
    if(this.incomingdata.detailData){
      let batchFilePath = this.incomingdata.detailData.documents[0];
      const params = {
        document_paths: [batchFilePath.filePath]
      };

      this.commonService.getDownloadDocumentpresignedUrl(params).then((response: any) => {
        if (response && response.presigned_url) {
          this.commonService.downloadFromPresigned(response.presigned_url, batchFilePath.fileName);
          this.sharedService.showFlashMessage( 'Successfully downloaded document with file name: ' + batchFilePath.fileName, 'success');
        } else {
          this.sharedService.showFlashMessage( 'Failed to download document with file name: ' + batchFilePath.fileName, 'danger');
        }
      })
    } else {
      this.downloadUploadedFile();
    }
  }

  uploadAnotherFile(): void {
    this.incomingdata.operation = 'case batch upload';
    this.uploader.queue.length = 0;
    this.fileList.length = 0;
    this.createCaseFormFiles.length = 0;
    this.enableUploadButton = false;
    this.clearValues();
    this.hideShowSections(true, false, false);
  }

  closeNotification(){
    this.isNofiticationClosed = true;
  }

  openNotification(){
    this.isNofiticationClosed = false;
  }

  // @reason : delete and close the poup on click on done after batch process complete
  // @date : 24 nov 2022
  // @author : ammshathwan

  closeScreeningPopup(){
    const batch_id = this.incomingdata.detailData && this.incomingdata.detailData.batch_id ? this.incomingdata.detailData.batch_id : (this.caseBatchId ? this.caseBatchId : '')
    this.deleteBacth(batch_id);
  }

  // @reason : removed processed batch file on click on close
  // @params : batch id
  // @params type : string
  // @date : 23 nov 2022
  // @author : ammshathwan

  deleteBacth(batchID:string){
    this.isBatchFileDeleted = true;
    if(batchID){
      this.caseManagementService.deleteCasebatch(batchID).subscribe(() => {
        this.isBatchFileDeleted = false;
        this.sharedService.showFlashMessage("Batch file deleted successfully" ,'success' )
        this.clearValues(true);
        this.dialogRef.close();
      }, (err) => {
        this.isBatchFileDeleted = false;
        this.sharedService.showFlashMessage("Can't delete the batch. Internal server error" ,'danger' )
      })
    }else{
      this.isBatchFileDeleted = false;
      this.sharedService.showFlashMessage("Can't delete the batch. Batch ID is mising" ,'danger' )
    }
  }

  public trackByFileName(_, item): string {
    return item._file.name
  }

  // @reason : convert given csv string to array
  // @params : csv string
  // @params type : string
  // @date : 17 APR 2023
  // @author : ammshathwan
  csvToArray(dataStr): any[] {
    let convertedCSVArray = dataStr.split("\n").map(function (line) {
        return line.split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
    });

    return convertedCSVArray;
}
}
