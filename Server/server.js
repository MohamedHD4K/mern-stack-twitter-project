// Packages
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary"
import cors from "cors"

// Routers
import authRouter from "./routers/auth.router.js";
import userRouter from "./routers/user.router.js";
import postRouter from "./routers/post.router.js";
import notificationRouter from "./routers/notification.router.js";

// DB
import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json({limit:"5mb"})); // DoS Attack
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors())

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/notification", notificationRouter);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
  connectMongoDB();
});
