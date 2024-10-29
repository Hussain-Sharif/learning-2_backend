import {Router} from 'express'
import  {registerUser}  from '../controllers/users.controllers.js'
import { upload } from '../middlewares/multer.js'

const userRouter=Router()

userRouter.route("/register").post(upload.fields([{ // here it's like a middleware
    name:"avatar",
    maxCount:1
},{
    name:"coverImage",
    maxCount:1
}]), registerUser)


export default userRouter