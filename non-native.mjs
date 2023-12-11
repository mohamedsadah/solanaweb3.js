import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction, clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js";


const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const signer = Keypair.generate();
console.log(`\n SECRET_KEY = ${signer.secretKey}\n`);

const sig = await connection.requestAirdrop(signer.publicKey, 5000 * LAMPORTS_PER_SOL)
await connection.confirmTransaction({signature: sig}, 'confirmed');

const program_data_ID = new PublicKey('Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod');
const programID = new PublicKey('ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa');

const txn = new Transaction().add(
    new TransactionInstruction({
        keys: [{
            pubkey: program_data_ID,
            isSigner: false,
            isWritable: true
        }],
        programId: programID
    })
);

let signature = await sendAndConfirmTransaction(connection, txn, [signer]);

console.log(`Program successfully pinged. txnhash: https://explorer.solana.com/tx/${signature}?cluster=devnet`);