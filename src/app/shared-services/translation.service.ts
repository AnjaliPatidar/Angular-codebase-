import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

@Injectable()
export class MyMissingTranslationHandler implements MissingTranslationHandler {
    handle(params: MissingTranslationHandlerParams): any {
        // let isAllFilesLoaded = (GlobalConstants.localizationFiles && (GlobalConstants.localizationFiles.isTopPanelLoaded && GlobalConstants.localizationFiles.isSubmenuLoaded && GlobalConstants.localizationFiles.isMainModuleLoaded)) ? true :false;
            // if(params.translateService.currentLang){
            //     let language = params.translateService.currentLang.substr(params.translateService.currentLang.lastIndexOf('fileName=')+9,3);
            //     return language+' resources are missing';
            // } else{
            //     return 'language resources are missing';
            // }
    }
}
