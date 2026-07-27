# 🚩 Multi-Tenant Feature Flag & Gating Engine

A low-latency, real-time feature gating and configuration platform built with **Spring Boot (AOP)** and an industrial hardware-inspired **React (Vite)** admin panel.

Engineered for decoupled feature evaluation, runtime flag mutation, and sub-millisecond in-memory cache resolution — without requiring service restarts.

---

## 🏗️ Architecture & System Flow


- **Aspect-Oriented Programming (AOP):** Intercepts client traffic mid-flight before controller execution to enforce feature access rules without polluting business logic.
- **Dynamic Cache Eviction:** Evicts and updates in-memory flag states instantaneously upon admin mutation to eliminate database latency on high-frequency API endpoints.
- **Tactile Hardware Dashboard:** High-contrast control panel featuring glowing status LEDs, physical toggle switches, and an integrated real-time AOP readout terminal.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Java 17+, Spring Boot, Spring AOP, Spring Web |
| **Frontend** | React 18, Vite, JavaScript (ES6+), Embedded Monospace & Oswald Typography |
| **DevOps / Tooling** | Maven, npm, ESLint |

---




## 🚀 Getting Started

### 1. Prerequisites

- Java 17 or higher
- Node.js (v18+) and npm

### 2. Backend Setup (Spring Boot)

Navigate to the backend root directory:

```bash
cd MultiTenantFeatureFlagEngine
```

Launch the Spring Boot application using the Maven wrapper:

```bash
./mvnw spring-boot:run
```

The backend will boot up at `http://localhost:8080`.

### 3. Frontend Setup (React Control Panel)

Open a secondary terminal tab and navigate into the frontend folder:

```bash
cd frontend
```

Install the necessary node modules and start the Vite dev server:

```bash
npm install
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or `http://localhost:5174`).

---

## 🔌 API Reference

### Admin Flag Management

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/flags` | Fetches all registered feature flags and their active states. |
| `POST` | `/api/admin/flags/toggle` | Toggles a feature flag (`?featureKey={key}&isEnabled={boolean}`). |

### Client Endpoints (AOP Gated)

| Method | Endpoint | Target Feature Flag | Expected Behavior |
|---|---|---|---|
| `GET` | `/api/pay` | `NEW_PAYMENT_GATEWAY` | Returns `200 OK` when enabled, `403 Forbidden` when disabled. |
| `GET` | `/api/recommendations` | `BETA_RECOMMENDATIONS` | Returns `200 OK` when enabled, `403 Forbidden` when disabled. |

---

## 🧪 Testing the Live AOP Aspect

1. Launch both the Spring Boot server and the React frontend.
2. In the **01 ADMIN TOGGLES** section of the dashboard, flip `BETA_RECOMMENDATIONS` to **OFF**.
3. In the **02 LIVE CLIENT SANDBOX** panel, click the `/api/recommendations` button.
4. Observe the readout monitor — the AOP aspect intercepts the request instantly and outputs an HTTP `403` blocked status.
5. Toggle the switch back to **ON** and re-test to verify real-time cache eviction without needing a server reboot.


