import { NATIVE_MINT, closeAccount, createAssociatedTokenAccountInstruction, createMint, createSyncNativeInstruction, getAccount, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount, mintTo, transfer } from "@solana/spl-token";
import { Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction, clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js";

const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

const payer = Keypair.generate();


await connection.getBalance(payer.publicKey);

const airdrop = await connection.requestAirdrop(payer.publicKey, 2000 * LAMPORTS_PER_SOL);
await connection.confirmTransaction({signature: airdrop}, 'confirmed');


console.log(`Payer Balance: ${await connection.getBalance(payer.publicKey)}`);


const mintAuth = Keypair.generate();
const freezeAuth = Keypair.generate();

const sadahToken = await createMint(connection, payer, mintAuth.publicKey, freezeAuth.publicKey, 6);

const SadahTokenAccount = await getOrCreateAssociatedTokenAccount(connection, payer, sadahToken, payer.publicKey);

console.log(`sadah Token Account Created: ${SadahTokenAccount.address.toBase58()}\n`);

await mintTo(connection, payer, sadahToken, SadahTokenAccount.address, mintAuth, 500000);

const sadahInfo = await getAccount(connection, SadahTokenAccount.address);
console.log(`Balance in sadah Token Account before wrapping is : $sadah ${sadahInfo.amount}\n`);



console.log(`............................Wrap Tokens.............................\n`);

const associated_token_Account = await getAssociatedTokenAddress(NATIVE_MINT, payer.publicKey);

const createAssociatedTokenHolder_Transfer = new Transaction().add(
    createAssociatedTokenAccountInstruction(payer.publicKey, associated_token_Account, payer.publicKey, NATIVE_MINT),
    createSyncNativeInstruction( associated_token_Account)
    );
    
    (async()=>{
    await sendAndConfirmTransaction(connection, createAssociatedTokenHolder_Transfer, [payer]);
    })();
    
    
    
    const sendTx = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: associated_token_Account,
            lamports: 10 * LAMPORTS_PER_SOL
        })
    );

    await sendAndConfirmTransaction(connection, sendTx, [payer]);

    console.log(`Native Token successfully wrapped.`);

    const ATAInfo = await getAccount(connection, associated_token_Account);
    console.log(`Native: ${ATAInfo.address}       lamports: ${ATAInfo.amount}\n`);

    console.log(`...........unwrap Tokens...........`);

    console.log(`user Balance: ${await connection.getBalance(payer.publicKey)}`);
    
    const unwrap = await closeAccount(connection, payer, associated_token_Account, payer.publicKey, payer);
    
    console.log(`unwrapped`);

    // const atainfoafter = await getAccount(connection, associated_token_Account);
    // console.log(`lamports: ${atainfoafter.amount}`);
    
    console.log(`user new Balance: ${await connection.getBalance(payer.publicKey)}`);

    // send sadah token to another user

    const user = Keypair.generate();

    const userTokenAccount = await getOrCreateAssociatedTokenAccount(connection, payer, sadahToken, user.publicKey);

    console.log(`User Token Account Created: Sig: ${userTokenAccount.address.toBase58()}\n`);

    
        let sig = await transfer(
        connection, 
        payer, 
        SadahTokenAccount.address,
        userTokenAccount.address,
        payer.publicKey,
        500
        
        )

        console.log(`tx signature: ${sig}\n`);
    
        const userTokenBalnace = await getAccount(connection, userTokenAccount.address);
        console.log(`user Token Balnce is: ${userTokenBalnace.amount}`);
    