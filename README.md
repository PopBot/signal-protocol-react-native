# Signal Protocol React Native

> A fork of AidenRourke's [signal-protocol](https://github.com/AidenRourke/signal-protocol)

```shell
npm install signal-protocol-react-native
```


**VERY IMPORTANT**

First, install [react-native-get-random-values](https://www.npmjs.com/package/react-native-get-random-values), [react-native-securerandom](https://www.npmjs.com/package/react-native-securerandom), [isomorphic-webcrypto](https://www.npmjs.com/package/isomorphic-webcrypto).


```shell
npm install isomorphic-webcrypto react-native-getrandom-values react-native-securerandom
```

### Setup

**VERY IMPORTANT**: In your project's root `index.js` file, import `react-native-get-random-values`, and `react-native-securerandom`.
This allows your app to asynchronously load required modules to check secure key generation status.

```javascript
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// START INSERT
import 'react-native-get-random-values';
import 'react-native-securerandom';
// END INSERT

/// ...
AppRegistry.registerRootComponent(appName, () => App);
```

### Usage:

```javascript
import signal from 'signal-protocol-react-native';

const KeyHelper = signal.KeyHelper;

// CODE
```


```javascript
var KeyHelper = signal.KeyHelper;

function generateIdentity(store) {
    return Promise.all([
        KeyHelper.generateIdentityKeyPair(),
        KeyHelper.generateRegistrationId(),
    ]).then(function(result) {
        store.put('identityKey', result[0]);
        store.put('registrationId', result[1]);
    });
}

function generatePreKeyBundle(store, preKeyId, signedPreKeyId) {
    return Promise.all([
        store.getIdentityKeyPair(),
        store.getLocalRegistrationId()
    ]).then(function(result) {
        var identity = result[0];
        var registrationId = result[1];

        return Promise.all([
            KeyHelper.generatePreKey(preKeyId),
            KeyHelper.generateSignedPreKey(identity, signedPreKeyId),
        ]).then(function(keys) {
            var preKey = keys[0]
            var signedPreKey = keys[1];

            store.storePreKey(preKeyId, preKey.keyPair);
            store.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair);

            return {
                identityKey: identity.pubKey,
                registrationId : registrationId,
                preKey:  {
                    keyId     : preKeyId,
                    publicKey : preKey.keyPair.pubKey
                },
                signedPreKey: {
                    keyId     : signedPreKeyId,
                    publicKey : signedPreKey.keyPair.pubKey,
                    signature : signedPreKey.signature
                }
            };
        });
    });
}

var ALICE_ADDRESS = new signal.SignalProtocolAddress("xxxxxxxxx", 1);
var BOB_ADDRESS   = new signal.SignalProtocolAddress("yyyyyyyyyyyyy", 1);

    var aliceStore = new signal.SignalProtocolStore();

    var bobStore = new signal.SignalProtocolStore();
    var bobPreKeyId = 1337;
    var bobSignedKeyId = 1;

    var Curve = signal.Curve;

        Promise.all([
            generateIdentity(aliceStore),
            generateIdentity(bobStore),
        ]).then(function() {
            return generatePreKeyBundle(bobStore, bobPreKeyId, bobSignedKeyId);
        }).then(function(preKeyBundle) {
            var builder = new signal.SessionBuilder(aliceStore, BOB_ADDRESS);
            return builder.processPreKey(preKeyBundle).then(function() {

              var originalMessage = util.toArrayBuffer("my message ......");
              var aliceSessionCipher = new signal.SessionCipher(aliceStore, BOB_ADDRESS);
              var bobSessionCipher = new signal.SessionCipher(bobStore, ALICE_ADDRESS);

              aliceSessionCipher.encrypt(originalMessage).then(function(ciphertext) {

                  // check for ciphertext.type to be 3 which includes the PREKEY_BUNDLE
                  return bobSessionCipher.decryptPreKeyWhisperMessage(ciphertext.body, 'binary');

              }).then(function(plaintext) {

                  alert(plaintext);

              });

              bobSessionCipher.encrypt(originalMessage).then(function(ciphertext) {

                  return aliceSessionCipher.decryptWhisperMessage(ciphertext.body, 'binary');

              }).then(function(plaintext) {

                  assertEqualArrayBuffers(plaintext, originalMessage);

              });

            });
        });

```

### Generate an identity + PreKeys

This protocol uses a concept called 'PreKeys'. A PreKey is an ECPublicKey and
an associated unique ID which are stored together by a server. PreKeys can also
be signed.

At install time, clients generate a single signed PreKey, as well as a large
list of unsigned PreKeys, and transmit all of them to the server.

Please note that before running any command that involved `crypto.getRandomValues` you must first call and **await** `KeyHelper.ensureSecure` (see [isomorphic-webcrypto](https://github.com/kevlened/isomorphic-webcrypto)) for more details.

```javascript
import signal from 'signal-protocol-react-native';

var KeyHelper = signal.KeyHelper;

var registrationId = KeyHelper.generateRegistrationId();
// Store registrationId somewhere durable and safe.

KeyHelper.generateIdentityKeyPair().then(function(identityKeyPair) {
    // keyPair -> { pubKey: ArrayBuffer, privKey: ArrayBuffer }
    // Store identityKeyPair somewhere durable and safe.
});

KeyHelper.generatePreKey(keyId).then(function(preKey) {
    store.storePreKey(preKey.keyId, preKey.keyPair);
});

KeyHelper.generateSignedPreKey(identityKeyPair, keyId).then(function(signedPreKey) {
    store.storeSignedPreKey(signedPreKey.keyId, signedPreKey.keyPair);
});

// Register preKeys and signedPreKey with the server
```

Follow standard usage from [libsignal-protocol-javascript](https://github.com/signalapp/libsignal-protocol-javascript).
