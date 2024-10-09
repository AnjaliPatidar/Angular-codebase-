import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CaseSharedDataService {
  private getCaseListTypeOptionsObservable: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private getCaseListTypeOptionsObserver: Observable<any> = this.getCaseListTypeOptionsObservable.asObservable();

  private getProductListDataLists: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private getProductListDataList: Observable<any> = this.getProductListDataLists.asObservable();

  private getRiskLists: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private getRiskList: Observable<any> = this.getRiskLists.asObservable();

  private getTenantLists: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private getTenantList: Observable<any> = this.getTenantLists.asObservable();

  statusReasonsList: any;
  currentLoggedUser

  constructor() {}

  setCaseListTypeOptions(caseListOptionsdata: any[]): any {
    this.getCaseListTypeOptionsObservable.next(caseListOptionsdata);
  }

  getCaseListTypeOptions(): Observable<any> {
    return this.getCaseListTypeOptionsObserver;
  }

  setProductListData(productListData: any[]): any {
    this.getProductListDataLists.next(productListData);
  }

  getProductListData(): Observable<any> {
    return this.getProductListDataList;
  }

  setRiskData(riskList: any[]): any {
    this.getRiskLists.next(riskList);
  }

  getRiskData(): Observable<any> {
    return this.getRiskList;
  }
  setTenantData(tenantList: any[]): any {
    this.getTenantLists.next(tenantList);
  }

  getTenantData(): Observable<any> {
    return this.getTenantList;
  }
}
