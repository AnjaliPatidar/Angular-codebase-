import { CommentsComponent } from '@app/modules/comments/comments/comments.component';
import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-associated-records-actions',
  templateUrl: './associated-records-actions.component.html',
  styleUrls: ['./associated-records-actions.component.scss']
})
export class AssociatedRecordsActionsComponent implements OnInit {

  data
  caseWorkBenchPermissionJSON: any = {};
  editModeStatus: boolean = false;
  isAuditOpen:boolean;
  showRightPanel:boolean

  @ViewChild('caseComments', { static: false }) public caseComments: ElementRef;

  constructor(public dialog: MatDialog, private renderer2:Renderer2) { }

  ngOnInit() {
  }

  agInit(params: any): void {
    if(params && params.data){
      this.data = params.data
    }
  }

  openCommentsPopup():void{
    const data = {
      positionRelativeToElement: this.caseComments,
      caseId: this.data && this.data.rowData && this.data.rowData.id ? this.data && this.data.rowData && this.data.rowData.id : 0,
      caseWorkBenchPermissionJSON: this.caseWorkBenchPermissionJSON,
      editModeStatus: this.editModeStatus,
      commentContainer: 'associated records'
    }
    this.dialog.open(CommentsComponent, {
      maxWidth: "392px",
      id: 'comments-popup',
      panelClass: ['custom-dialog-container', 'comments-dialog-container'],
      data
    });
  }
  openCaseAudit():void{
    this.isAuditOpen = !this.isAuditOpen;
    if (this.isAuditOpen) {
      this.showRightPanel = true;
      this.renderer2.addClass(document.body, 'audit-sideBar-open');
    } else {
      this.showRightPanel = false;
      this.renderer2.removeClass(document.body, 'audit-sideBar-open');
    }
  }

  closeAudditiPanel() {
    this.openCaseAudit()
  }

}
