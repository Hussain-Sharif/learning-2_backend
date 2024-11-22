import {Mongoose,Schema} from'mongoose'

const subscriptionSchema=new Schema({
    channel:{//user as channel and other users subscribed to this channel{user}  
        type:Schema.Types.ObjectId, //user subscribe to... // List of the users who are subscribed to this channel{user}
        ref:"User"
    },
    subscriber:[{  //user as subscriber and subscribed to channels
        type:Schema.Types.ObjectId, //user subscribing... // Means List of the CHannels
        ref:"User"
    }]
},{
    timestamps:true
})

export const Subscription=new Mongoose.model("Subscription",subscriptionSchema); 