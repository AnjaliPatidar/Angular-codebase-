import { Injectable, OnInit, isDevMode } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { AppConstants } from "../../app.constant";
import { BehaviorSubject, forkJoin, Subject, Observable, throwError } from "rxjs";
import { catchError, map, retry } from "rxjs/operators";
import { GlobalConstants } from '../constants/global.constants';
import { Theme } from "@app/modules/systemsetting/models/system-settings/theme.model";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const httpPutOptions = {
  headers: new HttpHeaders({ 'x-ms-blob-type': 'BlockBlob' }),
};

@Injectable({
  providedIn: "root",
})
export class CommonServicesService implements OnInit {
  languageJSON = {};
  languageJSONTopPanel = {};
  isUserInDevMode = isDevMode();
  private isStickyNoteVisible: boolean = false;

  showHideSticky = new BehaviorSubject<boolean>(this.isStickyNoteVisible);
  sticky = this.showHideSticky.asObservable();

  nextRowData = new BehaviorSubject("");
  getNextRowData = this.nextRowData.asObservable();

  latestLowData = new BehaviorSubject(false);
  getLatstRowData = this.latestLowData.asObservable();

  isLogoUpdated = new BehaviorSubject<boolean>(false);
  LogoUpdated = this.isLogoUpdated.asObservable();

  isPresignURLCalled = new BehaviorSubject<boolean>(false);
  isPresignURLCalledObservable = this.isPresignURLCalled.asObservable()


  addNewWidgetBehavior = new BehaviorSubject<boolean>(false);
  addNewWidgetBehaviorObserver = this.addNewWidgetBehavior.asObservable();

  private getCases = new Subject();

  private disableAddWidgetSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /* purpose: Service for checking customize layout status on case-dashboard
   * created: 14 Oct 2020
   * author: Ashen
   */
  public statusCustomizeLayout = new BehaviorSubject(false);
  customizeLayout = this.statusCustomizeLayout.asObservable();

  screenedCounts = new Subject();


  getSystemSettingsAndWatchlists() {
    return forkJoin([this.getSystemSettings(), this.getWatchlists(null)]);
  }

  toggleCustomizeLayout(status: boolean) {
    this.statusCustomizeLayout.next(status);
  }

  fetchCustomizeLayoutStatus() {
    return this.statusCustomizeLayout;
  }

  /* purpose: Service for checking customize layout status on case-dashboard
   * created: 14 Oct 2020
   * updated: 18 Oct 202
   * author: Ashen
   */
  private subjectNewWidget = new Subject<any>();

  sendNewWidgetStatus(status: boolean) {
    this.subjectNewWidget.next(status);
  }

  clearNewWidgetStatus() {
    this.subjectNewWidget.next();
  }

  getNewWidgetStatus(): Observable<any> {
    return this.subjectNewWidget.asObservable();
  }

  public getDataFromComponentBehave = new BehaviorSubject<any>("");
  public getDataFromComponentBehaveObserver = this.getDataFromComponentBehave.asObservable();

  public behaviorSubjectForgetLanguageJson = new BehaviorSubject<any>("");
  public behaveObserverForgetLanguageJson = this.behaviorSubjectForgetLanguageJson.asObservable();

  private behaviorSubjectForgetTopPanelLanguageJson = new BehaviorSubject<any>("");

  public screeningOptionsForSubmenu = new Subject();
  public screeningOptionsForSubmenuObserver = this.screeningOptionsForSubmenu.asObservable();

  emitScreeningOptionsForSubmenu(options) {
    this.screeningOptionsForSubmenu.next(options);
  }

  public getAlerts = new Subject();

  getNewAlerts() {
    return this.getAlerts.asObservable();
  }

  public behaviousSubjectForReloadTable = new BehaviorSubject<any>("");
  public routPath = new BehaviorSubject<any>("");
  public companyName = new BehaviorSubject<any>("");
  public reloadConetnt = this.behaviousSubjectForReloadTable.asObservable();
  public behaviousSubjectForReloadGridTable = new BehaviorSubject<any>("");
  public reloadGrid = this.behaviousSubjectForReloadGridTable.asObservable();

  addSource = new Subject();
  clickedEdit = new Subject();
  clickedVisible = new Subject();
  updateRow = new Subject();
  userName = "Michael Ouliel";
  constructor(private httpClient: HttpClient) { }
  ngOnInit() { }

  getGridOptions(data) {
    this.getDataFromComponentBehave.next(data);
  }

  /*
   * @purpose: Get language josn
   * @created: 20 Jan 2020
   * @params: null
   * @returns: no
   * @author: karnakar
   */
  getLanguageJson(languageType) {
    return this.httpClient
      .get("fileStorage/downloadFileJsonFromJson?fileName=" + languageType)
      .pipe(
        retry(0),
        catchError(this.handleError)
      );
  }

  getModuleJsonData(param) {
    var secondApi =
      AppConstants.Ehub_Rest_API +
      "fileStorage/downloadFileByLanguageAndFileName?fileName=" +
      param.fileName +
      "&languageName=" +
      param.languageName;
    return this.httpClient.get(secondApi).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /*
   * @purpose: system stetting
   * @created:12 dec, 2019
   * @params: null
   * @returns: no
   * @author: amritesh
   */
  getSystemSettings() {
    let apiUrl = "systemSettings/getSystemSettings";
    return this.httpClient.get(apiUrl).toPromise();
  }

  public getAccessSettingsWatchlists$(): Observable<Array<{ id: number; name: string }>> {
    const url: string = `${AppConstants.Ehub_Rest_API}groupAlert/watchlists`;
    return this.httpClient.get<any>(url).pipe(map(response => response.data));
  }

  /*
   * @purpose: handle logout token blacklisting
   * @created:23 feb, 2021
   * @params: null
   * @author: Sarmilan
   */
  tokenBlacklisting() {
    let apiUrl = AppConstants.Ehub_Rest_API + "auth/logout";
    return this.httpClient.get(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /*
   * @purpose: Getting the data from table and displaying in the right panel
   * @created: 06-06-2019
   * @params: _value
   * @returns: Row Data for alert-management
   * @author: Asheesh
   */
  public rowData = new BehaviorSubject({});
  getObserver = this.rowData.asObservable();
  getRowData(_value) {
    this.rowData.next(_value);
  }

  public headerName = new BehaviorSubject("");
  getHeaderName = this.headerName.asObservable();

  getHeader(value) {
    this.headerName.next(value);
  }

  /* purpose: Get all sub menu items
   * created: 19-Dec-2019
   * author: karnakar
   */
  getSubmenuOptions(): Observable<any> {
    var apiUrl = AppConstants.Ehub_Rest_API + "menuItem/getAllUserMenus";
    return this.httpClient.get(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  getPermissionIds(): Observable<any> {
    let apiUrl = this.isUserInDevMode
      ? "../../../assets/json/permissonsMapping.json"
      : "assets/json/permissonsMapping.json";
    return this.httpClient.get(apiUrl).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /*
   * @purpose: Getting the data row data from the alert list to send to different popovers
   * @created: 30-08-2019
   * @params: _value
   * @returns: total Row Data on click for comment popover
   * @author: Asheesh
   */

  public dataFromRow = new BehaviorSubject("");
  commentData = this.dataFromRow.asObservable();

  getCommentRowData(_value) {
    this.dataFromRow.next(_value);
  }

  toggleSticky() {
    this.isStickyNoteVisible = !this.isStickyNoteVisible;
    this.showHideSticky.next(this.isStickyNoteVisible);
  }

  getAlertsFromServer(data) {
    this.getAlerts.next(data);
  }

  reloadPageConetnt() {
    this.behaviousSubjectForReloadTable.next(this.reloadConetnt);
  }

  sendLanguageJsonToComponents(data) {
    this.languageJSON = Object.assign(this.languageJSON, data);
    this.behaviorSubjectForgetLanguageJson.next(this.languageJSON);
  }

  setTopPanelJson(data) {
    this.behaviorSubjectForgetTopPanelLanguageJson.next(data);
  }

  getTopPanelJson(): Observable<any> {
    return this.behaviorSubjectForgetTopPanelLanguageJson.asObservable();
  }
  /*
   * @purpose: Getting user roles
   * @created: jan 09 2020
   * @author: kamal
   * params : userId
   * return : promise
   */
  getUserRoles(params) {
    let apiUrl = "userRoles/getRolesOfUserWithObj";
    return this.httpClient.get(apiUrl, { params: params }).toPromise();
  }

  /*
   * @purpose: Getting user Groups
   * @created: jan 09 2020
   * @author: kamal
   * params : userId
   * return : promise
   */
  getUserGroups(userId: any) {
    let apiUrl = "groups/listUserGroups";
    return this.httpClient
      .get(apiUrl, { params: { userId: userId } })
      .toPromise();
  }

  /*
   * @purpose: Getting All souces for entity searched
   * @created: may 09 2020
   * @author: Amritesh
   * params : data
   * return : promise
   */
  multiSource(data) {
    let params = "";
    params += data.jurisdiction ? "&jurisdiction=" + data.jurisdiction : "";
    params += data.entityId ? "&entityId=" + data.entityId : "";

    var apiUrl =
      AppConstants.Ehub_Rest_API +
      "advancesearch/entity/multisource?query=" +
      encodeURIComponent(data.query) + params;
    return this.httpClient.get(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  getPermissionsByRole(roles) {
    let apiUrl = "groupPermission/getPermissionsByRolesList";
    return this.httpClient.post(apiUrl, roles).toPromise();
  }

  getAllRoles() {
    let apiUrl = "roles/getAllRoles";
    return this.httpClient.get(apiUrl).toPromise();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("An error occurred:", error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError("Something bad happened; please try again later.");
  }

  getActiveDomainDetailsOfUser(userId: any) {
    let apiUrl = "menuItem/getAllLastVisitedDomainByUserId";
    return this.httpClient
      .get(apiUrl, { params: { userId: userId } })
      .toPromise();
  }

  getThemeById(themeId): Promise<Theme> {
    const apiUrl = 'themeBuilder/getThemeByThemeId';
    return this.httpClient
      .get<Theme>(apiUrl, { params: { themeId } })
      .toPromise();
  }

  getBasicSettings(): Observable<any> {
    let apiUrl = "systemSettings/getBasicSettings";
    return this.httpClient.get(apiUrl);
  }

  searchAlertOndemand(data) {
    let apiUrl = "alertManagement/ODSScreening";
    return this.httpClient.post(apiUrl, data).toPromise();
  }

  getCaseCreateData(type) {
    let apiUrl = "listManagement/getListItemsByListType?listType=" + type;
    return this.httpClient.get(apiUrl);
  }

  getJurdictionlist() {
    let apiUrl = "sourceJurisdiction/getSourceJurisdiction";
    return this.httpClient.get(apiUrl).toPromise();
  }
  getListItemsByListType(type:any):Promise<any> {
    let apiUrl = "listManagement/getListItemsByListType?listType=" + type;
    return this.httpClient.get(apiUrl).toPromise();
  }
  getDownloadDocumentpresignedUrl(params: { document_paths: Array<string> }): Promise<ArrayBuffer> {
    let apiUrl = AppConstants.Document_API + 'getDownloadLocations';
    return this.httpClient.post<ArrayBuffer>(apiUrl, params).toPromise();
  }

  downloadFromPresigned(presigned_url: string, fileName: string) {
    fetch(presigned_url).then(r => r.blob()).then(blobFile => {
      var blob = new Blob([blobFile], {
        type: blobFile.type,
      });
      const objectUrl: string = URL.createObjectURL(blob);
      const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
      a.href = objectUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
      this.isPresignURLCalled.next(true)
    });
  }

  getWatchlists(entityType) {
    let apiUrl = "alertManagement/getWatchlists";
    if (entityType) {
      apiUrl = apiUrl + "?entity_type=" + entityType;
    }
    return this.httpClient.get(apiUrl).toPromise();
  }

  getPermissionStatus(elementPermissions) {
    let selectedDomain: string = (GlobalConstants.currentDomianDetails && GlobalConstants.currentDomianDetails.domainName && GlobalConstants.currentDomianDetails.hasOwnProperty('domainName')) ? GlobalConstants.currentDomianDetails['domainName'] : '';
    let permissions = (GlobalConstants.systemSettings['permissions']) ? GlobalConstants.systemSettings['permissions'] : [];
    let permissionId;
    let elementLevel = 0;
    if (elementPermissions != typeof {} && selectedDomain && permissions.length && elementPermissions) {
      permissionId = elementPermissions[selectedDomain];
      elementLevel = elementPermissions['level'];

      if (permissionId) {
        let validLevel = 0;
        let avoidDataList: Array<any> = [null, undefined, 'null', 'undefined', {}];

        permissions.forEach((role) => {
          if (role[permissionId] && role[permissionId]['permissionLevel'] && validLevel < role[permissionId]['permissionLevel']) {
            validLevel = role[permissionId]['permissionLevel'];
          }
        });

        if ((validLevel < elementLevel) || (validLevel == 0)) {
          return true;
        }
        else {
          return false;
        }
      }
      return true;
    }
    return true;
  }

  getPermissionStatusType(elementPermissions) {
    let selectedDomain: string = (GlobalConstants.currentDomianDetails && GlobalConstants.currentDomianDetails.domainName && GlobalConstants.currentDomianDetails.hasOwnProperty('domainName')) ? GlobalConstants.currentDomianDetails['domainName'] : '';
    let permissions = (GlobalConstants.systemSettings['permissions']) ? GlobalConstants.systemSettings['permissions'] : [];
    let permissionId;
    let elementLevel = 0;
    if (elementPermissions != typeof {} && selectedDomain && permissions.length && elementPermissions) {
      permissionId = elementPermissions[selectedDomain];
      elementLevel = elementPermissions['level'];

      if (permissionId) {
        let validLevel = 0;
        let avoidDataList: Array<any> = [null, undefined, 'null', 'undefined', {}];

        permissions.forEach((role) => {
          if (role[permissionId] && role[permissionId]['permissionLevel'] && validLevel < role[permissionId]['permissionLevel']) {
            validLevel = role[permissionId]['permissionLevel'];
          }
        });

        switch (validLevel) {
          case 0:
            return "none";

          case 1:
            return "view";

          case 2:
            return "full";

          default:
            return "view"
        }

      }
      return "view";

    }
    return "view";
  }

  /*
* @purpose:  sendDatafrom root to Overiew
* @created: nov 3 2020
* @author: Ram
* params : data
* return : behaviour subkect
*/
  public screeningDataSubject = new BehaviorSubject({});
  screeningObservable = this.screeningDataSubject.asObservable();

  public activatescreeningDataSubject = new BehaviorSubject({
    screeningSelected: [],
    gridOptions: {},
    rowSelected: []
  });
  activatescreeningObservable = this.activatescreeningDataSubject.asObservable();

  public refreshscreeningGridSubject = new BehaviorSubject([]);
  refreshscreeningGridObservable = this.refreshscreeningGridSubject.asObservable();

  get_pattern(element) {
    if (element.type.toLowerCase() == 'text') {
      return "^.*$"
    }
    else if (element.type.toLowerCase() == 'number') {
      return "[0-9-+()]+$"
    }
    else {
      return "^.*$"
    }
  }

  get_pattern_error(type) {
    return "invalid input"
  }

  get_language_name(key) {
    if (key.toLowerCase().trim() == "english") {
      return "en"
    }
    if (key.toLowerCase().trim() == "german") {
      return "de"
    }
  }

  getDomainPermissions(value, arg) {
    let result;
    if (value && value.length > 0) {
      result = value.find(ele => ele.hasOwnProperty(arg));
    }
    if (result) {
      return result[arg];
    }
    else {
      return {}
    }
  }

  setAddWidgetBtnDisableStatus(status: boolean): void {
    this.disableAddWidgetSubject.next(status);
  }

  getAddWidgetBtnDisableStatus(): Observable<boolean> {
    return this.disableAddWidgetSubject.asObservable();
  }

  setNewCases(data: any) {
    this.getCases.next(data);
  }

  getNewCases() {
    return this.getCases.asObservable();
  }

  uploadRawDocuments(data): Observable<any> {
    var apiUrl = AppConstants.Document_API + "uploadRawDocuments";
    return this.httpClient.post(apiUrl, data, httpOptions).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  getDocumentLocation(data): Observable<any> {
    var apiUrl = AppConstants.Document_API + "getDocumentLocation";
    return this.httpClient.post(apiUrl, data, httpOptions).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  getDownloadLocations(data): Observable<any> {
    var apiUrl = AppConstants.Document_API + "getDownloadLocations";
    return this.httpClient.post(apiUrl, data, httpOptions).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  callUploadPresignedUrl(url, file) {
    return this.httpClient.put(url, file, httpPutOptions).pipe(catchError(this.handleError));
  }

  callDownloadPresignedUrl(url): Observable<ArrayBuffer> {
    return this.httpClient.get(url, { responseType: 'arraybuffer' }).pipe(retry(1), catchError(this.handleError));
  }

  /*
  * @purpose: Log out from Policy Enforcement
  * @created: 11 May 2022
  * @params: null
  * @return: success, error functions
  * @author: Bisara
*/
  logoutFromPolicyEnforcement() {
    return this.httpClient.get(AppConstants.POLICY_ENFORCEMENT_PATH + "logout.jsp?locale=default").pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  /*
    * @purpose: Log out from KYC Questionnaire
    * @created: 11 May 2022
    * @params: null
    * @return: success, error functions
    * @author: Bisara
  */
  logoutFromKYCQuestionnaire() {
    return this.httpClient.get(AppConstants.KYC_QUESTIONNAIRE_PATH + "/authentication/sa/logout").pipe(
      retry(0),
      catchError(this.handleError)
    );
  }
}
