import asyncHandler from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { emailValidator,passwordValidator } from "../utils/validation.js"
import {User} from '../models/user.model.js'
import uploadOnCloudinary from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async (userId)=>{
    try {
        const user=await User.findById(userId)

        // Here we generate the method to gen tokens 
       const accessToken=await user.generateAccessToken()
        const refreshToken=await user.generateRefreshToken()

        // Here we save the refresh toekn in DB
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false}) // everytime we save() need password to validate so to avoid validation we use the this property as "false" 

        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went Wrong while generating refresh and Access Token")
    }
}

const registerUser=asyncHandler(async(req,res)=>{
    // get user details from front-end side 
    // validation of data like not empty
    // handling if user already exists: username, email 
    // handling/checking for images and also  for avatar
    // upload them to cloudinary, avatar 
    // create a user Object -create entry in DB of MongoDB
    // remove password and refresh token from response while submitting the response for frontend.
    // check if user created or not?
    // if created then sending valid reponse or we can throw an error...
    const {username, fullname,email,password}=req.body
    console.log({username, fullname,email,password})

    if(
       [username, fullname, email, password].some((each) => !each || each.trim() === "")

    ){
        throw new ApiError(400,"All Fields are required")
    }
    emailValidator(email)
    passwordValidator(password)
    const existedUser=await User.findOne({
        $or: [{email},{username}]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or username is already existed")
    }

    // as we added middleware in respective route.js then this will add the additional field's in request!!
    // So, becoz of multer we can now handle the file stored over on some path....
    // here avatar is written bcoz, we mentioned that in mutler.js as a field while configurating

    // where req.files will return prototpye of array of objects contains file's details to the respective file
    const avatarLocalPath=req.files?.avatar[0]?.path 
    // const coverImageLocalPath=req.files?.coverImage[0]?.path

    //<<<<<<--->>>> we check if coverImage is given are not 
    let coverImageLocalPath; //  if below condition is false then it will have null or undifned value
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath=req.files.coverImage[0].path;
    }

    //<<<<<<--->>>> we check if avatar is given are not 
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    //<<<<<<--->>>> Now we upload it on cloudinary
    const avatarUploaded=await uploadOnCloudinary(avatarLocalPath)
    const coverImageUploaded=await uploadOnCloudinary(coverImageLocalPath) // if it's having undefined or null value in varaible then cloudinary returns the empty string

    if(!avatarUploaded){
        throw new ApiError(400, "Avatar file is required")
    }

    //<<<<<<<--->>>>>>>> Now let's create a DB for user entry
    const user=await User.create({
        fullname,
        avatar:avatarUploaded.url,
        coverImage:coverImageUploaded?.url||"",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" // to show the user by excluding the password and refreshToken fields....
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering as user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Registered Successfully")
    )


})

const loginUser=asyncHandler(async(req,res)=>{
    // req body->data
    // username or email
    // find the user
    // password check
    // access and refresh token 
    // we send token in cookie form

    const {username, password,email}=req.body

    if(!username && !email){
        throw new ApiError(400, "Please enter username or email is required")
    }

    const user=await User.findOne({$or:[{username},{email}]})

    if(!user){
        throw new ApiError(404,"User Doesn't Exist")
    }

    // the created mehtods in user model can't reused with model named "User" but to utilize the methods need instance like "user" created above 
    const isTrueUser=await user.ispasswordCorrect(password)

    if(!isTrueUser){
        throw new ApiError(401,"Invalid User credentails")
    }

    // EVEN in funtion is async still it's better to have await 
    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)

    // the important thing is to what actaully need to send as response 
    // for that the the "user" instance created within this asyncHandler will not have generated refreshToken value with it
    // So, there are 
    // 2 possiabilities in which 
    // 1) Again call DB based on user._id or creadentials {In which it will have the updated value of refeshToken}
    // 2) or update the instance "user" of this "User" Model 
    // Decide based on which is most appropiate let's say to avoid the DB call we go with 2nd approach

    const updatedUserDoc=await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly:true, // this means JS in browser{frontend} can't access it reason behind using cookies than local storage
        secure:true // with this we can only modify the cookies in server will not allow in browser
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:updatedUserDoc,accessToken,refreshToken // we send it here incase we might store in other form like local storage for that tokens liek in mobile apps
            },"User Logged Successfully..."
        ))
})

const logoutUser=asyncHandler(async(req,res)=>{
    // we need to remove the user tokens from cookies
    // also from DB as well of that refreshToken

    const userId=req.user._id

    await User.findByIdAndUpdate(
        userId,
        {
            $set:{
                refreshToken:undefined
            }
        },{
            new:true
        }
    )

    const options={
        httpOnly:true,
        secure:true // with this we can only modify the cookies in server will not allow in browser
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Logged Out"))

})

const refreshAccessToken=asyncHandler(async(req,res)=>{
   try {
    const incomingToken= req.cookies.refreshToken || req.body.refreshToken
    if(!incomingToken){
     throw new ApiError(401,"UnAuthorized Request")
    }
 
    const decodedTokenInfo=await jwt.verify(incomingToken,process.env.REFRESH_TOKEN_SECRET)
 
    // using _id payload we can find the user
    const user=await User.findById(decodedTokenInfo?._id).select("-password -refreshToken")
 
    if(!user){
     throw new ApiError(401,"Invalid Refresh Token")
    }
 
    // Checking If BD refreshTOken value is same as incomingToken
    if(user.refreshToken!==incomingToken){
     throw new ApiError(401,"Refresh Token is Expired or used already")
    }
 
    //Now we Update the refreshToken and accessToken if all set to True
    const {accessToken,newRefreshToken}=await generateAccessAndRefreshTokens(user._id)
 
    const options={
        httpOnly:true,
        secure:true
    }
 
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json(new ApiResponse(200,{accessToken,refreshToken:newRefreshToken},"Access Token Refreshed"))
   } catch (error) {
    throw new ApiError(401,error?.message||"Invalid Refresh Token")
   }
    
})

export  {registerUser,loginUser,logoutUser,refreshAccessToken}