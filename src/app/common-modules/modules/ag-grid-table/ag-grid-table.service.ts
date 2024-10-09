import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AppConstants } from '@app/app.constant';
import { catchError, retry } from 'rxjs/operators';
import { GridFilterUpdate } from './models/grid-filter.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

type RowNodeSelectionChangeData = {
  rowNodeId: any,
  status: boolean,
  tableName?: string
}

@Injectable({
  providedIn: 'root'
})
export class AgGridTableService {

  constructor(private _httpClient: HttpClient) { }

  productFilterID : string;
  statusFilterKey : string;
  dateModelFilter = {};
  tagEntity : string;

  private behaviorSubjectForAgGrid = new BehaviorSubject<any>("");
  getObserver = this.behaviorSubjectForAgGrid.asObservable();

  private behaviorSubjectForGetColor = new BehaviorSubject<any>("");
  getObserverForGetColor = this.behaviorSubjectForGetColor.asObservable();

  private behaviorSubjectForGetMultiSelectOptions = new BehaviorSubject<any>("");
  getObserverForGetMultiSelectOptions = this.behaviorSubjectForGetMultiSelectOptions.asObservable();

  private behaviorSubjectForNavigator = new BehaviorSubject<any>("");
  getObserverNavigator = this.behaviorSubjectForNavigator.asObservable();

  private behaviorSubjectForSelectedRows = new BehaviorSubject<any>("");
  getObserverSelectedRows = this.behaviorSubjectForSelectedRows.asObservable();

  private behaviorSubjectOnRowClick = new BehaviorSubject<any>("");
  getObserverOnRowClick = this.behaviorSubjectOnRowClick.asObservable();

  private behaviorSubjectOnRowSelected = new Subject();
  getObserverOnRowSelected = this.behaviorSubjectOnRowSelected.asObservable();

  public behaviorSubjectForAllPermisonIds = new BehaviorSubject<Array<any>>([]);
  behaviorSubjectForAllPermisonIds$ = this.behaviorSubjectForAllPermisonIds.asObservable();

  private behaviorSubjectForReviewerStatus = new BehaviorSubject<any>("");
  getObserverReviewerStatus = this.behaviorSubjectForReviewerStatus.asObservable();

  private behaviorSubjectForUpdatedData = new BehaviorSubject<any>("");
  getObserverForUpdatedData= this.behaviorSubjectForUpdatedData.asObservable();

  public behaviorSubjectForProduct = new BehaviorSubject({});
  getObserverForProduct= this.behaviorSubjectForProduct.asObservable();

  public behaviorSubjectForCaseCreate = new BehaviorSubject({});
  getObserverForCaseCreate= this.behaviorSubjectForCaseCreate.asObservable();

  public behaviorSubjectForTagAddEdit = new BehaviorSubject({});
  getObserverForTagTagAddEdit= this.behaviorSubjectForTagAddEdit.asObservable();

  private changeRowNodeSelection$ = new Subject<RowNodeSelectionChangeData>();
  rowNodeManualSelectionSubject = this.changeRowNodeSelection$.asObservable();

  updateFilterSub: Subject<GridFilterUpdate> = new Subject();

  /**Get the data from components which sends to the ag-grid-component */
  getGridOptionsFromComponent(data): any {
    this.behaviorSubjectForAgGrid.next(data);
  }

  /** Get color from color component */
  getColorFromColoComponent(data): any {
    this.behaviorSubjectForGetColor.next(data);
  }

  /** Get color from color component */
  getMultiSelectOptionsFromComponent(data): any {
    this.behaviorSubjectForGetMultiSelectOptions.next(data);
  }

  /**Sending data from one component to other when navigation */
  getComponentDataOnNavigation(data) {
    this.behaviorSubjectForNavigator.next(data);
  }

  /**Sending selected row data to alert component */
  getComponentDataForSelectedROws(data) {
    this.behaviorSubjectForSelectedRows.next(data);
  }
  getComponentDataOnRowClick(data) {
    this.behaviorSubjectOnRowClick.next(data);
  }

  getComponentDataOnRowSelected(data) {
    this.behaviorSubjectOnRowSelected.next(data);
  }

  /**Sending selected status to reviewer status */
  getStatusForReviewer(data) {
    this.behaviorSubjectForReviewerStatus.next(data);
  }

  /**Sending updated data */
  getUpdatedData(data) {
    this.behaviorSubjectForUpdatedData.next(data);
  }

  addEditTagData(data) {
    this.behaviorSubjectForTagAddEdit.next(data);
  }

  /**
   * externally select/unselect grid rows
   * @param data {rowNodeId: row id, status: select = true or unselect, tableName: table name}
   */
  changeGridRowSelectionStatus(data: RowNodeSelectionChangeData) {
    this.changeRowNodeSelection$.next(data);
  }

  /**
   * Dynamically set ag grid filters
   * @param filterModel filter model
   * @param override override existing filters or not. Set to false by default.
   */
    updateGridFilters(filterModel: any, override: boolean = false): void {
      this.updateFilterSub.next({
        filterModel,
        override
      });
    }

  /**Common API calls for Ag grid table service start */

  /* purpose: Save or Update grid table
    * created: 31-July 2019
    * author: karnakar
  */
  saveOrUpdateGridTableAPI(data): Observable<any> {
    return this._httpClient.post(AppConstants.Ehub_Rest_API + "gridView/saveOrUpdateGridView", data, httpOptions).pipe(
        retry(0), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  getHistoryData (caseId) {
    const apiUrl = AppConstants.Ehub_Rest_API +'case/getNewCaseById?caseId='+caseId;
    return this._httpClient.get(apiUrl).pipe(retry(1), catchError(this.handleError));
  }


  /* purpose: Get all saved list of views for grid table
    * created: 31-July 2019
    * author: karnakar
  */
  getAllSavedListOfViewsDataAPI(tableName): Observable<any> {
    return this._httpClient.get(AppConstants.Ehub_Rest_API + "gridView/getAllGridViewsByUser?tableName=" + tableName).pipe(
        retry(0), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  /* purpose: Delete saved view table
    * created: 31-July 2019
    * author: karnakar
  */
  deleteSavedViewTableAPI(params): Observable<any> {
    return this._httpClient.delete(AppConstants.Ehub_Rest_API + "gridView/deleteGridView?gridViewId=" + params.viewId).pipe(
        retry(0), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  /* purpose: Screening batch file validation
   * created: 06-Feb 2020
   * author: karnakar
 */
  getScreeningBatchID(params, data): Observable<any> {
    let fm = new FormData();
    let newarr= JSON.stringify(params.feed.map(String));
    // Add your values in here
    fm.append('uploadFile', data);
    fm.append('watchlists', params.watchlist);
    fm.append('all_watchlist', params.all_watchlist);
    fm.append('confidence', params.confidence);
    fm.append('feed', newarr);
    var appUrl = AppConstants.Ehub_Rest_API + "alertManagement/SSBScreening";
    return this._httpClient.post(appUrl, fm).pipe(
      retry(0), // retry a failed request up to 3 times
      catchError(this.handleServerError) // then handle the error
    );
  }

  /* purpose: Screening batch file validation
    * created: 06-Feb 2020
    * author: karnakar
  */
  screeningBatchFileValidationAPI(screeningId): Observable<any> {
    var appUrl = AppConstants.Ehub_Rest_API + "alertManagement/screeningAlertsResult?id=" + screeningId;
    return this._httpClient.post(appUrl, screeningId).pipe(
      retry(0), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }


  /**Common API calls for Ag grid table service end */
  csvExport(url, params) {
    return this._httpClient.post(url, params, { responseType: 'blob' })
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  private handleServerError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    let message = error.error.responseMessage;
    return throwError(message);
  }


  // @purpose : get exported case list data as per requested export type
  // @params <string> : 'pdf' or 'csv'
  // @return : exported file
  // @author : ammshathwan
  // @date : 20 apr 2023
  caseExportAsType(exportType:string , params:any): Observable<any> {
    var appUrl = AppConstants.Case_New_API + `export?type=${exportType}`;
    return this._httpClient.post(appUrl , params ,{ responseType : 'blob' as 'json'})
  }
}
