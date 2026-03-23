// ==========================================
// E-Commerce Microservices Dashboard Script
// ==========================================

const GATEWAY_URL = "http://localhost:3000";

const services = [
  { name: "products", port: 3001, label: "Product Service" },
  { name: "customers", port: 3002, label: "Customer Service" },
  { name: "orders", port: 3003, label: "Order Service" },
  { name: "payments", port: 3004, label: "Payment Service" },
];

// ========== Status Checks ==========

async function checkServiceHealth(service) {
  const statusDot = document.getElementById(`status-${service.name}`);
  const statusText = document.getElementById(`statusText-${service.name}`);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`http://localhost:${service.port}/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (response.ok) {
      statusDot.className = "status-dot online";
      statusText.textContent = "Online";
      return true;
    }
  } catch (e) {
    // Service is offline
  }

  statusDot.className = "status-dot offline";
  statusText.textContent = "Offline";
  return false;
}

async function checkGatewayHealth() {
  const gatewayDot = document.querySelector("#gatewayStatus .status-dot");

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${GATEWAY_URL}/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (response.ok) {
      gatewayDot.className = "status-dot online";
      return true;
    }
  } catch (e) {
    // Gateway offline
  }

  gatewayDot.className = "status-dot offline";
  return false;
}

// ========== Data Fetching ==========

async function fetchServiceData(service) {
  const tbody = document.getElementById(`data-${service.name}`);
  const countBadge = document.getElementById(`count-${service.name}`);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${GATEWAY_URL}/${service.name}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error("Failed to fetch");

    const data = await response.json();
    countBadge.textContent = data.length;

    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="empty-msg">No ${service.name} found</td></tr>`;
      return;
    }

    tbody.innerHTML = data
      .map((item) => renderRow(service.name, item))
      .join("");
  } catch (e) {
    countBadge.textContent = "—";
    tbody.innerHTML = `<tr><td colspan="4" class="empty-msg">Service unavailable</td></tr>`;
  }
}

function formatPrice(amount) {
  return Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderRow(serviceName, item) {
  switch (serviceName) {
    case "products":
      return `
        <tr>
          <td title="${item.name}">${item.name}</td>
          <td>${item.category || "—"}</td>
          <td>LKR ${formatPrice(item.price)}</td>
          <td>${item.stock ?? "—"}</td>
        </tr>`;

    case "customers":
      return `
        <tr>
          <td title="${item.name}">${item.name}</td>
          <td title="${item.email}">${item.email}</td>
          <td>${item.phone || "—"}</td>
          <td>${item.address?.city || "—"}</td>
        </tr>`;

    case "orders":
      return `
        <tr>
          <td title="${item._id}">${item._id?.slice(-8) || "—"}</td>
          <td title="${item.customerId}">${item.customerId?.slice(-8) || "—"}</td>
          <td>LKR ${formatPrice(item.totalAmount)}</td>
          <td><span class="badge badge-${item.status}">${item.status}</span></td>
        </tr>`;

    case "payments":
      return `
        <tr>
          <td title="${item._id}">${item._id?.slice(-8) || "—"}</td>
          <td title="${item.orderId}">${item.orderId?.slice(-8) || "—"}</td>
          <td>LKR ${formatPrice(item.amount)}</td>
          <td><span class="badge badge-${item.status}">${item.status}</span></td>
        </tr>`;

    default:
      return "";
  }
}

// ========== Refresh ==========

async function refreshAll() {
  // Animate refresh button
  const btn = document.querySelector(".btn-refresh svg");
  btn.style.transform = "rotate(360deg)";
  setTimeout(() => (btn.style.transform = ""), 400);

  // Check all statuses in parallel
  const healthPromises = services.map((s) => checkServiceHealth(s));
  healthPromises.push(checkGatewayHealth());

  await Promise.all(healthPromises);

  // Fetch data from all services via gateway
  await Promise.all(services.map((s) => fetchServiceData(s)));

  // Update timestamp
  const now = new Date();
  document.getElementById("lastUpdated").textContent =
    `Updated: ${now.toLocaleTimeString()}`;
}

// ========== Init ==========

document.addEventListener("DOMContentLoaded", () => {
  refreshAll();

  // Auto-refresh every 15 seconds
  setInterval(refreshAll, 15000);
});
