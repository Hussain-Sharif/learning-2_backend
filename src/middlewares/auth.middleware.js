
import  jwt from "jsonwebtoken";

import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";



export const verifyJWT=asyncHandler(async(req,_,next)=>{
    
    try {
        const accessToken=await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if(!accessToken){
            throw new ApiError(401,"UnAuthorized Request")
        }
    
        const decodedTokenInfo=await jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
    
        const user=await User.findById(decodedTokenInfo?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401,"Invalid Access Error")
        }
    
        req.user=user;
        next()
    } catch (error) {
        throw new ApiError(401,"Invalid Access Token")
    }
    

})