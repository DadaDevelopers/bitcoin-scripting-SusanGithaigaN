import * as bitcoin from "bitcoin-sdk-js";
import { setupHTLC } from "./config.js";

async function Refund() {
  const { bob, htlcScript } = await setupHTLC();

  // Mock previous HTLC UTXO
  const txid = "a".repeat(64); 
  const index = 0;
  const amount = 100_000; 

  // Create transaction
  const tx = new bitcoin.Transaction();

  // Add input referencing the HTLC output
  await tx.addInput({
    txHash: txid,
    index,
    value: amount,
    script: htlcScript,
  });

  // Use HTLC script as output address 
  const bobAddress = await bitcoin.address.generateScriptAddress(htlcScript, "regtest");

  await tx.addOutput({
    address: bobAddress,
    value: amount - 1_000, // fee
  });

  // Unlock using Bob’s refund path 
  await tx.unlockHashInput(0, {
    preimage: "",     
    selector: "0",   
    pubkey: bob.publicKey,
  });

  // Get raw transaction hex
  let rawHex;
  if (tx.getSignedHex) rawHex = await tx.getSignedHex();
  else if (tx.getHex) rawHex = await tx.getHex();
  else rawHex = "Cannot get hex; SDK version differs";

  console.log("✅ Bob's refund transaction hex:\n", rawHex);
}

Refund().catch(console.error);
