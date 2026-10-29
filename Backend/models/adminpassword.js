import mongoose from "mongoose"
const adminpass=new mongoose.Schema({
    email:{
        type:String,    
        required:true,
        unique:true,
    },  
    password:{
        type:String,
        required:true,
    }
})
const adminpassword=mongoose.model('adminpassword',adminpass)
export default adminpassword