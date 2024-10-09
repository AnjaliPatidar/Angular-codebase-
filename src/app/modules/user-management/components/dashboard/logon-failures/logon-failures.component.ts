import { Component, OnInit } from '@angular/core';
import { LogonFailures } from '@app/modules/user-management/constants/ag-grid/user-table.constants';
import { MatDialogRef } from '@angular/material/dialog';
import { LogonFailureRendererComponent } from './logon-failure-renderer/logon-failure-renderer.component'
@Component({
  selector: 'app-logon-failures',
  templateUrl: './logon-failures.component.html',
  styleUrls: ['./logon-failures.component.scss']
})
export class LogonFailuresComponent implements OnInit {
public columnDefs;
public gridOptions;
public rowData = [];
  constructor(
    public dialogRef: MatDialogRef<LogonFailuresComponent>,
  ) { }

  ngOnInit() {
    this.agInit()
  }
  agInit() {


    this.columnDefs = [
      {
        'headerName': LogonFailures.fullName.headerName,
        'field': LogonFailures.fullName.field,
        'colId': LogonFailures.fullName.colId,
        'width': 180,
        'filter': true,
        'sort': 'asc',

        'class': "fullName",
        'cellRendererFramework': LogonFailureRendererComponent,


      },
      {
        'headerName': LogonFailures.userName.headerName,
        'field': LogonFailures.userName.field,
        'colId': LogonFailures.userName.colId,
        'width': 180,
        'filter': true,
        'sort': 'asc',

        'class': "userName",
        'cellRendererFramework': LogonFailureRendererComponent,
      },
      {
        'headerName': LogonFailures.userStatus.headerName,
        'field': LogonFailures.userStatus.field,
        'colId': LogonFailures.userStatus.colId,
        'width': 180,
        'filter': true,
        'sort': 'asc',

        'class': "userStatus",
        'cellRendererFramework': LogonFailureRendererComponent,
      },
      {
        'headerName': LogonFailures.logonTime.headerName,
        'field': LogonFailures.logonTime.field,
        'colId': LogonFailures.logonTime.colId,
        'width': 180,
        'filter': true,
        'sort': 'asc',

        'class': "logonTime",
        'cellRendererFramework': LogonFailureRendererComponent,
      },
      {
        'headerName': LogonFailures.numberOfLogons.headerName,
        'field': LogonFailures.numberOfLogons.field,
        'colId': LogonFailures.numberOfLogons.colId,
        'width': 180,
        'filter': true,
        'sort': 'asc',

        'class': "numberOfLogons",
        'cellRendererFramework': LogonFailureRendererComponent,
      },
      {
        'headerName': LogonFailures.LogonFailures.headerName,
        'field': LogonFailures.LogonFailures.field,
        'colId': LogonFailures.LogonFailures.colId,
        'width': 180,
        'filter': true,
        'sort': 'asc',

        'class': "logonFailures",
        'cellRendererFramework': LogonFailureRendererComponent,
      }


    ]


    this.gridOptions = {
      'resizable': true,
      'tableName': 'logOnFaiures',
      'columnDefs': this.columnDefs,
      'rowData': [],
      'rowStyle': { 'border-bottom': '#424242 1px solid' },
      'rowSelection': 'multiple',
      'floatingFilter': true,
      'animateRows': true,
      'sortable': true,
      'tabs': false,
      'isShoHideColumns': true,
      'multiSortKey': 'ctrl',
      'cellClass': 'ws-normal',
      'rowModelType': 'infinite',
      'cacheBlockSize': 10,
      'paginationPageSize': 10,
      'pagination': true,
      //'enableTableViews': true,
      // 'this': this.componentThis,
      // 'instance': this.userService,
      // 'method': "getUsersList",
       //'dataModifier': "formatUserData",
      // "enableServerSideFilter": true,
      // "enableServerSideSorting": true,
      'filter': true,
      'rowHeight': 53,
      //'csvExportParams': this.params
    }
    this.getAllLogonFailureData();
  }
  getAllLogonFailureData() {
    // response.result.forEach(ele => {
      let LogonFailure = {};
      LogonFailure[LogonFailures.fullName.field] = 'admin';
      LogonFailure[LogonFailures.userName.field] =  'admin123';
      LogonFailure[LogonFailures.userStatus.field] = 'active';
      LogonFailure[LogonFailures.logonTime.field] = 'jan1,2020';
      LogonFailure[LogonFailures.numberOfLogons.field] =  'N/A';
      LogonFailure[LogonFailures.LogonFailures.field] =  'dewd';
      this.rowData.push(LogonFailure)
    // });
    this.gridOptions.rowData = this.rowData;
  }
}
