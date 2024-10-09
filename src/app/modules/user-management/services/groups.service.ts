import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor(private httpClient: HttpClient) { }

  public getAllGroups$(): Observable<any> {
    let url = 'groups/getAllGroups';
    return this.httpClient.get(url).pipe(map((response: any) => JSON.parse(response.data))); 
  }

  getJurdictions(params){
    let apiUrl = "listManagement/getListItemsByListType";
    return this.httpClient.get(apiUrl,{params:params}).toPromise(); 
  }
  getGroup(params){
    let apiUrl = "groups/getGroupByName";
    return this.httpClient.get(apiUrl,{params:params}).toPromise();  
  }
  createGroup(params){
    params['source'] = "internal"
    let apiUrl = "groups/create";
    return this.httpClient.post(apiUrl,params).toPromise(); 
  }
  addUsersToGroups(groupId,params){
    let apiUrl = 'groups/addUserList'+'?groupId='+groupId;
    return this.httpClient.post(apiUrl,params).toPromise(); 
  }
  getRoleOfGroup(params){
    let apiUrl = "roleGroup/getRolesByGroup";
    return this.httpClient.post(apiUrl,params).toPromise(); 
  }
  updateRoles(data,groupId){
    let apiUrl = "roleGroup/saveOrRoleGroup"+"?groupId="+groupId;
    return this.httpClient.post(apiUrl,data).toPromise();
  }
  getUserStatusOfGroup(params){
    let apiUrl = "groups/getStatuswiseUsersByGroupId";
    return this.httpClient.get(apiUrl,{params:params}).toPromise(); 
  }
  updateGroupDetails(data){
    let apiUrl = "groups/updateGroupById"+"?groupId="+data.userGroupId;
    return this.httpClient.post(apiUrl,data).toPromise();
  }
  public getAlertGroup(params: HttpParams | {
    [param: string]: string | string[];
  }) {
    const url: string = 'groupAlert/getGroupAlertSettings';
    return this.httpClient.get(url, { params }); 
  }
  AlertGroupGeo(data){
    let apiUrl = "groupAlert/saveGroupAlertSettingBulk"
    return this.httpClient.post(apiUrl,data).toPromise();
  }
  deleteGroup(params){
    let apiUrl = "groups/deleteGroups";
    return this.httpClient.delete(apiUrl,{params:params}).toPromise(); 
  }
}
