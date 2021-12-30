/*! firebase-admin v10.0.1 */
"use strict";
/*!
 * @license
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultNamespace = exports.FirebaseNamespace = exports.FirebaseNamespaceInternals = void 0;
var lifecycle_1 = require("./lifecycle");
var credential_factory_1 = require("./credential-factory");

var sdkVersion;
function getSdkVersion() {
    if (!sdkVersion) {
        var version = require('../../package.json').firebaseSDKVersion; // eslint-disable-line @typescript-eslint/no-var-requires
        sdkVersion = version;
    }
    return sdkVersion;
}

/**
 * Internals of a FirebaseNamespace instance.
 */
var FirebaseNamespaceInternals = /** @class */ (function () {
    function FirebaseNamespaceInternals(appStore) {
        this.appStore = appStore;
    }
    /**
     * Initializes the App instance.
     *
     * @param options - Optional options for the App instance. If none present will try to initialize
     *   from the FIREBASE_CONFIG environment variable. If the environment variable contains a string
     *   that starts with '{' it will be parsed as JSON, otherwise it will be assumed to be pointing
     *   to a file.
     * @param appName - Optional name of the FirebaseApp instance.
     *
     * @returns A new App instance.
     */
    FirebaseNamespaceInternals.prototype.initializeApp = function (options, appName) {
        var app = this.appStore.initializeApp(options, appName);
        return extendApp(app);
    };
    /**
     * Returns the App instance with the provided name (or the default App instance
     * if no name is provided).
     *
     * @param appName - Optional name of the FirebaseApp instance to return.
     * @returns The App instance which has the provided name.
     */
    FirebaseNamespaceInternals.prototype.app = function (appName) {
        var app = this.appStore.getApp(appName);
        return extendApp(app);
    };
    Object.defineProperty(FirebaseNamespaceInternals.prototype, "apps", {
        /*
         * Returns an array of all the non-deleted App instances.
         */
        get: function () {
            return this.appStore.getApps().map(function (app) { return extendApp(app); });
        },
        enumerable: false,
        configurable: true
    });
    return FirebaseNamespaceInternals;
}());
exports.FirebaseNamespaceInternals = FirebaseNamespaceInternals;
var firebaseCredential = {
    cert: credential_factory_1.cert, refreshToken: credential_factory_1.refreshToken, applicationDefault: credential_factory_1.applicationDefault
};
/**
 * Global Firebase context object.
 */
var FirebaseNamespace = /** @class */ (function () {
    /* tslint:enable */
    function FirebaseNamespace(appStore) {
        // Hack to prevent Babel from modifying the object returned as the default admin namespace.
        /* tslint:disable:variable-name */
        this.__esModule = true;
        /* tslint:enable:variable-name */
        this.credential = firebaseCredential;
        this.SDK_VERSION = getSdkVersion();
        /* tslint:disable */
        // TODO(jwenger): Database is the only consumer of firebase.Promise. We should update it to use
        // use the native Promise and then remove this.
        this.Promise = Promise;
        this.INTERNAL = new FirebaseNamespaceInternals(appStore !== null && appStore !== void 0 ? appStore : new lifecycle_1.AppStore());
    }
    Object.defineProperty(FirebaseNamespace.prototype, "auth", {
        /**
         * Gets the `Auth` service namespace. The returned namespace can be used to get the
         * `Auth` service for the default app or an explicitly specified app.
         */
        get: function () {
            var _this = this;
            var fn = function (app) {
                return _this.ensureApp(app).auth();
            };
            var auth = require('../auth/auth').Auth;
            return Object.assign(fn, { Auth: auth });
        },
        enumerable: false,
        configurable: true
    });
    // TODO: Change the return types to app.App in the following methods.
    /**
     * Initializes the FirebaseApp instance.
     *
     * @param options - Optional options for the FirebaseApp instance.
     *   If none present will try to initialize from the FIREBASE_CONFIG environment variable.
     *   If the environment variable contains a string that starts with '{' it will be parsed as JSON,
     *   otherwise it will be assumed to be pointing to a file.
     * @param appName - Optional name of the FirebaseApp instance.
     *
     * @returns A new FirebaseApp instance.
     */
    FirebaseNamespace.prototype.initializeApp = function (options, appName) {
        return this.INTERNAL.initializeApp(options, appName);
    };
    /**
     * Returns the FirebaseApp instance with the provided name (or the default FirebaseApp instance
     * if no name is provided).
     *
     * @param appName - Optional name of the FirebaseApp instance to return.
     * @returns The FirebaseApp instance which has the provided name.
     */
    FirebaseNamespace.prototype.app = function (appName) {
        return this.INTERNAL.app(appName);
    };
    Object.defineProperty(FirebaseNamespace.prototype, "apps", {
        /*
         * Returns an array of all the non-deleted FirebaseApp instances.
         */
        get: function () {
            return this.INTERNAL.apps;
        },
        enumerable: false,
        configurable: true
    });
    FirebaseNamespace.prototype.ensureApp = function (app) {
        if (typeof app === 'undefined') {
            app = this.app();
        }
        return app;
    };
    return FirebaseNamespace;
}());
exports.FirebaseNamespace = FirebaseNamespace;


/**
 * In order to maintain backward compatibility, we instantiate a default namespace instance in
 * this module, and delegate all app lifecycle operations to it. In a future implementation where
 * the old admin namespace is no longer supported, we should remove this.
 *
 * @internal
 */
exports.defaultNamespace = new FirebaseNamespace(lifecycle_1.defaultAppStore);
function extendApp(app) {
    var result = app;
    if (result.__extended) {
        return result;
    }
    result.auth = function () {
        var fn = require('../auth/index').getAuth;
        return fn(app);
    };
    result.__extended = true;
    return result;
}
