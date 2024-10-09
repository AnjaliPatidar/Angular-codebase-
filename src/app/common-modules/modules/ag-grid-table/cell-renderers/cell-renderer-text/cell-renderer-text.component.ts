import {Component} from '@angular/core';

@Component({
  templateUrl: 'cell-renderer-text.component.html'
})
export class CellRendererTextComponent {
  public value: string;
  public isNumber:boolean;

  public agInit(params): void {
    this.value = params.value;
    this.isNumber = typeof this.value == 'number';
  }
}
