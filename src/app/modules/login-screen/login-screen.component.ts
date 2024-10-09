import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppConstants} from '@app/app.constant';
import {GlobalConstants} from '@app/common-modules/constants/global.constants';
import {CommonServicesService} from '@app/common-modules/services/common-services.service';
import {TranslateService} from '@ngx-translate/core';
import {SharedServicesService} from '@app/shared-services/shared-services.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {AuthenticationService} from '@app/modules/login-screen/authentication.service';
import { WINDOW } from '../../core/tokens/window';

@Component({
    selector: 'app-login-screen-component',
    templateUrl: './login-screen.component.html',
    styleUrls: ['./login-screen.component.scss']

})
export class LoginScreenComponent implements OnInit {

    view: View = 'LOGIN';

    settingsLoaded = false;

    gettingUserInfo = false;

    problemCode: string;

    logoImage: SafeResourceUrl = '../../../assets/images/logo-ele.webp';

    constructor(
        private route: ActivatedRoute,
        private authService: AuthenticationService,
        private commonService: CommonServicesService,
        private translateService: TranslateService,
        private sharedService:SharedServicesService,
        private sanitizer: DomSanitizer,
        @Inject(WINDOW) private readonly window: Window
    ) { }

    ngOnInit() {
        this.getSettings();
        this.route.queryParams.subscribe(params => {
            var mode = params['mode'];
            if (mode) {
                switch (mode) {
                    case 'logout': this.view = 'LOGOUT'; break;
                    case 'error': this.view = 'ERROR'; break;
                    case 'problem': {
                        var problemCode = params['reason'];
                        this.view = 'PROBLEM';
                        this.problemCode = problemCode;
                        break;
                    }
                    case 'external': {
                        var token = params['token'];
                        localStorage.setItem("ehubObject", JSON.stringify({token : token}));
                        AppConstants.Ehubui_token = token;
                        this.gettingUserInfo = true;
                        this.authService.getUserInfo(token).subscribe({
                            next: (response) => {
                                localStorage.setItem("ehubObject", JSON.stringify(response));
                                AppConstants.Ehubui_token = response['token'];
                                this.window.location.href = (response as any)['defaultUrl'];
                            },
                            error: (error) => {
                                this.gettingUserInfo = false;
                                this.view = 'ERROR';
                            }
                        });
                        break;
                    }
                }
            }
        });
    }

    changeView(view: View) {
        this.view = view;
    }

    getSettings(): void {
        this.commonService.getBasicSettings().subscribe(settings => {
            try {
                if (settings && settings.data) {
                    let settingsList = JSON.parse(settings.data);
                    let language = 'English';
                    for (let setting of settingsList) {
                        switch (setting.name) {
                            case 'Languages':
                                language = setting.defaultValue;
                                break;
                            case 'Company Logo':
                                if (setting.defaultValue != null && setting.defaultValue != '') {
                                    this.logoImage = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
                                        + setting.defaultValue);
                                }
                                break;
                        }
                    }
                    this.getLanguageData(language);
                }
            } catch (e) {
                this.sharedService.showFlashMessage(
                    'Could not load settings, please contact the administrator',
                    'danger'
                );
            }
        });
    }

    getLanguageData(language: any): void {
        const key: 'en' | 'de' = this.commonService.get_language_name(language);
        const filename: string = key + '_login.json';
        const param: any = {
            fileName: filename,
            languageName: language
        };

        const url: string =
            AppConstants.Ehub_Rest_API +
            'fileStorage/downloadFileByLanguageAndFileName?fileName=' +
            param.fileName +
            '&languageName=' +
            param.languageName;

        this.translateService.use(url).subscribe(
            (res) => {
                this.commonService.sendLanguageJsonToComponents(res);
                this.getModuleJsonData(res);
                this.settingsLoaded = true;
            },
            (error) => {
                this.settingsLoaded = true;
                if (error.status === 404 && key === 'de') {
                    this.sharedService.showFlashMessage(
                        'german file not found, loading default language..',
                        'danger'
                    );
                    this.getLanguageData('english');
                } else if (error.status === 404 && key === 'en') {
                    setTimeout(() => {
                        this.sharedService.showFlashMessage(
                            'english file ' + error.url + ' is missing',
                            'danger'
                        );
                    }, 3000);
                }
            }
        );
    }

    getModuleJsonData(translateResponse: any): void {
        GlobalConstants.languageJson = translateResponse;
        this.commonService.sendLanguageJsonToComponents(translateResponse);
    }

    showVisuals() {
        return this.settingsLoaded && !this.gettingUserInfo;
    }
}

export type View = 'LOGIN' | 'PASSWORD_RECOVERY' | 'RECOVERY_SUCCESS' | 'SUCCESS' | 'ERROR' | 'LOGOUT' | 'PROBLEM';
