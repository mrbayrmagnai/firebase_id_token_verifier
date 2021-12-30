# firebase_id_token_verifier
Simple firebase id token verifier library for nodejs

It is very small size package. Suitable for use in serverless.

Individual part of https://github.com/firebase/firebase-admin-node

## Usage

```js

const { initializeApp, CredFactory, Verifier } = require('firebase_id_token_verifier');

const serviceCredential = {
    "type": "service_account",
    "project_id": "project_name",
    "private_key_id": "d99...",
    "private_key": "-----BEGIN PRIVATE KEY-----\n....\n-----END PRIVATE KEY-----\n",
    "client_email": "something@something-23423.iam.gserviceaccount.com",
    "client_id": "1111111111111",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}

const idToken = 'idToken'
const app = initializeApp({
    credential: CredFactory.cert(serviceCredential)
})

const verifier = new Verifier(app);
verifier
    .verifyIdToken(idToken)
    .then(result => console.log(result))
    .catch(err => console.error(err));

```
