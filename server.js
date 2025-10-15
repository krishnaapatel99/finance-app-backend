import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import dbPool from './config/db.js';
import projectRoute from './src/routes/projectRoute.js';
import dashboardRoute from './src/routes/dashboardRoute.js';
import cors from 'cors';
const app=express();
const PORT=process.env.PORT;

const allowedorigin=process.env.FRONTEND_URL;
app.use(cors({
  origin: allowedorigin, 
  credentials: true
}));

app.use(express.json());


app.get('/',(req,res)=>{
    console.log("Server is running");
    res.json("Server is running")
})

app.use("/api",projectRoute);
app.use("/api",dashboardRoute);


app.listen(PORT,()=>{
    console.log("Server is connected")
})