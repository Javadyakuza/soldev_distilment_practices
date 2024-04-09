import * as web3 from "@solana/web3.js";
import * as token from '@solana/spl-token'
import { InitializeKeypairOptions, initializeKeypair } from "@solana-developers/helpers";

async function createNewMint(
    connection: web3.Connection,
    payer: web3.Keypair,
    mintAuthority: web3.PublicKey,
    freezeAuthority: web3.PublicKey,
    decimals: number
  ): Promise<web3.PublicKey> {
  
    const tokenMint = await token.createMint(
      connection,
      payer,
      mintAuthority,
      freezeAuthority,
      decimals
    );
  
    console.log(
      `Token Mint: https://explorer.solana.com/address/${tokenMint}?cluster=devnet`
    );
  
    return tokenMint;
  }

async function createTokenAccount(
    connection: web3.Connection,
    payer: web3.Keypair,
    mint: web3.PublicKey,
    owner: web3.PublicKey
  ) {
    const tokenAccount = await token.getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      owner
    )
  
    console.log(
      `Token Account: https://explorer.solana.com/address/${tokenAccount.address}?cluster=devnet`
    )
  
    return tokenAccount
}

async function mintTokens(
    connection: web3.Connection,
    payer: web3.Keypair,
    mint: web3.PublicKey,
    destination: web3.PublicKey,
    authority: web3.Keypair,
    amount: number
  ) {
    const transactionSignature = await token.mintTo(
      connection,
      payer,
      mint,
      destination,
      authority,
      amount
    )
  
    console.log(
      `Mint Token Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
    )
}

async function approveDelegate(
    connection: web3.Connection,
    payer: web3.Keypair,
    account: web3.PublicKey,
    delegate: web3.PublicKey,
    owner: web3.Signer | web3.PublicKey,
    amount: number
  ) {
    const transactionSignature = await token.approve(
      connection,
      payer,
      account,
      delegate,
      owner,
      amount
    )
  
    console.log(
      `Approve Delegate Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
    )
}

async function transferTokens(
    connection: web3.Connection,
    payer: web3.Keypair,
    source: web3.PublicKey,
    destination: web3.PublicKey,
    owner: web3.Keypair,
    amount: number
  ) {
    const transactionSignature = await token.transfer(
      connection,
      payer,
      source,
      destination,
      owner,
      amount
    )
  
    console.log(
      `Transfer Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
    )
}

async function revokeDelegate(
    connection: web3.Connection,
    payer: web3.Keypair,
    account: web3.PublicKey,
    owner: web3.Signer | web3.PublicKey,
  ) {
    const transactionSignature = await token.revoke(
      connection,
      payer,
      account,
      owner,
    )
  
    console.log(
      `Revote Delegate Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
    )
}

async function burnTokens(
    connection: web3.Connection,
    payer: web3.Keypair,
    account: web3.PublicKey,
    mint: web3.PublicKey,
    owner: web3.Keypair,
    amount: number
  ) {
    const transactionSignature = await token.burn(
      connection,
      payer,
      account,
      mint,
      owner,
      amount
    )
  
    console.log(
      `Burn Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
    )
}

export async function full_spl_ops() {

    const connection = new web3.Connection("http://localhost:8899", "confirmed")

    const alice = await initializeKeypair(connection);
    const bob = await initializeKeypair(connection);

    console.log(`test users initiated ✅ \nalice publickey: ${alice.publicKey.toString()} \nbob publickey: ${bob.publicKey.toString()}`)


    const mint = await createNewMint(
      connection,
      alice,
      alice.publicKey,
      alice.publicKey,
      2
    )
    

    const mintInfo: token.Mint = await token.getMint(connection, mint);

    console.log(`created the new mint account ✅ \n Mint Account address`, mintInfo.address);

    const aliceTokenAccount = await createTokenAccount(
      connection,
      alice,
      mint,
      alice.publicKey
    )

    let alice_token_account_info: token.Account = await token.getAccount(connection, aliceTokenAccount.address);

    console.log(`created the new token account for alice ✅ \n alice Token Account address: `, alice_token_account_info.address.toString());

    const bobTokenAccount = await createTokenAccount(
        connection,
        bob,
        mint,
        bob.publicKey
      )
  
      let bob_token_account_info: token.Account = await token.getAccount(connection, bobTokenAccount.address);
  
      console.log(`created the new token account for bob ✅ \n Bob Token Account address: `, bob_token_account_info.address.toString())

    await mintTokens(
      connection,
      alice,
      mint,
      aliceTokenAccount.address,
      alice,
      100 * 10 ** mintInfo.decimals
    )
    
    alice_token_account_info = await token.getAccount(connection, aliceTokenAccount.address);


    console.log("Minted tokens for alice, new amount: ", alice_token_account_info.amount.toString());

    const delegate = bob;
    
    await approveDelegate(
      connection,
      alice,
      aliceTokenAccount.address,
      delegate.publicKey,
      alice.publicKey,
      50 * 10 ** mintInfo.decimals
    )
    
        
    await transferTokens(
      connection,
      bob,
      aliceTokenAccount.address,
      bobTokenAccount.address,
      delegate,
      50 * 10 ** mintInfo.decimals
    )
    
    alice_token_account_info = await token.getAccount(connection, aliceTokenAccount.address);
    bob_token_account_info = await token.getAccount(connection, bobTokenAccount.address);



    console.log("transferred 50 tokens from alice to bob, alice balance : ", bob_token_account_info.amount.toString(), "bob balance: ", bob_token_account_info.amount.toString());

    // await revokeDelegate(
    //   connection,
    //   user,
    //   tokenAccount.address,
    //   user.publicKey,
    // )
    
    
    // await burnTokens(
    //   connection, 
    //   user, 
    //   tokenAccount.address, 
    //   mint, user, 
    //   25 * 10 ** mintInfo.decimals
    // )
    
      
}