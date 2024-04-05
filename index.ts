import { gen_kp, read_kp } from "./src/generate_kp";
import { load_and_get_bal } from "./src/read_from_solana";
import {transfer_sol} from "./src/creating_tx";

async function main () {
    gen_kp();

    let pubkey = await read_kp();
    
    let bal = await load_and_get_bal();

    console.log("this is the balance: ", bal);
    
    await transfer_sol();

}
main();