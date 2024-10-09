import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { CaseManagementService } from '@app/modules/case-management/case-management.service';
import { UserSharedDataService } from '@app/shared-services/data/user-shared-data.service';
import { SharedServicesService } from '@app/shared-services/shared-services.service';

@Component({
  selector: 'app-widgets-collapsed-container',
  templateUrl: './widgets-collapsed-container.component.html',
  styleUrls: ['./widgets-collapsed-container.component.scss']
})
export class WidgetsCollapsedContainerComponent implements OnInit {

  @Input ('pageName') pageName:string;
  @Output ('onWidgetCollapsed') onWidgetCollapsed = new EventEmitter();
  widgetPreferencesList:any[];
  currentWidgetPreferences:any;
  buttonLabelValue:string = this.getLanguageKey("Hide widgets");
  isShowWidget:boolean = true;
  isLoading:boolean;

  constructor(
    private _sharedServicesService : SharedServicesService,
    private _userSharedService: UserSharedDataService,
    private _caseManagementService: CaseManagementService
    ) { }

  ngOnInit() {
    this.getWidgetPreferencesList();
  }

  // @reason : on page load get the current view info or inizialy create the widget info data
  // @author: ammshathwan
  // @date: 31 may 2023
  getWidgetPreferencesList():void{
    this._userSharedService.getUserDetails().subscribe((userInfo:any) => {
      if((userInfo && !userInfo.data) || !userInfo.data.widgetPreferences ||(userInfo && userInfo.data && !userInfo.data.widgetPreferences.length)){
        let params = {
          widgetId : null,
          pageName : this._caseManagementService.getLowerCaseText(this.pageName),
          showWidget : true
         }
         this.updateWidgetPreferences(params)
        return
      }

      this.widgetPreferencesList = userInfo.data.widgetPreferences;
      this.currentWidgetPreferences = this.widgetPreferencesList.find((widgetInfo:any) => {
         return widgetInfo && this._caseManagementService.getLowerCaseText(widgetInfo.pageName) == this._caseManagementService.getLowerCaseText(this.pageName);
      })
      this.onWidgetCollapsed.emit(this.currentWidgetPreferences)

      if(this.currentWidgetPreferences && !this.currentWidgetPreferences.showWidget){
        this.buttonLabelValue = this.getLanguageKey("Show widgets");
        this.isShowWidget = false;
      }
    })
  }

  // @reason : on toggle widget button show and hide logic is handled on this func
  // @author: ammshathwan
  // @date: 31 may 2023
  toggleWidgetShow():void{
    const widgetState:boolean = !this.isShowWidget;
    const params = {
      widgetId: this.currentWidgetPreferences && this.currentWidgetPreferences.widgetId ? this.currentWidgetPreferences.widgetId : null,
      pageName : this._caseManagementService.getLowerCaseText(this.pageName),
      showWidget : widgetState
    }
    this.isLoading = true;
    this.updateWidgetPreferences(params);
  }

  // @reason : update widget toogle value with BE
  // @author: ammshathwan
  // @date: 31 may 2023
  updateWidgetPreferences(params:any):void{
    this._userSharedService.updateWidgetPreferences(params).subscribe((data:any) => {
      this.currentWidgetPreferences = data;
      this.isShowWidget = this.currentWidgetPreferences.showWidget;
      this.buttonLabelValue = this.isShowWidget ? this.getLanguageKey("Hide widgets") : this.getLanguageKey("Show widgets");
      this.onWidgetCollapsed.emit(data)
      this.isLoading = false;
      this._sharedServicesService.showFlashMessage(this.getLanguageKey("Successfully updated"), 'success');
    }, err => {
      if(this.currentWidgetPreferences){
        this.onWidgetCollapsed.emit({
          widgetId : this.currentWidgetPreferences.currentWidgetPreferences.widgetId,
          pageName : this._caseManagementService.getLowerCaseText(this.pageName),
          showWidget : this.isShowWidget
        })
      }
      this.isLoading = false;
      this._sharedServicesService.showFlashMessage(this.getLanguageKey("Update widget failed"), 'danger');
    })
  }

  // @reason : Add localization text
  // @author: ammshathwan
  // @date: 31 may 2023
  getLanguageKey(text:string):string{
    var langKey = text;
    if (GlobalConstants.languageJson) {
      langKey = GlobalConstants.languageJson[text];
    }
    return langKey ? langKey : text;
  }

}
