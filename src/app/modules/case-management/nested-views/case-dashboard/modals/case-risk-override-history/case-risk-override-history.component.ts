import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { CaseManagementService } from '@app/modules/case-management/case-management.service';
import { CaseOverrideHistoryDialog } from '@app/modules/case-management/models/case-override/case-override-dialog-history.model';
import { CaseOverrideHistoryView } from '@app/modules/case-management/models/case-override/case-override-history-view.model';
import { CaseOverrideHistory } from '@app/modules/case-management/models/case-override/case-override-history.model';
import { ConfirmaionmodalComponent } from '@app/modules/systemsetting/modals/confirmaionmodal/confirmaionmodal.component';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { WINDOW } from '../../../../../../core/tokens/window';

@Component({
  selector: 'app-case-risk-override-history',
  templateUrl: './case-risk-override-history.component.html',
  styleUrls: ['./case-risk-override-history.component.scss']
})
export class CaseRiskOverrideHistoryComponent implements OnInit {
  caseOverrideData: CaseOverrideHistoryDialog;
  dateFormat = GlobalConstants.globalDateFormat;
  history: CaseOverrideHistoryView;
  historyList: Array<CaseOverrideHistoryView> = [];
  MAX_TEXT_LENGTH = 2048;

  isLoading: boolean = false;

  constructor(public dialogRef: MatDialogRef<CaseRiskOverrideHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CaseOverrideHistoryDialog,
    private caseManagementService: CaseManagementService,
    private _commonServices: CommonServicesService,
    public modalservice: NgbModal,
    private sharedServicesService: SharedServicesService,
    @Inject(WINDOW) private readonly window: Window
  ) {
    this.caseOverrideData = data;
    (this.caseOverrideData.fistOnly) ? this.loadHistory() : this.loadHistoryList();
  }

  ngOnInit() {
    const matDialogConfig = new MatDialogConfig()
    const rect: DOMRect = this.data.positionRelativeToElement.nativeElement.getBoundingClientRect();
    matDialogConfig.position = (this.caseOverrideData.fistOnly) ?
      { left: `${rect.right - 300}px`, top: `${rect.top - 140}px` } : { left: `${rect.right - 400}px`, top: `${rect.bottom + 10}px` }
    this.dialogRef.updatePosition(matDialogConfig.position)
  }

  close(isCancel: boolean = true): void {
    const riskId = this.historyList.length > 0 ? this.historyList[0].newRiskId : this.data.riskIndicatorId;
    const data = isCancel ? undefined : riskId;
    this.dialogRef.close(data);
  }

  private loadHistoryList(isDeleted: boolean = false, editedData: CaseOverrideHistoryView = null): void {
    this.isLoading = true;
    this.getCaseRiskOverrideHistory(true).then(res => {
      if(res){
        this.historyList = res.map(item => ({
          caseRiskId: item && item.case_risk_id ? item.case_risk_id : null,
          reason: item && item.reason ? item.reason : "",
          oldRiskId: item && item.old_risk ? item.old_risk : null,
          updatedReason: item && item.reason ? item.reason : "",
          oldRisk: this.caseOverrideData.caseRisks.find(risk => risk.listItemId === item.old_risk) ?
            this.caseOverrideData.caseRisks.find(risk => risk.listItemId === item.old_risk).displayName : '',
          newRisk: this.caseOverrideData.caseRisks.find(risk => risk.listItemId === item.new_risk) ?
            this.caseOverrideData.caseRisks.find(risk => risk.listItemId === item.new_risk).displayName : '',
          newRiskId: item && item.new_risk ? item.new_risk : null,
          updatedDate: item && item.updated_date ? new Date(item.updated_date) : null,
          createdDate: item && item.created_date ? new Date(item.created_date) : null ,
          updatedUserId: item.updated_by && item.updated_by.user_id ? item.updated_by.user_id : '',
          updatedUser: item &&item.updated_by && item.updated_by.screen_name ? item.updated_by.screen_name : '',
          userImage: item && item.updated_by && item.updated_by.userImage ? item.updated_by.userImage : "",
          commentedBy: item && item.updated_by? item.updated_by: "",
          attachment: item && item.attachments ? item.attachments: null,
        }));
      }
      if (editedData) {
        editedData.isEdit = false;
        this.isLoading = false;
      }
      if (isDeleted) {
        this.close(false);
      }
      this.isLoading = false;
    },err => {
      this.isLoading = false;
    }
    );
  }

  private loadHistory() {
    this.isLoading = true;
    this.getCaseRiskOverrideHistory(false).then((res:any) => {
      if (res && res.length > 0) {
        res.map(item =>{
          this.history = {
            caseRiskId: item.case_risk_id,
            updatedDate: new Date(item.updated_date),
            createdDate: new Date(item.created_date),
            reason: item.reason,
            updatedReason: item.reason,
            oldRisk: this.caseOverrideData.caseRisks.find(risk => risk.value === item.old_risk) ?
              this.caseOverrideData.caseRisks.find(risk => risk.value === item.old_risk).label : '',
            oldRiskId: item.old_risk,
            newRisk: this.caseOverrideData.caseRisks.find(risk => risk.value === item.new_risk) ?
              this.caseOverrideData.caseRisks.find(risk => risk.value === item.new_risk).label : '',
            newRiskId: item.new_risk,
            updatedUserId: item.updated_by.user_id,
            updatedUser: item.updated_by.screen_name,
            userImage: item.updated_by.userImage,
            commentedBy: item.updated_by,
            attachment: item.attachments,
          }
        })
        this.isLoading = false;
      }
    });
  }

  saveEdit(data: CaseOverrideHistoryView): void {
    if (data.updatedReason) {
      const overrideData = {
        reason: data.updatedReason,
        case_risk_id: data.caseRiskId
      }

      this.isLoading = true;
      this.updateCaseRiskOverride(overrideData).then(res => {
        this.loadHistoryList(false, data);
      });
    }
  }

  deleteRiskOverride(data: CaseOverrideHistoryView): void {
    var modalInstanceDel = this.modalservice.open(ConfirmaionmodalComponent, {
      windowClass:
        "custom-modal c-arrow center bst_modal add-ownership-modal add-new-officer",
    });
    modalInstanceDel.componentInstance.title = "Are you sure you wish to cancel the risk score change?";
    modalInstanceDel.componentInstance.confirmationData.subscribe((resp) => {
      if (resp) {
        this.caseManagementService.deleteOverrideRisk(data.caseRiskId.toString(), JSON.parse(localStorage.getItem('caseIdForBulkDownload'))).subscribe(resp => {
          if(resp && resp.remediation_date){
            this.caseManagementService.isNextRemedationChangedSubscibe.next(resp.remediation_date)
          }
          this.loadHistoryList(true);
        })
      }
    });
  }

  getDownload(doc: any): void {
    this.sharedServicesService.showFlashMessage('Your file is being downloaded...', 'success');
    let getDownloadLocParams = {
      "document_paths": [doc.file_path]
    };

    this._commonServices.getDownloadLocations(getDownloadLocParams).subscribe(downLocRes => {
      if (doc) {
        this._commonServices.callDownloadPresignedUrl(downLocRes.presigned_url).subscribe(downPresRes => {
          var blob = new Blob([downPresRes], {
            type: "application/" + doc.type,
          });
          let url = (this.window as any).URL.createObjectURL(blob);
           var FileToDownload: any = document.createElement("a");
             document.body.appendChild(FileToDownload);
             FileToDownload.style = "display:none";
             FileToDownload.setAttribute('href', url);
             FileToDownload.setAttribute('download', doc.doc_name);
             FileToDownload.click();
        });
      }
      this.sharedServicesService.showFlashMessage('Successfully downloaded document with file name: ' + doc.doc_name, 'success');
    }, (err) => {
      this.sharedServicesService.showFlashMessage('Failed to download document with file name: ' + doc.doc_name, 'danger');
    });
  }

  // private deleteRisk(caseRiskId: string): Promise<any> {
  //   return this.caseManagementService.deleteOverrideRisk(caseRiskId).toPromise();
  // }

  private getCaseRiskOverrideHistory(all: boolean = false): Promise<Array<CaseOverrideHistory>> {
    return this.caseManagementService.getOverrideRisks(this.data.caseId.toString(), all).toPromise();
  }

  private updateCaseRiskOverride(data): Promise<any> {
    return this.caseManagementService.overrideRiskUpdate(data).toPromise();
  }

  private getFormatedDate(date): string {
    if (date) {
      return moment(date).format('DD MMM YYYY, hh:mm A')
    }
  }

  public trackByDocName(_, item): string {
    return item.doc_name;
  }

  public trackByCaseRiskId(_, item): string {
    return item.caseRiskId;
  }
}
