import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { IncomingMessage, ServerResponse, ClientRequest } from "http";
import { Socket } from "net";

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);

// Serve Dashboard Frontend
app.use(
  "/dashboard",
  express.static(path.join(__dirname, "..", "..", "dashboard")),
);

// Service Registry from Environment Variables
const services: Record<string, string> = {
  products: process.env.PRODUCT_SERVICE_URL || "http://localhost:3001",
  customers: process.env.CUSTOMER_SERVICE_URL || "http://localhost:3002",
  orders: process.env.ORDER_SERVICE_URL || "http://localhost:3003",
  payments: process.env.PAYMENT_SERVICE_URL || "http://localhost:3004",
};

// Setup proxy routes for each microservice
Object.entries(services).forEach(([pathName, target]) => {
  const proxyOptions: Options = {
    target,
    changeOrigin: true,
    pathRewrite: (pathStr: string) => `/${pathName}${pathStr}`,
    on: {
      proxyReq: (proxyReq: ClientRequest, req: IncomingMessage) => {
        console.log(
          `[Gateway] ${req.method} ${req.url} -> ${target}${req.url}`,
        );
      },
      error: (err: Error, req: IncomingMessage, res: ServerResponse | Socket) => {
        console.error(`[Gateway] Error proxying to ${target}:`, err.message);
        
        if ("writeHead" in res) {
          res.writeHead(503, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: "Service Unavailable",
              message: `The ${pathName} service is currently unavailable`,
              service: pathName,
            }),
          );
        } else {
          res.destroy(); // For raw sockets/websockets, close the channel
        }
      },
    },
  };

  app.use(`/${pathName}`, createProxyMiddleware(proxyOptions));
});

// Gateway Home - Service Directory
app.get("/", (_req: Request, res: Response) => {
  res.json({
    service: "API Gateway",
    description: "E-Commerce Microservices API Gateway",
    availableServices: Object.entries(services).map(([name, url]) => ({
      name,
      gatewayUrl: `http://localhost:${PORT}/${name}`,
      directUrl: url,
      swaggerDocs: {
        direct: `${url}/api-docs`,
        viaGateway: `http://localhost:${PORT}/${name}/api-docs`,
      },
    })),
  });
});

// Health Check
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    service: "API Gateway",
    status: "UP",
    port: PORT,
    connectedServices: Object.keys(services),
  });
});

// Start Server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`  API Gateway running on http://localhost:${PORT}`);
    console.log(`${"=".repeat(60)}`);
    console.log(`\n  Connected Microservices:`);
    Object.entries(services).forEach(([name, url]) => {
      console.log(`    - ${name.padEnd(12)} -> ${url}`);
      console.log(`      Swagger: http://localhost:${PORT}/${name}/api-docs`);
    });
    console.log(`\n${"=".repeat(60)}\n`);
  });
}

export default app;
