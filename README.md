# 🚀 Multi-Tenant Feature Flag Engine

A high-performance, lightweight feature toggle and AOP execution engine built with **Java 17+** and **Spring Boot 3**. 

This project provides zero-downtime, annotation-driven feature gating across application services without hardcoding conditional toggles directly into domain business logic.

---

## 📐 Architecture & Execution Flow

```
 [ Incoming Web Request ]
           │
           ▼
   [ REST Controller ]
           │
           ▼
  [ @Service Method decorated with @RequireFeature("KEY") ]
           │
           ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                    FeatureFlagAspect (AOP)                  │
 │                                                             │
 │  1. Intercepts method before execution                      │
 │  2. Evaluates flag via Strategy List (Spring IoC)           │
 │  3. Queries Spring Cache (@Cacheable)                       │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
        [ Feature Enabled ]           [ Feature Disabled ]
                 │                             │
                 ▼                             ▼
        Executes Target Method        Throws FeatureDisabledException
                 │                             │
                 ▼                             ▼
         Returns Result               Handled by @RestControllerAdvice
                                      Returns 403 Forbidden Response
```

---

## 🛠️ Key Spring Concepts Implemented

* **Aspect-Oriented Programming (AOP):** Intercepts execution flows dynamically using `@Aspect` and `@Around` advice without polluting core business services.
* **Custom Annotations:** Uses runtime retention reflection (`@Target(ElementType.METHOD)`) to bind metadata directly to target execution points.
* **Strategy Pattern & Auto-Collection Injection:** Dynamically discovers and injects all `FeatureEvaluator` beans into `List<FeatureEvaluator>` using Spring Dependency Injection.
* **Declarative In-Memory Caching:** Integrated `@EnableCaching` and `@Cacheable` to optimize evaluation lookups and eliminate redundant computations.
* **Centralized Exception Handling:** Intercepts application exceptions using `@RestControllerAdvice` and transforms them into standard HTTP status codes (`403 Forbidden`).

---

## ⚙️ Project Setup & Run Guide

### Prerequisites
* **JDK 17** or higher
* **Maven 3.8+** / **Gradle**

### Build & Run
```bash
# Clone the repository
git clone [https://github.com/AksharaPandey/Multitenant_Feature_Flag_Engine.git](https://github.com/AksharaPandey/Multitenant_Feature_Flag_Engine.git)

# Build project
mvn clean install

# Run Application
mvn spring-boot:run
```

---

## 🧪 API Endpoints

| Method | Endpoint | Feature Flag | Expected Status | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/pay` | `NEW_PAYMENT_GATEWAY` (Active) | `200 OK` | `"Success! Payment processed via new payment gateway."` |
| `GET` | `/api/recommendations` | `BETA_RECOMMENDATIONS` (Inactive) | `403 Forbidden` | `{"error": "Access Denied: Feature 'BETA_RECOMMENDATIONS' is currently disabled."}` |

---

