import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()

app.use(cors({
    origin:process.env.,
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extends:true,{limit:"16kb"}}))
app.use(express.static("public"))

export default app()
