import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AppConstants } from '../../app.constant';
import { Observable, throwError, BehaviorSubject, Subject } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { AlertFeed, UpdateFeedParams } from './models/feed-model';
import { AlertViewUtility } from './nested-views/alert-view/alert-view.utility';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AlertManagementService {
  isUserInDevMode = isDevMode();
  public assigneList = [];
  public nextPrevTableData = [];
  private filter: any = JSON.stringify({});
  private totalAlertCount: number = 0;
  private orderIn: any = "";
  private orderBy: any = "";
  currentPage: number = 0;
  public isRelatedAlertClicked :boolean;

  constructor(private _httpClient: HttpClient) { }

  public getRowDataWhenUpdatedObservable = new BehaviorSubject('');
  public getRowDataWhenUpdatedObserver = this.getRowDataWhenUpdatedObservable.asObservable();

  public getUpdatedCommentCountObservable = new BehaviorSubject('');
  public getUpdatedCommentCount = this.getUpdatedCommentCountObservable.asObservable();

  public getAlertRiskIndicatorsObservable = new BehaviorSubject([]);
  public getAlertRiskIndicators = this.getAlertRiskIndicatorsObservable.asObservable();
  public getTableCurrentPageObservable = new BehaviorSubject(0);
  public getTableCurrentPageObserver = this.getTableCurrentPageObservable.asObservable();

  public getTableRowsCountObservable = new BehaviorSubject<number>(10);
  public getTableRowsCountObserver = this.getTableRowsCountObservable.asObservable();
  public getReleatedAlertRowCountObservable = new BehaviorSubject(0);
  public getReleatedAlertRowCountPageObserver = this.getReleatedAlertRowCountObservable.asObservable();

  public getRelatedAlertObservable = new BehaviorSubject([]);
  public getRelatedAlert = this.getRelatedAlertObservable.asObservable();

  public getStatusObservable = new BehaviorSubject([]);
  public getStatusObserver = this.getStatusObservable.asObservable();

  public getGridreadyApiObservable = new BehaviorSubject('');
  public getGridreadyApiObserver = this.getGridreadyApiObservable.asObservable();

  public onGridDataReadyObservable = new Subject<any>();
  public onGridDataReadyObserver = this.onGridDataReadyObservable.asObservable();
  
  private getWatchlistTabObservable = new BehaviorSubject(null);
  private getGeneralTabObservable = new BehaviorSubject(null);
  private getAlertExtraDataObservable = new BehaviorSubject(null);
  private getCustomerTabObservable = new BehaviorSubject(null);

  getWatchlistData() {
    return this.getWatchlistTabObservable.asObservable()
  }

  setWatchlistData(data, selectedHit) {
    let watchlistData = AlertViewUtility.filterWatchlistData(data, selectedHit)
    this.getWatchlistTabObservable.next(watchlistData)
  }

  getGeneralAttributesData() {
    return this.getGeneralTabObservable.asObservable()
  }

  setGeneralAttributesData(data) {
    let generalAttrData = AlertViewUtility.filterGeneralAttributesData(data)
    this.getGeneralTabObservable.next(generalAttrData)
  }

  getAlertExtraData() {
    return this.getAlertExtraDataObservable.asObservable()
  }

  setAlertExtraData(data) {
    let extraData = AlertViewUtility.setAlertDetails(data)
    this.getAlertExtraDataObservable.next(extraData)
  }
  
  getCustomerData() {
    return this.getCustomerTabObservable.asObservable()
  }

  setCustomerData(data) {
    let customerData = AlertViewUtility.filterCustomerInformationData(data)
    this.getCustomerTabObservable.next(customerData)
  }

  //  reset uniform alertcard data
  resetUniformAlertCardData() {
    this.getWatchlistTabObservable.next(null)
    this.getGeneralTabObservable.next(null);
    this.getAlertExtraDataObservable.next(null);
    this.getCustomerTabObservable.next(null);
  }

  private getSelectedAlertCard = new BehaviorSubject<any>(null);
  public getSelectedAlertCardObserver = this.getSelectedAlertCard.asObservable();

  sendUpdatedCommentCount(data) {
    this.getUpdatedCommentCountObservable.next(data);
  }

  sendRowDataToOtherComponent(data) {
    this.getRowDataWhenUpdatedObservable.next(data);
  }

  sendCurrentTablePageCount(data) {
    this.getTableCurrentPageObservable.next(data);
  }

  sendReleatedAlertRowCount(data) {
    this.getReleatedAlertRowCountObservable.next(data);
  }

  sendCurrentTableRowsCount(data: number) {
    this.getTableRowsCountObservable.next(data);
  }

  clearTableData() {
    this.nextPrevTableData = [];
  }

  sendGridReadyApiParams(data) {
    this.getGridreadyApiObservable.next(data);
  }

  /** When grid has data */
  sendGridDataReadyApiParams(data) {
    this.onGridDataReadyObservable.next(data);
  }

  /* purpose: following setters & getters for next & previous button issue (AP-2061)
  * created: 10-Jan-2021
  * author: Sarmilan
  */
  get getTableData(): any {
    return this.nextPrevTableData;
  }

  set setTableData(data: any) {
    this.nextPrevTableData.push(data);
  }

  get getfilter(): any {
    return this.filter;
  }

  set setFilter(data: any) {
    this.filter = data;
  }

  get getOrderIn(): any {
    return this.orderIn;
  }

  set setOrderIn(data: any) {
    this.orderIn = data;
  }

  get getOrderBy(): any {
    return this.orderBy;
  }

  set setOrderBy(data: any) {
    this.orderBy = data;
  }

  get getTotalAlertCount(): number {
    return this.totalAlertCount;
  }

  set setTotalAlertCount(count: number) {
    this.totalAlertCount = count;
  }

  /* purpose: Format the filter for Next & Previous Button (AP-2061)
  * created: 11-Jan-2021
  * author: Sarmilan
  */
  formatFilters(filterModel) {
    let keys = Object.keys(filterModel)
    let values: any = Object.values(filterModel)
    let newFilterModel = {}
    for (let index = 0; index < keys.length; index++) {
      if (values[index]['filterType'] == 'text' && values[index]['type'] == 'inRange') {
        values[index]['filter'] = values[index]['filter'].split("-").join("#");
      }
      if (values[index]['type'] == 'between date') {
        values[index]['filterType'] = 'date';
      }
      if (Object.keys(values[index]).indexOf("condition1") == -1) {
        newFilterModel[keys[index]] = { 'condition1': values[index] }
      }
      else {
        newFilterModel[keys[index]] = values[index]
      }
    }
    return newFilterModel;
  }

  getPermissionIds(): Observable<any> {
    let path = this.isUserInDevMode ? '../../../assets/json/permissonsMapping.json' : 'assets/json/permissonsMapping.json';
    return this._httpClient.get(path).pipe(map(res => {
      return res[0]['alertManagement'];
    }));
  }

  getPermissionIdsSourceMoniting(): Observable<any> {
    let path = this.isUserInDevMode ? '../../../assets/json/permissonsMapping.json' : 'assets/json/permissonsMapping.json';
    return this._httpClient.get(path).pipe(map(res => {
      return res[0];
    }));
  }

  getAllTabsData(): Observable<any> {
    var apiUrl = "https://jsonplaceholder.typicode.com/posts";
    return this._httpClient.get(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: Get list data for each list type
  * created: 23-Aug-2019
  * author: karnakar
  */
  getListDataForEachType(type): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "listManagement/getListItemsByListType?listType=" + type;
    return this._httpClient.get(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: Entity Auditing
  * created: 23-Aug-2019
  * author: karnakar
  */
  auditingOfEntityAccordingToEntityName(params): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "";
    return this._httpClient.get(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: Search Feed
  * created: 23-Aug-2019
  * author: karnakar
  */
  getColorsList(): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "listManagement/getColors"
    return this._httpClient.get(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose:get user list by group
   * created: 30-sep-2019
   * author: Amritesh
   */
  getUsersListByGroups(groupId): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "groups/listUsersByGroup?groupId=" + groupId
    return this._httpClient.get(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  getUsersListByGroupsByPage(groupId, pageno, recscount): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "groups/listUsersByGroup?groupId=" + groupId+"&recordsPerPage="+recscount+"&pageNumber="+pageno
    return this._httpClient.get(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: Search Feed
    * created: 23-Aug-2019
    * author: karnakar
    */
  getAllGroupList(): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "groups/groupList"
    return this._httpClient.get(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: Get list of users by multiple group levels (bulk operations)
  * created: 23-Nov-2019
  * author: karnakar
  */
  getListOfUserByMultipleGroupLevels(data): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "groups/listUsersByGroupsList"
    return this._httpClient.post(apiUrl, data, httpOptions).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: Get All Alerts
  * created: 23 sep 2019
  * author: Amritesh
  */
  getAlertList(requestParams, filterModel): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "alertManagement/getAlerts?pageNumber=" + requestParams.pageNumber + "&recordsPerPage=" + requestParams.recordsPerPage + "&orderIn=" + requestParams.orderIn + "&orderBy=" + requestParams.orderBy + "&isAllRequired=" + requestParams.isAllRequired
    return this._httpClient.post(apiUrl, {
      'filterModel': filterModel
    }).pipe(
      map(res=>{
        res['result'].map(element=>{
          element.alertMetaData = JSON.parse(element.alertMetaData);
          element.alertMetaData.name = element.alertMetaData.name ? element.alertMetaData.name : element.alertMetaData.primary_name;
          element.alertMetaData.results.screening.watchlists = element.alertMetaData.results.screening.watchlists.map(el => {
            return {
              ...el,
              value: el.basic_info.primary_name,
              basic_info: {
                id: el.id ? el.id : el.record_id,
                descriptions: el.basic_info.descriptions ? el.basic_info.descriptions : (el.entries && el.entries[0] && el.entries[0].classification ? el.entries[0].classification : ''),
                ...el.basic_info
              }
            }
          });
          element.alertMetaData = JSON.stringify(element.alertMetaData);
        });
        return res;
      }),
      retry(0),
      catchError(this.handleError)
    );
  }
  // get alert by customer and alertId
  getAlertByCIdAId(requestParams, filterModel): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "alertManagement/getAlertForEntity?pageNumber=" + requestParams.pageNumber + "&recordsPerPage=" + requestParams.recordsPerPage + "&orderIn=" + requestParams.orderIn + "&orderBy=" + requestParams.orderBy + "&isAllRequired=" + requestParams.isAllRequired
    return this._httpClient.post(apiUrl, {
      'filterModel': filterModel
    }).pipe(
      map(res=>{
        res['result'].map(element=>{
          element.alertMetaData = JSON.parse(element.alertMetaData);
          element.alertMetaData.name = element.alertMetaData.name ? element.alertMetaData.name : element.alertMetaData.primary_name;
          element.alertMetaData.results.screening.watchlists = element.alertMetaData.results.screening.watchlists.map(el => {
            return {
              ...el,
              value: el.basic_info.primary_name,
              basic_info: {
                id: el.id ? el.id : el.record_id,
                descriptions: el.basic_info.descriptions ? el.basic_info.descriptions : (el.entries && el.entries[0] && el.entries[0].classification ? el.entries[0].classification : ''),
                ...el.basic_info
              }
            }
          });
          element.alertMetaData = JSON.stringify(element.alertMetaData);
        });
        return res;
      }),
      retry(0),
      catchError(this.handleError)
    );
  }

  getStatus(): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "listManagement/getListItemsByListType"
    return this._httpClient.get(apiUrl, { params: { listType: 'Alert Status' } }).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  // get all the states of a given work flow: used in alert workflow
  // lanka
  // 2022/03/07
  getStatus_new(workflow): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "workflowmanagement/getAllWorkflowStatus"
    return this._httpClient.get(apiUrl, { params: { workflowKey: workflow } }).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  // get all the posible states of a work flow for a given current state: used in alert workflow
  // lanka
  // 2022/03/07
  getPosibleStatus_new(alertId,currentState,workflowKey): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "workflowmanagement/getNextAvailableStatuses"
    return this._httpClient.get(apiUrl,
      {
        params: {
          entityId: alertId,
          currentStatus: currentState,
          workflowKey: workflowKey
        }
      }).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  // Update the Status of a alert
  // lanka
  // 2022/03/07
  updateAlertStatus_new(params): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "alertManagement/workflow/switch-alert-status"
    return this._httpClient.put(apiUrl, params).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: save and update alerts
    * created: 24-sep-2019
    * author: Amritesh
    */
  saveOrUpdateAlerts(params, bulkType): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "alertManagement/saveOrUpdateAlerts?bulkType=" + bulkType;
    return this._httpClient.post(apiUrl, params, httpOptions).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: save Or Update Comments In Alert table
   * created: 7-oct-2019
   * author: Amritesh
   */
  saveOrUpdateCommentsInAlertTable(params): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "alertManagement/saveOrUpdateAlertComments";
    return this._httpClient.post(apiUrl, params, httpOptions).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose:upload document as a proof in alert comment.
  * created: 10 oct 2019
  * author: Amritesh
  */
  uploadDocumentForProof(params, data): Observable<any> {
    let fm = new FormData();
    fm.append('uploadFile', data);

    var apiUrl = AppConstants.Ehub_Rest_API + "documentStorage/uploadDocument?fileTitle=" + params.fileTitle + "&remarks=" + params.remarks + "&docFlag=" + params.docFlag + "&entityId=" + params.entityId;
    return this._httpClient.post(apiUrl, fm).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: Get Past Due Alerts in KPI alerts management
  * created: 16 oct 2019
  * author: Amritesh
  */
  getPastDueAlerts(): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "alertManagement/getPastDueAlerts";
    return this._httpClient.get(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: Get My Alerts in KPI alerts management
  * created: 16 oct 2019
  * author: Amritesh
  */
  getMyAlerts(): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "alertManagement/getMyAlerts";
    return this._httpClient.get(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: Get Associated Alerts in KPI alerts management
     * created: 16 oct 2019
     * author: Amritesh
     */
  getAssociatedAlerts(): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "alertManagement/getAssociatedAlerts";
    return this._httpClient.get(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: Get Comments List
  * created: 9 oct 2019
  * author: Amritesh
  */
  getCommentsListByAlertID(alertId): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "alertManagement/getAlertCommentsByAlertId?alertId=" + alertId;
    return this._httpClient.get(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: Get Comments List
 * created: 22 oct 2019
 * author: Amritesh
 */
  getListItems(status): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "listManagement/getListItemsByListType?listType=" + status
    return this._httpClient.get(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: Get RightPanel Data
  * created: 11 oct 2019
  * author: Amritesh
  */
  RightPanelAlertData(data): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "audit/getLogsByTypeId?type=" + data.type + "&typeId=" + data.typeId;
    return this._httpClient.post(apiUrl, data, httpOptions).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  RightPanelUserData(data): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "audit/getLogsByTitleAndTypeId?title=" + data.title + "&typeId=" + data.typeId;
    return this._httpClient.post(apiUrl, data, httpOptions).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: Add comment
  * created:10 oct 2019
  * author: karnakar
  */
  addComment(params): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "alertManagement/saveOrUpdateAlertComments";
    return this._httpClient.post(apiUrl, params, httpOptions).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: download content doc
  * created: 17 oct 2019
  * author: Amritesh
  */
  downloadContent(params: any): Observable<ArrayBuffer> {
    const url =
      AppConstants.Ehub_Rest_API +
      'documentStorage/downloadDocument?docId=' + params.docId + '&source=' + params.source + '&path=' + params.path;
    return this._httpClient
      .get(url, { responseType: 'arraybuffer' })
      .pipe(retry(1), catchError(this.handleError));
  }

  /* purpose: Update comment
  * created: 29th May 2019
  * author: karnakar
  */
  updateComment(params): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "";
    return this._httpClient.get(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: Entity Auditing
  * created: 23-Aug-2019
  * author: karnakar
  */
  getAlertReviewerStatusList(type): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "listManagement/getListItemsByListType?listType=" + type;
    return this._httpClient.get(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: Get Feed List
  * created: 23-Aug-2019
  * author: karnakar
  */
  getFeedList(): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "feedManagement/getAllFeedItems?isAllRequired=" + true;
    return this._httpClient.get(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: Get group level By feed ID
  * created: 19-sep-2019
  * author:Amritesh
  */
  getGroupLevelByFeedId(feedManagementId): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "feedManagement/getFeedItemById?feedManagementID=" + feedManagementId;
    return this._httpClient.get(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: create Feed
  * created: 23-Aug-2019
  * author: karnakar
  */
  saveOrUpdateFeed(params: UpdateFeedParams): Observable<AlertFeed> {
    const apiUrl = AppConstants.Ehub_Rest_API + 'feedManagement/saveOrUpdateFeedItem';

    return this._httpClient.post<AlertFeed>(apiUrl, params, httpOptions).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: Search Feed
  * created: 23-Aug-2019
  * author: karnakar
  */
  searchFeed(params): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "";
    return this._httpClient.get(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: Delete Feed
  * created: 23-Aug-2019
  * author: karnakar
  */
  deleteFeed(feedId): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "feedManagement/deleteFeedItem?feedID=" + feedId;
    return this._httpClient.delete(apiUrl).pipe(
      retry(1),
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
  };

  getAlertsFromServer(id) {
    var apiUrl = AppConstants.Ehub_Rest_API + 'alertManagement/createNewAlerts?requestId=' + id;
    return this._httpClient.post(apiUrl, {}).pipe(
      retry(0), catchError(this.handleError)
    );
  }

  getAssigneeListBasedOnFeed(params: any): Observable<any> {
    if (params && params.feedID) {
      var apiUrl = AppConstants.Ehub_Rest_API + "feedManagement/getUsersByFeed?feedManagementID=" + params.feedID + "&isAllRequired=" + false;
    }
    else {
      var apiUrl = AppConstants.Ehub_Rest_API + "feedManagement/getUsersByFeed?isAllRequired=" + true;
    }
    return this._httpClient.get(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: Audit bulk data
   * created: 25-November-2019
   * author: kamal
   */
  getAlertAuditBulkData(): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "audit/getLogsByTypeAndSubtype?type=Alert Management&subType=Bulk Operation";
    return this._httpClient.post(apiUrl, {}).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /* purpose: get user feeds
  * created: march 10 2020
  * author: kamal
  */
  getUserFeeds(userId) {
    var apiUrl = AppConstants.Ehub_Rest_API + "feedManagement/getFeedsByUser";
    return this._httpClient.get(apiUrl, { params: { userId: userId } }).toPromise();
  }

  multiSource(data) {
    var apiUrl = AppConstants.Ehub_Rest_API + "advancesearch/entity/multisource?query=" + encodeURIComponent(data.query) + "&jurisdiction=" + data.jurisdiction;
    return this._httpClient.get(apiUrl).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  companyVladata(params) {
    var apiUrl = AppConstants.Ehub_Rest_API + "advancesearch/getCompanyVLAData";
    return this._httpClient.get(apiUrl, { params: params }).toPromise();
  }

  coreKbVlaData(params) {
    var apiUrl = AppConstants.Ehub_Rest_API + "advancesearch/getCoreKBVLAData";
    return this._httpClient.get(apiUrl, { params: params }).toPromise();
  }

  shareHolderData(params) {
    var apiUrl = AppConstants.Ehub_Rest_API + "alertManagement/getSubGraphVla?field=" + "shareholders" + "&parentId=" + params.parentId + "&levels=" + params.levels + "&entityId=" + params.entityId + "&request_id=" + params.requestId;
    return this._httpClient.get(apiUrl).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  postSSBScreeningData(data, screeningId) {
    var apiUrl = AppConstants.Ehub_Rest_API + "alertManagement/postSSBScreeningData?id=" + screeningId;
    return this._httpClient.post(apiUrl, data).toPromise();
  }

  /*
    @purpose: to find the relation type of bag of entities to map with news articles
  * @created: 24 september, 2020
  * @returns:  entities and relationship of the entitiy
  * @author: Saliya
  */
  getScreeningEntitiesBag(params, data) {
    let apiUrl = AppConstants.Ehub_Rest_API + 'alertManagement/getScreeningEntitiesBag'
    return this._httpClient.post(apiUrl, data, {
      params: params
    }).toPromise();
  }

  getSSBScreeningData(screeningId) {
    var apiUrl = AppConstants.Ehub_Rest_API + "alertManagement/getSSBScreeningData?id=" + screeningId;
    return this._httpClient.get(apiUrl).toPromise();
  }
  getarticleList(data) {
    var apiUrl = AppConstants.Ehub_Rest_API + "entity/getArticles";
    return this._httpClient.post(apiUrl, data).toPromise();
  }
  getarticleDetail(data) {
    var apiUrl = AppConstants.Ehub_Rest_API + "entity/getArticle";
    return this._httpClient.post(apiUrl, data).toPromise();
  }

  /* @purpose: To translate an Article into different language
  * @created: 11 september, 2020
  * @returns:  objrct with data that contains article that are translated into selected language
  * @author:Sarvani Harshita*/
  getTranslatedArticle(article) {
    var apiUrl = AppConstants.Ehub_Rest_API + "entity/getTranslatedArticle?article=" + article;
    return this._httpClient.get(apiUrl).toPromise();
  }

  getJurisdictionbycountryname(country) {
    var apiUrl = AppConstants.Ehub_Rest_API + "listManagement/getListItemsByListTypeAndDisplayName?listType=Jurisdictions&displayName=" + country;
    return this._httpClient.get(apiUrl).toPromise();
  }

  changeSentimentsstatus(data) {
    var apiUrl = AppConstants.Ehub_Rest_API + "significantArticles/saveSignificantArticles";
    return this._httpClient.post(apiUrl, data).toPromise();
  }

  /* purpose: Get list data for each list type
 * created: 23-Aug-2019
 * author: karnakar
 */
  getUserListing() {
    var apiUrl = AppConstants.Ehub_Rest_API + "usersNew/getUserListing?status=989";
    return this._httpClient.get(apiUrl).toPromise();
  }

  updateEntityStatusReason(data) {
    var apiUrl = AppConstants.Ehub_Rest_API + "entity/updateEntityStatusReason";
    return this._httpClient.post(apiUrl, data).toPromise();
  }

  getListItemsByListType(ListType) {
    ListType = [null, undefined, ""].includes(ListType) ? 'Article Classifications' : ListType;
    let apiUrl = AppConstants.Ehub_Rest_API + 'listManagement/getListItemsByListType?listType=' + ListType;
    return this._httpClient.get(apiUrl).toPromise();
  }

  storeArticleFeedback(data) {
    let apiUrl = AppConstants.Ehub_Rest_API + 'entity/storeArticleFeedback';
    return this._httpClient.post(apiUrl, data).toPromise();
  }

  initiateScreeingBag(params, data) {
    let apiUrl = AppConstants.Ehub_Rest_API + 'alertManagement/initiateScreeningEntitiesBag';
    return this._httpClient.post(apiUrl, data, {
      params: params
    }).toPromise();
  }

  updateStatusArticle(data) {
    let apiUrl = AppConstants.Ehub_Rest_API + 'entity/updateEntityStatusReason';
    return this._httpClient.post(apiUrl, data).toPromise();
  }

  /* purpose:get ALL active user list
    * created:18 May 2020
    * author: Amritesh
    */
  getRequesterAPI(isAllRequired: boolean = true) {
    // var apiUrl = AppConstants.Ehub_Rest_API + "usersNew/getUsers?isAllRequired=true";
    const apiUrl = AppConstants.Ehub_Rest_API + 'usersNew/getActiveUsers?isAllRequired=' + isAllRequired;
    return this._httpClient.post(apiUrl, '', httpOptions).pipe(
      retry(0),
      catchError(this.handleError)
    ).toPromise();
  }

  /* @purpose: To get the list of languages
  * @created: 11 september 2020
  * @returns:  an object list with laguage codes
  * @author:Sarvani Harshita*/
  getTranslateLanguagesList(data) {
    let apiUrl = AppConstants.Ehub_Rest_API + 'listManagement/getListItemsByListType?listType=' + data;
    return this._httpClient.get(apiUrl).toPromise();
  }

  /* purpose: To get the Relatives and close relatives info
  * created: 12 Oct 2020
  * returns:  an object list relatives data
  * author:shravani*/
  getPEPandRCARelation(requestId) {
    var apiUrl = AppConstants.Ehub_Rest_API + "alertManagement/getPEPandRCARelation?request_Id=" + requestId;
    return this._httpClient.get(apiUrl).toPromise();
  }

  /* purpose: get alert status permission
    * created: 02-nov-2020
    * author: shravani
    */
  getAlertStatusPermission(params, bulkType): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "alertManagement/getUpdateAlertStatusPermission?bulkType=" + bulkType;
    return this._httpClient.post(apiUrl, params, httpOptions).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose: get related alerts to the particular entity
   * created: 9-nov-2020
   * author: Kasun
   */
  getRelatedAlertsByEntityId(id: any): Observable<any> {
    const url: string =
      AppConstants.Ehub_Rest_API +
      'alertManagement/getAlertsByEntityId?&entityId=' + id;
    return this._httpClient.post(url, {}, httpOptions).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  getUBOLegalRebKeyManagerData(bpkenn, type): Observable<any> {
    const url: string =
      AppConstants.Ehub_Rest_API +
      'advancesearch/entity/uboLegalRepKeyManagerMultisource?bpkenn=' + bpkenn +
      '&type=' + type;
    return this._httpClient.get(url).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose:get Statistics of Alert Indicators
 * created:15 December 2020
 * author: Upeksha
 */
  getAlertStatistics(caseType, ranges) {
    var apiUrl = AppConstants.Ehub_Rest_API + "case/getAlertStatistics?type=" + caseType;

    if (ranges != "") {
      apiUrl = AppConstants.Ehub_Rest_API + "case/getAlertStatistics?ranges=" + ranges;
    }

    return this._httpClient.post(apiUrl, "", httpOptions).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /* purpose:get Ageing Summary details
   * created:24 December 2020
   * author: Hansaka
   */
  getAlertAgeingSummary() {
    var apiUrl =
      AppConstants.Ehub_Rest_API + "alertManagement/getAlertAgingList";

    return this._httpClient.get(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }
  getAllEntityAlertIndicators(entityType) {
    const url: string =
      AppConstants.Ehub_Rest_API + 'systemSettings/indicator/getAllEntityIndicators?listType=' + entityType
    this._httpClient.get(url)
      .pipe(
        map(data => data as any[]),
        retry(0),
        catchError(this.handleError)
      )
      .subscribe(response => {
        let alertRiskIndicators = response
        if (entityType == "Alert Risk") {
          alertRiskIndicators = response.map(indicator => {
            let hours = 0
            switch (indicator.period) {
              case "Days":
                hours = indicator.value * 24
                break;
              case "Weeks":
                hours = indicator.value * 7 * 24
                break;
              case "Months":
                hours = indicator.value * 30 * 24
                break;
              case "Years":
                hours = indicator.value * 365 * 24
                break;
            }
            return {
              ...indicator,
              hours: hours
            }
          })
        }
        this.getAlertRiskIndicatorsObservable.next(alertRiskIndicators)
      })
  }

  getRunningScreeningRequestIDForLoggedInUser() {
    var apiUrl = AppConstants.Ehub_Rest_API + "alertManagement/getRunningScreeningRequestIDForLoggedInUser?token=" + AppConstants.Ehubui_token;
    return this._httpClient.get(apiUrl).toPromise();
  }

  getStatsForScreeningRequestID(id) {
    var apiUrl = AppConstants.Ehub_Rest_API + "alertManagement/getScreeningAlertsResult?id=" + id;
    return this._httpClient.post(apiUrl, httpOptions).toPromise();
  }

  assignAlertsToGroup(params): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "alertManagement/assignAlertsToGroup";
    return this._httpClient.post(apiUrl, params, httpOptions).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  getGroupSettingsOnCurrentUser() {
    var apiUrl = AppConstants.Ehub_Rest_API + "groupAlert/getGroupSettingsOnCurrentUser?listType=Feed Classification";
    return this._httpClient.get(apiUrl, httpOptions).toPromise();
  }

  getTenant(): Observable<any>{
    const apiUrl = AppConstants.Ehub_Rest_API + "groupAlert/getGroupSettingsOnCurrentUser?listType=Tenant";
    return this._httpClient.get(apiUrl, httpOptions)
  }

  getAlertCardData(uuid: string): Observable<any>{
    const apiUrl = AppConstants.Ehub_Rest_API + "uniformAlert/" + uuid;
    return this._httpClient.get(apiUrl, httpOptions)
  }

  getSelectedAlertCardData(data: any) {
    this.getSelectedAlertCard.next(data);
  }

  updateAdverseClassification(data: any): Observable<any> {
    const uuid = data.uuid
    const payload = {
      hitId: data.hitId,
      classificationVerification: data.classificationVerification
    }
    const apiUrl = AppConstants.Ehub_Rest_API + "uniformAlert/" + uuid + "/classificationVerification";
    return this._httpClient.put(apiUrl, payload, httpOptions)
  }
}
