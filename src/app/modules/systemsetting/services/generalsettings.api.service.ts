import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppConstants } from '@app/app.constant';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Theme } from '../models/system-settings/theme.model';

@Injectable({
  providedIn: 'root',
})
export class GeneralSettingsApiService {
  private saveThemeObservable = new BehaviorSubject<any>(false);
  isUserInDevMode: any;


  constructor(private httpClient: HttpClient) {}

  public behaviorSubjectForAllTagList = new BehaviorSubject<Array<any>>([]);
  behaviorSubjectForGetTagList = this.behaviorSubjectForAllTagList.asObservable();

  public behaviorSubjectForAllColorList = new BehaviorSubject({});
  behaviorSubjectForGetColorList = this.behaviorSubjectForAllColorList.asObservable();

  /*
   * @purpose: get general settings
   * @created: 9 Aug 2018
   * @params: searchString(object)
   * @return: success, error functions
   * @author: prasanthi
   */
  getGeneralSettings(): Promise<any> {
    const apiUrl = 'systemSettings/getSystemSettings';
    return this.httpClient.get(apiUrl).toPromise();
  }


  /*
   * @purpose: get QB settings
   * @created: 17 may 2022
   * @return: success, error functions
   * @author: Lanka
   */
  getSystemSettingsQB(): Promise<any> {
    const apiUrl = 'systemSettings/getSystemSettingsQB';
    return this.httpClient.get(apiUrl).toPromise();
  }


  /*
   * @purpose: get jurisdiction list
   * @created: 19 Dec 2019
   * @params: token(object)
   * @params: data(object)
   * @return: success, error functions
   * @author: Amritesh
   */
  getLanguageList(): Promise<any> {
    const apiUrl = 'listManagement/getListItemsByListType?listType=Languages';
    return this.httpClient.get(apiUrl).toPromise();
  }

  /*
   * @purpose: get List item by Type
   * @created: 27 july 2019
   * @params: token(object)
   * @params: data(object)
   * @return: success, error functions
   * @author: Amritesh
   */
  getListItemsByListType(ListType: string): Promise<any> {
    const apiUrl = 'listManagement/getListItemsByListType?listType=' + ListType;
    return this.httpClient.get(apiUrl).toPromise();
  }

  getAllWorkflowStatus(workflowKey: string): Promise<any> {
    const apiUrl = 'workflowmanagement/getAllWorkflowStatus';
    const query = { workflowKey }
    return this.httpClient.get(apiUrl, { params: query }).toPromise();
  }

  /*
   * @purpose: get List Indicator
   * @created: 2 sep 2020
   * @params: token(object)
   * @params: data(object)
   * @return: success, error functions
   * @author: Amritesh
   */
  getAllEntityIndicators(entityType: any): Promise<any> {
    const apiUrl =
      'systemSettings/indicator/getAllEntityIndicators?listType=' + entityType;
    return this.httpClient.get(apiUrl).toPromise();
  }

  /*
   * @purpose: update settings value
   * @created: 9 Aug 2018
   * @params: token(object)
   * @params: data(object)
   * @return: success, error functions
   * @author: Prasanthi
   */
  updateValue(data: any): Promise<any> {
    const apiUrl = 'systemSettings/updateSystemSettings';
    return this.httpClient.post(apiUrl, data).toPromise();
  }

  /*
   * @purpose: get color
   * @created: 27 july 2019
   * @params: token(object)
   * @params: data(object)
   * @return: success, error functions
   * @author: Amritesh
   */
  getColorList(): Promise<any> {
    const apiUrl = 'listManagement/getColors';
    return this.httpClient.get(apiUrl).toPromise();
  }

  /*
   * @purpose: get Icon list
   * @created: 27 july 2019
   * @params: token(object)
   * @params: data(object)
   * @return: success, error functions
   * @author: Amritesh
   */
  getIconList(): Promise<any> {
    const apiUrl = 'listManagement/getIcons';
    return this.httpClient.get(apiUrl).toPromise();
  }

  /*
   * @purpose: get jurisdiction list
   * @created: 27 july 2019
   * @params: token(object)
   * @params: data(object)
   * @return: success, error functions
   * @author: Amritesh
   */
  getJurisdictionList(): Promise<any> {
    const apiUrl = 'sourceJurisdiction/getSourceJurisdiction';
    return this.httpClient.get(apiUrl).toPromise();
  }

  /*
  * @purpose: delete List item by display Name
  * @created: 27 july 2019
  * @params: token(object)
  * @params: data(object)
  * @return: success, error functions
  * @author: Amritesh

  */
  addUpdateListItem(data: any): Promise<any> {
    const apiUrl = 'listManagement/saveOrUpdateListItem';
    return this.httpClient.post(apiUrl, data).toPromise();
  }

  /*
  * @purpose: delete List item by id
  * @created: 27 july 2019
  * @params: token(object)
  * @params: data(object)
  * @return: success, error functions
  * @author: Amritesh

  */
  deleteListItem(deleteItemID: any): Promise<any> {
    const apiUrl = 'listManagement/deleteListItem?listItemId=' + deleteItemID;
    return this.httpClient.delete(apiUrl).toPromise();
  }

  /*
   * @purpose: delete indictor by id
   * @created: 09 Sept 2020
   * @params: token(object)
   * @params: data(object)
   * @return: success, error functions
   * @author: Saliya
   */
  deleteIndicator(rowId: any): Promise<any> {
    const apiUrl = 'systemSettings/deleteIndicator?rowId=' + rowId;
    const data = { rowId };
    return this.httpClient.post(apiUrl, data).toPromise();
  }

  /*
   * @purpose: upload document
   * @created:23 Dec 2019
   * @params: params(object), File(object)
   * @return: success, error functions
   * @author: Amritesh
   */
  uploadCSVFilesAPI(file: any, params: any): Promise<any> {
    const apiUrl =
      'fileStorage/uploadZipFile?fileGrpName=' +
      params.fileName +
      '&zipFileName=' +
      file.name;
    const formData = new FormData();
    formData.append('uploadFile', file);
    return this.httpClient.post(apiUrl, formData).toPromise();
  }

  /*
   * @purpose: download document
   * @created: 23 Dec 2019
   * @params: params(object)
   * @return: success, error functions
   * @author: Amritesh
   */
  downloadCSVFilesAPI(params: any): Promise<ArrayBuffer> {
    const apiUrl = 'fileStorage/downloadZipFile';
    return this.httpClient
      .get(apiUrl, {
        params,
        responseType: 'arraybuffer',
      })
      .toPromise();
  }

  /*
   * @purpose: getThemeByUserId
   * @created: 8 May 2020
   * @params: token(object)
   * @return: success, error functions
   * @author: Shivasai
   */
  getThemes(params: any): Promise<Theme[]> {
    const apiUrl = 'themeBuilder/getThemesByUserId';
    return this.httpClient
      .get<Theme[]>(apiUrl, {
        params,
      })
      .toPromise<Theme[]>();
  }

  saveTheme(data: any): Promise<any> {
    const apiUrl = 'themeBuilder/saveOrUpdateTheme';
    return this.httpClient.post(apiUrl, data).toPromise();
  }

  SendsaveThemeObservable(data: any): void {
    this.saveThemeObservable.next(data);
  }

  getThemeObservable(): Observable<any> {
    return this.saveThemeObservable.asObservable();
  }

  /*
   * @purpose: delete theme by id
   * @created: 11 may 2020
   * @params: token(object)
   * @params: data(object)
   * @return: success, error functions
   * @author: shivasai
   */
  deleteThemes(deleteThemeID: any): Promise<any> {
    const apiUrl = 'themeBuilder/deleteThemeById?themeId=' + deleteThemeID;
    return this.httpClient.delete(apiUrl).toPromise();
  }

  /*
   * @purpose: get all status reasons
   * @created: 23 July 2020
   * @params: token(object)
   * @return: success, error functions
   * @author: shravani
   */
  getAllStatusReasons(data: any): Promise<any> {
    const apiUrl = 'systemSettings/getAllStatusReasons';
    return this.httpClient.post(apiUrl, data).toPromise();
  }

  /*
   * @purpose: delete status reasons
   * @created: 24 July 2020
   * @params: token(object)
   * @params: data(object)
   * @return: success, error functions
   * @author: shravani
   */
  deleteStatusReasons(data: any): Promise<any> {
    const apiUrl =
      'systemSettings/deleteStatusReason?entity_status_id=' +
      data.entity_status_id +
      '&reason_id=' +
      data.reason_id;
    return this.httpClient.post(apiUrl, data).toPromise();
  }

  /*
   * @purpose: add or update status reasons
   * @created: 24 July 2020
   * @params: token(object)
   * @params: data(object)
   * @return: success, error functions
   * @author: shravani
   */
  saveOrUpdateStatusReasons(data: any): Promise<any> {
    const apiUrl =
      'systemSettings/saveOrUpdateReason?entity_status_id=' +
      data.entity_status_id +
      '&reason_code=' +
      data.reason_code +
      '&reason=' +
      data.reason +
      '&reason_id=' +
      data.reason_id;
    return this.httpClient.post(apiUrl, data).toPromise();
  }

  /*
   * @purpose: add or update Indicator reasons
   * @created: 24 July 2020
   * @params: token(object)
   * @params: data(object)
   * @return: success, error functions
   * @author: Ram Singh
   */
  saveOrUpdateIndicator(data: any, allowUpdate: any): Promise<any> {
    const apiUrl =
      'systemSettings/saveOrUpdateIndicator?allowUpdate=' +
      allowUpdate;
    return this.httpClient.post(apiUrl, data).toPromise();
  }

  /*
   * @purpose: add or update Tenant  amnd deleteTable
   * @created: 24 July 2020
   * @params: token(object)
   * @params: data(object)
   * @return: success, error functions
   * @author: Ram Singh
   */
  crudTenantTable(data: any, url: any, del: any): Promise<any> {
    let apiUrl = '';
    if (del) {
      apiUrl = url + del;
    } else {
      apiUrl = url;
    }
    return this.httpClient.post(apiUrl, data).toPromise();
  }

  /*
   * @purpose: add or update Tenant  amnd deleteTable
   * @created: 24 July 2020
   * @params: token(object)
   * @params: data(object)
   * @return: success, error functions
   * @author: Ram Singh
   */
  getallTenantTables(): Promise<any> {
    const apiUrl = 'tanents/getAllTanentMappings';
    return this.httpClient.get(apiUrl).toPromise();
  }

  /*
   * @purpose: get List Alert Indicator
   * @created: 27 nov 2020
   * @params: token(object)
   * @params: data(object)
   * @return: success, error functions
   * @author: Upeksha
   */
  getAllEntityAlertIndicators(entityType: any): Promise<any> {
    const apiUrl =
      'systemSettings/indicator/getAllEntityIndicators?listType=' + entityType;
    return this.httpClient.get(apiUrl).toPromise();
  }

  /*
   * @purpose: delete indictor by id
   * @created: 03 December 2020
   * @params: token(object)
   * @params: data(object)
   * @return: success, error functions
   * @author: Upeksha
   */
  deleteAlertIndicator(rowId: any): Promise<any> {
    const apiUrl = 'systemSettings/indicator/deleteIndicator?rowId=' + rowId;
    const data = { rowId };
    return this.httpClient.post(apiUrl, data).toPromise();
  }

  /*
   * @purpose: add or update Alert Indicator reasons
   * @created: 27 Novemnber 2020
   * @params: token(object)
   * @params: data(object)
   * @return: success, error functions
   * @author: Upeksha
   */
  saveOrUpdateAlertIndicator(data: any, allowUpdate: any): Promise<any> {
    const apiUrl =
      'systemSettings/indicator/saveOrUpdateIndicator?allowUpdate=' +
      allowUpdate;
    return this.httpClient.post(apiUrl, data).toPromise();
  }

  getFeedClassificationData(): Promise<any> {
    const apiUrl = 'feedManagement/getAllFeedItems?isAllRequired=true';
    return this.httpClient.get(apiUrl).toPromise();
  }

  getWorkflows(): Promise<any> {
    const apiUrl = 'systemSettings/getEntityWorkflows';
    return this.httpClient.get(apiUrl).toPromise();
  }

  getEntityWorkflows(): Promise<any> {
    const apiUrl = 'systemSettings/workflow/getAllEntityWorkflows';
    return this.httpClient.get(apiUrl).toPromise();
  }

  saveEntityWorkflows(data): Promise<any> {
    const apiUrl = 'systemSettings/workflow/saveOrUpdateEntityWorkflow';
    return this.httpClient.post(apiUrl, data).toPromise();
  }

  deleteEntityWorkflow(id): Promise<any> {
    const apiUrl = 'systemSettings/workflow/deleteEntityWorkflow';
    return this.httpClient.post(apiUrl, null, { params: { 'rowId': id } }).toPromise();
  }

  validateworkflow(entityType, workflowKey): Promise<any> {
    const apiUrl = 'workflowmanagement/validateworkflow?workflowKey=' + workflowKey + '&entityType=' + entityType;
    return this.httpClient.get(apiUrl).toPromise();
  }

  getColorPickersColorsList() {
    let apiUrl = this.isUserInDevMode?
     '../../../assets/json/colors.json'
     :'assets/json/colors.json';
    return this.httpClient.get(apiUrl).toPromise();
  }

  getTagList(requestParams): Observable<any> {
    var apiUrl = AppConstants.Tag_API + "search"
    return this.httpClient.post(apiUrl, requestParams).pipe(
      retry(0),
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
      error.error.responseMessage ? error.error.responseMessage : 'Something bad happened; please try again later.');
  }
}
