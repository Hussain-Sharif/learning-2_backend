// require("dotenv").config({path:"./env"})
import dotenv from 'dotenv'

//import express from 'express'
//import mongoose from 'mongoose'
//import { DB_NAME } from "../constants";

import connectDB from "./db/index.js";
import { app } from './app.js';

// Approch-2 
// For More Clean Code
// We Establish DB Connection in DB folder and bring into this index.js File
// Express App is placed/Created in app.js and we import in this file index.js

dotenv.config({
    path:"./env"
})

connectDB() // In general it returns Promise to handle that we use .then and .catch
.then(()=>{
    // Sometimes DB is connected but server app not able to listen so it thrwos error
    app.on("error",(error)=>{
        console.log("Server App Listen ERROR:",error)
        throw error
    })
   app.listen(process.env.PORT||8000,()=>{
    console.log(`Server is RUNNNING and Listening !!! at ${process.env.PORT||8000}`)
   })
})
.catch((error)=>{
    console.log(`MongoDB Connection with express is Failed: ${error}`)
})



/*
// Approch-1 Of writing the Code mostly proffestional...
const app=express()

// Db Connection
//Writing the Function in IIFE proffesional way of Writing strating ith ";" to avoid warnings/errors
;(async()=>{
    try {
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        // Sometimes DB is connected but server app not able to listen so it thrwos error
        app.on("error",(error)=>{
            console.log("Err: ",error)
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`Server is started at: ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("Error: ",error)
    }
})()
*/