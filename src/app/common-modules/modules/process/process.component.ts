import { Component, Inject, OnInit } from '@angular/core';
import { CommonServicesService } from '../../services/common-services.service';
import { AppConstants } from '@app/app.constant';
import { TranslateService } from '@ngx-translate/core';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { WINDOW } from '../../../core/tokens/window';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements OnInit {
  public submenuOptions;
  public name;
  public iconColorClass = ['light','medium','dark'];
  public dashboardname = '';

  public currentState = '';
  constructor(private _commonService: CommonServicesService,private translateService: TranslateService,private _sharedServicesService:SharedServicesService,
    @Inject(WINDOW) private readonly window: Window
  ) { }

  ngOnInit() {
    this.name = this._commonService.userName;
    this._commonService.getSubmenuOptions().subscribe((resp:any)=>{
      if(resp){
         resp.moduleGroups = resp.moduleGroups.sort(function(a,b){return b.moduleGroupName < a.moduleGroupName?1:-1});
         this.submenuOptions = this.moveArray(resp.moduleGroups,3, 4)
         this.submenuOptions = this.moveArray(this.submenuOptions,0,3)
         this.submenuOptions = this.moveArray(this.submenuOptions,0, 1);
         this.submenuOptions.DisableBydomains = {
          "AML": ["Fraud", "Underwriting"],
          "FINANCIAL CRIME": ["Transaction Intelligence", "Underwriting"],
          "Risk": ["Fraud", "Underwriting"],
          "CREDIT CARDS": ["Fraud", "Underwriting"],
          "SOCIAL LISTENING": ["Fraud", "Underwriting"],
          "MARKET INTELLIGENCE": ["Fraud", "Underwriting"],
          "INSURANCE": ["Fraud"]
        }
        var current_domain =AppConstants.domainSelected;
        this.submenuOptions.map((val, key) => {
          val.modules.map((v, key) => {
            if (this.submenuOptions.DisableBydomains[current_domain].includes(v['moduleName'])){
            // if ($.inArray(v['moduleName'], this.submenuOptions.DisableBydomains[current_domain]) != -1) {
              v['disabled'] = true;
            }
          })
        })
      }
    });
    this.getLanguage();
  };

  //To get the language based on the module

  getLanguage() {
    let getLanguageData = (language) => {
      // var key = language.slice(0, 3).toLowerCase();
      let key = this._commonService.get_language_name(language)
      var filename = key + '_process.json'
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

    /*
      * @purpose: Array index positioning
      * @created: 22 sep 2019
      * @params: old_index(number), new_index(number)
      * @return: array
      * @author: Karunakar
    */
    moveArray = (arr, old_index, new_index) =>{
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
      }
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
      return arr; // for testing
    };

   /*
      * @purpose: disable submenus
      * @created: 24 oct 2017
      * @params: null
      * @return: no
      * @author: ankit
    */
    checkSubmenuDisable(value){
      // this.submenuOptions['moduleGroups'].map((val, key) =>
      //   if ($.inArray(v['moduleName'], dropDownDisableBydomains[current_domain]) != -1) {
      //     v['disabled'] = true;
      //   }
      // })
      if (value == true){
        return true;
      }
      if (value == false){
        return false;
      }
      // if (value == "maybe" && $stateParams.caseId){
      //   return false;
      // }
      // else{
      //   return true;
      // }
    }

    /*
      * @purpose: Click submenu
      * @created: 21 sep 2017
      * @params: submenuName(string)
      * @return: no
      * @author: ankit
    */
    subMenuDropdownClick(submenuname){
      var submenuname = submenuname.toLowerCase();
      if(submenuname != 'predict'){
        this.window.location.href= AppConstants.Ehub_UI_API +'#/'+ submenuname;
      }else if(submenuname === 'predict'){
        this.window.location.href= AppConstants.Ehub_UI_API +'#/leadGeneration/#!/landing';
      } else{
        this.window.location.href= AppConstants.Ehub_UI_API + submenuname;
      }
    }

    /*
      * @purpose: Active submenu
      * @created: 5 oct 2017
      * @params: submenuname(string)
      * @return: no
      * @author: ankit
    */
	   getSubMenu(submenuname,  content, dashboardItemNames){
      this.getSubMenuData(submenuname,  content, dashboardItemNames, this.currentState,'');
      this.updateUserMenuData(submenuname,  content, dashboardItemNames)
    }

    /*
      * @purpose: Active submenu
      * @created: 19 Aug 19
      * @params: submenuname(string)
      * @return: no
    */
    updateUserMenuData(submenuname,  content, dashboardItemNames){
      var data = {
      "clicksCount": 1,
      "groupId": submenuname.moduleGroupId,
      "moduleId": submenuname.moduleId,
      "userId": submenuname.userId
    }
    // processPageApiService.userMenuCount(data).then(function (response) {

    // }, function () {
    //   HostPathService.FlashErrorMessage('FAILED TO UPDATE.. PLEASE TRY AGAIN LATER', '');
    // });
  }

  /*
    * @purpose: class
    * @created: 24 oct 2017
    * @params: null
    * @return: no
    * @author: ankit
  */
  addClass(index){
    if(index==0 || index%3==0){
      return this.iconColorClass[0];
    }
    else if(index==1 || (index-1)%3==0){
      return this.iconColorClass[1];
    }
    else if(index==2 || (index-2)%3==0){
      return this.iconColorClass[2];
    }
  }

  /*
     * @purpose: setting dashboardItems
     * @created: 18 jan 2018
     * @params: data(object)
     * @return: no
     * @author: Ankit
     */

	getSubMenuData(submenuname, content, dashboardItems, currentState, caseSeedDetails) {

		var disable = this.checkSubmenuDisable(content);
		if (disable){
			return false;
		}
		this.setdashboardname(submenuname.moduleName, dashboardItems);
		var submenuname = submenuname.moduleName.replace(/ /g, '');
		submenuname = submenuname.charAt(0).toLowerCase() + submenuname.slice(1);
		if (submenuname == 'bigDataSciencePlatform') {
			submenuname = 'workflow';
			this.window.location.href = AppConstants.Ehub_UI_API + submenuname + '/';
		}
		if (submenuname == 'questionnaireBuilder') {
			var url = AppConstants.KYC_QUESTIONNAIRE_PATH;
			this.window.open(url, '_blank', 'noopener');
		}
		if (submenuname == 'policyEnforcement') {
			var url = AppConstants.POLICY_ENFORCEMENT_PATH;
			this.window.open(url, '_blank', 'noopener');
		}
		if (submenuname == 'dashboard') {
			submenuname = 'discover';
			this.window.location.href = AppConstants.Ehub_UI_API + '#/' + submenuname;
		}
		if (submenuname == 'investigationConsole') {
			// if ($stateParams.caseId != undefined) {
			// 	this.window.location.href = AppConstants.Ehub_UI_API + '#/' + submenuname + '/' + $stateParams.caseId;
			// } else {
			// 	this.window.location.href = AppConstants.Ehub_UI_API + '#/' + submenuname + '/';
			// }
		}
		if (submenuname == 'advancedSearch') {
			submenuname = 'enrich';
			this.window.location.href = AppConstants.Ehub_UI_API + '#/' + submenuname;
		}
		if (submenuname == 'onboarding') {
			submenuname = 'enrich';
			this.window.location.href = AppConstants.Ehub_UI_API + '#/' + submenuname + '?onBoard=true';
		}
		if (submenuname == 'underwriting') {
			submenuname = 'underwriting';
			this.window.location.href = AppConstants.Ehub_UI_API + 'uploadDocuments/#!/' + "landing";
		}
		if (submenuname == 'marketIntelligence') {
			submenuname = 'mip';
			this.window.location.href = AppConstants.Ehub_UI_API + submenuname + '/';
		}
		if (submenuname == 'cases') {
			// submenuname = 'casePageLanding';
			var href = AppConstants.Ehub_UI_API + 'element-new/dist/new/#/element/case-management/caseList';
			this.window.open(href , '_blank', 'noopener');
		}
		if (submenuname == 'auditTrail') {
			submenuname = 'auditTrail';
			this.window.location.href = AppConstants.Ehub_UI_API + '#/' + submenuname;
		}
		if (submenuname == 'entity') {
			submenuname = 'entity';
		  var url:any;
			if (currentState == 'actCase') {
				url = AppConstants.Ehub_UI_API + submenuname + '/#!/company/' + caseSeedDetails.name + "?qId=" + caseSeedDetails.caseId;
			} else {
				url = AppConstants.Ehub_UI_API + submenuname + '/#!/company/oracle';
			}
			// if ($rootScope.hyperLinksNewTab) {
			// 	this.window.open(url, '_blank');
			// } else {
			// 	this.window.open(url, '_self');
			// }

		}
		if (submenuname == 'linkAnalysis') {
			var url :any;
			// if (currentState == 'actCase') {
			// 	url = AppConstants.Ehub_UI_API + '#/linkAnalysis?caseId=' + $stateParams.caseId;
			// } else if ($stateParams.query) {
			// 	url = AppConstants.Ehub_UI_API + '#/linkAnalysis?q=' + $stateParams.query;
			// } else {
			// 	url = AppConstants.Ehub_UI_API + '#/linkAnalysis';
			// }
			this.window.open(url, '_blank');
		}
		if (submenuname == 'fraud') {
			this.window.location.href = AppConstants.Ehub_UI_API + 'transactionIntelligence';
		}
		if (submenuname == 'userManagement') {
			this.window.location.href = AppConstants.Ehub_UI_API + 'identityManagement';
		}
		if (submenuname == 'personalization') {
			this.window.location.href = AppConstants.Ehub_UI_API + 'leadGeneration';
		}
		if (submenuname == 'transactionIntelligence') {
			this.window.location.href = AppConstants.Ehub_UI_API + 'transactionIntelligence';
		}
		if (submenuname == 'adverseTransactions') {
			submenuname = 'adverseTransactions';
			this.window.location.href = AppConstants.Ehub_UI_API + '#/' + submenuname;
		}
		if (submenuname == 'workspace' || submenuname == 'appManager' || submenuname == 'dataManagement' || submenuname == 'dataCuration') {
			this.window.location.href = AppConstants.Ehub_UI_API + '#/' + submenuname;
		}
		if (submenuname == 'transactionMonitoring') {
			// if ($stateParams.caseId != undefined) {
			// 	this.window.location.href = AppConstants.Ehub_UI_API + '#/' + submenuname + '/' + $stateParams.caseId;
			// } else {
			// 	this.window.location.href = AppConstants.Ehub_UI_API + '#/' + submenuname;
			// }
		}
		if (submenuname == 'decisionScoring') {
			//$rootScope.riskScoreModal();
		}
		if (submenuname == 'orchestration') {
			var activityUrl = AppConstants.ACTIVITI_FE_PATH+'id='+encodeURIComponent(JSON.stringify(localStorage.getItem('ehubObject')));
			this.window.open((activityUrl), '_self');

			//					   this.window.location.href= AppConstants.Ehub_UI_API + 'identityManagement';
		}
		if (submenuname == 'documentParsing') {
			this.window.location.href = AppConstants.Ehub_UI_API + 'docparser/#!/' + "landing";
		}
		if (submenuname == 'sourceManagement') {
			this.window.location.href = AppConstants.Ehub_UI_API + 'sourceManagement/';
		}
		if (submenuname == 'alertManagement') {
			var href = AppConstants.Ehub_UI_API + './element-new/dist/new/#/element/alert-management/alertsList';
			this.window.open(href , '_blank', 'noopener');
		}
		if (submenuname == 'systemMonitoring') {
			var href = AppConstants.Ehub_UI_API + './element-new/dist/new/#/element/system-monitoring/sources';
			this.window.open(href , '_blank', 'noopener');
    }
    if (submenuname == 'systemSettings') {
			var href = AppConstants.Ehub_UI_API + './element-new/dist/new/#/element/systemSettings';
			this.window.open(href, '_blank', 'noopener');
			// this.window.location.href = AppConstants.Ehub_UI_API + './element-new/dist/new/#/element/systemSettings';
		}
  }

  setdashboardname(data, dashboarDropDownMenuItems){/*jshint ignore:line*/
    if(data.search('#') != -1)
      {data =  data.split('#')[1];}
    if(data.search('/') != -1)
      {data = data.split('/')[1];}
    if(data.search(' ') == -1){
      if(data.match(/[A-Z]/)){
        var subStr = data.match(/[A-Z]/).toString();
        var index = data.indexOf(subStr);
        data = data.slice(0,index) + " " + data.slice(index);
      }
    }
    data = data.charAt(0).toUpperCase() + data.slice(1);
    if(data == dashboarDropDownMenuItems.moduleGroupName){
          this.dashboardname = dashboarDropDownMenuItems.moduleGroupName;
      return;
    }
    dashboarDropDownMenuItems.modules.filter((val)=>{
      if(data == val.moduleName){
        this.dashboardname = val.moduleGroupName;
      }
    })
  };

  public trackByModuleGroupName(_, item): string {
    return item.moduleGroupName;
  }
  public trackByModuleName(_, item): string {
    return item.moduleName;
  }
}
