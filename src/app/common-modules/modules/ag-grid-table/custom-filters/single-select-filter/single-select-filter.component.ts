import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { Component, Input } from '@angular/core';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { AgGridTableService } from '../../ag-grid-table.service';
import { GridApi, GridOptions, IFloatingFilterParams } from 'ag-grid-community';
import {
  IBaseSelectFilterListOption,
  IFloatingSingleFilterParams,
  IUsersSelectFilterList
} from './models/floating-single-select-filter-params.model';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-single-select-filter',
  templateUrl: './single-select-filter.component.html',
  styleUrls: ['./single-select-filter.component.scss']
})
export class SingleSelectFilterComponent {
  @Input() disableOptionCentering: boolean;
  @Input() searching = true;
  @Input() clearSearchInput = true;
  @Input() placeholderLabel = GlobalConstants.languageJson.Search || 'Search';

  public gridApi: GridApi;
  public colId: string;
  public selectOptions: IBaseSelectFilterListOption[];
  public actualSelectOptions: IBaseSelectFilterListOption[];
  public singleSelectModel: string;
  // TODO
  public selectedFlag: any = {};
  public tableName: string;

  private gridOptions: GridOptions & {
    tableName: string;
  };

  constructor(private agGridTableService: AgGridTableService, private sharedService: SharedServicesService) {}

  public changeScroll(): void {
    $('.mat-select-search-panel').addClass('custom-scroll-wrapper');
    $('.mat-select-search-panel').css({ overflow: 'hidden' });
    setTimeout(() => {
      $('.mat-select-search-panel').css({ overflow: 'auto' });
    }, 100);
  }

  public agInit(params: IFloatingSingleFilterParams & IFloatingFilterParams<any, any>): void {
    this.gridApi = params.api;
    this.colId = params.colId;
    this.selectOptions = params.options || [];
    this.actualSelectOptions = JSON.parse(JSON.stringify(this.selectOptions));
    this.gridOptions = this.gridApi['gridOptionsWrapper'].gridOptions;
    this.tableName = this.gridOptions.tableName || '';

    // TODO this can be probably moved outside
    if (this.colId === 'relation_type' || this.colId === 'caseBusinessPriority') {
      this.selectOptions = this.selectOptions.map((item: any) => {
        return { value: item.listItemId.toString(), label: item.displayName };
      });

      this.actualSelectOptions = this.selectOptions;
      this.selectOptions.unshift({ value: '', label: 'All' });
    }

    if (this.tableName === 'Related Cases view' && ['risk', 'priorityRC','priority' , 'type', 'assignee', 'status'].includes(this.colId)) {
      if (this.colId === 'assignee') {
        this.selectOptions = params.options.map((item: IUsersSelectFilterList) => ({ value: item.userId, label: item.label }));
      } else if (this.colId === 'status') {
        this.selectOptions = params.options.map((item: IBaseSelectFilterListOption) => ({ value: item.code, label: item.label }));
      } else {
        this.selectOptions = params.options.map((item: IBaseSelectFilterListOption) => ({ value: item.listItemId, label: item.code }));
      }
      this.selectOptions.unshift({ value: 'All', label: 'All' });
      this.actualSelectOptions = JSON.parse(JSON.stringify(this.selectOptions));
    }

    if (this.gridApi.getFilterModel() && this.gridApi.getFilterModel()[params.colId]) {
      const value = this.gridApi.getFilterModel()[params.colId].filter;

      if (this.tableName !== 'Feed list view') {
        this.singleSelectModel = value;
      } else {
        const found = this.selectOptions.find(
          (element) => element.label === value || element.label === value.charAt(0).toUpperCase() + value.slice(1)
        );
        this.singleSelectModel = found && found.label ? found.label : '';
      }
    }
  }

  public selectItem(event: MatSelectChange): void {
    const assignFilter = this.gridApi.getFilterModel();
    let filters = this.gridApi.getFilterModel();
    const selectedValue = event.value;

    if (event) {
      if (this.colId === 'region_uplift') {
        this.selectedFlag = event.value;
      }
      if (this.colId === 'counterPartyLocation') {
        this.selectedFlag = this.selectOptions.find((el) => el.value === event.value);
      }
      if (assignFilter['feed name']) {
        filters = assignFilter;
      }
      if ((event.value && event.value === 'All') || (event.value && event.value.label === 'All')) {
        delete filters[this.colId];

        this.gridApi.setFilterModel(filters);
        if (this.colId === 'status') {
          this.agGridTableService.statusFilterKey = '';
        }
      } else {
        if (this.colId === 'region_uplift') {
          filters[this.colId] = {
            filter: event.value.value,
            type: 'equals',
            filterType: 'text'
          };
        } else {
          filters[this.colId] = {
            filter: event.value,
            type: 'equals',
            filterType: 'text'
          };
        }
        if (this.colId === 'status') {
          this.agGridTableService.statusFilterKey = event.value;
          filters[this.colId] = {
            filter: event.value,
            type: 'equals',
            filterType: 'text'
          };
        } else if (this.colId === 'relation_type') {
          filters[this.colId] = {
            filter: event.value,
            type: 'contains',
            filterType: 'text'
          };
        } else if (this.colId === 'priority') {
          filters['priority'] = {
            filter: event.value,
            type: 'in',
            filterType: 'text'
          };
        } else if (this.colId === 'risk') {
          filters['risk'] = {
            filter: event.value,
            type: 'contains',
            filterType: 'text'
          };
        } else if (this.colId === 'priorityRC') {
          filters['priorityRC'] = {
            filter: event.value,
            type: 'contains',
            filterType: 'text'
          };
        } else if (this.colId === 'risk_override') {
          filters['risk_override'] = {
            filter: event.value,
            type: 'equals',
            filterType: 'text'
          };
        } else if (this.colId === 'type') {
          filters['type'] = {
            filter: selectedValue.value,
            type: 'contains',
            filterType: 'text'
          };
        } else if (this.colId === 'caseBusinessPriority') {
          filters['case_business_priority'] = {
            filter: event.value,
            type: 'contains',
            filterType: 'text'
          };
        } else if (this.colId === 'updatedBy' && this.tableName === 'Attachment view') {
          filters[this.colId] = {
            filter: event.value,
            type: 'equals',
            filterType: 'text'
          };
        } else if (this.colId === 'region_uplift') {
          filters[this.colId] = {
            filter: event.value.value,
            type: 'equals',
            filterType: 'text'
          };
        } else if (this.colId === 'assignee' && event.value === 'unassignee') {
          filters[this.colId] = {
            filter: event.value,
            type: 'equals',
            filterType: 'text'
          };
        } else {
          filters[this.colId] = {
            filter: event.value ? (event.value === 'Active' ? 'success' : event.value === 'Failed' ? 'error' : event.value) : '',
            type: 'contains',
            filterType: 'text'
          };
        }
        this.gridApi.setFilterModel(filters);
      }
    }
  }

  public readPieChartSourceMonitoringFunction(): void {
    const valueOClickOfChart: string = document.getElementById(`readPieChartSourceMonitoring_${this.colId}`).getAttribute('data-id');
    this.singleSelectModel = valueOClickOfChart || '';
    const filterObj = { value: valueOClickOfChart || '' };
    // TODO
    this.selectItem(filterObj as any);
  }

  // TODO
  public filterMyOptions(event): void {
    this.selectOptions = event
      ? this.actualSelectOptions.filter((option: IBaseSelectFilterListOption) => {
          // TODO
          if (option.label) {
            return option.label.toLowerCase().indexOf(event.toLowerCase()) !== -1;
          }
        })
      : this.actualSelectOptions;
  }

  public onRemoveFilter(event: Event): void {
    event.stopPropagation();
    this.singleSelectModel = '';
    this.sharedService.resetFilters(this.gridApi, this.colId);
  }

  public isRelatedCasesColumn(columnName: string): boolean {
    const isRelatedCasesColumn =
      this.tableName === 'Related Cases view' && ['risk', 'priorityRC','priority', 'type', 'caseBusinessPriority'].includes(columnName);
    return isRelatedCasesColumn;
  }

  // TODO: use this function after usage formControl instead of ngModel
  public compareWith(option: IBaseSelectFilterListOption, selected: IBaseSelectFilterListOption): boolean {
    const optionValue = option && option.value && option.value.toString();
    const selectedValue = selected && selected.value && selected.value.toString();
    return optionValue === selectedValue;
  }

  public trackByValue(_, option: IBaseSelectFilterListOption): string | number {
    return option.value;
  }
}
