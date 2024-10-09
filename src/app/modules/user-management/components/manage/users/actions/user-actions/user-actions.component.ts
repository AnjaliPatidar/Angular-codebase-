import { Component, OnInit } from '@angular/core';
//import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { MatDialog } from '@angular/material/dialog';
import { UserCreateComponent } from '../../modals/user-create/user-create.component';
import { UserDeleteComponent } from '../../modals/user-delete/user-delete.component';
import { UserService } from '@app/modules/user-management/services/user.service';
import { ObserverService } from '@app/modules/user-management/services/observer.service';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { UserConstant } from '@app/modules/user-management/constants/ag-grid/user-table.constants';
import { UtilitiesService } from '@app/modules/user-management/services/utilities/utilities.service';
import { OnDestroy } from "@angular/core";
import { Router } from '@angular/router';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
//import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-user-actions',
  templateUrl: './user-actions.component.html',
  styleUrls: ['./user-actions.component.scss']
})
export class UserActionsComponent implements OnInit, OnDestroy {
  public roleDetails:any = [];
  public rightPanel: any = true;
  public currentRowData: any;
  public userId: number;
  public systemSettings: Array<any> = [];
  public dateFormat = GlobalConstants.globalDateFormat;
  public gridApi: any;
  public userSource :string;
  //private subscription: Subscription;
  constructor(public dialog: MatDialog, public router: Router, private userService: UserService, public SharedService: SharedServicesService, public observerService: ObserverService, private utilitiesService: UtilitiesService) {
  //  if(User.refreshAgGid){
    this.updateAddedRoles()
  //  }
   } //public SharedService: SharedServicesService,
  public rowDeleteFilter = {}
  public fullName: any;
  public screenName: string;
  public imagePath: any;
  public profileIcon: any;
  public filterData: any;
  public assignedUser: string='';

  ngOnInit() {

    // //this.observerService.TableRender.subscribe((data:any)=>{
    //     if(User.filterData){
    //     //this.showTable = data.showTable
    //     this.gridApi.setFilterModel(User.filterData ? User.filterData : null);
    //     //this.showTable = true;
    //     }
    //})
    const assignedUser: string = this.router.routerState.snapshot.url.split("/")[4];
    if (assignedUser) {
      this.assignedUser = assignedUser;
    }
  }
  updateAddedRoles(){
    this.observerService.TableRender.subscribe((data: any) => {
        if (data && data.data && data.status && UserConstant.refreshAgGid) {
          this.gridApi.refreshInfiniteCache();
          UserConstant.refreshAgGid = false;
          // this.observerService.updateUserTable({ data: "", status : false })
        }
      })

  }

  showRightPanel() {
    return this.SharedService.hideAlertRightPanel(this.rightPanel);
  }
  public params;
  agInit(params: any, event): void {
    if (params) {
      setTimeout(()=>{
        this.params =  params;
        this.gridApi = params.api;
        this.currentRowData =  params && params.data ? params.data : {};
        this.fullName = this.currentRowData[UserConstant.fullName.field];
        this.screenName = this.currentRowData.screenName;
        this.userSource =  this.currentRowData[UserConstant.source.field]? this.currentRowData[UserConstant.source.field].toLowerCase() : "NA";
        this.systemSettings = this.currentRowData['systemSettings'];
        // if (this.className == "fullName") {
          let makeImage = (imgData) => {
            if (imgData) {
              let imageFile = this.utilitiesService.convertBase64ToJpeg(imgData);
              var reader = new FileReader();
              reader.onload = (e: any) => {
                this.imagePath = e.target.result;

              };
              reader.readAsDataURL(imageFile);
            }
            else {
              this.profileIcon = this.currentRowData.completeResponse['firstName'].charAt(0) + this.currentRowData.completeResponse['lastName'].charAt(0);
            }
          }
          try{
            makeImage(this.currentRowData.completeResponse['userImage']);
          }
          catch{

          }


    },0)
  }
  }
  openEditModal() {
    const dialogRef = this.dialog.open(UserCreateComponent, {
      panelClass: ['user-popover', 'custom-scroll-wrapper'],
      backdropClass:'modal-background-blur',
      data: { operation: "edit", 'systemSettings': this.systemSettings, userId: this.currentRowData.completeResponse.userId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "Save Changes") {
        this.gridApi.refreshInfiniteCache();
      }
    });
  }
  deleteUser() {

    this.userId = this.currentRowData['completeResponse']['userId'];
    const dialogRef = this.dialog.open(UserDeleteComponent, {
      panelClass: ['user-popover', 'custom-scroll-wrapper', 'delete-modal'],
      backdropClass:'modal-background-blur',
      data: {message:`Delete ${this.currentRowData[UserConstant.fullName.field]} ?`}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deActivateUser(this.userId)
        .then((response:any) => {
          this.utilitiesService.openSnackBar(response.status,response.responseMessage);
          if(response.status == "success"){
            this.gridApi.refreshInfiniteCache();
          }
        })
        .catch((err) => {
          this.utilitiesService.openSnackBar("error","something went wrong");
        });
      }
   });
}
removeUserFromRole(){

  this.userId = this.currentRowData['completeResponse']['userId'];
    const dialogRef = this.dialog.open(UserDeleteComponent, {
      panelClass: ['user-popover', 'custom-scroll-wrapper', 'delete-modal'],
      backdropClass:'modal-background-blur',
      data: {message:`Remove User ${this.currentRowData[UserConstant.fullName.field]} ?`}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let roleId = UserConstant.roleDetails['roleId'];
        this.userService.removeUser(this.userId, roleId)
        .then((response:any) => {
          this.utilitiesService.openSnackBar(response.status,response.responseMessage);
          if(response.status == "success"){
            // let data = {
            //   showTable: false
            // }
            // this.observerService.HideShowTable(data)
            this.gridApi.refreshInfiniteCache();
          }
        })
        .catch((err) => {
          this.utilitiesService.openSnackBar("error","something went wrong");
        });
      }
   });
}
removeUserFromGroup(){
  this.userId = this.currentRowData['completeResponse']['userId'];
  const dialogRef = this.dialog.open(UserDeleteComponent, {
    panelClass: ['user-popover', 'custom-scroll-wrapper', 'delete-modal'],
    backdropClass:'modal-background-blur',
    data: {message:`Remove User ${this.currentRowData[UserConstant.fullName.field]} ?`}
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      let groupId = UserConstant.groupDetails['groupId'];
      this.userService.removeUserFromGroup(this.userId, groupId)
      .then((response:any) => {
        this.utilitiesService.openSnackBar("success",response.responseMessage);
        // if(response.status == "success"){
          // let data = {
          //   showTable: false
          // }
          // this.observerService.HideShowTable(data)
          this.gridApi.refreshInfiniteCache();
        // }
      })
      .catch((err) => {
        this.utilitiesService.openSnackBar("error","something went wrong");
      });
    }
 });
}
getRowData() {
    var rowData = [];
    this.gridApi.forEachNode(function (node) {
      if (node && node.data) {
        rowData.push(node.data);
      }

    });
    return rowData;
}

  public trackByName(_, item): string {
    return item.name;
  }

  public trackByRoleIdRoleName(_, item): string {
    return item.roleId.roleName;
  }

  ngOnDestroy() {
    //   this.subscription.unsubscribe();
  }

}
