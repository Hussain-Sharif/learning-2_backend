import {Mongoose,Schema} from'mongoose'

const subscriptionSchema=new Schema({
    channel:{
        type:Schema.Types.ObjectId, //user subscribe to...
        ref:"User"
    },
    user:[{
        type:Schema.Types.ObjectId, //user subscribing...
        ref:"User"
    }]
},{
    timestamps:true
})

export const Subscription=new Mongoose.model("Subscription",subscriptionSchema); 