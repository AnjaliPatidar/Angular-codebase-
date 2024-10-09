import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, Subject } from 'rxjs';
import { NgFlashMessageService } from 'ng-flash-messages';
import { AppConstants } from '@app/app.constant';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { retry, catchError, first } from 'rxjs/operators';
import { CommonServicesService } from '../common-modules/services/common-services.service';
import { ToastService } from '@app/common-modules/modules/toast/toast.service';
@Injectable({
  providedIn: 'root',
})
export class SharedServicesService {
  private permissions: any[] = [];
  private systemSettings;
  intialRightPanel = false;
  private panelStatus = new BehaviorSubject<any>(this.intialRightPanel);
  getEditableOption = false;
  getgeneralsettingsObject: any = {};
  rData = new BehaviorSubject('');
  alertAgingChartFilterObservable = new Subject<any>();
  statusVal = new BehaviorSubject('');
  sourceEvidence = new Subject<any>();
  socialrightpanelbehaviour = new BehaviorSubject(false);
  socialpanelObservable = this.socialrightpanelbehaviour.asObservable();
  statusTrue = this.statusVal.asObservable();
  sourceEvidenceObservable = this.sourceEvidence.asObservable();
  alertAgingChartFilterCalled = this.alertAgingChartFilterObservable.asObservable();
  currentMessage = this.panelStatus.asObservable();
  sourceMangeDomainSearchChartFilterObservable = new Subject<any>();
  sourceMangeDomainSearchChartFilterCalled = this.sourceMangeDomainSearchChartFilterObservable.asObservable();

  dateFormatObservable = new BehaviorSubject('DD MMM YYYY');
  dateFormatValue = this.dateFormatObservable.asObservable();

  totalEntites = new BehaviorSubject<number>(0);
  totalEntitesCount = this.totalEntites.asObservable();

  enableMiniMizedModal = new BehaviorSubject(false);
  enableMiniMizedDIV = this.enableMiniMizedModal.asObservable();

  maxiMinzeProcessingScreen = new BehaviorSubject(true);
  maxiMinzeProcessingModalWindow = this.maxiMinzeProcessingScreen.asObservable();

  screeningCompleted = new BehaviorSubject<{}>({ status: false, reasult: {} });
  screeningCompleted$ = this.screeningCompleted.asObservable();

  isDisplayNotificationBar = new BehaviorSubject<{isShow: any, ntfType: any, msg: any, isBtn: any, btnTxt:any}>({ isShow: false, ntfType: 'info', msg: '', isBtn: false, btnTxt: ''}); 
  isDisplayNotificationBar$ = this.isDisplayNotificationBar.asObservable();

  constructor(
    private ngFlashMessageService: NgFlashMessageService,
    private httpClient: HttpClient,
    private commonServicesService: CommonServicesService,
    private toast: ToastService
  ) {
    this.setPermissions();
  }

  hideAlertRightPanel(value: any): void {
    this.panelStatus.next(value);
  }

  shareRowDAta(value: any): void {
    this.rData.next(value);
  }

  updateRightPanelSocialMedia(value: any): void {
    this.socialrightpanelbehaviour.next(value);
  }

  statusData(value: any): void {
    this.statusVal.next(value);
  }

  showFlashMessage(message: any, type: any): void {
    /**
     * TODO: Use a new implementation for flash messages, current implementation is old,
     * doesnt support stacking and is not upto style guide standards.
     */
    this.ngFlashMessageService.showFlashMessage({
      messages: [message],
      dismissible: true,
      timeout: 3000,
      type,
    });
  }

  showNewFlashMessage(message: any, type: any): void {
    this.toast.show({
      type: type, text: message,
      undo: false,
      undoFN: function (callback?: (n: number) => any): void {
        throw new Error('Function not implemented.');
      }
    });
  }

  showNewFlashMessageWithUndo(message: any, type: any, undoFN): void {
    this.toast.show({
      type: type, text: message, undo: true, undoFN: undoFN
    });
  }

  setGeneralSettings(data: any): void {
    this.getgeneralsettingsObject = data;
  }

  getGeneralSettings(): any {
    return this.getgeneralsettingsObject;
  }

  /* Get Current logged user details
   * created: 07-Nov-2019
   * author: Karnakar
   */
  getCurrentLoggedUserDetails(): Observable<any> {
    const apiUrl =
      AppConstants.Ehub_Rest_API +
      'usersNew/getUserProfile';
    return this.httpClient
      .get(apiUrl, { params: { listType: 'Alert Status' } })
      .pipe(retry(0), catchError(this.handleError));
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
    return throwError(
      error.error.responseMessage
        ? error.error.responseMessage
        : 'Something bad happened; please try again later.'
    );
  }

  downloadDocument(params: any): Observable<ArrayBuffer> {
    const apiUrl =
      AppConstants.Ehub_Rest_API +
      'documentStorage/downloadDocument';
    return this.httpClient
      .get(apiUrl, { params, responseType: 'arraybuffer' })
      .pipe(
        retry(0), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  callFilterFromAgingChart(obj: any): void {
    this.alertAgingChartFilterObservable.next(obj);
  }

  callFilterFromSourceMangeDomainSearch(obj: any): void {
    this.sourceMangeDomainSearchChartFilterObservable.next(obj);
  }

  getPermissions(): any[] {
    if (!this.permissions.length) {
      this.setPermissions();
    }
    return this.permissions;
  }

  setPermissions(): void {
    this.commonServicesService.getPermissionIds().subscribe((data) => {
      this.permissions = data;
    });
  }

  getSystemSettings(): any {
    if (!this.systemSettings) {
      this.systemSettings = this.commonServicesService.getSystemSettings();
    }
    return this.systemSettings;
  }

  // @reason: get the selected date format from system settings
  // @author: ammshathwan
  // @date: 28/1/2022
  getDateFormart() {
    this.getSystemSettings().then((data) => {
      if (data) {
        if (data["Case Settings"]) {
          data["Case Settings"].forEach((setting) => {
            if (setting && setting.selectedValue && setting.name === "Date Time Format") {
              this.dateFormatObservable.next(setting.selectedValue)
            }
          });
        }
      }
    });
  }

  // @reason: reset filters in ag grid table
	   // @author: ammshathwan
   // @date: 17 feb 2022
   resetFilters(gridApi , colId):void{
    if(gridApi && colId){
      gridApi.destroyFilter(colId);
    }
  }

  entitesValue(value: any): void {
    this.totalEntites.next(value);
  }

  getMinimizedPopValue(value: any): void {
    this.enableMiniMizedModal.next(value);
  }

  maxMinizedProcessingModal(value: any): void {
    this.maxiMinzeProcessingScreen.next(value);
  }

  setscreeningData(value: any): void {
    this.screeningCompleted.next(value);
  }

  displayNotificationBar(isShow: boolean, ntfType:string, msg:string, isBtn: boolean, btnTxt: string): void {
    this.isDisplayNotificationBar.next({isShow, ntfType, msg, isBtn, btnTxt});
  }

  public getAssetsFile(fileUrl: string) {
    return this.httpClient.get(`assets/${fileUrl}`).pipe(first())
  }

}
