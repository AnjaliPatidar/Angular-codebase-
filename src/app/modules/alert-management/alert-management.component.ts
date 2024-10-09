import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { AppConstants } from '@app/app.constant';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { SharedServicesService } from '@app/shared-services/shared-services.service';

import {LazyLoadLibraryService} from '../../common-modules/services/lazy-load-library.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-alert-management',
  templateUrl: './alert-management.component.html',
  styleUrls: ['./alert-management.component.scss']
})
export class AlertManagementComponent implements OnInit {
  public enablePopWindow:boolean =  false;
  private unsubscribe$: Subject<any> = new Subject<any>();
  constructor(private _commonService: CommonServicesService, private translateService: TranslateService, private _sharedServicesService:SharedServicesService,private lazyLoadLibraryService: LazyLoadLibraryService) { }

  ngOnInit() {
    this.getLanguage();
    // Dynamically script files required for alermangment
    this.lazyLoadLibraryService.loadCss('./assets/VLA/css/jquery.qtip.css').subscribe();
    this.lazyLoadLibraryService.loadCss('./assets/VLA/css/cytoscape.js-panzoom.css').subscribe();
    this.lazyLoadLibraryService.loadCss('./assets/VLA/css/cytoscape.js-navigator.css').subscribe();
    this.lazyLoadLibraryService.loadScript('./assets/VLA/js/cola.v3.min.js').subscribe();
    this.lazyLoadLibraryService.loadScript('./assets/VLA/js/cytoscape_2.7.12.js').subscribe();
    this.lazyLoadLibraryService.loadScript('./assets/VLA/js/cytoscape-cola.js').subscribe();
    this.lazyLoadLibraryService.loadScript('./assets/VLA/js/cytoscape-qtip.js').subscribe();
    this.lazyLoadLibraryService.loadScript('./assets/VLA/js/cytoscape-cose-bilkent.js').subscribe();
    this.lazyLoadLibraryService.loadScript('./assets/VLA/js/cytoscape-cxtmenu.js').subscribe();
    this.lazyLoadLibraryService.loadScript('./assets/VLA/js/cytoscape-markov-cluster.js').subscribe();
    this.lazyLoadLibraryService.loadScript('./assets/VLA/js/cytoscape-navigator.js').subscribe();
    this.lazyLoadLibraryService.loadScript('./assets/VLA/js/cytoscape-ngraph.forcelayout.js').subscribe();
    this.lazyLoadLibraryService.loadScript('./assets/VLA/js/cytoscape-panzoom.js').subscribe();
    this.lazyLoadLibraryService.loadScript('./assets/VLA/js/cytoscape-undo-redo.js').subscribe();
    this.lazyLoadLibraryService.loadScript('./assets/VLA/js/weaver.min.js').subscribe();
    this.lazyLoadLibraryService.loadScript('./assets/VLA/js/cytoscape-spread.js').subscribe();
    this.LoadMinimizedModal();
  };

  //To get the language based on the module

  getLanguage() {
    let getLanguageData = (language) => {
      // var key = language.slice(0, 3).toLowerCase();
      let key = this._commonService.get_language_name(language)
      var filename = key + '_alert_management.json'
      var param = {
        "fileName": filename,
        "languageName": language,
        "token": AppConstants.Ehubui_token
      };
      let url = AppConstants.Ehub_Rest_API + 'fileStorage/downloadFileByLanguageAndFileName?fileName=' + param.fileName + '&languageName=' + param.languageName;
      this.translateService.setDefaultLang(AppConstants.Ehub_Rest_API + 'fileStorage/downloadFileByLanguageAndFileName?fileName=en_alert_management.json&languageName=English');
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
      //     this._commonService.sendLanguageJsonToComponents(resp);
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

  LoadMinimizedModal(){
    this._sharedServicesService.enableMiniMizedDIV.pipe(takeUntil(this.unsubscribe$)).subscribe(res=>{
      this.enablePopWindow = res;
    });
  }
}
