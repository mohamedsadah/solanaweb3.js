import { createAccount, createMint, getAccount, getOrCreateAssociatedTokenAccount, mintTo, transfer } from "@solana/spl-token";
import { Connection, Keypair, LAMPORTS_PER_SOL, Transaction, clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js";



const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const signer = Keypair.generate();
const auxkeypair = Keypair.generate();

const airdrop = await connection.requestAirdrop(signer.publicKey, 2 * LAMPORTS_PER_SOL);
await connection.confirmTransaction({signature: airdrop});

const mintAuth = Keypair.generate();
const freezeAuth = Keypair.generate();

const token = await createMint(
    connection,
    signer,
    mintAuth.publicKey,
    freezeAuth.publicKey,
    9
);

const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    signer,
    token,
    signer.publicKey
);

await mintTo(
    connection,
    signer,
    token,
    tokenAccount.address,
    mintAuth,
    500
);

console.log(`mint created: hash: ${token.toBase58()}\ns`)

const auxAccount = await createAccount(
    connection,
    signer,
    token,
    signer.publicKey,
    auxkeypair
);

const txn =  await transfer(
    connection,
    signer,
    tokenAccount.address,
    auxAccount,
    signer.publicKey,
    50
)



console.log(`Transaction completed. Signature: https://explorer.solana.com/${txn}/?cluster=devnet \n`);

const auxInfo = await getAccount(connection, auxAccount);
console.log(`Auxillary Account Balance is: ${auxInfo.amount}\n`);

const TokenAccInfo = await getAccount(connection, tokenAccount.address);
console.log(`Token Account Balance is: ${TokenAccInfo.amount}\n`);




