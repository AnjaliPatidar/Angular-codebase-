import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '@app/modules/user-management/services/roles/roles.service';
import { UtilitiesService } from '@app/modules/user-management/services/utilities/utilities.service';
import { PieChartModule } from '@app/shared/charts/chartsNew/reusablePie.js'
import { UserDeleteComponent } from '../../users/modals/user-delete/user-delete.component';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
@Component({
  selector: 'app-roles-settings',
  templateUrl: './roles-settings.component.html',
  styleUrls: ['./roles-settings.component.scss']
})
export class RolesSettingsComponent implements OnInit {
  public roleDetails = {
    "description": "",
    "notes": "",
    "roleId": 0,
    "roleName": "",
    "icon":null,
    "color":"",
    "isModifiable":true
  }
  public systemSettings =  [];
  public icons = GlobalConstants.icons;
  public iconsCopy:[];
  public currentRole : (number | string);
  public addRoleSpinner:boolean =  false;
  public userStatus:any =[];
  public roleUpdateEnable : boolean = false;
  userActive: any;
  constructor(
    private router :Router,
    private route: ActivatedRoute,
    private rolesService :RolesService,
    private utilitiesService: UtilitiesService,
    public confirmDialog: MatDialog,
    public confirmDialogRef: MatDialogRef<UserDeleteComponent>,
    private commonService : CommonServicesService,
  ){ }

  ngOnInit() {
    this.systemSettings = GlobalConstants.systemSettings;
    this.roleUpdateEnable = this.systemSettings['Allow update manually-Roles'];
    this.currentRoleData()

  }
  get_pattern(element){
    return this.commonService.get_pattern(element);
  }
  get_pattern_error(type){
    return this.commonService.get_pattern_error(type);
  }
  currentRoleData(){
    this.route.params.subscribe(params => {
      this.currentRole = decodeURIComponent(params['currentRole']);
      if(this.currentRole != "newrole"){
        this.getRoleDetails(true,this.currentRole);
      }
    });
    this.route.queryParams.subscribe(params => {
      if(params.roleName){
        this.getRoleDetails(false,decodeURIComponent(params.roleName));
      }
    });
    this.iconsCopy =  this.icons;
  }
  iconsFilter(event){
    if(event){
      let icons =  this.icons;
      icons = icons.filter((icon)=>{ return icon.indexOf(event) != -1})
      setTimeout(()=>{
        this.icons = icons;
      })
    }
    else{
      this.icons = this.iconsCopy;
    }
  }
  addRole(){
    this.addRoleSpinner = true;
    delete this.roleDetails['roleId'];
    this.roleDetails['isModifiable'] = true;
    this.rolesService.addRole(this.roleDetails)
    .then((response:any)=>{
      if (response.status == "success") {
        this.utilitiesService.openSnackBar("success", response.responseMessage);
        /*pushing role into global value */
        GlobalConstants.systemSettings['allRoles'].push(response["data"]);
        this.addRoleSpinner = false;
        this.router.navigate(['/element/user-management/manage/roles/settings/'+this.roleDetails['roleName']])
        //this.currentRoleData()
      }
      else if (response.status == "error") {
        this.utilitiesService.openSnackBar("error", response.responseMessage);
        this.addRoleSpinner = false;
      }
     })
    .catch((error)=>{

    });
  }
  getRoleDetails(fillRoleName = true,roleName){
    this.rolesService.getRole({roleName : roleName})
    .then((response)=>{
      if(response && response['roleId']){
        this.roleDetails['description'] = response['description'];
        this.roleDetails['roleId'] = response['roleId'];
        if(fillRoleName){
          this.roleDetails['roleName'] = response['roleName'];
          this.roleDetails['isModifiable'] = response['isModifiable']
          this.intializeUsersActivityChart()
        }
        this.roleDetails['icon'] = response['icon'];
        this.roleDetails['color'] = response['color'];
      }
      else{
        this.utilitiesService.openSnackBar("error", "Invalid rolename");
      }
    })
    .catch((err)=>{
      this.utilitiesService.openSnackBar("error", "something went wrong");
    })
  }
  updateRole(){
    this.addRoleSpinner =  true;
    this.rolesService.addRole(this.roleDetails)
    .then((response: any) => {
      if (response.status == "success") {
        this.utilitiesService.openSnackBar("success", response.responseMessage);
        this.router.navigate(['/element/user-management/manage/roles/settings/'+this.roleDetails['roleName']])
        this.addRoleSpinner = false;
      }
      else if (response.status == "error") {
        this.utilitiesService.openSnackBar("error", response.responseMessage);
        this.addRoleSpinner = false;
      }
    })
    .catch(err => {
      this.utilitiesService.openSnackBar("error", "unexpected error");
      this.addRoleSpinner = false;
    })
  }
  deleteRole(roleForm){
    let dialogRef = this.confirmDialog.open(UserDeleteComponent, {
      panelClass: ['user-popover', 'custom-scroll-wrapper', 'delete-modal'],
      backdropClass:'modal-background-blur',
      data: { message: `are you sure wish to delete ${this.roleDetails['roleName']}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.addRoleSpinner =  true;
        this.rolesService.deleteRole({roleId:this.roleDetails['roleId'] })
        .then((response: any) => {
          if (response.status == "success") {
            this.utilitiesService.openSnackBar("success", response.responseMessage);
            this.addRoleSpinner = false;
            this.router.navigate(['/element/user-management/manage/roles/settings/newrole'])
            roleForm.reset()
          }
          else if (response.status == "error") {
            this.utilitiesService.openSnackBar("error", response.responseMessage);
            this.addRoleSpinner = false;
          }
        })
        .catch(err => {
          this.utilitiesService.openSnackBar("error", "unexpected error");
          this.addRoleSpinner = false;
        })
      }
    });
  }
  cloneRole(){

  }
  assignUsersRoute(tabName){
    return `/element/user-management/manage/roles/assigned-users/${encodeURIComponent(tabName)}`
  }
  intializeUsersActivityChart(){
    let params = {
      roleId:  this.roleDetails['roleId']
    }
     this.userStatus=[
      {key:"Pending",icon:"hourglass",value:0},
      {key:"Active",icon:"check-circle",value: 0},
      {key:"Suspended",icon:"pause-circle",value:0},
      {key:"Blocked",icon:"ban",value:0},
      {key:"Deactivated",icon:"times",value:0},
    ]
    this.rolesService.getUserStatus(params).then((res: any) => {
      this.userActive = Object.keys(res).length ;
      if(Object.keys(res).length){
      let data: Array<any> = [];
      for (var property in res) {

        this.userStatus.forEach((val) => {
          if (val.key == property) {
            val.value = res[property]
          }
        })
      }

        let numbers: Array<any> = Object.values(res)
        let sum = 0;
        for (var i = 0; i < numbers.length; i++) {
          sum += numbers[i]
        }
        let percent = (res.Active/sum)*100;
        if(isNaN(percent)){
          percent = 0
        }
    var pieData = { container: "#userStatus", radius: { outerRadius: 65, innerRadius: 50 }, data: this.userStatus,width:130, height: 130, colors: [ "#00796b","#3eb6ff","#e6ae20","#ef5350","rgba(255, 255, 255, 0.54)"], islegends: false, islegendleft: false, legendwidth: '', istxt:percent!=100? percent.toFixed(2)+ "%" : percent +"%",divideTxt:"Active",txtSize: "12px",paddingTop:"", legendmargintop: 30,legendHeight: "280px" }
        PieChartModule.ReusablePie(pieData)
      }
      }).catch((error) => {
        throw error
      })

  }

  public trackByKey(_, item): string {
    return item.key;
  }

}
