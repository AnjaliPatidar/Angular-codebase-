import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { CaseManagementService } from '@app/modules/case-management/case-management.service';
import { AlertManagementService } from '@app/modules/alert-management/alert-management.service';
import { SharedServicesService } from '@app/shared-services/shared-services.service';

import * as moment from 'moment';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { AgGridTableService } from '../ag-grid-table/ag-grid-table.service';
import { WINDOW } from '../../../core/tokens/window';

@Component({
  selector: 'app-comments-section',
  templateUrl: './comments-section.component.html',
  styleUrls: ['../alerts-comments/alert-comments.component.scss']
})
export class CommentsSectionComponent implements OnInit {
  @ViewChild('scrollMe', { static: false }) private myScrollContainer: ElementRef;

  @Input() caseId;
  @Input() commentListItems;

  @Output() emitCount: EventEmitter<any> = new EventEmitter();

  public dateFormat = GlobalConstants.globalDateFormat;
  public commentMssg: any = "";
  public showListItems: boolean = false;
  public filteredItems: any;
  public listItemsValues: any;
  private currentComment: any = {};
  private commentListItemsCount: any;
  permissionIdsList: Array<any> = [];
  commentBoxPermissionView: boolean;
  public showFileSpinner: boolean = false;

  constructor(private _alertService: AlertManagementService, public _caseService: CaseManagementService, private _sharedServicesService: SharedServicesService,
    private _commonServices: CommonServicesService, private _agGridTableService: AgGridTableService,
    @Inject(WINDOW) private readonly window: Window) { }

  ngOnInit() {
    this.scrollToBottom();
    this.getComponentPermissionIds();
    this.isCommentPermissionView();
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ValidateDate(val) {
    if (val && val.indexOf && (val.indexOf('/') > -1 || val.indexOf('-') > -1)) {
      // let date = parseInt(val);
      if (val && moment(val).isValid() && this.dateFormat && this.dateFormat.ShortDateFormat && this.dateFormat.ShortDateFormat.toLowerCase() != 'undefined') {
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

  getDownload(doc) {
    this.showFileSpinner = true;
    this._sharedServicesService.showFlashMessage('Your file is being downloaded...', 'success');

    var params = {
      "docId": doc.docId,
      "source": doc.Source ? doc.Source : '',
      "path": doc.Path ? doc.Path : ''
    };

    this._alertService.downloadContent(params).subscribe((response: any) => {
      if (doc && doc.docName && doc.type) {
        var blob = new Blob([response], {
          type: "application/" + doc.type,
        });
        let url = (this.window as any).URL.createObjectURL(blob);
        var FileToDownload: any = document.createElement("a");
        document.body.appendChild(FileToDownload);
        FileToDownload.style = "display:none";
        FileToDownload.setAttribute('href', url);
        FileToDownload.setAttribute('download', doc.docName);
        FileToDownload.click();
      }
      this._sharedServicesService.showFlashMessage('Successfully downloaded document with file name: ' + doc.docName, 'success');
      this.showFileSpinner = false;
    }, (err) => {
      this._sharedServicesService.showFlashMessage('Failed to download document with file name: ' + doc.docName, 'danger');
      this.showFileSpinner = false;
    });
  }

  filterItem(value) {
    //
    this.showListItems = true;
    if (!value) {
      this.assignCopy();
    } // when nothing has typed
    this.filteredItems = Object.assign([], this.listItemsValues).filter(
      item => item.displayName.toLowerCase().indexOf(value.toLowerCase()) > -1
    )
    //
  }

  assignCopy() {
    this.filteredItems = Object.assign([], this.listItemsValues);
  }

  showList() {
    if (this.commentMssg == "") {
      this.showListItems = true;
    }
  }

  //function for updating comment
  commentMssgData(key) {
    if (this.caseId && key.commentMssgForValid) {
      var objTosend = {
        "caseId": {
          "caseId": Number(this.caseId)

        },
        "comments": key.commentMssgForValid

      }
      this._caseService.addComment(objTosend).subscribe(response => {
        //
        this.currentComment = response;
        // response.imgUrl = "../../../../assets/images/icon/usericon";
        this.commentListItems.push(response);
        this.commentListItemsCount = this.commentListItems.length;
        this.commentMssg = "";
        this.updateCommentCount();

        setTimeout(function(){
          var objDiv = document.getElementById("commentSection");
          objDiv.scrollTop = objDiv.scrollHeight;
        }, 1000);

        // this.scrollToBottom();
      })
    }
  }

  //file attach
  fileAttach(event) {
    event.preventDefault();
    var element = (<HTMLInputElement>document.getElementById('fileAttachment'));
    if (element) {
      element.value = ""
      element.click();
    }
  }

  public fileUpload(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;

    if (element.files && element.files[0]) {
      let fileSize = (element.files[0] && element.files[0].size) ? element.files[0].size : 0;
      if (!(this.currentComment && this.currentComment.commentId) && fileSize > 0) {
        this.commentMssgData({ "commentMssgForValid": " " });
        var i = 0;
        var timerObject = setInterval(() => {
          if (!(this.currentComment && this.currentComment.commentId)) {
            i++;
            if (i > 10) { clearInterval(timerObject); }
          } else {
            this.multiFileUpload(element.files);
            clearInterval(timerObject);
          }
        }, 1000);
      } else {
        this.multiFileUpload(element.files);
      }
    }
  }

  private multiFileUpload(fileList: FileList): void {
    let fileSizeFromSystemSettings = this.getFileSizeInNumber(GlobalConstants.systemsettingsData);

    let fileFormat = (fileList[0] && fileList[0].name) ? fileList[0].name.split(".")[fileList[0].name.split(".").length - 1] : '';
    let fileSize = (fileList[0] && fileList[0].size) ? fileList[0].size / 1024 / 1024 : 0;
    let allowedExtensions = [];
    GlobalConstants.systemsettingsData['General Settings'].forEach((item) => {
      if (item.section === 'File Settings' && item.selectedValue == 'On') {
        allowedExtensions.push(item.name);
      }
    });

    allowedExtensions = allowedExtensions.map(item => item === 'Zip Archived' ? 'zip' : item);

    if (fileFormat && allowedExtensions.indexOf(fileFormat) > -1) {
      if (fileSize && fileSizeFromSystemSettings && (fileSize <= fileSizeFromSystemSettings && fileSize > 0)) {

        var i = 0;

        for (i = 0; i < fileList.length; i++) {
          var docName = fileList[i].name;
          var params = {
            fileTitle: docName,
            remarks: docName,
            docFlag: 17,
            entityId: this.currentComment.commentId,
          }

          this._alertService.uploadDocumentForProof(params, fileList[i]).subscribe(response => {
            if (response) {
              if (!this.commentListItems[this.commentListItems.length - 1].attachment) {
                this.commentListItems[this.commentListItems.length - 1].attachment = [];
              }
              this.commentListItems[this.commentListItems.length - 1].attachment.push({ docName: response.docName, docId: response.docId })
              this.updateCommentCount();

              setTimeout(function(){
                var objDiv = document.getElementById("commentSection");
                objDiv.scrollTop = objDiv.scrollHeight;
              }, 2500);
            }
          })
        }

      } else if (fileSize == 0) {
        this._sharedServicesService.showFlashMessage('File size should be greater than ' + 0 + 'KB ...!', 'danger');
      } else {
        this._sharedServicesService.showFlashMessage('File size should not be greater than ' + fileSizeFromSystemSettings + 'MB ...!', 'danger');
      }
    } else {
      this._sharedServicesService.showFlashMessage(fileFormat + ' File not allowed...!', 'danger');
    }


  }

  /** Return file size of system settings
   * Written by : Ganapathi
   * Date : 13-May-2020
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

  updateCommentCount() {
    this.commentListItemsCount = this.commentListItems.length;
    this.emitCount.emit(this.commentListItemsCount);

    this._alertService.sendUpdatedCommentCount({caseId: this.caseId, commentsCount: this.commentListItemsCount });
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  getComponentPermissionIds() {
    this._agGridTableService.behaviorSubjectForAllPermisonIds$.subscribe(ids => {
      this.permissionIdsList = ids;
    })
  }

  isCommentPermissionView() {
    const commentBoxPermission = this._commonServices.getDomainPermissions(this.permissionIdsList, 'commentBox');
    const commentBoxPermissionLevel = this._commonServices.getPermissionStatusType(commentBoxPermission);
    this.commentBoxPermissionView = false;
    if (commentBoxPermissionLevel == 'view') {
      this.commentBoxPermissionView = true;
    }
  }

  public trackByDisplayName(_, item): string {
    return item.displayName;
  }
}
