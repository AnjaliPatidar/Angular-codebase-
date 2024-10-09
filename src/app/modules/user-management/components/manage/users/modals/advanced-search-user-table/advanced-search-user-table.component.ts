import { Component, OnInit ,Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserConstant } from '@app/modules/user-management/constants/ag-grid/user-table.constants';
import { UserService } from '@app/modules/user-management/services/user.service';
import { UtilitiesService } from '@app/modules/user-management/services/utilities/utilities.service';
import { ObserverService } from '@app/modules/user-management/services/observer.service';
import { GroupsService } from '@app/modules/user-management/services/groups.service';

@Component({
  selector: 'app-advanced-search-user-table',
  templateUrl: './advanced-search-user-table.component.html',
  styleUrls: ['./advanced-search-user-table.component.scss']
})
export class AdvancedSearchUserTableComponent implements OnInit {
  addUsersTab: boolean =true;
  public nameOfGroup: string='';
  constructor(
    public userService: UserService,
    public observerService: ObserverService,
    private utilitiesService: UtilitiesService,
    public dialogRef: MatDialogRef<AdvancedSearchUserTableComponent>,
    public dialog: MatDialog,
    public groupsService: GroupsService,
    @Inject(MAT_DIALOG_DATA) public incomingdata: any
  ) { }

  ngOnInit() {
    if (this.incomingdata.message.roleDetails && this.incomingdata.message.roleDetails.roleId) {
      this.nameOfGroup = this.incomingdata.message.roleDetails.roleName
    } else if (this.incomingdata.message.groupDetails&& this.incomingdata.message.groupDetails.groupId) {
      this.nameOfGroup = this.incomingdata.message.groupDetails.groupName
    }
  }
  addUsersList(){
    if (this.incomingdata.message.roleDetails && this.incomingdata.message.roleDetails.roleId) {
      this.addUsersToRole()
    } else if (this.incomingdata.message.groupDetails&& this.incomingdata.message.groupDetails.groupId) {
      this.addUsersToGroups()
    }
  }
  addUsersToRole(){
  let userListId = UserConstant.userId
    this.userService.addUsersToRoles( this.incomingdata.message.roleDetails.roleId,userListId)
    .then((response: any) => {
      if(response){
        if (response.status == "success") {
          this.utilitiesService.openSnackBar("success", response.responseMessage);
          UserConstant.refreshAgGid = true
          this.observerService.updateUserTable({data: "updateUser", status : true});
         
          this.dialogRef.close()
        }
        else if (response.status == "error") {
          this.utilitiesService.openSnackBar("error", response.responseMessage);
        }
    }
    })
    .catch((err) => {
      this.utilitiesService.openSnackBar("error", "something went wrong");

    })
  }
  addUsersToGroups(){
    let userListId = UserConstant.userId
    this.groupsService.addUsersToGroups(this.incomingdata.message.groupDetails['groupId'], userListId)
      .then((response: any) => {
        if (response) {
          if (response.status == "success") {
            this.utilitiesService.openSnackBar("success", response.responseMessage);
            UserConstant.refreshAgGid = true
            this.observerService.updateUserTable({ data: "updateUser", status : true })
            this.dialogRef.close()
          }
          else if (response.status == "error") {
            this.utilitiesService.openSnackBar("error", response.responseMessage);
          }
        }
      })
      .catch((err) => {
        this.utilitiesService.openSnackBar("error", "unexpected error");
      })
  }
  close(){
    UserConstant.userId=[]
    this.dialogRef.close()
  }
}
