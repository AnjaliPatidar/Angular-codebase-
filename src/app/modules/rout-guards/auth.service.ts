import { Inject, Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { WINDOW } from '../../core/tokens/window';

@Injectable({
  providedIn: 'root'
})
export class permissionsGuardService implements CanActivate {
  public systemSettings: any = [];
  showSticky: boolean = false;
  title = 'Alert Management';
  public showStikcy: boolean = true;
  public keys = {
    maxFileSize: "Maximum file size allowed",
  }
  public getBasicData: boolean = false;
  constructor(
    private _commonService: CommonServicesService,
    @Inject(WINDOW) private readonly window: Window
  ) { }


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
          this._commonService.getUserRoles({ userId: this.systemSettings['ehubObject']['userId'], isGroupRolesRequired: true })
            .then((response: any) => {
              if (Array.isArray(response)) {
                let allRoleIds = [];
                response.forEach((element: any) => {
                  if (element['roleId']) {
                    allRoleIds.push(element['roleId']['roleId'] ? element['roleId']['roleId'] : 0);
                    this.systemSettings['userRoles'].push(element['roleId']);
                  }
                });
                this._commonService.getPermissionsByRole(allRoleIds)
                  .then((response: any) => {
                    if (response && response.status && response.status == 'success') {
                      this.systemSettings['permissions'] = [];
                      allRoleIds.forEach((roleId) => {
                        this.systemSettings['permissions'][roleId] = [];
                      })
                      if (response.data && Array.isArray(response.data)) {
                        response.data.forEach((value) => {
                          let roleId = (value && value.roleId && value.roleId.roleId) ? value.roleId.roleId : 0;
                          if (roleId) {
                            let permissionId = (value && value.permissionId) ? value.permissionId : null;
                            let permissionLevel = (value) ? value.permissionLevel : null;
                            if (permissionId && permissionId.permissionId) {
                              this.systemSettings['permissions'][roleId][permissionId.permissionId] = { permissionId: permissionId, permissionLevel: permissionLevel }
                            }
                          }
                        })
                      }
                      GlobalConstants.permissionDataOfUser = this.systemSettings

                      resolve(this.systemSettings);

                    }
                    else {
                      resolve(this.systemSettings);
                    }
                  })
                  .catch((response) => {
                    resolve(this.systemSettings);
                  });
              }
              else {
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

  getUserCurrentDomainDetails() {
    let currentDomian = new Promise((resolve, reject) => {
      this._commonService.getActiveDomainDetailsOfUser(this.systemSettings['ehubObject']['userId']).then(resp => {
        if (resp) {
          GlobalConstants.currentDomianDetails = resp['data'];
        }
        resolve(resp['data']);
      })
    });
    return currentDomian;
  }

  redirectToDomain(){
          let paths: string = localStorage.getItem('paths');
          if (paths) {
            paths = JSON.parse(paths)
            paths['EHUB_FE_API'] + "#domain"
             this.window.location.href = paths['EHUB_FE_API'] + "#/domain"
          }
  }
  canActivateRoute(permissionsList: any): boolean {
    let validLevel = 0;
    let domainDetails = {
      name: GlobalConstants.currentDomianDetails['domainName'],
      id: GlobalConstants.currentDomianDetails['permissionId']
    };
    let moduleName = 'm.';

    let currentUrl = this.window.location.href;
    let groupIdList = [];
    let moduleList = [];
    let avoidDataList = [null, undefined, 'null', 'undefined', {}, ''];
    for (let keyy in GlobalConstants.moduleNamesWithTheirRoutes) {
      if (currentUrl.includes(GlobalConstants.moduleNamesWithTheirRoutes[keyy]) && avoidDataList.includes(moduleName.split('.')[1])) {
        moduleName = moduleName + keyy;
      }
    }

    if (avoidDataList.includes(moduleName.split('.')[1])) {
      return true;
    }
    for (let prop in permissionsList) {
      if (permissionsList[prop].length > 0) {
        for (let propty in permissionsList[prop]) {
          let role = permissionsList[prop][propty];
          if (role && role['permissionId']) {
            if (role['permissionId']['parentPermissionId'] == domainDetails['id']) {
            }
            if (role['permissionId']['parentPermissionId'] == domainDetails['id'] && !groupIdList.includes(role['permissionId']['permissionId'])) {
              groupIdList.push(role['permissionId']['permissionId'])
            }
            if (role['permissionId']['itemName'] == moduleName) {
              moduleList.push(role)
            }
          }
        }
      }
    }
    moduleList.map((modules) => {
      let reqiuredModuleParentId = groupIdList.indexOf(modules['permissionId']['parentPermissionId'])
      if (reqiuredModuleParentId > -1 && modules['permissionId']['parentPermissionId'] == groupIdList[reqiuredModuleParentId]) {
        if (modules['permissionLevel'] > 0) {
          validLevel = modules['permissionLevel']
        }

      }
    })
    if (validLevel > 0) {
      return true;
    }
    else {
      this.redirectToDomain();
      return false;
    }

  }


  canActivate() {
    let hold = Promise.all([this.getUserRoles(), this.getUserCurrentDomainDetails()]).then(yes => {
      if (GlobalConstants.currentDomianDetails.hasOwnProperty('domainName') && GlobalConstants.currentDomianDetails['domainName']) {
        if (GlobalConstants.permissionDataOfUser && GlobalConstants.permissionDataOfUser['permissions'] && Array.isArray(GlobalConstants.permissionDataOfUser['permissions'])) {
          return this.canActivateRoute(GlobalConstants.permissionDataOfUser['permissions']);//GlobalConstants.systemSettings['permissions']
        }
        else {
          return true;
        }
      }
      else {
        return true;
      }
    }).catch(er => {
      this.redirectToDomain();
      return false;
    });
    return hold;

  }
}