// const express =require("express")
import express from "express"

const app=express()
const port=3000

app.get("/",(req,res)=>{
    res.send("Hello Sharif")
})

app.listen(port,()=>{
    console.log(`Started App at ${port}`)
})