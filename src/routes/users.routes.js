import {Router} from 'express'
import  {loginUser, logoutUser, registerUser,refreshAccessToken}  from '../controllers/users.controllers.js'
import { upload } from '../middlewares/multer.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const userRouter=Router()

userRouter.route("/register").post(upload.fields([{ // here it's like a middleware
    name:"avatar",
    maxCount:1
},{
    name:"coverImage",
    maxCount:1
}]), registerUser) 

userRouter.route("/login").post(loginUser)


//Secured Routes
userRouter.route("/logout").post(verifyJWT,logoutUser)
userRouter.route("/refresh-token").post(refreshAccessToken)

export default userRouter