import express from "express";
import dotenv from "dotenv";
import authRouter from "./routers/auth.router.js";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
  connectMongoDB();
});
