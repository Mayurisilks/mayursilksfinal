import mongoose from "mongoose";
const OTPschema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    Otp:{
        type:Number,
        required:true
    },createdAt:{
        type:Date,
        default:Date.now,
        expires:600
    }
    
})
const OTP=mongoose.model('OTP',OTPschema)
export default OTP