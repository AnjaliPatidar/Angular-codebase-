import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logon-failure-renderer',
  templateUrl: './logon-failure-renderer.component.html',
  styleUrls: ['./logon-failure-renderer.component.scss']
})
export class LogonFailureRendererComponent implements OnInit {
  public params: any;
  public gridApi: any;
  public currentRowData: any;
  public className: string;
  constructor() { }

  ngOnInit() {
  }
  agInit(params: any, event): void {
    if (params) {
      this.params = params;
      this.gridApi = params.api;
      this.currentRowData = params && params.data ? params.data : {};
      this.className = params.colDef.class;
    }
  }
}
