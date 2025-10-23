import * as bitcoin from 'bitcoin-sdk-js';
import { setupHTLC } from './config.js';


async function HtlcScript() {
    // importwallet & public key pairs for Alice and Bob
    const { alice, bob, secret, secretHash, lockHeight, htlcScript } = await setupHTLC();

    console.log("Alice's Public Key:", alice.publicKey);
    console.log("Bob's Public Key:", bob.publicKey);
    ;

    // obtain P2WSH address created from the script
    const htlcAddress = await bitcoin.address.generateScriptAddress(htlcScript, 'segwit');

    console.log("\n✅ HTLC Redeem Script:\n", htlcScript);
    console.log("\n✅The HTLC Address(P2WSH) is:", htlcAddress);
}

HtlcScript().catch(console.error);
