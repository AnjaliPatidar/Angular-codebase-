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
import { DatePipe } from "@angular/common";
import { SharedServicesService } from "@app/shared-services/shared-services.service";
import { UserSharedDataService } from '../../../../../shared-services/data/user-shared-data.service';
import * as moment from 'moment';
import { GlobalConstants } from "@app/common-modules/constants/global.constants";
import { Router } from "@angular/router";
import { AppConstants } from "@app/app.constant";
import { CaseCreateRequest } from "@app/modules/case-management/models/case-list/case-create-request.model";
import { BehaviorSubject } from 'rxjs';
import { AgGridTableService } from "../../ag-grid-table.service";
import { DOC_REPO_TABLE_NAME } from "../document-repository/document-repository.component";
import { TranslateService } from '@ngx-translate/core';
import { WINDOW } from "../../../../../core/tokens/window";
const datePipe = new DatePipe("en-US");
declare var recallKpiDataCaseManagement;
@Component({
  selector: "app-create-case-management",
  templateUrl: "./create-case-management.component.html",
  styleUrls: ["./create-case-management.component.scss"],
})
export class CreateCaseManagementComponent implements OnInit {
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
  public isEntitydisableSearchBtn = false;
  public isCaseExists = false;
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
  public clicked = false;
  public clickedYes = false;
  public financialSetting;
  public disableWhiteSpace: boolean = false;
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
    tenant: "",
    tenants: [],
  };
  public filteredStates: any = [];
  public filteredTenants: any = [];
  public tenantsIds: any = [];
  public filteredRegionStates: any = [];
  public PersonInfoKeys = EntityConstants.PersonKeys;
  public personArray = [];
  @ViewChild("step1CreateCase", { static: false }) stepOneForm: NgForm;
  firstCaseId: any;
  userGroupName: string = "";
  typeOfRelation: any;
  public tenantName: string = null;

  repoDocumentList = [];
  seletedRepoDocumetList = [];
  removeFileIdList = [];
  passRemoveFileIdList = new BehaviorSubject<any[]>([]);
  caseName;
  formatedSourceData;
  public isPersonTypeSearch: boolean = false;

  constructor(
    public dialogReference: MatDialogRef<CreateCaseManagementComponent>,
    public commonServicesService: CommonServicesService,
    public caseService: CaseManagementService,
    public entityApiService: EntityApiService,
    public _sharedServicesService: SharedServicesService,
    private translateService: TranslateService,
    public userSharedDataService: UserSharedDataService,
    public dialog: MatDialog,
    public router: Router,
    public agGridTableService: AgGridTableService,
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
    this.tenantsList();
    this.caseRiskLevelsList();
    this.caseTypesList();
    this.casePrioritiesList();
    this.getRequester();
    this.caseFinacialProductsList();
    this.getLoggedUserDetails();
    this.getRelationalType();
    this.listeningRepoDocumentSelection();
    this.financialSetting = {
      singleSelection: false,
      idField: "id",
      textField: "label",
      itemsShowLimit: 2,
      selectAllText: this.translateService.instant('Select All'),
      unSelectAllText: this.translateService.instant('UnSelect All'),
    }
  }
  getLoggedUserDetails() {
    this.userSharedDataService.getCurrentUserDetails().subscribe(resp => {
      if (resp) {
        this.currentLoggedUserDetails = resp;
      }
    });

  }

  ngAfterViewInit() {
    if (this.data && this.data.fromAdvSearch) {
      this.showFirstStep = false;
      this.data.fromAdvSearch = false;

      let advancedSearchEntity = JSON.parse(localStorage.getItem('case_mgt_entity_name'));
      if (advancedSearchEntity) {
        this.createCaseFormFiels.entityName = advancedSearchEntity["vcard:organization-name"];
      }
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
      .then((response: any) => {
        if (response) {
          this.filteredStates = response.filter(item => (item.jurisdictionName.toLowerCase() !== 'all' && item.jurisdictionName.toLowerCase() !== 'any'));
          this.createCaseFormFiels.countries = response.filter(item => (item.jurisdictionName.toLowerCase() !== 'all' && item.jurisdictionName.toLowerCase() !== 'any'));
        }
      })
      .catch((err) => { });
  }

  /*
   * @purpose: get Tenants list
   * @created: march 15 2022
   * @author: Tetiana
   * params : none
   * return : none
   */
  tenantsList() {
    this.caseService
      .getfilteredTenantsList()
      .then((resp) => {
        if (resp.tenants.length > 0) {
          let tenantsNames = resp.tenants.map((tenant) => tenant.displayName);
          this.tenantsIds = resp.tenants.map((tenant) => tenant.listItemId);
          this.filteredTenants = tenantsNames;
          this.createCaseFormFiels2.tenants = tenantsNames;
        }
        else {
          this.commonServicesService
            .getListItemsByListType('Tenant')
            .then((resp) => {
              if (resp) {
                let tenantsNames = resp.map((tenant) => tenant.displayName);
                this.tenantsIds = resp.map((tenant) => tenant.listItemId);
                this.filteredTenants = tenantsNames;
                this.createCaseFormFiels2.tenants = tenantsNames;
              }
            });
        }
      });
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
      (err) => { };
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
      (err) => { };
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
          this.createCaseFormFiels2.financialList = this.createCaseFormFiels2.financialList
            .concat({
              id: product.listItemId,
              label: product.displayName,
            });
        });
      }),
      (err) => { };
  }

  /*
   * @purpose: get Case Types List
   * @created: may 07 2020
   * @author: Amritesh
   * params : none
   * return : none
   */
  caseTypesList() {
    this.caseService
      .getfilteredTenantsList()
      .then((resp) => {
        if (resp.types.length > 0) {
          this.caseTypes = resp.types;
        }
        else {
          this.commonServicesService
            .getCaseCreateData("Case Type")
            .subscribe((response) => {
              if (response) {
                this.caseTypes = response;
              }
            }),
            (err) => { };
        }
      });
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
      (err) => { };
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
    this.filteredStates = this.createCaseFormFiels.countries.filter((state) => {
      if (state.jurisdictionOriginalName) {
       if(this.createCaseFormFiels.selcountry.jurisdictionOriginalName === state.jurisdictionOriginalName){
        this.disableSearchBtn = false;
        this.isEntitydisableSearchBtn = true;
       }
      }
    });
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

  onProductItemSelect(item) { }

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
      entityId: fieldVlaues.entityID
    };
    if (fieldVlaues && fieldVlaues.entityType == "personnel") {
      this.isPersonTypeSearch = true;
      this.getPersonInformation(data, fieldVlaues);
    } else {
      this.isPersonTypeSearch = false;
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
          this.formatEntitySourceDataForPerson(resp.results)
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
            : (this.noDataFound = false, this.onRowCheckEntity(this.entityList[0], undefined, false));
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
    this.entityApiService
      .suggestedEntityNames(data)
      .subscribe((resp: any) => {
        if (resp && resp.suggestions && resp.suggestions.length > 0) {
          this.suggestionsData = resp.suggestions.slice(0, 2)
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
          this.formatEntitySourceData(response.results)
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
                  singleObject[fetcher][
                    "vcard:organization-name"
                  ] = singleObject[fetcher][
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
            : (this.noDataFound = false, this.onRowCheckEntity(this.entityList[0], undefined, false));

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
    if(value.length == 0 || value.length>0 ){
      this.disableSearchBtn = true;
    }
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
   
  // @reason : filter entity id value 
  // @author : Janaka Sampath
  // @date : 19 JUNE 2023
  filterEntityIdVal(value){
        if(value || value.length >= 0){
          if(this.isEntitydisableSearchBtn == true){
            this.disableSearchBtn = false;
          }else{
            this.disableSearchBtn = true;
          }
        }
  }

  /*
   * @purpose: filter selected tenant from Autocomplete tenants list
   * @created: march 14 2022
   * @author: Tetiana
   * params : none
   * return : none
   */
  filterTenants(value) {
    const filterValue = value.toLowerCase();
    this.filteredTenants = this.createCaseFormFiels2.tenants.filter((tenant) => {
      if (tenant) {
        return (
          tenant.toLowerCase().indexOf(filterValue) === 0
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
    this._sharedServicesService.getSystemSettings().then(resp => {
      if (resp) {
        this.systemSettingObj = resp;
        this.fileSizeFromSystemSettings = this.getFileSizeInNumber(
          this.systemSettingObj
        );
        if (e) {
          let allowedExtensions = [];
          this.systemSettingObj['General Settings'].forEach((item) => {
            if (item.section === 'File Settings' && item.selectedValue == 'On') {
              allowedExtensions.push(item.name);
            }
          });
          allowedExtensions = allowedExtensions.map(item => item === 'Zip Archived' ? 'zip' : item);
          Array.from(e).map((file: any) => {
            const fileFormat =
              file && file['name'] && file['name'].split('.').length > 0
                ? file['name'].split('.').pop()
                : '';
            const fileSize = file && file['size'] ? file['size'] / 1024 / 1024 : 0;
            const fileName = file && file['name'] ? file['name'] : 0;
            if (allowedExtensions.indexOf(fileFormat) == -1) {
              this._sharedServicesService.showFlashMessage(
                'File type not allowed. (' +
                fileName +
                ') ' +
                (allowedExtensions.length > 0
                  ? 'supported types are ' + allowedExtensions.join()
                  : ''),
                'danger'
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
              this._sharedServicesService.showFlashMessage('File size should be greater than ' + 0 + 'KB ...!', 'danger');
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

  getRelationalType(): void {
    this.caseService.getRelationType().subscribe((res) => {
      this.typeOfRelation = res;
      this.typeOfRelation = res.find(type => type && type.code && type.listItemId && type.code.toUpperCase() === "MAIN ENTITY" ? type : null)
    })
  }

  /*
  * @purpose: to create a new case and case exists validation
  * @created: may 08 2020
  * @author: Ganapathi & Amritesh
  * params : none
  * return : none
  */
  step2FormDetails(formFieldsValue, caseCheck: boolean) {
    let tenantId = 0;
    let tenantIndex = this.createCaseFormFiels2.tenants.indexOf(this.createCaseFormFiels2.tenant);

    if (tenantIndex > -1) {
      tenantId = this.tenantsIds[tenantIndex];
    }
    var createCaseObj: CaseCreateRequest = {
      name: formFieldsValue.caseName ? formFieldsValue.caseName : "",
      priority: formFieldsValue.casePriority ? formFieldsValue.casePriority : 0,
      type: formFieldsValue.caseType ? formFieldsValue.caseType : "",
      risk: formFieldsValue.caseRisk ? formFieldsValue.caseRisk : 0,
      entity_id: this.getSelectedEntityRowValue.identifier ? this.getSelectedEntityRowValue.identifier : "",
      comment: formFieldsValue.comment ? formFieldsValue.comment : "",
      originator: formFieldsValue.requester ? formFieldsValue.requester : "Analyst",
      entity_url: this.createCaseFormFiels2.entityUrl ? this.createCaseFormFiels2.entityUrl : "",
      jurisdiction_code: this.getSelectedEntityRowValue.isDomiciledIn ? this.getSelectedEntityRowValue.isDomiciledIn : "",
      region_uplift: formFieldsValue.selRegion && formFieldsValue.selRegion.listItemId ?
        formFieldsValue.selRegion.listItemId : 0,
      products: formFieldsValue.financeModel && formFieldsValue.financeModel.length > 0 ? formFieldsValue.financeModel.map((a) => a.id) : [],
      entity_info: this.getSelectedEntityRowValue ?
        this.window.btoa(unescape(encodeURIComponent(JSON.stringify(this.getSelectedEntityRowValue)))) :
        this.data && this.data.companyName ? this.window.btoa(unescape(encodeURIComponent(this.data.companyName))) : "",
      customer_internal_id: formFieldsValue.customerInternalID ? formFieldsValue.customerInternalID : "",
      country: this.createCaseFormFiels && this.createCaseFormFiels.jurisdiction ? (this.createCaseFormFiels.jurisdiction).toLowerCase() : "",
      address: this.getSelectedEntityRowValue["mdaas:RegisteredAddress"] && this.getSelectedEntityRowValue["mdaas:RegisteredAddress"].fullAddress ? this.getSelectedEntityRowValue["mdaas:RegisteredAddress"].fullAddress : "",
      type_of_relation: this.typeOfRelation && this.typeOfRelation.listItemId ? this.typeOfRelation.listItemId : null,
      entity_name: this.getSelectedEntityRowValue['vcard:organization-name'] ? this.getSelectedEntityRowValue['vcard:organization-name'] : '',
      entity_type: this.createCaseFormFiels && this.createCaseFormFiels.entityType ? this.createCaseFormFiels.entityType : "",
      requested_date: this.createCaseFormFiels2.requesterDate ? (moment(this.createCaseFormFiels2.requesterDate).format('YYYY-MM-DD hh:mm:ss')).toString() : (moment(new Date).format('YYYY-MM-DD hh:mm:ss')).toString(),
      tenant: tenantId
    };

    this.caseService.createCaseAPINew(createCaseObj, caseCheck).subscribe(
      (response: any) => {
        this.showFormLoader = true;
        if (response && response.length > 0) {
          this.firstCaseId = response[0].caseId || response[0].id;
          this.existedCaseData = [];
          this.showFormLoader = false;
          this.isCaseExists = true;
          let latestExistCaseIndex = response.length - 1;
          this.createdCaseId = response[latestExistCaseIndex].caseId || response[latestExistCaseIndex].id;
          this.caseName = response[latestExistCaseIndex].caseName
            ? response[latestExistCaseIndex].caseName
            : response[latestExistCaseIndex].name
              ? response[latestExistCaseIndex].name
              : ""
          if (response && response[latestExistCaseIndex] && response[latestExistCaseIndex].tenant && response[latestExistCaseIndex].tenant.displayName) {
            this.tenantName = response[latestExistCaseIndex].tenant.displayName;
          }
          this.firstCaseId = response[0].caseId || response[0].id;
          response[latestExistCaseIndex].createdOn = datePipe.transform(
            response[latestExistCaseIndex].createdOn,
            "MMM d, y, h:mm a"
          );
          response[latestExistCaseIndex].modifiedOn = datePipe.transform(
            response[latestExistCaseIndex].modifiedOn,
            "MMM d, y, h:mm a"
          );
          response[latestExistCaseIndex].Originator = response[latestExistCaseIndex].originator;
          this.existedCaseData = {
            caseId: response[latestExistCaseIndex].id ? response[latestExistCaseIndex].id : "",
            caseType: response[latestExistCaseIndex].caseType ? response[latestExistCaseIndex].caseType : "",
            originator: response[latestExistCaseIndex].originator
              ? response[latestExistCaseIndex].originator
              : (response[latestExistCaseIndex].createdBy && response[latestExistCaseIndex].createdBy.screenName)
                ? response[latestExistCaseIndex].createdBy.screenName
                : "",
            riskIndicators: response[latestExistCaseIndex].riskIndicators
              ? response[latestExistCaseIndex].riskIndicators
              : response[latestExistCaseIndex].directRisk
                ? response[latestExistCaseIndex].directRisk
                : "",
            caseName: response[latestExistCaseIndex].caseName
              ? response[latestExistCaseIndex].caseName
              : response[latestExistCaseIndex].name
                ? response[latestExistCaseIndex].name
                : "",
            createdOn: response[latestExistCaseIndex].createdDate ? response[latestExistCaseIndex].createdDate : "",
            modifiedOn: response[latestExistCaseIndex].modifiedOn
              ? response[latestExistCaseIndex].modifiedOn
              : response[latestExistCaseIndex].createdDate,
            commentsCount: response[latestExistCaseIndex].commentCount
              ? response[latestExistCaseIndex].commentCount
              : 0,
            attachmentsCount:
              response[latestExistCaseIndex].attachmentsCount &&
                response[latestExistCaseIndex].attachmentsCount.length
                ? response[latestExistCaseIndex].attachmentsCount
                : 0,
            regionUplift: response[latestExistCaseIndex].regionUplift
              ? response[latestExistCaseIndex].regionUplift
              : "N/A",
            product: "N/A"
          };
          this.existedCaseData.createdOn = this.existedCaseData.createdOn ? moment.utc(this.existedCaseData.createdOn).local().format('DD-MMM-YYYY HH:mm') : '';
          this.existedCaseData.modifiedOn = this.existedCaseData.modifiedOn ? moment.utc(this.existedCaseData.modifiedOn).local().format('DD-MMM-YYYY HH:mm') : '';
          if (response[latestExistCaseIndex].products) {
            var filteredProd = response[latestExistCaseIndex].products.map((a) => a.displayName);
            this.existedCaseData.product = filteredProd.join();
          }
          if (this.repoDocumentList.length) {
            this.connectDocumentsToCases();
          }
        } else {
          var uploadDocument = [];
          var fileNames = [];
          this.isCaseExists = false;
          this.createdCaseId = response.id;
          let userId: any = GlobalConstants.systemSettings['ehubObject']['userId'];
          if (response && this.createCaseFormFiels.filesArray.length) {
            for (let i = 0; i < this.createCaseFormFiels.filesArray.length; i++) {
              let fileFormat = this.createCaseFormFiels.filesArray[i] && this.createCaseFormFiels.filesArray[i].name && this.createCaseFormFiels.filesArray[i].name.split('.').length > 0 ? this.createCaseFormFiels.filesArray[i].name.split('.').pop() : '';
              let fileSize = this.createCaseFormFiels.filesArray[i] && this.createCaseFormFiels.filesArray[i].size ? this.createCaseFormFiels.filesArray[i].size / 1024 / 1024 : 0;
              let fileName = this.createCaseFormFiels.filesArray[i] && this.createCaseFormFiels.filesArray[i].name ? this.createCaseFormFiels.filesArray[i].name : '';
              let lastUpdate = this.createCaseFormFiels.filesArray[i] && this.createCaseFormFiels.filesArray[i].lastModified ? this.createCaseFormFiels.filesArray[i].lastModified : '';
              let title = this.createCaseFormFiels.filesArray[i] && this.createCaseFormFiels.filesArray[i].name.split('.').slice(0, -1).join('.');
              const params = {
                "analysis": true,
                "created_by": userId.toString(),
                "file_name": fileName,
                "format": fileFormat,
                "last_updated": moment(lastUpdate).format('YYYY-MM-DD HH:mm:ss'),
                "reference_id": this.createdCaseId.toString(),
                "reference_type": "case",
                "size": fileSize.toString(),
                "title": title,
                "updated_by": userId.toString(),
                "version_handler": "",
                "main_entity_id": this.createdCaseId.toString(),
                "reference_name": formFieldsValue.caseName ? formFieldsValue.caseName : "",
                "timestamp": moment(new Date(), ["h:mm A"]).format('YYYY-MM-DD HH:mm:ss'),
                "meta_data": '{}'
              }
              uploadDocument.push(params)
            }
            this.connectDocumentsToCases();
            return this.caseService.uploadDocumentForProof(uploadDocument).subscribe(resp => {
              const existsDocuments = [];
              const existsDocumentsReferences = [];
              if (resp) {
                let resultDocumentExistsMessage = '';
                var documents = this.getLanguageKey('Document(s)') ? this.getLanguageKey('Document(s)') : 'Document(s)'
                var newDocument = this.getLanguageKey('Attachment(s)') ? this.getLanguageKey('Attachment(s)') : 'Attachment(s)'
                var allreadyExists = this.getLanguageKey('already exists') ? this.getLanguageKey('already exists') : 'already exists'
                var uploadSuccess = this.getLanguageKey('upload successfully') ? this.getLanguageKey('upload successfully') : 'upload successfully'
                var referenceLinkCreated = this.getLanguageKey('in the repository. Reference link created.') ? this.getLanguageKey('in the repository. Reference link created.') : ' in the repository. Reference link created.'
                resp.forEach(element => {
                  if (element.is_uploaded) {
                    fileNames.push(element.file_info.file_path)
                  } else if (element.is_uploaded == false && element.reason[0].includes('New reference')) {
                    existsDocumentsReferences.push(element.file_info.file_name);
                  } else if (element.is_uploaded == false) {
                    existsDocuments.push(element.file_info.file_name);
                  }
                })
                if (existsDocuments.length) {
                  let documentName = existsDocuments.length > 1 ? existsDocuments.join(', ')
                    : (existsDocuments.length == 1) ? existsDocuments[0] : '';
                  this.showFormLoader = false;
                  resultDocumentExistsMessage.length && (resultDocumentExistsMessage += '<br/>');
                  resultDocumentExistsMessage += documents + " '" + documentName + "' " + allreadyExists;
                }
                if (existsDocumentsReferences.length) {
                  let documentName = existsDocumentsReferences.length > 1 ? existsDocumentsReferences.join(', ')
                    : (existsDocumentsReferences.length == 1) ? existsDocumentsReferences[0] : '';
                  this.showFormLoader = false;
                  resultDocumentExistsMessage.length && (resultDocumentExistsMessage += '<br/>');
                  resultDocumentExistsMessage += documents + " '" + documentName + "' " + allreadyExists + referenceLinkCreated;
                }
                if (existsDocuments.length || existsDocumentsReferences.length) {
                  this._sharedServicesService.showFlashMessage(resultDocumentExistsMessage, 'danger')
                  this.isCaseCreated = true;
                };

                if (fileNames.length) {
                  this.caseService.getDocumentLocation(fileNames).then(res => {
                    if (res) {
                      for (let i = 0; i < res.length; i++) {
                        const found = this.createCaseFormFiels.filesArray.find(
                          (element) => element.name === res[i].fileName
                        );
                        if (found) {
                          this.caseService.callPresignedUrl(found, res[i].presignedUrl).then((response) => {
                            if (i == res.length - 1) {
                              this.caseService.updateTableData.next(true);
                              this.isCaseCreated = true;
                              this.showFormLoader = false;
                              recallKpiDataCaseManagement = true;
                              res.forEach(element => {
                                newDocument += " " + "'" + element.fileName + "', " + " "
                              });
                              newDocument = newDocument.slice(0, -2) + uploadSuccess;
                              this._sharedServicesService.showFlashMessage(newDocument, 'success');
                            }
                          })
                        }
                      }
                    }
                  })
                }
              }

            },
              (err) => {
                this.caseService.updateTableData.next(true);
                this.isCaseCreated = true;
                this.dialogReference.close();
                this.showFormLoader = false;
                recallKpiDataCaseManagement = true;
                this._sharedServicesService.showFlashMessage(
                  "Unable to upload the file. please try again later",
                  "danger"
                );
              })
          } else {
            this.caseService.updateTableData.next(true);
            this.isCaseCreated = true;
            this.showFormLoader = false;
            recallKpiDataCaseManagement = true;
          }
          if (this.repoDocumentList.length) {
            this.connectDocumentsToCases();
          }
        }

      },
      (err) => {
        this.clicked = false;
        this._sharedServicesService.showFlashMessage(
          "Unable to create case. please try again later",
          "danger"
        );
      }
    );
  }

  /** open case detail modal
   * Author : ganapathi
   * Date : 19-May-2020
   */
  openCaseDetail() {
    this.dialogReference.close();
    if (GlobalConstants.systemSettings.openInNewtab) {
      const href = AppConstants.Ehub_UI_API + 'element-new/dist/new/#/element/case-management/case/' + this.createdCaseId;
      this.window.open(href, '_blank', 'noopener');
    }
    else {
      this.router.navigate(['element/case-management/case', this.createdCaseId]);
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
      this.createCaseFormFiels.entityName = suggestion
    }
    this.searchEntity(this.createCaseFormFiels)
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
      (err) => { };
  }

  // @reason : Add localization text
  // @author: Kasun Karunathilaka
  // @date: Apr 08 2022
  getLanguageKey(text) {
    var langKey = text;
    if (GlobalConstants.languageJson) {
      langKey = GlobalConstants.languageJson[text];
    }
    return langKey;
  }

  // @reason : listen to the selection change in table data
  // @author : Ammshathwan
  // @date : 21st APR 2022
  listeningRepoDocumentSelection(): void {
    this.caseService.updateCaseAttachmentDataObserver.subscribe(data => {
      this.seletedRepoDocumetList = data;
      this.repoDocumentList = (data || []).map(document => document.filePath);
    })
  }

  // @reason : get the list of selected document file path from DMS repo
  // @author : Ammshathwan
  // @date : 21st APR 2022
  // TODO Remove this function.
  async getDocumentsFromDMS(selectedDocuments) {
    let selectedDocumentsList = []
    await this.caseService.repoDocumentListDataObserver.subscribe(data => {
      let documetList = data;
      selectedDocuments.forEach(document => {
        documetList.filter(data => {
          if (data.file_id == document.fileID) {
            selectedDocumentsList.push(data.file_path)
          }
        })
      });
    })
    this.repoDocumentList = selectedDocumentsList;
  }

  // @reason : connect the selecetd document to case
  // @author : Ammshathwan
  // @date : 21st APR 2022
  connectDocumentsToCases(): void {
    let params = {
      "documents_case_connection_request": [
        {
          "caseId": this.createdCaseId && this.createdCaseId ? this.createdCaseId.toString() : "",
          "documentPaths": this.repoDocumentList,
          "caseName": this.caseName ? this.caseName : ""
        }
      ],
      "user_id": this.currentLoggedUserDetails && this.currentLoggedUserDetails.userId ? this.currentLoggedUserDetails.userId.toString() : ''
    }

    this.caseService.connectDocumentsToCases(params).subscribe(res => {
      if (res) {
        this.showFormLoader = false;
      }
    })
  }

  // @reason : Remove selected document
  // @author : kasun karunathilaka
  // @date : 27 APR 2022
  removeconnectDocuments(item) {
    this.seletedRepoDocumetList = this.seletedRepoDocumetList.filter(doc => doc.fileID !== item.fileID);
    this.removeFileIdList.push(item.fileID);
    // this.caseService.passRemoveFileIdList.next(this.removeFileIdList);
    this.agGridTableService.changeGridRowSelectionStatus({ rowNodeId: item.fileID, status: false, tableName: DOC_REPO_TABLE_NAME });
  }

  modelChangeFn(value) {
    if (value.match(/^\s+/)) {
      this.disableWhiteSpace = true;
    }
    else {
      this.disableWhiteSpace = false;
    }
  }

  public trackByJurisdictionOriginalName(_, item): string {
    return item.jurisdictionOriginalName;
  }

  public trackByIdentifier(_, item): string {
    return item.identifier;
  }
  public trackByListItemId(_, item): string {
    return item.listItemId;
  }
  public trackByDisplayName(_, item): string {
    return item.displayName;
  }
  public trackByScreenName(_, item): string {
    return item.screenName;
  }
  public trackByName(_, item): string {
    return item.name;
  }

  public trackByFileId(_, item): string {
    return item.fileID;
  }

  getSourceData(sourceData:any):any{
    let currentSourceObj
    if(sourceData.identifier){
      currentSourceObj = this.formatedSourceData.find((source) => source.identifier == sourceData.identifier)
    }else{
      currentSourceObj = {}
    }
    return currentSourceObj
  }

  formatEntitySourceData(result:any[]):void {
    let entitySources:any[] = []
    const formatedSources:any[] = []
    if(result){
      result.filter((entity:any) => {
        if(entity.overview){
          entitySources = Object.keys(entity.overview).map((key) => {
            return {
              "source" : key ,
              "name" : entity.overview[key]['vcard:organization-name'],
            }
          })
        }
        formatedSources.push({
          "identifier" : entity.identifier ? entity.identifier: "",
          "source" : entitySources && entitySources.length ? entitySources : []
        })
    })
    }
    this.formatedSourceData = formatedSources;
  }

  formatEntitySourceDataForPerson(result:any[]):void {
    let entitySources:any[] = []
    const formatedSources:any[] = []
    if(result){
      Object.keys(result).map((entityKey) => {
        let entity = result[entityKey];
        if(entity && entity.name){
          entitySources = Object.keys(entity.name).map((key) => {
            return {
              "source" : key ,
              "name" : entity.name[key][0].value,
            }
          })
        }
        formatedSources.push({
          "identifier" : entityKey ? entityKey: "",
          "source" : entitySources && entitySources.length ? entitySources : []
        })
    })
    }
    this.formatedSourceData = formatedSources;
  }
}
