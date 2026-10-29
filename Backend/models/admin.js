import mongoose from "mongoose";
const adminOTPschema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    Otp:{
        type:String,
        required:true
    },createdAt:{
        type:Date,
        default:Date.now,
        expires:600
    }
    
})
const adminotp=mongoose.model('adminotp',adminOTPschema)
export default adminotp
