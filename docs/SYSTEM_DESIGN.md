# System Design

WareFlow is designed as an internal logistics platform for an e-commerce company.

## Services

- React console: role-aware operational workspace.
- Spring Boot API: domain orchestration, security, validation, caching, and persistence.
- PostgreSQL: system of record for inventory, orders, deliveries, returns, and alerts.
- Redis: cache for product lists, dashboard metrics, and high-read inventory views.
- Kafka: event backbone for domain events and asynchronous risk detection.

## Main Flows

1. Order is created.
2. Order service validates inventory and deducts available stock.
3. ORDER_CREATED and INVENTORY_UPDATED events are published.
4. Delivery manager assigns an agent and emits DELIVERY_ASSIGNED.
5. Risk Radar evaluates low stock, capacity, route delay, returns, and agent performance.
6. RISK_DETECTED events are persisted as RiskAlert records and surfaced in the dashboard.

## Tradeoffs

- Rule-based risk logic is explainable and interview-friendly. It can later be replaced with ML without changing the alert contract.
- Redis caching targets read-heavy screens first instead of caching every endpoint.
- Kafka is used for event decoupling even though the local project runs as a modular monolith.
