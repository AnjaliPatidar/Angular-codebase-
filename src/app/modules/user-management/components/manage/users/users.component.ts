import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserActionsComponent } from './actions/user-actions/user-actions.component';
import { Router } from '@angular/router';

/*Constants*/
import { UserConstant } from '../../../constants/ag-grid/user-table.constants';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
/*Constants*/

/*services*/
import { UserService } from '@app/modules/user-management/services/user.service';
import { ObserverService } from '@app/modules/user-management/services/observer.service';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
/*services*/

/*pipes*/
import { UserTableRendererComponent } from './user-table-renderer/user-table-renderer.component';
import { UtilitiesService } from '@app/modules/user-management/services/utilities/utilities.service';
import { UserCreateComponent } from './modals/user-create/user-create.component';
import { AppConstants } from '@app/app.constant';
import { AddUserGroupComponent } from './modals/add-user-group/add-user-group.component';
import { RolesService } from '@app/modules/user-management/services/roles/roles.service';
import { GroupsService } from '@app/modules/user-management/services/groups.service';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, from, iif, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateTranslatedPipe } from '@app/common-modules/pipes/date-translated/date-translated.pipe';
import { CellRendererDateComponent } from '@app/common-modules/modules/ag-grid-table/cell-renderers/cell-renderer-date/cell-renderer-date.component';
import * as moment from 'moment';
import { AgGridEvent } from 'ag-grid-community';
/*pipes*/



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public showPanel: boolean = false;
  public roleDetails: any = [];
  public groupDetails: any = {};
  public componentThis: any = this;
  public statusFilterOptions: Array<any> = []
  public showTable: boolean = false;
  public showExport: boolean = false;
  public roleName;
  public columnDefs;
  public systemSettings: any;
  public gridOptions;
  public adduser : boolean;
  public roles: Array<any> = [];
  // public groups: Array<any> = [];
  public activeStatusId: any;
  @Input() assignedUsers: string = '';
  @Input() addUsersTable: boolean = false;

  private onGridReady$ = new Subject<AgGridEvent>();
  groupName: any;
  constructor(
    private rolesService: RolesService,
    public userService: UserService,
    public observerService: ObserverService,
    public router: Router,
    private utilitiesService: UtilitiesService,
    public dialog: MatDialog,
    private _sharedService: SharedServicesService,
    public groupsService: GroupsService,
    private commonService : CommonServicesService,
    private translateService: TranslateService
  ) { }
  public presentDate = new Date();
  public rowData: any = [];
  public quickSearchUser: any;

  params: any = {
    url: AppConstants.Ehub_Rest_API + "usersNew/getUsersCSV",
    skipHeader: false,
    columnGroups: true,
    skipFooters: true,
    skipGroups: true,
    skipPinnedTop: true,
    skipPinnedBottom: true,
    allColumns: true,
    fileName: 'users-' + this.presentDate.getDate() + "-" + (this.presentDate.getMonth()+1) + "-" + this.presentDate.getFullYear(),
    sheetName: 1,
    columnSeparator: ",",
    columnKeys: ['alertId', 'customerId', 'watchlist', 'entityName', 'ConfidenceLevel', 'createdAt', 'feed', "group level", 'assignee', 'status'],
    processCellCallback: function (params) {
      if (params.column.colId == "group level" || params.column.colId == "assignee" || params.column.colId == "status") {
        return params.value.key
      } else {
        return params.value;
      }
    },
    processHeaderCallback: function (params) {
      return params.column.getColDef().headerName.toUpperCase();
    }

  }


  ngOnInit() {
    combineLatest([this.onGridReady$, this.groupsService.getAllGroups$()]).subscribe(([params, groups]) => {
      const columnDefs = params.columnApi.getAllColumns().map(col => col.getColDef());
      const groupsColumn = columnDefs.find(cd => cd.colId === UserConstant.groups.colId);
      groupsColumn.floatingFilterComponentParams = {
        ...groupsColumn.floatingFilterComponentParams,
        options: groups.map(group => {
          return {
            listItemId: group.id,
            label: group.name,
          }
        })
      }
      params.api.setColumnDefs(columnDefs);

      if (this.router.routerState.snapshot.url.split("/")[5] != "assigned-users") {
        UserConstant.filterData = [];
        UserConstant.filterData[UserConstant.status.colId] = {
          'filter': this.activeStatusId,
          'type': 'multiSelect',
          'filterType': 'text'
        }
      } else if (this.assignedUsers == "FromRoles") {
        UserConstant.filterData = [];
        let rolId;
        this.roles.forEach((rol) => {
          if (rol.label == this.roleName) {
            rolId = rol.listItemId.toString();
          }
        })
        UserConstant.filterData[UserConstant.roles.colId] = {
          'filter': rolId ? rolId : this.roleDetails['roleId'],
          'type': 'multiSelect',
          'filterType': 'text'
        }
      } else if (this.assignedUsers == "FromGroups") {
        UserConstant.filterData = [];
        let groupId;
        groupsColumn.floatingFilterComponentParams.options.forEach((rol) => {
          if (rol.label == this.groupName) {
            groupId = rol.listItemId.toString();
          }
        })
        UserConstant.filterData[UserConstant.groups.colId] = {
          'filter': groupId ? groupId : this.groupDetails['groupId'],
          'type': 'multiSelect',
          'filterType': 'text'
        }
      }

    })

    this.systemSettings = GlobalConstants.systemSettings;
    this.adduser = this.systemSettings['Allow to create manually-Users']

    combineLatest([
      from(this.userService.getStatusAttributes()),
      iif(() => !!this.translateService.currentLang, of(this.translateService.currentLang), this.translateService.onLangChange)
    ]).pipe(
        map(([a$, b$]) => ({
          statusAttributes: <{ listItemId: number; displayName: string }[]>a$,
          languageData: b$
        }))
    ).subscribe((res) => {
      const statusFilterOptions = (res.statusAttributes || []).reduce((acc, curr) => {
        acc.push({
          listItemId: curr.listItemId,
          label: this.translateService.instant(curr.displayName)
        })
        return acc;
      }, []);

      this.showTable = true;
      this.agInit(statusFilterOptions);
    });

    this._sharedService.currentMessage.subscribe((v: any) => {
      this.showPanel = v;
    })
    if (this.router.routerState.snapshot.url.split("/")[5] == "assigned-users") {
      if (this.assignedUsers == "FromRoles") {
        this.roleName = this.router['browserUrlTree'].queryParams.roleName ? decodeURIComponent(this.router['browserUrlTree'].queryParams.roleName) : decodeURIComponent(this.router['browserUrlTree'].root.children.primary.segments[5].path)
        this.getRoleDetails(true, this.roleName)
      } else if (this.assignedUsers == "FromGroups") {
        this.groupName = this.router['browserUrlTree'].queryParams.groupName ? decodeURIComponent(this.router['browserUrlTree'].queryParams.groupName) : decodeURIComponent(this.router['browserUrlTree'].root.children.primary.segments[5].path)
        this.getGroupDetails(true, this.groupName)
      }

    }
  }
  get_pattern(element){
    return this.commonService.get_pattern(element);
  }
  get_pattern_error(type){
    return this.commonService.get_pattern_error(type);
  }
  getRoleDetails(fillRoleName = true, roleName) {
    this.rolesService.getRole({ roleName: roleName })
      .then((response) => {
        if (response && response['roleId']) {
          this.roleDetails['description'] = response['description'];
          if (fillRoleName) {
          }
          this.roleDetails['roleName'] = response['roleName'];

          this.roleDetails['roleId'] = response['roleId'];

          this.roleDetails['icon'] = response['icon'];
          this.roleDetails['color'] = response['color'];
          UserConstant.roleDetails = this.roleDetails;
        }
        else {
          //this.utilitiesService.openSnackBar("error", "Invalid rolename");
        }
      })
      .catch((err) => {
        //this.utilitiesService.openSnackBar("error", "something went wrong");
      })
  }
  getGroupDetails(fillRoleName = true, groupName) {
    this.groupsService.getGroup({ groupName: groupName })
      .then((response: any) => {
        if (response && response.data && response.data.id) {
          this.groupDetails['description'] = response.data.description;
          this.groupDetails['groupId'] = response.data.id
          if (fillRoleName) {
          }
          this.groupDetails['groupName'] = response.data.name;

          this.groupDetails['icon'] = response.data.icon;
          this.groupDetails['color'] = response.data.color;
          this.groupDetails['remarks'] = response.data.remarks;
          UserConstant.groupDetails = this.groupDetails;
        }
        else {
          //this.utilitiesService.openSnackBar("error", "Invalid rolename");
        }
      })
      .catch((err) => {
        //this.utilitiesService.openSnackBar("error", "something went wrong");
      })
  }

  agInit(statusFilterOptions: any[]): void {
    let getRoles = () => {
      this.roles = [];
      GlobalConstants.systemSettings['allRoles'].forEach(element => {
        this.roles.push({
          listItemId: element.roleId,
          label: element.roleName,
        })
      })
    }
    getRoles();

    this.columnDefs = [
      {
        'headerName': UserConstant.fullName.headerName,
        'field': UserConstant.fullName.field,
        'colId': UserConstant.fullName.colId,
        'dbKey': 'firstName',
        'width': 180,
        'filter': true,
        'initialShowColumn': true,
        'sort': 'asc',
        'floatingFilterComponent': 'autoCompleteComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': UserConstant.fullName.colId,
          'options': [],
        },
        'suppressMenu': true,
        'class': "fullName",
        'cellRendererFramework': UserTableRendererComponent,
      },
      {
        'headerName': UserConstant.userName.headerName,
        'field': UserConstant.userName.field,
        'colId': UserConstant.userName.colId,
        'dbKey': 'screenName',
        'initialShowColumn': true,
        'width': 150,
        'filterParams': {
          applyButton: true,
          clearButton: true
        }

      },
      {
        'headerName': UserConstant.email.headerName,
        'field': UserConstant.email.field,
        'colId': UserConstant.email.colId,
        'dbKey': 'emailAddress',
        'initialShowColumn': true,
        'width': 180,
        'filterParams': {
          applyButton: true,
          clearButton: true,
        },
      },
      {
        'headerName': UserConstant.status.headerName,
        'field': UserConstant.status.field,
        'colId': UserConstant.status.colId,
        'dbKey': 'statusId',
        'initialShowColumn': true,
        'width': 150,
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': UserConstant.status.colId,
          'options': statusFilterOptions,
        },
        'suppressMenu': true,
        'class': "status",
        'cellRendererFramework': UserTableRendererComponent
      },
      {
        'headerName': UserConstant.source.headerName,
        'field': UserConstant.source.field,
        'colId': UserConstant.source.colId,
        'dbKey': 'source',
        'initialShowColumn': true,
        'width': 150,
        'class': "source",
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': UserConstant.source.colId,
          'filterName': "multiSelectString",
          'options': [{
            listItemId: 'internal',
            label: this.translateService.instant('Internal'),
          },
            {
              listItemId: 'external',
              label: this.translateService.instant('External'),
            }],
        },

      },
      {
        'headerName': UserConstant.roles.headerName,
        'field': UserConstant.roles.field,
        'colId': UserConstant.roles.colId,
        'dbKey': 'usersRoles',
        'initialShowColumn': true,
        'width': 200,
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': UserConstant.roles.colId,
          'options': this.roles,
        },
        'class': "roles",
        'cellRendererFramework': UserTableRendererComponent,
        "sortable": false,
        'suppressMenu': true
      },
      {
        'headerName': UserConstant.groups.headerName,
        'field': UserConstant.groups.field,
        'colId': UserConstant.groups.colId,
        'dbKey': 'usersGroups',
        'initialShowColumn': true,
        'width': 200,
        'floatingFilterComponent': 'multiSelectFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': UserConstant.groups.colId,
          'options': [],
        },
        'class': "groups",
        'cellRendererFramework': UserTableRendererComponent,
        "sortable": false,
        'suppressMenu': true
      },
      {
        'headerName': UserConstant.lastLogin.headerName,
        'field': UserConstant.lastLogin.field,
        'colId': UserConstant.lastLogin.colId,
        'dbKey': 'lastLoginDate',
        'initialShowColumn': true,
        'width': 250,
        'floatingFilterComponent': 'dateFilterComponent',
        'floatingFilterComponentParams': {
          'suppressFilterButton': true,
          'colId': UserConstant.lastLogin.colId,
        },
        'suppressMenu': true,
        'cellRendererFramework': CellRendererDateComponent,
        'cellRendererParams': {
          isDatePipeFormat: true
        }
      },
      {
        'headerName': UserConstant.actions.headerName,
        'field': UserConstant.actions.field,
        'colId': UserConstant.actions.colId,
        'initialShowColumn': !this.addUsersTable,
        'width': 206,
        'filter': false,
        'cellRendererFramework': UserActionsComponent,
      }
    ]

    this.gridOptions = {
      'showBulkOperations': false,
      'enableCheckBoxes': this.addUsersTable,
      'userManagementAddUser' : this.adduser,
      'resizable': true,
      'tableName': 'Users',
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
      'enableTableViews': true,
      'this': this.componentThis,
      'instance': this.userService,
      'method': "getUsersList",
      'dataModifier': "formatUserData",
      "enableServerSideFilter": true,
      "enableServerSideSorting": true,
      'filter': true,
      'rowHeight': 53,
      'csvExportParams': this.params,
      'dateFilterProperties': {
        opensProperty: 'left',
        dropsPropertyType: 'down'
      }
    };
  }

  public onGridReadyEvent(params){
    this.onGridReady$.next(params);
  }

  dateFormatter(params) {
    return params ? moment(params).format('DD-MMM-YYYY') : '';
  }

  formatUserData(gridoptions, response) {

    let formatedData = [];
    let groupFormatter = (groups) => {
      let userGroups = [];
      groups.forEach((group) => {
        userGroups.push(group.name);
      })
      return userGroups;
    }
    let roleFormatter = (roles) => {
      let userRoles = [];
      roles.forEach((role) => {
        userRoles.push(role["roleId"].roleName);
      })
      return userRoles;
    }

    const dateTranslatedPipeInstance = new DateTranslatedPipe(this.translateService, this._sharedService);
    response.result.forEach(ele => {
      let user = {};
      let middleName = ele.middleName ? ele.middleName : '';
      user[UserConstant.fullName.field] = `${ele.firstName} ${middleName} ${ele.lastName}`;
      user[UserConstant.userName.field] = ele.screenName ? ele.screenName : '';
      user[UserConstant.email.field] = ele.emailAddress ? ele.emailAddress : 'N/A';
      user[UserConstant.status.field] = ele.statusId ? ele.statusId : '';
      user[UserConstant.source.field] = ele.source ? ele.source : 'N/A';
      user[UserConstant.roles.field] = ele.usersRoles ? roleFormatter(ele.usersRoles) : '';
      user[UserConstant.groups.field] = ele.usersGroups ? groupFormatter(ele.usersGroups) : '';
      user[UserConstant.lastLogin.field] = ele.lastLoginDate ? this.dateFormatter(ele.lastLoginDate) : '';
      user[UserConstant.actions.field] = ele.Actions ? ele.Actions : '';
      user['completeResponse'] = ele;
      user['systemSettings'] = GlobalConstants.systemSettings;
      formatedData.push(user)
    });
    return formatedData;
  }

  public quickSearchOptions = [];
  public quickSearchValue: string;
  search(event,formControl) {
    if(formControl && formControl.invalid){
      return;
    }
    let params = {
      isScreeNameRequired: true,
      searchKey: event
    }

    this.quickSearchValue = event;
    this.userService.getUserWithName(params)
      .then((response: any) => {
        let options = [];

        response.data.forEach((element) => {
          let middleName = (element.middleName != null) ? element.middleName : "";
          if (element.userImage) {
            let imageFile = this.utilitiesService.convertBase64ToJpeg(element.userImage)
            var reader = new FileReader();
            reader.onload = (e: any) => {
              options.push({
                key: element.userId,
                value: element.firstName + " " + middleName + " " + element.lastName,
                img: e.target.result,
              })
            };
            reader.readAsDataURL(imageFile);
          }
          else {
            options.push({
              key: element.userId,
              value: element.firstName + " " + middleName + " " + element.lastName,
              icon: element.firstName.charAt(0) + element.lastName.charAt(0),
            })

          }
        })
        this.quickSearchOptions = options;

      })
      .catch((err) => {

      })
  }
  selectQuickSearchOption(option) {
    this.quickSearchOptions = [];
    const dialogRef = this.dialog.open(UserCreateComponent, {
      panelClass: ['user-popover'],
      data: { operation: "edit", 'systemSettings': GlobalConstants.systemSettings, userId: option.key }
    });
    this.quickSearchUser = null;

  }
  exportData() {
    if (document.getElementById("export-button")) {
      document.getElementById("export-button").click();
    }
  }
  onCompleteIntialize($event) {
    this.showExport = $event;

  }
  addUsersToGroup() {
    let dialogRef = this.dialog.open(AddUserGroupComponent, {
      panelClass: ['user-popover', 'w-100', 'custom-scroll-wrapper', 'delete-modal'],

      backdropClass: 'add-custom-modal',
      data: { message: this.assignedUsers, roleDetails: this.roleDetails, groupDetails: this.groupDetails }
    });
  }

  public trackByValue(_, item): string {
    return item.value;
  }

}
