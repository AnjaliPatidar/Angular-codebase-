import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { GridApi, IFloatingFilterParams } from 'ag-grid-community';

@Component({
  selector: 'app-indicator-filter',
  templateUrl: './indicator-filter.component.html',
  styleUrls: ['./indicator-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IndicatorFilterComponent {
  @ViewChild('mySel', { static: false }) public readonly selectTag: MatSelect;

  public readonly myFormControl: FormControl = new FormControl();
  public readonly selectOptions: IndicatorListItemOption[] = [
    { listItemId: 'high', label: this.translateService.instant('High'), color: '#ef5350' },
    { listItemId: 'medium', label: this.translateService.instant('Medium'), color: '#9c27b0' },
    { listItemId: 'low', label: this.translateService.instant('Low'), color: '#26a69a' }
  ];

  private gridApi: GridApi;
  private allSelected = false;

  constructor(private readonly translateService: TranslateService) {}

  public agInit(params: IFloatingFilterParams<any, any>): void {
    this.gridApi = params.api;
  }

  public toggleAllSelection(): void {
    let allTrue = true;
    this.selectTag.options.forEach((item: MatOption) => {
      if (item.value === 'all' && !item.selected) {
        allTrue = false;
        return;
      }
    });
    this.allSelected = allTrue;
    this.selectTag.options.forEach((item: MatOption) => {
      this.allSelected ? item.select() : item.deselect();
    });
  }

  public adjustSelections(): void {
    let allTrue = true;
    let allItem;
    this.selectTag.options.forEach((item: MatOption) => {
      if (item.value !== 'all') {
        if (!item.selected) {
          allTrue = false;
          return;
        }
      } else {
        allItem = item;
      }
    });
    if (allItem) {
      allTrue ? allItem.select() : allItem.deselect();
    }
  }

  public cancelFilters(): void {
    this.selectTag.value = [];
    this.allSelected = false;
    this.selectTag.close();
  }

  public applyFilters(): void {
    const allFilters = this.gridApi.getFilterModel();
    if (this.selectTag.value.indexOf('all') !== -1) {
      this.selectTag.value.shift();
    }
    allFilters.riskIndicators = {
      filter: this.selectTag.value ? this.selectTag.value.join('#') : '',
      type: 'multiSelectString',
      filterType: 'text'
    };
    this.gridApi.setFilterModel(allFilters);
    this.selectTag.close();
  }

  public trackByListItemId(_: number, item: IndicatorListItemOption): string {
    return item.listItemId;
  }
}

interface IndicatorListItemOption {
  listItemId: string;
  label: string;
  color: string;
}
