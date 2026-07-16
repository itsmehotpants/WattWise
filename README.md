# 🏡 Home Energy Tracker Microservices Ecosystem

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4%2B%20%2F%204.0%2B-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java 21](https://img.shields.io/badge/Java-21-blue.svg)](https://openjdk.org/projects/jdk/21/)
[![Testcontainers](https://img.shields.io/badge/Testcontainers-Enabled-orange.svg)](https://testcontainers.com/)
[![Ollama & Spring AI](https://img.shields.io/badge/Spring%20AI-Ollama-purple.svg)](https://docs.spring.io/spring-ai/reference/api/chat/ollama-chat.html)
[![License](https://img.shields.io/badge/License-Apache%202.0-yellow.svg)](https://opensource.org/licenses/Apache-2.0)

An enterprise-grade, distributed IoT energy tracking and AI recommendations platform built with **Spring Boot 4 / Java 21**, featuring automated local simulations, time-series metrics processing, local AI energy optimization insights via Ollama, comprehensive observability (Actuator + Prometheus + Grafana), unified OpenAPI (Swagger UI) documentation, OAuth2/OIDC Keycloak security, and full integration testing with **Testcontainers**.

---

## 🏗 System Architecture & Services Overview

![Full Microservices Flow Diagram](diagrams/full-microservices-flow-diagram-with-components.png)
![Background and Requirements](diagrams/background-and-requirements.png)

```mermaid
graph TD
    User["👥 Client / Postman"] -->|OAuth2 / Bearer Token| GW["🌐 API Gateway (:8080)"]
    GW -->|/api/v1/user| US["👤 User Service (:8086)"]
    GW -->|/api/v1/device| DS["🔌 Device Service (:8081)"]
    GW -->|/api/v1/ingestion| IS["⚡ Ingestion Service (:8082)"]
    GW -->|/api/v1/usage| UGS["📈 Usage Service (:8083)"]
    GW -->|/api/v1/alert| AS["🚨 Alert Service (:8084)"]
    GW -->|/api/v1/insight| INS["🤖 Insight Service (:8085)"]

    IS -->|Publish EnergyUsageEvent| KAFKA[["🔥 Apache Kafka (:9092)"]]
    KAFKA -->|Consume & Aggregate| UGS
    KAFKA -->|Consume & Threshold Check| AS

    UGS -->|Store Time-Series Points| INFLUX[("📊 InfluxDB (:8086)")]
    US -->|JPA / Flyway| MYSQL[("🐬 MySQL Database (:3306)")]
    DS -->|JPA| MYSQL
    AS -->|JPA| MYSQL

    INS -->|REST Client Query| UGS
    INS -->|Local LLM Prompting| OLLAMA[["🧠 Ollama Local AI (:11434)"]]

    PROM[["📈 Prometheus (:9090)"]] -->|Scrape /actuator/prometheus| US & DS & IS & UGS & INS & AS & GW
    GRAF[["📊 Grafana (:3000)"]] -->|Datasource| PROM
    KEYCLOAK[["🔐 Keycloak (:8091)"]] -->|OIDC / JWK Keys| GW
```

### Microservice Ecosystem
| Service | Port | Description | Technology & Datastore |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `8080` | Spring Cloud Gateway MVC entry point, OAuth2 JWT resource server, unified Swagger UI Docs aggregator. | Spring Cloud Gateway MVC |
| **Device Service** | `8081` | IoT device inventory management (`HVAC`, `LIGHTING`, `APPLIANCE`, `SOLAR`) linked to users. | Spring Data JPA, MySQL |
| **Ingestion Service** | `8082` | High-throughput telemetry ingestion with continuous and multi-threaded parallel simulation engines. | Kafka Producer (`energy-usage-events`) |
| **Usage Service** | `8083` | Real-time Kafka consumer, time-series persistence, multi-day aggregation, threshold breach detection. | Kafka Consumer, InfluxDB |
| **Alert Service** | `8084` | Alert violation processing (`alert-events` consumer), DB persistence, and Mailpit email dispatching. | Kafka Consumer, MySQL, JavaMailSender |
| **Insight Service** | `8085` | AI savings recommendation engine integrating local Ollama (`llama3` / `mistral`) via Spring AI. | Spring AI, Ollama |
| **User Service** | `8086` | User lifecycle management, alert configuration (`alerting=true`, `energyAlertingThreshold=15.0`), Flyway schema migrations. | Spring Data JPA, MySQL |

---

## 🚀 Step-by-Step Setup & Running Guide

Follow these exact steps to launch the entire multi-module ecosystem, spin up containerized infrastructure, run automated Testcontainers verification, and interactively test live microservices:

### Step 1: System Prerequisites Check
Ensure your local environment meets the following requirements before starting:
- **Java 21 JDK** (`java -version` should show `21.x`)
- **Maven 3.9+** (or use the included `./mvnw` / `.\mvnw.cmd` wrapper)
- **Docker & Docker Desktop** running locally with at least **6GB RAM** allocated (required for MySQL, KRaft Kafka, InfluxDB, Keycloak, Mailpit, and Prometheus containers).

---

### Step 2: Spin Up Infrastructure Containers (Docker Compose)
From the root workspace directory, start all background dependencies and data stores:
```bash
docker-compose up -d
```

Verify that all 8 infrastructure containers are `Up` and `healthy`:
```bash
docker ps
```
| Container Name | Port(s) | Role & Description |
| :--- | :--- | :--- |
| `mysql` (`keycloak-mysql` & `mysql`) | `3306` | Relational persistence for `user-service`, `device-service`, and `alert-service` (auto-initialized via `init.sql`). |
| `kafka` | `9092, 9094` | KRaft-based event broker for real-time telemetry streaming (`energy-usage-events`, `alert-events`). |
| `kafka-ui` | `8070` | Web UI for inspecting Kafka topics, consumer groups, and message payloads ([http://localhost:8070](http://localhost:8070)). |
| `influxdb` | `8086` | Time-series database for high-frequency usage metrics ingested by `usage-service`. |
| `keycloak` | `8091` | OAuth2 / OIDC authentication server pre-configured with `het-security-realm` ([http://localhost:8091](http://localhost:8091)). |
| `mailpit` | `8025 / 1025` | Local SMTP capture server & UI for simulated email alert dispatches ([http://localhost:8025](http://localhost:8025)). |
| `prometheus` | `9090` | Time-series scraper collecting `/actuator/prometheus` metrics ([http://localhost:9090](http://localhost:9090)). |
| `grafana` | `3000` | Observability dashboards connected to Prometheus (`admin` / `admin` at [http://localhost:3000](http://localhost:3000)). |

---

### Step 3: Verify & Build the Ecosystem (With Testcontainers)
Before running locally, verify all 8 reactor modules (including real Dockerized Testcontainers suites for MySQL, Kafka, and Ollama AI) across the multi-module `home-energy-tracker-parent`:

```bash
# On Windows PowerShell
.\mvnw.cmd clean verify -DskipTests=false

# On Linux/macOS
./mvnw clean verify -DskipTests=false
```
When `BUILD SUCCESS` appears across all 8 modules, compiled Spring Boot runnable `.jar` files are placed inside each `target/` directory.

---

### Step 4: Start All Microservices
You can start the microservices locally using either `mvn spring-boot:run` in separate terminal windows, or by running the generated `.jar` files. Start `api-gateway` along with the core services you wish to run:

#### Option A: Running via Maven Plugin (`spring-boot:run`)
Open separate terminal tabs from the project root:
```bash
# Terminal 1: API Gateway (Port 8080)
.\mvnw.cmd spring-boot:run -pl :api-gateway

# Terminal 2: User Service (Port 8086)
.\mvnw.cmd spring-boot:run -pl :user-service

# Terminal 3: Device Service (Port 8081)
.\mvnw.cmd spring-boot:run -pl :device-service

# Terminal 4: Ingestion Service (Port 8082)
.\mvnw.cmd spring-boot:run -pl :ingestion-service

# Terminal 5: Usage Service (Port 8083)
.\mvnw.cmd spring-boot:run -pl :usage-service

# Terminal 6: Alert Service (Port 8084)
.\mvnw.cmd spring-boot:run -pl :alert-service

# Terminal 7: Insight Service (Port 8085)
.\mvnw.cmd spring-boot:run -pl :insight-service
```

#### Option B: Running Compiled JARs (`java -jar`)
```bash
java -jar api-gateway/api-gateway/target/api-gateway-0.0.1-SNAPSHOT.jar
java -jar user-service/target/user-service-0.0.1-SNAPSHOT.jar
java -jar device-service/target/device-service-0.0.1-SNAPSHOT.jar
```

---

### Step 5: Interactive API Testing & Token Authentication

![API Gateway & Public Network](diagrams/diagram-showing-gateway-in-public-network.png)
![Circuit Breaker in API Gateway](diagrams/circuit-breaker-in-api-gateway.png)

#### 1. Why `http://localhost:8080/` Returns `401 Unauthorized`
The API Gateway uses **Keycloak OAuth2 Resource Server Security**. If you visit the root URL (`http://localhost:8080/`) directly in your browser without a `Bearer <token>` Authorization header, Keycloak rejects the request.

#### 2. Accessing Public & Interactive Swagger Docs
In `application.properties`, we explicitly excluded Swagger UI and Actuator endpoints from OAuth2 requirements so you can test endpoints interactively in your browser:
- 👉 **Unified API Gateway Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)  
  *(Select User, Device, Ingestion, Usage, Alert, or Insight Service directly from the top dropdown)*
- 👉 **API Gateway Actuator Health**: [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)

#### 3. Generating a Keycloak JWT Access Token (`cURL` / `Postman`)
To invoke protected API routes (e.g., `POST /api/v1/user`), generate an `access_token` from Keycloak (`het-security-realm`):
```bash
curl -X POST "http://localhost:8091/realms/het-security-realm/protocol/openid-connect/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "client_id=het-gateway-client" \
     -d "client_secret=het-gateway-secret" \
     -d "username=admin" \
     -d "password=admin" \
     -d "grant_type=password" \
     -d "scope=openid profile email"
```
Copy the `access_token` string from the JSON response and attach it to your API requests via the header:  
`Authorization: Bearer <access_token>`

---

### Step 6: Observability & Monitoring Dashboards

![Observability with Prometheus and Grafana](diagrams/observability-with-prometheus-and-grafana.png)

The ecosystem is fully instrumented with Spring Boot Actuator, Micrometer Prometheus registries, and Grafana visualization dashboards:
- **Prometheus Scrape Targets**: [http://localhost:9090/targets](http://localhost:9090/targets) (automatically scrapes `/actuator/prometheus` across every microservice port `8080-8086`).
- **Grafana Dashboard**: [http://localhost:3000](http://localhost:3000) (`admin` / `admin`). Pre-provisioned datasource automatically connects to Prometheus.
- **Mailpit Email UI**: [http://localhost:8025](http://localhost:8025) (inspect simulated email notifications dispatched by `alert-service`).

---

## 🧪 Comprehensive Testcontainers Integration Suite

Every microservice includes dedicated Testcontainers integration tests that spin up real Docker containers (`mysql:8.0`, `confluentinc/cp-kafka:7.6.0`, `ollama/ollama:latest`) to verify full data persistence, event streaming, and AI endpoint connectivity:

- `UserRepositoryTestcontainersTest` (`user-service`): Verifies MySQL container JPA persistence and custom finders (`findByEmail`).
- `DeviceRepositoryTestcontainersTest` (`device-service`): Verifies relationship mappings and device type filtering (`findAllByUserId`).
- `IngestionServiceKafkaTestcontainersTest` (`ingestion-service`): Verifies real-time producer connectivity against a containerized Kafka broker.
- `UsageServiceKafkaTestcontainersTest` (`usage-service`): Verifies consumer bootstrap configurations and dynamic property overrides.
- `AlertRepositoryTestcontainersTest` (`alert-service`): Verifies threshold violation audit trail storage inside containerized MySQL.
- `InsightServiceOllamaTestcontainersTest` (`insight-service`): Verifies local LLM container runtime health and Spring AI dynamic base-url injection.

