import mongoose, {Schema}  from "mongoose";
const videoschema=new Schema({
    videofile:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    discription:{
        type:String,
        required:true
    },
    duration:{
        type:Number,//cloudnary URL
        required:true
    },views:{
        type:Number,
        default:0
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})
export const Video = mongoose.model("Video",videoschema)