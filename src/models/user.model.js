import mongoose, {Schema} from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema=new Schema({
    username:{
        type:String,
        require:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true // If we want to anable serach speed in any field for data we use `index:true` just to make optimization
    },
    email:{
        type:String,
        require:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        require:true,
        trim:true,
        index:true // If we want to anable serach speed in any field for data we use `index:true` just to make optimization
    },
    avatar:{
        type:String,  // Cloudinary URL is Stored
        required:true
    },
    coverImage:{
        type:String,  // Cloudinary URL is Stored
        required:false
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,"PASSWORD is Required"] // To Write any Error we can provide them
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})

// we are using pre for writing any logic, before saving the data
//here we are not using the arrow function because it will not have pre method's `this` context so we choose function itself
// Here using async as it takes longer time s  for cryptographic Computations
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next() // password here is the field create while creating the Schema
    this.password=await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.ispasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign({ // Creating a payload
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({ // Creating a payload
        _id:this._id
    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const User=mongoose.model("User",userSchema)