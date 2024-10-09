import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { CaseManagementService } from '@app/modules/case-management/case-management.service';
import { CaseOverrideDialog } from '@app/modules/case-management/models/case-override/case-override-dialog.model';
import { CaseOverrideHistory } from '@app/modules/case-management/models/case-override/case-override-history.model';
import { CaseOverrideRequest } from '@app/modules/case-management/models/case-override/case-override-request.model';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
import * as moment from 'moment';

@Component({
  selector: 'app-case-risk-override',
  templateUrl: './case-risk-override.component.html',
  styleUrls: ['./case-risk-override.component.scss']
})
export class CaseRiskOverrideComponent implements OnInit {

  caseOverrideData: CaseOverrideDialog;
  files: Array<File> = [];
  reason: string;
  MAX_TEXT_LENGTH = 2048;

  constructor(public dialogRef: MatDialogRef<CaseRiskOverrideComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CaseOverrideDialog,
    private caseManagementService: CaseManagementService,
    public _sharedServicesService: SharedServicesService) {
    this.caseOverrideData = data;
  }

  ngOnInit() {
    if (this.data && this.data.positionRelativeToElement) {
      const matDialogConfig = new MatDialogConfig()
      const rect: DOMRect = this.data.positionRelativeToElement.nativeElement.getBoundingClientRect()

      matDialogConfig.position = { left: `${rect.right - 400}px`, top: `${rect.bottom + 10}px` };
      this.dialogRef.updatePosition(matDialogConfig.position);
    }
  }

  close(isCancel: boolean = true): void {
    this.dialogRef.close(!isCancel);
  }

  save(): void {
    const params: CaseOverrideRequest =
    { case_id: this.data.caseId , reason: this.reason, new_risk: this.data.caseRiskNewId, old_risk: this.data.caseRiskOldId  ? this.data.caseRiskOldId : 0, override_risk: this.getOverRideRisk() ? "override_risk": "calculated_risk" };
    if (this.validate()) {
      this.overrideRisk(params).then(res => {
        if (res) {
          this.caseManagementService.caseRiskReason = res.reason;
          this.caseManagementService.riskNextRemidiationDate = res.remediation_date;
        }
        if (this.files) {
          this.uploadFile(this.files, res.case_risk_id.toString());
        }
        this.close(false);
      });
    }
  }

  getOverRideRisk() {
    let checkIsOverrideRisk = false;
    const caseSetting = GlobalConstants.systemsettingsData && GlobalConstants.systemsettingsData["Case Settings"] ? GlobalConstants.systemsettingsData["Case Settings"] : []
    if (caseSetting) {
      checkIsOverrideRisk = caseSetting.find(caseObj => {
        return caseObj && caseObj.selectedValue && caseObj.selectedValue && caseObj.name == "Override Selection" && caseObj.selectedValue == "Override Risk"
      });
    }
    return checkIsOverrideRisk;
  }

  validate(): boolean {
    if (this.reason === '') {
      return false
    }
    else if (this.reason && this.reason.length <= this.MAX_TEXT_LENGTH) {
      return true;
    }
    return true;
  }

  fileAttach(event: any): void {
    event.preventDefault();
    const element = (<HTMLInputElement>document.getElementById('fileAttachment'));
    if (element) {
      element.value = '';
      element.click();
    }
  }

  fileUpload(files: Array<File>): void {
    if (files && files.length) {
      for (let i = 0; i < files.length; i++) {
        this.files.push(files[i]);
      }
    }
  }

  cancelFileUpload(file: File): void {
    if (file) {
      const index = this.files.indexOf(file);
      if (index > -1) {
        this.files.splice(index, 1)
      }
    }
  }

  private uploadFile(files, riskOverrideId: string) {
    var uploadDocument = [];
    var fileNames = [];
    let userId: any = GlobalConstants.systemSettings['ehubObject']['userId'];
    for (let i = 0; i < this.files.length; i++) {
      if (files[i].size) {
        let fileFormat = files[i] && files[i].name && files[i].name.split('.').length > 0 ? files[i].name.split('.').pop() : '';
        let fileSize = files[i] && files[i].size ? files[i].size / 1024 / 1024 : 0;
        let fileName = files[i] && files[i].name ? files[i].name : '';
        let lastUpdate = files[i] && files[i].lastModified ? files[i].lastModified : '';
        let title = files[i] && files[i].name.split('.').slice(0, -1).join('.');
        const params = {
          "analysis": true,
          "created_by": userId.toString(),
          "file_name": fileName,
          "format": fileFormat,
          "last_updated": moment(lastUpdate).format('YYYY-MM-DD HH:mm:ss'),
          "reference_id": riskOverrideId,
          "reference_type": "case risk",
          "size": fileSize.toString(),
          "title": title,
          "updated_by": userId.toString(),
          "version_handler": "",
          "main_entity_id": this.caseOverrideData && this.caseOverrideData.caseId ? this.caseOverrideData.caseId.toString() : 0,
          "reference_name": this.caseOverrideData && this.caseOverrideData.caseName ? this.caseOverrideData.caseName : "",
          "timestamp": moment(new Date(), ["h:mm A"]).format('YYYY-MM-DD HH:mm:ss'),
          "meta_data": '{}'
        }
        uploadDocument.push(params)
      }
    }

    return this.caseManagementService.uploadDocumentForProof(uploadDocument).subscribe(resp => {
      const existsDocuments = [];
      const existsDocumentsReferences = [];
      if (resp) {
        let resultDocumentExistsMessage = '';
        var documents = this.getLanguageKey('Document(s)') ? this.getLanguageKey('Document(s)') : 'Document(s)'
        var allreadyExists = this.getLanguageKey('already exists') ? this.getLanguageKey('already exists') : 'already exists'
        var referenceLinkCreated = this.getLanguageKey('in the repository. Reference link created.') ? this.getLanguageKey('in the repository. Reference link created.') : ' in the repository. Reference link created.'
        resp.forEach(element => {
          if (element.is_uploaded) {
            fileNames.push(element.file_info.file_path)
            if (fileNames.length) {
              this.caseManagementService.getDocumentLocation(fileNames).then(res => {
                if (res) {
                  for (let i = 0; i < res.length; i++) {
                    const found = files.find(
                      (element) => element.name === res[i].fileName
                    );
                    if (found) {
                      this.caseManagementService.callPresignedUrl(found, res[i].presignedUrl).then((response) => { });
                    }
                  }
                }
              })
            }
          } else if (element.is_uploaded == false && element.reason[0].includes('New reference')) {
            existsDocumentsReferences.push(element.file_info.file_name);
          } else if (element.is_uploaded == false) {
            existsDocuments.push(element.file_info.file_name);
          }
        });

        if (existsDocuments.length) {
          let documentName = existsDocuments.length > 1 ? existsDocuments.join(', ')
            : (existsDocuments.length == 1) ? existsDocuments[0] : '';
          resultDocumentExistsMessage.length && (resultDocumentExistsMessage += '<br/>');
          resultDocumentExistsMessage +=  documents + " '" + documentName + "' " + allreadyExists;
        }
        if (existsDocumentsReferences.length) {
          let documentName = existsDocumentsReferences.length > 1 ? existsDocumentsReferences.join(', ')
            : (existsDocumentsReferences.length == 1) ? existsDocumentsReferences[0] : '';
          resultDocumentExistsMessage.length && (resultDocumentExistsMessage += '<br/>');
          resultDocumentExistsMessage +=  documents + " '" + documentName + "' " + allreadyExists + referenceLinkCreated;
        }
        (existsDocuments.length || existsDocumentsReferences.length) && this._sharedServicesService.showFlashMessage(resultDocumentExistsMessage, 'danger');
      }
    })
  }

  private overrideRisk(params: CaseOverrideRequest): Promise<CaseOverrideHistory> {
    return this.caseManagementService.overrideRisk(params).toPromise();
  }

  // @reason : Add localization text
  // @author: Kasun Karunathilaka
  // @date: Apr 08 2022
  getLanguageKey(text) {
    var langKey = text;
    if (GlobalConstants.languageJson) {
      langKey = GlobalConstants.languageJson[text];
    }
    return langKey;
  }

  public trackByName(_, item): string {
    return item.name;
  }
}
