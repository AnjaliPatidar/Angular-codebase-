import {Component, OnInit, ViewChild, Renderer2} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
var filters = {};
@Component({
  selector: 'app-text-select-filter',
  templateUrl: './text-select-filter.component.html',
  styleUrls: ['./text-select-filter.component.scss']
})
export class TextSelectFilterComponent implements OnInit {

  public gridApi: any;
  public colId: any;
  public enableTextInput: boolean = false;
  public selectOptions: any[] = []
  public selectedOption: any;
  public selectedValue: any;
  public displaySelectedValue: any;
  myFormControl = new FormControl();
  @ViewChild('mySel', { static: false }) selectTag: MatSelect;
  tableName: string
  placeholder = "";
  constructor(private renderer: Renderer2) {
   }

  ngOnInit() {
    this.placeholder = this.placeholder = this.getLanguageKey('Value') ? this.getLanguageKey('Value') : 'Value'
  }

//   changeScroll(){
//     $(".mat-select-search-panel").addClass('custom-scroll-wrapper');
//     $(".mat-select-search-panel").css({'overflow':'hidden'});
//   setTimeout(() => {
//     $(".mat-select-search-panel").css({'overflow':'auto'});
//   }, 100);
// }
  changeScroll() {
    const matSelectSearchPanel = this.renderer.selectRootElement('.mat-select-search-panel');
    this.renderer.addClass(matSelectSearchPanel, 'custom-scroll-wrapper');
    this.renderer.setStyle(matSelectSearchPanel, 'overflow', 'hidden');
    setTimeout(() => {
      this.renderer.setStyle(matSelectSearchPanel, 'overflow', 'auto');
    }, 100);
  }

  agInit(params) {
    this.gridApi = params.api ? params.api : '';
    this.colId = params.colId ? params.colId : '';
    this.tableName = (params.api && params.api.gridOptionsWrapper && params.api.gridOptionsWrapper.gridOptions && params.api.gridOptionsWrapper.gridOptions.tableName) ? params.api.gridOptionsWrapper.gridOptions.tableName : '';
    this.selectOptions = params && params.options ? params.options : []
    if (this.tableName == "Alert list view") {
      if (this.gridApi.getFilterModel() && this.gridApi.getFilterModel()[params.colId]) {
        if(this.colId == 'aging'){
          let filterModel = this.gridApi.getFilterModel()[params.colId]
            this.myFormControl.reset();
            if(filterModel.filter < 24){
              this.displaySelectedValue = filterModel.filter;
              this.selectedValue = filterModel.filter
              this.selectedOption = "Hours"
              this.myFormControl.patchValue(["Hours"])
            }else{
              this.displaySelectedValue = Math.round(filterModel.filter/24);
              this.selectedValue = this.displaySelectedValue
              this.selectedOption = "Days"
              this.myFormControl.patchValue(["Days"])
            }
        }
      }
    }
  }

  applyFilters() {
    const assignFilter = this.gridApi.getFilterModel();
    filters = assignFilter;
    delete filters[this.colId];
    if (this.selectedOption) {
      if (this.colId === 'aging') {
        let hours = 0
        switch(this.selectedOption){
          case "Days":
            hours = this.selectedValue * 24
            break;
          case "Weeks":
            hours = this.selectedValue * 7 * 24
            break;
          case "Months":
            hours = this.selectedValue * 30 * 24
            break;
          case "Years":
            hours = this.selectedValue * 365 * 24
            break;
          case "Hours":
              hours = this.selectedValue
              break;
          }
        this.displaySelectedValue = this.selectedValue
        filters[this.colId] = {
          'filter': hours,
          'type': 'greaterThan',
          'filterType': 'number'
        }
      }
    }
    this.gridApi.setFilterModel(filters);
  }

  optionSelections(selection){
    this.myFormControl.reset();
    if(this.selectedOption && this.selectedOption === selection){
      this.selectedValue = null;
      this.selectedOption = null;
      this.displaySelectedValue = null;
    }else{
      this.myFormControl.patchValue([selection])
      this.selectedValue = this.selectedValue || 1
      this.selectedOption = this.myFormControl.value[0]
    }
  this.placeholder = this.selectedOption ?( this.getLanguageKey('EnterNumberOf') ? this.getLanguageKey('EnterNumberOf') : 'Enter Number Of ')
  .concat(this.getLanguageKey(this.selectedOption) ? this.getLanguageKey(this.selectedOption) : this.selectedOption) :
  this.getLanguageKey('Value') ? this.getLanguageKey('Value') : 'Value'

}

  cancelFilters(){
    this.myFormControl.reset();
    this.selectedOption = null;
    this.selectedValue = null;
    this.displaySelectedValue = this.selectedValue
    this.applyFilters();
    this.selectTag.close()
    this.placeholder = this.getLanguageKey('Value') ? this.getLanguageKey('Value') : 'Value'
  }

  roundToInteger(){
    this.selectedValue = this.selectedValue ? this.selectedValue.toFixed(0) : null
  }

  getLanguageKey(text) {
    var langKey = text;
    if (GlobalConstants.languageJson) {
      langKey = GlobalConstants.languageJson[text];
    }
    return langKey;
  }

  public trackByItem(_, item): string {
    return item;
  }
}
