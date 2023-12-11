import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";
import { createMint, createMultisig, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { Connection, Keypair, PUBLIC_KEY_LENGTH, PublicKey, clusterApiUrl } from "@solana/web3.js";
import * as dotenv from "dotenv";

const connection = new Connection('http://localhost:8899', 'confirmed');

dotenv.config();

const signer = getKeypairFromEnvironment('SECRET_KEY');

const signer2 = Keypair.generate();
const signer3 = Keypair.generate();

const multisigAccount = await createMultisig(
    connection,
    signer,
    [
        signer,
        signer2,
        signer3
    ],
    3
);

console.log(`\nMultisig created. key: ${multisigAccount}\n`);

const token = await createMint(
    connection,
    signer,
    multisigAccount,
    multisigAccount,
    9,

);

console.log(`Token Created. hash: ${token.toBase58()}\n`);

const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    signer,
    token,
    signer.publicKey
);

console.log(`Token Account created, hash: ${tokenAccount.address}`);

const minttokens = await mintTo(
    connection,
    signer,
    token,
    tokenAccount.address,
    multisigAccount,
    500,
    [
        signer,
        signer2,
        signer3
    ]
);

console.log(`token Minted: hash: ${minttokens}\n`)

