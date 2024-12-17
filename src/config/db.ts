import { connect } from "mongoose";
import { MONGODB_URI } from ".";
import { green,  blue} from 'colorette';

export async function connectDB() {
    try {
        await connect(MONGODB_URI as string);
        console.info(
            blue(`
            ╔═══════════════════════════╗
            ║  💾 DATABASE CONNECTED    ║
            ╚═══════════════════════════╝`));
    } catch (err) {
        if (err instanceof Error) {
            console.error("an error occurred. \nRetrying connection")
            connectDB()
        };
    }
}