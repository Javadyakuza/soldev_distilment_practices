import { gen_kp, read_kp } from "./src/generate_kp";
import { load_and_get_bal } from "./src/read_from_solana";
import {read_from_counter, transfer_sol} from "./src/creating_tx";
import * as token from '@solana/spl-token';
import * as web3 from "@solana/web3.js";
import { initializeKeypair } from "@solana-developers/helpers";
import { full_spl_ops } from "./src/spl_tokens";

async function main () {
    // gen_kp();

    // let pubkey = await read_kp();
    
    // let bal = await load_and_get_bal();

    // console.log("this is the balance: ", bal);
    
    // await transfer_sol();
    // await read_from_counter();

    await full_spl_ops();

}
main();