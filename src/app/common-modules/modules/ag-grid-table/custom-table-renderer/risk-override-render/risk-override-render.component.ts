import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CaseOverrideHistoryDialog } from '@app/modules/case-management/models/case-override/case-override-dialog-history.model';
import { CaseRiskOverrideHistoryComponent } from '@app/modules/case-management/nested-views/case-dashboard/modals/case-risk-override-history/case-risk-override-history.component';

@Component({
  selector: 'app-risk-override-render',
  templateUrl: './risk-override-render.component.html',
  styleUrls: ['./risk-override-render.component.scss']
})
export class RiskOverrideRenderComponent implements OnInit {

  risk: string;
  caseId: string;
  caseRiskList: any[];
  dialogRef: MatDialogRef<CaseRiskOverrideHistoryComponent>;
  @ViewChild('caseRiskIcon', { static: false }) public caseRiskIcon: ElementRef;
  isInforClicked:boolean

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  agInit(params: any): void {
    if (params && params.data) {
      this.risk = (params.data.risk_override) ? params.data.risk_override : '';
      this.caseId = (params.data.id) ? params.data.id : '';
      this.caseRiskList = (params.colDef.options) ? params.colDef.options : [];
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(e) {
    if (this.caseRiskIcon && this.dialogRef) {
      if (!this.caseRiskIcon.nativeElement.contains(e.target)) {
        this.dialogRef.close();
        this.isInforClicked = false;
      }
    }
  }

  showRiskOverriderideInfo(): void {
    if(!this.isInforClicked){
      const data: CaseOverrideHistoryDialog = {
        caseId: this.caseId, riskIndicatorId: '0', positionRelativeToElement: this.caseRiskIcon, caseRisks: this.caseRiskList, fistOnly: true
      }
      this.dialogRef = this.dialog.open(CaseRiskOverrideHistoryComponent, {
        width: "300px",
        height: "130px",
        panelClass: ['custom-dialog-container', 'override-dialog-container', 'override-process' , 'case-history-tooltip' , 'custom-scroll-wrapper'],
        data,
        hasBackdrop: false
      });
    }
  }

  hideRiskOverriderideInfo(): void {
    if(!this.isInforClicked){
      this.dialogRef.close();
    }
  }

  caseinforClicked():void{
    this.dialogRef.close();
    this.isInforClicked = !this.isInforClicked;
    if(this.isInforClicked){
      const data: CaseOverrideHistoryDialog = {
        caseId: this.caseId, riskIndicatorId: '0', positionRelativeToElement: this.caseRiskIcon, caseRisks: this.caseRiskList, fistOnly: true
      }
      this.dialogRef = this.dialog.open(CaseRiskOverrideHistoryComponent, {
        width: "300px",
        height: "130px",
        panelClass: ['custom-dialog-container', 'override-dialog-container', 'override-process' , 'case-history-tooltip' , 'custom-scroll-wrapper'],
        data,
        hasBackdrop: false
      });
    }else{
      this.dialogRef.close();
    }
  }

}
