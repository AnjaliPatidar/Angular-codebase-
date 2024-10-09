import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GridData } from '@app/common-modules/models/grid-data.model';
import { User } from '@app/shared/user/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }
  getCountries() {
    let apiUrl = "listManagement/getListItemsByListType?listType=jurisdictions";
    return this.httpClient.get(apiUrl).toPromise();
  }
  getUserDetails(userId) {
    let apiUrl = "listManagement/getListItemsByListType?listType=jurisdictions";
    return this.httpClient.get(apiUrl).toPromise();
  }
  uploadImage(userId: any, file) {
    let apiUrl = 'usersNew/uploadUserImage';
    let formData = new FormData();
    formData.append('userImage', file);
    return this.httpClient.post(apiUrl, formData, { params: { userId: userId } }).toPromise();
  }
  registerUser(params) {
    let apiUrl = 'adminNew/register';
    return this.httpClient.post(apiUrl, params).toPromise();
  }
  getUserById(userId) {
    let apiUrl = 'usersNew/getUserProfileById';
    return this.httpClient.get(apiUrl, { params: { userId: userId } }).toPromise();
  }

  getAllUsers(): Promise<GridData<User>> {
    let apiUrl = 'usersNew/getUsers?isAllRequired=true';
    return this.httpClient.post<GridData<User>>(apiUrl, {}).toPromise();
}

  public getActiveUsers$(isAllRequired: boolean = true): Observable<Array<User>> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    const url = `usersNew/getActiveUsers?isAllRequired=${isAllRequired}`;
    return this.httpClient.post<{ result: Array<User>}>(url, '', httpOptions).pipe(
      map(({ result }: { result: Array<User> }) => result || []), 
    );
  }

  getStatusAttributes() {
    let apiUrl = 'listManagement/getListItemsByListType';
    return this.httpClient.get(apiUrl, { params: { listType: 'User Status' } }).toPromise();
  }
  updatePreferences(userId, params) {
    let apiUrl = 'adminNew/updateOwnPreferences';
    return this.httpClient.post(apiUrl, params, { params: { userId: userId } }).toPromise();
  }
  updateUser(userId, params) {
    let apiUrl = 'adminNew/register';
    return this.httpClient.post(apiUrl, params, { params: { userId: userId } }).toPromise();
  }
  deleteUserImage(userId) {
    let apiUrl = 'usersNew/deleteUserImage';
    return this.httpClient.delete(apiUrl, { params: { userId: userId } }).toPromise();
  }

  getUsersList(requestParams, filterModel) {
    delete requestParams['filterModel'];
    let apiUrl = 'usersNew/getUsers';
    return this.httpClient.post(apiUrl,{filterModel:filterModel},{params:requestParams});
  }
  getUserWithName(requestParams){
    let apiUrl = 'usersNew/quickSearch';
    return this.httpClient.get(apiUrl,{params:requestParams}).toPromise();
  }
  deActivateUser(userId){
    let apiUrl = 'usersNew/deactivateUser';
    return this.httpClient.post(apiUrl,{},{params:{userId:userId}}).toPromise();
  }
  removeUser(userId,roleId){
    let apiUrl = 'roles/unassignUserFromRole';
    return this.httpClient.delete(apiUrl,{ params: { userId: userId, roleId: roleId } }).toPromise();
  }
  getLogonUsersChartsData(params){
    let apiUrl = 'usersNew/getLogonsByHourCount';
    return this.httpClient.get(apiUrl,{params:params}).toPromise();
  }
  getLogonFailuresChartsData(params){
    let apiUrl = 'usersNew/getLogonsByHourCount';
    return this.httpClient.get(apiUrl,{params:params}).toPromise();
  }
  getTopLogonFailuresChartsData(params){
    let apiUrl = 'usersNew/getTopTenLogonFailureUsers';
    return this.httpClient.get(apiUrl,{params:params}).toPromise();
  }
  RightPanelUserData(data){
    var apiUrl = "audit/getLogsByTitleAndTypeId?token="+"&title="+data.title+"&typeId="+data.typeId;
    return this.httpClient.post(apiUrl,data)
  }
  addUsersToRoles(roleId,params){
    let apiUrl = 'roles/assignUsersToRole'+'?roleId='+roleId;
    return this.httpClient.post(apiUrl,params).toPromise();
  }
  removeUserFromGroup(userId, groupId){
    let apiUrl = 'groups/removeUser'+'?groupId='+groupId+'&userId='+userId;
    return this.httpClient.post(apiUrl,{}).toPromise();
  }
}
