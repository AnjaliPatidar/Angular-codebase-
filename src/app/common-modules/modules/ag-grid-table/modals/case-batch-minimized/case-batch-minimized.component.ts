import { SharedServicesService } from './../../../../../shared-services/shared-services.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { WebSocketSubject } from "rxjs/webSocket";
import { CaseBatchFileComponent } from '../case-batch-file/case-batch-file.component';
import { CaseManagementService } from '../../../../../modules/case-management/case-management.service';
import { values } from 'lodash-es';
import { Subscription } from 'rxjs';
import { WINDOW } from '../../../../../core/tokens/window';

export interface IBatchDocument {
  fileId: number;
  fileName: string;
  filePath: string;
  format: string;
  size: number;
  timestamp: string;
  title: string;
  updatedBy: string;
  updated_date: string;
  user_id: number;
  version: number;
}

export interface IBatchProgress {
  batch_id: string;
  progress: number;
  csv_status: string;
  createdCount: number;
  totalCasesCount: number;
  documents: IBatchDocument[]
}

@Component({
  selector: 'app-case-batch-minimized',
  templateUrl: './case-batch-minimized.component.html',
  styleUrls: ['./case-batch-minimized.component.scss']
})
export class CaseBatchMinimizedComponent implements OnInit, OnDestroy {
  isClosed: boolean= false;
  subject: WebSocketSubject<any>;
  batchList: IBatchProgress[] = [];

  updatedCsvFileName;
  updatedCsvData;

  completedBatch: number = 0;

  caseBatchUploadStatusSubscription: Subscription;
  isBatchFileDeleted:boolean

  constructor(
    public dialog: MatDialog,
    private caseManagementService: CaseManagementService,
    private sharedService : SharedServicesService,
    @Inject(WINDOW) private readonly window: Window
  ) { }

  ngOnInit() {
    this.listenBatchProgress();
    this.onBatchProgressRemove();
  }

  ngOnDestroy(): void {
    this.caseBatchUploadStatusSubscription && this.caseBatchUploadStatusSubscription.unsubscribe();
  }

  listenBatchProgress(){
    this.caseBatchUploadStatusSubscription = this.caseManagementService.caseBatchUploadSubject.subscribe((batchStatusMap) => {
      let params = {
        'references': []
      };

      this.batchList = values(batchStatusMap).map(value => {
        if (!value.documents) {
          params.references.push({
            'referenceId': value.batch_id.toString(),
            'referenceType': 'batch case'
          });
        }
        return value;
      });

      if(params.references.length>0){
        this.getFileDatas(params);
      }

      this.completedBatch = this.batchList.filter(item=>item.progress === 100).length;
    });
  }

  onBatchProgressRemove(){
    this.caseManagementService.removedBatch.subscribe(resp=>{
      this.batchList = this.batchList.filter(item=>item.batch_id !==resp);
    })
  }

  getFileDatas(params){
    this.caseManagementService.getAttachMentListBycaseIDNew(params).subscribe((resp: any) => {
      resp.forEach(fileRef => {
        if(fileRef.documents.length>0){
          this.batchList.find(item=>item.batch_id === fileRef.referenceId).documents=fileRef.documents;
          this.caseManagementService.storeCaseBatchUploadDocumentData(fileRef.referenceId, fileRef.documents);
        }
      });
    });
  }

  toggleAccordion(){
    this.isClosed = !this.isClosed;
  }

  openDetails(batch: IBatchProgress){
    const dialogRef = this.dialog.open(CaseBatchFileComponent, {
      disableClose: true,
      panelClass: ['user-popover', 'custom-scroll-wrapper', 'bg-screening', 'light-theme'],
      backdropClass: 'modal-background-blur',
      data: { operation: "case batch upload", fileSizeFromSystemSettings: GlobalConstants.systemSettings.maxFileSize, detailData: batch }
    });
  }

  downloadReport(batch) {
    this.updatedCsvFileName = this.caseManagementService.getCSVFileName(batch.documents && batch.documents.length ? batch.documents[0] : {} , true);
    this.updatedCsvData = batch.csv_status;
    if (this.updatedCsvData && this.updatedCsvFileName) {
        const csvContent = atob(this.updatedCsvData);
        const blob = new Blob([csvContent], {
          type: "data:application/octet-stream;base64",
        });
        const url = (this.window as any).URL.createObjectURL(blob);
        const dlnk: any = document.createElement("a");
        dlnk.href = url;
        dlnk.download = this.updatedCsvFileName;
        dlnk.click();
        URL.revokeObjectURL(url);
      }
    }

  removeBatchById(batch: IBatchProgress){
    this.deleteBacth(batch.batch_id , false);
  }

  removeAllBatch(){
    this.batchList.forEach((batch) => {
      if(batch && batch.batch_id) this.deleteBacth(batch.batch_id , true)
    })
  }

  // @reason : removed processed batch file on click on close
  // @params : batch id
  // @params type : string
  // @date : 24 nov 2022
  // @author : ammshathwan

  deleteBacth(batchID:string , isAllDelete:boolean){
    this.isBatchFileDeleted = true;
    if(batchID){
      this.caseManagementService.deleteCasebatch(batchID).subscribe(() => {
        this.isBatchFileDeleted = false;
        this.sharedService.showFlashMessage("Batch file deleted successfully" ,'success' )
        if(isAllDelete){
          this.batchList = []
        }else{
          this.caseManagementService.setRemovedBatch(batchID);
        }
      }, (err) => {
        this.isBatchFileDeleted = false;
        this.sharedService.showFlashMessage("Can't delete the batch. Internal server error" ,'danger' )
      })
    }else{
      this.isBatchFileDeleted = false;
      this.sharedService.showFlashMessage("Can't delete the batch. Batch ID is mising" ,'danger' )
    }
  }

  trackByBatchId(_, item: IBatchProgress): string {
    return item.batch_id;
  }
}
