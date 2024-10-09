import { SharedServicesService } from './../../../../../shared-services/shared-services.service';
import { CaseManagementService } from '@app/modules/case-management/case-management.service';
import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';

@Component({
  selector: 'app-toggle-render',
  templateUrl: './toggle-render.component.html',
  styleUrls: ['./toggle-render.component.scss']
})
export class ToggleRenderComponent implements OnInit {
  relevantStatus:boolean;
  isContactUpdated:boolean;
  caseId:number
  caseWorkBenchPermissionJSON: any = {};
  isContactHasPermission:boolean;
  contactId:number;
  constructor(private caseManagmentService:CaseManagementService,
              private sharedServices : SharedServicesService) {}

  ngOnInit() {
  }

  agInit(params: any){
    if (params && params.data) {
      this.contactId = params.data.relevant && params.data.relevant.contactId ? params.data.relevant.contactId : null;
      this.relevantStatus = params.data.relevant && params.data.relevant.status ? params.data.relevant.status : false;
      this.caseId = params.data.case_id ? params.data.case_id : false;
      this.getPermissionContacts()
    }
  }

  // @reason : update relevant case contact on toggle selections
  // @params : event
  // @date : 03 jan 2023
  // @author : ammshathwan
  updateRelevantState(event):void{
    let message:string
    this.isContactUpdated = true;
    if(this.contactId){
      const params = {
        case_id: this.caseId,
        contacts : [
          this.contactId
        ],
        relevant: event && event.checked ? event.checked : false
      }
      this.caseManagmentService.updateCaseRelevantContact(params).subscribe((res) => {
        this.isContactUpdated = false;
        this.relevantStatus = !this.relevantStatus;
        message = this.getLanguageKey("Case contact updated Successfully") ? this.getLanguageKey("Case contact updated Successfully") : "Case contact updated Successfully"
        this.sharedServices.showFlashMessage(message, 'success');
      }, error => {
        message = this.getLanguageKey("Failed to update Case contact") ? this.getLanguageKey("Failed to update Case contact") : "Failed to update Case contact"
        this.sharedServices.showFlashMessage(message, 'danger');
        this.isContactUpdated = false
      })
    }
  }

  // @reason : get translated text for given text
  // @params : text (string)
  // @date : 03 jan 2023
  // @author : ammshathwan
  getLanguageKey(text) {
    var langKey = text;
    if (GlobalConstants.languageJson) {
      langKey = GlobalConstants.languageJson[text];
    }
    return langKey;
  }

  getPermissionContacts() {
    if (this.caseManagmentService.caseContactPermission == 'full') {
      this.isContactHasPermission =  false;
    }else{
      this.isContactHasPermission =  true;
    }
  }

}
