import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AlertManagementService } from '@app/modules/alert-management/alert-management.service';

export interface User {
  label: string;
}
@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss']
})

export class AutoCompleteComponent {
  constructor(private _alertService: AlertManagementService) { }
  public feedObjToSend: any;
  public rendererObject: any = {}
  myControl = new FormControl();
  options: User[];

  filteredOptions: Observable<User[]>;
  ngOnInit() {
  }
  displayFn(user?: User): string | undefined {
    return user ? user.label : undefined;
  }
  private _filter(label: string): User[] {
    const filterValue = label.toLowerCase();
    return this.options.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
  }
  /**agInit() will call for every row of column */
  agInit(params: any, event): void {
    this.rendererObject = {
      gridOpions: params.api ? params.api : {},
      colId: (params.colDef && params.colDef.colId) ? params.colDef.colId : '',
      rowId: params.rowIndex ? params.rowIndex : '',
      selectBoxListData: (params.value && params.value.value) ? params.value.value : [],
      className: (params.colDef && params.colDef.class) ? params.colDef.class : ''
    }
    var rowNode = params.api.getDisplayedRowAtIndex(params.rowIndex);
    this.feedObjToSend = params.data["Group Level"].value.map((val) => {
      if (val.label == params.data["Group Level"].key) {
        return val.values;
      }
    }).filter((element) => { return element })[0];
    this.myControl.setValue({ label: rowNode.data["Assignee"].key });
    this.options = [];
    this.options = rowNode.data["Assignee"].value;

    this.createOptions(this.options);
    //
    // this._alertService.getUsersListByGroups(this.feedObjToSend.groupId.id).subscribe(resp => {
    //
    //   rowNode.data["Assignee"].value = [];
    //   resp.result.map(userName => {
    //     rowNode.data["Assignee"].value.push({ 'label': userName.screenName, disable: false, "values": userName });
    //   })

    //   // params.api.redrawRows({ rowNodes: [rowNode] });
    // });
  }
/* @purpose: To create Option dropdown in Assignee.
* @created: 27 oct , 2019
* @returns:  None
* @author:Amritesh*/
  createOptions(values) {
    if (values && values.length) {
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.label),
          map(label => label ? this._filter(label) : values.slice())
        );
    }
  }
  /* @purpose: To get selected value of Assignee.
* @created: 27 oct , 2019
* @returns:  None
* @author:Amritesh*/
  getSelectedValueInAssignee(valueSelected) {

    var rowNode = this.rendererObject.gridOpions.getDisplayedRowAtIndex(this.rendererObject.rowId);

    var paramsData = {};
    paramsData['alertId'] = rowNode.data['alertId'];
    paramsData["asignee"] = valueSelected.values;
    this._alertService.saveOrUpdateAlerts([paramsData],'').subscribe((response) => {


    })
  }
  getAssigneeData(e, ele) {

    var rowNode = this.rendererObject.gridOpions.getDisplayedRowAtIndex(this.rendererObject.rowId);

    var groupObjToSend = rowNode.data["Group Level"].value.map((val) => {
      if (val.label == rowNode.data["Group Level"].key) {
        return val.values
      }
    }).filter((element) => { return element })[0];
    this._alertService.getUsersListByGroups(groupObjToSend.groupId.id).subscribe(resp => {

      rowNode.data["Assignee"].key = "UnAssigned";
      rowNode.data["Assignee"].value = [];
      resp.result.map(userName => {
        rowNode.data["Assignee"].value.push({ 'label': userName.screenName, disable: false, "values": userName });
      })
      rowNode.data["Assignee"].value.unshift({ 'label': "Unassigned", disable: false, "values": {} })
      // if (Object.keys(rowNode.data).indexOf('checkTrueAssignee') == -1) {
        // this.rendererObject.gridOpions.redrawRows({ rowNodes: [rowNode] });
        this.options = [];
        this.options = rowNode.data["Assignee"].value;
        this.createOptions(this.options);
        rowNode.setData(rowNode.data);
        // rowNode.data["checkTrueAssignee"] = false;
      // }

      // rowNode.setData(rowNode.data);
      // this.gridApi.refreshCells({ rowNodes: [rowNode] })
    })

  }

  public trackByLabel(_, item): string {
    return item.label;
  }
}
