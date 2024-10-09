import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { HitTransactionListComponent } from '../../../hit-transaction-list/hit-transaction-list.component';

@Component({
  selector: 'app-tm-alert-card-hit-hyperlink',
  templateUrl: './tm-alert-card-hit-hyperlink.component.html',
  styleUrls: ['./tm-alert-card-hit-hyperlink.component.sass']
})
export class TmAlertCardHitHyperlinkComponent implements OnInit, Partial<ICellRendererAngularComp> {

  public rowData: any;
  public cellValue: any;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  public agInit(params): void {

    if (params.data) {
      this.cellValue = params.data[params.column['colId']];
      this.rowData = params.data;
    }
  }

  openTransactionsPopup() {
    const dialogRef = this.dialog.open(HitTransactionListComponent, {
      disableClose: true,
      panelClass: ['user-popover', 'custom-scroll-wrapper', 'bg-tm-hit-transactions', 'light-theme'],
      data: {
        hitId: this.rowData['hitId'],
        hitName: this.rowData['name']
      },
      width: '80%'
    });
  }

}
