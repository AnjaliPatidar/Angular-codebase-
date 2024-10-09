import { __awaiter } from "tslib";
import { Inject, Injectable, Optional } from '@angular/core';
import { InteractionType, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { getApp, getApps, initializeApp } from '@firebase/app';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from '@firebase/auth';
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { ReplaySubject } from 'rxjs';
import * as i0 from "@angular/core";
export class ProviderAuthenticationService {
    constructor(config) {
        this.config = config;
        this.accountSubject = new ReplaySubject(1);
        this.loadConfiguration(config);
        window.addEventListener('load', () => __awaiter(this, void 0, void 0, function* () {
            this.loadEventListener();
        }));
    }
    signIn() {
        var _a, _b, _c;
        try {
            switch ((_a = this.providerConfiguration) === null || _a === void 0 ? void 0 : _a.provider) {
                case EProviders.AZURE:
                    return new Promise((resolve, reject) => {
                        this.getApplication().loginPopup().then((authenticationResult) => {
                            authenticationResult !== null ? resolve(this.getUser(authenticationResult)) : reject();
                        });
                    });
                case EProviders.FIREBASE:
                    return new Promise((resolve, reject) => {
                        signInWithPopup(this.getAuthentication(), new GoogleAuthProvider()).then((userCredential) => {
                            userCredential !== null ? resolve(this.getUser(userCredential)) : reject();
                        });
                    });
                case EProviders.COGNITO:
                    return new Promise((resolve, reject) => {
                        try {
                            const uri = `${this.providerConfiguration.domainUrl}/login?client_id=${this.providerConfiguration.userPoolWebClientId}&response_type=${this.providerConfiguration.responseType}&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=${this.providerConfiguration.redirectUrl}`;
                            window.location.assign(uri);
                            Promise.resolve(this.getUser({}));
                        }
                        catch (error) {
                            reject(error);
                        }
                    });
                default:
                    throw new Error(`${(_b = this.providerConfiguration) === null || _b === void 0 ? void 0 : _b.provider} doesnt have an signIn option!`);
            }
        }
        catch (error) {
            throw new Error(`${(_c = this.providerConfiguration) === null || _c === void 0 ? void 0 : _c.provider} getting error when signIn, Error : ${error}!`);
        }
    }
    signInWithCredentials(username, password) {
        var _a, _b, _c;
        try {
            switch ((_a = this.providerConfiguration) === null || _a === void 0 ? void 0 : _a.provider) {
                case EProviders.FIREBASE:
                    return new Promise((resolve, reject) => {
                        signInWithEmailAndPassword(this.getAuthentication(), username, password).then((userCredential) => {
                            userCredential !== null ? resolve(this.getUser(userCredential)) : reject();
                        });
                    });
                case EProviders.COGNITO:
                    const user = new CognitoUser({ Username: username, Pool: this.getApplication() });
                    const authenticationDetails = new AuthenticationDetails({ Username: username, Password: password });
                    return new Promise((resolve, reject) => user.authenticateUser(authenticationDetails, {
                        onSuccess: result => resolve(this.getUser(result)),
                        onFailure: err => reject(err)
                    }));
                default:
                    throw new Error(`${(_b = this.providerConfiguration) === null || _b === void 0 ? void 0 : _b.provider} doesnt have an signInWithCredentials option!`);
            }
        }
        catch (error) {
            throw new Error(`${(_c = this.providerConfiguration) === null || _c === void 0 ? void 0 : _c.provider} getting error when signInWithCredentials, Error : ${error}!`);
        }
    }
    signOut() {
        var _a, _b, _c;
        try {
            switch ((_a = this.providerConfiguration) === null || _a === void 0 ? void 0 : _a.provider) {
                case EProviders.AZURE:
                    return new Promise((resolve, reject) => {
                        this.getApplication().logoutRedirect({}).then(() => {
                            this.clearActiveUser();
                            resolve();
                        }).catch((error) => {
                            reject(error);
                        });
                    });
                case EProviders.FIREBASE:
                    return new Promise((resolve, reject) => {
                        signOut(this.getAuthentication()).then(() => {
                            this.clearActiveUser();
                            resolve();
                        }).catch((error) => {
                            reject(error);
                        });
                    });
                case EProviders.COGNITO:
                    return new Promise((resolve, reject) => {
                        this.getApplication().getCurrentUser().signOut();
                        this.clearActiveUser();
                        resolve();
                    });
                default:
                    throw new Error(`${(_b = this.providerConfiguration) === null || _b === void 0 ? void 0 : _b.provider} doesnt have an signOut option!`);
            }
        }
        catch (error) {
            throw new Error(`${(_c = this.providerConfiguration) === null || _c === void 0 ? void 0 : _c.provider} getting error when signOut, Error : ${error}!`);
        }
    }
    getCognitoAccessToken() {
        let accessToken = '';
        if (this.providerConfiguration.provider === EProviders.COGNITO && this.providerConfiguration.responseType === 'token' && window.location.href.indexOf("access_token") != -1) {
            let urlParams = window.location.hash.replace("#", "").split('&');
            urlParams.forEach(param => {
                if (param.startsWith("access_token") && param.length > 1) {
                    accessToken = param.replace("access_token=", "");
                }
            });
        }
        return accessToken;
    }
    getActiveUser() {
        return new Promise((resolve, reject) => {
            if (this.retrieveToken() !== '') {
                resolve(this.activeUser);
            }
            reject(`No user is currently logged in the application`);
        });
    }
    interceptorConfigFactory() {
        var _a;
        switch ((_a = this.providerConfiguration) === null || _a === void 0 ? void 0 : _a.provider) {
            case EProviders.AZURE:
                const protectedResourceMap = new Map();
                protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', [
                    'user.read',
                ]);
                return {
                    interactionType: InteractionType.Redirect,
                    protectedResourceMap,
                };
            case EProviders.FIREBASE:
            case EProviders.COGNITO:
            default:
                return null;
        }
    }
    guardConfigFactory() {
        var _a;
        switch ((_a = this.providerConfiguration) === null || _a === void 0 ? void 0 : _a.provider) {
            case EProviders.AZURE:
                return {
                    interactionType: InteractionType.Redirect,
                    authRequest: {
                        scopes: [`${this.providerConfiguration.auth.clientId}/.default`],
                    },
                    loginFailedRoute: this.providerConfiguration.login_failed_route,
                };
            case EProviders.FIREBASE:
            case EProviders.COGNITO:
            default:
                return null;
        }
    }
    loadConfiguration(configuration) {
        if (configuration !== undefined) {
            this.providerConfiguration = this.getConfiguration(configuration);
        }
    }
    loadEventListener() {
        var _a, _b, _c;
        try {
            switch ((_a = this.providerConfiguration) === null || _a === void 0 ? void 0 : _a.provider) {
                case EProviders.AZURE:
                    return new Promise((resolve, reject) => {
                        this.getApplication().handleRedirectPromise().then((authenticationResult) => {
                            authenticationResult !== null ? resolve(this.getUser(authenticationResult)) : reject();
                        });
                    });
                case EProviders.FIREBASE:
                    return new Promise((resolve, reject) => {
                        this.getAuthentication().onAuthStateChanged((user) => {
                            if (user !== null) {
                                resolve(this.getUser(user));
                            }
                        });
                    });
                case EProviders.COGNITO:
                    return Promise.resolve(this.getUser({}));
                default:
                    throw new Error(`${(_b = this.providerConfiguration) === null || _b === void 0 ? void 0 : _b.provider} doesnt have an load event option!`);
            }
        }
        catch (error) {
            throw new Error(`${(_c = this.providerConfiguration) === null || _c === void 0 ? void 0 : _c.provider} getting error when listen the load Event, Error : ${error}!`);
        }
    }
    getConfiguration(configuration) {
        var _a, _b;
        try {
            configuration.tokenName = configuration.tokenName !== undefined && configuration.tokenName !== null ? configuration.tokenName : 'auth_token';
            switch (configuration.provider) {
                case EProviders.AZURE:
                    return {
                        auth: configuration.auth,
                        cache: configuration.cache,
                        provider: configuration.provider,
                        system: {
                            loggerOptions: {
                                loggerCallback: (level, message, containsPii) => {
                                    if (!containsPii) {
                                        this.logger(level, message);
                                    }
                                    return;
                                },
                            },
                        },
                    };
                case EProviders.FIREBASE:
                case EProviders.COGNITO:
                    return configuration;
                default:
                    throw new Error(`no configuration found for given provider: ${(_a = this.providerConfiguration) === null || _a === void 0 ? void 0 : _a.provider}`);
            }
        }
        catch (error) {
            throw new Error(`${(_b = this.providerConfiguration) === null || _b === void 0 ? void 0 : _b.provider} getting error when configure, Error : ${error}!`);
        }
    }
    logger(level, message) {
        switch (level) {
            case LogLevel.Error:
                console.error(message);
                break;
            case LogLevel.Info:
                console.info(message);
                break;
            case LogLevel.Verbose:
                console.debug(message);
                break;
            case LogLevel.Warning:
                console.warn(message);
                break;
            default:
                console.log(message);
                break;
        }
    }
    getApplication() {
        var _a, _b, _c;
        try {
            switch ((_a = this.providerConfiguration) === null || _a === void 0 ? void 0 : _a.provider) {
                case EProviders.AZURE:
                    if (this.application === undefined) {
                        this.application = new PublicClientApplication(this.providerConfiguration);
                    }
                    return this.application;
                case EProviders.FIREBASE:
                    const ourApp = getApps().filter((app) => {
                        return app.name === 'auth-app';
                    });
                    return ourApp.length === 1 ? getApp('auth-app') : initializeApp(this.providerConfiguration, 'auth-app');
                case EProviders.COGNITO:
                    if (this.application === undefined) {
                        this.application = new CognitoUserPool({
                            UserPoolId: this.providerConfiguration.userPoolId,
                            ClientId: this.providerConfiguration.userPoolWebClientId
                        });
                    }
                    return this.application;
                default:
                    throw new Error(`no application found for provider - ${(_b = this.providerConfiguration) === null || _b === void 0 ? void 0 : _b.provider}`);
            }
        }
        catch (error) {
            throw new Error(`${(_c = this.providerConfiguration) === null || _c === void 0 ? void 0 : _c.provider} getting error when initializing the application, Error : ${error}!`);
        }
    }
    getAuthentication() {
        var _a, _b, _c;
        try {
            switch ((_a = this.providerConfiguration) === null || _a === void 0 ? void 0 : _a.provider) {
                case EProviders.FIREBASE:
                    return getAuth(this.getApplication());
                default:
                    throw new Error(`no authentication found for application, provider - ${(_b = this.providerConfiguration) === null || _b === void 0 ? void 0 : _b.provider}`);
            }
        }
        catch (error) {
            throw new Error(`${(_c = this.providerConfiguration) === null || _c === void 0 ? void 0 : _c.provider} getting error when getting auth for the application, Error : ${error}!`);
        }
    }
    getUser(result) {
        var _a, _b;
        const user = {
            provider: (_a = this.providerConfiguration) === null || _a === void 0 ? void 0 : _a.provider,
            response: result,
        };
        if (result !== null || result !== undefined) {
            switch ((_b = this.providerConfiguration) === null || _b === void 0 ? void 0 : _b.provider) {
                case EProviders.AZURE:
                    user.userName = result.account.username;
                    user.authToken = result.accessToken;
                    break;
                case EProviders.FIREBASE:
                    if (result.user != null) {
                        user.authToken = result.user.accessToken;
                        user.userName = result.user.displayName;
                    }
                    break;
                case EProviders.COGNITO:
                    if (this.providerConfiguration.responseType === 'token') {
                        user.authToken = this.getCognitoAccessToken();
                    }
                    ;
                    const cognitoUser = this.getApplication().getCurrentUser();
                    if (cognitoUser !== null) {
                        cognitoUser.getSession((error, session) => {
                            if (error) {
                                throw error;
                            }
                            else {
                                user.authToken = session.getAccessToken().getJwtToken();
                            }
                        });
                        user.userName = cognitoUser.getUsername();
                        user.response = cognitoUser;
                    }
            }
            if (user !== null) {
                this.accountSubject.next(user);
                this.persistToken(user.authToken || '');
            }
        }
        this.activeUser = user;
        return user;
    }
    persistToken(token) {
        localStorage.setItem(this.providerConfiguration.tokenName, token);
    }
    retrieveToken() {
        return localStorage.getItem(this.providerConfiguration.tokenName);
    }
    clearActiveUser() {
        var _a;
        const emptyUser = {
            provider: (_a = this.providerConfiguration) === null || _a === void 0 ? void 0 : _a.provider,
        };
        this.accountSubject.next(emptyUser);
        this.accountSubject.unsubscribe();
        this.activeUser = null;
        localStorage.removeItem(this.providerConfiguration.tokenName);
    }
    ngOnDestroy() {
        this.clearActiveUser();
    }
}
ProviderAuthenticationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: ProviderAuthenticationService, deps: [{ token: 'config', optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
ProviderAuthenticationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: ProviderAuthenticationService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: ProviderAuthenticationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: ['config']
                }, {
                    type: Optional
                }] }]; } });
export var EProviders;
(function (EProviders) {
    EProviders[EProviders["AZURE"] = 0] = "AZURE";
    EProviders[EProviders["FIREBASE"] = 1] = "FIREBASE";
    EProviders[EProviders["COGNITO"] = 2] = "COGNITO";
})(EProviders || (EProviders = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXItYXV0aGVudGljYXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2JzdC1hbmd1bGFyLWF1dGgvc3JjL2xpYi9wcm92aWRlci1hdXRoZW50aWNhdGlvbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBYSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDeEUsT0FBTyxFQUF3QixlQUFlLEVBQUUsUUFBUSxFQUFFLHVCQUF1QixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDL0csT0FBTyxFQUFlLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzVFLE9BQU8sRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsMEJBQTBCLEVBQUUsZUFBZSxFQUFFLE9BQU8sRUFBd0IsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6SSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBc0IsTUFBTSw0QkFBNEIsQ0FBQztBQUNySCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQUtyQyxNQUFNLE9BQU8sNkJBQTZCO0lBTXhDLFlBQ3VDLE1BQVk7UUFBWixXQUFNLEdBQU4sTUFBTSxDQUFNO1FBTG5ELG1CQUFjLEdBQUcsSUFBSSxhQUFhLENBQVEsQ0FBQyxDQUFDLENBQUM7UUFPM0MsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsR0FBUyxFQUFFO1lBQ3pDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQzNCLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsTUFBTTs7UUFDSixJQUFJO1lBQ0YsUUFBUSxNQUFBLElBQUksQ0FBQyxxQkFBcUIs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QVcsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLFlBQVksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3pCLENBQUM7OzJIQW5XVSw2QkFBNkIsa0JBTzlCLFFBQVE7K0hBUFAsNkJBQTZCLGNBRjVCLE1BQU07NEZBRVAsNkJBQTZCO2tCQUh6QyxVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7MEJBUUksTUFBTTsyQkFBQyxRQUFROzswQkFBRyxRQUFROztBQXdaL0IsTUFBTSxDQUFOLElBQVksVUFJWDtBQUpELFdBQVksVUFBVTtJQUNwQiw2Q0FBSyxDQUFBO0lBQ0wsbURBQVEsQ0FBQTtJQUNSLGlEQUFPLENBQUE7QUFDVCxDQUFDLEVBSlcsVUFBVSxLQUFWLFVBQVUsUUFJckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9uRGVzdHJveSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEF1dGhlbnRpY2F0aW9uUmVzdWx0LCBJbnRlcmFjdGlvblR5cGUsIExvZ0xldmVsLCBQdWJsaWNDbGllbnRBcHBsaWNhdGlvbiB9IGZyb20gJ0BhenVyZS9tc2FsLWJyb3dzZXInO1xuaW1wb3J0IHsgRmlyZWJhc2VBcHAsIGdldEFwcCwgZ2V0QXBwcywgaW5pdGlhbGl6ZUFwcCB9IGZyb20gJ0BmaXJlYmFzZS9hcHAnO1xuaW1wb3J0IHsgZ2V0QXV0aCwgR29vZ2xlQXV0aFByb3ZpZGVyLCBzaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZCwgc2lnbkluV2l0aFBvcHVwLCBzaWduT3V0LCBVc2VyLCBVc2VyQ3JlZGVudGlhbCB9IGZyb20gJ0BmaXJlYmFzZS9hdXRoJztcbmltcG9ydCB7IEF1dGhlbnRpY2F0aW9uRGV0YWlscywgQ29nbml0b1VzZXIsIENvZ25pdG9Vc2VyUG9vbCwgQ29nbml0b1VzZXJTZXNzaW9uIH0gZnJvbSAnYW1hem9uLWNvZ25pdG8taWRlbnRpdHktanMnO1xuaW1wb3J0IHsgUmVwbGF5U3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgUHJvdmlkZXJBdXRoZW50aWNhdGlvblNlcnZpY2UgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcm92aWRlckNvbmZpZ3VyYXRpb246IGFueTtcbiAgYWNjb3VudFN1YmplY3QgPSBuZXcgUmVwbGF5U3ViamVjdDxJVXNlcj4oMSk7XG4gIGFjdGl2ZVVzZXI6IGFueTtcbiAgYXBwbGljYXRpb246IGFueTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KCdjb25maWcnKSBAT3B0aW9uYWwoKSBwdWJsaWMgY29uZmlnPzogYW55XG4gICkge1xuICAgIHRoaXMubG9hZENvbmZpZ3VyYXRpb24oY29uZmlnKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHRoaXMubG9hZEV2ZW50TGlzdGVuZXIoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNpZ25JbigpOiBQcm9taXNlPElVc2VyPiB7XG4gICAgdHJ5IHtcbiAgICAgIHN3aXRjaCAodGhpcy5wcm92aWRlckNvbmZpZ3VyYXRpb24/LnByb3ZpZGVyKSB7XG4gICAgICAgIGNhc2UgRVByb3ZpZGVycy5BWlVSRTpcbiAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nZXRBcHBsaWNhdGlvbigpLmxvZ2luUG9wdXAoKS50aGVuKChhdXRoZW50aWNhdGlvblJlc3VsdDogQXV0aGVudGljYXRpb25SZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgYXV0aGVudGljYXRpb25SZXN1bHQgIT09IG51bGwgPyByZXNvbHZlKHRoaXMuZ2V0VXNlcihhdXRoZW50aWNhdGlvblJlc3VsdCkpOiByZWplY3QoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICBjYXNlIEVQcm92aWRlcnMuRklSRUJBU0U6XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNpZ25JbldpdGhQb3B1cCh0aGlzLmdldEF1dGhlbnRpY2F0aW9uKCksIG5ldyBHb29nbGVBdXRoUHJvdmlkZXIoKSkudGhlbigodXNlckNyZWRlbnRpYWw6IFVzZXJDcmVkZW50aWFsKSA9PiB7XG4gICAgICAgICAgICAgIHVzZXJDcmVkZW50aWFsICE9PSBudWxsID8gcmVzb2x2ZSh0aGlzLmdldFVzZXIodXNlckNyZWRlbnRpYWwpKTogcmVqZWN0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgY2FzZSBFUHJvdmlkZXJzLkNPR05JVE86XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNvbnN0IHVyaSA9IGAke3RoaXMucHJvdmlkZXJDb25maWd1cmF0aW9uLmRvbWFpblVybH0vbG9naW4/Y2xpZW50X2lkPSR7dGhpcy5wcm92aWRlckNvbmZpZ3VyYXRpb24udXNlclBvb2xXZWJDbGllbnRJZH0mcmVzcG9uc2VfdHlwZT0ke3RoaXMucHJvdmlkZXJDb25maWd1cmF0aW9uLnJlc3BvbnNlVHlwZX0mc2NvcGU9YXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4rZW1haWwrb3BlbmlkK3Byb2ZpbGUmcmVkaXJlY3RfdXJpPSR7dGhpcy5wcm92aWRlckNvbmZpZ3VyYXRpb24ucmVkaXJlY3RVcmx9YDtcbiAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbih1cmkpO1xuICAgICAgICAgICAgICBQcm9taXNlLnJlc29sdmUodGhpcy5nZXRVc2VyKHt9KSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLnByb3ZpZGVyQ29uZmlndXJhdGlvbj8ucHJvdmlkZXJ9IGRvZXNudCBoYXZlIGFuIHNpZ25JbiBvcHRpb24hYCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLnByb3ZpZGVyQ29uZmlndXJhdGlvbj8ucHJvdmlkZXJ9IGdldHRpbmcgZXJyb3Igd2hlbiBzaWduSW4sIEVycm9yIDogJHtlcnJvcn0hYCk7XG4gICAgfVxuICB9XG5cbiAgc2lnbkluV2l0aENyZWRlbnRpYWxzKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPElVc2VyPiB7XG4gICAgdHJ5IHtcbiAgICAgIHN3aXRjaCAodGhpcy5wcm92aWRlckNvbmZpZ3VyYXRpb24/LnByb3ZpZGVyKSB7XG4gICAgICAgIGNhc2UgRVByb3ZpZGVycy5GSVJFQkFTRTpcbiAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQodGhpcy5nZXRBdXRoZW50aWNhdGlvbigpLCB1c2VybmFtZSwgcGFzc3dvcmQpLnRoZW4oKHVzZXJDcmVkZW50aWFsOiBVc2VyQ3JlZGVudGlhbCkgPT4ge1xuICAgICAgICAgICAgICB1c2VyQ3JlZGVudGlhbCAhPT0gbnVsbCA/IHJlc29sdmUodGhpcy5nZXRVc2VyKHVzZXJDcmVkZW50aWFsKSkgOiByZWplY3QoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNhc2UgRVByb3ZpZGVycy5DT0dOSVRPOlxuICAgICAgICAgICAgY29uc3QgdXNlciA9IG5ldyBDb2duaXRvVXNlcih7IFVzZXJuYW1lOiB1c2VybmFtZSwgUG9vbDogdGhpcy5nZXRBcHBsaWNhdGlvbigpIH0pO1xuICAgICAgICAgICAgY29uc3QgYXV0aGVudGljYXRpb25EZXRhaWxzID0gbmV3IEF1dGhlbnRpY2F0aW9uRGV0YWlscyh7IFVzZXJuYW1lOiB1c2VybmFtZSwgUGFzc3dvcmQ6IHBhc3N3b3JkIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICAgICAgICAgIHVzZXIuYXV0aGVudGljYXRlVXNlcihhdXRoZW50aWNhdGlvbkRldGFpbHMsIHtcbiAgICAgICAgICAgICAgICBvblN1Y2Nlc3M6IHJlc3VsdCA9PiByZXNvbHZlKHRoaXMuZ2V0VXNlcihyZXN1bHQpKSxcbiAgICAgICAgICAgICAgICBvbkZhaWx1cmU6IGVyciA9PiByZWplY3QoZXJyKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIGAke3RoaXMucHJvdmlkZXJDb25maWd1cmF0aW9uPy5wcm92aWRlcn0gZG9lc250IGhhdmUgYW4gc2lnbkluV2l0aENyZWRlbnRpYWxzIG9wdGlvbiFgKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCBgJHt0aGlzLnByb3ZpZGVyQ29uZmlndXJhdGlvbj8ucHJvdmlkZXJ9IGdldHRpbmcgZXJyb3Igd2hlbiBzaWduSW5XaXRoQ3JlZGVudGlhbHMsIEVycm9yIDogJHtlcnJvcn0hYCk7XG4gICAgfVxuICB9XG5cbiAgc2lnbk91dCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cnkge1xuICAgICAgc3dpdGNoICh0aGlzLnByb3ZpZGVyQ29uZmlndXJhdGlvbj8ucHJvdmlkZXIpIHtcbiAgICAgICAgY2FzZSBFUHJvdmlkZXJzLkFaVVJFOlxuICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdldEFwcGxpY2F0aW9uKCkubG9nb3V0UmVkaXJlY3Qoe30pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmNsZWFyQWN0aXZlVXNlcigpO1xuICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIGNhc2UgRVByb3ZpZGVycy5GSVJFQkFTRTpcbiAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc2lnbk91dCh0aGlzLmdldEF1dGhlbnRpY2F0aW9uKCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmNsZWFyQWN0aXZlVXNlcigpO1xuICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICBjYXNlIEVQcm92aWRlcnMuQ09HTklUTzpcbiAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nZXRBcHBsaWNhdGlvbigpLmdldEN1cnJlbnRVc2VyKCkuc2lnbk91dCgpO1xuICAgICAgICAgICAgdGhpcy5jbGVhckFjdGl2ZVVzZXIoKTtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpcy5wcm92aWRlckNvbmZpZ3VyYXRpb24/LnByb3ZpZGVyfSBkb2VzbnQgaGF2ZSBhbiBzaWduT3V0IG9wdGlvbiFgKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMucHJvdmlkZXJDb25maWd1cmF0aW9uPy5wcm92aWRlcn0gZ2V0dGluZyBlcnJvciB3aGVuIHNpZ25PdXQsIEVycm9yIDogJHtlcnJvcn0hYCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0Q29nbml0b0FjY2Vzc1Rva2VuKCk6IHN0cmluZyB7XG4gICAgbGV0IGFjY2Vzc1Rva2VuID0gJyc7XG4gICAgaWYodGhpcy5wcm92aWRlckNvbmZpZ3VyYXRpb24ucHJvdmlkZXIgPT09IEVQcm92aWRlcnMuQ09HTklUTyAmJiB0aGlzLnByb3ZpZGVyQ29uZmlndXJhdGlvbi5yZXNwb25zZVR5cGUgPT09ICd0b2tlbicgJiYgd2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZihcImFjY2Vzc190b2tlblwiKSAhPSAtMSApIHtcbiAgICAgIGxldCB1cmxQYXJhbXMgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKFwiI1wiLFwiXCIpLnNwbGl0KCcmJyk7XG4gICAgICB1cmxQYXJhbXMuZm9yRWFjaChwYXJhbSA9PiB7XG4gICAgICAgIGlmKHBhcmFtLnN0YXJ0c1dpdGgoXCJhY2Nlc3NfdG9rZW5cIikgJiYgcGFyYW0ubGVuZ3RoID4gMSkge1xuICAgICAgICAgIGFjY2Vzc1Rva2VuID0gcGFyYW0ucmVwbGFjZShcImFjY2Vzc190b2tlbj1cIiwgXCJcIilcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBhY2Nlc3NUb2tlbjtcbiAgfVxuXG4gIGdldEFjdGl2ZVVzZXIoKTogUHJvbWlzZTxJVXNlcj4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAodGhpcy5yZXRyaWV2ZVRva2VuKCkgIT09ICcnKSB7XG4gICAgICAgIHJlc29sdmUodGhpcy5hY3RpdmVVc2VyKTtcbiAgICAgIH1cbiAgICAgIHJlamVjdChgTm8gdXNlciBpcyBjdXJyZW50bHkgbG9nZ2VkIGluIHRoZSBhcHBsaWNhdGlvbmApO1xuICAgIH0pO1xuICB9XG5cbiAgaW50ZXJjZXB0b3JDb25maWdGYWN0b3J5KCk6IHVua25vd24ge1xuICAgIHN3aXRjaCAodGhpcy5wcm92aWRlckNvbmZpZ3VyYXRpb24/LnByb3ZpZGVyKSB7XG4gICAgICBjYXNlIEVQcm92aWRlcnMuQVpVUkU6XG4gICAgICAgIGNvbnN0IHByb3RlY3RlZFJlc291cmNlTWFwID0gbmV3IE1hcDxzdHJpbmcsIEFycmF5PHN0cmluZz4+KCk7XG4gICAgICAgIHByb3RlY3RlZFJlc291cmNlTWFwLnNldCgnaHR0cHM6Ly9ncmFwaC5taWNyb3NvZnQuY29tL3YxLjAvbWUnLCBbXG4gICAgICAgICAgJ3VzZXIucmVhZCcsXG4gICAgICAgIF0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGludGVyYWN0aW9uVHlwZTogSW50ZXJhY3Rpb25UeXBlLlJlZGlyZWN0LFxuICAgICAgICAgIHByb3RlY3RlZFJlc291cmNlTWFwLFxuICAgICAgICB9O1xuICAgICAgY2FzZSBFUHJvdmlkZXJzLkZJUkVCQVNFOlxuICAgICAgY2FzZSBFUHJvdmlkZXJzLkNPR05JVE86XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBndWFyZENvbmZpZ0ZhY3RvcnkoKTogdW5rbm93biB7XG4gICAgc3dpdGNoICh0aGlzLnByb3ZpZGVyQ29uZmlndXJhdGlvbj8ucHJvdmlkZXIpIHtcbiAgICAgIGNhc2UgRVByb3ZpZGVycy5BWlVSRTpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpbnRlcmFjdGlvblR5cGU6IEludGVyYWN0aW9uVHlwZS5SZWRpcmVjdCxcbiAgICAgICAgICBhdXRoUmVxdWVzdDoge1xuICAgICAgICAgICAgc2NvcGVzOiBbYCR7dGhpcy5wcm92aWRlckNvbmZpZ3VyYXRpb24uYXV0aC5jbGllbnRJZH0vLmRlZmF1bHRgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGxvZ2luRmFpbGVkUm91dGU6IHRoaXMucHJvdmlkZXJDb25maWd1cmF0aW9uLmxvZ2luX2ZhaWxlZF9yb3V0ZSxcbiAgICAgICAgfTtcbiAgICAgIGNhc2UgRVByb3ZpZGVycy5GSVJFQkFTRTpcbiAgICAgIGNhc2UgRVByb3ZpZGVycy5DT0dOSVRPOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIFxuICBwcml2YXRlIGxvYWRDb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb246IGFueSl7XG4gICAgaWYgKGNvbmZpZ3VyYXRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5wcm92aWRlckNvbmZpZ3VyYXRpb24gPSB0aGlzLmdldENvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBsb2FkRXZlbnRMaXN0ZW5lcigpOiBQcm9taXNlPElVc2VyPiB7XG4gICAgdHJ5IHtcbiAgICAgIHN3aXRjaCAodGhpcy5wcm92aWRlckNvbmZpZ3VyYXRpb24/LnByb3ZpZGVyKSB7XG4gICAgICAgIGNhc2UgRVByb3ZpZGVycy5BWlVSRTpcbiAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nZXRBcHBsaWNhdGlvbigpLmhhbmRsZVJlZGlyZWN0UHJvbWlzZSgpLnRoZW4oKGF1dGhlbnRpY2F0aW9uUmVzdWx0OiBBdXRoZW50aWNhdGlvblJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICBhdXRoZW50aWNhdGlvblJlc3VsdCAhPT0gbnVsbCA/IHJlc29sdmUodGhpcy5nZXRVc2VyKGF1dGhlbnRpY2F0aW9uUmVzdWx0KSk6IHJlamVjdCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIGNhc2UgRVByb3ZpZGVycy5GSVJFQkFTRTpcbiAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nZXRBdXRoZW50aWNhdGlvbigpLm9uQXV0aFN0YXRlQ2hhbmdlZCgodXNlcjogVXNlciB8IG51bGwpID0+IHtcbiAgICAgICAgICAgICAgaWYodXNlciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5nZXRVc2VyKHVzZXIpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIGNhc2UgRVByb3ZpZGVycy5DT0dOSVRPOlxuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5nZXRVc2VyKHt9KSk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMucHJvdmlkZXJDb25maWd1cmF0aW9uPy5wcm92aWRlcn0gZG9lc250IGhhdmUgYW4gbG9hZCBldmVudCBvcHRpb24hYCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLnByb3ZpZGVyQ29uZmlndXJhdGlvbj8ucHJvdmlkZXJ9IGdldHRpbmcgZXJyb3Igd2hlbiBsaXN0ZW4gdGhlIGxvYWQgRXZlbnQsIEVycm9yIDogJHtlcnJvcn0hYCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRDb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb246IGFueSk6IElBenVyZUNvbmZpZyB8IElGaXJlYmFzZUNvbmZpZyB8IElDb2duaXRvQ29uZmlnIHtcbiAgICB0cnkge1xuICAgICAgY29uZmlndXJhdGlvbi50b2tlbk5hbWUgPSBjb25maWd1cmF0aW9uLnRva2VuTmFtZSAhPT0gdW5kZWZpbmVkICYmIGNvbmZpZ3VyYXRpb24udG9rZW5OYW1lICE9PSBudWxsID8gY29uZmlndXJhdGlvbi50b2tlbk5hbWUgOiAnYXV0aF90b2tlbic7XG4gICAgICBzd2l0Y2ggKGNvbmZpZ3VyYXRpb24ucHJvdmlkZXIpIHtcbiAgICAgICAgY2FzZSBFUHJvdmlkZXJzLkFaVVJFOlxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhdXRoOiBjb25maWd1cmF0aW9uLmF1dGgsXG4gICAgICAgICAgICBjYWNoZTogY29uZmlndXJhdGlvbi5jYWNoZSxcbiAgICAgICAgICAgIHByb3ZpZGVyOiBjb25maWd1cmF0aW9uLnByb3ZpZGVyLFxuICAgICAgICAgICAgc3lzdGVtOiB7XG4gICAgICAgICAgICAgIGxvZ2dlck9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBsb2dnZXJDYWxsYmFjazogKGxldmVsOiBhbnksIG1lc3NhZ2U6IGFueSwgY29udGFpbnNQaWk6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKCFjb250YWluc1BpaSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlcihsZXZlbCwgbWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfTtcbiAgICAgICAgY2FzZSBFUHJvdmlkZXJzLkZJUkVCQVNFOlxuICAgICAgICBjYXNlIEVQcm92aWRlcnMuQ09HTklUTzpcbiAgICAgICAgICByZXR1cm4gY29uZmlndXJhdGlvbjtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYG5vIGNvbmZpZ3VyYXRpb24gZm91bmQgZm9yIGdpdmVuIHByb3ZpZGVyOiAke3RoaXMucHJvdmlkZXJDb25maWd1cmF0aW9uPy5wcm92aWRlcn1gKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMucHJvdmlkZXJDb25maWd1cmF0aW9uPy5wcm92aWRlcn0gZ2V0dGluZyBlcnJvciB3aGVuIGNvbmZpZ3VyZSwgRXJyb3IgOiAke2Vycm9yfSFgKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGxvZ2dlcihsZXZlbDogbnVtYmVyLCBtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBzd2l0Y2ggKGxldmVsKSB7XG4gICAgICBjYXNlIExvZ0xldmVsLkVycm9yOlxuICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTG9nTGV2ZWwuSW5mbzpcbiAgICAgICAgY29uc29sZS5pbmZvKG1lc3NhZ2UpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTG9nTGV2ZWwuVmVyYm9zZTpcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhtZXNzYWdlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIExvZ0xldmVsLldhcm5pbmc6XG4gICAgICAgIGNvbnNvbGUud2FybihtZXNzYWdlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRBcHBsaWNhdGlvbigpOiBQdWJsaWNDbGllbnRBcHBsaWNhdGlvbiB8IEZpcmViYXNlQXBwIHwgYW55IHtcbiAgICB0cnkge1xuICAgICAgc3dpdGNoICh0aGlzLnByb3ZpZGVyQ29uZmlndXJhdGlvbj8ucHJvdmlkZXIpIHtcbiAgICAgICAgY2FzZSBFUHJvdmlkZXJzLkFaVVJFOlxuICAgICAgICAgIGlmKHRoaXMuYXBwbGljYXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5hcHBsaWNhdGlvbiA9IG5ldyBQdWJsaWNDbGllbnRBcHBsaWNhdGlvbih0aGlzLnByb3ZpZGVyQ29uZmlndXJhdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aGlzLmFwcGxpY2F0aW9uO1xuICAgICAgICBjYXNlIEVQcm92aWRlcnMuRklSRUJBU0U6XG4gICAgICAgICAgY29uc3Qgb3VyQXBwID0gZ2V0QXBwcygpLmZpbHRlcigoYXBwOiBGaXJlYmFzZUFwcCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGFwcC5uYW1lID09PSAnYXV0aC1hcHAnO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBvdXJBcHAubGVuZ3RoID09PSAxID8gZ2V0QXBwKCdhdXRoLWFwcCcpOiBpbml0aWFsaXplQXBwKHRoaXMucHJvdmlkZXJDb25maWd1cmF0aW9uLCAnYXV0aC1hcHAnKTtcbiAgICAgICAgY2FzZSBFUHJvdmlkZXJzLkNPR05JVE86XG4gICAgICAgICAgaWYodGhpcy5hcHBsaWNhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmFwcGxpY2F0aW9uID0gbmV3IENvZ25pdG9Vc2VyUG9vbCh7XG4gICAgICAgICAgICAgIFVzZXJQb29sSWQ6IHRoaXMucHJvdmlkZXJDb25maWd1cmF0aW9uLnVzZXJQb29sSWQsXG4gICAgICAgICAgICAgIENsaWVudElkOiB0aGlzLnByb3ZpZGVyQ29uZmlndXJhdGlvbi51c2VyUG9vbFdlYkNsaWVudElkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYXBwbGljYXRpb247XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBubyBhcHBsaWNhdGlvbiBmb3VuZCBmb3IgcHJvdmlkZXIgLSAke3RoaXMucHJvdmlkZXJDb25maWd1cmF0aW9uPy5wcm92aWRlcn1gKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCBgJHt0aGlzLnByb3ZpZGVyQ29uZmlndXJhdGlvbj8ucHJvdmlkZXJ9IGdldHRpbmcgZXJyb3Igd2hlbiBpbml0aWFsaXppbmcgdGhlIGFwcGxpY2F0aW9uLCBFcnJvciA6ICR7ZXJyb3J9IWApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0QXV0aGVudGljYXRpb24oKTogYW55IHtcbiAgICB0cnkge1xuICAgICAgc3dpdGNoICh0aGlzLnByb3ZpZGVyQ29uZmlndXJhdGlvbj8ucHJvdmlkZXIpIHtcbiAgICAgICAgY2FzZSBFUHJvdmlkZXJzLkZJUkVCQVNFOlxuICAgICAgICAgIHJldHVybiBnZXRBdXRoKHRoaXMuZ2V0QXBwbGljYXRpb24oKSk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCBgbm8gYXV0aGVudGljYXRpb24gZm91bmQgZm9yIGFwcGxpY2F0aW9uLCBwcm92aWRlciAtICR7dGhpcy5wcm92aWRlckNvbmZpZ3VyYXRpb24/LnByb3ZpZGVyfWApO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpcy5wcm92aWRlckNvbmZpZ3VyYXRpb24/LnByb3ZpZGVyfSBnZXR0aW5nIGVycm9yIHdoZW4gZ2V0dGluZyBhdXRoIGZvciB0aGUgYXBwbGljYXRpb24sIEVycm9yIDogJHtlcnJvcn0hYCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRVc2VyKHJlc3VsdDogYW55KTogSVVzZXIge1xuICAgIGNvbnN0IHVzZXI6IElVc2VyID0ge1xuICAgICAgcHJvdmlkZXI6IHRoaXMucHJvdmlkZXJDb25maWd1cmF0aW9uPy5wcm92aWRlcixcbiAgICAgIHJlc3BvbnNlOiByZXN1bHQsXG4gICAgfTtcbiAgICBpZiAocmVzdWx0ICE9PSBudWxsIHx8IHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBzd2l0Y2ggKHRoaXMucHJvdmlkZXJDb25maWd1cmF0aW9uPy5wcm92aWRlcikge1xuICAgICAgICBjYXNlIEVQcm92aWRlcnMuQVpVUkU6XG4gICAgICAgICAgdXNlci51c2VyTmFtZSA9IHJlc3VsdC5hY2NvdW50LnVzZXJuYW1lO1xuICAgICAgICAgIHVzZXIuYXV0aFRva2VuID0gcmVzdWx0LmFjY2Vzc1Rva2VuO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEVQcm92aWRlcnMuRklSRUJBU0U6XG4gICAgICAgICAgaWYgKHJlc3VsdC51c2VyICE9IG51bGwpIHtcbiAgICAgICAgICAgIHVzZXIuYXV0aFRva2VuID0gcmVzdWx0LnVzZXIuYWNjZXNzVG9rZW47XG4gICAgICAgICAgICB1c2VyLnVzZXJOYW1lID0gcmVzdWx0LnVzZXIuZGlzcGxheU5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEVQcm92aWRlcnMuQ09HTklUTzpcbiAgICAgICAgICBpZih0aGlzLnByb3ZpZGVyQ29uZmlndXJhdGlvbi5yZXNwb25zZVR5cGUgPT09ICd0b2tlbicpIHtcbiAgICAgICAgICAgIHVzZXIuYXV0aFRva2VuID0gdGhpcy5nZXRDb2duaXRvQWNjZXNzVG9rZW4oKTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIGNvbnN0IGNvZ25pdG9Vc2VyOiBDb2duaXRvVXNlciA9IHRoaXMuZ2V0QXBwbGljYXRpb24oKS5nZXRDdXJyZW50VXNlcigpO1xuICAgICAgICAgIGlmKGNvZ25pdG9Vc2VyICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb2duaXRvVXNlci5nZXRTZXNzaW9uKChlcnJvcjogRXJyb3IgfCBudWxsLCBzZXNzaW9uOiBDb2duaXRvVXNlclNlc3Npb24pOiBhbnkgPT4ge1xuICAgICAgICAgICAgICBpZihlcnJvcil7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdXNlci5hdXRoVG9rZW4gPSBzZXNzaW9uLmdldEFjY2Vzc1Rva2VuKCkuZ2V0Snd0VG9rZW4oKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB1c2VyLnVzZXJOYW1lID0gY29nbml0b1VzZXIuZ2V0VXNlcm5hbWUoKTtcbiAgICAgICAgICAgIHVzZXIucmVzcG9uc2UgPSBjb2duaXRvVXNlcjtcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodXNlciAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmFjY291bnRTdWJqZWN0Lm5leHQodXNlcik7XG4gICAgICAgIHRoaXMucGVyc2lzdFRva2VuKHVzZXIuYXV0aFRva2VuIHx8ICcnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5hY3RpdmVVc2VyID0gdXNlcjtcbiAgICByZXR1cm4gdXNlcjtcbiAgfVxuXG4gIHByaXZhdGUgcGVyc2lzdFRva2VuKHRva2VuOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLnByb3ZpZGVyQ29uZmlndXJhdGlvbi50b2tlbk5hbWUsIHRva2VuKTtcbiAgfVxuXG4gIHByaXZhdGUgcmV0cmlldmVUb2tlbigpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5wcm92aWRlckNvbmZpZ3VyYXRpb24udG9rZW5OYW1lKTtcbiAgfVxuXG4gIHByaXZhdGUgY2xlYXJBY3RpdmVVc2VyKCk6IHZvaWQge1xuICAgIGNvbnN0IGVtcHR5VXNlcjogSVVzZXIgPSB7XG4gICAgICBwcm92aWRlcjogdGhpcy5wcm92aWRlckNvbmZpZ3VyYXRpb24/LnByb3ZpZGVyLFxuICAgIH07XG4gICAgdGhpcy5hY2NvdW50U3ViamVjdC5uZXh0KGVtcHR5VXNlcik7XG4gICAgdGhpcy5hY2NvdW50U3ViamVjdC51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuYWN0aXZlVXNlciA9IG51bGw7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5wcm92aWRlckNvbmZpZ3VyYXRpb24udG9rZW5OYW1lKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuY2xlYXJBY3RpdmVVc2VyKCk7XG4gIH1cblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElGaXJlYmFzZUNvbmZpZyB7XG4gIHByb3ZpZGVyPzogRVByb3ZpZGVycztcbiAgYXBpS2V5OiBzdHJpbmc7XG4gIGF1dGhEb21haW46IHN0cmluZztcbiAgZGF0YWJhc2VVUkw/OiBzdHJpbmc7XG4gIHByb2plY3RJZDogc3RyaW5nO1xuICBzdG9yYWdlQnVja2V0OiBzdHJpbmc7XG4gIG1lc3NhZ2luZ1NlbmRlcklkOiBzdHJpbmc7XG4gIGFwcElkOiBzdHJpbmc7XG4gIG1lYXN1cmVtZW50SWQ6IHN0cmluZztcbiAgcmVkaXJlY3RVcmk/OiBzdHJpbmc7XG4gIGxvZ2luX2ZhaWxlZF9yb3V0ZT86IHN0cmluZztcbiAgbG9naW5fcm91dGU/OiBzdHJpbmc7XG4gIHRva2VuTmFtZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQXp1cmVDb25maWcge1xuICBwcm92aWRlcj86IEVQcm92aWRlcnM7XG4gIGF1dGg6IHtcbiAgICBjbGllbnRJZDogc3RyaW5nO1xuICAgIHJlZGlyZWN0VXJpOiBzdHJpbmc7XG4gICAgYXV0aG9yaXR5OiBzdHJpbmc7XG4gIH0sXG4gIGNhY2hlOiB7XG4gICAgY2FjaGVMb2NhdGlvbjogc3RyaW5nO1xuICAgIHN0b3JlQXV0aFN0YXRlSW5Db29raWU6IGJvb2xlYW47XG4gIH0sXG4gIHN5c3RlbT86IGFueTtcbiAgbG9naW5GYWlsZWRSb3V0ZT86IHN0cmluZztcbiAgbG9naW5Sb3V0ZT86IHN0cmluZztcbiAgcmVzcG9uc2VUeXBlPzogc3RyaW5nO1xuICB0b2tlbk5hbWU/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNvZ25pdG9Db25maWcge1xuICBwcm92aWRlcj86IEVQcm92aWRlcnM7XG4gIHVzZXJQb29sSWQ6IHN0cmluZztcbiAgdXNlclBvb2xXZWJDbGllbnRJZDogc3RyaW5nO1xuICBkb21haW5Vcmw6IHN0cmluZztcbiAgcmVkaXJlY3RVcmw6IHN0cmluZztcbiAgbG9naW5GYWlsZWRSb3V0ZT86IHN0cmluZztcbiAgbG9naW5Sb3V0ZT86IHN0cmluZztcbiAgcmVzcG9uc2VUeXBlOiBzdHJpbmc7XG4gIHRva2VuTmFtZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJVXNlciB7XG4gIHByb3ZpZGVyOiBzdHJpbmc7XG4gIHVzZXJOYW1lPzogc3RyaW5nO1xuICBlbWFpbD86IHN0cmluZztcbiAgZmlyc3ROYW1lPzogc3RyaW5nO1xuICBsYXN0TmFtZT86IHN0cmluZztcbiAgYXV0aFRva2VuPzogc3RyaW5nO1xuICByZXNwb25zZT86IGFueTtcbn1cblxuZXhwb3J0IGVudW0gRVByb3ZpZGVycyB7XG4gIEFaVVJFLFxuICBGSVJFQkFTRSxcbiAgQ09HTklUTyxcbn1cbiJdfQ==