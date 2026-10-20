import express from  'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';    
import Routes from './router.js'

const app=express();
dotenv.config();    
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());    
app.use(express.json());
mongoose.connect(process.env.app_MONGO_URI)
 .then(() => console.log("Database connected"))
  .catch((e) => console.log(e));
app.use('/api',Routes)
app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`);
});