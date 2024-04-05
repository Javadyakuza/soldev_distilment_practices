import {Keypair} from "@solana/web3.js";
import {promises as fs } from 'fs';
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
export function gen_kp () {

    const keypair = Keypair.generate();

    console.log("private key : ", keypair.secretKey.toString(), " \n public key : ", keypair.publicKey.toString());
} 

export async function read_kp (): Promise<Keypair> {
    // let pk_file: Uint8Array = await fs.readFile("test_pk.txt");
    let keypair = getKeypairFromEnvironment("TESTPK");
    console.log("this is the public key fetched from the pk : ",keypair.publicKey.toString());
    return keypair;
}