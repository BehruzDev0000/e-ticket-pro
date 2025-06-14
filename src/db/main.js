import { connect } from "mongoose";
import config from '../config/main.js'
export const connectDB = async () => {
    try {
        await connect(config.MONGO_URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.log(`Error on connecting database: ${error}`);
    }
}
