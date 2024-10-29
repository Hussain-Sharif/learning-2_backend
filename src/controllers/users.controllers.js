import asyncHandler from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { emailValidator,passwordValidator } from "../utils/validation.js"
import {User} from '../models/user.model.js'
import uploadOnCloudinary from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'


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
        [username, fullname,email,password].some((each)=>{each?.trim()===""})
    ){
        throw new ApiError(400,"All Fields are required")
    }
    emailValidator(email)
    passwordValidator(password)
    const existedUser=User.findOne({
        $or: [{email},{username}]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username is already existed")
    }

    // as we added middleware in respective route.js then this will add the additional field's in request!!
    // So, becoz of multer we can now handle the file stored over on some path....
    // here avatar is written bcoz, we mentioned that in mutler.js as a field while configurating
    const avatarLocalPath=req.files?.avatar[0]?.path 
    const coverImageLocalPath=req.files?.coverImage[0]?.path


    //<<<<<<--->>>> we check if avatar is given are not 
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    //<<<<<<--->>>> Now we upload it on cloudinary
    const avatarUploaded=await uploadOnCloudinary(avatarLocalPath)
    const coverImageUploaded=await uploadOnCloudinary(coverImageLocalPath)

    if(!avatarUploaded){
        throw new ApiError(400, "Avatar file is required")
    }

    //<<<<<<<--->>>>>>>> Now let's create a DB for user entry
    const user=await User.create({
        fullname,
        avatar:avatarUploaded.url,
        coverImage:coverImage?.url||"",
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



export  {registerUser}