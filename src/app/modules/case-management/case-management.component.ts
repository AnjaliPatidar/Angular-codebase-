import { Component, OnDestroy, OnInit } from '@angular/core';
import { CaseManagementService } from './case-management.service';
import { AppConstants } from '@app/app.constant';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
@Component({
  selector: 'app-case-management',
  templateUrl: './case-management.component.html',
  styleUrls: ['./case-management.component.scss'],
})
export class CaseManagementComponent implements OnInit, OnDestroy {
  constructor(
    public caseManagementService: CaseManagementService,
    private commonService: CommonServicesService,
    private translateService: TranslateService,
    private sharedService: SharedServicesService
  ) { }

  removedElems = [];
  isNewWidgetOpen = false;
  showFullPageLoader: boolean = false;
  ngOnInit(): void {
    this.getCaseCopyLoaderState();
    this.getLanguage();
    this.checkAddNewWidgetModalIsOpen();

    // Initialize case batch upload status websocket
    this.initializeCaseBatchUploadWS();
  }

  ngOnDestroy(): void {
    this.caseManagementService.disconnectCaseBatchUploadConnections();
  }

  checkAddNewWidgetModalIsOpen(){
    this.commonService.addNewWidgetBehaviorObserver.subscribe((res)=>{
        this.isNewWidgetOpen = res;
    })
  }

  getLanguage(): void {
    if (GlobalConstants.systemSettings.ehubObject.language) {
      this.getLanguageData(GlobalConstants.systemSettings.ehubObject.language);
    } else {
      this.sharedService.getSystemSettings().then(settings => {
        if (settings) {
          settings['General Settings'].map((val: any) => {
            if (val.name === 'Languages') {
              if (val.selectedValue) {
                this.getLanguageData(val.selectedValue);
              }
            }
          });
        }
      });
    }
  }

  getLanguageData(language: any): void {
    const key: 'en' | 'de' = this.commonService.get_language_name(language);
    const filename: string = key + '_case_management.json';
    const param: any = {
      fileName: filename,
      languageName: language
    };

    const url: string =
      AppConstants.Ehub_Rest_API +
      'fileStorage/downloadFileByLanguageAndFileName?fileName=' +
      param.fileName +
      '&languageName=' +
      param.languageName;

    this.translateService.use(url).subscribe(
      (res) => {
        this.caseManagementService.getTranslationjsonObservable.next(res);
        this.commonService.sendLanguageJsonToComponents(res);
        this.getModuleJsonData(res);
      },
      (error) => {
        if (error.status === 404 && key === 'de') {
          this.sharedService.showFlashMessage(
            'german file not found, loading default language..',
            'danger'
          );
          this.getLanguageData('english');
        } else if (error.status === 404 && key === 'en') {
          setTimeout(() => {
            this.sharedService.showFlashMessage(
              'english file ' + error.url + ' is missing',
              'danger'
            );
          }, 3000);
        }
      }
    );
  }

  getModuleJsonData(translateResponse: any): void {
    GlobalConstants.languageJson = translateResponse;
    this.commonService.sendLanguageJsonToComponents(translateResponse);
  }

  /**
   * Start listening to case batch upload live update websocket
   */
  initializeCaseBatchUploadWS() {
    const ehubObject = JSON.parse(localStorage.getItem("ehubObject"));
    const path = JSON.parse(localStorage.getItem("paths"));

    if (path && ehubObject && path.WEB_SOCKET_PATH && ehubObject['userId']) {
      this.caseManagementService.initializeBatchUploadWS(path.WEB_SOCKET_PATH, ehubObject['userId']);
    }
  }
   getCaseCopyLoaderState(){
    this.caseManagementService.copyCaseLoaderObserver.subscribe((state)=>{
      this.showFullPageLoader = state;
    })
   }
}
