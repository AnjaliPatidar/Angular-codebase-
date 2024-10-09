import { TagManagementApiService } from './../../../../../modules/systemsetting/services/tag-management.api.service';
import { DocumentCustomTitleComponent } from './../../custom-table-renderer/document-custom-title/document-custom-title.component';
import { SharedServicesService } from './../../../../../shared-services/shared-services.service';
import { CaseManagementService } from './../../../../../modules/case-management/case-management.service';
import { Component, OnInit, Input,ElementRef, ViewChild} from '@angular/core';
import { CaseTagsCellComponent } from '../../custom-table-renderer/case-tags-cell/case-tags-cell.component';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TranslateService } from '@ngx-translate/core';
import { DateTimeColumnComponent } from '../../cell-renderers/date-time-column/date-time-column.component';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';

var filters = {};

export const DOC_REPO_TABLE_NAME = 'Doucment repository';
@Component({
  selector: 'app-document-repository',
  templateUrl: './document-repository.component.html',
  styleUrls: ['./document-repository.component.scss']
})
export class DocumentRepositoryComponent implements OnInit {

  filterForm: FormGroup
  columnDefs: any;
  gridOptions: any = {};
  tagList = []
  documentTags
  selectedDocumentList = []
  isLoadGrid: boolean
  filterFormControl = new FormControl();
  filteredFruits: Observable<any[]>;
  selectedFilterType: any[] = [];
  allFilterOptions:any[] = [
    {
      colID: "title",
      label: "Document Name",
      icon: "error",
      isSelected:false
    },
    {
      colID: "fileID",
      label: "File ID",
      icon: "error",
      isSelected:false
    },
    {
      colID: "tags",
      label: "Tags",
      icon: "label",
      isSelected:false
    },
  ];
  content:string
  isNotEditMode:boolean
  gridApi
  @ViewChild('filterInput', {static:false}) filterInput: ElementRef<HTMLInputElement>;
  @ViewChild('contentInput', {static:false}) contentInput: ElementRef<HTMLInputElement>;
  @Input('componentType') componentType: string;
  allDocumentTags:any[] = []
  constructor(private _caseService: CaseManagementService,
    private sharedService:SharedServicesService , private translateService: TranslateService,
    private tagManagementApiService:TagManagementApiService) {
     }

  ngOnInit() {
    this.allDocumentTags = GlobalConstants.doucmentTagsList;
    this.getTagMappingForAllDocs();
    this.filterForm = new FormGroup({
      fileID: new FormControl(""),
      title: new FormControl(""),
      tags: new FormControl(""),
    })
    this.filteredFruits = this.filterFormControl.valueChanges.pipe(
      startWith(null || ''),
      map((type) => this._filter(type)),
    )
  }

  // @reason : setup the grid option for ag grid table
  // @author : Ammshathwan
  // @date : 21st APR 2022
 loadDocumentData() {
    this._caseService.updateCaseAttachmentData.next([])
    let totalDoucmentCount =  this._caseService.totalDocumentCount
    this.columnDefs = [
      {
        'headerName': 'ID',
        'field': 'fileID',
        'colId': 'fileID',
        'width': this.componentType == 'updateAttachments' ? 180 : 75,
        'headerCheckboxSelection': true,
        'headerCheckboxSelectionFilteredOnly': true,
        'checkboxSelection': true,
        'initialShowColumn': true,
        'suppressMenu': true
      },
      {
        'headerName': this.translateService.instant('Document Name'),
        'field': 'title',
        'colId': 'title',
        'width': this.componentType == 'updateAttachments' ? 200 : 110,
        'initialShowColumn': true,
        'sortable': true,
        'suppressMenu': true,
        'cellRendererFramework' : DocumentCustomTitleComponent
      },
      {
        'headerName': this.translateService.instant('Last Updated'),
        'field': 'timestamp',
        'colId': 'timestamp',
        'width': this.componentType == 'updateAttachments' ? 200 : 100,
        'initialShowColumn': true,
        'sortable': true,
        'suppressMenu': true
      },
      {
        'headerName': this.translateService.instant('Tags'),
        'field': 'tags',
        'colId': 'tags',
        'width': this.componentType == 'updateAttachments' ? 200 : 100,
        'initialShowColumn': true,
        'cellRendererFramework': CaseTagsCellComponent,
        'sortable': true,
        'suppressMenu': true,
      },
      {
        'headerName': this.translateService.instant('Version'),
        'field': 'version',
        'colId': 'version',
        'width': this.componentType == 'updateAttachments' ? 95 : 35,
        'initialShowColumn': true,
        'sortable': true,
        'suppressMenu': true
      },
      {
        'headerName': this.translateService.instant('Expiry Date'),
        'field': 'expiryDate',
        'colId': 'expiryDate',
        'initialShowColumn': true,
        'cellClass': 'expiry-column',
        'cellRendererFramework': DateTimeColumnComponent,
        'floatingFilterComponent': 'dateFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'opensProperty': 'left',
          'dropsPropertyType': 'down',
        },
        'filterParams': {
          'filterOptions': ['inRange'],
        },
        'suppressMenu': true,
        'cellClassRules': {
          'warning-icon': function (params) {
            if (params && params.data && params.data.notification) {
              return params.data.status !== 'Expired'
            }
          },
          'text-label__mandatory': function (params) {
            if (params && params.data && params.data.status) {
              return params.data.status === 'Expired'
            }
          },
        },
      },
    ]

    this.gridOptions = {
      'resizable': true,
      'tableName': DOC_REPO_TABLE_NAME,
      'columnDefs': this.columnDefs,
      'rowStyle': { 'border-bottom': '#5f5f5f 0.5px solid' },
      'rowSelection': 'multiple',
      'floatingFilter': false,
      'sortable': true,
      'animateRows': true,
      'tabs': false,
      'isShoHideColumns': true,
      'multiSortKey': 'ctrl',
      'componentType': 'doucment repository',
      'defaultGridName': 'doucment repository',
      'changeBackground': "#ef5350",
      'rowModelType': 'infinite',
      'enableTableViews': false,
      'paginationPageSize': totalDoucmentCount,
      'pagination': false,
      'showBulkOperations': false,
      'filter': false,
      'suppressPaginationPanel': false,
      'enableCheckBoxes': true,
      'enableTopSection': false,
      'rowHeight': 43,
      'hideGridTopRowsperpage': true,
      'hideGridTopViewDropdownSection': false,
      'enableGridTopSection': false,
      'showHideColumnHeaders': false,
      "applyColumnDefOrder": true,
      'enableServerSideFilter': false,
      'enableServerSideSorting': false,
      'enableFilter': true,
      'ensureDomOrder': true,
      'instance': this._caseService,
      'this': this,
      'suppressRowClickSelection': true,
      'suppressCellSelection': true,
      'method': "getDoucmentWithTags",
      'dataModifier': "getDocumentsData",
      "sortingOrder": ["asc", "desc"],
      'cacheBlockSize': totalDoucmentCount,
      'cellClass': 'ws-normal',
      'cacheOverflowSize': 10,
      'rowData': [],
      getRowStyle: params => {
        if (params && params.node && !params.node.id) {
            return { display: 'none' };
        }
      },
      getRowNodeId: file => {
        return file.fileID;
     }
    }

    this._caseService.documentTagMappingListObserver.subscribe((list) => {
      if(list && JSON.stringify(list) !== '{}'){
        this.isLoadGrid = true;
      }else{
        this.isLoadGrid = true;
      }
    },(err) => {
      this.isLoadGrid = true;
    })
  }

  // @reason : pass the data to each column in table
  // @author : Ammshathwan
  // @date : 21st APR 2022
  getDocumentsData(currentInstance, response): Array<any> {
    this.gridApi = currentInstance  ? currentInstance : {}
    var temArray = [];
    if (response && response.result && response.result.length) {
      this.tagList = response.tags ? response.tags : [];
      this._caseService.documentTagMappingList.next(this.tagList);
      this._caseService.repoDocumentListData.next(response.result);

      response.result.forEach(documentData => {
        temArray.push({
          'fileID': (documentData.file_id) ? documentData.file_id : '',
          'title': {fileName: documentData.title ? documentData.title : '' , format : documentData.format ? documentData.format : ''},
          'timestamp': (documentData.timestamp) ? documentData.timestamp : '',
          'tags': this.getDocumentTag(documentData.file_id),
          'version': (documentData.version) ? 'V' + documentData.version : '',
          'filePath': documentData.file_path || '',
          'expiryDate': documentData.expiry_date || '',
          'status': documentData.status || '',
          'notification': this.generateNotification(documentData.status,documentData.expiry_date)
        })
      });

      return temArray;
    }
    return [];
  }

  generateNotification(status, dateTimeValue) {
    let notification;
    if(dateTimeValue){
      if (status === 'Expired') {
        notification = 'Document expired on ';
      } else {
        this.sharedService.getSystemSettings().then((data) => {
          const expiryData =  data['Document Management'].find(item=>item.settingId===1064642);
          const nofiticationPeriod = expiryData && +expiryData.selectedValue;
          const diffTime = (new Date(dateTimeValue) as any) - (new Date() as any);

          if (diffTime > 0) {
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if(diffDays <= nofiticationPeriod) {
              notification = 'Document will expire on ';
            }
          }
        })
      }
    }
    return notification;
  }

  // @reason : get the selected tag object from tag list
  // @author : Ammshathwan
  // @date : 21st APR 2022
  getDocumentTag(fileId) {
    if (fileId) {
      var tags;
      this.documentTags = [];
      if (Object.keys(this.tagList).find(ele => ele == fileId)) {
        this.tagList[fileId].forEach(tag => {
          if (tag) {
            let tagElement = tag.content ? tag.content : '';
            let subTagElement = tag.subtag ? ' : ' + tag.subtag['content'] : '';
            tags = {
              content: tagElement + subTagElement,
              color_code: tag.color_code ? tag.color_code : ''
            }
            this.documentTags.push(tags)
          } else {
            this.documentTags = [];
          }
        });
      }
      return this.documentTags;
    }
  }
  // @reason : get the selected data from table and store
  // @author : Ammshathwan
  // @date : 21st APR 2022
  getSelectedDocument(data) {
    if(data){
      this.selectedDocumentList = []
    data.filter((rowData) => {
      this.selectedDocumentList.push(rowData.data)
    })
    this._caseService.updateCaseAttachmentData.next(this.selectedDocumentList)
    }
  }


  displayFn(type: any): any {
    if (type) {
      return type && type.label ? type.label : '';
    }
  }

  remove(type: any, colID): void {
    this.filterForm.controls[colID].reset()
    const currentFilterModel = this.gridApi.getFilterModel();
    if(type){
      const index = this.selectedFilterType.indexOf(type);
    if (index >= 0) {
      this.selectedFilterType.splice(index, 1);
    }

    if(colID == 'tags'){
      currentFilterModel.fileID.filter = this.filterForm.value.fileID;
      this.gridApi.setFilterModel(currentFilterModel);
    }else if(colID == 'fileID' && this.filterForm.value.tags){
      currentFilterModel.fileID.filter = this.getDocIdsForSelectedTag(this.filterForm.value.tags);
      this.gridApi.setFilterModel(currentFilterModel);
    }else{
      this.sharedService.resetFilters(this.gridApi, type.colID)
    }
    this.allFilterOptions.find(obj => obj.label == type.label).isSelected = false
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if(event && event.option && event.option.value && event.option.value.label){
    this.selectedFilterType.push(event.option.value);
    this.filterInput.nativeElement.value = '';
    this.filterFormControl.setValue(null);
    this.filterInput.nativeElement.blur();
    this.allFilterOptions.find(obj => obj.label == event.option.value.label).isSelected = true;
    this.filterForm.valueChanges.subscribe(Options => {
      this.getFormData(Options);
    })
    }
  }

  private _filter(value: string): any[] {
    let result = this.allFilterOptions
    if(value){
      const filterValue = value.toString().toLowerCase();
      result = this.allFilterOptions.filter(fruit => fruit.label.toLowerCase().includes(filterValue))
      return result;
    }else{
      return result
    }
  }

  getFormData(Options):void{
    const assignFilter = this.gridApi && this.gridApi.getFilterModel() ? this.gridApi.getFilterModel() : {};
    filters = assignFilter
    if (Options['fileID'] && Options.fileID !== '') {
      filters["fileID"] = {
      'filter': Options.fileID,
      'type': 'contains',
      'filterType': 'text'
      }
    }
    if(Options['title'] && Options.title !== ''){
        filters["title"] = {
        'filter': Options.title,
        'type': 'contains',
        'filterType': 'text'
      }
    }
    if (Options['tags'] && Options.tags !== '') {
      let filteredDocIds = this.getDocIdsForSelectedTag(Options.tags);

          filters['fileID'] = {
            'filter': filteredDocIds,
            'type': 'equals',
            'filterType': 'equals'
          };
    }

    this.gridApi.setFilterModel(filters);
  }


  getTagMappingForAllDocs(){
    const params = { page: 1, count: 1, filterModel: [] }
    this._caseService.getDocumentList(params).subscribe((data) => {
      this._caseService.totalDocumentCount = data.paginationInformation.totalResult;
      this.loadDocumentData();
    })
  }

  public trackByColId(_, item): string {
    return item.colID;
  }

  // @purpose : get all available doc id  for a tag
  // @params : tag or filter value for tag
  // @retun : list of doument IDs or empty array
  // @date : 28 apr 2023
  // @author : ammshathwan
  getDocIdsForSelectedTag(value:string):any[]{
    let filteredDocIds = []
      this.allDocumentTags.map((tag : any) => {
        if(tag.content.toLowerCase().includes(value.toLowerCase())){
          filteredDocIds = filteredDocIds.concat(tag.entities)
        }
      })
      if(this.filterForm && this.filterForm.value && this.filterForm.value.fileID && filteredDocIds && filteredDocIds.length){
        filteredDocIds = filteredDocIds.filter((id:number) => {return (id.toString()).includes(this.filterForm.value.fileID)})
      }
      return filteredDocIds
  }
}
