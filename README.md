[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/1neRm4kC)
# assignment-4
Bitcoin Scripting


# Assignment A

## Given Script:

```

OP_DUP OP_HASH160 <PubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
```


---

## Tasks

### 1. Break down each opcode's purpose
- **OP_DUP:** Pushes a copy of the  topmost stack item onto the stack.  
- **OP_HASH160:** Consumes the topmost item on the stack, computes the `RIPEMD160(SHA256())` hash of that item, and pushes that hash onto the stack.  
- **OP_EQUALVERIFY:** Runs `OP_EQUAL` and then `OP_VERIFY` in sequence.  
- **OP_CHECKSIG:** Consumes a signature and a full public key, and pushes `true` onto the stack if the transaction data specified by the `SIGHASH` flag was converted into the signature using the same ECDSA private key that generated the public key. Otherwise, it pushes `false` onto the stack.  

---

### 2. Create a diagram showing data flow

![Data Flow Diagram](./dfd.jpg)

---

### 3. Identify what happens if signature verification fails
`OP_CHECKSIG` pushes `false` onto the stack, causing the transaction validation to fail and the output to remain unspent.

---

### 4. Explain the security benefits of hash verification
Hash verification ensures that only the rightful owner of the private key corresponding to the hashed public key can spend the output, preventing unauthorized access and improving transaction security.This process ensures security, trust, and operational efficiency in the blockchain network, making it an essential element in Bitcoin transactions and mining.




# Assignment B

### Implement a Hashed Time-Lock Contract for atomic swap between Alice and Bob:

Alice can claim with secret preimage within 21 minutes. Bob gets refund after 21 minutes

## Tasks:

### a) Complete the HTLC script

*Solution overview*:

- Generate wallet key pairs for Alice & Bob
- Create a secret and compute its SHA256 hash
- Build a HTLC script:
  - Alice can claim funds using the secret before timeout
  - Bob can refund after timeout
- Produce a P2WSH address to send funds to

**See:** [HtlcScript.js](./HtlcScript.js)


### b) Create claiming transaction script

*Solution overview*:

- Build a transaction for Alice to claim the HTLC using the secret preimage
- Unlocks the HTLC using the OP_IF branch
- Prints the raw transaction hex

[See: Claim.js](./Claim.js)


### c) Create refund transaction script

*Solution overview*:

- Build a transaction for Bob to refund the HTLC after timeout

- Unlocks the HTLC using the OP_ELSE branch

- Prints the raw transaction hex

[See Refund.js](./Refund.js)


### d) Test with sample hash and timeout

#### i) Verify the HTLC works for both Alice (claim) and Bob (refund)

**Example Usage:**

```bash
cd scripts
node HtlcScript.js
```

**Expected output:**
```
Alice's Public Key: 02eac8d31f48bb7042979bb39acc245eff4f1c4ec00461e7af300f878a80c220ff
Bob's Public Key: 02905ecbe3bf88818bf073700c6c80231af8ec56bcd31fd5df8f6917b6918ba569

✅ HTLC Redeem Script:
 63aa20ca246c64be7e0c26e2f21c853aeb601c7aa5bd120cc39fc05360adc8081425f4882102eac8d31f48bb7042979bb39acc245eff4f1c4ec00461e7af300f878a80c220ff6702c800b1752102905ecbe3bf88818bf073700c6c80231af8ec56bcd31fd5df8f6917b6918ba56968ac

✅The HTLC Address(P2WSH) is: bc1qt4py9e8dg05lwqxqms7tm2rg5ca5mkx8lfnf0d56xhtqspd556ysjzfeux
```

#### ii) Test Alice’s Claim (before timeout)

**Example Usage:**

```bash
node Claim.js
```

**Expected output:**
```
✅ Alice's claiming transaction hex:
 01000000000101aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0000000000fdffffff01b88201000000000017a9144b07651e30ae432a486a1461b31477cc755c0dbb8700000000
```

#### iii) Test Bob’s Refund (after timeout)

**Example Usage:**

```bash
node Refund.js
```

**Expected output:**
```
 ✅ Bob's refund transaction hex:
 01000000000101aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0000000000fdffffff01b88201000000000017a91438d07fc92a4a302ef12596affef54bc1759a3e318700000000
```
