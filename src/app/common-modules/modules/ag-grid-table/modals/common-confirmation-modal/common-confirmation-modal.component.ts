import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-common-confirmation-modal',
  templateUrl: './common-confirmation-modal.component.html',
  styleUrls: ['./common-confirmation-modal.component.scss']
})
export class CommonConfirmationModalComponent implements OnInit {

  dialogData:string;
  constructor(public dialogRef: MatDialogRef<CommonConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.dialogData = this.data;
     }

  ngOnInit() {
  }

  onClick(isConfirmed:boolean):void{
    this.dialogRef.close(isConfirmed);
  }

}
