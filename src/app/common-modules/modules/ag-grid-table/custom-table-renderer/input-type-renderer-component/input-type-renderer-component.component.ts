import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-type-renderer-component',
  templateUrl: './input-type-renderer-component.component.html',
  styleUrls: ['./input-type-renderer-component.component.scss']
})
export class InputTypeRendererComponentComponent implements OnInit {
  public inputValue: any = '';
  constructor() { }

  ngOnInit() {
  }

  /** agInit() will call for every row of column */
  agInit(params: any, event): void {
    this.inputValue = params.value ? params.value : '';
  }
}
