import { createMint, getAccount, getMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import * as web3 from "@solana/web3.js";


const connection = new web3.Connection("http://127.0.0.1:8899", 'confirmed');

const payer = web3.Keypair.generate();
console.log(`SECRET_KEY: ${new Uint8Array(payer.secretKey)}`);

(async()=>{
    const airdrop_signature = await connection.requestAirdrop(payer.publicKey, 200 * web3.LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdrop_signature, 'confirmed');
    console.log(`Airdrop signature: ${airdrop_signature}`);

    const balance = await connection.getBalance(payer.publicKey);
    console.log(`balance: ${balance/web3.LAMPORTS_PER_SOL}`);

    console.log("........................Create Token......................................\n\n\n")

    const MintAuthority = web3.Keypair.generate();
    const FreezeAuthority = web3.Keypair.generate();

    const mint = await createMint(
        connection, 
        payer,
        MintAuthority.publicKey,
        FreezeAuthority.publicKey,
        6
        
    );

    console.log(`Token addresss is: ${mint.toBase58()}`);

    console.log(".....................Token supply..........................\n\n\n")
    
    
    const mintInfo = await getMint(connection, mint);
    console.log(`current supply 0f token created is: ${mintInfo.supply}`);

    console.log(".....................Create Token Account..........................\n \n\n")

    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection, payer, mint, payer.publicKey
    );

    console.log(`Token Account Created. Account Address: ${tokenAccount.address.toBase58()}`);

    const Amount_before_Mintsupply =  await getAccount(connection, tokenAccount.address);
    console.log(`Initial Token Supply in Account: ${Amount_before_Mintsupply.amount}`);
    

    console.log(".............Mint Created Tokens Into Token ACcount...........\n\n \n");

    await mintTo(connection, payer, mint, tokenAccount.address, MintAuthority, 10000);
    
    const Amount_after_Mintsupply = await getAccount(connection, tokenAccount.address);

    console.log(`You have successfully minted ${Amount_after_Mintsupply.amount} to your token account`);

    const mintInfo_afterSupply = await getMint(connection, mint);
    console.log(`The supply of Tokens is: ${mintInfo_afterSupply.supply} `);
})();


