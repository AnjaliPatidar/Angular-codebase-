import { SelectedRowNode } from './../../../../../shared/model/selected-row-node';
import { CaseManagementService } from '@app/modules/case-management/case-management.service';
import { Component } from '@angular/core';
import { GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-custom-header-column',
  templateUrl: './custom-header-column.component.html',
  styleUrls: ['./custom-header-column.component.scss']
})
export class CustomHeaderColumnComponent {

  params: any;
  gridApi: GridApi;
  isAllChecked:boolean;
  isIndeterminateChecked:boolean;

  constructor(private _caseManagementService: CaseManagementService) { }
  agInit(params): void {
    if(params){
      this.params = params;
      this.gridApi = params.api ? params.api : null;
      this.callSelectListener();
    }
  }

  // @reason : Listen each change event when user click on checkbox
  // @params : none
  // @author : ammshathwan
  // @date: 27 mar 2023
  callSelectListener():void{
    this._caseManagementService.getCurrentSelectRowCountObserver.subscribe((selectedNode:SelectedRowNode) => {
      if(selectedNode && selectedNode.tableName == this.params.tableName){
        this.onSelectionChanged(selectedNode.selectedCount)
      }else{
        this.onAllUnSelectClicked
      }
    })
  }

  // @reason : select all checkbox if select all is clicked
  // @params : none
  // @author : ammshathwan
  // @date: 27 mar 2023
  onAllSelectClicked():void{
    this.isAllChecked = true;
    this.isIndeterminateChecked = false;
    this.isIndeterminateChecked = false;
    this._caseManagementService.emitHeaderSelection.next(true);
  }

  // @reason : un select all checkbox if select all is clicked
  // @params : none
  // @author : ammshathwan
  // @date: 27 mar 2023
  onAllUnSelectClicked():void{
    this.isAllChecked = false;
    this.isIndeterminateChecked = false
    this._caseManagementService.emitHeaderSelection.next(false);
  }

  // @reason : once row checkbox is update trigger event in header component
  // @params : selectedCount : number
  // @author : ammshathwan
  // @date: 27 mar 2023
  onSelectionChanged(selectedCount:number):void{
    const allRowNodes:any[] = [];
    this.gridApi.forEachNode((row) => {
      if (row && row.id) {
        allRowNodes.push(this.gridApi.getRowNode(row.id))
      }
    });
    if(!selectedCount){
      this.onAllUnSelectClicked();
    }else if(selectedCount !== allRowNodes.length){
      this.isIndeterminateChecked = true;
    }else{
      this.onAllSelectClicked()
    }
  }

}
