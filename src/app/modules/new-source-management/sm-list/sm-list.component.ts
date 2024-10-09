import { Component, OnInit, ViewChild } from '@angular/core';
import { AppConstants } from '../../../app.constant';
import { AgGridTableService } from '../../../common-modules/modules/ag-grid-table/ag-grid-table.service';
import { SourceManagementService } from '../source-management.service';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { NgbTabsetConfig, NgbPopoverConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { AgGridNg2 } from "ag-grid-angular";
import { DynamicHeadersRendererComponent } from '../dynamic-headers/dynamic-headers-renderer.component';
import { verticalBarGraphModule } from '@app/shared/charts/chartsNew/verticalBarChart.js';


//Jquery initialization
declare var $: any
@Component({
  selector: 'app-sm-list',
  templateUrl: './sm-list.component.html',
  styleUrls: ['./sm-list.component.scss']
})
export class SourceListComponent implements OnInit {
  @ViewChild("agGrid", { static: true }) agGrid: AgGridNg2;
  @ViewChild("content", { static: true }) modalContent;
  domainSearchPermission: string;
  editSourcePermission: string;
  changeCredibilityPermission: string;
  changeVisibilityPermission: string;
  newSourceManagementPermissionJSON: any;
  isDomainSearchGridOptionsLoaded = false;
  constructor(private titleService: Title,
    private _agGridTableService: AgGridTableService,
    private sourceManagementService: SourceManagementService,
    private cmnSrvc: CommonServicesService,
    private modalService: NgbModal,
    private config: NgbTabsetConfig,
    private sourceManagementPopoverConfig: NgbPopoverConfig,
    public _sharedService: SharedServicesService,
    private _commonService: CommonServicesService) {
    config.type = 'pills';
    config.justify = 'fill';
    sourceManagementPopoverConfig.autoClose = false;
  }


  public isGridOptionsLoaded = false;
  public isClassificationsLoaded = false;
  public iscategoriesLoaded = false;
  public gridOptions: any = {};
  public componentThis: any;
  public paginationPageSize: any;
  private columnDefs: any = [];
  public presentDate = new Date();
  public staticHeaders: any = ["Source", "Link", "Domain", "Category", "Industry", "Jurisdiction"];
  private credibility_digit_map: any = { NONE: "0", LOW: "1", MEDIUM: "2", HIGH: "3" };
  private credibility_text_map: any = { 0: "NONE", 1: "LOW", 2: "MEDIUM", 3: "HIGH" };
  public credibilityFilterOptions = [];
  public mainClassificationData: any = [];
  public categorieData: any = [];
  public isEdit: boolean = false;
  public sourcename: string = '';
  public sourcelink: string = '';
  public relationshipUrl: string = '';
  public searchUrl: string = '';
  public sourceId: string = '';
  public sourceType: string = '';
  public sourceEntityType: string = '';
  public roleData: string = '';
  public editData: any;
  public editDataInitial: any;
  public sourceid: string = '';
  public agGridLoader: boolean = false;
  public gridShow: boolean = true;
  public addRole: string = '';
  private responseData: any = [];
  public currentTabData: any = [];
  private totallSourceCount: number = 0;
  public rowData: any = [];
  public dynamicHeadersForDataAttributes: any = [];
  private finalHeaders: any = [];
  private staticHeaders2: any = ["Visible", "Edit"];
  private sourceEntityTypeData: any = ["Person", "Organization"];
  private sourceTypeData: any = ["id_source", "profile_source"]
  private recordsPerPage: number = 10;
  private pageNum: number = 1;
  public classificationType: any = "GENERAL";
  public domainSearchGridOptions: any = {};
  public domainListColDefs: any = {};
  domainList = [];
  selectedDomains = [];
  public jurisdictionList = [];
  selectedJurisdictions = [];
  mediaList = [];
  selectedMedias = [];
  public industryList = [];
  public selectedIndustries = [];
  public SourceNames = [];
  public SelectedSourceNamesList = [];
  public sourceNamesList = [];
  domainSettings = {};
  domainNoSearchSettings = {};
  jurisdictionSettings = {};
  mediaSettings = {};
  industrySettings = {};
  SelectedSourceNamesListSettings = {};
  public domainListRowData: any = [];
  listsOfDataByHeader: any = {
    domainJurisdictionFilterList: []
  };
  public showDomainList = false;
  public componentName = 'domainSearch';
  public totNumberOfNewsDomains = '';

  private params = {
    "recordsPerPage": 10,
    "pageNumber": 1,
    "classificationId": 2651660,
    "orderBy": '',
    "orderIn": '',
    "subSlassificationId": '',
    "visible": '',
  }

  public exportParams: any = {
    url: AppConstants.Ehub_Rest_API + "sourceCredibility/getSourcesCSV",
    skipHeader: false,
    columnGroups: true,
    skipFooters: true,
    skipGroups: true,
    skipPinnedTop: true,
    skipPinnedBottom: true,
    allColumns: true,
    fileName: 'sources-' + this.presentDate.getDate() + "-" + (this.presentDate.getMonth() + 1) + "-" + this.presentDate.getFullYear(),
    sheetName: 1,
    columnSeparator: ",",
    columnKeys: this.staticHeaders,
    classificationId: '',
    processCellCallback: function (params) {
      return params.value
    },
    processHeaderCallback: function (params) {
      return params.column.getColDef().headerName.toUpperCase();
    }
  }

  loadData() {
    this.domainSettings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class",
      primaryKey: "domainId",
      labelKey: "domainName"
    };

    this.domainNoSearchSettings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: false,
      classes: "myclass custom-class",
      primaryKey: "sourceName",
      labelKey: "sourceName"
    };

    Object.assign(this.jurisdictionSettings, this.domainSettings);
    Object.assign(this.mediaSettings, this.domainSettings);
    Object.assign(this.industrySettings, this.domainSettings);
    Object.assign(this.SelectedSourceNamesListSettings, this.domainNoSearchSettings);

    this.jurisdictionSettings['primaryKey'] = "jurisdictionId";
    this.jurisdictionSettings['labelKey'] = "jurisdictionOriginalName";

    this.mediaSettings['primaryKey'] = "mediaId";
    this.mediaSettings['labelKey'] = "mediaName";

    this.industrySettings['primaryKey'] = "industryId";
    this.industrySettings['labelKey'] = "industryName";

    let p1 = new Promise((resolve, reject) => {
      this.sourceManagementService.getSourceIndustryList().subscribe((data: []) => {
        this.industryList = data;
        resolve("success");
      });
    });
    let p2 = new Promise((resolve, reject) => {
      this.sourceManagementService.getSourceDomainList().subscribe((data: []) => {
        this.domainList = data;
        resolve("success");
      });
    });
    let p3 = new Promise((resolve, reject) => {
      this.sourceManagementService.getSourceMediaList().subscribe((data: []) => {
        this.mediaList = data;
        resolve("success");
      });
    });
    let p4 = new Promise((resolve, reject) => {
      this.sourceManagementService.getSourceJurisdictionList().subscribe((data: any[]) => {
        this.jurisdictionList = data;

        data.map(val => {
          val['label'] = val.jurisdictionOriginalName;
          val['listItemId'] = val.jurisdictionName ? val.jurisdictionName : null;
        });

        this.listsOfDataByHeader.domainJurisdictionFilterList = data;
        this.getDropDownListsData();
        resolve("success");
      });
    });
    let p5 = new Promise((resolve, reject) => {
      this.sourceManagementService.getSourceCategories().subscribe(data => {
        this.categorieData = data;
        this.iscategoriesLoaded = true;
        resolve("success");
      });
    });
    let p6 = new Promise((resolve, reject) => {
      this.sourceManagementService.getClassificationsForScource().subscribe(data => {
        this.mainClassificationData = data;
        this.isClassificationsLoaded = true;
        resolve("success");
      });
    });

    Promise.all([p1, p2, p3, p4, p5, p6]).then((values) => {
      this.createGrid(this.mainClassificationData[0]);
      this.isGridOptionsLoaded = true;
    });

    this.SelectedSourceNamesList = [];
    this.domainListColDefs = [
      {
        'headerName': 'Domain Name',
        'field': 'sourceName',
        'colId': 'sourceName',
        'width': 250,
        'initialShowColumn': true,
        'checkboxSelection': true
      },
      {
        'headerName': 'Jurisdiction',
        'field': 'jurisdiction',
        'colId': 'jurisdiction',
        'width': 250,
        'initialShowColumn': true,
        'floatingFilterComponent': 'singleSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': 'jurisdiction',
          'options': []
        },
        'cellRenderer': function (params) {
          return (params && params.value) ? '<span><span class="flag-icon flag-icon-squared mr-2 flag-icon-' + params.data.jurisdictionName.toLowerCase() + '"></span>' + params.value + '</span>' : '';
        }
      },
      {
        'headerName': 'Url',
        'field': 'url',
        'colId': 'url',
        'width': 200,
        'initialShowColumn': true
      }
    ]

    this.domainSearchGridOptions = {
      'resizable': true,
      'tableName': 'domain search view',
      'columnDefs': this.domainListColDefs,
      'rowData': [],
      'rowStyle': { 'border-bottom': '#424242 1px solid' },
      'rowSelection': 'multiple',
      'floatingFilter': true,
      'animateRows': true,
      'sortable': true,
      'tabs': false,
      'isShoHideColumns': false,
      'multiSortKey': 'ctrl',
      'componentType': 'Source Management',
      'defaultGridName': 'Source Management View',
      'cellClass': 'ws-normal',
      'changeBackground': "#ef5350",
      "applyColumnDefOrder": true,
      'this': this.componentThis,
      'rowModelType': 'infinite',
      'enableTableViews': true,
      'cacheBlockSize': 10,
      'paginationPageSize': 10,
      'pagination': true,
      'enableServerSideFilter': true,
      'enableServerSideSorting': true,
      'showBulkOperations': false,
      // 'groupsLevelBulkOperations': groupsLevelBulkOperations,
      'filter': true,
      'instance': this.sourceManagementService,
      'method': "",
      'dataModifier': "formatNewsData",
      'enableCheckBoxes': false,
      'enableTopSection': true,
      'hideGridTopViewDropdownSection': true,
      'hideGridTopRowsperpage': true,
      'rowHeight': 53,
    }
  }

  getNewSourceManagementPermssionIds() {
    const permissions: any[] = this._sharedService.getPermissions();
    if (permissions.length) {
      this.newSourceManagementPermissionJSON = permissions[0].newSourceManagement;
      this.domainSearchPermission = this._commonService.getPermissionStatusType(this._commonService.getDomainPermissions(this.newSourceManagementPermissionJSON, 'domainSearch'));
      this.editSourcePermission = this._commonService.getPermissionStatusType(this._commonService.getDomainPermissions(this.newSourceManagementPermissionJSON, 'editSource'));
      this.changeVisibilityPermission = this._commonService.getPermissionStatusType(this._commonService.getDomainPermissions(this.newSourceManagementPermissionJSON, 'changeVisibility'));
      this.changeCredibilityPermission = this._commonService.getPermissionStatusType(this._commonService.getDomainPermissions(this.newSourceManagementPermissionJSON, 'changeCredibility'));
    }
  }

  ngOnInit() {
    this.titleService.setTitle("Source Management");
    this.getNewSourceManagementPermssionIds();
    this.componentThis = this;
    for (let i in this.credibility_text_map) {
      this.credibilityFilterOptions.push({
        'label': this.credibility_text_map[i],
        'listItemId': parseInt(i)
      });
    }
    this.loadData();
    this.cmnSrvc.addSource.subscribe(
      (toOpen: boolean) => {
        if (toOpen) {
          this.isEdit = false;
          if (this.showDomainList) {
            this.showDomainList = false;
            return;
          }

          this.modalService.dismissAll();
          this.selectedDomains = [];
          this.selectedJurisdictions = [];
          this.selectedIndustries = [];
          this.selectedMedias = [];
          this.sourcename = '';
          this.sourcelink = '';
          this.relationshipUrl = '';
          this.searchUrl = '';
          this.sourceid = '';
          this.sourceType = '';
          this.addRole = '';
          this.sourceEntityType = '';
          this.openWindowCustomClass(this.modalContent);
        }
      }, (err) => { });

    this.cmnSrvc.clickedEdit.subscribe(
      (key) => {
        if (key) {
          this.onClickedEdit(key);
        }
      }, (err) => { });

    this.cmnSrvc.clickedVisible.subscribe(
      (key) => {
        if (key) {
          this.onClickedVisible(key);
        }
      }, (err) => { });
  }

  ngAfterViewInit() {
    this._agGridTableService.getObserverOnRowSelected.subscribe(data => {
      if(data && data['data'] && data['originalGirdTableName'] && data['originalGirdTableName'] == "domain search view"){
        this.SelectedSourceNamesList = data['data'];
      }
    });
  }

  formatNewsData(gridoptionsNews, responseData) {
    if (responseData.data && responseData.data && responseData.data[0]) {
      let newSourceListData = responseData.data[0].map(d => {
        return this.getSourceUIObject(d, this.jurisdictionList);
      });
      this.domainListRowData = newSourceListData;
      responseData['result'] = newSourceListData;

      return newSourceListData;
    }
  }

  getSourceUIObject(source, JurisdictionList){
		return {
			sourceName: source.hostname,
			originalDomainName: source.domainName,
			jurisdiction: JurisdictionList.find(j => j.jurisdictionName === source.jurisdiction).label,
			jurisdictionName: source.jurisdiction,
			url: 'http://' + source.domainName,
			isSelected: source.ingested,
			isDisabledd: source.ingested
		}
	};

  openWindowCustomClass(content) {
    const modal: NgbModalRef = this.modalService.open(content, { windowClass: 'custom-modal modal-md bst_modal', size: 'lg', backdrop: 'static' });
  }

  getFilterOptions(column) {
    let data: any[];
    let filterOptions = [];
    if(column === "Domain"){
      return this.domainList.map(function (d) {
        return {
          'label': d.domainName,
          'listItemId': d.domainId
        };
      });
    } else if(column === "Category"){
      return this.categorieData.map(function (d) {
        return {
          'label': d.categoryName,
          'listItemId': d.categoryId
        };
      });
    } else if(column === "Industry") {
      return this.industryList.map(function (d) {
        return {
          'label': d.industryName,
          'listItemId': d.industryId
        };
      });
    } else if(column === "Jurisdiction") {
      return this.jurisdictionList.map(function (d) {
        return {
          'label': d.jurisdictionOriginalName,
          'value': d.jurisdictionId
        };
      });
    }
    return filterOptions;
  }

  createGrid(classification) {
    this.columnDefs = [];

    for (let i = 0; i < this.staticHeaders.length; i++) {
      let colData = {
        'headerName': this.staticHeaders[i],
        'field': this.staticHeaders[i].toLowerCase().replace(/ /g, "_"),
        'colId': this.staticHeaders[i],
        'initialShowColumn': true,
        'width': 180,
        'cellRenderer': "agAnimateShowChangeCellRenderer",
        'filterParams': {
          applyButton: true,
          clearButton: true
        }
      };
      if (["Domain", "Category", "Industry", "Jurisdiction"].includes(this.staticHeaders[i])) {
        colData['suppressMenu'] = true;
        colData['floatingFilterComponent'] = 'multiSelectFilterComponent';
        colData['floatingFilterComponentParams'] = {
          'suppressFilterButton': true,
          'colId': this.staticHeaders[i],
          'options': this.getFilterOptions(this.staticHeaders[i])
        }
      } else {
        colData['filterParams'] = {
          applyButton: true,
          clearButton: true
        }
      }
      this.columnDefs.push(colData);
    }

    let tempVal = classification.subClassifications;
    let dynamicHeaders = [];
    for (let i = 0; i < tempVal.length; i++) {
      dynamicHeaders[i] = tempVal[i].subClassifcationName;
    }

    for (let i = 0; i < dynamicHeaders.length; i++) {
      this.columnDefs.push({
        'headerName': dynamicHeaders[i],
        'field': dynamicHeaders[i].toLowerCase().replace(/ /g, "_"),
        'colId': dynamicHeaders[i],
        'initialShowColumn': true,
        'width': 180,
        cellRendererFramework: DynamicHeadersRendererComponent,
        'suppressMenu': true,
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': dynamicHeaders[i],
          'options': this.credibilityFilterOptions
        }
      });
    }

    for (let i = 0; i < this.staticHeaders2.length; i++) {
      let colData = {
        'headerName': this.staticHeaders2[i],
        'field': this.staticHeaders2[i].toLowerCase().replace(/ /g, "_"),
        'colId': this.staticHeaders2[i],
        'initialShowColumn': true,
        'width': 180,
        'cellRenderer': "agAnimateShowChangeCellRenderer",
        'filter': false,
      };
      if (this.staticHeaders2[i] === 'Visible') {
        colData['filter'] = true;
        colData['suppressMenu'] = true;
        colData['floatingFilterComponent'] = 'multiSelectFilterComponent';
        colData['floatingFilterComponentParams'] = {
          'suppressFilterButton': true,
          'colId': this.staticHeaders2[i],
          'options': [
            { 'label': 'Visible', 'listItemId': true },
            { 'label': 'Non Visible', 'listItemId': false }
          ]
        }
      }
      this.columnDefs.push(colData);
    }

    this.columnDefs[0].sort = 'desc';
    this.sourceManagementService.classificationId = this.exportParams.classificationId = classification.classificationId;
    this.gridOptions = {
      'resizable': true,
      'tableName': 'Source Management list view',
      'columnDefs': this.columnDefs,
      'rowData': [],
      'rowStyle': { 'border-bottom': '#424242 1px solid' },
      'rowSelection': 'multiple',
      'floatingFilter': true,
      'animateRows': true,
      'sortable': true,
      'tabs': false,
      'isShoHideColumns': true,
      'multiSortKey': 'ctrl',
      'componentType': 'Source Management',
      'defaultGridName': 'Source Management View',
      'cellClass': 'ws-normal',
      'changeBackground': "#ef5350",
      "applyColumnDefOrder": true,
      'this': this.componentThis,
      'rowModelType': 'infinite',
      'enableTableViews': true,
      'cacheBlockSize': 10,
      'paginationPageSize': 10,
      'pagination': true,
      'enableServerSideFilter': true,
      'enableServerSideSorting': true,
      'showBulkOperations': false,
      // 'groupsLevelBulkOperations': groupsLevelBulkOperations,
      'filter': true,
      'instance': this.sourceManagementService,
      'method': "getAllSourcesData",
      'dataModifier': "formatSourcesData",
      'enableCheckBoxes': false,
      'enableTopSection': true,
      'rowHeight': 53,
      'csvExportParams': this.exportParams
    }
  }

  exportData() {
    document.getElementById("export-button").click();
  }

  getEditIcons(visible) {
    if (visible && this.editSourcePermission !== 'none') {
      return `<i class="fa fa-edit f-16 font-16 c-pointer"></i>`
    } else {
      return `<i class="fa fa-edit f-16 font-16 disable pe-none c-ban"></i>`
    }
  }

  public editNode: any;
  onClickedEdit(e) {
    if(this.editSourcePermission === 'none') {
      return;
    }
    this.editNode = e.node;
    this.editData = this.sourceManagementService.allSources.find(x => x.sourceId === e.data.sourceId);
    if (this.editData) {
      this.isEdit = true;
      this.sourceid = this.editData.sourceName;
      this.sourcename = this.editData.sourceDisplayName;
      this.sourcelink = this.editData.sourceUrl;
      this.sourceType = this.editData.sourceType;
      this.searchUrl = this.editData.searchUrl;
      this.relationshipUrl = this.editData.relationshipUrl;
      this.addRole = this.editData.category;
      this.sourceEntityType = this.editData.sourceEntityType;
      this.selectedJurisdictions = this.editData.sourceJurisdiction;
      this.selectedDomains = this.editData.sourceDomain;
      this.selectedIndustries = this.editData.sourceIndustry;
      this.selectedMedias = this.editData.sourceMedia;
      this.classificationType = this.editData.classifications[0].classifcationName;
    }

    this.openWindowCustomClass(this.modalContent);
    setTimeout(() => {
      $(".c-list").mThumbnailScroller({
        axis: "x"
      });
    }, 0);
  }

  getVisibleIcon(visible) {
    if (visible) {
      if (this.changeVisibilityPermission === 'full') {
        return `<i class="fa fa-eye f-16 c-pointer"></i>`;
      } else {
        return `<i class="fa fa-eye f-16 disable pe-none c-ban"></i>`;
      }
    } else {
      if (this.changeVisibilityPermission === 'full') {
        return `<i class="fa fa-eye-slash f-16 c-pointer"></i>`;
      } else {
        return `<i class="fa fa-eye-slash f-16 disable pe-none c-ban"></i>`;
      }
    }
  }

  onClickedVisible(e) {
    if(this.changeVisibilityPermission !== 'full') {
      return;
    }
    let row = e.node;
    let source = this.sourceManagementService.allSources.find(x => x.sourceId === e.data.sourceId);
    source.classifications[0].hideStatusDto.visible = !e.data.visibilityValue;
    this.sourceManagementService.updateScource(source).subscribe(data => {
    }, (error => { }));
    row.data.visibilityValue = !row.data.visibilityValue;
    row.data.visible = this.getVisibleIcon(row.data.visibilityValue);
    row.data.edit = this.getEditIcons(row.data.visibilityValue);
    e.api.redrawRows({ rowNodes: [row] });
  }

  sourceToRowData(source) {
    return {
      sourceId: source.sourceId ? source.sourceId : '',
      source: source.sourceName ? source.sourceName : '',
      link: '<a href="http://' + (source.sourceUrl ? source.sourceUrl : "") + '" target="_blank">' + (source.sourceUrl = source.sourceUrl ? source.sourceUrl : "") + '</a>',
      domain: source.sourceDomain.map(a => { return (a.domainName = a.domainName ? a.domainName : '') }),
      category : source.category ? source.category : '',
      industry: source.sourceIndustry.map(a => { return (a.industryName = a.industryName ? a.industryName : '') }),
      jurisdiction: source.sourceJurisdiction.map(a => { return (a.jurisdictionOriginalName = a.jurisdictionOriginalName ? a.jurisdictionOriginalName : '') }),
      edit: this.getEditIcons(source.classifications[0].hideStatusDto.visible),
      visible: this.getVisibleIcon(source.classifications[0].hideStatusDto.visible),
      visibilityValue: source.classifications[0].hideStatusDto.visible,
      changeCredibilityPermission: this.changeCredibilityPermission
    }
  }

  formatSourcesData(gridoptions, responseData) {
    let finalStaticHeadersData = [];
    let rowData = [];
    let dynamicHeadersCredibility = {};

    for (let i = 0; i < responseData.result.length; i++) {
      finalStaticHeadersData.push(this.sourceToRowData(responseData.result[i]));

      if (responseData.result[i].classifications[0] && responseData.result[i].classifications[0].subClassifications) {
        for (let j = 0; j < responseData.result[i].classifications[0].subClassifications.length; j++) {
          if (responseData.result[i].classifications[0].subClassifications[j].dataAttributes.length > 0) {
            dynamicHeadersCredibility[responseData.result[i].classifications[0].subClassifications[j].subClassifcationName.toLowerCase().split(" ").join("_")] = responseData.result[i];
          }
          else {
            dynamicHeadersCredibility[responseData.result[i].classifications[0].subClassifications[j].subClassifcationName.toLowerCase().split(" ").join("_")] = responseData.result[i];
          }
        }
      }
      finalStaticHeadersData.push(dynamicHeadersCredibility);
      let mergedObject = finalStaticHeadersData.reduce((a, b) => Object.assign(a, b), {});
      rowData.push(mergedObject);
    }
    if (responseData.paginationInformation.index === 1) {
      this.sourceManagementService.allSources = responseData.result;
    } else {
      this.sourceManagementService.allSources = this.sourceManagementService.allSources.concat(responseData.result);
    }
    return rowData;
  }

  tabChange(item) {
    let classification = this.mainClassificationData.find(m => m.classificationId === item.nextId);
    this.createGrid(classification);
    this.isGridOptionsLoaded = false;
    setTimeout(() => {
      this.isGridOptionsLoaded = true
    }, 0);
  }
  getSlider(key) {
    return '<span class="main-slider-value">' + key + '</span><input [disabled]="true" type="range" name="points" min="0" max="3" data-action-type="main-sliders" class="range_status ' + key + ' " value="' + this.credibility_digit_map[key] + '">';
  }

  initializeScroll() {
    $(".ng-multiselect-wrapper").click(function () {
      $(".c-list").mThumbnailScroller({
        axis: "x"
      });
    });
  }

  onItemSelect(item: any) {

    this.initializeScroll();
  }
  OnItemDeSelect(item: any) {

    this.initializeScroll();
  }
  onSelectAll(items: any) {

    this.initializeScroll();
  }
  onDeSelectAll(items: any) {

  }

  modalClose() {

    if (this.showDomainList) {
      this.showDomainList = false;
      return;
    }

    this.modalService.dismissAll();
    this.selectedDomains = [];
    this.selectedJurisdictions = [];
    this.selectedIndustries = [];
    this.selectedMedias = [];
    this.sourcename = '';
    this.sourcelink = '';
    this.relationshipUrl = '';
    this.searchUrl = '';
    this.sourceid = '';
    this.sourceType = '';
    this.addRole = '';
    this.sourceEntityType = '';
  }

  onSubmit(form: NgForm) {
    let classifications = [];
    if (form && form.value && form.value.classification) {
      classifications = [this.classificationTypeData(form.value.classification)];
    }

    if (!this.isEdit) {
      let data = {
        "classifications": classifications,
        "sourceName": form.value.sourceid,
        "sourceUrl": form.value.sourcelink,
        "sourceType": form.value.sourceType,
        "sourceDisplayName": form.value.sourcename,
        "sourceIndustry": form.value.industry,
        "searchUrl": form.value.searchUrl,
        "sourceJurisdiction": form.value.jurisdiction,
        "sourceDomain": form.value.domain,
        "sourceMedia": form.value.media,
        "entityId": '',
        "sourceEntityType": form.value.sourceEntityType,
        "relationshipUrl": form.value.relationshipUrl,
        "category": form.value.roleData,
      };

      if (this.classificationType == "NEWS") {
        this.addNewsSource();
      } else {
        this.sourceManagementService.addNewSourceAPI(data).subscribe((response) => {
        }, (err) => { });
      }
    }
    if (this.isEdit) {
      let source = this.sourceManagementService.allSources.find(x => x.sourceId === this.editData.sourceId);
      source.sourceName = form.value.sourceid;
      source.sourceUrl = form.value.sourcelink;
      source.sourceType = form.value.sourceType;
      source.sourceDisplayName = form.value.sourcename;
      source.sourceIndustry = form.value.industry;
      source.searchUrl = form.value.searchUrl;
      source.sourceJurisdiction = form.value.jurisdiction;
      source.sourceDomain = form.value.domain;
      source.sourceMedia = form.value.media;
      source.sourceEntityType = form.value.sourceEntityType;
      source.relationshipUrl = form.value.relationshipUrl;
      source.category = form.value.roleData;
      this.sourceManagementService.updateScource(source).subscribe(data => {
      }, (error => { }));
      let nodeData = this.sourceToRowData(source);
      this.editNode.data.source = nodeData.source;
      this.editNode.data.link = nodeData.link;
      this.editNode.data.domain = nodeData.domain;
      this.editNode.data.industry = nodeData.industry;
      this.editNode.data.jurisdiction = nodeData.jurisdiction;
      this.cmnSrvc.updateRow.next(this.editNode);
    }
    this.modalClose();
  }

  addNewsSource(){
    if (this.SelectedSourceNamesList.length > 0 ) {
      let params = [];
      this.SelectedSourceNamesList.map(function (s) {
        params.push({
            "topic": {
              "host_name": s.originalDomainName,
              "year_month": [ "^/*", "NA" ]
            }
        });
      });
      this.sourceManagementService.addDomains(params).subscribe((response) => {
        if (response) {
          this._sharedService.showFlashMessage('Sources were added, data will be fetched in the next few hours', 'success');
          this.SelectedSourceNamesList = [];
        }
      }, (err) => {
        this._sharedService.showFlashMessage('Error Occurred!', 'danger');
      });
    }
  }

  classificationTypeData(type: string) {
    let data = {};
    if (type && this.mainClassificationData && this.mainClassificationData.length > 0) {
      let index = this.mainClassificationData.map(function (e) { return e.classifcationName }).indexOf(type);
      data = index >= 0 ? this.mainClassificationData[index] : {};
    }
    return data;
  }

  getDropDownListsData() {
    this.domainListColDefs.map(value => {
      if (value.colId == 'jurisdiction') {
        value.floatingFilterComponentParams.options = (JSON.parse(JSON.stringify(this.listsOfDataByHeader.domainJurisdictionFilterList)));
      }
    });
  }

  unShiftAllTextInFilterOptions(list) {
    var tempList = list ? list : [];

    tempList.unshift({
      'listItemId': null,
      'label': 'All'
    });
    return tempList;
  }

  domainWindowInit(){
    this.showDomainList = true;
    this.barGraphDomainSearchTopJurisdictionChartIntialize();
    this.isDomainSearchGridOptionsLoaded = false;
    if(this.classificationType === 'NEWS'){
      this.domainSearchGridOptions.method = "getAllSourcesDataNews";
    } else {
      this.domainSearchGridOptions.method = "getAllSourcesDataOther";
    }
    setTimeout(() => {
      this.isDomainSearchGridOptionsLoaded = true;
    }, 0);
  }

  barGraphDomainSearchTopJurisdictionChartIntialize() {
    var BarData = [];
    this.sourceManagementService.getDomainSearchSummaryData(10).subscribe((response) => {
      this.totNumberOfNewsDomains =  response && response['available_sources'] && response['available_sources']['news_domains'] ? response['available_sources']['news_domains'] : '';
      BarData = response && response['jurisdictions'];
      this.barGraphDomainSearchTopJurisdictionChartPopulate(BarData);
    });
  }

  barGraphDomainSearchTopJurisdictionChartPopulate(data){
    let finalBarData = [];
    data.forEach(element => {
      if (element.jurisdiction && element.hasOwnProperty('count')) {
				finalBarData.push({
					x: element.jurisdiction,
					y: element.count
				})
			}
    });
    var options = { "xAxisFlags": true, "valuesColor": "rgba(255, 255, 255, 0.6)", "toolTipOpacity": 0.9, "toolTipTextColor": "white", "toolTipText": "openFailuresOn", "toolTipBackground": "", "toolTipBorder": "2px", "showlineaxisY": false, "showlineaxisX": true, "paddingX": 0.4, "id": "barGraphDomainSearchTopJurisdiction", "rx": 4, "ry": 4, "height": 150, "width": 500, "marginTop": 20, "marginBottom": 50, "stroke": " rgba(255, 255, 255, 0.2)", "marginRight": 20, "marginLeft": 40, "yAxisTicks": 8, "yAxisTickFormat": ".0s", "tickColor": "rgb(51, 69, 81)", "color_hash": { "0": ["Invite", "#8F4582"] }, "colors": "var(--warningAlert)", "xParam": {}, "yParam": {}, "gridx": true, "gridy": false, "axisX": true, "axisY": false, "showxYaxis": false, "xtext": "", "showGrid": true, "showBarData": false, "dataColor": "white" };
    verticalBarGraphModule.verticalBarGraph(finalBarData, options, this._sharedService);
  }

  testCheck() {
    this.SelectedSourceNamesList = [
      {
        "domainId": 360,
        "domainName": "General"
      },
      {
        "domainId": 362,
        "domainName": "Cyber Security"
      }
    ]

  }
}
