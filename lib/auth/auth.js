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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
var auth_api_request_1 = require("./auth-api-request");
var base_auth_1 = require("../main");
/**
 * Auth service bound to the provided app.
 * An Auth instance can have multiple tenants.
 */
var Auth = /** @class */ (function (_super) {
    __extends(Auth, _super);
    /**
     * @param app - The app for this Auth service.
     * @constructor
     * @internal
     */
    function Auth(app) {
        var _this = _super.call(this, app, new auth_api_request_1.AuthRequestHandler(app)) || this;
        _this.app_ = app;
        return _this;
    }
    Object.defineProperty(Auth.prototype, "app", {
        /**
         * Returns the app associated with this Auth instance.
         *
         * @returns The app associated with this Auth instance.
         */
        get: function () {
            return this.app_;
        },
        enumerable: false,
        configurable: true
    });
    return Auth;
}(base_auth_1.BaseAuth));
exports.Auth = Auth;
