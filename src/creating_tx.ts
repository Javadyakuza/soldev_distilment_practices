import { airdropIfRequired } from "@solana-developers/helpers";
import { LAMPORTS_PER_SOL, Connection, SystemProgram, Transaction, clusterApiUrl, sendAndConfirmTransaction, PublicKey, Keypair } from "@solana/web3.js";
import { read_kp } from "./generate_kp";

export async function transfer_sol() {
    let conn = new Connection("http://localhost:8899", "confirmed");

    console.log(
        `✅ made a connection with the local cluster.`  
      );
      
    
    const transaction = new Transaction()
    
    const amount = 1;
    
    /// @dev use the previous code samples to create two accounts 
    const sender = await read_kp();
    
    console.log(
        `❗ Transferring from: ${ sender.publicKey }, balance: ${await conn.getBalance(sender.publicKey)}`
    );
      
    const recipient = Keypair.generate();

    console.log(
        `❗ Transferring to: ${ recipient.publicKey }, balance: ${await conn.getBalance(recipient.publicKey)}`
    );

    
    // air drop the newly created sender account to cover the fees and transfer from its sol to the recipient account.
    await airdropIfRequired(
        conn,
        sender.publicKey,
        2 * LAMPORTS_PER_SOL,
        0.5 * LAMPORTS_PER_SOL,
    );
    
    const sendSolInstruction = SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: recipient.publicKey,
      lamports: LAMPORTS_PER_SOL * amount
    })
    
    transaction.add(sendSolInstruction)
    
    const signature = await sendAndConfirmTransaction(
      conn,
      transaction,
      [sender]
    )
    
    console.log(
        `💸 Transferred from: ${ sender.publicKey }, balance: ${await conn.getBalance(sender.publicKey)}`
    );
      
    console.log(
        `💸 Transferred to: ${ recipient.publicKey }, balance: ${await conn.getBalance(recipient.publicKey)}`
    );

}


