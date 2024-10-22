import mongoose,{Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema=new Schema({
    videoFile:{
        type:String, // Cloudinary URL is Stored here
        required:[true,"Obviously, Video is Required!!"]
    },
    tumbnail:{
        type:String, // Cloudinary URL is Stored here
        required:[true,"Obviously, Video is Required!!"],
    },
    title:{
        type:String, 
        required:true,
    },
    description:{
        type:String, 
        required:true
    },
    duration:{
        type:Number, // Cloudinary duration of the video stored 
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:1
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate)

export const Video=mongoose.model("Video",videoSchema)