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
exports.UserRecord = exports.UserInfo = exports.UserMetadata = exports.MultiFactorSettings = exports.PhoneMultiFactorInfo = exports.MultiFactorInfo = void 0;
var deep_copy_1 = require("./deep-copy");
var validator_1 = require("./validator");
var error_1 = require("./error");

/**
 * Defines a new read-only property directly on an object and returns the object.
 *
 * @param obj - The object on which to define the property.
 * @param prop - The name of the property to be defined or modified.
 * @param value - The value associated with the property.
 */
 function addReadonlyGetter(obj, prop, value) {
    Object.defineProperty(obj, prop, {
        value: value,
        // Make this property read-only.
        writable: false,
        // Include this property during enumeration of obj's properties.
        enumerable: true,
    });
}

/**
 * 'REDACTED', encoded as a base64 string.
 */
var B64_REDACTED = Buffer.from('REDACTED').toString('base64');
/**
 * Parses a time stamp string or number and returns the corresponding date if valid.
 *
 * @param time - The unix timestamp string or number in milliseconds.
 * @returns The corresponding date as a UTC string, if valid. Otherwise, null.
 */
function parseDate(time) {
    try {
        var date = new Date(parseInt(time, 10));
        if (!isNaN(date.getTime())) {
            return date.toUTCString();
        }
    }
    catch (e) {
        // Do nothing. null will be returned.
    }
    return null;
}
var MultiFactorId;
(function (MultiFactorId) {
    MultiFactorId["Phone"] = "phone";
})(MultiFactorId || (MultiFactorId = {}));
/**
 * Interface representing the common properties of a user-enrolled second factor.
 */
var MultiFactorInfo = /** @class */ (function () {
    /**
     * Initializes the MultiFactorInfo object using the server side response.
     *
     * @param response - The server side response.
     * @constructor
     * @internal
     */
    function MultiFactorInfo(response) {
        this.initFromServerResponse(response);
    }
    /**
     * Initializes the MultiFactorInfo associated subclass using the server side.
     * If no MultiFactorInfo is associated with the response, null is returned.
     *
     * @param response - The server side response.
     * @internal
     */
    MultiFactorInfo.initMultiFactorInfo = function (response) {
        var multiFactorInfo = null;
        // Only PhoneMultiFactorInfo currently available.
        try {
            multiFactorInfo = new PhoneMultiFactorInfo(response);
        }
        catch (e) {
            // Ignore error.
        }
        return multiFactorInfo;
    };
    /**
     * Returns a JSON-serializable representation of this object.
     *
     * @returns A JSON-serializable representation of this object.
     */
    MultiFactorInfo.prototype.toJSON = function () {
        return {
            uid: this.uid,
            displayName: this.displayName,
            factorId: this.factorId,
            enrollmentTime: this.enrollmentTime,
        };
    };
    /**
     * Initializes the MultiFactorInfo object using the provided server response.
     *
     * @param response - The server side response.
     */
    MultiFactorInfo.prototype.initFromServerResponse = function (response) {
        var factorId = response && this.getFactorId(response);
        if (!factorId || !response || !response.mfaEnrollmentId) {
            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Invalid multi-factor info response');
        }
        addReadonlyGetter(this, 'uid', response.mfaEnrollmentId);
        addReadonlyGetter(this, 'factorId', factorId);
        addReadonlyGetter(this, 'displayName', response.displayName);
        // Encoded using [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format.
        // For example, "2017-01-15T01:30:15.01Z".
        // This can be parsed directly via Date constructor.
        // This can be computed using Data.prototype.toISOString.
        if (response.enrolledAt) {
            addReadonlyGetter(this, 'enrollmentTime', new Date(response.enrolledAt).toUTCString());
        }
        else {
            addReadonlyGetter(this, 'enrollmentTime', null);
        }
    };
    return MultiFactorInfo;
}());
exports.MultiFactorInfo = MultiFactorInfo;
/**
 * Interface representing a phone specific user-enrolled second factor.
 */
var PhoneMultiFactorInfo = /** @class */ (function (_super) {
    __extends(PhoneMultiFactorInfo, _super);
    /**
     * Initializes the PhoneMultiFactorInfo object using the server side response.
     *
     * @param response - The server side response.
     * @constructor
     * @internal
     */
    function PhoneMultiFactorInfo(response) {
        var _this = _super.call(this, response) || this;
        addReadonlyGetter(_this, 'phoneNumber', response.phoneInfo);
        return _this;
    }
    /**
     * {@inheritdoc MultiFactorInfo.toJSON}
     */
    PhoneMultiFactorInfo.prototype.toJSON = function () {
        return Object.assign(_super.prototype.toJSON.call(this), {
            phoneNumber: this.phoneNumber,
        });
    };
    /**
     * Returns the factor ID based on the response provided.
     *
     * @param response - The server side response.
     * @returns The multi-factor ID associated with the provided response. If the response is
     *     not associated with any known multi-factor ID, null is returned.
     *
     * @internal
     */
    PhoneMultiFactorInfo.prototype.getFactorId = function (response) {
        return (response && response.phoneInfo) ? MultiFactorId.Phone : null;
    };
    return PhoneMultiFactorInfo;
}(MultiFactorInfo));
exports.PhoneMultiFactorInfo = PhoneMultiFactorInfo;
/**
 * The multi-factor related user settings.
 */
var MultiFactorSettings = /** @class */ (function () {
    /**
     * Initializes the MultiFactor object using the server side or JWT format response.
     *
     * @param response - The server side response.
     * @constructor
     * @internal
     */
    function MultiFactorSettings(response) {
        var parsedEnrolledFactors = [];
        if (!validator_1.isNonNullObject(response)) {
            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Invalid multi-factor response');
        }
        else if (response.mfaInfo) {
            response.mfaInfo.forEach(function (factorResponse) {
                var multiFactorInfo = MultiFactorInfo.initMultiFactorInfo(factorResponse);
                if (multiFactorInfo) {
                    parsedEnrolledFactors.push(multiFactorInfo);
                }
            });
        }
        // Make enrolled factors immutable.
        addReadonlyGetter(this, 'enrolledFactors', Object.freeze(parsedEnrolledFactors));
    }
    /**
     * Returns a JSON-serializable representation of this multi-factor object.
     *
     * @returns A JSON-serializable representation of this multi-factor object.
     */
    MultiFactorSettings.prototype.toJSON = function () {
        return {
            enrolledFactors: this.enrolledFactors.map(function (info) { return info.toJSON(); }),
        };
    };
    return MultiFactorSettings;
}());
exports.MultiFactorSettings = MultiFactorSettings;
/**
 * Represents a user's metadata.
 */
var UserMetadata = /** @class */ (function () {
    /**
     * @param response - The server side response returned from the getAccountInfo
     *     endpoint.
     * @constructor
     * @internal
     */
    function UserMetadata(response) {
        // Creation date should always be available but due to some backend bugs there
        // were cases in the past where users did not have creation date properly set.
        // This included legacy Firebase migrating project users and some anonymous users.
        // These bugs have already been addressed since then.
        addReadonlyGetter(this, 'creationTime', parseDate(response.createdAt));
        addReadonlyGetter(this, 'lastSignInTime', parseDate(response.lastLoginAt));
        var lastRefreshAt = response.lastRefreshAt ? new Date(response.lastRefreshAt).toUTCString() : null;
        addReadonlyGetter(this, 'lastRefreshTime', lastRefreshAt);
    }
    /**
     * Returns a JSON-serializable representation of this object.
     *
     * @returns A JSON-serializable representation of this object.
     */
    UserMetadata.prototype.toJSON = function () {
        return {
            lastSignInTime: this.lastSignInTime,
            creationTime: this.creationTime,
        };
    };
    return UserMetadata;
}());
exports.UserMetadata = UserMetadata;
/**
 * Represents a user's info from a third-party identity provider
 * such as Google or Facebook.
 */
var UserInfo = /** @class */ (function () {
    /**
     * @param response - The server side response returned from the `getAccountInfo`
     *     endpoint.
     * @constructor
     * @internal
     */
    function UserInfo(response) {
        // Provider user id and provider id are required.
        if (!response.rawId || !response.providerId) {
            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Invalid user info response');
        }
        addReadonlyGetter(this, 'uid', response.rawId);
        addReadonlyGetter(this, 'displayName', response.displayName);
        addReadonlyGetter(this, 'email', response.email);
        addReadonlyGetter(this, 'photoURL', response.photoUrl);
        addReadonlyGetter(this, 'providerId', response.providerId);
        addReadonlyGetter(this, 'phoneNumber', response.phoneNumber);
    }
    /**
     * Returns a JSON-serializable representation of this object.
     *
     * @returns A JSON-serializable representation of this object.
     */
    UserInfo.prototype.toJSON = function () {
        return {
            uid: this.uid,
            displayName: this.displayName,
            email: this.email,
            photoURL: this.photoURL,
            providerId: this.providerId,
            phoneNumber: this.phoneNumber,
        };
    };
    return UserInfo;
}());
exports.UserInfo = UserInfo;
/**
 * Represents a user.
 */
var UserRecord = /** @class */ (function () {
    /**
     * @param response - The server side response returned from the getAccountInfo
     *     endpoint.
     * @constructor
     * @internal
     */
    function UserRecord(response) {
        // The Firebase user id is required.
        if (!response.localId) {
            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Invalid user response');
        }
        addReadonlyGetter(this, 'uid', response.localId);
        addReadonlyGetter(this, 'email', response.email);
        addReadonlyGetter(this, 'emailVerified', !!response.emailVerified);
        addReadonlyGetter(this, 'displayName', response.displayName);
        addReadonlyGetter(this, 'photoURL', response.photoUrl);
        addReadonlyGetter(this, 'phoneNumber', response.phoneNumber);
        // If disabled is not provided, the account is enabled by default.
        addReadonlyGetter(this, 'disabled', response.disabled || false);
        addReadonlyGetter(this, 'metadata', new UserMetadata(response));
        var providerData = [];
        for (var _i = 0, _a = (response.providerUserInfo || []); _i < _a.length; _i++) {
            var entry = _a[_i];
            providerData.push(new UserInfo(entry));
        }
        addReadonlyGetter(this, 'providerData', providerData);
        // If the password hash is redacted (probably due to missing permissions)
        // then clear it out, similar to how the salt is returned. (Otherwise, it
        // *looks* like a b64-encoded hash is present, which is confusing.)
        if (response.passwordHash === B64_REDACTED) {
            addReadonlyGetter(this, 'passwordHash', undefined);
        }
        else {
            addReadonlyGetter(this, 'passwordHash', response.passwordHash);
        }
        addReadonlyGetter(this, 'passwordSalt', response.salt);
        if (response.customAttributes) {
            addReadonlyGetter(this, 'customClaims', JSON.parse(response.customAttributes));
        }
        var validAfterTime = null;
        // Convert validSince first to UTC milliseconds and then to UTC date string.
        if (typeof response.validSince !== 'undefined') {
            validAfterTime = parseDate(parseInt(response.validSince, 10) * 1000);
        }
        addReadonlyGetter(this, 'tokensValidAfterTime', validAfterTime || undefined);
        addReadonlyGetter(this, 'tenantId', response.tenantId);
        var multiFactor = new MultiFactorSettings(response);
        if (multiFactor.enrolledFactors.length > 0) {
            addReadonlyGetter(this, 'multiFactor', multiFactor);
        }
    }
    /**
     * Returns a JSON-serializable representation of this object.
     *
     * @returns A JSON-serializable representation of this object.
     */
    UserRecord.prototype.toJSON = function () {
        var json = {
            uid: this.uid,
            email: this.email,
            emailVerified: this.emailVerified,
            displayName: this.displayName,
            photoURL: this.photoURL,
            phoneNumber: this.phoneNumber,
            disabled: this.disabled,
            // Convert metadata to json.
            metadata: this.metadata.toJSON(),
            passwordHash: this.passwordHash,
            passwordSalt: this.passwordSalt,
            customClaims: deep_copy_1.deepCopy(this.customClaims),
            tokensValidAfterTime: this.tokensValidAfterTime,
            tenantId: this.tenantId,
        };
        if (this.multiFactor) {
            json.multiFactor = this.multiFactor.toJSON();
        }
        json.providerData = [];
        for (var _i = 0, _a = this.providerData; _i < _a.length; _i++) {
            var entry = _a[_i];
            // Convert each provider data to json.
            json.providerData.push(entry.toJSON());
        }
        return json;
    };
    return UserRecord;
}());
exports.UserRecord = UserRecord;
