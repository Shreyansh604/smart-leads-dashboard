import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import leadRoutes from "./routes/lead.routes";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  process.env.CORS_ORIGIN_LOCAL, // local dev
  process.env.CORS_ORIGIN_DEV, // docker
  "https://smart-leads-dashboard-xi-lemon.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

app.get("/", (_, res) => {
  res.json({ message: "Smart Leads API running" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));