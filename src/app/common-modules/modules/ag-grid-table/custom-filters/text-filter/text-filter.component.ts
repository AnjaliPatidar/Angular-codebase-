import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { Component } from '@angular/core';
import { GridApi, IFloatingFilterParams } from 'ag-grid-community';
import { IFloatingTextFilterParams } from './models/floating-text-filter-params.model';

@Component({
  selector: 'app-text-filter',
  templateUrl: './text-filter.component.html',
  styleUrls: ['./text-filter.component.scss']
})
export class TextFilterComponent {
  public currentValue: number | string = null;
  private gridApi: GridApi;
  private colId: string;
  public placeholder = 'Filter';

  constructor(private readonly sharedService: SharedServicesService) {}

  public agInit(params: IFloatingTextFilterParams & IFloatingFilterParams<any, any>): void {
    this.colId = params.colId || '';
    this.gridApi = params.api;

    const filterModel = this.gridApi.getFilterModel();
    if (this.currentValue === null && filterModel) {
      this.currentValue = filterModel[this.colId] && filterModel[this.colId].filter;
    }

    if (this.colId === 'FileName') {
      this.placeholder = 'Search';
    }
  }

  public filterInput(): void {
    const filters = this.gridApi.getFilterModel();

    if (this.colId === 'ID') {
      filters[this.colId] = {
        filter: this.currentValue,
        type: 'contains',
        filterType: 'number'
      };
    }

    if (this.colId === 'size' || this.colId === 'fileID') {
      filters[this.colId] = {
        filter: this.currentValue,
        type: 'contains',
        filterType: 'text'
      };
    } else if (this.colId === 'group_id') {
      filters[this.colId] = {
        filter: this.currentValue,
        type: 'equals',
        filterType: 'text'
      };
    } else if (this.colId) {
      filters[this.colId] = {
        filter: this.currentValue,
        type: 'contains',
        filterType: 'text'
      };
    }

    this.gridApi.setFilterModel(filters);
  }

  public onRemoveFilter(): void {
    this.sharedService.resetFilters(this.gridApi, this.colId);
  }
}
