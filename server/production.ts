import express from "express";
import { registerRoutes } from "./routes";
import cors from "cors";

const app = express();
const port = Number(process.env.PORT) || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
registerRoutes(app).then((httpServer) => {
  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Backend server running on port ${port}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost"}`);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});