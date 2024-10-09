import { Component, OnInit } from '@angular/core';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { AppConstants } from '@app/app.constant';
import { TranslateService } from '@ngx-translate/core';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { SharedServicesService } from '@app/shared-services/shared-services.service';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss']
})
export class DomainComponent implements OnInit {

  constructor(private _commonService: CommonServicesService,private translateService: TranslateService, private _sharedServicesService: SharedServicesService) { }

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  ngOnInit() {
      this.dropdownList = [
        {"id":1,"itemName":"India"},
        {"id":2,"itemName":"Singapore"},
        {"id":3,"itemName":"Australia"},
        {"id":4,"itemName":"Canada"},
        {"id":5,"itemName":"South Korea"},
        {"id":6,"itemName":"Germany"},
        {"id":7,"itemName":"France"},
        {"id":8,"itemName":"Russia"},
        {"id":9,"itemName":"Italy"},
        {"id":10,"itemName":"Sweden"}
      ];
      this.selectedItems = [
          {"id":2,"itemName":"Singapore"},
          {"id":3,"itemName":"Australia"},
          {"id":4,"itemName":"Canada"},
          {"id":5,"itemName":"South Korea"}
      ];
      this.dropdownSettings = { 
          singleSelection: false, 
          text:"Select Countries",
          selectAllText:'Select All',
          unSelectAllText:'UnSelect All',
          enableSearchFilter: true,
          classes:"myclass custom-class"
        };
        this.getLanguage();
  }

  //To get the language based on the module
  getLanguage() {
    let getLanguageData = (language) => {
      let key = this._commonService.get_language_name(language)
      // var key = language.slice(0, 3).toLowerCase();
      var filename = key + '_domin.json'
      var param = {
        "fileName": filename,
        "languageName": language,
        "token": AppConstants.Ehubui_token
      };
      let url = AppConstants.Ehub_Rest_API + 'fileStorage/downloadFileByLanguageAndFileName?fileName=' + param.fileName + '&languageName=' + param.languageName;
      this.translateService.setDefaultLang(AppConstants.Ehub_Rest_API + 'fileStorage/downloadFileByLanguageAndFileName?fileName=en_domin.json&languageName=English');
      
      this.translateService.use(url).subscribe(
        res => {
          GlobalConstants.languageJson = res;
          this._commonService.sendLanguageJsonToComponents(res);
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

  onItemSelect(item:any){
    
    
  }
  OnItemDeSelect(item:any){
      
      
  }
  onSelectAll(items: any){
      
  }
  onDeSelectAll(items: any){
      
  }

}
