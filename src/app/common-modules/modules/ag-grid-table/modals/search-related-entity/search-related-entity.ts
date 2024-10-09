import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { CommonServicesService } from "@app/common-modules/services/common-services.service";
import { EntityApiService } from "@app/modules/entity/services/entity-api.service";
import { EntityConstants } from "@app/modules/entity/constants/entity-company-constant";
import { NgForm } from "@angular/forms";
import { CaseManagementService } from "@app/modules/case-management/case-management.service";
import { FileUploader } from "ng2-file-upload";
import { SharedServicesService } from "@app/shared-services/shared-services.service";
import { UserSharedDataService } from '../../../../../shared-services/data/user-shared-data.service';
import { Router } from "@angular/router";
import { CreateCaseManagementComponent } from "../create-case-management/create-case-management.component";
import { CaseBatchSearchKeys } from "@app/common-modules/constants/case-search-keys";
import { WINDOW } from "../../../../../core/tokens/window";

@Component({
  selector: "app-search-related-entity",
  templateUrl: "./search-related-entity.html",
  styleUrls: ["./search-related-entity.scss"],
})
export class SearchReleatedEntityComponent implements OnInit {
  public getSelectedEntityRowValue: any = {};
  public disableNextButton = true;
  public showFirstStep = true;
  public uploader: FileUploader;
  public entityList: any = [];
  public caseRiskLevels: any = [];
  public casePriorities: any = [];
  public caseTypes: any = [];
  public requesters: any = [];
  public showLoader = false;
  public showResultsTable = false;
  public noDataFound = false;
  public suggestionsData: any = [];
  public disableSearchBtn = false;
  public isCaseExists = false;
  public isReleatedCaseExists = false;
  public isCaseCreated = false;
  public createdCaseId: any;
  public formValueChanges: any;
  public fileSizeFromSystemSettings: any = 20;
  public systemSettingObj: any = {};
  public fileName: string = "";
  public selectedRowIndex: any;
  public selectedCase: any = {};
  public selectedCasePriority: any = {};
  public selectedCaseRisk: any = {};
  public selectedRequester: any = {};
  public uploadFormData: any = "";
  public createdCase: any;
  public showFormLoader = false;
  public existedCaseData: any;
  public currentLoggedUserDetails: any;
  public isCaseCreatedButton = false;
  public closeNotify = false;
  public financialSetting = {
    singleSelection: false,
    idField: "id",
    textField: "label",
    itemsShowLimit: 2,
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
  };
  public createCaseFormFiels: any = {
    entityType: "organization",
    entityID: "",
    entityName: "",
    country: "",
    date: "",
    jurisdiction: "",
    countries: [],
    selcountry: {},
    filesArray: [],
  };
  public createCaseFormFiels2: any = {
    caseName: "",
    caseType: "",
    caseRisk: "",
    casePriority: "",
    requester: "",
    requesterDate: "",
    comment: "",
    entityUrl: "",
    countries: [],
    selRegion: {},
    region: "",
    financialList: [],
    financeModel: [],
  };
  public filteredStates: any = [];
  public filteredRegionStates: any = [];
  public PersonInfoKeys = EntityConstants.PersonKeys;
  public personArray = [];
  @ViewChild("step1CreateCase", { static: false }) stepOneForm: NgForm;

  constructor(
    public dialogReference: MatDialogRef<CreateCaseManagementComponent>,
    public commonServicesService: CommonServicesService,
    public caseService: CaseManagementService,
    public entityApiService: EntityApiService,
    public _sharedServicesService: SharedServicesService,
    public userSharedDataService: UserSharedDataService,
    public dialog: MatDialog,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(WINDOW) private readonly window: Window
  ) {
    this.uploader = new FileUploader({
      url: "",
      disableMultipart: true,
      formatDataFunctionIsAsync: true,
      formatDataFunction: async (item) => {
        return new Promise((resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date(),
          });
        });
      },
    });
  }

  ngOnInit() {
    this.caseRegionUpLiftList();
    this.jurisdictionList();
    this.caseRiskLevelsList();
    this.caseTypesList();
    this.casePrioritiesList();
    this.getRequester();
    this.caseFinacialProductsList();
    this.getLoggedUserDetails();
  }
  getLoggedUserDetails() {
    this.userSharedDataService.getCurrentUserDetails().subscribe((resp) => {
      if (resp) {
        this.currentLoggedUserDetails = resp;
      }
    });
  }

  ngAfterViewInit() {
    if (this.data && this.data.fromAdvSearch) {
      this.showFirstStep = false;
      this.data.fromAdvSearch = false;

      localStorage.removeItem("case_mgt_entity_name");
      let flag = true;
      this.onRowCheckEntity(JSON.parse(this.data.companyName), undefined, flag);
    } else {
      this.formValueChanges = this.stepOneForm.valueChanges.subscribe(() => {
        this.disableSearchBtn = false;
      });
    }
  }

  /*
   * @purpose: get Jurdiction list
   * @created: may 1 2020
   * @author: Amritesh
   * params : none
   * return : none
   */
  jurisdictionList() {
    this.commonServicesService
      .getJurdictionlist()
      .then((response) => {
        if (response) {
          this.filteredStates = response;
          this.createCaseFormFiels.countries = response;
        }
      })
      .catch((err) => {});
  }

  /*
   * @purpose: get Region Uplift list
   * @created: sep 25 2020
   * @author: Srinivas Neelamraju
   * params : none
   * return : none
   */
  caseRegionUpLiftList() {
    this.commonServicesService
      .getCaseCreateData("Region Uplift")
      .subscribe((response) => {
        if (response) {
          this.filteredRegionStates = response;
          this.createCaseFormFiels2.countries = response;
        }
      }),
      (err) => {};
  }

  /*
   * @purpose: get case-Risk-Levels List
   * @created: may 07 2020
   * @author: Amritesh
   * params : none
   * return : none
   */
  caseRiskLevelsList() {
    this.commonServicesService
      .getCaseCreateData("Case Risk")
      .subscribe((response) => {
        if (response) {
          this.caseRiskLevels = response;
        }
      }),
      (err) => {};
  }

  /*
   * @purpose: get case-Risk-Levels List
   * @created: may 07 2020
   * @author: Amritesh
   * params : none
   * return : none
   */
  caseFinacialProductsList() {
    this.commonServicesService
      .getCaseCreateData("Financial Product")
      .subscribe((response: any) => {
        response.map((product: any) => {
          this.createCaseFormFiels2.financialList.push({
            id: product.listItemId,
            label: product.displayName,
          });
        });
      }),
      (err) => {};
  }

  /*
   * @purpose: get Case Types List
   * @created: may 07 2020
   * @author: Amritesh
   * params : none
   * return : none
   */
  caseTypesList() {
    this.commonServicesService
      .getCaseCreateData("Case Type")
      .subscribe((response) => {
        if (response) {
          this.caseTypes = response;
        }
      }),
      (err) => {};
  }

  /*
   * @purpose: get Case Priorities.
   * @created: may 07 2020
   * @author: Amritesh
   * params : none
   * return : none
   */
  casePrioritiesList() {
    this.commonServicesService
      .getCaseCreateData("Case Priority")
      .subscribe((response) => {
        if (response) {
          this.casePriorities = response;
        }
      }),
      (err) => {};
  }

  /*
   * @purpose: selected country from Autocomplete jurisdiction list
   * @created: may 07 2020
   * @author: Amritesh
   * params : none
   * return : none
   */
  selectedCountry(selected) {
    this.createCaseFormFiels.selcountry = selected;
  }

  /*
   * @purpose: selected country from Autocomplete Region uplift list
   * @created: July 07 2020
   * @author: Amritesh
   * params : none
   * return : none
   */
  selectedRegion(selected) {
    this.createCaseFormFiels2.selRegion = selected;
  }

  onProductItemSelect(item) {}

  /*
   * @purpose: selected country from Autocomplete jurisdiction list
   * @created: may 07 2020
   * @author: Amritesh
   * params : none
   * return : none
   */
  searchEntity(fieldVlaues) {
    this.disableSearchBtn = true;
    this.noDataFound = false;
    this.suggestionsData = [];
    this.entityList = [];
    this.showLoader = true;
    this.showResultsTable = true;
    this.disableNextButton = true;

    var data = {
      query: fieldVlaues.entityName,
      jurisdiction: fieldVlaues.selcountry.jurisdictionName,
      entityId: fieldVlaues.entityID,
    };
    if (fieldVlaues && fieldVlaues.entityType == "personnel") {
      this.getPersonInformation(data, fieldVlaues);
    } else {
      this.getOrganizationInformation(data, fieldVlaues);
    }
  }

  /*
   * @purpose: Fetching Personnel source data and processing it to creat a case
   * @created: 18 NOV 2020
   * @author: ASHEN
   */
  getPersonInformation(data, fieldVlaues) {
    this.entityApiService
      .searchPersonMultisource(data)
      .subscribe((resp: any) => {
        if (resp && resp.results && resp["cached"]) {
          let personSearchResponse = resp.results;
          let crediblePersonData = this.handleNewPersonData(resp);

          for (let index = 0; index < crediblePersonData.length; index++) {
            const personData = crediblePersonData[index];
            let singleObject = {};

            let fullAddress = "";
            let tempArray = [];

            if (personData.address.value && personData.address.value[0]) {
              personData.address.value[0].street_address
                ? tempArray.push(personData.address.value[0].street_address)
                : "";
              personData.address.value[0].locality
                ? tempArray.push(personData.address.value[0].locality)
                : "";
              personData.address.value[0].country
                ? tempArray.push(personData.address.value[0].country)
                : "";
            }

            if (tempArray.length > 0) {
              fullAddress = tempArray.toString();
            }

            singleObject["identifier"] = personData.id ? personData.id : "";
            singleObject["vcard:organization-name"] = personData.name.value
              ? personData.name.value.toLowerCase()
              : singleObject["identifier"];
            singleObject["select_entity"] = "";
            singleObject["isDomiciledIn"] = fieldVlaues.selcountry
              .jurisdictionName
              ? fieldVlaues.selcountry.jurisdictionName
              : "";
            singleObject["mdaas:RegisteredAddress"] = {
              country: fieldVlaues.selcountry.jurisdictionOriginalName,
              fullAddress: fullAddress,
            };
            singleObject["hasURL"] = "";
            singleObject["select_entity"] = "";
            singleObject["select_entity_url"] = "personnel";
            singleObject["case_entity_type"] = "personnel";
            singleObject["personSearchResponse"] = personSearchResponse[
              personData.id
            ]
              ? personSearchResponse[personData.id]
              : "";
            this.entityList.push(singleObject);
          }

          this.entityList.length < 1
            ? (this.noDataFound = true)
            : ((this.noDataFound = false),
              this.onRowCheckEntity(this.entityList[0], undefined, false));
          this.showLoader = false;

          this.noDataFound && this.getSuggestedEntityNames(data, fieldVlaues);
        } else if (resp && resp["status"] && resp["status"] == "Started") {
          setTimeout(() => {
            this.getPersonInformation(data, fieldVlaues);
          }, 5000);
        } else {
          this.noDataFound = true;
          this.showLoader = false;
        }
      });
  }

  /*
   * @purpose: Fetching Suggested Entity Names for misspelled search
   * @created: 12 NOV 2021
   * @author: ASHEN
   */
  getSuggestedEntityNames(data, fieldVlaues) {
    this.entityApiService.suggestedEntityNames(data).subscribe((resp: any) => {
      if (resp && resp.suggestions && resp.suggestions.length > 0) {
        this.suggestionsData = resp.suggestions.slice(0, 2);
      } else {
        this.suggestionsData = [];
      }
    });
  }

  resetEntityResultSet() {
    this.noDataFound = false;
    this.entityList = [];
    this.suggestionsData = [];
    this.disableNextButton = true;
    this.showLoader = false;
    this.showResultsTable = false;
  }

  /*
   * @purpose: Fetching Organization source data and processing it to creat a case
   * @created: 18 NOV 2020
   * @author: ASHEN
   */
  getOrganizationInformation(data, fieldVlaues) {
    this.commonServicesService.multiSource(data).subscribe((response: any) => {
      if (
        response &&
        response["is-completed"] &&
        response.hasOwnProperty("is-completed")
      ) {
        if (response && response.results) {
          this.showLoader = false;
          var result = response.results;
          for (var i = 0; i < result.length; i++) {
            var firstData = [];
            var firstName = true;
            var link =
              result[i]["links"] && result[i]["links"]["select-entity"]
                ? result[i]["links"]["select-entity"]
                    .split("/select")[0]
                    .split("/")
                : [];
            var select_entity =
              link && link.length > 0 ? link[link.length - 1] : "";

            if (
              result[i] &&
              result[i].overview &&
              Object.keys(result[i].overview).length > 0
            ) {
              var singleObject = result[i].overview;
              for (var fetcher in singleObject) {
                if (singleObject[fetcher]["vcard:organization-name"]) {
                  singleObject[fetcher].key = this.setSourcePriority(fetcher);
                  singleObject[fetcher].identifier = result[i].identifier
                    ? result[i].identifier
                    : "";
                  singleObject[fetcher]["vcard:organization-name"] =
                    singleObject[fetcher][
                      "vcard:organization-name"
                    ].toLowerCase();
                  singleObject[fetcher]["select_entity"] = select_entity;
                  singleObject[fetcher]["select_entity_url"] =
                    result[i]["links"] && result[i]["links"]["select-entity"]
                      ? result[i]["links"]["select-entity"]
                      : "";
                  if (singleObject[fetcher].hasURL) {
                    singleObject[fetcher].hasURL =
                      typeof singleObject[fetcher].hasURL === "string"
                        ? singleObject[fetcher].hasURL
                        : Array.isArray(singleObject[fetcher].hasURL) &&
                          singleObject[fetcher].hasURL.length > 0
                        ? singleObject[fetcher].hasURL[0]
                        : "";
                  } else {
                    singleObject[fetcher].hasURL = "";
                  }
                  firstData.push(singleObject[fetcher]);
                }
              }
              firstData.sort(function (a, b) {
                return a.key - b.key;
              });
              if (firstData.length > 0 && firstData[0]) {
                this.entityList.push(firstData[0]);
              }
            }
          }

          this.entityList.length < 1
            ? (this.noDataFound = true)
            : ((this.noDataFound = false),
              this.onRowCheckEntity(this.entityList[0], undefined, false));

          this.noDataFound && this.getSuggestedEntityNames(data, fieldVlaues);
        }
      } else {
        setTimeout(() => {
          this.getOrganizationInformation(data, fieldVlaues);
        }, 3000);
      }
    });
  }

  /*
   * @purpose: Filtering and processing personnel source data
   * @created: 18 NOV 2020
   * @author: ASHEN
   */
  handleNewPersonData(response) {
    let personSearchResolveResult = [];
    if (response && response.results) {
      for (const resultkey in response.results) {
        if (response.results.hasOwnProperty(resultkey)) {
          var finalOject = {
            id: resultkey,
            address: {
              value: [],
              credibility: {
                source: "",
              },
              source: {},
              source_url: {},
            },
            name: {
              credibility: {},
            },
          };
          var object = {
            name: response.results[resultkey].name
              ? response.results[resultkey].name
              : {},
            first_name: response.results[resultkey].first_name
              ? response.results[resultkey].first_name
              : {},
            family_name: response.results[resultkey].family_name
              ? response.results[resultkey].family_name
              : {},
            mention_id: response.results[resultkey].mention_id
              ? response.results[resultkey].mention_id
              : {},
            source_url: response.results[resultkey].source_url
              ? response.results[resultkey].source_url
              : {},
            home_location: response.results[resultkey].home_location
              ? response.results[resultkey].home_location
              : {},
            job_title: response.results[resultkey].job_title
              ? response.results[resultkey].job_title
              : {},
            alternative_names: response.results[resultkey].alternative_names
              ? response.results[resultkey].alternative_names
              : {},
            date_of_birth: response.results[resultkey].date_of_birth
              ? response.results[resultkey].date_of_birth
              : {},
            place_of_birth: response.results[resultkey].place_of_birth
              ? response.results[resultkey].place_of_birth
              : {},
            spouse: response.results[resultkey].spouse
              ? response.results[resultkey].spouse
              : {},
            children: response.results[resultkey].children
              ? response.results[resultkey].children
              : {},
            email: response.results[resultkey].email
              ? response.results[resultkey].email
              : {},
            gender: response.results[resultkey].gender
              ? response.results[resultkey].gender
              : {},
            nationality: response.results[resultkey].nationality
              ? response.results[resultkey].nationality
              : {},
            alumni_of: response.results[resultkey].alumni_of
              ? response.results[resultkey].alumni_of
              : {},
            works_for: response.results[resultkey].works_for
              ? response.results[resultkey].works_for
              : {},
            desc: response.results[resultkey].desc
              ? response.results[resultkey].desc
              : {},
            country: response.results[resultkey].country
              ? response.results[resultkey].country
              : {},
            address: response.results[resultkey].address
              ? response.results[resultkey].address
              : {},
            images: response.results[resultkey].images
              ? response.results[resultkey].images
              : {},
          };

          for (var key in object) {
            var varkey = object[key];
            var sourcesTogether = [];
            for (var source in varkey) {
              if (Array.isArray(varkey[source])) {
                var sort = varkey[source].sort(
                  (a, b) => b.credibility - a.credibility
                );
                varkey[source] = [sort[0]];
                if (varkey[source] && varkey[source].length > 0) {
                  varkey[source][0].source = source;
                  sourcesTogether.push(varkey[source][0]);
                  var selectHighestCredibleValue = sourcesTogether.sort(
                    (a, b) => b.credibility - a.credibility
                  );
                  finalOject[key] = selectHighestCredibleValue.length
                    ? selectHighestCredibleValue[0]
                    : {};
                }
              }
            }
          }

          if (
            finalOject &&
            finalOject.address &&
            finalOject.address.value &&
            finalOject.address.value.length
          ) {
            for (var key in finalOject.address.value[0]) {
              finalOject[key] = {
                key: finalOject.address.value[0][key],
                credibility:
                  finalOject.address && finalOject.address.credibility
                    ? finalOject.address.credibility
                    : "",
                source:
                  finalOject.address && finalOject.address.source
                    ? finalOject.address.source
                    : "",
                source_url:
                  finalOject.address && finalOject.address.source_url
                    ? finalOject.address.source_url
                    : "",
              };
            }
          }

          if (
            finalOject.name &&
            finalOject.name.credibility &&
            finalOject.name.credibility >= 7 &&
            finalOject.name.credibility <= 9
          ) {
            personSearchResolveResult.push(finalOject);
          }
        }
      }
    }

    return personSearchResolveResult;
  }

  /*
   * @purpose: set the Source Priority
   * @created:7 Aug 2020
   * @params: source
   * @returns: source priority number
   * @author: Amritesh
   */
  setSourcePriority(source) {
    var sources = [
      "companieshouse",
      "ec.europa",
      "business.data",
      "handelsregister",
    ];
    var Primary = sources.indexOf(source);
    if (Primary !== -1) {
      return 1;
    } else if (source === "BST") {
      return 2;
    } else {
      return 3;
    }
  }

  /*
   * @purpose: filter selected country from Autocomplete jurisdiction list
   * @created: may 07 2020
   * @author: Amritesh
   * params : none
   * return : none
   */
  filterStates(value) {
    const filterValue = value.toLowerCase();
    this.filteredStates = this.createCaseFormFiels.countries.filter((state) => {
      if (state.jurisdictionOriginalName) {
        return (
          state.jurisdictionOriginalName.toLowerCase().indexOf(filterValue) ===
          0
        );
      }
    });
  }

  /*
   * @purpose: filter selected country from Autocomplete Region uplift list
   * @created: July 07 2020
   * @author: Amritesh
   * params : none
   * return : none
   */
  filterRegionStatesList(value) {
    const filterValue = value.toLowerCase();
    this.filteredRegionStates = this.createCaseFormFiels2.countries.filter(
      (state) => {
        if (state.displayName) {
          return state.displayName.toLowerCase().indexOf(filterValue) === 0;
        }
      }
    );
  }

  /*
   * @purpose: to get the selected case type / risk / priority value
   * @created: may 12 2020
   * @author: Ganapathi
   * params : case type
   * return : none
   */
  getSelectedItem(selectedValue, dropdownType) {
    if (selectedValue && dropdownType) {
      switch (dropdownType) {
        case "caseType":
          this.selectedCase.selectedIcon =
            selectedValue && selectedValue.icon ? selectedValue.icon : "";
          this.selectedCase.selectedColor =
            selectedValue && selectedValue.colorCode
              ? selectedValue.colorCode
              : "";
          this.selectedCase.caseName =
            selectedValue && selectedValue.displayName
              ? selectedValue.displayName
              : "";
          break;
        case "caseRisk":
          this.selectedCaseRisk.selectedIcon =
            selectedValue && selectedValue.icon ? selectedValue.icon : "";
          this.selectedCaseRisk.selectedColor =
            selectedValue && selectedValue.colorCode
              ? selectedValue.colorCode
              : "";
          this.selectedCaseRisk.caseName =
            selectedValue && selectedValue.displayName
              ? selectedValue.displayName
              : "";
          break;
        case "casePriority":
          this.selectedCasePriority.selectedIcon =
            selectedValue && selectedValue.icon ? selectedValue.icon : "";
          this.selectedCasePriority.selectedColor =
            selectedValue && selectedValue.colorCode
              ? selectedValue.colorCode
              : "";
          this.selectedCasePriority.caseName =
            selectedValue && selectedValue.displayName
              ? selectedValue.displayName
              : "";
          break;
      }
    }
  }

  /** Return file that user uploaded
   * Written by : Ganapathi
   * Date : 15-May-2020
   */
  getUploadedFile(e) {
    this._sharedServicesService.getSystemSettings().then((resp) => {
      if (resp) {
        this.systemSettingObj = resp;
        this.fileSizeFromSystemSettings = this.getFileSizeInNumber(
          this.systemSettingObj
        );
        if (e) {
          let allowedExtensions = [];
          this.systemSettingObj["General Settings"].forEach((item) => {
            if (
              item.section === "File Settings" &&
              item.selectedValue == "On"
            ) {
              allowedExtensions.push(item.name);
            }
          });
          Array.from(e).map((file: any) => {
            const fileFormat =
              file && file["name"] && file["name"].split(".").length > 0
                ? file["name"].split(".").pop()
                : "";
            const fileSize =
              file && file["size"] ? file["size"] / 1024 / 1024 : 0;
            const fileName = file && file["name"] ? file["name"] : 0;
            if (allowedExtensions.indexOf(fileFormat) == -1) {
              this._sharedServicesService.showFlashMessage(
                "File type not allowed. (" +
                  fileName +
                  ") " +
                  (allowedExtensions.length > 0
                    ? "supported types are " + allowedExtensions.join()
                    : ""),
                "danger"
              );
              return;
            }
            if (
              this.fileSizeFromSystemSettings &&
              fileSize > this.fileSizeFromSystemSettings
            ) {
              this._sharedServicesService.showFlashMessage(
                "File size should not be greater than " +
                  this.fileSizeFromSystemSettings +
                  "MB (" +
                  fileName +
                  ")",
                "danger"
              );
              return;
            } else if (fileSize == 0) {
              this._sharedServicesService.showFlashMessage(
                "File size should be greater than " + 0 + "KB ...!",
                "danger"
              );
            }
            this.uploadFormData = e[0];
            this.createCaseFormFiels.filesArray.push(file);
          });
        }
      }
    });
  }

  /** Remove the file that user uploaded
   * Written by : Ganapathi
   * Date : 28-May-2020
   */
  removeUploadedDoc(item) {
    if (this.createCaseFormFiels.filesArray.length > 0) {
      var index = this.createCaseFormFiels.filesArray.findIndex((files) => {
        return item.name == files.name;
      });
      if (index !== -1) {
        this.createCaseFormFiels.filesArray.splice(index, 1);
      }
    } else {
      this.uploadFormData = "";
    }
    this.uploader.queue = [];
  }

  getFileSizeInNumber(obj) {
    var size: any = 0;
    if (obj && obj["General Settings"] && obj["General Settings"].length) {
      size = obj["General Settings"]
        .map((val) => {
          if (val && val.name && val.name == "Maximum file size allowed") {
            return val;
          }
        })
        .filter((v) => {
          return v;
        })[0].selectedValue;

      if (size.indexOf("MB")) {
        size = Number(size.split("MB")[0]);
      }
    }
    return size;
  }

  ngOnDestroy() {
    if (this.stepOneForm) {
      this.formValueChanges.unsubscribe();
    }
  }

  /*
   * @purpose: to get row entity from multisource API in step 1 create case on radio checked
   * @created: may 08 2020
   * @author: Amritesh
   * params : none
   * return : none
   */
  onRowCheckEntity(checkedRowEntity, index, flag) {
    this.createCaseFormFiels2.requester =
      this.currentLoggedUserDetails && this.currentLoggedUserDetails.screenName
        ? this.currentLoggedUserDetails.screenName
        : "";
    if (flag) {
      this.createCaseFormFiels2.caseName = this.trimStringMaxLength(
        checkedRowEntity["vcard:organization-name"].toUpperCase(),
        75
      );
    } else {
      this.createCaseFormFiels2.caseName = this.trimStringMaxLength(
        checkedRowEntity["vcard:organization-name"],
        75
      );
    }
    this.selectedRowIndex = index;

    if (index == undefined) {
      this.disableNextButton = true;
    } else {
      this.disableNextButton = false;
    }
    this.createCaseFormFiels2.entityUrl = checkedRowEntity.select_entity_url
      ? checkedRowEntity.select_entity_url
      : "";
    this.getSelectedEntityRowValue = checkedRowEntity;
  }
 /*
   * @purpose: Add related entity
   * @created: 26 Jan 2022
   * @author: Upeksha
   */
  addToAssociatedEntities(): void {
    var caseUrl = this.router.url.slice(1).split('/');
    const caseId = caseUrl[3];
    let entityType;

    if (this.createCaseFormFiels.entityType && this.createCaseFormFiels.entityType === CaseBatchSearchKeys.personSearch) {
      entityType = CaseBatchSearchKeys.personEntityName;
    } else  {
      entityType = this.createCaseFormFiels.entityType;
    }

    const createReleatedCaseObj = {
      entity_id: this.getSelectedEntityRowValue.identifier
        ? this.getSelectedEntityRowValue.identifier
        : '',
      entity_url: this.getSelectedEntityRowValue.select_entity_url
        ? this.getSelectedEntityRowValue.select_entity_url
        : '',
      entity_name: this.getSelectedEntityRowValue['vcard:organization-name']
        ? this.getSelectedEntityRowValue['vcard:organization-name']
        : '',
        entity_info: this.getSelectedEntityRowValue
        ? this.window.btoa(
            unescape(
              encodeURIComponent(JSON.stringify(this.getSelectedEntityRowValue))
            )
          )
        : this.data && this.data.companyName
        ? this.window.btoa(unescape(encodeURIComponent(this.data.companyName)))
        : '',
      entity_type: this.createCaseFormFiels.entityType
        ? entityType
        : '',
      relation_type: null,
      country: this.getSelectedEntityRowValue.isDomiciledIn
        ? this.getSelectedEntityRowValue.isDomiciledIn
        : '',
      country_name: this.createCaseFormFiels && this.createCaseFormFiels.jurisdiction ? this.createCaseFormFiels.jurisdiction : '',
      address: this.getSelectedEntityRowValue["mdaas:RegisteredAddress"] &&
      this.getSelectedEntityRowValue["mdaas:RegisteredAddress"] .fullAddress
        ? this.getSelectedEntityRowValue["mdaas:RegisteredAddress"].fullAddress
        : '',
      case_id : caseId ? caseId : 0,
    };

    if (createReleatedCaseObj) {
      try {
        this.caseService
        .createReleatedCaseAPI(createReleatedCaseObj)
        .subscribe((response: any) => {
          if (response  && response.detail && response.detail === CaseBatchSearchKeys.CaseWithEntityIdExists) {
             this.isReleatedCaseExists = true;
          } else {
            this.caseService.releatedEntityTableDataBehaviour.next(true);
            this.dialogReference.close();
          }
        });
      } catch (error) {

      }
    }
  }

  /*
   * @purpose: To trim any word to max length - AP-1228
   * @created: 02 NOV 2020
   * @author: ASHEN
   */
  trimStringMaxLength(string, maxLength) {
    let trimmedString = "";
    if (string && string.length > 0 && maxLength && maxLength > 0) {
      trimmedString = string.substring(0, maxLength);
    }
    return trimmedString;
  }

  /*
   * @purpose: to Search entity by suggestion word
   * @created: 15 NOV 2021
   * @author: ASHEN
   */
  searchBySuggestion(suggestion): void {
    if (suggestion) {
      this.createCaseFormFiels.entityName = suggestion;
    }
    this.searchEntity(this.createCaseFormFiels);
  }

  /*
   * @purpose: to fetch all User list (requester)
   * @created: may 15 2020
   * @author: Amritesh
   * params : none
   * return : none
   */
  getRequester() {
    this.caseService.getRequesterAPI().subscribe((response: any) => {
      var activeUser: any;
      if (response) {
        activeUser = response.result.filter((val) => {
          if (val.statusId && val.statusId.code) {
            return val.statusId.code == "Active";
          }
        });
        this.requesters = activeUser;
      }
    }),
      (err) => {};
  }
  /*
   * @purpose: to Search entity by suggestion word
   * @created: 26 JAN 2022
   * @author: upeksha
   */
  closeNotification(): void {
      this.closeNotify = true;
      this.isReleatedCaseExists = false;
  }

  public trackByJurisdictionOriginalName(_, item): string {
    return item.jurisdictionOriginalName;
  }

  public trackByOrganizationName(_, item): string {
    return item['vcard:organization-name'];
  }
}
