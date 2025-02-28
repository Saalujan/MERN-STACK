import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import 'dotenv/config'
import connectDB from "./configs/mongodb.js";
import { clerkWebHooks } from "./controllers/webhooks.js";
import educateRouter from "./routes/educatorRouters.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoute.js";



//initaialize express
const app = express();

// Middleware

app.use(cors());
app.use(clerkMiddleware())



//connect to datbase
await connectDB()
await connectCloudinary()

// Root Route
app.get("/", (req, res) => {
  res.send("🎉 MERN Backend is Running...");
});
app.post('/clerk',express.json(), clerkWebHooks)
app.use('/api/educator',express.json(), educateRouter)
app.use('/api/course',express.json(), courseRouter)

// port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

