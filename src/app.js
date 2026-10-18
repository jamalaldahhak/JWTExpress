import express from "express";
import authRoutes from "../router/authRoute.js";
import postRoutes from "../router/postRoute.js";
const app = express();

// Parse incoming JSON requests
app.use(express.json({ limit: "10kb" }));

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication API is running",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;