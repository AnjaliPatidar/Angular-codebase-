import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SharedServicesService } from '../shared-services.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class UserSharedDataService {
  private getCurrentUserDetailsObservable: BehaviorSubject<any> = new BehaviorSubject<any>("");
  private getCurrentUserDetailsObserver: Observable<any> = this.getCurrentUserDetailsObservable.asObservable();

  private getUserDetailsObservable: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private getUserDetailsDetailsObserver: Observable<any> = this.getUserDetailsObservable.asObservable();

  private getUsersObservable: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private getUsersDetailsObserver: Observable<any> = this.getUsersObservable.asObservable();

  constructor(private sharedService: SharedServicesService , private httpClient: HttpClient) {
    this.getCurrentLoggedUserDetails();
  }

  setCurrentUserDetails(data: any): any {
    this.getCurrentUserDetailsObservable.next(data);
  }

  getCurrentUserDetails(): Observable<any> {
    return this.getCurrentUserDetailsObserver;
  }

  setUserDetails(data: any[]): any {
    this.getUserDetailsObservable.next(data);
  }
  getUserDetails(): Observable<any> {
    return this.getUserDetailsDetailsObserver;
  }

  setUsers(data: any[]): any {
    this.getUsersObservable.next(data);
  }

  getUsers(): Observable<any> {
    return this.getUsersDetailsObserver;
  }

  getCurrentLoggedUserDetails(){
    this.sharedService.getCurrentLoggedUserDetails().subscribe(resp => {
      if (resp) {
        this.setCurrentUserDetails(resp);
      }
    });
  }

  updateWidgetPreferences(params:any):Observable<any>{
    const apiUrl = 'usersNew/widgetPreference';
    return this.httpClient.post(apiUrl,params);
  }
}
