import { Component, AfterContentInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RolesService } from '@app/modules/user-management/services/roles/roles.service';
@Component({
  selector: 'app-roles-manager',
  templateUrl: './roles-manager.component.html',
  styleUrls: ['./roles-manager.component.scss']
})
export class RolesManagerComponent implements AfterContentInit {
  public  currentRole :any ;
  public cloneRole : string;
  public assignUsersCount:any;
  public roleDetails:any = [];
  constructor(private route: ActivatedRoute,private rolesService :RolesService) { }

  ngOnInit() {
    // this.route.pathFromRoot
    this.route.params.subscribe(params => {
      this.currentRole = decodeURIComponent(params['currentRole']);
    });
    this.route.queryParams.subscribe(params => {
      this.cloneRole =  params.roleName
    });
  }
  ngAfterContentInit(){
    this.route.firstChild.params.subscribe(params => {
      this.currentRole = decodeURIComponent(params['currentRole']);
      this.getRoleDetails(true,this.currentRole);
    });
    this.route.firstChild.queryParams.subscribe(params => {
      this.cloneRole =  params.roleName
    });
  }
  settingUrl(){
    return `/element/user-management/manage/roles/settings/${encodeURIComponent(this.currentRole)}`
  }
  permissionsUrl(){
    return `/element/user-management/manage/roles/permissions/${encodeURIComponent(this.currentRole)}`
  }
  assignedUsersUrl(){
    return `/element/user-management/manage/roles/assigned-users/${encodeURIComponent(this.currentRole)}`
  }
  getRoleDetails(fillRoleName = true,roleName){
    this.rolesService.getRole({roleName : roleName})
    .then((response)=>{
      if(response && response['roleId']){
        this.roleDetails['description'] = response['description'];
        if(fillRoleName){
        }
        this.roleDetails['roleName'] = response['roleName'];

        this.roleDetails['roleId'] = response['roleId'];

        this.roleDetails['icon'] = response['icon'];
        this.roleDetails['color'] = response['color'];
        this.getAssignedUsers();
      }
      else{
        //this.utilitiesService.openSnackBar("error", "Invalid rolename");
      }
    })
    .catch((err)=>{
      //this.utilitiesService.openSnackBar("error", "something went wrong");
    })
  }

  getAssignedUsers(){
    let params = {
      roleId:  this.roleDetails['roleId']
    }

    this.rolesService.getUserStatus(params).then((res: any) => {
     let numbers: Array<any> = Object.values(res)
        let sum = 0;
        for (var i = 0; i < numbers.length; i++) {
          sum += numbers[i]
        }
        this.assignUsersCount=sum;
      }).catch((error) => {
        throw error
      })

  }
}
