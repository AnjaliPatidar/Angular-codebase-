import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { GroupsService } from '@app/modules/user-management/services/groups.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserDeleteComponent } from '../users/modals/user-delete/user-delete.component';
import { UtilitiesService } from '@app/modules/user-management/services/utilities/utilities.service';
import { Router } from '@angular/router';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  public systemSettings: any;
  public groupUpdateEnable: any;
public searchGroup:any;
public groupsData: any =[];
public  userGroups: any;
public dateFormat = GlobalConstants.globalDateFormat;
public dashboardSpinner:boolean = false;
  constructor(public groupService: GroupsService,
    private router: Router,
    public confirmDialog: MatDialog,
    public confirmDialogRef: MatDialogRef<UserDeleteComponent>,
    private utilitiesService: UtilitiesService,
    private commonService : CommonServicesService) { }

  ngOnInit() {
    this.systemSettings =  GlobalConstants.systemSettings;
    this.groupUpdateEnable = this.systemSettings['Allow update manually-Groups'];
    this.dashboardSpinner = true;
    this.groupService.getAllGroups$().subscribe((groups:Array<any>)=>{
      this.groupsData = groups;
      this.dashboardSpinner = false;
    })
  }
  get_pattern(element){
    return this.commonService.get_pattern(element);
  }
  get_pattern_error(type){
    return this.commonService.get_pattern_error(type);
  }
  assignUsers(){
    this.router.navigate(['element/user-management/manage/groups/settings']);
  }
  assignedUserRoute(tabName){
    return `/element/user-management/manage/groups/assigned-users/${encodeURIComponent(tabName)}`
  }
  routeToGroup(tabName){
    return "/element/user-management/manage/groups/settings" + "/" + tabName;

  }
  deleteGroup(groupName:any,groupId:any){
    if(groupName && groupId){
      let dialogRef = this.confirmDialog.open(UserDeleteComponent, {
        panelClass: ['user-popover', 'custom-scroll-wrapper', 'delete-modal'],
        backdropClass:'modal-background-blur',
        data: { message: `are you sure wish to delete ${groupName}?` }
      });
      dialogRef.afterClosed().subscribe((result:any) => {
        if(result){
          this.dashboardSpinner =  true;
          this.groupService.deleteGroup({groupsId:groupId })
          .then((response: any) => {
            if(response && response.status && response.responseMessage){
              if (response.status == "success") {
                this.utilitiesService.openSnackBar("success", response.responseMessage);
                const index = this.groupsData.findIndex((x :any) => x.id === groupId);
                if (index >= 0) {
                  this.groupsData.splice(index, 1);
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
  updateGroupName(event,object,control){
    if(control && control.invalid){
      return true
    }
    if (event.keyCode === 13) {
      object.edit = false;
      let data = {
       name: object.name,
       userGroupId: object.id
      }
      this.groupService.updateGroupDetails(data)
      .then((response: any) => {
        if (response.status == "success") {
          this.utilitiesService.openSnackBar("success", response.responseMessage);
        }
        else if (response.status == "error") {
          this.utilitiesService.openSnackBar("error", response.responseMessage);
        }
      })
      .catch(err => {
        // this.utilitiesService.openSnackBar("error", "unexpected error");
      })
    }
  }
updateGroup(){

}
  public trackByTabName(_, item): string {
    return item.name;
  }
}
