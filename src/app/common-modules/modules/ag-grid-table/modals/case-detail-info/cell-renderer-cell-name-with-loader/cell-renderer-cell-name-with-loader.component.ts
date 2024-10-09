import { CaseManagementService } from '@app/modules/case-management/case-management.service';
import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';

interface ICellNameCellRendererParams extends ICellRendererParams {
    value: string
}
@Component({
    templateUrl: 'cell-renderer-cell-name-with-loader.component.html',
    styleUrls: ['cell-renderer-cell-name-with-loader.component.scss']
})
export class CaseManagementCaseCellRendererCellNameWithLoaderComponent {
    public value: string;
    public tooltip: string;

    public isLoading = false;

    constructor(private caseManagementService:CaseManagementService){}

    agInit(params: {tooltip: string} & ICellNameCellRendererParams): void {
        this.tooltip = params.tooltip;
        this.value = params.value;
        this.listenerForCellClickEvent()
    }

    public isLoaderShown() {
        return this.isLoading;
    }

    public showLoader() {
        this.isLoading = true;
    }

    public hideLoader() {
        this.isLoading = false;
    }

    public listenerForCellClickEvent(){
      this.caseManagementService.isAssociatedEntityObserver.subscribe((isClicked:Boolean) => {
        isClicked ? this.showLoader() : this.hideLoader();
      })
    }
}
