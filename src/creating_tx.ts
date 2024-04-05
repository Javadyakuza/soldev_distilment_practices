import { airdropIfRequired, getKeypairFromEnvironment } from "@solana-developers/helpers";
import { LAMPORTS_PER_SOL, Connection, SystemProgram, Transaction, clusterApiUrl, sendAndConfirmTransaction, PublicKey, Keypair } from "@solana/web3.js";
import { read_kp } from "./generate_kp";
import * as web3 from "@solana/web3.js";
import "dotenv/config"


export async function transfer_sol() {
    // see the documentation to learn how to run a local cluster
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


export async function read_from_counter(): Promise<String> {
    const connection = new Connection(clusterApiUrl("devnet"));

    // let conn = new Connection("http://localhost:8899", "confirmed");

    // loading the payer of the transaction
    let payer = await read_kp();

    await airdropIfRequired(
        connection,
        payer.publicKey,
        1 * LAMPORTS_PER_SOL,
        0.5 * LAMPORTS_PER_SOL,
    );
    // static addresses
    const PROGRAM_ADDRESS = new web3.PublicKey('ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa')
    const PROGRAM_DATA_ADDRESS =  new web3.PublicKey('Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod');

    const transaction = new web3.Transaction()
    const programId = new web3.PublicKey(PROGRAM_ADDRESS)
    const ProgramDataId = new web3.PublicKey(PROGRAM_DATA_ADDRESS)

    // creating the instruction  
    const instruction = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: ProgramDataId,
          isSigner: false,
          isWritable: true
        },
      ],
      programId
    })

    // adding the instruction to the transaction object
    transaction.add(instruction)
    


    const signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [payer]
    )
    
    console.log(`✅ Transaction completed! Signature is ${signature}`)
    
    return signature;
}