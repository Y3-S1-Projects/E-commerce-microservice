import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import productRoutes from "./routes/productRoutes";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Configuration
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Product Service API",
      version: "1.0.0",
      description: "Microservice for managing products in the e-commerce platform",
    },
    servers: [
      {
        url: process.env.APP_URL || `http://localhost:${PORT}`,
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

// Swagger UI — Direct access & via API Gateway
app.use("/api-docs", swaggerUi.serveFiles(swaggerDocs), swaggerUi.setup(swaggerDocs));
app.use("/products/api-docs", swaggerUi.serveFiles(swaggerDocs), swaggerUi.setup(swaggerDocs));

// Routes
app.use("/products", productRoutes);

// Health Check
app.get("/health", (_req, res) => {
  res.json({ service: "Product Service", status: "UP", port: PORT });
});

// MongoDB Connection & Server Start (skip in test mode)
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => console.log("Product Service: Connected to MongoDB"))
    .catch((err) => console.error("Product Service: MongoDB connection error:", err));

  app.listen(PORT, () => {
    console.log(`Product Service running on http://localhost:${PORT}`);
    console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
  });
}

export default app;
