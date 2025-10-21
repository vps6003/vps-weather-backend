import express from "express";
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { connect } from "mongoose";


dotenv.config();

const app = express();
const port = process.env.PORT || 3100;

app.use(cors());
app.use(express.json());

app.get("/", (req,res) =>{
    res.send("Server Running");
});

const connectDb = async () =>{
    try{
        const mongooseUrl = process.env.MONGO_URL;
        if(!mongooseUrl){
            throw new Error("NO DB URL Found!");
            return;
        }
        await mongoose.connect(mongooseUrl , {
            dbName: process.env.DB_NAME, 
        })
        console.log("MongoDB Connected = ", process.env.DB_NAME);
        try{
            
            app.listen(port,(req,res) =>{
                console.log("Server Running on PORT = ",port);
            })
        }
        catch(err){
            throw new Error("Server Connection Error = ",err);
        }
    }
    catch(err){
        throw new Error("DB Connection Error = " , err);    
    }
};

connectDb();

