import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  isConfirmDelete: boolean = false;
  comment_item: any | undefined;

  constructor( public dialogRef: MatDialogRef<ConfirmationModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirmDelete(): void {
    this.isConfirmDelete = true;
    this.dialogRef.close({ isConfirmDelete: this.isConfirmDelete, comment_item: this.data.comment_item });
  }
}
