import { Component, OnInit, Inject, ElementRef, ViewChild, } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';

import { MatChipInputEvent } from '@angular/material/chips';
import { MatSelectionList } from '@angular/material/list';
import { DOWN_ARROW, TAB, ESCAPE } from '@angular/cdk/keycodes';
import { UserService } from '@app/modules/user-management/services/user.service';
import { UtilitiesService } from '@app/modules/user-management/services/utilities/utilities.service';
import { AdvancedSearchUserTableComponent } from '../advanced-search-user-table/advanced-search-user-table.component';
import { ObserverService } from '@app/modules/user-management/services/observer.service';
import { GroupsService } from '@app/modules/user-management/services/groups.service';
import { UserConstant } from '@app/modules/user-management/constants/ag-grid/user-table.constants';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
@Component({
  selector: 'app-add-user-group',
  templateUrl: './add-user-group.component.html',
  styleUrls: ['./add-user-group.component.scss']
})
export class AddUserGroupComponent implements OnInit {
  public quickSearchOptions: any = [];
  public roleDetails: any = [];
  public assignedUsers: any;
  public nameOfGroup: string='';
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl : any ;
  filteredUser: any;
  users: string[] = [];
  // quickSearchOptions: string[] = [];

  @ViewChild('userInput', { static: true }) userInput: ElementRef<HTMLInputElement>;
  @ViewChild('userInput', { static: true }) autoComplete;
  @ViewChild('userSelectionList', { static: true }) userSelectionList: MatSelectionList;
  groupDetails: any;

  constructor(public dialogRef: MatDialogRef<AddUserGroupComponent>,
    public userService: UserService,
    private utilitiesService: UtilitiesService,
    public observerService: ObserverService,
    public router: Router,
    private utilityService : UtilitiesService,
    public dialog: MatDialog,
    public groupsService: GroupsService,
    @Inject(MAT_DIALOG_DATA) public incomingdata: any,
    private commonService : CommonServicesService) { }

  ngOnInit() {
    this.assignedUsers = this.incomingdata.message;
    this.groupDetails = this.incomingdata.groupDetails;
    this.roleDetails = this.incomingdata.roleDetails;
    if (this.assignedUsers == "FromRoles") {
      // let roleName = this.router['browserUrlTree'].queryParams.roleName ? this.router['browserUrlTree'].queryParams.roleName : this.router['browserUrlTree'].root.children.primary.segments[5].path
      this.nameOfGroup= this.roleDetails.roleName
      //let roleName = this.router['browserUrlTree'].queryParams.roleName ? this.router['browserUrlTree'].queryParams.roleName : this.router.routerState.snapshot.url.split("/")[6];
      // this.filteredUser = this.userCtrl.valueChanges.pipe(
      //   startWith(null),
      //   map((user: string | null) => user ? this._filter(user) : this.quickSearchOptions.slice()));
      // this.getRoleDetails(false,roleName)
    } else if (this.assignedUsers == "FromGroups") {
      // let groupName = this.router['browserUrlTree'].queryParams.roleName ? this.router['browserUrlTree'].queryParams.roleName : this.router['browserUrlTree'].root.children.primary.segments[5].path
      this.nameOfGroup= this.groupDetails.groupName
    }
  }
  get_pattern(element){
    return this.commonService.get_pattern(element);
  }
  get_pattern_error(type){
    return this.commonService.get_pattern_error(type);
  }
  // getRoleDetails(fillRoleName = true,roleName){
  //   this.rolesService.getRole({roleName : roleName})
  //   .then((response)=>{
  //     if(response && response['roleId']){
  //       this.roleDetails['description'] = response['description'];
  //       if(fillRoleName){
  //         this.roleDetails['roleName'] = response['roleName'];
  //       }
  //       this.roleDetails['roleId'] = response['roleId'];

  //       this.roleDetails['icon'] = response['icon'];
  //       this.roleDetails['color'] = response['color'];

  //     }
  //     else{
  //      // this.utilitiesService.openSnackBar("error", "Invalid rolename");
  //     }
  //   })
  //   .catch((err)=>{
  //    // this.utilitiesService.openSnackBar("error", "something went wrong");
  //   })
  // }
  onInputKeyboardNavigation(event,control) {
    if(control && control.invalid){
      return
    }
    switch (event.keyCode) {
      case DOWN_ARROW:
        this.userSelectionList.options.first.focus();
        break;
      default:
    }

  }
  search(event,control) {
    if(control && control.invalid){
      return
    }
    let params = {
      isScreeNameRequired: true,
      searchKey: event
    }
    if (event != '') {
      this.userService.getUserWithName(params)
        .then((response: any) => {
          if (response) {
            this.filteredUser = [];
            response.data.forEach((element) => {
              let middleName = (element.middleName != null) ? element.middleName : "";
              if (element.userImage) {
                let imageFile = this.utilitiesService.convertBase64ToJpeg(element.userImage)
                var reader = new FileReader();
                reader.onload = (e: any) => {
                  this.filteredUser.push({
                    key: element.userId,
                    value: element.firstName + " " + middleName + " " + element.lastName,
                    img: e.target.result,
                  })
                };
                reader.readAsDataURL(imageFile);
              }
              else {
                this.filteredUser.push({
                  key: element.userId,
                  value: element.firstName + " " + middleName + " " + element.lastName,
                  icon: element.firstName.charAt(0) + element.lastName.charAt(0),
                })

              }
            })
            // this.filteredUser = this._filter(event);
          }
        })
        .catch((err) => {

        })
    }
  }
  onListKeyboardNavigation(event) {
    switch (event.keyCode) {
      case TAB:
      case ESCAPE:
        this.userInput.nativeElement.focus();
        this.autoComplete.closePanel();
        break;
      default:
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.addUser(value);
    }
    if (input) {
      input.value = '';
    }

    this.userCtrl = "";
  }

  remove(user): void {
    const index = this.users.findIndex((x: any) => x.key === user.key);
    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }

  onUserSelectionChange(user, i): void {
    this.updateUserList(user, i);
    this.userInput.nativeElement.value = '';
    this.userCtrl = "";
  }

  //  private _filter(value: string): string[] {
  //    const filterValue = value.toLowerCase();

  //    return this.quickSearchOptions.filter((option : any) => option.value.toLowerCase().includes(filterValue));
  //  }

  addUser(user) {
    this.users.push(user);
  }

  isUserSelected(user): boolean {
    return this.users.findIndex((x: any) => x.key === user.key) >= 0;
  }

  updateUserList(user, i): void {
    if (this.isUserSelected(user)) {
      this.remove(user);
    } else {
      this.addUser(user);
    }
  }
  addUsersList(users) {
    if (this.roleDetails && this.roleDetails.roleId) {
      this.addUsersToRole(users)
    } else if (this.groupDetails && this.groupDetails.groupId) {
      this.addUsersToGroups(users)
    }
  }
  addUsersToRole(users) {
    let userListId = []
    users.forEach(element => {
      userListId.push(element.key)
    });
    this.userService.addUsersToRoles(this.roleDetails['roleId'], userListId)
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
  addUsersToGroups(users) {
    let userListId = []
    users.forEach(element => {
      userListId.push(element.key)
    });
    this.groupsService.addUsersToGroups(this.groupDetails['groupId'], userListId)
      .then((response: any) => {
        if (response) {
          if (response.status == "success") {
            this.utilitiesService.openSnackBar("success", response.responseMessage);
            UserConstant.refreshAgGid = true
            this.observerService.updateUserTable({ data: "updateUser", status : true });
            this.utilityService.getAssignedUserCount({
              groupId:  this.groupDetails['groupId']
            });

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
  advancedSearchUserTable() {
    const dialogRef = this.dialog.open(AdvancedSearchUserTableComponent, {
      panelClass: ['user-popover', 'w-100', 'custom-scroll-wrapper'],
      data: { message: this.incomingdata }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  public trackByValue(_, item): string {
    return item.value;
  }
}
