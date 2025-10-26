import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// ✅ Use ES Module import for routes (require → import)
import weatherRoutes from "./src/routes/weather.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3100;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/weather", weatherRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🌤️ Weather Server Running Successfully!");
});

// MongoDB Connection
const connectDb = async () => {
  try {
    const mongooseUrl = process.env.MONGO_URL;
    if (!mongooseUrl) {
      throw new Error("❌ No MongoDB URL found in .env!");
    }

    await mongoose.connect(mongooseUrl, {
      dbName: process.env.DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected:", process.env.DB_NAME);

    // Start server after DB connection
    app.listen(port, () => {
      console.log(`🚀 Server Running on PORT ${port}`);
    });
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
  }
};

connectDb();
