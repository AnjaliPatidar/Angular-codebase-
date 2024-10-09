import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { AppConstants } from '../../../app.constant';


@Injectable()
export class EntityApiService {
  constructor(private http: HttpClient) { }
  complianceFieldsUrl(data) {
    let url =
      AppConstants.Ehub_Rest_API +
      "advancesearch/entity/fetchLinkData?identifier=" +
      data.identifier +
      "&fields=" +
      data.fields +
      "&jurisdiction=" +
      data.jurisdiction +
      "&sourceType=" +
      data.sourceType;
    var postdata = { url: data.url };
    // let i = 0;

    // for (let [key, value] of Object.entries(params)) {

    //   if (i == 0) {
    //     url = url + "?";
    //   }
    //   if (i == Object.keys(params).length - 1) {
    //     url = `${url}${key}=${value}`;

    //   }
    //   else {
    //     url = `${url}${key}=${value}&`;
    //   }
    //   i = i + 1;
    // }
    return this.http
      .post(url, postdata)
      .pipe(retry(2), catchError(this.handleError));
  }
  getOwnershipPath(params) {
    const parameter = new URLSearchParams();
    let httpHeaders = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Cache-Control", "no-cache");
    let options = {
      headers: httpHeaders,
    };
    return this.http.post(
      AppConstants.Ehub_Rest_API +
      "advancesearch/ownershipStructure?maxSubsidiarielevels=" +
      params.numnberoflevel +
      "&lowRange=" +
      params.lowRange +
      "&highRange=" +
      params.highRange +
      "&identifier=" +
      params.identifier +
      "&noOfSubsidiaries=" +
      params.noOfSubsidiaries +
      "&organisationName=" +
      params.organisationName +
      "&juridiction=" +
      params.juridiction +
      "&isSubsidiariesRequired=" +
      params.isSubsidiariesRequired +
      "&startDate=" +
      params.Start_date +
      "&endDate=" +
      params.End_date +
      (params.source ? "&source=" + params.source : "") +
      (params.sourceType ? "&sourceType=" + params.sourceType : ""),
      params.url,
      options
    );
  }
  /* @purpose: updateownership for every 30 sec
   * @created: 27th July 2018
   * @params: params(object)
   * @return: success, error functions
   * @author: Ram
   */

  getCorporateStructure(path) {
    return this.http
      .get(
        AppConstants.Ehub_Rest_API +
        "advancesearch/getCorporateStructure?path=" +
        path
      )
      .pipe(catchError(this.handleError));
  }

  getManagerData(url) {
    // https://moojvxnjvk.execute-api.eu-west-1.amazonaws.com/Prod/v1/entity-async?source=yelp.com&url=aHR0cHM6Ly93d3cueWVscC5jb20vYml6L2thZmZlZS1idXJnZXItYmVybGluP29zcT1rYWZmZWUrYnVyZ2Vy&fields=officership
    //https://moojvxnjvk.execute-api.eu-west-1.amazonaws.com/Prod/v1/entity-async?source=yelp.com&url=aHR0cHM6Ly93d3cueWVscC5jb20vYml6L2ZvZy1oYXJib3ItZmlzaC1ob3VzZS1zYW4tZnJhbmNpc2NvLTI/b3NxPWZvZytoYXJib3IrZmlzaCtob3VzZQ==&fields=officership
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  getJurisdiction() {
    let url =
      AppConstants.Ehub_Rest_API + "sourceJurisdiction/getSourceJurisdiction";
    return this.http.get(url).pipe(retry(2), catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
  }

  saveEntityAttributes(data) {
    let url = AppConstants.Ehub_Rest_API + "advancesearch/saveEntityAttributes";
    return this.http
      .post(url, data)
      .pipe(retry(2), catchError(this.handleError));
  }

  getRiskScoreData(entityId) {
    let url = AppConstants.Ehub_Rest_API + "riskScore/score/" + entityId;
    return this.http.get(url).pipe(retry(2), catchError(this.handleError));
  }
  getSourceIndustryList() {
    let url = AppConstants.Ehub_Rest_API + "sourceIndustry/getSourceIndustry";
    return this.http.get(url).pipe(retry(2), catchError(this.handleError));
  }

  saveSourceIndustryList(params) {
    let url = AppConstants.Ehub_Rest_API + "sourceIndustry/saveSourceIndustry";
    return this.http
      .post(url, params)
      .pipe(retry(2), catchError(this.handleError));
  }
  customerOutreach() {
    let apiUrl =
      AppConstants.Ehub_Rest_API +
      "entityType/customerOutreach/getEntityRequirements";
    return this.http.get(apiUrl).pipe(catchError(this.handleError));
  }
  getEntityQuestionsByEntityId(entityId, qbServeyID) {
    var apiUrl =
      AppConstants.Ehub_Rest_API +
      "advancesearch/getEntityQuestionsByEntityId?entityId=" +
      entityId +
      "&isUserBase=" +
      false +
      "&surveyId=" +
      qbServeyID;

    return this.http.get(apiUrl).pipe(catchError(this.handleError));
  }
  getGeneralSettings() {
    var apiUrl =
      AppConstants.Ehub_Rest_API + "systemSettings/getSystemSettings";
    return this.http.get(apiUrl).pipe(catchError(this.handleError));
  }
  auditLogGenerateReport(data) {
    var apiUrl =
      AppConstants.Ehub_Rest_API +
      "audit/auditLogForGeneratedReport?entityId=" +
      data.identifier +
      "&entityName=" +
      data.name;
    return this.http.get(apiUrl).pipe(catchError(this.handleError));
  }
  getAllSignificantNews(params) {
    var apiUrl =
      AppConstants.Ehub_Rest_API +
      "significantArticles/getAllSignificantNews?entityId=" +
      params.identifier;
    return this.http.post(apiUrl, params).pipe(catchError(this.handleError));
  }
  /*
  /*
   * purpose: DElete the shareholder added to the company
   * created: 9 jan 2019
   * params:no params
   * return: success, error functions
   * author: Ram singh
   */
  deleteCustomEntites(query) {
    var apiUrl =
      AppConstants.Ehub_Rest_API +
      "advancesearch/deleteCustomEntity/" +
      query.identifier +
      "?field=" +
      query.field;
    return this.http.delete(apiUrl).pipe(catchError(this.handleError));
  }
  /* purpose:Add custom  Officer */
  /*created: 17 november 2019*/
  /*author: Ram*/
  saveUpdateEntityOfficer(data) {
    var apiUrl = AppConstants.Ehub_Rest_API + "advancesearch/customKeyManager";
    return this.http.put(apiUrl, data).pipe(catchError(this.handleError));
  }

  /* purpose: get the complex strcture*/
  /*created: 26-nov-2019*/
  /*author: Ram*/
  getComplexStructureOnRefresh(paramData) {
    var apiUrl =
      AppConstants.Ehub_Rest_API +
      "entityComplexStructure/getEntityComplexStructure?entityId=" +
      paramData.entityId +
      "&entitySource=" +
      paramData.entitySource +
      "&entityName=" +
      paramData.entityName;
    return this.http.get(apiUrl).pipe(catchError(this.handleError));
  }
  /* purpose: update the complex structure */
  /*created:26 nov 2019*/
  /*author: Ram*/
  updateComplexStructureAPI(paramData) {
    var apiUrl =
      AppConstants.Ehub_Rest_API +
      "entityComplexStructure/saveOrUpdateEntityComplexStructure?entityName=" +
      paramData.entityName +
      "&entityId=" +
      paramData.entityId +
      "&entitySource=" +
      paramData.entitySource +
      "&isComplexStructure=" +
      paramData.isComplexStructure;
    return this.http.post(apiUrl, paramData).pipe(catchError(this.handleError));
  }
  /*
   * @purpose: Get EntityResolved using the multi-source V2 version
   * @created: 26 jul 2017
   * @params: data(object)
   * @return: success, error functions
   * @author: Ram Singh
   */
  getEntityResolvedV2(data) {
    var apiUrl =
      AppConstants.Ehub_Rest_API +
      "advancesearch/entity/multisource?query=" +
      encodeURIComponent(data.keyword) +
      (data.jurisdiction ? "&jurisdiction=" + data.jurisdiction : "") +
      (data.website ? "&website=" + data.website : "");
    return this.http.get(apiUrl).pipe(catchError(this.handleError));
  }
  /*
   * @purpose: getEntityDataByTextId
   * @created: 26 jul 2017
   * @params: data(object)
   * @return: success, error functions
   * @author: sandeep
   */
  getEntityDataByTextId(data) {
    var apiUrl =
      AppConstants.Ehub_Rest_API + "search/getData?searchFlag=search";
    return this.http.post(apiUrl, data).pipe(catchError(this.handleError));
  }

  /*
   * @purpose: getEntityDataByTextId
   * @created: 26 jul 2017
   * @params: data(object)
   * @return: success, error functions
   * @author: sandeep
   */
  selectEntity(data) {
    var apiUrl = AppConstants.Ehub_Rest_API + "advancesearch/selectEntityByUrl";
    return this.http.post(apiUrl, data).pipe(catchError(this.handleError));
  }

  /*
   * @purpose: to load the local json files based on entity Id
   * @created: 1 june 2020
   * @params: data(path)
   * @return: success, error functions
   * @author: shravani
   */
  public getLocalJSON(path): Observable<any> {
    return this.http.get(path);
  }

  /*
   * @purpose: getEntityDataByTextId
   * @created: 26 jul 2017
   * @params: data(object)
   * @return: success, error functions
   * @author: sandeep
   */

  searchPersonMultisource(data) {
    let params = "";
    params += data.jurisdiction ? "&jurisdiction=" + data.jurisdiction : "";
    params += data.entityID ? "&entityId=" + data.entityID : "";

    var apiUrl =
      AppConstants.Ehub_Rest_API +
      "advancesearch/entity/personMultisource?query=" + encodeURIComponent(data.query);

    return this.http.get(apiUrl).pipe(
      retry(0), // retry a failed request up to 0 times
      catchError(this.handleError) // then handle the error
    );
  }

  /*
   * @purpose: getEntityDataByTextId
   * @created: 26 jul 2017
   * @params: data(object)
   * @return: success, error functions
   * @author: sandeep
   */
  getRequestIdforscreening(data, mainEntityId) {
    const date = new Date().toLocaleDateString();
    let params = `mainEntityId=${mainEntityId}&startDate=${date}&endDate=${date}`;

    var apiUrl =
      AppConstants.Ehub_Rest_API +
      "advancesearch/getRequestIdOfPersonScreening?" + params;
    // var apiUrl =  "assets/json/screeningResquestid.json";
    return this.http.post(apiUrl, data).pipe(
      retry(0), // retry a failed request up to 0 times
      catchError(this.handleError) // then handle the error
    );
  }
  /*
   * @purpose: getEntityDataByTextId
   * @created: 26 jul 2017
   * @params: data(object)
   * @return: success, error functions
   * @author: sandeep
   */
  getscreeningDatabyRequestId(data) {
    // var apiUrl = "assets/json/screenedEntity.json";
    var apiUrl =
      AppConstants.Ehub_Rest_API + "advancesearch/getPersonEntitiesScreening";

    return this.http
      .get(apiUrl, {
        params: data,
      })
      .pipe(
        retry(0), // retry a failed request up to 0 times
        catchError(this.handleError) // then handle the error
      );
  }

  /*
   * @purpose: Get Person Recommendations from various sources
   * @created: 07 december 2020
   * @params: name(string)
   * @return: success, error functions
   * @author: charith wickramasinghe
   */
  getPersonRecommendations(name: string) {
    const apiUrl =
      AppConstants.Ehub_Rest_API + "user/getUserRecommendations?name=" + name;
    return this.http.get(apiUrl).pipe(
      retry(0), // retry a failed request up to 0 times
      catchError(this.handleError) // then handle the error
    );
  }

  /*
   * @purpose: get entity search misspelling data
   * @created: 12-11-2021
   * @params: data(object)
   * @return: success, error functions
   * @author: Ashen
   */

  suggestedEntityNames(data) {
    let params = "";
    params += data.jurisdiction ? "&jurisdiction=" + data.jurisdiction : "";
    params += "&lang=en"

    var apiUrl =
      AppConstants.Ehub_Rest_API +
      "advancesearch/entity/suggestedEntityNames?query=" +
      encodeURIComponent(data.query) + params;

    return this.http.get(apiUrl).pipe(
      retry(0), // retry a failed request up to 0 times
      catchError(this.handleError) // then handle the error
    );
  }
}
