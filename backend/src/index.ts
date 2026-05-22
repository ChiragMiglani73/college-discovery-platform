import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createTables } from "./db/db";
import routes from "./routes";
import { errorHandler, notFound } from "./middleware/errorHandler";
import authRoutes from "./routes/authRoutes";
import savedRoutes from "./routes/savedRoutes";
import comparisonRoutes from "./routes/comparisonRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

app.use("/api", routes);
app.use("/api/auth", authRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/comparisons", comparisonRoutes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    await createTables();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(` API: http://localhost:${PORT}/api/colleges`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
