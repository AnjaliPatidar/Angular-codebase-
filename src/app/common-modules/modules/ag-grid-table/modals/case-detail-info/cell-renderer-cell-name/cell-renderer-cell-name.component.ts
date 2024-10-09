import { Component } from '@angular/core';

@Component({
    templateUrl: 'cell-renderer-cell-name.component.html'
})
export class CaseManagementCaseCellRendererCellNameComponent {
    public value: string;
    public hasTooltip: boolean;
    agInit(params: any): void {
        this.hasTooltip = params && params.data && params.data.entity_url;
        this.value = params.value;
    }
}