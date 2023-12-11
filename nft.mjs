import { AuthorityType, createMint, createSetAuthorityInstruction, getAccount, getMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { Connection, Keypair, LAMPORTS_PER_SOL, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";


const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

const owner = Keypair.generate();

const airdrop = await connection.requestAirdrop(owner.publicKey, 200 * LAMPORTS_PER_SOL);
await connection.confirmTransaction({signature: airdrop}, 'confirmed');

console.log(await connection.getBalance(owner.publicKey));

const nft = await createMint(
    connection,
    owner,
    owner.publicKey,
    owner.publicKey,
    0
);

const nftAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    owner,
    nft,
    owner.publicKey
);

await mintTo(connection, owner, nft, nftAccount.address, owner.publicKey, 1);

const txn = new Transaction().add(
    createSetAuthorityInstruction(
        nft,
        owner.publicKey,
        AuthorityType.MintTokens,
        null
        )
);

await sendAndConfirmTransaction(connection, txn, [owner]);

(async () => {
const nftInfo = await getMint(connection, nft);
console.log(nftInfo);
})();