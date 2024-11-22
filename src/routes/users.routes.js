import {Router} from 'express'
import  {loginUser, logoutUser, registerUser,refreshAccessToken,getCurrentUser,userUpdateDetails,currentUserChangePassword,userAvatarUpdate,userCoverImageUpdate}  from '../controllers/users.controllers.js'
import { upload } from '../middlewares/multer.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import multer from 'multer'

const userRouter=Router()

userRouter.route("/register").post(upload.fields([{ // here it's like a middleware
    name:"avatar",
    maxCount:1
},{
    name:"coverImage",
    maxCount:1
}]), registerUser) 

userRouter.route("/login").post(loginUser)
userRouter.route("/change-password").patch(verifyJWT,currentUserChangePassword);
userRouter.route("/update-user").patch(verifyJWT,userUpdateDetails);
userRouter.route("/get-current-user").get(verifyJWT,getCurrentUser);
userRouter.route("/user-avatar-update").patch(upload.single("avatar"),verifyJWT,userAvatarUpdate)
userRouter.route("/user-cover-image-update").patch(upload.single("coverImage"),verifyJWT,userCoverImageUpdate)



//Secured Routes
userRouter.route("/logout").post(verifyJWT,logoutUser)
userRouter.route("/refresh-token").post(refreshAccessToken) // this endpoint is hitted when the access token expires using the refresh token stored in cookie's of frontend and we call this endpoint to get a new access token

export default userRouter