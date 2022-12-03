import server from "./server";
import { getAddress, recoverKey } from './utils';

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  signature,
  setSignature,
  recoveryBit,
  setRecoveryBit,
}) {
  async function onChange(evt) {
    const sig = evt.target.value;
    setSignature(sig);
    const publicKey = await recoverKey("ecdsa-node", sig, recoveryBit);
    const address = getAddress(publicKey);
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Signature
        <input
          placeholder="Type signature"
          value={signature}
          onChange={onChange}
        ></input>
      </label>
      <label>
        Recovery Bit
        <input
          placeholder="Type recovery bit"
          type="number"
          value={recoveryBit}
          onChange={(e) => setRecoveryBit(Number(e.target.value))}
        ></input>
      </label>
      <label>
        Address:
        <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
      </label>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
