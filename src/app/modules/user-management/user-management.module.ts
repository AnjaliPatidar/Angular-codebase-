/*modules*/
import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule, TranslateLoader,MissingTranslationHandler } from '@ngx-translate/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { AgGridTableModule } from '../../common-modules/modules/ag-grid-table/ag-grid-table.module';
import { LyThemeModule, LY_THEME, LY_THEME_GLOBAL_VARIABLES } from '@alyle/ui';
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PipeModuleModule } from '@app/common-modules/pipes/pipe-module/pipe-module.module'
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MyMissingTranslationHandler } from '../../shared-services/translation.service';

/**Directive imports */
import { PanelBackDropClassDirective } from '../../common-modules/directives/backdrop.directive'

export class GlobalVariables {
  testVal = '#00bcd4';
  Quepal = {
    default: `linear-gradient(135deg,#11998e 0%,#38ef7d 100%)`,
    contrast: '#fff',
    shadow: '#11998e'
  };
  SublimeLight = {
    default: `linear-gradient(135deg,#FC5C7D 0%,#6A82FB 100%)`,
    contrast: '#fff',
    shadow: '#B36FBC'
  };
  Amber = {
    default: '#ffc107',
    contrast: 'rgba(0, 0, 0, 0.87)'
  };
}
import { LyResizingCroppingImageModule } from '@alyle/ui/resizing-cropping-images';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';
import { LySliderModule } from '@alyle/ui/slider';
import { AngularFileDragDropModule } from 'angular-file-drag-drop';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
/*modules*/

/*pipes*/
import { DatePipe } from '@angular/common';
// import { TimestampSort } from '@app/common-modules/pipes/TimeStampSort.component';
// import { CustomTextFilter } from '@app/common-modules/pipes/textFIlter.component';
/*pipes*/

/*components */
import { RootComponent } from './components/root/root.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ManageComponent } from './components/manage/manage.component';
import { UsersComponent } from './components/manage/users/users.component';
import { RolesComponent } from './components/manage/roles/roles.component';
import { GroupsComponent } from './components/manage/groups/groups.component';
import { PoliciesComponent } from './components/manage/policies/policies.component';
import { LogonFailuresComponent } from './components/dashboard/logon-failures/logon-failures.component';
import { UserCreateComponent } from './components/manage/users/modals/user-create/user-create.component';
import { UploadImageComponent } from './components/manage/users/modals/user-create/user-create.component';
import { UserActionsComponent } from './components/manage/users/actions/user-actions/user-actions.component';
import { UserEditModalComponent } from './components/manage/users/modals/user-edit-modal/user-edit-modal.component'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserDeleteComponent } from './components/manage/users/modals/user-delete/user-delete.component';
import { UserTableRendererComponent } from './components/manage/users/user-table-renderer/user-table-renderer.component';
import { LogonFailureRendererComponent } from './components/dashboard/logon-failures/logon-failure-renderer/logon-failure-renderer.component';
import { RolesAssignedUsersComponent } from './components/manage/roles/roles-assigned-users/roles-assigned-users.component';
import { RolesPermissionsComponent } from './components/manage/roles/roles-permissions/roles-permissions.component';
import { RolesSettingsComponent } from './components/manage/roles/roles-settings/roles-settings.component';
import { RolesManagerComponent } from './components/manage/roles/roles-manager/roles-manager.component';

/*components*/


/*services*/
import { UserService } from './services/user.service';
import { DashboardService } from './services/dashboard.service';
import { GetValueByRefKeyPipe } from './pipes/get-value-by-ref-key.pipe';
import { InterceptorService } from '../../shared-services/interceptor.service';
import { ObserverService } from './services/observer.service';
import { RolesService } from './services/roles/roles.service';
import { UtilitiesService } from './services/utilities/utilities.service';
import { RightPanelComponent } from './components/right-panel/right-panel.component';
import { AddUserGroupComponent } from './components/manage/users/modals/add-user-group/add-user-group.component';
import { AdvancedSearchUserTableComponent } from './components/manage/users/modals/advanced-search-user-table/advanced-search-user-table.component';
import { GroupsManagerComponent } from './components/manage/groups/groups-manager/groups-manager.component';
import { GroupsSettingsComponent } from './components/manage/groups/groups-settings/groups-settings.component';
import { GroupsAssignedUsersComponent } from './components/manage/groups/groups-assigned-users/groups-assigned-users.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { permissionsGuardService } from '../rout-guards/auth.service';
import { SettingsComponent } from './components/manage/users/settings/settings.component';
import { PermissionsComponent } from './components/manage/users/settings/permissions/permissions.component';
import { CoreMultiSelectModule } from '../../shared/multi-select/multi-select.module';
// import { GetPermissionIdPipe } from '../../shared/globalPipes/get-permission-id.pipe';
/*services*/

import localeDe from "@angular/common/locales/de"
import localeEn from "@angular/common/locales/en"
import { DateTranslatedPipeModule } from '@app/common-modules/pipes/date-translated/date-translated-pipe.module';

registerLocaleData(localeDe);
registerLocaleData(localeEn);

const routes: Routes = [
  {
    path: '', component: RootComponent, children: [
      { path: '', component: DashboardComponent },
      {
        path: 'manage', component: ManageComponent, children: [
          { path: 'users', component: UsersComponent },
          { path: 'roles', component: RolesComponent },
          { path: 'groups', component: GroupsComponent },
          { path: 'policies', component: PoliciesComponent }
        ]
      },
      {
        path: 'manage/roles', component: RolesManagerComponent, children: [
          { path: 'settings/:currentRole', component: RolesSettingsComponent },
          { path: 'permissions/:currentRole', component: RolesPermissionsComponent },
          { path: 'assigned-users/:currentRole', component: RolesAssignedUsersComponent },
        ]
      },
      {
        path: 'manage/groups', component: GroupsManagerComponent, children: [
          { path: 'settings/:currentGroup', component: GroupsSettingsComponent },
          { path: 'assigned-users/:currentGroup', component: GroupsAssignedUsersComponent },
        ]
      },
    ],
    canActivate:[permissionsGuardService]
  }
];

export function childTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '', '');
}

@NgModule({
  declarations: [
    // RightPanelComponent,
    RootComponent, PermissionsComponent, DashboardComponent, ManageComponent, UsersComponent, RolesComponent, GroupsComponent, PoliciesComponent, LogonFailuresComponent, UserCreateComponent, UploadImageComponent, GetValueByRefKeyPipe, UserActionsComponent, UserEditModalComponent, UserDeleteComponent, UserTableRendererComponent, LogonFailureRendererComponent, RightPanelComponent, RolesAssignedUsersComponent, RolesPermissionsComponent, RolesSettingsComponent, RolesManagerComponent, AddUserGroupComponent, AdvancedSearchUserTableComponent, GroupsManagerComponent, GroupsSettingsComponent, GroupsAssignedUsersComponent, SettingsComponent, PanelBackDropClassDirective],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    MatChipsModule,
    MatSliderModule,
    MatSelectModule,
    MatListModule,
    MatDialogModule,
    MatDatepickerModule,
    NgxMatSelectSearchModule,
    MatMenuModule,
    MatTooltipModule,
    MatSlideToggleModule,
    AgGridTableModule,
    LyResizingCroppingImageModule,
    LySliderModule,
    LyButtonModule,
    LyIconModule,
    LyThemeModule.setTheme('minima-light'),
    AngularFileDragDropModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    TranslateModule,
    MatAutocompleteModule,
    PipeModuleModule,
    MatIconModule,
    MatTreeModule,
    MatCheckboxModule,
    MatRadioModule,
    CoreMultiSelectModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (childTranslateLoader),
        deps: [HttpClient]
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MyMissingTranslationHandler
      },
      isolate: true
    }),
    DateTranslatedPipeModule
  ],
  providers: [{
    provide: LY_THEME,
    useClass: MinimaLight,
    multi: true
  },
    Title,
  {
    provide: LY_THEME,
    useClass: MinimaDark,
    multi: true
  },
  {
    provide: LY_THEME_GLOBAL_VARIABLES,
    useClass: GlobalVariables
  },
  { provide: LY_THEME, useClass: MinimaLight, multi: true },
  {
    provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true
  },
  { provide: MatDialogRef, useValue: {} },
    UserService,
    ObserverService,
    RolesService,
    UtilitiesService,
    DashboardService,
    DatePipe,
    GetValueByRefKeyPipe,

  ],
  exports: [

  ],
  entryComponents: [
    UserCreateComponent,
    UploadImageComponent,
    UserActionsComponent,
    UserEditModalComponent,
    UserDeleteComponent,
    UserTableRendererComponent,
    LogonFailureRendererComponent,
    LogonFailuresComponent,
    AddUserGroupComponent,
    AdvancedSearchUserTableComponent
  ]
})
export class UserManagementModule { }
