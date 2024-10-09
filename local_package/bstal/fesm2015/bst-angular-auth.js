import { __awaiter } from 'tslib';
import * as i0 from '@angular/core';
import { Injectable, Inject, Optional } from '@angular/core';
import { InteractionType, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { getApps, getApp, initializeApp } from '@firebase/app';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, signOut, getAuth } from '@firebase/auth';
import { CognitoUser, AuthenticationDetails, CognitoUserPool } from 'amazon-cognito-identity-js';
import { ReplaySubject } from 'rxjs';

class ProviderAuthenticationService {
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
var EProviders;
(function (EProviders) {
    EProviders[EProviders["AZURE"] = 0] = "AZURE";
    EProviders[EProviders["FIREBASE"] = 1] = "FIREBASE";
    EProviders[EProviders["COGNITO"] = 2] = "COGNITO";
})(EProviders || (EProviders = {}));

/**
 * Generated bundle index. Do not edit.
 */

export { EProviders, ProviderAuthenticationService };
//# sourceMappingURL=bst-angular-auth.js.map
