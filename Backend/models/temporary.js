import mongoose from "mongoose";
const tempuserschema=new mongoose.Schema({
    Firstname:{
        type:String,
        required:true

    },
    Lastname:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    
    },
   

    password:{
        type:String,
        required:true
    },
    
})
const tempUser=mongoose.model('tempUser',tempuserschema)
export default tempUser