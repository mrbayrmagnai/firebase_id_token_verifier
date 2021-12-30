var fbNamespace = require('./app/firebase-namespace');
var cred_factory = require('./app/credential-factory');
const { Main } = require('./main');

exports.initializeApp = (params) => fbNamespace.defaultNamespace.initializeApp(params);
exports.CredFactory = cred_factory;
exports.Verifier = Main;
