const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

async function signMessage(msg, privateKey) {
    const signature = await secp.sign(msg, privateKey, { recovered: true });
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
