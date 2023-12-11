// generate address

import 
{ 
  AccountLayout, 
  TOKEN_PROGRAM_ID, 
  createMint, 
  getAccount, 
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
  clusterApiUrl
} 

from "@solana/web3.js";

const connection = new Connection('http://localhost:8899', 'confirmed');

const signer = Keypair.generate();
console.log(
  `Public key: ${signer.publicKey.toBase58()}\n
   Secret key: ${signer.secretKey}\n`
);


// airdrop sol
const airdrop_signature = await connection.requestAirdrop(signer.publicKey, 200 * LAMPORTS_PER_SOL);
await connection.confirmTransaction(airdrop_signature, 'confirmed');

// create tokens

const MintAuthority = Keypair.generate();
const FreezeAuthority = Keypair.generate();

const Ajo_token = await createMint(connection, signer, MintAuthority.publicKey, FreezeAuthority.publicKey, 6);
console.log(`Ajo Token Created. Address is: ${Ajo_token.toBase58()}\n`);

const Sahal_token = await createMint(connection, signer, MintAuthority.publicKey, FreezeAuthority.publicKey, 6);
console.log(`Sahal Token Created. Address is: ${Sahal_token.toBase58()}\n`);

const Christex_Token = await createMint(connection, signer, MintAuthority.publicKey, FreezeAuthority.publicKey, 6);
console.log(`Christex Token Created. Address is: ${Christex_Token.toBase58()}\n`);

const Mo_Token = await createMint(connection, signer, MintAuthority.publicKey, FreezeAuthority.publicKey, 6);
console.log(`Mo Token has been created. Address is: ${Mo_Token.toBase58()}\n`);

//check tokens supply

const Ajo_token_supply = await getMint(connection, Ajo_token);
console.log(`The Current supply of Ajo Token is: ${Ajo_token_supply.supply}`);

const sahal_token_supply = await getMint(connection, Ajo_token);
console.log(`The Current supply of Ajo Token is: ${sahal_token_supply.supply}`);

const christex_token_supply = await getMint(connection, Ajo_token);
console.log(`The Current supply of Ajo Token is: ${christex_token_supply.supply}`);

const Mo_token_supply = await getMint(connection, Ajo_token);
console.log(`The Current supply of Ajo Token is: ${Mo_token_supply.supply}\n`);

//create token accounts

const Ajo_Token_Account = await getOrCreateAssociatedTokenAccount(connection, signer, Ajo_token, signer.publicKey);
const sahal_token_Account = await getOrCreateAssociatedTokenAccount(connection, signer, Sahal_token, signer.publicKey);
const christex_token_account = await getOrCreateAssociatedTokenAccount(connection, signer, Christex_Token, signer.publicKey);
const Mo_token_Account = await getOrCreateAssociatedTokenAccount(connection, signer, Mo_Token, signer.publicKey);

//check tokenAccounts balance

const Ajo_Account_balance = await getAccount(connection, Ajo_Token_Account.address);
const sahal_Account_balance = await getAccount(connection, sahal_token_Account.address);
const christex_Account_balance = await getAccount(connection, christex_token_account.address);
const Mo_Account_balance = await getAccount(connection, Mo_token_Account.address);


console.log(
  `Account                                                                   Balance
  ...................................................................................
  Ajo Token Account: ${Ajo_Token_Account.address.toBase58()} : ${Ajo_Account_balance.amount}\n
  sahal Token Account: ${sahal_token_Account.address.toBase58()} : ${sahal_Account_balance.amount}\n
  christex Token Account: ${christex_token_account.address.toBase58()} : ${christex_Account_balance.amount}\n
  Mo Token Account: ${Mo_token_Account.address.toBase58()} : ${Mo_Account_balance.amount}\n`
);

//mint tokens to accounts

await mintTo(connection, signer, Ajo_token, Ajo_Token_Account.address, MintAuthority, 2000);
await mintTo(connection, signer, Sahal_token, sahal_token_Account.address, MintAuthority, 25000);
await mintTo(connection, signer, Christex_Token, christex_token_account.address, MintAuthority, 10000);
await mintTo(connection, signer, Mo_Token, Mo_token_Account.address, MintAuthority, 155999);


//check tokenaccount amount and token supply for each

const Ajosupply = await getMint(connection, Ajo_token);
const Ajo_AccountBalance = await getAccount(connection, Ajo_Token_Account.address);

const sahalsupply = await getMint(connection, Sahal_token);
const sahal_AccountBalance = await getAccount(connection, sahal_token_Account.address);

const christexsupply = await getMint(connection, Christex_Token);
const christex_accountBalance = await getAccount(connection, christex_token_account.address);

const Mosupply = await getMint(connection, Mo_Token);
const Mo_accountBalance = await getAccount(connection, Mo_token_Account.address);


console.log(
  `Token Supply              Account Balance
   ..........................................
  ${Ajosupply.supply}          :        ${Ajo_AccountBalance.amount}\n
  ${sahalsupply.supply}        :        ${sahal_AccountBalance.amount}\n
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



   
    
  