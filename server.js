import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import dbPool from './config/db.js';
import projectRoute from './src/routes/projectRoute.js';
import dashboardRoute from './src/routes/dashboardRoute.js';
import documentRoute from './src/routes/documentRoute.js'
import financeRoutes from './src/routes/financeRoute.js';
import cors from 'cors';
const app=express();
const PORT=process.env.PORT;

const allowedorigin=process.env.FRONTEND_URL;
app.use(cors({
  origin: allowedorigin, 
  credentials: true,
}));

app.use(express.json());


app.get('/',(req,res)=>{
    console.log("Server is running");
    res.json("Server is running")
})
app.get("/ping", async (req, res) => {
  try {
    const result = await dbPool.query("SELECT NOW()");
    res.json({ db_status: "Connected", time: result.rows[0].now });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database not reachable" });
  }
});

app.use("/api",projectRoute);
app.use("/api",dashboardRoute);
app.use("/api/documents", documentRoute);
app.use("/api/finance", financeRoutes);


app.listen(PORT || 3000,()=>{
    console.log("Server is connected")
})