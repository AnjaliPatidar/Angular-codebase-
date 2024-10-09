import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { CommonServicesService } from '../../../services/common-services.service';
import { AppConstants } from '@app/app.constant';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { UserSharedDataService } from '../../../../shared-services/data/user-shared-data.service';
import { WINDOW } from '../../../../core/tokens/window';

@Component({
	selector: 'app-utilities-panel',
	templateUrl: './utilities-panel.component.html',
	styleUrls: ['./utilities-panel.component.scss']
})
export class UtilitiesPanelComponent implements OnInit {
	 submenuOptions;
	 moduleList: any;
	 dashboardName: any = "Discover";
	 dashboardname = '';

	@Input() displayUtilityPanel: boolean;
	@Output() ParentHidePanel = new EventEmitter<boolean>();

	constructor(
		private commonService: CommonServicesService,
		private userSharedDataService: UserSharedDataService,
		@Inject(WINDOW) private readonly window: Window
	) { }
	ngOnInit() {
		this.commonService.getSubmenuOptions().subscribe((resp: any) => {
			if (resp) {
				resp.moduleGroups = resp.moduleGroups.sort(function (a, b) { return b.moduleGroupName < a.moduleGroupName ? 1 : -1 });
				this.submenuOptions = resp
				this.submenuOptions.moduleGroups = this.moveArray(resp.moduleGroups, 3, 4)
				this.submenuOptions.moduleGroups = this.moveArray(this.submenuOptions.moduleGroups, 0, 3)
				this.submenuOptions.moduleGroups = this.moveArray(this.submenuOptions.moduleGroups, 0, 1);

				this.submenuOptions.moduleGroups.map((val, key) => {
					val.modules.map((v, key) => {
					})
				})
				this.getcurrentLoggedUser();
				let response = GlobalConstants.permissionJson
				if (response) {
					for (const dashboardIndex in this.submenuOptions.moduleGroups) {
						if (dashboardIndex != 'moveArray') {
							response[0]['groups'].find(elem => {
								if (this.submenuOptions.moduleGroups[dashboardIndex]) {
									if (elem.hasOwnProperty(`${this.submenuOptions.moduleGroups[dashboardIndex]['moduleGroupName']}`)) {
										Object.assign(this.submenuOptions.moduleGroups[dashboardIndex], { ...this.submenuOptions.moduleGroups[dashboardIndex], permissionDetails: elem[`${this.submenuOptions.moduleGroups[dashboardIndex]['moduleGroupName']}`] })
										return elem
									}
								}
							});
							for (const nestedDashboardIndex in this.submenuOptions.moduleGroups[dashboardIndex]['modules']) {
								if (nestedDashboardIndex != 'moveArray') {
									const moduleName = response[0]['modules'].find(elem => {
										if (this.submenuOptions.moduleGroups[dashboardIndex]['modules'][nestedDashboardIndex]) {
											if (elem.hasOwnProperty(`${this.submenuOptions.moduleGroups[dashboardIndex]['modules'][nestedDashboardIndex]['moduleName']}`)) {
												Object.assign(this.submenuOptions.moduleGroups[dashboardIndex]['modules'][nestedDashboardIndex], { ...this.submenuOptions.moduleGroups[dashboardIndex]['modules'][nestedDashboardIndex], permissionDetails: elem[`${this.submenuOptions.moduleGroups[dashboardIndex]['modules'][nestedDashboardIndex]['moduleName']}`] })
												return elem
											}
										}
									});
								}
							}
						}
					}
				}

			}
		});

	}

	getcurrentLoggedUser() {
		this.userSharedDataService.getCurrentUserDetails()
			.subscribe(response => {
				if (response) {
					if (response && (response.firstName == "Admin" || response.firstName == "Analyst")) {
						this.submenuOptions.moduleGroups.map((val, key) => {

						});
					}
                 }
			});
	}


	/*
     * @purpose: Array index positioning
     * @created: 24 Jan 2019
     * @params: old_index(number), new_index(number)
     * @return: array
     * @author: Karunakar
     */
	moveArray = (arr, old_index, new_index) => {
		if (new_index >= arr.length) {
			var k = new_index - arr.length + 1;
			while (k--) {
				arr.push(undefined);
			}
		}
		arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
		return arr;
	};
	checkSubmenuDisable(toDisable) {

		return toDisable;
	}

	 /*
      * @purpose: Active submenu
      * @created: 5 oct 2017
      * @params: submenuname(string)
      * @return: no
      * @author: ankit
      */
	getSubMenu(submenuname, content, dashboardItemNames) {
		this.getSubMenuData(submenuname, content, dashboardItemNames, '', '');
		this.updateUserMenuData(submenuname, content, dashboardItemNames)
	}

	 /*
      * @purpose: Active submenu
      * @created: 19 Aug 19
      * @params: submenuname(string)
      * @return: no
      */
	updateUserMenuData(submenuname, content, dashboardItemNames) {
		var data = {
			"clicksCount": 1,
			"groupId": submenuname.moduleGroupId,
			"moduleId": submenuname.moduleId,
			"userId": submenuname.userId
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
		if (disable) {
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
			var href = AppConstants.Ehub_UI_API + 'element-new/dist/new/#/element/case-management/caseList';
			this.window.open(href, '_blank', 'noopener');
		}
		if (submenuname == 'auditTrail') {
			submenuname = 'auditTrail';
			this.window.location.href = AppConstants.Ehub_UI_API + '#/' + submenuname;
		}
		if (submenuname == 'entity') {
			submenuname = 'entity';
			var url: any = '';
			if (currentState == 'actCase') {
				url = AppConstants.Ehub_UI_API + submenuname + '/#!/company/' + caseSeedDetails.name + "?qId=" + caseSeedDetails.caseId;
			} else {
				url = AppConstants.Ehub_UI_API + submenuname + '/#!/company/oracle';
			}


		}
		if (submenuname == 'linkAnalysis') {
			var url: any = '';
			this.window.open(url, '_blank', 'noopener');
		}
		if (submenuname == 'fraud') {
			this.window.location.href = AppConstants.Ehub_UI_API + 'transactionIntelligence';
		}
		if (submenuname == 'userManagement') {
			var href = AppConstants.Ehub_UI_API + './element-new/dist/new/#/element/user-management';
			this.window.open(href, '_blank', 'noopener');
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
		}
		if (submenuname == 'decisionScoring') {

		}
		if (submenuname == 'orchestration') {
			var activityUrl = AppConstants.ACTIVITI_FE_PATH + 'id=' + encodeURIComponent(JSON.stringify(localStorage.getItem('ehubObject')));
			this.window.open((activityUrl), '_self');

		}
		if (submenuname == 'documentParsing') {
			this.window.location.href = AppConstants.Ehub_UI_API + 'docparser/#!/' + "landing";
		}
		if (submenuname == 'sourceManagement') {
			this.window.location.href = AppConstants.Ehub_UI_API + 'sourceManagement/';
		}
		if (submenuname == 'alertManagement') {
			var href = AppConstants.Ehub_UI_API + './element-new/dist/new/#/element/alert-management/alertsList';
			this.window.open(href, '_blank', 'noopener');
		}
		if (submenuname == 'systemMonitoring') {
			var href = AppConstants.Ehub_UI_API + './element-new/dist/new/#/element/system-monitoring/sources';
			this.window.open(href, '_blank', 'noopener');
		}
		if (submenuname == 'systemSettings') {
			var href = AppConstants.Ehub_UI_API + './element-new/dist/new/#/element/systemSettings';
			this.window.open(href, '_blank', 'noopener');

		}
		if (submenuname == 'listManagement') {
			var href = AppConstants.Ehub_UI_API + './element-new/dist/new/#/element/list-management';
			this.window.open(href, '_blank', 'noopener');
		}
	}

	setdashboardname(data, dashboarDropDownMenuItems) {
		if (data.search('#') != -1) { data = data.split('#')[1]; }
		if (data.search('/') != -1) { data = data.split('/')[1]; }
		if (data.search(' ') == -1) {
			if (data.match(/[A-Z]/)) {
				var subStr = data.match(/[A-Z]/).toString();
				var index = data.indexOf(subStr);
				data = data.slice(0, index) + " " + data.slice(index);
			}
		}
		data = data.charAt(0).toUpperCase() + data.slice(1);
		if (data == dashboarDropDownMenuItems.moduleGroupName) {
			this.dashboardname = dashboarDropDownMenuItems.moduleGroupName;
			return;
		}
		dashboarDropDownMenuItems.modules.filter((val) => {
			if (data == val.moduleName) {
				this.dashboardname = val.moduleGroupName;
			}
		})
	};
	hidePanel() {
		this.displayUtilityPanel = false;
		this.ParentHidePanel.emit(this.displayUtilityPanel);
	}
	getDashboardName(_dashboardName, modulelist) {
		this.moduleList = modulelist;
		this.dashboardName = _dashboardName;
	}

  public trackByModuleGroupName(_, item): string {
    return item.moduleGroupName;
  }

  public trackByModuleName(_, item): string {
    return item.moduleName;
  }
}
