import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import db from "./models/index.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// CORS Config
const allowedOrigins = [
  "https://sembako-frontend-981814770172.asia-southeast2.run.app",
  // Tambah domain frontend production jika perlu
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Sync database & start server
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("Database connected and synced");
    app.listen(port, () => {
      console.log(`Server berjalan di port ${port}`);
    });

  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });