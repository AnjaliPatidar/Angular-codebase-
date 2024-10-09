import { Component, OnInit,ViewChild } from '@angular/core';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material';
import { MatOption } from '@angular/material/core';
import { UtilitiesService } from '@app/modules/user-management/services/utilities/utilities.service';
import { PieChartModule } from '@app/shared/charts/chartsNew/reusablePie.js'
import { UserDeleteComponent } from '../../users/modals/user-delete/user-delete.component';
import { GroupsService } from '@app/modules/user-management/services/groups.service';
import { RolesService } from '@app/modules/user-management/services/roles/roles.service';

import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { Subject } from 'rxjs';
import {  map, takeUntil, tap } from 'rxjs/operators';
import { ICoreMultiSelectOption } from '../../../../../../shared/multi-select/model/ICoreMultiSelectOption';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-groups-settings',
  templateUrl: './groups-settings.component.html',
  styleUrls: ['./groups-settings.component.scss']
})
export class GroupsSettingsComponent implements OnInit {
  public groupDetails = {
    "description": "",
    "groupId": 0,
    "groupName": "",
    "groupCode": "",
    "icon":null,
    "color":"",
    "remarks": ""
  }
  public icons = GlobalConstants.icons;
  public showJurisdictionAutoComplete:boolean =false;
  public showRolesAutoComplete:boolean =false;
  public userStatus:any =[];
  systemSettings: any;
  currentGroup: any;
  iconsCopy: any;
  groupUpdateEnable: any;
  userType = [];
  userTypeFilters: any = [];
  // Tenant
  tenantType = [];
  tenantTypeFilters: any = [];
  tempTenantTypeFilters: any = [];
  selectedTenantListIds: Array<ICoreMultiSelectOption> = [];
  @ViewChild('mySel', { static: false }) selectTag: MatSelect;
  @ViewChild('feedClassification', { static: false }) selectTagFC: MatSelect;
  // Feed Classification
  feedClassificationType = [];
  feedClassificationTypeFilters: any = [];
  tempFeedClassificationTypeFilters: any = [];
  selectedFeedClassificationListIds: Array<ICoreMultiSelectOption> = [];
  @ViewChild('allSelected', { static: false }) private allSelected: MatOption;
  @ViewChild('allSelectedFC', { static: false }) private allSelectedFC: MatOption;
  // Case Type
  caseType = [];
  caseTypeFilters: any = [];
  tempCaseTypeFilters: any = [];
  selectedCaseTypeIds: Array<ICoreMultiSelectOption> = [];
  // @ViewChild('caseTypeId', { static: false }) selectTagCT: MatSelect;
  @ViewChild('allSelectedCT', { static: false }) private allSelectedCT: MatOption;
  @ViewChild('caseTypeId', { static: false }) selectTagCT: MatSelect;
  // allSelected = false;
  public showAlerts :boolean;
  public jurisdictionsList:any =[];
  public searchJurisdictionText:any;
  public searchRoleText:any;

  selectedJurisdictions: string[] = [];
  selectedRoles: string[] = [];

  public allWatchlists:  Array<ICoreMultiSelectOption> = [];
  public selectedWatchlists: Array<ICoreMultiSelectOption> = [];
  selectable = true;
  removable = true;
  rolesData: any= [];
  addGroupSpinner: boolean = false;
  usersOfRole: any;
  groupRoleUsers: any =[];

  private readonly destroyed$: Subject<undefined> = new Subject<undefined>();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private utilitiesService: UtilitiesService,
              private rolesService: RolesService,
              public confirmDialog: MatDialog,
              public confirmDialogRef: MatDialogRef<UserDeleteComponent>,
              public groupsService: GroupsService,
              private commonService: CommonServicesService,
              private translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.commonService.getAccessSettingsWatchlists$().pipe(
      map((accessSettingsWatchlists: Array<{ id: number; name: string }>) =>
        accessSettingsWatchlists.map((setting) => {
          return {
            id: setting.id,
            displayName: setting.name
          };
        })
      ),
    ).subscribe((allWatchlists: Array<ICoreMultiSelectOption>) => {
      this.allWatchlists = allWatchlists;
      this.selectedWatchlists = [...this.allWatchlists];
    })

    this.jurisdictionList().then((success) => {
      this.systemSettings = GlobalConstants.systemSettings;
      this.groupUpdateEnable = this.systemSettings['Allow update manually-Groups'];
      this.route.params.subscribe(params => {
        this.currentGroup = decodeURIComponent(params['currentGroup']);
        if (this.currentGroup != "newgroup") {
          this.getGroupDetails(true, this.currentGroup);
        }
      });
      this.route.queryParams.subscribe(params => {
        if (params.groupName) {
          this.getGroupDetails(false, decodeURIComponent(params.groupName));
        }
      });
      this.iconsCopy = this.icons;
      this.screeningList()
      this.CaseTypeList()
      this.TenantList()
      this.FeedClassificationList()
    })
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  get_pattern(element){
    return this.commonService.get_pattern(element);
  }
  get_pattern_error(type){
    return this.commonService.get_pattern_error(type);
  }
  getGroupDetails(fillRoleName = true,groupName){
    this.groupsService.getGroup({groupName : groupName})
    .then((response:any)=>{
      if(response && response.data && response.data.id){
        this.groupDetails['description'] = response.data.description;
        this.groupDetails['groupId'] = response.data.id;
        this.groupDetails['groupCode'] = response.data.groupCode ? response.data.groupCode : 'N/A';
        if(fillRoleName){
        this.groupDetails['groupName'] = response.data.name;
        this.intializeUsersActivityChart()
        }
        this.groupDetails['icon'] = response.data.icon;
        this.groupDetails['color'] = response.data.color;
        this.groupDetails['remarks']= response.data.remarks;
        this.getRolesOfGroup([this.groupDetails['groupId']])
        this.getAlertGroupSettings(this.groupDetails['groupId'])
        // this.getAssignedUsers();

      }
      else{
        //this.utilitiesService.openSnackBar("error", "Invalid rolename");
      }
    })
    .catch((err)=>{
      //this.utilitiesService.openSnackBar("error", "something went wrong");
    })
  }
  assignedUserRoute(tabName){
    return `/element/user-management/manage/groups/assigned-users/${encodeURIComponent(tabName)}`
  }
  getAlertGroupSettings(groupId) {
    let params = {
      groupId
    };
    this.groupsService
      .getAlertGroup(params)
      .pipe(
        map((response: any) => {
          const parsedData: Array<any> = response.data ? JSON.parse(response.data) : [];
          const selectedValues: { selectedJurisdictions: Array<string>; selectedWatchlistIds: Array<number>; selectedCaseTypeIds: Array<number>; selectedTenantListIds: Array<number>; selectedFeedClassificationListIds: Array<number>;} =
            parsedData.reduce(
              (acc, alertGroup) => {
                this.showAlerts = alertGroup.geoLocationSetting == 'On';
                switch (alertGroup.type) {
                  case AlertGroupType.JURISDICTION_TYPE:
                    const listTypeId = alertGroup.listTypeId ? [alertGroup.listTypeId] : [];
                    return { ...acc, selectedJurisdictions: [...acc.selectedJurisdictions, ...listTypeId] };
                  case AlertGroupType.WATCHLIST_TYPE:
                    const watchlistId = alertGroup.watchlistId ? [alertGroup.watchlistId] : [];
                    return { ...acc, selectedWatchlistIds: [...acc.selectedWatchlistIds, ...watchlistId] };
                  case AlertGroupType.CASE_TYPE:
                    const caseTypeId = alertGroup.listitemIdFromSM ? [alertGroup.listitemIdFromSM] : [];
                    return { ...acc, selectedCaseTypeIds: [...acc.selectedCaseTypeIds, ...caseTypeId] };
                  case AlertGroupType.TENANT_TYPE:
                    const tenantId = alertGroup.listitemIdFromSM ? [alertGroup.listitemIdFromSM] : [];
                    return { ...acc, selectedTenantListIds: [...acc.selectedTenantListIds, ...tenantId] };
                  case AlertGroupType.FEED_CLASSIFICATION_TYPE:
                    const feedClassificationId = alertGroup.listitemIdFromSM ? [alertGroup.listitemIdFromSM] : [];
                    return { ...acc, selectedFeedClassificationListIds: [...acc.selectedFeedClassificationListIds, ...feedClassificationId] };
                }
              },
              { selectedJurisdictions: [], selectedWatchlistIds: [], selectedCaseTypeIds: [], selectedTenantListIds: [], selectedFeedClassificationListIds: [] }
            );

          return selectedValues;
        }),
        tap(({ selectedJurisdictions }) => {
          this.selectedJurisdictions = selectedJurisdictions;
          if (this.selectedJurisdictions.length === 0) {
            this.jurisdictionsList.forEach((element) => {
              this.selectedJurisdictions.push(element);
            });
          }
        }),
        tap(({ selectedWatchlistIds }) => {
          if (selectedWatchlistIds.includes(-1)) {
            this.selectedWatchlists = [];
          } else if (selectedWatchlistIds.length > 0) {
            this.selectedWatchlists = selectedWatchlistIds.map(
              (id: number) =>
                this.allWatchlists.find(
                  (watchList: ICoreMultiSelectOption) => watchList.id === id
                )
            );
          } else {
            this.selectedWatchlists = [...this.allWatchlists];
          }
        }),
        tap(({ selectedCaseTypeIds }) => {
          if (selectedCaseTypeIds.includes(-1)) {
            this.selectedCaseTypeIds = [];
          } else if (selectedCaseTypeIds.length == 0) {
            let all = [0];
            this.caseType = [...all, ...this.caseTypeFilters];
          } else if (selectedCaseTypeIds.length > 0) {
            this.caseType = this.caseTypeFilters.filter(o1 => selectedCaseTypeIds.some(o2 => o1.listItemId === o2));
          }
        }),
        tap(({ selectedTenantListIds }) => {
          if (selectedTenantListIds.includes(-1)) {
            this.selectedTenantListIds = [];
          } else if (selectedTenantListIds.length == 0) {
            let all = [0];
            this.tenantType = [...all, ...this.tenantTypeFilters];
          } else if (selectedTenantListIds.length > 0) {
            this.tenantType = this.tenantTypeFilters.filter(o1 => selectedTenantListIds.some(o2 => o1.listItemId === o2));
          }
        }),
        tap(({ selectedFeedClassificationListIds }) => {
          if (selectedFeedClassificationListIds.includes(-1)) {
            this.selectedFeedClassificationListIds = [];
          } else if (selectedFeedClassificationListIds.length == 0) {
            let all = [0];
            this.feedClassificationType = [...all, ...this.feedClassificationTypeFilters];
          } else if (selectedFeedClassificationListIds.length > 0) {
            this.feedClassificationType = this.feedClassificationTypeFilters.filter(o1 => selectedFeedClassificationListIds.some(o2 => o1.listItemId === o2));
          }
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  public onWatchlistsChange(selectedWatchlists: Array<ICoreMultiSelectOption>): void {
    this.selectedWatchlists = [...selectedWatchlists];
  }

  getRolesOfGroup(groupId){
    this.groupsService.getRoleOfGroup(groupId)
    .then((response:any)=>{
      if(response && response.data  ){
       let data= JSON.parse(response.data)
        data.forEach((ele: any) => {
          this.selectedRoles.push(ele.roleId)
        });
        this.usersOfRole = this.selectedRoles
       this.intializeGroupRoleUserChart()
      }
    })
    .catch((err)=>{
    })
  }
  iconsFilter(event){
    if(event){
      let icons =  this.icons;
      icons = icons.filter((icon)=>{ return icon.indexOf(event) != -1})
      setTimeout(()=>{
        this.icons = icons;
      })
    }
    else{
      this.icons = this.iconsCopy;
    }
  }
  // Case Type
  tosslePerOneCaseType(all){
    if (this.allSelectedCT.selected) {
        this.allSelectedCT.deselect();
        return false;
    }
    if(this.caseType.length==this.caseTypeFilters.length)
    this.allSelectedCT.select();
  }
  // Tenant
  tosslePerOneTenant(all){
    if (this.allSelected.selected) {
        this.allSelected.deselect();
        return false;
    }
    if(this.tenantType.length==this.tenantTypeFilters.length)
    this.allSelected.select();
  }
  // Feed Classification
  tosslePerOneFeedClassification(all){
    if (this.allSelectedFC.selected) {
        this.allSelectedFC.deselect();
        return false;
    }
    if(this.feedClassificationType.length==this.feedClassificationTypeFilters.length)
    this.allSelectedFC.select();
  }
  // Case Type
  toggleAllSelectionCaseType() {
    if (this.allSelectedCT.selected) {
      this.selectTagCT.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectTagCT.options.forEach((item: MatOption) => { item.deselect() });
    }
  }
  // Tenant
  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.selectTag.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectTag.options.forEach((item: MatOption) => { item.deselect() });
    }
  }
  // Feed Classification
  toggleAllSelectionFeedClassification() {
    if (this.allSelectedFC.selected) {
      this.selectTagFC.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectTagFC.options.forEach((item: MatOption) => { item.deselect() });
    }
  }
  // Case Type
  onToppingRemovedCaseType(topping: string) {
    const toppings = this.caseType as string[];
    this.removeFirstCaseType(toppings, topping);
  }
  // Case Type
  private removeFirstCaseType<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
      this.caseType = array;
      this.caseType = this.caseTypeFilters.filter(o1 => this.caseType.some(o2 => o1.listItemId === o2.listItemId));
    }
  }
  // Tenant
  onToppingRemovedTenant(topping: string) {
    const toppings = this.tenantType as string[];
    this.removeFirstTenant(toppings, topping);
  }
  // Tenant
  private removeFirstTenant<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
      this.tenantType = array;
      this.tenantType = this.tenantTypeFilters.filter(o1 => this.tenantType.some(o2 => o1.listItemId === o2.listItemId));
    }
  }
  // Feed Classification
  onToppingRemovedFeedClassification(topping: string) {
    const toppings = this.feedClassificationType as string[];
    this.removeFirstfeedClassificationType(toppings, topping);
  }
  // Feed Classification
  private removeFirstfeedClassificationType<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
      this.feedClassificationType = array;
      this.feedClassificationType = this.feedClassificationTypeFilters.filter(o1 => this.feedClassificationType.some(o2 => o1.listItemId === o2.listItemId));
    }
  }
  cancelFilters(){
    this.selectTag.value = [];
    this.userType = [];
    this.selectTag.close();
  }
  applyFilters(){
  }
  jurisdictionList(){
    let promise = new Promise((resolutionFunc, rejectionFunc) => {
      this.groupsService.getJurdictions({listType: 'Jurisdictions'})
      .then((response)=>{
        if(response ){
          this.jurisdictionsList = response;
          resolutionFunc(true);
        }
        else{
          resolutionFunc(true);
         // this.utilitiesService.openSnackBar("error", "Invalid rolename");
        }
      })
      .catch((err)=>{
        resolutionFunc(true);
       // this.utilitiesService.openSnackBar("error", "something went wrong");
      })
    });
    return promise;
  }
  showJurisdictions(){
    this.showJurisdictionAutoComplete = false;
  }
  deleteGroup(){
      let dialogRef = this.confirmDialog.open(UserDeleteComponent, {
        panelClass: ['user-popover', 'custom-scroll-wrapper', 'delete-modal'],
        backdropClass:'modal-background-blur',
        data: { message: `are you sure wish to delete ${this.groupDetails['groupName']}?` }
      });
      dialogRef.afterClosed().subscribe((result:any) => {
        if(result){
          this.addGroupSpinner =  true;
          this.groupsService.deleteGroup({groupsId:this.groupDetails['groupId'] })
          .then((response: any) => {
            if(response && response.status && response.responseMessage){
              if (response.status == "success") {
                this.utilitiesService.openSnackBar("success", this.translateService.instant('The group has been deleted successfully'));
                this.addGroupSpinner = false;
              }
              else if (response.status == "error") {
                this.utilitiesService.openSnackBar("error", this.translateService.instant('The group deleting has failed'));
                this.addGroupSpinner = false;
              }
            }
            else{
              this.utilitiesService.openSnackBar("error", this.translateService.instant('The group deleting has failed'));
              this.addGroupSpinner = false;
            }
          })
          .catch(err => {
            this.utilitiesService.openSnackBar("error", this.translateService.instant('The group deleting has failed'));
            this.addGroupSpinner = false;
          })
        }
      });
  }
  screeningList(){
      this.groupsService.getJurdictions({listType: 'Feed Classification'})
      .then((response)=>{
        if(response ){
          this.userTypeFilters = response
        }
        else{
         // this.utilitiesService.openSnackBar("error", "Invalid rolename");
        }
      })
      .catch((err)=>{
       // this.utilitiesService.openSnackBar("error", "something went wrong");
      })
  }
  // CaseType List GET
  CaseTypeList(){
      this.groupsService.getJurdictions({listType: 'Case Type'})
      .then((response)=>{
        if(response ){
          this.caseTypeFilters = response;
          this.tempCaseTypeFilters = response;
        }
        else{
        // this.utilitiesService.openSnackBar("error", "Invalid rolename");
        }
      })
      .catch((err)=>{
      // this.utilitiesService.openSnackBar("error", "something went wrong");
      })
  }
  // TenantList GET
  TenantList(){
      this.groupsService.getJurdictions({listType: 'Tenant'})
      .then((response)=>{
        if(response ){
          this.tenantTypeFilters = response;
          this.tempTenantTypeFilters = response;
        }
        else{
        // this.utilitiesService.openSnackBar("error", "Invalid rolename");
        }
      })
      .catch((err)=>{
      // this.utilitiesService.openSnackBar("error", "something went wrong");
      })
  }
  // Feed Classification List GET
  FeedClassificationList(){
      this.groupsService.getJurdictions({listType: 'Feed Classification'})
      .then((response)=>{
        if(response ){
          this.feedClassificationTypeFilters = response;
          this.tempFeedClassificationTypeFilters = response;
          this.defaultDataBindFilters();
        }
        else{
        // this.utilitiesService.openSnackBar("error", "Invalid rolename");
        }
      })
      .catch((err)=>{
      // this.utilitiesService.openSnackBar("error", "something went wrong");
      })
  }
  // Default data bind
  defaultDataBindFilters() {
    this.route.params.subscribe(params => {
      this.currentGroup = decodeURIComponent(params['currentGroup']);
      if (this.currentGroup === "newgroup") {
        let all = [0];
        this.caseType = [...all, ...this.caseTypeFilters];
        this.tenantType = [...all, ...this.tenantTypeFilters];
        this.feedClassificationType = [...all, ...this.feedClassificationTypeFilters];
      }
    });
  }
  // Case Type Search
  searchCaseType(e) {
    if (e) {
      this.caseTypeFilters = this.caseTypeFilters.filter(val => { if (val.displayName) { return val.displayName.toLowerCase().indexOf(e.toLowerCase()) != -1 } });
    }
    else {
      this.caseTypeFilters = this.tempCaseTypeFilters;
    }
  }
  // TenantList Search
  searchTenant(e) {
    if (e) {
      this.tenantTypeFilters = this.tenantTypeFilters.filter(val => { if (val.displayName) { return val.displayName.toLowerCase().indexOf(e.toLowerCase()) != -1 } });
    }
    else {
      this.tenantTypeFilters = this.tempTenantTypeFilters;
    }
  }
  // Feed Classification Search
  searchfeedClassification(e) {
    if (e) {
      this.feedClassificationTypeFilters = this.feedClassificationTypeFilters.filter(val => { if (val.displayName) { return val.displayName.toLowerCase().indexOf(e.toLowerCase()) != -1 } });
    }
    else {
      this.feedClassificationTypeFilters = this.tempFeedClassificationTypeFilters;
    }
  }
  onJurisdictionSelectionChange(Jurisdiction,i): void {
    this.updateJurisdictionList(Jurisdiction,i);
  }
  updateJurisdictionList(Jurisdiction,i): void {
    if (this.isJurisdictionSelected(Jurisdiction)) {
        this.removeJurisdiction(Jurisdiction);
    } else {
      this.addJurisdiction(Jurisdiction);
    }
  }
  removeJurisdiction(Jurisdiction): void {
    const index = this.selectedJurisdictions.findIndex((x :any) => x.listItemId === Jurisdiction.listItemId);
    if (index >= 0) {
      this.selectedJurisdictions.splice(index, 1);
    }
  }
  selectAllJurisdiction(element){
    if(element.selected){
      this.selectedJurisdictions = [];
      this.jurisdictionsList.forEach(element => {
        this.selectedJurisdictions.push(element);
      });
    }
    else{
      this.selectedJurisdictions = [];
    }
  }
  addJurisdiction(Jurisdiction) {
    this.selectedJurisdictions.push(Jurisdiction);
  }

  isJurisdictionSelected(Jurisdiction): boolean {
     return this.selectedJurisdictions.findIndex((x :any) => x.listItemId === Jurisdiction.listItemId) >= 0;
  }
  getRoles(){
    this.showRolesAutoComplete = false;
  this.rolesService.getAllRoles().then((response:any)=>{
    this.rolesData=response.data
  }).catch((error:any)=>{

  })
}
onRoleSelectionChange(role,i): void {
  this.updateRoleList(role,i);
}
updateRoleList(role,i): void {
  if (this.isRoleSelected(role)) {
      this.removeRole(role);
  } else {
    this.addRole(role);
  }
}
removeRole(role): void {
  const index = this.selectedRoles.findIndex((x :any) => x.roleId === role.roleId);
  if (index >= 0) {
    this.selectedRoles.splice(index, 1);
  }
}
addRole(role) {
  this.selectedRoles.push(role);
}

isRoleSelected(role): boolean {
   return this.selectedRoles.findIndex((x :any) => x.roleId === role.roleId) >= 0;
}
addGroup(){
  this.addGroupSpinner = true;
 let params={
  "description": this.groupDetails["description"],
  "name": this.groupDetails["groupName"],
  "icon":this.groupDetails["icon"],
  "color":this.groupDetails["color"],
  "remarks": this.groupDetails["remarks"],
  "groupCode": this.groupDetails["groupCode"]
 }
  this.groupsService.createGroup(params)
  .then((response:any)=>{
    if (response.status == "success" && response.data && response.data.id ) {
      this.updateRoles(response.data.id)
      // this.updateAlertSreening(response.data.id)
      // setTimeout(() => {
        // this.updateAlertGeoJurisdiction(response.data.id)
        // this.updateAlertGeoWatchlists(response.data.id);
        // this.updateCaseTypeGeoJurisdiction(response.data.id);
        // this.updateTenantGeoJurisdiction(response.data.id);
        // this.updateFeedClassificationGeoJurisdiction(response.data.id);
      // }, 0);
      this.groupAlertSetting(response.data.id,'add',response);
      // this.utilitiesService.openSnackBar("success", this.translateService.instant('The group has been created successfully'));
      // this.addGroupSpinner = false;
      /*pushing role into global value */

    }
    else if (response.status.toLowerCase() == "error") {
      this.utilitiesService.openSnackBar("error", this.translateService.instant('The group creation has failed'));
      this.addGroupSpinner = false;
    }
   })
  .catch((error)=>{
    this.utilitiesService.openSnackBar("error", this.translateService.instant('The group creation has failed'));
  });
}

updateRoles(groupId){
  let data = [];
  if(this.selectedRoles){
  this.selectedRoles.forEach((val:any)=>{
     data.push({groupId:groupId,roleId:val.roleId})
  })
  this.groupsService.updateRoles(data,groupId).then((response)=>{
  })
  .catch((error)=>{

  })
  }
}
closeRoles(){
  this.showRolesAutoComplete = true
}
addRolesList(){
  this.showRolesAutoComplete = true
}
closeJurisdictions(){
  this.showJurisdictionAutoComplete = true;
}
addJurisdictionsList(){
  this.showJurisdictionAutoComplete = true;
}
alertsOnGeographicalLocation(showAlerts){
  if(showAlerts){
    this.selectedJurisdictions =[]
  }
}
updateGroup(){
  this.addGroupSpinner =  true;
  let data = {
    color: this.groupDetails['color'],
    description: this.groupDetails['description'],
    icon: this.groupDetails['icon'],
    name: this.groupDetails['groupName'],
    remarks: this.groupDetails['remarks'],
    source: "internal",
    userGroupId: this.groupDetails['groupId']
  }
  this.groupsService.updateGroupDetails(data)
  .then((response: any) => {
    if (response.status == "success") {
      this.updateRoles(data['userGroupId'])
      // this.updateAlertSreening(data['userGroupId'])
      // setTimeout(() => {
        // this.updateAlertGeoJurisdiction(data['userGroupId'])
        // this.updateAlertGeoWatchlists(data['userGroupId']);
        // this.updateCaseTypeGeoJurisdiction(data['userGroupId']);
        // this.updateTenantGeoJurisdiction(data['userGroupId']);
        // this.updateFeedClassificationGeoJurisdiction(data['userGroupId']);
      // }, 0);
      this.groupAlertSetting(response.data.id,'update')
      // this.addGroupSpinner = false;
    }
    else if (response.status.toLowerCase() == "error") {
      this.utilitiesService.openSnackBar("error", this.translateService.instant('The group updating has failed'));
      this.addGroupSpinner = false;
    }
  })
  .catch(err => {
    this.utilitiesService.openSnackBar("error", this.translateService.instant('The group updating has failed'));
    this.addGroupSpinner = false;
  })
}
// public updateAlertGeoWatchlists(groupId) {
//   let watchlistIds: Array<number>;
//   if (
//     this.selectedWatchlists.length > 0 &&
//     this.allWatchlists.length === this.selectedWatchlists.length
//   ) {
//     watchlistIds = this.returnAllWatchlistIdOnly(this.allWatchlists);
//   } else if (this.selectedWatchlists.length === 0) {
//     // [-1]
//     watchlistIds = [-1];
//   } else {
//     watchlistIds = this.selectedWatchlists.map(
//       (watchlist: ICoreMultiSelectOption) => {
//         if(watchlist){
//           return watchlist.id;
//         }
//       }
//     ); // [1,2,3]
//   }

//   const data = {
//     geoLocationSetting: this.showAlerts ? "On" : "Off",
//     groupId: groupId,
//     watchlistId: watchlistIds,
//     type: AlertGroupType.WATCHLIST_TYPE,
//   };
//   this.groupsService
//     .AlertGroupGeo(data)
//     .then((res: any) => {})
//     .catch((err) => {});
// }
// updateAlertGeoJurisdiction(groupId){
//   var listItemIds = [];
//   if (this.selectedJurisdictions.length != this.jurisdictionsList.length) {
//     this.selectedJurisdictions.forEach((val: any) => {
//       if (val.listItemId) {
//         listItemIds.push(val.listItemId)
//       }
//     })
//   }
//   let data={
//     "geoLocationSetting": this.showAlerts ? "On" : "Off",
//     "groupId": groupId,
//     "listItemId": listItemIds,
//     "type":  "JURISDICTION_TYPE"
//   }
//   this.groupsService.AlertGroupGeo(data).then((res:any)=>{
//   }).catch((err)=>{

//   })
// }
// CaseType Update
// updateCaseTypeGeoJurisdiction(groupId){
//   var listItemIds = [];
//   if (this.caseType[0] &&  this.caseType[0].listItemId!== undefined) {
//     this.caseType.forEach((val:any)=>{
//       if(val.listItemId) {
//         listItemIds.push(val.listItemId)
//       }
//     })
//   } else {
//     listItemIds = [];
//   }

//   let data={
//     "geoLocationSetting": this.showAlerts ? "On" : "Off",
//     "groupId": groupId,
//     "listItemId": listItemIds,
//     "type":  "CASE_TYPE"
//   }
//   this.groupsService.AlertGroupGeo(data).then((res:any)=>{
//   }).catch((err)=>{

//   })
// }
// // TenantList Update
// updateTenantGeoJurisdiction(groupId){
//   var listItemIds = [];
//   if (this.tenantType[0] &&  this.tenantType[0].listItemId!== undefined) {
//     this.tenantType.forEach((val:any)=>{
//       if(val.listItemId) {
//         listItemIds.push(val.listItemId)
//       }
//     })
//   } else {
//     listItemIds = [];
//   }

//   let data={
//     "geoLocationSetting": this.showAlerts ? "On" : "Off",
//     "groupId": groupId,
//     "listItemId": listItemIds,
//     "type":  "TENANT_TYPE"
//   }
//   this.groupsService.AlertGroupGeo(data).then((res:any)=>{
//   }).catch((err)=>{

//   })
// }
// // Feed Classification List Update
// updateFeedClassificationGeoJurisdiction(groupId){
//   var listItemIds = [];
//   if (this.feedClassificationType[0] &&  this.feedClassificationType[0].listItemId!== undefined) {
//     this.feedClassificationType.forEach((val:any)=>{
//       if(val.listItemId) {
//         listItemIds.push(val.listItemId)
//       }
//     })
//   } else {
//     listItemIds = [];
//   }

//   let data={
//     "geoLocationSetting": this.showAlerts ? "On" : "Off",
//     "groupId": groupId,
//     "listItemId": listItemIds,
//     "type":  "FEED_CLASSIFICATION_TYPE"
//   }
//   this.groupsService.AlertGroupGeo(data).then((res:any)=>{
//   }).catch((err)=>{

//   })
// }

private groupAlertSetting(groupId,type : string,response?) {
  let caseTypeId = [];
  let tenantTypeId = [];
  let jurisdictionTypeId = [];
  let feedClassificationTypeId = [];
  let watchlistId = [];

  if (this.caseType[0] && this.caseType[0].listItemId !== undefined) {
    this.caseType.forEach((val: any) => {
      if (val.listItemId) {
        caseTypeId.push(val.listItemId)
      }
    })
  }

  if (this.tenantType[0] && this.tenantType[0].listItemId !== undefined) {
    this.tenantType.forEach((val: any) => {
      if (val.listItemId) {
        tenantTypeId.push(val.listItemId)
      }
    })
  }

  if (this.selectedJurisdictions.length != this.jurisdictionsList.length) {
    this.selectedJurisdictions.forEach((val: any) => {
      if (val.listItemId) {
        jurisdictionTypeId.push(val.listItemId)
      }
    })
  }

  if (this.feedClassificationType[0] && this.feedClassificationType[0].listItemId !== undefined) {
    this.feedClassificationType.forEach((val: any) => {
      if (val.listItemId) {
        feedClassificationTypeId.push(val.listItemId)
      }
    })
  }

  // if (this.selectedWatchlists.length > 0 && this.allWatchlists.length === this.selectedWatchlists.length) {
  //   // watchlistId = this.returnAllWatchlistIdOnly(this.allWatchlists);
  //   // when all watchlist is selected
  //   watchlistId = []
  // } else

  if (this.selectedWatchlists.length === 0) {
    // when no watchlist is selected
    watchlistId = [-1];
  } else {
    watchlistId = this.selectedWatchlists.map(
      (watchlist: ICoreMultiSelectOption) => {
        if (watchlist) {
          return watchlist.id;
        }
      }
    );
  }

  let data = {
    "geoLocationSetting": this.showAlerts ? "On" : "Off",
    "groupId": groupId,
    "settings": {
      "CASE_TYPE": caseTypeId,
      "TENANT_TYPE": tenantTypeId,
      "JURISDICTION_TYPE": jurisdictionTypeId,
      "FEED_CLASSIFICATION_TYPE": feedClassificationTypeId,
      "WATCHLIST_TYPE": watchlistId
    }
  }

  this.addGroupSpinner = true;
  this.groupsService.AlertGroupGeo(data).then((res: any) => {
    this.addGroupSpinner = false;
    this.utilitiesService.openSnackBar("success", this.translateService.instant('The group has been updated successfully'));
    if (type != 'update') {
      this.router.navigate(['/element/user-management/manage/groups'])
    }

  }).catch((err) => {
    this.addGroupSpinner = false;
    this.utilitiesService.openSnackBar("error", this.translateService.instant('The group has not been updated successfully'));
    if (type != 'update') {
      this.router.navigate(['/element/user-management/manage/groups'])
    }
  })
}

intializeUsersActivityChart(){

  let params = {
    groupId:  this.groupDetails['groupId']
  }
   this.userStatus=[
    {key:"Pending",icon:"hourglass",value:0},
    {key:"Active",icon:"check-circle",value: 0},
    {key:"Suspended",icon:"pause-circle",value:0},
    {key:"Blocked",icon:"ban",value:0},
    {key:"Deactivated",icon:"times",value:0},
  ]
  this.groupsService.getUserStatusOfGroup(params).then((res: any) => {
    if(Object.keys(res).length){
    let data: Array<any> = [];
    for (var property in res) {

      this.userStatus.forEach((val) => {
        if (val.key == property) {
          val.value = res[property]
        }
      })
    }

      let numbers: Array<any> = Object.values(res)
      let sum = 0;
      for (var i = 0; i < numbers.length; i++) {
        sum += numbers[i]
      }
      let percent = (res.Active/sum)*100;
      if(isNaN(percent)){
        percent = 0
      }
  var pieData = { container: "#userStatusForGroups", radius: { outerRadius: 65, innerRadius: 50 }, data: this.userStatus,width:130, height: 130, colors: [ "#00796b","#3eb6ff","#e6ae20","#ef5350","rgba(255, 255, 255, 0.54)"], islegends: false, islegendleft: false, legendwidth: '', istxt: percent !=100? percent.toFixed(2)+"%" : percent+ "%",divideTxt:'Active',txtSize: "12px",paddingTop:"", legendmargintop: 30,legendHeight: "280px" }
      PieChartModule.ReusablePie(pieData)
    }
    }).catch((error) => {
      throw error
    })

}
intializeGroupRoleUserChart(){
  let colors = ["#00796b","#3eb6ff","#e6ae20","#5d96c8", "#b753cd", "#69ca6b", "#c1bd4f", "#db3f8d", "#669900", "#334433","#ef5350","rgba(255, 255, 255, 0.54)"]
   this.usersOfRole.forEach((ele,index) => {
    this.groupRoleUsers.push(
      {key: ele.roleName,
        value: ele.noOfUsers ? ele.noOfUsers : 0,
        color: colors[index]
    })
  });
  var pieData = { container: "#RoleUsersForGroups", radius: { outerRadius: 65, innerRadius: 50 }, data:  this.groupRoleUsers,width:130, height: 130, colors: colors, islegends: false, islegendleft: false, legendwidth: '',txtSize: "13px",paddingTop:"", legendmargintop: 30,legendHeight: "280px" }
      PieChartModule.ReusablePie(pieData)
}

public trackByListItemId(_, item): string {
  return item.listItemId;
}

public trackByDisplayName(_, item): string {
  return item.displayName;
}

public trackByRoleId(_, item): string {
  return item.roleId;
}
public trackByKey(_, item): string {
  return item.key;
}
  // returnAllWatchlistIdOnly(watchList) {
  //   let idOfWatchlist = [];
  //   watchList.filter(watchlist => {
  //     idOfWatchlist.push(watchlist.id)
  //   });
  //   return idOfWatchlist;
  // }
}


enum AlertGroupType {
  FEED_CLASSIFICATION_TYPE = 'FEED_CLASSIFICATION_TYPE',
  JURISDICTION_TYPE = 'JURISDICTION_TYPE',
  WATCHLIST_TYPE = 'WATCHLIST_TYPE',
  CASE_TYPE = 'CASE_TYPE',
  TENANT_TYPE = 'TENANT_TYPE'
}
