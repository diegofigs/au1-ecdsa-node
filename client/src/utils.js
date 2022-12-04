import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

export function hashMessage(message) {
  const bytes = utf8ToBytes(message);
  return keccak256(bytes);
}

export function getAddress(publicKey) {
  return "0x" + toHex(keccak256(publicKey.slice(1)).slice(-20));
}
