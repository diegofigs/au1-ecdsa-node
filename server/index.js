const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3042;
const router = express.Router();

app.use(cors());
app.use(express.json());

async function recoverKey(message, signature, recoveryBit) {
  return secp.recoverPublicKey(message, signature, recoveryBit);
}

function getAddress(publicKey) {
  return "0x" + toHex(keccak256(publicKey.slice(1)).slice(-20));
}

const balances = {
  "0x1800c1b5b9221cdda126ba6449caffb15af943d0": 100,
  "0x6756ad4a2f6de2d388e4a19b0382e5ddc053c889": 50,
  "0xb06431488a11b3e69109b6f4b68777e2adef1b24": 75,
};
const nonces = {
  "0x1800c1b5b9221cdda126ba6449caffb15af943d0": 0,
  "0x6756ad4a2f6de2d388e4a19b0382e5ddc053c889": 0,
  "0xb06431488a11b3e69109b6f4b68777e2adef1b24": 0,
};
const signatures = new Set();

router.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  const nonce = nonces[address] || 0;
  res.send({ balance, nonce });
});

router.post("/send", async (req, res) => {
  const { recipient, amount, message, signature, recoveryBit } = req.body;
  if (signatures.has(signature)) {
    return res.status(403).send({ message: "Signature already processed"});
  }

  const publicKey = await recoverKey(message, signature, parseInt(recoveryBit));
  const isValid = secp.verify(signature, message, publicKey);
  if (!isValid) {
    return res.status(401).send({ message: "Invalid signature" });
  }
  const sender = getAddress(publicKey);
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    return res.status(400).send({ message: "Not enough funds!" });
  } else {
    signatures.add(signature);
    nonces[sender]++;
    balances[sender] -= amount;
    balances[recipient] += amount;
    return res.send({ balance: balances[sender], nonce: nonces[sender] });
  }
});

app.use("/api", router);

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

module.exports = app;
