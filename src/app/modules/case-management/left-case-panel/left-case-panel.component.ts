import { CommonServicesService } from './../../../common-modules/services/common-services.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { SharedServicesService } from '../../../shared-services/shared-services.service';
import { CaseManagementService } from '../case-management.service';
@Component({
  selector: 'app-left-case-panel',
  templateUrl: './left-case-panel.component.html',
  styleUrls: ['../../alert-management/left-panel/left-panel.component.scss'],
})
export class LeftCasePanelComponent implements OnInit {
public caseWorkBenchPermissionJSON: any[] = [];
  isCaseInfo: boolean = true;
  currentTab: string = 'home';
  openLeftPanel: boolean;
  buttonClicked: boolean;
  isShowCaseContacts: boolean;

  constructor(
    public router: Router,
    private sharedService: SharedServicesService,
    private caseManagementService: CaseManagementService,
    private renderer2: Renderer2,
    private commonService: CommonServicesService
  ) {
    this.isCaseInfo = this.router.url.includes('/case/');
    if(this.isCaseInfo){
      this.setAssociatedRecord(this.router.url)
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isCaseInfo = event.url.includes('/case/');
        this.setAssociatedRecord(event.url)
      }
    });
  }

  ngOnInit(): void {
    this.getCaseListPermssionIds();
    this.getCaseContactPermission();
  }

  setAssociatedRecord(url){
    if( url.includes("?fromAlert=true")){
      this.currentTab = "associatedRecord"
    }
  }

  getCaseListPermssionIds(): void {
    const permissions: any[] = this.sharedService.getPermissions();
    if (permissions.length) {
      this.caseWorkBenchPermissionJSON =
        permissions[1].caseManagement.caseWorkbench;
    }
  }

  changeCaseInfoTab(tab: string): void {
    this.currentTab = tab;
    this.caseManagementService.onChangeCaseDetailsTabBehavior.next(tab);
  }

  mouseHoverOpenLeftPanel(tab: string): void {
    if(!this.buttonClicked){
      this.openLeftPanel = true;
    }
  }

  mouseHoverCloseLeftPanel(): void {
    if(!this.buttonClicked){
      this.openLeftPanel = false;
    }
  }

  toggleLeftPanel():void {
    this.openLeftPanel = !this.openLeftPanel;
    this.buttonClicked = !this.buttonClicked;
    if(this.openLeftPanel){
      this.renderer2.addClass(document.body, 'left-sideBar-open');
    }else{
      this.renderer2.removeClass(document.body, 'left-sideBar-open');
    }
  }

  getPermissionForColumn(key, setNoneFalse?: boolean) {
    const permission = this.commonService.getDomainPermissions(this.caseWorkBenchPermissionJSON, key);
    const permissionLevel = this.commonService.getPermissionStatusType(permission);
    this.caseManagementService.caseContactPermission = permissionLevel;
    if(permissionLevel == "none"){
      return false
    }
    return true
  }

  getCaseContactPermission():void{
    this.isShowCaseContacts = this.getPermissionForColumn("caseContacts");
  }
}
