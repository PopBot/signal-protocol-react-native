let Crypto = require('./crypto.js');

function isNonNegativeInteger(n) {
    return (typeof n === 'number' && (n % 1) === 0  && n >= 0);
}

let KeyHelper = {
    ensureSecure: function () {
        return Crypto.crypto.ensureSecure();
    },

    generateIdentityKeyPair: function() {
        return Crypto.crypto.createKeyPair();
    },

    generateRegistrationId: function() {
        var registrationId = new Uint16Array(Crypto.crypto.getRandomBytes(2))[0];
        return registrationId & 0x3fff;
    },

    generateSignedPreKey: function (identityKeyPair, signedKeyId) {
        if (!(identityKeyPair.privKey instanceof ArrayBuffer) ||
            identityKeyPair.privKey.byteLength !== 32 ||
            !(identityKeyPair.pubKey instanceof ArrayBuffer) ||
            identityKeyPair.pubKey.byteLength !== 33) {
            throw new TypeError('Invalid argument for identityKeyPair');
        }
        if (!isNonNegativeInteger(signedKeyId)) {
            throw new TypeError(
                'Invalid argument for signedKeyId: ' + signedKeyId
            );
        }

        return Crypto.crypto.createKeyPair().then(function(keyPair) {
            return Crypto.crypto.Ed25519Sign(identityKeyPair.privKey, keyPair.pubKey).then(function(sig) {
                return {
                    keyId      : signedKeyId,
                    keyPair    : keyPair,
                    signature  : sig
                };
            });
        });
    },

    generatePreKey: function(keyId) {
        if (!isNonNegativeInteger(keyId)) {
            throw new TypeError('Invalid argument for keyId: ' + keyId);
        }

        return Crypto.crypto.createKeyPair().then(function(keyPair) {
            return { keyId: keyId, keyPair: keyPair };
        });
    }
};

module.exports = KeyHelper;
