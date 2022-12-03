const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');

const privateKey = secp.utils.randomPrivateKey();
console.log('private key: ', toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey);
console.log('public key: ', "0x" + toHex(getAddress(publicKey)));

function getAddress(publicKey) {
    return keccak256(publicKey.slice(1)).slice(-20);
}
