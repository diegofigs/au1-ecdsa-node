const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");

function hashMessage(message) {
    const bytes = utf8ToBytes(message);
    return keccak256(bytes);
}

async function signMessage(msg, privateKey) {
    const hash = hashMessage(msg);
    const signature = await secp.sign(hash, privateKey, { recovered: true });
    return signature;
}

async function main() {
    const myArgs = process.argv.slice(2);
    const [msg, privateKey] = myArgs;

    const [sig, recoveryBit] = await signMessage(msg, privateKey);
    console.log('signature: ', toHex(sig));
    console.log('recoveryBit: ', recoveryBit);
}

main();
