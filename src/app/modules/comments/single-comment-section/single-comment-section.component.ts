import { CaseSharedDataService } from './../../../shared-services/data/case-shared-data.service';
import { CommonServicesService } from './../../../common-modules/services/common-services.service';
import { SharedServicesService } from './../../../shared-services/shared-services.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { CaseManagementService } from '@app/modules/case-management/case-management.service';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmaionmodalComponent } from '@app/modules/systemsetting/modals/confirmaionmodal/confirmaionmodal.component';

@Component({
  selector: 'app-single-comment-section',
  templateUrl: './single-comment-section.component.html',
  styleUrls: ['./single-comment-section.component.scss']
})
export class SingleCommentSectionComponent implements OnInit {
  isCommentHovered:boolean = true;
  isCommentEditMode:boolean;
  commentContent:string
  dateFormat = GlobalConstants.globalDateFormat;
  currentComment
  showFileSpinner:boolean
  file = []
  editedFile = [];
  permissionIdsList: Array<any> = [];
  commentBoxPermissionView: boolean;
  actionHoverd: boolean;
  fileAttachments: Array<any>
  currentUserDetails;
  commentDate;
  dateFromat: string = "DD,MMM,YYYY"

  @Input('comment') comment;
  @Input('caseId') caseId;
  @Input('editModeStatus') editModeStatus;
  @Output('updated') updated: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('caseWorkBenchPermissionJSON') caseWorkBenchPermissionJSON;

  constructor(
    private caseManagementService:CaseManagementService,
    private sharedService:SharedServicesService,
    private commonServicesService: CommonServicesService,
    private caseSharedDataService:CaseSharedDataService,
    public modalservice: NgbModal,
  ) { }

  ngOnInit() {
    this.getFormart();
    if(this.comment && this.comment.attachment){
      this.file = this.comment.attachment
      this.editedFile = this.file;
      this.commentDate = this.comment.updated_date ? moment.utc(this.comment.updated_date).local() : moment.utc(this.comment.created_date).local();
      this.currentUserDetails = this.caseSharedDataService.currentLoggedUser;
    }
  }

  // @purpose: process after click the edit button
  // @date: 12/09/2021
  // @author: ammshathwan
  editExisitingComments(comment):void{
    this.isCommentEditMode = true;
    this.isCommentHovered = false;
    if(comment && comment.comments){
      this.commentContent = comment.comments;
    }
  }

  // @reason : Comment set max characters length 3072
  // @author: Tetiana
  // @date: April 21 2022
  onKeyUp() {
    if (this.commentContent.length > 3071) {
      const message = this.getLanguageKey('Comment can max 3072 characters long.') ? this.getLanguageKey('Comment can max 3072 characters long.') : 'Comment can max 3072 characters long.'
      this.sharedService.showFlashMessage(message, 'danger');
    }
  }

  // @purpose: process after click cancel button while edit
  // @date: 12/09/2021
  // @author: ammshathwan
  cancelEdit():void{
    this.isCommentEditMode = false;
    this.isCommentHovered = true;
    this.commentContent = "";
  }

  // @purpose: validate the comment created date
  // @date: 12/09/2021
  // @author: ammshathwan
  ValidateDate(val):string {
    if (val && (val.indexOf('/') > -1 || val.indexOf('-') > -1)) {
      if (val && moment(val).isValid() && this.dateFormat && this.dateFormat.ShortDateFormat) {
        let formattedDate = moment(val).format(this.dateFormat.ShortDateFormat.toUpperCase());
        if (formattedDate != 'Invalid date') {
          return formattedDate;
        } else {
          return val;
        }
      } else {
        return val;
      }
    } else {
      return val;
    }
  }

  // @purpose: Update the exisiting comment
  // @date: 12/09/2021
  // @author: ammshathwan
  updateComments(commentId):void{
    const fileNames = []
    var uploadDocument = [];

    if(this.fileAttachments && this.fileAttachments.length){
      this.fileAttachments.forEach(file => {
        fileNames.push(file && file.doc_name ? file.doc_name : '')
        const params =  {
        "document_id": file.doc_id,
        "reference_id": commentId,
        "reference_type": "case comment"
    }
      uploadDocument.push(params)
      })
      if(fileNames.length) {
        this.caseManagementService.getDocumentLocation(fileNames).then(res =>{
          if(res) {
            for (let i = 0; i < res.length; i++) {
              const found = this.fileAttachments.find(
                (element) => element.doc_name === res[i].fileName
              );
              if (found) {
                this.caseManagementService.callPresignedUrl(found, res[i].presignedUrl).then((response) => {
                  if(i == res.length - 1) {
                    return this.caseManagementService.deleteDocumentFromComment(uploadDocument).toPromise().then(res => {
                    })
                  }
                });
              }
            }

          }
        })
      }
    }

    if(commentId){
      const params = {
        "comment_id": commentId,
        "comment": this.commentContent,
        "updated_date": moment()
      }
      this.caseManagementService.editComment(params).subscribe(response => {
        this.currentComment = response;
        this.comment = response;
        this.file = this.comment.attachment;
        this.updated.emit(true);
        this.sharedService.showFlashMessage('Comment updated successfully.', 'success');
      })
      this.cancelEdit();
    }
  }

  // @purpose: Download the selected file form comments
  // @date: 14/10/2021
  // @author: ammshathwan
  getDownload(doc):void{
    this.showFileSpinner = true;
    this.sharedService.showFlashMessage( 'Your file is being downloaded...', 'success');

    const params = {
      document_paths: [doc.file_path]
    };

    this.commonServicesService.getDownloadDocumentpresignedUrl(params).then((response: any) => {
      if (response && response.presigned_url) {
        this.commonServicesService.downloadFromPresigned(response.presigned_url, doc.doc_name)
        this.sharedService.showFlashMessage( 'Successfully downloaded document with file name: ' + doc.doc_name, 'success');
        this.showFileSpinner = false;
      }
      else {
        this.sharedService.showFlashMessage( 'Failed to download document with file name: ' + doc.doc_name, 'danger');
        this.showFileSpinner = false;
      }
    });
  }

  // @purpose: while edit comment remove attachments
  // @date: 14/10/2021
  // @author: ammshathwan
  removeAttachment(document):void{
    const tempFileArray = []
    if(document){
      tempFileArray.push(document)
      const index = this.editedFile.indexOf(document.doc_id , 1)
      if(index){
        this.editedFile.splice(index);
      }
      this.fileAttachments = tempFileArray
    }
  }

  onHoverComment():void{
    this.actionHoverd = true;
  }
  onMouseLeave():void{
    this.actionHoverd = false;
  }

  onDeleteComments(comment){
    if(comment && comment.comment_id){
      var modalInstanceDel = this.modalservice.open(ConfirmaionmodalComponent, {
        windowClass:
          "delete-modal-wrapper custom-modal c-arrow center bst_modal add-ownership-modal add-new-officer",
      });
      let message = this.getLanguageKey("You are about to delete a comment. Please confirm.") ? this.getLanguageKey("You are about to delete a comment. Please confirm.") : "You are about to delete a comment. Please confirm.";
      modalInstanceDel.componentInstance.title = message;
      modalInstanceDel.componentInstance.deleteTitle = 'Delete Comment?';
      modalInstanceDel.componentInstance.isShowHeader = true;
      modalInstanceDel.componentInstance.confirmationData.subscribe((resp) => {
        if (resp) {
          if(comment.attachment && comment.attachment.length) {
            const fileNames = []
            var uploadDocument = [];

          comment.attachment.forEach(file => {
            fileNames.push(file && file.doc_name ? file.doc_name : '')
            const params =  {
            "document_id": file.doc_id,
            "reference_id": comment.comment_id.toString(),
            "reference_type": "case comment"
          }
          uploadDocument.push(params)
          })
          if(fileNames.length) {
            this.caseManagementService.getDocumentLocation(fileNames).then(res =>{
              if(res) {
                for (let i = 0; i < res.length; i++) {
                  const found = comment.attachment.find(
                    (element) => element.doc_name === res[i].fileName
                  );
                  if (found) {
                    this.caseManagementService.callPresignedUrl(found, res[i].presignedUrl).then((response) => {
                      if(i == res.length - 1) {
                        return this.caseManagementService.deleteDocumentFromComment(uploadDocument).toPromise().then(res => {
                          this.deleteComment(comment.comment_id)
                        })
                      }
                    });
                  }
                }
              }
            })
          }
          } else {
            this.deleteComment(comment.comment_id)
          }
        }
      })
    }
  }

  getLanguageKey(text) {
    var langKey = text;
    if (GlobalConstants.languageJson) {
      langKey = GlobalConstants.languageJson[text];
    }
    return langKey;
  }

  deleteComment(comment_id){
    if(comment_id){
      this.caseManagementService.deleteComment(comment_id).subscribe(res => {
        if(res){
          this.updated.emit(true)
          this.sharedService.showFlashMessage('Successfully Deleted Comment', 'success');
        }
      })
    }
  }

  // @purpose: Convert UTC dates to local dates
  // @date: 06 DEC 2022
  // @author: ammshathwan
  // @params: date
  getCreatedDate(createdDate:string): string {
    let date = new Date(createdDate + ".000Z")
    return moment(date).format(this.dateFromat + ',hh:mm:ss A')
  }

  getFormart() {
    this.sharedService.dateFormatValue.subscribe((date) => this.dateFromat = date ? date : 'DD MMM YYYY');
  }

  public trackByFilePath(_, item): string {
    return item.file_path;
  }
}
