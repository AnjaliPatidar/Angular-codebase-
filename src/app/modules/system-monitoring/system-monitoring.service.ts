import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppConstants } from '../../app.constant';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SystemMonitoringService {
  isUserInDevMode =isDevMode();
  constructor(private  _httpClient:HttpClient) { }
   /**Common API List start */

    /* purpose: handle errors
     * created: 23-Aug-2019
     * author: karnakar
    */
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
      error.error.responseMessage ? error.error.responseMessage : 'Something bad happened; please try again later.');
  };
  getPermissionIdsSourceMoniting():Observable<any>{
    let path = this.isUserInDevMode ? '../../../assets/json/permissonsMapping.json' :'assets/json/permissonsMapping.json';
    return this._httpClient.get(path).pipe(map(res=>  {
     return res[0];
    }));
  }
   /**Sources API List start */
    /* purpose: Get Feed List
     * created: 23-Aug-2019
     * author: karnakar
    */
   getSourcesList():Observable<any>{
    var apiUrl = AppConstants.Ehub_Rest_API+"sourceMonitoring/getMetaData";
    return this._httpClient.get(apiUrl).pipe(
      retry(0), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }
   /** Sources API List ends */

     /**errorBubble Chart API List start */
    /* purpose: Get bubble chart data
     * created: 6-Dec-2019
     * author: Amritesh
    */
   getErrorBubbleData():Observable<any>{
    var apiUrl = AppConstants.Ehub_Rest_API+"sourceMonitoring/getErrorData?dateLimit=30";
    return this._httpClient.get(apiUrl).pipe(
      retry(0), // retry a failed request up to 0 times
      catchError(this.handleError) // then handle the error
    );
  }
   /**getSparklineDataBySourceAndDatelimit Chart API List ends */
    /**getSparklineDataBySourceAndDatelimit Chart API List start */
    /* purpose: Get bubble chart data
     * created: 6-Dec-2019
     * author: Amritesh
    */
   getSparklineDataBySourceAndDatelimit(sourceId,dataLimit):Observable<any>{
    var apiUrl = AppConstants.Ehub_Rest_API+"sourceMonitoring/getSparklineDataBySourceAndDatelimit?dateLimit="+dataLimit+"&source_id="+sourceId;
    return this._httpClient.get(apiUrl).pipe(
      retry(0), // retry a failed request up to 0 times
      catchError(this.handleError) // then handle the error
    );
  }
   /**getSparklineDataBySourceAndDatelimit Chart API List ends */

   /**getSparklineDataBySourceAndDatelimit Chart API List ends */
    /**getJurisdictionList API List start */
    /* purpose: getJurisdictionList
     * created: 10-Dec-2019
     * author: Amritesh
    */
   getItemList(itemByType):Observable<any>{
    var apiUrl = AppConstants.Ehub_Rest_API+"listManagement/getListItemsByListType?listType="+itemByType;
    return this._httpClient.get(apiUrl).pipe(
      retry(0), // retry a failed request up to 0 times
      catchError(this.handleError) // then handle the error
    );
  }
}
