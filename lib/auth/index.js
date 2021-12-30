
var auth_1 = require("./auth");

function getAuth(app) {
    if (typeof app === 'undefined') {
        app = index_1.getApp();
    }
    var firebaseApp = app;
    return firebaseApp.getOrInitService('auth', function (app) { return new auth_1.Auth(app); });
}

exports.getAuth = getAuth;