import { toHex } from "ethereum-cryptography/utils";
import { useState } from "react";
import server from "./server";
import { hashMessage } from "./utils";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [signature, setSignature] = useState("");
  const [recoveryBit, setRecoveryBit] = useState(0);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const message = toHex(
      hashMessage(JSON.stringify({ recipient, amount: parseInt(sendAmount) }))
    );

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        signature,
        recoveryBit,
        message,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Message Hash
        <span>
          {toHex(
            hashMessage(
              JSON.stringify({ recipient, amount: parseInt(sendAmount) })
            )
          )}
        </span>
      </label>

      <label>
        Wallet Signature
        <input
          placeholder="Type signature"
          value={signature}
          onChange={setValue(setSignature)}
        ></input>
      </label>
      <label>
        Recovery Bit
        <input
          placeholder="Type recovery bit"
          type="number"
          value={recoveryBit}
          onChange={setValue(setRecoveryBit)}
        ></input>
      </label>
      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
