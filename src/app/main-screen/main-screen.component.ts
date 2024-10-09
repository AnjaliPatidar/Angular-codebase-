import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonServicesService } from '../common-modules/services/common-services.service';
import { GlobalConstants } from '../common-modules/constants/global.constants';
import { AppConstants } from '../app.constant';
import { TranslateService } from '@ngx-translate/core';
import { SharedServicesService } from '../shared-services/shared-services.service';
import { UserService } from '../modules/user-management/services/user.service';
import { HttpClient } from '@angular/common/http';
import { UserSharedDataService} from '../shared-services/data/user-shared-data.service';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import {DropDownData} from '@app/shared/model/drop-down-data.model';
import {ThemeBuilderService} from '@app/modules/systemsetting/services/theme-builder.service';
@Component({
  selector: 'app-root',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss'],
})
export class MainScreenComponent implements OnInit, OnDestroy  {
  public systemSettings:any =[] ;
  showSticky: boolean = false;
  title = 'Alert Management';
  public showStikcy: boolean = true;
  public keys = {
    maxFileSize : "Maximum file size allowed",
    openInNewtab : "Open link in a new tab"
  }
  public getBasicData:boolean =  false;
  showSubmenu = true;
  routerEventSub: Subscription;

  constructor(
       private translateService: TranslateService,
      private _sharedServicesService: SharedServicesService,
      private _commonService: CommonServicesService,
      private userService: UserService,
      private userSharedDataService: UserSharedDataService,
      private httpClient: HttpClient,
      private router: Router,
      private themeService: ThemeBuilderService
  ) {
    this.listenRouteChanges();
  }

  ngOnInit() {
    this._commonService.sticky.subscribe(stickyStatus => this.showSticky = stickyStatus);
    Promise.all([this.getSystemSettings(),this.getUserRoles(),this.getUserGroups(),this.getUserCurrentDomainDetails(),this.permissionMappingJson()]).then((values) => {
      GlobalConstants.systemSettings =  this.systemSettings;
      this.getUserDetails()
      this.getBasicData = true;
      this.checkForTheme();
      this.getLanguage().then((res)=>{
      }).catch((err)=>{
      });

      this.setDateFormat()
    });
  }

  listenRouteChanges(): void {
    if(this.router && this.router.events) {
      this.routerEventSub = this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          this.showSubmenu = (event && event.url && event.url.includes('document-management')) ? false : true;
        }
      });
    }
  }

  getLanguage() {
    let langPromise = new Promise(async (resolve, reject) => {
      let getLanguageData = (language) => {
        const key = this._commonService.get_language_name(language);
        const filename = key + '_top_pannel.json';
        const param = {
          fileName: filename,
          languageName: language
        };
        const url =
            AppConstants.Ehub_Rest_API +
            'fileStorage/downloadFileByLanguageAndFileName?fileName=' +
            param.fileName +
            '&languageName=' +
            param.languageName;
        this.translateService.setDefaultLang(
            AppConstants.Ehub_Rest_API +
            'fileStorage/downloadFileByLanguageAndFileName?fileName=en_top_pannel.json&languageName=English'
        );
        this.translateService.use(url).subscribe(
            (res) => {
              GlobalConstants.languageJson = res;
              this._commonService.sendLanguageJsonToComponents(res);
              GlobalConstants.localizationFiles.isTopPanelLoaded = true;
              this._commonService.setTopPanelJson(res);
            },
            (error) => {
              if (error.status === 404 && key === 'de') {
                this._sharedServicesService.showFlashMessage(
                    'german file not found, loading default language..',
                    'danger'
                );
                getLanguageData('english');
              } else if (error.status === 404 && key === 'en') {
                setTimeout(() => {
                  this._sharedServicesService.showFlashMessage(
                      'english file ' + error.url + ' is missing',
                      'danger'
                  );
                }, 3000);
              }
            }
        );
      };
      if (GlobalConstants.systemSettings['ehubObject']['language']) {
        getLanguageData(
            GlobalConstants.systemSettings['ehubObject']['language']
        );
      } else {
        this._sharedServicesService.getSystemSettings().then(async systemSettings => {
          if (systemSettings) {
            this.manipulateLanguageSettings(systemSettings, getLanguageData);
          } else {
            try {
              const resp = await this._commonService.getSystemSettings();
              if (resp) {
                this.manipulateLanguageSettings(resp, getLanguageData);
              }
            } catch (error) {
              throw error;
            }
          }
        });
      }
    });
    return langPromise;
  }

  manipulateLanguageSettings(settings: any, getLanguageData: any): void {
    settings['General Settings'].map((val) => {
      if (val.name === 'Languages') {
        if (val.selectedValue) {
          getLanguageData(val.selectedValue);
        }
      }
    });
  }

  /*
   * @purpose: calling system settings api and storing values
   * @created: jan 09 2020
   * @author: kamal
   * params : null
   * return : promise
 */
  getSystemSettings(){
    const fileTypes: string[] = [
      'pdf',
      'xlsx',
      'txt',
      'jpg',
      'png',
      'docx',
      'csv',
      'gif',
      'rtf',
      'tiff',
      'snt',
    ];
    this.systemSettings['allowedFileTypes'] = [];
    this.systemSettings['maxFileSize'] = null;
    let systemSettings = new Promise(async (resolve, reject) => {
      this._sharedServicesService.getSystemSettings().then(async systemSettingsResult => {
        if (systemSettingsResult) {
          this.manipulateSystemSettings(systemSettingsResult, fileTypes, resolve);
        } else {
          try {
            const response = await this._commonService.getSystemSettings();
            if (response) {
              this.manipulateSystemSettings(response, fileTypes, resolve);
            } else {
              resolve(this.systemSettings);
            }
          } catch (error) {
            resolve(this.systemSettings);
          }
        }
      });
    });
    return systemSettings;
  }

  manipulateSystemSettings(response, fileTypes: string[], resolveVal): void {
    GlobalConstants.systemsettingsData = response;
    if (
        response['General Settings'] &&
        Array.isArray(response['General Settings'])
    ) {
      response['General Settings'].forEach((obj) => {
        if (obj && obj.name && obj.selectedValue) {
          if (fileTypes.indexOf(obj.name.toLowerCase()) !== -1 &&
              obj.selectedValue.toLowerCase() === 'on'
          ) {
            this.systemSettings['allowedFileTypes'].push(
                obj.name.toLowerCase()
            );
          } else if (obj.name === this.keys['maxFileSize']) {
            this.systemSettings['maxFileSize'] = obj.selectedValue;
          } else if (obj.name === this.keys['openInNewtab']) {
            this.systemSettings['openInNewtab'] = obj.selectedValue.toLowerCase() === 'on';
          }
        }
      });
    }
    if (
        response['User Management Regulation'] &&
        Array.isArray(response['User Management Regulation'])
    ) {
      // getting "Allow to create manually" and "Allow update manually" and "Allow 3rd Party synchronization" settings
      response['User Management Regulation'].forEach((val) => {
        if (val && val.name) {
          if (
              val.name.split('-')[0] === 'Allow to create manually' ||
              val.name.split('-')[0] === 'Allow update manually' ||
              val.name.split('-')[0] === 'Allow 3rd Party synchronization'
          ) {
            this.systemSettings[val.name] =
                val['selectedValue'] === 'On' ? true : false;
          }
        }
      });
    }
    if (response['Mail Settings']) {
      response['Mail Settings'].forEach((valu) => {
        if (valu && valu.name && valu.name === 'Enable Authentication') {
          this.systemSettings[valu.name] =
              valu.selectedValue === 'On' ? true : false;
        }
      });
    }
    resolveVal(this.systemSettings);
  }

  /*
    * @purpose: calling get user roles api
    * @created: jan 09 2020
    * @author: kamal
    * params : null
    * return : promise
  */
  getUserRoles() {
    this.systemSettings['userRoles'] = [];
    var systemSettings = new Promise((resolve, reject) => {
      if (localStorage.getItem('ehubObject')) {
        this.systemSettings['ehubObject'] = JSON.parse(localStorage.getItem('ehubObject'));
        if (this.systemSettings['ehubObject']['userId']) {
          this._commonService.getUserRoles({userId:this.systemSettings['ehubObject']['userId'],isGroupRolesRequired:true})
              .then((response: any) => {
                if (Array.isArray(response)) {
                  let allRoleIds = [];
                  response.forEach((element: any) => {
                    if(element['roleId']){
                      allRoleIds.push(element['roleId']['roleId'] ? element['roleId']['roleId'] : 0);
                      this.systemSettings['userRoles'].push(element['roleId']);
                    }
                  });
                  this._commonService.getPermissionsByRole(allRoleIds)
                      .then((resp:any)=>{
                        if(resp && resp.status && resp.status == 'success'){
                          this.systemSettings['permissions'] =[];
                          allRoleIds.forEach((roleId)=>{
                            this.systemSettings['permissions'][roleId] = [];
                          })
                          if(resp.data && Array.isArray(resp.data)){
                            resp.data.forEach((value)=>{
                              let roleId = (value  && value.roleId && value.roleId.roleId)?  value.roleId.roleId : 0;
                              if(roleId){
                                let permissionId = (value  && value.permissionId )?  value.permissionId : null;
                                let permissionLevel = (value  )?  value.permissionLevel : null;
                                if(permissionId  && permissionId.permissionId){
                                  this.systemSettings['permissions'][roleId][permissionId.permissionId] = {permissionId: permissionId , permissionLevel:permissionLevel}
                                }
                              }
                            })
                            GlobalConstants.rolePermissions = resp.data;
                            GlobalConstants.getPermissionsByRole = resp.data;
                          }
                          resolve(this.systemSettings);

                        }
                        else{
                          resolve(this.systemSettings);
                        }
                      })
                      .catch((response)=>{
                        resolve(this.systemSettings);
                      });
                }
                else{
                  resolve(this.systemSettings)
                }

              })
              .catch(err => {
                resolve(this.systemSettings)
              })
        }
        else {
          resolve(this.systemSettings)
        }
      }
      else {
        resolve(this.systemSettings)
      }

    });
    return systemSettings;
  }

  /*
   * @purpose: calling get user groups api
   * @created: jan 09 2020
   * @author: kamal
   * params : null
   * return : promise
 */
  getUserGroups() {
    this.systemSettings['userGroups'] = [];
    this.systemSettings['allRoles'] = [];
    var systemSettings = new Promise((resolve, reject) => {
      if (localStorage.getItem('ehubObject')) {
        this.systemSettings['ehubObject'] = JSON.parse(localStorage.getItem('ehubObject'));
        if (this.systemSettings['ehubObject']['userId']) {
          this._commonService.getUserGroups(this.systemSettings['ehubObject']['userId'])
              .then((response: any) => {
                this.systemSettings['userGroups'] = response.result ? response.result : [];
                resolve(this.systemSettings);
              })
              .catch(err => {
                resolve(this.systemSettings);
              })
          this._commonService.getAllRoles().then((response:any)=>{
            this.systemSettings['allRoles']=response.data
          }).catch((error:any)=>{

          })
        }
        else {
          resolve(this.systemSettings);
        }
      }
      else {
        resolve(this.systemSettings);
      }

    });
    return systemSettings;
  }


  getUserCurrentDomainDetails(){
    let currentDomian = new Promise((resolve,reject)=>{
      this._commonService.getActiveDomainDetailsOfUser(this.systemSettings['ehubObject']['userId']).then(resp=>{
        if(resp){
          GlobalConstants.currentDomianDetails = resp['data'];
        }
        resolve(resp['data']);
      })
    });
    return currentDomian;
  }
  permissionMappingJson(){
    let  permissionJson= new Promise((resolve,reject)=>{
      this._commonService.getPermissionIds().subscribe(resp=>{
        if(resp){
          GlobalConstants.permissionJson = resp;
        }
        resolve(resp);
      })
    });
    return permissionJson;
  }

  getUserDetails(){
    let userId: any  = GlobalConstants.systemSettings['ehubObject']['userId'];
    let userSelectedLanguage;
    this.userService.getUserById(userId)
        .then((response: any) => {
          if (response.status && response.status == "success" && response && response.data) {
            this.userSharedDataService.setUserDetails(response);
            let userLanguage = response.data.language ? response.data.language : null;
            if(userLanguage != null){
              userSelectedLanguage = (userLanguage.trim() == 'english') ? 'English (United Kingdom)' : (userLanguage.trim() == 'german') ? 'German (Germany)' : userLanguage;
            } else {
              GlobalConstants.systemsettingsData['General Settings'].map((val) => {
                if (val.section == "Regional Settings") {
                  userSelectedLanguage = val.selectedValue == 'English' ? 'English (United Kingdom)' : val.selectedValue == 'German' ? 'German (Germany)' : val.selectedValue;
                }
              });
            }

            this.httpClient.get('./assets/json/date-formats.json').subscribe((res:any) =>{
                  res.find(ele => {
                    if(ele.EnglishName == userSelectedLanguage){
                      GlobalConstants.globalDateFormat = ele;
                    }
                  });
                },
                (err) => {
                })
          }
        });

  }

  private checkForTheme(): void {
    const usrObj = JSON.parse(localStorage.getItem('ehubObject'));
    const themesSettings = GlobalConstants.systemsettingsData['General Settings'].filter(el => el.section === 'Theme');
    const themeSetting = themesSettings.find(el => {
      return el.name === el.selectedValue;
    });
    if (themeSetting && themeSetting.name) {
      this.themeService.setDefaultTheme(themeSetting.name, usrObj.userId, themeSetting.settingId);
      this._commonService.getThemeById(themeSetting.settingId).then((theme) => {
        this.themeService.selectedTheme = theme;
      });
    }
  }

  ngOnDestroy(): void {
    this.routerEventSub.unsubscribe();
  }
  setDateFormat():void{
    this._sharedServicesService.getDateFormart();
  }
}
