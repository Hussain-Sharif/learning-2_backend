import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB=async()=>{
    try {
       const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log(`\n monogoDB is Connected!! DB Instance: ${connectionInstance}`)
       console.log(`\n monogoDB is Connected!! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(
            `Error of MongoDB: ${error}`
        )
        process.exit(1)
    }
}

export default connectDB