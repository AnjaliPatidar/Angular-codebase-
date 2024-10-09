import { CaseSharedDataService } from './../../../shared-services/data/case-shared-data.service';
import { UserSharedDataService } from './../../../shared-services/data/user-shared-data.service';
import { UserService } from '@app/modules/user-management/services/user.service';
import { SharedServicesService } from './../../../shared-services/shared-services.service';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CaseManagementService } from '@app/modules/case-management/case-management.service';
import * as moment from 'moment';
import { ScreeningBatchFileComponent } from '@app/common-modules/modules/ag-grid-table/modals/screening-batch-file/screening-batch-file.component';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  commentListItems: any[] = [];
  caseId: number;
  comment: string;
  isEditMode: boolean;
  isAttachmentAdd: boolean;
  isLoading: boolean = false;
  private currentComment: any = {};
  fileAttachments: Array<File> = [];
  editedFile: Array<File> = [];
  caseWorkBenchPermissionJSON
  editModeStatus
  isIDFound: boolean
  caseName: string
  repoDocumentList = []
  commentId:string;
  removeFileIdList = []

  constructor(
    public dialogRef: MatDialogRef<CommentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private caseManagementService: CaseManagementService,
    private sharedService: SharedServicesService,
    private userService: UserService,
    private userSharedDataService: UserSharedDataService,
    private caseSharedDataService: CaseSharedDataService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.setPopupPosition();
    this.getCommentsData();
    this.caseWorkBenchPermissionJSON = this.data.caseWorkBenchPermissionJSON;
    this.editModeStatus = this.data.editModeStatus;
    this.fetchcurrentLoggedUser();
  }
  // @purpose: set the popup opening position
  // @date: 12/08/2021
  // @author: ammshathwan
  private setPopupPosition(): void {
    if (this.data.positionRelativeToElement && this.data.positionRelativeToElement.nativeElement) {
      const matDialogConfig = new MatDialogConfig()
      const rect: DOMRect = this.data.positionRelativeToElement.nativeElement.getBoundingClientRect()
      if (this.data && this.data.commentContainer) {
        if (this.data.commentContainer === "case card") {
          matDialogConfig.position = { left: `${rect.right - 370}px`, top: `${rect.bottom + 10}px` }
        } else if (this.data.commentContainer === "case list") {
          matDialogConfig.position = { left: `${rect.right + 10}px`, top: `${rect.top - 400}px` }
        } else {
          matDialogConfig.position = { left: `${rect.right - 370}px`, top: `230px` }
        }
        this.dialogRef.updatePosition(matDialogConfig.position)
      }
    }
  }

  // @purpose: close the opened poup through close icon
  // @date: 12/08/2021
  // @author: ammshathwan
  close(isCancel: boolean = true): void {
    this.dialogRef.close(!isCancel);
  }

  // @purpose: Get all the comments related to case
  // @date: 12/09/2021
  // @author: ammshathwan
  private getCommentsData(): void {
    this.isLoading = true;
    if (this.data && this.data.caseId && this.data.caseName) {
      this.caseId = this.data.caseId;
      this.caseName = this.data.caseName
    }
    if (this.caseId) {
      this.isIDFound = true;
      this.caseManagementService
        .getCommentsListBycaseID(this.caseId)
        .subscribe((resp: any) => {
          if (resp) {
            resp.map((value: any) => {
              if (value && value.imgUrl) {
                value.imgUrl = '../../../../../assets/images/icon/usericon';
              }
            });
            this.commentListItems = resp.sort(function (el1, el2) {
              return new Date(el2.created_date).getTime() - new Date(el1.created_date).getTime();
            });
            this.updateCommentCount();
            this.updateCaseCommentCount();
            this.isLoading = false;
          }
          else {
            this.isLoading = false;
            this.isIDFound = false;
            this.commentListItems = [];
            this.updateCommentCount();
          }
        });
    } else {
      this.isIDFound = false
    }
  }

  // @purpose: Show send and cancel button for new comment
  // @date: 12/09/2021
  // @author: ammshathwan
  commentChanged(value: string): void {
    if (value) {
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }
  }

  // @purpose: Cancel edit action in comment
  // @date: 12/09/2021
  // @author: ammshathwan
  cancelEditComment(): void {
    this.isEditMode = false;
    this.comment = "";
  }

  /**
   * Create comment and upload respective attachments, The comment will be created and then the attachments will be linked to that comment.
   * If there was a issue at any point, linked attachments will be removed and comment will be deleted.
   * @returns
   */
  createComments(): void {
    if (this.caseId) {

      const commentParams = {
        "case_id": Number(this.caseId),
        "comment": this.comment || '',
        "created_date": moment()
      }

      // there should be atleast a comment or an attachment from either repository or direct uploaded
      if (!((this.fileAttachments && this.fileAttachments.length) || (this.repoDocumentList && this.repoDocumentList.length) || this.comment)) {
        this.sharedService.showFlashMessage('Enter a valid comment', 'danger');
        return;
      }

      // validate direct uploaded files
      if (this.fileAttachments.length && !this.multifileUpload(this.fileAttachments)) {
        return;
      }

      this.showLoader();

      this.caseManagementService.addComment(commentParams).subscribe(response => {
        this.currentComment = response;

        const attachmentUploadPromisesList: Promise<void>[] = [];

        if (this.repoDocumentList && this.repoDocumentList.length) {
          attachmentUploadPromisesList.push(this.connectDocumentsToCases());
        }

        if (this.fileAttachments && this.fileAttachments.length) {
          attachmentUploadPromisesList.push(this.uploadFile(this.fileAttachments, response.comment_id.toString()));
        }

        // Wait for all file upload events and if no file upload events it will resolve by default.
        Promise.all(attachmentUploadPromisesList).then(_ => {
          this.editedFile = [];
          this.hideLoader();
          this.repoDocumentList = [];
          this.fileAttachments = [];
          this.cancelEditComment();

          this.refreshDialgData();
          this.updateCommentCount();
          this.updateCaseCommentCount();

          setTimeout(() => {
            /**
             * TODO: The flash message is shown with a 3 second delay because current flash message implementation doesnt support stacking
             * and hence will replace whichever flashes are currently shown before the user can even see them.
             * In this case error messages related to file uploads.
             */
            this.sharedService.showFlashMessage('Comment created successfully.', 'success');
          }, 3000);

        }, err => {
          // TODO: Fix this function to properly delete comment attachments with a proper API.
          this.onDeleteComments(this.currentComment, false);
          this.hideLoader();
          this.sharedService.showFlashMessage(err || "Something bad happened. please try again later.", 'danger');
        });

      });

    } else {
      this.sharedService.showFlashMessage('Case not found.', 'danger');
    }
  }

  showLoader() {
    this.isLoading = true;
  }

  hideLoader() {
    this.isLoading = false;
  }

  private uploadFile(files: any[], comment_id: string): Promise<void> {
    var uploadDocument = [];
    var fileNames = [];
    let userId: any = GlobalConstants.systemSettings['ehubObject']['userId'];
    for (let i = 0; i < this.fileAttachments.length; i++) {
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
          "reference_id": comment_id,
          "reference_type": "case comment",
          "size": fileSize.toString(),
          "title": title,
          "updated_by": userId.toString(),
          "version_handler": "",
          "main_entity_id": this.caseId.toString(),
          "reference_name": this.caseName,
          "timestamp": moment(new Date(), ["h:mm A"]).format('YYYY-MM-DD HH:mm:ss'),
          "meta_data": '{}'
        }
        uploadDocument.push(params)
      }
    }

    return new Promise((resolve, reject) => {
      this.caseManagementService.uploadDocumentForProof(uploadDocument).subscribe(resp => {
        const existsDocuments = [];
        const existsDocumentsReferences = [];
        if (resp) {
          let resultDocumentExistsMessage = '';
          var documents = this.getLanguageKey('Document(s)') ? this.getLanguageKey('Document(s)') : 'Document(s)'
          var allreadyExists = this.getLanguageKey('already exists') ? this.getLanguageKey('already exists') : 'already exists'
          var referenceLinkCreated = this.getLanguageKey('in the repository.') ? this.getLanguageKey('in the repository.') : ' in the repository.'
          resp.forEach(element => {
            if (element.is_uploaded) {
              fileNames.push(element.file_info.file_path)
              if (fileNames.length) {
                this.caseManagementService.getDocumentLocation(fileNames).then(res => {
                  if (res) {
                    for (let i = 0; i < res.length; i++) {
                      const found = files.find(
                        (element) => element.name === res[i].fileName
                      );
                      if (found) {
                        this.caseManagementService.callPresignedUrl(found, res[i].presignedUrl).then((response) => {
                          this.sharedService.showFlashMessage('Comment created successfully', 'success');
                          this.refreshDialgData();
                          this.editedFile = []
                        })
                      }
                    }
                  }
                })
              }
            } else if (element.is_uploaded == false && element.reason[0].includes('New reference')) {
              existsDocumentsReferences.push(element.file_info.file_name);
            } else if (element.is_uploaded == false) {
              existsDocuments.push(element.file_info.file_name);
            }
          });
          if (existsDocuments.length) {
            let documentName = existsDocuments.length > 1 ? existsDocuments.join(', ')
              : (existsDocuments.length == 1) ? existsDocuments[0] : '';
            resultDocumentExistsMessage.length && (resultDocumentExistsMessage += '<br/>');
            resultDocumentExistsMessage +=  documents + " '" + documentName + "' " + allreadyExists;
          }
          if (existsDocumentsReferences.length) {
            let documentName = existsDocumentsReferences.length > 1 ? existsDocumentsReferences.join(', ')
              : (existsDocumentsReferences.length == 1) ? existsDocumentsReferences[0] : '';
            resultDocumentExistsMessage.length && (resultDocumentExistsMessage += '<br/>');
            resultDocumentExistsMessage +=  documents + " '" + documentName + "' " + allreadyExists + referenceLinkCreated;
          }

          if (existsDocuments.length || existsDocumentsReferences.length) {
            this.sharedService.showFlashMessage(resultDocumentExistsMessage, 'info');
          }

          resolve();
        }
      },
        (err) => {
          reject(err);
        });
    });
  }

  // @purpose: open the file window in local computers
  // @date: 14/12/2021
  // @author: ammshathwan
  fileAttach(): void {
    const dialogRef = this.dialog.open(ScreeningBatchFileComponent, {
      disableClose: true,
      panelClass: ['user-popover', 'custom-scroll-wrapper', 'bg-screening', 'light-theme'],
      backdropClass: 'modal-background-blur',
      data: {
        operation: "case comments",
        'caseId': this.caseId ?this.caseId : '',
        'caseName': this.caseName ? this.caseName : ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fileAttachments = result && result.fileList ? result.fileList : []
      this.editedFile = this.fileAttachments;
      this.caseManagementService.updateCaseAttachmentDataObserver.subscribe(data => {
        if(data){
          this.repoDocumentList = data
        }
      })
      this.isEditMode = this.editedFile.length || this.repoDocumentList && this.repoDocumentList.length ? true : false
    })
  }

  // @purpose: validate selected files before uploading
  // @date: 14/12/2021
  // @author: ammshathwan
  multifileUpload(file): boolean {
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
      if (fileSize && fileSizeFromSystemSettings && (fileSize <= fileSizeFromSystemSettings && fileSize > 0)) {
        return true
      } else if (fileSize == 0) {
        this.sharedService.showFlashMessage('File size should be greater than ' + 0 + 'KB ...!', 'danger');
        this.editedFile = []
        return false
      } else {
        this.sharedService.showFlashMessage('File size should not be greater than ' + fileSizeFromSystemSettings + 'MB ...!', 'danger');
        this.editedFile = []
        return false
      }
    } else {
      this.sharedService.showFlashMessage(fileFormat + 'File not allowed...!', 'danger');
      this.editedFile = []
      return false
    }
  }

  // @purpose: get the file size nmber
  // @date: 14/12/2021
  // @author: ammshathwan
  getFileSizeInNumber(obj): number {
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

  // @purpose: update the comment data after new comment is created
  // @date: 14/12/2021
  // @author: ammshathwan
  refreshDialgData(): void {
    this.getCommentsData();
    this.dialogRef.componentInstance.data = this.commentListItems;
  }

  // @purpose: update the count for all the places
  // @date: 15/12/2021
  // @author: ammshathwan
  updateCommentCount(): void {
    this.caseManagementService.behaviorSubjectForCommentCount.next(this.commentListItems.length)
  }

  // @purpose: update comment count for case list
  // @date: 13/05/2022
  // @author: Kasun Karunathilaka
  updateCaseCommentCount(): void {
    this.caseManagementService.behaviorSubjectForCaseCommentCount.next({length: this.commentListItems.length, id: this.caseId})
  }

  // @purpose: Reomove selected file from  local attachment
  // @date: 15/12/2021
  // @author: ammshathwan
  removeAttach(file): void {
    if (file) {
      const index = this.editedFile.indexOf(file);

      if (index > -1) {
        this.editedFile.splice(index, 1)
      }
      this.fileAttachments = this.editedFile;
    }
  }

  fetchcurrentLoggedUser() {
    let userId: any = GlobalConstants.systemSettings['ehubObject']['userId'];
    this.userService.getUserById(userId)
      .then((response: any) => {
        if (response.status && response.status == "success" && response && response.data) {
          this.userSharedDataService.setUserDetails(response);
          this.caseSharedDataService.currentLoggedUser = response;
        }
      });
  }
  // @reason : Add localization text
  // @author: Kasun Karunathilaka
  // @date: Mar 02 2022
  getLanguageKey(text) {
    var langKey = text;
    if (GlobalConstants.languageJson) {
      langKey = GlobalConstants.languageJson[text];
    }
    return langKey;
  }

  // @reason : Comment set max charcaters length 3072
  // @author: Kasun Karunathilaka
  // @date: Mar 02 2022
  onKeyUp() {
    if (this.comment.length > 3072) {
      const message = this.getLanguageKey('Comment can max 3072 characters long.') ? this.getLanguageKey('Comment can max 3072 characters long.') : 'Comment can max 3072 characters long.'
      this.sharedService.showFlashMessage(message, 'danger');
    }
  }

  onDeleteComments(comment, isShowMessage){
    if (comment && comment.comment_id) {
      if (comment.attachment && comment.attachment.length) {
        const fileNames = []
        var uploadDocument = [];

        comment.attachment.forEach(file => {
          fileNames.push(file && file.doc_name ? file.doc_name : '')
          const params = {
            "document_id": file.doc_id,
            "reference_id": comment.comment_id,
            "reference_type": "case comment"
          }
          uploadDocument.push(params)
        })
        if (fileNames.length) {
          this.caseManagementService.getDocumentLocation(fileNames).then(res => {
            if (res) {
              for (let i = 0; i < res.length; i++) {
                const found = comment.attachment.find(
                  (element) => element.doc_name === res[i].fileName
                );
                if (found) {
                  this.caseManagementService.callPresignedUrl(found, res[i].presignedUrl).then((response) => {
                    if (i == res.length - 1) {
                      return this.caseManagementService.deleteDocumentFromComment(uploadDocument).toPromise().then(res => {
                        this.deleteComment(comment.comment_id, isShowMessage)
                      })
                    }
                  });
                }
              }

            }
          })
        }
      } else {
        this.deleteComment(comment.comment_id, isShowMessage)
      }
    }
  }

  deleteComment(comment_id, isShowMessage):void{
    if (comment_id) {
      this.caseManagementService.deleteComment(comment_id).subscribe(res => {
        if (res) {

          if (isShowMessage) {
            this.sharedService.showFlashMessage('Successfully Deleted Comment', 'success');
          }

          this.editedFile = []
        }
      })
    }
  }

   // @reason : get the list of selected document file path from DMS repo
  // @author : Ammshathwan
  // @date : 21st APR 2022
  getDocumentsFromDMS(selectedDocuments):any[]{
    let selectedDocumentsList = []
    this.caseManagementService.repoDocumentListDataObserver.subscribe(data => {
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

  /**
   * Link documents to comment
   * @returns promise that resolves if link was success or rejects if failed to link. The reject may or may not contain a failed reason.
   */
  connectDocumentsToCases(): Promise<void>{
    const documentPaths = this.getDocumentsFromDMS(this.repoDocumentList)
    const params = {
      "documents_case_connection_request": [
          {
            "caseId": this.caseId ? this.caseId.toString() : "",
            "documentPaths": documentPaths && documentPaths.length ? documentPaths : [],
              "caseName": this.caseName ? this.caseName : "",
              "referenceType": "case comment",
              "referenceId": this.currentComment.comment_id ? this.currentComment.comment_id.toString() : ""
          }
      ],
      "user_id": this.caseSharedDataService.currentLoggedUser && this.caseSharedDataService.currentLoggedUser.data && this.caseSharedDataService.currentLoggedUser.data.userId ? this.caseSharedDataService.currentLoggedUser.data.userId.toString() : ''
  }

  return new Promise((resolve, reject) => {
    this.caseManagementService.connectDocumentsToCases(params).subscribe(res => {
      if(res){
        if (res[0].status && res[0].status == 'error') {

          // if messages contains files with broken links, extract the file names.
          const brokenLinksFilesArr = res[0].messages.map(msg => (msg.split("- Key doesn't exist") || [''])[0].trim() );

          // if files with broken links exists, build a error message with filenames to be shown to user
          if (brokenLinksFilesArr) {
            let filesHasBrokenLinksErrMsg = `Following files cannot be attached, ${brokenLinksFilesArr.join(', ')}`;

            reject(filesHasBrokenLinksErrMsg);
          }

          reject();
        }

        resolve();
      }
    })
  });
}

  // @reason : Remove selected documentn from document list
  // @author : Ammshathwan
  // @date : 16th JUN 2022
  removeConnectedDocuments(item):void{
    let index:number = this.repoDocumentList.indexOf(item)
    if (index > -1) {
      this.repoDocumentList.splice(index)
    }
  }

  public trackByCreatedDate(_, item): string {
    return item.created_date;
  }
}
