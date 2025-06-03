import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Import routes dan models
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
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

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Start server and sync DB
db.sequelize.sync({ alter: true }).then(() => {
  console.log("Database connected and synced");
  app.listen(PORT, () =>
    console.log(`Server berjalan di http://localhost:${PORT}`)
  );
}).catch(err => {
  console.error("Database connection failed:", err);
});