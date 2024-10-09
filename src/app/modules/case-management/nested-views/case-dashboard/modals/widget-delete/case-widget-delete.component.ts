import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';


export interface DialogData {
    message: string;
    ctype: string;
}

@Component({
  selector: 'app-case-widget-delete',
  templateUrl: './case-widget-delete.component.html',
  styleUrls: ['./case-widget-delete.component.scss']
})

export class CaseWidgetDeleteComponent {

    dialogData: DialogData;
    title:string;
    message:string;

    constructor(
        public dialogRef: MatDialogRef<CaseWidgetDeleteComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
                ) {}

    onConfirm(): void {
        this.dialogRef.close(true);
    }

    onDismiss(): void {
        this.dialogRef.close(false);
    }
}