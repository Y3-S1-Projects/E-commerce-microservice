# E-Commerce Microservices Architecture

## IT4020 - Modern Topics in IT - Assignment 2

A complete backend microservices architecture for an e-commerce platform. Rewritten in **TypeScript**, featuring separated **Route/Controller** architecture, centralized proxy targeting, **CORS security rules**, and high-res automated **GitHub CI Workflows**.

---

## 🏗️ Architecture Layout

```text
Client → API Gateway (Port 3000)
              ├── /products    → Product Service  (Port 3001)
              ├── /customers   → Customer Service (Port 3002)
              ├── /orders      → Order Service    (Port 3003)
              ├── /payments    → Payment Service  (Port 3004)
              └── /dashboard   → Live Status Panel (Static Dashboard)
```

## 🛠️ Microservices Directory

| # | Service | Port | Database | Description |
|---|---------|------|----------|-------------|
| 1 | Product Service | 3001 | MongoDB Atlas | Catalog, Inventory management (CRUD) |
| 2 | Customer Service | 3002 | MongoDB Atlas | Customer registration & profiles (CRUD) |
| 3 | Order Service | 3003 | MongoDB Atlas | Cart checkouts & Status tracking (CRUD) |
| 4 | Payment Service | 3004 | MongoDB Atlas | Gateway transaction flow audits (CRUD) |
| - | API Gateway | 3000 | - | Proxy request delegator, Static Dashboard host |

---

## ⚙️ Environment Variables (`.env`)

Each service requires a `.env` file in its root directory. 

### Microservice `.env` Example:
```env
PORT=3001
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/database
GATEWAY_URL=http://localhost:3000
APP_URL=http://localhost:3001
```

### API Gateway `.env` Example:
```env
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5500
PRODUCT_SERVICE_URL=http://localhost:3001
CUSTOMER_SERVICE_URL=http://localhost:3002
ORDER_SERVICE_URL=http://localhost:3003
PAYMENT_SERVICE_URL=http://localhost:3004
```

---

## 🚀 How to Run

### **Run Everything Immediately (Windows)**
The root directory includes batch startup helpers:

- **Start All Services**: Double-click `start-all.bat`
- **Stop All Services**: Double-click `stop-all.bat`

---

## 📊 Live Dashboard & Docs

### 🖼️ Frontend Panel
Once started, the dashboard is served automatically by the Gateway:
👉 **[http://localhost:3000/dashboard/index.html](http://localhost:3000/dashboard/index.html)**

### 📖 Swagger API Documentation
Run and audit with isolated sandbox clients:

| Service | Direct Access (Native) | Routed via Gateway |
|---------|-----------------------|--------------------|
| **Products** | [http://localhost:3001/api-docs](http://localhost:3001/api-docs) | [http://localhost:3000/products/api-docs](http://localhost:3000/products/api-docs) |
| **Customers** | [http://localhost:3002/api-docs](http://localhost:3002/api-docs) | [http://localhost:3000/customers/api-docs](http://localhost:3000/customers/api-docs) |
| **Orders** | [http://localhost:3003/api-docs](http://localhost:3003/api-docs) | [http://localhost:3000/orders/api-docs](http://localhost:3000/orders/api-docs) |
| **Payments** | [http://localhost:3004/api-docs](http://localhost:3004/api-docs) | [http://localhost:3000/payments/api-docs](http://localhost:3000/payments/api-docs) |

---

## 🛡️ CI/CD & Code Standards

-   **Manual Linters**: Execute `npm run lint` in any of the service folders to trigger automated **ESLint fixing routines**.
-   **GitHub Actions CI**: Automated node-building triggers exist on `.github/workflows/` path flags which strictly enforces build test checkpoints for merging PR pipelines perfectly.
