
import {ApiError} from "../utils/ApiError.js"

export const emailValidator=(email)=>{
    if(!email.includes("@")) {
        throw new ApiError(400,"@ is missing")
    }
    if(email===email.toUpperCase()) {
        throw new ApiError(400,"email should be in lowercase")
    }
}

export const passwordValidator=(password)=>{
    if(password.length<8){
        throw new ApiError(401,"password should minimium 8 characters long")
    }
}

