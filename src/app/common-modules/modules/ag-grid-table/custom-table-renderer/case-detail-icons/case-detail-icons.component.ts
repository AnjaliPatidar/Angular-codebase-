import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { Component, OnInit } from '@angular/core';
import { CaseManagementService } from '@app/modules/case-management/case-management.service';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationmodalComponent } from './confirmationmodal/confirmationmodal.component';
@Component({
  selector: 'app-case-detail-icons',
  templateUrl: './case-detail-icons.component.html',
  styleUrls: ['./case-detail-icons.component.sass']
})
export class CaseDetailIconsComponent implements OnInit {
  public rowSelectedValDocID: any;
  public templateClass: any;
  public state: any;
  public canDeleteAttachments: boolean = true;
  public gridApi: any;
  public componentName = 'caseWorkbench';
  public caseRelatedEntity;
  languageJson: any;
  showDeleteCaseRelatedEntity: boolean = false;
  relationTypes: any;
  deleteButtonPermission: boolean = false;
  caseName: any;

  constructor(
    public _caseService: CaseManagementService,
    public modalservice: NgbModal,
    public _sharedService: SharedServicesService,
    public _commonService : CommonServicesService,
  ) {
   }

   ngOnInit() {
    this._commonService.behaveObserverForgetLanguageJson.subscribe((resp) => {
      if (resp != undefined && resp) {
        this.languageJson = resp;
      }
    })

    this._caseService.caseDeleteButtonBehaviorObserver.subscribe(res => {
      this.deleteButtonPermission = res;
      this.canDeleteAttachments = res;
    })
  }

  agInit(params: any, event): void {
    this.rowSelectedValDocID = params && params.data;
    this.templateClass = (params.colDef && params.colDef.customTemplateClass) ? params.colDef.customTemplateClass : '';
    this.state = params && params.data && params.data.regionUpliftObj ? params.data.regionUpliftObj : "";
    this.canDeleteAttachments = this.rowSelectedValDocID && this.rowSelectedValDocID.canDeleteAttachments ? this.rowSelectedValDocID.canDeleteAttachments: this.canDeleteAttachments;
    this.gridApi = params.api;
    this.caseName = params && params.data && params.data.caseName ? params.data.caseName : '';

     if(this.templateClass == 'Operations-icon-related'){
       this.caseRelatedEntity = (params && params.data) ? params.data : "";
       let entityid = (params.data && params.data.entity_id) ? params.data.entity_id.trim() : ''
       this.showDeleteCaseRelatedEntity = (params.colDef.mainEntityId != entityid);
       this.relationTypes = (params.colDef && params.colDef.selectBoxListData)?params.colDef.selectBoxListData.filter((e)=> {
           return e.displayName == 'Main Entity'
       }):{}}

     if( this.showDeleteCaseRelatedEntity && this.relationTypes[0] && this.relationTypes[0].listItemId) {
       this.showDeleteCaseRelatedEntity = this.relationTypes[0].listItemId != params.data.relation_type
     }
  }

  /*
    * @purpose: download document
    * @created: 20 May 2020
    * @params: doc(object)
    * @return: no
    * @author: Amritesh
  */
  downloadDocument(doc): void{
    this._caseService.showDocDownloadLoader.next(true);
    const fileName = String(doc.fileName);
    const params = {
      document_paths: [doc.path],
      zipfile_name: fileName
    }
    this._commonService.getDownloadDocumentpresignedUrl(params).then((response: any) => {
      if (response && response.presigned_url) {
        this._commonService.downloadFromPresigned(response.presigned_url, fileName)
        this._commonService.isPresignURLCalledObservable.subscribe(ststus => {
          if(ststus){
            setTimeout(()=>{
              this._sharedService.showFlashMessage( 'Successfully downloaded document with file name: ' + fileName, 'success');
              this._caseService.showDocDownloadLoader.next(false);
            } , 1000)
          }
        })
      }
      else {
        this._commonService.isPresignURLCalled.next(false)
        this._caseService.showDocDownloadLoader.next(false);
        this._sharedService.showFlashMessage('Failed to download document with file name: ' + fileName, 'danger');
      }
    });
  };


  deleteDocument(doc) {
    const modalInstanceDel = this.modalservice.open(ConfirmationmodalComponent, {
      windowClass:
        "custom-modal c-arrow center bst_modal add-ownership-modal add-new-officer",
    });
    modalInstanceDel.componentInstance.title = "Are you sure you wish to remove this file from the case?";
    modalInstanceDel.componentInstance.confirmationData.subscribe((resp) => {
      if (resp) {
        var params = [{
          "document_id": doc.fileID, // doc.fileID
          "reference_id": localStorage.getItem('caseIdForBulkDownload'), // caseId from url
          "reference_type": "case" // "reference_type": "case",
        }];

        this._caseService.deleteDocumentAPI(params).subscribe((response: any) => {
          if (this.gridApi) {
            this.gridApi.updateRowData({ remove: [doc] });
          }
          this._caseService.updateAttachmentsCount.next(true);
          this._caseService.updateAttachmentTableData.next(true);
          this.removeDocument(doc.ID);
          this._sharedService.showFlashMessage("File " + doc.fileName + " was removed successfully", "success");

          setTimeout(() => {
            this._caseService.reloadAttachmentsListBehavior.next(true);
          }, 2000);
        }, (err) => {
          this._sharedService.showFlashMessage('Failed to delete document with file name: ' + doc.FileName, 'danger');
        });
      }
    });
  }


  removeDocument(id) {
    this._caseService.caseAttachments.forEach((item, index) => {
      if (item.docId === id) this._caseService.caseAttachments.splice(index, 1);
    });
  }

     // Lanka
   // remove related entity from case
   // 2022-01-26
   removeCaseRelatedEntity() {
    this._caseService.deleteCaseRelatedEntityNew(this.caseRelatedEntity.id).toPromise().then((res) => {
      this._caseService.updateCaseRelatedEntityTableData.next(true);
      this._sharedService.showNewFlashMessageWithUndo(this.caseRelatedEntity.entity_name + " " + this.getLanguageKey('was excluded from') + " " + this.caseName, 'success', (res) => {
        let data = {
          entity_id: this.caseRelatedEntity.entity_id,
          entity_url: this.caseRelatedEntity.entity_url,
          entity_name: this.caseRelatedEntity.entity_name,
          entity_info: this.caseRelatedEntity.entity_info,
          entity_type: this.caseRelatedEntity.entity_type,
          relation_type: (this.caseRelatedEntity.relation_type)?+this.caseRelatedEntity.relation_type:null,
          country: this.caseRelatedEntity.country,
          address: this.caseRelatedEntity.address,
          case_id: this.caseRelatedEntity.case_id,
          account_number: (this.caseRelatedEntity.account_number)?+this.caseRelatedEntity.account_number:null,
          country_name : this.caseRelatedEntity.country_name ? this.caseRelatedEntity.country_name : ''
        }
        this._caseService.createReleatedCaseAPI(data).toPromise().then((res) => {
          this._caseService.updateCaseRelatedEntityTableData.next(true);
        }).catch((err) => {
          this._sharedService.showFlashMessage(this.getLanguageKey("Internal Server Error"), 'danger');
        })
      })
    }).catch(
      (err) => {
        this._sharedService.showFlashMessage(this.getLanguageKey("Internal Server Error"), 'danger');
      });
  }

  /**Getting Language text
  * Author : karnakar
  * Date : 20-Jan-2020
 */
  getLanguageKey(text) {
    var langKey = '';
    if (this.languageJson !== undefined) {
      langKey = this.languageJson[text];
      return langKey;
    }
  }
}
