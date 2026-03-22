import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import paymentRoutes from "./routes/paymentRoutes";

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Configuration
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Payment Service API",
      version: "1.0.0",
      description: "Microservice for managing products in the e-commerce platform",
    },
    servers: [
      {
        url: process.env.APP_URL || "http://localhost:" + PORT,
        description: "Direct Access",
      },
      {
        url: process.env.GATEWAY_URL || "http://localhost:3000",
        description: "Via API Gateway",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Swagger UI Support
app.use("/api-docs", swaggerUi.serveFiles(swaggerDocs), swaggerUi.setup(swaggerDocs));
app.use("/payments/api-docs", swaggerUi.serveFiles(swaggerDocs), swaggerUi.setup(swaggerDocs));

// Routes
app.use("/payments", paymentRoutes);

// Health Check
app.get("/health", (_req, res) => {
  res.json({ service: "Payment Service", status: "UP", port: PORT });
});

// MongoDB Connection & Server Start (skip in test mode)
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => console.log("Payment Service: Connected to MongoDB"))
    .catch((err) => console.error("Payment Service: MongoDB connection error:", err));

  app.listen(PORT, () => {
    console.log("Payment Service running on http://localhost:" + PORT);
    console.log("Swagger Docs: http://localhost:" + PORT + "/api-docs");
  });
}

export default app;
