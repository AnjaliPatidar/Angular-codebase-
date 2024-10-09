import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AppConstants } from '../../app.constant';
import { throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SourceManagementService {

  public classificationId = '';
  public allSources;
  public newsSourcesResponseData;
  public newsSourcesPage = 1;
  constructor(private httpClient: HttpClient) { }

  getClassificationsForScource() {
    return this.httpClient.get(AppConstants.Ehub_Rest_API + "classification/getClassifications").pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getSourceCategories(){
    return this.httpClient.get(AppConstants.Ehub_Rest_API + "sourceCredibility/getSourceCategories").pipe(
        retry(3),
        catchError(this.handleError)
      );
  }
  // getAllSourcesData(params): any {
  //   return this.httpClient.post(AppConstants.Ehub_Rest_API + "sourceCredibility/getSources?recordsPerPage=" + params.recordsPerPage + "&pageNumber=" + params.pageNumber + "&classificationId=" + params.classificationId + "&orderBy=" +
  //     params.orderBy + "&orderIn=" + params.orderIn + "&subSlassificationId=" +
  //     params.subSlassificationId + "&visible=" + params.visible + "&token=" +
  //     AppConstants.Ehubui_token, [], httpOptions).pipe(
  //       retry(3),
  //       catchError(this.handleError)
  //     );
  // }
  getAllSourcesData(paramsIn, filterModel): any {
    var params = {
      "recordsPerPage": paramsIn.recordsPerPage,
      "pageNumber": paramsIn.pageNumber,
      // "classificationId":values.classificationId,
      "orderBy": paramsIn.orderBy ? paramsIn.orderBy : 'Source',
      "orderIn": paramsIn.orderIn ? paramsIn.orderIn : 'asc',
      "subSlassificationId": '',
      "visible": '',
    }
    let apiUrl = AppConstants.Ehub_Rest_API + "sourceCredibility/getSourcesNew?recordsPerPage=" + params.recordsPerPage + "&pageNumber=" + params.pageNumber + "&classificationId=" + this.classificationId + "&orderBy=" +
      params.orderBy + "&orderIn=" + params.orderIn + "&subSlassificationId=" +
      params.subSlassificationId + "&visible=" + params.visible;
    return this.httpClient.post(apiUrl, { filterModel: filterModel }, httpOptions).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  getAllSourcesDataNews(paramsIn): any {
    return this.getDomainSourcesData(paramsIn, "mc");
  }
  getAllSourcesDataOther(paramsIn): any {
    return this.getDomainSourcesData(paramsIn, "cc");
  }

  getDomainSourcesData(paramsIn, sourceType): any {
    let filterModel = this.formatFilters(JSON.parse(paramsIn.filterModel)).length == 0 ? [{"columnName":"jurisdiction","filter":"US"}] :  this.formatFilters(JSON.parse(paramsIn.filterModel));

    let params = {"pageSize": paramsIn.recordsPerPage,"sortColumn":"jurisdiction","sortOrder":"asc","sourceType":sourceType,"filterModel": filterModel}

    if( (paramsIn.pageNumber > this.newsSourcesPage) && this.newsSourcesResponseData && this.newsSourcesResponseData.nextToken){
      params['nextToken'] = this.newsSourcesResponseData.nextToken;
    }

    if( (paramsIn.pageNumber < this.newsSourcesPage) && this.newsSourcesResponseData && this.newsSourcesResponseData.prevToken){
      params['prevToken'] = this.newsSourcesResponseData.prevToken;
    }

    let apiUrl = AppConstants.Ehub_Rest_API + "sourceCredibility/getAllSource";
    return this.httpClient.post(apiUrl, params, httpOptions).pipe(
      map(response => {
        response['paginationInformation'] =  {
            "title": "/ehubrest/api/sourceCredibility/getAllSource",
            "kind": "list",
            "totalResults": response['totalCount'] ? response['totalCount'] : 0,
            "count": 10,
            "index": 1,
            "startIndex": 2,
            "inputEncoding": "utf-8",
            "outputEncoding": "utf-8"
        };
        response['result'] = [];
        response['types'] = [];

        this.newsSourcesResponseData = response;
        this.newsSourcesPage = paramsIn.pageNumber;
        return response;
      }),
      retry(3),
      catchError(this.handleError)
    );

  }

  updateScource(params) {
    return this.httpClient.post(AppConstants.Ehub_Rest_API + "sourceCredibility/updateSource", params).pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  addNewSourceAPI(data) {
    return this.httpClient.post(AppConstants.Ehub_Rest_API + "sourceCredibility/saveGeneralSource", data).pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  addDomains(data) {
    return this.httpClient.post(AppConstants.Ehub_Rest_API + "sourceCredibility/addDomains", data).pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getDomainSearchSummaryData(limit) {
    return this.httpClient.get(AppConstants.Ehub_Rest_API + "sourceCredibility/getDomainSummary?jurisdictionLimit=" + limit).pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getSourceIndustryList() {
    return this.httpClient.get(AppConstants.Ehub_Rest_API + "sourceIndustry/getSourceIndustry").pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getSourceDomainList() {
    return this.httpClient.get(AppConstants.Ehub_Rest_API + "sourceDomain/getSourceDomain").pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getSourceJurisdictionList() {
    return this.httpClient.get(AppConstants.Ehub_Rest_API + "sourceJurisdiction/getSourceJurisdiction").pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getSourceMediaList() {
    return this.httpClient.get(AppConstants.Ehub_Rest_API + "sourceMedia/getSourceMedia").pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  saveSourceIndustryList(params) {
    return this.httpClient.post(AppConstants.Ehub_Rest_API + "sourceIndustry/saveSourceIndustry", params).pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  saveSourceDomainList(params) {
    return this.httpClient.post(AppConstants.Ehub_Rest_API + "sourceIndustry/saveSourceDomain", params).pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  saveSourceJurisdictionList(params) {
    return this.httpClient.post(AppConstants.Ehub_Rest_API + "sourceIndustry/saveSourceJurisdiction", params).pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  saveSourceMediaList(params) {
    return this.httpClient.post(AppConstants.Ehub_Rest_API + "sourceIndustry/saveSourceMedia", params).pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  };

  /* purpose: Format the filter
  * created: 27-03-2021
  * author: ASHEN
  */
  formatFilters(filterModel) {
    let keys = Object.keys(filterModel)
    let values: any = Object.values(filterModel)
    let newFilterModel = []
    for (let index = 0; index < keys.length; index++) {
      if(values[index].hasOwnProperty('condition1')){
        if(keys[index] == "jurisdiction"){
          let filterID = values[index]['condition1'] && values[index]['condition1'].filter ? values[index]['condition1'].filter.toUpperCase() : '';
          newFilterModel.push({"columnName":keys[index],"filter": filterID });
        } else {
          newFilterModel.push({"columnName":keys[index],"filter": values[index]['condition1'].filter ? values[index]['condition1'].filter : '' });
        }
      }
    }
    return newFilterModel;
  }
}
