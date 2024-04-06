import * as borsh from '@coral-xyz/borsh'
import * as web3 from '@solana/web3.js'


export async function seriallize_test_data(): Promise<String> {

    // defining the struct of the accepting input
    const equipPlayerSchema = borsh.struct([
      borsh.u8('variant'),
      borsh.u16('playerId'),
      borsh.u256('itemId')
    ])

    // creating an array of bytes with a fixed length of 1000 bytes.
    const buffer = Buffer.alloc(1000)
    
    // encoding the values with the defined schema
    equipPlayerSchema.encode({ variant: 2, playerId: 1435, itemId: 737498 }, buffer)

    // separating the encoded bytes from the untouched ( 0 ) rest of the bytes
    const instructionBuffer = buffer.slice(0, equipPlayerSchema.getSpan(buffer))
    
    // the cluster
    const endpoint = web3.clusterApiUrl('devnet')
    
    // stablishing a connection
    const connection = new web3.Connection(endpoint)
    
    // creating a new transaction object
    const transaction = new web3.Transaction()
    
    // static addresses

    /// @dev the normal keypair of the player
    const player = web3.Keypair.generate();

    /// @dev the target and the platforms program must generate an account for the user and save the data in that, the user must retrieve that address from the program separately 
    const playerInfoAccount = web3.PublicKey.unique();

    // the target and starting programs address
    const PROGRAM_ID = web3.PublicKey.default;
    
    // creating a instruction with the encoded data, the key sets and the target and starting program id.
    const instruction = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: player.publicKey,
          isSigner: true,
          isWritable: false,
        },
        {
          pubkey: playerInfoAccount,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: web3.SystemProgram.programId, 
          isSigner: false,
          isWritable: false,
        }
      ],
      data: instructionBuffer,
      programId: PROGRAM_ID
    })
    
    transaction.add(instruction)
    
    web3.sendAndConfirmTransaction(connection, transaction, [player]).then((txid) => {
      console.log(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`)
    })
    return "";

}
