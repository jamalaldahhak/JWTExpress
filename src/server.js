import dotenv from "dotenv";

import app from "./app.js";
import { dbConnect } from "../config/db.js";
dotenv.config();
const PORT = Number(process.env.PORT) || 4000;

async function startServer() {
  try {
    if (!process.env.DB_URL) {
      throw new Error("DB_URL is missing in .env");
    }

    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 64) {
      throw new Error("JWT_SECRET must be at least 64 characters");
    }

    await dbConnect();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();