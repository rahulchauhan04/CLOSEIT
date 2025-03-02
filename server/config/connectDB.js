import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGODB_URI) {
    throw new Error("MONGO_URL is not defined in .env file");
}

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB Connected");
    } catch (error) {
        console.log("Mongodb connection error", error);
        process.exit(1);
    }
}

export default connectDB;