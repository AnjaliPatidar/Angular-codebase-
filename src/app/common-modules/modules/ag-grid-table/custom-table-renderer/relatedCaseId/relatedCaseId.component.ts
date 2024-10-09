import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { WINDOW } from '../../../../../core/tokens/window';

@Component({
  selector: 'app-relatedCaseId',
  templateUrl: './relatedCaseId.component.html',
  styleUrls: ['./relatedCaseId.component.scss']
})
export class RelatedCaseIdComponent implements OnInit {
  public currentRow :any;
  public relatedCaseId: any;
  caseDetailsPermission: string;

  constructor(private _commonServices: CommonServicesService,
    private _sharedServicesService: SharedServicesService,
    public router: Router,
    @Inject(WINDOW) private readonly window: Window
  ) { }

  ngOnInit() {
    this.caseDetailsPermission = this.getUserCasePermission();
  }

  agInit(params: any, $event): void {
    if (params) {
      this.currentRow = params.data ? params.data : {};
      this.relatedCaseId = this.currentRow ? this.currentRow.relatedCaseId:"";
    }
  }

  /**
   * Get user permission level to access case details
   * @returns permission level as 'none' | 'view' | 'fuel'
   */
  getUserCasePermission(): string {
    const permissions: any[] = this._sharedServicesService.getPermissions();
    if (permissions.length) {
      const caseWorkbenchPermission = permissions[1].caseManagement.caseWorkbench;
      const caseDetailsPermissions = this._commonServices.getDomainPermissions(caseWorkbenchPermission, 'caseDetails');
      return this._commonServices.getPermissionStatusType(caseDetailsPermissions);
    }

    return "none";
  }

  /**
   * Redirect to case details page
   * @param caseId case id
   */
   openCase(caseId: number) {
    if(this.caseDetailsPermission == 'none') return;
    
    let caseUrl = '/element/case-management/case/'+caseId;
      if (GlobalConstants.systemSettings.openInNewtab) {
        const url = this.router.serializeUrl(this.router.createUrlTree([caseUrl]));
        this.window.open('#' + url, '_blank', 'noopener');
      } else {
        this.router.navigate([caseUrl]);
      }
  }
}
