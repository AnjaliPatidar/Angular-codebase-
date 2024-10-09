import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  Inject,
} from "@angular/core";
import { GeneralSettingsApiService } from "./services/generalsettings.api.service";
import { SharedServicesService } from "../../shared-services/shared-services.service";
import { LogomodalComponent } from "./modals/logomodal/logomodal.component";
import { EnableAndDisableAlertmodalComponent } from "./modals/enable-and-disable-alertmodal/enable-and-disable-alertmodal.component";
import { ConfirmaionmodalComponent } from "./modals/confirmaionmodal/confirmaionmodal.component";
import { ConfirmationEditEntityworkflowsComponent } from "./modals/confirmationEditEntityworkflows/confirmationEditEntityworkflows.component";
import { UploadCSVComponent } from "./modals/upload-csv/upload-csv.component";
import { saveAs } from "file-saver";
import { Observable, Subject, merge, Subscription, iif, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { GlobalConstants } from "@app/common-modules/constants/global.constants";

import * as d3 from "d3";
import {
  NgbAccordion,
  NgbModal,
  NgbTypeahead
} from "@ng-bootstrap/ng-bootstrap";
import { CommonServicesService } from "@app/common-modules/services/common-services.service";
import { TranslateService } from "@ngx-translate/core";
import { AppConstants } from "@app/app.constant";
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { ReportFooterModalComponent } from "./modals/report-footer-modal/report-footer-modal.component";
import { TagColumnComponent } from "./components/tag-column/tag-column.component";
import { SubTagsColumnComponent } from "./components/sub-tags-column/sub-tags-column.component";
import { TagActionColumnComponent } from "./components/tag-action-column/tag-action-column.component";
import { AgGridTableService } from "@app/common-modules/modules/ag-grid-table/ag-grid-table.service";
import {ThemeBuilderService} from '@app/modules/systemsetting/services/theme-builder.service';
import { WINDOW } from "../../core/tokens/window";
@Component({
  selector: "app-systemsetting",
  templateUrl: "./systemsetting.component.html",
  styleUrls: ["./systemsetting.component.scss"],
})
export class SystemsettingComponent implements OnInit, AfterViewInit {
  public systemsettingObject: any = {
    settingsloader: "",
    isSettingsError: false,
    generalDefaultExists: false,
    generalUserInteractionExists: false,
    indexPosition: "General Settin:",
    nameOfIcon: "",
    nameOfColor: "",
    dataToShowAsperList: [],
    indicatorList: [],
    alertIndicatorList: [],
    currentindicatorList: [],
    currentAlertIndicatorList: [],
    operator: [],
    period: [],
    entityWorkFlowList: [],
    answerToshowInTable: [],
    selectedValueAsperList: "",
    selectedStatusOnDropdown: "",
    modalInstanceDel: "",
    modalInstanceAdd: "",
    modalInstanceDis: "",
    modalInstanceUploadCsv: "",
    deleteObjValue: {},
    storeBeforeEditing: {},
    colorList: [],
    iconList: [],
    languageList: [],
    nameOfFlag: "",
    addColorIconObj: {},
    jurisdictionList: [],
    setJurisdiction: {},
    addDisplayName: "",
    codeTodisplay: "",
    AlertPriority: {},
    alertToggleData: {},
    groupsUserManagement: {},
    userManagementRegulationTabl: {},
    typesOfUserManagementRegulation: [],
    fileName: "",
    filteredArrayRegionalSetting: true,
    inputEnteredValLangua: "",
    settingLaguageObjec: {},
    selectedIconSource: "",
    selectedFlagSource: "",
    themeSelect: "",
    selectedVal: {},
    settingsData: {},
    userRegulationIndexDetails: {},
    isTwoWayAuthEnabled: false,
    inputEnteredValLanguage: {},
    selected_Language: "",
    backupSelectedLanguage: "",
    showAdddLanguageJSon: false,
    themeType: "",
    AllThemesOfUser: [],
    appliedTheme: "",
    pickrColors: {
      primary: "#3eb6ff",
      textOnPrimary: "#fbfbfb",
      backGround: "#383838",
      textOnBackground: "#fbfbfb",
      surface: "#2d2d2d",
      textOnSurface: "#fbfbfb",
      inputGroup: "rgba(251,251,251,.08)",
      informationAlert: "#000000",
      errorAlert: "#ef5350",
      warningAlert: "#e6ae20",
      successAlert: "#00796b",
      fontFamily: "font-roboto",
      rootFontSize: "10px",
      componentCornerRadius: "10px",
      selected: false,
      themeName: "New Theme",
      userId: GlobalConstants.systemSettings.ehubObject["userId"],
      themeId: "",
    },
    searchtxt: {},
    entityType: [],
    entityStatus: [],
    reasonsData: [],
    allStatusData: [],
    status: true,
    routingtableList: [],
    all_Jurisdictions: [],
    filterStates: [],
    tentants: [],
    selectedTenant: [],
    addEditTeanantObject: {
      country: '',
      slectedIndex: -1,
      disableTenantAddButton: false,
    },
    temporaryselectedTenant: [],
    routingtempSet: {},
    reportLogosettingID: "",
    indicatorObject: {
      daysValue: "",
      period: "",
      operator: "",
      code: "",
    },
    list: "Case Risk",
    feedList: "Feed Classification",
    caseRiskIndicator: {},
    periodValue: "Year",
    notAllowed: true,
    indicatorDrop: [],
    alertIndicatorDrop: [],
    feedClassificationDrop: [],
    entityTypeDrop: [],
    workFlowDrop: [],
    tenantMode: "",
    entityWorkFlowSort: 'asc'
  };
  public filteredjurisdiction: any = [];
  public brandSettingId: any;
  public keysPattern = [
    this.translateService.instant('General Settings'),
    this.translateService.instant('Mail Settings'),
    this.translateService.instant('List Management Settings'),
    this.translateService.instant('Document Management'),
    this.translateService.instant('Alert Management Settings'),
    this.translateService.instant('Case Settings'),
    this.translateService.instant('User Management Regulation'),
    this.translateService.instant('App Settings'),
    this.translateService.instant('Entity Settings')
  ];
  public selectedEntity = "";
  public selectedEntityStatus = "";
  public selectedEntityStatusKey: any;
  public mockupdata = {
    results: [
      {
        entity_status_id: 1000,
        entity_name: "case",
        status_key: "new",
        status_value: "New",
        reasons: [
          { reason_id: 2000, reason_code: "ABC", reason: "aaaa" },
          { reason_id: 2001, reason_code: "ASA", reason: "ASA" },
        ],
      },
      {
        entity_status_id: 1001,
        entity_name: "case",
        status_key: "reaseach",
        status_value: "Reaseach",
        reasons: [
          { reason_id: 2002, reason_code: "DDD", reason: "aaaa" },
          { reason_id: 2003, reason_code: "TTT", reason: "TTT" },
        ],
      },
      {
        entity_status_id: 1002,
        entity_name: "alert",
        status_key: "1005",
        status_value: "Outreach",
        reasons: [
          { reason_id: 2004, reason_code: "LL", reason: "fgfdg" },
          { reason_id: 2005, reason_code: "GG", reason: "puiuyippp" },
        ],
      },
      {
        entity_status_id: 1002,
        entity_name: "alert",
        status_key: "treach",
        status_value: "treach",
        reasons: [
          { reason_id: 2004, reason_code: "LL", reason: "fg" },
          { reason_id: 2005, reason_code: "GG", reason: "pui" },
        ],
      },
    ],
  };
  public focus$ = new Subject<string>();
  public click$ = new Subject<string>();
  public model;
  public p2;
  public showEntityTypeListManagementDropdown = false;
  public selectedEntityTypeListManagement: ListManagementEntityStatusType;
  TenantseparatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTenants: Observable<string[]>;
  tenantAuocompleteModel = "";
  private subscriptions = new Subscription();


  tagColumnDefs = [];
  tagGridOptions;
  showTagGridTable = false;
  componentName = 'tagList';
  
  @ViewChild("tenantsInput", { static: false }) tenantsInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild("tenantAuocompleteRef", { static: false })
  matAutocompleteTenat: MatAutocomplete;
  @ViewChild("instance", { static: true }) public instance: NgbTypeahead;
  @ViewChild("leftsideaccordian", { static: false })
  public leftsideaccordian: NgbAccordion;
  selectedJurisdiction: any;

  alertListType: any = "Alert Risk";
  isFeedBackListChanged: boolean = false;
  permissionIds: any;
  constructor(
    public generalSettingsApiService: GeneralSettingsApiService,
    public _sharedService: SharedServicesService,
    public modalservice: NgbModal,
    private _commonServices: CommonServicesService,
    private translateService: TranslateService,
    private _agGridTableService: AgGridTableService,
    private themeService: ThemeBuilderService,
    @Inject(WINDOW) private readonly window: Window
  ) {
    this.loadStatusReasons();
  }

  ngOnInit() {
    this.getComponentPermissionIds()
    this.loadGeneralSettings(true);
    this.getLanguage();
    this.getTableData('Jurisdictions', 'noActiveLoading');
    this.getTableData('Tenant', 'noActiveLoading'); // load the tenants at page loading
    this.systemsettingObject.operator = ["Up to"];
    this.systemsettingObject.period = ["Day", "Month", "Year"];

    //Alert indicator settings
    this.systemsettingObject.alertIndicatorOperator = ["Up to", "Above"];
    this.systemsettingObject.alertIndicatorPeriod = ["Days", "Months", "Years", "Weeks"];
  }
  /*
   * @purpose: function to bind the entity type and status on pageload
   * @created: 23 July 2020
   * @author:  shravani
   */
  loadStatusReasons() {
    let data = null;
    this.generalSettingsApiService
      .getAllStatusReasons(data)
      .then((response: any) => {
        if (response) {
          this.systemsettingObject.allStatusData =
            response && response.result ? response.result : [];
          this.systemsettingObject.entityType = Array.from(
            new Set(
              this.systemsettingObject.allStatusData.map(
                (item) => item.entity_name
              )
            )
          );
          this.selectedEntity = this.systemsettingObject.entityType.sort()[0];
          this.filterStatusReasons(
            this.selectedEntity,
            this.selectedEntityStatus,
            "load"
          );
        }
      });
  }

  private getLanguageData(language) {
    const key = this._commonServices.get_language_name(language);
    const filename = key + "_systemSettings.json";
    const param = {
      fileName: filename,
      languageName: language
    };
    let url =
        AppConstants.Ehub_Rest_API +
        "fileStorage/downloadFileByLanguageAndFileName?fileName=" +
        param.fileName +
        "&languageName=" +
        param.languageName;
    this.translateService.setDefaultLang(AppConstants.Ehub_Rest_API + 'fileStorage/downloadFileByLanguageAndFileName?fileName=en_systemSettings.json&languageName=English');
    this.translateService.use(url).subscribe(
        (res) => {
          GlobalConstants.languageJson = res;
          this._commonServices.sendLanguageJsonToComponents(res);
          GlobalConstants.localizationFiles.isMainModuleLoaded = true;
        },
        (error) => {
          if (error.status == 404 && key == "de") {
            this._sharedService.showNewFlashMessage(
                "german file not found, loading default language..",
                "danger"
            );
            this.getLanguageData("english");
          } else if (error.status == 404 && key == "en") {
            setTimeout(() => {
              this._sharedService.showNewFlashMessage(
                  "english file " + error.url + " is missing",
                  "danger"
              );
            }, 3000);
          }
        }
    );
  };

  getLanguage() {
    if (GlobalConstants.systemSettings["ehubObject"]["language"]) {
      this.getLanguageData(GlobalConstants.systemSettings["ehubObject"]["language"]);
    } else {
      this._commonServices
        .getSystemSettings()
        .then((resp) => {
          resp["General Settings"].map((val) => {
            if (val.name == "Languages") {
              if (val.selectedValue) {
                this.getLanguageData(val.selectedValue);
              }
            }
          });
        })
        .catch((error) => { });
    }
  }
  loadGeneralSettings(search) {
    if (!search) {
      this.systemsettingObject.settingsloader = true;
    }
    this.systemsettingObject.generalDefaultExists = false;
    this.systemsettingObject.generalUserInteractionExists = false;
    this.systemsettingObject.isGeneralError = false;
    this.systemsettingObject.isReportError = false;
    this.systemsettingObject.isRegionalError = false;
    this.systemsettingObject.isMailError = false;
    this.systemsettingObject.selectedVal = {};
    // end of defining scope variables
    // To sort an Array

    this.generalSettingsApiService.getLanguageList().then((response) => {
      this.systemsettingObject.languageList = response;
    });

    iif(() => !!this.translateService.currentLang, of(this.translateService.currentLang), this.translateService.onLangChange).subscribe(() => {
      this.generalSettingsApiService
          .getGeneralSettings()
          .then(async (response: any) => {
            //   var response =systemsetting;
            var data = [];
            var keys = Object.keys(response);
            if (response) {
              var QBData = [];

              // Removing xls upload feature as the backend is not supported RD-8917
              if( Array.isArray(response["Alert Management Settings"]) ) {
                response["Alert Management Settings"] = response["Alert Management Settings"].filter(
                    data => data.settingId !== 306
                )
              }

              if(response["Entity Settings"] && response["Entity Settings"][0]) {
                response["Entity Settings"].forEach(es => {
                  if (es.name === 'UBO Percentage' || es.name === 'Level One' || es.name === 'Level Two and above') {
                    es.options.forEach(selectOp => {
                      selectOp.attributeName = parseInt(selectOp.attributeName.substr(0, selectOp.attributeName.length - 1));
                    });
                  }
                });
              }

              try{
                QBData = await this.generalSettingsApiService.getSystemSettingsQB();
              }catch(err){
              }

              if(QBData){
                var index = response["General Settings"].findIndex((i)=>{
                  return i.name == "Questionnaries"
                })

                var index_QB = QBData.findIndex((i)=>{
                  return i.name == "Questionnaries"
                })

                if( index_QB > -1) {response["General Settings"][index] = QBData[index_QB]}

                index = response["General Settings"].findIndex((i)=>{
                  return i.name == "Onboarding Questionnaire"
                })

                index_QB = QBData.findIndex((i)=>{
                  return i.name == "Onboarding Questionnaire"
                })

                if( index_QB > -1) {response["General Settings"][index] = QBData[index_QB]}
              }

              response["General Settings"].forEach((setting) => {
                if (setting.section == "Branding") {
                  if (setting.name == "Company Logo") {
                    this.brandSettingId = setting.settingId;
                  } else if (setting.name == "Report Logo") {
                    this.systemsettingObject.reportLogosettingID =
                        setting.settingId;
                  }
                }
              });

              this.systemsettingObject.groupsUserManagement = {};

              keys.forEach((value) => {
                if (response[value]) {
                  response[value] = d3
                      .nest()
                      .key((d: any) => {
                        return d.section;
                      })
                      .entries(response[value]);
                } else {
                  delete response[value];
                }

                response[value].forEach((values) => {
                  values.values.forEach((val, k) => {
                    if (value == "User Management Regulation") {
                      if (
                          val.name.split("-")[1] == "Users" ||
                          val.name.split("-")[1] == "Roles" ||
                          val.name.split("-")[1] == "Groups"
                      ) {
                        var groupName = val.name.split("-")[0];
                        if (
                            !this.systemsettingObject.groupsUserManagement[groupName]
                        ) {
                          this.systemsettingObject.groupsUserManagement[
                              groupName
                              ] = [];
                        }
                        this.systemsettingObject.groupsUserManagement[
                            groupName
                            ].push({ [val.name.split("-")[1]]: val });
                        this.systemsettingObject.typesOfUserManagementRegulation.push(
                            val.name.split("-")[1]
                        );
                      }
                    }
                    if (val.name == "List Type") {
                      this.systemsettingObject.selectedValueAsperList =
                          val.selectedValue;
                      this.getTableData(val.selectedValue, "ListTable");

                    }
                    if (val.name == "Entity" && val.section == "Indicator") {
                      this.getIndicatorList("case risk");
                    }

                    if (val.section == "Alert Indicators" && val.name == "Time In Status") {
                      this.getFeedClassificationList();
                      this.getAlertIndicator();

                    }
                    if (val.section == "Theme") {
                      this.systemsettingObject.themeSelected = val.defaultValue;
                      if (val.defaultValue) {
                        this.themeService.setAppliedThemeName(val.defaultValue);
                        this.systemsettingObject.appliedTheme = val.defaultValue;
                      }
                    }
                    if (val.section == "Entities Workflows") {
                      this.systemsettingObject.entityTypeDrop = val.options;
                      this.getWorkflows();
                    }

                    if (val.type == "Autocomplete") {
                      if (this.systemsettingObject.languageList.length) {
                        var selectedLangObj = this.systemsettingObject.languageList.find(
                            function (value) {
                              return (
                                  value.displayName.toLowerCase() ==
                                  val.selectedValue.toLowerCase()
                              );
                            }
                        );
                        selectedLangObj
                            ? this.window.localStorage.setItem(
                            "langKey",
                            selectedLangObj.displayName
                            )
                            : "";
                        if (selectedLangObj.flagName) {
                          this.systemsettingObject.selectedIconSource = "";
                          this.systemsettingObject.selectedFlagSource =
                              "vendor/jquery/flags/1x1/" +
                              selectedLangObj.flagName.toLowerCase() +
                              ".svg";
                        } else {
                          this.systemsettingObject.selectedFlagSource = "";
                          this.systemsettingObject.selectedIconSource =
                              selectedLangObj.icon;
                        }
                        this.systemsettingObject.selected_Language =
                            selectedLangObj && selectedLangObj.displayName
                                ? selectedLangObj
                                : "";
                        this.systemsettingObject.backupSelectedLanguage =
                            selectedLangObj && selectedLangObj.displayName
                                ? selectedLangObj
                                : "";
                      }
                    }
                    if (val.name == "Predefined answers for :") {
                      this.systemsettingObject.selectedStatusOnDropdown =
                          val.selectedValue;
                      this.getTableData(val.selectedValue, "AnswerTable");
                    }
                    if (
                        val.name == "PEP High Slider" ||
                        val.name == "PEP Low Slider" ||
                        val.name == "PEP Medium Slider" ||
                        val.name == "Sanction Medium Slider" ||
                        val.name == "Sanction High Slider" ||
                        val.name == "Sanction Low Slider" ||
                        val.name == "Time Status High Slider (Short Term)" ||
                        val.name == "Time Status Medium Slider (Long Term)" ||
                        val.name == "PEP Low Period" ||
                        val.name == "PEP Medium Period" ||
                        val.name == "PEP High Period" ||
                        val.name == "Sanction Low Period" ||
                        val.name == "Sanction Medium Period" ||
                        val.name == "Sanction High Period" ||
                        val.name == "Time Status Medium Period (Long Term)" ||
                        val.name == "Time Status High Period (Short Term)"
                    ) {
                      setTimeout(() => {
                        this.sliderCss();
                      }, 3000);
                      if (
                          val.name != "PEP Low Period" ||
                          val.name != "PEP Medium Period" ||
                          val.name != "PEP High Period" ||
                          val.name != "Sanction Low Period" ||
                          val.name != "Sanction Medium Period" ||
                          val.name != "Sanction High Period" ||
                          val.name != "Time Status Medium Period (Long Term)" ||
                          val.name != "Time Status High Period (Short Term)"
                      ) {
                        var indexPos = values.values.findIndex(function (value) {
                          return (
                              val.name == "PEP High Slider" ||
                              val.name == "PEP Low Slider" ||
                              val.name == "PEP Medium Slider" ||
                              val.name == "Sanction Medium Slider" ||
                              val.name == "Sanction High Slider" ||
                              val.name == "Sanction Low Slider" ||
                              val.name == "Time Status High Slider (Short Term)" ||
                              val.name == "Time Status Medium Slider (Long Term)"
                          );
                        });
                        val.splitName = val.name.split(" ").join("_");
                        val.keyToIdentify = val.name.replace(/Slider/, "Period");
                        if (val.selectedValue == "Months") {
                          val.convert = 30;
                          val.name.split(" ")[0] !== "Time"
                              ? (val[val.name.split(" ")[1] + "priority"] =
                              val.sliderTo * 30)
                              : (val[val.name.split(" ")[2] + "priority"] =
                              val.sliderTo * 30);
                        } else if (val.selectedValue == "Weeks") {
                          val.convert = 7;
                          val.name.split(" ")[0] !== "Time"
                              ? (val[val.name.split(" ")[1] + "priority"] =
                              val.sliderTo * 7)
                              : (val[val.name.split(" ")[2] + "priority"] =
                              val.sliderTo * 7);
                        } else if (val.selectedValue == "Years") {
                          val.convert = 360;
                          val.name.split(" ")[0] !== "Time"
                              ? (val[val.name.split(" ")[1] + "priority"] =
                              val.sliderTo * 360)
                              : (val[val.name.split(" ")[2] + "priority"] =
                              val.sliderTo * 360);
                        } else {
                          val.convert = 1;
                          val.name.split(" ")[0] !== "Time"
                              ? (val[val.name.split(" ")[1] + "priority"] =
                                  val.sliderTo)
                              : (val[val.name.split(" ")[2] + "priority"] =
                                  val.sliderTo);
                        }
                      }
                      values.values.forEach((va) => {
                        if (
                            va.type == "Toggle On/Off" &&
                            va.name.split(" ")[0] == val.name.split(" ")[0]
                        ) {
                          val.select = va.selectedValue;
                          val.checked = this.checkboxValue(va.selectedValue);
                          if (val.type == "Dropdown" && va.selectedValue == "Off") {
                            val.classType = "dummyClass";
                          }
                        }
                        if (va.name == val.keyToIdentify) {
                          va.options.forEach((k) => {
                            if (k.attributeName == val.selectedValue) {
                              val["FixedMaxVal"] = k.attributeValue;
                            }
                            var i;
                            val.name.split(" ")[0] !== "Time" ? (i = 1) : (i = 2);
                            var x = val.name.split(" ")[i] + "priority";
                            if (
                                x != "Lowpriority" &&
                                val.name.split(" ")[0] !== "Time"
                            ) {
                              if (k.attributeName == "Months") {
                                if (
                                    (val["selectedValueMax"] * val.convert) / 30 <
                                    1
                                ) {
                                  k.disabled = true;
                                } else {
                                  k.disabled = false;
                                }
                              } else if (k.attributeName == "Weeks") {
                                if (
                                    (val["selectedValueMax"] * val.convert) / 7 <
                                    1
                                ) {
                                  k.disabled = true;
                                } else {
                                  k.disabled = false;
                                }
                              } else if (k.attributeName == "Years") {
                                if (
                                    (val["selectedValueMax"] * val.convert) / 360 <
                                    1
                                ) {
                                  k.disabled = true;
                                } else {
                                  k.disabled = false;
                                }
                              } else {
                                k.disabled = false;
                              }
                            } else if (
                                x != "Mediumpriority" &&
                                val.name.split(" ")[0] == "Time"
                            ) {
                              if (k.attributeName == "Months") {
                                if (
                                    (val["selectedValueMax"] * val.convert) / 30 <
                                    1
                                ) {
                                  k.disabled = true;
                                } else {
                                  k.disabled = false;
                                }
                              } else if (k.attributeName == "Weeks") {
                                if (
                                    (val["selectedValueMax"] * val.convert) / 7 <
                                    1
                                ) {
                                  k.disabled = true;
                                } else {
                                  k.disabled = false;
                                }
                              } else if (k.attributeName == "Years") {
                                if (
                                    (val["selectedValueMax"] * val.convert) / 360 <
                                    1
                                ) {
                                  k.disabled = true;
                                } else {
                                  k.disabled = false;
                                }
                              } else {
                                k.disabled = false;
                              }
                            }
                            //}
                          });
                        }
                      });
                    }

                    if (val.options) {
                      if (val['name'] !== 'Max number of version') {
                        val.options.sort(this.dynamicSort("attributeName"));
                      }

                      val.options.forEach((v1, k1) => {
                        if (v1.selected) {
                          this.systemsettingObject.selectedVal[
                          "name" +
                          value.split(" ").join("_") +
                          "_" +
                          values.key.split(" ").join("_") +
                          "sub" +
                          k
                              ] = k1;
                          if (val.name.toLowerCase() == "questionnaries") {
                          }
                          if (
                              val.name.toLowerCase() == "onboarding questionnaire"
                          ) {
                            // $rootScope.OnBoardingServeyID = v1.attributeId;
                          }
                        }
                      });
                    } else if (val.name.split(" ").join("") === "Allowchecklist") {
                      this.systemsettingObject.selectedVal[
                      "name" +
                      value.split(" ").join("_") +
                      "sub" +
                      val.name.split(" ").join("")
                          ] = val.selectedValue == "On" ? true : false;
                    }
                  });
                });
              });

              this.systemsettingObject.userManagementRegulationTable = this.systemsettingObject.groupsUserManagement;
              this.systemsettingObject.typesOfUserManagementRegulation = this.systemsettingObject.typesOfUserManagementRegulation.filter(
                  (item, pos) => {
                    return (
                        this.systemsettingObject.typesOfUserManagementRegulation.indexOf(
                            item
                        ) == pos
                    );
                  }
              );
              keys.forEach((val) => {
                this.systemsettingObject.settingsData[val] = response[val];
              });
        
              this.isInitialShowEntityTypeListManagementDropdown();
              this.systemsettingObject.userRegulationIndexDetails = {};
              this.systemsettingObject.isTwoWayAuthEnabled = false;
              for (var val in this.systemsettingObject.settingsData) {
                if (this.systemsettingObject.settingsData[val]) {
                  this.systemsettingObject.settingsData[val].forEach((v) => {
                    if (v.values && v.values.length) {
                      v.values.forEach((val2, ind) => {
                        val2.localization = val2.name
                            ? val2.name.split(" ").join("")
                            : "";
                        if (val == "User Management Regulation") {
                          this.systemsettingObject.userRegulationIndexDetails[
                              val2.name
                              ] = ind;
                        }

                        if (
                            val2.type === "Toggle On/Off" &&
                            (val2.section === "User Interaction" ||
                                val2.section === "defaults") &&
                            val2.systemSettingType === "GENERAL_SETTING"
                        ) {
                          val2.checked = this.checkboxValue(val2.selectedValue);

                          val2.classType = "settings-toggle-wrapper";
                        } else if (
                            val2.systemSettingType === "USER_MANAGEMENT_REGULATION"
                        ) {
                          val2.classType = "settings-toggle-wrapper";
                          val2.checked = this.checkboxValue(val2.selectedValue);
                          if (
                              val2.name == "2-way Authentication" &&
                              val2.selectedValue == "On"
                          ) {
                            this.systemsettingObject.isTwoWayAuthEnabled = true;
                          }
                        } else if (
                            val2.type === "Toggle On/Off" &&
                            (val2.systemSettingType === "MAIL_SETTING" ||
                                val2.systemSettingType === "ALERT_MANAGEMENT")
                        ) {
                          val2.classType = "settings-toggle-wrapper";
                          val2.checked = this.checkboxValue(val2.selectedValue);
                        } else if (
                            val2.type === "Slider" &&
                            (val2.systemSettingType === "MAIL_SETTING" ||
                                val2.systemSettingType === "ALERT_MANAGEMENT")
                        ) {
                          val2.classType = "settings-slider-wrapper";
                        } else if (
                            val2.type === "Dropdown" &&
                            val2.systemSettingType === "ALERT_MANAGEMENT" &&
                            val2.section === "Predefined Answers"
                        ) {
                          val2.secondaryClassType = "left_104";
                          val2.classType = "settings-toggle-wrapper";
                        } else if (
                            val2.section === "Branding" &&
                            val2.systemSettingType === "GENERAL_SETTING"
                        ) {
                          val2.classType = "branding-wrapper";
                        } else if (
                            val2.type === "Toggle On/Off" &&
                            val2.section === "File Settings" &&
                            val2.systemSettingType === "GENERAL_SETTING"
                        ) {
                          val2.classType = "file-switch-wrapper";
                          val2.checked = this.checkboxValue(val2.selectedValue);
                          switch (val2.name) {
                            case "Zip Archived":
                              val2.iconClass = "file-zip-o";
                              break;
                            case "pdf":
                              // code block
                              val2.iconClass = "file-pdf-o";
                              break;
                            case "xlsx":
                              // code block
                              val2.iconClass = "file-excel-o";
                              break;
                            case "txt":
                              // code block
                              val2.iconClass = "file-text-o";
                              break;
                            case "jpg":
                            case "png":
                            case "gif":
                              // code block
                              val2.iconClass = "file-image-o";
                              break;
                            case "docx":
                              // code block
                              val2.iconClass = "file-word-o";
                              break;
                            default:
                              val2.iconClass = "file-o";
                              // code block
                          }
                        } else if (
                            val2.type === "Dropdown" &&
                            val2.section === "File Settings" &&
                            val2.systemSettingType === "GENERAL_SETTING"
                        ) {
                          val2.classType = "width-100 bst_input_group";
                        } else if (val2.type === "Toggle On/Off" &&
                            val2.systemSettingType === "DOCUMENT_MANAGEMENT" &&
                            val2.section === "Settings") {
                          val2.classType = "settings-toggle-wrapper";
                          val2.checked = this.checkboxValue(val2.selectedValue);
                        } else if (val2.type === "Text" &&
                            val2.systemSettingType === "APP_SETTING" &&
                            val2.section === "Knowledge Discovery") {
                        } else if (
                            val2.type === "dropdown" &&
                            val2.section === "Tag Management" &&
                            val2.systemSettingType === "GENERAL_SETTING"
                        ) {
                          this._agGridTableService.tagEntity = val2.selectedValue;
                        }
                      });
                    }
                  });
                }
              }

              if (this.systemsettingObject.isTwoWayAuthEnabled) {
                for (let k in this.systemsettingObject.userRegulationIndexDetails) {
                  if (k.includes("Allow 3rd Party synchronization")) {
                    this.systemsettingObject.settingsData[
                        "User Management Regulation"
                        ][0]["values"][
                        this.systemsettingObject.userRegulationIndexDetails[k]
                        ]["selectedValue"] = "On";
                  }
                }
              }

              if (Object.keys(this.systemsettingObject.settingsData).length == 0) {
                this.systemsettingObject.isSettingsError = true;
              } else {
                this.systemsettingObject.isSettingsError = false;
              }
            } else {
              //show error and remove loader
              this.systemsettingObject.isSettingsError = true;
            }
            if (typeof this.systemsettingObject.selected_Language == "object" && this.systemsettingObject.selected_Language.displayName) {

              this.getSelectedFilename(this.systemsettingObject.selected_Language.displayName);//sets the file name
            }
            setTimeout(() => {
              $("#scroller, .ag-body-viewport").mCustomScrollbar({
                axis: "y",
                theme: "minimal-dark",
                scrollInertia: 0,
                // mouseWheelPixels: 70,
                autoDraggerLength: false,
                callbacks: {
                  onScroll: () => {
                    if (this.p2) {
                      this.p2.close();
                    }
                  },
                },
              });
              $("#leftPanelScroll").mCustomScrollbar({
                axis: "y",
                theme: "minimal-dark",
                scrollInertia: 0,
                callbacks: {
                  onScroll: () => {
                    //
                  },
                },
              });
            }, 100);

            this.loadTagsGrid();
          })
          .catch((err) => {
            this.systemsettingObject.isSettingsError = true;
            this.systemsettingObject.settingsloader = false;
          });
    })
  }
  /*
   * @purpose: function to get Table data as per list type selected from dropdown
   * @created:25 July 2019
   * @author: Amritesh
   */
  getIndicator() {
    this.generalSettingsApiService
      .getListItemsByListType(this.systemsettingObject.list)
      .then((res) => {
        this.systemsettingObject.indicatorDrop = res;
        var codes = this.systemsettingObject.indicatorList
          .map((val) => {
            if (val.code) {
              return val.code.toLowerCase();
            }
          })
          .filter((val) => val);
        this.systemsettingObject.indicatorDrop.forEach((element) => {
          let codeIndex = element.code
            ? codes.indexOf(element.code.toLowerCase())
            : -1;
          if (element.code && codeIndex !== -1) {
            element.isCodeSelected = true;
          } else if (element.code) {
            element.isCodeSelected = false;
          }
        });
      });
  }
  updateRadioGroup(e, setting): void {
    setting.options.forEach(o => {
      o.selected = false;
    });
    setting.selectedValue = e.value.attributeValue;
    e.value.selected = true;
    this.updateVal(setting);
  }
  getTableData(listType: string, sectionFrom: string) {
    this.generalSettingsApiService
      .getListItemsByListType(listType)
      .then((response) => {
        if (listType === "Case Risk") {
          this.systemsettingObject.indicatorDrop = response;
        }
        if (sectionFrom === "AnswerTable") {
          this.systemsettingObject.answerToshowInTable = this.tableSorting(
            response
          );
          this.systemsettingObject.answerToshowInTable.forEach((v1) => {
            v1.disableInput = true;
          });
        } else if (listType == "Jurisdictions") {
          this.getAllTenants().then(() => {
            this.systemsettingObject.routingtableList.forEach(
              (element: any) => {
                if (element.jurisdiction && element.jurisdiction.displayName) {
                  const index = this.systemsettingObject.all_Jurisdictions.findIndex(
                    (val) => val.code == element.jurisdiction.code
                  );
                  this.systemsettingObject.all_Jurisdictions[
                    index
                  ].countryalreadyselected = true;
                }
              }
            );
          });
        } else if (listType === "Tenant" && sectionFrom === "noActiveLoading") {
          this.systemsettingObject.tentants = response;
          this.systemsettingObject.tentants.forEach(
            (val) => (val.isalreadySelected = false)
          );
        }
        else {
          if (listType == "Languages") {
            this.systemsettingObject.languageList = response;
          }

          this.systemsettingObject.dataToShowAsperList = this.tableSorting(
            response
          );

          this.systemsettingObject.dataToShowAsperList.forEach((v1) => {
            v1.disableInput = true;
            v1.flagPath = v1.flagName
              ? "vendor/jquery/flags/1x1/" + v1.flagName.toLowerCase() + ".svg"
              : "";
          });
        }

        if (sectionFrom !== "noActiveLoading" && (listType === "Tenants" || listType === "Jurisdictions")) {
          this.systemsettingObject.dataToShowAsperList = this.tableSorting(
            response
          );

          this.systemsettingObject.dataToShowAsperList.forEach((v1) => {
            v1.disableInput = true;
            v1.flagPath = v1.flagName
              ? "vendor/jquery/flags/1x1/" + v1.flagName.toLowerCase() + ".svg"
              : "";
          });

        }

      });
  }

  /*
   * @purpose: function to sort table Alphabetically
   * @created: 12 August 2019
   * @author:  Amritesh
   * @param :arrayToSort(array)
   */
  tableSorting(arrayToSort) {
    arrayToSort = arrayToSort.sort((a, b) => {
      return a.code.localeCompare(b.code);
    });
    return arrayToSort;
  }
  /*
   * @purpose: function to get color with # added
   * @created: 12 August 2019
   * @author:  Amritesh
   */
  setColor(colorToSet) {
    return "#" + colorToSet;
  }

  /*
   * @purpose: function to get color to case risk
   * @created: 10 may 2022
   * @author:  Kasun Karunathilaka
   */
  setColorCaseRisk(colorToSet) {
    if(colorToSet){
      return "#" + colorToSet;
    }
  }
  /*
   * @purpose: sort array of objects by key
   * @created: 10 Aug 2018
   * @author: Prasanthi
   */

  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  }
  scrollPage(id1, id2) {
    var id = "#" + id1 + id2;
    $("#scroller").mCustomScrollbar("scrollTo", id, {
      scrollInertia: 300,
    });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      if (
        document.getElementsByTagName("body") &&
        document.getElementsByTagName("body")[0] &&
        document.getElementsByTagName("body")[0].style
      ) {
        document.getElementsByTagName("body")[0].style.overflow = "hidden";
      }
    }, 1000);
  }
  /*
   * @purpose: load system settings
   * @created: 9 Aug 2018
   * @author: Prasanthi
   */
  updateVal(setting, selected?: any, id?: any, email?: any, Questionnaries?: any) {
    if ($(".validated").hasClass("ng-invalid")) {
      return;
    }
    if(setting.name === 'Document expiry notification period'){
      if (setting.selectedValue && setting.selectedValue > 0) {
        setting.validationFail = false;
      } else {
        setting.validationFail = true;
        return;
      }
    }
    if (email) {
      var validate = this.validateEmail(setting.selectedValue);
      if (validate) {
        setting.validationFail = false;
      } else {
        setting.validationFail = true;
        return;
      }
    }
    var data;
    if (
      !selected &&
      setting.section !== "Branding" &&
      setting.section !== "Theme" &&
      setting.section !== "Predefined Answers" &&
      setting.type != "Slider" &&
      setting.type != "Autocomplete"
    ) {
      //handle for checkbox
      if (id) {
        setting.selectedValue = $("#hyperCheck_" + id).prop("checked")
          ? "On"
          : "Off";
        if (
          id == "Sanction_Risk_Factor" ||
          id == "PEP_Risk_Factor" ||
          id == "Time_In_Status"
        ) {
          this.SliderData(setting, false);
          setTimeout(() => {
            this.sliderCss();
          }, 0);
        }
      }
      //handle for checkbox and text
      if (setting.type === 'Radio') {
        const selectedVal = setting.options.find(o => o.selected);
        data = {
          attributeId: "",
          selectedValue: setting.selectedValue,
          settingId: setting.settingId,
          systemSettingsType: setting.systemSettingType,
          ...selectedVal
        };
      } else {
        data = {
          attributeId: "",
          selectedValue: setting.selectedValue,
          settingId: setting.settingId,
          systemSettingsType: setting.systemSettingType,
        };
      }
    } else if (setting.name == "Default Module") {
      data = {
        attributeId: setting.options[selected].attributeId,
        selectedValue: "",
        settingId: "",
        systemSettingsType: setting.systemSettingType,
      };
    } else if (setting.name == "Questionnaries") {
      data = {
        selectedValue: setting.options[selected].attributeId,
        settingId: setting.settingId,
        systemSettingsType: setting.systemSettingType,
      };
    } else if (setting.type == "Autocomplete") {
      if (setting.selectedValue.file_id) {
        this.systemsettingObject.filteredArrayRegionalSetting = true;
      } else {
        this.systemsettingObject.filteredArrayRegionalSetting = false;
      }
      this.window.localStorage.setItem("langKey", setting.selectedValue.displayName);
      if (setting.selectedValue.flagName) {
        this.systemsettingObject.selectedIconSource = "";
        this.systemsettingObject.selectedFlagSource =
          "vendor/jquery/flags/1x1/" +
          setting.selectedValue.flagName.toLowerCase() +
          ".svg";
      } else {
        this.systemsettingObject.selectedFlagSource = "";
        this.systemsettingObject.selectedIconSource =
          setting.selectedValue.icon;
      }

      this.systemsettingObject.selectedFlagSource;
      this.systemsettingObject.selectedIconSource;
      setting.selectedValue =
        typeof setting.selectedValue == "object"
          ? setting.selectedValue.displayName
          : setting.selectedValue;

      data = {
        attributeId: "",
        selectedValue: setting.selectedValue,
        settingId: setting.settingId,
        systemSettingsType: setting.systemSettingType,
      };
    } else if (setting.name == "Onboarding Questionnaire") {
      data = {
        selectedValue: setting.options[selected].attributeId,
        settingId: setting.settingId,
        systemSettingsType: setting.systemSettingType,
      };
    } else if (setting.section == "Branding") {
      if (setting.name == "Report Footer") {
        data = {
          selectedValue: setting.selectedValue,
          settingId: setting.settingId,
          systemSettingsType: setting.systemSettingType,
          attributeId: null,
        };
      } else {
        data = {
          customerLogoImage: setting.customerLogoImage,
          selectedValue: setting.defaultValue,
          settingId: setting.settingId,
          systemSettingsType: setting.systemSettingType,
          attributeId: null,
        };
      }
    } else if (setting.section == "List Management") {
      data = {
        attributeId: setting.options[selected].attributeId,
        selectedValue: setting.options[selected].attributeName,
        settingId: setting.settingId,
        systemSettingsType: setting.systemSettingType,
      };
      this.systemsettingObject.selectedValueAsperList = data.selectedValue;
      if (data.selectedValue.toLowerCase() == "article status") {
        this.selectedEntity = "article";
        this.filterStatusReasons(
          this.selectedEntity,
          this.selectedEntityStatus,
          "type"
        );
      }
      if (data.selectedValue === 'Entity Status') {
        this.showEntityTypeListManagementDropdown = true;
        this.setInitialEntityTypeListManagementDropdownTable(this.systemsettingObject.entityWorkFlowList);
      } else {
        this.showEntityTypeListManagementDropdown = false;
        this.getTableData(data.selectedValue, "ListTable");
      }
    } else if (setting.name == "Predefined answers for :") {
      data = {
        attributeId: setting.options[selected].attributeId,
        selectedValue: setting.options[selected].attributeName,
        settingId: setting.settingId,
        systemSettingsType: setting.systemSettingType,
      };
      this.systemsettingObject.selectedStatusOnDropdown = data.selectedValue;
      this.getTableData(data.selectedValue, "AnswerTable");
    } else if (setting.type == "Slider") {
      this.SliderData(setting, selected);
      data = {
        attributeId: null,
        settingId: setting.settingId,
        systemSettingsType: setting.systemSettingType,
        selectedValue: setting.selectedValue,
        selectedValueMax: setting.selectedValueMax,
        sliderFrom: setting.sliderFrom,
        sliderTo: setting.sliderTo,
      };
    } else if (
      setting.name == "PEP High Period" ||
      setting.name == "PEP Low Period" ||
      setting.name == "PEP Medium Period" ||
      setting.name == "Sanction Medium Period" ||
      setting.name == "Sanction High Period" ||
      setting.name == "Sanction Low Period" ||
      setting.name == "Time Status High Period (Short Term)" ||
      setting.name == "Time Status Medium Period (Long Term)"
    ) {
      data = {
        attributeId: setting.options[selected].attributeId,
        selectedValue: setting.options[selected].attributeName,
        settingId: setting.settingId,
        systemSettingsType: setting.systemSettingType,
        selectedValueMax: setting.options[selected].attributeValue,
      };
    } else if (setting.section == "Theme") {
      data = {
        attributeId: "",
        selectedValue: setting.defaultValue,
        settingId: setting.settingId,
        systemSettingsType: setting.systemSettingType,
      };
    } else if (setting.section == "Tag Management") {
      data = {
        attributeId: setting.options[selected].attributeId,
        selectedValue: setting.options[selected].attributeName,
        settingId: setting.settingId,
        systemSettingsType: setting.systemSettingType,
      };
      this._agGridTableService.tagEntity = setting.options[selected].attributeName;
      this._commonServices.reloadPageConetnt();

    } else {
      data = {
        attributeId: setting.options[selected].attributeId,
        selectedValue: setting.options[selected].attributeName,
        settingId: setting.settingId,
        systemSettingsType: setting.systemSettingType,
      };
    }

    if(setting.section === 'Case Assets'){
      setting.selectedValue = $("#hyperCheck_" + id).prop("checked")
      ? "On"
      : "Off";
      data = {
        attributeId: '',
        selectedValue: setting.selectedValue,
        settingId: setting.settingId,
        systemSettingsType: setting.systemSettingType,
      };
    }

    if(setting.name === 'Add/Remove Entities to ABS (Monitored)'){
      setting.selectedValue = document.getElementById("add_remove_entities_to_abs")['checked'] ? "On" : "Off";
      data = {
        attributeId: '',
        selectedValue: setting.selectedValue,
        settingId: setting.settingId,
        systemSettingsType: setting.systemSettingType,
      };
    }
    
    if(setting.name === 'Add less than 25% shareholders to Profile Report'){
      setting.selectedValue = document.getElementById("add_less_than_25_percent_shareholders")['checked'] ? "On" : "Off";
      data = {
        attributeId: '',
        selectedValue: setting.selectedValue,
        settingId: setting.settingId,
        systemSettingsType: setting.systemSettingType,
      };
    }

    if(setting.name === 'Create Corporate Memory (Snapshot) when Entity Page is Refreshed'){
      setting.selectedValue = document.getElementById("createCorporateMemorysnapshot")['checked'] ? "On" : "Off";
      data = {
        attributeId: '',
        selectedValue: setting.selectedValue,
        settingId: setting.settingId,
        systemSettingsType: setting.systemSettingType
      };
    }

    if(setting.name === 'PEP - Politically Exposed Person'){
      setting.selectedValue = document.getElementById("politicallyExposedPerson")['checked'] ? "On" : "Off";
      data = {
        attributeId: '',
        selectedValue: setting.selectedValue,
        settingId: setting.settingId,
        systemSettingsType: setting.systemSettingType
      };
    }

    if(setting.name === 'Sanctions'){
      setting.selectedValue = document.getElementById("sanctions")['checked'] ? "On" : "Off";
      data = {
        attributeId: '',
        selectedValue: setting.selectedValue,
        settingId: setting.settingId,
        systemSettingsType: setting.systemSettingType
      };
    }

    if(setting.name === 'RCA - Relatives / Close Associates'){
      setting.selectedValue = document.getElementById("relativesCloseAssociates")['checked'] ? "On" : "Off";
      data = {
        attributeId: '',
        selectedValue: setting.selectedValue,
        settingId: setting.settingId,
        systemSettingsType: setting.systemSettingType
      };
    }
    if(setting.name === 'SIE - Special Interest Entity'){
      setting.selectedValue = document.getElementById("specialInterestEntity")['checked'] ? "On" : "Off";
      data = {
        attributeId: '',
        selectedValue: setting.selectedValue,
        settingId: setting.settingId,
        systemSettingsType: setting.systemSettingType
      };
    }
    
    if(setting.name === 'SIP - Special Interest Person'){
      setting.selectedValue = document.getElementById("specialInterestPerson")['checked'] ? "On" : "Off";
      data = {
        attributeId: '',
        selectedValue: setting.selectedValue,
        settingId: setting.settingId,
        systemSettingsType: setting.systemSettingType
      };
    }

    if(setting.name === 'AME - Adverse Media'){
      setting.selectedValue = document.getElementById("adverseMedia")['checked'] ? "On" : "Off";
      data = {
        attributeId: '',
        selectedValue: setting.selectedValue,
        settingId: setting.settingId,
        systemSettingsType: setting.systemSettingType
      };
    }

    this.generalSettingsApiService.updateValue(data).then(
      (response: any) => {
        this.systemsettingObject.settingsloader = false;
        this.systemsettingObject.filteredArrayRegionalSetting = true;
        if (response) {
          this.getLanguageData(setting.selectedValue);
          if (setting.section == "Branding") {
            var branding = this.systemsettingObject.settingsData[
              "General Settings"
            ].findIndex(function (d) {
              return d.key == "Branding";
            });
            if (branding !== -1) {
              var brandIndex = this.systemsettingObject.settingsData[
                "General Settings"
              ][branding].values.findIndex((val) => val.name == setting.name);
              if (brandIndex !== -1) {
                if (setting.name == 'Report Footer') {
                  this.systemsettingObject.settingsData["General Settings"][branding].values[brandIndex].selectedValue = setting.selectedValue;
                  this._sharedService.showNewFlashMessage('Report Footer Updated', 'success')
                } else {
                  this.systemsettingObject.settingsData["General Settings"][
                    branding
                  ].values[brandIndex].customerLogoImage =
                    setting.customerLogoImage;
                }
              }
            }
          }
          if (setting.section === 'Override Selection') {
            this._sharedService.showNewFlashMessage(
              `
                ${this.translateService.instant('Override Selection')}
                ${this.translateService.instant('Updated')}
              `, 'success'
            );
          }
          if (
            setting.name == "PEP High Period" ||
            setting.name == "PEP Low Period" ||
            setting.name == "PEP Medium Period" ||
            setting.name == "Sanction Medium Period" ||
            setting.name == "Sanction High Period" ||
            setting.name == "Sanction Low Period" ||
            setting.name == "Time Status High Period (Short Term)" ||
            setting.name == "Time Status Medium Period (Long Term)"
          ) {
            this.SliderData(setting, selected);
          }
          if (
            setting.name == "Case Workflow" &&
            response &&
            response.status == "error" &&
            response.message
          ) {
            this._sharedService.showNewFlashMessage(response.message, "danger");
          }
        } else {
          this._sharedService.showNewFlashMessage(
            "FAILED TO UPDATE.. PLEASE TRY AGAIN LATER",
            ""
          );
        }
      },
      () => {
        //show error and remove loader
        this._sharedService.showNewFlashMessage(
          "FAILED TO UPDATE.. PLEASE TRY AGAIN LATER",
          ""
        );
        this.systemsettingObject.settingsloader = false;
      }
    );
  }

  public changeListManagementEntityStatusTypeFromSelect(entityName: string) {
      const entity = this.systemsettingObject.entityWorkFlowList && this.systemsettingObject.entityWorkFlowList.find((v) => v.entityName === entityName);
      if (entity) {
        this.changeListManagementEntityStatusType(entity)
      }
  }

  public async changeListManagementEntityStatusType(entity: ListManagementEntityStatusType) {
      this.selectedEntityTypeListManagement = entity;
      const allWorkflowStatuses: Array<{ [key: string]: string }> =
        await this.generalSettingsApiService.getAllWorkflowStatus(
          entity.workflowModelKey
        );
      const listItems: Array<any> =
        await this.generalSettingsApiService.getListItemsByListType(
          `${entity.entityName} Status`
        );

      const statuses: Array<string> = allWorkflowStatuses.reduce(
        (acc, status) => {
          return [...acc, ...Object.values(status)];
        },
        []
      );
      const mergedByStatusExistence = listItems.filter((item) => {
        if(entity && entity.entityName && entity.entityName == "Document"){
          return statuses.includes(this.capitalizeFirstLetter(item.code));
        }else{
          return statuses.includes(item.code);
        }
      });

      this.systemsettingObject.dataToShowAsperList = this.tableSorting(
        mergedByStatusExistence
      );

      this.systemsettingObject.dataToShowAsperList.forEach((v1) => {
        v1.disableInput = true;
        v1.flagPath = v1.flagName
          ? "vendor/jquery/flags/1x1/" + v1.flagName.toLowerCase() + ".svg"
          : "";
      });
 }

  /*
   * @purpose: function to validate email
   * @created: 9 Aug 2018
   * @author: Prasanthi
   */
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  openUploadCustomerLogoModal(setting) {
    var customerLogoModalInstance = this.modalservice.open(LogomodalComponent, {
      windowClass: "bst_modal custom-modal",
      size: "lg",
    });
    if (setting.name == "Company Logo") {
      customerLogoModalInstance.componentInstance.settingId = this.brandSettingId;
    } else {
      customerLogoModalInstance.componentInstance.settingId = this.systemsettingObject.reportLogosettingID;
    }
    customerLogoModalInstance.componentInstance.nameSection = setting.name;

    customerLogoModalInstance.result.then(
      (response) => {
        if (response) {
          this.updateVal(response, false, false, false, false);
          this._commonServices.isLogoUpdated.next(response.defaultValue);
        }
      },
      function () { }
    );
  }

  checkboxValue(value) {
    return value == "On" ? true : false;
  }

  /*
   * @purpose: function to set theme Active
   * @created:1-9-2020
   * @author: Amritesh
   */
  setDivActive(value, themeArray) {
    this.systemsettingObject.themeSelected = value;
    var selectedThemeObj = themeArray.values.find((val) => {
      return val.name.toLowerCase() == value.toLowerCase();
    });
    selectedThemeObj.defaultValue = value;
    this.updateVal(selectedThemeObj, false, false, false, false);
    if (value == "Light Theme") {
      $("body").addClass("light-dark-theme");
    } else {
      $("body").removeClass("light-dark-theme");
    }
  }
  /*
   * @purpose: toggle on and off update
   */
  enableDisableTog = function (setting, selected, id) {
    if (
      setting.selectedValue == "On" &&
      (id == "Sanction_Risk_Factor" ||
        id == "PEP_Risk_Factor" ||
        id == "Time_In_Status")
    ) {
      this.enableAlert(setting, id);
    } else {
      this.updateVal(setting, selected, id);
    }
    if (selected == "2-way Authentication") {
      setting["selectedValue"] == "On"
        ? (this.systemsettingObject.isTwoWayAuthEnabled = true)
        : (this.systemsettingObject.isTwoWayAuthEnabled = false);
    }
    if (this.systemsettingObject.isTwoWayAuthEnabled == true) {
      for (let k in this.systemsettingObject.userRegulationIndexDetails) {
        if (k.includes("Allow 3rd Party synchronization")) {
          this.systemsettingObject.settingsData[
            "User Management Regulation"
          ][0]["values"][
            this.systemsettingObject.userRegulationIndexDetails[k]
          ]["selectedValue"] = "On";
        }
      }
    }
  };
  /*
   * @purpose: function to disable and enable alert settings
   */
  enableAlert(setting, id) {
    if (setting.selectedValue == "On") {
      this.systemsettingObject.alertToggleData = setting;
    }
    var modalInstanceDis = this.modalservice
      .open(EnableAndDisableAlertmodalComponent, {
        windowClass:
          "custom-modal c-arrow center bst_modal add-ownership-modal add-new-officer",
      })
      .result.then(
        (response) => {
          if (response === "cancel") {
            this.SliderData(this.systemsettingObject.alertToggleData, false);
            $(
              "#hyperCheck_" +
              this.systemsettingObject.alertToggleData.name
                .split(" ")
                .join("_")
            ).prop("checked", true);
          } else if (response == "update") {
            this.systemsettingObject.alertToggleData.selectedValue = "Off";
            this.updateVal(
              this.systemsettingObject.alertToggleData,
              false,
              false,
              false,
              false
            );
            this.SliderData(this.systemsettingObject.alertToggleData, false);
          }
        },
        (reason) => { }
      );
  }
  /*
   * @purpose: commonFunction for alertIndicators settings
   */
  SliderData(setting, selected) {
    Object.values(this.systemsettingObject.settingsData).map((d: any) => {
      d.forEach((val: any) => {
        val.values.forEach((value, key) => {
          if (setting.options) {
            if (setting.name == value.keyToIdentify) {
              value.selectedValue = setting.options[selected].attributeName;
              value.sliderTo = 0;
              value.selectedValueMax = setting.options[selected].attributeValue;
              value["FixedMaxVal"] = setting.options[selected].attributeValue;
              value["selectedValueMin"] = 0;
              if (setting.type == "Dropdown") {
                value.priority = 0;
                this.updateVal(value, false, false, false, false);
                this.sliderCss();
              }
            }
            if (setting.name == value.name && setting.type == "Slider") {
              if (value.selectedValue == "Months") {
                value.convert = 30;
                value.name.split(" ")[0] !== "Time"
                  ? (value[value.name.split(" ")[1] + "priority"] =
                    value.sliderTo * 30)
                  : (value[value.name.split(" ")[2] + "priority"] =
                    value.sliderTo * 30);
              } else if (value.selectedValue == "Weeks") {
                value.convert = 7;
                value.name.split(" ")[0] !== "Time"
                  ? (value[value.name.split(" ")[1] + "priority"] =
                    value.sliderTo * 7)
                  : (value[value.name.split(" ")[2] + "priority"] =
                    value.sliderTo * 7);
              } else if (value.selectedValue == "Years") {
                value.convert = 360;
                value.name.split(" ")[0] !== "Time"
                  ? (value[value.name.split(" ")[1] + "priority"] =
                    value.sliderTo * 360)
                  : (value[value.name.split(" ")[2] + "priority"] =
                    value.sliderTo * 360);
              } else {
                value.convert = 1;
                value.name.split(" ")[0] !== "Time"
                  ? (value[value.name.split(" ")[1] + "priority"] =
                    value.sliderTo)
                  : (value[value.name.split(" ")[2] + "priority"] =
                    value.sliderTo);
              }
              var data = val.values.filter((set) => {
                return set.name.split(" ")[0] == setting.name.split(" ")[0];
              });
              data.forEach((pri: any) => {
                var i;
                setting.name.split(" ")[0] !== "Time" ? (i = 1) : (i = 2);
                if (setting.name.split(" ")[i] + "priority" == "Highpriority") {
                  if (setting.Highpriority >= pri.Mediumpriority) {
                    if (setting.selectedValue == pri.selectedValue) {
                      value["selectedValueMax"] = pri.sliderTo;
                      pri["selectedValueMin"] = value.sliderTo;
                      this.sliderCss();
                    } else if (setting.selectedValue != pri.selectedValue) {
                      value["selectedValueMax"] =
                        pri.Mediumpriority / value.convert;
                      var value_num = (
                        value["Highpriority"] / pri.convert
                      ).toString();
                      pri["selectedValueMin"] = parseInt(value_num);
                      this.sliderCss();
                    }
                  } else if (setting.Highpriority < pri.Mediumpriority) {
                    value["selectedValueMax"] =
                      pri.Mediumpriority / value.convert;
                    var num = (value["Highpriority"] / pri.convert).toString();
                    pri["selectedValueMin"] = parseInt(num);
                    this.sliderCss();
                  }
                } else if (
                  setting.name.split(" ")[i] + "priority" ==
                  "Mediumpriority"
                ) {
                  if (setting.Mediumpriority >= pri.Lowpriority) {
                    if (setting.selectedValue == pri.selectedValue) {
                      value["selectedValueMax"] = pri.sliderTo;
                      pri["selectedValueMin"] = value.sliderTo;
                      this.sliderCss();
                    } else if (setting.selectedValue != pri.selectedValue) {
                      value["selectedValueMax"] =
                        pri.Lowpriority / value.convert;
                      var val_num = (
                        value["Mediumpriority"] / pri.convert
                      ).toString();
                      pri["selectedValueMin"] = parseInt(val_num);
                      this.sliderCss();
                    }
                  } else if (setting.Mediumpriority < pri.Lowpriority) {
                    value["selectedValueMax"] = pri.Lowpriority / value.convert;
                    var val_num = (
                      value["Mediumpriority"] / pri.convert
                    ).toString();
                    pri["selectedValueMin"] = parseInt(val_num);
                    this.sliderCss();
                  }
                  if (setting.Mediumpriority >= pri.Highpriority) {
                    if (setting.selectedValue == pri.selectedValue) {
                      pri["selectedValueMax"] = setting.sliderTo;
                      value["selectedValueMin"] = pri.sliderTo;
                      this.sliderCss();
                    } else if (setting.selectedValue != pri.selectedValue) {
                      pri["selectedValueMax"] =
                        value.Mediumpriority / pri.convert;
                      var val_num = (
                        pri.Highpriority / value.convert
                      ).toString();
                      value["selectedValueMin"] = parseInt(val_num);
                      this.sliderCss();
                    }
                  } else if (setting.Mediumpriority < pri.Highpriority) {
                    pri["selectedValueMax"] =
                      value.Mediumpriority / pri.convert;
                    var val_num = (pri.Highpriority / value.convert).toString();
                    value["selectedValueMin"] = parseInt(val_num);
                    this.sliderCss();
                  }
                } else if (
                  setting.name.split(" ")[i] + "priority" ==
                  "Lowpriority"
                ) {
                  if (setting.Lowpriority >= pri.Mediumpriority) {
                    if (setting.selectedValue == pri.selectedValue) {
                      pri["selectedValueMax"] = setting.sliderTo;
                      value["selectedValueMin"] = pri.sliderTo;
                      this.sliderCss();
                    } else if (setting.selectedValue != pri.selectedValue) {
                      pri["selectedValueMax"] = value.Lowpriority / pri.convert;
                      var num_val = (
                        pri.Mediumpriority / value.convert
                      ).toString();
                      value["selectedValueMin"] = parseInt(num_val);
                      this.sliderCss();
                    }
                  } else if (setting.Lowpriority <= pri.Mediumpriority) {
                    pri["selectedValueMax"] = value.Lowpriority / pri.convert;
                    var num_val = (
                      pri.Mediumpriority / value.convert
                    ).toString();
                    value["selectedValueMin"] = parseInt(num_val);
                    this.sliderCss();
                  }
                }

                data.forEach((dta) => {
                  if (dta.name == pri.keyToIdentify) {
                    dta.options.forEach((k) => {
                      var j;
                      pri.name.split(" ")[0] !== "Time" ? (j = 1) : (j = 2);
                      var x = pri.name.split(" ")[j] + "priority";
                      if (x != "Lowpriority") {
                        if (pri.name.split(" ")[0] !== "Time") {
                          if (k.attributeName == "Months") {
                            if (
                              (pri["selectedValueMax"] * pri.convert) / 30 <
                              1
                            ) {
                              k.disabled = true;
                            } else {
                              k.disabled = false;
                            }
                          } else if (k.attributeName == "Weeks") {
                            if (
                              (pri["selectedValueMax"] * pri.convert) / 7 <
                              1
                            ) {
                              k.disabled = true;
                            } else {
                              k.disabled = false;
                            }
                          } else if (k.attributeName == "Years") {
                            if (
                              (pri["selectedValueMax"] * pri.convert) / 360 <
                              1
                            ) {
                              k.disabled = true;
                            } else {
                              k.disabled = false;
                            }
                          } else {
                            k.disabled = false;
                          }
                        } else if (
                          x != "Mediumpriority" &&
                          pri.name.split(" ")[0] == "Time"
                        ) {
                          if (k.attributeName == "Months") {
                            if (
                              (pri["selectedValueMax"] * pri.convert) / 30 <
                              1
                            ) {
                              k.disabled = true;
                            } else {
                              k.disabled = false;
                            }
                          } else if (k.attributeName == "Weeks") {
                            if (
                              (pri["selectedValueMax"] * pri.convert) / 7 <
                              1
                            ) {
                              k.disabled = true;
                            } else {
                              k.disabled = false;
                            }
                          } else if (k.attributeName == "Years") {
                            if (
                              (pri["selectedValueMax"] * pri.convert) / 360 <
                              1
                            ) {
                              k.disabled = true;
                            } else {
                              k.disabled = false;
                            }
                          } else {
                            k.disabled = false;
                          }
                        }
                        setTimeout(() => {
                          var g = document.getElementById(
                            "drop_" + dta.name.split(" ").join("_")
                          );
                          var m = "";
                          if (m == "") {
                            dta.selectedValueMax = 60;
                            this.sliderCss();
                            this.SliderData(dta, "0");
                            this.updateVal(dta, "0", false, false, false);
                          }
                        }, 100);
                        this.sliderCss();
                      }
                    });
                  }
                });
              });
            }
            if (
              setting.type == "Toggle On/Off" &&
              setting.name.split(" ")[0] == value.name.split(" ")[0]
            ) {
              value.select = setting.selectedValue;
              value.checked = this.checkboxValue(setting.selectedValue);
              if (value.type == "Dropdown" && setting.selectedValue == "Off") {
                value.classType = "dummyClass";
              } else if (
                value.type == "Dropdown" &&
                setting.selectedValue == "On"
              ) {
                value.classType = "";
              }
              if (setting.name == value.name) {
                value.selectedValue = setting.selectedValue;
              }
            }
          }
        });
      });
    });
  }
  sliderCss() {
    document.querySelectorAll(".slider-high").forEach((el: any) => {
      el.oninput = function () {
        var valPercent = (el.valueAsNumber - el.min) / (el.max - el.min);
        if (!isNaN(valPercent)) {
          var style =
            "background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(" +
            valPercent +
            ", #ef5350), color-stop(" +
            valPercent +
            ",rgba(239, 83, 80, 0.2) ))";
        } else if (isNaN(valPercent)) {
          var style =
            "background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(0, #ef5350), color-stop(0,rgba(239, 83, 80, 0.2) ))";
        }
        el.style = style;
      };
      el.oninput();
    });

    document.querySelectorAll(".slider-medium").forEach((el: any) => {
      el.oninput = function () {
        var valMediumPercent = (el.valueAsNumber - el.min) / (el.max - el.min);
        if (!isNaN(valMediumPercent)) {
          var mediumStyle =
            "background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(" +
            valMediumPercent +
            ", #9c27b0), color-stop(" +
            valMediumPercent +
            ",rgba(156, 39, 176, 0.3) ))";
        } else if (isNaN(valMediumPercent)) {
          var mediumStyle =
            "background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(0, #9c27b0), color-stop(0,rgba(156, 39, 176, 0.3) ))";
        }
        el.style = mediumStyle;
      };
      el.oninput();
    });

    document.querySelectorAll(".slider-low").forEach((el: any) => {
      el.oninput = function () {
        var valLowPercent = (el.valueAsNumber - el.min) / (el.max - el.min);
        if (!isNaN(valLowPercent)) {
          var lowStyle =
            "background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(" +
            valLowPercent +
            ", #009f59), color-stop(" +
            valLowPercent +
            ",rgba(0, 159, 89, 0.3) ))";
        } else if (isNaN(valLowPercent)) {
          var lowStyle =
            "background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(0, #009f59), color-stop(0,rgba(0, 159, 89, 0.3) ))";
        }
        el.style = lowStyle;
      };
      el.oninput();
    });
  }
  //////////////////////  LIST MANAGEMENT SETTINGS Table Editting  starts////////////////
  /*
   * @purpose: function to add row from table
   * @created:25 July 2019
   * @author: Amritesh
   */
  addRowInTable(tableType) {
    this.systemsettingObject.storeBeforeEditing = {};
    var obj: any = {
      allowDelete: true,
      code: "",
      colorCode: "",
      disableInput: false,
      newItem: true,
      displayName: "",
      flagName: "",
      flagPath: "",
      icon: "ban",
      listItemId: "",
      listType:
        tableType == "ListTable"
          ? this.systemsettingObject.selectedValueAsperList
          : this.systemsettingObject.selectedStatusOnDropdown,
    };
    if (tableType == "ListTable") {
      this.systemsettingObject.dataToShowAsperList.unshift(obj);
    } else if (tableType == "Indicator") {
      (obj.operator = ""),
        (obj.value = ""),
        (obj.period = ""),
        (obj.listType = "Case Risk"),
        this.systemsettingObject.indicatorList.unshift(obj);
    } else if (tableType == "AlertIndicator") {
      (obj.operator = ""),
        (obj.value = ""),
        (obj.period = ""),
        (obj.listType = ""),
        (obj.feed = ""),
        this.systemsettingObject.alertIndicatorList.unshift(obj);

    } else if (tableType == "EntityWorkFlow") {
      var obj: any = {
        id: null,
        entityId: null,
        entityName: '',
        workflowModelKey: null,
        workflowName: '',
        disableInput: false,
        isValid: true,
        errorMessage: ''
      };
      this.systemsettingObject.entityWorkFlowList.unshift(obj);
    } else {
      this.systemsettingObject.answerToshowInTable.unshift(obj);
    }
  }

  /*
   * @purpose: Updated to add the save function for Alert Indicator
   * @updated:12 December 2020
   * @author: Upeksha
   */

  public saveEditUpdateListInTable(rowIndex: number, edittedObj, tableType) {
    let allowUpdate;
    
    if (tableType == "ListTable") {
      if (
        this.systemsettingObject.dataToShowAsperList[rowIndex].displayName !=
        this.systemsettingObject.storeBeforeEditing.displayName ||
        this.systemsettingObject.dataToShowAsperList[rowIndex].code !=
        this.systemsettingObject.storeBeforeEditing.code
      ) {

        if(this.selectedEntityTypeListManagement && this.selectedEntityTypeListManagement.entityName === 'Document'){
          edittedObj.listType = 'Document Status'
        }

        console.log(edittedObj);
        setTimeout(() => {
          this.callSaveUdpateAPI(edittedObj, rowIndex, tableType);
        }, 0);
      }
      this.systemsettingObject.dataToShowAsperList[rowIndex].disableInput = true;
    } else if (tableType == 'Indicator') {
      allowUpdate = false;
      let isvalid = true;
      //checking if the all fields are filled
      if (
        this.systemsettingObject.indicatorList[rowIndex].code == "" ||
        this.systemsettingObject.indicatorList[rowIndex].operator == "" ||
        this.systemsettingObject.indicatorList[rowIndex].value == "" ||
        this.systemsettingObject.indicatorList[rowIndex].period == ""
      ) {
        this._sharedService.showNewFlashMessage(
          "All fields are required",
          "danger"
        );
        isvalid = false;
        return false;
      }

      // Validating if provided value supports the period type and if now showing warning flash message
      let checkValueSatatus = this.checkValue();

      if (checkValueSatatus != "") {
        this._sharedService.showNewFlashMessage(checkValueSatatus, "danger");
        return false;
      }

      //prevent adding same indictor type in multiple rows
      const isAlreadyAdded = this.systemsettingObject.currentindicatorList.some(
        (e) => e.code === edittedObj.code
      );
      if (
        isAlreadyAdded &&
        this.systemsettingObject.indicatorList[rowIndex].code !=
        this.systemsettingObject.storeBeforeEditing.code
      ) {
        this._sharedService.showNewFlashMessage(
          "Can`t add the same indictor type in multiple rows",
          "danger"
        );
        isvalid = false;
        return false;
      }
      if (isvalid) {
        if (
          this.systemsettingObject.indicatorList[rowIndex].code !=
          this.systemsettingObject.storeBeforeEditing.code ||
          this.systemsettingObject.indicatorList[rowIndex].operator !=
          this.systemsettingObject.storeBeforeEditing.operator ||
          this.systemsettingObject.indicatorList[rowIndex].value !=
          this.systemsettingObject.storeBeforeEditing.value ||
          this.systemsettingObject.indicatorList[rowIndex].period !=
          this.systemsettingObject.storeBeforeEditing.period
        ) {
          setTimeout(() => {
            this.generalSettingsApiService
              .saveOrUpdateIndicator(edittedObj, allowUpdate)
              .then(
                (response) => {
                  if (response && response["message"] == "successful") {
                    this.systemsettingObject.indicatorDrop.forEach(
                      (element) => {
                        if (element.code == edittedObj.code) {
                          element.isCodeSelected = true;
                        }
                      }
                    );
                    this.systemsettingObject.indicatorList[
                      rowIndex
                    ].disableInput = true;
                    this.systemsettingObject.currentindicatorList = JSON.parse(
                      JSON.stringify(this.systemsettingObject.indicatorList)
                    );
                  } else {
                    this.confirmUpdate(
                      edittedObj,
                      allowUpdate,
                      rowIndex,
                      response["message"]
                    );
                  }
                },
                (error) => {
                  this._sharedService.showNewFlashMessage(
                    error.error.responseMessage,
                    "danger"
                  );
                }
              );
            // this.callSaveUdpateAPI(edittedObj, index, tableType);
          }, 0);
        } else {
          this.systemsettingObject.indicatorList[rowIndex].disableInput = true;
        }
      }
    } else if (tableType == 'AlertIndicator') {
      allowUpdate = false;
      let isvalid = true;
      //check whether user select at least one item from the feed classfication list
      let isFeedBackClissficationExists = this.systemsettingObject.alertIndicatorList[rowIndex].hasOwnProperty('feedClasification');

      //checking if the all fields are filled
      if (
        this.systemsettingObject.alertIndicatorList[rowIndex].code == '' ||
        this.systemsettingObject.alertIndicatorList[rowIndex].operator == '' ||
        this.systemsettingObject.alertIndicatorList[rowIndex].value == '' ||
        this.systemsettingObject.alertIndicatorList[rowIndex].period == '' ||
        !isFeedBackClissficationExists


      ) {
        this._sharedService.showNewFlashMessage(
          'All fields are required',
          'danger'
        );
        isvalid = false;
        return false;
      }

      // Validating if provided value supports the period type and if now showing warning flash message
      let checkValueSatatus = this.checkValue();

      if (checkValueSatatus != '') {
        this._sharedService.showNewFlashMessage(checkValueSatatus, 'danger');
        return false;
      }
      if (isvalid) {
        if (
          this.systemsettingObject.alertIndicatorList[rowIndex].code !=
          this.systemsettingObject.storeBeforeEditing.code ||
          this.systemsettingObject.alertIndicatorList[rowIndex].operator !=
          this.systemsettingObject.storeBeforeEditing.operator ||
          this.systemsettingObject.alertIndicatorList[rowIndex].value !=
          this.systemsettingObject.storeBeforeEditing.value ||
          this.systemsettingObject.alertIndicatorList[rowIndex].period !=
          this.systemsettingObject.storeBeforeEditing.period ||
          this.isFeedBackListChanged
        ) {
          setTimeout(() => {
            if (JSON.stringify(this.systemsettingObject.storeBeforeEditing) === '{}') {
              this.generalSettingsApiService
                .saveOrUpdateAlertIndicator(edittedObj, allowUpdate)
                .then(
                  (response) => {
                    if (response && response['message'] == 'successful') {
                      this.getAlertIndicatorList(this.alertListType);
                      this.systemsettingObject.alertIndicatorList[
                        rowIndex
                      ].disableInput = true;
                    } else {
                      this._sharedService.showNewFlashMessage(checkValueSatatus, 'danger');
                      return false;
                    }
                  },
                  (error) => {
                    this._sharedService.showNewFlashMessage(
                      error.error.responseMessage,
                      'danger'
                    );
                  }
                );
            } else {
              let title = 'Are you sure you want to update this Alert Indicator ? ';
              this.confirmAlertIndicatorUpdate(
                edittedObj,
                allowUpdate,
                rowIndex,
                title
              );
            }

          }, 0);
        } else {
          this.systemsettingObject.alertIndicatorList[rowIndex].disableInput = true;
        }
      }
    } else if (tableType == 'EntityWorkFlow') {
      allowUpdate = false;
      
      if (
        this.systemsettingObject.entityWorkFlowList[rowIndex].entityId == null ||
        this.systemsettingObject.entityWorkFlowList[rowIndex].workflowModelKey == null
      ) {
        this._sharedService.showNewFlashMessage(
          'All fields are required',
          'danger'
        );
        return false;
      }
      if (this.systemsettingObject.entityWorkFlowList[rowIndex].id == null) {
        let modalInstanceEdit = this.modalservice.open(ConfirmationEditEntityworkflowsComponent, {
          windowClass:
            "custom-modal c-arrow center bst_modal add-ownership-modal add-new-officer",
        });
        if (tableType && tableType == 'EntityWorkFlow') {
          modalInstanceEdit.componentInstance.msg =`Only newly created ${edittedObj.entityName} will be assigned with the statuses of workflow "${edittedObj.workflowName}", Existing ${edittedObj.entityName} you can still proceed with the statuses of "${this.systemsettingObject.storeBeforeEditing.workflowName}"`;
              
        } 
        modalInstanceEdit.componentInstance.editTitle = `Change ${edittedObj.workflowName} to ${this.systemsettingObject.storeBeforeEditing.workflowName}`;
        modalInstanceEdit.componentInstance.isShowHeader = true;
        modalInstanceEdit.componentInstance.confirmationData.subscribe((resp) => {
          if (resp) {
            this.saveEntityWorkflows(edittedObj, rowIndex);
          }
        });
       
      } else {
        
        this.generalSettingsApiService.validateworkflow(
          this.systemsettingObject.entityWorkFlowList[rowIndex].entityName,
          this.systemsettingObject.entityWorkFlowList[rowIndex].workflowModelKey).then((res) => {
            if (!res) {
              let modalInstanceEdit = this.modalservice.open(ConfirmationEditEntityworkflowsComponent, {
                windowClass:
                  "custom-modal c-arrow center bst_modal add-ownership-modal add-new-officer",
              });
              if (tableType && tableType == 'EntityWorkFlow') {
                modalInstanceEdit.componentInstance.msg =`Only newly created ${edittedObj.entityName} will be assigned with the statuses of workflow "${edittedObj.workflowName}", Existing ${edittedObj.entityName} you can still proceed with the statuses of "${this.systemsettingObject.storeBeforeEditing.workflowName}"`;
                   
              } 
              
              modalInstanceEdit.componentInstance.editTitle = `Change ${edittedObj.workflowName} to ${this.systemsettingObject.storeBeforeEditing.workflowName}`;
              modalInstanceEdit.componentInstance.isShowHeader = true;
              modalInstanceEdit.componentInstance.confirmationData.subscribe((resp) => {
                if (resp) {
                  this.saveEntityWorkflows(edittedObj, rowIndex);
                }
              });
            } else {
              this._sharedService.showNewFlashMessage(
                'Workflow can`t be updated due to existing entities with different sets of statuses.',
                'warning'
              );
              return false;
            }
          }).catch(error => {
          });
      }
    }
  }

  saveEntityWorkflows(edittedObj, index) {
    const saveObj = {
      id: (edittedObj.id) ? edittedObj.id : null,
      entityName: edittedObj.entityName,
      workflowName: edittedObj.workflowName,
      workflowModelKey: edittedObj.workflowModelKey,
      entityId: edittedObj.entityId,
      isValidated: true
    };
    this.generalSettingsApiService.saveEntityWorkflows(saveObj)
      .then(
        (response) => {
          this.getEntityWorkflows();
        },
        (error) => {
          this._sharedService.showNewFlashMessage(error.error.responseMessage, 'danger');
        }
      );

    this.systemsettingObject.entityWorkFlowList[index].disableInput = true;
  }
  /*
   * @purpose: function to call save/Update API
   * @created: 12 August 2019
   * @author:  Amritesh
   * @param :data(obj),index(number)
   */
  callSaveUdpateAPI(data, index, tableType) {
    this.generalSettingsApiService.addUpdateListItem(data).then(
      (response: any) => {
        if (response) {
          if (tableType == "ListTable") {
            if (this.systemsettingObject.selectedValueAsperList === 'Entity Status' && this.selectedEntityTypeListManagement) {
              this.changeListManagementEntityStatusType(this.selectedEntityTypeListManagement)
            } else {
              this.getTableData(
                this.systemsettingObject.selectedValueAsperList,
                tableType
              );
            }
            if (
              this.systemsettingObject.selectedValueAsperList == "Alert Status"
            ) {
              this.callUpdateValFunction(data);
            }
            if (
              this.systemsettingObject.selectedValueAsperList ==
              "Article Status"
            ) {
              this.getAllStatusList();
            }
            if (this.systemsettingObject.selectedValueAsperList === 'Tenants') {
              this.getAllTenants(); // if any tenant update -> load the juridiction tenant mapping list again
            }
          } else {

            if(this.showEntityTypeListManagementDropdown && this.systemsettingObject.entityWorkFlowList && this.systemsettingObject.entityWorkFlowList.length){
              this.changeListManagementEntityStatusTypeFromSelect(this.selectedEntityTypeListManagement.entityName)
              return;
            }

            if (data.listType) {
              this.getTableData(data.listType, tableType);
            } else {
              this.getTableData(
                this.systemsettingObject.selectedStatusOnDropdown,
                tableType
              );
            }
          }
        }
      },
      (error) => {
        //show error and remove loader
        if (index || index == 0) {
          this.systemsettingObject.dataToShowAsperList[
            index
          ].code = this.systemsettingObject.storeBeforeEditing.code;
          this._sharedService.showNewFlashMessage(
            error.error.responseMessage,
            "error"
          );
        }
      }
    );
  }

  callUpdateValFunction(dataObj) {
    Object.values(this.systemsettingObject.settingsData).map((d: any) => {
      d.forEach((val) => {
        val.values.forEach((value, key) => {
          if (value.section == "Predefined Answers") {
            if (!value.options) {
              var obj = {
                attributeId: 0,
                attributeName: dataObj.code,
                attributeValue: dataObj.code,
                selected: true,
              };
              value.options = [];
              value.options.push(obj);
            } else {
              var obj = {
                attributeId: 0,
                attributeName: dataObj.code,
                attributeValue: dataObj.code,
                selected: false,
              };
              value.options.push(obj);
            }
            this.updateVal(value, key, false, false, false);
          }
        });
      });
    });
  }
  /*
   * @purpose: function to delete row from table
   * @created:25 July 2019
   * @author: Amritesh
   */

  /*
   * @purpose: Modified to include Alert Indicator delete
   * @updated: 27 November 2019
   * @author: Upeksha
   */

  deleteRow(deleteObj, tableType?) {
    this.systemsettingObject.deleteObjValue = deleteObj;
    var modalInstanceDel = this.modalservice.open(ConfirmaionmodalComponent, {
      windowClass:
        "custom-modal c-arrow center bst_modal add-ownership-modal add-new-officer",
    });
    if (tableType && tableType == 'EntityWorkFlow') {
      modalInstanceDel.componentInstance.title =
          this.translateService
              .instant('Are you sure you want to remove from ${entityName} an assigned ${workflowName} workflow?')
              .replace('${entityName}', deleteObj.entityName)
              .replace('${workflowName}', deleteObj.workflowName);
    } else {
      modalInstanceDel.componentInstance.title = this.translateService.instant('Are you sure you wish to delete this item?');
    }
    modalInstanceDel.componentInstance.confirmationData.subscribe((resp) => {
      if (resp) {
        if (tableType && tableType == 'EntityWorkFlow') {
          this.deleteEnityWorkflow(deleteObj);
        } else if (this.systemsettingObject.deleteObjValue.listType == "Case Risk" && tableType != 'List Management Settings') {
          this.deleteIndicator();
        } else {
          this.deleteItemFromList();
        }
      }
    });
  }
  /*
   * @purpose: function to handle delete indicator
   * @created:09 Sept 2020
   * @author: Saliya
   */
  deleteIndicator() {
    const index = this.systemsettingObject.indicatorList.indexOf(
      this.systemsettingObject.deleteObjValue
    );
    if (this.systemsettingObject.deleteObjValue.rowId) {
      this.generalSettingsApiService
        .deleteIndicator(this.systemsettingObject.deleteObjValue.rowId)
        .then((response) => {
          if (response) {
            this.systemsettingObject.indicatorList.splice(index, 1);
            this.systemsettingObject.currentindicatorList.splice(index, 1);
          }
        });
    } else {
      this.systemsettingObject.indicatorList.splice(index, 1);
    }
    this.systemsettingObject.indicatorDrop.forEach((element) => {
      if (
        this.systemsettingObject.deleteObjValue.code &&
        element.code == this.systemsettingObject.deleteObjValue.code
      ) {
        element.isCodeSelected = false;
      }
    });
  }

  /*
   * @purpose: function to handle delete modal
   * @created:25 July 2019
   * @author: Amritesh
   */
  deleteItemFromList() {
    this.generalSettingsApiService
      .deleteListItem(this.systemsettingObject.deleteObjValue.listItemId)
      .then(
        (response) => {
          if (response) {
            if (
              this.systemsettingObject.deleteObjValue.listType ==
              this.systemsettingObject.selectedValueAsperList
            ) {
              this.getTableData(
                this.systemsettingObject.selectedValueAsperList,
                "ListTable"
              );
              if (this.systemsettingObject.deleteObjValue.listType == "Alert Risk") {
                this._sharedService.showNewFlashMessage(
                  "Alert risk item deleted successfully",
                  "success"
                );
              } else if (this.systemsettingObject.deleteObjValue.listType === "Document Category") {
                this._sharedService.showNewFlashMessage(
                  "Document Category deleted successfully",
                  "success"
                );
              } else {
                this._sharedService.showNewFlashMessage(
                  "Feed Classification deleted successfully",
                  "success"
                );
              }
            } else {
              this.getTableData(
                this.systemsettingObject.selectedStatusOnDropdown,
                "AnswerTable"
              );
            }
          }
        },
        (error) => {
          this._sharedService.showNewFlashMessage(
            error.error.responseMessage,
            "danger"
          );
        }
      );
  }
  /*
   * @purpose: function on click of edit icon
   * @created:25 July 2019
   * @author: Amritesh
   */

  deleteEnityWorkflow(deleteObject) {
    const index = this.systemsettingObject.entityWorkFlowList.indexOf(deleteObject);
    if (deleteObject.id) {
      this.generalSettingsApiService
        .deleteEntityWorkflow(deleteObject.id)
        .then((response) => {
          if (response && response.message && response.message == 'successful') {
            this.systemsettingObject.entityWorkFlowList.splice(index, 1);
          }
        });
    } else {
      this.systemsettingObject.entityWorkFlowList.splice(index, 1);
    }
  }

  /*
   * @purpose: Updated to include Alert Indicator
   * @updated:30 November 2020
   * @author: Upeksha
   */
  editUpdateListInTable(index, beforeEditObj, tableType) {
    if (tableType == "ListTable") {
      this.systemsettingObject.dataToShowAsperList[index].disableInput = false;
    } else if (tableType == "Indicator") {
      this.systemsettingObject.indicatorList[index].disableInput = false;
    } else if (tableType == 'AlertIndicator') {
      this.systemsettingObject.alertIndicatorList[index].disableInput = false;
    } else if (tableType == 'EntityWorkFlow') {
      this.systemsettingObject.entityWorkFlowList[index].disableInput = false;
    } else {
      this.systemsettingObject.answerToshowInTable[index].disableInput = false;
    }
    this.systemsettingObject.storeBeforeEditing = { ...beforeEditObj };
  }
  /*
   * @purpose: function to handle cancel from edit value in table
   * @created: 1 August 2019
   * @author:  Amritesh
   */
  /*
   * @purpose: Updated to add Alert Indicator changes
   * @updated: 08 December 2020
   * @author:  Upeksha
   */
  cancelEditUpdateListInTable = function (index, tableType) {
    if (tableType == "ListTable") {
      if (
        Object.keys(this.systemsettingObject.storeBeforeEditing).length == 0
      ) {
        this.systemsettingObject.dataToShowAsperList.splice(index, 1);
      } else {
        this.systemsettingObject.dataToShowAsperList[index].disableInput = true;
        this.systemsettingObject.dataToShowAsperList[
          index
        ].displayName = this.systemsettingObject.storeBeforeEditing.displayName;
        this.systemsettingObject.dataToShowAsperList[
          index
        ].code = this.systemsettingObject.storeBeforeEditing.code;
      }
    } else if (tableType == "Indicator") {
      if (
        Object.keys(this.systemsettingObject.storeBeforeEditing).length == 0
      ) {
        this.systemsettingObject.indicatorList.splice(index, 1);
      } else {
        Object.keys(this.systemsettingObject.storeBeforeEditing).forEach(
          (key) => {
            this.systemsettingObject.indicatorList[index][
              key
            ] = this.systemsettingObject.storeBeforeEditing[key];
          }
        );
        this.systemsettingObject.indicatorList[index].disableInput = true;
      }
    } else if (tableType == "AlertIndicator") {
      if (
        Object.keys(this.systemsettingObject.storeBeforeEditing).length == 0
      ) {
        this.systemsettingObject.alertIndicatorList.splice(index, 1);
      } else {
        Object.keys(this.systemsettingObject.storeBeforeEditing).forEach(
          (key) => {
            this.systemsettingObject.alertIndicatorList[index][
              key
            ] = this.systemsettingObject.storeBeforeEditing[key];
          }
        );
        this.systemsettingObject.alertIndicatorList[index].disableInput = true;
      }
    } else if (tableType == "EntityWorkFlow") {
      if (
        Object.keys(this.systemsettingObject.storeBeforeEditing).length == 0
      ) {
        this.systemsettingObject.entityWorkFlowList.splice(index, 1);
      } else {
        Object.keys(this.systemsettingObject.storeBeforeEditing).forEach(
          (key) => {
            this.systemsettingObject.entityWorkFlowList[index][key] = this.systemsettingObject.storeBeforeEditing[key];
          }
        );
        this.systemsettingObject.entityWorkFlowList[index].disableInput = true;
      }
    } else {
      if (
        Object.keys(this.systemsettingObject.storeBeforeEditing).length == 0
      ) {
        this.systemsettingObject.answerToshowInTable.splice(index, 1);
      } else {
        this.systemsettingObject.answerToshowInTable[index].disableInput = true;
        this.systemsettingObject.answerToshowInTable[
          index
        ].displayName = this.systemsettingObject.storeBeforeEditing.displayName;
        this.systemsettingObject.answerToshowInTable[
          index
        ].code = this.systemsettingObject.storeBeforeEditing.code;
      }
    }
  };
  /*
   * @purpose: function to show pop with color ,icon and flag on click from table
   * @created: 2 August 2019
   * @author:  Amritesh
   */
  handlingPopUpFlagColorIcon(index, objeditColor) {
    this.systemsettingObject.addColorIconObj = {
      index: index,
      obj: objeditColor,
    };
    this.systemsettingObject.nameOfColor = this.systemsettingObject.addColorIconObj.obj.colorCode;
    this.systemsettingObject.nameOfIcon = this.systemsettingObject.addColorIconObj.obj.icon;
    this.systemsettingObject.nameOfFlag = this.systemsettingObject
      .addColorIconObj.obj.flagName
      ? this.systemsettingObject.addColorIconObj.obj.flagName
      : "";
    this.apiCALLToGetListofColorFlagIcon();
    setTimeout(function () {
      $(".check-btn").click(function () {
        $(".check-btn").removeClass("activeCheck");
        $(this).addClass("activeCheck");
      });
      // Add active class to the current button (highlight it)
      $(document).ready(function () {
        $(".icons-btn-wrapper").click(function () {
          $(".icons-btn-wrapper").removeClass("active");
          $(this).addClass("active");
        });
        $(".setting-icons-popover").mCustomScrollbar({
          axis: "y",
          theme: "minimal-dark",
          scrollInertia: 0,
        });
      });
    }, 1000);
  }
  /*
   * @purpose: function to get color and icon list and flag
   * @created: 23 August 2019
   * @author:  Amritesh
   */
  apiCALLToGetListofColorFlagIcon() {
    this.generalSettingsApiService.getColorList().then((response) => {
      this.systemsettingObject.colorList = response;
    });
    this.generalSettingsApiService.getIconList().then((response) => {
      this.systemsettingObject.iconList = response;
    });
    if (this.systemsettingObject.jurisdictionList.length == 0) {
      this.getjurisdictionList();
    }
  }
  getjurisdictionList() {
    this.generalSettingsApiService.getJurisdictionList().then(
      (response: any) => {
        if (response && response.length > 0) {
          response.forEach((juridisction) => {
            if (
              juridisction &&
              juridisction.jurisdictionOriginalName &&
              juridisction.jurisdictionOriginalName.toUpperCase() !== "ALL" &&
              juridisction.jurisdictionOriginalName.toUpperCase() !== "ANY"
            ) {
              //we are not showing ALL option and the null names
              juridisction.jurisdictionName = juridisction.jurisdictionName
                ? juridisction.jurisdictionName.toUpperCase()
                : "";
              juridisction.key = juridisction.jurisdictionName;
              juridisction.name = juridisction.jurisdictionOriginalName;
              juridisction.key2 = juridisction.jurisdictionName.toLowerCase();
              juridisction.flag =
                "../../../../assets/css/flags/1x1/" +
                juridisction.key2 +
                ".svg";
              this.systemsettingObject.jurisdictionList.push(juridisction);
            }
            this.filteredjurisdiction = [
              ...this.systemsettingObject.jurisdictionList,
            ];
          }); //for each ends
          var singlearray = this.systemsettingObject.jurisdictionList.map(
            (val) => val.key
          );
          var arr2 = this.systemsettingObject.jurisdictionList.filter(
            (item, pos) => {
              if (pos == singlearray.indexOf(item.key)) {
                return item;
              }
            }
          );
          this.systemsettingObject.jurisdictionList = [...arr2];
        }
      },
      () => { }
    );
  }
  searchJurisdiction(key) {
    if (key) {
      this.filteredjurisdiction = this.systemsettingObject.jurisdictionList.filter(
        (val) => {
          return val.key.toLowerCase().indexOf(key.toLowerCase()) !== -1;
        }
      );
    } else {
      this.filteredjurisdiction = [
        ...this.systemsettingObject.jurisdictionList,
      ];
    }
  }

  /*
   * @purpose: function to Add icon from popover
   * @created:25 July 2019
   * @author: Amritesh
   */
  addIcon = function (iconName) {
    this.systemsettingObject.nameOfIcon = iconName;
    this.systemsettingObject.nameOfFlag = "";
  };
  /*
   * @purpose: function to Add flag from popover
   * @created:25 july 2019
   * @author: Amritesh
   */
  addCountryFlag(flagName) {
    this.systemsettingObject.nameOfFlag = flagName;
    this.systemsettingObject.nameOfIcon = "";
  }
  //////////////////////  LIST MANAGEMENT SETTINGS Table Editting ENDS////////////////
  removeCustomerLogo(setting) {
    const imageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAF4AAABeCAMAAACdDFNcAAACkVBMVEVfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYNfdYOW1ZUiAAAA2nRSTlMAAQIDBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR8gISIkJicoKSorLC0uLzEyMzQ1Njc4OTo7PD0+P0BBQkNFR0pLTE1OT1FSU1RVVldYWVtcXV5gYWJjZGVmaGlrbW9xcnN1eHl6e3x9fn+AgYKDhoeIiYqLjY6PkJGSk5SVlpeYmZqbnJ2goqOkpqeoqaqrrK2ur7Cys7a4uby9vr/AwcLDxMXGx8jJysvMzc7P0NHS09XW19jZ2tzd3t/g4uPk5ebn6err7O3u7/Dx8vP09fb3+Pn6+/z9/lEN8roAAAazSURBVGjetVr7Q1RFFB42g90lQF2MyFUTLSUtX5kuaKaiKSSoKCym2cMSDEWlh2UgIlpqArH4QMNExRJKfCUGKgopi/LwBcL+Nd05M7v3snfuvXPvrvPLzsw999vZM2fO+c6ZRYinWaZkbi+tbWzv9Dx1NzWcLdueOcWCgtMs83ec7/PIWt/5HfMD/gpzquuxR7E9dqWaAwCP3/XAo9EeFMYbBE+sGvBwtIGqRAPgM36TYtxw5aU7xkcLqjBHj3ek57luSJ9Wz9AJPnxPv+/ltgMZo+USozP2t/lE+vfYdICHOO/5dFucaFISMyUU+/bmnjOEF32kTy/X1oSri4avuebT0Eg+9IVu+sLlJSZtadOSy1TcvZBHMZupvbRmmPiWY8popTa0WVNBYWV0s3ZF8O9VRCE1hLIwdcHIGiJ3e64+S5tzm7xXE6lqj/VE6ni03mMSfZy8WT9cZe11RIebTPqPoWkT2bM6xfWHnSaO6kNjTiSFOL8zCn405AA87p5r1AMmdgHAAbb9bIGHD2ca97AzHwLEFtazxaC73kWBhIdFvbB3ixmeAM7qwPLAws9yWKPbLlN8Nfyu7EDDWzbxP/7qz4TpypBA4UMqASjT7zy148mbQwOP/ENvYqT2wadrDyg+IRjMIgHUv1c6NR2mCoPDXAphqdMlM7CvbXw+MnTyF0evtt5t+fvguknMNyIgSJ6U+DvYjgwudHvhI5FKHV8VyxBZDQ/Fw18FsYnLj71eN5iG1K4MlXs3iF9V3uFE0PxSLr97QsZzfn5NJrUUtP8mHe3Coytci//Yx6xqKpppr/4tmfFfwfPFZGAFNpHFg249SiFbkkdEjCqgg8aJ/nJZeLrLCv1U3O+08sBPuEojcRoeDamg+Cf8j6O1E0+nQt+Fu0VcZvNOC8G7SGhbSifFX+cvWAQuBjg2GJqDj3jeInCnX4ZhDP0xnj/9BR149hFm5wuA1PBF1/h/KGOiu3mMwrfLbBOozwKhtwN39vGd96hqivcrSRs+6SXDOzLJvXj6B6FzHneWcfqTnV67/BaGsVRZ38sEl4HJCqqHvCmGE36F1yP0rYfxd2QrXpEJxoCQBU3Dn0283jD2onf53UsghAo67j81liHZhIWmkTDl4va2OT5ncGsqHq/p89Qwf7qLBK18RerAbMMafPgNQOi3eU6+xBLcjEXyUSn+SOcPFh+IWdGxKGH84o+ejSy5dCxRimrxx2wdwahCdJYF2BmH7u6bwxCDg1WLruOPOB3wE+6L4eRzzCzM+xtGyMXisMB1BBRBT16HvhKX/wTYrsXJYBg2cprBK+lK3WMvifjtihltGFgvAil9VGBFr4h/ZYySFAE2AB9ZKYmFJ2yq8F16lGNfmIwPk+OuBH+fWU05bv6tDc++0NFzo3QiMu2UwPfnMIVha93EN3AZ5oKz5EQ1vIFGNUqrOkzSHkd82R+cx2pMcY8X75DJ5+hJuWQ8Q342fnKO0ylEZraIcF2pKLRGSnW2mhSdAri0XA30d48MpmbD0HvSGtgtBhXMJS4NHHK5ul623vdjZp/RaOdtSfKXyolD1g4ny/+SEb/b49CYVsl4g/ytf0k4sWgEw0muh4wCmuAr10uG29jB8JnAzerUQrk1p5VZn3syF404JQ6/ZIfyC+pEZMj75/oV6n+/m9GiZ76RfHUlXiKiTKPGFvYp1xfXIvNP3n5PnDKNUiKBQ9c2q5Uvb76KJntLgYfMyiQQVTIp7LyjGuXRPG8VwtMtr5OKFJZJwKO+bteqvgrJjY2c3Q0vyCwCUoY0xfThiHZx9xvst04Ka/9Unl1J0wea/AzK93+5c/c/1da0E+JrVMpHb8sLBYOSHxTPn7pxciFI3SYZSDy5ymqXBiWeNG1eHSz4VX5ps66kX7to6p/0P++SxXMuuASxXBTFKhfRYpcr8GKXi1XsClqpbiO7VIfsQSw0dtiVyqRPkwJBT3qqVCZFKC9YRd489q4cJN57juESdTcJLgr2YTlDOGOKMfRk9QK7eD2QY+R6IFvreuB5X25IrmZ0+ocEejVzOlJdLqycJgUFei6WCigdKg/TPNV5xq/FtvD4lKQOY5d6HZwn0l7tu5J0ahQIrU7xStLObWRZkgtVh/KFqmO3eKGapceYbSXiRXZbSTKDn8ckl4jXwQMlNp2GPKNaypmaK3JXzhpnEwhTqG3crJW5Fc0BXWYDf+C9ijfqpOKLtP9IUBQfgAMPTzus9jeIw2lWFGAT/sRRz/oTR30Q/sTh/Yqpzvyy2ka3kJj3uBtry/KdU/mg/wfvk4RYAPyqwAAAAABJRU5ErkJggg==';
    setting.customerLogoImage = ""; //setting.defaultValue;
    setting.selectedValue = imageBase64;
    setting.defaultValue = imageBase64;
    this.updateVal(setting, false, false, false, false);
    this._commonServices.isLogoUpdated.next(setting.defaultValue);
  }

  //////////////////////// json file upload Edit and  Replace Strts //////////
  onSelect(typedItem, itemsList) {
    this.systemsettingObject.filteredArrayRegionalSetting = itemsList.some(
      function (itm) {
        return itm.displayName.toLowerCase() == typedItem.toLowerCase();
      }
    );
  }
  /*
   * @purpose: function to open upload csv file in regional settings
   * @created:20 ded 2019
   * @author: Amritesh
   */

  uploadCsvFiles(inputEnteredVal, settingObjData) {
    this.systemsettingObject.settingLaguageObject = settingObjData;
    this.systemsettingObject.inputEnteredValLanguage = inputEnteredVal;
    const modalInstanceUploadCsv = this.modalservice
      .open(UploadCSVComponent, {
        windowClass:
          "custom-modal c-arrow center bst_modal add-ownership-modal",
      })
      .result.then(
        (response) => {
          this.uploadDocumentOnSubmit(response[0]);
        },
        (reason) => { }
      );
  }
  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instance.isPopupOpen())
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        (term === ""
          ? this.systemsettingObject.languageList
          : this.systemsettingObject.languageList.filter(
            (v) =>
              v.displayName.toLowerCase().indexOf(term.toLowerCase()) > -1
          )
        ).slice(0, 10)
      )
    );
  };

  slelectedLanguage(item, setting) {
    this.systemsettingObject.selected_Language = item.item.displayName;
    this.systemsettingObject.backupSelectedLanguage = item.item;
    setting.selectedValue = item.item;
    this.systemsettingObject.showAdddLanguageJSon = false;
    this.updateVal(setting, false, false, false, false);
    this.getSelectedFilename(this.systemsettingObject.selected_Language);
  }
  formatter = (val) => val.displayName;

  uploadDocumentOnSubmit(file) {
    if (file) {
      var ext = file.name.split(".").pop().toLowerCase();
      if (ext == "zip") {
        var params = {
          fileName: this.systemsettingObject.inputEnteredValLanguage,
        };
        var data = {
          uploadFile: file,
        };

        this.generalSettingsApiService.uploadCSVFilesAPI(file, params).then(
          (resp) => {
            this.systemsettingObject.filteredArrayRegionalSetting = true;
            var objListItem = {
              code: this.systemsettingObject.inputEnteredValLanguage,
              colorCode: "",
              allowDelete: true,
              disableInput: true,
              displayName: this.systemsettingObject.inputEnteredValLanguage,
              flagName: "",
              flagPath: "",
              icon: "ban",
              listItemId: "",
              listType: "Languages",
            };
            this.callSaveUdpateAPI(objListItem, 1, "ListTable");
            this.updateVal(
              this.systemsettingObject.settingLaguageObject,
              false,
              false,
              false,
              false
            );
            this.getSelectedFilename(this.systemsettingObject.inputEnteredValLanguage);

          },
          (err) => {
            this._sharedService.showNewFlashMessage(
              err.error.responseMessage,
              "danger"
            );
          }
        );
      } else {
        this._sharedService.showNewFlashMessage(
          "The uploaded file must be of type ZIP",
          "danger"
        );
      }
    }
  }
  /*
   * @purpose: function to Download csv file in regional settings
   * @created:23 dec 2019
   * @author: Amritesh
   */

  downloadCSV(filename, docObj) {
    var objToDownload = this.systemsettingObject.languageList.find((val) => {
      return (
        val.displayName.toLowerCase() == docObj.selectedValue.toLowerCase()
      );
    });
    var params = {
      zipFileName: filename,
    };

    this.generalSettingsApiService.downloadCSVFilesAPI(params).then((resp) => {
      var blob = new Blob([resp], {
        type: "application/json",
      });
      saveAs(blob, docObj.selectedValue + ".zip");
      this._sharedService.showNewFlashMessage(
        `Successfully downloaded document with file title:${docObj.selectedValue}`,
        "success"
      );
    });
  }

  mouseover(element) {
    if (!element) {
      this.systemsettingObject.showAdddLanguageJSon = false;
    } else {
      var languageList = this.systemsettingObject.languageList.some((val) => {
        return val.displayName.toLowerCase() == element.toLowerCase();
      });
      this.systemsettingObject.showAdddLanguageJSon = !languageList;
    }
  }
  //////////////////// upload file edit dele replace ends ////////

   preventDefault($event) {
    $event.preventDefault();
    $event.stopPropagation();
    return;
  }
  /*
   * @purpose: function to Add color from popover
   * @created:25 july 2019
   * @author: Amritesh
   */
  addColor = function (colorName) {
    this.systemsettingObject.nameOfColor = colorName;
  };
  refernce(p2) {
    this.p2 = p2;
  }
  /*
   * @purpose: on click of ADD from popover change icon & color
   * @created:25 July 2019
   * @author: Amritesh
   */
  changeColorNIconToTable() {
    this.systemsettingObject.dataToShowAsperList[
      this.systemsettingObject.addColorIconObj.index
    ].colorCode = this.systemsettingObject.nameOfColor;
    this.systemsettingObject.dataToShowAsperList[
      this.systemsettingObject.addColorIconObj.index
    ].icon = this.systemsettingObject.nameOfIcon;
    this.systemsettingObject.dataToShowAsperList[
      this.systemsettingObject.addColorIconObj.index
    ].flagName = this.systemsettingObject.nameOfFlag;
    this.systemsettingObject.dataToShowAsperList[
      this.systemsettingObject.addColorIconObj.index
    ].flagPath =
      "vendor/jquery/flags/1x1/" +
      this.systemsettingObject.nameOfFlag.toLowerCase() +
      ".svg";
    this.callSaveUdpateAPI(
      this.systemsettingObject.addColorIconObj.obj,
      false,
      false
    );
  }

  dimisspop(event) {
    this.systemsettingObject.selected_Language = {
      ...this.systemsettingObject.backupSelectedLanguage,
    };
    this.systemsettingObject.showAdddLanguageJSon = false;

    event.stopPropagation();
    return;
  }

  /*
   * @purpose: on change the entity type dropdown
   * @created:22-07-2020
   * @author: shravani
   */
  /*
   * @purpose: Updated to add Alert Indicator changes
   * @updated:30-11-2020
   * @author: Upeksha
   */
  changeEntityType(value: string, index?: number, type = "") {
    this.systemsettingObject.periodValue = value;
    this.filterStatusReasons(
      this.selectedEntity,
      this.selectedEntityStatus,
      "type"
    );

    /*
     * @purpose: validating if the value entered supports the period type
     * @updated: 19-OCT-2020
     * @author: Ashen
     */
    if ((type = "ListTable" && this.systemsettingObject.indicatorList[index])) {
      this.checkValue();
    } else if (type == "AlertListTable" && this.systemsettingObject.alertIndicatorList[index]) {
      this.checkValue();

    }
  }

  /*
   * @purpose: to popuplate indicator object from risk object on change the case risk type dropdown
   * @created:10-09-2020
   * @author: saliya
   */
  public changeIndicatorType(value: string, obj: Object) {
    const dropObj = this.systemsettingObject.indicatorDrop.find(
      (e) => e.code === value
    );
    Object.keys(dropObj).forEach((key) => {
      obj[key] = dropObj[key];
    });
  }
  /*
   * @purpose: to check indicator value from risk object on have the value if it is allowed or not
   * @created:10-09-2020
   * @author: sarvani harshita
   */
  /*
   * @purpose: return check value status to be used by changeEntityType and saveEditUpdateListInTable
   * @updated: 19-OCT-2020
   * @author: Ashen
   */
  private checkValue(): string {
    const errorElems: Array<HTMLElement> = Array.from(document.getElementsByTagName("mat-error")) as Array<HTMLElement>;

    return errorElems.length ? errorElems.map((elem: HTMLElement) => elem.innerText).join(', ') : '';
    ;
  }
  /*
   * @purpose: on change entity status dropdown
   * @created:22-07-2020
   * @author: shravani
   */
  changeEntityStatus(event) {
    let statusFilter = this.systemsettingObject.allStatusData.filter(
      (item) => item.entity_name === this.selectedEntity
    );
    statusFilter.filter((el) => {
      if (el.status_value === event.target.value) {
        this.selectedEntityStatusKey = el.status_key;
      }
    });
    this.filterStatusReasons(
      this.selectedEntity,
      this.selectedEntityStatus,
      "status"
    );
  }

  public changeEntityWorkflow(selectedValue: string | number, index: number, type: string): void {
    if (type === 'entity') {
      const dropObj = this.systemsettingObject.entityTypeDrop.find((e) => e.attributeId == selectedValue);
      this.systemsettingObject.entityWorkFlowList[index].entityName = dropObj.attributeName;
      this.systemsettingObject.entityWorkFlowList[index].entityId = parseInt(this.systemsettingObject.entityWorkFlowList[index].entityId);
      this.systemsettingObject.entityWorkFlowList[index].isValid = true;
      this.systemsettingObject.entityWorkFlowList[index].errorMessage = '';
      const entityDuplicates = this.systemsettingObject.entityWorkFlowList.filter(item => item.entityId == dropObj.attributeId);
      if (entityDuplicates && entityDuplicates.length > 1) {
        this.systemsettingObject.entityWorkFlowList[index].isValid = false;
        this.systemsettingObject.entityWorkFlowList[index].errorMessage = 'Entity to workflow assignment already exists.';
      }
    }
    else {
      const dropObj = this.systemsettingObject.workFlowDrop.find((e) => e.workflowModelKey == selectedValue);
      this.systemsettingObject.entityWorkFlowList[index].workflowName = dropObj.workflowName;
    }
  }

  /*
   * @purpose: filter the reasons based on the entity type and status
   * @created:24-07-2020
   * @author: shravani
   */
  filterStatusReasons(type, status, fType) {
    let statusFilter = this.systemsettingObject.allStatusData.filter(
      (item) => item.entity_name === this.selectedEntity
    );

    this.systemsettingObject.entityStatus = statusFilter;
    if (fType !== "status" && statusFilter.length > 0) {
      this.selectedEntityStatus = this.systemsettingObject.entityStatus[0].status_value;
      this.selectedEntityStatusKey = this.systemsettingObject.entityStatus[0].status_key;
    }
    statusFilter.forEach((el) => {
      if (el.status_key === this.selectedEntityStatusKey) {
        this.systemsettingObject.reasonsData = el.reasons;
      }
    });

    this.systemsettingObject.reasonsData.forEach((v1) => {
      v1.disableInput = true;
      v1.disableCode = true;
    });
  }

  /*
   * @purpose: on click of the add button add row
   *@created:22-07-2020
   * @author: shravani
   */
  addRowInReasonTable(type, status) {
    this.systemsettingObject.storeBeforeEditing = {};
    var obj = {
      allowDelete: true,
      disableCode: false,
      disableInput: false,
      reason_code: "",
      reason: "",
      entity_status_id: "",
      reason_id: "",
    };
    this.systemsettingObject.reasonsData.unshift(obj);
  }
  /*
   * @purpose: on click cancel icon revert the changes
   * @created:22-07-2020
   * @author: shravani
   */
  cancelEditUpdateResaon(index, list) {
    if (Object.keys(this.systemsettingObject.storeBeforeEditing).length == 0) {
      this.systemsettingObject.reasonsData.splice(index, 1);
    } else {
      this.systemsettingObject.reasonsData[index].disableInput = true;
      this.systemsettingObject.reasonsData[index].disableCode = true;
      this.systemsettingObject.reasonsData[
        index
      ].reason = this.systemsettingObject.storeBeforeEditing.reason;
      this.systemsettingObject.reasonsData[
        index
      ].reason_code = this.systemsettingObject.storeBeforeEditing.reason_code;
    }
  }
  /*
  * @purpose: delete the row from reason table
  @created:22-07-2020
  * @author: shravani
  */
  deleteReasonRow(deleteObj) {
    this.systemsettingObject.deleteObjValue = deleteObj;
    var modalInstanceDel = this.modalservice.open(ConfirmaionmodalComponent, {
      windowClass:
        "custom-modal c-arrow center bst_modal add-ownership-modal add-new-officer",
    });
    modalInstanceDel.componentInstance.title = this.translateService.instant('Are you sure you wish to delete this item?');
    modalInstanceDel.componentInstance.confirmationData.subscribe((resp) => {
      if (resp) {
        let obj = {
          entity_status_id: this.getStatusId(),
          reason_id: deleteObj.reason_id,
        };
        this.generalSettingsApiService
          .deleteStatusReasons(obj)
          .then((response: any) => {
            if (response) {
              if (response.status === "error") {
                this._sharedService.showNewFlashMessage(
                  "Record can`t be deleted since it has been used by another entity",
                  "danger"
                );
              }
              this.getAllStatusList();
            }
          });
      }
    });
  }
  /*
   * @purpose: upadating the reason
   * @created:22-07-2020
   * @author: shravani
   */
  updateReasonsRow(index, list, tableType) {
    if (tableType == "Reasons") {
      let reasonToUpdate = this.systemsettingObject.reasonsData[index].reason;
      let matchReason = 0;
      this.systemsettingObject.allStatusData.forEach((item) => {
        item.reasons.forEach((el) => {
          if (el.reason === reasonToUpdate) {
            matchReason++;
          }
        });
      });

      if (matchReason > 1) {
        this.systemsettingObject.reasonsData[index].disableInput = false;
        this.systemsettingObject.reasonsData[index].disableCode = true;
      } else {
        this.systemsettingObject.reasonsData[index].disableInput = false;
        this.systemsettingObject.reasonsData[index].disableCode = false;
      }
    }
    this.systemsettingObject.storeBeforeEditing = { ...list };
  }

  /*
   * @purpose: save reasons
   * @created:24-07-2020
   * @author: shravani
   */
  saveReason(index, edittedObj) {
    if (!(edittedObj.reason == "") && !(edittedObj.reason_code == "")) {
      if (
        this.systemsettingObject.reasonsData[index].reason !=
        this.systemsettingObject.storeBeforeEditing.reason ||
        this.systemsettingObject.reasonsData[index].reason_code !=
        this.systemsettingObject.storeBeforeEditing.reason_code
      ) {
        let dataObj = {
          entity_status_id: this.getStatusId(),
          reason_code: edittedObj.reason_code,
          reason: edittedObj.reason,
          reason_id: edittedObj.reason_id,
        };
        this.generalSettingsApiService
        this.generalSettingsApiService
          .saveOrUpdateStatusReasons(dataObj)
          .then(
            (response: any) => {
              if (response) {
                if (response.status === "error") {
                  this._sharedService.showNewFlashMessage(
                    "Duplicate Record",
                    "danger"
                  );
                }
                this.getAllStatusList();
              }
            },
            (error: any) => {
              if (index || index == 0) {
                this._sharedService.showNewFlashMessage(
                  error.error.responseMessage,
                  "danger"
                );
              }
            }
          );
        this.systemsettingObject.reasonsData[index].disableInput = true;
        this.systemsettingObject.reasonsData[index].disableCode = true;
      } else {
        this._sharedService.showNewFlashMessage(
          "Plese Enter All Required Fields",
          "danger"
        );
      }
    }
  }
  /*
   * @purpose: get Indicator List
   *@created:4-09-2020
   * @author: Amritesh
   */
  getIndicatorList(listType) {
    this.generalSettingsApiService
      .getAllEntityIndicators(listType)
      .then((response: any) => {
        this.systemsettingObject.indicatorList = response.map((val) => {
          val.disableInput = true;
          return val;
        });
        this.systemsettingObject.currentindicatorList = JSON.parse(
          JSON.stringify(this.systemsettingObject.indicatorList)
        );
        this.getIndicator();
      });
  }

  /*
   * @purpose: get the entityStatusId based on the entity type :
   * @created:24-07-2020
   * @author: shravani
   */
  getStatusId() {
    let getStatusID;
    let statusFilter = this.systemsettingObject.allStatusData.filter(
      (item) => item.entity_name === this.selectedEntity
    );
    statusFilter.forEach((el) => {
      if (el.status_value === this.selectedEntityStatus) {
        getStatusID = el.entity_status_id;
      }
    });
    return getStatusID;
  }
  /*
   * @purpose: get all the list of status reasons API call
   * @created:24-07-2020
   * @author: shravani
   */
  getAllStatusList() {
    let data = null;
    this.generalSettingsApiService.getAllStatusReasons(data).then(
      (response: any) => {
        if (response) {
          this.systemsettingObject.allStatusData =
            response && response.result ? response.result : [];
          this.filterStatusReasons(
            this.selectedEntity,
            this.selectedEntityStatus,
            "status"
          );
        }
      },
      (error: any) => {
        this._sharedService.showNewFlashMessage(
          error.error.responseMessage,
          "danger"
        );
      }
    );
  }
  /*
   * @purpose:filter the country based on search
   * @created:26-08-2020
   * @author: Ram
   */
  _filterStates(value) {
    const filterValue =
      value.target && value.target.value
        ? value.target.value.toLowerCase()
        : "";
    this.systemsettingObject.filterStates = filterValue
      ? this.systemsettingObject.all_Jurisdictions.filter(
        (state) => state.displayName.toLowerCase().indexOf(filterValue) === 0
      )
      : this.systemsettingObject.all_Jurisdictions;
    if (!this.systemsettingObject.all_Jurisdictions.length) {
      this._sharedService.showNewFlashMessage(
        "No Juridictions found!",
        "info"
      );
    }
  }
  /*
   * @purpose:Add new Item to Routing Table
   * @created:26-08-2020
   * @author: Ram
   * @updated: Kasun @AP-1225
   */
  addItemtoRouting(item, index, mode) {
    // below code to allow one edit single time //
    // set type as add or edit
    this.systemsettingObject.tenantMode = mode;
    if (this.systemsettingObject.tenantMode === 'edit') {
      // set juridiction name on edit button click
      this.selectedJurisdiction = item.jurisdiction.displayName;
    }

    if (this.systemsettingObject.addEditTeanantObject.slectedIndex !== -1) {
      this.systemsettingObject.routingtableList[
        this.systemsettingObject.addEditTeanantObject.slectedIndex
      ].toEdit = false;
    }
    if (item) {
      this.systemsettingObject.routingtempSet = {
        toEdit: item.toEdit,
        tanents: [...item.tanents],
        jurisdiction: { ...item.countrySelected },
      };
      this.systemsettingObject.routingtableList[index].toEdit = true;
      this.systemsettingObject.selectedTenant = item.tanents.map(
        (val) => val.displayName
      );
      this.systemsettingObject.addEditTeanantObject.country =
        item.jurisdiction.code;
      this.systemsettingObject.addEditTeanantObject.slectedIndex = index;
      this.systemsettingObject.currentSelectedcountry = item.jurisdiction;
      this.systemsettingObject.temporaryselectedTenant = [...item.tanents];
    } else {
      this.systemsettingObject.addEditTeanantObject.country = "";
      this.systemsettingObject.selectedTenant = [];
      this.systemsettingObject.routingtableList.push({
        toEdit: true,
        tanents: [],
        jurisdiction: {
          displayName: "",
          listItemId: "",
        },
      });
      this.systemsettingObject.addEditTeanantObject.slectedIndex =
        this.systemsettingObject.routingtableList.length - 1;
      this.systemsettingObject.currentSelectedcountry = {};
      this.systemsettingObject.temporaryselectedTenant = [];
    }
    this.systemsettingObject.tentants.forEach((val) => {
      if (
        this.systemsettingObject.selectedTenant.indexOf(val.displayName) !== -1
      ) {
        val.isalreadySelected = true;
      } else {
        val.isalreadySelected = false;
      }
    });
    this.systemsettingObject.addEditTeanantObject.disableTenantAddButton = true;
  }

  addTentatstoList(event: MatChipInputEvent): void {
    // const input = event.input;
    // const value = event.value;

    // // Add our fruit
    // if ((value || "").trim()) {
    //   this.systemsettingObject.selectedTenant.push(value.trim());
    // }

    // // Reset the input value
    // if (input) {
    //   input.value = "";
    // }

    // // this.tenantsCtrl.setValue(null);
  }

  removeTentatsFromList(fruit: string): void {
    const index = this.systemsettingObject.selectedTenant.indexOf(fruit);

    if (index >= 0) {
      this.systemsettingObject.selectedTenant.splice(index, 1);
    }
    const tenantIndex = this.systemsettingObject.tentants.findIndex(
      (val) => val.displayName == fruit
    );
    this.systemsettingObject.tentants[tenantIndex].isalreadySelected = false;
  }

  selectedTenant(event: MatAutocompleteSelectedEvent): void {
    this.systemsettingObject.selectedTenant.push(event.option.viewValue);
    setTimeout(() => {
      this.tenantAuocompleteModel = null;
    }, 100);
  }

  TenantoptionSelected(tenant) {
    this.tenantAuocompleteModel = null;
    const tenantIndex = this.systemsettingObject.tentants.findIndex(
      (val) => val.displayName == tenant.displayName
    );
    this.systemsettingObject.tentants[tenantIndex].isalreadySelected = true;
    this.systemsettingObject.temporaryselectedTenant.push(tenant);
  }

  private _filter(value: any) {
    const filterValue =
      typeof value == "string" ? value : value.displayName.toLowerCase();
    this.filteredTenants = value
      ? this.systemsettingObject.tentants.filter((fruit) => {
        return fruit.displayName.indexOf(filterValue) !== -1;
      })
      : this.systemsettingObject.tentants;
    if (!this.systemsettingObject.tentants.length) {
      this._sharedService.showNewFlashMessage("No Tenants found!", "info");
    }
  }

  focusAutocomplete(element) {
    element.openPanel();
    this._filter("");
  }

  tenantcountrySelection(country) {
    if (!country.countryalreadyselected) {
      this.systemsettingObject.currentSelectedcountry = country;
    }
  }

  updateTenantData(url, type) {
    const selectedCountryCode =
      type === "add"
        ? this.systemsettingObject.currentSelectedcountry.code
        : this.systemsettingObject.addEditTeanantObject.country;

    if (
      this.systemsettingObject.temporaryselectedTenant.length &&
      this.systemsettingObject.selectedTenant.length &&
      (selectedCountryCode !== "" && selectedCountryCode !== undefined)
    ) {
      const addindex = this.systemsettingObject.all_Jurisdictions.findIndex(
        (val) => val.code === selectedCountryCode
      );
      if (type == "add") {
      } else {
        const index = this.systemsettingObject.all_Jurisdictions.findIndex(
          (val) =>
            val.code ==
            this.systemsettingObject.routingtableList[
              this.systemsettingObject.addEditTeanantObject.slectedIndex
            ].jurisdiction.code
        );
        this.systemsettingObject.all_Jurisdictions[
          index
        ].countryalreadyselected = false;
      }
      this.systemsettingObject.all_Jurisdictions[
        addindex
      ].countryalreadyselected = true;
      this.systemsettingObject.routingtableList[
        this.systemsettingObject.addEditTeanantObject.slectedIndex
      ].jurisdiction = this.systemsettingObject.currentSelectedcountry;
      this.systemsettingObject.routingtableList[
        this.systemsettingObject.addEditTeanantObject.slectedIndex
      ].toEdit = false;
      let tenantsIDs = [];
      this.systemsettingObject.temporaryselectedTenant = [];
      this.systemsettingObject.selectedTenant.forEach((val) => {
        const index = this.systemsettingObject.tentants.findIndex(
          (innerval) => innerval.displayName == val
        );
        if (index !== -1) {
          this.systemsettingObject.temporaryselectedTenant.push({
            ...this.systemsettingObject.tentants[index],
          });
        }
      });
      this.systemsettingObject.routingtableList[
        this.systemsettingObject.addEditTeanantObject.slectedIndex
      ].tanents = [...this.systemsettingObject.temporaryselectedTenant];

      tenantsIDs = this.systemsettingObject.temporaryselectedTenant.map(
        (val) => val.listItemId
      );

      // remove previous selected country on juridiction edit (if country changed | not handle in backend)
      if (type === 'edit') {
        if (this.systemsettingObject.currentSelectedcountry.code !== this.systemsettingObject.addEditTeanantObject.country) {
          if (this.systemsettingObject.addEditTeanantObject.country) {
            this.deleteByCountryCode(this.systemsettingObject.addEditTeanantObject.country);
          }
        }
      }

      let data = {};
      data = {
        jurisdictionCode: this.systemsettingObject.currentSelectedcountry.code,
        tanentIds: tenantsIDs,
      };
      this.generalSettingsApiService
        .crudTenantTable(data, url, "")
        .then((val: any) => {
          // on successfull add/update remove selected juridiction display value
          if (val.statusMessage === 'Success') {
            this.selectedJurisdiction = null;
            this.systemsettingObject.addEditTeanantObject.disableTenantAddButton = false;
          }
        }).catch((err) => {
          this.systemsettingObject.addEditTeanantObject.disableTenantAddButton = false;
        });
    } else {
      this._sharedService.showNewFlashMessage(
        "Plese Enter All Required Fields",
        "danger"
      );
    }
  }

  canCelRoutingtable(index) {
    if (index !== -1) {
      this.systemsettingObject.routingtableList[
        index
      ].countrySelected = this.systemsettingObject.routingtempSet.countrySelected;
      this.systemsettingObject.routingtableList[
        index
      ].tentants = this.systemsettingObject.routingtempSet.tentants;
      this.systemsettingObject.routingtableList[index].toEdit = false;
      if (
        !this.systemsettingObject.routingtableList[index].tentants &&
        !this.systemsettingObject.routingtableList[index].countrySelected && this.systemsettingObject.tenantMode === 'add'
      ) {
        this.systemsettingObject.routingtableList = this.systemsettingObject.routingtableList.slice(
          0,
          this.systemsettingObject.routingtableList.length - 1
        );
      }
    }
    this.systemsettingObject.addEditTeanantObject.slectedIndex = -1;
    this.systemsettingObject.addEditTeanantObject.disableTenantAddButton = false;
    this.selectedJurisdiction = null;
  }

  filterTenants(event) {
    this._filter(event.target.value);
  }

  // @ modified AP-1225 // Kasun
  getAllTenants(): Promise<unknown> {
    const promise: Promise<unknown> = new Promise((resolve, reject) => {
      this.generalSettingsApiService
        .getallTenantTables()
        .then((response: any) => {
          if (response.statusMessage === "Success") {
            let tenentMapData: any[] = [];
            if (response.data.length) {
              tenentMapData = response.data.map((data: any) => {
                return {
                  toEdit: false,
                  tanents: data.tanents,
                  jurisdiction: {
                    code: data.jurisdictionCode,
                    displayName: data.jurisdictionCode, // need the display value
                    listItemId: "",
                  },
                };
              });
            }
            this.systemsettingObject.routingtableList = tenentMapData;

            this.generalSettingsApiService
              .getJurisdictionList()
              .then((res: any[]) => {
                if (res.length) {
                  const filterd = res.map((data) => {
                    return {
                      displayName: data.jurisdictionOriginalName,
                      countryalreadyselected: data.selected,
                      code: data.jurisdictionName,
                    };
                  });
                  this.systemsettingObject.all_Jurisdictions = filterd;
                  this.systemsettingObject.routingtableList.map((data: any) => {
                    const temp = Object.assign({}, data);
                    const matchJuridiction = this.systemsettingObject.all_Jurisdictions.filter((item: any) => {
                      return item.code === temp.jurisdiction.code;
                    }).map((itemMap: any) => {
                      return itemMap.displayName;
                    });
                    temp.jurisdiction.displayName = matchJuridiction[0];
                    return temp;
                  });
                } else {
                  this.systemsettingObject.all_Jurisdictions = [];
                }
                resolve(this.systemsettingObject.routingtableList);
              })
              .catch(() => {
                resolve([]);
              });
          }
        })
        .catch(() => { });
    });
    return promise;
  }

  // @ modified AP-1225 // Kasun
  deleteTenantRow(rowdata, rowindex) {
    const modalInstanceDel: any = this.modalservice.open(
      ConfirmaionmodalComponent,
      {
        windowClass:
          "custom-modal c-arrow center bst_modal add-ownership-modal add-new-officer",
      }
    );
    modalInstanceDel.componentInstance.typeOfmodal = "deleteTenant";
    modalInstanceDel.componentInstance.rowdata = rowdata;
    modalInstanceDel.componentInstance.confirmationData.subscribe(
      (response) => {
        if (response === true) {
          const data: any = {
            jurisdictionCode:
              rowdata.jurisdiction && rowdata.jurisdiction.code
                ? rowdata.jurisdiction.code
                : "",
            tanentIds: rowdata.tanents
              ? rowdata.tanents.map((val) => val.listItemId)
              : [],
          };
          const juridisctionCode: string =
            "?jurisdictionCode=" + data.jurisdictionCode;
          this.generalSettingsApiService
            .crudTenantTable(
              data,
              "tanents/deleteTanentMapping",
              juridisctionCode
            )
            .then((res: any) => {
              if (res.statusMessage === "Success" && res.status === true) {
                // remove tenant mapping row from local array on delete success
                this.systemsettingObject.routingtableList.splice(rowindex, 1);
                // set countryalreadyselected as false from deleted tenant map country
                this.systemsettingObject.addEditTeanantObject.slectedIndex = -1;
                if (rowdata.jurisdiction && rowdata.jurisdiction.code) {
                  const index = this.systemsettingObject.all_Jurisdictions.findIndex(
                    (val) => val.code == rowdata.jurisdiction.code
                  );
                  this.systemsettingObject.all_Jurisdictions[
                    index
                  ].countryalreadyselected = false;
                }
              } else if (res.status === false) {
                this._sharedService.showNewFlashMessage(
                  res.statusMessage,
                  "danger"
                );
              }
            });
        }
      }
    );
  }

  // automatically removing previous selected juridiction
  deleteByCountryCode(code: string): void {
    const juridisctionCode: string = "?jurisdictionCode=" + code;
    this.generalSettingsApiService
      .crudTenantTable({}, "tanents/deleteTanentMapping", juridisctionCode)
      .then((res: any) => {
        if (res.statusMessage === "Success") {
          this.systemsettingObject.addEditTeanantObject.slectedIndex = -1;
          const index = this.systemsettingObject.all_Jurisdictions.findIndex(
            (val) => val.code == code
          );
          this.systemsettingObject.all_Jurisdictions[
            index
          ].countryalreadyselected = false;
        }
      });
  }
  /*
   * @purpose: function to show confirmation box for update indicator
   * @created:03 oct 2020
   * @author: shravani
   */

  confirmUpdate(edittedObj, allowUpdate, index, title) {
    allowUpdate = true;
    const modalInstanceDel = this.modalservice.open(ConfirmaionmodalComponent, {
      windowClass:
        "custom-modal c-arrow center bst_modal add-ownership-modal add-new-officer",
    });
    modalInstanceDel.componentInstance.title = title;
    modalInstanceDel.componentInstance.confirmationData.subscribe((resp) => {
      if (resp) {
        this.generalSettingsApiService
          .saveOrUpdateIndicator(edittedObj, allowUpdate)
          .then(
            (response) => {
              this.systemsettingObject.indicatorDrop.forEach((element) => {
                if (element.code == edittedObj.code) {
                  element.isCodeSelected = true;
                }
              });
              this.systemsettingObject.indicatorList[index].disableInput = true;
              this.systemsettingObject.currentindicatorList = JSON.parse(
                JSON.stringify(this.systemsettingObject.indicatorList)
              );
            },
            (error) => {
              this._sharedService.showNewFlashMessage(
                error.error.responseMessage,
                "danger"
              );
            }
          );
      } else {
        this.cancelEditUpdateListInTable(index, "Indicator");
      }
    });
  }

  /*
  * Alert Indicator related functions start
  */


  /*
 * @purpose: function to show confirmation box for update Alert Indicator
 * @created:12 December 2020
 * @author: Upekshsa
 */

  confirmAlertIndicatorUpdate(edittedObj, allowUpdate, index, title) {
    allowUpdate = true;
    const modalInstanceDel = this.modalservice.open(ConfirmaionmodalComponent, {
      windowClass:
        "custom-modal c-arrow center bst_modal add-ownership-modal add-new-officer",
    });
    modalInstanceDel.componentInstance.title = title;
    modalInstanceDel.componentInstance.confirmationData.subscribe((resp) => {
      if (resp) {
        this.generalSettingsApiService
          .saveOrUpdateAlertIndicator(edittedObj, allowUpdate)
          .then(
            (response) => {
              this.systemsettingObject.alertIndicatorList[index].disableInput = true;
              this.systemsettingObject.currentAlertIndicatorList = JSON.parse(
                JSON.stringify(this.systemsettingObject.alertIndicatorList)
              );
            },
            (error) => {
              this._sharedService.showNewFlashMessage(
                error.error.responseMessage,
                "danger"
              );
            }
          );
      } else {
        this.cancelEditUpdateListInTable(index, "AlertIndicator");
      }
    });
  }

  /*
  * @purpose: set selected items for the  back classification multi select drop down
  * @created: 10 December 2020
  * @author:  Upeksha
  */
  compareFeedBackList(valFromDropDown, valFromData): boolean {
    return valFromDropDown && valFromData ? valFromDropDown === valFromData.feedCode : false;
  }

  /*
 * @purpose: function to Alert Indicators from  database from dropdown
 * @created:27 November 2020
 * @author: Upeksha
 */
  getAlertIndicator() {
    this.generalSettingsApiService
      .getListItemsByListType(this.alertListType)
      .then((res) => {
        this.systemsettingObject.alertIndicatorDrop = res;
      });
  }

  /*
   * @purpose: function to Get Feed Classification List
   * @created:02 December  2020
   * @author: Upeksha
   */
  getFeedClassificationList() {
    this.generalSettingsApiService
      .getFeedClassificationData()
      .then((res) => {
        this.systemsettingObject.feedClassificationDrop = res['result'];
        this.getAlertIndicatorList(this.alertListType);
      }).catch(error => {
        this.getAlertIndicatorList(this.alertListType);
      });
  }

  getWorkflows() {
    this.generalSettingsApiService
      .getWorkflows()
      .then((res) => {
        this.getEntityWorkflows();
        this.systemsettingObject.workFlowDrop = res.map((item) => {
          return { "workflowName": item.name, "workflowModelKey": item.modelKey };
        });
      }).catch(error => {
        this.systemsettingObject.workFlowDrop = [];
      });
  }

  getEntityWorkflows() {
    this.generalSettingsApiService
      .getEntityWorkflows()
      .then((res) => {
        this.systemsettingObject.entityWorkFlowList = res;
        this.systemsettingObject.entityWorkFlowList.forEach(item => {
          item['disableInput'] = true, item['isValid'] = true, item['errorMessage'] = ''
        });
        this.systemsettingObject.entityWorkFlowList.sort((a, b) => (a.entityName > b.entityName) ? 1 : ((b.entityName > a.entityName) ? -1 : 0));
        this.setInitialEntityTypeListManagementDropdownTable(this.systemsettingObject.entityWorkFlowList)
      }).catch(error => {

      });
  }

  /*
 * @purpose: To populate alert indicator object from risk object on change the case risk type dropdown
 * @created:27-11-2020
 * @author: Upeksha
 */
  public changeAlertIndicatorType(value: string, obj) {
    const dropObj = this.systemsettingObject.alertIndicatorDrop.find(
      (e) => e.code === value
    );
    Object.keys(dropObj).forEach((key) => {
      obj[key] = dropObj[key];
    });
  }

  /*
   * @purpose: to popuplate alert indicator object from risk object onChange of the case risk type dropdown
   * @created:27-11-2020
   * @author: Upeksha
   */
  changeFeedClassifications(value: Array<string>, obj) {
    this.isFeedBackListChanged = true;
    obj.feedClasification = [];
    value.forEach((listItemId, index) => {
      let feed;
      let classificationObj = this.systemsettingObject.feedClassificationDrop.find(element => element.feed_management_id === listItemId)
      if (typeof (obj.rowId) != "undefined") {
        feed = {
          'rowId': obj.rowId,
          'feedCode': listItemId,
          'feedName': classificationObj ? classificationObj.feedName : ''
        };
        delete feed['id'];
        obj.feedClasification.push(feed);
      } else {
        feed = {
          'feedCode': listItemId,
          'feedName': classificationObj ? classificationObj.feedName : ''
        };
        obj.feedClasification.push(feed);
      }
    });
  }

  /*
   * @purpose: Get Alert Indicator List
   *@created:27-11-2020
   * @author: Upeksha
   */
  getAlertIndicatorList(listType) {
    this.generalSettingsApiService
      .getAllEntityAlertIndicators(listType)
      .then((response: any) => {
        this.systemsettingObject.alertIndicatorList = response.map((val) => {
          val.disableInput = true;
          if (val.feedClasification.length > 0 && this.systemsettingObject.feedClassificationDrop) {
            val.feedClasification = val.feedClasification.map(feed => {
              let classification = this.systemsettingObject.feedClassificationDrop.filter(element => element.feed_management_id === feed.feedCode);
              return {
                ...feed,
                feedName: classification.length > 0 && classification[0].feedName ? classification[0].feedName : ''
              }
            })
          }
          return val;
        });
        this.systemsettingObject.currentAlertIndicatorList = JSON.parse(
          JSON.stringify(this.systemsettingObject.alertIndicatorList)
        );
      });
  }

  /*
  * Alert Indicator function declaration end
  */

  /*
   * @purpose: sets the zip file name selected
   * @created:28 oct 2020
   * @author: Ram
  */
  getSelectedFilename(selectedLanguage) {
    var findIndex = this.systemsettingObject.settingsData['General Settings'].findIndex((val) => val.key == 'Regional Settings');
    if (findIndex !== -1) {
      if (this.systemsettingObject.settingsData['General Settings'][findIndex].values.length > 0 && this.systemsettingObject.settingsData['General Settings'][findIndex].values[0] &&
        this.systemsettingObject.settingsData['General Settings'][findIndex].values[0].options) {
        var findINDexfile = this.systemsettingObject.settingsData['General Settings'][findIndex].values[0].options.filter(val => val.attributeName == selectedLanguage)
        this.systemsettingObject.settingsData['General Settings'][findIndex].values[0].selectedFile = findINDexfile[0].attributeValue;
      }
    }
  }

  getComponentPermissionIds() {
    this.permissionIds = GlobalConstants.permissionJson[0]['modules'];
  }

  openReportFooterModal(setting) {
    var footerLogoModalInstance = this.modalservice.open(ReportFooterModalComponent, {
      windowClass: "bst_modal custom-modal",
      size: "lg",
    });
    footerLogoModalInstance.componentInstance.nameSection = setting.name;
    footerLogoModalInstance.componentInstance.settingId = setting.settingId;
    footerLogoModalInstance.componentInstance.selectedValue = setting.selectedValue;
    footerLogoModalInstance.result.then(
      (response) => {
        if (response) {
          this.updateVal(response, false, false, false, false);
        }
      },
      function () { }
    );
  }

  loadTagsGrid() {

    this.tagColumnDefs = [
      {
        'headerName': this.translateService.instant('Tags'),
        'field': 'tag.content',
        'colId': 'tag',
        'width': 100,
        'filter': true,
        'initialShowColumn': true,
        'sortable': true,
        'enableInput': false,
        'cellRendererFramework': TagColumnComponent,
        'floatingFilterComponentParams': {
          'suppressFilterButton': true
        },
      },
      {
        'headerName': this.translateService.instant('Sub Tags'),
        'field': 'sub_tags',
        'colId': 'sub_tags',
        'width': 200,
        'filter': true,
        'initialShowColumn': true,
        'sortable': false,
        'suppressMenu': true,
        'enableInput': false,
        'cellRendererFramework': SubTagsColumnComponent,
        'floatingFilterComponentParams': {
          'suppressFilterButton': true
        },
      },
      {
        'headerName': '',
        'field': 'actions',
        'colId': 'actions',
        'width': 50,
        'filter': false,
        'sortable': false,
        'initialShowColumn': true,
        'enableInput': false,
        'cellRendererFramework': TagActionColumnComponent
      }];
    this.tagGridOptions = {
      'resizable': true,
      'tableName': 'Tags List',
      'columnDefs': this.tagColumnDefs,
      'rowHeight': 56,
      'rowStyle': { 'border-bottom': '#545454 1px solid' },
      'pagination': false,
      'rowSelection': 'multiple',
      'floatingFilter': true,
      'animateRows': true,
      'isShoHideColumns': false,
      'cellClass': 'ws-normal',
      'rowModelType': 'infinite',
      'paginationPageSize': 10,
      'cacheBlockSize': 10,
      'cacheOverflowSize': 0,
      'showBulkOperations': false,
      'enableTopSection': false,
      'enableTableViews': false,
      'hideGridTopRowsperpage': true,
      'filter': true,
      'sortable': true,
      'tabs': false,
      'enableCheckBoxes': false,
      'multiSortKey': 'ctrl',
      'componentType': 'alert list',
      'defaultGridName': 'Alert View',
      'changeBackground': "#ef5350",
      'rowData': [],
      'showTagAddButton': true,
      'instance': this.generalSettingsApiService,
      'method': "getTagList",
      'enableServerSideFilter': true,
      'enableServerSideSorting': true,
      'dataModifier': "getAllTags",
      'this': this,
      localeText: {
        'Sub Tags': 'TTT123'
      }
    };
    this.showTagGridTable = true;

    this.subscriptions = this._commonServices.reloadConetnt.subscribe(data => {
      if (data) {
        this.showTagGridTable = false;
        setTimeout(() => {
          this.showTagGridTable = true;
        }, 500)
      }
    });

    this.getColors();
  }

  sortListInTable() {
    if (this.systemsettingObject.entityWorkFlowSort === 'asc') {
      this.systemsettingObject.entityWorkFlowSort = 'desc';
      this.systemsettingObject.entityWorkFlowList.sort((a, b) => (a.entityName < b.entityName) ? 1 : ((b.entityName < a.entityName) ? -1 : 0));
    } else {
      this.systemsettingObject.entityWorkFlowSort = 'asc';
      this.systemsettingObject.entityWorkFlowList.sort((a, b) => (a.entityName > b.entityName) ? 1 : ((b.entityName > a.entityName) ? -1 : 0));
    }
  }

  getAllTags(currentInstance = this, response) {
    return response.result;
  }

  getColors() {
    this.generalSettingsApiService.getColorPickersColorsList().then((res) => {
      this.generalSettingsApiService.behaviorSubjectForAllColorList.next(res)
      this.generalSettingsApiService.behaviorSubjectForAllColorList.next(true)
    })
  }


  localThemeCheck(defaultValue) {
        let usrObj = JSON.parse(localStorage.getItem("ehubObject"));
    if (usrObj["theme"] == null) {
      if (defaultValue == "Light Theme") {
        $("body").addClass("light-dark-theme");
      } else {
        $("body").removeClass("light-dark-theme");
      }
    } else {
      if (usrObj["theme"] == "Light Theme") {
        $("body").addClass("light-dark-theme");
      } else {
        $("body").removeClass("light-dark-theme");
      }
    }
  }

  private isInitialShowEntityTypeListManagementDropdown() {
    const listManagement = this.systemsettingObject.settingsData['List Management Settings'] && this.systemsettingObject.settingsData['List Management Settings'].find(v => v.key === 'List Management');
    const value = listManagement && listManagement.values.find(v => v.name === 'List Type');
    this.showEntityTypeListManagementDropdown = value.selectedValue === 'Entity Status';
  }

  private setInitialEntityTypeListManagementDropdownTable(entityWorkFlowList: Array<any>) {
    if (Array.isArray(entityWorkFlowList) && entityWorkFlowList.length) {
      if (this.showEntityTypeListManagementDropdown) {
        this.selectedEntityTypeListManagement = entityWorkFlowList[0];
        this.changeListManagementEntityStatusType(entityWorkFlowList[0]);
      }
    }
  }

  // @reason : change fisrt letter in string to capital
  // @date : 1st jan 2023
  // @params : string
  // @return : string with first letter capitalize
  // @author : ammshathwan

  capitalizeFirstLetter(string:string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  public trackByKey(_, item): string {
    return item.key;
  }
  public trackByName(_, item): string {
    return item.name;
  }
  public trackByDisplayname(_, item): string {
    return item.displayName;
  }
  public trackByStatusValue(_, item): string {
    return item.status_value;
  }
  public trackByEntityName(_, item): string {
    return item.entityName;
  }
  public trackByCode(_, item): string {
    return item.code;
  }
  public trackByFeedName(_, item) {
    return item.feedName;
  }
  public trackByColorCode(_, item) {
    return item.colorCode;
  }
}


Array.prototype.moveArray = function <T>(old_index: any, new_index: any): T[] {
  if (new_index >= this.length) {
    var k = new_index - this.length;
    while (k-- + 1) {
      this.push(undefined);
    }
  }
  this.splice(new_index, 0, this.splice(old_index, 1)[0]);
  return this; // for testing purposes
};

declare global {
  interface Array<T> {
    moveArray(old_index: any, new_index: any): Array<T>;
  }
}

interface ListManagementEntityStatusType {
  id?: number;
  workflowName?: string;
  workflowModelKey?: string;
  entityId?: number;
  entityName?: string;
  validated?: boolean;
  disableInput?: boolean;
  isValid?: boolean;
  errorMessage?: string
}
