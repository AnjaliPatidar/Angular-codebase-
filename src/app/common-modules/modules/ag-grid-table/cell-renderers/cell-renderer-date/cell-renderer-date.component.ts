import { Component } from '@angular/core';

@Component({
    templateUrl: 'cell-renderer-date.component.html'
})
export class CellRendererDateComponent {
    public value: string;
    public dateFormat: string;
    public isDatePipeFormat: boolean;

    public agInit(params): void {
        this.dateFormat = params.dateFormat;
        this.isDatePipeFormat = params.isDatePipeFormat;
        this.value = params.value;
    }
}
