import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient) { }
  groupsWithUser(){
    let apiUrl = "usersManagement/groupsWithUserCount";
    return this.httpClient.get(apiUrl).toPromise(); 
  }
  rolesWithUser(){
    let apiUrl = "usersManagement/rolesWithUserCount";
    return this.httpClient.get(apiUrl).toPromise(); 
  }
  mainKpiData(){
    let apiUrl = "usersManagement/mainTilesData";
    return this.httpClient.get(apiUrl).toPromise();
  }
  userChartData(){
    let apiUrl = "usersNew/getCountByStatusWise";
    return this.httpClient.get(apiUrl).toPromise();
  }
}
