import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class RolesService {
  constructor(private httpClient: HttpClient){}
  addRole(params){
    params['source'] = "internal"
    let apiUrl = "roles/saveOrUpdateRole";
    return this.httpClient.post(apiUrl,params).toPromise();
  }
  getAllRoles(){
    let apiUrl = "roles/getAllRoles";
    return this.httpClient.get(apiUrl).toPromise();
  }
  getRole(params){
    let apiUrl = "roles/getRoleByIdOrName";
    return this.httpClient.get(apiUrl,{params:params}).toPromise();
  }
  deleteRole(params){
    let apiUrl = "roles/deleteRole";
    return this.httpClient.delete(apiUrl,{params:params}).toPromise();
  }
  getPermissions(){
    let apiUrl = "privileges/getAllPermissions";
    return this.httpClient.get(apiUrl).toPromise();
  }
  getRolePermissions(params){
    let apiUrl = "groupPermission/getRolePermissions";
    return this.httpClient.get(apiUrl,{params:params}).toPromise();
  }

  getUserStatus(params){
    let apiUrl = "roles/getStatuswiseUsersByRoleId";
    return this.httpClient.get(apiUrl,{params:params}).toPromise();
  }

  addPermission(params){
    let apiUrl = "groupPermission/saveOrUpdateGroupPermission";
    return this.httpClient.post(apiUrl,params).toPromise();
  }
}
