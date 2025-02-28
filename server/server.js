import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import 'dotenv/config'
import connectDB from "./configs/mongodb.js";
import { clerkWebHooks } from "./controllers/webhooks.js";



//initaialize express
const app = express();

// Middleware

app.use(cors());


//connect to datbase
await connectDB()

// Root Route
app.get("/", (req, res) => {
  res.send("🎉 MERN Backend is Running...");
});
app.post('/clerk',express.json(), clerkWebHooks)

// port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

