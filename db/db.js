import mongoose, { connect } from "mongoose";


const connectDB = async()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.mongo_URI}`)
        console.log(`\n MongoDB connected on host  !! ${connectionInstance.connection.host} `);
    } catch (error) {
        console.log("mongo contain error ",error);
        process.exit(1)
    }
}

export default connectDB

