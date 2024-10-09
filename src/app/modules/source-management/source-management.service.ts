import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { AppConstants } from '../../app.constant';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SourceManagementService {

  constructor(private httpClient:HttpClient){}

  /* purpose: Update source
	 * created: 7th April 2019
	 * author: karnakar
	 */
  getClassificationsForScource(){
    return this.httpClient.get(AppConstants.Ehub_Rest_API + "classification/getClassifications").pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  /* purpose: Update source
	 * created: 12th April 2019
	 * params: params(object)
	 * author: karnakar
	 */
  getAllSourcesData(params): any {
    return this.httpClient.post(AppConstants.Ehub_Rest_API +"sourceCredibility/getSources?recordsPerPage="+params.recordsPerPage+"&pageNumber="+params.pageNumber+"&classificationId="+params.classificationId+"&orderBy="+
    params.orderBy+"&orderIn="+params.orderIn+"&subSlassificationId="+
    params.subSlassificationId+"&visible="+params.visible,[],httpOptions).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  /* purpose: Update source
	 * created: 16th April 2019
	 * params: params(object)
	 * author: karnakar
	 */
  updateScource(params){
    return this.httpClient.post(AppConstants.Ehub_Rest_API + "sourceCredibility/updateSource",params).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  /* purpose: Add new source
	 * created: 16th April 2019
	 * params: params(object)
	 * author: karnakar
	 */
  addNewSourceAPI(data){
    return this.httpClient.post(AppConstants.Ehub_Rest_API + "sourceCredibility/saveGeneralSource", data).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  /////////////////////========= Get source API's start for industry,domain,jurisdiction and media ============= /////////////////////

  /* purpose: get source industry list details
	 * created: 16th April 2019
	 * params: params(object)
	 * author: karnakar
	*/
  getSourceIndustryList(){
    return this.httpClient.get(AppConstants.Ehub_Rest_API + "sourceIndustry/getSourceIndustry").pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  /* purpose: get source domain list details
	 * created: 16th April 2019
	 * params: params(object)
	 * author: karnakar
	*/
  getSourceDomainList(){
    return this.httpClient.get(AppConstants.Ehub_Rest_API + "sourceDomain/getSourceDomain").pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  /* purpose: get source jurisdiction list details
	 * created: 16th April 2019
	 * params: params(object)
	 * author: karnakar
	*/
  getSourceJurisdictionList(){
    return this.httpClient.get(AppConstants.Ehub_Rest_API + "sourceJurisdiction/getSourceJurisdiction").pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  /* purpose: get source media list details
	 * created: 16th April 2019
	 * params: params(object)
	 * author: karnakar
	*/
  getSourceMediaList(){
    return this.httpClient.get(AppConstants.Ehub_Rest_API + "sourceMedia/getSourceMedia").pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  /////////////////////========= Get source API's end for industry,domain,jurisdiction and media ============= /////////////////////

  /////////////////////========= save source API's start for industry,domain,jurisdiction and media ============= /////////////////////

  /* purpose: save Source Industry List
  * created: 3rd jan 2019
  * params: params(object)
  * author: karnakar
  */
  saveSourceIndustryList(params){
    return this.httpClient.post(AppConstants.Ehub_Rest_API + "sourceIndustry/saveSourceIndustry",params).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  /* purpose: save Source Domain List
  * created: 3rd jan 2019
  * params: params(object)
  * author: karnakar
  */
  saveSourceDomainList(params){
    return this.httpClient.post(AppConstants.Ehub_Rest_API + "sourceIndustry/saveSourceDomain",params).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  /* purpose: save Source Industry List
  * created: 3rd jan 2019
  * params: params(object)
  * author: karnakar
  */
 saveSourceJurisdictionList(params){
    return this.httpClient.post(AppConstants.Ehub_Rest_API + "sourceIndustry/saveSourceJurisdiction",params).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  /* purpose: save Source Industry List
    * created: 3rd jan 2019
    * params: params(object)
    * author: karnakar
    */
   saveSourceMediaList(params){
    return this.httpClient.post(AppConstants.Ehub_Rest_API + "sourceIndustry/saveSourceMedia",params).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
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

  /////////////////////========= save source API's end for industry,domain,jurisdiction and media ============= /////////////////////
}
