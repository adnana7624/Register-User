// require('dotenv').config({path: './env'})

import dotenv from "dotenv"
import connectDB from "../db/db.js"
import express from "express"
const app=express()

dotenv.config({
    path:'./env'
})

connectDB()

.then(()=>{
    app.listen(process.env.PORT),()=>{
        console.log(`app listening on port : ${process.env.PORT}`);
        
    }
})
.catch((error)=>{
    console.log("mongoDB connection failed",error);
})






/*
(async ()=>{
    try {
        await mongoose.connect(`$(process.env.mongo_URI)/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERROR : ",error);
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`app listing on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("ERRR : ",error)
        throw error
        
    }
})()
*/