import { I } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
// import { CustomToastNotificationComponent } from '../../toast-notifications/custom-toast-notification/custom-toast-notification.component';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';

/** Error when invalid control is dirty, touched, or submitted. */
export class BSTErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {

  @Output() newlyAddedComment = new EventEmitter<object>();
  @ViewChild('textareaRef', { static: false }) textareaRef: ElementRef<HTMLElement> | undefined;
  newComment: string = "";
  fileAttachments: Array<File> = [];
  isEditable: boolean = false;
  imgURL: string | undefined;
  fileURL: string | undefined;

  title: string = "";
  description: string = "";
  cancelBtnText: string = "";
  okBtnText: string = "";

  // @purpose: mention list configuration
  public mentionConfig = {
    items: ["Noah", "Liam", "Mason", "Jacob"],
    mentionSelect: (e: any) => {
      return '@' + e.label.trimRight() + ' ';
    },
  };

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit() {
  }

  matcher = new BSTErrorStateMatcher();
    
  onTextareaFocus() {
    this.isEditable = true;
  }

  onAddNewComment() {
    if (this.newComment != "" || this.fileAttachments.length > 0) {
      this.newlyAddedComment.emit({ comment: this.newComment, fileAttachments: this.fileAttachments });
    }
    this.newComment = "";
    this.isEditable = false;
    this.fileAttachments = [];
  }

  onCancelNewComment() {
    this.newComment = "";
    this.fileAttachments = [];
    this.isEditable = false;
  }

   // @purpose: open the file window in local computers
   onFileAttach(event): void {
    event.preventDefault();

    const element = (<HTMLInputElement>document.getElementById('fileAttachment'));
    if (element) {
      element.value = ""
      element.click();
    }
  }

    // @purpose: store selected files in a array
    onFileUpload(files): void {
      if (files && files.length) {
        for (let i = 0; i < files.length; i++) {
          this.fileAttachments.push(files[i]);
        }
  
        if (this.fileAttachments.length > 0) {
          for (let i = 0; i < this.fileAttachments.length; i++) {
            if (this.fileAttachments[i].type.match(/image/)) {
              const reader = new FileReader();
              reader.readAsDataURL(this.fileAttachments[i]);
              reader.onload = (_event) => {
                this.imgURL = reader.result as string;
              }
            } else {
              const reader = new FileReader();
              reader.readAsDataURL(this.fileAttachments[i]);
              reader.onload = (_event) => {
                this.fileURL = reader.result as string;
              }
            }
          }
        }
  
      }
    }

    // @purpose: Reomove selected file from attachment
    onRemoveAttach(file): void {
      if (file) {
        const index = this.fileAttachments.indexOf(file);
  
        if (index > -1) {
          this.fileAttachments.splice(index, 1)
        }
      }
    }

      // @purpose: Open openSnackBar
      openSnackBar(classItem: string, withOrWithoutButton: string, message: string) {
        // this._snackBar.openFromComponent(CustomToastNotificationComponent, {
        //   data: classItem + '_' + withOrWithoutButton + '_' + message,
        //   horizontalPosition: this.horizontalPosition,
        //   verticalPosition: this.verticalPosition,
        //   panelClass: ['bst-toast', classItem]
        // });
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
