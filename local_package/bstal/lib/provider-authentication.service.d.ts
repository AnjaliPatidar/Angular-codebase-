import { OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import * as i0 from "@angular/core";
export declare class ProviderAuthenticationService implements OnDestroy {
    config?: any;
    providerConfiguration: any;
    accountSubject: ReplaySubject<IUser>;
    activeUser: any;
    application: any;
    constructor(config?: any);
    signIn(): Promise<IUser>;
    signInWithCredentials(username: string, password: string): Promise<IUser>;
    signOut(): Promise<void>;
    getCognitoAccessToken(): string;
    getActiveUser(): Promise<IUser>;
    interceptorConfigFactory(): unknown;
    guardConfigFactory(): unknown;
    private loadConfiguration;
    private loadEventListener;
    private getConfiguration;
    private logger;
    private getApplication;
    private getAuthentication;
    private getUser;
    private persistToken;
    private retrieveToken;
    private clearActiveUser;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProviderAuthenticationService, [{ optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ProviderAuthenticationService>;
}
export interface IFirebaseConfig {
    provider?: EProviders;
    apiKey: string;
    authDomain: string;
    databaseURL?: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
    redirectUri?: string;
    login_failed_route?: string;
    login_route?: string;
    tokenName?: string;
}
export interface IAzureConfig {
    provider?: EProviders;
    auth: {
        clientId: string;
        redirectUri: string;
        authority: string;
    };
    cache: {
        cacheLocation: string;
        storeAuthStateInCookie: boolean;
    };
    system?: any;
    loginFailedRoute?: string;
    loginRoute?: string;
    responseType?: string;
    tokenName?: string;
}
export interface ICognitoConfig {
    provider?: EProviders;
    userPoolId: string;
    userPoolWebClientId: string;
    domainUrl: string;
    redirectUrl: string;
    loginFailedRoute?: string;
    loginRoute?: string;
    responseType: string;
    tokenName?: string;
}
export interface IUser {
    provider: string;
    userName?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    authToken?: string;
    response?: any;
}
export declare enum EProviders {
    AZURE = 0,
    FIREBASE = 1,
    COGNITO = 2
}
