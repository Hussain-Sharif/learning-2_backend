import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app=express()

app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,
        credentials:true
    }
))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true})) // EXTENDED True is givien to allow in url if there is any obj in obj 
app.use(express.static("public"))  // to serve static images, CSS files, and JavaScript files in a directory named public
app.use(cookieParser())


//Import Routes...

import userRouter from './routes/users.routes.js'

  
//routes declaration
app.use("/api/v1/users",userRouter)// lokies like http:localhost:3000/api/v1/users/register

export {app}