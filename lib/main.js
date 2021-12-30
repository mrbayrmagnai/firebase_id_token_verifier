const token_verifier_1 = require('./token-verifier');
var error_1 = require("./error");
var auth_api_request_1 = require('./auth/auth-api-request');
var user_record_1 = require('./user-record');

function Main(app) {
    this.authRequestHandler = new auth_api_request_1.AuthRequestHandler(app);
    this.idTokenVerifier = token_verifier_1.createIdTokenVerifier(app);
}

Main.prototype.verifyIdToken = function (idToken, checkRevoked) {
    var _this = this;
    if (checkRevoked === void 0) { checkRevoked = false; }
    var isEmulator = auth_api_request_1.useEmulator();
    return this.idTokenVerifier.verifyJWT(idToken, isEmulator)
        .then(function (decodedIdToken) {
            // Whether to check if the token was revoked.
            if (checkRevoked || isEmulator) {
                return _this.verifyDecodedJWTNotRevokedOrDisabled(decodedIdToken, error_1.AuthClientErrorCode.ID_TOKEN_REVOKED);
            }
            return decodedIdToken;
        });
}

Main.prototype.verifyDecodedJWTNotRevokedOrDisabled = function (decodedIdToken, revocationErrorInfo) {
    // Get tokens valid after time for the corresponding user.
    return this.getUser(decodedIdToken.sub)
        .then(function (user) {
            if (user.disabled) {
                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.USER_DISABLED, 'The user record is disabled.');
            }
            // If no tokens valid after time available, token is not revoked.
            if (user.tokensValidAfterTime) {
                // Get the ID token authentication time and convert to milliseconds UTC.
                var authTimeUtc = decodedIdToken.auth_time * 1000;
                // Get user tokens valid after time in milliseconds UTC.
                var validSinceUtc = new Date(user.tokensValidAfterTime).getTime();
                // Check if authentication time is older than valid since time.
                if (authTimeUtc < validSinceUtc) {
                    throw new error_1.FirebaseAuthError(revocationErrorInfo);
                }
            }
            // All checks above passed. Return the decoded token.
            return decodedIdToken;
        });
};

Main.prototype.getUser = function (uid) {
    return this.authRequestHandler.getAccountInfoByUid(uid)
        .then(function (response) {
            // Returns the user record populated with server response.
            return new user_record_1.UserRecord(response.users[0]);
        });
};


exports.Main = Main;
