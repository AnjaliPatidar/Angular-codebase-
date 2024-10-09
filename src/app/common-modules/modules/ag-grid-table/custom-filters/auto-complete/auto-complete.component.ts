import { Component } from '@angular/core';
import { UserService } from '@app/modules/user-management/services/user.service';
import { UserConstant } from '@app/modules/user-management/constants/ag-grid/user-table.constants';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { GridApi, IFloatingFilterParams } from 'ag-grid-community';
import { IFloatingAutoCompleteFilterParams } from './models/floating-auto-complete-filter-params.model';
import { AutoCompleteListOption } from './models/auto-complete-list-option';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss']
})
export class AutoCompleteComponent {
  public placeholderLabel: string =
    GlobalConstants.languageJson && GlobalConstants.languageJson.Search ? GlobalConstants.languageJson.Search : 'Search';
  public options: AutoCompleteListOption[] = [];
  public selectedOption: AutoCompleteListOption;

  private rowModelType: string;
  private gridApi: GridApi;
  private colId: string;

  constructor(private readonly userService: UserService) {}

  public agInit(params: IFloatingAutoCompleteFilterParams & IFloatingFilterParams<any, any>): void {
    this.rowModelType = params.api['gridOptionsWrapper'].gridOptions.rowModelType;
    this.gridApi = params.api;
    this.colId = params.colId;
    if (UserConstant.autocompleteFilter) {
      this.options.push(UserConstant.autocompleteFilter[this.colId]);
      this.selectedOption = UserConstant.autocompleteFilter[this.colId].key;
    }
  }

  public search(event: string): void {
    if (event.length > 0) {
      const params = {
        isScreeNameRequired: false,
        searchKey: event
      };
      this.userService
        .getUserWithName(params)
        .then((response: any) => {
          setTimeout(() => {
            this.options = [];
          }, 0);
          response.data.forEach((element) => {
            const middleName = element.middleName || '';
            setTimeout(() => {
              this.options.push({
                key: element.userId,
                value: `${element.firstName} ${middleName} ${element.lastName}`
              });
            }, 0);
          });
          setTimeout(() => {
            this.options = [...this.options];
          }, 0);
        })
        .catch(() => {
          this.options = [];
        });
    }
  }

  public selectOption(option: AutoCompleteListOption): void {
    this.options = [option];
    if (UserConstant.autocompleteFilter) {
      UserConstant.autocompleteFilter[this.colId] = option;
    } else {
      UserConstant.autocompleteFilter = [];
      UserConstant.autocompleteFilter[this.colId] = option;
    }
    const allFilters = this.gridApi.getFilterModel();
    if (this.rowModelType === 'infinite') {
      allFilters[this.colId] = {
        filter: option.key,
        type: 'multiSelect',
        filterType: 'text'
      };
      this.gridApi.setFilterModel(allFilters);
    }
  }

  public trackByKey(_: number, item: AutoCompleteListOption): string {
    return item.key;
  }
}
