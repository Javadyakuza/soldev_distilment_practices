import {Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { read_kp } from "./generate_kp";

export async function load_and_get_bal() : Promise<number> {

    // loading the public key from the env
    let public_key = (await read_kp()).publicKey
    
    // stablish a connection
    let conn = new Connection("http://localhost:8899", "confirmed");

    let bal_in_lamports = await conn.getBalance(public_key);

    let bal_in_sol = bal_in_lamports / LAMPORTS_PER_SOL;

    return bal_in_sol;
}