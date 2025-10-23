// re-usable variables
import * as bitcoin from 'bitcoin-sdk-js';
import crypto from 'crypto';

// compute sha256 hash in hex format
const sha256Hex = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

// create shared setup
const setupHTLC = async () => {
    // generate wallet & public key pairs for Alice and Bob
    const alice = await bitcoin.wallet.generateKeyPair();
    const bob = await bitcoin.wallet.generateKeyPair();

    // create a secret and its hash
    const secret = 'my secret';
    const secretHash = sha256Hex(Buffer.from(secret));
    // test
    // console.log("Secret Hash (to lock):", secretHash);

    // set a 21-minute timeout
    const lockHeight = 200;

    // Build HTLC script 
    const htlcScript =
        bitcoin.Opcode.OP_IF +
        (await bitcoin.script.generateHashLockScript(secretHash)) +
        (await bitcoin.data.pushData(alice.publicKey)) + alice.publicKey +
        bitcoin.Opcode.OP_ELSE +
        (await bitcoin.script.generateTimeLockScript(lockHeight)) +
        (await bitcoin.data.pushData(bob.publicKey)) + bob.publicKey +
        bitcoin.Opcode.OP_ENDIF +
        bitcoin.Opcode.OP_CHECKSIG;

    return { alice, bob, secret, secretHash, lockHeight, htlcScript };
};

export { setupHTLC };
