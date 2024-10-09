import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConstants } from '@app/app.constant';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.sass']
})
export class RootComponent implements OnInit {
  constructor(private titleService: Title, private _commonService: CommonServicesService,
    private translateService: TranslateService, private _sharedServicesService: SharedServicesService) { }

  ngOnInit() {
    this.titleService.setTitle("User Management");
    this.getLanguage();
  }



  getLanguage() {
    let getLanguageData = (language) => {
      let key = this._commonService.get_language_name(language)
      // var key = language.slice(0, 3).toLowerCase();
      var filename = key + '_user_management.json'
      var param = {
        "fileName": filename,
        "languageName": language,
        "token": AppConstants.Ehubui_token
      };
      let url = AppConstants.Ehub_Rest_API + 'fileStorage/downloadFileByLanguageAndFileName?fileName=' + param.fileName + '&languageName=' + param.languageName;
      this.translateService.setDefaultLang(AppConstants.Ehub_Rest_API + 'fileStorage/downloadFileByLanguageAndFileName?fileName=en_user_management.json&languageName=English');

      this.translateService.use(url).subscribe(
        res => {
          GlobalConstants.languageJson = res;
          this._commonService.sendLanguageJsonToComponents(res);
          GlobalConstants.localizationFiles.isMainModuleLoaded = true;
        },
        error =>{
          if(error.status == 404 && key == 'de'){
            this._sharedServicesService.showFlashMessage('german file not found, loading default language..', 'danger');
            getLanguageData('english');
          } else if(error.status == 404 && key == 'en'){
            setTimeout(() => {
              this._sharedServicesService.showFlashMessage('english file '+error.url+' is missing', 'danger');
            },3000)
          }
          
        }
      );
  
      // this._commonService.getModuleJsonData(param).subscribe((resp) => {
      //   if (resp) {
      //     GlobalConstants.languageJson = resp;
      //     // this._commonService.sendLanguageJsonToComponents(resp);
      //   }
      // })
    } 
    if(GlobalConstants.systemSettings['ehubObject']['language']){
      getLanguageData(GlobalConstants.systemSettings['ehubObject']['language']);
    }
    else{
      this._commonService.getSystemSettings().then((resp) => {
        resp['General Settings'].map((val) => {
          if (val.name == "Languages") {
            if (val.selectedValue) {
              getLanguageData(val.selectedValue)
            }
          }
        });
      }).catch((error) => {
  
      })
    }
  }

}
