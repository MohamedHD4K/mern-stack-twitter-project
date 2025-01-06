import express from "express";
import dotenv from "dotenv";
import authRouter from "./routers/auth.router.js";
import mongoose from "mongoose";

dotenv.config();
const PORT = process.env.PORT || 3001;
const URL = process.env.URL 
const app = express();

app.use("/api/auth" , authRouter)

app.listen(PORT , () => {
  console.log(`Server is running in http://localhost:${PORT}/api/auth/login`);
});

mongoose.connect(URL).then(()=>{
  console.log("Connected");
})