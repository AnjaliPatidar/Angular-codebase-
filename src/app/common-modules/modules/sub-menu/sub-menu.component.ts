import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { Router, Event, NavigationEnd, ActivatedRoute } from "@angular/router";
import { CommonServicesService } from "../../services/common-services.service";
import { SharedServicesService } from "../../../shared-services/shared-services.service";
import { BreadcrumbComponent } from "./breadcrumb/breadcrumb.component";
import { AppConstants } from "../../../app.constant";
import { TopPanelConstants } from "../../../modules/entity/constants/top-panel-constants";
import { TranslateService } from "@ngx-translate/core";
import { ScreeningBatchFileComponent } from "../ag-grid-table/modals/screening-batch-file/screening-batch-file.component";
import { AlertondemandsearchComponent } from "../ag-grid-table/modals/alertondemandsearch/alertondemandsearch.component";
import { MatDialog } from "@angular/material/dialog";
import { GlobalConstants } from "@app/common-modules/constants/global.constants";
import { CaseManagementService } from "@app/modules/case-management/case-management.service";
import { Observable } from "rxjs";
import { CaseDetailInfoService } from "../ag-grid-table/modals/case-detail-info/case-detail-info.service";
import { last } from "lodash-es";
import { WINDOW } from "../../../core/tokens/window";
@Component({
  selector: "app-sub-menu",
  templateUrl: "./sub-menu.component.html",
  styleUrls: ["./sub-menu.component.scss"],
})
export class SubMenuComponent implements OnInit {
  @ViewChild(BreadcrumbComponent, { static: false })
  breadCrumb: BreadcrumbComponent;
  route: string = "uiyg";
  breadcrumbList: Array<any>;
  routeLinks: number;
  count: number;
  public generateButton = true;
  public gridOptions: any;
  public path: Array<any>;
  public breadcrumb: any;
  currentUrl = "";
  public currentState: any;
  listUrl: Array<any> = [];
  showAddSource: boolean = false;
  selectedLanguage = "en";
  public permisionIds: any = [];
  public caseDashboardPermissionJSON: any = {};
  public caseWorkBenchPermissionJSON: any = {};
  public dashboardName: any;
  public displaySearch: boolean = false;
  public displayCustomizeLayout: boolean = false;
  public showMyEntityClipboard: boolean = false;
  public componentName = "caseDashboard";
  public submenu = {
    activeMenu: "",
    activeDropdown: 0,
    dashboardName: "",
    isUploadQuestionaire: false,
    fetchingcaseDocuments: false,
    reassignment: false,
    countAllCaseStatus: [
      {
        label: "CASE IN FOCUS",
        value: 42,
      },
      {
        label: "CASE RESOLVED",
        value: 2,
      },
      {
        label: "CASE FORWARED",
        value: 4,
      },
      {
        label: "CASE DELAYED",
        value: 75,
      },
      {
        label: "TOTAL ENTITIES",
        value: 23,
      },
      {
        label: "ENTITIES IN FOCUS",
        value: 22,
      },
    ],
    hoverdashboardName: "",
    submenuWidth: 0,
    subMenuContent: 0,
    iconColorClass: ["light", "medium", "dark"],
  };
  public onBoarding = AppConstants.rootPath + "#/enrich?onBoard=true";
  isLightTheme = false;
  public fileSizeFromSystemSettings: any = 20;

  isCustomize = false;
  newSourceManagementPermissionJSON: any;
  disableAddWidget$: Observable<boolean>;

  showGenerateCaseReportButton = false;

  constructor(
    private _commonService: CommonServicesService,
    private translateService: TranslateService,
    public _sharedService: SharedServicesService,
    public _caseService: CaseManagementService,
    private location: Location,
    private router: Router,
    private cmnSrvc: CommonServicesService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private caseDetailInfoService: CaseDetailInfoService,
    @Inject(WINDOW) private readonly window: Window
    // TODO: check if it used
  ) {
  }

  public displayUtilityPanel: boolean;
  public screeningOptions: any = {
    ods: { disable: false },
    ssb: {
      show: true,
      icon: "",
      text: "",
    },
  };
  ngOnInit() {
    this.checkTheDisableStatusOfAddWidgetBtn();
    this.permisionIds =
      GlobalConstants.permissionJson &&
      GlobalConstants.permissionJson[0] &&
      GlobalConstants.permissionJson[0]["alertsData"]
        ? GlobalConstants.permissionJson[0]["alertsData"]
        : "";

    this.getCaseListPermssionIds();
    this.getNewSourceManagementPermssionIds();

    let path = this.location.path().split("/");
    let resp = GlobalConstants.systemsettingsData;
    resp["General Settings"].map((val) => {
      if (val.section == "Theme") {
        if (
          (val.defaultValue &&
            val.defaultValue == "Light Theme" &&
            path[path.length - 1] === "alertsList") ||
          path[path.length - 1] === "feedList"
        ) {
          this.isLightTheme = true;
        }
      }
    });

    if (resp && resp["General Settings"] && resp["General Settings"].length) {
      this.fileSizeFromSystemSettings = resp["General Settings"]
        .map((val) => {
          if (val && val.name && val.name == "Maximum file size allowed") {
            return val;
          }
        })
        .filter((v) => {
          return v;
        })[0].selectedValue;

      if (this.fileSizeFromSystemSettings.indexOf("MB")) {
        this.fileSizeFromSystemSettings = Number(
          this.fileSizeFromSystemSettings.split("MB")[0]
        );
      }
    }

    this.cmnSrvc.screeningOptionsForSubmenuObserver.subscribe((options) => {
      this.screeningOptions = options;
    });

    this.displayUtilityPanel = false;
    if (
      this.activatedRoute &&
      this.activatedRoute["_routerState"] &&
      this.activatedRoute["_routerState"].snapshot.url
    ) {
      this.currentUrl = this.activatedRoute["_routerState"].snapshot.url;
      this.currentState = this.currentUrl.split("/");
    } else {
    }

    if (this.currentUrl) {
      this.breadNavButtonState();
    }

    this.router.events.subscribe(
      (event: Event) => {
        if (event instanceof NavigationEnd) {
          this.currentUrl = event.url;
          this.currentState = this.currentUrl.split("/");
          this.breadNavButtonState();
        }
      },
      (err) => {}
    );

    this.getLanguage();
  }

  checkTheDisableStatusOfAddWidgetBtn(): void {
    this.disableAddWidget$ = this._commonService.getAddWidgetBtnDisableStatus();
  }

  breadNavButtonState() {
    if (this.currentUrl == "/element/alert-management/accordianList") {
      this.displaySearch = true;
    } else {
      this.displaySearch = false;
    }

    if (this.currentUrl == "/element/case-management/caseDashboard") {
      this.displayCustomizeLayout = true;
    } else {
      this.displayCustomizeLayout = false;
    }
    if (this.currentUrl.split("/")[2] === "sourceManagement") {
      this.showAddSource = true;
    } else {
      this.showAddSource = false;
    }
    if (this.currentUrl.split("/")[2] === "newSourceManagement") {
      this.showAddSource = true;
    } else {
      this.showAddSource = false;
    }
    if (this.currentUrl.includes('/element/case-management/case/')) {
      this.showGenerateCaseReportButton = true;
    } else {
      this.showGenerateCaseReportButton = false;
    }
  }

  async getLanguage() {
    let getLanguageData = (language) => {
      const key = this._commonService.get_language_name(language);
      const filename = key + "_sub_menu.json";
      const param = {
        fileName: filename,
        languageName: language,
      };
      const url =
        AppConstants.Ehub_Rest_API +
        "fileStorage/downloadFileByLanguageAndFileName?fileName=" +
        param.fileName +
        "&languageName=" +
        param.languageName;
      this.translateService.setDefaultLang(
        AppConstants.Ehub_Rest_API +
          "fileStorage/downloadFileByLanguageAndFileName?fileName=en_sub_menu.json&languageName=English"
      );
      this.translateService.use(url).subscribe(
        (res) => {
          this._commonService.sendLanguageJsonToComponents(res);
          GlobalConstants.localizationFiles.isSubmenuLoaded = true;
          GlobalConstants.languageJson = res;
        },
        (error) => {
          if (error.status == 404 && key == "de") {
            this._sharedService.showFlashMessage(
              "german file not found, loading default language..",
              "danger"
            );
            getLanguageData("english");
          } else if (error.status == 404 && key == "en") {
            setTimeout(() => {
              this._sharedService.showFlashMessage(
                "english file " + error.url + " is missing",
                "danger"
              );
            }, 3000);
          }
        }
      );
    };
    if (GlobalConstants.systemSettings["ehubObject"]["language"]) {
      getLanguageData(GlobalConstants.systemSettings["ehubObject"]["language"]);
    } else {
      this._sharedService.getSystemSettings().then(async (systemSettings) => {
        if (systemSettings) {
          this.manipulateLanguageSettings(systemSettings, getLanguageData);
        } else {
          try {
            const resp = await this._commonService.getSystemSettings();
            if (resp) {
              this.manipulateLanguageSettings(resp, getLanguageData);
            }
          } catch (error) {
            throw error;
          }
        }
      });
    }
  }

  manipulateLanguageSettings(settings: any, getLanguageData: any): void {
    settings["General Settings"].map((val) => {
      if (val.name === "Languages") {
        if (val.selectedValue) {
          getLanguageData(val.selectedValue);
        }
      }
    });
  }

  openSSBStatusBar() {
    let modalEle: any = document.getElementsByClassName(
      "cdk-overlay-container"
    )[0];
    modalEle.style.display = "block";
    this.screeningOptions = {
      ods: { disable: true },
      ssb: {
        show: false,
        icon: "hourglass_empty",
        text: "Upload...",
      },
    };
  }

  switchLanguage(event) {
    this.translateService.use(event);
  }

  entityClipboard() {
    this.showMyEntityClipboard = !this.showMyEntityClipboard;
    TopPanelConstants.isFromEntitySection = false;
    TopPanelConstants.isUploadFromEntitySection = false;
    TopPanelConstants.entityselection = "";
    TopPanelConstants.clipBoardObject.file_wraper = "";
  }
  openAddSourceModal() {
    this.cmnSrvc.addSource.next(true);
  }

  displayPanel() {
    this.displayUtilityPanel = true;
    document.getElementById("body").classList.add("body-filter");
  }
  onParentHidePanel(e) {
    this.displayUtilityPanel = false;
    document.getElementById("body").classList.remove("body-filter");
  }

  displayIDVQuestionnaire() {
    var Generate_report_Survey_URL = this._sharedService.getGeneralSettings();
    var generate_report_surveyUrl =
      AppConstants.Generate_report_Survey_URL.replace(
        "{serveyID}",
        Generate_report_Survey_URL.qbServeyID
      );
    this.window.open(
      generate_report_surveyUrl +
        AppConstants.Ehubui_token +
        "&entityId=" +
        Generate_report_Survey_URL.identifier,
      "_blank"
    );
  }
  generateReport() {
    document.getElementById("enableGenerateReportComponent").click();
  }

  /**Open screening batch file modal
   * Author : karunakar
   * Date : 30-Jan-2020
   */

  openScreeningBatchFileModal() {
    this.cmnSrvc.getDataFromComponentBehaveObserver.subscribe((resp) => {
      this.gridOptions = resp;
    });
    const dialogRef = this.dialog.open(ScreeningBatchFileComponent, {
      disableClose: true,
      panelClass: [
        "user-popover",
        "custom-scroll-wrapper",
        "bg-screening",
        "light-theme",
      ],
      backdropClass: "modal-background-blur",
      data: {
        operation: "screening batch file",
        gridOptions: this.gridOptions,
        fileSizeFromSystemSettings: this.fileSizeFromSystemSettings,
      },
    });
  }
  openAlertOndemandModal() {
    const dialogRef = this.dialog.open(AlertondemandsearchComponent, {
      disableClose: false,
      panelClass: [
        "user-popover",
        "custom-scroll-wrapper",
        "bg-screening",
        "light-theme",
      ],
      backdropClass: "modal-background-blur",
      data: {},
    });
  }

  /* purpose: Change customize layout status so that it could affect case-dashboard settings
   * created: 14 Oct 2020
   * author: Ashen
   */

  customizeLayout() {
    this.isCustomize = !this.isCustomize;
    this._commonService.toggleCustomizeLayout(this.isCustomize);
  }

  /* purpose: Change customize layout status  - click ADD NEW button to add a new widget to case-dashboard
   * created: 14 Oct 2020
   * updated: 18 Dec 2020
   * author: Ashen
   */
  addNewWidget() {
    this._commonService.sendNewWidgetStatus(true);
    this._commonService.setAddWidgetBtnDisableStatus(true);
  }

  getCaseListPermssionIds() {
    const permissions: any[] = this._sharedService.getPermissions();
    if (permissions.length) {
      this.caseDashboardPermissionJSON = permissions[1].caseManagement.caseDashboard;
      this.caseWorkBenchPermissionJSON = permissions[1].caseManagement.caseWorkbench;
    }
  }

  getNewSourceManagementPermssionIds() {
    const permissions: any[] = this._sharedService.getPermissions();
    if (permissions.length) {
      this.newSourceManagementPermissionJSON =
        permissions[0].newSourceManagement;
    }
  }

  generateCaseTimeInStatusReport() {
    // extract case id from current url since activatedRoute has a different context.
    if (this.router.url.includes('case')) {
      const urlComponents: string[] = this.router.url.trim().split('/');
      const caseId: any = last(urlComponents); //get the last character which is the case id

      if (!isNaN(caseId)) { //make sure its a number
        this.caseDetailInfoService.toggleCaseDetailInfoLoader.next(true);
        this._caseService.generateCaseTimeInStatusReport(Number(caseId)).subscribe(res => {
          this.caseDetailInfoService.toggleCaseDetailInfoLoader.next(false);
          const fileURL = URL.createObjectURL(res);
          const printWindow = this.window.open(fileURL, "", "height=600,width=1000,'noopener'");

          if (printWindow) {
            printWindow.print(); //trigger the print command
          } else { // if user has not enabled popups in the browser.
            this._sharedService.showFlashMessage(
              "Please allow pop-ups on your browser and try again.",
              "danger"
            );
          }
        }, err => {
          this.caseDetailInfoService.toggleCaseDetailInfoLoader.next(false);
        });
      }
    }
  }

}
