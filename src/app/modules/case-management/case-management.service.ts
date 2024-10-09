import { Inject, Injectable, isDevMode } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { AppConstants } from '../../app.constant';
import { BehaviorSubject, forkJoin, of, Subject, Subscription } from 'rxjs';
import { Observable, throwError } from 'rxjs';
import {catchError, map, mergeMap, retry, tap} from 'rxjs/operators';
import { CaseOverrideRequest } from './models/case-override/case-override-request.model';
import { CaseCreateRequest } from './models/case-list/case-create-request.model';
import { GridDataRequest } from '@app/common-modules/models/grid-data-request.model';
import { GridData } from '@app/common-modules/models/grid-data.model';
import { CaseDetails } from './models/case-list/case-details.model';
import { CaseRelatedEntity } from './models/case-list/case-related-entity.modal';
import { RelatedCase } from './models/case-list/related-case.model';
import { AssociatedRecord } from './models/case-list/associated-record.model';
import { WidgetMasterDataResponse } from './models/case-widget/case-filter.model';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { IBatchDocument } from '@app/common-modules/modules/ag-grid-table/modals/case-batch-minimized/case-batch-minimized.component';
import { includes } from 'lodash-es';
import { ChartSelectionFilter } from './models/case-list/case-filter-model';
import { SelectedRowNode } from '@app/shared/model/selected-row-node';
import { WINDOW } from '../../core/tokens/window';
import { TagManagementApiService } from '../systemsetting/services/tag-management.api.service';
import { map as lodashMap } from 'lodash';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { GeneralSettingsApiService } from '../systemsetting/services/generalsettings.api.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

const httpOptionsTest = {
  headers: new HttpHeaders({ 'x-ms-blob-type': 'BlockBlob' }),
};

@Injectable({
  providedIn: 'root',
})
export class CaseManagementService {
  chartSelectionSubject: Subject<ChartSelectionFilter> = new Subject();
  isUserInDevMode = isDevMode();
  updateTableData = new BehaviorSubject(false);
  updateAttachmentTableData = new BehaviorSubject(false);
  updateAttachmentsCount = new BehaviorSubject(false);
  showDocDownloadLoader = new BehaviorSubject(false);
  updateCaseRelatedEntityTableData = new BehaviorSubject(false);
  updateCaseAttachmentData = new BehaviorSubject([]);
  repoDocumentListData = new BehaviorSubject([]);
  tableData = this.updateTableData.asObservable();
  attachementTableData = this.updateAttachmentTableData.asObservable();
  attachmentsCount = this.updateAttachmentsCount.asObservable();
  docDownloadLoader = this.showDocDownloadLoader.asObservable();
  updateCaseRelatedEntityTableDataObserver = this.updateCaseRelatedEntityTableData.asObservable();
  updateCaseAttachmentDataObserver = this.updateCaseAttachmentData.asObservable();
  repoDocumentListDataObserver = this.repoDocumentListData.asObservable();
  private iconList: any[] = [];
  currentPage: number = 0
  private iconListPromise?: Promise<any[]>;
  passRemoveFileIdList = new BehaviorSubject([]);
  passRemoveFileIdListObserver = this.passRemoveFileIdList.asObservable();
  auditPanelData = {
    isOpen: false,
    caseId: 0,
    name: '',
    component: ''
  }
  showAuditPanelListBehavior = new BehaviorSubject<boolean>(false);
  showAuditPanelListObserver = this.showAuditPanelListBehavior.asObservable();

  public getTranslationjsonObservable = new BehaviorSubject({});
  public getTranslationjson = this.getTranslationjsonObservable.asObservable();

  reloadAttachmentsListBehavior = new BehaviorSubject<boolean>(false);
  reloadAttachmentsListObserver = this.reloadAttachmentsListBehavior.asObservable();

  onChangeCaseDetailsTabBehavior = new BehaviorSubject<string>('');
  onChangeCaseDetailsTabObserver = this.onChangeCaseDetailsTabBehavior.asObservable();

  public behaviorSubjectForCommentCount = new BehaviorSubject<number>(0);
  behaviorSubjectForGetCommentCount = this.behaviorSubjectForCommentCount.asObservable();

  public behaviorSubjectForCaseCommentCount = new BehaviorSubject({});
  behaviorSubjectForGetCaseCommentCount = this.behaviorSubjectForCaseCommentCount.asObservable();

  releatedEntityTableDataBehaviour = new BehaviorSubject(false);
  releatedEntityTableObserver = this.releatedEntityTableDataBehaviour.asObservable();

  caseDeleteButtonBehavior = new BehaviorSubject<boolean>(false);
  caseDeleteButtonBehaviorObserver = this.caseDeleteButtonBehavior.asObservable();

  casAPInBehavior = new BehaviorSubject<any>({});
  casAPInBehaviorObserver = this.casAPInBehavior.asObservable();

  documentTagMappingList = new BehaviorSubject<any>({});
  documentTagMappingListObserver = this.documentTagMappingList.asObservable();

  copyCaseLoader = new BehaviorSubject<boolean>(false);
  copyCaseLoaderObserver = this.copyCaseLoader.asObservable();

  totalDocumentCount:number = 10

  caseAttachments: any[] = [];
  caseRiskReason: any;
  riskNextRemidiationDate: any;

  isCountUpdated = new BehaviorSubject<any>({});
  isCountUpdatedObserver = this.isCountUpdated.asObservable();
  removedBatch = new BehaviorSubject<string>('');

  private caseBatchUploadWS: WebSocketSubject<any>;
  caseBatchUploadSubject: BehaviorSubject<any> = new BehaviorSubject({});

  private caseBatchUploadHistory: any = {};
  private caseBatchUploadDocs: any = {};
  private removedBatchUploadIdsTemp: string[] = [];

  private webSocketSubscription: Subscription;

  private reconnectCaseBUWS$: Subject<null> = new Subject();
  private websocketReconSubscription: Subscription;
  private websocketCloseSubscription: Subscription;

  documentListFromRepo:any[] = []
  caseContactPermission:string

  isNextRemedationChangedSubscibe = new BehaviorSubject<string>("");
  isNextRemedationChangedObserver = this.isNextRemedationChangedSubscibe.asObservable();

  isAssociatedEntityClicked = new BehaviorSubject<boolean>(false);
  isAssociatedEntityObserver = this.isAssociatedEntityClicked.asObservable();

  getCurrentSelectRowCount = new BehaviorSubject<SelectedRowNode>(null);
  getCurrentSelectRowCountObserver = this.getCurrentSelectRowCount.asObservable();

  emitHeaderSelection = new BehaviorSubject<boolean>(false);
  emitHeaderSelectionObserver = this.emitHeaderSelection.asObservable();

  isLoggedInUserAssigned = new BehaviorSubject<boolean>(true);
  isLoggedInUserAssignedObserver = this.isLoggedInUserAssigned.asObservable();

  private eventLookupPagination: EventLookupPagination[] = [];

  public behaviorSubjectForWidgetVissibleChange = new BehaviorSubject<boolean>(true);
  observableWidgetVissibleChange = this.behaviorSubjectForWidgetVissibleChange.asObservable();

  constructor(
    private httpClient: HttpClient,
    @Inject(WINDOW) private readonly window: Window ,
    private _tagManagmentService:TagManagementApiService,
    private generalService: GeneralSettingsApiService
  ) { }

  /*
 Created Releated Case Api
 Author: Upeksha (AP-8080)
 Date: 25th Jan 2021
   */
  createReleatedCaseAPI(data: any): Observable<any> {
    const apiUrl = AppConstants.Case_New_API + 'addRelatedEntity';
    return this.httpClient
      .post(apiUrl, data, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  getCaseRelatedEntityNew(requestParams, filterData)
     : Observable<Array<CaseRelatedEntity>> {
     const pagination = {
       page_size: (requestParams.recordsPerPage) ? requestParams.recordsPerPage : 10,
       page: (requestParams.pageNumber) ? requestParams.pageNumber  : 1
     }

     const params = {
       filter_model: (filterData && filterData != '{}')? filterData.replaceAll("filterType","filter_type") :"{}",
       columns: [],
       order_by: '',
       pagination_information: pagination,
       order_in: 'asc'
     };
     const alertType = requestParams.alertType && requestParams.alertType.length && requestParams.alertType[0] && requestParams.alertType[0].alert_type ? requestParams.alertType[0].alert_type : ""
     const apiUrl = AppConstants.Case_New_API+ 'getRelatedEntities?case_id=' +
     requestParams.caseId+'&alert_type='+alertType;
     return this.httpClient.post<Array<CaseRelatedEntity>>(apiUrl, params, httpOptions)
       .pipe(retry(1), catchError(this.handleError));
   }

   updateCaseRelatedEntityNew(id: any, relationType): Observable<Array<CaseRelatedEntity>> {
     const params: any = {
       "id": id,
       "relation_type": relationType

     };
     const apiUrl = AppConstants.Case_New_API+ 'updateRelatedEntity';
     return this.httpClient.patch<any>(apiUrl, params, httpOptions)
       .pipe(retry(1), catchError(this.handleError));
   }

   deleteCaseRelatedEntityNew(caseId: any) {
     const apiUrl =
     AppConstants.Case_New_API + 'deleteRelatedEntity?id=' +
       caseId;
     return this.httpClient
       .delete(apiUrl, httpOptions)
       .pipe(retry(1), catchError(this.handleError));
   }

   exportCaseRelatedEntityNew(requestParams,filterData,langName,filename) {
     const pagination = {
       page_size: (requestParams.recordsPerPage) ? requestParams.recordsPerPage : 10,
       page: (requestParams.pageNumber) ? requestParams.pageNumber  : 1
     }

     const params = {
       filter_model: (filterData && filterData != '{}')? filterData.replaceAll("filterType","filter_type") :"{}",
       columns: [],
       order_by: '',
       pagination_information: pagination,
       order_in: 'asc',
       language: langName,
       file_name: filename
     };
     const options = { httpOptions, responseType: 'text' as any };
     const apiUrl = AppConstants.Case_New_API + 'exportRelatedEntities?case_id=' +
     requestParams.caseId;
     return this.httpClient.post(apiUrl, params, options)
       .pipe(retry(1));
   }

  exportAssociateRecords(requestParams,filterData,langName,filename){
    const pagination = {
      page_size: (requestParams.pagination_information.page_size) ? requestParams.pagination_information.page_size : 10,
      page: (requestParams.pagination_information.page) ? requestParams.pagination_information.page : 1
    }

    const params = {
      filter_model: (filterData && filterData != '{}')? filterData.replaceAll("filterType","filter_type") :"{}",
      columns: [],
      order_by: requestParams.order_by ? requestParams.order_by : '',
      pagination_information: pagination,
      order_in: requestParams.order_in ? requestParams.order_in : 'asc',
      alert: requestParams.alert,
      language: langName,
      file_name: filename
    };
    const options = { httpOptions, responseType: 'text' as any };
    const apiUrl = AppConstants.Case_New_API + 'exportAssociatedRecords';
    return this.httpClient.post(apiUrl, params, options).pipe(retry(1));
  }

  exportRelatedCases(requestParams, filterData, langName, filename) {
    const params = {
      filter_model: (filterData && filterData != '{}') ? filterData.replaceAll("filterType", "filter_type") : "{}",
      columns: [],
      order_by: '',
      order_in: 'asc',
      language: langName,
      file_name: filename
    };
    const options = { httpOptions, responseType: 'text' as any };
    const apiUrl = AppConstants.Case_New_API + 'exportRelatedCasesByCaseId?case_id=' + requestParams.caseId;
    return this.httpClient.post(apiUrl, params, options).pipe(retry(1));
  }


  rightPanelAlertData(data: any): Observable<any> {
    const apiUrl =
      'audit/getLogsByTypeId?type=' + data.type + '&typeId=' + data.typeId;
    return this.httpClient
      .post(apiUrl, null, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  createCaseAPI(data: any, caseCheck: any): Observable<any> {
    const apiUrl =
      AppConstants.Ehub_Rest_API +
      'case/createNewCase?verifyEnity=' +
      caseCheck;
    return this.httpClient
      .post(apiUrl, data, httpOptions)
      .pipe(catchError(this.handleError));
  }

  createCaseAPINew(data: CaseCreateRequest, caseCheck: boolean): Observable<any> {
    const apiUrl = `${AppConstants.Case_New_API}createCase?verify_entity=${caseCheck}`;
    return this.httpClient
      .post(apiUrl, data, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getRelationType():Observable<any>{
    return this.httpClient.get(AppConstants.Ehub_Rest_API + 'listManagement/getListItemsByListType?listType=Relation%20Type')
  }

  getCommentsListBycaseID(caseId: any): Observable<any> {
    const apiUrl =
      AppConstants.Case_New_API +
      'getCommentsByCaseId/' + caseId;
    return this.httpClient
      .get(apiUrl)
      .pipe(retry(1), catchError(this.handleError));
  }

  createNewCaseFromQuestioner(params: any, data: any): Observable<any> {
    const fm = new FormData();
    for (let i = 0; i < data.length; i++) {
      fm.append('uploadFile', data[i]);
    }
    const appUrl =
      AppConstants.Ehub_Rest_API +
      'case/createNewCaseFromQuestioner?caseId=' +
      params;
    return this.httpClient
      .post(appUrl, fm)
      .pipe(retry(1), catchError(this.handleError));
  }

  createNewCaseBulkUpload(data: any): Observable<any> {
    const fm = new FormData();
    for (let i = 0; i < data.length; i++) {
      fm.append('file', data[i]);
    }
    const appUrl = `${AppConstants.Case_New_API}createBatch`;
    return this.httpClient
      .post(appUrl, fm)
      .pipe(retry(1));
  }

  validateBatchCaseFile(data: any): Observable<any> {
    const fm = new FormData();
    if (data && data.length) {
      for (let i = 0; i < data.length; i++) {
        fm.append('file', data[i]);
      }
      const appUrl = `${AppConstants.Case_New_API}validateCSV`;
      return this.httpClient
        .post(appUrl, fm)
        .pipe(retry(1));
    }
  }

  addComment(params: any): Observable<any> {
    const apiUrl = AppConstants.Case_New_API + 'addComment';
    return this.httpClient
      .post(apiUrl, params, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  editComment(params: any): Observable<any> {
    const apiUrl = AppConstants.Case_New_API + 'editComment';
    return this.httpClient
      .post(apiUrl, params, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteComment(comment_id: any): Observable<any> {
    const apiUrl = AppConstants.Case_New_API + `deleteComment?comment_id=${comment_id}`;
    return this.httpClient
      .delete(apiUrl)
      .pipe(retry(1), catchError(this.handleError));
  }


  getCaseStatistics(caseType: any, ranges: any): Observable<any> {
    const apiUrl =
      ranges !== ''
        ? `${AppConstants.Case_New_API}getCaseStatistics?ranges=${ranges}`
        : `${AppConstants.Case_New_API}getCaseStatistics?type=${caseType}`;

    return this.httpClient
      .post(apiUrl, '', httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  getRequesterAPI(): Observable<any> {
    const apiUrl =
      AppConstants.Ehub_Rest_API + 'usersNew/getUsers?isAllRequired=true';
    return this.httpClient
      .post(apiUrl, '', httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  getCasesList(): Observable<any> {
    const apiUrl = AppConstants.Ehub_Rest_API + 'investigation/newCaseList';
    return this.httpClient
      .post(apiUrl, '', httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  getCasesListNew(requestParams: any): Observable<GridData<CaseDetails>> {
    const pagination = {
      page_size: requestParams.recordsPerPage,
      page: requestParams.pageNumber
    }
    const params: GridDataRequest = {
      filter_model: requestParams.filterModel.replaceAll('filterType', 'filter_type'),
      columns: [],
      order_by: requestParams.orderBy,
      pagination_information: pagination,
      order_in: requestParams.orderIn
    };
    const apiUrl = `${AppConstants.Case_New_API}caseList`;
    return this.httpClient.post<GridData<CaseDetails>>(apiUrl, params, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getfilteredTenantsList():Promise<any> {
    let apiUrl = `${AppConstants.Case_New_API}getAllowedTypesAndTenants`;
    return this.httpClient.get(apiUrl).toPromise();
  }

  getCaseById(id: string): Observable<any> {
    const apiUrl = `${AppConstants.Case_New_API}getCaseById/${id}`;
    return this.httpClient
      .get(apiUrl, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getRelatedCasesBycaseID(requestParams: any, filterModel: any): Observable<GridData<RelatedCase>> {
    const pagination = {
      page_size: requestParams.count,
      page: requestParams.page
    }

    const params: any = {
      filter_model: (filterModel && filterModel != '{}') ? this.updateRelatedCasesFilters(filterModel) : "{}",
      order_by: requestParams.order_by,
      pagination_information: pagination,
      order_in: requestParams.order_in ? requestParams.order_in : 'asc',
      columns: []
    };

    const apiUrl = AppConstants.Case_New_API + 'getRelatedCasesByCaseId?case_id=' + requestParams.caseId;
    return this.httpClient.post<GridData<RelatedCase>>(apiUrl, params, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  updateRelatedCasesFilters(filterText) {
    filterText = filterText.replaceAll("filterType", "filter_type");
    filterText = filterText.replaceAll("caseId", "id");
    filterText = filterText.replaceAll("dueDate", "due_date");
    filterText = filterText.replaceAll("caseBusinessPriority", "business_priority");
    filterText = filterText.replaceAll("priorityRC", "priority");

    return filterText;
  }

  getAlert(requestParams: any, filterModel: any): Observable<GridData<AssociatedRecord>> {
    const pagination = {
      page_size: requestParams.count,
      page: requestParams.page
    }

    const params: any = {
      filter_model: (filterModel && filterModel != '{}') ? filterModel : "{}",
      order_by: requestParams.order_by,
      pagination_information: pagination,
      order_in: requestParams.order_in ? requestParams.order_in : 'asc',
      columns: []
    };

    const apiUrl = AppConstants.Case_New_API + 'getAlert/' + requestParams.alertId;
    return this.httpClient.post<GridData<AssociatedRecord>>(apiUrl, params, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  getAlertsById(requestParams: any, filterModel: any): Observable<GridData<AssociatedRecord>> {
    const pagination = {
      page_size: requestParams.recordsPerPage,
      page: requestParams.pageNumber
    };

    let alertsAr = [];
    requestParams.alerts.forEach(al => {
      const alert = {
        alert_type: al.type,
        alert_id: al.alert_id,
        entity_id: al.entityId,
        entity_name: al.entityName,
        entity_url: al.entityUrl
      };
      alertsAr.push(alert);
    });

    const params: any = {
      filter_model: (filterModel && filterModel != '{}') ? filterModel : "{}",
      order_by: requestParams.order_by,
      pagination_information: pagination,
      order_in: requestParams.order_in ? requestParams.order_in : 'asc',
      columns: [],
      alert: alertsAr
    };

    const apiUrl = AppConstants.Case_New_API + 'getAlertsById/';
    return this.httpClient.post<GridData<AssociatedRecord>>(apiUrl, params, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  getCaseByIdNew(id: string) {
    let apiUrl = this.isUserInDevMode ?
      '../../../assets/mock/case-detail.json'
      : 'assets/mock/case-detail.json';
    return this.httpClient.get(apiUrl).toPromise();
  }

  getAttachMentListBycaseID(caseId: any): Observable<any> {
    const apiUrl =
      AppConstants.Ehub_Rest_API +
      'case/getCaseDocumentsList?caseId=' +
      caseId;
    return this.httpClient
      .get(apiUrl)
      .pipe(retry(1), catchError(this.handleError));
  }

  getAttachMentListBycaseIDNew(params: any): Observable<any> {
    const apiUrl = AppConstants.Document_API + 'getDocumentsByReferences';
    return this.httpClient
      .post(apiUrl, params)
      .pipe(retry(1), catchError(this.handleError));
  }

  downloadDocumentAPI(params: any): Observable<ArrayBuffer> {
    const url =
      AppConstants.Ehub_Rest_API +
      'documentStorage/downloadDocument?docId=' +
      params.docId + '&source=' + encodeURIComponent(params.source) + '&docPath=' + encodeURIComponent(params.path);
    return this.httpClient
      .get(url, { responseType: 'arraybuffer' })
      .pipe(retry(1), catchError(this.handleError));
  }

  bulkDownloadForCaseDocumentList(data: any): Observable<any> {
    const apiUrl = AppConstants.Ehub_Rest_API + 'case/downloadDocumentsAsZip';
    return this.httpClient.post(apiUrl, data, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    });
  }

  deleteDocumentAPI(params: any): Observable<any> {
    const apiUrl =
      AppConstants.Document_API +
      'deleteDocumentReferences'
    return this.httpClient
      .post(apiUrl, params)
      .pipe(retry(1), catchError(this.handleError));
  }

  updateCaseAPI(params: any): Observable<any> {
    const apiUrl = AppConstants.Ehub_Rest_API + 'investigation/newUpdateCase';
    return this.httpClient
      .post(apiUrl, params, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  updateCaseAPINew(params: any): Observable<any> {
    const apiUrl = `${AppConstants.Case_New_API}updateCase`;
    return this.httpClient
      .post(apiUrl, params, httpOptions)
      .pipe(retry(1));
  }

  validateCaseNameApi(params: any): Observable<any> {
    const apiUrl = AppConstants.Ehub_Rest_API + 'case/validateCaseName';
    return this.httpClient.post(apiUrl, params);
  }

  getStatusList(params: any): Observable<any> {
    const apiUrl =
      AppConstants.Ehub_Rest_API +
      'workflowmanagement/getNextAvailableStatuses?token=' +
      AppConstants.Ehubui_token +
      '&entityId=' +
      params.caseId +
      '&currentStatus=' +
      params.currentStatus +
      '&workflowKey=' +
      params.workflowKey;
    return this.httpClient
      .get(apiUrl)
      .pipe(retry(1), catchError(this.handleError));
  }

  getWorkflowStatusListAPI(workFlowKey: any): Observable<any> {
    const apiUrl =
      AppConstants.Ehub_Rest_API +
      'case/getAllStatusByWorkflowKey?workflowKey=' +
      workFlowKey;
    return this.httpClient
      .get(apiUrl)
      .pipe(retry(1), catchError(this.handleError));
  }

  getAggregatedCaseStatus(): Observable<any> {
    const apiUrl = AppConstants.Case_New_API + 'getAggregatedCaseStatus';
    return this.httpClient
      .get(apiUrl)
      .pipe(retry(1), catchError(this.handleError));
  }


  getWidgetMasterData(): Observable<WidgetMasterDataResponse> {
    const apiUrl =
      AppConstants.Case_New_API + 'getWidgetMasterData';
    return this.httpClient
      .get<WidgetMasterDataResponse>(apiUrl)
      .pipe(retry(1), catchError(this.handleError));
  }

  getLastReason(caseId) {
    const apiUrl =
      AppConstants.Case_New_API + `getCaseById/${caseId}`;
    return this.httpClient
      .get(apiUrl)
      .pipe(retry(1), catchError(this.handleError));
  }

  // unused but commented in case-dashboard component - pending remove
  createWidgetDefinition(data: any): Observable<any> {
    const apiUrl =
      AppConstants.Ehub_Rest_API + 'genericWidgets/createWidgetDefinition';
    return this.httpClient
      .post(apiUrl, data)
      .pipe(retry(1), catchError(this.handleError));
  }

  updateWidgetDefinition(data: any): Observable<any> {
    const apiUrl =
    AppConstants.Case_New_API +
      'createOrUpdateWidgetInstance';
    return this.httpClient
      .post(apiUrl, data)
      .pipe(retry(1), catchError(this.handleError));
  }

  getWidgetinstancebyUser(): Observable<any> {
    const apiUrl =
    AppConstants.Case_New_API + 'getWidgetInstancesOfUser';
    return this.httpClient
      .get(apiUrl)
      .pipe(retry(1), catchError(this.handleError));
  }

  getWidgetDataById(widgetID: any): Observable<any> {
    const apiUrl =
      AppConstants.Ehub_Rest_API +
      'genericWidgets/getWidgetById?widgetDefinitionId=' +
      widgetID;
    return this.httpClient
      .get(apiUrl)
      .pipe(retry(1), catchError(this.handleError));
  }

  getPermissionByStatus(statusKey: any): Observable<any> {
    const apiUrl =
      AppConstants.Ehub_Rest_API +
      'case/getCasePermissionLevel?caseStatusKey=' +
      statusKey;
    return this.httpClient
      .post(apiUrl, '', httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  getAllPermissionByStatus(): Observable<any> {
    const apiUrl =
      AppConstants.Ehub_Rest_API +
      'case/getAllCasePermissionLevel';
    // return of(throwError('xxx'))
    return this.httpClient
      .get(apiUrl, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  getItemList(itemByType: any): Observable<any> {
    const apiUrl =
      AppConstants.Ehub_Rest_API +
      'listManagement/getListItemsByListType?listType=' +
      itemByType;
    return this.httpClient
      .get(apiUrl)
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteWidgetBywID(widgetId: any): Observable<any> {
    const apiUrl =
      AppConstants.Case_New_API +
      'deleteWidgetInstance?widget_id='+ widgetId + '&delete=' + true;
    return this.httpClient
      .delete(apiUrl)
      .pipe(retry(1), catchError(this.handleError));
  }

  overrideRisk(params: CaseOverrideRequest): Observable<any> {
    const apiUrl = AppConstants.Case_New_API + 'saveCaseRiskByCaseID';
    return this.httpClient
      .post(apiUrl, params, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  uploadDocumentForProof(params): Observable<any> {
    var apiUrl = AppConstants.Document_API + "uploadRawDocuments";
    return this.httpClient.post(apiUrl, params).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  deleteDocumentFromComment(params): Observable<any> {
    var apiUrl = AppConstants.Document_API + "deleteDocumentReferences";
    return this.httpClient.post(apiUrl, params).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  getDocumentLocation(file_names): Promise<any> {
    const apiUrl = AppConstants.Document_API + 'getDocumentLocation';
    return this.httpClient.post(apiUrl, { file_names, location: "DOC" }).toPromise();
  }

  callPresignedUrl(params, url): Promise<any> {
    if(AppConstants.Cloud == 'AZURE') {
      return this.httpClient.put(url, params, httpOptionsTest).toPromise()
    } else {
      return this.httpClient.put(url, params).toPromise()
    }
  }

  overrideRiskUpdate(params): Observable<any> {
    const apiUrl = AppConstants.Case_New_API + 'updateCaseRiskReasonByID';
    return this.httpClient
      .post(apiUrl, params, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  getOverrideRisks(case_id: string, all: boolean = false): Observable<any> {
    const apiUrl = AppConstants.Case_New_API + 'getCaseRisksByCaseID/'+ case_id + '?all=' + all;
    return this.httpClient
      .get(apiUrl, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteOverrideRisk(case_risk_id: string, case_id: string): Observable<any> {
    const apiUrl = AppConstants.Case_New_API + `deleteCaseRiskByID?risk_id=${case_risk_id}&case_id=${case_id}`;
    return this.httpClient
      .delete(apiUrl, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

   getIconList(): Promise<any> {
     if (!this.iconListPromise) {
     const apiUrl = 'assets/json/icon.json';
       this.iconListPromise = this.httpClient.get<any>(apiUrl).toPromise();
     }
     return this.iconListPromise;

   }

  getUserGroupsById(userId: any): Observable<any> {
    const apiUrl = AppConstants.Case_New_API + 'getGroupsByUser/' + userId;
    return this.httpClient
      .post(apiUrl, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  getAllUserGroupsAPI(): Observable<any> {
    const apiUrl = AppConstants.Case_New_API + 'getUserGroups';
    return this.httpClient
      .post(apiUrl, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  getTenantById(id: string): Observable<any> {
    const apiUrl = AppConstants.Case_New_API + 'getTenantByID/' + id;
    return this.httpClient
      .get(apiUrl)
      .pipe(retry(1), catchError(this.handleError));
  }

  openAuditPanel(isOpen , caseId , name = '', component = ''):void{
    this.auditPanelData.isOpen = isOpen;
    this.auditPanelData.caseId = caseId;
    this.auditPanelData.name = name;
    this.auditPanelData.component = component;
    this.showAuditPanelListBehavior.next(isOpen);
  }

  closeAuditPanel() {
    this.showAuditPanelListBehavior.next(false);
    this.auditPanelData.isOpen = false;
    this.auditPanelData.caseId = 0;
  }

  getDocumentList(requestParams): Observable<any> {
    const apiUrl = AppConstants.Document_API + "searchDocuments";
    return this.httpClient.post(apiUrl, requestParams)
  }

  connectDocumentsToCases(params): Observable<any> {
    const apiUrl = AppConstants.Document_API + 'connectDocumentsToCases';
    return this.httpClient
      .post(apiUrl, params)
      .pipe(retry(1), catchError(this.handleError));
  }

  updateCaseAssignAPI(data){
    const apiUrl = AppConstants.Case_New_API + 'bulkCasesAssignee';
    return this.httpClient
      .post(apiUrl, data)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Request case time in status report generation.
   * @param caseId case id
   * @returns Observable that contains a blob file of the pdf report
   */
  generateCaseTimeInStatusReport(caseId: number) {
    const apiUrl = AppConstants.Case_New_API + 'caseReport?case_id=' + caseId || '';
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.httpClient.post(apiUrl, {}, { headers, responseType: 'blob' });
  }

  /**
   * Initiate update case entity data asynchronous process
   * @param name entity name
   * @param type entity type
   * @param jurisdiction entity jurisdiction
   * @param caseId case id
   * @returns nothing
   */
   updateCaseRelatedEntityData(name: string, type: string, jurisdiction: string, caseId: number): Observable<void> {
    const apiUrl = AppConstants.Case_New_API + 'updateEntityData';
    return this.httpClient.post<void>(apiUrl, {
      name,
      entity_type: type,
      case_id: caseId,
      jurisdiction
    }).pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Get entity info and entity url if data is updated
   * @param name entity name
   * @param caseId case id
   * @returns {entity_info: string | null, entity_url: string | null}
   */
  getCaseEntityData(name: string, caseId: number): Observable<{entity_url: string, entity_info: string, select_entity_url:string}> {
    const apiUrl = AppConstants.Case_New_API + 'getEntityData';
    return this.httpClient.post<{entity_url: string, entity_info: string, select_entity_url:string}>(apiUrl, {
      name,
      case_id: caseId
    }).pipe(retry(1), catchError(this.handleError));
  }

  setRemovedBatch(batchId: string) {
    this.removedBatch.next(batchId);
  }

  /**
   * Initialize handshake and connect to case batch upload s
   * tatus updates for current user websocket.
   * @param wsBaseUrl base url fpr websocket
   * @param userId current user ID
   */
  initializeBatchUploadWS(wsBaseUrl: string, userId: string) {
    this.caseBatchUploadHistory = {};

    const websocketCloseListener = new Subject();
    let websocketConnStatus = false;

    // function to create a websocket connection
    const createWebSocketConnection = () => {
      this.caseBatchUploadWS = webSocket({
        url: `${wsBaseUrl}getBatchCaseProgress/${userId}`,
        deserializer: (response) => {
          return response;
        },
        openObserver: {
          next: () => websocketConnStatus = true
        },
        closeObserver: websocketCloseListener
      })

      this.webSocketSubscription = this.caseBatchUploadWS.subscribe((data) => {
        if (!(data.data == "CONNECT" || data.data == "DISCONNECT")) {
          const batchUploadResArr = JSON.parse(data.data) as Array<any>;
          const map = batchUploadResArr.reduce((map, batchResItem) => {

            // if user has already removed this batch, then skip it
            if (includes(this.removedBatchUploadIdsTemp, batchResItem.batch_id)) return map;

            const _batchResItem = batchResItem;

            // Get the documents from the local store for the current batch upload if exist.
            if (this.caseBatchUploadDocs[batchResItem.batch_id]) {
              _batchResItem.documents = this.caseBatchUploadDocs[batchResItem.batch_id];
            }

            return { ...map, [batchResItem.batch_id]: _batchResItem };
          }, {});

          // store the current batch file upload status data.
          this.caseBatchUploadHistory = { ...map };

          // emit to all observers listening for batch status updates
          this.caseBatchUploadSubject.next(this.caseBatchUploadHistory);
        }
      });
    };

    // sometimes websocket connection breaks (code 1011 keepalive ping timeout) if it happens create a new conn.
    this.websocketCloseSubscription = websocketCloseListener.subscribe((event: CloseEvent) => {
      websocketConnStatus = false;
      if (event.code === 1011) {
        this.webSocketSubscription.unsubscribe();
        this.caseBatchUploadWS.complete();
        createWebSocketConnection();
      }
    });

    // when theres no activity websocket closes, so reconnect when required.
    this.websocketReconSubscription = this.reconnectCaseBUWS$.subscribe(_ => {
      if (!websocketConnStatus) {
        createWebSocketConnection();
      }
    });

    // create the websocket connection
    createWebSocketConnection();

    /**
     * since removed batch ids doesnt persist and gets resent, maintain a temp array of user removed batch ids.
     * TODO this should be handled from backend
     */
    this.removedBatch.subscribe(
      batchId => batchId && this.removedBatchUploadIdsTemp.indexOf(batchId) === -1 && this.removedBatchUploadIdsTemp.push(batchId));
  }

  /**
   * Initiate case batch upload websocket connection to listen for
   * new upload statuses
   */
  reconnectCaseBatchUploadWS() {
    this.reconnectCaseBUWS$.next();
  }

  /**
   * Keep a local storage of docments of current batch uploads.
   * TODO this should be handled from BE side, maybe send document name list with
   * websocket.
   * @param batchId related batch ID
   * @param documents document array
   */
  storeCaseBatchUploadDocumentData(batchId: string, documents: IBatchDocument) {
    this.caseBatchUploadDocs[batchId] = documents;
  }

  disconnectCaseBatchUploadConnections() {
    this.caseBatchUploadSubject.complete();
    this.caseBatchUploadWS.complete();
  }

  deleteCasebatch(bacthID: string) {
    const apiUrl =
    AppConstants.Case_New_API + 'deleteBatchCaseJobByUid/' + bacthID;
    return this.httpClient.delete(apiUrl, httpOptions).pipe(catchError(this.handleError));
  }

  getCopiedCase(caseid):Observable<any>{
    let url = AppConstants.Case_New_API + 'caseCopy?case_id=' + caseid
    return this.httpClient.get(url).pipe(catchError(this.handleError));
  }

  // @reason : open a case for given case id
  // @date : 05 jan 2023
  // @params : case id
  // @author : ammshathwan
  openCaseInNewTab(caseID):void{
    const url = AppConstants.Ehub_UI_API + 'element-new/dist/new/#/element/case-management/case/' + caseID;
    this.window.open(url, '_blank', 'noopener');
  }
  // @reason : get case contacts info for requested case
  // @params : case id
  // @return : array of case contacts for requested case
  // @date : 27 dec 2022
  // @author : ammshathwan
  getCaseContacts(params:any):Observable<any>{
    params.filter_model.replaceAll("filterType","filter_type")
    const apiUrl = AppConstants.Case_New_API + 'caseContacts'
    return this.httpClient.post(apiUrl, params , httpOptions).pipe(catchError(this.handleError))
  }

  // @reason : update relevant case contact on toggle selections
  // @params : case id , array of contacts id and relevant true
  // @return : updated state
  // @date : 03 jan 2023
  // @author : ammshathwan
  updateCaseRelevantContact(params:any): Observable<any> {
    const apiUrl = AppConstants.Case_New_API + 'updateContacts';
    return this.httpClient.post<any>(apiUrl, params).pipe(catchError(this.handleError));
  }

  // @reason : get modified file name
  // @date : 12 jan 2022
  // @params : title , format
  // @return : file name
  getCSVFileName(file , isBatchFile:boolean = false):string {
    if(!file)  return 'Untitled.csv'
    return isBatchFile ? file.title + '_status.' + file.format : file.title + '.' + file.format;
  }

  // @reason : get modified file name
  // @date : 12 jan 2022
  // @params : title , format
  // @return : file name
  getEntityContactUserRoles(file , isBatchFile:boolean = false):string {
    if(!file)  return 'Untitled.csv'
    return isBatchFile ? file.title + '_status.' + file.format : file.title + '.' + file.format;
  }

  // @reason : get entity contact user role
  // @date : 12 jan 2022
  // @return : list of entity contact roles
  getEntityContactUserRole(): Observable<any> {
    return this.httpClient.get(AppConstants.Ehub_Rest_API + 'entityContacts/getAllRoles')
  }

  getEndStatus(workflowKey: string):Observable<any>{
    return this.httpClient.get(AppConstants.Ehub_Rest_API + `v2/workflows/${workflowKey}/statuses`)
  }

  public getEventsLookupByCaseId(requestParams: any, filterModel: any): Observable<any>  {
    if (this.eventLookupPagination.length === 0) {
      this.eventLookupPagination.push(new EventLookupPagination(1, null));
    }
    const params = this.createEventLookupTransactionsRequestsParams(filterModel);
    const page = this.eventLookupPagination.find(el => el.page === requestParams.page);

    let apiUrl = AppConstants.Case_New_API + 'events_lookup/transactions?max_page_size=' + requestParams.count;
    if (page && page.cursorId) {
      apiUrl += '&cursor_id=[' + page.cursorId[0] + ',"' + page.cursorId[1] + '"]';
    }

    return this.httpClient.post<GridData<RelatedCase>>(apiUrl, params, {
      headers: httpOptions.headers,
    }).pipe(
      tap((res: any) => {
        if (res && !this.eventLookupPagination.find(el => el.page === (requestParams.page + 1))) {
          this.eventLookupPagination.push(new EventLookupPagination(requestParams.page + 1, res.last_cursor_id));
        }
      }),
      retry(1),
      catchError(this.handleError)
      );
  }

  public exportEventLookupTransactions(requestParams: any, filterModel: any, langName: any, filename: any) {

    const params = this.createEventLookupTransactionsRequestsParams(filterModel);

    return this.httpClient.post(AppConstants.Case_New_API + 'download_csv/transactions', params,{
      headers: httpOptions.headers,
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  private createEventLookupTransactionsRequestsParams(filterModel: any): any {
    const filters = JSON.parse(filterModel);
    const today = new Date();
    // get the number of milliseconds in 30 days
    const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;
    // create a new date object that represents a date 30 days ago
    const thirtyDaysAgo = new Date(today.getTime() - thirtyDaysInMilliseconds);
    const params: any = {
      transaction_date: {
        from: thirtyDaysAgo,
        to: today,
      },
      id: null,
      debit_credit_indicator: null,
      transaction_country: null,
      transaction_ip_address: null,
      counterparty_name: null,
      counterparty_country: null,
      origination_transaction_amount: null,
      transfer_method: null,
      transaction_channel: null,
      from_transaction_currency: null,
      volume: null,
      transaction_description: null,
      customer_id: null,
      account_type: null,
      product_reference: null,
      transaction_type: null,
      counterparty_account_number: null,
    };

    Object.keys(filters).forEach(key => {
      switch (key) {
        case 'date':
          params.transaction_date.from = filters[key].condition1.filter.split('#')[0];
          params.transaction_date.to = filters[key].condition1.filter.split('#')[1];
          break;

        case 'transactionID':
          params.id = filters[key].condition1.filter;
          break;
        case 'counterPartyName':
          params.counterparty_name = {};
          params.counterparty_name.filter_type = 'contains';
          params.counterparty_name.value = filters[key].condition1.filter;
          break;
        case 'transaction_description':
          params.transaction_description = {};
          params.transaction_description.filter_type = filters[key].condition1.type;
          params.transaction_description.value = filters[key].condition1.filter;
          break;
        case 'productID':
          params.product_reference = {};
          params.product_reference.filter_type = filters[key].condition1.type;
          params.product_reference.value = [filters[key].condition1.filter];
          break;
        case 'transactionType':
          params.transaction_type = {};
          params.transaction_type.filter_type = filters[key].condition1.type;
          params.transaction_type.value = [filters[key].condition1.filter];
          break;
        case 'transactionAmountRange':
          params.origination_transaction_amount = {};
          params.origination_transaction_amount.from = filters[key].condition1.filter;
          params.origination_transaction_amount.to = filters[key].condition1.filterTo;
          break;
        case 'transactionDebitCreditIndicator':
          params.debit_credit_indicator = {};
          params.debit_credit_indicator.filter_type = filters[key].condition1.type;
          params.debit_credit_indicator = [filters[key].condition1.filter.toUpperCase()];
          break;
        case 'accountNumber':
          params.counterparty_account_number = filters[key].condition1.filter;
          break;
        case 'counterPartyLocation':
          params.counterparty_country = {};
          params.counterparty_country.filter_type = 'at_least';
          params.counterparty_country.value = [filters[key].condition1.filter];
          break;
      }
    });

    return params;
  }

  private updateEventsLookupFilters(filterText: any): any {
    // filterText = filterText.replaceAll("filterType", "filter_type");

    return filterText;
  }

  setAssignedUser(condition: boolean){
    this.isLoggedInUserAssigned.next(condition)
  }

  // @purpose : get documents and document tag list data
  // @params : filter and number of documents - ag grid params
  // @return : object of doucment result and tags
  // @author : ammshathwan
  // @date : 10 may 2023
  getDoucmentWithTags(requestParams):Observable<any>{
    return this.getDocumentList(requestParams).pipe(
      map(res => {
        const result = res;
        return result
      }),
      mergeMap((result:any) => {
        const docResults = this.getDoucmentResult(result);
        const docIds = { 'DocID': result.data.map(val => val.file_id) }
        const tagByIdsApi = this._tagManagmentService.getTagMappingList(docIds);
        return forkJoin({
          results : docResults,
          tags : tagByIdsApi
        })
      })
    )
  }

  // @purpose : get given data as promise
  // @params : any data
  // @return : data as promise value
  // @author : ammshathwan
  // @date : 10 may 2023
  private getDoucmentResult(result): Promise<any>{
    return new Promise(function(resolve, reject) {
      resolve(result);
    });
  }

  // @purpose : get all workflow list
  // @author: ammshathwan
  // @date: 15 may 2023
  getEntityWorkflows(): Observable<any> {
    const apiUrl = 'systemSettings/workflow/getAllEntityWorkflows';
    return this.httpClient.get(apiUrl);
  }

  // @purpose : return given text in lowercase
  // @params: text
  // @author: ammshathwan
  // @date: 15 may 2023
  getLowerCaseText(text:string):string{
    if(!text) return "";

    return text.toLowerCase();
  }

  // @purpose : merge workflow and system settings status data to one object
  // @params: none
  // @author: ammshathwan
  // @date: 15 may 2023
  getStructuredStatusList(): Observable<any> {
    return this.getEntityWorkflows().pipe(
      map((res:any) => {
        const caseWorkFlow = res.find(workFlow => workFlow && workFlow.entityName ? workFlow.entityName.toLowerCase() == "case" : {});
        GlobalConstants.doucmentWorkFlowData = caseWorkFlow;
        return caseWorkFlow
      }),
      mergeMap((caseWorkFlow:any) => {
        const workflowStatusApi = this.getEndStatus(caseWorkFlow.workflowModelKey);
        const caseStatusApi = this.generalService.getListItemsByListType('Case Status');
        return forkJoin({
          "caseStatus" : caseStatusApi,
          "workflowStatus" : workflowStatusApi
        })
      })
    )
  }

  // @purpose : convert given hex code to rga
  // @params: hex , alpha
  // @author: ammshathwan
  // @date: 15 may 2023
  hexToRGB(hex?: string, alpha?: number) {
    if (hex) {
      const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
      if (alpha) {
        return `rgba(${r},${g},${b},${alpha})`;
      } else {
        return `rgba(${r},${g},${b})`;
      }
    } else {
      return `rgba(${255},${255},${255},${alpha})`;
    }
  }

  // @purpose : check and return the icon with fa class
  // @params: status object
  // @author: ammshathwan
  // @date: 15 may 2023
  getIcon(item:any){
    return item && item.icon ? `fa-${item.icon}` : "fa-ban"
  }
}

export class EventLookupPagination {
  page: number;
  cursorId: any[];

  constructor(page: number, cursorId: any[]) {
    this.page = page;
    this.cursorId = cursorId;
  }
}
