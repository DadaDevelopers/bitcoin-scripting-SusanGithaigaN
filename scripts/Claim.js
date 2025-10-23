import * as bitcoin from "bitcoin-sdk-js";
import { setupHTLC } from "./config.js";

async function Claim() {
  // reuse HTLC setup
  const { alice, htlcScript, secret } = await setupHTLC();

  // Mock previous HTLC UTXO
  const txid = "a".repeat(64); 
  const index = 0;
  const amount = 100_000; 

  // Create transaction
  const tx = new bitcoin.Transaction();

  // Add input (the HTLC UTXO)
  await tx.addInput({
    txHash: txid,
    index,
    value: amount,
    script: htlcScript,
  });

  // Use the same HTLC script as "output" for simplicity (just to get an address)
  const aliceAddress = await bitcoin.address.generateScriptAddress(htlcScript, "regtest");

  await tx.addOutput({
    address: aliceAddress,
    value: amount - 1_000, 
  });

  // Unlock using Alice’s preimage (claim path)
  await tx.unlockHashInput(0, secret);

  // Get raw transaction hex
  let rawHex;
  if (tx.getSignedHex) rawHex = await tx.getSignedHex();
  else if (tx.getHex) rawHex = await tx.getHex();
  else rawHex = "Cannot get hex; SDK version differs";

  console.log("✅ Alice's claiming transaction hex:\n", rawHex);
}

Claim().catch(console.error);
