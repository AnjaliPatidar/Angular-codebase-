import { Component, Inject, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
// import { CommentData } from '../../../types/comment-type';
// import { DialogData } from '../../../types/modal-type';
// import { CommentService } from '../../../services/comment.service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-comment-list-item',
  templateUrl: './comment-list-item.component.html',
  styleUrls: ['./comment-list-item.component.scss']
})
export class CommentListItemComponent implements OnInit {

  @Output() deletedComment: EventEmitter<any> = new EventEmitter();

  @Input() comment: any | undefined;
  @Input() index: any;
  @Input() isLast: any;

  showEditSection = false;
  private _onDestroy = new Subject<void>();
  mentionedUserIds = [];
  private userId: string | undefined;
  editCommentForm: FormGroup | undefined;

  title: string = "";
  description: string = "";
  cancelBtnText: string = "";
  okBtnText: string = "";
  comment_item: any | undefined;

  fileAttachments: Array<File> = [];
  imgArray: Array<File> = [];
  fileArray: Array<File> = [];

  imgURL: string | undefined;
  fileURL: string | undefined;

  constructor(public datepipe: DatePipe, public dialog: MatDialog) { }

  ngOnInit() {
    this.editCommentForm = new FormGroup({
      editedComment: new FormControl(
        this.comment?this.comment.comment:"",
      ),
    });

    if (this.comment && this.comment.fileAttachments) {
      for (let i = 0; i < this.comment.fileAttachments.length; i++) {
        if (this.comment.fileAttachments[i].type.match(/image/)) {
          const reader = new FileReader();
          reader.readAsDataURL(this.comment.fileAttachments[i]);
          reader.onload = (_event) => {
            this.imgURL = reader.result as string;
          }
          this.imgArray.push(this.comment.fileAttachments[i]);
        } else {
          const reader = new FileReader();
          reader.readAsDataURL(this.comment.fileAttachments[i]);
          reader.onload = (_event) => {
            this.fileURL = reader.result as string;
          }
          this.fileArray.push(this.comment.fileAttachments[i]);
        }
      }
      this.comment.fileAttachments = [];
      if(this.fileArray.length > 0){
        for(var i = 0; i <= this.fileArray.length - 1; i++){
          this.comment.fileAttachments.push(this.fileArray[i]);
        }
      } 
      if(this.imgArray.length > 0){
        for(var i = 0; i <= this.imgArray.length - 1; i++){
          this.comment.fileAttachments.push(this.imgArray[i]);
        }
      } 
    }
  }

  showEditBtns() {
    if (this.comment && this.comment.user_id) {
      return this.userId == this.comment.user_id;
    }
  }

  // @purpose: Prevent Enter of the text box
  preventEnter(e): void {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.showEditSection = false;
    }
  }

  closeCommentBox(): void {
    this.showEditSection = false;
  }

  editUserComment(): void {
    this.showEditSection = true;
  }

  openDeleteModal(): void {
    this.cancelBtnText = "cancel";
    this.okBtnText = "delete";
    this.title = "Delete Comment?";
    this.description = "You are about to delete a comment. Please confirm.";

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '600px',
      data: {
        title: this.title,
        description: this.description,
        cancelBtnText: this.cancelBtnText,
        okBtnText: this.okBtnText,
        comment_item: this.comment,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.isConfirmDelete == true) {
        this.deletedComment.emit(this.comment);
      }
    });
  }

  openRemoveAttachmentModal(attachment: File): void {
    this.cancelBtnText = "cancel";
    this.okBtnText = "remove";
    this.title = "Remove Attachment?";
    this.description = "Are you sure you want to remove the attachment? Please confirm.";

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '600px',
      data: {
        title: this.title,
        description: this.description,
        cancelBtnText: this.cancelBtnText,
        okBtnText: this.okBtnText,
        comment_item: this.comment,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.isConfirmDelete == true) {
        this.onRemoveAttach(attachment);
      }
    });
  }

  openRemoveImageModal(attachment: File): void {
    this.cancelBtnText = "cancel";
    this.okBtnText = "remove";
    this.title = "Remove Image?";
    this.description = "Are you sure you want to remove the image? Please confirm.";

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '600px',
      data: {
        title: this.title,
        description: this.description,
        cancelBtnText: this.cancelBtnText,
        okBtnText: this.okBtnText,
        comment_item: this.comment,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.isConfirmDelete == true) {
        this.onRemoveAttach(attachment);
      }
    });
  }

  onCancelUpdatedComment() {
    this.showEditSection = false;
  }

  onSaveUpdatedComment() {
    if (this.comment && this.comment.id) {
      this.comment.comment = this.editCommentForm?this.editCommentForm.get('editedComment')?this.editCommentForm.get('editedComment').value:"":"";
      this.comment.fileAttachments = this.comment.fileAttachments;
    }
    this.showEditSection = false;
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  // @purpose: Reomove selected file from attachment
  onRemoveAttach(file): void {
    if (file && this.comment && this.comment.fileAttachments) {
      const index = this.comment.fileAttachments.indexOf(file);

      if (index > -1) {
        this.comment.fileAttachments.splice(index, 1)
      }
      this.fileAttachments = this.comment.fileAttachments;
    }
  }

  // @purpose: download attachment on click
  downloadAttachedFile(file: File, url: any) {
    const link = document.createElement('a');
    link.setAttribute('target', '_self');
    link.setAttribute('href', url);
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

}
