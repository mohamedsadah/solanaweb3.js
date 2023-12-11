// generate address

import 
{ 
  AccountLayout, 
  NATIVE_MINT, 
  TOKEN_PROGRAM_ID, 
  closeAccount, 
  createAssociatedTokenAccountInstruction, 
  createMint, 
  createSyncNativeInstruction, 
  getAccount, 
  getAssociatedTokenAddress, 
  getMint, 
  getOrCreateAssociatedTokenAccount, 
  mintTo 

} 
  from "@solana/spl-token";

import 
{ 
  Connection, 
  Keypair, 
  LAMPORTS_PER_SOL, 
  PublicKey, 
  SystemProgram, 
  Transaction, 
  sendAndConfirmTransaction
} 

from "@solana/web3.js";

const connection = new Connection("http://127.0.0.1:8899", 'confirmed');

const signer = Keypair.generate();
console.log(
  `Public key: ${signer.publicKey.toBase58()}\n
   Secret key: ${signer.secretKey}`
);


// airdrop sol
const airdrop_signature = await connection.requestAirdrop(signer.publicKey, 2000 * LAMPORTS_PER_SOL);
await connection.confirmTransaction(airdrop_signature, 'processed');

// create tokens

const MintAuthority = Keypair.generate();
const FreezeAuthority = Keypair.generate();

const Ajo_token = await createMint(connection, signer, MintAuthority.publicKey, FreezeAuthority.publicKey, 6);
console.log(`Ajo Token Created. Address is: ${Ajo_token.toBase58()}\n`);

const Sada_token = await createMint(connection, signer, MintAuthority.publicKey, FreezeAuthority.publicKey, 6);
console.log(`Sahal Token Created. Address is: ${Sada_token.toBase58()}\n`);

const Christex_Token = await createMint(connection, signer, MintAuthority.publicKey, FreezeAuthority.publicKey, 6);
console.log(`Christex Token Created. Address is: ${Christex_Token.toBase58()}\n`);

const Mo_Token = await createMint(connection, signer, MintAuthority.publicKey, FreezeAuthority.publicKey, 6);
console.log(`Mo Token has been created. Address is: ${Mo_Token.toBase58()}\n`);

//check tokens supply

const Ajo_token_supply = await getMint(connection, Ajo_token);
console.log(`The Current supply of Ajo Token is: ${Ajo_token_supply.supply}`);

const sada_token_supply = await getMint(connection, Ajo_token);
console.log(`The Current supply of sahal Token is: ${sada_token_supply.supply}`);

const christex_token_supply = await getMint(connection, Ajo_token);
console.log(`The Current supply of christex Token is: ${christex_token_supply.supply}`);

const Mo_token_supply = await getMint(connection, Ajo_token);
console.log(`The Current supply of Mo Token is: ${Mo_token_supply.supply}\n`);

//create token accounts

const Ajo_Token_Account = await getOrCreateAssociatedTokenAccount(connection, signer, Ajo_token, signer.publicKey);
const sada_token_Account = await getOrCreateAssociatedTokenAccount(connection, signer, Sada_token, signer.publicKey);
const christex_token_account = await getOrCreateAssociatedTokenAccount(connection, signer, Christex_Token, signer.publicKey);
const Mo_token_Account = await getOrCreateAssociatedTokenAccount(connection, signer, Mo_Token, signer.publicKey);

//check tokenAccounts balance

const Ajo_Account_balance = await getAccount(connection, Ajo_Token_Account.address);
const sada_Account_balance = await getAccount(connection, sada_token_Account.address);
const christex_Account_balance = await getAccount(connection, christex_token_account.address);
const Mo_Account_balance = await getAccount(connection, Mo_token_Account.address);


console.log(
  `Account                                                                   Balance
  ...................................................................................
  Ajo Token Account: ${Ajo_Token_Account.address.toBase58()} : ${Ajo_Account_balance.amount}\n
  sahal Token Account: ${sada_token_Account.address.toBase58()} : ${sada_Account_balance.amount}\n
  christex Token Account: ${christex_token_account.address.toBase58()} : ${christex_Account_balance.amount}\n
  Mo Token Account: ${Mo_token_Account.address.toBase58()} : ${Mo_Account_balance.amount}\n`
);

//mint tokens to accounts

await mintTo(connection, signer, Ajo_token, Ajo_Token_Account.address, MintAuthority, 2000);
await mintTo(connection, signer, Sada_token, sada_token_Account.address, MintAuthority, 25000);
await mintTo(connection, signer, Christex_Token, christex_token_account.address, MintAuthority, 10000);
await mintTo(connection, signer, Mo_Token, Mo_token_Account.address, MintAuthority, 15000);




//check tokenaccount amount and token supply for each

const Ajosupply = await getMint(connection, Ajo_token);
const Ajo_AccountBalance = await getAccount(connection, Ajo_Token_Account.address);

const sadasupply = await getMint(connection, Sada_token);
const sada_AccountBalance = await getAccount(connection, sada_token_Account.address);

const christexsupply = await getMint(connection, Christex_Token);
const christex_accountBalance = await getAccount(connection, christex_token_account.address);

const Mosupply = await getMint(connection, Mo_Token);
const Mo_accountBalance = await getAccount(connection, Mo_token_Account.address);


console.log(
  `Token Supply                                Account Balance
   .............................................................
  ${Ajosupply.supply}          :        ${Ajo_AccountBalance.amount}\n
  ${sadasupply.supply}        :        ${sada_AccountBalance.amount}\n
  ${christexsupply.supply}     :        ${christex_accountBalance.amount}\n
  ${Mosupply.supply}           :        ${Mo_accountBalance.amount}\n
`);


// view all of owner's tokens and balances for each

const all_token = await connection.getTokenAccountsByOwner(signer.publicKey, {programId: TOKEN_PROGRAM_ID});

all_token.value.forEach((account) => {
    const accountData = AccountLayout.decode(account.account.data);

  console.log(`
      Tokens                                                 Balance\n
      ---------------------------------------------------------------\n
      ${new PublicKey(accountData.mint)}        ${accountData.amount}`);
    
  });

//   wrap tokens

const associatedTokenAccount = await getAssociatedTokenAddress(NATIVE_MINT, signer.publicKey);


const createTokenHolder = new Transaction().add(
createAssociatedTokenAccountInstruction(
    signer.publicKey, 
    associatedTokenAccount, 
    signer.publicKey, 
    NATIVE_MINT
      )
    );

(async()=>{
await sendAndConfirmTransaction(connection, createTokenHolder, [signer]);
})();

const sendSoltoATA = new Transaction().add(
    SystemProgram.transfer({
    fromPubkey: signer.publicKey,
    toPubkey: associatedTokenAccount,
    lamports: 155 * LAMPORTS_PER_SOL
}, 
    createSyncNativeInstruction(
        associatedTokenAccount
        )
    ));

(async()=>{
    await sendAndConfirmTransaction(connection, sendSoltoATA, [signer]);
    const ATAInfo = await getAccount(connection, associatedTokenAccount);
    console.log(`\n\nAddress: ${ATAInfo.mint}  Lamports: ${ATAInfo.amount}\n
    
    ${await connection.getBalance(signer.publicKey)}`);

    await closeAccount(
        connection,
        signer,
        associatedTokenAccount,
        signer.publicKey,
        signer
    )

    console.log(`${await connection.getBalance(signer.publicKey)}`);
})();







   
    
  