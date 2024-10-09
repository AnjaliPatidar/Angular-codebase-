(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@azure/msal-browser'), require('@firebase/app'), require('@firebase/auth'), require('amazon-cognito-identity-js'), require('rxjs')) :
    typeof define === 'function' && define.amd ? define('bst-angular-auth', ['exports', '@angular/core', '@azure/msal-browser', '@firebase/app', '@firebase/auth', 'amazon-cognito-identity-js', 'rxjs'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["bst-angular-auth"] = {}, global.ng.core, global.msalBrowser, global.app, global.auth, global.amazonCognitoIdentityJs, global.rxjs));
})(this, (function (exports, i0, msalBrowser, app, auth, amazonCognitoIdentityJs, rxjs) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar)
                        ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
        return to.concat(ar || Array.prototype.slice.call(from));
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    var ProviderAuthenticationService = /** @class */ (function () {
        function ProviderAuthenticationService(config) {
            var _this = this;
            this.config = config;
            this.accountSubject = new rxjs.ReplaySubject(1);
            this.loadConfiguration(config);
            window.addEventListener('load', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_d) {
                    this.loadEventListener();
                    return [2 /*return*/];
                });
            }); });
        }
        ProviderAuthenticationService.prototype.signIn = function () {
            var _this = this;
            var _a, _b, _c;
            try {
                switch ((_a = this.providerConfiguration) === null || _a === void 0 ? void 0 : _a.provider) {
                    case exports.EProviders.AZURE:
                        return new Promise(function (resolve, reject) {
                            _this.getApplication().loginPopup().then(function (authenticationResult) {
                                authenticationResult !== null ? resolve(_this.getUser(authenticationResult)) : reject();
                            });
                        });
                    case exports.EProviders.FIREBASE:
                        return new Promise(function (resolve, reject) {
                            auth.signInWithPopup(_this.getAuthentication(), new auth.GoogleAuthProvider()).then(function (userCredential) {
                                userCredential !== null ? resolve(_this.getUser(userCredential)) : reject();
                            });
                        });
                    case exports.EProviders.COGNITO:
                        return new Promise(function (resolve, reject) {
                            try {
                                var uri = _this.providerConfiguration.domainUrl + "/login?client_id=" + _this.providerConfiguration.userPoolWebClientId + "&response_type=" + _this.providerConfiguration.responseType + "&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=" + _this.providerConfiguration.redirectUrl;
                                window.location.assign(uri);
                                Promise.resolve(_this.getUser({}));
                            }
                            catch (error) {
                                reject(error);
                            }
                        });
                    default:
                        throw new Error(((_b = this.providerConfiguration) === null || _b === void 0 ? void 0 : _b.provider) + " doesnt have an signIn option!");
                }
            }
            catch (error) {
                throw new Error(((_c = this.providerConfiguration) === null || _c === void 0 ? void 0 : _c.provider) + " getting error when signIn, Error : " + error + "!");
            }
        };
        ProviderAuthenticationService.prototype.signInWithCredentials = function (username, password) {
            var _this = this;
            var _a, _b, _c;
            try {
                switch ((_a = this.providerConfiguration) === null || _a === void 0 ? void 0 : _a.provider) {
                    case exports.EProviders.FIREBASE:
                        return new Promise(function (resolve, reject) {
                            auth.signInWithEmailAndPassword(_this.getAuthentication(), username, password).then(function (userCredential) {
                                userCredential !== null ? resolve(_this.getUser(userCredential)) : reject();
                            });
                        });
                    case exports.EProviders.COGNITO:
                        var user_1 = new amazonCognitoIdentityJs.CognitoUser({ Username: username, Pool: this.getApplication() });
                        var authenticationDetails_1 = new amazonCognitoIdentityJs.AuthenticationDetails({ Username: username, Password: password });
                        return new Promise(function (resolve, reject) { return user_1.authenticateUser(authenticationDetails_1, {
                            onSuccess: function (result) { return resolve(_this.getUser(result)); },
                            onFailure: function (err) { return reject(err); }
                        }); });
                    default:
                        throw new Error(((_b = this.providerConfiguration) === null || _b === void 0 ? void 0 : _b.provider) + " doesnt have an signInWithCredentials option!");
                }
            }
            catch (error) {
                throw new Error(((_c = this.providerConfiguration) === null || _c === void 0 ? void 0 : _c.provider) + " getting error when signInWithCredentials, Error : " + error + "!");
            }
        };
        ProviderAuthenticationService.prototype.signOut = function () {
            var _this = this;
            var _a, _b, _c;
            try {
                switch ((_a = this.providerConfiguration) === null || _a === void 0 ? void 0 : _a.provider) {
                    case exports.EProviders.AZURE:
                        return new Promise(function (resolve, reject) {
                            _this.getApplication().logoutRedirect({}).then(function () {
                                _this.clearActiveUser();
                                resolve();
                            }).catch(function (error) {
                                reject(error);
                            });
                        });
                    case exports.EProviders.FIREBASE:
                        return new Promise(function (resolve, reject) {
                            auth.signOut(_this.getAuthentication()).then(function () {
                                _this.clearActiveUser();
                                resolve();
                            }).catch(function (error) {
                                reject(error);
                            });
                        });
                    case exports.EProviders.COGNITO:
                        return new Promise(function (resolve, reject) {
                            _this.getApplication().getCurrentUser().signOut();
                            _this.clearActiveUser();
                            resolve();
                        });
                    default:
                        throw new Error(((_b = this.providerConfiguration) === null || _b === void 0 ? void 0 : _b.provider) + " doesnt have an signOut option!");
                }
            }
            catch (error) {
                throw new Error(((_c = this.providerConfiguration) === null || _c === void 0 ? void 0 : _c.provider) + " getting error when signOut, Error : " + error + "!");
            }
        };
        ProviderAuthenticationService.prototype.getCognitoAccessToken = function () {
            var accessToken = '';
            if (this.providerConfiguration.provider === exports.EProviders.COGNITO && this.providerConfiguration.responseType === 'token' && window.location.href.indexOf("access_token") != -1) {
                var urlParams = window.location.hash.replace("#", "").split('&');
                urlParams.forEach(function (param) {
                    if (param.startsWith("access_token") && param.length > 1) {
                        accessToken = param.replace("access_token=", "");
                    }
                });
            }
            return accessToken;
        };
        ProviderAuthenticationService.prototype.getActiveUser = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (_this.retrieveToken() !== '') {
                    resolve(_this.activeUser);
                }
                reject("No user is currently logged in the application");
            });
        };
        ProviderAuthenticationService.prototype.interceptorConfigFactory = function () {
            var _a;
            switch ((_a = this.providerConfiguration) === null || _a === void 0 ? void 0 : _a.provider) {
                case exports.EProviders.AZURE:
                    var protectedResourceMap = new Map();
                    protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', [
                        'user.read',
                    ]);
                    return {
                        interactionType: msalBrowser.InteractionType.Redirect,
                        protectedResourceMap: protectedResourceMap,
                    };
                case exports.EProviders.FIREBASE:
                case exports.EProviders.COGNITO:
                default:
                    return null;
            }
        };
        ProviderAuthenticationService.prototype.guardConfigFactory = function () {
            var _a;
            switch ((_a = this.providerConfiguration) === null || _a === void 0 ? void 0 : _a.provider) {
                case exports.EProviders.AZURE:
                    return {
                        interactionType: msalBrowser.InteractionType.Redirect,
                        authRequest: {
                            scopes: [this.providerConfiguration.auth.clientId + "/.default"],
                        },
                        loginFailedRoute: this.providerConfiguration.login_failed_route,
                    };
                case exports.EProviders.FIREBASE:
                case exports.EProviders.COGNITO:
                default:
                    return null;
            }
        };
        ProviderAuthenticationService.prototype.loadConfiguration = function (configuration) {
            if (configuration !== undefined) {
                this.providerConfiguration = this.getConfiguration(configuration);
            }
        };
        ProviderAuthenticationService.prototype.loadEventListener = function () {
            var _this = this;
            var _a, _b, _c;
            try {
                switch ((_a = this.providerConfiguration) === null || _a === void 0 ? void 0 : _a.provider) {
                    case exports.EProviders.AZURE:
                        return new Promise(function (resolve, reject) {
                            _this.getApplication().handleRedirectPromise().then(function (authenticationResult) {
                                authenticationResult !== null ? resolve(_this.getUser(authenticationResult)) : reject();
                            });
                        });
                    case exports.EProviders.FIREBASE:
                        return new Promise(function (resolve, reject) {
                            _this.getAuthentication().onAuthStateChanged(function (user) {
                                if (user !== null) {
                                    resolve(_this.getUser(user));
                                }
                            });
                        });
                    case exports.EProviders.COGNITO:
                        return Promise.resolve(this.getUser({}));
                    default:
                        throw new Error(((_b = this.providerConfiguration) === null || _b === void 0 ? void 0 : _b.provider) + " doesnt have an load event option!");
                }
            }
            catch (error) {
                throw new Error(((_c = this.providerConfiguration) === null || _c === void 0 ? void 0 : _c.provider) + " getting error when listen the load Event, Error : " + error + "!");
            }
        };
        ProviderAuthenticationService.prototype.getConfiguration = function (configuration) {
            var _this = this;
            var _a, _b;
            try {
                configuration.tokenName = configuration.tokenName !== undefined && configuration.tokenName !== null ? configuration.tokenName : 'auth_token';
                switch (configuration.provider) {
                    case exports.EProviders.AZURE:
                        return {
                            auth: configuration.auth,
                            cache: configuration.cache,
                            provider: configuration.provider,
                            system: {
                                loggerOptions: {
                                    loggerCallback: function (level, message, containsPii) {
                                        if (!containsPii) {
                                            _this.logger(level, message);
                                        }
                                        return;
                                    },
                                },
                            },
                        };
                    case exports.EProviders.FIREBASE:
                    case exports.EProviders.COGNITO:
                        return configuration;
                    default:
                        throw new Error("no configuration found for given provider: " + ((_a = this.providerConfiguration) === null || _a === void 0 ? void 0 : _a.provider));
                }
            }
            catch (error) {
                throw new Error(((_b = this.providerConfiguration) === null || _b === void 0 ? void 0 : _b.provider) + " getting error when configure, Error : " + error + "!");
            }
        };
        ProviderAuthenticationService.prototype.logger = function (level, message) {
            switch (level) {
                case msalBrowser.LogLevel.Error:
                    console.error(message);
                    break;
                case msalBrowser.LogLevel.Info:
                    console.info(message);
                    break;
                case msalBrowser.LogLevel.Verbose:
                    console.debug(message);
                    break;
                case msalBrowser.LogLevel.Warning:
                    console.warn(message);
                    break;
                default:
                    console.log(message);
                    break;
            }
        };
        ProviderAuthenticationService.prototype.getApplication = function () {
            var _a, _b, _c;
            try {
                switch ((_a = this.providerConfiguration) === null || _a === void 0 ? void 0 : _a.provider) {
                    case exports.EProviders.AZURE:
                        if (this.application === undefined) {
                            this.application = new msalBrowser.PublicClientApplication(this.providerConfiguration);
                        }
                        return this.application;
                    case exports.EProviders.FIREBASE:
                        var ourApp = app.getApps().filter(function (app) {
                            return app.name === 'auth-app';
                        });
                        return ourApp.length === 1 ? app.getApp('auth-app') : app.initializeApp(this.providerConfiguration, 'auth-app');
                    case exports.EProviders.COGNITO:
                        if (this.application === undefined) {
                            this.application = new amazonCognitoIdentityJs.CognitoUserPool({
                                UserPoolId: this.providerConfiguration.userPoolId,
                                ClientId: this.providerConfiguration.userPoolWebClientId
                            });
                        }
                        return this.application;
                    default:
                        throw new Error("no application found for provider - " + ((_b = this.providerConfiguration) === null || _b === void 0 ? void 0 : _b.provider));
                }
            }
            catch (error) {
                throw new Error(((_c = this.providerConfiguration) === null || _c === void 0 ? void 0 : _c.provider) + " getting error when initializing the application, Error : " + error + "!");
            }
        };
        ProviderAuthenticationService.prototype.getAuthentication = function () {
            var _a, _b, _c;
            try {
                switch ((_a = this.providerConfiguration) === null || _a === void 0 ? void 0 : _a.provider) {
                    case exports.EProviders.FIREBASE:
                        return auth.getAuth(this.getApplication());
                    default:
                        throw new Error("no authentication found for application, provider - " + ((_b = this.providerConfiguration) === null || _b === void 0 ? void 0 : _b.provider));
                }
            }
            catch (error) {
                throw new Error(((_c = this.providerConfiguration) === null || _c === void 0 ? void 0 : _c.provider) + " getting error when getting auth for the application, Error : " + error + "!");
            }
        };
        ProviderAuthenticationService.prototype.getUser = function (result) {
            var _a, _b;
            var user = {
                provider: (_a = this.providerConfiguration) === null || _a === void 0 ? void 0 : _a.provider,
                response: result,
            };
            if (result !== null || result !== undefined) {
                switch ((_b = this.providerConfiguration) === null || _b === void 0 ? void 0 : _b.provider) {
                    case exports.EProviders.AZURE:
                        user.userName = result.account.username;
                        user.authToken = result.accessToken;
                        break;
                    case exports.EProviders.FIREBASE:
                        if (result.user != null) {
                            user.authToken = result.user.accessToken;
                            user.userName = result.user.displayName;
                        }
                        break;
                    case exports.EProviders.COGNITO:
                        if (this.providerConfiguration.responseType === 'token') {
                            user.authToken = this.getCognitoAccessToken();
                        }
                        ;
                        var cognitoUser = this.getApplication().getCurrentUser();
                        if (cognitoUser !== null) {
                            cognitoUser.getSession(function (error, session) {
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
        };
        ProviderAuthenticationService.prototype.persistToken = function (token) {
            localStorage.setItem(this.providerConfiguration.tokenName, token);
        };
        ProviderAuthenticationService.prototype.retrieveToken = function () {
            return localStorage.getItem(this.providerConfiguration.tokenName);
        };
        ProviderAuthenticationService.prototype.clearActiveUser = function () {
            var _a;
            var emptyUser = {
                provider: (_a = this.providerConfiguration) === null || _a === void 0 ? void 0 : _a.provider,
            };
            this.accountSubject.next(emptyUser);
            this.accountSubject.unsubscribe();
            this.activeUser = null;
            localStorage.removeItem(this.providerConfiguration.tokenName);
        };
        ProviderAuthenticationService.prototype.ngOnDestroy = function () {
            this.clearActiveUser();
        };
        return ProviderAuthenticationService;
    }());
    ProviderAuthenticationService.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0__namespace, type: ProviderAuthenticationService, deps: [{ token: 'config', optional: true }], target: i0__namespace.ɵɵFactoryTarget.Injectable });
    ProviderAuthenticationService.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0__namespace, type: ProviderAuthenticationService, providedIn: 'root' });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0__namespace, type: ProviderAuthenticationService, decorators: [{
                type: i0.Injectable,
                args: [{
                        providedIn: 'root',
                    }]
            }], ctorParameters: function () {
            return [{ type: undefined, decorators: [{
                            type: i0.Inject,
                            args: ['config']
                        }, {
                            type: i0.Optional
                        }] }];
        } });
    exports.EProviders = void 0;
    (function (EProviders) {
        EProviders[EProviders["AZURE"] = 0] = "AZURE";
        EProviders[EProviders["FIREBASE"] = 1] = "FIREBASE";
        EProviders[EProviders["COGNITO"] = 2] = "COGNITO";
    })(exports.EProviders || (exports.EProviders = {}));

    /**
     * Generated bundle index. Do not edit.
     */

    exports.ProviderAuthenticationService = ProviderAuthenticationService;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=bst-angular-auth.umd.js.map
