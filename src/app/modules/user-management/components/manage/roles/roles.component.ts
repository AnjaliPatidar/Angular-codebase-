import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RolesService } from '@app/modules/user-management/services/roles/roles.service';
import { UserDeleteComponent } from '../users/modals/user-delete/user-delete.component';
import { UtilitiesService } from '@app/modules/user-management/services/utilities/utilities.service';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, from, iif, of } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
public rolesData:any =[];
public searchRole:any;
public dashboardSpinner:boolean = false;
public systemSettings = [];
public roleUpdateEnable : boolean =  false;
public userRoles : Array<any> = [];
public dateFormat = GlobalConstants.globalDateFormat;
  constructor(
    private router: Router,
    private rolesService:RolesService,
    public confirmDialog: MatDialog,
    public confirmDialogRef: MatDialogRef<UserDeleteComponent>,
    private utilitiesService: UtilitiesService,
    private commonService : CommonServicesService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.systemSettings =  GlobalConstants.systemSettings;
    this.roleUpdateEnable = this.systemSettings['Allow update manually-Roles'];
    this.dashboardSpinner =  true;

    combineLatest([
        from(this.rolesService.getAllRoles()),
        iif(() => !!this.translateService.currentLang, of(this.translateService.currentLang), this.translateService.onLangChange)
    ]).pipe(
        map(([a$, b$]) => ({
          roles: a$,
          languageData: b$
        }))
    ).subscribe((res) => {
      this.rolesData = res.roles['data'];
      this.dashboardSpinner =  false;
    })

    this.getUserRoleIds();
  }
  get_pattern(element){
    return this.commonService.get_pattern(element);
  }
  get_pattern_error(type){
    return this.commonService.get_pattern_error(type);
  }
  assignUsers(){
    this.router.navigate(['element/user-management/manage/roles/settings']);
  }
  routeTOPerticularRole(tabName){
    return `/element/user-management/manage/roles/settings/${tabName}`
  }
  assignUsersRoute(tabName){
    return `/element/user-management/manage/roles/assigned-users/${encodeURIComponent(tabName)}`
  }
  deleteRole(roleName:any,roleId:any){
    if(roleName && roleId){
      let dialogRef = this.confirmDialog.open(UserDeleteComponent, {
        panelClass: ['user-popover', 'custom-scroll-wrapper', 'delete-modal'],
        backdropClass:'modal-background-blur',
        data: { message: `are you sure wish to delete ${roleName}?` }
      });
      dialogRef.afterClosed().subscribe((result:any) => {
        if(result){
          this.dashboardSpinner =  true;
          this.rolesService.deleteRole({roleId:roleId })
          .then((response: any) => {
            if(response && response.status && response.responseMessage){
              if (response.status == "success") {
                this.utilitiesService.openSnackBar("success", response.responseMessage);
                const index = this.rolesData.findIndex((x :any) => x.roleId === roleId);
                if (index >= 0) {
                  this.rolesData.splice(index, 1);
                }
                this.dashboardSpinner = false;
              }
              else if (response.status == "error") {
                this.utilitiesService.openSnackBar("error", response.responseMessage);
                this.dashboardSpinner = false;
              }
            }
            else{
              this.utilitiesService.openSnackBar("error", "unexpected error");
              this.dashboardSpinner = false;
            }
          })
          .catch(err => {
            this.utilitiesService.openSnackBar("error", "unexpected error");
            this.dashboardSpinner = false;
          })
        }
      });
    }
  }
  updateRoleName(event,object,inputControl){
    if(inputControl && inputControl.invalid){
        return ;
    }
    if (event.keyCode === 13) {
      object.edit = false;
      this.rolesService.addRole(object)
        .then((response: any) => {
          if (response.status == "success") {
            this.utilitiesService.openSnackBar("success", this.translateService.instant('Role added successfully'));
          }
          else if (response.status == "error") {
            object.roleName = object.prevRoleName;
            delete object.prevRoleName;
            this.utilitiesService.openSnackBar("error", response.responseMessage);
          }
        })
        .catch(err => {
          object.roleName = object.prevRoleName;
          delete object.prevRoleName;
          this.utilitiesService.openSnackBar("error", "unexpected error");
        })
    }
  }
  getUserRoleIds(){
      GlobalConstants.systemSettings['userRoles'].forEach(element => {
        this.userRoles.push( element.roleId);
      })
  }

  trackByRoleName(_, item): string {
    return item.roleName;
  }
}
