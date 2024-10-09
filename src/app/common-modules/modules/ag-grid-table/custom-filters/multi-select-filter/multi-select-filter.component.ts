import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatOption } from "@angular/material/core";
import { MatSelect } from "@angular/material/select";
import { FormControl } from '@angular/forms';
import { UserConstant } from '@app/modules/user-management/constants/ag-grid/user-table.constants';
import { EntityGraphService } from '@app/modules/entity/services/entity-graph.service';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { AlertManagementService } from '@app/modules/alert-management/alert-management.service';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';

var filters = {};
var optionsFromMultipleSelect = [];
var selectedOCountriesFromWorldMap = [];
var returnedFilteredData = [];
@Component({
  selector: 'app-multi-select-filter',
  templateUrl: './multi-select-filter.component.html',
  styleUrls: ['./multi-select-filter.component.scss']
})
export class MultiSelectFilterComponent implements OnInit, AfterViewInit {
  @Input() disableOptionCentering: boolean;
  @Input() searching = true;
  @Input() clearSearchInput = true;
  @Input() placeholderLabel = (GlobalConstants.languageJson && GlobalConstants.languageJson['Search']) ? GlobalConstants.languageJson['Search'] : 'Search';
  myFormControl = new FormControl();
  allSelected = false;

  @ViewChild('mySel', { static: false }) selectTag: MatSelect;
  public selectOptions: any;
  public actualSelectOptions: any;
  public searchedText: any;
  public gridApi: any;
  public gridOptions: any;
  public colId: any;
  public rowModelType: any;
  public tableName: any;
  public mainFilteredData = [];
  public originalRowData: any = [];
  public filterName;
  public defaultSelectedOptions = [];
  public isBstThemeUI:boolean;
  constructor(private _entityGraphService: EntityGraphService,
    private _commonService: CommonServicesService,
    private _alertService: AlertManagementService,
    private sharedService: SharedServicesService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this._commonService.getDataFromComponentBehaveObserver.subscribe((resp) => {
      if (resp && resp.rowData && resp.rowData.length) {
        this.gridOptions.rowData = resp.rowData;
        optionsFromMultipleSelect = [];
        selectedOCountriesFromWorldMap = [];
        this.gridApi.setRowData(this.gridOptions.rowData);
      }
    })

    this._entityGraphService.bevaviourSubjectOfCountriesFromMap.subscribe((resp: any) => {
      if (resp && this.colId == 'jurisdiction') {
        selectedOCountriesFromWorldMap = [];
        resp.map((val) => {
          if (val && val.properties) {
            selectedOCountriesFromWorldMap.push(
              {
                'value': val.properties.name,
                'colId': this.colId
              });
          }
        });
        if (this.selectTag.value === undefined) {
          this.selectTag.value = selectedOCountriesFromWorldMap.map((v) => { return v.value }).filter(m => { return m });
        }
        else if (this.selectTag.value && this.selectTag.value.length) {
          selectedOCountriesFromWorldMap.map((v) => {
            this.selectTag.value.push(v.value);
          });
        }
        this.selectTag.value.filter((item, index) => this.selectTag.value.indexOf(item) === index);
        this.applyFilters();
      }
    });
  }

  changeScroll() {
  }

  agInit(params: any, event): void {
    if (params) {
      this.gridOptions = (params.api && params.api.gridOptionsWrapper && params.api.gridOptionsWrapper.gridOptions) ? params.api.gridOptionsWrapper.gridOptions : {};
      this.rowModelType = (params.api && params.api.gridOptionsWrapper && params.api.gridOptionsWrapper.gridOptions && params.api.gridOptionsWrapper.gridOptions.rowModelType) ? params.api.gridOptionsWrapper.gridOptions.rowModelType : '';
      this.tableName = (params.api && params.api.gridOptionsWrapper && params.api.gridOptionsWrapper.gridOptions && params.api.gridOptionsWrapper.gridOptions.tableName) ? params.api.gridOptionsWrapper.gridOptions.tableName : '';
      this.isBstThemeUI = this.tableName && this.tableName == "Case list view" ? true : false;
      this.gridApi = params.api ? params.api : '';
      this.colId = params.colId ? params.colId : '';
      this.selectOptions = params.options ? params.options : [];
      if (params.filterName) {
        this.filterName = params.filterName
      }

      this.actualSelectOptions = JSON.parse(JSON.stringify(this.selectOptions));
      if (this.tableName == "Alert list view" || this.tableName == "Source Management list view" || this.tableName == "Case list view") {
        if(this.colId =='type'){
        this.selectOptions.map((option:any) => {
            if(option && option.code == 'n/a'){
              option.listItemId = 'n/a';
              option.displayName = 'N/A';
              option.label = 'N/A';
            }
          })
        }
        if (this.gridApi.getFilterModel() && this.gridApi.getFilterModel()[params.colId]) {
          if(!this.isBstThemeUI){
            this.defaultSelectedOptions = this.gridApi.getFilterModel()[params.colId].filter.split('#').map((value) => {
              if (!isNaN(value)) {
                return parseInt(value);
              }
              else {
                return value;
              }
            })
          }else{
            let filterValue:string = this.gridApi.getFilterModel()[params.colId].filter;
            const isCustomLabel = this.colId == "assignee" || this.colId == "type" ? true : false;
            try {
              let tempFilterValue = JSON.parse(filterValue)
              if(this.colId == "assignee" || this.colId == "modified_person"){
                tempFilterValue.map((filter:any , i) => {
                  tempFilterValue[i] = filter.toString();
                })
              }
              this.defaultSelectedOptions = tempFilterValue;
            } catch (e) {
              this.defaultSelectedOptions = [];
              if(this.colId == "status" || this.colId == "modified_person"){
                this.defaultSelectedOptions = filterValue.replace(/[\[\]']+/g,'').split(",")
              }else{
                if(isCustomLabel){
                  const isAllSelect = filterValue.includes(",");
                  if(isAllSelect){
                    this.selectOptions.map((options) => {
                      this.defaultSelectedOptions.push(options.listItemId)
                      this.colId == "type" ? this.defaultSelectedOptions.unshift("n/a") : this.defaultSelectedOptions.unshift("unassignee");
                    })
                  }else{
                    const currentValue = this.colId == "type" ? "n/a" : "unassignee";
                    this.defaultSelectedOptions.push(currentValue)
                  }
                }
              }
            }
          }
        }
      }
      if (UserConstant.filterData && UserConstant.filterData[this.colId]) {
        if (this.rowModelType == 'infinite') {
          if (UserConstant && UserConstant.filterData && UserConstant.filterData[this.colId] && UserConstant.filterData[this.colId]['filter']) {
            this.defaultSelectedOptions = UserConstant.filterData[this.colId]['filter'].split("#").map((value) => {
              if (!isNaN(value)) {
                return parseInt(value);
              }
              else {
                return value;
              }
            })
          }
        }
        else {
          this.defaultSelectedOptions = UserConstant.filterData[this.colId]['filter'].split(",")
        }
      }
      this.originalRowData = (this.gridOptions && this.gridOptions.rowData && this.gridOptions.rowData.length) ? JSON.parse(JSON.stringify(this.gridOptions.rowData)) : []
    }
  }

  getValuesOnChange(e) {
    if (this.tableName == 'Source list view') {
      var index = optionsFromMultipleSelect.findIndex(val => val.value.toLowerCase() == e.source.value.toLowerCase());
      if (index == -1) {
        optionsFromMultipleSelect.push(
          {
            'value': e.source.value,
            'colId': this.colId
          }
        )
      }
      else {
        optionsFromMultipleSelect.splice(index, 1);
      }
    }
  }

  filterMyOptions(e) {
    if (e) {
      this.selectOptions = this.actualSelectOptions.filter(val => { if (val.label) { return val.label.toLowerCase().indexOf(e.toLowerCase()) != -1 } });
    }
    else {
      this.selectOptions = this.actualSelectOptions;
    }
  }
  toggleAllSelection() {
    let allTrue = true;
    this.selectTag.options.forEach((item: MatOption) => {
      if (item.value == "all") {
        if (!item.selected) {
          allTrue = false;
          return;
        }
      }
    });
    this.allSelected = !this.allSelected;
    const allTrueValue = this.tableName == 'Case list view' ? allTrue : this.allSelected;
    if (allTrueValue) {
      this.selectTag.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectTag.options.forEach((item: MatOption) => { item.deselect() });
    }
  }

  cancelFilters() {
    if (this.tableName == 'Case list view'){
      var originFilters = this.gridApi.getFilterModel();
      if(originFilters && originFilters['group_id']){
          this.defaultSelectedOptions = []
        originFilters['group_id'].filter.split(",").forEach((i)=>{
          i = i.replace('[', '');
          i = i.replace(']', '');
          if(i == 'unassignee'){
            this.defaultSelectedOptions.push('unassignee');
          }
          if( !isNaN(parseFloat(i)) && !i.includes('#') ){
            this.defaultSelectedOptions.push(parseFloat(i));
          }
          if(i.includes('#')){
           this.allSelected = false;
            this.toggleAllSelection()
          }
        });
      }else{
        this.defaultSelectedOptions = []
      }
     this.selectTag.close();
    }else{
      this.selectTag.value = [];
      this.allSelected = false;
      this.selectTag.close();
    }
  }

  adjustSelections() {
    let allTrue = true;
    let allItem;
    this.selectTag.options.forEach((item: MatOption) => {
      if (item.value != "all") {
        if (!item.selected) {
          allTrue = false;
          return;
        }
      }
      else {
        allItem = item;
      }
    });
    if (allItem) {
      if (allTrue) {
        allItem.select();
      }
      else {
        allItem.deselect();
      }
    }
  }

  applyFilters() {
    if (this.selectTag) {
      if (this.selectTag.value && this.selectTag.value == 'all') {
        delete filters[this.colId];
        this.gridApi.setFilterModel(filters);
      }
      else {
        let allFilters = this.gridApi.getFilterModel();
        if (this.selectTag.value && this.selectTag.value.indexOf("all") != -1) {
          this.selectTag.value.shift();
        }
        if (this.rowModelType == 'infinite') {
          allFilters[this.colId] = {
            'filter': this.selectTag.value ? this.selectTag.value.join('#') : '',
            'type': this.filterName ? this.filterName : 'multiSelect',
            'filterType': 'text'
          };
          if (this.tableName == 'Case list view') {
            allFilters[this.colId] = {
              'filter': this.selectTag.value.length ? "[" + this.selectTag.value.join(',') + "]"  : null,
              'type': 'in',
              'filterType': 'text'
            };
          }
          if (this.colId == 'business_priority' || this.colId == 'group_id' || this.colId == 'products' || this.colId == 'risk_override' || this.colId == 'assignee' || this.colId == 'status' || this.colId == "modified_person") {
            if(this.colId == 'status' || this.colId == 'assignee' || this.colId == 'group_id' || this.colId == "modified_person"){
              this.selectTag.value.map((value , i) => {
                this.selectTag.value[i] = this.colId !== 'assignee' ? `${value}` : value.toString()
                this.selectTag.value[i] = this.colId !== 'modified_person' ? `${value}` : value.toString()
              })
            }
            if(this.colId && this.selectTag.value && this.selectTag.value.length){
              allFilters[this.colId] = {
                'type': 'in',
                'filter': this.selectTag.value ? "[" + this.selectTag.value.join(',') + "]" : '',
                'filterType': 'text'
              };
            }
          }
          this.gridApi.setFilterModel(allFilters);
          if (allFilters && allFilters.status && allFilters.status.filter == "" || allFilters && allFilters.feed && allFilters.feed.filter == "") {
            this._alertService.setFilter = {};
            this._alertService.clearTableData();
          } else {
            this._alertService.setFilter = allFilters;
            this._alertService.clearTableData();
          }
        }
        else {
          var otherColumnFilters = this.gridApi.getFilterModel();
          if (this.tableName, this.colId) {
            if (this.tableName == 'Feed list view') {
              allFilters[this.colId] = {
                'filter': this.selectTag.value ? this.selectTag.value.join(',') : '',
                'type': 'contains',
                'filterType': 'text'
              };
              this.gridApi.setFilterModel(allFilters);
            }
            else {
              if ((optionsFromMultipleSelect.length === 0 || selectedOCountriesFromWorldMap.length === 0) && (this.selectTag.value.length == 0 || this.selectTag.value === this.actualSelectOptions.length)) {
                this.gridApi.setRowData(this.gridOptions.rowData);
                this.gridApi.setFilterModel(otherColumnFilters);
              }
              else {
                var capsColId = this.colId.toLowerCase().split(' ');
                for (var i = 0; i < capsColId.length; i++) {
                  capsColId[i] = capsColId[i].charAt(0).toUpperCase() + capsColId[i].substring(1);
                }
                capsColId = capsColId.join(' ');
                if (selectedOCountriesFromWorldMap.length) {
                  optionsFromMultipleSelect = selectedOCountriesFromWorldMap;
                }
                returnedFilteredData = this.getFilteredData(this.gridOptions.rowData, capsColId);
                returnedFilteredData = returnedFilteredData.filter(m => { return m });
                var obj = {};
                for (var i = 0, len = returnedFilteredData.length; i < len; i++)
                  obj[returnedFilteredData[i]['sourceId']] = returnedFilteredData[i];

                returnedFilteredData = new Array();
                for (var key in obj)
                  returnedFilteredData.push(obj[key]);
                this.mainFilteredData = returnedFilteredData;
                this.gridApi.setRowData(returnedFilteredData);
                this.gridApi.setFilterModel(otherColumnFilters);
              }
              var otherColumnFilters = this.gridApi.getFilterModel();

              var capsColId = this.colId.toLowerCase().split(' ');
              for (var i = 0; i < capsColId.length; i++) {
                capsColId[i] = capsColId[i].charAt(0).toUpperCase() + capsColId[i].substring(1);
              }
              capsColId = capsColId.join(' ');
              if (selectedOCountriesFromWorldMap.length) {
                optionsFromMultipleSelect = selectedOCountriesFromWorldMap;
              }
              returnedFilteredData = this.getFilteredData(this.gridOptions.rowData, capsColId);
              returnedFilteredData = returnedFilteredData.filter(m => { return m });
              var obj = {};
              for (var i = 0, len = returnedFilteredData.length; i < len; i++)
                obj[returnedFilteredData[i]['sourceId']] = returnedFilteredData[i];

              returnedFilteredData = new Array();
              for (var key in obj)
                returnedFilteredData.push(obj[key]);
              this.mainFilteredData = returnedFilteredData;
              this.gridApi.setRowData(returnedFilteredData);
              this.gridApi.setFilterModel(otherColumnFilters);
            }
          }
        }
      }
    }
  }

  getFilteredData(data, capsColId) {
    var returndata = [];
    var filteredList = [];
    optionsFromMultipleSelect.sort((a, b) => {
      if (a && a.colId) {
        var nameA = a.colId.toLowerCase(), nameB = b.colId.toLowerCase();
        if (nameA < nameB)
          return -1
        if (nameA > nameB)
          return 1
        return 0
      }
    })
    for (let index = 0; index < optionsFromMultipleSelect.length; index++) {
      const element = optionsFromMultipleSelect[index];
      if (index == 0) {
        filteredList.push(element.colId)
      }
      var capsColId2 = element['colId'].toLowerCase().split(' ');
      for (var i = 0; i < capsColId2.length; i++) {
        capsColId2[i] = capsColId2[i].charAt(0).toUpperCase() + capsColId2[i].substring(1);
      }
      if (filteredList.indexOf(element.colId) !== -1) {
        if (element.colId == 'jurisdiction') {
          var tempFilterdata = data.filter((val) => {
            var innerFilter = val[capsColId2].filter((v) => {
              return (element.value == v.values.jurisdictionOriginalName)
            })
            if (innerFilter.length) {
              return val
            }
          })
        } else {
          var tempFilterdata = data.filter((val) => {
            return (element.value == val[capsColId2])
          });
        }
        returndata = returndata.concat(tempFilterdata);
      } else {
        var tempFilterdata1 = []
        var tempreturn = [];
        if (element.colId == 'jurisdiction') {
          tempFilterdata1 = returndata.filter((val) => {
            var innerFilter = val[capsColId2].filter((v) => {
              return (element.value == v.values.jurisdictionOriginalName)
            })
            if (innerFilter.length) {
              return val
            }
          })
        } else {
          tempFilterdata1 = returndata.filter((val) => {
            return (element.value == val[capsColId2])
          });
        }
        returndata = tempreturn.concat(tempFilterdata1);
      }
    }
    return returndata;
  }

  /**Getting current table row data
  * Author : karnakar
  * Date:31-July-2019
 */
  getCurrentTableRowData() {
    var currentRowData = [];
    var count = this.gridApi.getDisplayedRowCount();
    for (var i = 0; i < count; i++) {
      var rowNode = this.gridApi.getDisplayedRowAtIndex(i);
      currentRowData.push(rowNode.data);
    }
    return currentRowData;
  }

  onRemoveFilter(event: Event) {
    this.defaultSelectedOptions = []
    event.stopPropagation();
    this.sharedService.resetFilters(this.gridApi, this.colId)
  }

  public trackByLabel(_, item): string {
    return item.label;
  }

  getSelectedLabel() : string{
    if(this.selectOptions.length == (this.defaultSelectedOptions.length -1)) return "Select all"

    const labels:any[] = []
    this.defaultSelectedOptions.filter((id:any) => {
      this.selectOptions.map((option:any) => {
        if(option.listItemId == id) labels.push(option.label)
      })
    })
    return labels.join(",")
  }
}
